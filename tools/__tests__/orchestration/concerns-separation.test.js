/**
 * Tests for concerns separation from HTML report
 * Validates that HTML report is clean (no concern-related content)
 * and that concerns log is properly generated
 */
import { describe, it, expect } from 'vitest';
import { parseHandoffFile, VALID_STATUSES } from './handoff-validation.test.js';
import YAML from 'yaml';

// Terms that should NOT appear in clean HTML reports
const FORBIDDEN_HTML_TERMS = [
  'DONE_WITH_CONCERNS',
  'DONE W/ CONCERNS',
  'badge-concern',
  'Open Loops',
  'BLOCKED',
  'data gaps',
  'fallback',
  'Tier 1 mode'
];

// Required frontmatter fields in concerns log
const REQUIRED_CONCERNS_FRONTMATTER = [
  'company-root',
  'domain',
  'timestamp',
  'generated-by',
  'version'
];

// Required sections in concerns log
const REQUIRED_CONCERNS_SECTIONS = [
  'Executive Summary',
  'Blocked Skills',
  'Recommendations for Resolution',
  'Analysis Metadata'
];

// Phase names for organizing concerns
const PHASE_NAMES = {
  '01': 'Domain Baseline',
  '02': 'Research',
  '03': 'Technical',
  '04': 'Content Quality',
  '05': 'Recommendations',
  '06': 'Monitoring',
  '07': 'Memory'
};

/**
 * Parse concerns log content into structured data
 * @param {string} content - Raw markdown content
 * @returns {{ frontmatter: object, body: string, sections: object }}
 */
function parseConcernsLog(content) {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  let frontmatter = {};

  if (frontmatterMatch) {
    try {
      frontmatter = YAML.parse(frontmatterMatch[1]);
    } catch (e) {
      frontmatter = { _parseError: e.message };
    }
  }

  // Extract body (everything after frontmatter)
  const body = content.replace(/^---\n[\s\S]*?\n---\n?/, '');

  // Parse sections from body (## headers)
  const sections = {};
  const sectionRegex = /^## (.+)$/gm;
  let match;
  let lastSection = null;
  let lastIndex = 0;

  while ((match = sectionRegex.exec(body)) !== null) {
    if (lastSection) {
      sections[lastSection] = body.slice(lastIndex, match.index).trim();
    }
    lastSection = match[1];
    lastIndex = match.index + match[0].length;
  }
  if (lastSection) {
    sections[lastSection] = body.slice(lastIndex).trim();
  }

  return { frontmatter, body, sections };
}

/**
 * Validate concerns log file structure
 * @param {string} content - Raw markdown content
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateConcernsLog(content) {
  const errors = [];
  const { frontmatter, body, sections } = parseConcernsLog(content);

  // Check frontmatter exists
  if (!content.startsWith('---')) {
    errors.push('Missing frontmatter (should start with ---)');
  }

  // Check required frontmatter fields
  REQUIRED_CONCERNS_FRONTMATTER.forEach(field => {
    if (frontmatter[field] === undefined) {
      errors.push(`Missing required frontmatter field: ${field}`);
    }
  });

  // Check timestamp format
  if (frontmatter.timestamp && !/^\d{8}T\d{6}$/.test(frontmatter.timestamp)) {
    errors.push(`Invalid timestamp format: ${frontmatter.timestamp}. Expected YYYYMMDDTHHmmss`);
  }

  // Check required sections
  REQUIRED_CONCERNS_SECTIONS.forEach(section => {
    if (!body.includes(`## ${section}`)) {
      errors.push(`Missing required section: ${section}`);
    }
  });

  // Check for title
  if (!body.includes('# Concerns Log')) {
    errors.push('Missing "# Concerns Log" title');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Check if HTML content is clean (no concern-related terms)
 * @param {string} html - HTML content
 * @returns {{ clean: boolean, violations: string[] }}
 */
function checkHtmlCleanliness(html) {
  const violations = [];

  FORBIDDEN_HTML_TERMS.forEach(term => {
    if (html.includes(term)) {
      violations.push(`Found forbidden term: "${term}"`);
    }
  });

  // Check for status column in skills table
  if (html.includes('<th>Status</th>') || html.includes('<th>status</th>')) {
    violations.push('Found Status column in skills table');
  }

  return { clean: violations.length === 0, violations };
}

/**
 * Extract concerns from handoff files
 * @param {string[]} handoffContents - Array of handoff file contents
 * @returns {{ skills: object[], summary: object }}
 */
