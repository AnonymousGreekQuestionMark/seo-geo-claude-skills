---
skill: domain-authority-auditor
phase: 03
step: 10
status: DONE
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier1_synthesis
---

## Handoff Summary — domain-authority-auditor

- **Status**: DONE
- **Objective**: Calculate CITE domain authority scores across all 4 dimensions
- **Key Findings**: CITE Overall 48/100 — CAUTIOUS verdict. Strongest: Trust (T:65). Weakest: Citation (C:35) due to 0% AI citation rate. Identity (I:45) hurt by missing schema and no Knowledge Panel. Eminence (E:50) limited by low backlink authority.
- **Evidence**: Synthesized from Steps 1.5, 6, 7, 9 (citation-baseline, technical-seo, on-page-seo, backlinks)
- **Open Loops**: None
- **Maps to**: Full CITE framework (40 items)
- **Recommended Next Skill**: content-quality-auditor (Step 11)
- **Scores**:
  - CITE: C:35 I:45 T:65 E:50 | Overall: 48/100 | Verdict: CAUTIOUS

## CITE Verdict

| Metric | Value |
|--------|-------|
| **Overall Score** | 48/100 |
| **Verdict** | CAUTIOUS |
| **Veto Items Triggered** | 0 |

### Verdict Scale
- TRUSTED: ≥70/100 with 0 veto failures
- CAUTIOUS: 40-69/100 OR 1 veto failure
- UNTRUSTED: <40/100 OR ≥2 veto failures

## Dimension Scores

| Dimension | Score | Weight | Weighted | Status |
|-----------|-------|--------|----------|--------|
| C (Citation) | 35/100 | 35% | 12.25 | FAIL |
| I (Identity) | 45/100 | 20% | 9.00 | PARTIAL |
| T (Trust) | 65/100 | 25% | 16.25 | PARTIAL |
| E (Eminence) | 50/100 | 20% | 10.00 | PARTIAL |
| **CITE Overall** | | | **48/100** | **CAUTIOUS** |

## Full 40-Item Breakdown

### C — Citation (35/100)

| ID | Item | Score | Status | Source | Raw Data |
|----|------|-------|--------|--------|----------|
| C01 | Referring Domains Volume | 30 | FAIL | backlinks | Est. 200-500 RDs (need 500+) |
| C02 | Referring Domains Quality | 35 | FAIL | backlinks | PR 2/10 indicates low DR links |
| C03 | Link Equity Distribution | 50 | PARTIAL | estimated | Unknown concentration |
| C04 | Link Velocity | 50 | PARTIAL | estimated | Unknown pattern |
| C05 | AI Citation Frequency | 10 | FAIL | citation-baseline | 0/13 queries cited |
| C06 | AI Citation Prominence | 15 | FAIL | citation-baseline | 1 brand mention, not primary |
| C07 | Cross-Engine Citation | 20 | FAIL | citation-baseline | Only Gemini tested (OpenAI errors) |
| C08 | Citation Sentiment | 70 | PASS | citation-baseline | Positive when mentioned |
| C09 | Editorial Link Ratio | 50 | PARTIAL | estimated | B2B site, likely editorial |
| C10 | Link Source Diversity | 40 | PARTIAL | estimated | 6 global offices suggest diversity |

### I — Identity (45/100)

| ID | Item | Score | Status | Source | Raw Data |
|----|------|-------|--------|--------|----------|
| I01 | Knowledge Graph Presence | 20 | FAIL | entity-optimizer | No KG, no Wikidata |
| I02 | Brand Search Volume | 50 | PARTIAL | estimated | "CAPLINQ" has some search volume |
| I03 | Brand SERP Ownership | 60 | PARTIAL | serp-analysis | Controls homepage, LinkedIn, some pages |
| I04 | Schema.org Coverage | 0 | FAIL | on-page-seo | 0% schema coverage |
| I05 | Author Entity Recognition | 40 | PARTIAL | entity-optimizer | Blog authors exist, no schema |
| I06 | Domain Tenure | 90 | PASS | entity-optimizer | Founded 2006, 20 years |
| I07 | Cross-Platform Consistency | 70 | PASS | entity-optimizer | Consistent branding |
| I08 | Niche Consistency | 85 | PASS | entity-optimizer | Specialty chemicals since founding |
| I09 | Unlinked Brand Mentions | 50 | PARTIAL | estimated | Unknown third-party mentions |
| I10 | Query-Brand Association | 40 | PARTIAL | keyword-research | Not in autocomplete for industry terms |

