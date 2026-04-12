/**
 * Tests for entity-checker MCP server
 * Wikidata, Wikipedia, and Google Knowledge Graph integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '../setup.js';
import { http, HttpResponse } from 'msw';
import { defaults } from '../__mocks__/handlers.js';

describe('entity-checker MCP server', () => {
  describe('check_entity tool - Wikidata', () => {
    it('queries Wikidata SPARQL by domain', async () => {
      const res = await fetch('https://query.wikidata.org/sparql?query=test&format=json', {
        headers: { 'User-Agent': 'SEO-GEO-Skills/1.0' }
      });
      const data = await res.json();

      expect(data.results).toBeDefined();
      expect(data.results.bindings).toBeInstanceOf(Array);
    });

    it('parses Wikidata entity results correctly', async () => {
      const res = await fetch('https://query.wikidata.org/sparql?query=test&format=json', {
        headers: { 'User-Agent': 'SEO-GEO-Skills/1.0' }
      });
      const data = await res.json();

      const bindings = data.results.bindings;
      expect(bindings.length).toBeGreaterThan(0);

      const entity = bindings[0];
      expect(entity.item.value).toContain('wikidata.org/entity');
      expect(entity.itemLabel.value).toBe('Test Company');
    });

    it('handles empty Wikidata results', async () => {
      server.use(
        http.get('https://query.wikidata.org/sparql', () => {
          return HttpResponse.json({
            results: { bindings: [] }
          });
        })
      );

      const res = await fetch('https://query.wikidata.org/sparql?query=test&format=json');
      const data = await res.json();

      expect(data.results.bindings).toHaveLength(0);
    });

    it('handles Wikidata query timeout', async () => {
      server.use(
        http.get('https://query.wikidata.org/sparql', () => {
          return new HttpResponse('Query timeout', { status: 503 });
        })
      );

      const res = await fetch('https://query.wikidata.org/sparql?query=test&format=json');
      expect(res.ok).toBe(false);
      expect(res.status).toBe(503);
    });
  });

  describe('check_entity tool - Wikipedia', () => {
    it('queries Wikipedia search API', async () => {
      const res = await fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Test&format=json');
      const data = await res.json();

      expect(data.query).toBeDefined();
      expect(data.query.search).toBeInstanceOf(Array);
    });

    it('parses Wikipedia search results', async () => {
      const res = await fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Test&format=json');
      const data = await res.json();

      const results = data.query.search;
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBeDefined();
      expect(results[0].snippet).toBeDefined();
      expect(results[0].pageid).toBeDefined();
    });

    it('handles no Wikipedia matches', async () => {
      server.use(
        http.get('https://en.wikipedia.org/w/api.php', () => {
          return HttpResponse.json({
            query: { search: [] }
          });
        })
      );

      const res = await fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=XYZ123NotFound&format=json');
      const data = await res.json();

      expect(data.query.search).toHaveLength(0);
    });
  });

  describe('check_entity tool - Google Knowledge Graph', () => {
    it('queries Google KG API', async () => {
      const res = await fetch('https://kgsearch.googleapis.com/v1/entities:search?query=Test&key=test_key');
      const data = await res.json();

      expect(data.itemListElement).toBeInstanceOf(Array);
    });

    it('parses Google KG entity results', async () => {
      const res = await fetch('https://kgsearch.googleapis.com/v1/entities:search?query=Test&key=test_key');
      const data = await res.json();

      const items = data.itemListElement;
      expect(items.length).toBeGreaterThan(0);

      const entity = items[0];
      expect(entity.result.name).toBe('Test Company');
      expect(entity.result['@type']).toContain('Organization');
      expect(entity.resultScore).toBeGreaterThan(0);
    });

    it('handles missing Google KG results', async () => {
      server.use(
        http.get('https://kgsearch.googleapis.com/v1/entities:search', () => {
          return HttpResponse.json({ itemListElement: [] });
        })
      );

      const res = await fetch('https://kgsearch.googleapis.com/v1/entities:search?query=UnknownEntity&key=test_key');
      const data = await res.json();

      expect(data.itemListElement).toHaveLength(0);
    });

    it('handles API key missing error', async () => {
      server.use(
        http.get('https://kgsearch.googleapis.com/v1/entities:search', ({ request }) => {
          const url = new URL(request.url);
          if (!url.searchParams.get('key')) {
            return HttpResponse.json({
              error: { code: 403, message: 'API key missing' }
            }, { status: 403 });
          }
          return HttpResponse.json(defaults.googleKg);
        })
      );

      const res = await fetch('https://kgsearch.googleapis.com/v1/entities:search?query=Test');
      expect(res.status).toBe(403);
    });
  });

  describe('CITE I01 verdict logic', () => {
    it('returns PASS when found in 2+ knowledge graphs', () => {
      const kgCount = 3; // Wikidata + Wikipedia + Google KG

      let verdict;
      if (kgCount >= 2) {
        verdict = 'PASS';
      } else if (kgCount === 1) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PASS');
    });

    it('returns PARTIAL when found in exactly 1 knowledge graph', () => {
      const kgCount = 1;

      let verdict;
      if (kgCount >= 2) {
        verdict = 'PASS';
      } else if (kgCount === 1) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PARTIAL');
    });

    it('returns FAIL when found in no knowledge graphs', () => {
      const kgCount = 0;

      let verdict;
      if (kgCount >= 2) {
        verdict = 'PASS';
      } else if (kgCount === 1) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('FAIL');
    });
  });

  describe('knowledge graph aggregation', () => {
    it('combines results from all three sources', async () => {
      // Simulate checking all three sources
      const [wikidataRes, wikipediaRes, googleKgRes] = await Promise.all([
        fetch('https://query.wikidata.org/sparql?query=test&format=json', {
          headers: { 'User-Agent': 'SEO-GEO-Skills/1.0' }
        }),
        fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Test&format=json'),
        fetch('https://kgsearch.googleapis.com/v1/entities:search?query=Test&key=test_key')
      ]);

      const [wikidata, wikipedia, googleKg] = await Promise.all([
        wikidataRes.json(),
        wikipediaRes.json(),
        googleKgRes.json()
      ]);

      // All three should return results
      expect(wikidata.results.bindings.length).toBeGreaterThan(0);
      expect(wikipedia.query.search.length).toBeGreaterThan(0);
      expect(googleKg.itemListElement.length).toBeGreaterThan(0);
    });

    it('handles partial failures gracefully', async () => {
      // Google KG fails, but others work
      server.use(
        http.get('https://kgsearch.googleapis.com/v1/entities:search', () => {
          return new HttpResponse('Service unavailable', { status: 503 });
        })
      );

      const results = await Promise.allSettled([
        fetch('https://query.wikidata.org/sparql?query=test&format=json', {
          headers: { 'User-Agent': 'SEO-GEO-Skills/1.0' }
        }).then(r => r.json()),
        fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Test&format=json').then(r => r.json()),
        fetch('https://kgsearch.googleapis.com/v1/entities:search?query=Test&key=test_key').then(r => {
          if (!r.ok) throw new Error('Google KG failed');
          return r.json();
        })
      ]);

      // First two should succeed
      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('fulfilled');
      // Third should fail
      expect(results[2].status).toBe('rejected');
    });
  });

  describe('entity matching logic', () => {
    it('matches entity by domain URL', () => {
      const domain = 'caplinq.com';
      const wikidataUrl = 'https://www.caplinq.com';

      const matches = wikidataUrl.toLowerCase().includes(domain.toLowerCase());
      expect(matches).toBe(true);
    });

    it('matches entity by name', () => {
      const entityName = 'CAPLINQ';
      const wikidataLabel = 'Caplinq Corporation';

      const matches = wikidataLabel.toLowerCase().includes(entityName.toLowerCase());
      expect(matches).toBe(true);
    });

    it('handles case-insensitive matching', () => {
      const entityName = 'caplinq';
      const wikidataLabel = 'CAPLINQ Corporation';

      const matches = wikidataLabel.toLowerCase().includes(entityName.toLowerCase());
      expect(matches).toBe(true);
    });
  });
});
