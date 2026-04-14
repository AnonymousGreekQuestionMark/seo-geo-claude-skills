---
skill: performance-reporter
phase: 06
step: 18
status: DONE
timestamp: 20260413T120000
domain: caplinq.com
data_source: synthesis
---

## Handoff Summary — performance-reporter

- **Status**: DONE
- **Objective**: Establish performance baseline and reporting framework for SEO/GEO metrics
- **Key Findings**: Performance baseline established across 4 pillars: Technical (31/100 mobile), Rankings (3 in top 10), Citations (0%), Authority (CITE 52). Comprehensive reporting framework defined with KPIs and dashboards.
- **Evidence**: All prior skill findings synthesized
- **Open Loops**: GSC/GA4 data access needed for traffic metrics; ongoing tracking requires tool integration
- **Maps to**: CITE E01-E10 (eminence), all CORE dimensions
- **Recommended Next Skill**: alert-manager (step 19)
- **Scores**: N/A (reporting setup)

## Full Findings

### Performance Baseline Summary

| Pillar | Metric | Current | Target (90d) | Status |
|--------|--------|---------|--------------|--------|
| **Technical** | Mobile Performance | 31/100 | 70/100 | Critical |
| **Technical** | LCP | 9.7s | <2.5s | Critical |
| **Technical** | CLS | 0.635 | <0.1 | Critical |
| **Rankings** | Keywords in Top 10 | 3 | 8 | Gap |
| **Rankings** | Featured Snippets | 0 | 2 | Gap |
| **Citations** | AI Citation Rate | 0% | 30% | Critical |
| **Authority** | CITE Score | 52 | 65 | Gap |
| **Authority** | PageRank | 2/10 | 3/10 | Gap |
| **Content** | GEO Score | 58 | 70 | Gap |
| **Content** | SEO Score | 62 | 70 | Gap |

### KPI Dashboard Framework

#### Executive Dashboard

| KPI | Baseline | 30d Target | 90d Target | 180d Target |
|-----|----------|------------|------------|-------------|
| Organic Visibility Score | Low | Moderate | Good | Strong |
| Keywords Top 10 | 3 | 5 | 8 | 12 |
| AI Citation Rate | 0% | 15% | 30% | 50% |
| CITE Score | 52 | 55 | 60 | 70 |
| Technical Health | 31 | 50 | 70 | 80 |

#### Technical Health Dashboard

| Metric | Current | Good | Excellent |
|--------|---------|------|-----------|
| Mobile Performance | 31 | 70+ | 90+ |
| LCP | 9.7s | <2.5s | <1.5s |
| CLS | 0.635 | <0.1 | <0.05 |
| INP/TBT | 260ms | <200ms | <100ms |
| Schema Coverage | 0% | 50%+ | 80%+ |

#### Content Quality Dashboard

| Metric | Current | Good | Excellent |
|--------|---------|------|-----------|
| GEO Score (CORE) | 58 | 70+ | 85+ |
| SEO Score (EEAT) | 62 | 70+ | 85+ |
| Pages with Schema | 0 | 50%+ | 80%+ |
| Pages with FAQ | 2 | 10+ | 20+ |
| Blog Posts/Month | 4-6 | 6-8 | 10+ |

#### Authority Dashboard

| Metric | Current | Good | Excellent |
|--------|---------|------|-----------|
| CITE Score | 52 | 65+ | 80+ |
| C (Citation) | 35 | 50+ | 70+ |
| I (Identity) | 55 | 65+ | 80+ |
| T (Trust) | 70 | 75+ | 90+ |
| E (Eminence) | 45 | 55+ | 70+ |

### Reporting Cadence

| Report | Frequency | Audience | Key Metrics |
|--------|-----------|----------|-------------|
| Technical Pulse | Weekly | Dev team | CWV, errors, uptime |
| Rankings Update | Weekly | SEO team | Position changes, alerts |
| Citation Monitor | Weekly | Content team | AI citation rate, sentiment |
| Content Performance | Bi-weekly | Marketing | Traffic, engagement, conversions |
| Executive Summary | Monthly | Leadership | All KPIs, trends, actions |
| Comprehensive Audit | Quarterly | All | Full CITE + CORE-EEAT refresh |

### Monthly Report Template

```markdown
# SEO/GEO Performance Report - [Month Year]

## Executive Summary
- Overall Status: [Green/Amber/Red]
- Key Win: [Top achievement]
- Key Challenge: [Main issue]
- Priority Action: [Next focus]

## KPI Scorecard
| KPI | Last Month | This Month | Change | Status |
|-----|------------|------------|--------|--------|
| Keywords Top 10 | X | Y | +/-N | [G/A/R] |
| AI Citation Rate | X% | Y% | +/-N% | [G/A/R] |
| CITE Score | X | Y | +/-N | [G/A/R] |
| Technical Score | X | Y | +/-N | [G/A/R] |

## Ranking Changes
- Improved: [List]
- Declined: [List]
- New Rankings: [List]
- Lost Rankings: [List]

## Technical Health
- Performance Score: X/100
- CWV Status: [Pass/Fail]
- Issues Fixed: [List]
- Outstanding Issues: [List]

## Content Published
- Blog Posts: N
- Pages Updated: N
- Schema Added: N pages

## AI Citations
- Citation Rate: X%
- Engines Citing: [List]
- Best Performing Query: [Query]

## Actions Completed
1. [Action 1]
2. [Action 2]

## Next Month Priorities
1. [Priority 1]
2. [Priority 2]
```

### Data Sources Required

| Metric Category | Data Source | Access Status |
|-----------------|-------------|---------------|
| Rankings | Serper API / MCP | Connected |
| AI Citations | ai-citation-monitor MCP | Connected |
| Technical | PageSpeed API / MCP | Connected |
| Traffic | Google Search Console | Needs setup |
| Traffic | Google Analytics 4 | Needs setup |
| Backlinks | Ahrefs / DataForSEO | Needs setup |
| Competitors | Semrush / Ahrefs | Needs setup |

### Performance Trend Tracking

```
Metric Tracking Format:

Date       | Organic | Top 10 | Citations | CITE | Tech
-----------|---------|--------|-----------|------|-----
2026-04-13 | —       | 3      | 0%        | 52   | 31
2026-04-20 | —       | —      | —         | —    | —
2026-04-27 | —       | —      | —         | —    | —
...

Chart: Line graph showing trends over time
Alert: Highlight significant changes (>10% week-over-week)
```

### Success Criteria

| Timeframe | Success Definition |
|-----------|-------------------|
| 30 days | Technical score >50, 2+ new top 10 rankings |
| 60 days | AI citation rate >15%, CITE score >55 |
| 90 days | 8+ top 10 rankings, featured snippet captured |
| 6 months | CITE score >65, 50%+ AI citation on brand queries |
