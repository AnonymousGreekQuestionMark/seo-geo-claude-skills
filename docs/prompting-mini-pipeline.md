# Prompting Mini-Pipeline

Standalone AI citation testing module that runs the prompting-only parts of a full company analysis without any SEO checks. Produces a lean summary of every AI call made, including cost and timing.

## Overview

The mini-pipeline does three things in sequence:

1. **Discovery** — determines the company profile (name, industry, business type, hero keywords)
2. **Query generation** — builds contextually appropriate query batches using business-type-aware templates
3. **Citation check** — runs all queries against configured AI engines and writes two output files

## How to Run

```bash
# No prior entity run — fetches homepage and uses gpt-4o-mini for discovery:
node tools/scripts/run-citation-baseline.js caplinq.com ./analyses/caplinq/caplinq.com/analysis-$(date +%Y%m%dT%H%M%S)

# With a prior entity-optimizer run — reads handoff markdown directly:
node tools/scripts/run-citation-baseline.js caplinq.com \
  ./analyses/caplinq/caplinq.com/analysis-$(date +%Y%m%dT%H%M%S) \
  ./analyses/caplinq/caplinq.com/analysis-20260413T120000/01-domain-baseline/entity-optimizer-handoff.md
```

API keys are loaded from `.env` in the project root.

## Discovery Phase

The script needs a company profile before it can generate meaningful queries. It checks two sources in order:

### Source 1: Entity-Optimizer Handoff (preferred)

If `01-domain-baseline/entity-optimizer-handoff.md` exists (from a prior `analyze-company` run), the script reads it with `extractHeroKeywords()` and parses:
- Company name (from H1 or "Company:" line)
- Industry (from "Industry:" or "Sector:" line)
- Products and services (bullet lists)
- Hero keywords (explicit section, or derived from products/services)
- Business type (from "Business Type:" line, or inferred from industry text)

### Source 2: LLM Homepage Extraction (fallback)

If no handoff exists, the script:
1. Fetches `https://{domain}` (first 16 KB of HTML)
2. Calls `gpt-4o-mini` with a structured extraction prompt
3. Gets back: `company_name`, `industry`, `business_type`, `products[]`, `hero_keywords[]`
4. Saves the full prompt + response to `discovery.json` and logs the call in `prompt-results.json`

## Business-Type Query Templates

Industry and hero queries are NOT generic "best {industry} suppliers" for all companies. They are selected based on `business_type`:

| `business_type` | Industry queries use | Hero queries use |
|---|---|---|
| `distributor` | "distributors", "supplier comparison", "where to buy" | "{keyword} distributor comparison" |
| `manufacturer` | "manufacturers", "OEMs", "producers" | "{keyword} manufacturer", "production comparison" |
| `saas_software` | "software", "tools", "platform comparison", "SaaS solutions" | "{keyword} tool", "software review" |
| `agency_service` | "agencies", "firms", "service providers", "consultants" | "{keyword} agency", "consulting firms" |
| `ecommerce_retail` | "buy online", "store", "retailer comparison" | "buy {keyword}", "online store review" |
| `media_content` | "publications", "websites", "media comparison", "blogs" | "{keyword} blog", "newsletter" |
| `generic` (fallback) | "companies", "providers", "comparison", "solutions" | "{keyword}", "comparison" |

Brand queries are always the same regardless of type: `"What is {company}?"`, `"{company} company overview"`, `"{company} reviews"`.

`business_type` is detected from the entity-optimizer handoff ("Business Type:" field) or inferred by keyword matching against the industry string (e.g. "software" → `saas_software`, "distributor" → `distributor`).

## Query Batches

13 queries are generated per run:
- **Brand** (3): based on company name
- **Industry** (4): based on industry phrase + business-type templates
- **Hero** (6): 2 template variants × top 3 hero keywords

Each batch is run as a separate `runCitationBaseline()` call with its own step tag (`1.5-brand`, `1.5-industry`, `1.5-hero`). This allows `LIMIT_ANTHROPIC` to apply once per batch rather than once per query — Anthropic runs 3 times total (once per batch) when the limit is on.

## Output Files

All files are written to `<analysisPath>/`:

| File | Written when | Contents |
|---|---|---|
| `discovery.json` | Fallback mode only | Homepage HTML length, full LLM prompt, extracted profile |
| `query-generation.json` | Always | Discovery source, business_type, extracted profile, query batches used, total query count |
| `prompt-results.json` | Always | Full per-call data: every engine call with tokens, raw response, duration, cost |
| `prompt-summary.json` | Always | Lean summary — **see schema below** |
| `score-provenance.json` | Always | CITE C05/C06/C07 scores from citation results |

### `prompt-summary.json` Schema

```json
{
  "run_at": "2026-04-26T18:52:23.000Z",
  "domain": "caplinq.com",
  "total_prompts": 40,
  "total_cost_usd": 0.618132,
  "total_duration_ms": 501635,
  "by_engine": { "openai": 14, "gemini": 13, "anthropic": 13 },
  "prompts": [
    {
      "engine": "openai",
      "model": "gpt-4o-mini",
      "query_type": "brand",
      "prompt": "What is Caplinq?",
      "result": "...full response text...",
      "domain_mentioned": false,
      "websites_cited": ["https://caplinq.com"],
      "duration_ms": 1823,
      "cost_usd": 0.000082
    }
  ]
}
```

`domain_mentioned` is `true` when the domain string (e.g. `caplinq.com`) appears in the response text or citation URLs.

## Claude Code WebSearch Capture

During any Claude Code session, the PostToolUse hook in `.claude/settings.json` fires `tools/scripts/log-tool-use.js` after every `WebFetch` or `WebSearch` tool use. Captured calls are appended as `source: "claude_code"` entries to:
- `<analysisPath>/prompt-results.json` — when an analysis session is active (`.analysis-session.json` exists)
- `tools/__tests__/integration/results/claude-code-searches.json` — fallback when no session is active

Each captured entry includes: `type` (web_fetch or web_search), `query` (URL or search string), `response_summary` (first 300 chars), `urls_visited`, `captured_at`, `raw_response`, and `duration_ms: null` (PostToolUse fires after the call, so start time is not available).

## Pricing (April 2026)

Used to compute `cost_usd` per call and `total_cost_usd` in the summary:

| Engine | Input $/1M | Output $/1M |
|---|---|---|
| OpenAI gpt-4o-mini | $0.15 | $0.60 |
| Anthropic claude-sonnet | $3.00 | $15.00 |
| Gemini 2.5 Flash | $0.30 | $2.50 |

Pricing constants live in `tools/shared/pipeline-runner.js` (`PRICING`).

## Key Source Files

| File | Purpose |
|---|---|
| `tools/scripts/run-citation-baseline.js` | Entry point — orchestrates discovery → queries → citation → summary |
| `tools/shared/pipeline-runner.js` | `runCitationBaseline()`, `extractHeroKeywords()`, `generateQueriesFromProfile()`, `writeLeanSummary()`, `QUERY_TEMPLATES`, `PRICING` |
| `tools/scripts/log-tool-use.js` | PostToolUse hook — captures Claude Code's own WebFetch/WebSearch calls |
| `.claude/settings.json` | Hook configuration — `"matcher": "WebFetch|WebSearch"` |
| `tools/__tests__/integration/live-prompting.test.js` | Raw API smoke test (separate from this pipeline — tests one query per engine) |
