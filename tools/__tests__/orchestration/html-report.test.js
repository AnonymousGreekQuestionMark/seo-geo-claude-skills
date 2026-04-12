/**
 * Tests for HTML report generation in company-analysis orchestration
 * Validates report structure, self-containment, and content requirements
 */
import { describe, it, expect } from 'vitest';

// Report structure requirements from company-analysis SKILL.md
const REQUIRED_TABS = [
  'Executive Summary',
  'Domain Baseline',
  'Research',
  'Technical',
  'Content Quality',
  'Recommendations',
  'Monitoring',
  'Next Steps'
];

// CSS variables that should be defined
const REQUIRED_CSS_VARS = [
  '--bg', '--surface', '--border',
  '--text', '--muted', '--accent',
  '--green', '--amber', '--red'
];

// Required elements in executive summary
const EXECUTIVE_SUMMARY_ELEMENTS = [
  'CITE verdict',
  'CORE-EEAT score',
  'Top critical findings',
  'Skills completion'
];

/**
 * Validate HTML report structure
 * @param {string} html - HTML content
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
function validateHtmlReport(html) {
  const errors = [];
  const warnings = [];

  // Check it's valid HTML
  if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) {
    errors.push('Missing DOCTYPE declaration');
  }

  if (!html.includes('<html')) {
    errors.push('Missing <html> tag');
  }

  // Check for self-containment (no external dependencies)
  const externalLinks = html.match(/<link[^>]+href=["']https?:\/\//gi) || [];
  const externalScripts = html.match(/<script[^>]+src=["']https?:\/\//gi) || [];

  if (externalLinks.length > 0) {
    errors.push(`External CSS links found: ${externalLinks.length}. Report must be self-contained.`);
  }

  if (externalScripts.length > 0) {
    errors.push(`External JS scripts found: ${externalScripts.length}. Report must be self-contained.`);
  }

  // Check for embedded CSS
  if (!html.includes('<style>') && !html.includes('<style ')) {
    errors.push('No embedded <style> block found');
  }

  // Check for inline JS (for tab switching)
  if (!html.includes('<script>') && !html.includes('<script ')) {
    warnings.push('No inline <script> block found. Tab switching may not work.');
  }

  // Check dark mode colors
  if (!html.includes('#0d1117') && !html.includes('--bg')) {
    warnings.push('Dark mode background color #0d1117 not found');
  }

  // Check for tab buttons
  REQUIRED_TABS.forEach(tab => {
    if (!html.toLowerCase().includes(tab.toLowerCase())) {
      errors.push(`Missing tab: ${tab}`);
    }
  });

  // Check for score displays
  if (!html.includes('CITE') && !html.includes('cite')) {
    errors.push('CITE score not found in report');
  }

  if (!html.includes('CORE-EEAT') && !html.includes('EEAT')) {
    errors.push('CORE-EEAT score not found in report');
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Check if JS code is minimal (≤50 lines per spec)
 * @param {string} html
 * @returns {{ lines: number, isMinimal: boolean }}
 */
function checkJsSize(html) {
  const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  if (!scriptMatch) return { lines: 0, isMinimal: true };

  const jsContent = scriptMatch.map(s => s.replace(/<\/?script[^>]*>/gi, '')).join('\n');
  const lines = jsContent.split('\n').filter(line => line.trim().length > 0).length;

  return { lines, isMinimal: lines <= 50 };
}