function extractConcernsFromHandoffs(handoffContents) {
  const concerns = [];
  let doneCount = 0;
  let concernsCount = 0;
  let blockedCount = 0;

  handoffContents.forEach(content => {
    const { frontmatter, sections } = parseHandoffFile(content);

    if (frontmatter.status === 'DONE') {
      doneCount++;
    } else if (frontmatter.status === 'DONE_WITH_CONCERNS') {
      concernsCount++;
      concerns.push({
        skill: frontmatter.skill,
        phase: frontmatter.phase,
        status: frontmatter.status,
        openLoops: sections['Open Loops'] || '',
        keyFindings: sections['Key Findings'] || ''
      });
    } else if (frontmatter.status === 'BLOCKED') {
      blockedCount++;
      concerns.push({
        skill: frontmatter.skill,
        phase: frontmatter.phase,
        status: frontmatter.status,
        openLoops: sections['Open Loops'] || '',
        keyFindings: sections['Key Findings'] || ''
      });
    }
  });

  return {
    skills: concerns,
    summary: {
      total: handoffContents.length,
      done: doneCount,
      doneWithConcerns: concernsCount,
      blocked: blockedCount
    }
  };
}

// Sample handoff files for testing
const sampleDoneHandoff = `---
skill: keyword-research
phase: "02"
step: 2
status: DONE
timestamp: 20260412T153045
domain: example.com
---

## Handoff Summary — keyword-research

- **Status**: DONE
- **Objective**: Research keywords
- **Key Findings**: Found 47 keywords
- **Evidence**: API data
- **Open Loops**: None
- **Maps to**: CORE C01/C02/O03
- **Recommended Next Skill**: competitor-analysis
`;

const sampleConcernsHandoff = `---
skill: backlink-analyzer
phase: "03"
step: 9
status: DONE_WITH_CONCERNS
timestamp: 20260412T153045
domain: example.com
---

## Handoff Summary — backlink-analyzer

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Analyze backlink profile
- **Key Findings**: Estimated 234 referring domains based on content analysis
- **Evidence**: Public web analysis
- **Open Loops**: Actual DR, referring domains, anchor text distribution, toxic link ratio - all require Ahrefs/Majestic
- **Maps to**: CITE C02/C04/C10/T01/T02
- **Recommended Next Skill**: domain-authority-auditor
`;

const sampleBlockedHandoff = `---
skill: rank-tracker
phase: "06"
step: 17
status: BLOCKED
timestamp: 20260412T153045
domain: example.com
---

## Handoff Summary — rank-tracker

- **Status**: BLOCKED
- **Objective**: Track keyword rankings
- **Key Findings**: Unable to retrieve ranking data - no SERP API configured
- **Evidence**: N/A
- **Open Loops**: No SERP API keys configured. Configure DataForSEO or Serper API key.
- **Maps to**: CITE C05/C06/C07 (blocked - no data)
- **Recommended Next Skill**: performance-reporter (continue pipeline)
`;

const sampleConcernsLog = `---
company-root: example
domain: example.com
timestamp: 20260412T153045
generated-by: company-analysis orchestration
version: 1.0.0
---

# Concerns Log - example.com

> Generated: 2026-04-12T15:30:45 UTC

## Executive Summary

| Metric | Count |
|--------|-------|
| Total Skills | 21 |
| DONE | 19 |
| DONE_WITH_CONCERNS | 1 |
| BLOCKED | 1 |

**Overall Status**: DONE_WITH_CONCERNS

---

## Phase 03 - Technical

### backlink-analyzer
- **Status**: DONE_WITH_CONCERNS
- **Open Loops**: Actual DR, referring domains, anchor text distribution, toxic link ratio - all require Ahrefs/Majestic
- **Data Source Limitations**: No backlink API access
- **Fallbacks Used**: Estimated link profile from content analysis

---

## Phase 06 - Monitoring

### rank-tracker
- **Status**: BLOCKED
- **Open Loops**: No SERP API keys configured. Configure DataForSEO or Serper API key.
- **Data Source Limitations**: No SERP API configured
- **Fallbacks Used**: None available

---

## Blocked Skills

### rank-tracker (Phase 06 - Monitoring)
- **Reason**: No SERP API keys configured
- **Resolution**: Configure DataForSEO or Serper API key

---

## Recommendations for Resolution

| Priority | Action | Skills Affected |
|----------|--------|-----------------|
| P0 | Connect SERP API (DataForSEO or Serper) | rank-tracker |
| P1 | Connect Ahrefs or Semrush | backlink-analyzer |

---

## Analysis Metadata

- **Tool Tier**: Tier 1 (no MCP integrations)
- **Handoff Files**: analyses/example/example.com/analysis-20260412T153045/
- **HTML Report**: analyses/example/reports/example_example.com_20260412T153045.html
`;

