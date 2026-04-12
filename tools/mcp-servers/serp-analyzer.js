#!/usr/bin/env node
/**
 * serp-analyzer MCP server
 * Tier 1: Serper.dev (2,500 free queries/month)
 * Tier 2 fallback: DataForSEO SERP API
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { config, tierStatus } from '../shared/config.js';
import { post, ok, err, tier1Manual } from '../shared/http.js';

tierStatus('serp-analyzer', {
  'Serper.dev (primary)': config.serper.available,
  'DataForSEO SERP (fallback)': config.dataforseo.available,
});

// ── Serper.dev ────────────────────────────────────────────────────────────────

async function serperSearch(query, gl = 'us', hl = 'en', num = 10) {
  const data = await post(
    'https://google.serper.dev/search',
    { 'X-API-KEY': config.serper.apiKey },
    { q: query, gl, hl, num }
  );

  const organic = (data.organic || []).map((r, i) => ({
    position: r.position ?? i + 1,
    title: r.title,
    url: r.link,
    domain: new URL(r.link).hostname.replace(/^www\./, ''),
    snippet: r.snippet,
    date: r.date ?? null,
  }));

  const features = {
    answer_box: !!data.answerBox,
    knowledge_graph: !!data.knowledgeGraph,
    ai_overview: !!data.aiOverview,
    people_also_ask: (data.peopleAlsoAsk || []).map((q) => q.question),
    featured_snippet: data.organic?.[0]?.position === 1 ? data.organic[0].snippet : null,
    related_searches: (data.relatedSearches || []).map((r) => r.query),
  };

  return { query, organic, features, source: 'serper' };
}

// ── DataForSEO SERP fallback ──────────────────────────────────────────────────

async function dfsSerp(query, locationCode = 2840, languageCode = 'en') {
  const data = await post(
    'https://api.dataforseo.com/v3/serp/google/organic/live/regular',
    config.dataforseo.authHeader(),
    [{ keyword: query, location_code: locationCode, language_code: languageCode, depth: 10 }]
  );

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  const organic = items
    .filter((i) => i.type === 'organic')
    .map((i) => ({
      position: i.rank_absolute,
      title: i.title,
      url: i.url,
      domain: i.domain,
      snippet: i.description,
    }));

  return { query, organic, features: {}, source: 'dataforseo' };
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'serp-analyzer', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'analyze_serp',
      description: 'Get top 10 organic results, SERP features (Featured Snippet, PAA, AI Overview, Knowledge Graph), and target domain position for a query.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query to analyze' },
          target_domain: { type: 'string', description: 'Domain to find position for (optional, e.g. caplinq.com)' },
          country: { type: 'string', description: 'Country code for SERP (default: us)', default: 'us' },
          language: { type: 'string', description: 'Language code (default: en)', default: 'en' },
        },
        required: ['query'],
      },
    },
    {
      name: 'check_rank',
      description: 'Check the ranking position of a specific domain for a list of keywords.',
      inputSchema: {
        type: 'object',
        properties: {
          domain: { type: 'string', description: 'Domain to track (e.g. caplinq.com)' },
          keywords: { type: 'array', items: { type: 'string' }, description: 'Keywords to check position for' },
          country: { type: 'string', default: 'us' },
        },
        required: ['domain', 'keywords'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'analyze_serp') {
      let result;
      if (config.serper.available) {
        result = await serperSearch(args.query, args.country, args.language);
      } else if (config.dataforseo.available) {
        result = await dfsSerp(args.query);
      } else {
        return tier1Manual('analyze_serp',
          [
            `Search Google manually: https://www.google.com/search?q=${encodeURIComponent(args.query)}`,
            'Note top 10 URLs, any Featured Snippet, People Also Ask questions, and AI Overview presence',
            'Check if an AI Overview box appears at the top of results',
          ],
          { query: args.query, organic: 'manually_check_google', features: { answer_box: 'check_manually', ai_overview: 'check_manually', people_also_ask: [] }, source: 'manual_required' }
        );
      }

      if (args.target_domain) {
        const clean = args.target_domain.replace(/^www\./, '');
        const match = result.organic.find((r) => r.domain === clean);
        result.target = match
          ? { domain: clean, position: match.position, url: match.url }
          : { domain: clean, position: null, note: 'Not found in top 10' };
      }

      return ok(result);
    }

    if (name === 'check_rank') {
      if (!config.serper.available && !config.dataforseo.available) {
        return tier1Manual('check_rank',
          args.keywords.map((kw) => `Search "${kw}" on Google and look for ${args.domain} in the results`),
          { domain: args.domain, rankings: args.keywords.map((kw) => ({ keyword: kw, position: 'unknown', source: 'manual_required' })) }
        );
      }

      const clean = args.domain.replace(/^www\./, '');
      const results = [];

      for (const keyword of args.keywords) {
        let serp;
        if (config.serper.available) {
          serp = await serperSearch(keyword, args.country);
        } else {
          serp = await dfsSerp(keyword);
        }
        const match = serp.organic.find((r) => r.domain === clean);
        results.push({
          keyword,
          position: match?.position ?? null,
          url: match?.url ?? null,
          in_top_10: !!match,
        });
      }

      return ok({ domain: args.domain, source: config.serper.available ? 'serper' : 'dataforseo', rankings: results });
    }

    return err(`Unknown tool: ${name}`);
  } catch (e) {
    return err(e.message);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
