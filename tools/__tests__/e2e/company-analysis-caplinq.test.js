/**
 * E2E tests for company-analysis orchestration with caplinq.com
 * This is the critical path test for the main user workflow
 *
 * These tests validate the full pipeline integration without actually
 * executing the skills (which would require real API calls and user interaction).
 * Instead, they test the orchestration logic, file structure, and validation.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..', '..');

// Import from orchestration tests
import { parseCompanyUrl, generateTimestamp, generateAnalysisPath, generateReportPath } from '../orchestration/url-parsing.test.js';
import { PHASE_DIRECTORIES, HANDOFF_FILES } from '../orchestration/directory-structure.test.js';
import { EXECUTION_SEQUENCE, VALID_STATUSES } from '../orchestration/skill-execution-sequence.test.js';
import { parseHandoffFile, validateHandoffFile } from '../orchestration/handoff-validation.test.js';
import { validateHtmlReport } from '../orchestration/html-report.test.js';

// Canonical test domain
const TEST_DOMAIN = 'caplinq.com';
const TEST_COMPANY_ROOT = 'caplinq';

describe('Company Analysis E2E - caplinq.com', () => {
  describe('URL parsing for caplinq.com', () => {
    it('parses caplinq.com correctly', () => {
      const { domain, companyRoot } = parseCompanyUrl('caplinq.com');

      expect(domain).toBe('caplinq.com');
      expect(companyRoot).toBe('caplinq');
    });

    it('parses https://www.caplinq.com/ correctly', () => {
      const { domain, companyRoot } = parseCompanyUrl('https://www.caplinq.com/');

      expect(domain).toBe('caplinq.com');
      expect(companyRoot).toBe('caplinq');
    });

    it('parses blog.caplinq.com correctly', () => {
      const { domain, companyRoot } = parseCompanyUrl('blog.caplinq.com');

      expect(domain).toBe('blog.caplinq.com');
      expect(companyRoot).toBe('caplinq');
    });
  });

  describe('Path generation for caplinq.com', () => {
    const timestamp = '20260412T153045';

    it('generates correct analysis path', () => {
      const path = generateAnalysisPath(TEST_COMPANY_ROOT, TEST_DOMAIN, timestamp);
      expect(path).toBe('analyses/caplinq/caplinq.com/analysis-20260412T153045');
    });

    it('generates correct report path', () => {
      const path = generateReportPath(TEST_COMPANY_ROOT, TEST_DOMAIN, timestamp);
      expect(path).toBe('analyses/caplinq/reports/caplinq_caplinq.com_20260412T153045.html');
    });
  });

  describe('Execution sequence validation', () => {
    it('has 22 steps total (21 skills + HTML report)', () => {
      expect(EXECUTION_SEQUENCE).toHaveLength(22);
    });

    it('entity-optimizer is first skill', () => {
      expect(EXECUTION_SEQUENCE[0].skill).toBe('entity-optimizer');
    });

    it('citation-baseline runs at step 1.5', () => {
      const citationStep = EXECUTION_SEQUENCE.find(s => s.skill === 'citation-baseline');
      expect(citationStep.step).toBe(1.5);
    });

    it('domain-authority-auditor runs after its data feeders', () => {
      const domainAuth = EXECUTION_SEQUENCE.find(s => s.skill === 'domain-authority-auditor');
      const backlink = EXECUTION_SEQUENCE.find(s => s.skill === 'backlink-analyzer');
      const technical = EXECUTION_SEQUENCE.find(s => s.skill === 'technical-seo-checker');

      expect(domainAuth.step).toBeGreaterThan(backlink.step);
      expect(domainAuth.step).toBeGreaterThan(technical.step);
    });

    it('memory-management is last skill before HTML report', () => {
      const memory = EXECUTION_SEQUENCE.find(s => s.skill === 'memory-management');
      const htmlReport = EXECUTION_SEQUENCE.find(s => s.skill === 'html-report');

      expect(memory.step).toBe(20);
      expect(htmlReport.step).toBe(21);
    });
  });

  describe('Directory structure validation', () => {
    it('has 7 phase directories', () => {
      expect(PHASE_DIRECTORIES).toHaveLength(7);
    });

    it('all phase directories are numbered correctly', () => {
      PHASE_DIRECTORIES.forEach((dir, index) => {
        const expectedNum = String(index + 1).padStart(2, '0');
        expect(dir.startsWith(expectedNum)).toBe(true);
      });
    });

    it('total handoff files is 21', () => {
      const total = Object.values(HANDOFF_FILES).flat().length;
      expect(total).toBe(21);
    });
  });

  describe('Handoff file validation', () => {
    it('all skills have designated handoff files', () => {
      const skillSteps = EXECUTION_SEQUENCE.filter(s => s.skill !== 'html-report');

      skillSteps.forEach(step => {
        expect(step.handoffFile).toBeDefined();
      });
    });

    it('handoff files follow naming convention', () => {
      const allHandoffFiles = Object.values(HANDOFF_FILES).flat();

      allHandoffFiles.forEach(file => {
        expect(file).toMatch(/^[a-z-]+-(?:handoff|snapshot)\.md$/);
      });
    });

    it('valid status values are defined', () => {
      expect(VALID_STATUSES).toContain('DONE');
      expect(VALID_STATUSES).toContain('DONE_WITH_CONCERNS');
      expect(VALID_STATUSES).toContain('BLOCKED');
      expect(VALID_STATUSES).toContain('NEEDS_INPUT');
    });
  });

  describe('Mock handoff file structure', () => {
    const mockHandoff = `---
skill: keyword-research
phase: 02
step: 2
status: DONE
timestamp: 20260412T153045
domain: caplinq.com
---

## Handoff Summary — keyword-research

- **Status**: DONE
- **Objective**: Research keywords for gas diffusion layers and specialty chemicals
- **Key Findings**: Identified 47 keywords with 12,500 monthly search volume
- **Evidence**: DataForSEO API, Google autocomplete, competitor analysis
- **Open Loops**: None
- **Maps to**: CORE C01/C02/O03
- **Recommended Next Skill**: competitor-analysis

## Full Findings

### Primary Keywords
| Keyword | Volume | Difficulty | Intent |
|---------|--------|------------|--------|
| gas diffusion layer | 1,200 | 45 | Informational |
| carbon paper fuel cell | 880 | 38 | Commercial |

### Topic Clusters
- Fuel cell components (12 keywords)
- Conductive materials (8 keywords)
`;

    it('parses handoff frontmatter correctly', () => {
      const { frontmatter } = parseHandoffFile(mockHandoff);

      expect(frontmatter.skill).toBe('keyword-research');
      expect(frontmatter.domain).toBe('caplinq.com');
      expect(frontmatter.status).toBe('DONE');
    });

    it('validates handoff structure', () => {
      const { valid, errors } = validateHandoffFile(mockHandoff);

      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Mock HTML report validation', () => {
    const mockReportHtml = `<!DOCTYPE html>
<html>
<head>
<style>
:root { --bg: #0d1117; --text: #e6edf3; --green: #3fb950; --amber: #d29922; --red: #f85149; }
body { background: var(--bg); color: var(--text); }
</style>
</head>
<body>
<h1>caplinq.com Analysis</h1>
<nav>
  <button>Executive Summary</button>
  <button>Domain Baseline</button>
  <button>Research</button>
  <button>Technical</button>
  <button>Content Quality</button>
  <button>Recommendations</button>
  <button>Monitoring</button>
  <button>Next Steps</button>
</nav>
<main>
  <div>CITE Score: 72/100 | Verdict: CAUTIOUS</div>
  <div>CORE-EEAT: GEO 68/100 | SEO 71/100</div>
</main>
<script>
document.querySelectorAll('nav button').forEach(b => {
  b.onclick = () => console.log(b.textContent);
});
</script>
</body>
</html>`;

    it('validates self-contained HTML report', () => {
      const { valid, errors } = validateHtmlReport(mockReportHtml);

      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('has no external dependencies', () => {
      expect(mockReportHtml).not.toMatch(/<link[^>]+href=["']https?:/);
      expect(mockReportHtml).not.toMatch(/<script[^>]+src=["']https?:/);
    });

    it('includes CITE and CORE-EEAT scores', () => {
      expect(mockReportHtml).toContain('CITE');
      expect(mockReportHtml).toContain('CORE-EEAT');
    });
  });

  describe('Pipeline resilience', () => {
    /**
     * Simulate pipeline execution with blocked skills
     */
    function simulatePipeline(blockedSkills = []) {
      const results = [];
      let blocked = 0;

      EXECUTION_SEQUENCE.forEach(step => {
        if (step.skill === 'html-report') {
          results.push({ ...step, status: 'DONE' });
          return;
        }

        if (blockedSkills.includes(step.skill)) {
          results.push({ ...step, status: 'BLOCKED' });
          blocked++;
        } else {
          results.push({ ...step, status: 'DONE' });
        }
      });

      const overallStatus = blocked > 10 ? 'BLOCKED' : blocked > 0 ? 'DONE_WITH_CONCERNS' : 'DONE';

      return { results, blocked, overallStatus };
    }

    it('continues after single BLOCKED skill', () => {
      const { results, blocked, overallStatus } = simulatePipeline(['rank-tracker']);

      expect(blocked).toBe(1);
      expect(overallStatus).toBe('DONE_WITH_CONCERNS');
      expect(results).toHaveLength(22);
    });

    it('continues after multiple BLOCKED skills', () => {
      const { results, blocked, overallStatus } = simulatePipeline([
        'keyword-research',
        'backlink-analyzer',
        'rank-tracker'
      ]);

      expect(blocked).toBe(3);
      expect(overallStatus).toBe('DONE_WITH_CONCERNS');

      // Subsequent skills after blocked ones should still run
      const afterKeyword = results.find(r => r.skill === 'competitor-analysis');
      expect(afterKeyword.status).toBe('DONE');
    });

    it('reports BLOCKED status when >10 skills fail', () => {
      const manyBlocked = EXECUTION_SEQUENCE
        .filter(s => s.skill !== 'html-report')
        .slice(0, 11)
        .map(s => s.skill);

      const { blocked, overallStatus } = simulatePipeline(manyBlocked);

      expect(blocked).toBe(11);
      expect(overallStatus).toBe('BLOCKED');
    });
  });
});

