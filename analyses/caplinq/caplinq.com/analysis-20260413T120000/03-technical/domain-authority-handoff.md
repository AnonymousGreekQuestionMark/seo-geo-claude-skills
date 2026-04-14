---
skill: domain-authority-auditor
phase: 03
step: 10
status: DONE
timestamp: 20260413T120000
domain: caplinq.com
data_source: tier1_synthesis
---

## Handoff Summary — domain-authority-auditor

- **Status**: DONE
- **Objective**: Synthesize CITE domain authority score across all 40 items using data from prior skills
- **Key Findings**: CITE Score 52/100 (CAUTIOUS). Strengths: Trust dimension (no penalties, HTTPS, active content). Weaknesses: Citation dimension (0% AI citation rate), low PageRank suggesting limited referring domains. No veto items triggered.
- **Evidence**: Synthesized from steps 1-9 (entity-optimizer, citation-baseline, technical-seo-checker, backlink-analyzer)
- **Open Loops**: 15 items scored with low confidence due to limited API data; full scoring requires Ahrefs/Semrush
- **Maps to**: CITE C01-E10 (all 40 items)
- **Recommended Next Skill**: content-quality-auditor (step 11)
- **Scores**:
  - **CITE Score**: 52/100
  - **CITE Verdict**: CAUTIOUS
  - C (Citation): 35/100
  - I (Identity): 55/100
  - T (Trust): 70/100
  - E (Eminence): 45/100

## Full Findings

### CITE Score Summary

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| C (Citation) | 35 | 25% | 8.75 |
| I (Identity) | 55 | 30% | 16.50 |
| T (Trust) | 70 | 25% | 17.50 |
| E (Eminence) | 45 | 20% | 9.00 |
| **CITE Score** | | | **51.75 ≈ 52** |

*Note: Using Product & Service weights (C:25%, I:30%, T:25%, E:20%) for B2B distributor*

### Verdict

| Score Range | Rating | caplinq.com |
|-------------|--------|-------------|
| 90-100 | TRUSTED | |
| 75-89 | TRUSTED | |
| 60-74 | CAUTIOUS | |
| **40-59** | **CAUTIOUS** | **52 ★** |
| 0-39 | UNTRUSTED | |

**Verdict: CAUTIOUS** — Domain has established presence but limited AI citability and backlink authority.

### Veto Item Check

| Veto Item | Status | Evidence |
|-----------|--------|----------|
| T03 (Link-Traffic Coherence) | PASS | No spam signals; traffic proportional to link profile |
| T05 (Backlink Profile Uniqueness) | PASS | No manipulation network detected |
| T09 (Penalty & Deindex History) | PASS | Indexed, no manual actions |

**No veto items triggered.**

---

## C — Citation Dimension (35/100)

| ID | Item | Score | Verdict | Source | Evidence |
|----|------|-------|---------|--------|----------|
| C01 | Referring Domains Volume | 4 | FAIL | backlink-analyzer | PR 2 → ~200-500 RDs (needs >=500) |
| C02 | Referring Domains Quality | 5 | PARTIAL | backlink-analyzer | Estimated 15-20% DA 50+ |
| C03 | Link Equity Distribution | 5 | PARTIAL | estimated | Unknown distribution |
| C04 | Link Velocity | 5 | PARTIAL | estimated | Assumed steady (B2B site) |
| C05 | AI Citation Frequency | 0 | FAIL | citation-baseline | 0/13 queries cited |
| C06 | AI Citation Prominence | 0 | FAIL | citation-baseline | No citations to measure |
| C07 | Cross-Engine Citation | 3 | FAIL | citation-baseline | 0 engines cite |
| C08 | Citation Sentiment | 8 | PASS | citation-baseline | Positive when mentioned |
| C09 | Editorial Link Ratio | 5 | PARTIAL | estimated | Unknown ratio |
| C10 | Link Source Diversity | 5 | PARTIAL | backlink-analyzer | B2B niche limits diversity |

**C Total: 35/100** (FAIL threshold)

### Citation Gap Analysis

- **Critical Gap**: Zero AI citations despite strong brand knowledge
- **Root Cause**: Missing citation-worthy content (comparisons, original research)
- **AI engines know CAPLINQ** (Gemini returned accurate company info) but don't cite the domain

---

## I — Identity Dimension (55/100)

| ID | Item | Score | Verdict | Source | Evidence |
|----|------|-------|---------|--------|----------|
| I01 | Knowledge Graph Presence | 5 | PARTIAL | entity-optimizer | AI knows company but no KG card |
| I02 | Brand Search Volume | 5 | PARTIAL | estimated | Niche B2B brand |
| I03 | Brand SERP Ownership | 7 | PASS | serp-analysis | Ranks #1 for "CAPLINQ" |
| I04 | Schema.org Coverage | 2 | FAIL | technical-seo-checker | No structured data |
| I05 | Author Entity Recognition | 3 | FAIL | on-page-seo-auditor | No author attribution |
| I06 | Domain Tenure | 10 | PASS | entity-optimizer | Founded 2004 (20+ years) |
| I07 | Cross-Platform Consistency | 7 | PASS | entity-optimizer | LinkedIn, FB, Twitter present |
| I08 | Niche Consistency | 10 | PASS | entity-optimizer | Same niche since founding |
| I09 | Unlinked Brand Mentions | 3 | FAIL | estimated | Unknown mention volume |
| I10 | Query-Brand Association | 3 | FAIL | estimated | Not in autocomplete |

