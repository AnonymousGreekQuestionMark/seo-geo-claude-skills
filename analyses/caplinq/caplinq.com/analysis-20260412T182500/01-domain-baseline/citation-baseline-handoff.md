---
skill: citation-baseline
phase: 01
step: 1.5
status: DONE_WITH_CONCERNS
timestamp: 20260412T182500
domain: caplinq.com
data_source: tier2_mcp
---

## Handoff Summary — citation-baseline

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Establish AI citation baseline across brand, industry, and hero queries
- **Key Findings**: caplinq.com NOT cited across 13 queries on Gemini/Anthropic. However, "Caplinq Corporation" was mentioned by name in the "Conductive adhesives manufacturers" response (Gemini) — brand recognition exists but domain is not being linked. This indicates a GEO gap: AI engines know the company but don't cite the website.
- **Evidence**: 29 prompts logged to prompt-results.json (13 queries × ~2 engines, with Anthropic limited after first query per step)
- **Open Loops**: OpenAI API returned errors on all queries; Perplexity not available. Full cross-engine analysis incomplete.
- **Maps to**: CITE C05 (Citation Frequency), C06 (Prominence), C07 (Cross-Engine), C08 (Sentiment)
- **Recommended Next Skill**: keyword-research (Step 2)

## Full Findings

### Citation Summary

| Metric | Value |
|--------|-------|
| **Queries Tested** | 13 |
| **Domain Citations** | 0/13 (0%) |
| **Brand Mentions** | 1 (Gemini mentioned "Caplinq Corporation") |
| **Engines Tested** | Gemini (primary), Anthropic (1 query), OpenAI (errored) |
| **Prompts Saved** | 29 |

### Results by Query Type

| Type | Queries | Cited | Rate | Notes |
|------|---------|-------|------|-------|
| Brand | 3 | 0 | 0% | AI knows company, describes products accurately |
| Industry | 4 | 0 | 0% | Competitors (Brenntag, IMCD, Henkel) dominate |
| Hero | 6 | 0 | 0% | Caplinq mentioned once by name for "conductive adhesives" |

### CITE Dimension Scores (C05-C08)

| Item | Score | Verdict | Rationale |
|------|-------|---------|-----------|
| **C05** (Citation Frequency) | 15/100 | FAIL | 0/13 domain citations; threshold ≥50% for PASS |
| **C06** (Prominence) | N/A | FAIL | No citations to measure prominence position |
| **C07** (Cross-Engine) | 20/100 | PARTIAL | Only Gemini functional; OpenAI errored |
| **C08** (Sentiment) | 70/100 | PASS | Neutral-positive when mentioned |

### Brand Query Results

**Query: "What is CAPLINQ?"**
- Gemini: Described accurately (specialty chemicals, semiconductors, 2004 founded, global presence) — NO domain citation
- Anthropic: Described as "specialty chemicals and plastics expert" — NO domain citation

**Query: "CAPLINQ Corporation overview"**
- Gemini: Detailed company profile (dual business model, HQ Assendelft, $10-25M revenue) — NO domain citation

**Query: "CAPLINQ specialty chemicals supplier"**
- Gemini: Described product portfolio and services — NO domain citation

### Industry Query Results

**Competitors cited instead of CAPLINQ:**
- "Best specialty chemicals distributors" → Brenntag, Univar, IMCD, Azelis
- "Top semiconductor materials suppliers" → DuPont, Shin-Etsu, BASF, Merck
- "Leading electronics assembly materials" → MacDermid Alpha, Indium Corp, Henkel

### Hero Query Results

**Query: "Conductive adhesives manufacturers"**
- Gemini cited: 3M, AI Technology, Aremco, **Caplinq Corporation**, Chemtronics, Creative Materials, Dymax, Electrolube, Henkel
- ✓ Brand mention found but caplinq.com domain NOT linked

**Other hero queries — CAPLINQ not mentioned:**
- Thermal interface materials → 3M, Dow, Henkel
- Solder paste Europe → GENMA Europe, Ishikawa Europe
- Molding compounds → IDI Composites, Polynt, Continental

### GEO Opportunity Analysis

| Gap | Recommendation |
|-----|----------------|
| Domain not cited | Implement llms.txt with company info and product pages |
| Competitors dominate industry queries | Create authoritative content for "best X suppliers" topics |
| Brand known but not linked | Ensure website content matches AI training expectations |
| Missing from hero queries | Add comprehensive product comparison pages |

### Hot Cache Entry

```
citation_baseline: { cited_on: 0/13 queries, brand_mentions: 1, engines: [gemini, anthropic], by_type: { brand: 0/3, industry: 0/4, hero: 0/6 }, prominence_rate: 0% }
```
