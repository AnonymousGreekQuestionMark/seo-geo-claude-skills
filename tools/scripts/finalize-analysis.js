#!/usr/bin/env node
/**
 * finalize-analysis.js
 *
 * Post-analysis finalization script that:
 * 1. Reconstructs operations-log.json from handoff file metadata
 * 2. Generates PDF report with full appendix (120 items + prompts)
 * 3. Validates score-provenance.json completeness (40 CITE + 80 CORE-EEAT items)
 *
 * Usage:
 *   node tools/scripts/finalize-analysis.js \
 *     --analysis-dir "analyses/caplinq/caplinq.com/analysis-20260413T120000" \
 *     --html-report "analyses/caplinq/reports/caplinq_caplinq.com_20260413T120000.html" \
 *     --output-pdf "analyses/caplinq/reports/caplinq_caplinq.com_20260413T120000.pdf"
 */

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import PDF generator
let generatePdfFromHtml;
try {
  const pdfModule = await import('../shared/pdf-generator.js');
  generatePdfFromHtml = pdfModule.generatePdfFromHtml;
} catch (err) {
  console.error('Warning: PDF generator not available:', err.message);
}

// ============================================================================
// CLI ARGUMENT PARSING
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    analysisDir: null,
    htmlReport: null,
    outputPdf: null,
    skipPdf: false,
    skipValidation: false,
    verbose: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--analysis-dir') {
      parsed.analysisDir = args[++i];
    } else if (arg === '--html-report') {
      parsed.htmlReport = args[++i];
    } else if (arg === '--output-pdf') {
      parsed.outputPdf = args[++i];
    } else if (arg === '--skip-pdf') {
      parsed.skipPdf = true;
    } else if (arg === '--skip-validation') {
      parsed.skipValidation = true;
    } else if (arg === '--verbose' || arg === '-v') {
      parsed.verbose = true;
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`
finalize-analysis.js - Post-analysis finalization for SEO/GEO company analysis

USAGE:
  node tools/scripts/finalize-analysis.js [OPTIONS]

OPTIONS:
  --analysis-dir <path>    Path to analysis directory (e.g., analyses/caplinq/caplinq.com/analysis-20260413T120000)
  --html-report <path>     Path to HTML report file
  --output-pdf <path>      Path for PDF output
  --skip-pdf               Skip PDF generation
  --skip-validation        Skip provenance validation
  --verbose, -v            Verbose output
  --help, -h               Show this help

EXAMPLES:
  node tools/scripts/finalize-analysis.js \\
    --analysis-dir "analyses/caplinq/caplinq.com/analysis-20260413T120000" \\
    --html-report "analyses/caplinq/reports/caplinq_caplinq.com_20260413T120000.html" \\
    --output-pdf "analyses/caplinq/reports/caplinq_caplinq.com_20260413T120000.pdf"

  node tools/scripts/finalize-analysis.js --analysis-dir "analyses/caplinq/caplinq.com/analysis-20260413T120000" --skip-pdf

WHAT IT DOES:
  1. Reconstructs operations-log.json from handoff file metadata
  2. Generates PDF report with full appendix (40 CITE + 80 CORE-EEAT items)
  3. Validates score-provenance.json has all 120 items with raw_data and calculation fields

EXIT CODES:
  0  All tasks completed successfully
  1  Error or validation failure
`);
}

// ============================================================================
// OPERATIONS LOG RECONSTRUCTION
// ============================================================================

