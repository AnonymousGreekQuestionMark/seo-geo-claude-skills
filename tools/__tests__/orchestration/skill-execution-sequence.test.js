/**
 * Tests for skill execution sequence in company-analysis orchestration
 * Validates the 21-step execution order and BLOCKED handling
 */
import { describe, it, expect } from 'vitest';

// Complete execution sequence from company-analysis SKILL.md
const EXECUTION_SEQUENCE = [
  { step: 1, skill: 'entity-optimizer', phase: '01-domain-baseline', handoffFile: 'entity-optimizer-handoff.md' },
  { step: 1.5, skill: 'citation-baseline', phase: '01-domain-baseline', handoffFile: 'citation-baseline-handoff.md' },
  { step: 2, skill: 'keyword-research', phase: '02-research', handoffFile: 'keyword-research-handoff.md' },
  { step: 3, skill: 'competitor-analysis', phase: '02-research', handoffFile: 'competitor-analysis-handoff.md' },
  { step: 4, skill: 'serp-analysis', phase: '02-research', handoffFile: 'serp-analysis-handoff.md' },
  { step: 5, skill: 'content-gap-analysis', phase: '02-research', handoffFile: 'content-gap-analysis-handoff.md' },
  { step: 6, skill: 'technical-seo-checker', phase: '03-technical', handoffFile: 'technical-seo-handoff.md' },
  { step: 7, skill: 'on-page-seo-auditor', phase: '03-technical', handoffFile: 'on-page-seo-handoff.md' },
  { step: 8, skill: 'internal-linking-optimizer', phase: '03-technical', handoffFile: 'internal-linking-handoff.md' },
  { step: 9, skill: 'backlink-analyzer', phase: '03-technical', handoffFile: 'backlink-handoff.md' },
  { step: 10, skill: 'domain-authority-auditor', phase: '03-technical', handoffFile: 'domain-authority-handoff.md' },
  { step: 11, skill: 'content-quality-auditor', phase: '04-content', handoffFile: 'content-quality-handoff.md' },
  { step: 12, skill: 'content-refresher', phase: '04-content', handoffFile: 'content-refresher-handoff.md' },
  { step: 13, skill: 'seo-content-writer', phase: '05-recommendations', handoffFile: 'seo-content-handoff.md' },
  { step: 14, skill: 'geo-content-optimizer', phase: '05-recommendations', handoffFile: 'geo-content-handoff.md' },
  { step: 15, skill: 'meta-tags-optimizer', phase: '05-recommendations', handoffFile: 'meta-tags-handoff.md' },
  { step: 16, skill: 'schema-markup-generator', phase: '05-recommendations', handoffFile: 'schema-markup-handoff.md' },
  { step: 17, skill: 'rank-tracker', phase: '06-monitoring', handoffFile: 'rank-tracker-handoff.md' },
  { step: 18, skill: 'performance-reporter', phase: '06-monitoring', handoffFile: 'performance-reporter-handoff.md' },
  { step: 19, skill: 'alert-manager', phase: '06-monitoring', handoffFile: 'alert-manager-handoff.md' },
  { step: 20, skill: 'memory-management', phase: '07-memory', handoffFile: 'memory-snapshot.md' },
  { step: 21, skill: 'html-report', phase: null, handoffFile: null } // Special final step
];

// Valid handoff statuses
const VALID_STATUSES = ['DONE', 'DONE_WITH_CONCERNS', 'BLOCKED', 'NEEDS_INPUT'];

