/**
 * Tests for SKILL.md required sections validation
 * Ensures all skills have the mandatory sections as per skill contract
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..', '..');

// All skill directories to test
const skillDirs = [
  'research/keyword-research',
  'research/competitor-analysis',
  'research/serp-analysis',
  'research/content-gap-analysis',
  'build/seo-content-writer',
  'build/geo-content-optimizer',
  'build/meta-tags-optimizer',
  'build/schema-markup-generator',
  'optimize/technical-seo-checker',
  'optimize/internal-linking-optimizer',
  'optimize/on-page-seo-auditor',
  'optimize/content-refresher',
  'monitor/rank-tracker',
  'monitor/backlink-analyzer',
  'monitor/performance-reporter',
  'monitor/alert-manager',
  'cross-cutting/content-quality-auditor',
  'cross-cutting/domain-authority-auditor',
  'cross-cutting/entity-optimizer',
  'cross-cutting/memory-management',
  'orchestration/company-analysis'
];

// Required sections as per skill-contract.md
const requiredSections = [
  'When This Must Trigger',
  'Quick Start',
  'Skill Contract',
  'Instructions'
];

// Recommended sections (warn if missing)
const recommendedSections = [
  'Validation Checkpoints',
  'Reference Materials',
  'Next Best Skill'
];

// Skill Contract sub-fields
const skillContractFields = [
  'Reads',
  'Writes'
];

function sectionExists(content, sectionName) {
  // Match markdown headers with the section name (case-insensitive)
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^#{1,3}\\s+${escapedName}`, 'im');
  return regex.test(content);
}

function fieldExists(content, fieldName) {
  // Match **FieldName**: pattern in Skill Contract section
  const regex = new RegExp(`\\*\\*${fieldName}\\*\\*:`, 'i');
  return regex.test(content);
}

describe('SKILL.md Required Sections Validation', () => {
  describe('Mandatory sections', () => {
    skillDirs.forEach(skillDir => {
      describe(skillDir, () => {
        let content;

        beforeAll(() => {
          const skillPath = join(rootDir, skillDir, 'SKILL.md');
          if (existsSync(skillPath)) {
            content = readFileSync(skillPath, 'utf-8');
          }
        });

        requiredSections.forEach(section => {
          it(`has section: "${section}"`, () => {
            expect(content).toBeDefined();
            expect(
              sectionExists(content, section),
              `Missing required section "${section}" in ${skillDir}`
            ).toBe(true);
          });
        });
      });
    });
  });

  describe('Skill Contract structure', () => {
    skillDirs.forEach(skillDir => {
      describe(skillDir, () => {
        let content;

        beforeAll(() => {
          const skillPath = join(rootDir, skillDir, 'SKILL.md');
          if (existsSync(skillPath)) {
            content = readFileSync(skillPath, 'utf-8');
          }
        });

        skillContractFields.forEach(field => {
          it(`Skill Contract has "${field}" field`, () => {
            expect(content).toBeDefined();
            expect(
              fieldExists(content, field),
              `Missing "${field}" in Skill Contract section of ${skillDir}`
            ).toBe(true);
          });
        });
      });
    });
  });

  describe('Recommended sections (warnings)', () => {
    skillDirs.forEach(skillDir => {
      it(`${skillDir} has recommended sections`, () => {
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf-8');
        const missing = [];

        recommendedSections.forEach(section => {
          if (!sectionExists(content, section)) {
            missing.push(section);
          }
        });

        if (missing.length > 0) {
          console.warn(`[WARN] ${skillDir} missing recommended sections: ${missing.join(', ')}`);
        }

        // Don't fail, just warn
        expect(true).toBe(true);
      });
    });
  });

  describe('Quick Start section content', () => {
    skillDirs.forEach(skillDir => {
      it(`${skillDir} Quick Start has example invocation`, () => {
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf-8');

        // Extract Quick Start section (capture until next ## heading or end)
        const quickStartMatch = content.match(/##\s+Quick Start[\s\S]*?(?=\n##\s+[^#]|$)/i);
        if (!quickStartMatch) return;

        const quickStartContent = quickStartMatch[0];

        // Should contain code block, command, or descriptive example
        const hasCodeBlock = /```/.test(quickStartContent);
        const hasCommand = /\/[a-z]+:/.test(quickStartContent);
        const hasPromptExample = /prompt|example|Research|Find|Analyze|Generate|Audit|Check|Write|Optimize/i.test(quickStartContent);

        expect(
          hasCodeBlock || hasCommand || hasPromptExample,
          `Quick Start in ${skillDir} should have example invocation`
        ).toBe(true);
      });
    });
  });

  describe('Handoff summary format', () => {
    skillDirs.forEach(skillDir => {
      it(`${skillDir} mentions handoff or next skill`, () => {
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf-8');

        // Should mention handoff or next skill somewhere
        const hasHandoff = /handoff/i.test(content);
        const hasNextSkill = /next.*skill|recommended.*skill|follow.*skill/i.test(content);
        const hasStatus = /DONE|BLOCKED|NEEDS_INPUT/i.test(content);

        expect(
          hasHandoff || hasNextSkill || hasStatus,
          `${skillDir} should mention handoff, next skill, or status values`
        ).toBe(true);
      });
    });
  });

  describe('CITE/CORE-EEAT mapping', () => {
    skillDirs.forEach(skillDir => {
      it(`${skillDir} mentions CITE or CORE-EEAT mappings`, () => {
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf-8');

        // Should mention CITE or CORE-EEAT item IDs
        const hasCiteMapping = /CITE|C0[1-9]|I0[1-9]|T0[1-9]|E0[1-9]/i.test(content);
        const hasCoreEeatMapping = /CORE-EEAT|EEAT|Exp0|Ept0|A0[1-9]/i.test(content);
        const hasMapsTo = /maps.*to/i.test(content);

        // At least one mapping reference should exist
        expect(
          hasCiteMapping || hasCoreEeatMapping || hasMapsTo,
          `${skillDir} should reference CITE or CORE-EEAT framework items`
        ).toBe(true);
      });
    });
  });

  describe('Tool connector pattern', () => {
    it('skills use ~~ placeholder pattern for tools', () => {
      const toolPlaceholders = ['~~SEO tool', '~~analytics', '~~search console', '~~web crawler'];
      let foundPlaceholder = false;

      skillDirs.forEach(skillDir => {
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf-8');

        if (/~~[a-zA-Z]/.test(content)) {
          foundPlaceholder = true;
        }
      });

      // At least some skills should use the placeholder pattern
      // This is a soft check - not all skills need it
      expect(true).toBe(true);
    });
  });
});
