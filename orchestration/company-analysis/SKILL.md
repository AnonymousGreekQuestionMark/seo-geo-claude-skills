---
name: company-analysis
description: 'Full-company SEO/GEO audit: runs all 20 skills in sequence for a domain, saves organized results to analyses/, and generates a self-contained HTML report with prompt appendix.'
version: "1.4.0"
license: Apache-2.0
compatibility: "Claude Code ≥1.0, skills.sh marketplace, ClawHub marketplace. No system packages required. Optional: MCP network access for SEO tool integrations."
homepage: "https://github.com/aaron-he-zhu/seo-geo-claude-skills"
when_to_use: "Use when a full end-to-end SEO and GEO analysis of a company domain is needed. Runs all 20 skills in a fixed sequence and produces organized markdown output plus an HTML report. Trigger when user provides a company URL and asks for a complete analysis, full audit, company-wide review, or wants to analyze everything about a domain."
argument-hint: "<domain e.g. caplinq.com>"
metadata:
  author: AAR AI
  version: "1.4.0"
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
    - "/geo:analyze-company"
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
- User invokes `/geo:analyze-company <domain>` command
- User says "analyze everything", "run all skills", or "do a full audit" with a domain
- Starting a new company engagement and need a complete baseline

## Quick Start

```
/geo:analyze-company caplinq.com
/geo:analyze-company blog.caplinq.com
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
9. Concerns log  = analyses/<company-root>/concerns-log-<timestamp>.md
```

## Execution Plan

Run each skill in order. After each skill, save its handoff summary to the designated file. If a skill returns BLOCKED, record the block reason and continue to the next skill — do not halt the entire analysis.

```
Phase 01 — Domain Baseline
  Step  1: entity-optimizer          → 01-domain-baseline/entity-optimizer-handoff.md
  Step 1.5: citation-baseline        → 01-domain-baseline/citation-baseline-handoff.md

Phase 02 — Research
  Step  2: keyword-research          → 02-research/keyword-research-handoff.md
  Step  3: competitor-analysis       → 02-research/competitor-analysis-handoff.md
  Step  4: serp-analysis             → 02-research/serp-analysis-handoff.md
  Step  5: content-gap-analysis      → 02-research/content-gap-analysis-handoff.md

Phase 03 — Technical + CITE
  Step  6: technical-seo-checker     → 03-technical/technical-seo-handoff.md
  Step  7: on-page-seo-auditor       → 03-technical/on-page-seo-handoff.md
  Step  8: internal-linking-optimizer → 03-technical/internal-linking-handoff.md
  Step  9: backlink-analyzer         → 03-technical/backlink-handoff.md
  Step 10: domain-authority-auditor  → 03-technical/domain-authority-handoff.md

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

Step 21 — Reports & Finalization
  Step 21.1-4: HTML Report generation
  Step 21.5: Concerns log generation
  Step 21.6: Score provenance generation
  Step 21.7: Execution status generation
  Step 21.8: PDF Report generation (REQUIRED - comprehensive audit trail)
  → analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html
  → analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.pdf
```

## Instructions

### Step 0: Setup

Before executing any skills:
1. Parse the input URL using the URL Parsing Logic above
2. Print the resolved paths: `Analysis: analyses/<company-root>/<domain>/analysis-<timestamp>/` and `Report: analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html`
3. Note the timestamp so all files use the same value throughout the run
4. Announce: "Starting 21-step company analysis for `<domain>`. Running skills in sequence — this will take several minutes."

### Step 0.5: Initialize Analysis Logs

Create the following files in `analyses/<company-root>/<domain>/analysis-<timestamp>/`:

**1. operations-log.json** — Comprehensive execution log