async function reconstructOperationsLog(analysisDir, verbose = false) {
  console.log('\n=== Reconstructing Operations Log ===');

  const opsLogPath = path.join(analysisDir, 'operations-log.json');

  // Read existing operations log or create structure
  let opsLog;
  try {
    opsLog = JSON.parse(await fs.readFile(opsLogPath, 'utf-8'));
  } catch {
    opsLog = {
      analysis_metadata: {},
      started_at: null,
      completed_at: null,
      overall_status: 'UNKNOWN',
      steps: [],
      tool_calls: [],
      errors: [],
      warnings: [],
      metrics: {
        total_api_calls: 0,
        total_webfetch_calls: 0,
        total_file_operations: 0,
        total_duration_ms: 0
      }
    };
  }

  // Find all handoff files
  const handoffPattern = path.join(analysisDir, '**/*-handoff.md');
  const handoffFiles = await glob(handoffPattern);

  if (verbose) {
    console.log(`Found ${handoffFiles.length} handoff files`);
  }

  // Parse each handoff file for metadata
  const steps = [];
  let earliestTimestamp = null;
  let latestTimestamp = null;

  for (const filePath of handoffFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const metadata = parseHandoffFrontmatter(content);

      if (metadata.skill && metadata.step) {
        const stepEntry = {
          step_number: parseFloat(metadata.step),
          skill_name: metadata.skill,
          phase: metadata.phase || derivePhaseFromPath(filePath),
          status: metadata.status || 'DONE',
          timestamp: metadata.timestamp || null,
          handoff_file: path.relative(analysisDir, filePath),
          duration_ms: null // Cannot derive without start time
        };

        steps.push(stepEntry);

        // Track timestamps
        if (metadata.timestamp) {
          if (!earliestTimestamp || metadata.timestamp < earliestTimestamp) {
            earliestTimestamp = metadata.timestamp;
          }
          if (!latestTimestamp || metadata.timestamp > latestTimestamp) {
            latestTimestamp = metadata.timestamp;
          }
        }
      }
    } catch (err) {
      if (verbose) {
        console.log(`  Warning: Could not parse ${path.basename(filePath)}: ${err.message}`);
      }
    }
  }

  // Sort steps by step number
  steps.sort((a, b) => a.step_number - b.step_number);

  // Update operations log
  opsLog.steps = steps;
  opsLog.started_at = earliestTimestamp || opsLog.started_at;
  opsLog.completed_at = latestTimestamp || opsLog.completed_at;

  // Determine overall status
  const statuses = steps.map(s => s.status);
  if (statuses.includes('BLOCKED') && statuses.filter(s => s === 'BLOCKED').length > 10) {
    opsLog.overall_status = 'BLOCKED';
  } else if (statuses.includes('BLOCKED') || statuses.includes('DONE_WITH_CONCERNS')) {
    opsLog.overall_status = 'DONE_WITH_CONCERNS';
  } else {
    opsLog.overall_status = 'DONE';
  }

  // Update metrics
  opsLog.metrics.total_steps = steps.length;
  opsLog.metrics.steps_done = statuses.filter(s => s === 'DONE').length;
  opsLog.metrics.steps_with_concerns = statuses.filter(s => s === 'DONE_WITH_CONCERNS').length;
  opsLog.metrics.steps_blocked = statuses.filter(s => s === 'BLOCKED').length;

  // Write updated operations log
  await fs.writeFile(opsLogPath, JSON.stringify(opsLog, null, 2));
  console.log(`  Reconstructed ${steps.length} steps`);
  console.log(`  Overall status: ${opsLog.overall_status}`);
  console.log(`  Saved to: ${opsLogPath}`);

  return opsLog;
}

function parseHandoffFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const frontmatter = frontmatterMatch[1];
  const result = {};

  for (const line of frontmatter.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      result[key] = value;
    }
  }

  return result;
}

