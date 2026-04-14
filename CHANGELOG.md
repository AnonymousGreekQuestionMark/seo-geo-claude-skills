# Changelog

All notable changes to this project are documented here. Technical-level descriptions. Every change listed, including minor ones.

---

## [6.5.1] — 2026-04-14

### Sample Analysis Validation

- **Two complete caplinq.com analysis runs** (20260413T120000, 20260414T140000) — Full 21-step execution across all 20 skills with handoff files in 7 phase subdirectories.
- **PDF report validated** — 1,343 KB with full appendix: AI prompts, 120-item score provenance (40 CITE + 80 CORE-EEAT), llms.txt audit, execution status.
- **Score provenance validation** — "CITE items: 40/40, CORE-EEAT items: 80/80, Validation: PASSED".

### tools/scripts/finalize-analysis.js (new file)

- **Automated PDF finalization utility** (~533 lines) — Reads completed analysis directory, validates all required files present, generates PDF from HTML with puppeteer.
- **Exports:** `finalizeAnalysis(analysisPath, options)` for programmatic use.
- **CLI usage:** `node finalize-analysis.js <analysis-path>`.

### references/ (new schemas)

- **prompt-results-schema.json** — JSON Schema defining structure for AI prompt capture (engine, model, timestamp, query, response_excerpt, response_full, domain_cited).
- **score-provenance-schema.json** — JSON Schema defining 120-item provenance structure with CITE (40) and CORE-EEAT (80) items.

### tools/__tests__/e2e/analysis-completion.test.js (new file)

- **E2E validation tests** (~359 lines) — Validates complete analysis runs have all required handoff files, JSON outputs, and report generation.

### Skill Updates

- **content-quality-auditor** (v6.6.0) — Enhanced CORE-EEAT dimension mapping, clearer handoff format.
- **domain-authority-auditor** (v6.4.0) — Improved CITE C/T dimension data flow from feeders.
- **competitor-analysis** (v6.4.0) — Cleaner handoff format with structured competitor profiles.
- **company-analysis** (v1.4.0) — Pipeline step sequencing fixes, concern logging improvements.

---

## [6.5.1-pre] — 2026-04-12

### tools/shared/pipeline-runner.js (new file)

- **Citation baseline automation utility (~340 lines).** Exports `runCitationBaseline(domain, queries, analysisPath)` that executes citation checks across all 3 AI engines (OpenAI, Anthropic, Gemini) and saves each result to `prompt-results.json`.
- **Prompt result persistence:** `savePromptResult(analysisPath, result)` appends each AI query result with engine, model, timestamp, query, response excerpt, response full, domain_cited flag.
- **Score provenance generation:** `generateScoreProvenance(citationResults, technicalResults)` creates CITE C05 (AI Citation Frequency) and C07 (Cross-Engine Consistency) scores from citation baseline data.
- **Summary updates:** `updatePromptSummary(analysisPath)` computes `total_llm_calls`, `by_engine` breakdown, and `total_webfetch_calls`.

### tools/shared/pdf-generator.js

- **Field name fix for prompt results:** Changed `result.prompt?.query` to `result.query || result.prompt?.query` and `result.response?.excerpt` to `result.response_excerpt || result.response?.excerpt` to match the actual data structure from pipeline-runner.

### tools/scripts/ (new directory)

- **run-citation-baseline.js** — Script to run citation baseline and save results for a domain.
- **regenerate-pdf.js** — Script to regenerate PDF from HTML with populated appendix data.

### tools/__tests__/orchestration/pdf-report.test.js

- **Validation functions added:** `validatePromptResults(promptResults)` catches empty `prompt_results` arrays and missing required fields. `validateScoreProvenance(provenance)` catches missing `cite_provenance`, `core_eeat_provenance`, and `feeder_chain`.
- **New tests:** "validatePromptResults catches empty prompt_results", "validateScoreProvenance catches missing cite_provenance", integration tests for validation function exports.

### Full Pipeline Validation

- **PDF appendix verified populated:** 
  - prompt-results.json: 9 entries (3 queries × 3 engines)
  - score-provenance.json: CITE score 80/100 (C05: 80, C07: 80)
  - PDF regenerated: 628.9 KB with populated Appendix B and C

---

## [6.5.0] — 2026-04-12

### orchestration/company-analysis/SKILL.md (v1.2.0 → v1.3.0)

- **Step 21.7 added: PDF Report Generation.** After HTML report, generates a comprehensive PDF at `analyses/<company-root>/reports/<company-root>_<domain>_<timestamp>.pdf`. Includes all 8 sections sequentially (no tabs), 2-line section descriptions, and an Appendix with: A) Raw data links, B) Full AI prompts & responses, C) Score provenance summary.
- **HTML report enhancements:** Added `data-tooltip` attributes on section `<h2>` headers with hover descriptions. Added `.section-intro` paragraphs at start of each tab. Added print CSS for PDF generation (`@media print` with white background, black text).
- **CSS additions:** Tooltip styles (`[data-tooltip]:hover::after`), section intro styles, and print mode overrides.
- **Validation checkpoints updated:** Added checks for tooltips, intro paragraphs, PDF existence, and appendix content.

### orchestration/company-analysis/references/ (new directory)