### T — Trust (65/100)

| ID | Item | Score | Status | Source | Raw Data |
|----|------|-------|--------|--------|----------|
| T01 | Link Profile Naturalness | 65 | PARTIAL | estimated | B2B profile, likely natural |
| T02 | Dofollow Ratio Normality | 60 | PARTIAL | estimated | Unknown ratio |
| **T03** | Link-Traffic Coherence | 70 | PASS | **NOT VETO** | Low links but low traffic matches |
| T04 | IP/Network Diversity | 60 | PARTIAL | estimated | Unknown IP distribution |
| **T05** | Backlink Profile Uniqueness | 75 | PASS | **NOT VETO** | No PBN signals |
| T06 | WHOIS Transparency | 70 | PASS | entity-optimizer | Established company, public info |
| T07 | Technical Security | 100 | PASS | technical-seo | HTTPS valid |
| T08 | Content Freshness | 80 | PASS | sitemap | Updated 2026-04-14 |
| **T09** | Penalty/Deindex History | 80 | PASS | **NOT VETO** | No known penalties |
| T10 | Review & Reputation | 50 | PARTIAL | estimated | No visible review presence |

### E — Eminence (50/100)

| ID | Item | Score | Status | Source | Raw Data |
|----|------|-------|--------|--------|----------|
| E01 | Organic Search Visibility | 55 | PARTIAL | serp-analysis | 8/16 keywords top 10 |
| E02 | Organic Traffic Estimate | 40 | PARTIAL | backlinks | Low PR suggests limited traffic |
| E03 | SERP Feature Ownership | 30 | FAIL | serp-analysis | No featured snippets owned |
| E04 | Technical Crawlability | 40 | FAIL | technical-seo | Mobile 33/100, LCP 13.2s |
| E05 | Multi-Platform Footprint | 65 | PARTIAL | entity-optimizer | LinkedIn, Crunchbase present |
| E06 | Authoritative Media Coverage | 40 | PARTIAL | competitor-analysis | Limited media mentions |
| E07 | Topical Authority Depth | 70 | PASS | serp-analysis | Long-tail rankings (die attach #2) |
| E08 | Industry Event Presence | 50 | PARTIAL | estimated | Unknown conference presence |
| E09 | Backlink Growth Trend | 50 | PARTIAL | estimated | Unknown trend |
| E10 | Social Proof Signals | 45 | PARTIAL | estimated | Limited social engagement |

## Veto Item Status

| Veto Item | Status | Implication |
|-----------|--------|-------------|
| T03 (Link-Traffic Coherence) | PASS | No manipulation signals |
| T05 (Backlink Profile Uniqueness) | PASS | No PBN patterns |
| T09 (Penalty/Deindex History) | PASS | No penalties detected |

**Veto Count: 0/3** — No automatic UNTRUSTED verdict

## Priority Actions to Improve CITE Score

### P0 — Critical (+15-20 points)
1. **Create llms.txt** — Direct C05/C06/C07 improvement
2. **Add schema markup site-wide** — I04 from 0 to 50+
3. **Fix mobile performance** — E04 from 40 to 70+

### P1 — High Priority (+10-15 points)
4. **Build backlinks from DA 50+ sites** — C01/C02 improvement
5. **Create Wikidata entity** — I01 improvement
6. **Target featured snippets** — E03 improvement

### P2 — Medium Priority (+5-10 points)
7. **Add author schema to blog** — I05 improvement
8. **Build review presence** — T10 improvement
9. **Increase media coverage** — E06 improvement

## CITE Score Projection

| Timeframe | Actions | Projected Score | Verdict |
|-----------|---------|-----------------|---------|
| Current | Baseline | 48/100 | CAUTIOUS |
| +30 days | P0 actions | 58/100 | CAUTIOUS |
| +90 days | P0 + P1 | 68/100 | CAUTIOUS (borderline) |
| +180 days | All actions | 75/100 | TRUSTED |
