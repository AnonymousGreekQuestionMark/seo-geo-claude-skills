/**
 * Pipeline Runner Utility
 * Executes the company-analysis pipeline and saves all required data files
 */

import fs from 'fs/promises';
import path from 'path';
import { config } from './config.js';
import { post } from './http.js';
import {
  initProvenance,
  updateCiteItem,
  updateCoreEeatItem,
  addFeederChain,
  finalizeProvenance,
  saveProvenance,
  loadOrCreateProvenance
} from './provenance-builder.js';
import {
  initOperationsLog,
  logApiAvailability,
  logStepStart,
  logStepComplete,
  logToolCall,
  logFileOperation,
  logError,
  logWarning,
  logAnthropicLimited,
  finalizeOperationsLog
} from './operations-logger.js';

/**
 * Track steps where Anthropic has already run (LIMIT_ANTHROPIC support)
 * When LIMIT_ANTHROPIC=true (default), Anthropic runs once per step, not per query
 */
const anthropicRanInStep = new Set();

/**
 * Save a prompt result to prompt-results.json
 * @param {string} analysisPath - Path to analysis directory
 * @param {Object} result - Prompt result to save
 */
export async function savePromptResult(analysisPath, result) {
  const filePath = path.join(analysisPath, 'prompt-results.json');

  let data;
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    data = JSON.parse(content);
  } catch {
    data = {
      analysis_metadata: {},
      prompt_results: [],
      webfetch_calls: [],
      summary: null
    };
  }

  data.prompt_results.push(result);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

/**
 * Update summary in prompt-results.json
 * @param {string} analysisPath - Path to analysis directory
 */
export async function updatePromptSummary(analysisPath) {
  const filePath = path.join(analysisPath, 'prompt-results.json');

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Compute summary
    const byEngine = {};
    data.prompt_results.forEach(r => {
      const engine = r.engine || 'unknown';
      byEngine[engine] = (byEngine[engine] || 0) + 1;
    });

    data.summary = {
      total_llm_calls: data.prompt_results.length,
      by_engine: byEngine,
      total_webfetch_calls: data.webfetch_calls.length
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to update prompt summary:', e.message);
  }
}

/**
 * Save score provenance to score-provenance.json
 * @param {string} analysisPath - Path to analysis directory
 * @param {Object} provenance - Score provenance data
 */
export async function saveScoreProvenance(analysisPath, provenance) {
  const filePath = path.join(analysisPath, 'score-provenance.json');
  await fs.writeFile(filePath, JSON.stringify(provenance, null, 2));
}

/**
 * Run citation baseline and save results
 * @param {string} domain - Domain to check
 * @param {string[]} queries - Queries to test
 * @param {string} analysisPath - Path to save results
 * @returns {Object} Citation baseline results
 */