const sampleCleanHtml = `<!DOCTYPE html>
<html lang="en">
<head><title>SEO Analysis - example.com</title></head>
<body>
<header><h1>SEO Analysis: example.com</h1></header>
<table>
  <thead><tr><th>Step</th><th>Skill</th><th>Phase</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>entity-optimizer</td><td>Domain Baseline</td></tr>
    <tr><td>2</td><td>keyword-research</td><td>Research</td></tr>
  </tbody>
</table>
<p>20 skills completed</p>
</body>
</html>`;

const sampleDirtyHtml = `<!DOCTYPE html>
<html lang="en">
<head><title>SEO Analysis - example.com</title></head>
<body>
<header><h1>SEO Analysis: example.com</h1></header>
<table>
  <thead><tr><th>Step</th><th>Skill</th><th>Phase</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>entity-optimizer</td><td>Domain Baseline</td><td><span class="badge-done">DONE</span></td></tr>
    <tr><td>2</td><td>backlink-analyzer</td><td>Technical</td><td><span class="badge-concern">DONE W/ CONCERNS</span></td></tr>
    <tr><td>3</td><td>rank-tracker</td><td>Monitoring</td><td><span class="badge-blocked">BLOCKED</span></td></tr>
  </tbody>
</table>
<p>17 DONE · 4 DONE_WITH_CONCERNS · 0 BLOCKED</p>
<h2>Open Loops</h2>
<p>Missing data gaps and fallback information.</p>
</body>
</html>`;

describe('HTML Report Cleanliness', () => {
  describe('checkHtmlCleanliness', () => {
    it('clean HTML passes validation', () => {
      const { clean, violations } = checkHtmlCleanliness(sampleCleanHtml);

      expect(clean).toBe(true);
      expect(violations).toHaveLength(0);
    });

    it('detects DONE_WITH_CONCERNS in HTML', () => {
      const { clean, violations } = checkHtmlCleanliness(sampleDirtyHtml);

      expect(clean).toBe(false);
      expect(violations.some(v => v.includes('DONE W/ CONCERNS'))).toBe(true);
    });

    it('detects BLOCKED in HTML', () => {
      const { clean, violations } = checkHtmlCleanliness(sampleDirtyHtml);

      expect(clean).toBe(false);
      expect(violations.some(v => v.includes('BLOCKED'))).toBe(true);
    });

    it('detects badge-concern class in HTML', () => {
      const { clean, violations } = checkHtmlCleanliness(sampleDirtyHtml);

      expect(clean).toBe(false);
      expect(violations.some(v => v.includes('badge-concern'))).toBe(true);
    });

    it('detects Open Loops section in HTML', () => {
      const { clean, violations } = checkHtmlCleanliness(sampleDirtyHtml);

      expect(clean).toBe(false);
      expect(violations.some(v => v.includes('Open Loops'))).toBe(true);
    });

    it('detects Status column in skills table', () => {
      const { clean, violations } = checkHtmlCleanliness(sampleDirtyHtml);

      expect(clean).toBe(false);
      expect(violations.some(v => v.includes('Status column'))).toBe(true);
    });

    it('detects data gaps terminology', () => {
      const { clean, violations } = checkHtmlCleanliness(sampleDirtyHtml);

      expect(clean).toBe(false);
      expect(violations.some(v => v.includes('data gaps'))).toBe(true);
    });

    it('detects fallback terminology', () => {
      const { clean, violations } = checkHtmlCleanliness(sampleDirtyHtml);

      expect(clean).toBe(false);
      expect(violations.some(v => v.includes('fallback'))).toBe(true);
    });
  });

  describe('clean HTML structure', () => {
    it('skills table has no status column', () => {
      expect(sampleCleanHtml).not.toContain('<th>Status</th>');
      expect(sampleCleanHtml).toContain('<th>Step</th>');
      expect(sampleCleanHtml).toContain('<th>Skill</th>');
      expect(sampleCleanHtml).toContain('<th>Phase</th>');
    });

    it('shows completion count without status breakdown', () => {
      expect(sampleCleanHtml).toContain('skills completed');
      expect(sampleCleanHtml).not.toContain('DONE_WITH_CONCERNS');
    });
  });
});

