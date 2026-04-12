/**
 * Status Report Generator
 * Generates execution-status.json and execution-status.md for company-analysis pipeline
 * Tracks pass/fail/skip/fallback for all 120 framework items (40 CITE + 80 CORE-EEAT)
 */

import fs from 'fs/promises';
import path from 'path';
import { loadOrCreateProvenance, CITE_ITEMS, CORE_EEAT_ITEMS } from './provenance-builder.js';

/**
 * Expected handoff files per phase
 */
const EXPECTED_HANDOFFS = {
  '01-domain-baseline': [
    'entity-optimizer-handoff.md',
    'domain-authority-handoff.md',
    'citation-baseline-handoff.md'
  ],
  '02-research': [
    'keyword-research-handoff.md',
    'competitor-analysis-handoff.md',
    'serp-analysis-handoff.md',
    'content-gap-analysis-handoff.md'
  ],
  '03-technical': [
    'technical-seo-handoff.md',
    'on-page-seo-handoff.md',
    'internal-linking-handoff.md',
    'backlink-handoff.md'
  ],
  '04-content': [
    'content-quality-handoff.md',
    'content-refresher-handoff.md'
  ],
  '05-recommendations': [
    'seo-content-handoff.md',
    'geo-content-handoff.md',
    'meta-tags-handoff.md',
    'schema-markup-handoff.md'
  ],
  '06-monitoring': [
    'rank-tracker-handoff.md',
    'performance-reporter-handoff.md',
    'alert-manager-handoff.md'
  ],
  '07-memory': [
    'memory-snapshot.md'
  ]
};

/**
 * Map skills to the CITE items they score
 */
