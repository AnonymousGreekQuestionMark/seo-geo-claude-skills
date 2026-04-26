import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Try multiple locations for .env file
const envPaths = [
  resolve(__dirname, '../../.env'),                    // From tools/shared/ → root
  resolve(process.cwd(), '.env'),                      // CWD
  '/Users/anirvin/AARAI/geo/seo-geo-claude-skills/.env' // Absolute fallback
];

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const has = (key) => !!process.env[key];

export const config = {
  dataforseo: {
    login: process.env.DATAFORSEO_LOGIN,
    password: process.env.DATAFORSEO_PASSWORD,
    available: has('DATAFORSEO_LOGIN') && has('DATAFORSEO_PASSWORD'),
    authHeader: () => {
      const b64 = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64');
      return { Authorization: `Basic ${b64}` };
    },
  },
  serper: {
    apiKey: process.env.SERPER_API_KEY,
    available: has('SERPER_API_KEY'),
  },
  google: {
    apiKey: process.env.GOOGLE_API_KEY,
    cseId: process.env.GOOGLE_CSE_ID,
    available: has('GOOGLE_API_KEY'),
    cseAvailable: has('GOOGLE_API_KEY') && has('GOOGLE_CSE_ID'),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    // gpt-4o-mini via Responses API (/v1/responses) with web_search tool (GA)
    searchModel: process.env.OPENAI_SEARCH_MODEL || 'gpt-4o-mini',
    available: has('OPENAI_API_KEY'),
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
    webSearch: process.env.ANTHROPIC_WEB_SEARCH === 'true',
    available: has('ANTHROPIC_API_KEY'),
    // LIMIT_ANTHROPIC=true: Run Anthropic once per step (opt-in throttle)
    // Default OFF — Anthropic runs on all queries like other engines
    limitCalls: process.env.LIMIT_ANTHROPIC === 'true',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    available: has('GEMINI_API_KEY'),
  },
  perplexity: {
    apiKey: process.env.PERPLEXITY_API_KEY,
    model: process.env.PERPLEXITY_MODEL || 'sonar',
    available: has('PERPLEXITY_API_KEY'),
  },
  opr: {
    apiKey: process.env.OPR_API_KEY,
    available: has('OPR_API_KEY'),
  },
};

export function tierStatus(serverName, checks) {
  const lines = [`[${serverName}] API availability:`];
  for (const [label, available] of Object.entries(checks)) {
    lines.push(`  ${available ? '✓' : '✗'} ${label}`);
  }
  process.stderr.write(lines.join('\n') + '\n');
}

export function unavailable(reason) {
  return {
    content: [{ type: 'text', text: JSON.stringify({ tier: 1, status: 'unavailable', reason }) }],
  };
}
