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
  const { analysisDir, promptResults, scoreProvenance } = options;

  let appendixHtml = `
    <div class="appendix" style="page-break-before: always;">
      <h1 style="color: #1f2328; border-bottom: 2px solid #d0d7de; padding-bottom: 12px; margin-top: 40px;">
        Appendix
      </h1>
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
        Complete record of AI queries used during this analysis, provided for verification and transparency.
      </p>
      ${promptResults ? buildPromptResultsSection(promptResults) : '<p><em>Prompt results not available.</em></p>'}
    </section>
  `;

  // Appendix C: Score Provenance
  appendixHtml += `
    <section class="appendix-section" style="margin: 24px 0; page-break-before: always;">
      <h2 style="color: #1f2328;">C. Score Provenance</h2>
      <p style="color: #656d76; font-size: 14px; margin-bottom: 16px;">
        Traceability for each score, showing the source data and calculation method.
      </p>
      ${scoreProvenance ? buildProvenanceSection(scoreProvenance) : '<p><em>Score provenance not available.</em></p>'}
    </section>
  `;

  appendixHtml += '</div>';

  return appendixHtml;
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
 * Build provenance section for Appendix C
 */
function buildProvenanceSection(scoreProvenance) {
  let html = '';

  // CITE Provenance
  if (scoreProvenance.cite_provenance) {
    const cite = scoreProvenance.cite_provenance;
    html += `
      <h3 style="color: #1f2328; margin-top: 20px;">Domain Authority (CITE) Scores</h3>
      <div style="background: #f6f8fa; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
        <strong>Overall:</strong> ${cite.overall?.score || 'N/A'}/100
        (${cite.overall?.verdict || 'N/A'})
      </div>
    `;

    if (cite.dimensions) {
      html += `
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f6f8fa;">
              <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Dimension</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Score</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Source</th>
            </tr>
          </thead>
          <tbody>
      `;

      ['C', 'I', 'T', 'E'].forEach(dim => {
        const d = cite.dimensions[dim];
        if (d) {
          html += `
            <tr>
              <td style="padding: 8px; border: 1px solid #d0d7de;">${dim}</td>
              <td style="padding: 8px; border: 1px solid #d0d7de;">${d.score || 'N/A'}/100</td>
              <td style="padding: 8px; border: 1px solid #d0d7de;">${d.items?.[0]?.source_skill || 'various'}</td>
            </tr>
          `;
        }
      });

      html += '</tbody></table>';
    }
  }

  // CORE-EEAT Provenance
  if (scoreProvenance.core_eeat_provenance) {
    const eeat = scoreProvenance.core_eeat_provenance;
    html += `
      <h3 style="color: #1f2328; margin-top: 20px;">Content Quality (CORE-EEAT) Scores</h3>
      <div style="background: #f6f8fa; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
        <strong>GEO Score:</strong> ${eeat.geo_score || 'N/A'}/100 |
        <strong>SEO Score:</strong> ${eeat.seo_score || 'N/A'}/100
      </div>
    `;
  }

  // Feeder Chain
  if (scoreProvenance.feeder_chain && scoreProvenance.feeder_chain.length > 0) {
    html += `
      <h3 style="color: #1f2328; margin-top: 20px;">Data Sources</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background: #f6f8fa;">
            <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Scores</th>
            <th style="text-align: left; padding: 8px; border: 1px solid #d0d7de;">Source Skill</th>
          </tr>
        </thead>
        <tbody>
    `;

    scoreProvenance.feeder_chain.forEach(chain => {
      html += `
        <tr>
          <td style="padding: 8px; border: 1px solid #d0d7de; font-family: monospace; font-size: 11px;">${chain.target}</td>
          <td style="padding: 8px; border: 1px solid #d0d7de;">${chain.source}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
  }

  return html || '<p><em>Score provenance data not available.</em></p>';
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