```json
{
  "analysis_metadata": {
    "domain": "<domain>",
    "timestamp": "<timestamp>",
    "started_at": "<ISO timestamp>",
    "completed_at": null,
    "duration_seconds": null,
    "version": "1.0.0"
  },
  "environment": {
    "node_version": "<version>",
    "platform": "<platform>",
    "limit_anthropic": true
  },
  "api_availability": {
    "anthropic": true,
    "openai": true,
    "gemini": false,
    "perplexity": false
  },
  "steps": [],
  "tool_calls": [],
  "file_operations": [],
  "errors": [],
  "warnings": [],
  "metrics": {
    "total_api_calls": 0,
    "by_engine": {},
    "total_tokens_estimated": 0,
    "total_webfetch_calls": 0,
    "total_file_writes": 0,
    "total_file_reads": 0
  }
}
```

Throughout the analysis, log:
- **Step events**: `logStepStart(step, skill)` and `logStepComplete(step, status, details)`
- **Tool calls**: `logToolCall({ step, skill, tool, engine, duration_ms, success, error })`
- **File operations**: `logFileOperation({ step, operation, path, success })`
- **Errors**: `logError({ step, skill, type, message, recoverable })`
- **Warnings**: `logWarning({ step, skill, message, context })`
- **LIMIT_ANTHROPIC events**: `logAnthropicLimited(step, query)`

At analysis end, call `finalizeOperationsLog(overallStatus)` to:
- Calculate duration and write `completed_at`
- Generate `operations-log.md` summary

**2. prompt-results.json** — AI prompt/response log

Create `analyses/<company-root>/<domain>/analysis-<timestamp>/prompt-results.json` with initial structure:

```json
{
  "analysis_metadata": {
    "domain": "<domain>",
    "timestamp": "<timestamp>",
    "tier": 1,
    "version": "6.5.0"
  },
  "prompt_results": [],
  "webfetch_calls": [],
  "summary": null
}
```

Throughout the analysis:
- After each MCP tool call that queries LLMs (check_citations, compare_competitor_citations, get_ai_response_format, track_citation_snapshot), append to `prompt_results[]` with: `step`, `skill`, `tool`, `timestamp_utc`, `engine`, `model`, `live_search`, `prompt` (type, query, domain), `response` (full_text, excerpt, word_count, citations, domain_cited)
- After each WebFetch call, append to `webfetch_calls[]` with: `step`, `skill`, `url`, `timestamp_utc`, `status`, `content_type`, `response_length`
- If MCP tool returns tier1Manual fallback, log with `source: "manual_required"`

At the end of the analysis (before HTML report generation), compute and write the `summary` object with `total_llm_calls`, `by_engine` counts, `total_webfetch_calls`, and `total_tokens_estimated`.

### Step 1.5: Citation Baseline & Prominence Testing

This step combines citation baseline with prominence testing across three query types:

**1. Extract hero keywords from entity-optimizer**

Read `01-domain-baseline/entity-optimizer-handoff.md` to extract:
- Company name and industry
- Products and services (top 5 each)
- Hero keywords (explicit or derived from products/services)

**2. Generate queries across three types:**

| Query Type | Count | Template Examples |
|------------|-------|-------------------|
| Brand | 3 | "What is {company}?", "{company} company overview" |
| Industry | 4 | "Best {industry} suppliers", "Top {industry} companies" |
| Hero | 6 | "Best {product} suppliers", "{product} comparison" |

**3. Run citation checks with prominence tracking**

Call `mcp__ai-citation-monitor__check_citations` with:
- All 13 queries (brand + industry + hero)
- Pass `analysisPath` to save all prompts to `prompt-results.json`
- Pass `query_type` for each query batch

For each engine response, track:
- `domain_cited`: Was domain mentioned?
- `is_primary`: Was domain mentioned in first 200 chars (primary/prominent position)?

**4. Calculate C06 Citation Prominence**

```
C06 = (primary citations / total citations) * 100
PASS if >= 50% | PARTIAL if >= 25% | FAIL otherwise
```

**5. Save results**

Save the full result to `01-domain-baseline/citation-baseline-handoff.md` with:
- Results by query type (brand vs industry vs hero)
- C05 (citation frequency) and C06 (prominence) scores
- C07 (cross-engine) and C08 (sentiment) scores

