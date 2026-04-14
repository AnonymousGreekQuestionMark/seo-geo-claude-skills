---
skill: citation-baseline
phase: 01
step: 1.5
status: DONE_WITH_CONCERNS
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier2_mcp_ai_citation_monitor
---

## Handoff Summary — citation-baseline

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Measure AI citation frequency, prominence, and cross-engine consistency for caplinq.com
- **Key Findings**: 0% direct URL citation rate across 13 queries. However, CAPLINQ brand IS mentioned by name in polyimide tape query (LINQTAPE™ cited). Brand awareness exists but not URL attribution.
- **Evidence**: 13 queries tested across Gemini (OpenAI had errors). 26 prompts saved to prompt-results.json.
- **Open Loops**: OpenAI API errors prevented full cross-engine testing; Gemini 503 errors on 2 queries
- **Maps to**: CITE C05 (Citation Frequency), C06 (Prominence), C07 (Cross-Engine), C08 (Sentiment)
- **Recommended Next Skill**: keyword-research (Step 2)

## Citation Results Summary

| Metric | Value |
|--------|-------|
| Total Queries Tested | 13 |
| Queries with Citation | 0 |
| Direct URL Citation Rate | 0% |
| Brand Mentions (in content) | 1 (polyimide tape) |
| Engines Tested | Gemini (OpenAI errors) |
| Prompts Saved | 26 |

## Results by Query Type

### Brand Queries (3)
| Query | Gemini Cited | Notes |
|-------|--------------|-------|
| What is CAPLINQ? | No | Gemini knows CAPLINQ, describes products correctly |
| CAPLINQ company overview | No | Accurate description but no URL citation |
| CAPLINQ specialty chemicals | No | Empty response |

**Insight**: AI engines KNOW about CAPLINQ (correct description of products, markets, founding date) but do NOT cite caplinq.com as a source.

### Industry Queries (4)
| Query | Gemini Cited | Notes |
|-------|--------------|-------|
| best specialty chemicals distributors | Error | Gemini 503 (high demand) |
| top semiconductor materials suppliers | No | Lists Sumitomo, Shin-Etsu, GlobalWafers, DuPont, Indium Corp |
| European chemicals distributors | No | Market overview, no specific company citations |
| REACH only representative services | Error | Gemini 503 (high demand) |

**Insight**: CAPLINQ not mentioned in competitive industry queries. Competitors (Shin-Etsu, DuPont, Indium Corp) are cited.

### Hero Keyword Queries (6)
| Query | Gemini Cited | Notes |
|-------|--------------|-------|
| best thermal interface materials suppliers | No | Lists 3M, Dow, DuPont/Laird |
| die attach materials comparison | No | Empty response |
| ion exchange membranes for fuel cells | No | Technical explanation, no supplier mentions |
| polyimide tape manufacturers | **BRAND MENTIONED** | CAPLINQ + LINQTAPE™ PIT-Series mentioned in content! |
| epoxy molding compounds suppliers | No | Empty response |
| conformal coating suppliers | No | Truncated response |

**Breakthrough Finding**: For "polyimide tape manufacturers", Gemini mentions:
> "**CAPLINQ Corporation** supplies its LINQTAPE™ PIT-Series brand of high-performance polyimide films and tapes. These are designed for various high-temperature applications in industries such as semiconductor, smartcard, electronic, automotive, and general manufacturing."

This indicates CAPLINQ has **some** AI visibility for polyimide tape but still lacks direct URL citation.

## CITE Dimension Scores

| Item | Score | Verdict | Raw Data |
|------|-------|---------|----------|
| C05 (Citation Frequency) | 10 | FAIL | 0/13 queries cited URL |
| C06 (Prominence) | 15 | FAIL | 1 brand mention, not primary position |
| C07 (Cross-Engine) | 20 | FAIL | Only Gemini working, OpenAI errors |
| C08 (Sentiment) | 70 | PASS | Positive when mentioned |

**C05-C08 Average**: 29/100

## AI Discoverability Gap Analysis

### Why CAPLINQ is KNOWN but NOT CITED:
1. **Missing llms.txt**: No AI-specific guidance file (404)
2. **No Schema Markup**: Homepage lacks Organization/Product JSON-LD
3. **No Knowledge Panel**: Not in Google Knowledge Graph
4. **Blog on subdomain**: blog.caplinq.com content may be less associated with main domain
5. **Competitor dominance**: 3M, DuPont, Shin-Etsu have stronger entity authority

### Polyimide Tape Success Factor:
- LINQTAPE™ is a distinctive brand name
- Blog content likely establishes topical authority
- Niche product category with less competition

## Recommendations for CITE C05-C08 Improvement

### P0 — Critical (Week 1)
1. Create `llms.txt` with company overview, products, citation preferences
2. Add Organization schema to homepage with sameAs links
3. Add robots.txt AI crawler permissions (GPTBot, Claude-Web)

### P1 — High Priority (Weeks 2-4)
4. Create dedicated landing pages for each hero keyword
5. Add FAQ schema with common industry questions
6. Build backlinks from industry publications

### P2 — Medium Priority (Months 2-3)
7. Create Wikidata entity for CAPLINQ Corporation
8. Add author profiles to blog with expertise signals
9. Develop comparison content for hero keywords

## Hot Cache Entry

```
citation_baseline: { cited_on: 0/13 queries, engines: [gemini], by_type: { brand: 0/3, industry: 0/4, hero: 0/6 }, brand_mentioned: 1, prominence_rate: 0%, sentiment: positive }
```
