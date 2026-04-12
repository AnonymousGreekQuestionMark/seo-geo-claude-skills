/**
 * Tests for URL parsing logic in company-analysis orchestration
 * Validates domain extraction, company root derivation, and path generation
 */
import { describe, it, expect } from 'vitest';

// URL Parsing Logic from company-analysis SKILL.md:
// 1. Strip scheme (https://, http://)
// 2. Strip trailing path and query string
// 3. Strip leading "www." if present
// 4. Full domain = remaining hostname
// 5. Company root = apex domain without TLD suffix
// 6. Timestamp = YYYYMMDDTHHmmss

/**
 * Parse a company URL and extract domain info
 * @param {string} input - URL or domain string
 * @returns {{ domain: string, companyRoot: string }}
 */
function parseCompanyUrl(input) {
  // Step 1: Strip scheme
  let cleaned = input.replace(/^https?:\/\//, '');

  // Step 2: Strip trailing path and query string
  cleaned = cleaned.split('/')[0].split('?')[0].split('#')[0];

  // Step 3: Strip leading "www."
  cleaned = cleaned.replace(/^www\./, '');

  const domain = cleaned.toLowerCase();

  // Step 5: Extract company root (apex domain without TLD)
  // Handle multi-part TLDs like .co.uk, .com.au
  const parts = domain.split('.');
  let companyRoot;

  // Common two-part TLDs
  const twoPartTlds = ['co.uk', 'com.au', 'co.nz', 'co.jp', 'com.br', 'co.in', 'org.uk'];
  const lastTwoParts = parts.slice(-2).join('.');

  if (twoPartTlds.includes(lastTwoParts) && parts.length > 2) {
    // For blog.acme.co.uk → companyRoot = "acme"
    companyRoot = parts[parts.length - 3];
  } else if (parts.length > 1) {
    // For blog.caplinq.com → companyRoot = "caplinq"
    // For caplinq.com → companyRoot = "caplinq"
    companyRoot = parts[parts.length - 2];
  } else {
    companyRoot = parts[0];
  }

  return { domain, companyRoot };
}

/**
 * Generate timestamp in YYYYMMDDTHHmmss format
 * @param {Date} date
 * @returns {string}
 */
function generateTimestamp(date = new Date()) {
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
}

/**
 * Generate analysis path
 * @param {string} companyRoot
 * @param {string} domain
 * @param {string} timestamp
 * @returns {string}
 */
function generateAnalysisPath(companyRoot, domain, timestamp) {
  return `analyses/${companyRoot}/${domain}/analysis-${timestamp}`;
}

/**
 * Generate report path
 * @param {string} companyRoot
 * @param {string} domain
 * @param {string} timestamp
 * @returns {string}
 */
function generateReportPath(companyRoot, domain, timestamp) {
  return `analyses/${companyRoot}/reports/${companyRoot}_${domain}_${timestamp}.html`;
}

describe('URL Parsing', () => {
  describe('Basic domain extraction', () => {
    it('parses bare domain', () => {
      const result = parseCompanyUrl('caplinq.com');
      expect(result.domain).toBe('caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });

    it('strips https scheme', () => {
      const result = parseCompanyUrl('https://caplinq.com');
      expect(result.domain).toBe('caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });

    it('strips http scheme', () => {
      const result = parseCompanyUrl('http://caplinq.com');
      expect(result.domain).toBe('caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });

    it('strips www prefix', () => {
      const result = parseCompanyUrl('www.caplinq.com');
      expect(result.domain).toBe('caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });

    it('strips both scheme and www', () => {
      const result = parseCompanyUrl('https://www.caplinq.com');
      expect(result.domain).toBe('caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });

    it('strips trailing path', () => {
      const result = parseCompanyUrl('https://www.caplinq.com/blog/article');
      expect(result.domain).toBe('caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });

    it('strips query string', () => {
      const result = parseCompanyUrl('caplinq.com?utm_source=test');
      expect(result.domain).toBe('caplinq.com');
    });

    it('strips fragment', () => {
      const result = parseCompanyUrl('caplinq.com#section');
      expect(result.domain).toBe('caplinq.com');
    });

    it('normalizes to lowercase', () => {
      const result = parseCompanyUrl('CAPLINQ.COM');
      expect(result.domain).toBe('caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });
  });

  describe('Subdomain handling', () => {
    it('preserves subdomain in domain', () => {
      const result = parseCompanyUrl('blog.caplinq.com');
      expect(result.domain).toBe('blog.caplinq.com');
    });

    it('extracts company root from subdomain URL', () => {
      const result = parseCompanyUrl('blog.caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });

    it('handles multiple subdomains', () => {
      const result = parseCompanyUrl('docs.api.caplinq.com');
      expect(result.domain).toBe('docs.api.caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });

    it('handles www as subdomain correctly', () => {
      const result = parseCompanyUrl('https://www.blog.caplinq.com');
      expect(result.domain).toBe('blog.caplinq.com');
      expect(result.companyRoot).toBe('caplinq');
    });
  });

  describe('Multi-part TLD handling', () => {
    it('handles .co.uk TLD', () => {
      const result = parseCompanyUrl('acme.co.uk');
      expect(result.domain).toBe('acme.co.uk');
      expect(result.companyRoot).toBe('acme');
    });

    it('handles subdomain with .co.uk TLD', () => {
      const result = parseCompanyUrl('blog.acme.co.uk');
      expect(result.domain).toBe('blog.acme.co.uk');
      expect(result.companyRoot).toBe('acme');
    });

    it('handles .com.au TLD', () => {
      const result = parseCompanyUrl('example.com.au');
      expect(result.domain).toBe('example.com.au');
      expect(result.companyRoot).toBe('example');
    });

    it('handles .co.nz TLD', () => {
      const result = parseCompanyUrl('company.co.nz');
      expect(result.domain).toBe('company.co.nz');
      expect(result.companyRoot).toBe('company');
    });

    it('handles .com.br TLD', () => {
      const result = parseCompanyUrl('empresa.com.br');
      expect(result.domain).toBe('empresa.com.br');
      expect(result.companyRoot).toBe('empresa');
    });
  });

  describe('caplinq.com variations (canonical test domain)', () => {
    const variations = [
      'caplinq.com',
      'www.caplinq.com',
      'https://caplinq.com',
      'https://www.caplinq.com',
      'https://www.caplinq.com/',
      'blog.caplinq.com',
      'https://blog.caplinq.com/some-article',
      'CAPLINQ.COM',
      'http://caplinq.com/products?category=all#top'
    ];

    variations.forEach(input => {
      it(`extracts companyRoot "caplinq" from: ${input}`, () => {
        const result = parseCompanyUrl(input);
        expect(result.companyRoot).toBe('caplinq');
      });
    });
  });
});

describe('Timestamp Generation', () => {
  it('generates timestamp in correct format', () => {
    const timestamp = generateTimestamp(new Date('2026-04-12T15:30:45Z'));
    expect(timestamp).toBe('20260412T153045');
  });

  it('pads single-digit values', () => {
    const timestamp = generateTimestamp(new Date('2026-01-05T09:05:05Z'));
    expect(timestamp).toBe('20260105T090505');
  });

  it('matches expected pattern', () => {
    const timestamp = generateTimestamp();
    expect(timestamp).toMatch(/^\d{8}T\d{6}$/);
  });
});

describe('Path Generation', () => {
  describe('Analysis path', () => {
    it('generates correct analysis path for caplinq.com', () => {
      const path = generateAnalysisPath('caplinq', 'caplinq.com', '20260412T153045');
      expect(path).toBe('analyses/caplinq/caplinq.com/analysis-20260412T153045');
    });

    it('generates correct analysis path for subdomain', () => {
      const path = generateAnalysisPath('caplinq', 'blog.caplinq.com', '20260412T153045');
      expect(path).toBe('analyses/caplinq/blog.caplinq.com/analysis-20260412T153045');
    });

    it('generates correct analysis path for .co.uk domain', () => {
      const path = generateAnalysisPath('acme', 'acme.co.uk', '20260412T153045');
      expect(path).toBe('analyses/acme/acme.co.uk/analysis-20260412T153045');
    });
  });

  describe('Report path', () => {
    it('generates correct report path for caplinq.com', () => {
      const path = generateReportPath('caplinq', 'caplinq.com', '20260412T153045');
      expect(path).toBe('analyses/caplinq/reports/caplinq_caplinq.com_20260412T153045.html');
    });

    it('generates correct report path for subdomain', () => {
      const path = generateReportPath('caplinq', 'blog.caplinq.com', '20260412T153045');
      expect(path).toBe('analyses/caplinq/reports/caplinq_blog.caplinq.com_20260412T153045.html');
    });

    it('report filename includes .html extension', () => {
      const path = generateReportPath('caplinq', 'caplinq.com', '20260412T153045');
      expect(path).toMatch(/\.html$/);
    });
  });
});

describe('Full URL parsing flow', () => {
  it('full flow for caplinq.com', () => {
    const input = 'https://www.caplinq.com/products/';
    const { domain, companyRoot } = parseCompanyUrl(input);
    const timestamp = '20260412T153045';

    expect(domain).toBe('caplinq.com');
    expect(companyRoot).toBe('caplinq');
    expect(generateAnalysisPath(companyRoot, domain, timestamp))
      .toBe('analyses/caplinq/caplinq.com/analysis-20260412T153045');
    expect(generateReportPath(companyRoot, domain, timestamp))
      .toBe('analyses/caplinq/reports/caplinq_caplinq.com_20260412T153045.html');
  });

  it('full flow for blog.caplinq.com', () => {
    const input = 'blog.caplinq.com';
    const { domain, companyRoot } = parseCompanyUrl(input);
    const timestamp = '20260412T153045';

    expect(domain).toBe('blog.caplinq.com');
    expect(companyRoot).toBe('caplinq');
    expect(generateAnalysisPath(companyRoot, domain, timestamp))
      .toBe('analyses/caplinq/blog.caplinq.com/analysis-20260412T153045');
    expect(generateReportPath(companyRoot, domain, timestamp))
      .toBe('analyses/caplinq/reports/caplinq_blog.caplinq.com_20260412T153045.html');
  });

  it('full flow for acme.co.uk', () => {
    const input = 'https://acme.co.uk';
    const { domain, companyRoot } = parseCompanyUrl(input);
    const timestamp = '20260412T153045';

    expect(domain).toBe('acme.co.uk');
    expect(companyRoot).toBe('acme');
    expect(generateAnalysisPath(companyRoot, domain, timestamp))
      .toBe('analyses/acme/acme.co.uk/analysis-20260412T153045');
    expect(generateReportPath(companyRoot, domain, timestamp))
      .toBe('analyses/acme/reports/acme_acme.co.uk_20260412T153045.html');
  });
});

// Export functions for use in other tests
export { parseCompanyUrl, generateTimestamp, generateAnalysisPath, generateReportPath };
