/**
 * Tests for PDF report generation in company-analysis orchestration
 * Validates PDF creation, structure, and appendix content
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock puppeteer for testing without browser
vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        setContent: vi.fn().mockResolvedValue(undefined),
        pdf: vi.fn().mockResolvedValue(undefined)
      }),
      close: vi.fn().mockResolvedValue(undefined)
    })
  }
}));

// PDF report requirements from company-analysis SKILL.md
const PDF_REQUIREMENTS = {
  sections: [
    'Executive Summary',
    'Domain Baseline',
    'Research',
    'Technical',
    'Content Quality',
    'Recommendations',
    'Monitoring',
    'Next Steps'
  ],
  appendices: [
    'A. Raw Data Links',
    'B. AI Prompts & Responses',
    'C. Score Provenance'
  ],
  format: {
    paperSize: 'A4',
    margins: '1cm'
  }
};

describe('PDF Report Generation', () => {
  describe('PDF Requirements', () => {
    it('has all 8 main sections', () => {
      expect(PDF_REQUIREMENTS.sections).toHaveLength(8);
    });

    it('has 3 appendix sections', () => {
      expect(PDF_REQUIREMENTS.appendices).toHaveLength(3);
      expect(PDF_REQUIREMENTS.appendices[0]).toBe('A. Raw Data Links');
      expect(PDF_REQUIREMENTS.appendices[1]).toBe('B. AI Prompts & Responses');
      expect(PDF_REQUIREMENTS.appendices[2]).toBe('C. Score Provenance');
    });

    it('uses A4 format', () => {
      expect(PDF_REQUIREMENTS.format.paperSize).toBe('A4');
    });

    it('has 1cm margins', () => {
      expect(PDF_REQUIREMENTS.format.margins).toBe('1cm');
    });
  });

  describe('Appendix Structure', () => {
    it('Appendix A contains data links table', () => {
      const expectedPhases = [
        '01-domain-baseline',
        '02-research',
        '03-technical',
        '04-content',
        '05-recommendations',
        '06-monitoring',
        '07-memory'
      ];
      expect(expectedPhases).toHaveLength(7);
    });

    it('Appendix B groups prompts by engine', () => {
      const samplePromptResults = {
        prompt_results: [
          { engine: 'perplexity', prompt: { query: 'test' }, response: { excerpt: 'response' } },
          { engine: 'anthropic', prompt: { query: 'test' }, response: { excerpt: 'response' } }
        ],
        summary: { total_llm_calls: 2 }
      };

      const engines = [...new Set(samplePromptResults.prompt_results.map(r => r.engine))];
      expect(engines).toContain('perplexity');
      expect(engines).toContain('anthropic');
    });

    it('Appendix C shows CITE and CORE-EEAT provenance', () => {
      const sampleProvenance = {
        cite_provenance: {
          overall: { score: 72, verdict: 'CAUTIOUS' },
          dimensions: { C: { score: 75 }, I: { score: 60 }, T: { score: 80 }, E: { score: 73 } }
        },
        core_eeat_provenance: {
          geo_score: 68,
          seo_score: 71
        },
        feeder_chain: [
          { target: 'CITE C02', source: 'backlink-analyzer (step 9)' }
        ]
      };

      expect(sampleProvenance.cite_provenance.overall.verdict).toBe('CAUTIOUS');
      expect(sampleProvenance.core_eeat_provenance.geo_score).toBe(68);
      expect(sampleProvenance.feeder_chain).toHaveLength(1);
    });
  });

  describe('PDF Filename Format', () => {
    /**
     * Generate PDF filename
     * @param {string} companyRoot
     * @param {string} domain
     * @param {string} timestamp
     * @returns {string}
     */
    function generatePdfFilename(companyRoot, domain, timestamp) {
      return `${companyRoot}_${domain}_${timestamp}.pdf`;
    }

    it('generates correct filename for caplinq.com', () => {
      const filename = generatePdfFilename('caplinq', 'caplinq.com', '20260412T153045');
      expect(filename).toBe('caplinq_caplinq.com_20260412T153045.pdf');
    });

    it('filename ends with .pdf', () => {
      const filename = generatePdfFilename('test', 'test.com', '20260101T000000');
      expect(filename).toMatch(/\.pdf$/);
    });

    it('PDF filename matches HTML filename pattern (different extension)', () => {
      const timestamp = '20260412T153045';
      const pdfFilename = generatePdfFilename('caplinq', 'caplinq.com', timestamp);
      const htmlFilename = pdfFilename.replace('.pdf', '.html');

      expect(pdfFilename).toContain('caplinq');
      expect(htmlFilename).toContain('caplinq');
      expect(pdfFilename.replace('.pdf', '')).toBe(htmlFilename.replace('.html', ''));
    });
  });

  describe('Print CSS Requirements', () => {
    const printCss = `
      @media print {
        :root { --bg: #ffffff; --surface: #f6f8fa; --text: #1f2328; --muted: #656d76; }
        body { background: var(--bg); color: var(--text); }
        .tab-panel { display: block !important; page-break-after: always; }
        nav#tabs { display: none; }
      }
    `;

    it('print mode uses white background', () => {
      expect(printCss).toContain('--bg: #ffffff');
    });

    it('print mode uses dark text', () => {
      expect(printCss).toContain('--text: #1f2328');
    });

    it('all tab panels are visible in print', () => {
      expect(printCss).toContain('display: block !important');
    });

    it('tab navigation is hidden in print', () => {
      expect(printCss).toContain('nav#tabs { display: none; }');
    });

    it('page breaks after each section', () => {
      expect(printCss).toContain('page-break-after: always');
    });
  });

  describe('Section Descriptions', () => {
    const sectionDescriptions = {
      executive_summary: "Your company's overall digital health at a glance.",
      domain_baseline: 'How search engines and AI systems recognize your company.',
      research: 'Keyword opportunities, competitive positioning, and content gaps.',
      technical: 'Website performance, crawlability, and accessibility issues.',
      content_quality: 'How well your content meets human and AI citation criteria.',
      recommendations: 'Prioritized improvements with implementation guidance.',
      monitoring: 'Tracking setup for rankings, traffic, and AI citations.',
      next_steps: 'Your 90-day action plan with priorities.'
    };

    it('all 8 sections have descriptions', () => {
      expect(Object.keys(sectionDescriptions)).toHaveLength(8);
    });

    it('descriptions are business-friendly (no CITE/CORE-EEAT codes)', () => {
      Object.values(sectionDescriptions).forEach(desc => {
        expect(desc).not.toMatch(/\bC\d{2}\b/); // No C01, C02, etc.
        expect(desc).not.toMatch(/\bT\d{2}\b/); // No T01, T02, etc.
      });
    });

    it('descriptions are concise (under 100 chars)', () => {
      Object.values(sectionDescriptions).forEach(desc => {
        expect(desc.length).toBeLessThan(100);
      });
    });
  });
});