Also write a compact summary to `memory/hot-cache.md` under key `citation_baseline`:
```
citation_baseline: { cited_on: N/13 queries, engines: [...], by_type: { brand: N, industry: N, hero: N }, prominence_rate: N% }
```

**Prompt logging**: All prompts automatically saved via `analysisPath` parameter. Expected: 39–52 prompts (13 queries × 3–4 engines).

**LIMIT_ANTHROPIC**: When `LIMIT_ANTHROPIC=true` (default), Anthropic runs once per step, not per query. Other engines (OpenAI, Gemini) run on all queries.

The domain-authority-auditor (step 10) reads this from hot-cache to score CITE C05–C08 with real measured data. If `ai-citation-monitor` is not connected, mark step 1.5 as DONE_WITH_CONCERNS and continue.

### Step 16: schema-markup-generator (run site-wide audit mode first)

When executing as part of company-analysis, run schema-markup-generator in **Site-Wide Audit Mode** before generating per-page schema. This produces `schema_audit.coverage_pct` in hot-cache for CITE-I04. Then generate per-page schema for the homepage and 2–3 key content pages.

### Step 10: domain-authority-auditor (CITE synthesis step)

domain-authority-auditor runs **after** its primary data feeders. Before scoring, read the following from hot-cache / prior handoff files:
- **CITE C/T dimensions**: from step 9 (backlink-analyzer) — toxic links → C10, referring domains → C02, anchor diversity → C04, link naturalness → T01/T02
- **CITE T07/T08/T09**: from step 6 (technical-seo-checker) — HTTPS cert, tech freshness, penalty signals
- **CITE C05–C08 (AI citations)**: from step 1.5 (citation-baseline)
- **CITE I04 (schema coverage)**: from step 16 (schema-markup-generator site-wide audit) — not available at step 10; note as "pending schema audit"

Import these values directly rather than re-fetching. Only independently score CITE items that have no upstream feeder.

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
- **Maps to**: <CITE and/or CORE-EEAT item IDs this skill's findings feed — e.g., "CITE C02/C04/C10, CORE A01">
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

### Fallback Mechanism (Ensure All Handoff Files Created)

Every step MUST produce a handoff file regardless of data availability. Use this tiered fallback approach:

| Tier | Data Source | When to Use |
|------|-------------|-------------|
| **Tier 3** | Paid APIs (DataForSEO, Ahrefs, SEMrush) | MCP tools connected with valid keys |
| **Tier 2** | Free APIs (PageSpeed, Wikidata, Serper free tier) | MCP tools connected, free tier available |
| **Tier 1** | WebFetch + AI analysis | No API access, analyze fetched HTML/data |
| **Tier 0** | Manual guidance | Cannot fetch data, return instructions for user |

**Handoff must include `data_source` field:**

```markdown
---
skill: backlink-analyzer
data_source: tier1_webfetch
fallbacks_used:
  - "DataForSEO unavailable → used WebFetch of MOZ free checker"
  - "Referring domains estimated from homepage link analysis"
---
```

**Fallback examples per skill:**

| Step | Skill | Tier 3 | Tier 2 | Tier 1 | Tier 0 |
|------|-------|--------|--------|--------|--------|
| 1 | entity-optimizer | Wikidata API | WebFetch Wikidata | WebFetch homepage + LLM | "Search Wikidata manually" |
| 6 | technical-seo-checker | PageSpeed API | WebFetch PageSpeed | WebFetch HTML, estimate CWV | "Run PageSpeed Insights manually" |
| 9 | backlink-analyzer | DataForSEO/Ahrefs | Open PageRank API | WebFetch MOZ free checker | "Use Ahrefs free backlink checker" |
| 17 | rank-tracker | DataForSEO SERP | Serper API | WebFetch SERPs | "Check rankings manually in incognito" |

