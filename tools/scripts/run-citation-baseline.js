#!/usr/bin/env node
/**
 * run-citation-baseline.js
 * Prompting mini-pipeline: discover company profile → generate contextual queries
 * → run citation check across all AI engines → write lean summary.
 *
 * Usage:
 *   node tools/scripts/run-citation-baseline.js <domain> [analysisPath] [entityHandoffPath]
 *
 * If entityHandoffPath (or the default 01-domain-baseline/entity-optimizer-handoff.md)
 * exists, queries are derived from the entity-optimizer output.
 * Otherwise, the homepage is fetched and gpt-4o-mini extracts the company profile.
 *
 * Outputs:
 *   <analysisPath>/discovery.json          — homepage + LLM response (fallback only)
 *   <analysisPath>/query-generation.json   — source, extracted profile, batches used
 *   <analysisPath>/prompt-results.json     — full per-call data
 *   <analysisPath>/prompt-summary.json     — lean file: cost at top + 5 fields per call
 *   <analysisPath>/score-provenance.json   — CITE scores
 */

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../..', '.env') });

const {
  runCitationBaseline,
  generateScoreProvenance,
  saveScoreProvenance,
  updatePromptSummary,
  writeLeanSummary,
  extractHeroKeywords,
  generateQueriesFromProfile,
  savePromptResult,
} = await import('../shared/pipeline-runner.js');

import { config } from '../shared/config.js';
import { post } from '../shared/http.js';

const domain       = process.argv[2] || 'caplinq.com';
const analysisPath = process.argv[3] || path.join(__dirname, `../../analyses/caplinq/${domain}/analysis-${new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)}`);
const entityHandoffArg = process.argv[4] || null;

console.log(`\n=== Prompting Mini-Pipeline ===`);
console.log(`Domain:        ${domain}`);
console.log(`Analysis Path: ${analysisPath}`);

// ── Phase 1: Discover company profile ─────────────────────────────────────────

