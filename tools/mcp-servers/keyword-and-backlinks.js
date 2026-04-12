#!/usr/bin/env node
/**
 * keyword-and-backlinks MCP server
 * Tier 2: DataForSEO (keyword volume, KD, backlinks, domain metrics)
 * Tier 1 fallback: Open PageRank (basic DR only) + manual note for keywords
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { config, tierStatus } from '../shared/config.js';
import { post, get, ok, err, tier1Manual } from '../shared/http.js';

const DFS = 'https://api.dataforseo.com/v3';

tierStatus('keyword-and-backlinks', {
  'DataForSEO (keywords + backlinks)': config.dataforseo.available,
  'Open PageRank (basic DR fallback)': config.opr.available,
});

// ── DataForSEO helpers ────────────────────────────────────────────────────────

async function dfsPost(path, body) {
  return post(`${DFS}${path}`, config.dataforseo.authHeader(), body);
}

async function getKeywordsDFS(keywords, locationCode = 2840, languageCode = 'en') {
  const data = await dfsPost('/keywords_data/google_ads/search_volume/live', [
    { keywords, location_code: locationCode, language_code: languageCode },
  ]);
  const items = data.tasks?.[0]?.result || [];
  return items.map((item) => ({
    keyword: item.keyword,
    search_volume: item.search_volume,
    competition: item.competition,
    competition_index: item.competition_index,
    cpc: item.cpc,
    keyword_difficulty: item.keyword_difficulty ?? null,
  }));
}

async function getBacklinksDFS(domain) {
  const data = await dfsPost('/backlinks/summary/live', [
    { target: domain, include_subdomains: false },
  ]);
  const r = data.tasks?.[0]?.result?.[0];
  if (!r) throw new Error('No backlink result returned');
  return {
    domain,
    rank: r.rank,
    referring_domains: r.referring_domains,
    referring_pages: r.referring_links,
    dofollow_ratio: r.referring_links
      ? Math.round((r.referring_links_dofollow / r.referring_links) * 100)
      : null,
    backlinks_new_30d: r.new_referring_links,
    backlinks_lost_30d: r.lost_referring_links,
    source: 'dataforseo',
  };
}

async function getDomainMetricsDFS(domain) {
  const data = await dfsPost('/dataforseo_labs/google/domain_rank_overview/live', [
    { target: domain },
  ]);
  const r = data.tasks?.[0]?.result?.[0]?.metrics?.organic;
  if (!r) throw new Error('No domain rank result returned');
  return {
    domain,
    keywords_in_top10: r.count,
    estimated_traffic: r.etv,
    source: 'dataforseo',
  };
}

// ── Open PageRank fallback ────────────────────────────────────────────────────

async function getDomainOPR(domain) {
  if (!config.opr.available) return null;
  const data = await get(
    `https://openpagerank.com/api/v1.0/getPageRank?domains[]=${domain}`,
    { 'API-OPR': config.opr.apiKey }
  );
  const r = data.response?.[0];
  if (!r) return null;
  return {
    domain,
    page_rank_integer: r.page_rank_integer,
    page_rank_decimal: r.page_rank_decimal,
    rank: r.rank,
    source: 'open_pagerank',
    note: 'Basic DR equivalent only. Backlink profile detail requires DataForSEO.',
  };
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'keyword-and-backlinks', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_keyword_metrics',
      description: 'Get search volume, keyword difficulty, and CPC for a list of keywords. Uses DataForSEO (Tier 2) if configured, otherwise returns a note to enter data manually.',
      inputSchema: {
        type: 'object',
        properties: {
          keywords: { type: 'array', items: { type: 'string' }, description: 'Keywords to look up (max 100)' },
          location_code: { type: 'number', description: 'DataForSEO location code (default: 2840 = US)', default: 2840 },
          language_code: { type: 'string', description: 'Language code (default: en)', default: 'en' },
        },
        required: ['keywords'],
      },
    },
    {
      name: 'get_backlink_profile',
      description: 'Get backlink profile for a domain: referring domains, DR, dofollow ratio, velocity. Uses DataForSEO (Tier 2) if configured, falls back to Open PageRank (basic DR only).',
      inputSchema: {
        type: 'object',
        properties: {
          domain: { type: 'string', description: 'Domain to analyze (e.g. caplinq.com)' },
        },
        required: ['domain'],
      },
    },
    {
      name: 'get_domain_metrics',
      description: 'Get organic search metrics for a domain: keywords in top 10, estimated organic traffic. Uses DataForSEO if configured.',
      inputSchema: {
        type: 'object',
        properties: {
          domain: { type: 'string', description: 'Domain to analyze' },
        },
        required: ['domain'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'get_keyword_metrics') {
      if (!config.dataforseo.available) {
        return ok({
          tier: 1,
          status: 'unavailable',
          message: 'DataForSEO not configured. To get keyword data manually: Google Keyword Planner (ads.google.com/home/tools/keyword-planner) provides search volume ranges for free with a Google Ads account.',
          keywords_requested: args.keywords,
        });
      }
      const results = await getKeywordsDFS(args.keywords, args.location_code, args.language_code);
      return ok({ tier: 2, source: 'dataforseo', results });
    }

    if (name === 'get_backlink_profile') {
      if (config.dataforseo.available) {
        const result = await getBacklinksDFS(args.domain);
        return ok({ tier: 2, ...result });
      }
      const opr = await getDomainOPR(args.domain);
      if (opr) return ok({ tier: 1, ...opr });
      return tier1Manual('get_backlink_profile',
        [
          'Ahrefs free backlink checker: https://ahrefs.com/backlink-checker',
          'Moz Link Explorer free: https://moz.com/link-explorer',
          'Majestic free summary: https://majestic.com',
        ],
        { domain: args.domain, referring_domains: 'unknown', dr_estimate: 'unknown', dofollow_ratio: 'unknown', source: 'manual_required' }
      );
    }

    if (name === 'get_domain_metrics') {
      if (config.dataforseo.available) {
        const result = await getDomainMetricsDFS(args.domain);
        return ok({ tier: 2, ...result });
      }
      const opr = await getDomainOPR(args.domain);
      if (opr) return ok({ tier: 1, ...opr });
      return tier1Manual('get_domain_metrics',
        [
          'Google Search Console (site owner only): https://search.google.com/search-console',
          'Semrush free (10 queries/day): https://www.semrush.com',
          'Ubersuggest free: https://app.neilpatel.com',
        ],
        { domain: args.domain, keywords_in_top10: 'unknown', estimated_traffic: 'unknown', source: 'manual_required' }
      );
    }

    return err(`Unknown tool: ${name}`);
  } catch (e) {
    return err(e.message);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
