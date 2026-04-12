---
skill: backlink-analyzer
phase: 03
step: 9
status: DONE_WITH_CONCERNS
timestamp: 20260412T182500
domain: caplinq.com
data_source: tier1_openpr
fallbacks_used:
  - "DataForSEO unavailable — using Open PageRank for DR estimate"
  - "Referring domains, anchor text, toxic links require DataForSEO/Ahrefs"
---

## Handoff Summary — backlink-analyzer

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Analyze backlink profile for domain authority signals
- **Key Findings**: Domain has PageRank 2 (1.63 decimal) indicating low-moderate authority. Global rank 77.6M suggests limited backlink profile. This aligns with the citation baseline finding (not cited by AI engines for competitive queries). Without detailed backlink data, CITE C dimensions cannot be fully scored.
- **Evidence**: Open PageRank API
- **Open Loops**: Detailed metrics (referring domains, anchor diversity, toxic links, velocity) require DataForSEO or Ahrefs API
- **Maps to**: CITE C02 (Referring Domains), C04 (Anchor Diversity), C10 (Toxic Links), T01 (Link Naturalness), T02 (Link Age)
- **Recommended Next Skill**: domain-authority-auditor (Step 10)

## Full Findings

### Domain Authority Metrics

| Metric | Value | Assessment |
|--------|-------|------------|
| **PageRank (Integer)** | 2/10 | Low-moderate |
| **PageRank (Decimal)** | 1.63 | — |
| **Global Rank** | 77,625,083 | Low traffic ranking |
| **Data Source** | Open PageRank | Tier 1 (limited) |

### Authority Comparison (Estimated)

| Domain | Est. DR | Assessment |
|--------|---------|------------|
| caplinq.com | ~20-30 | Emerging authority |
| brenntag.com | ~70-80 | Enterprise authority |
| henkel.com | ~80-90 | Global brand |
| indium.com | ~50-60 | Established specialist |

**Note**: DR estimates based on PageRank correlation. Actual values require Ahrefs/SEMrush.

### CITE C-Dimension Estimates

Based on available data and PageRank signals:

| Item | Score | Confidence | Evidence |
|------|-------|------------|----------|
| **C02** (Referring Domain Count) | 40/100 | LOW | PR 2 suggests 100-500 RDs |
| **C04** (Anchor Diversity) | 50/100 | LOW | Cannot measure without data |
| **C10** (Toxic Link Ratio) | 60/100 | LOW | Assumed clean (no evidence of spam) |

### CITE T-Dimension Estimates

| Item | Score | Confidence | Evidence |
|------|-------|------------|----------|
| **T01** (Link Naturalness) | 60/100 | LOW | B2B site, likely natural profile |
| **T02** (Link Age Distribution) | 55/100 | LOW | Site founded 2004, likely aged links |

### Backlink Opportunity Analysis

Based on competitor analysis and industry patterns:

| Opportunity | Priority | Expected Links |
|-------------|----------|----------------|
| Industry directories | P1 | 20-50 |
| Manufacturer partner pages | P1 | 10-30 |
| Technical publications | P2 | 5-15 |
| Case study mentions | P2 | 10-20 |
| Conference/event coverage | P3 | 5-10 |

### Recommended Link Building Strategy

| Priority | Action | Target | Effort |
|----------|--------|--------|--------|
| **P0** | Get listed on manufacturer partner pages | 10 links | Low |
| **P1** | Publish linkable technical guides | 20 links | Medium |
| **P1** | Industry directory submissions | 30 links | Low |
| **P2** | Guest posts on electronics blogs | 10 links | High |
| **P2** | HARO/journalist outreach | 5 links | Medium |
| **P3** | Conference sponsorship mentions | 5 links | High |

### Data Gaps for Full Analysis

| Metric | Status | Required Tool |
|--------|--------|---------------|
| Total backlinks | ✗ Missing | DataForSEO/Ahrefs |
| Referring domains | ✗ Missing | DataForSEO/Ahrefs |
| Dofollow ratio | ✗ Missing | DataForSEO/Ahrefs |
| Anchor text distribution | ✗ Missing | DataForSEO/Ahrefs |
| Toxic link count | ✗ Missing | DataForSEO/Ahrefs |
| Link velocity (new/lost) | ✗ Missing | DataForSEO/Ahrefs |
| Top referring domains | ✗ Missing | DataForSEO/Ahrefs |

### Hot Cache Entry (for domain-authority-auditor)

```
backlink_profile: { pagerank: 2, global_rank: 77625083, estimated_rd: 100-500, estimated_dr: 20-30, confidence: LOW }
```