- **report-content-descriptions.md** — Section descriptions (2-line summaries for PDF, tooltip text for HTML), score threshold explanations in business language.
- **business-language-glossary.md** — Technical → business term mappings (CITE → Domain Authority Score, CORE-EEAT dimensions → plain English).

### tools/shared/pdf-generator.js (new file)

- Puppeteer-based utility (~250 lines) for HTML-to-PDF conversion with appendix injection. Exports `generatePdfFromHtml(htmlPath, pdfPath, options)`. Builds appendix sections for raw data links, prompt results, and score provenance.

### tools/package.json

- **puppeteer ^24.0.0 added** to dependencies for PDF generation.

### tools/__tests__/orchestration/

- **pdf-report.test.js** (new) — Tests PDF requirements, appendix structure, filename format, print CSS, section descriptions.
- **html-report.test.js** — Added tests for tooltip presence, intro paragraphs, print mode CSS.

### tools/shared/config.js

- **Default models updated:**
  - OpenAI: `gpt-4o-mini` → `gpt-4o`
  - Anthropic: `claude-haiku-4-5-20251001` → `claude-sonnet-4-5` (Haiku doesn't support web search tool)
  - Gemini: `gemini-2.0-flash` → `gemini-2.5-flash`

### tools/mcp-servers/ai-citation-monitor.js

- **Web search tool version updated:** `web_search_20250305` → `web_search_20260209` (current Anthropic API version).

### Full Pipeline Validation

- **All 3 AI engines validated with web search:**
  - OpenAI (gpt-4o-search-preview): Working ✓
  - Anthropic (claude-sonnet-4-5 + web_search): Working ✓
  - Gemini (gemini-2.5-flash + Google Search): Working ✓
- **Dynamic exclusion verified:** Perplexity skipped gracefully when API key not provided.
- **DataForSEO fallback verified:** Falls back to OpenPageRank, Google APIs, Serper when credentials missing.
- **caplinq.com analysis executed:** Citation baseline (4/4 OpenAI, 1/4 Anthropic, 0/4 Gemini), PageSpeed (26/100), entity check (no Wikidata). HTML + PDF reports generated.

---

## [6.4.0] — 2026-04-12

### orchestration/company-analysis/SKILL.md (v1.0.0 → v1.1.0)

- **Execution plan restructured — domain-authority-auditor moved from Step 2 to Step 10.** Previously the plan read: Step 1 entity-optimizer, Step 2 domain-authority-auditor, Steps 3–10 research/technical. Now domain-authority-auditor is the final step of Phase 03 (Technical + CITE), immediately after backlink-analyzer (Step 9). This ensures backlink-analyzer and technical-seo-checker data exists in hot-cache before domain-authority-auditor scores CITE C and T dimensions.
- **citation-baseline step renumbered from "Step 2.5" to "Step 1.5".** It still runs immediately after entity-optimizer, but with the correct numbering relative to the new plan.
- **Research steps renumbered** to Steps 2–5 (was Steps 3–6 with domain-authority-auditor at 2).
- **Technical steps renumbered** to Steps 6–10 (technical-seo-checker → Step 6, on-page-seo-auditor → Step 7, internal-linking-optimizer → Step 8, backlink-analyzer → Step 9, domain-authority-auditor → Step 10).
- **New instruction section added: "Step 10: domain-authority-auditor (CITE synthesis step)".** Explicitly lists what the auditor should read from hot-cache before scoring: CITE C/T dimensions from backlink-analyzer and technical-seo-checker handoffs; CITE C05–C08 AI citations from Step 1.5 citation-baseline; CITE I04 schema coverage noted as "pending schema audit" (available after Step 16).
- **New instruction section added: "Step 16: schema-markup-generator (run site-wide audit mode first)".** When executing in company-analysis context, the skill must run site-wide audit mode to produce `schema_audit.coverage_pct` in hot-cache for CITE-I04 before generating per-page schemas.
- **HTML report header updated:** `Library v6.3.0` → `Library v6.4.0`.

---

### build/meta-tags-optimizer/SKILL.md

- **Step 5 renamed** from "CORE-EEAT Alignment Check" to "CORE-EEAT Alignment Check — C01 Veto Gate".
- **C01 row in the alignment check table** now carries an `⛔ VETO` label to make veto status explicit.
- **Failure behavior changed from warning to block.** Previously: "If C01 fails, note the issue and suggest fixes." Now: "**BLOCKED — do not emit title candidates.** Rewrite all title options until intent alignment passes, then continue." The skill will not emit any title candidates until C01 passes.
- **Output Validation section** — new first checkpoint added: `[ ] **C01 Intent Alignment passes** — title intent matches target query intent (VETO: no titles emitted until this passes)`.
- **Maps to: block added** to Skill Contract section: `CORE C01 (intent alignment — veto gate), C02 (direct answer preview in meta description), O02 (summary/answer box signal)`.

---

### optimize/on-page-seo-auditor/SKILL.md

- **Step 10 renamed** from "CORE-EEAT Content Quality Quick Scan" to "CORE-EEAT Pre-Scores (17 items)".
- **Explicit item IDs listed** for all 17 items in the pre-score set: C01, C02, C09, C10, O01, O02, O03, O05, O06, R01, R02, R06, R08, R10, Exp01, Ept01, T04.
- **`pre_scored_items:` handoff block format added.** The handoff now includes a structured `pre_scored_items:` key with per-item scores (PASS/PARTIAL/FAIL) and an explicit instruction: "If content-quality-auditor runs after this skill, it should read these 17 scores from this handoff and treat them as its authoritative values for those items, only independently assessing the remaining ~63 items."
- **Maps to: block added** to Skill Contract section listing all 17 pre-scored item IDs.

---

### optimize/content-refresher/SKILL.md

- **Step 1 title changed** from "CORE-EEAT Quick Score — Identify Weak Dimensions" to "CORE-EEAT Refresh Priority Flags — Identify Weak Dimensions".
- **Table schema changed.** Old columns: `| Dimension | Quick Score | Key Weakness | Refresh Priority |` with `[X]/100` numeric scores. New columns: `| Dimension | Key Weakness | Refresh Priority |` with `🔴/🟡/🟢` priority icons only. No numeric scores emitted.
- **Footnote updated** to: "These flags direct refresh effort only — they are not authoritative CORE-EEAT scores. Run content-quality-auditor on refreshed content before republishing."
- **Maps to: block added** to Skill Contract section: `CORE R06 (timestamps / freshness signals), C03 (query coverage gaps addressed by refresh), C09 (FAQ coverage added during refresh)`.

---

### cross-cutting/content-quality-auditor/SKILL.md

- **Scope narrowed to ~50 page-level items.** Description updated to add "CORE-EEAT" qualifier and a new Scope paragraph: the skill directly scores C01–C10, O01–O10, R01–R10, E01–E10, Exp01, A01, A07–A08, T03–T04 (~50 items). Org-level items (Exp02–Exp10, Ept01–Ept10, A02–A06/A09–A10, T01/T02/T05–T10) are now read from hot-cache if entity-optimizer or domain-authority-auditor has run. When unavailable, they are marked `N/A (org-level — run entity-optimizer / domain-authority-auditor)` rather than estimated from the page.
- **Reads bullet updated** to include: "Also reads: `pre_scored_items` from any prior on-page-seo-auditor handoff in the current run."
- **New "Step 1b: Import Pre-Scores from on-page-seo-auditor" section added.** If a prior on-page-seo-auditor handoff exists, the 17 pre-scored items are imported. The auditor treats these as authoritative values without re-scoring those items. A note is added to the scorecard output distinguishing imported values from independently-assessed values.
- **Maps to: block added** to Skill Contract section: all ~50 page-level CORE-EEAT items; imports org-level from entity-optimizer and domain-authority-auditor.

---

### cross-cutting/domain-authority-auditor/SKILL.md

- **Reads bullet updated** to state: in company-analysis context, read CITE C/T dimension data from backlink-analyzer and technical-seo-checker handoffs before scoring, rather than deriving independently.
- **Promotes bullet updated** to include: "also writes CORE-EEAT org-level scores (A02–A06/A09–A10, T01/T02/T05–T10) to hot-cache for content-quality-auditor to read."
- **New "Step 2b: Collect External Data for Six Previously-Unimplemented Items" section added.** Six items that were previously estimated from LLM training data now have explicit WebFetch collection steps:
  - I06 WHOIS Age: fetch `who.is/<domain>` or `whois.domaintools.com/<domain>`
  - T06 WHOIS Privacy: same WHOIS fetch
  - T04 IP Reputation: fetch `ipinfo.io` + `mxtoolbox.com/blacklists/<domain>`
  - T10 Review Signals: fetch `trustpilot.com/review/<domain>` and `g2.com/search?q=<company>`
  - C08 Brand Sentiment: Google News search for brand name; classify snippets
  - E06 Media Mentions: Google News search for brand + sector; count and classify
- **`source:` tag requirement** added: every scored value for these six items must include a `source:` tag in the handoff (e.g., `source: whois.domaintools.com (fetched)` or `source: LLM estimate`).
- **Step 3 note updated** to reference hot-cache `citation_baseline` key (written by Step 1.5 of company-analysis) for C05–C08 when running in company-analysis context.
- **CORE-EEAT org-level scope documented:** A02–A06, A09–A10 (brand/media/social/partner authority), T01/T02 (Legal Compliance, Contact Transparency), T05–T10 (Editorial Policy through Customer Support).
- **Maps to: block added** to Skill Contract section: CITE all 40 items; CORE A02–A06/A09–A10/T01/T02/T05–T10.

---

### cross-cutting/entity-optimizer/SKILL.md

- **Promotes bullet updated** to include: "writes org-level CORE-EEAT scores (Exp02–Exp10, Ept01–Ept10) to hot-cache for content-quality-auditor to import."
- **Cross-Reference section updated** with note on Exp/Ept scope: "entity-optimizer is the authoritative scorer for all Exp02–Exp10 (org-level experience) and Ept01–Ept10 (org-level expertise) items in the CORE-EEAT framework."
- **Maps to: block added** to Skill Contract section: CITE I01–I10, E01–E10 partial; CORE Exp02–Exp10, Ept01–Ept10, A07, A08.

---

### cross-cutting/memory-management/SKILL.md

- **Writes bullet updated** to include: "appends dimension-level CITE/CORE scores to `memory/history/<domain>.jsonl` on each run."
- **New "Step 6: Append CITE/CORE History Record" section added.** At the end of each company-analysis run, memory-management reads dimension scores from the domain-authority-auditor and content-quality-auditor handoff files and appends one JSONL record per scoring skill to `memory/history/<domain>.jsonl`. Format:
  ```json
  {"ts":"<ISO8601>","skill":"domain-authority-auditor","domain":"<domain>","scores":{"CITE_C":<n>,"CITE_I":<n>,"CITE_T":<n>,"CITE_E":<n>,"CITE_overall":<n>},"verdict":"<verdict>"}
  {"ts":"<ISO8601>","skill":"content-quality-auditor","domain":"<domain>","scores":{"CORE_C":<n>,"CORE_O":<n>,"CORE_R":<n>,"CORE_E":<n>,"CORE_Exp":<n>,"CORE_Ept":<n>,"CORE_A":<n>,"CORE_T":<n>,"GEO":<n>,"SEO":<n>},"verdict":"<verdict>"}
  ```
- **Step 7 (previously Step 6: finalize and promote)** renumbered.
- **Directory structure documentation** updated to include `memory/history/<domain>.jsonl` as a new path.
- **Maps to: block added** to Skill Contract section.

---

### build/schema-markup-generator/SKILL.md

- **New "Site-Wide Audit Mode (CITE-I04 feeder)" section added** before the Validation Checkpoints. This is a distinct mode triggered by `audit <domain>` (vs. the existing per-page mode triggered by a specific page URL). The six-step audit:
  1. Fetch `sitemap.xml` (or sitemap index via `robots.txt`)
  2. Sample up to 50 URLs (full list if ≤50 total)
  3. For each URL: `HEAD` or `GET` and check for `<script type="application/ld+json">`, validate `@type` and `@context`
  4. Compute `schema_coverage_pct` (URLs with any ld+json / total sampled), `valid_pct` (valid ld+json / URLs with ld+json), schema type distribution by `@type`
  5. Write to hot-cache: `schema_audit: { domain: "<domain>", coverage_pct: <n>, valid_pct: <n>, sampled: <n>, by_type: { "Article": <n>, "FAQPage": <n>, ... }, ts: "<ISO8601>" }`
  6. Return structured summary
- **Maps to: block added** to Skill Contract section: CITE I04 (via site-wide audit mode); CORE O05/R09 (per-page mode).

---

### monitor/performance-reporter/SKILL.md

- **New "Step 5b: Load History for Trend Data" section added.** Before emitting the CITE and CORE-EEAT sections, the reporter reads `memory/history/<domain>.jsonl`, groups records by skill name, and computes period-over-period deltas for each dimension score. This is now the primary trend data source.
- **Steps 6 and 7** (CITE audit reporting and CORE-EEAT audit reporting) updated to reference history JSONL as the source for trend arrows and delta columns. Previously, these steps read only the latest snapshot from `memory/audits/domain/` and `memory/audits/content/`, providing no trend capability.
- **Maps to: block added** to Skill Contract section: CITE E01/E03/E04 (aggregated trend output); reads from `memory/history/<domain>.jsonl`.

---

### monitor/alert-manager/SKILL.md

- **New "Step 0b: Load Baseline from History" section added.** Before configuring threshold rules, the skill reads `memory/history/<domain>.jsonl` and identifies the oldest entry within the configured alert window for each scoring skill. This establishes the numeric baseline used in threshold comparison formulas (e.g., "alert if CITE_overall drops >10 points from baseline").
- **Maps to: block added** to Skill Contract section: threshold monitoring over CITE/CORE dimensions; reads `memory/history/<domain>.jsonl`.

---

### references/skill-contract.md

- **`Maps to:` field added to the handoff template** as a required field. Documentation: "must list which CITE or CORE-EEAT item IDs are populated by this skill's findings. Use CITE- or CORE- prefix to distinguish namespaces. If the skill has no framework item feeds, write `Maps to: (none — protocol/transport skill)`." This field was previously optional and present in only 3 of 21 skills; now required across all skills.

---

### references/state-model.md

- **New `memory/history/` section added.** Documents the append-only JSONL format for `memory/history/<domain>.jsonl`, covering:
  - Schema: `ts` (ISO8601), `skill` (skill name), `domain` (apex domain), `scores` (dimension-level key/value map), `verdict` (string)
  - Append-only semantics: never overwrite or delete lines; only append
  - Read pattern: parse as NDJSON, filter by `domain` and/or `skill`, sort by `ts` ascending for trend queries
  - Query example for period-over-period delta: last two records with matching `skill` and `domain`

---

### CLAUDE.md

- **Output structure comment for `01-domain-baseline/`** updated: was `# entity-optimizer + domain-authority-auditor`; now `# entity-optimizer (+ citation-baseline step)`.
- **Output structure comment for `03-technical/`** updated to include `domain-authority-auditor` (moved from Phase 01 to Phase 03).
- **Skill execution order line updated:** domain-authority-auditor moved from position 2 (after entity-optimizer) to position after backlink-analyzer. New order: `entity-optimizer → keyword-research → competitor-analysis → serp-analysis → content-gap-analysis → technical-seo-checker → on-page-seo-auditor → internal-linking-optimizer → backlink-analyzer → domain-authority-auditor → content-quality-auditor → ...`
- **Note added to execution order:** "domain-authority-auditor runs after backlink-analyzer and technical-seo-checker so it can read real CITE C/T dimension data from those feeders."

---

### research/keyword-research/SKILL.md

- **Maps to: block added** to Skill Contract section: `CITE E01/E07/E08 (topical authority signals), I02 (brand search volume), I10 (query-brand association); CORE C03 (query coverage variants), C09 (FAQ topic candidates)`.

---

### research/competitor-analysis/SKILL.md

- **Maps to: block added** to Skill Contract section: `CITE E04 (competitor SERP visibility benchmark), E08 (topical breadth comparison), E10 (industry share-of-voice); CORE E01 (content gap identification), E08 (depth advantage opportunities)`.

---

### research/serp-analysis/SKILL.md

- **Maps to: block added** to Skill Contract section: `CITE E01 (organic visibility context), E03 (SERP feature opportunities), I03 (brand SERP ownership); CORE C01 (intent classification from SERP), C09 (FAQ/PAA signals), O02 (featured snippet format requirements), O03 (data table format requirements)`.

---

### research/content-gap-analysis/SKILL.md

- **Maps to: block added** to Skill Contract section: `CITE E07 (topical authority depth via long-tail gap identification), E08 (topical authority breadth via sub-topic coverage %); CORE C03 (query coverage gaps), C09 (FAQ topic gaps), E01 (gap-filling opportunity identification)`.

---

### build/seo-content-writer/SKILL.md

- **Maps to: block added** to Skill Contract section: `CORE C01–C10 (contextual clarity, enforced while writing), O01–O10 (organization, enforced), R01–R10 (referenceability, enforced), E01–E10 (exclusivity, applied); primary enforcer for 16-item CORE-EEAT pre-write checklist`.

---

### build/geo-content-optimizer/SKILL.md

- **Maps to: block updated/verified** in Skill Contract section: `CORE C01 (intent alignment maintained), C02 (direct answer optimization), O02 (summary box insertion), R01 (data precision), R02 (citation density); enforces 26 GEO-First items; feeds CITE C05–C07 indirectly via improved citation probability`.

---

### optimize/technical-seo-checker/SKILL.md

- **Maps to: block added** to Skill Contract section: `CITE T07 (technical security — HTTPS/HSTS), T08 (content freshness signals — crawl dates), T09 (penalty/deindex detection), T03 (crawl/traffic coherence signals); CORE T03 (security standards); also provides raw data for CITE E04 (technical crawlability) and I04 (schema coverage, page-level sample)`.

---

### optimize/internal-linking-optimizer/SKILL.md

- **Maps to: block added** to Skill Contract section: `CITE I03 (brand SERP ownership — sitelinks), I09 (unlinked brand mentions — internal anchor opportunities), E07 (topical authority depth — cluster density); CORE R08 (internal link graph), O08 (anchor navigation)`.

---

### monitor/rank-tracker/SKILL.md

- **Maps to: block added** to Skill Contract section: `CITE E01 (organic search visibility), E03 (SERP feature ownership), E07 (topical authority depth via long-tail tracking), E10 (industry share of voice), C05 (AI citation frequency), C06 (AI citation prominence), C07 (cross-engine citation); primary feeder for CITE C05–C07`.

---

### monitor/backlink-analyzer/SKILL.md

- **Maps to: block updated/verified** in Skill Contract section: `CITE C01 (referring domains volume), C02 (referring domains quality), C04 (link velocity), C09 (editorial link ratio), C10 (link source diversity), T01 (link profile naturalness), T02 (dofollow ratio), T03 (link-traffic coherence — veto), T05 (backlink profile uniqueness — veto)`.

---

### VERSIONS.md

- **Version bumped to 6.4.0** (from 6.3.0) across all skill entries, dated 2026-04-12.
- **company-analysis skill** version bumped to 1.1.0 (from 1.0.0).
- **Full v6.4.0 changelog entry added** at the top of the Changelog section covering all 8 structural fixes.

---

### .claude-plugin/plugin.json

- **`"version"` field** changed from `"6.3.0"` to `"6.4.0"`.

---

### marketplace.json

- **`metadata.version` field** changed from `"6.3.0"` to `"6.4.0"`.
- **`plugins[0].version` field** changed from `"6.3.0"` to `"6.4.0"`.

---

### README.md

- **Version badge URL** updated from `version-6.3.0-orange` to `version-6.4.0-orange`.

---

### tools/ (new directory — self-hosted MCP servers)

A new `tools/` directory added at the repo root containing 8 self-hosted MCP servers implemented as Node.js stdio servers using `@modelcontextprotocol/sdk`. These replace the three previous remote HTTP MCP entries (Ahrefs, SimilarWeb, HubSpot) with locally-runnable servers that work at Tier 1 (free APIs) and upgrade automatically when paid API keys are present.

**`tools/package.json`** — new file. Declares the `seo-geo-mcp-servers` package (`type: "module"`, Node ≥18), with three dependencies: `@modelcontextprotocol/sdk ^1.0.0`, `cheerio ^1.0.0`, `dotenv ^16.0.0`. No other runtime dependencies.

**`tools/shared/config.js`** — new file. Central configuration module. Reads environment variables via `dotenv` from a `.env` file two directories up. Exports a `config` object with connection details and `available` booleans for each API provider: `dataforseo` (login/password/authHeader factory), `serper`, `openai`, `anthropic` (with `webSearch` flag), `gemini`, `perplexity`, `google` (API key + CSE ID), `openPageRank`. Also exports `tierStatus()` helper that logs which engines are active on server start.

**`tools/shared/http.js`** — new file. Shared HTTP utilities: `post()` (generic fetch wrapper for JSON POST), `ok()` (MCP success response builder), `err()` (MCP error response builder), `tier1Manual()` (returns a structured manual-instructions object for when no API key is available).

**`tools/mcp-servers/ai-citation-monitor.js`** — new file. Queries all configured LLM engines (Claude, GPT-4o-mini, Gemini Flash, Perplexity Sonar) and checks whether a target domain is cited in responses to a given query. Perplexity Sonar performs live web search (most accurate for current citation state); Claude/GPT/Gemini reflect training-data knowledge (brand awareness signal). Engines with no API key configured are skipped gracefully; at least one must be present. Exposes MCP tool `check_citations(domain, queries[])`. Maps to: CITE C05 (AI Citation Frequency), C06 (AI Citation Prominence), C07 (Cross-Engine Citation).

**`tools/mcp-servers/brand-monitor.js`** — new file. Searches for brand mentions on sites other than the brand's own domain. Primary source: Serper.dev (2,500 free queries/month). Fallback: Google Custom Search API (requires `GOOGLE_API_KEY` + `GOOGLE_CSE_ID`). Exposes MCP tool `monitor_brand(domain, brand_name)`. Maps to: CITE I09 (Unlinked Brand Mentions), competitor content monitoring.

**`tools/mcp-servers/entity-checker.js`** — new file. Checks entity presence across knowledge graphs. No paid API required — all sources are free. Sources: Wikidata SPARQL (always available), Wikipedia API (always available), Google Knowledge Graph API (requires `GOOGLE_API_KEY` for higher quota; free tier available). Exposes MCP tools `check_entity(entity_name)` and `lookup_wikidata(entity_name)`. Maps to: CITE I01 (Knowledge Graph Presence), I05 (Author Entity Recognition), I07 (Cross-Platform Consistency).

**`tools/mcp-servers/keyword-and-backlinks.js`** — new file. Keyword volume/difficulty and backlink data. Tier 2 (paid): DataForSEO API — keyword volume, keyword difficulty, backlink profiles, domain metrics. Tier 1 fallback: Open PageRank API (basic Domain Rating only; no keyword data). When DataForSEO credentials are absent, keyword tools return manual-instructions objects instead of blocking. Exposes MCP tools `get_keywords(domain, seed_keywords[])`, `get_backlinks(domain)`, `get_domain_metrics(domain)`. Maps to: CITE C01/C02/C04 (referring domains/velocity), I02 (brand search volume), E01/E02 (organic visibility/traffic), CORE C03 (keyword variants).

**`tools/mcp-servers/pagespeed.js`** — new file. Google PageSpeed Insights API wrapper. Free at 25,000 requests/day; `GOOGLE_API_KEY` optional (higher quota with key). Runs Lighthouse audits and returns Core Web Vitals (LCP, CLS, FID/INP), performance score, and field data vs. lab data. Exposes MCP tool `check_pagespeed(url, strategy)` where strategy is `mobile` or `desktop`. Maps to: CITE E04 (Technical Crawlability — performance component), CORE T03.

**`tools/mcp-servers/schema-validator.js`** — new file. Fetches a URL and validates all `<script type="application/ld+json">` blocks locally. No API keys required. Checks: valid JSON syntax, required `@type` and `@context` presence, absolute URLs in identifier fields, ISO 8601 date formats, no obvious policy violations. Returns per-block pass/fail with specific error messages. Exposes MCP tool `validate_schema(url)`. Maps to: CITE I04 (Schema.org Coverage), CORE O05.

**`tools/mcp-servers/serp-analyzer.js`** — new file. SERP position and feature data. Tier 1: Serper.dev (2,500 free queries/month, `SERPER_API_KEY`). Tier 2 fallback: DataForSEO SERP API (when Serper is unavailable and DataForSEO credentials present). Returns organic results (position, title, URL, snippet), SERP features present (AI Overview, featured snippet, PAA, image pack, video, Knowledge Panel, local pack), and people-also-ask questions. Exposes MCP tool `analyze_serp(query, location, device)`. Maps to: CITE E03 (SERP Feature Ownership), I03 (Brand SERP Ownership), E07/E08, CORE C09/O02/O03.

**`tools/mcp-servers/site-crawler.js`** — new file. BFS (breadth-first search) crawler using Node 18+ built-in `fetch` + `cheerio`. No API keys required; runs entirely locally. Discovers internal links, detects orphan pages, checks for schema markup presence, extracts page metadata (title, description, H1, canonical, noindex status). Respects `robots.txt` and `noindex` directives. Configurable `maxPages` (default 50) and `maxDepth` (default 3). Exposes MCP tool `crawl_site(domain, options)`. Maps to: CITE E04 (Technical Crawlability), I04 (Schema.org Coverage — page-level sample), CORE R08 (Internal Link Graph), T03.

---

### .mcp.json

- **Three remote HTTP MCP entries removed**: `ahrefs` (https://api.ahrefs.com/mcp/mcp), `similarweb` (https://mcp.similarweb.com), `hubspot` (https://mcp.hubspot.com/anthropic). These required paid enterprise subscriptions; they are superseded by the self-hosted `tools/` servers at Tier 1/2.
- **Eight self-hosted stdio MCP server entries added**, each pointing to a Node.js script in `tools/mcp-servers/`:
  - `keyword-and-backlinks` → `tools/mcp-servers/keyword-and-backlinks.js`
  - `serp-analyzer` → `tools/mcp-servers/serp-analyzer.js`
  - `ai-citation-monitor` → `tools/mcp-servers/ai-citation-monitor.js`
  - `entity-checker` → `tools/mcp-servers/entity-checker.js`
  - `schema-validator` → `tools/mcp-servers/schema-validator.js`
  - `pagespeed` → `tools/mcp-servers/pagespeed.js`
  - `site-crawler` → `tools/mcp-servers/site-crawler.js`
  - `brand-monitor` → `tools/mcp-servers/brand-monitor.js`
- All new entries use `type: "stdio"` with `command: "node"` and `args: ["tools/mcp-servers/<name>.js"]`. The existing `amplitude`, `notion`, and `slack` remote HTTP entries are unchanged.

---

### subscription-overview.md (new file)

New reference document covering cost and capability breakdown for running the library at three operating levels.

**Tier 1 — Free**: 11-row capability table covering AI citation monitoring (Anthropic/OpenAI/Gemini APIs pay-per-token + Perplexity $5 minimum), SERP analysis via Serper.dev (2,500 queries/month free), keyword/backlink data via DataForSEO ($1 trial credit), Google PageSpeed Insights (25,000 requests/day free), Wikidata SPARQL (60s query limit), Google Knowledge Graph API (100,000 reads/day free), Google Custom Search API (100 queries/day free), Open PageRank (10,000 calls/hour free), schema.org validator (unlimited), Crawl4AI local (unlimited, hardware-limited), GA4/GSC (free, site ownership required). Documents four things not possible at free tier: comprehensive backlink profiles, third-party traffic estimates, >100 brand mention checks/day, automated competitor rank monitoring at scale.

**Tier 2 — Product Level (DIY Paid APIs)**: 13-row table with per-query pricing. Key additions over Tier 1: Serper.dev Starter ($50 for 50,000 queries / $0.001/query), DataForSEO Keywords Data ($0.0006/query), DataForSEO Backlinks ($100/month minimum + $0.02/request + $0.00003/row), DataForSEO Domain Analytics ($0.01/task), DataForSEO Traffic Analytics (~$0.02/domain), Google Custom Search ($5/1,000 queries beyond 100/day), Crawl4AI hosted (~$0.001/page). Three upgrade notes: DataForSEO $100/month backlinks minimum only makes sense at 50+ reports/month; Google Custom Search API shutting down to new customers (January 2027 migration deadline, alternative: DataForSEO Mentions API); Crawl4AI self-hosting costs only apply if running as hosted service.

**Tier 3 — Enterprise Level (Premium Subscriptions)**: 4-row table with Ahrefs API Enterprise ($1,499+/month), SimilarWeb API ($75,000–$200,000+/year negotiated annual), Otterly.ai ($29–$489/month by prompt volume), all other APIs same as Tier 2. Reality check section explains: Ahrefs/SimilarWeb subscription-only with no per-query option; Otterly.ai costs more per citation check than the self-built `ai-citation-monitor` server at any scale; Tier 2 DIY stack produces 90–95% equivalent output at ~1% of the cost.

**Cost Per Report Run — Breakdown**: Defines one report run as one full `/geo:analyze-company` execution. Fixed assumption set: 20 target queries for AI citation monitoring, 50 keyword lookups, 5 competitor domains, 1 domain backlink check (100 rows), 20 SERP position checks, 50 pages crawled, 10 brand mention queries.
- Tier 1 cost breakdown table (13 rows per component): total **~$0.37/run**. Bounded by Serper.dev (2,500/month = 5 reports/month free) and Google Custom Search (100 queries/day).
- Tier 2 cost breakdown table (13 rows): total **~$0.58/run** base, rising to ~$0.75 when the DataForSEO Backlinks $100/month minimum is amortized over 10 reports/month.
- Tier 3 cost breakdown table (4 rows): total **~$79.67/report** at 100 reports/month (vs $0.58 at Tier 2 — a 137× price difference).

**Summary table**: 5-row use-case matrix mapping Personal use (~$0.37, <$5/month) → Freelance/agency 1–10 clients ($0.37–$0.58, $5–$30/month) → SaaS 10–100 clients (~$0.58–$0.75, $50–$500/month) → Enterprise SaaS 100+ clients ($1–$5, $500–$5,000/month) → Full Tier 3 (~$79, $7,500+/month). Key decision point documented: move to Tier 3 only when a specific client contract or data quality requirement forces it.

**API Keys Required Per Tier**: Three tables listing every required environment variable per tier. Tier 1: 7 keys (GOOGLE_API_KEY, SERPER_API_KEY, OPR_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, PERPLEXITY_API_KEY, ANTHROPIC_API_KEY — last one assumed already present for Claude Code users). Tier 2 adds: DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD. Tier 3 adds: AHREFS_API_KEY, SIMILARWEB_API_KEY, OTTERLY_API_KEY.

---

### dimensions-definition.md (new file)

New reference document providing plain-language definitions for every sub-item in both the CORE-EEAT (80 items) and CITE (40 items) frameworks. Written for someone with no prior SEO/GEO knowledge. 660 lines.

**Introduction section**: Explains SEO vs GEO distinction ("Google ranks pages; AI engines quote pages"). Framework summary table showing scope, what each grades, item count, and veto items. Scoring explanation (Pass=10/Partial=5/Fail=0, sum per dimension, average dimensions). Namespace warning distinguishing CORE-C01 (Intent Alignment) from CITE-C01 (Referring Domains Volume).

**CORE-EEAT section (80 items)**: Introductory split explaining CORE (40 items = content body) vs EEAT (40 items = source credibility).

- **C — Contextual Clarity (C01–C10)**: Each item has Plain English definition, Why it matters (often with AI-engine-specific call-outs), and a concrete ✅/❌ example. C01 marked VETO with explanation of Google's Helpful Content update connection. C02 explains the 150-word opening-paragraph rule and its connection to ChatGPT/Google AI Overview extraction. C09 marked "GEO priority #2" with FAQ section guidance.
- **O — Organization (O01–O10)**: Framed as "how clean is the layout" for machine extraction. O02 marked "GEO priority #6" with TL;DR box example. O03 marked "GEO priority #3" with table-vs-prose citation probability comparison. O05 marked "GEO priority #4" — explains JSON-LD schema and rich result unlocking.
- **R — Referenceability (R01–R10)**: Framed around verifiability. R02 explains the 1-per-500-words citation density rule and Perplexity's filtering of uncited content. R04 explained as "Claude's #1 preferred pattern." R05 as Perplexity-preferred. R10 marked VETO — covers self-contradicting data and broken links.
- **E — Exclusivity (E01–E10)**: Framed as "what makes your page different." E01 marked "GEO priority #5" with example of original survey data as "citation gold." E07 explains that tools (calculators, templates) earn backlinks and rank for multiple keywords.
- **Exp — Experience (Exp01–Exp10)**: Explains Google's 2022 E-E-A-T addition. Exp01 explains first-person language as experience signal. Exp02 explains sensory details as unfakeable from a spec sheet. Exp04 covers timestamped original photos. Exp10 ("Limitations Acknowledged") described as "Claude-preferred pattern."
- **Ept — Expertise (Ept01–Ept10)**: Distinguishes Experience (you did it) from Expertise (you're trained in it). Ept05 labeled Perplexity-preferred (methodology rigor). Ept08 labeled Claude's top-preferred pattern (reasoning transparency with trade-offs).
- **A — Authority (A01–A10)**: Framed as "other people vouching for you." A05 explains brand search volume as entity recognition proxy. A07 explains Google Knowledge Panel as one of the strongest GEO signals.
- **T — Trust (T01–T10)**: Framed as defensive ("looking for red flags"). T03 labeled Security Standards (HTTPS). T04 marked VETO — explains FTC affiliate disclosure requirement and Google enforcement.

**CITE section (40 items)**: Opening table shows the 4 CITE dimensions with default weights (C=35%, I=20%, T=25%, E=20%) and what each asks.

- **CITE-C — Citation (C01–C10)**: C01 distinguishes referring domains count from total backlinks. C02 gives "20%+ of backlinks from DA 50+ sites" as good score. C03 explains selective linkers vs. directories. C04 covers natural link velocity vs. suspicious spikes. C05 marked as "newest and most GEO-critical metric" with "cited on 10+ niche queries across 2+ AI engines" as good score. C06 explains primary vs. secondary citation value (10× difference). C07 covers cross-engine citation as generalist authority signal.
- **CITE-I — Identity (I01–I10)**: I01 explains knowledge graphs as AI entity verification layer. I02 gives brand search volume as cleanest brand recognition measure. I03 explains brand SERP ownership with "7+ first-page results are yours" as good score. I06 gives nuanced explanation of domain tenure including why resurrected expired domains are less trusted than fresh ones. I10 explains Google autocomplete inclusion as strong query-brand association signal.
- **CITE-T — Trust (T01–T10)**: Opening framing: "defensive dimension — looks for signs of cheating." T02 includes a detailed explanation of dofollow vs nofollow links written for non-technical readers, with 40-85% dofollow as good score. T03 marked VETO with explanation of link farm detection. T05 marked VETO with explanation of PBN detection via shared link profiles. T09 marked VETO — explains manual action in Search Console as nuclear option.
- **CITE-E — Eminence (E01–E10)**: E04 explicitly mentions AI crawler allowances (ClaudeBot, GPTBot in robots.txt) — explains that accidentally blocking these prevents AI citation entirely. E07 explains long-tail keyword depth as unfakeable authority signal with a concrete HubSpot example. E10 explains industry share of voice as competitive positioning metric.

**Closing section: "How the two frameworks fit together"**: Plain-English summary — "Is this page worth quoting?" (CORE-EEAT) vs "Is the website behind it worth trusting?" (CITE). 4-row diagnosis matrix: High CITE + High CORE → maintain; High CITE + Low CORE → fix content first; Low CITE + High CORE → build authority; Low + Low → fix content then authority.

**"6 vetoes you must never trigger"**: Summary section listing all 6 veto items across both frameworks with one-line plain-English reminders. Framed as "if you remember nothing else from this document."

---

## [6.3.0] — 2026-04-11

See `VERSIONS.md` for the v6.3.0 changelog entry.

---

## Prior versions

See `VERSIONS.md`.
