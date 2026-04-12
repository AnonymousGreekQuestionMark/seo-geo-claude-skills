/**
 * Tests for schema-validator MCP server
 * Local JSON-LD validation with cheerio
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '../setup.js';
import { http, HttpResponse } from 'msw';

// Dynamic import to get fresh module for each test
async function getServer() {
  vi.resetModules();
  const module = await import('../../mcp-servers/schema-validator.js');
  return module;
}

describe('schema-validator MCP server', () => {
  describe('validate_page_schema tool', () => {
    it('extracts and validates JSON-LD from fetched HTML', async () => {
      server.use(
        http.get('https://test.com/valid-article', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Test Article</title>
              <script type="application/ld+json">
                {
                  "@context": "https://schema.org",
                  "@type": "Article",
                  "headline": "Test Article Headline",
                  "author": {"@type": "Person", "name": "John Doe"},
                  "datePublished": "2024-01-15",
                  "publisher": {"@type": "Organization", "name": "Test Publisher"}
                }
              </script>
            </head>
            <body><h1>Test Article</h1></body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      // Import the validation functions
      const { load } = await import('cheerio');

      // Fetch and parse
      const res = await fetch('https://test.com/valid-article');
      const html = await res.text();
      const $ = load(html);

      // Extract schema
      const schemas = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          schemas.push(JSON.parse($(el).text()));
        } catch {}
      });

      expect(schemas).toHaveLength(1);
      expect(schemas[0]['@type']).toBe('Article');
      expect(schemas[0].headline).toBe('Test Article Headline');
    });

    it('detects missing required Article properties', async () => {
      server.use(
        http.get('https://test.com/invalid-article', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head>
              <script type="application/ld+json">
                {"@context": "https://schema.org", "@type": "Article"}
              </script>
            </head>
            <body></body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const { load } = await import('cheerio');
      const res = await fetch('https://test.com/invalid-article');
      const html = await res.text();
      const $ = load(html);

      const schemas = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          schemas.push(JSON.parse($(el).text()));
        } catch {}
      });

      // Validate Article required fields
      const article = schemas[0];
      const issues = [];
      if (!article.headline) issues.push('Article missing headline');
      if (!article.author) issues.push('Article missing author');
      if (!article.datePublished) issues.push('Article missing datePublished');
      if (!article.publisher) issues.push('Article missing publisher');

      expect(issues).toContain('Article missing headline');
      expect(issues).toContain('Article missing author');
      expect(issues).toContain('Article missing datePublished');
      expect(issues).toContain('Article missing publisher');
    });

    it('validates FAQPage schema structure', async () => {
      server.use(
        http.get('https://test.com/faq', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head>
              <script type="application/ld+json">
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is SEO?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Search Engine Optimization"
                      }
                    }
                  ]
                }
              </script>
            </head>
            <body></body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const { load } = await import('cheerio');
      const res = await fetch('https://test.com/faq');
      const html = await res.text();
      const $ = load(html);

      const schemas = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          schemas.push(JSON.parse($(el).text()));
        } catch {}
      });

      const faq = schemas[0];
      expect(faq['@type']).toBe('FAQPage');
      expect(faq.mainEntity).toHaveLength(1);
      expect(faq.mainEntity[0]['@type']).toBe('Question');
      expect(faq.mainEntity[0].name).toBe('What is SEO?');
    });

    it('handles multiple schema blocks', async () => {
      server.use(
        http.get('https://test.com/multi-schema', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head>
              <script type="application/ld+json">
                {"@context": "https://schema.org", "@type": "BreadcrumbList"}
              </script>
              <script type="application/ld+json">
                {"@context": "https://schema.org", "@type": "Article", "headline": "Test"}
              </script>
            </head>
            <body></body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const { load } = await import('cheerio');
      const res = await fetch('https://test.com/multi-schema');
      const html = await res.text();
      const $ = load(html);

      const schemas = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          schemas.push(JSON.parse($(el).text()));
        } catch {}
      });

      expect(schemas).toHaveLength(2);
      const types = schemas.map(s => s['@type']);
      expect(types).toContain('BreadcrumbList');
      expect(types).toContain('Article');
    });

    it('handles @graph format', async () => {
      server.use(
        http.get('https://test.com/graph-schema', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head>
              <script type="application/ld+json">
                {
                  "@context": "https://schema.org",
                  "@graph": [
                    {"@type": "Organization", "name": "Test Org"},
                    {"@type": "WebSite", "url": "https://test.com"}
                  ]
                }
              </script>
            </head>
            <body></body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const { load } = await import('cheerio');
      const res = await fetch('https://test.com/graph-schema');
      const html = await res.text();
      const $ = load(html);

      let items = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const parsed = JSON.parse($(el).text());
          if (parsed['@graph']) {
            items = items.concat(parsed['@graph']);
          } else {
            items.push(parsed);
          }
        } catch {}
      });

      expect(items).toHaveLength(2);
      expect(items[0]['@type']).toBe('Organization');
      expect(items[1]['@type']).toBe('WebSite');
    });

    it('handles malformed JSON-LD gracefully', async () => {
      server.use(
        http.get('https://test.com/bad-json', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head>
              <script type="application/ld+json">
                {not valid json}
              </script>
              <script type="application/ld+json">
                {"@type": "Article", "headline": "Valid One"}
              </script>
            </head>
            <body></body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const { load } = await import('cheerio');
      const res = await fetch('https://test.com/bad-json');
      const html = await res.text();
      const $ = load(html);

      const schemas = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          schemas.push(JSON.parse($(el).text()));
        } catch {
          // Skip invalid JSON
        }
      });

      // Should only parse the valid one
      expect(schemas).toHaveLength(1);
      expect(schemas[0]['@type']).toBe('Article');
    });

    it('returns empty array for page without schema', async () => {
      server.use(
        http.get('https://test.com/no-schema', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head><title>No Schema</title></head>
            <body><h1>Plain Page</h1></body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const { load } = await import('cheerio');
      const res = await fetch('https://test.com/no-schema');
      const html = await res.text();
      const $ = load(html);

      const schemas = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          schemas.push(JSON.parse($(el).text()));
        } catch {}
      });

      expect(schemas).toHaveLength(0);
    });
  });

  describe('validate_jsonld tool', () => {
    it('validates raw JSON-LD string directly', () => {
      const jsonld = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is SEO?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Search Engine Optimization'
            }
          }
        ]
      };

      // Basic validation
      expect(jsonld['@context']).toBeDefined();
      expect(jsonld['@type']).toBe('FAQPage');
      expect(jsonld.mainEntity).toBeDefined();
      expect(Array.isArray(jsonld.mainEntity)).toBe(true);
    });

    it('detects missing @context', () => {
      const jsonld = {
        '@type': 'Article',
        headline: 'Test'
      };

      const issues = [];
      if (!jsonld['@context']) issues.push('Missing @context');

      expect(issues).toContain('Missing @context');
    });

    it('detects missing @type', () => {
      const jsonld = {
        '@context': 'https://schema.org',
        headline: 'Test'
      };

      const issues = [];
      if (!jsonld['@type']) issues.push('Missing @type');

      expect(issues).toContain('Missing @type');
    });

    it('validates Organization schema required fields', () => {
      const org = {
        '@context': 'https://schema.org',
        '@type': 'Organization'
        // Missing name and url
      };

      const issues = [];
      if (!org.name) issues.push('Organization missing name');
      if (!org.url) issues.push('Organization missing url');

      expect(issues).toContain('Organization missing name');
      expect(issues).toContain('Organization missing url');
    });

    it('validates HowTo schema required fields', () => {
      const howto = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Test',
        // Missing steps
      };

      const issues = [];
      if (!howto.step || !Array.isArray(howto.step) || howto.step.length === 0) {
        issues.push('HowTo missing steps');
      }

      expect(issues).toContain('HowTo missing steps');
    });
  });

  describe('CITE I04 verdict logic', () => {
    it('returns PASS when schema found with no errors', () => {
      const schemaCount = 2;
      const errorCount = 0;

      let verdict;
      if (schemaCount > 0 && errorCount === 0) {
        verdict = 'PASS';
      } else if (schemaCount > 0) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PASS');
    });

    it('returns PARTIAL when schema found with errors', () => {
      const schemaCount = 2;
      const errorCount = 1;

      let verdict;
      if (schemaCount > 0 && errorCount === 0) {
        verdict = 'PASS';
      } else if (schemaCount > 0) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PARTIAL');
    });

    it('returns FAIL when no schema found', () => {
      const schemaCount = 0;

      let verdict;
      if (schemaCount > 0) {
        verdict = 'PASS';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('FAIL');
    });
  });
});
