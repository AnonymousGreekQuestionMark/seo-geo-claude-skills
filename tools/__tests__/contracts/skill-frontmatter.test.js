/**
 * Tests for SKILL.md frontmatter validation
 * Ensures all skills have valid YAML frontmatter with required fields
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yaml';

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

const requiredFields = ['name', 'description', 'version'];
const recommendedFields = ['when_to_use', 'argument-hint'];

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return YAML.parse(match[1]);
  } catch (e) {
    return null;
  }
}

describe('SKILL.md Frontmatter Validation', () => {
  describe('All skills have SKILL.md files', () => {
    skillDirs.forEach(skillDir => {
      it(`${skillDir} has SKILL.md`, () => {
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        expect(existsSync(skillPath), `Missing SKILL.md in ${skillDir}`).toBe(true);
      });
    });
  });

  describe('Frontmatter structure', () => {
    skillDirs.forEach(skillDir => {
      describe(skillDir, () => {
        let frontmatter;
        let content;

        beforeAll(() => {
          const skillPath = join(rootDir, skillDir, 'SKILL.md');
          if (existsSync(skillPath)) {
            content = readFileSync(skillPath, 'utf-8');
            frontmatter = extractFrontmatter(content);
          }
        });

        it('has valid YAML frontmatter', () => {
          expect(frontmatter, `Invalid or missing frontmatter in ${skillDir}`).toBeDefined();
          expect(typeof frontmatter).toBe('object');
        });

        requiredFields.forEach(field => {
          it(`has required field: ${field}`, () => {
            expect(frontmatter).toBeDefined();
            expect(frontmatter[field], `Missing ${field} in ${skillDir}`).toBeDefined();
            expect(frontmatter[field]).not.toBe('');
          });
        });

        it('name matches directory name (kebab-case)', () => {
          expect(frontmatter).toBeDefined();
          const dirName = skillDir.split('/').pop();
          expect(frontmatter.name).toBe(dirName);
        });

        it('description is under 1024 characters', () => {
          expect(frontmatter).toBeDefined();
          expect(frontmatter.description.length).toBeLessThanOrEqual(1024);
        });

        it('version follows semver format', () => {
          expect(frontmatter).toBeDefined();
          expect(frontmatter.version).toMatch(/^\d+\.\d+\.\d+$/);
        });
      });
    });
  });

  describe('Recommended fields warnings', () => {
    skillDirs.forEach(skillDir => {
      it(`${skillDir} has recommended fields`, () => {
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        if (!frontmatter) return;

        recommendedFields.forEach(field => {
          if (!frontmatter[field]) {
            // Log warning but don't fail
            console.warn(`[WARN] ${skillDir} missing recommended field '${field}'`);
          }
        });

        // At least check that when_to_use uses underscores (not hyphens)
        if (frontmatter.when_to_use) {
          expect(frontmatter).not.toHaveProperty('when-to-use');
        }
      });
    });
  });

  describe('Metadata validation', () => {
    skillDirs.forEach(skillDir => {
      it(`${skillDir} metadata tags are valid format`, () => {
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        if (!frontmatter || !frontmatter.metadata?.tags) return;

        frontmatter.metadata.tags.forEach(tag => {
          // Tags should be kebab-case for English (case-insensitive), or valid non-ASCII characters
          // English tags: a-zA-Z0-9- (allowing mixed case for brand names like "SurferSEO")
          // Non-English tags: Unicode letters allowed (Chinese, Japanese, Korean, Spanish, etc.)
          const isEnglishKebab = /^[a-zA-Z0-9-]+$/.test(tag);
          const isNonAscii = /[^\x00-\x7F]/.test(tag);
          const hasNoSpaces = !/\s/.test(tag);

          expect(
            isEnglishKebab || (isNonAscii && hasNoSpaces),
            `Tag "${tag}" should be kebab-case (English) or valid non-ASCII`
          ).toBe(true);
        });
      });
    });
  });

  describe('License compliance', () => {
    skillDirs.forEach(skillDir => {
      it(`${skillDir} has valid license if specified`, () => {
        const skillPath = join(rootDir, skillDir, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        if (!frontmatter || !frontmatter.license) return;

        // Common SPDX identifiers
        const validLicenses = ['Apache-2.0', 'MIT', 'BSD-3-Clause', 'ISC', 'GPL-3.0', 'UNLICENSED'];
        expect(validLicenses).toContain(frontmatter.license);
      });
    });
  });
});
