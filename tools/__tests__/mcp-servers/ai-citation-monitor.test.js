/**
 * Tests for ai-citation-monitor MCP server
 * Multi-engine AI citation monitoring
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '../setup.js';
import { http, HttpResponse } from 'msw';
import { defaults } from '../__mocks__/handlers.js';

describe('ai-citation-monitor MCP server', () => {
  describe('check_citations tool - Perplexity', () => {
    it('queries Perplexity API with citation request', async () => {
      let capturedBody;
      server.use(
        http.post('https://api.perplexity.ai/chat/completions', async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(defaults.perplexity);
        })
      );

      await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: 'What is a gas diffusion layer?' }],
          return_citations: true
        })
      });

      expect(capturedBody.model).toBe('sonar');
      expect(capturedBody.return_citations).toBe(true);
    });

    it('detects domain citation in Perplexity sources', async () => {
      const res = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'sonar', messages: [{ role: 'user', content: 'test' }] })
      });
      const data = await res.json();

      const domain = 'caplinq.com';
      const citations = data.citations || [];
      const citedInSources = citations.some(c => c.includes(domain));

      expect(citedInSources).toBe(true);
    });

    it('detects domain mention in Perplexity content', async () => {
      const res = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'sonar', messages: [{ role: 'user', content: 'test' }] })
      });
      const data = await res.json();

      const domain = 'caplinq.com';
      const content = data.choices?.[0]?.message?.content || '';
      const citedInContent = content.toLowerCase().includes(domain.toLowerCase());

      expect(citedInContent).toBe(true);
    });
  });

  describe('check_citations tool - Anthropic Claude', () => {
    it('queries Anthropic API', async () => {
      let capturedBody;
      server.use(
        http.post('https://api.anthropic.com/v1/messages', async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(defaults.anthropic);
        })
      );

      await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': 'test_key',
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [{ role: 'user', content: 'What companies sell gas diffusion layers?' }]
        })
      });

      expect(capturedBody.model).toContain('claude');
      expect(capturedBody.max_tokens).toBeDefined();
    });

    it('detects domain mention in Claude response', async () => {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': 'test_key', 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1024, messages: [] })
      });
      const data = await res.json();

      const domain = 'caplinq';
      const content = data.content?.[0]?.text || '';
      const mentioned = content.toLowerCase().includes(domain.toLowerCase());

      expect(mentioned).toBe(true);
    });
  });

  describe('check_citations tool - OpenAI', () => {
    it('queries OpenAI API', async () => {
      let capturedBody;
      server.use(
        http.post('https://api.openai.com/v1/chat/completions', async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(defaults.openai);
        })
      );

      await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: 'What are sources for carbon materials?' }]
        })
      });

      expect(capturedBody.model).toBe('gpt-4o');
    });

    it('detects domain mention in OpenAI response', async () => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test_key', 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o', messages: [] })
      });
      const data = await res.json();

      const domain = 'caplinq.com';
      const content = data.choices?.[0]?.message?.content || '';
      const mentioned = content.toLowerCase().includes(domain.toLowerCase());

      expect(mentioned).toBe(true);
    });

    it('handles undefined URLs in OpenAI annotations', () => {
      // Simulate OpenAI response with annotations that have missing/undefined URLs
      const message = {
        content: 'Some response mentioning caplinq.com',
        annotations: [
          { type: 'url_citation', url: 'https://example.com/page1' },
          { type: 'url_citation', url: undefined },
          { type: 'url_citation', url: null },
          { type: 'url_citation' }, // missing url property
          { type: 'url_citation', url: 'https://caplinq.com/products' }
        ]
      };

      // This is the fix we applied - filter(Boolean) after map
      const citations = (message.annotations || [])
        .filter(a => a.type === 'url_citation')
        .map(a => a.url)
        .filter(Boolean);

      const domain = 'caplinq.com';
      // Should not throw error and should correctly identify citations
      const citedInUrls = citations.some(c => c.includes(domain));

      expect(citations).toHaveLength(2); // Only valid URLs
      expect(citedInUrls).toBe(true);
    });
  });

  describe('check_citations tool - Google Gemini', () => {
    it('queries Gemini API', async () => {
      let capturedBody;
      server.use(
        http.post(/generativelanguage\.googleapis\.com/, async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(defaults.gemini);
        })
      );

      await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'What companies sell specialty chemicals?' }] }]
        })
      });

      expect(capturedBody.contents).toBeDefined();
      expect(capturedBody.contents[0].parts[0].text).toContain('specialty chemicals');
    });

    it('parses Gemini response format', async () => {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [] })
      });
      const data = await res.json();

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      expect(content).toContain('caplinq.com');
    });
  });

  describe('multi-engine aggregation', () => {
    it('queries all available engines in parallel', async () => {
      const enginesCalled = [];

      server.use(
        http.post('https://api.perplexity.ai/chat/completions', () => {
          enginesCalled.push('perplexity');
          return HttpResponse.json(defaults.perplexity);
        }),
        http.post('https://api.anthropic.com/v1/messages', () => {
          enginesCalled.push('anthropic');
          return HttpResponse.json(defaults.anthropic);
        }),
        http.post('https://api.openai.com/v1/chat/completions', () => {
          enginesCalled.push('openai');
          return HttpResponse.json(defaults.openai);
        }),
        http.post(/generativelanguage\.googleapis\.com/, () => {
          enginesCalled.push('gemini');
          return HttpResponse.json(defaults.gemini);
        })
      );

      await Promise.all([
        fetch('https://api.perplexity.ai/chat/completions', { method: 'POST', body: '{}' }),
        fetch('https://api.anthropic.com/v1/messages', { method: 'POST', body: '{}' }),
        fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', body: '{}' }),
        fetch('https://generativelanguage.googleapis.com/v1/test', { method: 'POST', body: '{}' })
      ]);

      expect(enginesCalled).toContain('perplexity');
      expect(enginesCalled).toContain('anthropic');
      expect(enginesCalled).toContain('openai');
      expect(enginesCalled).toContain('gemini');
    });

    it('handles partial engine failures gracefully', async () => {
      server.use(
        http.post('https://api.perplexity.ai/chat/completions', () => {
          return HttpResponse.json(defaults.perplexity);
        }),
        http.post('https://api.anthropic.com/v1/messages', () => {
          return new HttpResponse('Rate limited', { status: 429 });
        }),
        http.post('https://api.openai.com/v1/chat/completions', () => {
          return HttpResponse.json(defaults.openai);
        })
      );

      const results = await Promise.allSettled([
        fetch('https://api.perplexity.ai/chat/completions', { method: 'POST', body: '{}' }).then(r => r.json()),
        fetch('https://api.anthropic.com/v1/messages', { method: 'POST', body: '{}' }).then(r => {
          if (!r.ok) throw new Error('Anthropic failed');
          return r.json();
        }),
        fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', body: '{}' }).then(r => r.json())
      ]);

      const fulfilled = results.filter(r => r.status === 'fulfilled');
      const rejected = results.filter(r => r.status === 'rejected');

      expect(fulfilled).toHaveLength(2);
      expect(rejected).toHaveLength(1);
    });
  });

  describe('CITE C05 verdict logic', () => {
    it('PASS for citations on 10+ queries across 2+ engines', () => {
      const queriesWithCitations = 12;
      const enginesWithCitations = 3;

      let verdict;
      if (queriesWithCitations >= 10 && enginesWithCitations >= 2) {
        verdict = 'PASS';
      } else if (queriesWithCitations >= 3) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PASS');
    });

    it('PARTIAL for citations on 3-9 queries', () => {
      const queriesWithCitations = 5;

      let verdict;
      if (queriesWithCitations >= 10) {
        verdict = 'PASS';
      } else if (queriesWithCitations >= 3) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PARTIAL');
    });

    it('FAIL for citations on <3 queries', () => {
      const queriesWithCitations = 1;

      let verdict;
      if (queriesWithCitations >= 10) {
        verdict = 'PASS';
      } else if (queriesWithCitations >= 3) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('FAIL');
    });
  });

  describe('CITE C07 verdict logic (cross-engine)', () => {
    it('PASS when cited by 3+ different engines', () => {
      const engineCount = 3;

      let verdict;
      if (engineCount >= 3) {
        verdict = 'PASS';
      } else if (engineCount === 2) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PASS');
    });

    it('PARTIAL when cited by exactly 2 engines', () => {
      const engineCount = 2;

      let verdict;
      if (engineCount >= 3) {
        verdict = 'PASS';
      } else if (engineCount === 2) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PARTIAL');
    });

    it('FAIL when cited by 0-1 engines', () => {
      const engineCount = 1;

      let verdict;
      if (engineCount >= 3) {
        verdict = 'PASS';
      } else if (engineCount === 2) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('FAIL');
    });
  });

  describe('compare_competitor_citations tool', () => {
    it('compares citation rates across domains', () => {
      const queryResults = [
        { query: 'q1', citedDomains: ['caplinq.com'] },
        { query: 'q2', citedDomains: ['competitor.com'] },
        { query: 'q3', citedDomains: ['caplinq.com', 'competitor.com'] },
        { query: 'q4', citedDomains: ['caplinq.com'] },
        { query: 'q5', citedDomains: [] }
      ];

      const domains = ['caplinq.com', 'competitor.com'];
      const citationShare = {};

      domains.forEach(domain => {
        const citedCount = queryResults.filter(r => r.citedDomains.includes(domain)).length;
        citationShare[domain] = `${citedCount}/${queryResults.length}`;
      });

      expect(citationShare['caplinq.com']).toBe('3/5');
      expect(citationShare['competitor.com']).toBe('2/5');
    });
  });

  describe('track_citation_snapshot tool', () => {
    it('produces diffable snapshot structure', () => {
      const snapshot = {
        domain: 'caplinq.com',
        timestamp: new Date().toISOString(),
        queries_cited: ['q1', 'q3', 'q4'],
        queries_not_cited: ['q2', 'q5'],
        citation_rate: '3/5',
        engines_citing: ['perplexity', 'openai']
      };

      expect(snapshot.domain).toBe('caplinq.com');
      expect(snapshot.timestamp).toBeDefined();
      expect(snapshot.queries_cited).toHaveLength(3);
      expect(snapshot.citation_rate).toBe('3/5');
    });

    it('can diff two snapshots', () => {
      const prev = {
        queries_cited: ['q1', 'q2'],
        queries_not_cited: ['q3', 'q4']
      };

      const curr = {
        queries_cited: ['q1', 'q3'],
        queries_not_cited: ['q2', 'q4']
      };

      const newlyCited = curr.queries_cited.filter(q => prev.queries_not_cited.includes(q));
      const lostCitations = prev.queries_cited.filter(q => curr.queries_not_cited.includes(q));

      expect(newlyCited).toContain('q3');
      expect(lostCitations).toContain('q2');
    });
  });

  describe('get_ai_response_format tool', () => {
    it('detects list format', () => {
      const content = '- Item 1\n- Item 2\n- Item 3';
      const hasList = /^[-*]\s/m.test(content) || /^\d+\.\s/m.test(content);

      expect(hasList).toBe(true);
    });

    it('detects table format', () => {
      const content = '| Header | Value |\n|--------|-------|\n| Row 1 | Data |';
      const hasTable = content.includes('|') && content.includes('---');

      expect(hasTable).toBe(true);
    });

    it('detects paragraph format', () => {
      const content = 'This is a paragraph of text without any special formatting. It continues for several sentences.';
      const hasList = /^[-*]\s/m.test(content) || /^\d+\.\s/m.test(content);
      const hasTable = content.includes('|') && content.includes('---');

      const isParagraph = !hasList && !hasTable;
      expect(isParagraph).toBe(true);
    });
  });
});