export async function runCitationBaseline(domain, queries, analysisPath) {
  const results = {
    domain,
    queries_tested: queries.length,
    queries_with_citation: 0,
    engines_used: [],
    by_engine: { openai: 0, anthropic: 0, gemini: 0 },
    query_results: []
  };

  for (const query of queries) {
    const queryResult = {
      query,
      engines: []
    };

    // OpenAI
    if (config.openai.available) {
      try {
        const data = await post(
          'https://api.openai.com/v1/chat/completions',
          { Authorization: `Bearer ${config.openai.apiKey}` },
          { model: config.openai.searchModel, messages: [{ role: 'user', content: query }] }
        );
        const content = data.choices?.[0]?.message?.content || '';
        const cited = content.toLowerCase().includes(domain.toLowerCase());

        const engineResult = {
          engine: 'openai',
          model: config.openai.searchModel,
          live_search: true,
          domain_cited: cited,
          response_excerpt: content.slice(0, 300),
          response_full: content
        };
        queryResult.engines.push(engineResult);

        if (cited) results.by_engine.openai++;
        if (!results.engines_used.includes('openai')) results.engines_used.push('openai');

        // Save to prompt-results.json
        await savePromptResult(analysisPath, {
          step: '1.5',
          skill: 'citation-baseline',
          engine: 'openai',
          model: config.openai.searchModel,
          timestamp_utc: new Date().toISOString(),
          live_search: true,
          query,
          domain,
          response_excerpt: content.slice(0, 300),
          response_full: content,
          domain_cited: cited
        });
      } catch (e) {
        queryResult.engines.push({ engine: 'openai', error: e.message });
      }
    }

    // Gemini
    if (config.gemini.available) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`;
        const data = await post(url, {}, {
          contents: [{ parts: [{ text: query }] }],
          tools: [{ google_search: {} }],
          generationConfig: { maxOutputTokens: 512 }
        });
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const citations = (data.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
          .map(c => c.web?.uri).filter(Boolean);
        const cited = content.toLowerCase().includes(domain.toLowerCase()) ||
                      citations.some(c => c.includes(domain));

        const engineResult = {
          engine: 'gemini',
          model: config.gemini.model,
          live_search: true,
          domain_cited: cited,
          citation_urls: citations,
          response_excerpt: content.slice(0, 300),
          response_full: content
        };
        queryResult.engines.push(engineResult);

        if (cited) results.by_engine.gemini++;
        if (!results.engines_used.includes('gemini')) results.engines_used.push('gemini');

        // Save to prompt-results.json
        await savePromptResult(analysisPath, {
          step: '1.5',
          skill: 'citation-baseline',
          engine: 'gemini',
          model: config.gemini.model,
          timestamp_utc: new Date().toISOString(),
          live_search: true,
          query,
          domain,
          response_excerpt: content.slice(0, 300),
          response_full: content,
          citation_urls: citations,
          domain_cited: cited
        });
      } catch (e) {
        queryResult.engines.push({ engine: 'gemini', error: e.message });
      }
    }

    // Anthropic — check LIMIT_ANTHROPIC before running
    const step = '1.5'; // Citation baseline step
    const shouldRunAnthropic = config.anthropic.available &&
      (!config.anthropic.limitCalls || !anthropicRanInStep.has(step));

    if (shouldRunAnthropic) {
      // Mark step as having run Anthropic (before the call, in case of error)
      if (config.anthropic.limitCalls) {
        anthropicRanInStep.add(step);
        console.log(`[LIMIT_ANTHROPIC] Running Anthropic for step ${step} (first query in step)`);
      }

      try {
        const body = {
          model: config.anthropic.model,
          max_tokens: 512,
          messages: [{ role: 'user', content: query }]
        };
        if (config.anthropic.webSearch) {
          body.tools = [{ type: 'web_search_20260209', name: 'web_search', max_uses: 2 }];
        }

        const data = await post(
          'https://api.anthropic.com/v1/messages',
          { 'x-api-key': config.anthropic.apiKey, 'anthropic-version': '2023-06-01' },
          body
        );
        const textBlocks = (data.content || []).filter(b => b.type === 'text');
        const content = textBlocks.map(b => b.text).join(' ');
        const citations = textBlocks.flatMap(b => b.citations || []).map(c => c.url).filter(Boolean);
        const cited = content.toLowerCase().includes(domain.toLowerCase()) ||
                      citations.some(c => c.includes(domain));

        const engineResult = {
          engine: 'anthropic',
          model: config.anthropic.model,
          live_search: config.anthropic.webSearch,
          domain_cited: cited,
          citation_urls: citations,
          response_excerpt: content.slice(0, 300),
          response_full: content
        };
        queryResult.engines.push(engineResult);

        if (cited) results.by_engine.anthropic++;
        if (!results.engines_used.includes('anthropic')) results.engines_used.push('anthropic');

        // Save to prompt-results.json
        await savePromptResult(analysisPath, {
          step: '1.5',
          skill: 'citation-baseline',
          engine: 'anthropic',
          model: config.anthropic.model,
          timestamp_utc: new Date().toISOString(),
          live_search: config.anthropic.webSearch,
          query,
          domain,
          response_excerpt: content.slice(0, 300),
          response_full: content,
          citation_urls: citations,
          domain_cited: cited
        });
      } catch (e) {
        queryResult.engines.push({ engine: 'anthropic', error: e.message });
      }
    } else if (config.anthropic.available && config.anthropic.limitCalls) {
      // Anthropic skipped due to LIMIT_ANTHROPIC
      console.log(`[LIMIT_ANTHROPIC] Skipping Anthropic for query "${query.slice(0, 50)}..." (already ran in step ${step})`);
      queryResult.engines.push({
        engine: 'anthropic',
        skipped: true,
        reason: 'LIMIT_ANTHROPIC=true, already ran in this step'
      });
    }

    // Check if any engine cited the domain for this query
    const anyCited = queryResult.engines.some(e => e.domain_cited);
    if (anyCited) results.queries_with_citation++;

    results.query_results.push(queryResult);
  }

  // Update summary
  await updatePromptSummary(analysisPath);

  return results;
}

/**
 * Generate score provenance from citation baseline results
 * Uses the comprehensive provenance-builder for full 120-item tracking
 * @param {Object} citationResults - Results from runCitationBaseline
 * @param {string} analysisPath - Path to analysis directory
 * @param {Object} technicalResults - Technical SEO results (optional)
 * @returns {Object} Score provenance object
 */
export async function generateScoreProvenance(citationResults, analysisPath, technicalResults = {}) {
  const domain = citationResults.domain;
  const timestamp = new Date().toISOString();

  // Load existing or create new comprehensive provenance
  const provenance = await loadOrCreateProvenance(analysisPath, domain, timestamp);

  const citedQueries = citationResults.queries_with_citation;
  const totalQueries = citationResults.queries_tested;
  const enginesUsed = citationResults.engines_used.length;

  // Calculate CITE scores based on citation baseline
  const c05Score = citedQueries >= totalQueries * 0.8 ? 80 :
                   citedQueries >= totalQueries * 0.5 ? 60 :
                   citedQueries >= totalQueries * 0.25 ? 40 : 20;

  const c07Score = enginesUsed >= 3 ? 80 :
                   enginesUsed >= 2 ? 60 : 40;

  // Calculate C06 (Citation Prominence) - primary/sole source rate
  let primaryCount = 0;
  let totalCitations = 0;
  for (const qr of citationResults.query_results || []) {
    for (const eng of qr.engines || []) {
      if (eng.domain_cited && !eng.skipped) {
        totalCitations++;
        // Check if primary (mentioned first or high prominence)
        const excerpt = (eng.response_excerpt || '').toLowerCase();
        const domainLower = domain.toLowerCase();
        const domainIndex = excerpt.indexOf(domainLower);
        // Primary if mentioned in first 150 chars or before other domains
        if (domainIndex >= 0 && domainIndex < 150) {
          primaryCount++;
        }
      }
    }
  }
  const c06Score = totalCitations > 0
    ? (primaryCount / totalCitations >= 0.5 ? 80 : primaryCount / totalCitations >= 0.25 ? 60 : 40)
    : 0;

  // Calculate C08 (Citation Sentiment) - check for positive/neutral context
  let positiveNeutralCount = 0;
  let sentimentTotal = 0;
  const negativeTerms = ['avoid', 'poor', 'bad', 'worst', 'scam', 'fraud', 'warning', 'don\'t', 'never'];
  for (const qr of citationResults.query_results || []) {
    for (const eng of qr.engines || []) {
      if (eng.domain_cited && !eng.skipped) {
        sentimentTotal++;
        const content = (eng.response_full || eng.response_excerpt || '').toLowerCase();
        const hasNegative = negativeTerms.some(term => content.includes(term));
        if (!hasNegative) {
          positiveNeutralCount++;
        }
      }
    }
  }
  const c08Score = sentimentTotal > 0
    ? (positiveNeutralCount / sentimentTotal >= 0.8 ? 80 : positiveNeutralCount / sentimentTotal >= 0.5 ? 60 : 40)
    : 0;

  // Update CITE items with comprehensive data
  updateCiteItem(provenance, 'C05', {
    score: c05Score,
    confidence: 'HIGH',
    data_source: 'citation-baseline',
    raw_data: `cited on ${citedQueries}/${totalQueries} queries`,
    calculation: `${citedQueries}/${totalQueries} = ${Math.round(citedQueries/totalQueries*100)}% citation rate`
  });

  updateCiteItem(provenance, 'C06', {
    score: c06Score,
    confidence: totalCitations >= 3 ? 'HIGH' : 'MEDIUM',
    data_source: 'citation-baseline',
    raw_data: `primary source in ${primaryCount}/${totalCitations} citations`,
    calculation: `${primaryCount}/${totalCitations} = ${totalCitations > 0 ? Math.round(primaryCount/totalCitations*100) : 0}% prominence rate`
  });

  updateCiteItem(provenance, 'C07', {
    score: c07Score,
    confidence: 'HIGH',
    data_source: 'citation-baseline',
    raw_data: `cited by ${enginesUsed} engines: ${citationResults.engines_used.join(', ')}`,
    calculation: `${enginesUsed}/3 engines = ${Math.round(enginesUsed/3*100)}% coverage`
  });

  updateCiteItem(provenance, 'C08', {
    score: c08Score,
    confidence: sentimentTotal >= 3 ? 'HIGH' : 'MEDIUM',
    data_source: 'citation-baseline',
    raw_data: `${positiveNeutralCount}/${sentimentTotal} positive/neutral citations`,
    calculation: `${sentimentTotal > 0 ? Math.round(positiveNeutralCount/sentimentTotal*100) : 0}% positive/neutral`
  });

  // Add feeder chain entries
  addFeederChain(provenance, 'CITE C05-C08', 'citation-baseline', '1.5', 'DONE');

  // Save provenance
  await saveProvenance(analysisPath, provenance);

  return provenance;
}

/**
 * Update CORE-EEAT provenance from content-quality-auditor results
 * @param {string} analysisPath - Path to analysis directory
 * @param {Object} coreEeatResults - Results from content-quality-auditor
 */
export async function updateCoreEeatProvenance(analysisPath, coreEeatResults) {
  const provenance = await loadOrCreateProvenance(analysisPath, coreEeatResults.domain || 'unknown', new Date().toISOString());

  // Update all CORE-EEAT dimension items
  if (coreEeatResults.dimensions) {
    for (const [dim, dimData] of Object.entries(coreEeatResults.dimensions)) {
      if (dimData.items) {
        for (const item of dimData.items) {
          updateCoreEeatItem(provenance, item.id, {
            score: item.score,
            status: item.status,
            confidence: item.confidence || 'MEDIUM',
            data_source: 'content-quality-auditor',
            raw_data: item.raw_data || item.evidence,
            calculation: item.calculation || item.reasoning
          });
        }
      }
    }
  }

  // Set GEO and SEO scores if provided directly
  if (coreEeatResults.geo_score !== undefined) {
    provenance.core_eeat_provenance.geo_score = coreEeatResults.geo_score;
  }
  if (coreEeatResults.seo_score !== undefined) {
    provenance.core_eeat_provenance.seo_score = coreEeatResults.seo_score;
  }

  // Finalize and recalculate scores
  finalizeProvenance(provenance);

  // Add feeder chain
  addFeederChain(provenance, 'CORE-EEAT all', 'content-quality-auditor', 11, 'DONE');

  // Save
  await saveProvenance(analysisPath, provenance);

  return provenance;
}

/**
 * Update CITE provenance from backlink-analyzer results
 * @param {string} analysisPath - Path to analysis directory
 * @param {Object} backlinkResults - Results from backlink-analyzer
 */
export async function updateBacklinkProvenance(analysisPath, backlinkResults) {
  const provenance = await loadOrCreateProvenance(analysisPath, backlinkResults.domain || 'unknown', new Date().toISOString());

  const rd = backlinkResults.referring_domains || 0;
  const rdQuality = backlinkResults.quality_domains_pct || 0;
  const dofollowRatio = backlinkResults.dofollow_ratio || 0;

  // C01: Referring Domains Volume
  updateCiteItem(provenance, 'C01', {
    score: rd >= 500 ? 80 : rd >= 200 ? 60 : rd >= 50 ? 40 : 20,
    confidence: 'HIGH',
    data_source: 'backlink-analyzer',
    raw_data: `${rd} referring domains`,
    calculation: `${rd} ${rd >= 500 ? '>=' : '<'} 500 threshold`
  });

  // C02: Referring Domains Quality
  updateCiteItem(provenance, 'C02', {
    score: rdQuality >= 20 ? 80 : rdQuality >= 10 ? 60 : rdQuality >= 5 ? 40 : 20,
    confidence: 'HIGH',
    data_source: 'backlink-analyzer',
    raw_data: `${rdQuality}% quality domains (DA/DR 50+)`,
    calculation: `${rdQuality}% ${rdQuality >= 20 ? '>=' : '<'} 20% threshold`
  });

  // T02: Dofollow Ratio Normality
  const t02Score = (dofollowRatio >= 40 && dofollowRatio <= 85) ? 80 :
                   (dofollowRatio >= 30 && dofollowRatio <= 90) ? 60 : 40;
  updateCiteItem(provenance, 'T02', {
    score: t02Score,
    confidence: 'HIGH',
    data_source: 'backlink-analyzer',
    raw_data: `${dofollowRatio}% dofollow ratio`,
    calculation: `${dofollowRatio}% ${t02Score >= 80 ? 'within' : 'outside'} 40-85% normal range`
  });

  // Add feeder chain
  addFeederChain(provenance, 'CITE C01-C02, T02', 'backlink-analyzer', 9, 'DONE');

  await saveProvenance(analysisPath, provenance);
  return provenance;
}

/**
 * Update CITE provenance from technical-seo-checker results
 * @param {string} analysisPath - Path to analysis directory
 * @param {Object} technicalResults - Results from technical-seo-checker
 */
export async function updateTechnicalProvenance(analysisPath, technicalResults) {
  const provenance = await loadOrCreateProvenance(analysisPath, technicalResults.domain || 'unknown', new Date().toISOString());

  // T07: Technical Security
  const hasHttps = technicalResults.https === true;
  const hasHsts = technicalResults.hsts === true;
  const noMalware = technicalResults.malware !== true;
  const t07Score = (hasHttps && hasHsts && noMalware) ? 80 :
                   (hasHttps && noMalware) ? 60 : 40;
  updateCiteItem(provenance, 'T07', {
    score: t07Score,
    confidence: 'HIGH',
    data_source: 'technical-seo-checker',
    raw_data: `HTTPS: ${hasHttps}, HSTS: ${hasHsts}, No malware: ${noMalware}`,
    calculation: `Security checks: ${[hasHttps && 'HTTPS', hasHsts && 'HSTS', noMalware && 'clean'].filter(Boolean).join(', ')}`
  });

  // T08: Content Freshness Signal
  const lastModDays = technicalResults.last_modified_days || 999;
  const t08Score = lastModDays <= 90 ? 80 : lastModDays <= 180 ? 60 : 40;
  updateCiteItem(provenance, 'T08', {
    score: t08Score,
    confidence: 'MEDIUM',
    data_source: 'technical-seo-checker',
    raw_data: `Last modified ${lastModDays} days ago`,
    calculation: `${lastModDays} days ${lastModDays <= 90 ? '<=' : '>'} 90 day threshold`
  });

  // E04: Technical Crawlability
  const loadTime = technicalResults.load_time_ms || 5000;
  const robotsOk = technicalResults.robots_allows_ai !== false;
  const e04Score = (robotsOk && loadTime < 3000) ? 80 :
                   (robotsOk && loadTime < 5000) ? 60 : 40;
  updateCiteItem(provenance, 'E04', {
    score: e04Score,
    confidence: 'HIGH',
    data_source: 'technical-seo-checker',
    raw_data: `Load time: ${loadTime}ms, AI crawlers allowed: ${robotsOk}`,
    calculation: `${loadTime}ms ${loadTime < 3000 ? '<' : '>='} 3s, robots.txt ${robotsOk ? 'allows' : 'blocks'} AI`
  });

  // I04: Schema.org Coverage (from technical-seo-checker schema analysis)
  const schemaTypes = technicalResults.schema_types || [];
  const schemaCoverage = technicalResults.pages_with_schema_pct || 0;
  const i04Score = schemaCoverage >= 50 ? 80 : schemaCoverage >= 25 ? 60 : schemaCoverage >= 10 ? 40 : 20;
  updateCiteItem(provenance, 'I04', {
    score: i04Score,
    confidence: 'MEDIUM',
    data_source: 'technical-seo-checker',
    raw_data: `${schemaCoverage}% pages with schema, types: ${schemaTypes.join(', ') || 'none'}`,
    calculation: `${schemaCoverage}% ${schemaCoverage >= 50 ? '>=' : '<'} 50% threshold`
  });

  // Add llms.txt data if present
  if (technicalResults.llms_txt) {
    const lt = technicalResults.llms_txt;

    // I03: Brand SERP Ownership (llms.txt adds to brand presence)
    if (lt.exists) {
      updateCiteItem(provenance, 'I03', {
        score: lt.h1_present && lt.valid_markdown ? 80 : 60,
        confidence: 'MEDIUM',
        data_source: 'technical-seo-checker (llms.txt)',
        raw_data: `llms.txt exists, H1: ${lt.h1_present}, valid MD: ${lt.valid_markdown}`,
        calculation: `AI self-declaration file ${lt.exists ? 'present' : 'missing'}`
      });
    }
  }

  // Add feeder chain
  addFeederChain(provenance, 'CITE T07-T08, E04, I04', 'technical-seo-checker', 6, 'DONE');

  await saveProvenance(analysisPath, provenance);
  return provenance;
}

/**
 * Update CITE provenance from entity-optimizer results
 * @param {string} analysisPath - Path to analysis directory
 * @param {Object} entityResults - Results from entity-optimizer
 */
export async function updateEntityProvenance(analysisPath, entityResults) {
  const provenance = await loadOrCreateProvenance(analysisPath, entityResults.domain || 'unknown', new Date().toISOString());

  // I01: Knowledge Graph Presence
  const kgPresence = entityResults.wikidata_id || entityResults.knowledge_panels || 0;
  updateCiteItem(provenance, 'I01', {
    score: kgPresence >= 2 ? 80 : kgPresence >= 1 ? 60 : 20,
    confidence: 'HIGH',
    data_source: 'entity-optimizer',
    raw_data: `Wikidata: ${entityResults.wikidata_id || 'none'}, KG panels: ${entityResults.knowledge_panels || 0}`,
    calculation: `Present in ${kgPresence} knowledge graphs ${kgPresence >= 2 ? '>=' : '<'} 2 threshold`
  });

  // I06: Domain Tenure
  const domainAge = entityResults.domain_age_years || 0;
  updateCiteItem(provenance, 'I06', {
    score: domainAge >= 5 ? 80 : domainAge >= 3 ? 60 : domainAge >= 1 ? 40 : 20,
    confidence: 'HIGH',
    data_source: 'entity-optimizer',
    raw_data: `Domain registered ${domainAge} years ago`,
    calculation: `${domainAge} years ${domainAge >= 5 ? '>=' : '<'} 5 year threshold`
  });

  // I07: Cross-Platform Consistency
  const platformConsistency = entityResults.brand_consistency_score || 0;
  updateCiteItem(provenance, 'I07', {
    score: platformConsistency >= 90 ? 80 : platformConsistency >= 70 ? 60 : 40,
    confidence: 'MEDIUM',
    data_source: 'entity-optimizer',
    raw_data: `Brand consistency: ${platformConsistency}%`,
    calculation: `${platformConsistency}% consistency across platforms`
  });

  // Add feeder chain
  addFeederChain(provenance, 'CITE I01, I06-I07', 'entity-optimizer', 1, 'DONE');

  await saveProvenance(analysisPath, provenance);
  return provenance;
}

/**
 * Reset Anthropic step tracking (call at start of new analysis)
 */
export function resetAnthropicTracking() {
  anthropicRanInStep.clear();
}

/**
 * Extract hero keywords from entity-optimizer handoff for citation prominence testing (Phase 1)
 * Auto-generates industry and hero queries from entity data
 * @param {string} analysisPath - Path to analysis directory
 * @returns {Object} Extracted keywords and generated queries
 */
export async function extractHeroKeywords(analysisPath) {
  const handoffPath = path.join(analysisPath, '01-domain-baseline', 'entity-optimizer-handoff.md');

  let handoffContent = '';
  try {
    handoffContent = await fs.readFile(handoffPath, 'utf-8');
  } catch {
    return { found: false, queries: { brand: [], industry: [], hero: [] } };
  }

  // Extract entity data from handoff markdown
  const extracted = {
    company_name: '',
    industry: '',
    products: [],
    services: [],
    hero_keywords: []
  };

  // Parse company name (from H1 or entity line)
  const companyMatch = handoffContent.match(/^#\s+(.+?)(?:\s+Entity|\s+Analysis)/m) ||
                       handoffContent.match(/Company:\s*(.+)/i) ||
                       handoffContent.match(/Entity:\s*(.+)/i);
  if (companyMatch) extracted.company_name = companyMatch[1].trim();

  // Parse industry
  const industryMatch = handoffContent.match(/Industry:\s*(.+)/i) ||
                       handoffContent.match(/Sector:\s*(.+)/i) ||
                       handoffContent.match(/vertical:\s*(.+)/i);
  if (industryMatch) extracted.industry = industryMatch[1].trim();

  // Parse products (look for product lists)
  const productsSection = handoffContent.match(/Products?:?\s*([\s\S]*?)(?=\n##|\n\*\*|Services?:|$)/i);
  if (productsSection) {
    const productLines = productsSection[1].match(/[-*]\s+(.+)/g) || [];
    extracted.products = productLines.map(p => p.replace(/^[-*]\s+/, '').trim()).slice(0, 5);
  }

  // Parse services
  const servicesSection = handoffContent.match(/Services?:?\s*([\s\S]*?)(?=\n##|\n\*\*|Products?:|$)/i);
  if (servicesSection) {
    const serviceLines = servicesSection[1].match(/[-*]\s+(.+)/g) || [];
    extracted.services = serviceLines.map(s => s.replace(/^[-*]\s+/, '').trim()).slice(0, 5);
  }

  // Parse hero keywords (explicit or from products/services)
  const heroSection = handoffContent.match(/Hero Keywords?:?\s*([\s\S]*?)(?=\n##|\n\*\*|$)/i);
  if (heroSection) {
    const heroLines = heroSection[1].match(/[-*]\s+(.+)/g) || [];
    extracted.hero_keywords = heroLines.map(h => h.replace(/^[-*]\s+/, '').trim()).slice(0, 5);
  }

  // If no explicit hero keywords, derive from products/services
  if (extracted.hero_keywords.length === 0) {
    extracted.hero_keywords = [...extracted.products.slice(0, 3), ...extracted.services.slice(0, 2)];
  }

  // Generate queries for citation prominence testing
  const queries = {
    brand: [],
    industry: [],
    hero: []
  };

  // Brand queries (existing)
  if (extracted.company_name) {
    queries.brand = [
      `What is ${extracted.company_name}?`,
      `${extracted.company_name} company overview`,
      `${extracted.company_name} reviews`
    ];
  }

  // Industry queries (new)
  if (extracted.industry) {
    queries.industry = [
      `Best ${extracted.industry} suppliers`,
      `Top ${extracted.industry} companies`,
      `${extracted.industry} manufacturers comparison`,
      `Leading ${extracted.industry} providers`
    ];
  }

  // Hero keyword queries (new)
  extracted.hero_keywords.forEach(keyword => {
    queries.hero.push(`Best ${keyword} suppliers`);
    queries.hero.push(`${keyword} comparison`);
  });

  // Limit to reasonable counts
  queries.industry = queries.industry.slice(0, 4);
  queries.hero = queries.hero.slice(0, 6);

  return {
    found: true,
    extracted,
    queries
  };
}

/**
 * Run citation prominence test with brand, industry, and hero queries (Phase 1)
 * Tests C06 (Citation Prominence) more thoroughly
 * @param {string} domain - Domain to check
 * @param {Object} queries - Queries object from extractHeroKeywords
 * @param {string} analysisPath - Path to save results
 * @returns {Object} Citation prominence results
 */
export async function runCitationProminenceTest(domain, queries, analysisPath) {
  const allQueries = [
    ...queries.brand.map(q => ({ query: q, type: 'brand' })),
    ...queries.industry.map(q => ({ query: q, type: 'industry' })),
    ...queries.hero.map(q => ({ query: q, type: 'hero' }))
  ];

  const results = {
    domain,
    total_queries: allQueries.length,
    by_type: {
      brand: { queries: queries.brand.length, cited: 0, primary: 0 },
      industry: { queries: queries.industry.length, cited: 0, primary: 0 },
      hero: { queries: queries.hero.length, cited: 0, primary: 0 }
    },
    query_results: [],
    engines_used: []
  };

  // Run citation baseline for all queries (reuse existing function logic)
  for (const { query, type } of allQueries) {
    const queryResult = {
      query,
      query_type: type,
      engines: []
    };

    // OpenAI
    if (config.openai.available) {
      try {
        const data = await post(
          'https://api.openai.com/v1/chat/completions',
          { Authorization: `Bearer ${config.openai.apiKey}` },
          { model: config.openai.searchModel, messages: [{ role: 'user', content: query }] }
        );
        const content = data.choices?.[0]?.message?.content || '';
        const cited = content.toLowerCase().includes(domain.toLowerCase());
        const domainIndex = content.toLowerCase().indexOf(domain.toLowerCase());
        const isPrimary = domainIndex >= 0 && domainIndex < 200;

        queryResult.engines.push({
          engine: 'openai',
          domain_cited: cited,
          is_primary: isPrimary,
          response_excerpt: content.slice(0, 300)
        });

        if (cited) results.by_type[type].cited++;
        if (isPrimary) results.by_type[type].primary++;
        if (!results.engines_used.includes('openai')) results.engines_used.push('openai');

        // Save prompt
        await savePromptResult(analysisPath, {
          step: '1.5',
          skill: 'citation-prominence',
          engine: 'openai',
          model: config.openai.searchModel,
          timestamp_utc: new Date().toISOString(),
          live_search: true,
          query,
          query_type: type,
          domain,
          response_excerpt: content.slice(0, 300),
          response_full: content,
          domain_cited: cited,
          is_primary: isPrimary
        });
      } catch (e) {
        queryResult.engines.push({ engine: 'openai', error: e.message });
      }
    }

    // Gemini
    if (config.gemini.available) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`;
        const data = await post(url, {}, {
          contents: [{ parts: [{ text: query }] }],
          tools: [{ google_search: {} }],
          generationConfig: { maxOutputTokens: 512 }
        });
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const citations = (data.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
          .map(c => c.web?.uri).filter(Boolean);
        const cited = content.toLowerCase().includes(domain.toLowerCase()) ||
                      citations.some(c => c.includes(domain));
        const domainIndex = content.toLowerCase().indexOf(domain.toLowerCase());
        const isPrimary = (domainIndex >= 0 && domainIndex < 200) ||
                          (citations.length > 0 && citations[0].includes(domain));

        queryResult.engines.push({
          engine: 'gemini',
          domain_cited: cited,
          is_primary: isPrimary,
          citation_urls: citations,
          response_excerpt: content.slice(0, 300)
        });

        if (cited) results.by_type[type].cited++;
        if (isPrimary) results.by_type[type].primary++;
        if (!results.engines_used.includes('gemini')) results.engines_used.push('gemini');

        await savePromptResult(analysisPath, {
          step: '1.5',
          skill: 'citation-prominence',
          engine: 'gemini',
          model: config.gemini.model,
          timestamp_utc: new Date().toISOString(),
          live_search: true,
          query,
          query_type: type,
          domain,
          response_excerpt: content.slice(0, 300),
          response_full: content,
          citation_urls: citations,
          domain_cited: cited,
          is_primary: isPrimary
        });
      } catch (e) {
        queryResult.engines.push({ engine: 'gemini', error: e.message });
      }
    }

    // Anthropic (only once per step due to LIMIT_ANTHROPIC)
    const step = '1.5';
    const shouldRunAnthropic = config.anthropic.available &&
      (!config.anthropic.limitCalls || !anthropicRanInStep.has(step));

    if (shouldRunAnthropic) {
      if (config.anthropic.limitCalls) {
        anthropicRanInStep.add(step);
      }

      try {
        const body = {
          model: config.anthropic.model,
          max_tokens: 512,
          messages: [{ role: 'user', content: query }]
        };
        if (config.anthropic.webSearch) {
          body.tools = [{ type: 'web_search_20260209', name: 'web_search', max_uses: 2 }];
        }

        const data = await post(
          'https://api.anthropic.com/v1/messages',
          { 'x-api-key': config.anthropic.apiKey, 'anthropic-version': '2023-06-01' },
          body
        );
        const textBlocks = (data.content || []).filter(b => b.type === 'text');
        const content = textBlocks.map(b => b.text).join(' ');
        const citations = textBlocks.flatMap(b => b.citations || []).map(c => c.url).filter(Boolean);
        const cited = content.toLowerCase().includes(domain.toLowerCase()) ||
                      citations.some(c => c.includes(domain));
        const domainIndex = content.toLowerCase().indexOf(domain.toLowerCase());
        const isPrimary = (domainIndex >= 0 && domainIndex < 200) ||
                          (citations.length > 0 && citations[0].includes(domain));

        queryResult.engines.push({
          engine: 'anthropic',
          domain_cited: cited,
          is_primary: isPrimary,
          citation_urls: citations,
          response_excerpt: content.slice(0, 300)
        });

        if (cited) results.by_type[type].cited++;
        if (isPrimary) results.by_type[type].primary++;
        if (!results.engines_used.includes('anthropic')) results.engines_used.push('anthropic');

        await savePromptResult(analysisPath, {
          step: '1.5',
          skill: 'citation-prominence',
          engine: 'anthropic',
          model: config.anthropic.model,
          timestamp_utc: new Date().toISOString(),
          live_search: config.anthropic.webSearch,
          query,
          query_type: type,
          domain,
          response_excerpt: content.slice(0, 300),
          response_full: content,
          citation_urls: citations,
          domain_cited: cited,
          is_primary: isPrimary
        });
      } catch (e) {
        queryResult.engines.push({ engine: 'anthropic', error: e.message });
      }
    }

    results.query_results.push(queryResult);
  }

  // Calculate C06 prominence score
  let totalCitations = 0;
  let primaryCitations = 0;
  for (const type of ['brand', 'industry', 'hero']) {
    totalCitations += results.by_type[type].cited;
    primaryCitations += results.by_type[type].primary;
  }

  results.c06_prominence_rate = totalCitations > 0 ? Math.round(primaryCitations / totalCitations * 100) : 0;
  results.c06_verdict = results.c06_prominence_rate >= 50 ? 'PASS' :
                        results.c06_prominence_rate >= 25 ? 'PARTIAL' : 'FAIL';

  // Update summary
  await updatePromptSummary(analysisPath);

  return results;
}