describe('Execution Sequence', () => {
  describe('Step ordering', () => {
    it('has 22 steps (21 skills + HTML report)', () => {
      expect(EXECUTION_SEQUENCE).toHaveLength(22);
    });

    it('starts with entity-optimizer at step 1', () => {
      expect(EXECUTION_SEQUENCE[0].step).toBe(1);
      expect(EXECUTION_SEQUENCE[0].skill).toBe('entity-optimizer');
    });

    it('citation-baseline runs at step 1.5 (after entity-optimizer)', () => {
      expect(EXECUTION_SEQUENCE[1].step).toBe(1.5);
      expect(EXECUTION_SEQUENCE[1].skill).toBe('citation-baseline');
    });

    it('memory-management runs at step 20', () => {
      const memoryStep = EXECUTION_SEQUENCE.find(s => s.skill === 'memory-management');
      expect(memoryStep.step).toBe(20);
    });

    it('html-report is the final step (21)', () => {
      const lastStep = EXECUTION_SEQUENCE[EXECUTION_SEQUENCE.length - 1];
      expect(lastStep.step).toBe(21);
      expect(lastStep.skill).toBe('html-report');
    });

    it('steps are in ascending order', () => {
      for (let i = 1; i < EXECUTION_SEQUENCE.length; i++) {
        expect(EXECUTION_SEQUENCE[i].step).toBeGreaterThan(EXECUTION_SEQUENCE[i - 1].step);
      }
    });
  });

  describe('Domain-authority-auditor placement', () => {
    it('domain-authority-auditor runs after backlink-analyzer', () => {
      const backlink = EXECUTION_SEQUENCE.find(s => s.skill === 'backlink-analyzer');
      const domainAuth = EXECUTION_SEQUENCE.find(s => s.skill === 'domain-authority-auditor');

      expect(domainAuth.step).toBeGreaterThan(backlink.step);
    });

    it('domain-authority-auditor runs after technical-seo-checker', () => {
      const technical = EXECUTION_SEQUENCE.find(s => s.skill === 'technical-seo-checker');
      const domainAuth = EXECUTION_SEQUENCE.find(s => s.skill === 'domain-authority-auditor');

      expect(domainAuth.step).toBeGreaterThan(technical.step);
    });

    it('domain-authority-auditor can read citation-baseline', () => {
      const citation = EXECUTION_SEQUENCE.find(s => s.skill === 'citation-baseline');
      const domainAuth = EXECUTION_SEQUENCE.find(s => s.skill === 'domain-authority-auditor');

      expect(domainAuth.step).toBeGreaterThan(citation.step);
    });
  });

  describe('Phase grouping', () => {
    it('all 01-domain-baseline skills run in steps 1-1.5', () => {
      const baselineSteps = EXECUTION_SEQUENCE.filter(s => s.phase === '01-domain-baseline');
      baselineSteps.forEach(s => {
        expect(s.step).toBeLessThanOrEqual(2);
      });
    });

    it('all 02-research skills run in steps 2-5', () => {
      const researchSteps = EXECUTION_SEQUENCE.filter(s => s.phase === '02-research');
      researchSteps.forEach(s => {
        expect(s.step).toBeGreaterThanOrEqual(2);
        expect(s.step).toBeLessThanOrEqual(5);
      });
    });

    it('all 03-technical skills run in steps 6-10', () => {
      const technicalSteps = EXECUTION_SEQUENCE.filter(s => s.phase === '03-technical');
      technicalSteps.forEach(s => {
        expect(s.step).toBeGreaterThanOrEqual(6);
        expect(s.step).toBeLessThanOrEqual(10);
      });
    });

    it('all 04-content skills run in steps 11-12', () => {
      const contentSteps = EXECUTION_SEQUENCE.filter(s => s.phase === '04-content');
      contentSteps.forEach(s => {
        expect(s.step).toBeGreaterThanOrEqual(11);
        expect(s.step).toBeLessThanOrEqual(12);
      });
    });

    it('all 05-recommendations skills run in steps 13-16', () => {
      const recsSteps = EXECUTION_SEQUENCE.filter(s => s.phase === '05-recommendations');
      recsSteps.forEach(s => {
        expect(s.step).toBeGreaterThanOrEqual(13);
        expect(s.step).toBeLessThanOrEqual(16);
      });
    });

    it('all 06-monitoring skills run in steps 17-19', () => {
      const monitorSteps = EXECUTION_SEQUENCE.filter(s => s.phase === '06-monitoring');
      monitorSteps.forEach(s => {
        expect(s.step).toBeGreaterThanOrEqual(17);
        expect(s.step).toBeLessThanOrEqual(19);
      });
    });

    it('memory-management (07-memory) runs at step 20', () => {
      const memorySteps = EXECUTION_SEQUENCE.filter(s => s.phase === '07-memory');
      expect(memorySteps).toHaveLength(1);
      expect(memorySteps[0].step).toBe(20);
    });
  });
});

