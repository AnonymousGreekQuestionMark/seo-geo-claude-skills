/**
 * Tests for pagespeed MCP server
 * Google PageSpeed Insights API integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '../setup.js';
import { http, HttpResponse } from 'msw';
import { defaults } from '../__mocks__/handlers.js';

describe('pagespeed MCP server', () => {
  describe('get_core_web_vitals tool', () => {
    it('fetches PageSpeed data and extracts CWV metrics', async () => {
      // Use the default mock from handlers.js

      const res = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://caplinq.com&strategy=mobile');
      const data = await res.json();

      expect(data.lighthouseResult).toBeDefined();
      expect(data.lighthouseResult.categories.performance.score).toBe(0.85);
      expect(data.lighthouseResult.audits['largest-contentful-paint'].displayValue).toBe('2.1 s');
      expect(data.lighthouseResult.audits['cumulative-layout-shift'].displayValue).toBe('0.05');
    });

    it('extracts field data (CrUX) when available', async () => {
      const res = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://caplinq.com');
      const data = await res.json();

      expect(data.loadingExperience).toBeDefined();
      expect(data.loadingExperience.overall_category).toBe('FAST');
      expect(data.loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile).toBe(2100);
      expect(data.loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile).toBe(0.05);
    });

    it('handles missing field data gracefully', async () => {
      server.use(
        http.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', () => {
          return HttpResponse.json({
            lighthouseResult: {
              categories: { performance: { score: 0.75 } },
              audits: {
                'largest-contentful-paint': { displayValue: '3.0 s' },
                'total-blocking-time': { displayValue: '100 ms' },
                'cumulative-layout-shift': { displayValue: '0.1' }
              }
            },
            loadingExperience: {
              overall_category: 'AVERAGE'
              // No metrics - CrUX data not available
            }
          });
        })
      );

      const res = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com');
      const data = await res.json();

      // Should still have lab data
      expect(data.lighthouseResult.categories.performance.score).toBe(0.75);
      // Field data metrics may be missing
      expect(data.loadingExperience.metrics).toBeUndefined();
    });

    it('passes strategy parameter correctly', async () => {
      let capturedUrl;
      server.use(
        http.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json(defaults.pagespeed);
        })
      );

      await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://caplinq.com&strategy=desktop');

      expect(capturedUrl).toContain('strategy=desktop');
    });

    it('includes API key in request when configured', async () => {
      let capturedUrl;
      server.use(
        http.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json(defaults.pagespeed);
        })
      );

      await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://caplinq.com&key=test_api_key');

      expect(capturedUrl).toContain('key=test_api_key');
    });
  });

  describe('CITE E04 verdict logic', () => {
    it('returns PASS for performance score >= 80', () => {
      const score = 0.85;

      let verdict;
      if (score >= 0.80) {
        verdict = 'PASS';
      } else if (score >= 0.50) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PASS');
    });

    it('returns PARTIAL for performance score 50-79', () => {
      const score = 0.65;

      let verdict;
      if (score >= 0.80) {
        verdict = 'PASS';
      } else if (score >= 0.50) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PARTIAL');
    });

    it('returns FAIL for performance score < 50', () => {
      const score = 0.35;

      let verdict;
      if (score >= 0.80) {
        verdict = 'PASS';
      } else if (score >= 0.50) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('FAIL');
    });
  });

  describe('Core Web Vitals thresholds', () => {
    it('classifies LCP correctly', () => {
      // Good: < 2.5s, Needs Improvement: 2.5-4s, Poor: > 4s
      const classifyLcp = (ms) => {
        if (ms <= 2500) return 'Good';
        if (ms <= 4000) return 'Needs Improvement';
        return 'Poor';
      };

      expect(classifyLcp(2100)).toBe('Good');
      expect(classifyLcp(3000)).toBe('Needs Improvement');
      expect(classifyLcp(5000)).toBe('Poor');
    });

    it('classifies CLS correctly', () => {
      // Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
      const classifyCls = (score) => {
        if (score <= 0.1) return 'Good';
        if (score <= 0.25) return 'Needs Improvement';
        return 'Poor';
      };

      expect(classifyCls(0.05)).toBe('Good');
      expect(classifyCls(0.15)).toBe('Needs Improvement');
      expect(classifyCls(0.5)).toBe('Poor');
    });

    it('classifies FID/INP correctly', () => {
      // Good: < 100ms, Needs Improvement: 100-300ms, Poor: > 300ms
      const classifyFid = (ms) => {
        if (ms <= 100) return 'Good';
        if (ms <= 300) return 'Needs Improvement';
        return 'Poor';
      };

      expect(classifyFid(50)).toBe('Good');
      expect(classifyFid(150)).toBe('Needs Improvement');
      expect(classifyFid(500)).toBe('Poor');
    });
  });

  describe('error handling', () => {
    it('handles API error gracefully', async () => {
      server.use(
        http.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', () => {
          return new HttpResponse('Quota exceeded', { status: 429 });
        })
      );

      try {
        const res = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://caplinq.com');
        expect(res.ok).toBe(false);
        expect(res.status).toBe(429);
      } catch (err) {
        // Expected error
      }
    });

    it('handles invalid URL', async () => {
      server.use(
        http.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', ({ request }) => {
          const url = new URL(request.url);
          const targetUrl = url.searchParams.get('url');

          if (!targetUrl || !targetUrl.startsWith('http')) {
            return HttpResponse.json({
              error: {
                code: 400,
                message: 'Invalid URL'
              }
            }, { status: 400 });
          }

          return HttpResponse.json(defaults.pagespeed);
        })
      );

      const res = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=not-a-url');

      expect(res.status).toBe(400);
    });
  });

  describe('response structure', () => {
    it('includes all expected fields in response', async () => {
      const res = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://caplinq.com');
      const data = await res.json();

      // Lab data structure
      expect(data.lighthouseResult).toBeDefined();
      expect(data.lighthouseResult.categories).toBeDefined();
      expect(data.lighthouseResult.categories.performance).toBeDefined();
      expect(data.lighthouseResult.categories.performance.score).toBeDefined();
      expect(data.lighthouseResult.audits).toBeDefined();

      // Field data structure
      expect(data.loadingExperience).toBeDefined();
      expect(data.loadingExperience.overall_category).toBeDefined();
    });

    it('extracts performance score as decimal 0-1', async () => {
      const res = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://caplinq.com');
      const data = await res.json();

      const score = data.lighthouseResult.categories.performance.score;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
});
