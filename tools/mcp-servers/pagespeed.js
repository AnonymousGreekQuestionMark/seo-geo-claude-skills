#!/usr/bin/env node
/**
 * pagespeed MCP server
 * Google PageSpeed Insights API — free, 25,000 requests/day.
 * GOOGLE_API_KEY optional (higher rate limit quota with key).
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { config } from '../shared/config.js';
import { get, ok, err } from '../shared/http.js';
import { fetchRobotsTxt } from '../shared/robots-txt-fetcher.js';

process.stderr.write(`[pagespeed] Ready — ${config.google.available ? 'using GOOGLE_API_KEY (higher quota)' : 'no API key (anonymous, 25k/day limit)'}\n`);

async function runPSI(url, strategy = 'mobile', analysisPath = null) {
  const params = new URLSearchParams({ url, strategy });
  if (config.google.available) params.set('key', config.google.apiKey);
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;

  const data = await get(endpoint);
  const lhr = data.lighthouseResult;
  const crux = data.loadingExperience;

  // Core Web Vitals from field data (CrUX) if available
  const fieldData = crux?.metrics
    ? {
        source: 'field_data_crux',
        lcp: crux.metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
        fid: crux.metrics.FIRST_INPUT_DELAY_MS?.percentile,
        cls: crux.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile,
        inp: crux.metrics.INTERACTION_TO_NEXT_PAINT?.percentile,
        overall_category: crux.overall_category,
      }
    : { source: 'no_field_data', note: 'Site has insufficient real-user data in CrUX' };

  // Lab data from Lighthouse
  const audits = lhr?.audits || {};
  const labData = {
    source: 'lab_data_lighthouse',
    performance_score: Math.round((lhr?.categories?.performance?.score || 0) * 100),
    lcp: audits['largest-contentful-paint']?.displayValue,
    tbt: audits['total-blocking-time']?.displayValue,
    cls: audits['cumulative-layout-shift']?.displayValue,
    speed_index: audits['speed-index']?.displayValue,
    time_to_interactive: audits['interactive']?.displayValue,
    first_contentful_paint: audits['first-contentful-paint']?.displayValue,
  };

  // Fetch and parse robots.txt
  const domain = new URL(url).hostname;
  const robotsData = await fetchRobotsTxt(domain);

  if (analysisPath) {
    try {
      await writeFile(join(analysisPath, 'robots-txt.json'), JSON.stringify(robotsData, null, 2));
    } catch (e) {
      console.error(`[pagespeed] Failed to save robots-txt.json: ${e.message}`);
    }
  }

  // CITE E04 verdict
  const score = labData.performance_score;
  const citeE04 = score >= 80 ? 'PASS' : score >= 50 ? 'PARTIAL' : 'FAIL';

  return {
    url,
    strategy,
    cite_E04_verdict: citeE04,
    cite_E04_note: 'PASS requires <3s load time (score ≥80 correlates). Also check AI crawler access in robots.txt.',
    robots_allows_ai: robotsData.parsed.allows_all_ai,
    field_data: fieldData,
    lab_data: labData,
    ai_crawler_check: robotsData.parsed,
    robots_txt_url: robotsData.url,
  };
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'pagespeed', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_core_web_vitals',
      description: 'Run Google PageSpeed Insights for a URL. Returns Core Web Vitals (LCP, CLS, INP), performance score, and CITE E04 verdict (Technical Crawlability).',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Full URL to test (e.g. https://blog.caplinq.com)' },
          strategy: {
            type: 'string',
            enum: ['mobile', 'desktop'],
            description: 'Device strategy (default: mobile — Google uses mobile-first indexing)',
            default: 'mobile',
          },
          analysisPath: {
            type: 'string',
            description: 'Path to analysis directory. If provided, saves robots-txt.json there.',
          },
        },
        required: ['url'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name !== 'get_core_web_vitals') return err(`Unknown tool: ${name}`);

  try {
    const result = await runPSI(args.url, args.strategy || 'mobile', args.analysisPath || null);
    return ok(result);
  } catch (e) {
    return err(e.message);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
