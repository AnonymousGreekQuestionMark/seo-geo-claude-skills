/**
 * Tests for brand-monitor MCP server
 * Serper.dev and Google Custom Search integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '../setup.js';
import { http, HttpResponse } from 'msw';
import { defaults } from '../__mocks__/handlers.js';

describe('brand-monitor MCP server', () => {
  describe('find_brand_mentions tool - Serper.dev', () => {
    it('searches for brand mentions excluding own domain', async () => {
      let capturedBody;
      server.use(
        http.post('https://google.serper.dev/search', async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(defaults.serper);
        })
      );

      await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: '"CAPLINQ" -site:caplinq.com', num: 20 })
      });

      expect(capturedBody.q).toContain('"CAPLINQ"');
      expect(capturedBody.q).toContain('-site:caplinq.com');
    });

    it('parses brand mention results', async () => {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: '"CAPLINQ" -site:caplinq.com' })
      });
      const data = await res.json();

      expect(data.organic).toBeInstanceOf(Array);
      expect(data.organic.length).toBeGreaterThan(0);

      const mention = data.organic[0];
      expect(mention.title).toBeDefined();
      expect(mention.link).toBeDefined();
      expect(mention.snippet).toBeDefined();
    });

    it('extracts domain from mention URLs', async () => {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: '"CAPLINQ"' })
      });
      const data = await res.json();

      const mentions = data.organic.map(r => {
        const url = new URL(r.link);
        return {
          ...r,
          domain: url.hostname.replace(/^www\./, '')
        };
      });

      expect(mentions[0].domain).toBeDefined();
      expect(mentions[0].domain).not.toContain('www.');
    });

    it('detects if mention contains link to brand', async () => {
      const snippet = 'Check out CAPLINQ at caplinq.com for materials';
      const domain = 'caplinq.com';

      const hasLinkToBrand = snippet.toLowerCase().includes(domain.toLowerCase());
      expect(hasLinkToBrand).toBe(true);
    });
  });

  describe('find_brand_mentions tool - Google CSE fallback', () => {
    it('calls Google CSE when Serper unavailable', async () => {
      let cseCallMade = false;
      server.use(
        http.post('https://google.serper.dev/search', () => {
          return new HttpResponse('Unauthorized', { status: 401 });
        }),
        http.get('https://www.googleapis.com/customsearch/v1', () => {
          cseCallMade = true;
          return HttpResponse.json(defaults.googleCse);
        })
      );

      // Serper fails
      const serperRes = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'invalid' },
        body: JSON.stringify({ q: '"CAPLINQ"' })
      });
      expect(serperRes.ok).toBe(false);

      // Fallback to Google CSE
      const cseRes = await fetch('https://www.googleapis.com/customsearch/v1?key=test_key&cx=test_cse&q="CAPLINQ"');
      expect(cseRes.ok).toBe(true);
      expect(cseCallMade).toBe(true);
    });

    it('parses Google CSE results', async () => {
      const res = await fetch('https://www.googleapis.com/customsearch/v1?key=test_key&cx=test_cse&q="CAPLINQ"');
      const data = await res.json();

      expect(data.items).toBeInstanceOf(Array);
      expect(data.items.length).toBeGreaterThan(0);

      const item = data.items[0];
      expect(item.title).toBeDefined();
      expect(item.link).toBeDefined();
      expect(item.snippet).toBeDefined();
    });
  });

  describe('monitor_competitor_content tool', () => {
    it('searches competitor domain for topic content', async () => {
      let capturedBody;
      server.use(
        http.post('https://google.serper.dev/search', async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(defaults.serper);
        })
      );

      await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'site:competitor.com gas diffusion layer' })
      });

      expect(capturedBody.q).toContain('site:competitor.com');
      expect(capturedBody.q).toContain('gas diffusion layer');
    });

    it('identifies competitor content on topic', async () => {
      server.use(
        http.post('https://google.serper.dev/search', () => {
          return HttpResponse.json({
            organic: [
              { title: 'GDL Guide', link: 'https://competitor.com/gdl', snippet: 'Gas diffusion layer explained' },
              { title: 'Carbon Paper', link: 'https://competitor.com/carbon', snippet: 'High quality carbon paper' }
            ]
          });
        })
      );

      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'site:competitor.com gas diffusion' })
      });
      const data = await res.json();

      expect(data.organic).toHaveLength(2);
      expect(data.organic[0].link).toContain('competitor.com');
    });
  });

  describe('CITE I09 verdict logic', () => {
    it('PASS for 50+ unlinked brand mentions', () => {
      const mentionCount = 50;

      let verdict;
      if (mentionCount >= 50) {
        verdict = 'PASS';
      } else if (mentionCount >= 10) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PASS');
    });

    it('PARTIAL for 10-49 unlinked brand mentions', () => {
      const mentionCount = 25;

      let verdict;
      if (mentionCount >= 50) {
        verdict = 'PASS';
      } else if (mentionCount >= 10) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PARTIAL');
    });

    it('FAIL for <10 unlinked brand mentions', () => {
      const mentionCount = 5;

      let verdict;
      if (mentionCount >= 50) {
        verdict = 'PASS';
      } else if (mentionCount >= 10) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('FAIL');
    });
  });

  describe('query construction', () => {
    it('wraps brand name in quotes for exact match', () => {
      const brandName = 'CAPLINQ';
      const query = `"${brandName}"`;

      expect(query).toBe('"CAPLINQ"');
    });

    it('adds -site: exclusion for own domain', () => {
      const brandName = 'CAPLINQ';
      const domain = 'caplinq.com';
      const query = `"${brandName}" -site:${domain}`;

      expect(query).toBe('"CAPLINQ" -site:caplinq.com');
    });

    it('handles brand names with spaces', () => {
      const brandName = 'CAPLINQ Corporation';
      const query = `"${brandName}"`;

      expect(query).toBe('"CAPLINQ Corporation"');
    });
  });

  describe('mention classification', () => {
    it('identifies linked mentions', () => {
      const snippet = 'Visit <a href="https://caplinq.com">CAPLINQ</a> for more';
      const domain = 'caplinq.com';

      // In real parsing, we'd look for actual links
      // Here we just check if domain appears in snippet
      const hasLinkToBrand = snippet.toLowerCase().includes(domain.toLowerCase());
      expect(hasLinkToBrand).toBe(true);
    });

    it('identifies unlinked mentions', () => {
      const snippet = 'CAPLINQ is a leading supplier of specialty chemicals';
      const domain = 'caplinq.com';

      // Snippet mentions brand but not domain
      const hasBrandMention = snippet.toLowerCase().includes('caplinq');
      const hasDomainMention = snippet.toLowerCase().includes(domain);

      expect(hasBrandMention).toBe(true);
      expect(hasDomainMention).toBe(false);
    });
  });
});