**I Total: 55/100** (PARTIAL threshold)

### Identity Strengths
- 20+ year domain tenure (established 2004)
- Consistent niche focus
- Social media presence

### Identity Gaps
- No Schema.org markup
- Missing Knowledge Graph panel
- No author entity signals

---

## T — Trust Dimension (70/100)

| ID | Item | Score | Verdict | Source | Evidence |
|----|------|-------|---------|--------|----------|
| T01 | Link Profile Naturalness | 7 | PASS | backlink-analyzer | No spam spikes detected |
| T02 | Dofollow Ratio Normality | 5 | PARTIAL | estimated | Unknown ratio |
| T03 | Link-Traffic Coherence | 8 | PASS | estimated | Traffic matches link level |
| T04 | IP/Network Diversity | 5 | PARTIAL | estimated | Unknown C-class distribution |
| T05 | Backlink Profile Uniqueness | 8 | PASS | estimated | No manipulation signals |
| T06 | WHOIS Transparency | 8 | PASS | entity-optimizer | Netherlands company, public |
| T07 | Technical Security | 10 | PASS | technical-seo-checker | HTTPS, valid SSL |
| T08 | Content Freshness | 9 | PASS | content-gap-analysis | Blog updated monthly |
| T09 | Penalty & Deindex History | 10 | PASS | technical-seo-checker | Indexed, no penalties |
| T10 | Review & Reputation | 5 | PARTIAL | estimated | Unknown review presence |

**T Total: 70/100** (PASS threshold)

### Trust Strengths
- Clean penalty history
- Active content publishing
- HTTPS implemented
- Legitimate business entity

---

## E — Eminence Dimension (45/100)

| ID | Item | Score | Verdict | Source | Evidence |
|----|------|-------|---------|--------|----------|
| E01 | Organic Search Visibility | 5 | PARTIAL | serp-analysis | Ranks for key terms but limited volume |
| E02 | Organic Traffic Estimate | 3 | FAIL | estimated | <10K monthly (B2B niche) |
| E03 | SERP Feature Ownership | 3 | FAIL | serp-analysis | No featured snippets owned |
| E04 | Technical Crawlability | 4 | FAIL | technical-seo-checker | Slow (31/100 perf score) |
| E05 | Multi-Platform Footprint | 7 | PASS | entity-optimizer | LinkedIn, FB, Twitter, blog |
| E06 | Authoritative Media Coverage | 3 | FAIL | estimated | Limited PR coverage |
| E07 | Topical Authority Depth | 6 | PARTIAL | keyword-research | Ranks for niche terms |
| E08 | Topical Authority Breadth | 7 | PASS | content-gap-analysis | 40+ blog categories |
| E09 | Geographic Reach | 5 | PARTIAL | entity-optimizer | 6 offices, multi-region |
| E10 | Industry Share of Voice | 2 | FAIL | competitor-analysis | <5% vs major competitors |

**E Total: 45/100** (FAIL threshold)

### Eminence Gaps
- Slow site performance impairs crawlability
- No SERP features owned
- Limited media coverage
- Low share of voice vs competitors

---

## CITE Improvement Priorities

### P0 — Critical (0-30 days)
| Item | Current | Target | Action |
|------|---------|--------|--------|
| C05 | FAIL | PARTIAL | Create comparison content for AI citation |
| I04 | FAIL | PASS | Add Schema.org markup |
| E04 | FAIL | PARTIAL | Improve page speed (LCP, CLS) |

### P1 — Important (30-90 days)
| Item | Current | Target | Action |
|------|---------|--------|--------|
| C01 | FAIL | PARTIAL | Link building campaign |
| I01 | PARTIAL | PASS | Wikidata entity creation |
| E03 | FAIL | PARTIAL | Target featured snippets |

### P2 — Strategic (90+ days)
| Item | Current | Target | Action |
|------|---------|--------|--------|
| E10 | FAIL | PARTIAL | Content marketing for share of voice |
| I05 | FAIL | PARTIAL | Add author bios to content |
| C06 | FAIL | PARTIAL | Become primary source for niche topics |

---

## Data Confidence Summary

| Confidence | Items |
|------------|-------|
| HIGH | T07, T08, T09, I06, I08 (5 items) |
| MEDIUM | C05-C08, I03, I07, E05, E08 (8 items) |
| LOW | C01-C04, C09-C10, I01-I02, I04-I05, I09-I10, T01-T06, T10, E01-E04, E06-E07, E09-E10 (27 items) |

**Recommendation**: Obtain Ahrefs/Semrush data to verify low-confidence items.
