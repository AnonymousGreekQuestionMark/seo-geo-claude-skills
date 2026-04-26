/**
 * analysis-session.js
 * Manages .analysis-session.json — a lightweight context file that tells
 * PostToolUse hooks where to write claude_code prompt entries.
 *
 * Used by the company-analysis orchestration to track the current analysis
 * path + step so log-tool-use.js can append WebFetch calls automatically.
 */
import { writeFile, readFile, unlink } from 'fs/promises';
import { resolve } from 'path';
import { existsSync } from 'fs';

const SESSION_FILE = resolve(process.cwd(), '.analysis-session.json');

export async function startAnalysisSession(analysisPath, domain, step = '0', skill = 'init') {
  const session = {
    analysis_path: analysisPath,
    domain,
    current_step: String(step),
    current_skill: skill,
    started_at: new Date().toISOString(),
  };
  await writeFile(SESSION_FILE, JSON.stringify(session, null, 2));
}

export async function updateAnalysisSession(step, skill) {
  if (!existsSync(SESSION_FILE)) return;
  try {
    const raw = await readFile(SESSION_FILE, 'utf-8');
    const session = JSON.parse(raw);
    session.current_step = String(step);
    session.current_skill = skill;
    session.updated_at = new Date().toISOString();
    await writeFile(SESSION_FILE, JSON.stringify(session, null, 2));
  } catch {
    // Session file may have been removed — ignore
  }
}

export async function readAnalysisSession() {
  if (!existsSync(SESSION_FILE)) return null;
  try {
    const raw = await readFile(SESSION_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function endAnalysisSession() {
  try {
    await unlink(SESSION_FILE);
  } catch {
    // Already gone — ignore
  }
}

// CLI usage: node analysis-session.js start <path> <domain> [step] [skill]
//            node analysis-session.js update <step> <skill>
//            node analysis-session.js end
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [, , cmd, ...rest] = process.argv;
  if (cmd === 'start') await startAnalysisSession(rest[0], rest[1], rest[2], rest[3]);
  else if (cmd === 'update') await updateAnalysisSession(rest[0], rest[1]);
  else if (cmd === 'end') await endAnalysisSession();
}
