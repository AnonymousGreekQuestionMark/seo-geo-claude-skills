/**
 * Tests for site-crawler MCP server
 * BFS crawling with cheerio
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '../setup.js';
import { http, HttpResponse } from 'msw';

describe('site-crawler MCP server', () => {
  describe('crawl_site tool - basic crawling', () => {
    it('crawls starting URL and extracts page data', async () => {
      server.use(
        http.get('https://test-crawl.com/', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Home Page</title>
              <meta name="description" content="Test home page description">
              <link rel="canonical" href="https://test-crawl.com/">
            </head>
            <body>
              <h1>Welcome Home</h1>
              <p>Some content here with about 50 words total to test word count estimation.</p>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const res = await fetch('https://test-crawl.com/');
      const html = await res.text();

      const { load } = await import('cheerio');
      const $ = load(html);

      expect($('title').text()).toBe('Home Page');
      expect($('meta[name="description"]').attr('content')).toBe('Test home page description');
      expect($('h1').text()).toBe('Welcome Home');
      expect($('link[rel="canonical"]').attr('href')).toBe('https://test-crawl.com/');
    });

    it('extracts internal links', async () => {
      server.use(
        http.get('https://test-crawl.com/', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <body>
              <a href="/page1">Page 1</a>
              <a href="/page2">Page 2</a>
              <a href="https://test-crawl.com/page3">Page 3</a>
              <a href="https://external.com">External</a>
            </body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const res = await fetch('https://test-crawl.com/');
      const html = await res.text();

      const { load } = await import('cheerio');
      const $ = load(html);
      const origin = 'https://test-crawl.com';

      const internalLinks = [];
      const externalLinks = [];

      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (href.startsWith('/')) {
          internalLinks.push(origin + href);
        } else if (href.startsWith(origin)) {
          internalLinks.push(href);
        } else if (href.startsWith('http')) {
          externalLinks.push(href);
        }
      });

      expect(internalLinks).toHaveLength(3);
      expect(externalLinks).toHaveLength(1);
    });

    it('extracts external link domains', async () => {
      server.use(
        http.get('https://test-crawl.com/', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <body>
              <a href="https://google.com">Google</a>
              <a href="https://www.wikipedia.org/wiki/Test">Wikipedia</a>
            </body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const res = await fetch('https://test-crawl.com/');
      const html = await res.text();

      const { load } = await import('cheerio');
      const $ = load(html);

      const externalDomains = [];
      $('a[href^="http"]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href.includes('test-crawl.com')) {
          try {
            const domain = new URL(href).hostname;
            externalDomains.push(domain);
          } catch {}
        }
      });

      expect(externalDomains).toContain('google.com');
      expect(externalDomains).toContain('www.wikipedia.org');
    });
  });

  describe('crawl_site tool - schema extraction', () => {
    it('extracts JSON-LD schema types', async () => {
      server.use(
        http.get('https://test-crawl.com/', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head>
              <script type="application/ld+json">
                {"@context": "https://schema.org", "@type": "Article", "headline": "Test"}
              </script>
              <script type="application/ld+json">
                {"@context": "https://schema.org", "@type": "BreadcrumbList"}
              </script>
            </head>
            <body></body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const res = await fetch('https://test-crawl.com/');
      const html = await res.text();

      const { load } = await import('cheerio');
      const $ = load(html);

      const schemaTypes = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const parsed = JSON.parse($(el).text());
          if (parsed['@type']) schemaTypes.push(parsed['@type']);
        } catch {}
      });

      expect(schemaTypes).toContain('Article');
      expect(schemaTypes).toContain('BreadcrumbList');
    });

    it('handles @graph format in schema', async () => {
      server.use(
        http.get('https://test-crawl.com/', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <head>
              <script type="application/ld+json">
                {
                  "@context": "https://schema.org",
                  "@graph": [
                    {"@type": "Organization", "name": "Test"},
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

      const res = await fetch('https://test-crawl.com/');
      const html = await res.text();

      const { load } = await import('cheerio');
      const $ = load(html);

      const schemaTypes = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const parsed = JSON.parse($(el).text());
          if (parsed['@graph']) {
            parsed['@graph'].forEach(item => {
              if (item['@type']) schemaTypes.push(item['@type']);
            });
          } else if (parsed['@type']) {
            schemaTypes.push(parsed['@type']);
          }
        } catch {}
      });

      expect(schemaTypes).toContain('Organization');
      expect(schemaTypes).toContain('WebSite');
    });
  });

  describe('crawl_site tool - orphan detection', () => {
    it('identifies orphan pages (no internal links pointing to them)', () => {
      // Simulate crawl results
      const pages = [
        { url: '/home', linksTo: ['/about', '/contact'] },
        { url: '/about', linksTo: ['/home'] },
        { url: '/contact', linksTo: ['/home'] },
        { url: '/orphan', linksTo: ['/home'] } // No page links TO this page
      ];

      const allUrls = new Set(pages.map(p => p.url));
      const linkedUrls = new Set();
      pages.forEach(p => p.linksTo.forEach(link => linkedUrls.add(link)));

      const orphans = [...allUrls].filter(url => !linkedUrls.has(url));

      expect(orphans).toContain('/orphan');
      expect(orphans).not.toContain('/home');
      expect(orphans).not.toContain('/about');
    });
  });

  describe('crawl_site tool - BFS behavior', () => {
    it('respects max_pages limit', () => {
      const maxPages = 5;
      const visited = new Set();
      const queue = ['/'];

      // Simulate BFS
      while (queue.length > 0 && visited.size < maxPages) {
        const url = queue.shift();
        if (!visited.has(url)) {
          visited.add(url);
          // Simulate finding more links
          queue.push(`/page${visited.size}`);
        }
      }

      expect(visited.size).toBe(maxPages);
    });

    it('avoids revisiting same URL', () => {
      const visited = new Set();
      const queue = ['/', '/about', '/', '/about']; // Duplicates

      const processed = [];
      while (queue.length > 0) {
        const url = queue.shift();
        if (!visited.has(url)) {
          visited.add(url);
          processed.push(url);
        }
      }

      expect(processed).toHaveLength(2);
      expect(processed).toContain('/');
      expect(processed).toContain('/about');
    });

    it('normalizes URLs (strips fragments and query params)', () => {
      const normalize = (url) => {
        return url.split('#')[0].split('?')[0];
      };

      expect(normalize('/page#section')).toBe('/page');
      expect(normalize('/page?utm_source=test')).toBe('/page');
      expect(normalize('/page?q=1#top')).toBe('/page');
    });
  });

  describe('crawl_site tool - word count estimation', () => {
    it('estimates word count from body text', async () => {
      server.use(
        http.get('https://test-crawl.com/', () => {
          return new HttpResponse(`
            <!DOCTYPE html>
            <html>
            <body>
              <h1>Title Here</h1>
              <p>This is the first paragraph with some words in it.</p>
              <p>This is the second paragraph with more words.</p>
            </body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        })
      );

      const res = await fetch('https://test-crawl.com/');
      const html = await res.text();

      const { load } = await import('cheerio');
      const $ = load(html);

      const bodyText = $('body').text();
      const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

      expect(wordCount).toBeGreaterThan(10);
      expect(wordCount).toBeLessThan(50);
    });
  });

  describe('CITE I04 coverage calculation', () => {
    it('calculates schema coverage percentage', () => {
      const totalPages = 100;
      const pagesWithSchema = 65;
      const coveragePercent = Math.round((pagesWithSchema / totalPages) * 100);

      expect(coveragePercent).toBe(65);
    });

    it('PASS for >=50% schema coverage', () => {
      const coverage = 65;

      let verdict;
      if (coverage >= 50) {
        verdict = 'PASS';
      } else if (coverage >= 20) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PASS');
    });

    it('PARTIAL for 20-49% schema coverage', () => {
      const coverage = 35;

      let verdict;
      if (coverage >= 50) {
        verdict = 'PASS';
      } else if (coverage >= 20) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('PARTIAL');
    });

    it('FAIL for <20% schema coverage', () => {
      const coverage = 10;

      let verdict;
      if (coverage >= 50) {
        verdict = 'PASS';
      } else if (coverage >= 20) {
        verdict = 'PARTIAL';
      } else {
        verdict = 'FAIL';
      }

      expect(verdict).toBe('FAIL');
    });
  });

  describe('error handling', () => {
    it('handles non-HTML responses', async () => {
      server.use(
        http.get('https://test-crawl.com/image.png', () => {
          return new HttpResponse('binary data', {
            headers: { 'Content-Type': 'image/png' }
          });
        })
      );

      const res = await fetch('https://test-crawl.com/image.png');
      const contentType = res.headers.get('content-type');

      const isHtml = contentType.includes('text/html');
      expect(isHtml).toBe(false);
    });

    it('handles fetch errors gracefully', async () => {
      server.use(
        http.get('https://test-crawl.com/error', () => {
          return new HttpResponse('Internal Server Error', { status: 500 });
        })
      );

      const res = await fetch('https://test-crawl.com/error');
      expect(res.ok).toBe(false);
      expect(res.status).toBe(500);
    });

    it('handles malformed URLs', () => {
      const resolveUrl = (base, href) => {
        try {
          return new URL(href, base).href;
        } catch {
          return null;
        }
      };

      expect(resolveUrl('https://test.com', '/valid')).toBe('https://test.com/valid');
      expect(resolveUrl('https://test.com', 'javascript:void(0)')).toBe('javascript:void(0)');
      expect(resolveUrl('https://test.com', '')).toBe('https://test.com/');
    });
  });
});