/**
 * Initialize analysis with fresh provenance and operations log
 * Call at start of company-analysis pipeline
 * @param {string} analysisPath - Path to analysis directory
 * @param {string} domain - Domain being analyzed
 * @param {string} timestamp - Analysis timestamp
 */
export async function initializeAnalysis(analysisPath, domain, timestamp) {
  // Reset Anthropic tracking for new analysis
  resetAnthropicTracking();

  // Initialize operations log
  await initOperationsLog(analysisPath, domain, timestamp);

  // Log API availability
  await logApiAvailability({
    anthropic: config.anthropic.available,
    anthropic_web_search: config.anthropic.webSearch,
    openai: config.openai.available,
    gemini: config.gemini.available,
    perplexity: config.perplexity.available,
    dataforseo: config.dataforseo.available,
    serper: config.serper.available,
    google: config.google.available,
    opr: config.opr.available
  });

  // Initialize comprehensive provenance
  const provenance = initProvenance(domain, timestamp);
  await saveProvenance(analysisPath, provenance);

  // Log file operation
  await logFileOperation({
    step: 0,
    operation: 'write',
    path: 'score-provenance.json',
    success: true
  });

  // Initialize prompt-results.json
  const promptResultsPath = path.join(analysisPath, 'prompt-results.json');
  const initialPromptResults = {
    analysis_metadata: {
      domain,
      timestamp,
      version: '2.0.0'
    },
    prompt_results: [],
    webfetch_calls: [],
    summary: null
  };
  await fs.writeFile(promptResultsPath, JSON.stringify(initialPromptResults, null, 2));

  await logFileOperation({
    step: 0,
    operation: 'write',
    path: 'prompt-results.json',
    success: true
  });

  return provenance;
}

