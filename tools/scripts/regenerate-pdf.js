#!/usr/bin/env node
/**
 * Regenerate PDF from HTML report with appendix data
 */

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import PDF generator
const { generatePdfFromHtml } = await import('../shared/pdf-generator.js');

const analysisRoot = process.argv[2] || path.join(__dirname, '../../analyses/caplinq');
const timestamp = '20260412T175045';
const domain = 'caplinq.com';
const companyRoot = 'caplinq';

const analysisDir = path.join(analysisRoot, domain, `analysis-${timestamp}`);
const reportsDir = path.join(analysisRoot, 'reports');
const htmlPath = path.join(reportsDir, `${companyRoot}_${domain}_${timestamp}.html`);
const pdfPath = path.join(reportsDir, `${companyRoot}_${domain}_${timestamp}.pdf`);

console.log(`\n=== PDF Regeneration ===`);
console.log(`HTML: ${htmlPath}`);
console.log(`PDF: ${pdfPath}`);
console.log('');

async function main() {
  try {
    // Check HTML exists
    await fs.access(htmlPath);
    console.log('HTML file found');

    // Load prompt results
    const promptResultsPath = path.join(analysisDir, 'prompt-results.json');
    let promptResults = null;
    try {
      promptResults = JSON.parse(await fs.readFile(promptResultsPath, 'utf-8'));
      console.log(`prompt-results.json: ${promptResults.prompt_results?.length || 0} entries`);
    } catch {
      console.log('prompt-results.json: not found');
    }

    // Load score provenance
    const scoreProvenancePath = path.join(analysisDir, 'score-provenance.json');
    let scoreProvenance = null;
    try {
      scoreProvenance = JSON.parse(await fs.readFile(scoreProvenancePath, 'utf-8'));
      console.log(`score-provenance.json: CITE score ${scoreProvenance.cite_provenance?.overall?.score || 'N/A'}`);
    } catch {
      console.log('score-provenance.json: not found');
    }

    // Verify we have data
    if (!promptResults?.prompt_results?.length) {
      console.error('\nERROR: prompt-results.json has no entries!');
      process.exit(1);
    }

    if (!scoreProvenance?.cite_provenance) {
      console.error('\nERROR: score-provenance.json has no CITE data!');
      process.exit(1);
    }

    // Generate PDF
    console.log('\nGenerating PDF...');
    const result = await generatePdfFromHtml(htmlPath, pdfPath, {
      analysisDir,
      promptResults,
      scoreProvenance
    });

    if (result.success) {
      const stats = await fs.stat(pdfPath);
      console.log(`\n✓ PDF generated successfully`);
      console.log(`  Path: ${result.path}`);
      console.log(`  Size: ${(stats.size / 1024).toFixed(1)} KB`);
    } else {
      console.error(`\nERROR: ${result.error}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
