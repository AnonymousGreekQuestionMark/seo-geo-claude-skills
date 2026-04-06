---
name: company-analysis
description: 'Full-company SEO/GEO audit: runs all 20 skills in sequence for a domain, saves organized results to analyses/, and generates a self-contained HTML report.'
version: "1.0.0"
license: Apache-2.0
compatibility: "Claude Code ≥1.0, skills.sh marketplace, ClawHub marketplace. No system packages required. Optional: MCP network access for SEO tool integrations."
homepage: "https://github.com/aaron-he-zhu/seo-geo-claude-skills"
when_to_use: "Use when a full end-to-end SEO and GEO analysis of a company domain is needed. Runs all 20 skills in a fixed sequence and produces organized markdown output plus an HTML report. Trigger when user provides a company URL and asks for a complete analysis, full audit, company-wide review, or wants to analyze everything about a domain."
argument-hint: "<domain e.g. caplinq.com>"
metadata:
  author: AAR AI
  version: "1.0.0"
  geo-relevance: "high"
  tags:
    - seo
    - geo
    - company-analysis
    - full-audit
    - orchestration
    - html-report
  triggers:
    - "full company SEO audit"
    - "analyze this company"
    - "run all skills"
    - "complete site audit"
    - "company-wide analysis"
    - "end-to-end audit"
    - "full SEO review"
    - "audit everything for this domain"
    - "comprehensive SEO analysis"
    - "analyze everything about this site"
    - "run the full analysis"
    - "do everything on this domain"
    - "full audit from scratch"
    - "analyze caplinq.com"
    - "run all 20 skills"
    - "caplinq.com"
    - "https://caplinq.com"
    - "audit this domain"
    - "analyze this domain"
    - "analyze this site"
    - "full analysis"
---

# Company Analysis

