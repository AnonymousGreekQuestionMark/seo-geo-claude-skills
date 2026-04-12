#!/usr/bin/env node
/**
 * Run Citation Baseline for a domain
 * Saves results to prompt-results.json and score-provenance.json
 */

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import pipeline runner
const { runCitationBaseline, generateScoreProvenance, saveScoreProvenance, updatePromptSummary } =
  await import('../shared/pipeline-runner.js');

const domain = process.argv[2] || 'caplinq.com';
const analysisPath = process.argv[3] || path.join(__dirname, '../../analyses/caplinq/caplinq.com/analysis-20260412T175045');

// Queries to test for citation baseline
const queries = [
  `What is ${domain} and what do they specialize in?`,
  `Best suppliers for specialty chemicals like ${domain.replace('.com', '')}`,
  `${domain.replace('.com', '')} company overview and products`
];

console.log(`\n=== Citation Baseline Test ===`);
console.log(`Domain: ${domain}`);
console.log(`Analysis Path: ${analysisPath}`);
console.log(`Queries: ${queries.length}`);
console.log('');

async function main() {
  try {
    // Ensure analysis path exists
    await fs.mkdir(analysisPath, { recursive: true });

    // Run citation baseline
    console.log('Running citation baseline...');
    const results = await runCitationBaseline(domain, queries, analysisPath);

    console.log('\n--- Citation Results ---');
    console.log(`Engines used: ${results.engines_used.join(', ')}`);
    console.log(`Queries with citation: ${results.queries_with_citation}/${results.queries_tested}`);
    console.log(`By engine: OpenAI=${results.by_engine.openai}, Anthropic=${results.by_engine.anthropic}, Gemini=${results.by_engine.gemini}`);

    // Generate and save score provenance
    console.log('\nGenerating score provenance...');
    const provenance = generateScoreProvenance(results);
    await saveScoreProvenance(analysisPath, provenance);

    // Update summary
    await updatePromptSummary(analysisPath);

    // Verify files
    console.log('\n--- Verification ---');
    const promptResultsPath = path.join(analysisPath, 'prompt-results.json');
    const scoreProvenancePath = path.join(analysisPath, 'score-provenance.json');

    const promptData = JSON.parse(await fs.readFile(promptResultsPath, 'utf-8'));
    const provenanceData = JSON.parse(await fs.readFile(scoreProvenancePath, 'utf-8'));

    console.log(`prompt-results.json: ${promptData.prompt_results.length} entries`);
    console.log(`score-provenance.json: CITE score ${provenanceData.cite_provenance?.overall?.score || 'N/A'}`);

    if (promptData.prompt_results.length === 0) {
      console.error('\nERROR: prompt_results is still empty!');
      process.exit(1);
    }

    console.log('\n✓ Data saved successfully');

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('API Response:', error.response);
    }
    process.exit(1);
  }
}

main();
