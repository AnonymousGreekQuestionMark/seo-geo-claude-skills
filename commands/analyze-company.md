---
name: analyze-company
description: Run all 20 SEO/GEO skills end-to-end for a company domain and generate a self-contained HTML report with CITE and CORE-EEAT scores
argument-hint: "<domain e.g. caplinq.com>"
allowed-tools: ["WebFetch"]
parameters:
  - name: domain
    type: string
    required: true
    description: Company domain to analyze (e.g. caplinq.com or blog.caplinq.com)
  - name: pages
    type: string
    required: false
    description: "Comma-separated list of specific page URLs to include in the on-page audit (optional; skill selects representative pages if omitted)"
---

# Analyze Company Command

> Runs all 20 SEO & GEO skills in a fixed 21-step sequence for a company domain. Saves phase-organized results to `analyses/` and generates a self-contained dark-mode HTML report.

## Usage

```
/geo:analyze-company caplinq.com
/geo:analyze-company blog.caplinq.com
/geo:analyze-company acme.io pages="https://acme.io/product,https://acme.io/about"
```

## Execution Instructions

**This command invokes the `company-analysis` orchestration skill. Follow the full execution instructions in [`orchestration/company-analysis/SKILL.md`](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/orchestration/company-analysis/SKILL.md) exactly — including all 21 steps, the handoff file template, the HTML report generation, and the hot-cache promotion step.**

Summary of what that skill does:

1. Parses the domain → derives company root (e.g. `blog.caplinq.com` → root `caplinq`)
2. Creates `analyses/<company-root>/<domain>/analysis-<timestamp>/` with 7 phase subdirectories
3. Runs all 20 skills in sequence (Steps 1–20), saving a handoff `.md` file per skill:
   - **Phase 01**: entity-optimizer, domain-authority-auditor
   - **Phase 02**: keyword-research, competitor-analysis, serp-analysis, content-gap-analysis
   - **Phase 03**: technical-seo-checker, on-page-seo-auditor, internal-linking-optimizer, backlink-analyzer
   - **Phase 04**: content-quality-auditor, content-refresher
   - **Phase 05**: seo-content-writer, geo-content-optimizer, meta-tags-optimizer, schema-markup-generator
   - **Phase 06**: rank-tracker, performance-reporter, alert-manager
   - **Phase 07**: memory-management
4. **Step 21 — Generates the HTML report**: writes a single self-contained dark-mode HTML file to `analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html` with 8 tabs (Executive Summary + one per phase), CITE verdict badge, CORE-EEAT score grid, 90-day action plan, and skills completion table
5. Appends CITE verdict and top finding to `memory/hot-cache.md`

## Output Structure

```
analyses/
  <company-root>/
    <domain>/
      analysis-<YYYYMMDDTHHmmss>/
        01-domain-baseline/
        02-research/
        03-technical/
        04-content/
        05-recommendations/
        06-monitoring/
        07-memory/
    reports/
      <company-root>_<domain>_<timestamp>.html   ← self-contained HTML report
```

## Notes

- Works in Tier 1 (no MCP tools required) using web-accessible public data
- If Ahrefs, Amplitude, or other MCP servers are connected, skills will use them automatically
- Blocked individual skills are recorded and skipped — the full analysis continues
- The HTML report is fully self-contained (no external CSS/JS dependencies) and safe to share
