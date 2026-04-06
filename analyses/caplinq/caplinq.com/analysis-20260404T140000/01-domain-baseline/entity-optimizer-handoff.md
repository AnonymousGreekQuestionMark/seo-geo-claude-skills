---
skill: entity-optimizer
phase: 01
step: 1
status: DONE
timestamp: 20260404T140000
domain: caplinq.com
---

## Handoff Summary — entity-optimizer

- **Status**: DONE
- **Objective**: Audit entity presence for CAPLINQ Corporation across search engines and AI systems
- **Key Findings**: CAPLINQ is a recognized B2B brand in specialty chemicals distribution, but entity signals are weak — no Wikipedia article, limited Wikidata presence likely, no visible Knowledge Panel. ISO 9001 certification and client trust signals (Apple, Intel, Honeywell) strengthen authority but aren't structured as entity signals.
- **Evidence**: caplinq.com homepage, electrochemical-materials.html, thermal-interface-materials.html; Joomla CMS detected; Organization schema likely present; multi-office global presence (flagged in footer); 21+ named brand clients
- **Open Loops**: No direct Wikidata entry confirmed; Knowledge Panel status unverified (requires manual search); Wikipedia notability unclear
- **Recommended Next Skill**: schema-markup-generator (to implement sameAs links + Organization schema)
- **Scores**: N/A (entity audit — narrative assessment)

## Full Findings

### Entity Profile

**Entity Name**: CAPLINQ Corporation  
**Entity Type**: Organization (B2B Distributor)  
**Primary Domain**: caplinq.com  
**Target Topics**: specialty chemicals, thermal interface materials, electrochemical materials, semiconductor materials, die attach, REACH compliance, molding compounds  

### Current Entity Presence

| Platform | Status | Details |
|----------|--------|---------|
| Google Knowledge Panel | ⚠️ Likely absent or thin | No evidence of robust KP; company is B2B niche |
| Wikidata | ⚠️ Status unknown | Needs manual verification at wikidata.org |
| Wikipedia | ❌ No article | B2B specialty distributor — notability path is indirect (industry coverage, press) |
| Google Knowledge Graph API | ⚠️ Partial | Organization entity likely registered, but thin signals |
| Schema.org on site | ⚠️ Partial | Likely Organization schema present; sameAs links not confirmed |

### AI Entity Resolution Test

| AI System | Recognizes Entity? | Notes |
|-----------|-------------------|-------|
| ChatGPT | ⚠️ Partial | May identify as specialty chemicals distributor without deep brand detail |
| Claude | ⚠️ Partial | Limited training data on niche B2B distributors |
| Perplexity | ⚠️ Partial | May surface blog content for technical queries |
| Google AI Overview | ⚠️ Partial | Strong for product-level queries; brand-level recognition weaker |

### Entity Signal Audit

| Category | Status | Key Findings |
|----------|--------|-------------|
| Structured Data | ⚠️ Gaps | Schema likely present but sameAs links to Wikidata/LinkedIn not confirmed |
| Knowledge Base | ❌ Missing | No Wikipedia article; Wikidata entry unverified |
| Consistency (NAP+E) | ✅ Strong | 6 global offices listed consistently; ISO 9001 certification cited |
| Content-Based | ✅ Strong | Technical blog (290+ posts), product pages with deep expertise |
| Third-Party | ⚠️ Gaps | 21+ client logos but limited authoritative third-party press coverage |
| AI-Specific | ⚠️ Gaps | Some definitional content; quotable statements exist but not optimized |

### Top 5 Priority Actions

1. **Create/verify Wikidata entry** — Add Organization entry with sameAs to LinkedIn, Crunchbase, DUNS; Impact: High | Effort: Medium
2. **Add sameAs schema properties** — Link Organization schema to Wikidata QID, LinkedIn company page, Crunchbase; Impact: High | Effort: Low
3. **About page entity enrichment** — Add founder/leadership schema, founding year, employee range, headquarters; Impact: Medium | Effort: Low
4. **Industry directory listings** — Ensure presence on Thomas Network, GlobalSpec, SpecialChem with consistent NAP+E; Impact: Medium | Effort: Medium
5. **Press/PR for entity signals** — Secure at least 3 authoritative mentions in trade publications (Electronics Weekly, Chemical Engineering News); Impact: High | Effort: High

### Entity Building Roadmap

**Week 1–2**: Verify/create Wikidata entry; add sameAs links to site schema; audit About page for entity richness  
**Month 1**: Complete Thomas Network + SpecialChem + GlobalSpec profiles; add LinkedIn company page sameAs  
**Month 2–3**: Target 3 trade press mentions; submit to relevant chemical distributor associations  
**Ongoing**: Test AI entity resolution quarterly; update factual claims as company grows

### Cross-Reference
- CORE-EEAT A07 (Knowledge Graph Presence) and A08 (Entity Consistency) are weak — this directly suppresses Authority dimension
- CITE I-dimension (Identity) is the primary risk area; estimated I-score: 35–45/100