describe('Concerns Log Structure', () => {
  describe('parseConcernsLog', () => {
    it('extracts frontmatter fields', () => {
      const { frontmatter } = parseConcernsLog(sampleConcernsLog);

      expect(frontmatter['company-root']).toBe('example');
      expect(frontmatter.domain).toBe('example.com');
      expect(frontmatter.timestamp).toBe('20260412T153045');
      expect(frontmatter['generated-by']).toBe('company-analysis orchestration');
      expect(frontmatter.version).toBe('1.0.0');
    });

    it('extracts body content', () => {
      const { body } = parseConcernsLog(sampleConcernsLog);

      expect(body).toContain('# Concerns Log');
      expect(body).toContain('## Executive Summary');
      expect(body).toContain('## Blocked Skills');
    });

    it('extracts sections from body', () => {
      const { sections } = parseConcernsLog(sampleConcernsLog);

      expect(sections['Executive Summary']).toBeDefined();
      expect(sections['Blocked Skills']).toBeDefined();
      expect(sections['Recommendations for Resolution']).toBeDefined();
      expect(sections['Analysis Metadata']).toBeDefined();
    });
  });

  describe('validateConcernsLog', () => {
    it('valid concerns log passes validation', () => {
      const { valid, errors } = validateConcernsLog(sampleConcernsLog);

      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('detects missing frontmatter', () => {
      const noFrontmatter = `# Concerns Log

## Executive Summary
`;
      const { valid, errors } = validateConcernsLog(noFrontmatter);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('frontmatter'))).toBe(true);
    });

    it('detects missing required frontmatter fields', () => {
      const missingFields = `---
company-root: example
---

# Concerns Log

## Executive Summary
## Blocked Skills
## Recommendations for Resolution
## Analysis Metadata
`;
      const { valid, errors } = validateConcernsLog(missingFields);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('domain'))).toBe(true);
      expect(errors.some(e => e.includes('timestamp'))).toBe(true);
    });

    it('detects invalid timestamp format', () => {
      const invalidTimestamp = `---
company-root: example
domain: example.com
timestamp: 2026-04-12
generated-by: test
version: 1.0.0
---

# Concerns Log

## Executive Summary
## Blocked Skills
## Recommendations for Resolution
## Analysis Metadata
`;
      const { valid, errors } = validateConcernsLog(invalidTimestamp);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('timestamp format'))).toBe(true);
    });

    it('detects missing required sections', () => {
      const missingSections = `---
company-root: example
domain: example.com
timestamp: 20260412T153045
generated-by: test
version: 1.0.0
---

# Concerns Log

## Executive Summary
`;
      const { valid, errors } = validateConcernsLog(missingSections);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('Blocked Skills'))).toBe(true);
      expect(errors.some(e => e.includes('Recommendations'))).toBe(true);
    });

    it('detects missing title', () => {
      const missingTitle = `---
company-root: example
domain: example.com
timestamp: 20260412T153045
generated-by: test
version: 1.0.0
---

## Executive Summary
## Blocked Skills
## Recommendations for Resolution
## Analysis Metadata
`;
      const { valid, errors } = validateConcernsLog(missingTitle);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('Concerns Log'))).toBe(true);
    });
  });
});

