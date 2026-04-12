---
skill: serp-analysis
phase: 02
step: 4
status: DONE
timestamp: 20260412T182500
domain: caplinq.com
data_source: tier2_mcp
---

## Handoff Summary — serp-analysis

- **Status**: DONE
- **Objective**: Analyze SERP positions and features for target keywords
- **Key Findings**: CAPLINQ has strong organic rankings: #1 for "epoxy molding compound suppliers", #2 for "die attach materials", #3 for "REACH only representative Europe". Featured snippet captured for epoxy molding compounds. Gap: not ranking for "thermal interface materials suppliers" (despite product offerings). AI Overview not present on tested queries.
- **Evidence**: Serper API — 5 queries analyzed
- **Open Loops**: None
- **Maps to**: CITE I01-I03 (Indexability), C01-C04 (Citation potential)
- **Recommended Next Skill**: content-gap-analysis (Step 5)

## Full Findings

### SERP Position Summary

| Query | Position | URL | Featured Snippet |
|-------|----------|-----|------------------|
| **epoxy molding compound suppliers** | #1 ✓ | /semiconductor-epoxy-mold-compounds.html | ✓ Captured |
| **die attach materials** | #2 ✓ | /die-attach-materials.html | ✗ Wevolver #1 |
| **REACH only representative Europe** | #3 ✓ | /reach-only-representative.html | ✗ Ecomundo #1 |
| **conductive adhesives manufacturers** | #7 | /electrically-conductive-adhesives.html | ✗ Henkel #1 |
| **thermal interface materials suppliers** | NOT RANKED | — | ✗ Laird #1 |

### SERP Features Analysis

| Query | AI Overview | PAA | Knowledge Graph |
|-------|-------------|-----|-----------------|
| epoxy molding compound suppliers | ✗ No | ✓ Yes | ✗ No |
| die attach materials | ✗ No | ✓ Yes | ✗ No |
| REACH only representative Europe | ✗ No | ✓ Yes | ✗ No |
| conductive adhesives manufacturers | ✗ No | ✓ Yes | ✗ No |
| thermal interface materials suppliers | ✗ No | ✗ No | ✗ No |

**Key Observation**: No AI Overviews present for B2B industrial queries — traditional SEO still dominates.

### Featured Snippet Analysis

**Won:**
- "epoxy molding compound suppliers" — CAPLINQ owns snippet with: "Semiconductor molding compounds are fine filled, electrically stable compounds, ideal for the miniaturised semiconductor packaging requirements."

**Opportunities:**
- "die attach materials" — Current snippet (Wevolver) is educational. CAPLINQ could win with comprehensive comparison guide.
- "REACH only representative Europe" — Current snippet (Ecomundo) defines OR role. CAPLINQ could win with actionable "How to appoint" content.

### People Also Ask Analysis

| Query | PAA Questions | Content Opportunity |
|-------|--------------|---------------------|
| conductive adhesives | "Who are the leading adhesive manufacturers?", "What is the best electrically conductive adhesive?" | Create "Best Conductive Adhesives" comparison |
| die attach materials | "What is die attach material?", "What is the strongest bonding epoxy?" | Create educational guide |
| REACH OR | "What is an only representative?", "What is the US equivalent of REACH?" | Create FAQ content |

### Competitor SERP Presence

| Competitor | Queries Ranking For | Avg Position |
|------------|---------------------|--------------|
| **Henkel** | conductive adhesives (#1), thermal (#implicit) | 1-3 |
| **Laird** | thermal interface (#1), die attach (#6) | 1-6 |
| **Shin-Etsu** | thermal (#6), die attach (#4), molding (#5) | 4-6 |
| **Indium** | thermal (#3) | 3 |
| **CAPLINQ** | molding (#1), die attach (#2), REACH (#3), conductive (#7) | 1-7 |

### Ranking URL Analysis

| URL | Queries Ranking | Issue |
|-----|-----------------|-------|
| /semiconductor-epoxy-mold-compounds.html | 1 query (#1) | ✓ Optimal |
| /die-attach-materials.html | 1 query (#2) | ✓ Good |
| /reach-only-representative.html | 1 query (#3) | ✓ Good |
| /electrically-conductive-adhesives.html | 1 query (#7) | Could improve |
| /thermal-interface-materials | 0 queries | ✗ HTTP 410 — BROKEN |

### Critical Issue: TIM Page Returns 410

The thermal interface materials category page returns HTTP 410 (Gone), explaining why CAPLINQ doesn't rank for this competitive keyword. This is a **P0 fix** — competitors (Laird, Indium, Henkel) own this SERP.

### Related Searches Opportunities

From SERP related searches:
1. "Automotive thermal interface materials suppliers" — no CAPLINQ page
2. "Conductive adhesives manufacturers usa" — CAPLINQ has US presence, not targeted
3. "Epoxy molding compound suppliers usa" — additional targeting opportunity
4. "Die attach process in semiconductor" — educational content gap

### SERP Strategy Recommendations

| Priority | Action | Expected Impact |
|----------|--------|-----------------|
| **P0** | Fix TIM category page (410 → live) | Rank for #1 hero keyword |
| **P0** | Win die attach featured snippet | Move #2 → #1 with featured |
| **P1** | Target "automotive" modifiers | Capture industry vertical traffic |
| **P1** | Create PAA-optimized FAQ content | Win PAA boxes |
| **P2** | Geographic targeting (USA, Europe) | Capture regional searches |
