/**
 * E2E Tests for Company Analysis Completion
 *
 * Validates that a completed analysis has:
 * 1. PDF report generated
 * 2. Operations log with all 21 steps
 * 3. Score provenance with all 120 items (40 CITE + 80 CORE-EEAT)
 * 4. Sitemap data captured
 * 5. Claude Code prompts logged
 *
 * Usage:
 *   npm test -- tools/__tests__/e2e/analysis-completion.test.js
 *   npm test -- tools/__tests__/e2e/analysis-completion.test.js --testPathPattern="PDF"
 */

import { describe, test, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Configuration - find the most recent analysis
const ANALYSES_ROOT = path.join(process.cwd(), 'analyses');

let analysisDir;
let reportsDir;
let companyRoot;
let domain;
let timestamp;

beforeAll(async () => {
  // Find the most recent analysis directory
  const companyDirs = fs.readdirSync(ANALYSES_ROOT).filter(d => {
    const stat = fs.statSync(path.join(ANALYSES_ROOT, d));
    return stat.isDirectory() && !d.startsWith('.');
  });

  if (companyDirs.length === 0) {
    throw new Error('No analysis directories found in analyses/');
  }

  // Get the most recent company
  companyRoot = companyDirs[companyDirs.length - 1];
  const companyPath = path.join(ANALYSES_ROOT, companyRoot);

  // Find domain subdirectories
  const domainDirs = fs.readdirSync(companyPath).filter(d => {
    const stat = fs.statSync(path.join(companyPath, d));
    return stat.isDirectory() && d.includes('.') && d !== 'reports';
  });

  if (domainDirs.length === 0) {
    throw new Error(`No domain directories found in analyses/${companyRoot}/`);
  }

  domain = domainDirs[0];
  const domainPath = path.join(companyPath, domain);

  // Find most recent analysis timestamp
  const analysisDirs = fs.readdirSync(domainPath)
    .filter(d => d.startsWith('analysis-'))
    .sort()
    .reverse();

  if (analysisDirs.length === 0) {
    throw new Error(`No analysis-* directories found in analyses/${companyRoot}/${domain}/`);
  }

  timestamp = analysisDirs[0].replace('analysis-', '');
  analysisDir = path.join(domainPath, analysisDirs[0]);
  reportsDir = path.join(companyPath, 'reports');

  console.log(`Testing analysis: ${companyRoot}/${domain}/analysis-${timestamp}`);
});

describe('Analysis Completion Validation', () => {

  describe('PDF Report', () => {
    test('PDF report file exists', () => {
      const pdfPath = path.join(reportsDir, `${companyRoot}_${domain}_${timestamp}.pdf`);
      expect(fs.existsSync(pdfPath), `PDF not found at ${pdfPath}`).toBe(true);
    });

    test('PDF report has valid size (> 100KB)', () => {
      const pdfPath = path.join(reportsDir, `${companyRoot}_${domain}_${timestamp}.pdf`);
      if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file does not exist');
      }
      const stats = fs.statSync(pdfPath);
      expect(stats.size).toBeGreaterThan(100 * 1024);
    });

    test('PDF report has valid header (%PDF-)', () => {
      const pdfPath = path.join(reportsDir, `${companyRoot}_${domain}_${timestamp}.pdf`);
      if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file does not exist');
      }
      const buffer = Buffer.alloc(5);
      const fd = fs.openSync(pdfPath, 'r');
      fs.readSync(fd, buffer, 0, 5, 0);
      fs.closeSync(fd);
      expect(buffer.toString()).toBe('%PDF-');
    });
  });

  describe('Operations Log', () => {
    test('operations-log.json exists', () => {
      const opsLogPath = path.join(analysisDir, 'operations-log.json');
      expect(fs.existsSync(opsLogPath), `operations-log.json not found at ${opsLogPath}`).toBe(true);
    });

    test('operations log has steps array', () => {
      const opsLogPath = path.join(analysisDir, 'operations-log.json');
      const log = JSON.parse(fs.readFileSync(opsLogPath, 'utf-8'));
      expect(Array.isArray(log.steps)).toBe(true);
    });

    test('operations log has at least 20 steps', () => {
      const opsLogPath = path.join(analysisDir, 'operations-log.json');
      const log = JSON.parse(fs.readFileSync(opsLogPath, 'utf-8'));
      expect(log.steps.length).toBeGreaterThanOrEqual(20);
    });

    test('each step has required fields', () => {
      const opsLogPath = path.join(analysisDir, 'operations-log.json');
      const log = JSON.parse(fs.readFileSync(opsLogPath, 'utf-8'));

      log.steps.forEach((step, index) => {
        expect(step, `Step ${index} missing step_number`).toHaveProperty('step_number');
        expect(step, `Step ${index} missing skill_name`).toHaveProperty('skill_name');
        expect(step, `Step ${index} missing status`).toHaveProperty('status');
      });
    });
  });

  describe('Score Provenance - CITE (40 items)', () => {
    test('score-provenance.json exists', () => {
      const provPath = path.join(analysisDir, 'score-provenance.json');
      expect(fs.existsSync(provPath), `score-provenance.json not found at ${provPath}`).toBe(true);
    });

    test('CITE provenance has all 40 items', () => {
      const provPath = path.join(analysisDir, 'score-provenance.json');
      const prov = JSON.parse(fs.readFileSync(provPath, 'utf-8'));

      const citeItems = [];
      if (prov.cite_provenance?.dimensions) {
        for (const [dim, data] of Object.entries(prov.cite_provenance.dimensions)) {
          if (Array.isArray(data.items)) {
            citeItems.push(...data.items);
          }
        }
      }

      expect(citeItems.length, `Expected 40 CITE items, found ${citeItems.length}`).toBe(40);
    });

    test('CITE items have raw_data field', () => {
      const provPath = path.join(analysisDir, 'score-provenance.json');
      const prov = JSON.parse(fs.readFileSync(provPath, 'utf-8'));

      const missingRawData = [];
      if (prov.cite_provenance?.dimensions) {
        for (const [dim, data] of Object.entries(prov.cite_provenance.dimensions)) {
          if (Array.isArray(data.items)) {
            for (const item of data.items) {
              if (!item.raw_data || item.raw_data === '') {
                missingRawData.push(item.id);
              }
            }
          }
        }
      }

      expect(missingRawData.length, `CITE items missing raw_data: ${missingRawData.join(', ')}`).toBe(0);
    });

    test('CITE items have calculation field', () => {
      const provPath = path.join(analysisDir, 'score-provenance.json');
      const prov = JSON.parse(fs.readFileSync(provPath, 'utf-8'));

      const missingCalculation = [];
      if (prov.cite_provenance?.dimensions) {
        for (const [dim, data] of Object.entries(prov.cite_provenance.dimensions)) {
          if (Array.isArray(data.items)) {
            for (const item of data.items) {
              if (!item.calculation || item.calculation === '') {
                missingCalculation.push(item.id);
              }
            }
          }
        }
      }

      expect(missingCalculation.length, `CITE items missing calculation: ${missingCalculation.join(', ')}`).toBe(0);
    });
  });

  describe('Score Provenance - CORE-EEAT (80 items)', () => {
    test('CORE-EEAT provenance has all 80 items', () => {
      const provPath = path.join(analysisDir, 'score-provenance.json');
      const prov = JSON.parse(fs.readFileSync(provPath, 'utf-8'));

      const coreItems = [];
      if (prov.core_eeat_provenance?.dimensions) {
        for (const [dim, data] of Object.entries(prov.core_eeat_provenance.dimensions)) {
          if (Array.isArray(data.items)) {
            coreItems.push(...data.items);
          }
        }
      }

      expect(coreItems.length, `Expected 80 CORE-EEAT items, found ${coreItems.length}`).toBe(80);
    });

    test('CORE-EEAT items have raw_data field', () => {
      const provPath = path.join(analysisDir, 'score-provenance.json');
      const prov = JSON.parse(fs.readFileSync(provPath, 'utf-8'));

      const missingRawData = [];
      if (prov.core_eeat_provenance?.dimensions) {
        for (const [dim, data] of Object.entries(prov.core_eeat_provenance.dimensions)) {
          if (Array.isArray(data.items)) {
            for (const item of data.items) {
              if (!item.raw_data || item.raw_data === '') {
                missingRawData.push(item.id);
              }
            }
          }
        }
      }

      expect(missingRawData.length, `CORE-EEAT items missing raw_data: ${missingRawData.join(', ')}`).toBe(0);
    });
  });

  describe('Sitemap Data', () => {
    test('sitemap-data.json exists', () => {
      const sitemapPath = path.join(analysisDir, 'sitemap-data.json');
      expect(fs.existsSync(sitemapPath), `sitemap-data.json not found at ${sitemapPath}`).toBe(true);
    });

    test('sitemap data has required fields', () => {
      const sitemapPath = path.join(analysisDir, 'sitemap-data.json');
      if (!fs.existsSync(sitemapPath)) {
        throw new Error('sitemap-data.json does not exist');
      }

      const sitemap = JSON.parse(fs.readFileSync(sitemapPath, 'utf-8'));
      expect(sitemap).toHaveProperty('sitemap_url');
      expect(sitemap).toHaveProperty('fetched_at');
      expect(sitemap).toHaveProperty('sitemap_found');
    });

    test('sitemap has sample_urls if found', () => {
      const sitemapPath = path.join(analysisDir, 'sitemap-data.json');
      if (!fs.existsSync(sitemapPath)) {
        throw new Error('sitemap-data.json does not exist');
      }

      const sitemap = JSON.parse(fs.readFileSync(sitemapPath, 'utf-8'));
      if (sitemap.sitemap_found) {
        expect(Array.isArray(sitemap.sample_urls)).toBe(true);
        expect(sitemap.sample_urls.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Prompt Results - Claude Code Logging', () => {
    test('prompt-results.json exists', () => {
      const promptsPath = path.join(analysisDir, 'prompt-results.json');
      expect(fs.existsSync(promptsPath), `prompt-results.json not found at ${promptsPath}`).toBe(true);
    });

    test('prompt results has prompt_results array', () => {
      const promptsPath = path.join(analysisDir, 'prompt-results.json');
      const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));
      expect(Array.isArray(prompts.prompt_results)).toBe(true);
    });

    test('prompt results include Claude Code entries (source: claude_code)', () => {
      const promptsPath = path.join(analysisDir, 'prompt-results.json');
      const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

      const claudeCodePrompts = prompts.prompt_results.filter(p => p.source === 'claude_code');
      expect(claudeCodePrompts.length, 'No Claude Code prompts logged (source: claude_code)').toBeGreaterThan(0);
    });

    test('Claude Code prompts have required fields', () => {
      const promptsPath = path.join(analysisDir, 'prompt-results.json');
      const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

      const claudeCodePrompts = prompts.prompt_results.filter(p => p.source === 'claude_code');
      claudeCodePrompts.forEach((prompt, index) => {
        expect(prompt, `Claude Code prompt ${index} missing type`).toHaveProperty('type');
        expect(prompt, `Claude Code prompt ${index} missing timestamp_utc`).toHaveProperty('timestamp_utc');
      });
    });
  });

  describe('Handoff Files', () => {
    test('all 7 phase directories exist', async () => {
      const phases = [
        '01-domain-baseline',
        '02-research',
        '03-technical',
        '04-content',
        '05-recommendations',
        '06-monitoring',
        '07-memory'
      ];

      phases.forEach(phase => {
        const phasePath = path.join(analysisDir, phase);
        expect(fs.existsSync(phasePath), `Phase directory not found: ${phase}`).toBe(true);
      });
    });

    test('at least 15 handoff files exist', async () => {
      const handoffFiles = await glob(path.join(analysisDir, '**/*-handoff.md'));
      expect(handoffFiles.length, `Expected at least 15 handoff files, found ${handoffFiles.length}`).toBeGreaterThanOrEqual(15);
    });

    test('competitor analysis mentions sitemap', () => {
      const competitorHandoff = path.join(analysisDir, '02-research/competitor-analysis-handoff.md');
      if (fs.existsSync(competitorHandoff)) {
        const content = fs.readFileSync(competitorHandoff, 'utf-8');
        expect(content.toLowerCase()).toMatch(/sitemap/);
      }
    });
  });
});

describe('HTML Report Validation', () => {
  test('HTML report exists', () => {
    const htmlPath = path.join(reportsDir, `${companyRoot}_${domain}_${timestamp}.html`);
    expect(fs.existsSync(htmlPath), `HTML report not found at ${htmlPath}`).toBe(true);
  });

  test('HTML report is self-contained (no external CSS)', () => {
    const htmlPath = path.join(reportsDir, `${companyRoot}_${domain}_${timestamp}.html`);
    if (!fs.existsSync(htmlPath)) {
      throw new Error('HTML report does not exist');
    }

    const content = fs.readFileSync(htmlPath, 'utf-8');
    expect(content).toContain('<style>');
    expect(content).not.toMatch(/href=["']https?:\/\/.*\.css["']/);
  });

  test('HTML report contains CITE verdict', () => {
    const htmlPath = path.join(reportsDir, `${companyRoot}_${domain}_${timestamp}.html`);
    if (!fs.existsSync(htmlPath)) {
      throw new Error('HTML report does not exist');
    }

    const content = fs.readFileSync(htmlPath, 'utf-8');
    expect(content).toMatch(/TRUSTED|CAUTIOUS|UNTRUSTED/);
  });
});