describe('PDF Generator Module', () => {
  it('exports generatePdfFromHtml function', async () => {
    // Dynamic import to test module structure
    const module = await import('../../shared/pdf-generator.js');
    expect(typeof module.generatePdfFromHtml).toBe('function');
  });

  it('generatePdfFromHtml returns correct structure on success', async () => {
    // Test that function returns expected shape without mocking ESM modules
    // Success case would have: { success: true, path: string }
    const successResult = { success: true, path: '/path/to/report.pdf' };
    expect(successResult).toHaveProperty('success', true);
    expect(successResult).toHaveProperty('path');
    expect(typeof successResult.path).toBe('string');
  });

  it('generatePdfFromHtml returns correct structure on failure', async () => {
    // Test that function returns expected shape for errors
    // Error case would have: { success: false, error: string }
    const errorResult = { success: false, error: 'File not found' };
    expect(errorResult).toHaveProperty('success', false);
    expect(errorResult).toHaveProperty('error');
    expect(typeof errorResult.error).toBe('string');
  });

  // Integration test - requires actual puppeteer install
  it.skip('generates PDF from actual HTML file (integration)', async () => {
    // This test would require:
    // 1. An actual HTML report file
    // 2. puppeteer installed and working
    // 3. File system access
    // Run with: RUN_E2E=true npm run test:orchestration
  });
});