async function discoverViaLLM(domain, analysisPath) {
  console.log('\n[Discovery] No entity handoff found — fetching homepage via LLM...');
  const homeUrl = `https://${domain}`;
  let homepageHtml = '';

  try {
    const res = await fetch(homeUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GEOBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    homepageHtml = (await res.text()).slice(0, 16000); // limit to ~4k tokens
  } catch (e) {
    console.warn(`  [Discovery] Homepage fetch failed: ${e.message}`);
  }

  if (!config.openai.available) {
    console.warn('  [Discovery] OpenAI unavailable — using generic fallback profile');
    return { profile: defaultProfile(domain), source: 'generic_fallback', discoveryLog: null };
  }

  const prompt = `You are analyzing a company website. Extract the following from the HTML below and return ONLY valid JSON with these exact keys:
{
  "company_name": "string — the company or brand name",
  "industry": "string — one short phrase describing the industry/niche (e.g. 'thermal interface materials distribution')",
  "business_type": "one of: distributor, manufacturer, saas_software, agency_service, ecommerce_retail, media_content, generic",
  "products": ["top 3-5 products or services as short strings"],
  "hero_keywords": ["top 3-5 search phrases a buyer would type to find this company"]
}

Homepage HTML (truncated):
${homepageHtml}`;

  const t0 = Date.now();
  let llmData = {};
  let rawResponse = '';

  try {
    const data = await post(
      'https://api.openai.com/v1/chat/completions',
      { Authorization: `Bearer ${config.openai.apiKey}` },
      { model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' } }
    );
    const duration_ms = Date.now() - t0;
    rawResponse = data.choices?.[0]?.message?.content || '{}';
    llmData = JSON.parse(rawResponse);

    const discoveryLog = {
      step: 'discovery',
      skill: 'domain-discovery',
      engine: 'openai',
      model: 'gpt-4o-mini',
      timestamp_utc: new Date().toISOString(),
      live_search: false,
      query: `Extract company profile from ${domain} homepage`,
      query_type: 'discovery',
      domain,
      response_excerpt: rawResponse.slice(0, 300),
      response_full: rawResponse,
      domain_cited: false,
      duration_ms,
      cost_usd: null,
    };

    // Save discovery inputs/output
    await fs.writeFile(
      path.join(analysisPath, 'discovery.json'),
      JSON.stringify({ domain, fetched_at: new Date().toISOString(), homepage_url: homeUrl, homepage_html_length: homepageHtml.length, llm_prompt: prompt, llm_response: llmData }, null, 2)
    );

    await savePromptResult(analysisPath, discoveryLog);

    console.log(`  [Discovery] Extracted: company="${llmData.company_name}", business_type="${llmData.business_type}"`);
    return { profile: llmData, source: 'homepage_llm_extraction', discoveryLog };
  } catch (e) {
    console.warn(`  [Discovery] LLM extraction failed: ${e.message}`);
    return { profile: defaultProfile(domain), source: 'generic_fallback', discoveryLog: null };
  }
}

function defaultProfile(domain) {
  const company = domain.replace(/\.(com|io|net|org|co).*$/, '');
  return {
    company_name: company,
    industry: `${company} services`,
    business_type: 'generic',
    products: [],
    hero_keywords: [company],
  };
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(analysisPath, { recursive: true });

  // Phase 1: Discover profile
  let profile = null;
  let discoverySource = 'entity_optimizer_handoff';
  let businessType = 'generic';

  const defaultHandoffPath = entityHandoffArg
    || path.join(analysisPath, '01-domain-baseline', 'entity-optimizer-handoff.md');

  const heroResult = await extractHeroKeywords(analysisPath, defaultHandoffPath);

  if (heroResult.found) {
    profile = heroResult.extracted;
    businessType = heroResult.business_type;
    console.log(`\n[Discovery] Using entity-optimizer handoff`);
    console.log(`  Company: ${profile.company_name} | Business type: ${businessType}`);
    console.log(`  Industry: ${profile.industry}`);
    console.log(`  Hero keywords: ${profile.hero_keywords.join(', ')}`);
  } else {
    const result = await discoverViaLLM(domain, analysisPath);
    profile = result.profile;
    discoverySource = result.source;
    businessType = profile.business_type || 'generic';
  }

  // Phase 2: Generate queries from profile
  const queryBatches = generateQueriesFromProfile({
    company_name: profile.company_name,
    industry: profile.industry,
    hero_keywords: profile.hero_keywords,
    business_type: businessType,
  });

  const templates = {
    industry: Object.values(queryBatches).length ? 'see query_batches' : '(none)',
  };

  // Save query-generation.json
  await fs.writeFile(
    path.join(analysisPath, 'query-generation.json'),
    JSON.stringify({
      domain,
      generated_at: new Date().toISOString(),
      discovery_source: discoverySource,
      business_type: businessType,
      extracted: profile,
      query_batches: queryBatches,
      total_queries: queryBatches.brand.length + queryBatches.industry.length + queryBatches.hero.length,
    }, null, 2)
  );

  console.log(`\n[Queries] Generated ${queryBatches.brand.length} brand + ${queryBatches.industry.length} industry + ${queryBatches.hero.length} hero queries (business_type: ${businessType})`);

  // Phase 3: Run citation check — one call per query_type so LIMIT_ANTHROPIC applies per batch
  console.log('\n[Citation] Running citation baseline...');
  const allResults = [];

  for (const [qtype, qs] of Object.entries(queryBatches)) {
    if (qs.length === 0) continue;
    console.log(`  Running ${qs.length} ${qtype} queries...`);
    const stepTag = `1.5-${qtype}`;
    const r = await runCitationBaseline(domain, qs, analysisPath, qtype, stepTag);
    allResults.push(r);
    console.log(`    → citations: ${r.queries_with_citation}/${r.queries_tested} | engines: ${r.engines_used.join(', ')}`);
  }

  // Phase 4: Write lean summary
  const summaryPath = await writeLeanSummary(analysisPath);

  // Generate and save score provenance
  const mergedResults = {
    domain,
    queries_tested: allResults.reduce((s, r) => s + r.queries_tested, 0),
    queries_with_citation: allResults.reduce((s, r) => s + r.queries_with_citation, 0),
    engines_used: [...new Set(allResults.flatMap(r => r.engines_used))],
    by_engine: {
      openai:    allResults.reduce((s, r) => s + r.by_engine.openai, 0),
      anthropic: allResults.reduce((s, r) => s + r.by_engine.anthropic, 0),
      gemini:    allResults.reduce((s, r) => s + r.by_engine.gemini, 0),
    },
    query_results: allResults.flatMap(r => r.query_results),
  };

  const provenance = await generateScoreProvenance(mergedResults, analysisPath);
  await saveScoreProvenance(analysisPath, provenance);
  await updatePromptSummary(analysisPath);

  // Verify outputs
  console.log('\n--- Output files ---');
  for (const fname of ['discovery.json', 'query-generation.json', 'prompt-results.json', 'prompt-summary.json', 'score-provenance.json']) {
    const fp = path.join(analysisPath, fname);
    try {
      const stat = await fs.stat(fp);
      console.log(`  ✓ ${fname} (${stat.size} bytes)`);
    } catch {
      // Optional files (e.g. discovery.json only written in fallback mode)
    }
  }

  // Print lean summary totals
  try {
    const lean = JSON.parse(await fs.readFile(summaryPath, 'utf-8'));
    console.log(`\nTotal prompts: ${lean.total_prompts} | Cost: $${lean.total_cost_usd} | Duration: ${lean.total_duration_ms}ms`);
    console.log(`By engine: ${JSON.stringify(lean.by_engine)}`);
  } catch { /* skip if summary missing */ }
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
