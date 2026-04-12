/**
 * Tests for plugin.json schema validation
 * Ensures plugin manifest is valid and references correct paths
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..', '..');

const pluginJsonPath = join(rootDir, '.claude-plugin', 'plugin.json');

// Expected counts per CLAUDE.md
const EXPECTED_SKILLS_COUNT = 21;
const EXPECTED_COMMANDS_COUNT = 10;

// Plugin.json schema based on Claude Code plugin spec
const pluginSchema = {
  type: 'object',
  required: ['schemaVersion', 'id', 'name', 'version', 'skills', 'commands'],
  properties: {
    schemaVersion: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
    id: { type: 'string', pattern: '^[a-z0-9-]+$' },
    name: { type: 'string' },
    version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
    displayName: { type: 'string' },
    description: { type: 'string', maxLength: 2048 },
    author: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        url: { type: 'string', format: 'uri' }
      }
    },
    homepage: { type: 'string', format: 'uri' },
    repository: { type: 'string', format: 'uri' },
    license: { type: 'string' },
    keywords: { type: 'array', items: { type: 'string' } },
    capabilities: {
      type: 'object',
      properties: {
        skills: { type: 'object', properties: { enabled: { type: 'boolean' } } },
        commands: { type: 'object', properties: { enabled: { type: 'boolean' } } },
        tools: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            sources: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    },
    metadata: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        compatible_with: { type: 'array', items: { type: 'string' } }
      }
    },
    commands: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'description', 'path'],
        properties: {
          name: { type: 'string', pattern: '^[a-z-]+$' },
          description: { type: 'string' },
          path: { type: 'string' }
        }
      }
    },
    skills: {
      type: 'array',
      items: { type: 'string', pattern: '^\\./' }
    },
    hooks: {
      type: 'array',
      items: {
        type: 'object',
        required: ['event', 'path'],
        properties: {
          event: { type: 'string', enum: ['SessionStart', 'UserPromptSubmit', 'PostToolUse', 'Stop'] },
          path: { type: 'string' }
        }
      }
    },
    mcpServers: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'path'],
        properties: {
          id: { type: 'string' },
          path: { type: 'string' }
        }
      }
    }
  }
};

describe('plugin.json Validation', () => {
  let pluginJson;
  let ajv;

  beforeAll(() => {
    if (existsSync(pluginJsonPath)) {
      pluginJson = JSON.parse(readFileSync(pluginJsonPath, 'utf-8'));
    }
    ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
  });

  describe('Schema validation', () => {
    it('plugin.json exists', () => {
      expect(existsSync(pluginJsonPath)).toBe(true);
    });

    it('validates against plugin schema', () => {
      const validate = ajv.compile(pluginSchema);
      const valid = validate(pluginJson);

      if (!valid) {
        console.error('Schema errors:', validate.errors);
      }

      expect(valid).toBe(true);
    });

    it('has valid schemaVersion (semver)', () => {
      expect(pluginJson.schemaVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('has valid plugin version (semver)', () => {
      expect(pluginJson.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('id matches name', () => {
      expect(pluginJson.id).toBe(pluginJson.name);
    });
  });

  describe('Skills registration', () => {
    it(`has exactly ${EXPECTED_SKILLS_COUNT} skills registered`, () => {
      expect(pluginJson.skills).toHaveLength(EXPECTED_SKILLS_COUNT);
    });

    it('all skill paths start with ./', () => {
      pluginJson.skills.forEach(skillPath => {
        expect(skillPath).toMatch(/^\.\//);
      });
    });

    it('all skill paths exist on disk', () => {
      const missingSkills = [];

      pluginJson.skills.forEach(skillPath => {
        // Remove leading ./
        const relativePath = skillPath.replace(/^\.\//, '');
        const skillDir = join(rootDir, relativePath);
        const skillFile = join(skillDir, 'SKILL.md');

        if (!existsSync(skillFile)) {
          missingSkills.push(skillPath);
        }
      });

      expect(missingSkills, `Missing skills: ${missingSkills.join(', ')}`).toHaveLength(0);
    });

    it('skill paths are unique (no duplicates)', () => {
      const unique = new Set(pluginJson.skills);
      expect(unique.size).toBe(pluginJson.skills.length);
    });

    it('skills cover all expected categories', () => {
      const categories = new Set(pluginJson.skills.map(s => s.split('/')[1]));

      expect(categories.has('research')).toBe(true);
      expect(categories.has('build')).toBe(true);
      expect(categories.has('optimize')).toBe(true);
      expect(categories.has('monitor')).toBe(true);
      expect(categories.has('cross-cutting')).toBe(true);
      expect(categories.has('orchestration')).toBe(true);
    });
  });

  describe('Commands registration', () => {
    it(`has exactly ${EXPECTED_COMMANDS_COUNT} commands registered`, () => {
      expect(pluginJson.commands).toHaveLength(EXPECTED_COMMANDS_COUNT);
    });

    it('all commands have required fields', () => {
      pluginJson.commands.forEach(cmd => {
        expect(cmd.name, `Command missing name`).toBeDefined();
        expect(cmd.description, `Command ${cmd.name} missing description`).toBeDefined();
        expect(cmd.path, `Command ${cmd.name} missing path`).toBeDefined();
      });
    });

    it('all command paths exist on disk', () => {
      const missingCommands = [];

      pluginJson.commands.forEach(cmd => {
        const cmdPath = join(rootDir, cmd.path);

        if (!existsSync(cmdPath)) {
          missingCommands.push(cmd.path);
        }
      });

      expect(missingCommands, `Missing commands: ${missingCommands.join(', ')}`).toHaveLength(0);
    });

    it('command names are kebab-case', () => {
      pluginJson.commands.forEach(cmd => {
        expect(cmd.name).toMatch(/^[a-z]+(-[a-z]+)*$/);
      });
    });

    it('command names are unique (no duplicates)', () => {
      const names = pluginJson.commands.map(c => c.name);
      const unique = new Set(names);
      expect(unique.size).toBe(names.length);
    });

    it('expected commands are registered', () => {
      const commandNames = pluginJson.commands.map(c => c.name);

      expect(commandNames).toContain('audit-page');
      expect(commandNames).toContain('audit-domain');
      expect(commandNames).toContain('check-technical');
      expect(commandNames).toContain('generate-schema');
      expect(commandNames).toContain('keyword-research');
      expect(commandNames).toContain('optimize-meta');
      expect(commandNames).toContain('report');
      expect(commandNames).toContain('setup-alert');
      expect(commandNames).toContain('write-content');
      expect(commandNames).toContain('analyze-company');
    });
  });

  describe('Hooks registration', () => {
    it('has hooks defined', () => {
      expect(pluginJson.hooks).toBeDefined();
      expect(pluginJson.hooks.length).toBeGreaterThan(0);
    });

    it('all hook events are valid', () => {
      const validEvents = ['SessionStart', 'UserPromptSubmit', 'PostToolUse', 'Stop'];

      pluginJson.hooks.forEach(hook => {
        expect(validEvents).toContain(hook.event);
      });
    });

    it('hooks file path exists on disk', () => {
      pluginJson.hooks.forEach(hook => {
        const hookPath = join(rootDir, hook.path);
        expect(existsSync(hookPath), `Missing hook file: ${hook.path}`).toBe(true);
      });
    });
  });

  describe('MCP Servers registration', () => {
    it('has mcpServers defined', () => {
      expect(pluginJson.mcpServers).toBeDefined();
    });

    it('mcp config file exists on disk', () => {
      pluginJson.mcpServers.forEach(server => {
        const configPath = join(rootDir, server.path);
        expect(existsSync(configPath), `Missing MCP config: ${server.path}`).toBe(true);
      });
    });
  });

  describe('Metadata validation', () => {
    it('has valid category', () => {
      expect(pluginJson.metadata.category).toBe('marketing');
    });

    it('has tags', () => {
      expect(pluginJson.metadata.tags).toBeDefined();
      expect(pluginJson.metadata.tags.length).toBeGreaterThan(0);
    });

    it('tags are lowercase', () => {
      pluginJson.metadata.tags.forEach(tag => {
        expect(tag).toBe(tag.toLowerCase());
      });
    });

    it('keywords are lowercase', () => {
      pluginJson.keywords.forEach(keyword => {
        expect(keyword).toBe(keyword.toLowerCase());
      });
    });

    it('has valid license (SPDX identifier)', () => {
      const validLicenses = ['Apache-2.0', 'MIT', 'BSD-3-Clause', 'ISC', 'GPL-3.0', 'UNLICENSED'];
      expect(validLicenses).toContain(pluginJson.license);
    });
  });
});