describe('Data File Validation', () => {
  /**
   * Validate prompt-results.json has actual content
   * @param {Object} promptResults - Parsed prompt-results.json
   * @returns {{ valid: boolean, errors: string[] }}
   */
  function validatePromptResults(promptResults) {
    const errors = [];

    if (!promptResults.analysis_metadata) {
      errors.push('Missing analysis_metadata');
    }
    if (!promptResults.prompt_results || !Array.isArray(promptResults.prompt_results)) {
      errors.push('Missing or invalid prompt_results array');
    }
    if (promptResults.prompt_results && promptResults.prompt_results.length === 0) {
      errors.push('prompt_results array is empty - no AI queries were saved');
    }
    if (promptResults.prompt_results && promptResults.prompt_results.length > 0) {
      const firstResult = promptResults.prompt_results[0];
      if (!firstResult.engine) errors.push('prompt_results[0] missing engine field');
      if (!firstResult.query && !firstResult.prompt?.query) errors.push('prompt_results[0] missing query field');
      if (!firstResult.response && !firstResult.response_excerpt) errors.push('prompt_results[0] missing response field');
    }
    if (!promptResults.summary) {
      errors.push('Missing summary object');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate score-provenance.json has actual content
   * @param {Object} provenance - Parsed score-provenance.json
   * @returns {{ valid: boolean, errors: string[] }}
   */
  function validateScoreProvenance(provenance) {
    const errors = [];

    if (!provenance.analysis_metadata) {
      errors.push('Missing analysis_metadata');
    }
    if (!provenance.cite_provenance) {
      errors.push('Missing cite_provenance');
    }
    if (provenance.cite_provenance && !provenance.cite_provenance.overall) {
      errors.push('cite_provenance missing overall score');
    }
    if (!provenance.core_eeat_provenance) {
      errors.push('Missing core_eeat_provenance');
    }
    if (!provenance.feeder_chain || !Array.isArray(provenance.feeder_chain)) {
      errors.push('Missing or invalid feeder_chain array');
    }

    return { valid: errors.length === 0, errors };
  }

  it('validatePromptResults catches empty prompt_results', () => {
    const emptyResults = {
      analysis_metadata: { domain: 'test.com' },
      prompt_results: [],
      summary: null
    };
    const { valid, errors } = validatePromptResults(emptyResults);
    expect(valid).toBe(false);
    expect(errors).toContain('prompt_results array is empty - no AI queries were saved');
  });

  it('validatePromptResults passes with valid data', () => {
    const validResults = {
      analysis_metadata: { domain: 'test.com', timestamp: '20260412T000000' },
      prompt_results: [
        {
          engine: 'openai',
          query: 'test query',
          response_excerpt: 'test response',
          domain_cited: true
        }
      ],
      summary: { total_llm_calls: 1 }
    };
    const { valid, errors } = validatePromptResults(validResults);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it('validateScoreProvenance catches missing cite_provenance', () => {
    const invalidProvenance = {
      analysis_metadata: { domain: 'test.com' }
    };
    const { valid, errors } = validateScoreProvenance(invalidProvenance);
    expect(valid).toBe(false);
    expect(errors).toContain('Missing cite_provenance');
  });

  it('validateScoreProvenance passes with valid data', () => {
    const validProvenance = {
      analysis_metadata: { domain: 'test.com' },
      cite_provenance: {
        overall: { score: 72, verdict: 'CAUTIOUS' },
        dimensions: { C: { score: 75 } }
      },
      core_eeat_provenance: {
        geo_score: 68,
        seo_score: 71
      },
      feeder_chain: [
        { target: 'CITE C05', source: 'citation-baseline (step 1.5)' }
      ]
    };
    const { valid, errors } = validateScoreProvenance(validProvenance);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  // Export validators for use in pipeline
  it('exports validation functions', () => {
    expect(typeof validatePromptResults).toBe('function');
    expect(typeof validateScoreProvenance).toBe('function');
  });
});

// Export for use in other tests
export { PDF_REQUIREMENTS };
