/**
 * Tests for handoff file validation in company-analysis orchestration
 * Validates handoff file structure, required fields, and content format
 */
import { describe, it, expect } from 'vitest';
import YAML from 'yaml';

// Valid handoff statuses
const VALID_STATUSES = ['DONE', 'DONE_WITH_CONCERNS', 'BLOCKED', 'NEEDS_INPUT'];

// Required frontmatter fields
const REQUIRED_FRONTMATTER = ['skill', 'phase', 'step', 'status', 'timestamp', 'domain'];

// Required body sections
const REQUIRED_BODY_SECTIONS = [
  'Status',
  'Objective',
  'Key Findings',
  'Evidence',
  'Open Loops',
  'Maps to',
  'Recommended Next Skill'
];

// Optional body sections
const OPTIONAL_BODY_SECTIONS = ['Scores', 'Full Findings'];

/**
 * Parse handoff file content into structured data
 * @param {string} content - Raw markdown content
 * @returns {{ frontmatter: object, body: string, sections: object }}
 */
function parseHandoffFile(content) {
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

  // Parse sections from body
  const sections = {};
  const sectionRegex = /(?:^|\n)[-*]\s*\*\*([^*]+)\*\*:\s*([^\n]*(?:\n(?![-*]\s*\*\*).*)*)/g;
  let match;

  while ((match = sectionRegex.exec(body)) !== null) {
    const sectionName = match[1].trim();
    const sectionContent = match[2].trim();
    sections[sectionName] = sectionContent;
  }

  return { frontmatter, body, sections };
}

