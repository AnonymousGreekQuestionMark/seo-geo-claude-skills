import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

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
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    searchModel: process.env.OPENAI_SEARCH_MODEL || 'gpt-4o-search-preview',
    available: has('OPENAI_API_KEY'),
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
    webSearch: process.env.ANTHROPIC_WEB_SEARCH === 'true',
    available: has('ANTHROPIC_API_KEY'),
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
