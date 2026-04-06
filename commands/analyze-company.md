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
/seo:analyze-company caplinq.com
/seo:analyze-company blog.caplinq.com
/seo:analyze-company acme.io pages="https://acme.io/product,https://acme.io/about"
```

## What it Does

1. Parses the domain and derives the company root (e.g. `blog.caplinq.com` → root `caplinq`)
2. Creates `analyses/<company-root>/<domain>/analysis-<timestamp>/` with 7 phase subdirectories
3. Runs all 20 skills in sequence, saving handoff summaries per skill:
   - **Phase 01**: entity-optimizer, domain-authority-auditor
   - **Phase 02**: keyword-research, competitor-analysis, serp-analysis, content-gap-analysis
   - **Phase 03**: technical-seo-checker, on-page-seo-auditor, internal-linking-optimizer, backlink-analyzer
   - **Phase 04**: content-quality-auditor, content-refresher
   - **Phase 05**: seo-content-writer, geo-content-optimizer, meta-tags-optimizer, schema-markup-generator
   - **Phase 06**: rank-tracker, performance-reporter, alert-manager
   - **Phase 07**: memory-management
4. Generates `analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html`

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
      <company-root>_<domain>_<timestamp>.html
```

## Related Skills

- [company-analysis](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/orchestration/company-analysis/SKILL.md) — the orchestration skill this command invokes
- [memory-management](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/cross-cutting/memory-management/SKILL.md) — recommended next step after the analysis completes

## Notes

- Works in Tier 1 (no MCP tools required) using web-accessible public data
- If Ahrefs, Amplitude, or other MCP servers are connected, skills will use them automatically
- Blocked individual skills are recorded and skipped — the full analysis continues
- The HTML report is fully self-contained (no external CSS/JS dependencies) and safe to share
