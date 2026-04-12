/**
 * Operations Logger
 * Captures comprehensive logs of all operations during company-analysis pipeline
 * Stored per analysis in operations-log.json
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * In-memory log buffer for current analysis
 */
let currentLog = null;
let analysisPath = null;

/**
 * Initialize operations log for a new analysis
 * @param {string} path - Path to analysis directory
 * @param {string} domain - Domain being analyzed
 * @param {string} timestamp - Analysis timestamp
 */
export async function initOperationsLog(path, domain, timestamp) {
  analysisPath = path;
  currentLog = {
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

  // Write initial log
  await saveLog();
}

/**
 * Log API availability at startup
 * @param {Object} availability - API availability map
 */
export async function logApiAvailability(availability) {
  if (!currentLog) return;
  currentLog.api_availability = availability;
  await saveLog();
}

/**
 * Log start of a pipeline step
 * @param {string|number} stepNumber - Step number (e.g., 1, '1.5', 21)
 * @param {string} skillName - Name of the skill
 */
export async function logStepStart(stepNumber, skillName) {
  if (!currentLog) return;

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

  currentLog.steps.push(step);
  await saveLog();
}

/**
 * Log completion of a pipeline step
 * @param {string|number} stepNumber - Step number
 * @param {string} status - Completion status (DONE, DONE_WITH_CONCERNS, BLOCKED)
 * @param {Object} details - Additional details
 */
export async function logStepComplete(stepNumber, status, details = {}) {
  if (!currentLog) return;

  const step = currentLog.steps.find(s => s.step === stepNumber);
  if (step) {
    step.completed_at = new Date().toISOString();
    step.duration_ms = new Date(step.completed_at) - new Date(step.started_at);
    step.status = status;
    step.handoff_written = details.handoff_written || false;
    step.items_scored = details.items_scored || [];
    step.fallbacks_used = details.fallbacks_used || [];
  }

  await saveLog();
}

/**
 * Log a tool call (MCP tool, WebFetch, etc.)
 * @param {Object} call - Tool call details
 */
export async function logToolCall(call) {
  if (!currentLog) return;

  const toolCall = {
    timestamp: new Date().toISOString(),
    step: call.step,
    skill: call.skill,
    tool: call.tool,
    engine: call.engine || null,
    model: call.model || null,
    input_summary: call.input_summary || null,
    duration_ms: call.duration_ms || null,
    success: call.success !== false,
    error: call.error || null,
    response_size: call.response_size || null,
    tokens_estimated: call.tokens_estimated || null
  };

  currentLog.tool_calls.push(toolCall);
  currentLog.metrics.total_api_calls++;

  if (call.engine) {
    currentLog.metrics.by_engine[call.engine] = (currentLog.metrics.by_engine[call.engine] || 0) + 1;
  }

  if (call.tokens_estimated) {
    currentLog.metrics.total_tokens_estimated += call.tokens_estimated;
  }

  if (call.tool === 'WebFetch') {
    currentLog.metrics.total_webfetch_calls++;
  }

  // Update step tool count
  const step = currentLog.steps.find(s => s.step === call.step);
  if (step) {
    step.tool_calls++;
    if (call.engine) step.api_calls++;
    if (call.error) step.errors++;
  }

  await saveLog();
}

/**
 * Log a file operation
 * @param {Object} op - File operation details
 */
export async function logFileOperation(op) {
  if (!currentLog) return;

  const fileOp = {
    timestamp: new Date().toISOString(),
    step: op.step,
    operation: op.operation, // 'read', 'write', 'create_dir'
    path: op.path,
    size_bytes: op.size_bytes || null,
    success: op.success !== false,
    error: op.error || null
  };

  currentLog.file_operations.push(fileOp);

  if (op.operation === 'write') {
    currentLog.metrics.total_file_writes++;
  } else if (op.operation === 'read') {
    currentLog.metrics.total_file_reads++;
  }

  await saveLog();
}

/**
 * Log an error
 * @param {Object} error - Error details
 */
export async function logError(error) {
  if (!currentLog) return;

  currentLog.errors.push({
    timestamp: new Date().toISOString(),
    step: error.step,
    skill: error.skill,
    type: error.type || 'ERROR',
    message: error.message,
    stack: error.stack || null,
    recoverable: error.recoverable !== false
  });

  await saveLog();
}

/**
 * Log a warning
 * @param {Object} warning - Warning details
 */
export async function logWarning(warning) {
  if (!currentLog) return;

  currentLog.warnings.push({
    timestamp: new Date().toISOString(),
    step: warning.step,
    skill: warning.skill,
    message: warning.message,
    context: warning.context || null
  });

  await saveLog();
}

/**
 * Log Anthropic rate limiting
 * @param {string} step - Step where limiting occurred
 * @param {string} query - Query that was skipped
 */
export async function logAnthropicLimited(step, query) {
  if (!currentLog) return;

  currentLog.warnings.push({
    timestamp: new Date().toISOString(),
    step,
    skill: 'LIMIT_ANTHROPIC',
    message: `Anthropic skipped due to LIMIT_ANTHROPIC=true (already ran in step ${step})`,
    context: { query_preview: query?.slice(0, 50) }
  });

  await saveLog();
}

/**
 * Finalize operations log
 * @param {string} overallStatus - Overall analysis status
 */
export async function finalizeOperationsLog(overallStatus) {
  if (!currentLog) return;

  currentLog.analysis_metadata.completed_at = new Date().toISOString();
  currentLog.analysis_metadata.duration_seconds = Math.round(
    (new Date(currentLog.analysis_metadata.completed_at) - new Date(currentLog.analysis_metadata.started_at)) / 1000
  );
  currentLog.analysis_metadata.overall_status = overallStatus;

  // Calculate step summaries
  currentLog.summary = {
    total_steps: currentLog.steps.length,
    completed_steps: currentLog.steps.filter(s => s.status === 'DONE').length,
    steps_with_concerns: currentLog.steps.filter(s => s.status === 'DONE_WITH_CONCERNS').length,
    blocked_steps: currentLog.steps.filter(s => s.status === 'BLOCKED').length,
    total_errors: currentLog.errors.length,
    total_warnings: currentLog.warnings.length,
    total_tool_calls: currentLog.tool_calls.length,
    total_file_operations: currentLog.file_operations.length
  };

  await saveLog();

  // Also generate markdown summary
  await generateMarkdownLog();

  return currentLog;
}

/**
 * Save current log to file
 */
async function saveLog() {
  if (!currentLog || !analysisPath) return;

  try {
    const logPath = path.join(analysisPath, 'operations-log.json');
    await fs.writeFile(logPath, JSON.stringify(currentLog, null, 2));
  } catch (e) {
    console.error('[operations-logger] Failed to save log:', e.message);
  }
}

/**
 * Generate markdown summary of operations log
 */
async function generateMarkdownLog() {
  if (!currentLog || !analysisPath) return;

  const lines = [];
  const meta = currentLog.analysis_metadata;

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
  lines.push(`| Total Steps | ${currentLog.summary.total_steps} |`);
  lines.push(`| Completed | ${currentLog.summary.completed_steps} |`);
  lines.push(`| With Concerns | ${currentLog.summary.steps_with_concerns} |`);
  lines.push(`| Blocked | ${currentLog.summary.blocked_steps} |`);
  lines.push(`| Total API Calls | ${currentLog.metrics.total_api_calls} |`);
  lines.push(`| Total Errors | ${currentLog.summary.total_errors} |`);
  lines.push('');

  // API Calls by Engine
  lines.push('## API Calls by Engine');
  lines.push('');
  lines.push('| Engine | Calls |');
  lines.push('|--------|-------|');
  for (const [engine, count] of Object.entries(currentLog.metrics.by_engine)) {
    lines.push(`| ${engine} | ${count} |`);
  }
  lines.push('');

  // Step Timeline
  lines.push('## Step Timeline');
  lines.push('');
  lines.push('| Step | Skill | Duration | Status | API Calls | Errors |');
  lines.push('|------|-------|----------|--------|-----------|--------|');
  for (const step of currentLog.steps) {
    const duration = step.duration_ms ? `${Math.round(step.duration_ms / 1000)}s` : '-';
    lines.push(`| ${step.step} | ${step.skill} | ${duration} | ${step.status} | ${step.api_calls} | ${step.errors} |`);
  }
  lines.push('');

  // Errors
  if (currentLog.errors.length > 0) {
    lines.push('## Errors');
    lines.push('');
    for (const error of currentLog.errors) {
      lines.push(`### Step ${error.step} - ${error.skill}`);
      lines.push(`- **Type**: ${error.type}`);
      lines.push(`- **Message**: ${error.message}`);
      lines.push(`- **Recoverable**: ${error.recoverable ? 'Yes' : 'No'}`);
      lines.push('');
    }
  }

  // Warnings (limited to avoid huge logs)
  if (currentLog.warnings.length > 0) {
    lines.push('## Warnings');
    lines.push('');
    const limitedWarnings = currentLog.warnings.slice(0, 20);
    for (const warning of limitedWarnings) {
      lines.push(`- **Step ${warning.step}** (${warning.skill}): ${warning.message}`);
    }
    if (currentLog.warnings.length > 20) {
      lines.push(`- ... and ${currentLog.warnings.length - 20} more warnings`);
    }
    lines.push('');
  }

  // Environment
  lines.push('## Environment');
  lines.push('');
  lines.push(`- Node: ${currentLog.environment.node_version}`);
  lines.push(`- Platform: ${currentLog.environment.platform}`);
  lines.push(`- LIMIT_ANTHROPIC: ${currentLog.environment.limit_anthropic}`);
  lines.push('');

  // API Availability
  lines.push('## API Availability');
  lines.push('');
  for (const [api, available] of Object.entries(currentLog.api_availability)) {
    lines.push(`- ${api}: ${available ? 'Available' : 'Not configured'}`);
  }
  lines.push('');

  const logPath = path.join(analysisPath, 'operations-log.md');
  await fs.writeFile(logPath, lines.join('\n'));
}

/**
 * Get current log (for reading during analysis)
 */
export function getCurrentLog() {
  return currentLog;
}

export default {
  initOperationsLog,
  logApiAvailability,
  logStepStart,
  logStepComplete,
  logToolCall,
  logFileOperation,
  logError,
  logWarning,
  logAnthropicLimited,
  finalizeOperationsLog,
  getCurrentLog
};
