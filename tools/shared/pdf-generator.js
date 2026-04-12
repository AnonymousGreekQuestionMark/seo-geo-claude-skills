/**
 * PDF Generator Utility
 * Converts HTML reports to PDF format with appendix sections
 * Used by company-analysis orchestration (Step 21.7)
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate PDF from HTML report
 * @param {string} htmlPath - Path to the HTML report file
 * @param {string} pdfPath - Output path for the PDF file
 * @param {Object} options - Generation options
 * @param {string} options.analysisDir - Path to analysis directory (for appendix links)
 * @param {Object} options.promptResults - Content of prompt-results.json (optional)
 * @param {Object} options.scoreProvenance - Content of score-provenance.json (optional)
 * @returns {Promise<{success: boolean, path?: string, error?: string}>}
 */
export async function generatePdfFromHtml(htmlPath, pdfPath, options = {}) {
  let browser;

  try {
    // Read the HTML file
    const htmlContent = await fs.readFile(htmlPath, 'utf-8');

    // Build appendix HTML
    const appendixHtml = buildAppendix(options);

    // Inject appendix before closing </body>
    const modifiedHtml = htmlContent.replace(
      '</body>',
      `${appendixHtml}</body>`
    );

    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(modifiedHtml, { waitUntil: 'networkidle0' });

    // Generate PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 10px; color: #656d76; width: 100%; text-align: center; padding: 0 1cm;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    });

    await browser.close();

    return { success: true, path: pdfPath };
  } catch (error) {
    if (browser) await browser.close();
    return { success: false, error: error.message };
  }
}

/**
 * Build appendix HTML sections
 * @param {Object} options
 * @returns {string} HTML for appendix sections
 */
function buildAppendix(options) {
  const { analysisDir, promptResults, scoreProvenance, executionStatus } = options;

  let appendixHtml = `
    <div class="appendix" style="page-break-before: always;">
      <h1 style="color: #1f2328; border-bottom: 2px solid #d0d7de; padding-bottom: 12px; margin-top: 40px;">
        Appendix - Full Audit Trail
      </h1>
      <p style="color: #656d76; font-size: 13px; margin-bottom: 24px;">
        This PDF serves as the comprehensive deliverable with full traceability for all 120 framework items
        (40 CITE domain authority + 80 CORE-EEAT content quality). The HTML report provides an executive summary.
      </p>
  `;

  // Appendix A: Raw Data Links
  appendixHtml += `
    <section class="appendix-section" style="margin: 24px 0;">
      <h2 style="color: #1f2328;">A. Raw Data Links</h2>
      <p style="color: #656d76; font-size: 14px; margin-bottom: 16px;">
        The following files contain the detailed analysis data used to generate this report.
        All paths are relative to the analysis directory.
      </p>
      ${analysisDir ? buildDataLinksTable(analysisDir) : '<p><em>Analysis directory not provided.</em></p>'}
    </section>
  `;

  // Appendix B: Prompts & Responses
  appendixHtml += `
    <section class="appendix-section" style="margin: 24px 0; page-break-before: always;">
      <h2 style="color: #1f2328;">B. AI Prompts & Responses</h2>
      <p style="color: #656d76; font-size: 14px; margin-bottom: 16px;">
        Complete record of AI queries used during this analysis (${promptResults?.prompt_results?.length || 0} total calls),
        provided for verification and transparency. Per prompting-documentation.md, a full analysis generates 148-200 LLM calls.
      </p>
      ${promptResults ? buildPromptResultsSection(promptResults) : '<p><em>Prompt results not available.</em></p>'}
    </section>
  `;

  // Appendix C: Score Provenance (FULL 120 items)
  appendixHtml += `
    <section class="appendix-section" style="margin: 24px 0; page-break-before: always;">
      <h2 style="color: #1f2328;">C. Score Provenance (All 120 Items)</h2>
      <p style="color: #656d76; font-size: 14px; margin-bottom: 16px;">
        Full traceability for all 40 CITE domain authority items and 80 CORE-EEAT content quality items,
        showing raw data, thresholds, calculations, and source skills.
      </p>
      ${scoreProvenance ? buildProvenanceSection(scoreProvenance) : '<p><em>Score provenance not available.</em></p>'}
    </section>
  `;

  // Appendix D: AI Discoverability (llms.txt)
  appendixHtml += `
    <section class="appendix-section" style="margin: 24px 0; page-break-before: always;">
      <h2 style="color: #1f2328;">D. AI Discoverability (llms.txt)</h2>
      <p style="color: #656d76; font-size: 14px; margin-bottom: 16px;">
        Analysis of AI-specific discoverability files (llms.txt, llms-full.txt) and robots.txt
        AI crawler directives per the llms.txt specification.
      </p>
      ${scoreProvenance?.technical_data ? buildLlmsTxtSection(scoreProvenance.technical_data) : '<p><em>llms.txt audit not performed.</em></p>'}
    </section>
  `;

  // Appendix E: Execution Status
  if (executionStatus) {
    appendixHtml += `
      <section class="appendix-section" style="margin: 24px 0; page-break-before: always;">
        <h2 style="color: #1f2328;">E. Execution Status</h2>
        <p style="color: #656d76; font-size: 14px; margin-bottom: 16px;">
          Pipeline execution details showing skill completion status, handoff files produced,
          and items scored per skill.
        </p>
        ${buildExecutionStatusSection(executionStatus)}
      </section>
    `;
  }

  appendixHtml += '</div>';

  return appendixHtml;
}

