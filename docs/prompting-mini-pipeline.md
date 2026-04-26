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
3. Gets back: `company_name`, `industry`, `business_type`, `products[]`, `industries_served[]`, `hero_queries[]`
4. Saves the full prompt + response to `discovery.json` and logs the call in `prompt-results.json`

`hero_queries` in LLM mode are **complete long-tail buyer search queries** (5-10 words), not product labels. The LLM is instructed to generate what a procurement manager would type in Google — including product specifics, geography, industry, and compliance terms. Example output for caplinq.com:
```
"conductive plastics supplier for electronics industry"
"die attach materials distributor in Europe"
"specialty chemicals for electrochemical applications"
```
These are used directly as hero queries with no template substitution.

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

12-13 queries are generated per run:
- **Brand** (3): based on company name — always `"What is {company}?"`, `"{company} company overview"`, `"{company} reviews"`
- **Industry** (4): 2 business-type template queries + up to 2 customer-specific variants using `industries_served` (e.g. `"specialty chemicals and plastics supplier for electronics manufacturing"`)
- **Hero** (up to 6): long-tail buyer search queries from LLM discovery (used directly), or template variants of entity-handoff keywords

`query-generation.json` records `hero_query_source: "llm_direct_long_tail"` or `"entity_handoff_templates"` so you always know how queries were built.

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

## Claude Code Prompts vs Script Prompts

`prompt-results.json` can contain two categories of entries:

**Script prompts** (`engine: openai / anthropic / gemini`) — direct API calls made by the Node.js script. These are always present: 1 discovery call + up to 39 citation-check calls (13 queries × 3 engines). These are the structured, auditable prompts with tokens, cost, and duration.

**Claude Code prompts** (`source: claude_code`) — WebSearch or WebFetch calls that the AI assistant (Claude Code) makes during a conversation. These are ad-hoc and only appear when:
1. An interactive `analyze-company` session is running (not a standalone script invocation)
2. The `.analysis-session.json` file exists pointing to the analysis directory
3. The hook in `.claude/settings.json` fires after each `WebFetch|WebSearch` tool use

`run-citation-baseline.js` now calls `startAnalysisSession()` at startup and `endAnalysisSession()` on exit. This means if you run the script from within a Claude Code conversation where Claude is also doing web searches, those searches are captured in the same `prompt-results.json`.

### Why Claude Code prompts are 0 in standalone runs

When you execute `node tools/scripts/run-citation-baseline.js`, Claude Code (the AI) is not searching for anything. The script makes direct HTTP calls to AI engine APIs. No Claude Code tools fire. The PostToolUse hook only fires when Claude Code's own `WebSearch` or `WebFetch` tools are invoked during a conversation.

### When Claude Code prompts appear

Run `analyze-company caplinq.com` interactively. During the analysis, Claude Code will typically:
- WebFetch the domain's homepage, about page, sitemap (entity-optimizer)
- WebSearch for SERP positions (rank-tracker, serp-analysis)
- WebSearch for brand mentions (domain-authority-auditor)
- WebFetch page content for auditing (on-page-seo-auditor, content-quality-auditor)

Each of those tool calls fires the hook and appends a `claude_code` entry to `prompt-results.json`. Note: no skill explicitly instructs WebSearch/WebFetch — these are ad-hoc judgment calls Claude makes during Tier 1 (no SEO tool integrations) analysis.

### Full Pipeline Web Search Map

| Skill | Instructs WebSearch/WebFetch? | When Claude searches ad-hoc |
|---|---|---|
| `entity-optimizer` | No (uses `~~AI monitor` or manual data) | WebFetch homepage, about, sitemap |
| `competitor-analysis` | No (uses `~~SEO tool`) | WebSearch competitor rankings |
| `serp-analysis` | Allowed, not instructed | WebSearch target keyword SERPs |
| `content-gap-analysis` | No (uses `~~SEO tool`) | WebSearch content topics |
| `keyword-research` | No (uses `~~SEO tool`) | WebSearch related keyword data |
| `on-page-seo-auditor` | Allowed, not instructed | WebFetch target pages |
| `technical-seo-checker` | No | WebFetch robots.txt, sitemap |
| `backlink-analyzer` | No (uses `~~link database`) | WebSearch backlink data |
| `rank-tracker` | No (uses `~~SEO tool`) | WebSearch rank positions |
| `domain-authority-auditor` | No | WebSearch brand/domain mentions |
| `content-quality-auditor` | No | WebFetch content being audited |

All skills work at Tier 1 (no integrations) by accepting manual data. Claude's ad-hoc searches are supplementary and vary per run.

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
