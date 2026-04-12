#!/usr/bin/env node
/**
 * ai-citation-monitor MCP server
 * Queries all configured LLM engines and checks if a target domain is cited.
 * Perplexity (sonar) does live web search — most accurate for current citation state.
 * Claude/GPT/Gemini reflect training data knowledge — useful for brand awareness signal.
 * Missing engine keys are skipped gracefully; at least one engine must be configured.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { config, tierStatus } from '../shared/config.js';
import { post, ok, err, tier1Manual } from '../shared/http.js';

tierStatus('ai-citation-monitor', {
  'Anthropic Claude (live web search)': config.anthropic.available && config.anthropic.webSearch,
  'Anthropic Claude (training data only)': config.anthropic.available && !config.anthropic.webSearch,
  'OpenAI GPT (web search)': config.openai.available,
  'Google Gemini (web search)': config.gemini.available,
  'Perplexity Sonar (live web)': config.perplexity.available,
});

const CITATION_PROMPT = (domain, query) =>
  `Answer this question as helpfully as possible: "${query}"\n\nAs part of your response, please mention any specific websites or domains that are authoritative sources on this topic. Include URLs or domain names where relevant.`;

const AWARENESS_PROMPT = (domain, query) =>
  `I'm researching: "${query}". What websites or domains are authoritative sources on this topic? Please list specific domain names you know about. Does ${domain} appear in your knowledge as a relevant source?`;

// ── Engine implementations ────────────────────────────────────────────────────

async function queryPerplexity(query, domain) {
  const data = await post(
    'https://api.perplexity.ai/chat/completions',
    { Authorization: `Bearer ${config.perplexity.apiKey}` },
    {
      model: config.perplexity.model,
      messages: [{ role: 'user', content: query }],
      return_citations: true,
    }
  );
  const content = data.choices?.[0]?.message?.content || '';
  const citations = data.citations || [];
  const citedInUrls = citations.some((c) => c.includes(domain));
  const citedInContent = content.toLowerCase().includes(domain.toLowerCase());
  return {
    engine: 'perplexity',
    model: config.perplexity.model,
    live_search: true,
    domain_cited: citedInUrls || citedInContent,
    cited_in_sources: citedInUrls,
    cited_in_content: citedInContent,
    citation_urls: citations,
    response_excerpt: content.slice(0, 300),
    response_full: content,
    prompt_used: query,
  };
}

async function queryAnthropic(query, domain) {
  const body = {
    model: config.anthropic.model,
    max_tokens: 1024,
    messages: [{ role: 'user', content: config.anthropic.webSearch ? query : AWARENESS_PROMPT(domain, query) }],
  };
  if (config.anthropic.webSearch) {
    body.tools = [{ type: 'web_search_20260209', name: 'web_search', max_uses: 3 }];
  }
  const data = await post(
    'https://api.anthropic.com/v1/messages',
    { 'x-api-key': config.anthropic.apiKey, 'anthropic-version': '2023-06-01' },
    body
  );
  const textBlocks = (data.content || []).filter((b) => b.type === 'text');
  const content = textBlocks.map((b) => b.text).join(' ');
  const citations = textBlocks.flatMap((b) => b.citations || []).map((c) => c.url).filter(Boolean);
  const citedInUrls = citations.some((c) => c.includes(domain));
  const citedInContent = content.toLowerCase().includes(domain.toLowerCase());
  return {
    engine: 'anthropic',
    model: config.anthropic.model,
    live_search: config.anthropic.webSearch,
    domain_cited: citedInUrls || citedInContent,
    cited_in_sources: citedInUrls,
    cited_in_content: citedInContent,
    citation_urls: citations,
    response_excerpt: content.slice(0, 300),
    response_full: content,
    prompt_used: config.anthropic.webSearch ? query : AWARENESS_PROMPT(domain, query),
  };
}

async function queryOpenAI(query, domain) {
  const data = await post(
    'https://api.openai.com/v1/chat/completions',
    { Authorization: `Bearer ${config.openai.apiKey}` },
    {
      model: config.openai.searchModel,
      messages: [{ role: 'user', content: query }],
    }
  );
  const message = data.choices?.[0]?.message || {};
  const content = typeof message.content === 'string' ? message.content : '';
  const citations = (message.annotations || [])
    .filter((a) => a.type === 'url_citation')
    .map((a) => a.url);
  const citedInUrls = citations.some((c) => c.includes(domain));
  const citedInContent = content.toLowerCase().includes(domain.toLowerCase());
  return {
    engine: 'openai',
    model: config.openai.searchModel,
    live_search: true,
    domain_cited: citedInUrls || citedInContent,
    cited_in_sources: citedInUrls,
    cited_in_content: citedInContent,
    citation_urls: citations,
    response_excerpt: content.slice(0, 300),
    response_full: content,
    prompt_used: query,
  };
}

async function queryGemini(query, domain) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`;
  const data = await post(url, {}, {
    contents: [{ parts: [{ text: query }] }],
    tools: [{ google_search: {} }],
    generationConfig: { maxOutputTokens: 512 },
  });
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const citations = (data.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .map((c) => c.web?.uri).filter(Boolean);
  const citedInUrls = citations.some((c) => c.includes(domain));
  const citedInContent = content.toLowerCase().includes(domain.toLowerCase());
  return {
    engine: 'gemini',
    model: config.gemini.model,
    live_search: true,
    domain_cited: citedInUrls || citedInContent,
    cited_in_sources: citedInUrls,
    cited_in_content: citedInContent,
    citation_urls: citations,
    response_excerpt: content.slice(0, 300),
    response_full: content,
    prompt_used: query,
  };
}

// ── Aggregate across engines ──────────────────────────────────────────────────

async function checkAllEngines(domain, query) {
  const engines = [
    config.perplexity.available && queryPerplexity(query, domain),
    config.anthropic.available && queryAnthropic(query, domain),
    config.openai.available && queryOpenAI(query, domain),
    config.gemini.available && queryGemini(query, domain),
  ].filter(Boolean);

  if (engines.length === 0) return [];

  const results = await Promise.allSettled(engines);
  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : { engine: 'unknown', error: r.reason?.message }
  );
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'ai-citation-monitor', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'check_citations',
      description: 'Check if a domain is cited by AI engines for a given query. Queries all configured LLM engines (Perplexity with live search, Claude/GPT/Gemini from training data). Maps to CITE C05 (AI Citation Frequency), C06 (Prominence), C07 (Cross-Engine).',
      inputSchema: {
        type: 'object',
        properties: {
          domain: { type: 'string', description: 'Domain to check citation for (e.g. caplinq.com)' },
          queries: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of queries to test (e.g. ["what is a gas diffusion layer", "PFAS alternatives for GDL"])',
          },
        },
        required: ['domain', 'queries'],
      },
    },
    {
      name: 'get_ai_response_format',
      description: 'Query AI engines for a topic and return how they format the response: paragraph/list/table, word count, whether it starts with a direct answer. Used by seo-content-writer and geo-content-optimizer to shape drafts to match actual AI response style.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Query to analyze AI response format for' },
        },
        required: ['query'],
      },
    },
    {
      name: 'compare_competitor_citations',
      description: 'Compare AI citation share across multiple domains for a set of topic queries. Returns per-domain citation rates and gaps (queries where a competitor is cited but the target domain is not). Used by competitor-analysis and content-gap-analysis.',
      inputSchema: {
        type: 'object',
        properties: {
          topic_queries: { type: 'array', items: { type: 'string' }, description: '5–10 queries to test across all domains' },
          domains: { type: 'array', items: { type: 'string' }, description: 'Domains to compare — include target domain + competitors (e.g. ["caplinq.com", "specialchem.com"])' },
        },
        required: ['topic_queries', 'domains'],
      },
    },
    {
      name: 'track_citation_snapshot',
      description: 'Take a compact citation state snapshot for a domain — which queries it is cited for, which engines cite it. Designed for storage and diff against prior snapshots to detect citation gains/losses. Used by rank-tracker, performance-reporter, and alert-manager.',
      inputSchema: {
        type: 'object',
        properties: {
          domain: { type: 'string', description: 'Domain to snapshot (e.g. caplinq.com)' },
          queries: { type: 'array', items: { type: 'string' }, description: 'Queries to test' },
        },
        required: ['domain', 'queries'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const anyEngine = config.anthropic.available || config.openai.available || config.gemini.available || config.perplexity.available;

  // ── check_citations ─────────────────────────────────────────────────────────
  if (name === 'check_citations') {
    try {
      if (!anyEngine) {
        return tier1Manual('check_citations',
          args.queries.flatMap((q) => [
            `Perplexity: https://www.perplexity.ai — search "${q}", check if ${args.domain} appears in citations`,
            `ChatGPT: https://chatgpt.com — ask "${q}", check if ${args.domain} is mentioned`,
            `Claude.ai: https://claude.ai — ask "${q}", check if ${args.domain} is mentioned`,
          ]),
          {
            domain: args.domain,
            queries_tested: args.queries.length,
            cite_C05_verdict: 'unknown',
            cite_C07_verdict: 'unknown',
            results: args.queries.map((q) => ({ query: q, domain_cited: 'manually_check', engines: 'no_keys_configured' })),
            source: 'manual_required',
          }
        );
      }

      const queryResults = [];
      for (const query of args.queries) {
        const engineResults = await checkAllEngines(args.domain, query);
        const citedCount = engineResults.filter((r) => r.domain_cited).length;
        const totalEngines = engineResults.filter((r) => !r.error).length;
        queryResults.push({
          query,
          cited_by_engines: citedCount,
          total_engines_checked: totalEngines,
          citation_rate: totalEngines > 0 ? `${citedCount}/${totalEngines}` : 'n/a',
          engines: engineResults,
        });
      }

      const totalCited = queryResults.filter((r) => r.cited_by_engines > 0).length;
      const enginesUsed = [...new Set(queryResults.flatMap((r) => r.engines.map((e) => e.engine).filter((e) => e !== 'unknown')))];
      const c05 = totalCited >= 10 ? 'PASS' : totalCited >= 3 ? 'PARTIAL' : 'FAIL';
      const c07 = enginesUsed.length >= 3 ? 'PASS' : enginesUsed.length === 2 ? 'PARTIAL' : 'FAIL';

      return ok({
        domain: args.domain,
        queries_tested: args.queries.length,
        queries_with_citation: totalCited,
        engines_used: enginesUsed,
        cite_C05_verdict: c05,
        cite_C05_note: 'PASS requires cited on ≥10 queries across ≥2 engines',
        cite_C07_verdict: c07,
        cite_C07_note: 'PASS requires cited by ≥3 different AI engines',
        results: queryResults,
      });
    } catch (e) {
      return err(e.message);
    }
  }

  // ── get_ai_response_format ──────────────────────────────────────────────────
  // ── get_ai_response_format ──────────────────────────────────────────────────
  if (name === 'get_ai_response_format') {
    try {
      if (!anyEngine) {
        return tier1Manual('get_ai_response_format',
          [`Search "${args.query}" in Perplexity or ChatGPT, note if the response is a paragraph, bullet list, or table; count approximate words`],
          { query: args.query, dominant_format: 'unknown', source: 'manual_required' }
        );
      }

      // Use first available engine — Perplexity preferred (live), then OpenAI, Gemini, Anthropic
      let engineResult;
      if (config.perplexity.available) engineResult = await queryPerplexity(args.query, '');
      else if (config.openai.available) engineResult = await queryOpenAI(args.query, '');
      else if (config.gemini.available) engineResult = await queryGemini(args.query, '');
      else engineResult = await queryAnthropic(args.query, '');

      const text = engineResult.response_excerpt || '';
      const hasList = /^\s*[-*•]\s/m.test(text) || /^\s*\d+\.\s/m.test(text);
      const hasTable = /\|.+\|/.test(text);
      const words = text.split(/\s+/).filter(Boolean).length;
      const startsWithDirect = text.length > 0 && !/^(I'll|Let me|To answer|Sure|Great|Of course)/i.test(text.trim());

      return ok({
        query: args.query,
        engine_used: engineResult.engine,
        live_search: engineResult.live_search,
        dominant_format: hasTable ? 'table' : hasList ? 'list' : 'paragraph',
        has_table: hasTable,
        has_list: hasList,
        word_count: words,
        starts_with_direct_answer: startsWithDirect,
        response_excerpt: text,
      });
    } catch (e) {
      return err(e.message);
    }
  }

  // ── compare_competitor_citations ────────────────────────────────────────────
  if (name === 'compare_competitor_citations') {
    try {
      if (!anyEngine) {
        return tier1Manual('compare_competitor_citations',
          args.topic_queries.map((q) => `Search "${q}" in Perplexity; note which of these domains appears in citations: ${args.domains.join(', ')}`),
          { domains: args.domains, citation_share: 'manually_check', gaps: [], source: 'manual_required' }
        );
      }

      const citationShare = Object.fromEntries(args.domains.map((d) => [d, { cited_count: 0, queries_cited: [] }]));

      for (const query of args.topic_queries) {
        const engineResults = await checkAllEngines('', query);
        const allCitedUrls = engineResults.flatMap((r) => r.citation_urls || []);
        const allText = engineResults.map((r) => r.response_excerpt || '').join(' ').toLowerCase();

        for (const domain of args.domains) {
          const cited = allCitedUrls.some((u) => u.includes(domain)) || allText.includes(domain.toLowerCase());
          if (cited) {
            citationShare[domain].cited_count++;
            citationShare[domain].queries_cited.push(query);
          }
        }
      }

      // Add citation_rate to each domain
      for (const domain of args.domains) {
        citationShare[domain].citation_rate = `${citationShare[domain].cited_count}/${args.topic_queries.length}`;
      }

      const leader = args.domains.reduce((a, b) => citationShare[a].cited_count >= citationShare[b].cited_count ? a : b);

      // Gaps: queries where any non-first domain wins but first domain doesn't
      const targetDomain = args.domains[0];
      const gaps = args.topic_queries
        .filter((q) => !citationShare[targetDomain].queries_cited.includes(q))
        .map((q) => {
          const cited = args.domains.slice(1).find((d) => citationShare[d].queries_cited.includes(q));
          return cited ? { query: q, cited_domain: cited, target_domain_cited: false } : null;
        })
        .filter(Boolean);

      return ok({
        queries_tested: args.topic_queries.length,
        domains_compared: args.domains,
        citation_share: citationShare,
        leader,
        gaps,
      });
    } catch (e) {
      return err(e.message);
    }
  }

  // ── track_citation_snapshot ─────────────────────────────────────────────────
  if (name === 'track_citation_snapshot') {
    try {
      if (!anyEngine) {
        return tier1Manual('track_citation_snapshot',
          args.queries.map((q) => `Search "${q}" manually, note if ${args.domain} is cited`),
          { domain: args.domain, queries_cited: [], queries_not_cited: args.queries, citation_rate: '0/0', source: 'manual_required' }
        );
      }

      const queriesCited = [];
      const queriesNotCited = [];
      const enginesSeenSet = new Set();

      for (const query of args.queries) {
        const engineResults = await checkAllEngines(args.domain, query);
        engineResults.forEach((r) => { if (r.engine && r.engine !== 'unknown') enginesSeenSet.add(r.engine); });
        const anyCited = engineResults.some((r) => r.domain_cited);
        if (anyCited) queriesCited.push(query);
        else queriesNotCited.push(query);
      }

      const enginesUsed = [...enginesSeenSet];

      return ok({
        domain: args.domain,
        timestamp: new Date().toISOString(),
        queries_cited: queriesCited,
        queries_not_cited: queriesNotCited,
        engines_checked: enginesUsed,
        citation_rate: `${queriesCited.length}/${args.queries.length}`,
      });
    } catch (e) {
      return err(e.message);
    }
  }

  return err(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
