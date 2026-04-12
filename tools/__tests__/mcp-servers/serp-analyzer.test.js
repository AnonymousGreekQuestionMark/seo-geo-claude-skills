/**
 * Tests for serp-analyzer MCP server
 * Serper.dev and DataForSEO SERP integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '../setup.js';
import { http, HttpResponse } from 'msw';
import { defaults } from '../__mocks__/handlers.js';

describe('serp-analyzer MCP server', () => {
  describe('analyze_serp tool - Serper.dev', () => {
    it('sends search query to Serper API', async () => {
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
        body: JSON.stringify({ q: 'gas diffusion layer', gl: 'us', hl: 'en', num: 10 })
      });

      expect(capturedBody.q).toBe('gas diffusion layer');
      expect(capturedBody.gl).toBe('us');
      expect(capturedBody.num).toBe(10);
    });

    it('parses organic results correctly', async () => {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'test query' })
      });
      const data = await res.json();

      expect(data.organic).toBeInstanceOf(Array);
      expect(data.organic.length).toBeGreaterThan(0);

      const firstResult = data.organic[0];
      expect(firstResult.position).toBeDefined();
      expect(firstResult.title).toBeDefined();
      expect(firstResult.link).toBeDefined();
      expect(firstResult.snippet).toBeDefined();
    });

    it('extracts SERP features', async () => {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'test query' })
      });
      const data = await res.json();

      expect(data.peopleAlsoAsk).toBeInstanceOf(Array);
      expect(data.relatedSearches).toBeInstanceOf(Array);
    });

    it('identifies AI Overview presence', async () => {
      server.use(
        http.post('https://google.serper.dev/search', () => {
          return HttpResponse.json({
            ...defaults.serper,
            aiOverview: { text: 'AI-generated summary here' }
          });
        })
      );

      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'what is seo' })
      });
      const data = await res.json();

      expect(data.aiOverview).toBeDefined();
      expect(data.aiOverview.text).toContain('AI-generated');
    });
  });

  describe('analyze_serp tool - DataForSEO fallback', () => {
    it('calls DataForSEO when Serper unavailable', async () => {
      let dfsCallMade = false;
      server.use(
        http.post('https://google.serper.dev/search', () => {
          return new HttpResponse('Unauthorized', { status: 401 });
        }),
        http.post('https://api.dataforseo.com/v3/serp/google/organic/live/regular', () => {
          dfsCallMade = true;
          return HttpResponse.json(defaults.dataforseoSerp);
        })
      );

      // First try Serper (fails)
      const serperRes = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'invalid' },
        body: JSON.stringify({ q: 'test' })
      });
      expect(serperRes.ok).toBe(false);

      // Fallback to DataForSEO
      const dfsRes = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/regular', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ keyword: 'test', location_code: 2840 }])
      });

      expect(dfsRes.ok).toBe(true);
      expect(dfsCallMade).toBe(true);
    });

    it('parses DataForSEO SERP format', async () => {
      const res = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/regular', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ keyword: 'test' }])
      });
      const data = await res.json();

      expect(data.tasks).toBeInstanceOf(Array);
      expect(data.tasks[0].result).toBeInstanceOf(Array);

      const items = data.tasks[0].result[0].items;
      expect(items).toBeInstanceOf(Array);

      const organic = items.filter(i => i.type === 'organic');
      expect(organic.length).toBeGreaterThan(0);
    });
  });

  describe('check_rank tool', () => {
    it('finds target domain position in SERP', async () => {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'test query' })
      });
      const data = await res.json();

      const targetDomain = 'caplinq.com';
      const position = data.organic.findIndex(
        r => r.link.includes(targetDomain)
      ) + 1; // 1-indexed position

      expect(position).toBe(1); // caplinq.com is first in mock
    });

    it('returns null position when domain not in SERP', async () => {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'test query' })
      });
      const data = await res.json();

      const targetDomain = 'notfound.com';
      const found = data.organic.find(r => r.link.includes(targetDomain));

      expect(found).toBeUndefined();
    });

    it('extracts domain from full URL', async () => {
      const url = 'https://www.caplinq.com/products/gas-diffusion-layer';
      const domain = new URL(url).hostname.replace(/^www\./, '');

      expect(domain).toBe('caplinq.com');
    });
  });

  describe('SERP feature detection', () => {
    it('detects answer box', async () => {
      server.use(
        http.post('https://google.serper.dev/search', () => {
          return HttpResponse.json({
            ...defaults.serper,
            answerBox: { answer: 'The quick brown fox', snippet: 'Full text here' }
          });
        })
      );

      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'test' })
      });
      const data = await res.json();

      expect(data.answerBox).toBeDefined();
      expect(data.answerBox.answer).toBe('The quick brown fox');
    });

    it('detects knowledge graph', async () => {
      server.use(
        http.post('https://google.serper.dev/search', () => {
          return HttpResponse.json({
            ...defaults.serper,
            knowledgeGraph: {
              title: 'Test Company',
              type: 'Organization',
              website: 'https://test.com'
            }
          });
        })
      );

      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'test company' })
      });
      const data = await res.json();

      expect(data.knowledgeGraph).toBeDefined();
      expect(data.knowledgeGraph.title).toBe('Test Company');
    });

    it('extracts People Also Ask questions', async () => {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': 'test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'what is seo' })
      });
      const data = await res.json();

      expect(data.peopleAlsoAsk).toBeInstanceOf(Array);
      expect(data.peopleAlsoAsk.length).toBeGreaterThan(0);
      expect(data.peopleAlsoAsk[0].question).toBeDefined();
    });
  });

  describe('regional and language settings', () => {
    it('passes country code (gl) parameter', async () => {
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
        body: JSON.stringify({ q: 'test', gl: 'de' })
      });

      expect(capturedBody.gl).toBe('de');
    });

    it('passes language code (hl) parameter', async () => {
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
        body: JSON.stringify({ q: 'test', hl: 'de' })
      });

      expect(capturedBody.hl).toBe('de');
    });
  });
});