function derivePhaseFromPath(filePath) {
  const match = filePath.match(/(\d{2})-[a-z-]+\//);
  return match ? match[1] : null;
}

// ============================================================================
// SCORE PROVENANCE VALIDATION
// ============================================================================

const CITE_ITEMS = [
  'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10',
  'I01', 'I02', 'I03', 'I04', 'I05', 'I06', 'I07', 'I08', 'I09', 'I10',
  'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10',
  'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10'
];

const CORE_EEAT_ITEMS = [
  'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10',
  'O01', 'O02', 'O03', 'O04', 'O05', 'O06', 'O07', 'O08', 'O09', 'O10',
  'R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08', 'R09', 'R10',
  'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10',
  'Exp01', 'Exp02', 'Exp03', 'Exp04', 'Exp05', 'Exp06', 'Exp07', 'Exp08', 'Exp09', 'Exp10',
  'Ept01', 'Ept02', 'Ept03', 'Ept04', 'Ept05', 'Ept06', 'Ept07', 'Ept08', 'Ept09', 'Ept10',
  'A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10',
  'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10'
];

async function validateScoreProvenance(analysisDir, verbose = false) {
  console.log('\n=== Validating Score Provenance ===');

  const provenancePath = path.join(analysisDir, 'score-provenance.json');

  let provenance;
  try {
    provenance = JSON.parse(await fs.readFile(provenancePath, 'utf-8'));
  } catch (err) {
    console.error(`  ERROR: Cannot read score-provenance.json: ${err.message}`);
    return { valid: false, errors: ['Cannot read score-provenance.json'] };
  }

  const errors = [];
  const warnings = [];

  // Validate CITE items (40 expected)
  const citeItems = extractCiteItems(provenance);
  const missingCite = CITE_ITEMS.filter(id => !citeItems.has(id));
  const citeWithoutProvenance = [];

  for (const [id, item] of citeItems) {
    if (!item.raw_data || item.raw_data === '') {
      citeWithoutProvenance.push(id);
    }
    if (!item.calculation || item.calculation === '') {
      citeWithoutProvenance.push(id);
    }
  }

  if (missingCite.length > 0) {
    errors.push(`Missing ${missingCite.length} CITE items: ${missingCite.join(', ')}`);
  }
  if (citeWithoutProvenance.length > 0) {
    warnings.push(`${citeWithoutProvenance.length} CITE items missing raw_data/calculation`);
  }

  // Validate CORE-EEAT items (80 expected)
  const coreItems = extractCoreEeatItems(provenance);
  const missingCore = CORE_EEAT_ITEMS.filter(id => !coreItems.has(id));
  const coreWithoutProvenance = [];

  for (const [id, item] of coreItems) {
    if (!item.raw_data || item.raw_data === '') {
      coreWithoutProvenance.push(id);
    }
    if (!item.calculation || item.calculation === '') {
      coreWithoutProvenance.push(id);
    }
  }

  if (missingCore.length > 0) {
    errors.push(`Missing ${missingCore.length} CORE-EEAT items: ${missingCore.slice(0, 10).join(', ')}${missingCore.length > 10 ? '...' : ''}`);
  }
  if (coreWithoutProvenance.length > 0) {
    warnings.push(`${coreWithoutProvenance.length} CORE-EEAT items missing raw_data/calculation`);
  }

  // Report
  console.log(`  CITE items: ${citeItems.size}/40`);
  console.log(`  CORE-EEAT items: ${coreItems.size}/80`);

  if (errors.length > 0) {
    console.log(`  ERRORS: ${errors.length}`);
    for (const err of errors) {
      console.log(`    - ${err}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`  WARNINGS: ${warnings.length}`);
    for (const warn of warnings) {
      console.log(`    - ${warn}`);
    }
  }

  const valid = errors.length === 0;
  console.log(`  Validation: ${valid ? 'PASSED' : 'FAILED'}`);

  return { valid, errors, warnings, citeCount: citeItems.size, coreCount: coreItems.size };
}

function extractCiteItems(provenance) {
  const items = new Map();

  if (provenance.cite_provenance?.dimensions) {
    for (const [dim, data] of Object.entries(provenance.cite_provenance.dimensions)) {
      if (Array.isArray(data.items)) {
        for (const item of data.items) {
          if (item.id) {
            items.set(item.id, item);
          }
        }
      }
    }
  }

  return items;
}

function extractCoreEeatItems(provenance) {
  const items = new Map();

  if (provenance.core_eeat_provenance?.dimensions) {
    for (const [dim, data] of Object.entries(provenance.core_eeat_provenance.dimensions)) {
      if (Array.isArray(data.items)) {
        for (const item of data.items) {
          if (item.id) {
            items.set(item.id, item);
          }
        }
      }
    }
  }

  return items;
}

// ============================================================================
// PDF GENERATION
// ============================================================================

async function generatePdf(analysisDir, htmlReportPath, pdfOutputPath, verbose = false) {
  console.log('\n=== Generating PDF Report ===');

  if (!generatePdfFromHtml) {
    console.error('  ERROR: PDF generator not available');
    return { success: false, error: 'PDF generator not available' };
  }

  // Check HTML exists
  try {
    await fs.access(htmlReportPath);
  } catch {
    console.error(`  ERROR: HTML report not found: ${htmlReportPath}`);
    return { success: false, error: 'HTML report not found' };
  }
  console.log(`  HTML source: ${htmlReportPath}`);

  // Load prompt results
  const promptResultsPath = path.join(analysisDir, 'prompt-results.json');
  let promptResults = null;
  try {
    promptResults = JSON.parse(await fs.readFile(promptResultsPath, 'utf-8'));
    console.log(`  prompt-results.json: ${promptResults.prompt_results?.length || 0} entries`);
  } catch {
    console.log('  prompt-results.json: not found (will generate without prompts appendix)');
  }

  // Load score provenance
  const scoreProvenancePath = path.join(analysisDir, 'score-provenance.json');
  let scoreProvenance = null;
  try {
    scoreProvenance = JSON.parse(await fs.readFile(scoreProvenancePath, 'utf-8'));
    console.log(`  score-provenance.json: loaded`);
  } catch {
    console.log('  score-provenance.json: not found');
  }

  // Load execution status
  const executionStatusPath = path.join(analysisDir, 'execution-status.json');
  let executionStatus = null;
  try {
    executionStatus = JSON.parse(await fs.readFile(executionStatusPath, 'utf-8'));
    console.log(`  execution-status.json: loaded`);
  } catch {
    console.log('  execution-status.json: not found');
  }

  // Generate PDF
  console.log('\n  Rendering PDF...');
  try {
    const result = await generatePdfFromHtml(htmlReportPath, pdfOutputPath, {
      analysisDir,
      promptResults,
      scoreProvenance,
      executionStatus
    });

    if (result.success) {
      const stats = await fs.stat(pdfOutputPath);
      console.log(`  PDF generated successfully`);
      console.log(`  Path: ${result.path}`);
      console.log(`  Size: ${(stats.size / 1024).toFixed(1)} KB`);
      return { success: true, path: result.path, size: stats.size };
    } else {
      console.error(`  ERROR: ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (!args.analysisDir) {
    console.error('ERROR: --analysis-dir is required');
    printHelp();
    process.exit(1);
  }

  console.log('=== Analysis Finalization ===');
  console.log(`Analysis dir: ${args.analysisDir}`);

  let hasErrors = false;

  // 1. Reconstruct operations log
  try {
    await reconstructOperationsLog(args.analysisDir, args.verbose);
  } catch (err) {
    console.error(`\nERROR reconstructing operations log: ${err.message}`);
    hasErrors = true;
  }

  // 2. Validate score provenance
  if (!args.skipValidation) {
    try {
      const validation = await validateScoreProvenance(args.analysisDir, args.verbose);
      if (!validation.valid) {
        hasErrors = true;
      }
    } catch (err) {
      console.error(`\nERROR validating provenance: ${err.message}`);
      hasErrors = true;
    }
  }

  // 3. Generate PDF
  if (!args.skipPdf && args.htmlReport && args.outputPdf) {
    try {
      const pdfResult = await generatePdf(args.analysisDir, args.htmlReport, args.outputPdf, args.verbose);
      if (!pdfResult.success) {
        hasErrors = true;
      }
    } catch (err) {
      console.error(`\nERROR generating PDF: ${err.message}`);
      hasErrors = true;
    }
  } else if (!args.skipPdf && (!args.htmlReport || !args.outputPdf)) {
    console.log('\nSkipping PDF generation (--html-report and --output-pdf required)');
  }

  // Summary
  console.log('\n=== Finalization Complete ===');
  if (hasErrors) {
    console.log('Status: COMPLETED WITH ERRORS');
    process.exit(1);
  } else {
    console.log('Status: SUCCESS');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
