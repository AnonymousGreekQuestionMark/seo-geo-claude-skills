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
import { join, resolve } from 'path';
import { existsSync } from 'fs';

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

async function main() {
  const session = await readSession();
  if (!session?.analysis_path) return; // No active analysis — nothing to log

  // Read tool call from stdin
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

  // Build response summary from content
  let responseSummary = '';
  let urlsVisited = [];

  if (tool_name === 'WebFetch') {
    urlsVisited = tool_input?.url ? [tool_input.url] : [];
    const responseText = typeof tool_response === 'string'
      ? tool_response
      : tool_response?.content?.[0]?.text || JSON.stringify(tool_response || '');
    responseSummary = responseText.slice(0, 300);
  } else if (tool_name === 'WebSearch') {
    const query = tool_input?.query || '';
    urlsVisited = [];
    const responseText = typeof tool_response === 'string'
      ? tool_response
      : JSON.stringify(tool_response || '');
    responseSummary = responseText.slice(0, 300);
  }

  const entry = {
    source: 'claude_code',
    step: session.current_step,
    skill: session.current_skill,
    type: tool_name === 'WebSearch' ? 'web_search' : 'web_fetch',
    query: tool_input?.url || tool_input?.query || '',
    response_summary: responseSummary,
    urls_visited: urlsVisited,
    timestamp_utc: new Date().toISOString(),
    raw_response: typeof tool_response === 'string' ? tool_response : JSON.stringify(tool_response),
  };

  try {
    await appendToPromptResults(session.analysis_path, entry);
  } catch {
    // Silently ignore write failures — never block Claude Code
  }
}

main().catch(() => {}).finally(() => process.exit(0));