describe('Concerns Log Content', () => {
  describe('extractConcernsFromHandoffs', () => {
    it('extracts concerns from DONE_WITH_CONCERNS handoffs', () => {
      const handoffs = [sampleDoneHandoff, sampleConcernsHandoff];
      const { skills, summary } = extractConcernsFromHandoffs(handoffs);

      expect(skills).toHaveLength(1);
      expect(skills[0].skill).toBe('backlink-analyzer');
      expect(skills[0].status).toBe('DONE_WITH_CONCERNS');
      expect(skills[0].openLoops).toContain('Ahrefs');
    });

    it('extracts concerns from BLOCKED handoffs', () => {
      const handoffs = [sampleDoneHandoff, sampleBlockedHandoff];
      const { skills, summary } = extractConcernsFromHandoffs(handoffs);

      expect(skills).toHaveLength(1);
      expect(skills[0].skill).toBe('rank-tracker');
      expect(skills[0].status).toBe('BLOCKED');
      expect(skills[0].openLoops).toContain('SERP API');
    });

    it('excludes DONE handoffs from concerns', () => {
      const handoffs = [sampleDoneHandoff];
      const { skills, summary } = extractConcernsFromHandoffs(handoffs);

      expect(skills).toHaveLength(0);
      expect(summary.done).toBe(1);
    });

    it('calculates correct summary counts', () => {
      const handoffs = [sampleDoneHandoff, sampleConcernsHandoff, sampleBlockedHandoff];
      const { summary } = extractConcernsFromHandoffs(handoffs);

      expect(summary.total).toBe(3);
      expect(summary.done).toBe(1);
      expect(summary.doneWithConcerns).toBe(1);
      expect(summary.blocked).toBe(1);
    });

    it('preserves phase information', () => {
      const handoffs = [sampleConcernsHandoff, sampleBlockedHandoff];
      const { skills } = extractConcernsFromHandoffs(handoffs);

      const backlinkConcern = skills.find(s => s.skill === 'backlink-analyzer');
      const rankTrackerConcern = skills.find(s => s.skill === 'rank-tracker');

      expect(backlinkConcern.phase).toBe('03');
      expect(rankTrackerConcern.phase).toBe('06');
    });
  });
});

describe('Concerns Log Path', () => {
  it('filename matches expected pattern', () => {
    const timestamp = '20260412T153045';
    const expectedFilename = `concerns-log-${timestamp}.md`;

    expect(expectedFilename).toMatch(/^concerns-log-\d{8}T\d{6}\.md$/);
  });

  it('path is at company root level', () => {
    const companyRoot = 'caplinq';
    const timestamp = '20260412T153045';
    const expectedPath = `analyses/${companyRoot}/concerns-log-${timestamp}.md`;

    expect(expectedPath).not.toContain('caplinq.com');
    expect(expectedPath).toContain('analyses/caplinq/');
    expect(expectedPath).toMatch(/analyses\/[^/]+\/concerns-log-\d{8}T\d{6}\.md$/);
  });

  it('uses same timestamp as HTML report', () => {
    const timestamp = '20260412T153045';
    const concernsLogPath = `analyses/caplinq/concerns-log-${timestamp}.md`;
    const htmlReportPath = `analyses/caplinq/reports/caplinq_caplinq.com_${timestamp}.html`;

    const concernsTimestamp = concernsLogPath.match(/(\d{8}T\d{6})/)[1];
    const htmlTimestamp = htmlReportPath.match(/(\d{8}T\d{6})/)[1];

    expect(concernsTimestamp).toBe(htmlTimestamp);
  });
});

describe('Integration', () => {
  it('HTML and concerns log are complementary', () => {
    // Clean HTML should not have concerns
    const { clean } = checkHtmlCleanliness(sampleCleanHtml);
    expect(clean).toBe(true);

    // Concerns log should have all concerns
    const { valid } = validateConcernsLog(sampleConcernsLog);
    expect(valid).toBe(true);
  });

  it('all concern data from handoffs appears in concerns log', () => {
    const handoffs = [sampleConcernsHandoff, sampleBlockedHandoff];
    const { skills } = extractConcernsFromHandoffs(handoffs);

    // Both skills with concerns should be extracted
    expect(skills).toHaveLength(2);

    // Open Loops should be preserved
    const backlinkConcern = skills.find(s => s.skill === 'backlink-analyzer');
    expect(backlinkConcern.openLoops).toContain('Ahrefs');

    const rankTrackerConcern = skills.find(s => s.skill === 'rank-tracker');
    expect(rankTrackerConcern.openLoops).toContain('SERP API');
  });

  it('BLOCKED skills excluded from HTML but in concerns log', () => {
    // Clean HTML should not have BLOCKED
    expect(sampleCleanHtml).not.toContain('BLOCKED');
    expect(sampleCleanHtml).not.toContain('rank-tracker');

    // Concerns log should have BLOCKED skills
    expect(sampleConcernsLog).toContain('BLOCKED');
    expect(sampleConcernsLog).toContain('rank-tracker');
  });
});

// Export utilities for use in other tests
export {
  parseConcernsLog,
  validateConcernsLog,
  checkHtmlCleanliness,
  extractConcernsFromHandoffs,
  FORBIDDEN_HTML_TERMS,
  REQUIRED_CONCERNS_FRONTMATTER,
  REQUIRED_CONCERNS_SECTIONS,
  PHASE_NAMES
};
