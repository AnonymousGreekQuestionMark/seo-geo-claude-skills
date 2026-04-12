/**
 * Pipeline Runner Utility
 * Executes the company-analysis pipeline and saves all required data files
 */

import fs from 'fs/promises';
import path from 'path';
import { config } from './config.js';
import { post } from './http.js';

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

    // Anthropic
    if (config.anthropic.available) {
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
 * @param {Object} citationResults - Results from runCitationBaseline
 * @param {Object} technicalResults - Technical SEO results (optional)
 * @returns {Object} Score provenance object
 */
export function generateScoreProvenance(citationResults, technicalResults = {}) {
  const citedQueries = citationResults.queries_with_citation;
  const totalQueries = citationResults.queries_tested;
  const enginesUsed = citationResults.engines_used.length;

  // Calculate CITE scores based on citation baseline
  const c05Score = citedQueries >= totalQueries * 0.8 ? 80 :
                   citedQueries >= totalQueries * 0.5 ? 60 :
                   citedQueries >= totalQueries * 0.25 ? 40 : 20;

  const c07Score = enginesUsed >= 3 ? 80 :
                   enginesUsed >= 2 ? 60 : 40;

  return {
    analysis_metadata: {
      domain: citationResults.domain,
      timestamp: new Date().toISOString(),
      version: '1.3.0'
    },
    cite_provenance: {
      overall: {
        score: Math.round((c05Score + c07Score) / 2),
        verdict: c05Score >= 60 && c07Score >= 60 ? 'PASS' : 'PARTIAL'
      },
      dimensions: {
        C: {
          score: c05Score,
          items: [
            {
              id: 'C05',
              name: 'AI Citation Frequency',
              score: c05Score,
              source_skill: 'citation-baseline',
              source_step: '1.5',
              raw_data: `cited on ${citedQueries}/${totalQueries} queries`,
              calculation: `${citedQueries}/${totalQueries} = ${Math.round(citedQueries/totalQueries*100)}% citation rate`
            },
            {
              id: 'C07',
              name: 'Cross-Engine Consistency',
              score: c07Score,
              source_skill: 'citation-baseline',
              source_step: '1.5',
              raw_data: `cited by ${enginesUsed} engines: ${citationResults.engines_used.join(', ')}`,
              calculation: `${enginesUsed}/3 engines = ${Math.round(enginesUsed/3*100)}% coverage`
            }
          ]
        }
      }
    },
    core_eeat_provenance: {
      geo_score: null,
      seo_score: null,
      note: 'Full CORE-EEAT scoring requires content-quality-auditor'
    },
    feeder_chain: [
      { target: 'CITE C05-C07', source: 'citation-baseline (step 1.5)' },
      { target: 'CITE C02/C04/C10/T01/T02', source: 'backlink-analyzer (step 9) - not run' },
      { target: 'CITE T07/T08/T09', source: 'technical-seo-checker (step 6) - partial' }
    ],
    technical_data: technicalResults
  };
}

export default {
  savePromptResult,
  updatePromptSummary,
  saveScoreProvenance,
  runCitationBaseline,
  generateScoreProvenance
};
