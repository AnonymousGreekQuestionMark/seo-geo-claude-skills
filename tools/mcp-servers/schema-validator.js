#!/usr/bin/env node
/**
 * schema-validator MCP server
 * No API keys required. Fetches a URL and validates JSON-LD locally.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { load } from 'cheerio';
import { ok, err } from '../shared/http.js';

process.stderr.write('[schema-validator] Ready (no API key required)\n');

const RECOMMENDED_SCHEMAS = {
  article: ['Article', 'BreadcrumbList'],
  faq: ['FAQPage', 'BreadcrumbList'],
  product: ['Product', 'BreadcrumbList'],
  howto: ['HowTo', 'BreadcrumbList'],
  organization: ['Organization'],
  local_business: ['LocalBusiness'],
  person: ['Person'],
};

// Validate a single JSON-LD block
function validateBlock(block) {
  const issues = [];
  if (!block['@context']) issues.push('Missing @context');
  if (!block['@type']) issues.push('Missing @type');

  const type = block['@type'];

  if (type === 'Article' || type === 'BlogPosting') {
    if (!block.headline) issues.push('Article missing headline');
    if (!block.author) issues.push('Article missing author');
    if (!block.datePublished) issues.push('Article missing datePublished');
    if (!block.publisher) issues.push('Article missing publisher');
  }
  if (type === 'FAQPage') {
    if (!block.mainEntity || !Array.isArray(block.mainEntity) || block.mainEntity.length === 0) {
      issues.push('FAQPage missing mainEntity questions');
    }
  }
  if (type === 'HowTo') {
    if (!block.step || block.step.length === 0) issues.push('HowTo missing steps');
  }
  if (type === 'Organization') {
    if (!block.name) issues.push('Organization missing name');
    if (!block.url) issues.push('Organization missing url');
  }
  if (type === 'Person') {
    if (!block.name) issues.push('Person missing name');
  }

  return { type, valid: issues.length === 0, issues };
}

async function validateUrl(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SEO-GEO-Skills/1.0 (schema-validator)' },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const html = await res.text();
  const $ = load(html);

  const blocks = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).text());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (item['@graph']) {
          blocks.push(...item['@graph'].map((g) => ({ ...g, '@context': g['@context'] || 'https://schema.org' })));
        } else {
          blocks.push(item);
        }
      }
    } catch {
      blocks.push({ parse_error: true, raw: $(el).text().slice(0, 100) });
    }
  });

  const validated = blocks.map(validateBlock);
  const typesFound = validated.map((v) => v.type).filter(Boolean);
  const hasErrors = validated.some((v) => !v.valid);

  // CITE I04 check: does this page have schema?
  const citeI04 = typesFound.length > 0 ? (hasErrors ? 'PARTIAL' : 'PASS') : 'FAIL';

  return {
    url,
    schema_blocks_found: blocks.length,
    types_found: typesFound,
    cite_I04_verdict: citeI04,
    validation: validated,
    missing_recommendations: {
      faq_page: !typesFound.includes('FAQPage'),
      how_to: !typesFound.includes('HowTo'),
      breadcrumb: !typesFound.includes('BreadcrumbList'),
      article: !typesFound.some((t) => ['Article', 'BlogPosting', 'NewsArticle'].includes(t)),
    },
  };
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'schema-validator', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'validate_page_schema',
      description: 'Fetch a URL and extract + validate all JSON-LD schema markup. Returns types found, validation issues, CITE I04 verdict, and missing recommended schemas.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Full URL to validate (e.g. https://blog.caplinq.com/pfas-free-gdl)' },
        },
        required: ['url'],
      },
    },
    {
      name: 'validate_jsonld',
      description: 'Validate a raw JSON-LD string directly without fetching a URL.',
      inputSchema: {
        type: 'object',
        properties: {
          jsonld: { type: 'string', description: 'Raw JSON-LD string to validate' },
        },
        required: ['jsonld'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'validate_page_schema') {
      const result = await validateUrl(args.url);
      return ok(result);
    }

    if (name === 'validate_jsonld') {
      const parsed = JSON.parse(args.jsonld);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const validated = items.map(validateBlock);
      return ok({ validated, has_errors: validated.some((v) => !v.valid) });
    }

    return err(`Unknown tool: ${name}`);
  } catch (e) {
    return err(e.message);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