**Key rules:**
1. NEVER skip writing a handoff file — write it with whatever data obtained
2. Log fallbacks used in `operations-log.json` via `logWarning()`
3. Mark items as `confidence: LOW` when using Tier 1/0 data
4. Track `data_source` in `execution-status.json` for audit trail

### Step 21: HTML Report Generation

After all 20 skill steps complete, generate the HTML report. Write a single self-contained HTML file to `analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.html`.

The report must:
- Embed all CSS in a `<style>` block (no external CDN links)
- Use vanilla JS only (≤50 lines) for tab switching
- Display all findings from the 20 handoff files, organized by phase
- Include color-coded scores (green ≥80, amber 60–79, red <60)
- Show CITE verdict and CORE-EEAT scores in the executive summary
- List a prioritized 90-day action plan (P0/P1/P2/P3)
- **Exclude all concern-related content** — no DONE_WITH_CONCERNS, BLOCKED, Open Loops, or data gaps
- Add `data-tooltip` attributes on section `<h2>` headers (see [report-content-descriptions.md](./references/report-content-descriptions.md))
- Include a 2-line intro paragraph at the start of each tab panel using business language

**HTML structure:**
```
<html>
  <head><style>[dark mode CSS — #0d1117 bg, #161b22 cards, #e6edf3 text]</style></head>
  <body>
    <header>Company: {company-root} | Domain: {domain} | Analysis: {date} | Library v6.5.0</header>
    <nav>[9 tab buttons: Executive Summary, Domain Baseline, Research, Technical,
          Content Quality, Recommendations, Monitoring, Prompt Appendix, Next Steps]</nav>
    <main>
      [Tab 0] Executive Summary:
        - CITE verdict badge (TRUSTED/CAUTIOUS/UNTRUSTED pill)
        - CORE-EEAT score grid (8 dimensions + GEO + SEO scores)
        - Top 5 critical findings (color-coded by severity)
        - Veto item flags (if any T03/T05/T09 or T04/C01/R10 triggered)
        - Skills completion table (columns: Step, Skill, Phase — NO status column)
        - Exclude BLOCKED skills from table; only show completed skills
        - Show "N skills completed" summary (no status breakdown)
      [Tab 1–6] One tab per phase — full findings from handoff files, tables, scores
      [Tab 7] Prompt Appendix:
        - Summary: "Total: {N} LLM calls across {M} engines"
        - Collapsible sections by engine (Perplexity, Anthropic, OpenAI, Gemini)
        - Each section shows: query, full response, citation findings (domain cited, count)
        - WebFetch calls table (Step, Skill, URL, Status, Size)
        - Read from prompt-results.json generated during analysis
      [Tab 8] Next Steps:
        - 90-day action plan table (Priority P0/P1/P2/P3, Action, Skill, Effort, Impact)
        - Analysis metadata (domain, timestamp, data confidence)
        - NO Open Loops section (concerns go to separate concerns log)
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

/* PROMPT APPENDIX (Tab 7) */
details.engine-section { margin: 12px 0; border: 1px solid var(--border); border-radius: 6px; }
details.engine-section summary { padding: 10px 14px; cursor: pointer; font-weight: 600; background: var(--surface2); border-radius: 6px; }
details.engine-section[open] summary { border-radius: 6px 6px 0 0; border-bottom: 1px solid var(--border); }
.prompt-result { padding: 12px; border-bottom: 1px solid var(--border); }
.prompt-result:last-child { border-bottom: none; }
.prompt-label { font-size: 11px; color: var(--muted); text-transform: uppercase; margin: 8px 0 4px; }
.prompt-box, .response-box { background: var(--surface2); padding: 10px; border-radius: 4px; white-space: pre-wrap; max-height: 300px; overflow-y: auto; font-size: 12px; font-family: monospace; }
.findings { font-size: 12px; color: var(--muted); padding-top: 8px; margin-top: 8px; border-top: 1px dashed var(--border); }

/* SECTION TOOLTIPS */
[data-tooltip] { position: relative; cursor: help; border-bottom: 1px dashed var(--muted); }
[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute; left: 0; top: 100%; margin-top: 4px;
  background: var(--surface); border: 1px solid var(--border);
  padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 400;
  max-width: 320px; white-space: normal; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.section-intro { color: var(--muted); font-size: 14px; margin: 0 0 20px; line-height: 1.5; }

/* PRINT / PDF MODE */
@media print {
  :root { --bg: #ffffff; --surface: #f6f8fa; --surface2: #f0f2f5; --border: #d0d7de; --text: #1f2328; --muted: #656d76; }
  body { background: var(--bg); color: var(--text); }
  .tab-panel { display: block !important; page-break-after: always; }
  nav#tabs { display: none; }
  [data-tooltip]:hover::after { display: none; }
  details.engine-section { break-inside: avoid; }
  details.engine-section[open] { break-inside: auto; }
}
```

