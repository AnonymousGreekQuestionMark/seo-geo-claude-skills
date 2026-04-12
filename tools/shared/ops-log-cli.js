#!/usr/bin/env node
/**
 * Operations Logger CLI
 * Command-line interface for logging orchestration operations.
 * Each command reads/writes the operations-log.json file directly.
 *
 * Usage:
 *   node ops-log-cli.js init <analysis-path> <domain> <timestamp>
 *   node ops-log-cli.js step-start <step-num> <skill-name>
 *   node ops-log-cli.js step-complete <step-num> <status> [summary]
 *   node ops-log-cli.js tool-call <step-num> <tool-name> <success> [error]
 *   node ops-log-cli.js error <step-num> <skill-name> <message>
 *   node ops-log-cli.js warning <step-num> <skill-name> <message>
 *   node ops-log-cli.js finalize <status>
 */

import fs from 'fs/promises';
import path from 'path';

// Environment variable for analysis path (set once with init)
const getLogPath = () => {
  const envPath = process.env.OPS_LOG_PATH;
  if (envPath) return envPath;
  // Fallback: look for analysis path marker file
  return path.join(process.cwd(), 'operations-log.json');
};

async function readLog(logPath) {
  try {
    const content = await fs.readFile(logPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function writeLog(logPath, log) {
  await fs.writeFile(logPath, JSON.stringify(log, null, 2));
}

async function init(analysisPath, domain, timestamp) {
  const logPath = path.join(analysisPath, 'operations-log.json');

  const log = {
    analysis_metadata: {
      domain,
      timestamp,
      started_at: new Date().toISOString(),
      completed_at: null,
      duration_seconds: null,
      version: '1.0.0'
    },
    environment: {
      node_version: process.version,
      platform: process.platform,
      limit_anthropic: process.env.LIMIT_ANTHROPIC !== 'false'
    },
    api_availability: {},
    steps: [],
    tool_calls: [],
    file_operations: [],
    errors: [],
    warnings: [],
    metrics: {
      total_api_calls: 0,
      by_engine: {},
      total_tokens_estimated: 0,
      total_webfetch_calls: 0,
      total_file_writes: 0,
      total_file_reads: 0
    }
  };

  await writeLog(logPath, log);
  console.log(`[ops-log] Initialized: ${logPath}`);
  return logPath;
}

async function stepStart(stepNumber, skillName) {
  const logPath = getLogPath();
  const log = await readLog(logPath);
  if (!log) {
    console.error('[ops-log] No log initialized. Run init first.');
    process.exit(1);
  }

  const step = {
    step: stepNumber,
    skill: skillName,
    started_at: new Date().toISOString(),
    completed_at: null,
    duration_ms: null,
    status: 'IN_PROGRESS',
    tool_calls: 0,
    api_calls: 0,
    errors: 0,
    handoff_written: false
  };

  log.steps.push(step);
  await writeLog(logPath, log);
  console.log(`[ops-log] Step ${stepNumber} (${skillName}) started`);
}

async function stepComplete(stepNumber, status, summary = '') {
  const logPath = getLogPath();
  const log = await readLog(logPath);
  if (!log) {
    console.error('[ops-log] No log initialized.');
    process.exit(1);
  }

  const step = log.steps.find(s => String(s.step) === String(stepNumber));
  if (step) {
    step.completed_at = new Date().toISOString();
    step.duration_ms = new Date(step.completed_at) - new Date(step.started_at);
    step.status = status;
    if (summary) step.summary = summary;
    step.handoff_written = true;
  }

  await writeLog(logPath, log);
  console.log(`[ops-log] Step ${stepNumber} completed: ${status}`);
}

async function toolCall(stepNumber, toolName, success, error = null) {
  const logPath = getLogPath();
  const log = await readLog(logPath);
  if (!log) {
    console.error('[ops-log] No log initialized.');
    process.exit(1);
  }

  const call = {
    timestamp: new Date().toISOString(),
    step: stepNumber,
    tool: toolName,
    success: success === 'true' || success === true,
    error: error || null
  };

  log.tool_calls.push(call);
  log.metrics.total_api_calls++;

  if (toolName === 'WebFetch') {
    log.metrics.total_webfetch_calls++;
  }

  // Update step tool count
  const step = log.steps.find(s => String(s.step) === String(stepNumber));
  if (step) {
    step.tool_calls++;
    if (error) step.errors++;
  }

  await writeLog(logPath, log);
  console.log(`[ops-log] Tool call logged: ${toolName}`);
}

async function logError(stepNumber, skillName, message) {
  const logPath = getLogPath();
  const log = await readLog(logPath);
  if (!log) {
    console.error('[ops-log] No log initialized.');
    process.exit(1);
  }

  log.errors.push({
    timestamp: new Date().toISOString(),
    step: stepNumber,
    skill: skillName,
    type: 'ERROR',
    message,
    recoverable: true
  });

  await writeLog(logPath, log);
  console.log(`[ops-log] Error logged for step ${stepNumber}`);
}

async function logWarning(stepNumber, skillName, message) {
  const logPath = getLogPath();
  const log = await readLog(logPath);
  if (!log) {
    console.error('[ops-log] No log initialized.');
    process.exit(1);
  }

  log.warnings.push({
    timestamp: new Date().toISOString(),
    step: stepNumber,
    skill: skillName,
    message
  });

  await writeLog(logPath, log);
  console.log(`[ops-log] Warning logged for step ${stepNumber}`);
}

async function finalize(overallStatus) {
  const logPath = getLogPath();
  const log = await readLog(logPath);
  if (!log) {
    console.error('[ops-log] No log initialized.');
    process.exit(1);
  }

  log.analysis_metadata.completed_at = new Date().toISOString();
  log.analysis_metadata.duration_seconds = Math.round(
    (new Date(log.analysis_metadata.completed_at) - new Date(log.analysis_metadata.started_at)) / 1000
  );
  log.analysis_metadata.overall_status = overallStatus;

  // Calculate step summaries
  log.summary = {
    total_steps: log.steps.length,
    completed_steps: log.steps.filter(s => s.status === 'DONE').length,
    steps_with_concerns: log.steps.filter(s => s.status === 'DONE_WITH_CONCERNS').length,
    blocked_steps: log.steps.filter(s => s.status === 'BLOCKED').length,
    total_errors: log.errors.length,
    total_warnings: log.warnings.length,
    total_tool_calls: log.tool_calls.length,
    total_file_operations: log.file_operations.length
  };

  await writeLog(logPath, log);

  // Generate markdown summary
  await generateMarkdownLog(logPath, log);

  console.log(`[ops-log] Finalized: ${overallStatus} (${log.analysis_metadata.duration_seconds}s)`);
}

async function generateMarkdownLog(logPath, log) {
  const lines = [];
  const meta = log.analysis_metadata;

  lines.push(`# Operations Log - ${meta.domain}`);
  lines.push(`Generated: ${meta.completed_at}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Duration | ${meta.duration_seconds}s |`);
  lines.push(`| Status | ${meta.overall_status} |`);
  lines.push(`| Total Steps | ${log.summary.total_steps} |`);
  lines.push(`| Completed | ${log.summary.completed_steps} |`);
  lines.push(`| With Concerns | ${log.summary.steps_with_concerns} |`);
  lines.push(`| Blocked | ${log.summary.blocked_steps} |`);
  lines.push(`| Total API Calls | ${log.metrics.total_api_calls} |`);
  lines.push(`| Total Errors | ${log.summary.total_errors} |`);
  lines.push('');

  // Step Timeline
  lines.push('## Step Timeline');
  lines.push('');
  lines.push('| Step | Skill | Duration | Status | Tool Calls | Errors |');
  lines.push('|------|-------|----------|--------|------------|--------|');
  for (const step of log.steps) {
    const duration = step.duration_ms ? `${Math.round(step.duration_ms / 1000)}s` : '-';
    lines.push(`| ${step.step} | ${step.skill} | ${duration} | ${step.status} | ${step.tool_calls} | ${step.errors} |`);
  }
  lines.push('');

  // Errors
  if (log.errors.length > 0) {
    lines.push('## Errors');
    lines.push('');
    for (const error of log.errors) {
      lines.push(`### Step ${error.step} - ${error.skill}`);
      lines.push(`- **Type**: ${error.type}`);
      lines.push(`- **Message**: ${error.message}`);
      lines.push('');
    }
  }

  // Warnings (limited)
  if (log.warnings.length > 0) {
    lines.push('## Warnings');
    lines.push('');
    const limitedWarnings = log.warnings.slice(0, 20);
    for (const warning of limitedWarnings) {
      lines.push(`- **Step ${warning.step}** (${warning.skill}): ${warning.message}`);
    }
    if (log.warnings.length > 20) {
      lines.push(`- ... and ${log.warnings.length - 20} more warnings`);
    }
    lines.push('');
  }

  const mdPath = logPath.replace('.json', '.md');
  await fs.writeFile(mdPath, lines.join('\n'));
}

// Main CLI handler
const [,, command, ...args] = process.argv;

switch (command) {
  case 'init':
    if (args.length < 3) {
      console.error('Usage: ops-log-cli.js init <analysis-path> <domain> <timestamp>');
      process.exit(1);
    }
    init(args[0], args[1], args[2]);
    break;

  case 'step-start':
    if (args.length < 2) {
      console.error('Usage: ops-log-cli.js step-start <step-num> <skill-name>');
      process.exit(1);
    }
    stepStart(args[0], args[1]);
    break;

  case 'step-complete':
    if (args.length < 2) {
      console.error('Usage: ops-log-cli.js step-complete <step-num> <status> [summary]');
      process.exit(1);
    }
    stepComplete(args[0], args[1], args[2] || '');
    break;

  case 'tool-call':
    if (args.length < 3) {
      console.error('Usage: ops-log-cli.js tool-call <step-num> <tool-name> <success> [error]');
      process.exit(1);
    }
    toolCall(args[0], args[1], args[2], args[3] || null);
    break;

  case 'error':
    if (args.length < 3) {
      console.error('Usage: ops-log-cli.js error <step-num> <skill-name> <message>');
      process.exit(1);
    }
    logError(args[0], args[1], args[2]);
    break;

  case 'warning':
    if (args.length < 3) {
      console.error('Usage: ops-log-cli.js warning <step-num> <skill-name> <message>');
      process.exit(1);
    }
    logWarning(args[0], args[1], args[2]);
    break;

  case 'finalize':
    if (args.length < 1) {
      console.error('Usage: ops-log-cli.js finalize <status>');
      process.exit(1);
    }
    finalize(args[0]);
    break;

  default:
    console.log(`Operations Logger CLI

Commands:
  init <path> <domain> <timestamp>    Initialize log for new analysis
  step-start <num> <skill>            Log step start
  step-complete <num> <status>        Log step completion
  tool-call <num> <tool> <ok> [err]   Log tool call
  error <num> <skill> <msg>           Log error
  warning <num> <skill> <msg>         Log warning
  finalize <status>                   Finalize log

Environment:
  OPS_LOG_PATH    Path to operations-log.json (auto-detected after init)
`);
}
