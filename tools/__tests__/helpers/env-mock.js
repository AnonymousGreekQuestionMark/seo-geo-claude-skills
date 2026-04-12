/**
 * Environment variable mocking utilities
 * Allows testing different API availability configurations
 */
import { vi } from 'vitest';

/**
 * Run a test with specific environment variables
 * Restores original env after test completes
 */
export function withEnv(envOverrides, testFn) {
  return async () => {
    const original = { ...process.env };

    // Clear relevant keys first
    const keysToManage = [
      'DATAFORSEO_LOGIN', 'DATAFORSEO_PASSWORD',
      'SERPER_API_KEY',
      'GOOGLE_API_KEY', 'GOOGLE_CSE_ID',
      'OPENAI_API_KEY', 'OPENAI_MODEL',
      'ANTHROPIC_API_KEY', 'ANTHROPIC_MODEL', 'ANTHROPIC_WEB_SEARCH',
      'GEMINI_API_KEY', 'GEMINI_MODEL',
      'PERPLEXITY_API_KEY', 'PERPLEXITY_MODEL',
      'OPR_API_KEY'
    ];

    // Set all to undefined first to ensure clean state
    keysToManage.forEach(key => {
      delete process.env[key];
    });

    // Apply overrides
    Object.entries(envOverrides).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });

    try {
      await testFn();
    } finally {
      // Restore original environment
      process.env = original;
    }
  };
}

/**
 * Full API environment - all services available
 */
export const fullApiEnv = {
  DATAFORSEO_LOGIN: 'test_login',
  DATAFORSEO_PASSWORD: 'test_password',
  SERPER_API_KEY: 'serper_test_key',
  GOOGLE_API_KEY: 'google_test_key',
  GOOGLE_CSE_ID: 'google_cse_test_id',
  OPENAI_API_KEY: 'openai_test_key',
  ANTHROPIC_API_KEY: 'anthropic_test_key',
  GEMINI_API_KEY: 'gemini_test_key',
  PERPLEXITY_API_KEY: 'perplexity_test_key',
  OPR_API_KEY: 'opr_test_key'
};

/**
 * No API environment - all services unavailable
 */
export const noApiEnv = {
  DATAFORSEO_LOGIN: undefined,
  DATAFORSEO_PASSWORD: undefined,
  SERPER_API_KEY: undefined,
  GOOGLE_API_KEY: undefined,
  GOOGLE_CSE_ID: undefined,
  OPENAI_API_KEY: undefined,
  ANTHROPIC_API_KEY: undefined,
  GEMINI_API_KEY: undefined,
  PERPLEXITY_API_KEY: undefined,
  OPR_API_KEY: undefined
};

/**
 * Tier 1 only environment - only free/basic services available
 */
export const tier1Env = {
  ...noApiEnv,
  SERPER_API_KEY: 'serper_test_key',
  GOOGLE_API_KEY: 'google_test_key',
  OPR_API_KEY: 'opr_test_key'
};

/**
 * Tier 2 environment - includes paid services
 */
export const tier2Env = {
  ...tier1Env,
  DATAFORSEO_LOGIN: 'test_login',
  DATAFORSEO_PASSWORD: 'test_password'
};

/**
 * AI engines only environment
 */
export const aiEnginesEnv = {
  ...noApiEnv,
  OPENAI_API_KEY: 'openai_test_key',
  ANTHROPIC_API_KEY: 'anthropic_test_key',
  GEMINI_API_KEY: 'gemini_test_key',
  PERPLEXITY_API_KEY: 'perplexity_test_key'
};

/**
 * Reset all modules to pick up new environment
 * Call after changing env to reload config
 */
export async function resetModules() {
  vi.resetModules();
}

/**
 * Get fresh config with current environment
 */
export async function getFreshConfig() {
  vi.resetModules();
  const { config } = await import('../../shared/config.js');
  return config;
}
