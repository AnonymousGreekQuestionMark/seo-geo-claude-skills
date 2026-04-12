#!/usr/bin/env node
/**
 * brand-monitor MCP server
 * Tier 1: Serper.dev — searches for brand mentions not on the brand's own domain.
 * Tier 1 fallback: Google Custom Search API (requires GOOGLE_API_KEY + GOOGLE_CSE_ID).
 * Maps to: CITE I09 (Unlinked Brand Mentions), competitor content monitoring.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { config, tierStatus } from '../shared/config.js';
import { post, get, ok, err, tier1Manual } from '../shared/http.js';

tierStatus('brand-monitor', {
  'Serper.dev (primary)': config.serper.available,
  'Google Custom Search (fallback)': config.google.cseAvailable,
});

// ── Serper.dev brand mention search ──────────────────────────────────────────

async function serperBrandSearch(brandName, domain, excludeOwn = true) {
  const query = excludeOwn ? `"${brandName}" -site:${domain}` : `"${brandName}"`;
  const data = await post(
    'https://google.serper.dev/search',
    { 'X-API-KEY': config.serper.apiKey },
    { q: query, num: 20 }
  );

  return (data.organic || []).map((r) => ({
    title: r.title,
    url: r.link,
    domain: new URL(r.link).hostname.replace(/^www\./, ''),
    snippet: r.snippet,
    date: r.date ?? null,
    has_link_to_brand: r.snippet?.toLowerCase().includes(domain.toLowerCase()) ?? false,
  }));
}

// ── Google Custom Search fallback ─────────────────────────────────────────────

async function googleCseBrandSearch(brandName, domain) {
  const query = `"${brandName}" -site:${domain}`;
  const url = `https://www.googleapis.com/customsearch/v1?key=${config.google.apiKey}&cx=${config.google.cseId}&q=${encodeURIComponent(query)}&num=10`;
  const data = await get(url);
  return (data.items || []).map((r) => ({
    title: r.title,
    url: r.link,
    domain: new URL(r.link).hostname.replace(/^www\./, ''),
    snippet: r.snippet,
  }));
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'brand-monitor', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'find_brand_mentions',
      description: 'Find web pages that mention a brand name but are not on the brand\'s own domain. Returns unlinked mentions for CITE I09 scoring and brand awareness assessment.',
      inputSchema: {
        type: 'object',
        properties: {
          brand_name: { type: 'string', description: 'Brand name to search for (e.g. "CAPLINQ")' },
          domain: { type: 'string', description: 'Brand\'s own domain to exclude from results (e.g. caplinq.com)' },
        },
        required: ['brand_name', 'domain'],
      },
    },
    {
      name: 'monitor_competitor_content',
      description: 'Search for recent content from a competitor domain on a specific topic, to detect new posts that compete with your content.',
      inputSchema: {
        type: 'object',
        properties: {
          competitor_domain: { type: 'string', description: 'Competitor domain (e.g. specialchem.com)' },
          topic: { type: 'string', description: 'Topic to search for (e.g. "gas diffusion layer")' },
        },
        required: ['competitor_domain', 'topic'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'find_brand_mentions') {
      let mentions;
      let source;

      if (config.serper.available) {
        mentions = await serperBrandSearch(args.brand_name, args.domain);
        source = 'serper';
      } else if (config.google.cseAvailable) {
        mentions = await googleCseBrandSearch(args.brand_name, args.domain);
        source = 'google_cse';
      } else {
        return ok({
          tier: 1,
          status: 'manual_required',
          cite_I09_note: 'CITE I09 requires ≥50 unlinked brand mentions for PASS.',
          manual_instructions: `Search Google for: "${args.brand_name}" -site:${args.domain}\nCount results on pages 1–3. Also set up Google Alerts at: https://www.google.com/alerts#${encodeURIComponent(args.brand_name)}`,
        });
      }

      const count = mentions.length;
      const citeI09 = count >= 50 ? 'PASS' : count >= 10 ? 'PARTIAL' : 'FAIL';

      return ok({
        brand: args.brand_name,
        domain_excluded: args.domain,
        source,
        mention_count_in_results: count,
        cite_I09_verdict: citeI09,
        cite_I09_note: 'Counts top results only — actual unlinked mentions may be higher. PASS requires ≥50.',
        mentions,
      });
    }

    if (name === 'monitor_competitor_content') {
      if (!config.serper.available && !config.google.cseAvailable) {
        return tier1Manual('monitor_competitor_content',
          [
            `Search Google manually: https://www.google.com/search?q=site:${args.competitor_domain}+${encodeURIComponent(args.topic)}`,
            `Set up a Google Alert for new content: https://www.google.com/alerts#${encodeURIComponent(`site:${args.competitor_domain} ${args.topic}`)}`,
          ],
          { competitor: args.competitor_domain, topic: args.topic, results: 'manually_check_google', source: 'manual_required' }
        );
      }

      const query = `site:${args.competitor_domain} ${args.topic}`;
      let results;

      if (config.serper.available) {
        const data = await post(
          'https://google.serper.dev/search',
          { 'X-API-KEY': config.serper.apiKey },
          { q: query, num: 10 }
        );
        results = (data.organic || []).map((r) => ({
          title: r.title,
          url: r.link,
          snippet: r.snippet,
          date: r.date ?? null,
        }));
      } else {
        const url = `https://www.googleapis.com/customsearch/v1?key=${config.google.apiKey}&cx=${config.google.cseId}&q=${encodeURIComponent(query)}&num=10`;
        const data = await get(url);
        results = (data.items || []).map((r) => ({ title: r.title, url: r.link, snippet: r.snippet }));
      }

      return ok({
        competitor: args.competitor_domain,
        topic: args.topic,
        results_found: results.length,
        results,
      });
    }

    return err(`Unknown tool: ${name}`);
  } catch (e) {
    return err(e.message);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