/**
 * Finalize analysis - calculate all scores, verdicts, and close logs
 * Call at end of company-analysis pipeline (before report generation)
 * @param {string} analysisPath - Path to analysis directory
 * @param {string} overallStatus - Overall analysis status (DONE, DONE_WITH_CONCERNS, BLOCKED)
 */
export async function finalizeAnalysis(analysisPath, overallStatus = 'DONE') {
  const provenance = await loadOrCreateProvenance(analysisPath, 'unknown', new Date().toISOString());

  // Finalize provenance (calculate dimension scores, GEO/SEO, check vetoes)
  finalizeProvenance(provenance);

  // Save finalized provenance
  await saveProvenance(analysisPath, provenance);

  // Update prompt summary
  await updatePromptSummary(analysisPath);

  // Finalize operations log
  await finalizeOperationsLog(overallStatus);

  return provenance;
}

// Re-export provenance-builder functions for direct access
export {
  initProvenance,
  updateCiteItem,
  updateCoreEeatItem,
  addFeederChain,
  finalizeProvenance,
  saveProvenance,
  loadOrCreateProvenance
} from './provenance-builder.js';

// Re-export operations-logger functions for direct access
export {
  initOperationsLog,
  logApiAvailability,
  logStepStart,
  logStepComplete,
  logToolCall,
  logFileOperation,
  logError,
  logWarning,
  logAnthropicLimited,
  finalizeOperationsLog,
  getCurrentLog
} from './operations-logger.js';

export default {
  // Core pipeline functions
  savePromptResult,
  updatePromptSummary,
  saveScoreProvenance,
  runCitationBaseline,
  generateScoreProvenance,
  resetAnthropicTracking,
  // Lifecycle functions
  initializeAnalysis,
  finalizeAnalysis,
  // Citation prominence (Phase 1)
  extractHeroKeywords,
  runCitationProminenceTest,
  // Provenance update functions (per skill)
  updateCoreEeatProvenance,
  updateBacklinkProvenance,
  updateTechnicalProvenance,
  updateEntityProvenance,
  // Re-exported from provenance-builder
  initProvenance,
  updateCiteItem,
  updateCoreEeatItem,
  addFeederChain,
  finalizeProvenance,
  saveProvenance,
  loadOrCreateProvenance,
  // Re-exported from operations-logger
  initOperationsLog,
  logApiAvailability,
  logStepStart,
  logStepComplete,
  logToolCall,
  logFileOperation,
  logError,
  logWarning,
  logAnthropicLimited,
  finalizeOperationsLog
};
