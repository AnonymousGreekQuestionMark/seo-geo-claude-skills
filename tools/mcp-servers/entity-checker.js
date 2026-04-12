#!/usr/bin/env node
/**
 * entity-checker MCP server
 * All sources free — no paid fallback needed.
 * Wikidata SPARQL (always available)
 * Wikipedia API (always available)
 * Google Knowledge Graph API (requires GOOGLE_API_KEY — 100k/day free)
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { config, tierStatus } from '../shared/config.js';
import { get, ok, err } from '../shared/http.js';

tierStatus('entity-checker', {
  'Wikidata SPARQL (always free)': true,
  'Wikipedia API (always free)': true,
  'Google Knowledge Graph API': config.google.available,
});

// ── Wikidata ──────────────────────────────────────────────────────────────────

async function checkWikidata(entityName, domain) {
  const results = {};

  // Search by domain URL
  const domainQuery = `
    SELECT ?item ?itemLabel ?itemDescription WHERE {
      ?item wdt:P856 ?url .
      FILTER(REGEX(STR(?url), "${domain.replace(/\./g, '\\\\.')}", "i"))
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
    } LIMIT 5`;

  const domainUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(domainQuery)}&format=json`;
  try {
    const data = await get(domainUrl, { 'User-Agent': 'SEO-GEO-Skills/1.0 (entity-checker)' });
    results.by_domain = (data.results?.bindings || []).map((b) => ({
      id: b.item?.value?.split('/').pop(),
      label: b.itemLabel?.value,
      description: b.itemDescription?.value,
    }));
  } catch {
    results.by_domain = [];
  }

  // Search by entity name
  const nameQuery = `
    SELECT ?item ?itemLabel ?itemDescription WHERE {
      ?item rdfs:label "${entityName}"@en .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
    } LIMIT 5`;

  const nameUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(nameQuery)}&format=json`;
  try {
    const data = await get(nameUrl, { 'User-Agent': 'SEO-GEO-Skills/1.0 (entity-checker)' });
    results.by_name = (data.results?.bindings || []).map((b) => ({
      id: b.item?.value?.split('/').pop(),
      label: b.itemLabel?.value,
      description: b.itemDescription?.value,
    }));
  } catch {
    results.by_name = [];
  }

  const found = results.by_domain.length > 0 || results.by_name.length > 0;
  return { source: 'wikidata', found, ...results };
}

// ── Wikipedia ─────────────────────────────────────────────────────────────────

async function checkWikipedia(entityName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(entityName)}&format=json&origin=*&srlimit=3`;
  const data = await get(url);
  const hits = data.query?.search || [];
  return {
    source: 'wikipedia',
    found: hits.length > 0,
    results: hits.map((h) => ({
      title: h.title,
      snippet: h.snippet?.replace(/<[^>]+>/g, ''),
      page_id: h.pageid,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(h.title.replace(/ /g, '_'))}`,
    })),
  };
}

// ── Google Knowledge Graph ────────────────────────────────────────────────────

async function checkGoogleKG(entityName) {
  if (!config.google.available) {
    return { source: 'google_kg', available: false, note: 'Set GOOGLE_API_KEY to enable Google Knowledge Graph checks.' };
  }
  const url = `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(entityName)}&key=${config.google.apiKey}&limit=5`;
  const data = await get(url);
  const items = data.itemListElement || [];
  return {
    source: 'google_kg',
    found: items.length > 0,
    results: items.map((el) => ({
      name: el.result?.name,
      type: el.result?.['@type'],
      description: el.result?.description,
      score: el.resultScore,
      kg_id: el.result?.['@id'],
    })),
  };
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'entity-checker', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'check_entity',
      description: 'Check if an entity (company, person, organization) is present in Wikidata, Wikipedia, and Google Knowledge Graph. Returns entity IDs and presence status across all three.',
      inputSchema: {
        type: 'object',
        properties: {
          entity_name: { type: 'string', description: 'Entity name to search for (e.g. "CAPLINQ Corporation")' },
          domain: { type: 'string', description: 'Associated domain (e.g. caplinq.com) for Wikidata URL match' },
        },
        required: ['entity_name', 'domain'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name !== 'check_entity') return err(`Unknown tool: ${name}`);

  try {
    const [wikidata, wikipedia, googleKg] = await Promise.all([
      checkWikidata(args.entity_name, args.domain),
      checkWikipedia(args.entity_name),
      checkGoogleKG(args.entity_name),
    ]);

    const kgCount = [wikidata.found, wikipedia.found, googleKg.found].filter(Boolean).length;
    const citeI01 = kgCount >= 2 ? 'PASS' : kgCount === 1 ? 'PARTIAL' : 'FAIL';

    return ok({
      entity: args.entity_name,
      domain: args.domain,
      cite_I01_verdict: citeI01,
      cite_I01_note: 'PASS requires presence in ≥2 knowledge graphs',
      knowledge_graphs_found: kgCount,
      wikidata,
      wikipedia,
      google_kg: googleKg,
    });
  } catch (e) {
    return err(e.message);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
