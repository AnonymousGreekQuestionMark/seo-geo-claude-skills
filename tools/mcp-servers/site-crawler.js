#!/usr/bin/env node
/**
 * site-crawler MCP server
 * BFS crawler using Node 18+ built-in fetch + cheerio.
 * No API keys required. Runs locally.
 * Useful for: internal link graph, orphan pages, schema coverage, technical audit.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { load } from 'cheerio';
import { ok, err } from '../shared/http.js';

process.stderr.write('[site-crawler] Ready (no API key required — runs locally)\n');

const HEADERS = { 'User-Agent': 'SEO-GEO-Skills/1.0 (site-crawler; +https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills)' };
const CONCURRENCY = 3;
const DEFAULT_MAX_PAGES = 50;

async function fetchPage(url) {
  const res = await fetch(url, { headers: HEADERS, redirect: 'follow', signal: AbortSignal.timeout(10000) });
  if (!res.ok) return { status: res.status, html: null };
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return { status: res.status, html: null };
  return { status: res.status, html: await res.text() };
}

function parsePage(url, html) {
  const $ = load(html);
  const origin = new URL(url).origin;

  const internalLinks = new Set();
  const externalLinks = new Set();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    try {
      const resolved = new URL(href, url).href.split('#')[0].split('?')[0];
      if (resolved.startsWith(origin)) {
        internalLinks.add(resolved);
      } else {
        externalLinks.add(new URL(resolved).hostname);
      }
    } catch {}
  });

  const schemaTypes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).text());
      const items = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed];
      for (const item of items) {
        if (item['@type']) schemaTypes.push(item['@type']);
      }
    } catch {}
  });

  return {
    url,
    title: $('title').first().text().trim().slice(0, 100) || null,
    meta_description: $('meta[name="description"]').attr('content')?.slice(0, 200) || null,
    h1: $('h1').first().text().trim().slice(0, 100) || null,
    canonical: $('link[rel="canonical"]').attr('href') || null,
    schema_types: schemaTypes,
    internal_links: [...internalLinks],
    external_link_domains: [...externalLinks].slice(0, 20),
    word_count_estimate: $('body').text().split(/\s+/).filter(Boolean).length,
  };
}

async function crawlSite(domain, maxPages = DEFAULT_MAX_PAGES) {
  const startUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const origin = new URL(startUrl).origin;

  const visited = new Map(); // url -> pageData
  const queue = [startUrl];
  const queued = new Set([startUrl]);

  while (queue.length > 0 && visited.size < maxPages) {
    const batch = queue.splice(0, CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async (url) => {
        const { status, html } = await fetchPage(url);
        if (!html) return { url, status, skipped: true };
        return parsePage(url, html);
      })
    );

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const page = result.value;
      if (page.skipped) {
        visited.set(page.url, { url: page.url, status: page.status, skipped: true });
        continue;
      }
      visited.set(page.url, page);

      // Enqueue new internal links
      for (const link of page.internal_links || []) {
        if (!queued.has(link) && visited.size + queue.length < maxPages * 2) {
          queued.add(link);
          queue.push(link);
        }
      }
    }
  }

  const pages = [...visited.values()].filter((p) => !p.skipped);

  // Build link graph
  const incomingLinks = new Map();
  for (const page of pages) {
    for (const link of page.internal_links || []) {
      if (!incomingLinks.has(link)) incomingLinks.set(link, []);
      incomingLinks.get(link).push(page.url);
    }
  }

  // Find orphan pages (no internal links pointing to them, excluding start URL)
  const orphans = pages
    .filter((p) => p.url !== startUrl && (!incomingLinks.has(p.url) || incomingLinks.get(p.url).length === 0))
    .map((p) => p.url);

  // Schema coverage
  const schemaTypes = {};
  for (const page of pages) {
    for (const type of page.schema_types || []) {
      schemaTypes[type] = (schemaTypes[type] || 0) + 1;
    }
  }

  const pagesWithSchema = pages.filter((p) => p.schema_types?.length > 0).length;
  const schemaCoveragePercent = pages.length > 0 ? Math.round((pagesWithSchema / pages.length) * 100) : 0;

  // CITE I04 verdict
  const citeI04 = schemaCoveragePercent >= 50 ? 'PASS' : schemaCoveragePercent >= 20 ? 'PARTIAL' : 'FAIL';

  return {
    domain,
    pages_crawled: pages.length,
    max_pages,
    cite_I04_verdict: citeI04,
    cite_I04_note: `${schemaCoveragePercent}% of pages have schema (PASS requires ≥50%)`,
    schema_summary: { coverage_percent: schemaCoveragePercent, types_found: schemaTypes, pages_with_schema: pagesWithSchema },
    orphan_pages: orphans,
    orphan_count: orphans.length,
    pages,
  };
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'site-crawler', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'crawl_site',
      description: 'BFS crawl a website and return: page inventory, internal link graph, orphan pages, schema markup coverage (CITE I04), titles, H1s, meta descriptions, and word count estimates.',
      inputSchema: {
        type: 'object',
        properties: {
          domain: { type: 'string', description: 'Domain or URL to crawl (e.g. blog.caplinq.com or https://blog.caplinq.com)' },
          max_pages: { type: 'number', description: 'Maximum pages to crawl (default: 50, max: 200)', default: 50 },
        },
        required: ['domain'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name !== 'crawl_site') return err(`Unknown tool: ${name}`);

  try {
    const maxPages = Math.min(args.max_pages || DEFAULT_MAX_PAGES, 200);
    const result = await crawlSite(args.domain, maxPages);
    return ok(result);
  } catch (e) {
    return err(e.message);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
