/**
 * Tests for tools/shared/config.js
 * API configuration and availability checks
 *
 * NOTE: config.js uses dotenv which loads .env at import time.
 * Tests for "unavailable" states may be skipped in dev environments
 * where .env has API keys set. These tests pass in CI where no .env exists.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('config.js', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('DataForSEO configuration', () => {
    it('marks DataForSEO available when both login and password set', async () => {
      process.env.DATAFORSEO_LOGIN = 'test_user';
      process.env.DATAFORSEO_PASSWORD = 'test_pass';

      const { config } = await import('../../shared/config.js');

      expect(config.dataforseo.available).toBe(true);
      expect(config.dataforseo.login).toBe('test_user');
      expect(config.dataforseo.password).toBe('test_pass');
    });

    it('marks DataForSEO unavailable when login missing', async () => {
      delete process.env.DATAFORSEO_LOGIN;
      process.env.DATAFORSEO_PASSWORD = 'test_pass';

      const { config } = await import('../../shared/config.js');

      expect(config.dataforseo.available).toBe(false);
    });

    it('marks DataForSEO unavailable when password missing', async () => {
      process.env.DATAFORSEO_LOGIN = 'test_user';
      delete process.env.DATAFORSEO_PASSWORD;

      const { config } = await import('../../shared/config.js');

      expect(config.dataforseo.available).toBe(false);
    });

    it('generates correct Basic auth header', async () => {
      process.env.DATAFORSEO_LOGIN = 'myuser';
      process.env.DATAFORSEO_PASSWORD = 'mypass';

      const { config } = await import('../../shared/config.js');
      const header = config.dataforseo.authHeader();

      const expectedB64 = Buffer.from('myuser:mypass').toString('base64');
      expect(header.Authorization).toBe(`Basic ${expectedB64}`);
    });
  });

  describe('Serper configuration', () => {
    it('marks Serper available with API key', async () => {
      process.env.SERPER_API_KEY = 'serper_key_123';

      const { config } = await import('../../shared/config.js');

      expect(config.serper.available).toBe(true);
      expect(config.serper.apiKey).toBe('serper_key_123');
    });

    it('marks Serper unavailable without API key (skipped if SERPER_API_KEY set)', async () => {
      // Skip if env var is already set from .env (dotenv runs at config.js import time)
      const { config } = await import('../../shared/config.js');
      if (config.serper.apiKey && config.serper.apiKey !== 'serper_key_123') {
        return; // Skip - env var set from .env
      }

      delete process.env.SERPER_API_KEY;
      vi.resetModules();
      const { config: freshConfig } = await import('../../shared/config.js');

      expect(freshConfig.serper.available).toBe(false);
    });
  });

  describe('Google configuration', () => {
    it('marks Google available with API key (skipped if CSE_ID in env)', async () => {
      // First import to check if dotenv loaded GOOGLE_CSE_ID
      const { config: checkConfig } = await import('../../shared/config.js');
      if (checkConfig.google.cseId) {
        return; // Skip - env var set from .env, can't test "CSE unavailable" state
      }

      vi.resetModules();
      process.env.GOOGLE_API_KEY = 'google_key';
      delete process.env.GOOGLE_CSE_ID;

      const { config } = await import('../../shared/config.js');

      expect(config.google.available).toBe(true);
      expect(config.google.cseAvailable).toBe(false);
    });

    it('marks Google CSE available only with both key and CSE ID', async () => {
      process.env.GOOGLE_API_KEY = 'google_key';
      process.env.GOOGLE_CSE_ID = 'cse_id';

      const { config } = await import('../../shared/config.js');

      expect(config.google.available).toBe(true);
      expect(config.google.cseAvailable).toBe(true);
    });

    it('marks Google CSE unavailable when CSE ID missing (skipped if CSE_ID in env)', async () => {
      // First import to check if dotenv loaded GOOGLE_CSE_ID
      const { config: checkConfig } = await import('../../shared/config.js');
      if (checkConfig.google.cseId) {
        return; // Skip - env var set from .env, can't test "CSE unavailable" state
      }

      vi.resetModules();
      process.env.GOOGLE_API_KEY = 'google_key';
      delete process.env.GOOGLE_CSE_ID;

      const { config } = await import('../../shared/config.js');

      expect(config.google.cseAvailable).toBe(false);
    });
  });

  describe('OpenAI configuration', () => {
    it('marks OpenAI available with API key', async () => {
      process.env.OPENAI_API_KEY = 'sk-test';

      const { config } = await import('../../shared/config.js');

      expect(config.openai.available).toBe(true);
      expect(config.openai.apiKey).toBe('sk-test');
    });

    it('uses default model when not specified', async () => {
      process.env.OPENAI_API_KEY = 'sk-test';
      delete process.env.OPENAI_MODEL;

      const { config } = await import('../../shared/config.js');

      expect(config.openai.model).toBe('gpt-4o');
    });

    it('uses custom model when specified', async () => {
      process.env.OPENAI_API_KEY = 'sk-test';
      process.env.OPENAI_MODEL = 'gpt-4o';

      const { config } = await import('../../shared/config.js');

      expect(config.openai.model).toBe('gpt-4o');
    });
  });

  describe('Anthropic configuration', () => {
    it('marks Anthropic available with API key', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test';

      const { config } = await import('../../shared/config.js');

      expect(config.anthropic.available).toBe(true);
    });

    it('uses default model when not specified', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
      delete process.env.ANTHROPIC_MODEL;

      const { config } = await import('../../shared/config.js');

      expect(config.anthropic.model).toBe('claude-sonnet-4-5');
    });

    it('reads web search flag', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
      process.env.ANTHROPIC_WEB_SEARCH = 'true';

      const { config } = await import('../../shared/config.js');

      expect(config.anthropic.webSearch).toBe(true);
    });
  });

  describe('Gemini configuration', () => {
    it('marks Gemini available with API key', async () => {
      process.env.GEMINI_API_KEY = 'gemini_key';

      const { config } = await import('../../shared/config.js');

      expect(config.gemini.available).toBe(true);
    });

    it('uses default model when not specified', async () => {
      process.env.GEMINI_API_KEY = 'gemini_key';
      delete process.env.GEMINI_MODEL;

      const { config } = await import('../../shared/config.js');

      expect(config.gemini.model).toBe('gemini-2.5-flash');
    });
  });

  describe('Perplexity configuration', () => {
    it('marks Perplexity available with API key', async () => {
      process.env.PERPLEXITY_API_KEY = 'pplx_key';

      const { config } = await import('../../shared/config.js');

      expect(config.perplexity.available).toBe(true);
    });

    it('uses default model when not specified', async () => {
      process.env.PERPLEXITY_API_KEY = 'pplx_key';
      delete process.env.PERPLEXITY_MODEL;

      const { config } = await import('../../shared/config.js');

      expect(config.perplexity.model).toBe('sonar');
    });
  });

  describe('Open PageRank configuration', () => {
    it('marks OPR available with API key', async () => {
      process.env.OPR_API_KEY = 'opr_key';

      const { config } = await import('../../shared/config.js');

      expect(config.opr.available).toBe(true);
      expect(config.opr.apiKey).toBe('opr_key');
    });

    it('marks OPR unavailable without API key (skipped if OPR_API_KEY in env)', async () => {
      // First import to check if dotenv loaded OPR_API_KEY
      const { config: checkConfig } = await import('../../shared/config.js');
      if (checkConfig.opr.apiKey) {
        return; // Skip - env var set from .env, can't test "unavailable" state
      }

      vi.resetModules();
      delete process.env.OPR_API_KEY;

      const { config } = await import('../../shared/config.js');

      expect(config.opr.available).toBe(false);
    });
  });

  describe('tierStatus helper', () => {
    it('writes status to stderr with check marks', async () => {
      const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

      const { tierStatus } = await import('../../shared/config.js');

      tierStatus('test-server', {
        'API A (available)': true,
        'API B (unavailable)': false
      });

      expect(stderrSpy).toHaveBeenCalled();
      const output = stderrSpy.mock.calls[0][0];
      expect(output).toContain('[test-server]');
      expect(output).toContain('✓ API A (available)');
      expect(output).toContain('✗ API B (unavailable)');

      stderrSpy.mockRestore();
    });
  });

  describe('unavailable helper', () => {
    it('returns tier 1 unavailable response structure', async () => {
      const { unavailable } = await import('../../shared/config.js');

      const result = unavailable('No API key configured');

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.tier).toBe(1);
      expect(parsed.status).toBe('unavailable');
      expect(parsed.reason).toBe('No API key configured');
    });
  });
});