/**
 * Build execution status section for Appendix E
 */
function buildExecutionStatusSection(status) {
  if (!status) return '<p><em>Execution status not available.</em></p>';

  let html = '';

  // Summary counts
  const c = status.summary?.cite || {};
  const e = status.summary?.core_eeat || {};
  html += `
    <div style="background: #f6f8fa; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
      <strong>CITE:</strong> ${c.pass || 0} pass, ${c.partial || 0} partial, ${c.fail || 0} fail, ${c.pending || 0} pending |
      <strong>CORE-EEAT:</strong> ${e.pass || 0} pass, ${e.partial || 0} partial, ${e.fail || 0} fail, ${e.pending || 0} pending |
      <strong>Prompts:</strong> ${status.summary?.total_prompts_saved || 0}
    </div>
  `;

  // Veto warnings
  if (status.summary?.vetoes_triggered?.length > 0) {
    html += `
      <div style="background: #fff5f5; border: 1px solid #f85149; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
        <strong style="color: #cf222e;">VETO TRIGGERED:</strong>
        ${status.summary.vetoes_triggered.map(v => `${v.id} (${v.name})`).join(', ')}
      </div>
    `;
  }

  // Critical gaps
  if (status.summary?.critical_gaps?.length > 0) {
    html += `
      <div style="background: #fff8c5; border: 1px solid #d4a72c; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
        <strong>Critical Gaps:</strong>
        ${status.summary.critical_gaps.map(g => `${g.id} (${g.name}) - ${g.reason}`).join('; ')}
      </div>
    `;
  }

  // Skill execution table
  if (status.skill_execution?.length > 0) {
    html += `
      <h4 style="color: #1f2328; margin-top: 16px;">Skill Execution</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f6f8fa;">
            <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Step</th>
            <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">Skill</th>
            <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Status</th>
            <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Handoff</th>
            <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">Items Scored</th>
          </tr>
        </thead>
        <tbody>
    `;

    status.skill_execution.forEach(skill => {
      const statusColor = skill.status === 'DONE' ? '#1a7f37' :
                         skill.status === 'PARTIAL' ? '#9a6700' :
                         skill.status === 'PENDING' ? '#656d76' : '#cf222e';
      html += `
        <tr>
          <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center;">${skill.step}</td>
          <td style="padding: 6px; border: 1px solid #d0d7de;">${skill.skill}</td>
          <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center; color: ${statusColor};">${skill.status}</td>
          <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center;">
            ${skill.handoff_exists ? '<span style="color: #1a7f37;">Yes</span>' : '<span style="color: #cf222e;">No</span>'}
          </td>
          <td style="padding: 6px; border: 1px solid #d0d7de; font-size: 10px; font-family: monospace;">
            ${skill.items_scored?.join(', ') || '-'}
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
  }

  return html;
}

/**
 * Build data links table for Appendix A
 */
function buildDataLinksTable(analysisDir) {
  const phases = [
    { folder: '01-domain-baseline', name: 'Domain Baseline' },
    { folder: '02-research', name: 'Research' },
    { folder: '03-technical', name: 'Technical' },
    { folder: '04-content', name: 'Content Quality' },
    { folder: '05-recommendations', name: 'Recommendations' },
    { folder: '06-monitoring', name: 'Monitoring' },
    { folder: '07-memory', name: 'Memory' }
  ];

  let tableHtml = `
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background: #f6f8fa; border-bottom: 1px solid #d0d7de;">
          <th style="text-align: left; padding: 10px;">Phase</th>
          <th style="text-align: left; padding: 10px;">Directory</th>
        </tr>
      </thead>
      <tbody>
  `;

  phases.forEach(phase => {
    tableHtml += `
      <tr style="border-bottom: 1px solid #d0d7de;">
        <td style="padding: 10px;">${phase.name}</td>
        <td style="padding: 10px; font-family: monospace; font-size: 12px;">${phase.folder}/</td>
      </tr>
    `;
  });

  tableHtml += `
      </tbody>
    </table>
    <p style="color: #656d76; font-size: 12px; margin-top: 12px;">
      <strong>Additional files:</strong> prompt-results.json, score-provenance.json
    </p>
  `;

  return tableHtml;
}

/**
 * Build prompt results section for Appendix B
 */
function buildPromptResultsSection(promptResults) {
  if (!promptResults.prompt_results || promptResults.prompt_results.length === 0) {
    return '<p><em>No AI prompts were recorded during this analysis.</em></p>';
  }

  const summary = promptResults.summary || {};
  let html = `
    <div style="background: #f6f8fa; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
      <strong>Summary:</strong> ${summary.total_llm_calls || promptResults.prompt_results.length} AI calls
      ${summary.by_engine ? ` across ${Object.keys(summary.by_engine).length} engines` : ''}
    </div>
  `;

  // Group by engine
  const byEngine = {};
  promptResults.prompt_results.forEach(result => {
    const engine = result.engine || 'unknown';
    if (!byEngine[engine]) byEngine[engine] = [];
    byEngine[engine].push(result);
  });

  Object.entries(byEngine).forEach(([engine, results]) => {
    html += `
      <div style="margin: 16px 0; border: 1px solid #d0d7de; border-radius: 6px;">
        <div style="background: #f6f8fa; padding: 12px; font-weight: 600; border-bottom: 1px solid #d0d7de;">
          ${engine.charAt(0).toUpperCase() + engine.slice(1)} (${results.length} calls)
        </div>
        <div style="padding: 12px;">
    `;

    results.slice(0, 5).forEach((result, i) => {
      html += `
        <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px dashed #d0d7de;">
          <div style="font-size: 11px; color: #656d76; margin-bottom: 4px;">QUERY ${i + 1}</div>
          <div style="background: #f0f2f5; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 12px; margin-bottom: 8px;">
            ${escapeHtml(result.query || result.prompt?.query || 'N/A')}
          </div>
          <div style="font-size: 11px; color: #656d76; margin-bottom: 4px;">RESPONSE (excerpt)</div>
          <div style="background: #f0f2f5; padding: 8px; border-radius: 4px; font-size: 12px; max-height: 150px; overflow: hidden;">
            ${escapeHtml((result.response_excerpt || result.response?.excerpt || result.response_full || result.response?.full_text || 'N/A').substring(0, 500))}...
          </div>
        </div>
      `;
    });

    if (results.length > 5) {
      html += `<p style="color: #656d76; font-size: 12px;">+ ${results.length - 5} more calls (see prompt-results.json for full data)</p>`;
    }

    html += '</div></div>';
  });

  return html;
}

/**
 * Build provenance section for Appendix C - COMPREHENSIVE version with all 120 items
 */
function buildProvenanceSection(scoreProvenance) {
  let html = '';

  // CITE Provenance - Full 40 items
  if (scoreProvenance.cite_provenance) {
    const cite = scoreProvenance.cite_provenance;
    html += `
      <h3 style="color: #1f2328; margin-top: 20px;">Domain Authority (CITE) - All 40 Items</h3>
      <div style="background: #f6f8fa; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
        <strong>Overall:</strong> ${cite.overall?.score ?? 'N/A'}/100
        (${cite.overall?.verdict || 'N/A'})
      </div>
    `;

    // Veto items warning
    const triggeredVetos = (cite.veto_items || []).filter(v => v.triggered);
    if (triggeredVetos.length > 0) {
      html += `
        <div style="background: #fff5f5; border: 1px solid #f85149; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
          <strong style="color: #cf222e;">VETO TRIGGERED:</strong>
          ${triggeredVetos.map(v => `${v.id} (${v.name})`).join(', ')}
        </div>
      `;
    }

    // Full CITE items table
    if (cite.dimensions) {
      html += `
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f6f8fa;">
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">ID</th>
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">Check Item</th>
              <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Status</th>
              <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Score</th>
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">Raw Data</th>
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">Source</th>
            </tr>
          </thead>
          <tbody>
      `;

      ['C', 'I', 'T', 'E'].forEach(dim => {
        const d = cite.dimensions[dim];
        if (d && d.items) {
          // Dimension header row
          html += `
            <tr style="background: #eef6fc;">
              <td colspan="6" style="padding: 8px; border: 1px solid #d0d7de; font-weight: bold;">
                ${dim} Dimension (${d.score ?? 'N/A'}/100)
              </td>
            </tr>
          `;

          d.items.forEach(item => {
            const statusColor = item.status === 'PASS' ? '#1a7f37' :
                               item.status === 'PARTIAL' ? '#9a6700' :
                               item.status === 'FAIL' ? '#cf222e' : '#656d76';
            const vetoMark = item.is_veto ? '<span style="color: #cf222e;">*</span>' : '';
            html += `
              <tr>
                <td style="padding: 6px; border: 1px solid #d0d7de; font-family: monospace;">${item.id}${vetoMark}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de;">${item.name}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center; color: ${statusColor}; font-weight: 600;">
                  ${item.status || 'PENDING'}
                </td>
                <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center;">${item.score ?? '-'}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de; font-size: 10px; max-width: 200px; overflow: hidden;">
                  ${escapeHtml(item.raw_data || '-')}
                </td>
                <td style="padding: 6px; border: 1px solid #d0d7de; font-size: 10px;">${item.data_source || '-'}</td>
              </tr>
            `;
          });
        }
      });

      html += `
          </tbody>
        </table>
        <p style="color: #656d76; font-size: 10px;">* Veto item - failure caps overall score at 39</p>
      `;
    }
  }

  // CORE-EEAT Provenance - Full 80 items (page break)
  if (scoreProvenance.core_eeat_provenance) {
    const eeat = scoreProvenance.core_eeat_provenance;
    html += `
      <div style="page-break-before: always;">
        <h3 style="color: #1f2328; margin-top: 20px;">Content Quality (CORE-EEAT) - All 80 Items</h3>
        <div style="background: #f6f8fa; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
          <strong>GEO Score:</strong> ${eeat.geo_score ?? 'N/A'}/100 |
          <strong>SEO Score:</strong> ${eeat.seo_score ?? 'N/A'}/100
        </div>
    `;

    // Veto items warning
    const triggeredVetos = (eeat.veto_items || []).filter(v => v.triggered);
    if (triggeredVetos.length > 0) {
      html += `
        <div style="background: #fff5f5; border: 1px solid #f85149; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
          <strong style="color: #cf222e;">VETO TRIGGERED:</strong>
          ${triggeredVetos.map(v => `${v.id} (${v.name})`).join(', ')}
        </div>
      `;
    }

    // Full CORE-EEAT items table
    if (eeat.dimensions) {
      html += `
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f6f8fa;">
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">ID</th>
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">Check Item</th>
              <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Status</th>
              <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Score</th>
              <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Priority</th>
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">Source</th>
            </tr>
          </thead>
          <tbody>
      `;

      // CORE dimensions first (C, O, R, E)
      ['C', 'O', 'R', 'E'].forEach(dim => {
        const d = eeat.dimensions[dim];
        const dimName = { C: 'Content', O: 'Organization', R: 'References', E: 'Exclusivity' }[dim];
        if (d && d.items && d.items.length > 0) {
          // Full items table
          html += `
            <tr style="background: #eef6fc;">
              <td colspan="6" style="padding: 8px; border: 1px solid #d0d7de; font-weight: bold;">
                ${dim} - ${dimName} (${d.score ?? 'N/A'}/100) - CORE/GEO
              </td>
            </tr>
          `;
          d.items.forEach(item => {
            const statusColor = item.status === 'PASS' ? '#1a7f37' :
                               item.status === 'PARTIAL' ? '#9a6700' :
                               item.status === 'FAIL' ? '#cf222e' : '#656d76';
            const vetoMark = item.is_veto ? '<span style="color: #cf222e;">*</span>' : '';
            html += `
              <tr>
                <td style="padding: 6px; border: 1px solid #d0d7de; font-family: monospace;">${item.id}${vetoMark}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de;">${item.name}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center; color: ${statusColor}; font-weight: 600;">
                  ${item.status || 'PENDING'}
                </td>
                <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center;">${item.score ?? '-'}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center; font-size: 10px;">${item.priority || '-'}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de; font-size: 10px;">${item.data_source || '-'}</td>
              </tr>
            `;
          });
        } else if (d) {
          // Fallback: dimension-level summary when items not available
          html += `
            <tr style="background: #eef6fc;">
              <td style="padding: 8px; border: 1px solid #d0d7de; font-family: monospace;">${dim}</td>
              <td style="padding: 8px; border: 1px solid #d0d7de;">${dimName} (CORE/GEO)</td>
              <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center; color: #656d76;">-</td>
              <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center; font-weight: 600;">${d.score ?? 'N/A'}</td>
              <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center; font-size: 10px;">-</td>
              <td style="padding: 8px; border: 1px solid #d0d7de; font-size: 10px;">${d.source_skill || '-'}</td>
            </tr>
          `;
        }
      });

      // EEAT dimensions (Exp, Ept, A, T) - page break
      html += `
          </tbody>
        </table>
        <div style="page-break-before: always;">
        <h4 style="color: #1f2328; margin-top: 20px;">EEAT Dimensions (SEO Score)</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f6f8fa;">
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">ID</th>
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">Check Item</th>
              <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Status</th>
              <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Score</th>
              <th style="text-align: center; padding: 6px; border: 1px solid #d0d7de;">Priority</th>
              <th style="text-align: left; padding: 6px; border: 1px solid #d0d7de;">Source</th>
            </tr>
          </thead>
          <tbody>
      `;

      ['Exp', 'Ept', 'A', 'T'].forEach(dim => {
        const d = eeat.dimensions[dim];
        const dimName = { Exp: 'Experience', Ept: 'Expertise', A: 'Authority', T: 'Trust' }[dim];
        if (d && d.items && d.items.length > 0) {
          // Full items table
          html += `
            <tr style="background: #f0f6ee;">
              <td colspan="6" style="padding: 8px; border: 1px solid #d0d7de; font-weight: bold;">
                ${dim} - ${dimName} (${d.score ?? 'N/A'}/100) - EEAT/SEO
              </td>
            </tr>
          `;
          d.items.forEach(item => {
            const statusColor = item.status === 'PASS' ? '#1a7f37' :
                               item.status === 'PARTIAL' ? '#9a6700' :
                               item.status === 'FAIL' ? '#cf222e' : '#656d76';
            const vetoMark = item.is_veto ? '<span style="color: #cf222e;">*</span>' : '';
            html += `
              <tr>
                <td style="padding: 6px; border: 1px solid #d0d7de; font-family: monospace;">${item.id}${vetoMark}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de;">${item.name}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center; color: ${statusColor}; font-weight: 600;">
                  ${item.status || 'PENDING'}
                </td>
                <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center;">${item.score ?? '-'}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de; text-align: center; font-size: 10px;">${item.priority || '-'}</td>
                <td style="padding: 6px; border: 1px solid #d0d7de; font-size: 10px;">${item.data_source || '-'}</td>
              </tr>
            `;
          });
        } else if (d) {
          // Fallback: dimension-level summary when items not available
          html += `
            <tr style="background: #f0f6ee;">
              <td style="padding: 8px; border: 1px solid #d0d7de; font-family: monospace;">${dim}</td>
              <td style="padding: 8px; border: 1px solid #d0d7de;">${dimName} (EEAT/SEO)</td>
              <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center; color: #656d76;">-</td>
              <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center; font-weight: 600;">${d.score ?? 'N/A'}</td>
              <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center; font-size: 10px;">-</td>
              <td style="padding: 8px; border: 1px solid #d0d7de; font-size: 10px;">${d.source_skill || '-'}</td>
            </tr>
          `;
        }
      });

      html += `
          </tbody>
        </table>
        </div>
        <p style="color: #656d76; font-size: 10px;">* Veto item - failure invalidates publish readiness</p>
      </div>
      `;
    }
  }

  // Feeder Chain
  if (scoreProvenance.feeder_chain && scoreProvenance.feeder_chain.length > 0) {
    html += `
      <h3 style="color: #1f2328; margin-top: 20px;">Data Source Chain</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background: #f6f8fa;">
            <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Target Scores</th>
            <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Source Skill</th>
            <th style="text-align: center; padding: 8px; border: 1px solid #d0d7de;">Step</th>
            <th style="text-align: center; padding: 8px; border: 1px solid #d0d7de;">Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    scoreProvenance.feeder_chain.forEach(chain => {
      const statusColor = chain.status === 'DONE' ? '#1a7f37' :
                         chain.status === 'PARTIAL' ? '#9a6700' : '#656d76';
      html += `
        <tr>
          <td style="padding: 8px; border: 1px solid #d0d7de; font-family: monospace; font-size: 11px;">${chain.target}</td>
          <td style="padding: 8px; border: 1px solid #d0d7de;">${chain.source}</td>
          <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center;">${chain.step || '-'}</td>
          <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center; color: ${statusColor};">${chain.status || '-'}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
  }

  return html || '<p><em>Score provenance data not available.</em></p>';
}

/**
 * Build robots.txt AI crawler section (extracted for reuse)
 */
function buildRobotsTxtAiSection(robotsAi) {
  let html = `
    <h4 style="color: #1f2328; margin-top: 16px;">robots.txt AI Crawler Coverage</h4>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px;">
      <thead>
        <tr style="background: #f6f8fa;">
          <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Check</th>
          <th style="text-align: center; padding: 8px; border: 1px solid #d0d7de;">Status</th>
          <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Notes</th>
        </tr>
      </thead>
      <tbody>
  `;

  const robotsChecks = [
    { label: 'AI training bots addressed', pass: robotsAi.training_bots_addressed, note: robotsAi.training_bots || '' },
    { label: 'AI retrieval bots allowed', pass: robotsAi.retrieval_bots_allowed, note: robotsAi.retrieval_bots || '' },
    { label: 'Training/retrieval distinction', pass: robotsAi.distinction_made, note: '' },
    { label: 'llms.txt accessible to AI bots', pass: robotsAi.llms_txt_accessible, note: '' }
  ];

  robotsChecks.forEach(check => {
    const icon = check.pass === true ? '<span style="color: #1a7f37;">PASS</span>' :
                 check.pass === false ? '<span style="color: #cf222e;">FAIL</span>' :
                 '<span style="color: #656d76;">N/A</span>';
    html += `
      <tr>
        <td style="padding: 8px; border: 1px solid #d0d7de;">${check.label}</td>
        <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center;">${icon}</td>
        <td style="padding: 8px; border: 1px solid #d0d7de; font-size: 11px;">${escapeHtml(check.note)}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  return html;
}

/**
 * Build AI Discoverability (llms.txt) section for Appendix D
 */
function buildLlmsTxtSection(technicalData) {
  const robotsAi = technicalData?.robots_ai || {};

  // Handle missing llms.txt (404) case - still show robots.txt analysis
  if (!technicalData?.llms_txt || technicalData.llms_txt.exists === false) {
    let html = `
      <h3 style="color: #1f2328; margin-top: 20px;">AI Discoverability Files</h3>
      <div style="background: #fff5f5; border: 1px solid #f85149; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
        <h4 style="color: #cf222e; margin: 0 0 8px 0;">llms.txt Status: 404 Not Found</h4>
        <p style="margin: 0 0 8px 0;">No llms.txt file exists at this domain. This file helps AI systems understand your site structure and discover your most important content.</p>
        <p style="margin: 0;"><strong>Recommendation:</strong> Create /llms.txt following the <a href="https://llmstxt.org" style="color: #0969da;">llms.txt specification</a>.</p>
      </div>
    `;

    // Still show robots.txt AI crawler analysis if available
    if (Object.keys(robotsAi).length > 0) {
      html += buildRobotsTxtAiSection(robotsAi);
    }

    return html;
  }

  const lt = technicalData.llms_txt;

  let html = `
    <h3 style="color: #1f2328; margin-top: 20px;">AI Discoverability Files</h3>
  `;

  // llms.txt table
  html += `
    <h4 style="color: #1f2328; margin-top: 16px;">llms.txt Status</h4>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px;">
      <thead>
        <tr style="background: #f6f8fa;">
          <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Check</th>
          <th style="text-align: center; padding: 8px; border: 1px solid #d0d7de;">Status</th>
          <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Notes</th>
        </tr>
      </thead>
      <tbody>
  `;

  const checks = [
    { label: 'File exists at root', pass: lt.exists, note: lt.url || '' },
    { label: 'H1 heading present (required)', pass: lt.h1_present, note: lt.h1_text || '' },
    { label: 'Blockquote summary present', pass: lt.blockquote_present, note: '' },
    { label: 'Valid Markdown syntax', pass: lt.valid_markdown, note: lt.markdown_errors || '' },
    { label: 'Links use canonical URLs', pass: lt.canonical_links, note: '' },
    { label: 'File size <= 10 KB', pass: lt.size_ok, note: lt.size_bytes ? `${Math.round(lt.size_bytes/1024)} KB` : '' },
    { label: '5-20 key pages listed', pass: lt.page_count_ok, note: lt.page_count ? `${lt.page_count} pages` : '' }
  ];

  checks.forEach(check => {
    const icon = check.pass === true ? '<span style="color: #1a7f37;">PASS</span>' :
                 check.pass === false ? '<span style="color: #cf222e;">FAIL</span>' :
                 '<span style="color: #656d76;">N/A</span>';
    html += `
      <tr>
        <td style="padding: 8px; border: 1px solid #d0d7de;">${check.label}</td>
        <td style="padding: 8px; border: 1px solid #d0d7de; text-align: center;">${icon}</td>
        <td style="padding: 8px; border: 1px solid #d0d7de; font-size: 11px;">${escapeHtml(check.note)}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';

  // robots.txt AI crawler section (use helper function)
  html += buildRobotsTxtAiSection(robotsAi);

  // Recommendation
  if (!lt.exists || !lt.h1_present || !lt.valid_markdown) {
    html += `
      <div style="background: #fff8c5; border: 1px solid #d4a72c; padding: 12px; border-radius: 6px;">
        <strong>Recommendation:</strong> Create or improve /llms.txt to enhance AI discoverability.
        See <a href="https://llmstxt.org">llmstxt.org</a> for specification.
      </div>
    `;
  }

  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default { generatePdfFromHtml };