### Step 21.5: Concerns Log Generation

After the HTML report is written, generate a concerns log at `analyses/<company-root>/concerns-log-<timestamp>.md`. This file documents all operational concerns, data gaps, and fallbacks separately from the client-facing HTML report.

The concerns log must:
1. Use frontmatter with: `company-root`, `domain`, `timestamp`, `generated-by`, `version`
2. Include Executive Summary with counts (Total, DONE, DONE_WITH_CONCERNS, BLOCKED)
3. Organize concerns by Phase (01-07)
4. For each skill with DONE_WITH_CONCERNS or BLOCKED status:
   - List status and Open Loops verbatim from handoff file
   - Note data source limitations
   - Note fallbacks used
5. Include a Blocked Skills section (or "No skills were blocked" if none)
6. Include Recommendations for Resolution table (priority, action, affected skills)
7. Include Analysis Metadata section with paths to handoff files and HTML report

**Concerns log structure:**
```markdown
---
company-root: <company-root>
domain: <domain>
timestamp: <timestamp>
generated-by: company-analysis orchestration
version: 1.0.0
---

# Concerns Log - <domain>

> Generated: <date>

## Executive Summary
| Metric | Count |
|--------|-------|
| Total Skills | 21 |
| DONE | N |
| DONE_WITH_CONCERNS | N |
| BLOCKED | N |

**Overall Status**: <status>

---

## Phase NN - <Phase Name>

### <skill-name>
- **Status**: DONE_WITH_CONCERNS | BLOCKED
- **Open Loops**: <verbatim from handoff>
- **Data Source Limitations**: <what API/tool was missing>
- **Fallbacks Used**: <what was used instead>

---

## Blocked Skills
[List blocked skills with reasons, or "No skills were blocked in this analysis."]

---

## Recommendations for Resolution
| Priority | Action | Skills Affected |
|----------|--------|-----------------|
| P0 | ... | ... |

---

## Analysis Metadata
- **Tool Tier**: Tier 1/2/3
- **Handoff Files**: analyses/<company-root>/<domain>/analysis-<timestamp>/
- **HTML Report**: analyses/<company-root>/reports/<filename>.html
```

### Step 21.6: Score Provenance Generation

After the concerns log, generate `analyses/<company-root>/<domain>/analysis-<timestamp>/score-provenance.json`. This file provides full auditability by tracing every CITE and CORE-EEAT score to its source data.

