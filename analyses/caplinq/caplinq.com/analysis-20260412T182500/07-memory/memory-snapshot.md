---
skill: memory-management
phase: 07
step: 20
status: DONE
timestamp: 20260412T182500
domain: caplinq.com
data_source: analysis_synthesis
---

## Handoff Summary — memory-management

- **Status**: DONE
- **Objective**: Create campaign memory snapshot for future analysis continuity
- **Key Findings**: Full analysis complete. Hot cache entry prepared with CITE verdict, top findings, and critical metrics. This snapshot enables future analyses to reference baseline data.
- **Evidence**: All 19 prior skill handoffs
- **Open Loops**: None
- **Maps to**: Campaign continuity
- **Recommended Next Skill**: Generate HTML report (Step 21)

## Full Findings

### Hot Cache Entry

```markdown
## Company Analysis — caplinq.com — 2026-04-12
- CITE Verdict: CAUTIOUS | Score: 48/100
- CITE Dimensions: C:35 I:40 T:72 E:45
- CORE-EEAT GEO Score: 69/100 | SEO Score: 71/100
- Veto items: none
- Top finding: 0% AI citation rate despite brand recognition — llms.txt missing, no schema
- Critical issues: 410 errors on key pages, mobile LCP 10.5s, blog on subdomain
- Top rankings: #1 EMC, #2 die attach, #3 REACH, #7 conductive adhesives
- Report: analyses/caplinq/reports/caplinq_caplinq.com_20260412T182500.html
```

### Campaign Context Snapshot

| Attribute | Value |
|-----------|-------|
| Analysis date | 2026-04-12 |
| Domain | caplinq.com |
| Company root | caplinq |
| Industry | Specialty chemicals, engineered materials |
| Primary markets | Semiconductor, eMobility, electronics, aerospace |
| Geographic HQ | Assendelft, Netherlands |
| Global offices | 6 countries |

### Baseline Metrics

| Metric | Value | Date |
|--------|-------|------|
| CITE Score | 48/100 | 2026-04-12 |
| CITE Verdict | CAUTIOUS | 2026-04-12 |
| GEO Score | 69/100 | 2026-04-12 |
| SEO Score | 71/100 | 2026-04-12 |
| AI Citation Rate | 0% (0/13) | 2026-04-12 |
| Keywords Top 3 | 3 | 2026-04-12 |
| Featured Snippets | 1 | 2026-04-12 |
| Mobile PageSpeed | 53 | 2026-04-12 |
| Schema Coverage | 0% | 2026-04-12 |
| PageRank | 2 | 2026-04-12 |

### Critical Issues Log

| Issue | Status | Priority |
|-------|--------|----------|
| /thermal-interface-materials 410 | OPEN | P0 |
| /about 410 | OPEN | P0 |
| /industries/* 410 | OPEN | P0 |
| No llms.txt | OPEN | P0 |
| No schema markup | OPEN | P0 |
| Mobile LCP 10.5s | OPEN | P0 |
| Blog on subdomain | OPEN | P1 |
| 0% AI citations | OPEN | P0 |

### Entity Profile Summary

| Attribute | Value |
|-----------|-------|
| Legal name | CAPLINQ Corporation |
| Founded | 2004 |
| Employees | ~62 |
| Revenue | $10-25M |
| Certifications | ISO 9001 |
| Products | TIM, die attach, EMC, adhesives, tapes |
| Services | REACH OR, fulfillment, technical marketing |

### Competitor Baseline

| Competitor | Est. DR | Primary Strength |
|------------|---------|------------------|
| Henkel | 80-90 | Brand, TIM market leader |
| Brenntag | 70-80 | Scale, distribution network |
| Indium | 50-60 | Technical authority, solder |
| Laird | 60-70 | TIM specialist, rich content |
| IMCD | 60-70 | European distribution |

### Content Inventory Summary

| Content Type | Count | Quality |
|--------------|-------|---------|
| Product pages | 130+ | Good depth |
| Blog posts | 200+ | Excellent (subdomain) |
| Service pages | 5 | Adequate |
| Industry pages | 0 (410) | Critical gap |
| Case studies | 0 | Critical gap |
| Comparison guides | 0 | Critical gap |

### 90-Day Priority Actions

| Priority | Action | Target Metric |
|----------|--------|---------------|
| P0 | Fix 410 errors | 0 errors |
| P0 | Create llms.txt | /llms.txt live |
| P0 | Add Organization schema | Knowledge panel |
| P0 | Optimize mobile perf | LCP <3s |
| P1 | Create TIM guide | Rank top 10 |
| P1 | Create case studies | 3 published |
| P1 | Migrate blog | Main domain |
| P2 | Build backlinks | +50 RDs |

### Re-Analysis Triggers

Run new company analysis when:
- 90 days elapsed
- Major site changes deployed
- CITE score drops >10 points
- Competitor makes significant move
- New product launch

### Files Generated

```
analyses/caplinq/caplinq.com/analysis-20260412T182500/
├── 01-domain-baseline/
│   ├── entity-optimizer-handoff.md
│   └── citation-baseline-handoff.md
├── 02-research/
│   ├── keyword-research-handoff.md
│   ├── competitor-analysis-handoff.md
│   ├── serp-analysis-handoff.md
│   └── content-gap-analysis-handoff.md
├── 03-technical/
│   ├── technical-seo-handoff.md
│   ├── on-page-seo-handoff.md
│   ├── internal-linking-handoff.md
│   ├── backlink-handoff.md
│   └── domain-authority-handoff.md
├── 04-content/
│   ├── content-quality-handoff.md
│   └── content-refresher-handoff.md
├── 05-recommendations/
│   ├── seo-content-handoff.md
│   ├── geo-content-handoff.md
│   ├── meta-tags-handoff.md
│   └── schema-markup-handoff.md
├── 06-monitoring/
│   ├── rank-tracker-handoff.md
│   ├── performance-reporter-handoff.md
│   └── alert-manager-handoff.md
├── 07-memory/
│   └── memory-snapshot.md
├── operations-log.json
└── prompt-results.json

analyses/caplinq/reports/
└── caplinq_caplinq.com_20260412T182500.html (pending Step 21)
```