describe('Company Analysis - Existing Files Check', () => {
  describe('SKILL.md exists', () => {
    it('company-analysis SKILL.md exists', () => {
      const skillPath = join(rootDir, 'orchestration', 'company-analysis', 'SKILL.md');
      expect(existsSync(skillPath)).toBe(true);
    });

    it('SKILL.md has correct frontmatter name', () => {
      const skillPath = join(rootDir, 'orchestration', 'company-analysis', 'SKILL.md');
      const content = readFileSync(skillPath, 'utf-8');

      expect(content).toContain('name: company-analysis');
    });
  });

  describe('analyze-company command exists', () => {
    it('analyze-company.md command file exists', () => {
      const cmdPath = join(rootDir, 'commands', 'analyze-company.md');
      expect(existsSync(cmdPath)).toBe(true);
    });
  });

  describe('All referenced skills exist', () => {
    const skillsToCheck = [
      'entity-optimizer',
      'keyword-research',
      'competitor-analysis',
      'serp-analysis',
      'content-gap-analysis',
      'technical-seo-checker',
      'on-page-seo-auditor',
      'internal-linking-optimizer',
      'backlink-analyzer',
      'domain-authority-auditor',
      'content-quality-auditor',
      'content-refresher',
      'seo-content-writer',
      'geo-content-optimizer',
      'meta-tags-optimizer',
      'schema-markup-generator',
      'rank-tracker',
      'performance-reporter',
      'alert-manager',
      'memory-management'
    ];

    // Map skills to their directory paths
    const skillPaths = {
      'entity-optimizer': 'cross-cutting/entity-optimizer',
      'keyword-research': 'research/keyword-research',
      'competitor-analysis': 'research/competitor-analysis',
      'serp-analysis': 'research/serp-analysis',
      'content-gap-analysis': 'research/content-gap-analysis',
      'technical-seo-checker': 'optimize/technical-seo-checker',
      'on-page-seo-auditor': 'optimize/on-page-seo-auditor',
      'internal-linking-optimizer': 'optimize/internal-linking-optimizer',
      'backlink-analyzer': 'monitor/backlink-analyzer',
      'domain-authority-auditor': 'cross-cutting/domain-authority-auditor',
      'content-quality-auditor': 'cross-cutting/content-quality-auditor',
      'content-refresher': 'optimize/content-refresher',
      'seo-content-writer': 'build/seo-content-writer',
      'geo-content-optimizer': 'build/geo-content-optimizer',
      'meta-tags-optimizer': 'build/meta-tags-optimizer',
      'schema-markup-generator': 'build/schema-markup-generator',
      'rank-tracker': 'monitor/rank-tracker',
      'performance-reporter': 'monitor/performance-reporter',
      'alert-manager': 'monitor/alert-manager',
      'memory-management': 'cross-cutting/memory-management'
    };

    skillsToCheck.forEach(skill => {
      it(`${skill} SKILL.md exists`, () => {
        const skillDir = skillPaths[skill];
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        expect(existsSync(skillPath), `Missing SKILL.md for ${skill} at ${skillDir}`).toBe(true);
      });
    });
  });
});