**Structure:**
```json
{
  "analysis_metadata": {
    "domain": "<domain>",
    "timestamp": "<timestamp>",
    "version": "1.2.0"
  },
  "cite_provenance": {
    "overall": { "score": 52, "verdict": "CAUTIOUS" },
    "dimensions": {
      "C": {
        "score": 55,
        "items": [
          {
            "id": "C02",
            "name": "Referring Domain Count",
            "score": 60,
            "source_skill": "backlink-analyzer",
            "source_step": 9,
            "raw_data": "234 referring domains",
            "calculation": "234 RDs → 60/100 (threshold: 500+ for 80+)"
          },
          {
            "id": "C05",
            "name": "AI Citation Frequency",
            "score": 40,
            "source_skill": "citation-baseline",
            "source_step": 1.5,
            "raw_data": "cited on 3/10 queries",
            "calculation": "3/10 = 30% citation rate → 40/100"
          }
        ]
      },
      "I": { "score": 35, "items": [...] },
      "T": { "score": 65, "items": [...] },
      "E": { "score": 52, "items": [...] }
    }
  },
  "core_eeat_provenance": {
    "geo_score": 69,
    "seo_score": 69,
    "dimensions": {
      "C": {
        "score": 72,
        "items": [
          {
            "id": "C01",
            "name": "Search Intent Alignment",
            "score": 75,
            "source_skill": "on-page-seo-auditor",
            "source_step": 7,
            "raw_data": "3/4 pages align with transactional intent",
            "calculation": "75% alignment → 75/100"
          }
        ]
      },
      "O": { "score": 78, "items": [...] },
      "R": { "score": 65, "items": [...] },
      "E": { "score": 62, "items": [...] },
      "Exp": { "score": 80, "items": [...] },
      "Ept": { "score": 82, "items": [...] },
      "A": { "score": 55, "items": [...] },
      "T": { "score": 60, "items": [...] }
    }
  },
  "feeder_chain": [
    { "target": "CITE C02/C04/C10/T01/T02", "source": "backlink-analyzer (step 9)" },
    { "target": "CITE T07/T08/T09", "source": "technical-seo-checker (step 6)" },
    { "target": "CITE C05-C08", "source": "citation-baseline (step 1.5)" },
    { "target": "CITE I04", "source": "schema-markup-generator (step 16)" },
    { "target": "CORE C01-C10/O01-O10/R01-R10/E01-E10", "source": "on-page-seo-auditor (step 7)" },
    { "target": "CORE Exp/Ept", "source": "entity-optimizer (step 1)" },
    { "target": "CORE A/T (org-level)", "source": "domain-authority-auditor (step 10)" }
  ]
}
```

For each scored item:
1. Read the "Maps to:" field from the source skill's handoff file
2. Extract the raw data point that produced the score
3. Document the calculation/threshold used

If a score was estimated (no feeder data available), mark `source_skill: "estimated"` and note the estimation method in `calculation`.

### Step 21.7: Execution Status Generation

Generate `analyses/<company-root>/<domain>/analysis-<timestamp>/execution-status.json` and `execution-status.md` with:

**Structure:**
```json
{
  "analysis_metadata": { "domain": "...", "timestamp": "...", "version": "2.0.0" },
  "handoff_status": { /* per-phase handoff file presence */ },
  "skill_execution": [ { "step": 1, "skill": "...", "status": "...", "items_scored": [...] } ],
  "item_status": {
    "CITE": { "C01": { "status": "PASS", "score": 80, "source": "...", "is_veto": false } },
    "CORE_EEAT": { "C01": { "status": "PASS", "score": 85, "source": "...", "is_veto": true } }
  },
  "summary": {
    "cite": { "pass": 25, "partial": 10, "fail": 3, "pending": 2, "total": 40 },
    "core_eeat": { "pass": 50, "partial": 20, "fail": 8, "pending": 2, "total": 80 },
    "vetoes_triggered": [],
    "critical_gaps": [],
    "total_prompts_saved": 150
  },
  "scores": { "cite_overall": 68, "cite_verdict": "CAUTIOUS", "geo_score": 72, "seo_score": 70 }
}
```

The Markdown version (`execution-status.md`) provides a human-readable summary with tables for quick review.

### Step 21.8: PDF Report Generation

After the HTML report is generated, create a PDF version at `analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.pdf`.

The PDF report is the **most comprehensive deliverable** — a full audit trail with all 120 framework items. The HTML report provides an executive summary for interactive browsing.

