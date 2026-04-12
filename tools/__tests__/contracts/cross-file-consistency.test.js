/**
 * Tests for cross-file consistency
 * Ensures plugin.json, marketplace.json, .mcp.json, and directory structure are in sync
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..', '..');

// File paths
const pluginJsonPath = join(rootDir, '.claude-plugin', 'plugin.json');
const marketplaceJsonPath = join(rootDir, 'marketplace.json');
const mcpJsonPath = join(rootDir, '.mcp.json');
const versionsPath = join(rootDir, 'VERSIONS.md');
const claudeMdPath = join(rootDir, 'CLAUDE.md');

// Skill category directories
const skillCategories = ['research', 'build', 'optimize', 'monitor', 'cross-cutting', 'orchestration'];

// Self-hosted MCP servers (stdio type)
const selfHostedMcpServers = [
  'keyword-and-backlinks',
  'serp-analyzer',
  'ai-citation-monitor',
  'entity-checker',
  'schema-validator',
  'pagespeed',
  'site-crawler',
  'brand-monitor'
];

describe('Cross-File Consistency', () => {
  let pluginJson;
  let marketplaceJson;
  let mcpJson;

  beforeAll(() => {
    if (existsSync(pluginJsonPath)) {
      pluginJson = JSON.parse(readFileSync(pluginJsonPath, 'utf-8'));
    }
    if (existsSync(marketplaceJsonPath)) {
      marketplaceJson = JSON.parse(readFileSync(marketplaceJsonPath, 'utf-8'));
    }
    if (existsSync(mcpJsonPath)) {
      mcpJson = JSON.parse(readFileSync(mcpJsonPath, 'utf-8'));
    }
  });

  describe('Directory structure matches plugin.json', () => {
    it('all skill categories exist as directories', () => {
      skillCategories.forEach(category => {
        const categoryPath = join(rootDir, category);
        expect(
          existsSync(categoryPath) && statSync(categoryPath).isDirectory(),
          `Missing category directory: ${category}`
        ).toBe(true);
      });
    });

    it('all skills in plugin.json have SKILL.md files', () => {
      const missingSkillMd = [];

      pluginJson.skills.forEach(skillPath => {
        const relativePath = skillPath.replace(/^\.\//, '');
        const skillMdPath = join(rootDir, relativePath, 'SKILL.md');

        if (!existsSync(skillMdPath)) {
          missingSkillMd.push(skillPath);
        }
      });

      expect(missingSkillMd, `Skills missing SKILL.md: ${missingSkillMd.join(', ')}`).toHaveLength(0);
    });

    it('all skill directories on disk are registered in plugin.json', () => {
      const registeredSkills = new Set(
        pluginJson.skills.map(s => s.replace(/^\.\//, ''))
      );
      const unregisteredSkills = [];

      skillCategories.forEach(category => {
        const categoryPath = join(rootDir, category);
        if (!existsSync(categoryPath)) return;

        readdirSync(categoryPath).forEach(item => {
          const itemPath = join(categoryPath, item);
          const skillMdPath = join(itemPath, 'SKILL.md');

          // If it's a directory with SKILL.md, it should be registered
          if (statSync(itemPath).isDirectory() && existsSync(skillMdPath)) {
            const skillPath = `${category}/${item}`;
            if (!registeredSkills.has(skillPath)) {
              unregisteredSkills.push(skillPath);
            }
          }
        });
      });

      expect(
        unregisteredSkills,
        `Skills not registered in plugin.json: ${unregisteredSkills.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('marketplace.json matches plugin.json', () => {
    it('marketplace.json exists', () => {
      expect(existsSync(marketplaceJsonPath)).toBe(true);
    });

    it('version matches plugin.json', () => {
      expect(marketplaceJson.metadata.version).toBe(pluginJson.version);
    });

    it('plugin name matches', () => {
      expect(marketplaceJson.plugins[0].name).toBe(pluginJson.name);
    });

    it('plugin version matches', () => {
      expect(marketplaceJson.plugins[0].version).toBe(pluginJson.version);
    });

    it('skills list matches plugin.json exactly', () => {
      const pluginSkills = [...pluginJson.skills].sort();
      const marketplaceSkills = [...marketplaceJson.plugins[0].skills].sort();

      expect(marketplaceSkills).toEqual(pluginSkills);
    });

    it('skill count matches', () => {
      expect(marketplaceJson.plugins[0].skills.length).toBe(pluginJson.skills.length);
    });
  });

  describe('.mcp.json consistency', () => {
    it('.mcp.json exists', () => {
      expect(existsSync(mcpJsonPath)).toBe(true);
    });

    it('all self-hosted MCP servers have JS files on disk', () => {
      const missingServers = [];

      selfHostedMcpServers.forEach(serverName => {
        const serverConfig = mcpJson.mcpServers[serverName];
        if (!serverConfig) {
          missingServers.push(`${serverName} (not in config)`);
          return;
        }

        if (serverConfig.type === 'stdio') {
          // Extract JS file path from args
          const jsFile = serverConfig.args.find(arg => arg.endsWith('.js'));
          if (jsFile) {
            const jsPath = join(rootDir, jsFile);
            if (!existsSync(jsPath)) {
              missingServers.push(`${serverName} (${jsFile})`);
            }
          }
        }
      });

      expect(missingServers, `Missing MCP server files: ${missingServers.join(', ')}`).toHaveLength(0);
    });

    it('all stdio MCP servers use node command', () => {
      Object.entries(mcpJson.mcpServers).forEach(([name, config]) => {
        if (config.type === 'stdio') {
          expect(config.command, `${name} should use node command`).toBe('node');
        }
      });
    });

    it('all http MCP servers have valid URLs', () => {
      Object.entries(mcpJson.mcpServers).forEach(([name, config]) => {
        if (config.type === 'http') {
          expect(config.url, `${name} should have URL`).toBeDefined();
          expect(config.url).toMatch(/^https?:\/\//);
        }
      });
    });

    it('expected self-hosted servers are registered', () => {
      selfHostedMcpServers.forEach(serverName => {
        expect(
          mcpJson.mcpServers[serverName],
          `Missing MCP server: ${serverName}`
        ).toBeDefined();
      });
    });
  });

  describe('VERSIONS.md consistency', () => {
    it('VERSIONS.md exists', () => {
      expect(existsSync(versionsPath)).toBe(true);
    });

    it('contains current plugin version', () => {
      const versionsContent = readFileSync(versionsPath, 'utf-8');
      expect(versionsContent).toContain(pluginJson.version);
    });
  });

  describe('CLAUDE.md skill list consistency', () => {
    it('CLAUDE.md exists', () => {
      expect(existsSync(claudeMdPath)).toBe(true);
    });

    it('mentions all skill categories', () => {
      const claudeContent = readFileSync(claudeMdPath, 'utf-8');

      expect(claudeContent).toContain('Research');
      expect(claudeContent).toContain('Build');
      expect(claudeContent).toContain('Optimize');
      expect(claudeContent).toContain('Monitor');
      expect(claudeContent).toContain('Cross-cutting');
    });

    it('mentions key skills', () => {
      const claudeContent = readFileSync(claudeMdPath, 'utf-8');

      // Sample key skills that should be mentioned
      expect(claudeContent).toContain('keyword-research');
      expect(claudeContent).toContain('competitor-analysis');
      expect(claudeContent).toContain('seo-content-writer');
      expect(claudeContent).toContain('technical-seo-checker');
      expect(claudeContent).toContain('rank-tracker');
      expect(claudeContent).toContain('content-quality-auditor');
      expect(claudeContent).toContain('entity-optimizer');
      expect(claudeContent).toContain('company-analysis');
    });

    it('mentions all commands', () => {
      const claudeContent = readFileSync(claudeMdPath, 'utf-8');

      pluginJson.commands.forEach(cmd => {
        expect(
          claudeContent.includes(cmd.name),
          `CLAUDE.md should mention command: ${cmd.name}`
        ).toBe(true);
      });
    });
  });

  describe('commands directory structure', () => {
    it('commands directory exists', () => {
      const commandsDir = join(rootDir, 'commands');
      expect(existsSync(commandsDir)).toBe(true);
    });

    it('all registered commands have .md files', () => {
      const missingCommands = [];

      pluginJson.commands.forEach(cmd => {
        const cmdPath = join(rootDir, cmd.path);
        if (!existsSync(cmdPath)) {
          missingCommands.push(cmd.name);
        }
      });

      expect(missingCommands, `Missing command files: ${missingCommands.join(', ')}`).toHaveLength(0);
    });
  });

  describe('hooks configuration', () => {
    it('hooks directory exists', () => {
      const hooksDir = join(rootDir, 'hooks');
      expect(existsSync(hooksDir)).toBe(true);
    });

    it('hooks.json exists', () => {
      const hooksJsonPath = join(rootDir, 'hooks', 'hooks.json');
      expect(existsSync(hooksJsonPath)).toBe(true);
    });

    it('hooks.json is valid JSON', () => {
      const hooksJsonPath = join(rootDir, 'hooks', 'hooks.json');
      const content = readFileSync(hooksJsonPath, 'utf-8');

      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe('references directory', () => {
    it('references directory exists', () => {
      const refsDir = join(rootDir, 'references');
      expect(existsSync(refsDir)).toBe(true);
    });

    it('core framework references exist', () => {
      const coreRefs = [
        'core-eeat-benchmark.md',
        'cite-domain-rating.md',
        'skill-contract.md',
        'state-model.md'
      ];

      coreRefs.forEach(ref => {
        const refPath = join(rootDir, 'references', ref);
        expect(existsSync(refPath), `Missing reference: ${ref}`).toBe(true);
      });
    });
  });

  describe('inter-skill skill name consistency', () => {
    it('skill directory names match frontmatter names', () => {
      const mismatches = [];

      pluginJson.skills.forEach(skillPath => {
        const relativePath = skillPath.replace(/^\.\//, '');
        const skillMdPath = join(rootDir, relativePath, 'SKILL.md');

        if (!existsSync(skillMdPath)) return;

        const content = readFileSync(skillMdPath, 'utf-8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

        if (frontmatterMatch) {
          const nameMatch = frontmatterMatch[1].match(/name:\s*["']?([^"'\n]+)["']?/);
          if (nameMatch) {
            const frontmatterName = nameMatch[1].trim();
            const dirName = relativePath.split('/').pop();

            if (frontmatterName !== dirName) {
              mismatches.push(`${skillPath}: frontmatter "${frontmatterName}" != dir "${dirName}"`);
            }
          }
        }
      });

      expect(mismatches, `Name mismatches:\n${mismatches.join('\n')}`).toHaveLength(0);
    });
  });
});
