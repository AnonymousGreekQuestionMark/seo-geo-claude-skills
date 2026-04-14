---
name: content-quality-auditor
description: 'Publish-readiness gate: 80-item CORE-EEAT audit with weighted scoring, veto checks, and fix plan. 内容质量/EEAT评分'
version: "6.6.0"
license: Apache-2.0
allowed-tools: WebFetch
compatibility: "Claude Code ≥1.0, skills.sh marketplace, ClawHub marketplace, Vercel Labs skills ecosystem. No system packages required. Optional: MCP network access for SEO tool integrations."
homepage: "https://github.com/aaron-he-zhu/seo-geo-claude-skills"
when_to_use: "Use when auditing content quality before publishing. Runs CORE-EEAT 80-item scoring with veto checks. Also when the user asks for E-E-A-T analysis or publish readiness."
argument-hint: "<URL or paste content> [keyword]"
metadata:
  author: aaron-he-zhu
  version: "6.6.0"
  geo-relevance: "high"
  tags:
    - seo
    - geo
    - e-e-a-t
    - core-eeat
    - content-quality
    - content-scoring
    - helpful-content
    - publish-readiness
    - 内容质量
    - コンテンツ品質
    - 콘텐츠품질
    - auditoria-eeat
  triggers:
    # EN-formal
    - "audit content quality"
    - "EEAT score"
    - "CORE-EEAT audit"
    - "content quality check"
    - "content assessment"
    - "quality score"
    # EN-casual
    - "is this ready to publish"
    - "grade my article"
    - "check before publishing"
    - "how good is my content"
    - "is my content good enough to rank"
    - "rate my content quality"
    # EN-question
    - "is my content ready to publish"
    - "how do I improve content quality"
    # ZH-pro
    - "内容质量审计"
    - "EEAT评分"
    - "内容评估"
    # ZH-casual
    - "文章能发吗"
    - "内容打几分"
    - "文章写得怎么样"
    # JA
    - "コンテンツ品質監査"
    - "E-E-A-T評価"
    # KO
    - "콘텐츠 품질 감사"
    - "EEAT 점수"
    # ES
    - "auditoría de calidad de contenido"
    - "puntuación EEAT"
    # PT
    - "auditoria de qualidade"
    # Misspellings
    - "EEAT scroe"
---

# Content Quality Auditor