> **[SEO & GEO Skills Library](https://github.com/aaron-he-zhu/seo-geo-claude-skills)** · 21 skills for SEO + GEO · [ClawHub](https://clawhub.ai/u/aaron-he-zhu) · [skills.sh](https://skills.sh/aaron-he-zhu/seo-geo-claude-skills)
> **System Mode**: This orchestration skill runs all 20 library skills in sequence and follows the shared [Skill Contract](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/skill-contract.md) and [State Model](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/state-model.md).

Full-company SEO and GEO analysis that runs all 20 library skills in a fixed 21-step sequence. Given a company URL, it extracts the company root, creates an organized output directory, executes each skill, saves handoff summaries, and generates a comprehensive self-contained HTML report.

## When This Must Trigger

- User provides a company domain and asks for a full, complete, or comprehensive analysis
- User invokes `/seo:analyze-company <domain>` command
- User says "analyze everything", "run all skills", or "do a full audit" with a domain
- Starting a new company engagement and need a complete baseline

## Quick Start

```
/seo:analyze-company caplinq.com
/seo:analyze-company blog.caplinq.com
Analyze everything about caplinq.com and generate an HTML report
```

## Skill Contract

**Expected output**: 21 handoff files organized across 7 phase folders plus one self-contained HTML report.

- **Reads**: the input URL; public site data (homepage, robots.txt, sitemap); hot-cache if prior analysis exists
- **Writes**: `analyses/<company-root>/<domain>/analysis-<timestamp>/` (7 phase subdirs) + `analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html`
- **Promotes**: CITE verdict, veto items, top 3 critical findings, and analysis timestamp to `memory/hot-cache.md`
- **Next handoff**: `memory-management` to integrate findings into campaign memory loop

## URL Parsing Logic

```
Input: "caplinq.com" OR "blog.caplinq.com" OR "https://www.caplinq.com/blog/"

1. Strip scheme (https://, http://)
2. Strip trailing path and query string
3. Strip leading "www." if present
4. Full domain = "caplinq.com" or "blog.caplinq.com"
5. Company root = apex domain without TLD suffix
   - "caplinq.com"      → company-root = "caplinq"
   - "blog.caplinq.com" → company-root = "caplinq"
   - "acme.co.uk"       → company-root = "acme"
6. Timestamp = YYYYMMDDTHHmmss (UTC, no colons or separators except T)
7. Analysis path = analyses/<company-root>/<domain>/analysis-<timestamp>/
8. Report path   = analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html
```

## Execution Plan

Run each skill in order. After each skill, save its handoff summary to the designated file. If a skill returns BLOCKED, record the block reason and continue to the next skill — do not halt the entire analysis.

```
Phase 01 — Domain Baseline
  Step  1: entity-optimizer          → 01-domain-baseline/entity-optimizer-handoff.md
  Step  2: domain-authority-auditor  → 01-domain-baseline/domain-authority-handoff.md

Phase 02 — Research
  Step  3: keyword-research          → 02-research/keyword-research-handoff.md
  Step  4: competitor-analysis       → 02-research/competitor-analysis-handoff.md
  Step  5: serp-analysis             → 02-research/serp-analysis-handoff.md
  Step  6: content-gap-analysis      → 02-research/content-gap-analysis-handoff.md

Phase 03 — Technical
  Step  7: technical-seo-checker     → 03-technical/technical-seo-handoff.md
  Step  8: on-page-seo-auditor       → 03-technical/on-page-seo-handoff.md
  Step  9: internal-linking-optimizer → 03-technical/internal-linking-handoff.md
  Step 10: backlink-analyzer         → 03-technical/backlink-handoff.md

Phase 04 — Content Quality
  Step 11: content-quality-auditor   → 04-content/content-quality-handoff.md
  Step 12: content-refresher         → 04-content/content-refresher-handoff.md

Phase 05 — Recommendations
  Step 13: seo-content-writer        → 05-recommendations/seo-content-handoff.md
  Step 14: geo-content-optimizer     → 05-recommendations/geo-content-handoff.md
  Step 15: meta-tags-optimizer       → 05-recommendations/meta-tags-handoff.md
  Step 16: schema-markup-generator   → 05-recommendations/schema-markup-handoff.md

Phase 06 — Monitoring
  Step 17: rank-tracker              → 06-monitoring/rank-tracker-handoff.md
  Step 18: performance-reporter      → 06-monitoring/performance-reporter-handoff.md
  Step 19: alert-manager             → 06-monitoring/alert-manager-handoff.md

Phase 07 — Memory
  Step 20: memory-management         → 07-memory/memory-snapshot.md

Step 21 — HTML Report
  → analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html
```

## Instructions

### Step 0: Setup

Before executing any skills:
1. Parse the input URL using the URL Parsing Logic above
2. Print the resolved paths: `Analysis: analyses/<company-root>/<domain>/analysis-<timestamp>/` and `Report: analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html`
3. Note the timestamp so all files use the same value throughout the run
4. Announce: "Starting 21-step company analysis for `<domain>`. Running skills in sequence — this will take several minutes."

### Steps 1–20: Execute Each Skill

For each skill in the execution plan:

1. Announce: `▶ Step N/21 — <skill-name>`
2. Execute the skill's full workflow (using its SKILL.md instructions as the authoritative guide)
   - Use `WebFetch` to retrieve publicly available data (homepage, robots.txt, sitemap, key pages)
   - In Tier 1 (no MCP tools): use AI analysis and publicly available information; note what would require tool access
3. After the skill completes, save the handoff summary to the designated file using this template:

```markdown
---
skill: <skill-name>
phase: <01-07>
step: <1-20>
status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_INPUT
timestamp: <YYYYMMDDTHHmmss>
domain: <domain>
---

## Handoff Summary — <skill-name>

- **Status**: <status>
- **Objective**: <what was analyzed>
- **Key Findings**: <highest-signal result — be specific, cite data>
- **Evidence**: <URLs, pages reviewed, data sources>
- **Open Loops**: <blockers, missing inputs, items needing tool access>
- **Recommended Next Skill**: <as specified in the skill's own contract>
- **Scores** (if applicable):
  - CITE: C:<n>/100 I:<n>/100 T:<n>/100 E:<n>/100 | Overall: <n>/100 | Verdict: TRUSTED/CAUTIOUS/UNTRUSTED
  - CORE-EEAT: C:<n> O:<n> R:<n> E:<n> Exp:<n> Ept:<n> A:<n> T:<n> | GEO:<n>/100 SEO:<n>/100
  - Technical score: <n>/10
  - On-page score: <n>/10

## Full Findings

<complete skill output — all findings, tables, recommendations, action items>
```

4. Announce: `✓ Step N complete — saved to <path>`

### BLOCKED Handling

If a skill returns BLOCKED status:
- Write the handoff file with `status: BLOCKED` and record the block reason in `Key Findings`
- Continue to the next step — do not halt
- Overall analysis status: DONE_WITH_CONCERNS if ≤5 skills blocked; BLOCKED only if >10 skills blocked

### Step 21: HTML Report Generation

After all 20 skill steps complete, generate the HTML report. Write a single self-contained HTML file to `analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html`.

The report must:
- Embed all CSS in a `<style>` block (no external CDN links)
- Use vanilla JS only (≤50 lines) for tab switching
- Display all findings from the 20 handoff files, organized by phase
- Include color-coded scores (green ≥80, amber 60–79, red <60)
- Show CITE verdict and CORE-EEAT scores in the executive summary
- List a prioritized 90-day action plan (P0/P1/P2/P3)

**HTML structure:**
```
<html>
  <head><style>[dark mode CSS — #0d1117 bg, #161b22 cards, #e6edf3 text]</style></head>
  <body>
    <header>Company: {company-root} | Domain: {domain} | Analysis: {date} | Library v6.3.0</header>
    <nav>[8 tab buttons: Executive Summary, Domain Baseline, Research, Technical,
          Content Quality, Recommendations, Monitoring, Next Steps]</nav>
    <main>
      [Tab 0] Executive Summary:
        - CITE verdict badge (TRUSTED/CAUTIOUS/UNTRUSTED pill)
        - CORE-EEAT score grid (8 dimensions + GEO + SEO scores)
        - Top 5 critical findings (color-coded by severity)
        - Veto item flags (if any T03/T05/T09 or T04/C01/R10 triggered)
        - Skills completion table (21 rows with status icons)
      [Tab 1–6] One tab per phase — full findings from handoff files, tables, scores
      [Tab 7] Next Steps:
        - 90-day action plan table (Priority P0/P1/P2/P3, Action, Skill, Effort, Impact)
        - Open loops list
        - Analysis metadata (domain, timestamp, tool tier, data confidence)
    </main>
    <script>[tab switching — ~40 lines]</script>
  </body>
</html>
```

**CSS variables to use:**
```css
:root {
  --bg: #0d1117; --surface: #161b22; --border: #30363d;
  --text: #e6edf3; --muted: #8b949e; --accent: #58a6ff;
  --green: #3fb950; --amber: #d29922; --red: #f85149;
}
```

### Step 0 (Final): Promote to Hot Cache

After the HTML report is written, append to `memory/hot-cache.md`:

```markdown
## Company Analysis — <domain> — <date>
- CITE Verdict: <TRUSTED/CAUTIOUS/UNTRUSTED> | Score: <n>/100
- CORE-EEAT GEO Score: <n>/100 | SEO Score: <n>/100
- Veto items: <list or "none">
- Top finding: <single most critical issue>
- Report: analyses/<company-root>/reports/<filename>.html
```

## Validation Checkpoints

### Pre-run
- [ ] Input URL resolved to valid domain
- [ ] Analysis path and report path computed and printed
- [ ] Timestamp captured for consistent file naming

### Post-run
- [ ] All 7 phase subdirs exist with handoff files
- [ ] All 20 skill steps have a handoff file (DONE, DONE_WITH_CONCERNS, or BLOCKED — not missing)
- [ ] HTML report is a single self-contained file (no broken external links)
- [ ] `memory/hot-cache.md` updated with CITE verdict and top finding
- [ ] BLOCKED skills count ≤10 (otherwise flag as overall BLOCKED)

## Next Best Skill

- **Primary**: [memory-management](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/cross-cutting/memory-management/SKILL.md) — integrate the full analysis into the campaign memory loop and set up ongoing tracking.
- **Secondary**: [alert-manager](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/monitor/alert-manager/SKILL.md) — configure monitoring alerts based on the baselines established in this analysis.
