/**
 * live-prompting.test.js
 * Integration tests that call real AI APIs (no MSW mocking).
 * Each engine block is skipped when its API key is missing.
 * Saves full raw responses, token usage, and cost to results JSON.
 *
 * Run: npx vitest run __tests__/integration/live-prompting.test.js
 * (API keys loaded from .env automatically)
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { server } from '../setup.js';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(__dirname, 'results');
const TEST_DOMAIN = 'caplinq.com';
const TEST_QUERY = 'What companies supply thermal interface materials?';

// Load .env before importing config
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../../../..', '.env') });

import { config } from '../../shared/config.js';

const hasOpenAI = !!process.env.OPENAI_API_KEY;
const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
const hasGemini = !!process.env.GEMINI_API_KEY;

// Pricing per million tokens (April 2026)
const PRICING = {
  openai:    { input: 0.15,  output: 0.60  },
  anthropic: { input: 3.00,  output: 15.00 },
  gemini:    { input: 0.30,  output: 2.50  },
};

function calcCost(engine, inputTokens, outputTokens) {
  const p = PRICING[engine] || { input: 0, output: 0 };
  return (inputTokens / 1e6) * p.input + (outputTokens / 1e6) * p.output;
}

const allResults = [];

// Bypass MSW so real API calls reach actual endpoints
beforeAll(() => server.close());
afterAll(() => server.listen());

async function saveResults() {
  if (!existsSync(RESULTS_DIR)) await mkdir(RESULTS_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = join(RESULTS_DIR, `prompting-${ts}.json`);
  const totalCost = allResults.reduce((s, r) => s + (r.cost_usd || 0), 0);
  await writeFile(outPath, JSON.stringify({
    run_at: new Date().toISOString(),
    domain: TEST_DOMAIN,
    query: TEST_QUERY,
    engines_available: { openai: hasOpenAI, anthropic: hasAnthropic, gemini: hasGemini },
    total_cost_usd: +totalCost.toFixed(6),
    results: allResults,
  }, null, 2));
  return outPath;
}

// Helper: direct HTTP post (no MSW)
async function post(url, headers, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

// ── OpenAI ────────────────────────────────────────────────────────────────────

describe.skipIf(!hasOpenAI)('OpenAI Responses API (gpt-4o-mini + web_search)', () => {
  it('returns response with citation_urls, tokens, and cost', async () => {
    const data = await post(
      'https://api.openai.com/v1/responses',
      { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      { model: config.openai.searchModel, tools: [{ type: 'web_search' }], input: TEST_QUERY }
    );

    const messageItem = (data.output || []).find((i) => i.type === 'message');
    const textBlock = (messageItem?.content || []).find((b) => b.type === 'output_text') || {};
    const content = textBlock.text || '';
    const citations = (textBlock.annotations || [])
      .filter((a) => a.type === 'url_citation').map((a) => a.url).filter(Boolean);

    const inputTokens = data.usage?.input_tokens ?? 0;
    const outputTokens = data.usage?.output_tokens ?? 0;

    const result = {
      engine: 'openai',
      model: config.openai.searchModel,
      live_search: true,
      query: TEST_QUERY,
      domain: TEST_DOMAIN,
      response_excerpt: content.slice(0, 300),
      response_full: content,
      citation_urls: citations,
      domain_cited: citations.some((c) => c.includes(TEST_DOMAIN)) || content.toLowerCase().includes(TEST_DOMAIN),
      tokens: { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens },
      cost_usd: +calcCost('openai', inputTokens, outputTokens).toFixed(6),
      raw_response: data,
    };
    allResults.push(result);

    expect(result.engine).toBe('openai');
    expect(result.response_full.length).toBeGreaterThan(0);
    expect(Array.isArray(result.citation_urls)).toBe(true);
    expect(result.tokens.total).toBeGreaterThan(0);
    expect(typeof result.cost_usd).toBe('number');
  }, 40000);
});

// ── Anthropic ────────────────────────────────────────────────────────────────

describe.skipIf(!hasAnthropic)('Anthropic (claude-sonnet — awareness prompt)', () => {
  it('returns response with domain mention check, tokens, and cost', async () => {
    const prompt = `I'm researching: "${TEST_QUERY}". What websites or domains are authoritative sources on this topic? Please list specific domain names you know about. Does ${TEST_DOMAIN} appear in your knowledge as a relevant source?`;

    const data = await post(
      'https://api.anthropic.com/v1/messages',
      { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      { model: config.anthropic.model, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }
    );

    const textBlocks = (data.content || []).filter((b) => b.type === 'text');
    const content = textBlocks.map((b) => b.text).join(' ');

    const inputTokens = data.usage?.input_tokens ?? 0;
    const outputTokens = data.usage?.output_tokens ?? 0;

    const result = {
      engine: 'anthropic',
      model: config.anthropic.model,
      live_search: false,
      query: TEST_QUERY,
      domain: TEST_DOMAIN,
      prompt_used: prompt,
      response_excerpt: content.slice(0, 300),
      response_full: content,
      citation_urls: [],
      domain_cited: content.toLowerCase().includes(TEST_DOMAIN),
      tokens: { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens },
      cost_usd: +calcCost('anthropic', inputTokens, outputTokens).toFixed(6),
      raw_response: data,
    };
    allResults.push(result);

    expect(result.engine).toBe('anthropic');
    expect(result.response_full.length).toBeGreaterThan(0);
    expect(result.tokens.total).toBeGreaterThan(0);
    expect(typeof result.cost_usd).toBe('number');
  }, 30000);
});

// ── Gemini ───────────────────────────────────────────────────────────────────

describe.skipIf(!hasGemini)('Gemini (gemini-2.5-flash + Google Search grounding)', () => {
  it('returns response with grounding citations, tokens, and cost', async () => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const data = await post(url, {}, {
      contents: [{ parts: [{ text: TEST_QUERY }] }],
      tools: [{ google_search: {} }],
      generationConfig: { maxOutputTokens: 512 },
    });

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const citations = (data.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .map((c) => c.web?.uri).filter(Boolean);

    const inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
    const outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;

    const result = {
      engine: 'gemini',
      model: config.gemini.model,
      live_search: true,
      query: TEST_QUERY,
      domain: TEST_DOMAIN,
      response_excerpt: content.slice(0, 300),
      response_full: content,
      citation_urls: citations,
      domain_cited: citations.some((c) => c.includes(TEST_DOMAIN)) || content.toLowerCase().includes(TEST_DOMAIN),
      tokens: { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens },
      cost_usd: +calcCost('gemini', inputTokens, outputTokens).toFixed(6),
      raw_response: data,
    };
    allResults.push(result);

    expect(result.engine).toBe('gemini');
    expect(result.response_full.length).toBeGreaterThan(0);
    expect(Array.isArray(result.citation_urls)).toBe(true);
    expect(result.tokens.total).toBeGreaterThan(0);
    expect(typeof result.cost_usd).toBe('number');
  }, 30000);
});

// ── Result validation + save ──────────────────────────────────────────────────

describe('Result schema validation', () => {
  it('all results have required fields including tokens and cost', () => {
    const required = ['engine', 'model', 'live_search', 'query', 'domain',
      'response_full', 'citation_urls', 'domain_cited', 'tokens', 'cost_usd', 'raw_response'];
    for (const result of allResults) {
      for (const field of required) {
        expect(result, `${result.engine} missing field: ${field}`).toHaveProperty(field);
      }
      expect(Array.isArray(result.citation_urls)).toBe(true);
      expect(typeof result.domain_cited).toBe('boolean');
      expect(result.tokens).toHaveProperty('input');
      expect(result.tokens).toHaveProperty('output');
      expect(result.tokens).toHaveProperty('total');
      expect(result.cost_usd).toBeGreaterThanOrEqual(0);
    }
  });
});

afterAll(async () => {
  if (allResults.length > 0) {
    const outPath = await saveResults();
    const totalCost = allResults.reduce((s, r) => s + (r.cost_usd || 0), 0);
    console.log(`\nResults saved to: ${outPath}`);
    console.log(`Total cost: $${totalCost.toFixed(6)}`);
    for (const r of allResults) {
      console.log(`  ${r.engine}: ${r.tokens.total} tokens — $${r.cost_usd}`);
    }
  }
});
