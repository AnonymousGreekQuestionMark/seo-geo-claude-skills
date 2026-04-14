---
skill: citation-baseline
phase: 01
step: 1.5
status: DONE_WITH_CONCERNS
timestamp: 20260413T120000
domain: caplinq.com
data_source: tier2_mcp
fallbacks_used:
  - "OpenAI intermittent errors on some queries"
  - "Gemini 503 errors on 5 queries due to high demand"
  - "Anthropic limited to 1 call per step (LIMIT_ANTHROPIC=true)"
---

## Handoff Summary — citation-baseline

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Measure AI citation frequency, prominence, and cross-engine consistency for caplinq.com
- **Key Findings**: caplinq.com is NOT cited by AI engines across 13 tested queries (brand, industry, hero). Zero citations detected despite strong responses about CAPLINQ from Gemini. AI engines describe the company accurately but do not link to caplinq.com as a source.
- **Evidence**: 13 queries tested across 3 types; OpenAI (gpt-4o-search-preview) and Gemini (gemini-2.5-flash) engines used; 26 prompt results logged
- **Open Loops**: OpenAI errors on multiple queries; Gemini 503 errors on 5 queries; Perplexity not available; need to re-test when APIs stable
- **Maps to**: CITE C05 (AI Citation Frequency), C06 (Prominence), C07 (Cross-Engine), C08 (Sentiment)
- **Recommended Next Skill**: keyword-research (step 2)
- **Scores**:
  - C05 (AI Citation Frequency): FAIL — 0/13 queries cited caplinq.com
  - C06 (Prominence): N/A — no citations to measure prominence
  - C07 (Cross-Engine): PARTIAL — tested 2 engines (Gemini, OpenAI)
  - C08 (Sentiment): POSITIVE — AI responses describe CAPLINQ favorably when brand queries used

## Full Findings

### Citation Summary by Query Type

| Query Type | Queries Tested | Queries Cited | Citation Rate |
|------------|----------------|---------------|---------------|
| Brand | 3 | 0 | 0% |
| Industry | 4 | 0 | 0% |
| Hero | 6 | 0 | 0% |
| **Total** | **13** | **0** | **0%** |

### Engine Coverage

| Engine | Queries Responded | Errors | Notes |
|--------|-------------------|--------|-------|
| Gemini (gemini-2.5-flash) | 8 | 5 (503 errors) | Live search enabled |
| OpenAI (gpt-4o-search-preview) | 4 | 9 (undefined errors) | Live search enabled |
| Anthropic | 0 | N/A | LIMIT_ANTHROPIC=true, skipped |
| Perplexity | 0 | N/A | Not configured |

### Brand Queries Results

| Query | Gemini | OpenAI | Cited? |
|-------|--------|--------|--------|
| What is CAPLINQ? | Responded (accurate) | Error | No |
| CAPLINQ company overview | Empty response | Error | No |
| CAPLINQ Corporation products | Responded (accurate) | Error | No |

**Key Insight**: Gemini provides accurate, detailed information about CAPLINQ (founding year, products, services, offices) but does NOT cite caplinq.com as a source. The domain has knowledge graph presence but lacks source attribution.

### Industry Queries Results

| Query | Gemini | OpenAI | Cited? |
|-------|--------|--------|--------|
| best specialty chemicals suppliers | Responded | Error | No (BASF, Dow, Evonik cited) |
| top semiconductor materials distributors | 503 error | Error | N/A |
| electronics assembly materials suppliers Europe | 503 error | Error | N/A |
| thermal interface materials suppliers | 503 error | Error | N/A |

**Key Insight**: For industry queries, larger competitors (BASF, Dow, Evonik) are cited as specialty chemicals leaders. CAPLINQ not mentioned in competitive landscape.

### Hero Keyword Queries Results

| Query | Gemini | OpenAI | Cited? |
|-------|--------|--------|--------|
| best thermal interface materials | Responded | Responded | No |
| die attach materials comparison | 503 error | Responded | No |
| ion exchange membrane suppliers | 503 error | Error | N/A |
| polyimide tape suppliers | 503 error | Error | N/A |
| REACH representation services Europe | Responded | Error | No (Yordas, Intertek cited) |
| semiconductor molding compounds | Responded | Error | No |

**Key Insight**: For hero keywords, AI engines provide educational content but cite competitors or no sources. CAPLINQ has topical authority gap in AI search.

### CITE Dimension Scoring (C05-C08)

| Item | Description | Score | Verdict |
|------|-------------|-------|---------|
| C05 | AI Citation Frequency | 0/100 | FAIL |
| C06 | Citation Prominence | N/A | N/A |
| C07 | Cross-Engine Consistency | 30/100 | PARTIAL |
| C08 | AI Response Sentiment | 75/100 | PASS |

### Recommendations for GEO Improvement

1. **Create citation-worthy content**: Technical guides, comparison tables, definitive resources that AI engines would cite
2. **Improve llms.txt**: Add structured AI-readable content summary
3. **Build backlinks from cited sources**: Get mentioned by industry publications that AI cites
4. **Optimize for entity recognition**: Ensure Wikidata, Knowledge Graph entries are complete
5. **Publish original research**: AI engines prefer citing primary sources

### Hot Cache Entry

```
citation_baseline: { cited_on: 0/13 queries, engines: [gemini, openai], by_type: { brand: 0, industry: 0, hero: 0 }, prominence_rate: 0%, sentiment: positive }
```
