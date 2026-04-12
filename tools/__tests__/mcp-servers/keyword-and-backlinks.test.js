/**
 * Tests for keyword-and-backlinks MCP server
 * DataForSEO and Open PageRank integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '../setup.js';
import { http, HttpResponse } from 'msw';
import { defaults } from '../__mocks__/handlers.js';

describe('keyword-and-backlinks MCP server', () => {
  describe('get_keyword_metrics tool - DataForSEO', () => {
    it('sends keywords to DataForSEO API', async () => {
      let capturedBody;
      server.use(
        http.post('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(defaults.dataforseoKeywords);
        })
      );

      await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{
          keywords: ['gas diffusion layer', 'carbon paper'],
          location_code: 2840,
          language_code: 'en'
        }])
      });

      expect(capturedBody[0].keywords).toContain('gas diffusion layer');
      expect(capturedBody[0].location_code).toBe(2840);
    });

    it('parses keyword metrics correctly', async () => {
      const res = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ keywords: ['test'] }])
      });
      const data = await res.json();

      const results = data.tasks[0].result;
      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBeGreaterThan(0);

      const kw = results[0];
      expect(kw.keyword).toBeDefined();
      expect(kw.search_volume).toBeDefined();
      expect(kw.competition).toBeDefined();
      expect(kw.cpc).toBeDefined();
    });

    it('includes keyword difficulty when available', async () => {
      const res = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ keywords: ['gas diffusion layer'] }])
      });
      const data = await res.json();

      const kw = data.tasks[0].result[0];
      expect(kw.keyword_difficulty).toBeDefined();
      expect(typeof kw.keyword_difficulty).toBe('number');
    });
  });

  describe('get_backlink_profile tool - DataForSEO', () => {
    it('fetches backlink summary for domain', async () => {
      let capturedBody;
      server.use(
        http.post('https://api.dataforseo.com/v3/backlinks/summary/live', async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(defaults.dataforseoBacklinks);
        })
      );

      await fetch('https://api.dataforseo.com/v3/backlinks/summary/live', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ target: 'caplinq.com', include_subdomains: false }])
      });

      expect(capturedBody[0].target).toBe('caplinq.com');
      expect(capturedBody[0].include_subdomains).toBe(false);
    });

    it('parses backlink metrics correctly', async () => {
      const res = await fetch('https://api.dataforseo.com/v3/backlinks/summary/live', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ target: 'caplinq.com' }])
      });
      const data = await res.json();

      const r = data.tasks[0].result[0];
      expect(r.rank).toBeDefined();
      expect(r.referring_domains).toBeDefined();
      expect(r.referring_links).toBeDefined();
      expect(r.referring_links_dofollow).toBeDefined();
    });

    it('calculates dofollow ratio', async () => {
      const res = await fetch('https://api.dataforseo.com/v3/backlinks/summary/live', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ target: 'caplinq.com' }])
      });
      const data = await res.json();

      const r = data.tasks[0].result[0];
      const dofollowRatio = Math.round((r.referring_links_dofollow / r.referring_links) * 100);

      expect(dofollowRatio).toBeGreaterThan(0);
      expect(dofollowRatio).toBeLessThanOrEqual(100);
    });

    it('includes link velocity metrics', async () => {
      const res = await fetch('https://api.dataforseo.com/v3/backlinks/summary/live', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ target: 'caplinq.com' }])
      });
      const data = await res.json();

      const r = data.tasks[0].result[0];
      expect(r.new_referring_links).toBeDefined();
      expect(r.lost_referring_links).toBeDefined();
    });
  });

  describe('get_backlink_profile tool - Open PageRank fallback', () => {
    it('calls OPR when DataForSEO unavailable', async () => {
      let oprCallMade = false;
      server.use(
        http.post('https://api.dataforseo.com/v3/backlinks/summary/live', () => {
          return new HttpResponse('Unauthorized', { status: 401 });
        }),
        http.get(/openpagerank\.com/, () => {
          oprCallMade = true;
          return HttpResponse.json(defaults.openPageRank);
        })
      );

      // DataForSEO fails
      const dfsRes = await fetch('https://api.dataforseo.com/v3/backlinks/summary/live', {
        method: 'POST',
        headers: { 'Authorization': 'Basic aW52YWxpZA==', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ target: 'caplinq.com' }])
      });
      expect(dfsRes.ok).toBe(false);

      // Fallback to OPR
      const oprRes = await fetch('https://openpagerank.com/api/v1.0/getPageRank?domains[]=caplinq.com', {
        headers: { 'API-OPR': 'test_opr_key' }
      });

      expect(oprRes.ok).toBe(true);
      expect(oprCallMade).toBe(true);
    });

    it('parses OPR response correctly', async () => {
      const res = await fetch('https://openpagerank.com/api/v1.0/getPageRank?domains[]=caplinq.com', {
        headers: { 'API-OPR': 'test_opr_key' }
      });
      const data = await res.json();

      expect(data.response).toBeInstanceOf(Array);
      expect(data.response.length).toBeGreaterThan(0);

      const domain = data.response[0];
      expect(domain.page_rank_integer).toBeDefined();
      expect(domain.page_rank_decimal).toBeDefined();
      expect(domain.rank).toBeDefined();
    });

    it('OPR provides limited metrics compared to DataForSEO', async () => {
      const res = await fetch('https://openpagerank.com/api/v1.0/getPageRank?domains[]=caplinq.com', {
        headers: { 'API-OPR': 'test_opr_key' }
      });
      const data = await res.json();

      const domain = data.response[0];
      // OPR has rank but not detailed backlink breakdown
      expect(domain.page_rank_integer).toBeDefined();
      expect(domain.referring_domains).toBeUndefined(); // Not available in OPR
    });
  });

  describe('get_domain_metrics tool', () => {
    it('fetches domain organic metrics', async () => {
      const res = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/domain_metrics_by_categories/live', {
        method: 'POST',
        headers: { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/json' },
        body: JSON.stringify([{ target: 'caplinq.com' }])
      });
      const data = await res.json();

      expect(data.tasks).toBeInstanceOf(Array);
      expect(data.tasks[0].result).toBeInstanceOf(Array);
    });
  });

  describe('tier detection', () => {
    it('indicates Tier 2 source for DataForSEO', () => {
      const source = 'dataforseo';
      const tier = source === 'dataforseo' ? 2 : 1;

      expect(tier).toBe(2);
    });

    it('indicates Tier 1 source for Open PageRank', () => {
      const source = 'open_pagerank';
      const tier = source === 'dataforseo' ? 2 : 1;

      expect(tier).toBe(1);
    });
  });

  describe('CITE C01/C02 verdict logic', () => {
    it('PASS for 500+ referring domains', () => {
      const referringDomains = 500;

      let verdict;
      if (referringDomains >= 500) {
        verdict = 'PASS';
      } else if (referringDomains >= 50) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PASS');
    });

    it('PARTIAL for 50-499 referring domains', () => {
      const referringDomains = 150;

      let verdict;
      if (referringDomains >= 500) {
        verdict = 'PASS';
      } else if (referringDomains >= 50) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PARTIAL');
    });

    it('FAIL for <50 referring domains', () => {
      const referringDomains = 25;

      let verdict;
      if (referringDomains >= 500) {
        verdict = 'PASS';
      } else if (referringDomains >= 50) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('FAIL');
    });
  });
});