/**
 * Validate handoff file structure
 * @param {string} content - Raw markdown content
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateHandoffFile(content) {
  const errors = [];
  const { frontmatter, body, sections } = parseHandoffFile(content);

  // Check frontmatter exists
  if (!content.startsWith('---')) {
    errors.push('Missing frontmatter (should start with ---)');
  }

  // Check required frontmatter fields
  REQUIRED_FRONTMATTER.forEach(field => {
    if (frontmatter[field] === undefined) {
      errors.push(`Missing required frontmatter field: ${field}`);
    }
  });

  // Check status is valid
  if (frontmatter.status && !VALID_STATUSES.includes(frontmatter.status)) {
    errors.push(`Invalid status: ${frontmatter.status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Check timestamp format
  if (frontmatter.timestamp && !/^\d{8}T\d{6}$/.test(frontmatter.timestamp)) {
    errors.push(`Invalid timestamp format: ${frontmatter.timestamp}. Expected YYYYMMDDTHHmmss`);
  }

  // Check required body sections
  REQUIRED_BODY_SECTIONS.forEach(section => {
    if (!body.includes(`**${section}**`)) {
      errors.push(`Missing required body section: ${section}`);
    }
  });

  // Check for Handoff Summary header
  if (!body.includes('## Handoff Summary')) {
    errors.push('Missing "## Handoff Summary" header');
  }

  return { valid: errors.length === 0, errors };
}

describe('Handoff File Parsing', () => {
  const sampleHandoff = `---
skill: keyword-research
phase: "02"
step: 2
status: DONE
timestamp: 20260412T153045
domain: caplinq.com
---

## Handoff Summary — keyword-research

- **Status**: DONE
- **Objective**: Research keywords for gas diffusion layers and carbon materials
- **Key Findings**: Found 47 keywords with combined monthly search volume of 12,500
- **Evidence**: DataForSEO API, Google autocomplete, competitor content analysis
- **Open Loops**: Need competitor backlink data for full gap analysis
- **Maps to**: CORE C01/C02/O03
- **Recommended Next Skill**: competitor-analysis
- **Scores**:
  - Technical score: 8/10

## Full Findings

[Detailed keyword table...]
`;

  describe('parseHandoffFile', () => {
    it('extracts frontmatter fields', () => {
      const { frontmatter } = parseHandoffFile(sampleHandoff);

      expect(frontmatter.skill).toBe('keyword-research');
      expect(frontmatter.phase).toBe('02');
      expect(frontmatter.step).toBe(2);
      expect(frontmatter.status).toBe('DONE');
      expect(frontmatter.timestamp).toBe('20260412T153045');
      expect(frontmatter.domain).toBe('caplinq.com');
    });

    it('extracts body content', () => {
      const { body } = parseHandoffFile(sampleHandoff);

      expect(body).toContain('## Handoff Summary');
      expect(body).toContain('**Status**');
      expect(body).toContain('**Key Findings**');
    });

    it('extracts sections from body', () => {
      const { sections } = parseHandoffFile(sampleHandoff);

      expect(sections['Status']).toBe('DONE');
      expect(sections['Objective']).toContain('keywords');
      expect(sections['Key Findings']).toContain('47 keywords');
    });
  });

  describe('validateHandoffFile', () => {
    it('valid handoff passes validation', () => {
      const { valid, errors } = validateHandoffFile(sampleHandoff);

      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('detects missing frontmatter', () => {
      const noFrontmatter = `## Handoff Summary

- **Status**: DONE
`;
      const { valid, errors } = validateHandoffFile(noFrontmatter);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('frontmatter'))).toBe(true);
    });

    it('detects missing required fields', () => {
      const missingFields = `---
skill: test
---

## Handoff Summary

- **Status**: DONE
- **Objective**: Test
- **Key Findings**: None
- **Evidence**: None
- **Open Loops**: None
- **Recommended Next Skill**: None
`;
      const { valid, errors } = validateHandoffFile(missingFields);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('phase'))).toBe(true);
      expect(errors.some(e => e.includes('timestamp'))).toBe(true);
    });

    it('detects invalid status', () => {
      const invalidStatus = `---
skill: test
phase: 01
step: 1
status: INVALID_STATUS
timestamp: 20260412T153045
domain: test.com
---

## Handoff Summary

- **Status**: INVALID_STATUS
- **Objective**: Test
- **Key Findings**: None
- **Evidence**: None
- **Open Loops**: None
- **Recommended Next Skill**: None
`;
      const { valid, errors } = validateHandoffFile(invalidStatus);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('Invalid status'))).toBe(true);
    });

    it('detects invalid timestamp format', () => {
      const invalidTimestamp = `---
skill: test
phase: 01
step: 1
status: DONE
timestamp: 2026-04-12
domain: test.com
---

## Handoff Summary

- **Status**: DONE
- **Objective**: Test
- **Key Findings**: None
- **Evidence**: None
- **Open Loops**: None
- **Recommended Next Skill**: None
`;
      const { valid, errors } = validateHandoffFile(invalidTimestamp);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('timestamp format'))).toBe(true);
    });

    it('detects missing body sections', () => {
      const missingSections = `---
skill: test
phase: 01
step: 1
status: DONE
timestamp: 20260412T153045
domain: test.com
---

## Handoff Summary

- **Status**: DONE
- **Objective**: Test
`;
      const { valid, errors } = validateHandoffFile(missingSections);

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('Key Findings'))).toBe(true);
      expect(errors.some(e => e.includes('Evidence'))).toBe(true);
    });
  });
});

describe('Handoff Status Semantics', () => {
  describe('DONE status', () => {
    it('indicates skill completed successfully', () => {
      const status = 'DONE';
      expect(VALID_STATUSES).toContain(status);
    });
  });

  describe('DONE_WITH_CONCERNS status', () => {
    it('indicates skill completed with warnings', () => {
      const status = 'DONE_WITH_CONCERNS';
      expect(VALID_STATUSES).toContain(status);
    });

    it('should have Open Loops explaining concerns', () => {
      const handoff = `---
skill: backlink-analyzer
phase: 03
step: 9
status: DONE_WITH_CONCERNS
timestamp: 20260412T153045
domain: caplinq.com
---

## Handoff Summary — backlink-analyzer

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Analyze backlink profile
- **Key Findings**: Found 234 referring domains
- **Evidence**: Open PageRank API
- **Open Loops**: DataForSEO unavailable, using fallback API with less detail
- **Maps to**: CITE C02/C04/C10/T01/T02
- **Recommended Next Skill**: domain-authority-auditor
`;
      const { sections } = parseHandoffFile(handoff);
      expect(sections['Open Loops']).toBeDefined();
      expect(sections['Open Loops'].length).toBeGreaterThan(0);
    });
  });

  describe('BLOCKED status', () => {
    it('indicates skill could not complete', () => {
      const status = 'BLOCKED';
      expect(VALID_STATUSES).toContain(status);
    });

    it('should have Open Loops explaining blocker', () => {
      const handoff = `---
skill: rank-tracker
phase: 06
step: 17
status: BLOCKED
timestamp: 20260412T153045
domain: caplinq.com
---

## Handoff Summary — rank-tracker

- **Status**: BLOCKED
- **Objective**: Track keyword rankings
- **Key Findings**: Unable to retrieve ranking data
- **Evidence**: N/A
- **Open Loops**: No SERP API keys configured. Configure DataForSEO or Serper API key.
- **Maps to**: CITE C05/C06/C07 (blocked - no data)
- **Recommended Next Skill**: performance-reporter (continue pipeline)
`;
      const { sections } = parseHandoffFile(handoff);
      expect(sections['Open Loops']).toContain('API');
    });
  });

  describe('NEEDS_INPUT status', () => {
    it('indicates skill requires user input to proceed', () => {
      const status = 'NEEDS_INPUT';
      expect(VALID_STATUSES).toContain(status);
    });
  });
});

describe('Score Format Validation', () => {
  describe('CITE scores', () => {
    it('CITE score format is valid', () => {
      const citeScoreLine = 'CITE: C:75/100 I:60/100 T:80/100 E:70/100 | Overall: 71/100 | Verdict: CAUTIOUS';

      expect(citeScoreLine).toMatch(/CITE:/);
      expect(citeScoreLine).toMatch(/C:\d+\/100/);
      expect(citeScoreLine).toMatch(/I:\d+\/100/);
      expect(citeScoreLine).toMatch(/T:\d+\/100/);
      expect(citeScoreLine).toMatch(/E:\d+\/100/);
      expect(citeScoreLine).toMatch(/Overall: \d+\/100/);
      expect(citeScoreLine).toMatch(/Verdict: (TRUSTED|CAUTIOUS|UNTRUSTED)/);
    });

    it('CITE verdicts are valid', () => {
      const validVerdicts = ['TRUSTED', 'CAUTIOUS', 'UNTRUSTED'];
      expect(validVerdicts).toHaveLength(3);
    });
  });

  describe('CORE-EEAT scores', () => {
    it('CORE-EEAT score format is valid', () => {
      const coreEeatLine = 'CORE-EEAT: C:75 O:60 R:80 E:70 Exp:65 Ept:55 A:70 T:80 | GEO:70/100 SEO:68/100';

      expect(coreEeatLine).toMatch(/CORE-EEAT:/);
      expect(coreEeatLine).toMatch(/C:\d+/);
      expect(coreEeatLine).toMatch(/O:\d+/);
      expect(coreEeatLine).toMatch(/R:\d+/);
      expect(coreEeatLine).toMatch(/E:\d+/);
      expect(coreEeatLine).toMatch(/GEO:\d+\/100/);
      expect(coreEeatLine).toMatch(/SEO:\d+\/100/);
    });
  });

  describe('Technical/On-page scores', () => {
    it('technical score format is valid', () => {
      const techScore = 'Technical score: 8/10';
      expect(techScore).toMatch(/Technical score: \d+\/10/);
    });

    it('on-page score format is valid', () => {
      const onPageScore = 'On-page score: 7/10';
      expect(onPageScore).toMatch(/On-page score: \d+\/10/);
    });
  });
});

describe('Recommended Next Skill Validation', () => {
  // Valid skill names from the library
  const VALID_SKILL_NAMES = [
    'entity-optimizer', 'keyword-research', 'competitor-analysis', 'serp-analysis',
    'content-gap-analysis', 'technical-seo-checker', 'on-page-seo-auditor',
    'internal-linking-optimizer', 'backlink-analyzer', 'domain-authority-auditor',
    'content-quality-auditor', 'content-refresher', 'seo-content-writer',
    'geo-content-optimizer', 'meta-tags-optimizer', 'schema-markup-generator',
    'rank-tracker', 'performance-reporter', 'alert-manager', 'memory-management',
    'company-analysis'
  ];

  it('all skill names are kebab-case', () => {
    VALID_SKILL_NAMES.forEach(skill => {
      expect(skill).toMatch(/^[a-z]+(-[a-z]+)*$/);
    });
  });

  it('recommended skill should be a valid skill name or descriptive', () => {
    const validRecommendations = [
      'competitor-analysis',
      'content-gap-analysis',
      'domain-authority-auditor',
      'memory-management',
      'None - final skill in pipeline'
    ];

    validRecommendations.forEach(rec => {
      const isValidSkill = VALID_SKILL_NAMES.includes(rec);
      const isDescriptive = rec.includes('None') || rec.includes('pipeline');
      expect(isValidSkill || isDescriptive).toBe(true);
    });
  });
});

describe('Maps to Field Validation', () => {
  const VALID_CITE_ITEMS = /CITE\s+[CITE][0-9]{2}/;
  const VALID_CORE_ITEMS = /CORE\s+[COREAT][0-9]{2}|CORE\s+(Exp|Ept)[0-9]{2}/;

  it('Maps to field is required in handoff', () => {
    expect(REQUIRED_BODY_SECTIONS).toContain('Maps to');
  });

  it('Maps to field should reference CITE or CORE-EEAT items', () => {
    const validMapsTo = [
      'CITE C02/C04/C10/T01/T02',
      'CORE C01/O03/R05',
      'CITE C05-C08, CORE Exp01-Exp10',
      'CITE I04',
      'N/A (no scored items)'
    ];

    validMapsTo.forEach(mapping => {
      const hasCite = mapping.includes('CITE');
      const hasCore = mapping.includes('CORE');
      const isNA = mapping.includes('N/A');
      expect(hasCite || hasCore || isNA).toBe(true);
    });
  });

  it('validates Maps to format in handoff file', () => {
    const handoffWithMapsTo = `---
skill: backlink-analyzer
phase: 03
step: 9
status: DONE
timestamp: 20260412T153045
domain: caplinq.com
---

## Handoff Summary — backlink-analyzer

- **Status**: DONE
- **Objective**: Analyze backlink profile
- **Key Findings**: Found 234 referring domains
- **Evidence**: Open PageRank API, Ahrefs
- **Open Loops**: None
- **Maps to**: CITE C02/C04/C10/T01/T02
- **Recommended Next Skill**: domain-authority-auditor
`;
    const { sections } = parseHandoffFile(handoffWithMapsTo);
    expect(sections['Maps to']).toBeDefined();
    expect(sections['Maps to']).toContain('CITE');
  });

  it('detects missing Maps to field', () => {
    const handoffMissingMapsTo = `---
skill: test
phase: 01
step: 1
status: DONE
timestamp: 20260412T153045
domain: test.com
---

## Handoff Summary

- **Status**: DONE
- **Objective**: Test
- **Key Findings**: None
- **Evidence**: None
- **Open Loops**: None
- **Recommended Next Skill**: None
`;
    const { valid, errors } = validateHandoffFile(handoffMissingMapsTo);
    expect(valid).toBe(false);
    expect(errors.some(e => e.includes('Maps to'))).toBe(true);
  });
});

// Export for use in other tests
export { parseHandoffFile, validateHandoffFile, VALID_STATUSES, REQUIRED_FRONTMATTER, REQUIRED_BODY_SECTIONS };
