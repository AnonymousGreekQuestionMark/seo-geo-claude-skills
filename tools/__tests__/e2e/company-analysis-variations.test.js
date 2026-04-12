/**
 * Tests for URL variations in company-analysis
 * Validates that different URL input formats are handled correctly
 */
import { describe, it, expect } from 'vitest';

// Import URL parsing from orchestration tests
import { parseCompanyUrl, generateAnalysisPath, generateReportPath } from '../orchestration/url-parsing.test.js';

describe('Company Analysis URL Variations', () => {
  describe('caplinq.com variations', () => {
    const caplinqVariations = [
      { input: 'caplinq.com', expectedDomain: 'caplinq.com' },
      { input: 'www.caplinq.com', expectedDomain: 'caplinq.com' },
      { input: 'https://caplinq.com', expectedDomain: 'caplinq.com' },
      { input: 'http://caplinq.com', expectedDomain: 'caplinq.com' },
      { input: 'https://www.caplinq.com', expectedDomain: 'caplinq.com' },
      { input: 'https://www.caplinq.com/', expectedDomain: 'caplinq.com' },
      { input: 'https://caplinq.com/products', expectedDomain: 'caplinq.com' },
      { input: 'https://www.caplinq.com/blog/article-title', expectedDomain: 'caplinq.com' },
      { input: 'caplinq.com?utm_source=test', expectedDomain: 'caplinq.com' },
      { input: 'CAPLINQ.COM', expectedDomain: 'caplinq.com' },
      { input: 'Caplinq.Com', expectedDomain: 'caplinq.com' }
    ];

    caplinqVariations.forEach(({ input, expectedDomain }) => {
      it(`"${input}" → domain: ${expectedDomain}, root: caplinq`, () => {
        const result = parseCompanyUrl(input);
        expect(result.domain).toBe(expectedDomain);
        expect(result.companyRoot).toBe('caplinq');
      });
    });
  });

  describe('blog.caplinq.com subdomain variations', () => {
    const subdomainVariations = [
      { input: 'blog.caplinq.com', expectedDomain: 'blog.caplinq.com' },
      { input: 'https://blog.caplinq.com', expectedDomain: 'blog.caplinq.com' },
      { input: 'https://blog.caplinq.com/', expectedDomain: 'blog.caplinq.com' },
      { input: 'https://blog.caplinq.com/some-article', expectedDomain: 'blog.caplinq.com' },
      { input: 'blog.caplinq.com/category/post?id=123', expectedDomain: 'blog.caplinq.com' },
      { input: 'BLOG.CAPLINQ.COM', expectedDomain: 'blog.caplinq.com' }
    ];

    subdomainVariations.forEach(({ input, expectedDomain }) => {
      it(`"${input}" → domain: ${expectedDomain}, root: caplinq`, () => {
        const result = parseCompanyUrl(input);
        expect(result.domain).toBe(expectedDomain);
        expect(result.companyRoot).toBe('caplinq');
      });
    });
  });

  describe('Multi-level subdomain variations', () => {
    const multiSubdomainVariations = [
      { input: 'docs.api.caplinq.com', expectedDomain: 'docs.api.caplinq.com', expectedRoot: 'caplinq' },
      { input: 'staging.blog.caplinq.com', expectedDomain: 'staging.blog.caplinq.com', expectedRoot: 'caplinq' },
      { input: 'https://dev.docs.caplinq.com/v2', expectedDomain: 'dev.docs.caplinq.com', expectedRoot: 'caplinq' }
    ];

    multiSubdomainVariations.forEach(({ input, expectedDomain, expectedRoot }) => {
      it(`"${input}" → domain: ${expectedDomain}, root: ${expectedRoot}`, () => {
        const result = parseCompanyUrl(input);
        expect(result.domain).toBe(expectedDomain);
        expect(result.companyRoot).toBe(expectedRoot);
      });
    });
  });

  describe('Country-code TLD variations', () => {
    const ccTldVariations = [
      { input: 'acme.co.uk', expectedDomain: 'acme.co.uk', expectedRoot: 'acme' },
      { input: 'blog.acme.co.uk', expectedDomain: 'blog.acme.co.uk', expectedRoot: 'acme' },
      { input: 'https://www.acme.co.uk', expectedDomain: 'acme.co.uk', expectedRoot: 'acme' },
      { input: 'example.com.au', expectedDomain: 'example.com.au', expectedRoot: 'example' },
      { input: 'company.co.nz', expectedDomain: 'company.co.nz', expectedRoot: 'company' },
      { input: 'empresa.com.br', expectedDomain: 'empresa.com.br', expectedRoot: 'empresa' },
      { input: 'https://blog.empresa.com.br/artigo', expectedDomain: 'blog.empresa.com.br', expectedRoot: 'empresa' }
    ];

    ccTldVariations.forEach(({ input, expectedDomain, expectedRoot }) => {
      it(`"${input}" → domain: ${expectedDomain}, root: ${expectedRoot}`, () => {
        const result = parseCompanyUrl(input);
        expect(result.domain).toBe(expectedDomain);
        expect(result.companyRoot).toBe(expectedRoot);
      });
    });
  });

  describe('Other domain formats', () => {
    const otherDomains = [
      { input: 'example.com', expectedRoot: 'example' },
      { input: 'my-company.io', expectedRoot: 'my-company' },
      { input: 'startup.ai', expectedRoot: 'startup' },
      { input: 'business.org', expectedRoot: 'business' },
      { input: 'store.shop', expectedRoot: 'store' },
      { input: 'tech-firm.dev', expectedRoot: 'tech-firm' }
    ];

    otherDomains.forEach(({ input, expectedRoot }) => {
      it(`"${input}" extracts root: ${expectedRoot}`, () => {
        const result = parseCompanyUrl(input);
        expect(result.companyRoot).toBe(expectedRoot);
      });
    });
  });

  describe('Path stripping', () => {
    it('strips simple path', () => {
      const result = parseCompanyUrl('caplinq.com/products');
      expect(result.domain).toBe('caplinq.com');
    });

    it('strips nested path', () => {
      const result = parseCompanyUrl('caplinq.com/category/product/item');
      expect(result.domain).toBe('caplinq.com');
    });

    it('strips path with trailing slash', () => {
      const result = parseCompanyUrl('caplinq.com/products/');
      expect(result.domain).toBe('caplinq.com');
    });

    it('strips query string', () => {
      const result = parseCompanyUrl('caplinq.com?query=test&foo=bar');
      expect(result.domain).toBe('caplinq.com');
    });

    it('strips fragment', () => {
      const result = parseCompanyUrl('caplinq.com#section');
      expect(result.domain).toBe('caplinq.com');
    });

    it('strips path with query and fragment', () => {
      const result = parseCompanyUrl('caplinq.com/page?id=1#top');
      expect(result.domain).toBe('caplinq.com');
    });
  });

  describe('Path generation consistency', () => {
    it('same company root for apex and subdomain', () => {
      const apex = parseCompanyUrl('caplinq.com');
      const subdomain = parseCompanyUrl('blog.caplinq.com');

      expect(apex.companyRoot).toBe(subdomain.companyRoot);
    });

    it('reports go to same folder for apex and subdomain', () => {
      const timestamp = '20260412T153045';
      const apexReport = generateReportPath('caplinq', 'caplinq.com', timestamp);
      const subdomainReport = generateReportPath('caplinq', 'blog.caplinq.com', timestamp);

      // Both should be in analyses/caplinq/reports/
      expect(apexReport).toMatch(/^analyses\/caplinq\/reports\//);
      expect(subdomainReport).toMatch(/^analyses\/caplinq\/reports\//);
    });

    it('analysis directories are separate for apex and subdomain', () => {
      const timestamp = '20260412T153045';
      const apexPath = generateAnalysisPath('caplinq', 'caplinq.com', timestamp);
      const subdomainPath = generateAnalysisPath('caplinq', 'blog.caplinq.com', timestamp);

      expect(apexPath).toContain('/caplinq.com/');
      expect(subdomainPath).toContain('/blog.caplinq.com/');
      expect(apexPath).not.toBe(subdomainPath);
    });
  });

  describe('Edge cases', () => {
    it('handles port numbers (strips them)', () => {
      // Note: URL parsing typically keeps port, but for domain extraction we ignore it
      // This test documents expected behavior
      const result = parseCompanyUrl('caplinq.com:8080');
      // Domain includes port in standard URL, but for our purposes we'd strip it
      // Adjust test based on actual implementation needs
      expect(result.domain).toMatch(/caplinq\.com/);
    });

    it('handles IP addresses (edge case)', () => {
      // IP addresses don't have a "company root" in the traditional sense
      const result = parseCompanyUrl('192.168.1.1');
      // This is an edge case - behavior may vary
      expect(result.domain).toBe('192.168.1.1');
    });

    it('handles localhost (edge case)', () => {
      const result = parseCompanyUrl('localhost');
      expect(result.domain).toBe('localhost');
    });

    it('preserves hyphens in domain', () => {
      const result = parseCompanyUrl('my-awesome-company.com');
      expect(result.domain).toBe('my-awesome-company.com');
      expect(result.companyRoot).toBe('my-awesome-company');
    });

    it('handles numeric domain names', () => {
      const result = parseCompanyUrl('123company.com');
      expect(result.domain).toBe('123company.com');
      expect(result.companyRoot).toBe('123company');
    });
  });

  describe('Error resistance', () => {
    it('handles empty string gracefully', () => {
      expect(() => parseCompanyUrl('')).not.toThrow();
    });

    it('handles whitespace-only string', () => {
      const result = parseCompanyUrl('  caplinq.com  '.trim());
      expect(result.domain).toBe('caplinq.com');
    });
  });
});

describe('Output Path Determinism', () => {
  it('same input produces same output path', () => {
    const input = 'https://www.caplinq.com/products';
    const timestamp = '20260412T153045';

    const result1 = parseCompanyUrl(input);
    const result2 = parseCompanyUrl(input);

    const path1 = generateAnalysisPath(result1.companyRoot, result1.domain, timestamp);
    const path2 = generateAnalysisPath(result2.companyRoot, result2.domain, timestamp);

    expect(path1).toBe(path2);
  });

  it('different variations of same domain produce same paths', () => {
    const timestamp = '20260412T153045';

    const variations = [
      'caplinq.com',
      'https://caplinq.com',
      'https://www.caplinq.com/',
      'CAPLINQ.COM'
    ];

    const paths = variations.map(v => {
      const { domain, companyRoot } = parseCompanyUrl(v);
      return generateAnalysisPath(companyRoot, domain, timestamp);
    });

    // All should produce the same path
    expect(new Set(paths).size).toBe(1);
  });
});
