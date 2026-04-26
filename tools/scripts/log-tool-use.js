#!/usr/bin/env node
/**
 * log-tool-use.js
 * PostToolUse hook script — called by Claude Code after each WebFetch tool use.
 * Reads tool call details from stdin (JSON), reads .analysis-session.json for
 * context, and appends a claude_code entry to the current analysis's
 * prompt-results.json.
 *
 * Hook config in .claude/settings.json:
 *   "PostToolUse": [{ "matcher": "WebFetch", "hooks": [{ "type": "command",
 *     "command": "node tools/scripts/log-tool-use.js" }] }]
 *
 * Always exits 0 — never blocks Claude Code execution.
 */
import { readFile, writeFile } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FALLBACK_LOG = resolve(__dirname, '../../__tests__/integration/results/claude-code-searches.json');

const SESSION_FILE = resolve(process.cwd(), '.analysis-session.json');

async function readSession() {
  if (!existsSync(SESSION_FILE)) return null;
  try {
    return JSON.parse(await readFile(SESSION_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

async function appendToPromptResults(analysisPath, entry) {
  const filePath = join(analysisPath, 'prompt-results.json');
  let data = { analysis_metadata: {}, prompt_results: [], webfetch_calls: [], summary: null };
  try {
    const raw = await readFile(filePath, 'utf-8');
    data = JSON.parse(raw);
  } catch {
    // File doesn't exist yet — use default
  }
  data.prompt_results.push(entry);
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

async function appendToFallbackLog(entry) {
  const dir = dirname(FALLBACK_LOG);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  let entries = [];
  try {
    entries = JSON.parse(await readFile(FALLBACK_LOG, 'utf-8'));
  } catch { /* start fresh */ }
  entries.push(entry);
  await writeFile(FALLBACK_LOG, JSON.stringify(entries, null, 2));
}

async function main() {
  // Read tool call from stdin first (always available)
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  if (!input.trim()) return;

  let toolCall;
  try {
    toolCall = JSON.parse(input);
  } catch {
    return;
  }

  const { tool_name, tool_input, tool_response } = toolCall;
  if (!tool_name) return;

  // Build response summary and urls
  let responseSummary = '';
  let urlsVisited = [];

  if (tool_name === 'WebFetch') {
    urlsVisited = tool_input?.url ? [tool_input.url] : [];
    const responseText = typeof tool_response === 'string'
      ? tool_response
      : tool_response?.content?.[0]?.text || JSON.stringify(tool_response || '');
    responseSummary = responseText.slice(0, 300);
  } else if (tool_name === 'WebSearch') {
    // Extract result URLs from WebSearch response if available
    const responseObj = typeof tool_response === 'string' ? null : tool_response;
    urlsVisited = (responseObj?.results || []).map(r => r.url).filter(Boolean);
    const responseText = typeof tool_response === 'string'
      ? tool_response
      : JSON.stringify(tool_response || '');
    responseSummary = responseText.slice(0, 300);
  }

  const session = await readSession();

  const entry = {
    source: 'claude_code',
    step: session?.current_step || null,
    skill: session?.current_skill || null,
    type: tool_name === 'WebSearch' ? 'web_search' : 'web_fetch',
    query: tool_input?.url || tool_input?.query || '',
    response_summary: responseSummary,
    urls_visited: urlsVisited,
    captured_at: new Date().toISOString(),
    duration_ms: null,
    raw_response: typeof tool_response === 'string' ? tool_response : JSON.stringify(tool_response),
  };

  try {
    if (session?.analysis_path) {
      await appendToPromptResults(session.analysis_path, entry);
    } else {
      await appendToFallbackLog(entry);
    }
  } catch {
    // Silently ignore write failures — never block Claude Code
  }
}

main().catch(() => {}).finally(() => process.exit(0));