describe('BLOCKED Handling', () => {
  /**
   * Simulate running the execution sequence with some skills blocked
   * @param {string[]} blockedSkills - Skills that will return BLOCKED
   * @returns {object} - Analysis result
   */
  function simulateExecution(blockedSkills = []) {
    const results = [];
    let completed = 0;
    let blocked = 0;

    EXECUTION_SEQUENCE.forEach(stepInfo => {
      if (stepInfo.skill === 'html-report') {
        // HTML report is always generated at the end
        results.push({ ...stepInfo, status: 'DONE' });
        completed++;
        return;
      }

      if (blockedSkills.includes(stepInfo.skill)) {
        results.push({ ...stepInfo, status: 'BLOCKED' });
        blocked++;
      } else {
        results.push({ ...stepInfo, status: 'DONE' });
        completed++;
      }
    });

    // Determine overall status
    let overallStatus;
    if (blocked === 0) {
      overallStatus = 'DONE';
    } else if (blocked <= 5) {
      overallStatus = 'DONE_WITH_CONCERNS';
    } else if (blocked <= 10) {
      overallStatus = 'DONE_WITH_CONCERNS';
    } else {
      overallStatus = 'BLOCKED';
    }

    return { results, completed, blocked, overallStatus };
  }

  describe('Pipeline continues after BLOCKED skill', () => {
    it('continues to next skill when one is blocked', () => {
      const { results, completed, blocked } = simulateExecution(['technical-seo-checker']);

      // Should have run all skills
      expect(results).toHaveLength(22);
      // One blocked
      expect(blocked).toBe(1);
      // 21 completed (including html-report)
      expect(completed).toBe(21);
    });

    it('all subsequent skills run after BLOCKED', () => {
      const { results } = simulateExecution(['keyword-research']);

      // Find skills after keyword-research
      const keywordIndex = results.findIndex(r => r.skill === 'keyword-research');
      const subsequentResults = results.slice(keywordIndex + 1);

      // All subsequent skills should have run
      subsequentResults.forEach(r => {
        expect(r.status).toBeDefined();
      });
    });

    it('creates handoff file for BLOCKED skill', () => {
      const { results } = simulateExecution(['serp-analysis']);

      const serpResult = results.find(r => r.skill === 'serp-analysis');
      expect(serpResult.status).toBe('BLOCKED');
      expect(serpResult.handoffFile).toBe('serp-analysis-handoff.md');
    });
  });

  describe('Overall status determination', () => {
    it('DONE when no skills blocked', () => {
      const { overallStatus, blocked } = simulateExecution([]);

      expect(blocked).toBe(0);
      expect(overallStatus).toBe('DONE');
    });

    it('DONE_WITH_CONCERNS when 1-5 skills blocked', () => {
      const blockedSkills = ['keyword-research', 'serp-analysis', 'backlink-analyzer'];
      const { overallStatus, blocked } = simulateExecution(blockedSkills);

      expect(blocked).toBe(3);
      expect(overallStatus).toBe('DONE_WITH_CONCERNS');
    });

    it('DONE_WITH_CONCERNS when 6-10 skills blocked', () => {
      const blockedSkills = [
        'keyword-research', 'competitor-analysis', 'serp-analysis',
        'content-gap-analysis', 'backlink-analyzer', 'content-refresher',
        'rank-tracker'
      ];
      const { overallStatus, blocked } = simulateExecution(blockedSkills);

      expect(blocked).toBe(7);
      expect(overallStatus).toBe('DONE_WITH_CONCERNS');
    });

    it('BLOCKED when >10 skills blocked', () => {
      const blockedSkills = [
        'entity-optimizer', 'citation-baseline', 'keyword-research',
        'competitor-analysis', 'serp-analysis', 'content-gap-analysis',
        'technical-seo-checker', 'on-page-seo-auditor', 'internal-linking-optimizer',
        'backlink-analyzer', 'domain-authority-auditor'
      ];
      const { overallStatus, blocked } = simulateExecution(blockedSkills);

      expect(blocked).toBe(11);
      expect(overallStatus).toBe('BLOCKED');
    });
  });
});