const SKILL_TO_CITE_ITEMS = {
  'citation-baseline': ['C05', 'C06', 'C07', 'C08'],
  'backlink-analyzer': ['C01', 'C02', 'C03', 'C04', 'C09', 'C10', 'T01', 'T02', 'T03', 'T04', 'T05'],
  'technical-seo-checker': ['T06', 'T07', 'T08', 'T10', 'E04', 'I03', 'I04'],
  'entity-optimizer': ['I01', 'I02', 'I05', 'I06', 'I07', 'I08', 'I09', 'I10'],
  'domain-authority-auditor': ['E01', 'E02', 'E03', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10'],
  'rank-tracker': ['T09']
};

/**
 * Map skills to the CORE-EEAT items they score
 */
const SKILL_TO_CORE_EEAT_ITEMS = {
  'content-quality-auditor': 'ALL', // Scores all 80 items
  'entity-optimizer': ['A07', 'A08'],
  'technical-seo-checker': ['O05', 'T03']
};

/**
 * Check which handoff files exist
 * @param {string} analysisPath - Path to analysis directory
 * @returns {Object} Handoff status per phase
 */
async function checkHandoffs(analysisPath) {
  const status = {};

  for (const [phase, files] of Object.entries(EXPECTED_HANDOFFS)) {
    const phasePath = path.join(analysisPath, phase);
    const phaseStatus = { expected: files.length, found: 0, missing: [], present: [] };

    for (const file of files) {
      try {
        await fs.access(path.join(phasePath, file));
        phaseStatus.found++;
        phaseStatus.present.push(file);
      } catch {
        phaseStatus.missing.push(file);
      }
    }

    status[phase] = phaseStatus;
  }

  return status;
}

/**
 * Generate execution status from provenance and handoff files
 * @param {string} analysisPath - Path to analysis directory
 * @returns {Object} Execution status object
 */
export async function generateExecutionStatus(analysisPath) {
  const provenance = await loadOrCreateProvenance(analysisPath, 'unknown', new Date().toISOString());
  const handoffStatus = await checkHandoffs(analysisPath);

  // Check prompt-results.json for prompt count
  let promptCount = 0;
  try {
    const promptResults = JSON.parse(await fs.readFile(path.join(analysisPath, 'prompt-results.json'), 'utf-8'));
    promptCount = promptResults.prompt_results?.length || 0;
  } catch {
    // No prompt results yet
  }

  // Build skill execution status
  const skillExecution = [];
  const skillSteps = [
    { step: 1, skill: 'entity-optimizer', phase: '01-domain-baseline', handoff: 'entity-optimizer-handoff.md' },
    { step: '1.5', skill: 'citation-baseline', phase: '01-domain-baseline', handoff: 'citation-baseline-handoff.md' },
    { step: 2, skill: 'keyword-research', phase: '02-research', handoff: 'keyword-research-handoff.md' },
    { step: 3, skill: 'competitor-analysis', phase: '02-research', handoff: 'competitor-analysis-handoff.md' },
    { step: 4, skill: 'serp-analysis', phase: '02-research', handoff: 'serp-analysis-handoff.md' },
    { step: 5, skill: 'content-gap-analysis', phase: '02-research', handoff: 'content-gap-analysis-handoff.md' },
    { step: 6, skill: 'technical-seo-checker', phase: '03-technical', handoff: 'technical-seo-handoff.md' },
    { step: 7, skill: 'on-page-seo-auditor', phase: '03-technical', handoff: 'on-page-seo-handoff.md' },
    { step: 8, skill: 'internal-linking-optimizer', phase: '03-technical', handoff: 'internal-linking-handoff.md' },
    { step: 9, skill: 'backlink-analyzer', phase: '03-technical', handoff: 'backlink-handoff.md' },
    { step: 10, skill: 'domain-authority-auditor', phase: '01-domain-baseline', handoff: 'domain-authority-handoff.md' },
    { step: 11, skill: 'content-quality-auditor', phase: '04-content', handoff: 'content-quality-handoff.md' },
    { step: 12, skill: 'content-refresher', phase: '04-content', handoff: 'content-refresher-handoff.md' },
    { step: 13, skill: 'seo-content-writer', phase: '05-recommendations', handoff: 'seo-content-handoff.md' },
    { step: 14, skill: 'geo-content-optimizer', phase: '05-recommendations', handoff: 'geo-content-handoff.md' },
    { step: 15, skill: 'meta-tags-optimizer', phase: '05-recommendations', handoff: 'meta-tags-handoff.md' },
    { step: 16, skill: 'schema-markup-generator', phase: '05-recommendations', handoff: 'schema-markup-handoff.md' },
    { step: 17, skill: 'rank-tracker', phase: '06-monitoring', handoff: 'rank-tracker-handoff.md' },
    { step: 18, skill: 'performance-reporter', phase: '06-monitoring', handoff: 'performance-reporter-handoff.md' },
    { step: 19, skill: 'alert-manager', phase: '06-monitoring', handoff: 'alert-manager-handoff.md' },
    { step: 20, skill: 'memory-management', phase: '07-memory', handoff: 'memory-snapshot.md' }
  ];

  for (const { step, skill, phase, handoff } of skillSteps) {
    const phaseStatus = handoffStatus[phase];
    const hasHandoff = phaseStatus?.present.includes(handoff);

    // Check if items scored by this skill have data
    const citeItems = SKILL_TO_CITE_ITEMS[skill] || [];
    const coreItems = SKILL_TO_CORE_EEAT_ITEMS[skill];
    let itemsScored = [];

    // Check CITE items
    for (const itemId of citeItems) {
      const dim = itemId.charAt(0);
      const item = provenance.cite_provenance?.dimensions?.[dim]?.items?.find(i => i.id === itemId);
      if (item?.score !== null) {
        itemsScored.push(itemId);
      }
    }

    // Check CORE-EEAT items
    if (coreItems === 'ALL') {
      for (const [dim, items] of Object.entries(provenance.core_eeat_provenance?.dimensions || {})) {
        for (const item of items.items || []) {
          if (item.score !== null) itemsScored.push(item.id);
        }
      }
    } else if (Array.isArray(coreItems)) {
      for (const itemId of coreItems) {
        let dim;
        if (itemId.startsWith('Exp')) dim = 'Exp';
        else if (itemId.startsWith('Ept')) dim = 'Ept';
        else dim = itemId.charAt(0);
        const item = provenance.core_eeat_provenance?.dimensions?.[dim]?.items?.find(i => i.id === itemId);
        if (item?.score !== null) {
          itemsScored.push(itemId);
        }
      }
    }

    const status = hasHandoff ? (itemsScored.length > 0 ? 'DONE' : 'DONE_NO_SCORES') :
                   (itemsScored.length > 0 ? 'PARTIAL' : 'PENDING');

    skillExecution.push({
      step,
      skill,
      status,
      handoff_exists: hasHandoff,
      items_scored: itemsScored
    });
  }

  // Build item status summary
  const itemStatus = { CITE: {}, CORE_EEAT: {} };

  // CITE items
  for (const [dim, items] of Object.entries(CITE_ITEMS)) {
    for (const itemDef of items) {
      const item = provenance.cite_provenance?.dimensions?.[dim]?.items?.find(i => i.id === itemDef.id);
      itemStatus.CITE[itemDef.id] = {
        name: itemDef.name,
        status: item?.status || 'PENDING',
        score: item?.score,
        source: item?.data_source || null,
        confidence: item?.confidence || null,
        is_veto: itemDef.isVeto || false
      };
    }
  }

  // CORE-EEAT items
  for (const [dim, items] of Object.entries(CORE_EEAT_ITEMS)) {
    for (const itemDef of items) {
      const item = provenance.core_eeat_provenance?.dimensions?.[dim]?.items?.find(i => i.id === itemDef.id);
      itemStatus.CORE_EEAT[itemDef.id] = {
        name: itemDef.name,
        status: item?.status || 'PENDING',
        score: item?.score,
        source: item?.data_source || null,
        confidence: item?.confidence || null,
        is_veto: itemDef.isVeto || false,
        priority: itemDef.priority || null
      };
    }
  }

  // Calculate summary counts
  const citeCount = { pass: 0, partial: 0, fail: 0, skip: 0, pending: 0, total: 40 };
  const coreCount = { pass: 0, partial: 0, fail: 0, skip: 0, pending: 0, total: 80 };

  for (const item of Object.values(itemStatus.CITE)) {
    const s = (item.status || 'PENDING').toLowerCase();
    if (s === 'pass') citeCount.pass++;
    else if (s === 'partial') citeCount.partial++;
    else if (s === 'fail') citeCount.fail++;
    else if (s === 'skip') citeCount.skip++;
    else citeCount.pending++;
  }

  for (const item of Object.values(itemStatus.CORE_EEAT)) {
    const s = (item.status || 'PENDING').toLowerCase();
    if (s === 'pass') coreCount.pass++;
    else if (s === 'partial') coreCount.partial++;
    else if (s === 'fail') coreCount.fail++;
    else if (s === 'skip') coreCount.skip++;
    else coreCount.pending++;
  }

  // Identify critical gaps and veto status
  const criticalGaps = [];
  const vetosTriggered = [];

  for (const [id, item] of Object.entries(itemStatus.CITE)) {
    if (item.is_veto && item.status === 'FAIL') {
      vetosTriggered.push({ id, name: item.name, framework: 'CITE' });
    }
    if (item.status === 'PENDING' || item.status === 'FAIL') {
      if (['I01', 'C05', 'T07', 'E04'].includes(id)) {
        criticalGaps.push({ id, name: item.name, reason: item.status === 'PENDING' ? 'not scored' : 'failed' });
      }
    }
  }

  for (const [id, item] of Object.entries(itemStatus.CORE_EEAT)) {
    if (item.is_veto && item.status === 'FAIL') {
      vetosTriggered.push({ id, name: item.name, framework: 'CORE-EEAT' });
    }
  }

  const executionStatus = {
    analysis_metadata: {
      domain: provenance.analysis_metadata?.domain || 'unknown',
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    },
    handoff_status: handoffStatus,
    skill_execution: skillExecution,
    item_status: itemStatus,
    summary: {
      cite: citeCount,
      core_eeat: coreCount,
      vetoes_triggered: vetosTriggered,
      critical_gaps: criticalGaps,
      total_prompts_saved: promptCount
    },
    scores: {
      cite_overall: provenance.cite_provenance?.overall?.score || null,
      cite_verdict: provenance.cite_provenance?.overall?.verdict || null,
      geo_score: provenance.core_eeat_provenance?.geo_score || null,
      seo_score: provenance.core_eeat_provenance?.seo_score || null
    }
  };

  return executionStatus;
}

/**
 * Generate Markdown execution status report
 * @param {Object} status - Execution status object
 * @returns {string} Markdown content
 */
export function generateMarkdownReport(status) {
  const lines = [];
  const domain = status.analysis_metadata.domain;

  lines.push(`# Execution Status Report - ${domain}`);
  lines.push(`Generated: ${status.analysis_metadata.timestamp}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push('| Framework | Pass | Partial | Fail | Skip | Pending | Total |');
  lines.push('|-----------|------|---------|------|------|---------|-------|');
  const c = status.summary.cite;
  const e = status.summary.core_eeat;
  lines.push(`| CITE | ${c.pass} | ${c.partial} | ${c.fail} | ${c.skip} | ${c.pending} | ${c.total} |`);
  lines.push(`| CORE-EEAT | ${e.pass} | ${e.partial} | ${e.fail} | ${e.skip} | ${e.pending} | ${e.total} |`);
  lines.push('');

  // Scores
  lines.push('## Scores');
  lines.push('');
  lines.push(`- **CITE Overall**: ${status.scores.cite_overall ?? 'N/A'} (${status.scores.cite_verdict || 'N/A'})`);
  lines.push(`- **GEO Score**: ${status.scores.geo_score ?? 'N/A'}`);
  lines.push(`- **SEO Score**: ${status.scores.seo_score ?? 'N/A'}`);
  lines.push(`- **Total Prompts Saved**: ${status.summary.total_prompts_saved}`);
  lines.push('');

  // Veto Items
  lines.push('## Veto Items');
  lines.push('');
  if (status.summary.vetoes_triggered.length > 0) {
    for (const v of status.summary.vetoes_triggered) {
      lines.push(`- **TRIGGERED**: ${v.id} (${v.name}) - ${v.framework}`);
    }
  } else {
    lines.push('No veto items triggered.');
  }
  lines.push('');

  // Critical Gaps
  if (status.summary.critical_gaps.length > 0) {
    lines.push('## Critical Gaps');
    lines.push('');
    for (const g of status.summary.critical_gaps) {
      lines.push(`- ${g.id} (${g.name}) - ${g.reason}`);
    }
    lines.push('');
  }

  // Handoff Status
  lines.push('## Handoff Files');
  lines.push('');
  for (const [phase, s] of Object.entries(status.handoff_status)) {
    const pct = s.expected > 0 ? Math.round(s.found / s.expected * 100) : 0;
    lines.push(`### ${phase} (${s.found}/${s.expected} - ${pct}%)`);
    if (s.missing.length > 0) {
      lines.push(`Missing: ${s.missing.join(', ')}`);
    }
    lines.push('');
  }

  // CITE Items Table
  lines.push('## CITE Items (40)');
  lines.push('');
  lines.push('| ID | Name | Status | Score | Source | Confidence |');
  lines.push('|----|------|--------|-------|--------|------------|');
  for (const [id, item] of Object.entries(status.item_status.CITE)) {
    const veto = item.is_veto ? ' *' : '';
    lines.push(`| ${id}${veto} | ${item.name} | ${item.status} | ${item.score ?? '-'} | ${item.source || '-'} | ${item.confidence || '-'} |`);
  }
  lines.push('');
  lines.push('\\* Veto item');
  lines.push('');

  // CORE-EEAT Items Table
  lines.push('## CORE-EEAT Items (80)');
  lines.push('');
  lines.push('| ID | Name | Status | Score | Source | Priority |');
  lines.push('|----|------|--------|-------|--------|----------|');
  for (const [id, item] of Object.entries(status.item_status.CORE_EEAT)) {
    const veto = item.is_veto ? ' *' : '';
    lines.push(`| ${id}${veto} | ${item.name} | ${item.status} | ${item.score ?? '-'} | ${item.source || '-'} | ${item.priority || '-'} |`);
  }
  lines.push('');
  lines.push('\\* Veto item');
  lines.push('');

  return lines.join('\n');
}

/**
 * Save execution status to both JSON and Markdown files
 * @param {string} analysisPath - Path to analysis directory
 */
export async function saveExecutionStatus(analysisPath) {
  const status = await generateExecutionStatus(analysisPath);

  // Save JSON
  await fs.writeFile(
    path.join(analysisPath, 'execution-status.json'),
    JSON.stringify(status, null, 2)
  );

  // Save Markdown
  const markdown = generateMarkdownReport(status);
  await fs.writeFile(
    path.join(analysisPath, 'execution-status.md'),
    markdown
  );

  return status;
}

export default {
  generateExecutionStatus,
  generateMarkdownReport,
  saveExecutionStatus,
  EXPECTED_HANDOFFS,
  SKILL_TO_CITE_ITEMS,
  SKILL_TO_CORE_EEAT_ITEMS
};