> Based on [CORE-EEAT Content Benchmark](https://github.com/aaron-he-zhu/core-eeat-content-benchmark). Full benchmark reference: [references/core-eeat-benchmark.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/core-eeat-benchmark.md)


> **[SEO & GEO Skills Library](https://github.com/aaron-he-zhu/seo-geo-claude-skills)** · 20 skills for SEO + GEO · [ClawHub](https://clawhub.ai/u/aaron-he-zhu) · [skills.sh](https://skills.sh/aaron-he-zhu/seo-geo-claude-skills)
> **System Mode**: This cross-cutting skill is part of the protocol layer and follows the shared [Skill Contract](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/skill-contract.md) and [State Model](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/state-model.md).


This skill evaluates content quality across 80 standardized CORE-EEAT criteria organized in 8 dimensions. It produces a comprehensive audit report with per-item scoring, dimension and system scores, weighted totals by content type, and a prioritized action plan.

**System role**: Publish Readiness Gate. It decides whether content is ready to ship, what blocks publication, and what should be promoted into durable project memory.

**Scope**: Directly scores the ~50 page-level items observable from a single content page: C01–C10, O01–O10, R01–R10, E01–E10, Exp01, A01, A07–A08, T03–T04. The ~30 org-level items — **Exp02–Exp10, Ept01–Ept10** (scored by entity-optimizer) and **A02–A06, A09–A10, T01/T02, T05–T10** (scored by domain-authority-auditor) — are imported from hot-cache when those skills have already run. When they haven't run, mark org-level items as `N/A (org-level — run entity-optimizer / domain-authority-auditor)` and exclude from dimension averages per N/A handling rules.

## When This Must Trigger

Use this when content needs a quality check before publishing — even if the user doesn't use audit terminology:

- User asks "is this ready to publish" or "how good is this"
- User just finished writing with seo-content-writer or content-refresher
- **PostToolUse hook auto-triggers**: after content is written or substantially edited, the hook recommends this audit. When hook-triggered, skip setup questions — audit the content that was just produced.
- Auditing content quality before publishing
- Evaluating existing content for improvement opportunities
- Benchmarking content against CORE-EEAT standards
- Comparing content quality against competitors
- Assessing both GEO readiness (AI citation potential) and SEO strength (source credibility)
- Running periodic content quality checks as part of a content maintenance program
- After writing or optimizing content with seo-content-writer or geo-content-optimizer

## What This Skill Does

1. **Full 80-Item Audit**: Scores every CORE-EEAT check item as Pass/Partial/Fail
2. **Dimension Scoring**: Calculates scores for all 8 dimensions (0-100 each)
3. **System Scoring**: Computes GEO Score (CORE) and SEO Score (EEAT)
4. **Weighted Totals**: Applies content-type-specific weights for final score
5. **Veto Detection**: Flags critical trust violations (T04, C01, R10)
6. **Priority Ranking**: Identifies Top 5 improvements sorted by impact
7. **Action Plan**: Generates specific, actionable improvement steps

## Quick Start

Start with one of these prompts. Finish with a publish verdict and a handoff summary using the repository format in [Skill Contract](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/skill-contract.md).

### Audit Content

```
Audit this content against CORE-EEAT: [content text or URL]
```

```
Run a content quality audit on [URL] as a [content type]
```

### Audit with Content Type

```
CORE-EEAT audit for this product review: [content]
```

```
Score this how-to guide against the 80-item benchmark: [content]
```

### Comparative Audit

```
Audit my content vs competitor: [your content] vs [competitor content]
```

## Skill Contract

**Gate verdict**: **SHIP** (no veto items, dimension scores above threshold) / **FIX** (issues found but no veto) / **BLOCK** (veto item T04, C01, or R10 failed). Always state the verdict prominently at the top of the report.

**Expected output**: a CORE-EEAT audit report, a publish-readiness verdict, and a short handoff summary ready for `memory/audits/content/`.

- **Reads**: the target content, content type, supporting evidence, and any prior decisions from [CLAUDE.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/CLAUDE.md) and the shared [State Model](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/state-model.md) when available. **Also reads**: `pre_scored_items` from any prior `on-page-seo-auditor` handoff for the same page — import those 17 item scores directly rather than re-scoring them.
- **Writes**: a user-facing audit report plus a reusable summary that can be stored under `memory/audits/content/`.
- **Promotes**: veto items and publish blockers to `memory/hot-cache.md` (auto-saved, no user confirmation needed). Top improvement priorities to `memory/open-loops.md`.
- **Maps to**: CORE all ~50 page-level items (C01–C10, O01–O10, R01–R10, E01–E10, Exp01, A01, A07–A08, T03–T04) — authoritative full page scorer; imports org-level items from entity-optimizer and domain-authority-auditor hot-cache
- **Next handoff**: use the `Next Best Skill` below once the verdict is clear.

## Data Sources

> See [CONNECTORS.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/CONNECTORS.md) for tool category placeholders.

**With ~~web crawler + ~~SEO tool connected:**
Automatically fetch page content, extract HTML structure, check schema markup, verify internal/external links, and pull competitor content for comparison.

**With manual data only:**
Ask the user to provide:
1. Content text, URL, or file path
2. Content type (if not auto-detectable): Product Review, How-to Guide, Comparison, Landing Page, Blog Post, FAQ Page, Alternative, Best-of, or Testimonial
3. Optional: competitor content for benchmarking

Proceed with the full 80-item audit using provided data. Note in the output which items could not be fully evaluated due to missing access (e.g., backlink data, schema markup, site-level signals).

## Decision Gates

When stopping to ask, always: (1) state the specific value and threshold, (2) offer numbered options with outcomes.

**Stop and ask the user when:**
- Content is under minimum word count for its type (blog/guide: 300 words; product/landing page: 150 words; FAQ: fewer than 3 entries with 50+ words each) — state the actual count and offer: (1) expand to minimum, (2) continue audit with Insufficient Data flags, (3) cancel
- Content type cannot be auto-detected — state what you detected and ask to confirm before proceeding
- Content is primarily media (video/image) with minimal text — ask whether to audit transcript, alt text, or skip
- More than 50% of a dimension's items are N/A — name the dimension and ask: (1) provide supplementary data, (2) mark entire dimension as Insufficient Data
- Any veto item triggers — flag it immediately with the item ID and ask: (1) stop for immediate fix, (2) continue full audit and flag in report

**Continue silently (never stop for):**
- Individual Partial scores within a dimension
- Missing SEO tool data (mark items as N/A and continue)
- Low overall score (the report is the deliverable, not a judgment call)
- User not specifying content type (auto-detect and state your assumption)

## Instructions

When a user requests a content quality audit:

### Step 1: Preparation

```markdown
### Audit Setup

**Content**: [title or URL]
**Content Type**: [auto-detected or user-specified]
**Dimension Weights**: [loaded from content-type weight table]

#### Veto Check (Emergency Brake)

| Veto Item | Status | Action |
|-----------|--------|--------|
| T04: Disclosure Statements | ✅ Pass / ⚠️ VETO | [If VETO: "Add disclosure banner at page top immediately"] |
| C01: Intent Alignment | ✅ Pass / ⚠️ VETO | [If VETO: "Rewrite title and first paragraph"] |
| R10: Content Consistency | ✅ Pass / ⚠️ VETO | [If VETO: "Verify all data before publishing"] |
```

If any veto item triggers, flag it prominently at the top of the report and recommend immediate action before continuing the full audit.

### Step 1b: Import Pre-Scores from on-page-seo-auditor (if available)

Before scoring, check if `on-page-seo-auditor` has already run on this page (look in the current session's handoff or hot-cache). If `pre_scored_items` is present, import those 17 item scores directly:

```
Pre-scored items (imported from on-page-seo-auditor):
C01, C02, C09, C10, O01, O02, O03, O05, O06, R01, R02, R06, R08, R10, Exp01, Ept01, T04
```

Mark imported items as `(imported)` in the audit table. Score only the remaining ~63 items from scratch.

### Step 2: CORE Audit (40 items)

Evaluate each item against the criteria in [references/core-eeat-benchmark.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/core-eeat-benchmark.md).

Score each item:
- **Pass** = 10 points (fully meets criteria)
- **Partial** = 5 points (partially meets criteria)
- **Fail** = 0 points (does not meet criteria)

```markdown
### C — Contextual Clarity

| ID | Check Item | Score | Notes |
|----|-----------|-------|-------|
| C01 | Intent Alignment | Pass/Partial/Fail | [specific observation] |
| C02 | Direct Answer | Pass/Partial/Fail | [specific observation] |
| ... | ... | ... | ... |
| C10 | Semantic Closure | Pass/Partial/Fail | [specific observation] |

**C Score**: [X]/100
```

Repeat the same table format for **O** (Organization), **R** (Referenceability), and **E** (Exclusivity), scoring all 10 items per dimension.

### Step 3: EEAT Audit (40 items)

```markdown
### Exp — Experience

| ID | Check Item | Score | Notes |
|----|-----------|-------|-------|
| Exp01 | First-Person Narrative | Pass/Partial/Fail | [specific observation] |
| ... | ... | ... | ... |

**Exp Score**: [X]/100
```

Repeat the same table format for **Ept** (Expertise), **A** (Authority), and **T** (Trust), scoring all 10 items per dimension.

See [references/item-reference.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/cross-cutting/content-quality-auditor/references/item-reference.md) for the complete 80-item ID lookup table and site-level item handling notes.

### Step 4: Scoring & Report

Calculate scores and generate the final report:

```markdown
## CORE-EEAT Audit Report

### Overview

- **Content**: [title]
- **Content Type**: [type]
- **Audit Date**: [date]
- **Total Score**: [score]/100 ([rating])
- **GEO Score**: [score]/100 | **SEO Score**: [score]/100
- **Veto Status**: ✅ No triggers / ⚠️ [item] triggered

### Dimension Scores

| Dimension | Score | Rating | Weight | Weighted |
|-----------|-------|--------|--------|----------|
| C — Contextual Clarity | [X]/100 | [rating] | [X]% | [X] |
| O — Organization | [X]/100 | [rating] | [X]% | [X] |
| R — Referenceability | [X]/100 | [rating] | [X]% | [X] |
| E — Exclusivity | [X]/100 | [rating] | [X]% | [X] |
| Exp — Experience | [X]/100 | [rating] | [X]% | [X] |
| Ept — Expertise | [X]/100 | [rating] | [X]% | [X] |
| A — Authority | [X]/100 | [rating] | [X]% | [X] |
| T — Trust | [X]/100 | [rating] | [X]% | [X] |
| **Weighted Total** | | | | **[X]/100** |

**Score Calculation**:
- GEO Score = (C + O + R + E) / 4
- SEO Score = (Exp + Ept + A + T) / 4
- Weighted Score = Σ (dimension_score × content_type_weight)

**Rating Scale**: 90-100 Excellent | 75-89 Good | 60-74 Medium | 40-59 Low | 0-39 Poor

### N/A Item Handling

When an item cannot be evaluated (e.g., A01 Backlink Profile requires site-level data not available):

1. Mark the item as "N/A" with reason
2. Exclude N/A items from the dimension score calculation
3. Dimension Score = (sum of scored items) / (number of scored items x 10) x 100
4. If more than 50% of a dimension's items are N/A, flag the dimension as "Insufficient Data" and exclude it from the weighted total
5. Recalculate weighted total using only dimensions with sufficient data, re-normalizing weights to sum to 100%

**Example**: Authority dimension with 8 N/A items and 2 scored items (A05=8, A07=5):
- Dimension score = (8+5) / (2 x 10) x 100 = 65
- But 8/10 items are N/A (>50%), so flag as "Insufficient Data -- Authority"
- Exclude A dimension from weighted total; redistribute its weight proportionally to remaining dimensions

### Per-Item Scores

#### CORE — Content Body (40 Items)

| ID | Check Item | Score | Notes |
|----|-----------|-------|-------|
| C01 | Intent Alignment | [Pass/Partial/Fail] | [observation] |
| C02 | Direct Answer | [Pass/Partial/Fail] | [observation] |
| ... | ... | ... | ... |

#### EEAT — Source Credibility (40 Items)

| ID | Check Item | Score | Notes |
|----|-----------|-------|-------|
| Exp01 | First-Person Narrative | [Pass/Partial/Fail] | [observation] |
| ... | ... | ... | ... |

### Top 5 Priority Improvements

Sorted by: weight × points lost (highest impact first)

1. **[ID] [Name]** — [specific modification suggestion]
   - Current: [Fail/Partial] | Potential gain: [X] weighted points
   - Action: [concrete step]

2. **[ID] [Name]** — [specific modification suggestion]
   - Current: [Fail/Partial] | Potential gain: [X] weighted points
   - Action: [concrete step]

3–5. [Same format]

### Action Plan

#### Quick Wins (< 30 minutes each)
- [ ] [Action 1]
- [ ] [Action 2]

#### Medium Effort (1-2 hours)
- [ ] [Action 3]
- [ ] [Action 4]

#### Strategic (Requires planning)
- [ ] [Action 5]
- [ ] [Action 6]

### Recommended Next Steps

- For full content rewrite: use `seo-content-writer` with CORE-EEAT constraints
- For GEO optimization: use `geo-content-optimizer` targeting failed GEO-First items
- For content refresh: use `content-refresher` with weak dimensions as focus
- For technical fixes: run `/geo:check-technical` for site-level issues
```

### Step 5: Update Score Provenance (Company Analysis Mode)

When running as part of `/geo:analyze-company`, update `score-provenance.json` with all 80 CORE-EEAT item scores:

```javascript
// Called automatically by company-analysis orchestration
await updateCoreEeatProvenance(analysisPath, {
  domain: domain,
  geo_score: geoScore,      // avg(C, O, R, E)
  seo_score: seoScore,      // avg(Exp, Ept, A, T)
  dimensions: {
    C: { score: cScore, items: [...] },
    O: { score: oScore, items: [...] },
    R: { score: rScore, items: [...] },
    E: { score: eScore, items: [...] },
    Exp: { score: expScore, items: [...] },
    Ept: { score: eptScore, items: [...] },
    A: { score: aScore, items: [...] },
    T: { score: tScore, items: [...] }
  }
});
```

Each item in `dimensions.*.items` includes:
- `id`: Item ID (e.g., "C01")
- `score`: 0-100 (Fail=0, Partial=50, Pass=100)
- `status`: "PASS" | "PARTIAL" | "FAIL" | "N/A"
- `confidence`: "HIGH" | "MEDIUM" | "LOW"
- `raw_data`: Evidence from content (e.g., "H1 matches search intent")
- `calculation`: How score was derived

**This step ensures GEO and SEO scores are NOT N/A in the final report.**

If veto items are triggered (T04, C01, R10), also update:
```javascript
provenance.core_eeat_provenance.veto_items = [
  { id: "C01", name: "Intent Alignment", status: "FAIL", triggered: true }
];
```

### Save Results

After delivering findings to the user, ask:

> "Save these results for future sessions?"

If yes, write a dated summary to the appropriate `memory/` path using filename `YYYY-MM-DD-<topic>.md` containing:
- One-line verdict or headline finding
- Top 3-5 actionable items
- Open loops or blockers
- Source data references

If any veto-level issue was found (CORE-EEAT T04, C01, R10 or CITE T03, T05, T09), also append a one-liner to `memory/hot-cache.md` without asking.

## Validation Checkpoints

### Input Validation
- [ ] Content source identified (text, URL, or file path)
- [ ] Content type confirmed (auto-detected or user-specified)
- [ ] Content is substantial enough for meaningful audit (≥300 words)
- [ ] If comparative audit, competitor content also provided

### Output Validation
- [ ] All 80 items scored (or marked N/A with reason)
- [ ] All 8 dimension scores calculated correctly
- [ ] Weighted total matches content-type weight configuration
- [ ] Veto items checked and flagged if triggered
- [ ] Top 5 improvements sorted by weighted impact, not arbitrary
- [ ] Every recommendation is specific and actionable (not generic advice)
- [ ] Action plan includes concrete steps with effort estimates

## Example

See [references/item-reference.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/cross-cutting/content-quality-auditor/references/item-reference.md) for a complete scored example showing the C dimension with all 10 items, priority improvements, and weighted scoring.

## Tips for Success

1. **Start with veto items** — T04, C01, R10 are deal-breakers regardless of total score
   > These veto items are consistent with the CORE-EEAT benchmark (Section 3), which defines them as items that can override the overall score.
2. **Focus on high-weight dimensions** — Different content types prioritize different dimensions
3. **GEO-First items matter most for AI visibility** — Prioritize items tagged GEO 🎯 if AI citation is the goal
4. **Some EEAT items need site-level data** — Don't penalize content for things only observable at the site level (backlinks, brand recognition)
5. **Use the weighted score, not just the raw average** — A product review with strong Exclusivity matters more than strong Authority
6. **Re-audit after improvements** — Run again to verify score improvements and catch regressions
7. **Pair with CITE for domain-level context** — A high content score on a low-authority domain signals a different priority than the reverse; run [domain-authority-auditor](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/cross-cutting/domain-authority-auditor/SKILL.md) for the full 120-item picture

## Reference Materials

- [CORE-EEAT Content Benchmark](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/core-eeat-benchmark.md) — Full 80-item benchmark with dimension definitions, scoring criteria, and GEO-First item markers
- [references/item-reference.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/cross-cutting/content-quality-auditor/references/item-reference.md) — All 80 item IDs in a compact lookup table + site-level item handling notes + scored example report
- [references/score-provenance-schema.json](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/score-provenance-schema.json) — Schema defining required provenance fields for all 80 CORE-EEAT items

## Score Provenance Output (REQUIRED)

When running as part of company-analysis, you MUST output ALL 80 CORE-EEAT items to `score-provenance.json` → `core_eeat_provenance.dimensions`.

**Dimensions and items:**

| Dimension | Items | Count | Scorer |
|-----------|-------|-------|--------|
| C (Contextual Clarity) | C01-C10 | 10 | This skill (page-level) |
| O (Organization) | O01-O10 | 10 | This skill (page-level) |
| R (Referenceability) | R01-R10 | 10 | This skill (page-level) |
| E (Exclusivity) | E01-E10 | 10 | This skill (page-level) |
| Exp (Experience) | Exp01-Exp10 | 10 | entity-optimizer (import from hot-cache) |
| Ept (Expertise) | Ept01-Ept10 | 10 | entity-optimizer (import from hot-cache) |
| A (Authoritativeness) | A01-A10 | 10 | domain-authority-auditor (import from hot-cache) |
| T (Trustworthiness) | T01-T10 | 10 | domain-authority-auditor (import from hot-cache) |
| **TOTAL** | | **80** | |

**Each item MUST include these fields:**

```json
{
  "id": "C01",
  "name": "Intent Alignment",
  "score": 8,
  "source_skill": "content-quality-auditor",
  "source_step": 11,
  "raw_data": "Title promise matches content delivery on 3/4 sampled pages",
  "calculation": "75% alignment → 8/10"
}
```

**Required fields:**
- `id`: Item ID (e.g., C01, O05, Exp03, T04)
- `name`: Human-readable item name from CORE-EEAT spec
- `score`: 0-10 (0=Fail, 5=Partial, 10=Pass)
- `source_skill`: Which skill provided the data
- `source_step`: Step number where data was collected
- `raw_data`: The actual measurement or observation — be specific
- `calculation`: How raw_data became the score — show the threshold/formula

**For org-level items imported from other skills:**

```json
{
  "id": "A03",
  "name": "Industry Awards",
  "score": 6,
  "source_skill": "domain-authority-auditor",
  "source_step": 10,
  "raw_data": "1 industry award mentioned (2023 B2B supplier award)",
  "calculation": "1 award = PARTIAL (need >=3 for PASS)"
}
```

**If data unavailable**, use this template:

```json
{
  "id": "Exp05",
  "name": "Usage Duration",
  "score": 5,
  "source_skill": "estimated",
  "source_step": null,
  "raw_data": "No usage duration claims found in content",
  "calculation": "Default mid-range score (5) due to missing evidence"
}
```

**Validation**: The `finalize-analysis.js` script validates that all 80 items are present with non-empty `raw_data` and `calculation` fields. Missing items will cause validation failure.

## Next Best Skill

- **Primary**: [content-refresher](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/content-refresher/SKILL.md) — turn failed checks into a concrete rewrite plan.