describe('Handoff File Requirements', () => {
  // Required fields in handoff file frontmatter
  const REQUIRED_FRONTMATTER_FIELDS = ['skill', 'phase', 'step', 'status', 'timestamp', 'domain'];

  // Required sections in handoff file body
  const REQUIRED_BODY_SECTIONS = [
    'Status',
    'Objective',
    'Key Findings',
    'Evidence',
    'Open Loops',
    'Recommended Next Skill'
  ];

  it('each skill has a designated handoff file', () => {
    const skillSteps = EXECUTION_SEQUENCE.filter(s => s.skill !== 'html-report');

    skillSteps.forEach(step => {
      expect(step.handoffFile, `${step.skill} should have handoffFile`).toBeDefined();
      expect(step.handoffFile).toMatch(/\.md$/);
    });
  });

  it('valid status values are defined', () => {
    expect(VALID_STATUSES).toContain('DONE');
    expect(VALID_STATUSES).toContain('DONE_WITH_CONCERNS');
    expect(VALID_STATUSES).toContain('BLOCKED');
    expect(VALID_STATUSES).toContain('NEEDS_INPUT');
  });

  it('required frontmatter fields are specified', () => {
    expect(REQUIRED_FRONTMATTER_FIELDS).toContain('skill');
    expect(REQUIRED_FRONTMATTER_FIELDS).toContain('status');
    expect(REQUIRED_FRONTMATTER_FIELDS).toContain('timestamp');
  });

  it('required body sections are specified', () => {
    expect(REQUIRED_BODY_SECTIONS).toContain('Key Findings');
    expect(REQUIRED_BODY_SECTIONS).toContain('Evidence');
    expect(REQUIRED_BODY_SECTIONS).toContain('Recommended Next Skill');
  });
});

describe('Skill Dependencies', () => {
  /**
   * Get skills that depend on a given skill
   * @param {string} skillName
   * @returns {string[]}
   */
  function getDependents(skillName) {
    const dependencies = {
      'entity-optimizer': ['citation-baseline', 'domain-authority-auditor'],
      'citation-baseline': ['domain-authority-auditor'],
      'technical-seo-checker': ['domain-authority-auditor'],
      'backlink-analyzer': ['domain-authority-auditor'],
      'schema-markup-generator': ['domain-authority-auditor'], // for CITE I04
      'keyword-research': ['competitor-analysis', 'serp-analysis', 'content-gap-analysis', 'seo-content-writer'],
      'competitor-analysis': ['content-gap-analysis'],
      'content-quality-auditor': ['content-refresher', 'seo-content-writer'],
      'content-gap-analysis': ['seo-content-writer']
    };
    return dependencies[skillName] || [];
  }

  it('domain-authority-auditor has multiple data feeders', () => {
    const feeders = ['entity-optimizer', 'citation-baseline', 'technical-seo-checker', 'backlink-analyzer'];

    feeders.forEach(feeder => {
      const dependents = getDependents(feeder);
      expect(dependents).toContain('domain-authority-auditor');
    });
  });

  it('research skills inform content skills', () => {
    const keywordDeps = getDependents('keyword-research');
    expect(keywordDeps).toContain('seo-content-writer');
  });

  it('content-quality-auditor informs content-refresher', () => {
    const deps = getDependents('content-quality-auditor');
    expect(deps).toContain('content-refresher');
  });
});

// Export for use in other tests
export { EXECUTION_SEQUENCE, VALID_STATUSES };