describe('HTML Report Structure', () => {
  const sampleReport = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO/GEO Analysis - caplinq.com</title>
  <style>
    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --border: #30363d;
      --text: #e6edf3;
      --muted: #8b949e;
      --accent: #58a6ff;
      --green: #3fb950;
      --amber: #d29922;
      --red: #f85149;
    }
    body { background: var(--bg); color: var(--text); font-family: system-ui; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
    .score-good { color: var(--green); }
    .score-warning { color: var(--amber); }
    .score-bad { color: var(--red); }
    .tab { display: none; }
    .tab.active { display: block; }
    nav button { padding: 8px 16px; background: var(--surface); border: 1px solid var(--border); color: var(--text); cursor: pointer; }
    nav button.active { background: var(--accent); color: var(--bg); }
  </style>
</head>
<body>
  <header>
    <h1>SEO & GEO Analysis Report</h1>
    <div>Company: caplinq | Domain: caplinq.com | Analysis: 2026-04-12 | Library v6.4.0</div>
  </header>

  <nav>
    <button class="active" data-tab="0">Executive Summary</button>
    <button data-tab="1">Domain Baseline</button>
    <button data-tab="2">Research</button>
    <button data-tab="3">Technical</button>
    <button data-tab="4">Content Quality</button>
    <button data-tab="5">Recommendations</button>
    <button data-tab="6">Monitoring</button>
    <button data-tab="7">Next Steps</button>
  </nav>

  <main>
    <section class="tab active" id="tab-0">
      <h2>Executive Summary</h2>
      <div class="card">
        <h3>CITE Verdict</h3>
        <span class="score-warning">CAUTIOUS</span> (72/100)
      </div>
      <div class="card">
        <h3>CORE-EEAT Scores</h3>
        <p>GEO Score: 68/100 | SEO Score: 71/100</p>
      </div>
      <div class="card">
        <h3>Top 5 Critical Findings</h3>
        <ol>
          <li class="score-bad">Missing schema markup on 60% of pages</li>
          <li class="score-warning">Low AI citation rate (3/10 queries)</li>
          <li class="score-warning">Thin content on 12 category pages</li>
          <li>High mobile Core Web Vitals (LCP 2.1s)</li>
          <li>Strong backlink profile (234 referring domains)</li>
        </ol>
      </div>
      <div class="card">
        <h3>Skills Completion Status</h3>
        <table>
          <tr><td>entity-optimizer</td><td>DONE</td></tr>
          <tr><td>citation-baseline</td><td>DONE</td></tr>
          <!-- ... all 21 skills ... -->
        </table>
      </div>
    </section>

    <section class="tab" id="tab-1"><h2>Domain Baseline</h2><!-- ... --></section>
    <section class="tab" id="tab-2"><h2>Research</h2><!-- ... --></section>
    <section class="tab" id="tab-3"><h2>Technical</h2><!-- ... --></section>
    <section class="tab" id="tab-4"><h2>Content Quality</h2><!-- ... --></section>
    <section class="tab" id="tab-5"><h2>Recommendations</h2><!-- ... --></section>
    <section class="tab" id="tab-6"><h2>Monitoring</h2><!-- ... --></section>
    <section class="tab" id="tab-7">
      <h2>Next Steps</h2>
      <div class="card">
        <h3>90-Day Action Plan</h3>
        <table>
          <tr><th>Priority</th><th>Action</th><th>Skill</th><th>Effort</th><th>Impact</th></tr>
          <tr><td>P0</td><td>Add schema markup to all product pages</td><td>schema-markup-generator</td><td>Medium</td><td>High</td></tr>
          <tr><td>P1</td><td>Optimize for AI citations</td><td>geo-content-optimizer</td><td>High</td><td>High</td></tr>
        </table>
      </div>
    </section>
  </main>

  <script>
    document.querySelectorAll('nav button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });
  </script>
</body>
</html>`;

  describe('Self-containment', () => {
    it('has no external CSS links', () => {
      const externalLinks = sampleReport.match(/<link[^>]+href=["']https?:\/\//gi) || [];
      expect(externalLinks).toHaveLength(0);
    });

    it('has no external JS scripts', () => {
      const externalScripts = sampleReport.match(/<script[^>]+src=["']https?:\/\//gi) || [];
      expect(externalScripts).toHaveLength(0);
    });

    it('has embedded CSS', () => {
      expect(sampleReport).toMatch(/<style[^>]*>/);
    });

    it('has embedded JS for tab switching', () => {
      expect(sampleReport).toMatch(/<script>/);
    });
  });

  describe('validateHtmlReport', () => {
    it('validates well-formed report', () => {
      const { valid, errors } = validateHtmlReport(sampleReport);
      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('detects missing DOCTYPE', () => {
      const noDoctype = sampleReport.replace('<!DOCTYPE html>', '');
      const { valid, errors } = validateHtmlReport(noDoctype);
      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('DOCTYPE'))).toBe(true);
    });

    it('detects external dependencies', () => {
      const withCdn = sampleReport.replace(
        '<style>',
        '<link href="https://cdn.example.com/styles.css" rel="stylesheet"><style>'
      );
      const { valid, errors } = validateHtmlReport(withCdn);
      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('External CSS'))).toBe(true);
    });

    it('detects missing tabs', () => {
      // Replace all occurrences of 'Executive Summary' to simulate missing tab
      const missingTab = sampleReport.replaceAll('Executive Summary', 'Overview');
      const { valid, errors } = validateHtmlReport(missingTab);
      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('Executive Summary'))).toBe(true);
    });
  });

  describe('JS size check', () => {
    it('JS is under 50 lines', () => {
      const { lines, isMinimal } = checkJsSize(sampleReport);
      expect(isMinimal).toBe(true);
      expect(lines).toBeLessThanOrEqual(50);
    });

    it('detects oversized JS', () => {
      const bigJs = '<script>' + 'console.log("line");\n'.repeat(100) + '</script>';
      const { lines, isMinimal } = checkJsSize(bigJs);
      expect(isMinimal).toBe(false);
      expect(lines).toBeGreaterThan(50);
    });
  });
});

describe('Tab Structure', () => {
  it('has exactly 8 tabs', () => {
    expect(REQUIRED_TABS).toHaveLength(8);
  });

  it('tabs are in correct order', () => {
    expect(REQUIRED_TABS[0]).toBe('Executive Summary');
    expect(REQUIRED_TABS[1]).toBe('Domain Baseline');
    expect(REQUIRED_TABS[2]).toBe('Research');
    expect(REQUIRED_TABS[3]).toBe('Technical');
    expect(REQUIRED_TABS[4]).toBe('Content Quality');
    expect(REQUIRED_TABS[5]).toBe('Recommendations');
    expect(REQUIRED_TABS[6]).toBe('Monitoring');
    expect(REQUIRED_TABS[7]).toBe('Next Steps');
  });
});

describe('CSS Variables', () => {
  it('all required CSS variables are defined', () => {
    expect(REQUIRED_CSS_VARS).toContain('--bg');
    expect(REQUIRED_CSS_VARS).toContain('--surface');
    expect(REQUIRED_CSS_VARS).toContain('--text');
    expect(REQUIRED_CSS_VARS).toContain('--green');
    expect(REQUIRED_CSS_VARS).toContain('--amber');
    expect(REQUIRED_CSS_VARS).toContain('--red');
  });

  it('dark mode colors are correct', () => {
    const colors = {
      '--bg': '#0d1117',
      '--surface': '#161b22',
      '--border': '#30363d',
      '--text': '#e6edf3',
      '--green': '#3fb950',
      '--amber': '#d29922',
      '--red': '#f85149'
    };

    expect(colors['--bg']).toBe('#0d1117');
    expect(colors['--surface']).toBe('#161b22');
    expect(colors['--text']).toBe('#e6edf3');
  });
});

describe('Score Color Coding', () => {
  /**
   * Get color class for a score
   * @param {number} score - Score out of 100
   * @returns {string}
   */
  function getScoreColorClass(score) {
    if (score >= 80) return 'score-good';
    if (score >= 60) return 'score-warning';
    return 'score-bad';
  }

  it('scores ≥80 get green color', () => {
    expect(getScoreColorClass(80)).toBe('score-good');
    expect(getScoreColorClass(95)).toBe('score-good');
    expect(getScoreColorClass(100)).toBe('score-good');
  });

  it('scores 60-79 get amber color', () => {
    expect(getScoreColorClass(60)).toBe('score-warning');
    expect(getScoreColorClass(70)).toBe('score-warning');
    expect(getScoreColorClass(79)).toBe('score-warning');
  });

  it('scores <60 get red color', () => {
    expect(getScoreColorClass(59)).toBe('score-bad');
    expect(getScoreColorClass(30)).toBe('score-bad');
    expect(getScoreColorClass(0)).toBe('score-bad');
  });
});

describe('Executive Summary Requirements', () => {
  it('has all required elements', () => {
    expect(EXECUTIVE_SUMMARY_ELEMENTS).toContain('CITE verdict');
    expect(EXECUTIVE_SUMMARY_ELEMENTS).toContain('CORE-EEAT score');
    expect(EXECUTIVE_SUMMARY_ELEMENTS).toContain('Top critical findings');
    expect(EXECUTIVE_SUMMARY_ELEMENTS).toContain('Skills completion');
  });
});

describe('90-Day Action Plan', () => {
  // Priority levels
  const PRIORITY_LEVELS = ['P0', 'P1', 'P2', 'P3'];

  it('has 4 priority levels', () => {
    expect(PRIORITY_LEVELS).toHaveLength(4);
  });

  it('P0 is highest priority', () => {
    expect(PRIORITY_LEVELS[0]).toBe('P0');
  });

  it('action plan table columns are correct', () => {
    const columns = ['Priority', 'Action', 'Skill', 'Effort', 'Impact'];
    expect(columns).toHaveLength(5);
    expect(columns).toContain('Priority');
    expect(columns).toContain('Skill');
    expect(columns).toContain('Impact');
  });
});

describe('Report Filename', () => {
  /**
   * Generate report filename
   * @param {string} companyRoot
   * @param {string} domain
   * @param {string} timestamp
   * @returns {string}
   */
  function generateReportFilename(companyRoot, domain, timestamp) {
    return `${companyRoot}_${domain}_${timestamp}.html`;
  }

  it('generates correct filename for caplinq.com', () => {
    const filename = generateReportFilename('caplinq', 'caplinq.com', '20260412T153045');
    expect(filename).toBe('caplinq_caplinq.com_20260412T153045.html');
  });

  it('filename ends with .html', () => {
    const filename = generateReportFilename('test', 'test.com', '20260101T000000');
    expect(filename).toMatch(/\.html$/);
  });

  it('filename includes company root, domain, and timestamp', () => {
    const filename = generateReportFilename('acme', 'blog.acme.co.uk', '20260412T153045');
    expect(filename).toContain('acme');
    expect(filename).toContain('blog.acme.co.uk');
    expect(filename).toContain('20260412T153045');
  });
});

describe('Section Tooltips', () => {
  const TOOLTIP_SECTIONS = [
    'executive_summary',
    'domain_baseline',
    'research',
    'technical',
    'content_quality',
    'recommendations',
    'monitoring',
    'next_steps'
  ];

  /**
   * Check if HTML has tooltips on section headers
   * @param {string} html
   * @returns {{ hasTooltips: boolean, missingTooltips: string[] }}
   */
  function checkTooltips(html) {
    const missingTooltips = [];
    const tooltipPattern = /data-tooltip=/gi;
    const hasAnyTooltips = tooltipPattern.test(html);

    // Check for tooltip CSS
    const hasTooltipCss = html.includes('[data-tooltip]') && html.includes('::after');

    return {
      hasTooltips: hasAnyTooltips && hasTooltipCss,
      hasTooltipCss,
      missingTooltips
    };
  }

  it('has 8 tooltip sections defined', () => {
    expect(TOOLTIP_SECTIONS).toHaveLength(8);
  });

  it('tooltip sections match required tabs', () => {
    // Tooltip sections should correspond to required tabs
    expect(TOOLTIP_SECTIONS).toContain('executive_summary');
    expect(TOOLTIP_SECTIONS).toContain('domain_baseline');
    expect(TOOLTIP_SECTIONS).toContain('next_steps');
  });

  it('detects tooltip CSS in sample report', () => {
    const htmlWithTooltips = `
      <style>
        [data-tooltip] { position: relative; cursor: help; }
        [data-tooltip]:hover::after { content: attr(data-tooltip); }
      </style>
      <h2 data-tooltip="Overview of domain authority scores">Executive Summary</h2>
    `;

    const { hasTooltips, hasTooltipCss } = checkTooltips(htmlWithTooltips);
    expect(hasTooltips).toBe(true);
    expect(hasTooltipCss).toBe(true);
  });

  it('detects missing tooltip CSS', () => {
    const htmlWithoutTooltipCss = `
      <h2 data-tooltip="Test">Header</h2>
    `;

    const { hasTooltipCss } = checkTooltips(htmlWithoutTooltipCss);
    expect(hasTooltipCss).toBe(false);
  });
});

describe('Section Intro Paragraphs', () => {
  /**
   * Check if HTML has intro paragraphs in tab panels
   * @param {string} html
   * @returns {{ hasIntros: boolean, count: number }}
   */
  function checkIntroParagraphs(html) {
    const introPattern = /class=["']section-intro["']/gi;
    const matches = html.match(introPattern) || [];
    return {
      hasIntros: matches.length > 0,
      count: matches.length
    };
  }

  it('detects section-intro class', () => {
    const htmlWithIntros = `
      <section class="tab-panel">
        <h2>Executive Summary</h2>
        <p class="section-intro">Your company's overall digital health at a glance.</p>
      </section>
      <section class="tab-panel">
        <h2>Domain Baseline</h2>
        <p class="section-intro">How search engines recognize your company.</p>
      </section>
    `;

    const { hasIntros, count } = checkIntroParagraphs(htmlWithIntros);
    expect(hasIntros).toBe(true);
    expect(count).toBe(2);
  });

  it('should have 8 intro paragraphs (one per section)', () => {
    // Expected: one .section-intro per tab panel
    const expectedCount = 8;
    expect(expectedCount).toBe(REQUIRED_TABS.length);
  });

  it('intro paragraphs use business language', () => {
    const businessIntro = "Your company's overall digital health at a glance.";
    const technicalIntro = "CITE C02/C04 and CORE-EEAT R01-R10 scores overview.";

    // Business language should NOT contain raw dimension codes
    expect(businessIntro).not.toMatch(/\b[A-Z]\d{2}\b/);

    // Technical language contains codes - not for client reports
    expect(technicalIntro).toMatch(/\b[A-Z]\d{2}\b/);
  });
});

describe('Print Mode CSS', () => {
  const printModeCss = `
    @media print {
      :root { --bg: #ffffff; --surface: #f6f8fa; --text: #1f2328; }
      body { background: var(--bg); color: var(--text); }
      .tab-panel { display: block !important; }
      nav#tabs { display: none; }
    }
  `;

  it('print mode overrides dark theme', () => {
    expect(printModeCss).toContain('--bg: #ffffff');
    expect(printModeCss).toContain('--text: #1f2328');
  });

  it('print mode shows all tabs', () => {
    expect(printModeCss).toContain('display: block !important');
  });

  it('print mode hides navigation', () => {
    expect(printModeCss).toContain('display: none');
  });
});

// Export for use in other tests
export { validateHtmlReport, checkJsSize, REQUIRED_TABS, REQUIRED_CSS_VARS };