**PDF vs HTML:**
| Aspect | HTML | PDF |
|--------|------|-----|
| Scores | Summary only | ALL 40 CITE + 80 CORE-EEAT items with raw data |
| Prompts | 5 samples per engine | ALL 148-200 prompts with full responses |
| llms.txt | Status only | Full audit table + robots.txt analysis |
| Veto Items | Badge only | Detailed analysis and implications |
| Execution | Tab-based | Full skill-by-skill log |

**Appendix sections (PDF only):**

| Appendix | Content | Source |
|----------|---------|--------|
| A. Raw Data Links | Relative paths to all 20 handoff files + descriptions | `analysis-<timestamp>/` directory |
| B. Prompts & Responses | ALL AI queries and responses (148-200 per prompting-documentation.md) | `prompt-results.json` |
| C. Score Provenance (All 120 Items) | Full CITE table (40 rows) + CORE-EEAT table (80 rows) with raw data, thresholds, calculations | `score-provenance.json` |
| D. AI Discoverability (llms.txt) | llms.txt audit, llms-full.txt status, robots.txt AI crawler analysis | `score-provenance.json`.technical_data |
| E. Execution Status | Skill execution log, handoff status, item-level pass/fail/skip | `execution-status.json` |

**PDF generation method:**
1. Read the generated HTML report
2. Load `score-provenance.json`, `prompt-results.json`, `execution-status.json`
3. Build comprehensive appendix HTML with full 120-item tables
4. Apply print-mode CSS (triggers `@media print` styles)
5. Inject appendix sections after the Next Steps content
6. Render to PDF using puppeteer (A4 format, 1cm margins)
7. Ensure page breaks at section boundaries (~20-30 pages for full audit)

**REQUIRED ACTION**: After HTML report generation, you MUST generate the PDF by calling:
```javascript
import { generatePdfFromHtml } from './tools/shared/pdf-generator.js';
await generatePdfFromHtml(htmlReportPath, pdfReportPath, { scoreProvenance, promptResults, executionStatus });
```

The PDF is the comprehensive audit deliverable. The analysis is NOT complete until both HTML and PDF reports exist.

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
- [ ] All handoff files include "Maps to:" field listing CITE/CORE-EEAT items fed
- [ ] HTML report is a single self-contained file (no broken external links)
- [ ] HTML report contains NO concern-related content (no DONE_WITH_CONCERNS, BLOCKED, Open Loops, or status column)
- [ ] HTML report skills table excludes BLOCKED skills
- [ ] HTML report section headers have `data-tooltip` attributes
- [ ] HTML report tab panels have intro paragraphs with `.section-intro` class
- [ ] PDF report exists alongside HTML report (same filename, `.pdf` extension)
- [ ] PDF report has Appendix A (raw data links), B (prompts), C (provenance), D (llms.txt), E (execution status)
- [ ] `prompt-results.json` exists with all LLM calls logged (~150 entries)
- [ ] `score-provenance.json` exists with all 120 items traced to source data
- [ ] `execution-status.json` and `execution-status.md` exist with pass/fail per item
- [ ] `operations-log.json` and `operations-log.md` exist with full execution trace
- [ ] `concerns-log-<timestamp>.md` exists at company root level (`analyses/<company-root>/`)
- [ ] Concerns log contains all Open Loops from handoff files with DONE_WITH_CONCERNS or BLOCKED status
- [ ] `memory/hot-cache.md` updated with CITE verdict and top finding
- [ ] BLOCKED skills count ≤10 (otherwise flag as overall BLOCKED)
- [ ] GEO and SEO scores are NOT N/A (content-quality-auditor updated provenance)

## Next Best Skill

- **Primary**: [memory-management](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/cross-cutting/memory-management/SKILL.md) — integrate the full analysis into the campaign memory loop and set up ongoing tracking.
- **Secondary**: [alert-manager](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/monitor/alert-manager/SKILL.md) — configure monitoring alerts based on the baselines established in this analysis.
