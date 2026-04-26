/**
 * live-robots-txt.test.js
 * Integration tests for fetchRobotsTxt() — no API keys required, network only.
 * Fetches real robots.txt files and validates the parsed structure.
 * Saves results to tools/__tests__/integration/results/robots-txt-<timestamp>.json
 *
 * Run: npx vitest integration/live-robots-txt
 */
import { describe, it, expect, afterAll } from 'vitest';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { fetchRobotsTxt } from '../../shared/robots-txt-fetcher.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(__dirname, 'results');

const AI_BOT_KEYS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot', 'ChatGPT-User', 'Claude-User'];
const REQUIRED_FIELDS = ['domain', 'url', 'fetched_at', 'status_code', 'raw_content', 'parsed'];
const REQUIRED_PARSED = ['user_agents', 'sitemaps', 'ai_bots', 'allows_all_ai'];

const allResults = [];

function assertSchema(result, domain) {
  for (const field of REQUIRED_FIELDS) {
    expect(result, `${domain}: missing top-level field '${field}'`).toHaveProperty(field);
  }
  for (const field of REQUIRED_PARSED) {
    expect(result.parsed, `${domain}: missing parsed field '${field}'`).toHaveProperty(field);
  }
  expect(Array.isArray(result.parsed.user_agents)).toBe(true);
  expect(Array.isArray(result.parsed.sitemaps)).toBe(true);
  expect(typeof result.parsed.allows_all_ai).toBe('boolean');
  expect(typeof result.parsed.ai_bots).toBe('object');
  for (const bot of AI_BOT_KEYS) {
    expect(result.parsed.ai_bots, `${domain}: ai_bots missing key '${bot}'`).toHaveProperty(bot);
    expect(['allow', 'disallow', 'not_mentioned']).toContain(result.parsed.ai_bots[bot]);
  }
}

describe('fetchRobotsTxt — real domains', () => {
  it('fetches caplinq.com robots.txt and parses AI bot rules', async () => {
    const result = await fetchRobotsTxt('caplinq.com');
    allResults.push({ domain: 'caplinq.com', ...result });

    expect(result.domain).toBe('caplinq.com');
    expect(result.url).toBe('https://caplinq.com/robots.txt');
    expect(typeof result.fetched_at).toBe('string');
    expect(typeof result.raw_content).toBe('string');
    // 200 if robots.txt exists, 404 if not — both are valid
    expect([200, 404, 301, 302]).toContain(result.status_code);
    assertSchema(result, 'caplinq.com');
  }, 15000);

  it('fetches google.com robots.txt (well-known, large file)', async () => {
    const result = await fetchRobotsTxt('google.com');
    allResults.push({ domain: 'google.com', ...result });

    expect(result.status_code).toBe(200);
    expect(result.raw_content.length).toBeGreaterThan(100);
    expect(result.parsed.user_agents.length).toBeGreaterThan(0);
    assertSchema(result, 'google.com');
  }, 15000);

  it('handles nonexistent domain gracefully', async () => {
    const result = await fetchRobotsTxt('nonexistent-domain-xyz-999.invalid');
    allResults.push({ domain: 'nonexistent-domain-xyz-999.invalid', ...result });

    expect(result.status_code).toBeNull();
    expect(result.raw_content).toBe('');
    expect(result.parsed.user_agents).toEqual([]);
    expect(result.parsed.sitemaps).toEqual([]);
    expect(result.error).toBeDefined();
    // ai_bots should still be an object (may be empty on error)
    expect(typeof result.parsed.ai_bots).toBe('object');
  }, 15000);
});

describe('fetchRobotsTxt — schema completeness', () => {
  it('all fetched results have required top-level fields', () => {
    for (const result of allResults) {
      assertSchema(result, result.domain);
    }
  });

  it('saved results file has valid JSON structure', async () => {
    if (!existsSync(RESULTS_DIR)) await mkdir(RESULTS_DIR, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const outPath = join(RESULTS_DIR, `robots-txt-${ts}.json`);
    const payload = {
      run_at: new Date().toISOString(),
      domains_tested: allResults.map((r) => r.domain),
      results: allResults,
    };
    await writeFile(outPath, JSON.stringify(payload, null, 2));
    console.log(`\nResults saved to: ${outPath}`);

    // Verify it round-trips as valid JSON
    const parsed = JSON.parse(JSON.stringify(payload));
    expect(parsed.results.length).toBe(allResults.length);
    expect(parsed.results[0]).toHaveProperty('domain');
  });
});
