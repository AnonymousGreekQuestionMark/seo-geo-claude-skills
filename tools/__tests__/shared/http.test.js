/**
 * Tests for tools/shared/http.js
 * HTTP helpers and response formatters
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { server } from '../setup.js';
import { http, HttpResponse } from 'msw';

describe('http.js', () => {
  describe('post', () => {
    it('sends JSON POST request with correct headers', async () => {
      let capturedRequest;
      server.use(
        http.post('https://test.api/endpoint', async ({ request }) => {
          capturedRequest = {
            contentType: request.headers.get('Content-Type'),
            customHeader: request.headers.get('X-Custom'),
            body: await request.json()
          };
          return HttpResponse.json({ success: true });
        })
      );

      const { post } = await import('../../shared/http.js');
      const result = await post(
        'https://test.api/endpoint',
        { 'X-Custom': 'custom-value' },
        { data: 'test-data' }
      );

      expect(result).toEqual({ success: true });
      expect(capturedRequest.contentType).toBe('application/json');
      expect(capturedRequest.customHeader).toBe('custom-value');
      expect(capturedRequest.body).toEqual({ data: 'test-data' });
    });

    it('throws on non-2xx response with status and message preview', async () => {
      server.use(
        http.post('https://test.api/error', () => {
          return new HttpResponse('Unauthorized: Invalid API key provided', { status: 401 });
        })
      );

      const { post } = await import('../../shared/http.js');

      await expect(post('https://test.api/error', {}, {}))
        .rejects.toThrow('POST https://test.api/error → 401');
    });

    it('truncates long error messages to 200 chars', async () => {
      const longMessage = 'A'.repeat(500);
      server.use(
        http.post('https://test.api/long-error', () => {
          return new HttpResponse(longMessage, { status: 500 });
        })
      );

      const { post } = await import('../../shared/http.js');

      try {
        await post('https://test.api/long-error', {}, {});
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message.length).toBeLessThan(300);
        expect(err.message).toContain('A'.repeat(50)); // Contains truncated portion
      }
    });

    it('handles empty error response body gracefully', async () => {
      server.use(
        http.post('https://test.api/empty-error', () => {
          return new HttpResponse('', { status: 403 });
        })
      );

      const { post } = await import('../../shared/http.js');

      await expect(post('https://test.api/empty-error', {}, {}))
        .rejects.toThrow('POST https://test.api/empty-error → 403');
    });
  });

  describe('get', () => {
    it('sends GET request and parses JSON response', async () => {
      server.use(
        http.get('https://test.api/data', () => {
          return HttpResponse.json({ items: [1, 2, 3], count: 3 });
        })
      );

      const { get } = await import('../../shared/http.js');
      const result = await get('https://test.api/data');

      expect(result.items).toEqual([1, 2, 3]);
      expect(result.count).toBe(3);
    });

    it('passes headers to request', async () => {
      let capturedAuth;
      server.use(
        http.get('https://test.api/auth', ({ request }) => {
          capturedAuth = request.headers.get('Authorization');
          return HttpResponse.json({ ok: true });
        })
      );

      const { get } = await import('../../shared/http.js');
      await get('https://test.api/auth', { 'Authorization': 'Bearer token123' });

      expect(capturedAuth).toBe('Bearer token123');
    });

    it('throws on non-2xx response', async () => {
      server.use(
        http.get('https://test.api/not-found', () => {
          return new HttpResponse('Resource not found', { status: 404 });
        })
      );

      const { get } = await import('../../shared/http.js');

      await expect(get('https://test.api/not-found'))
        .rejects.toThrow('GET https://test.api/not-found → 404');
    });

    it('works without headers parameter', async () => {
      server.use(
        http.get('https://test.api/no-headers', () => {
          return HttpResponse.json({ result: 'success' });
        })
      );

      const { get } = await import('../../shared/http.js');
      const result = await get('https://test.api/no-headers');

      expect(result.result).toBe('success');
    });
  });

  describe('ok', () => {
    it('formats data as MCP content response', async () => {
      const { ok } = await import('../../shared/http.js');

      const result = ok({ key: 'value', number: 42, nested: { a: 1 } });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.isError).toBeUndefined();

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.key).toBe('value');
      expect(parsed.number).toBe(42);
      expect(parsed.nested.a).toBe(1);
    });

    it('formats array data correctly', async () => {
      const { ok } = await import('../../shared/http.js');

      const result = ok([1, 2, 3]);

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed).toEqual([1, 2, 3]);
    });

    it('formats string data correctly', async () => {
      const { ok } = await import('../../shared/http.js');

      const result = ok('simple string');

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed).toBe('simple string');
    });

    it('pretty prints JSON with indentation', async () => {
      const { ok } = await import('../../shared/http.js');

      const result = ok({ a: 1 });

      // Should have newlines from pretty printing
      expect(result.content[0].text).toContain('\n');
    });
  });

  describe('err', () => {
    it('formats error as MCP error response', async () => {
      const { err } = await import('../../shared/http.js');

      const result = err('Something went wrong');

      expect(result.isError).toBe(true);
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.error).toBe('Something went wrong');
    });

    it('handles error objects', async () => {
      const { err } = await import('../../shared/http.js');

      const result = err('Database connection failed');

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.error).toBe('Database connection failed');
    });
  });

  describe('tier1Manual', () => {
    it('returns structured Tier 1 manual fallback response', async () => {
      const { tier1Manual } = await import('../../shared/http.js');

      const result = tier1Manual(
        'check_citations',
        [
          'Open Perplexity.ai and search for your query',
          'Check if the target domain appears in sources',
          'Note whether it is primary or secondary source'
        ],
        {
          domain: 'caplinq.com',
          queries_tested: 0,
          results: []
        }
      );

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.tier).toBe(1);
      expect(parsed.data_source).toBe('manual_or_estimated');
      expect(parsed.confidence).toBe('low');
      expect(parsed.tool).toBe('check_citations');
      expect(parsed.manual_steps).toHaveLength(3);
      expect(parsed.manual_steps[0]).toContain('Perplexity');
      expect(parsed.data_template.domain).toBe('caplinq.com');
      expect(parsed.instruction).toContain('No API key configured');
    });

    it('includes all required fields for manual response', async () => {
      const { tier1Manual } = await import('../../shared/http.js');

      const result = tier1Manual('analyze_serp', ['Step 1', 'Step 2'], { query: 'test' });

      const parsed = JSON.parse(result.content[0].text);

      // All required fields present
      expect(parsed).toHaveProperty('tier');
      expect(parsed).toHaveProperty('data_source');
      expect(parsed).toHaveProperty('confidence');
      expect(parsed).toHaveProperty('tool');
      expect(parsed).toHaveProperty('manual_steps');
      expect(parsed).toHaveProperty('data_template');
      expect(parsed).toHaveProperty('instruction');
    });

    it('preserves data template structure', async () => {
      const { tier1Manual } = await import('../../shared/http.js');

      const template = {
        domain: 'example.com',
        metrics: {
          backlinks: 0,
          keywords: []
        },
        nested: {
          deep: {
            value: 'test'
          }
        }
      };

      const result = tier1Manual('test_tool', ['Step'], template);

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data_template).toEqual(template);
    });
  });
});
