---
skill: alert-manager
phase: 06
step: 19
status: DONE
timestamp: 20260412T182500
domain: caplinq.com
data_source: analysis_synthesis
---

## Handoff Summary — alert-manager

- **Status**: DONE
- **Objective**: Configure monitoring alerts based on analysis baselines
- **Key Findings**: Configured 15 alerts across 5 categories: ranking alerts (position drops/gains), technical alerts (performance, errors), citation alerts (AI monitoring), competitor alerts (SERP movements), and content alerts (freshness triggers).
- **Evidence**: Baseline metrics from all prior skills
- **Open Loops**: Alert implementation requires monitoring tool setup (DataForSEO, Ahrefs, or custom)
- **Maps to**: Ongoing monitoring
- **Recommended Next Skill**: memory-management (Step 20)

## Full Findings

### Alert Configuration Summary

| Category | Alert Count | Priority |
|----------|-------------|----------|
| Ranking | 4 | P0 |
| Technical | 4 | P0 |
| Citation | 3 | P1 |
| Competitor | 2 | P1 |
| Content | 2 | P2 |
| **Total** | **15** | |

### Ranking Alerts

#### Alert 1: Position Drop (P0)

| Setting | Value |
|---------|-------|
| Trigger | Position drops >3 places |
| Keywords | epoxy molding compounds, die attach materials, REACH representative |
| Frequency | Daily check |
| Notification | Email + Slack |
| Action | Investigate cause within 24 hours |

#### Alert 2: Lost from Page 1 (P0)

| Setting | Value |
|---------|-------|
| Trigger | Position moves from 1-10 to >10 |
| Keywords | All P1 hero keywords |
| Frequency | Daily check |
| Notification | Email + Slack (urgent) |
| Action | Immediate investigation |

#### Alert 3: Position Gain (P1)

| Setting | Value |
|---------|-------|
| Trigger | Position improves >5 places |
| Keywords | All tracked keywords |
| Frequency | Weekly summary |
| Notification | Email |
| Action | Document what worked |

#### Alert 4: New Ranking Entry (P1)

| Setting | Value |
|---------|-------|
| Trigger | Keyword enters top 20 for first time |
| Keywords | thermal interface materials, semiconductor materials |
| Frequency | Daily check |
| Notification | Email |
| Action | Optimize for further improvement |

### Technical Alerts

#### Alert 5: Performance Degradation (P0)

| Setting | Value |
|---------|-------|
| Trigger | Mobile PageSpeed score <50 |
| Current baseline | 53 |
| Frequency | Weekly check |
| Notification | Email to dev team |
| Action | Performance audit |

#### Alert 6: Core Web Vitals Failure (P0)

| Setting | Value |
|---------|-------|
| Trigger | LCP >4s OR CLS >0.25 |
| Current baseline | LCP 10.5s (already failing) |
| Frequency | Weekly check |
| Notification | Email to dev team |
| Action | Prioritize fix |

#### Alert 7: New 4xx/5xx Errors (P0)

| Setting | Value |
|---------|-------|
| Trigger | New URL returns 4xx/5xx |
| Frequency | Daily crawl |
| Notification | Email to dev team |
| Action | Fix or redirect within 48 hours |

#### Alert 8: Sitemap Changes (P1)

| Setting | Value |
|---------|-------|
| Trigger | URLs removed from sitemap OR new 404s |
| Frequency | Weekly check |
| Notification | Email |
| Action | Verify intentional |

### Citation Alerts

#### Alert 9: AI Citation Change (P1)

| Setting | Value |
|---------|-------|
| Trigger | Citation rate changes >20% |
| Current baseline | 0/13 (0%) |
| Frequency | Monthly check |
| Notification | Email to marketing |
| Action | Investigate cause |

#### Alert 10: New AI Citation (P1)

| Setting | Value |
|---------|-------|
| Trigger | CAPLINQ cited on new query |
| Current baseline | 0 citations |
| Frequency | Monthly check |
| Notification | Email (positive) |
| Action | Document and replicate |

#### Alert 11: Competitor Citation Gain (P1)

| Setting | Value |
|---------|-------|
| Trigger | Competitor starts getting cited for CAPLINQ keywords |
| Competitors | Henkel, Laird, Indium |
| Frequency | Monthly check |
| Notification | Email |
| Action | Analyze competitor content |

### Competitor Alerts

#### Alert 12: Competitor Enters Top 3 (P1)

| Setting | Value |
|---------|-------|
| Trigger | New competitor enters top 3 for tracked keyword |
| Keywords | All P1 keywords |
| Frequency | Weekly check |
| Notification | Email |
| Action | Analyze their page |

#### Alert 13: Competitor Content Published (P2)

| Setting | Value |
|---------|-------|
| Trigger | Competitor publishes new content on target topic |
| Topics | TIM, die attach, REACH |
| Frequency | Weekly check |
| Notification | Email |
| Action | Consider response content |

### Content Alerts

#### Alert 14: Content Freshness (P2)

| Setting | Value |
|---------|-------|
| Trigger | Top-ranking page not updated in 6 months |
| Pages | Top 10 ranked pages |
| Frequency | Monthly check |
| Notification | Email to content |
| Action | Refresh content |

#### Alert 15: Blog Post Performance (P2)

| Setting | Value |
|---------|-------|
| Trigger | Blog post traffic drops >50% MoM |
| Frequency | Monthly check |
| Notification | Email |
| Action | Refresh or consolidate |

### Alert Implementation Checklist

| Tool | Alerts Supported | Setup Status |
|------|------------------|--------------|
| Google Search Console | 3, 4, 7 | Configure |
| DataForSEO | 1, 2, 3, 4, 12 | Requires API |
| PageSpeed Insights API | 5, 6 | Configure |
| Custom crawler | 7, 8, 14 | Build or buy |
| Citation monitor | 9, 10, 11 | MCP tool available |
| Competitor tracker | 12, 13 | Requires tool |

### Alert Escalation Matrix

| Severity | Response Time | Escalation |
|----------|---------------|------------|
| P0 | 24 hours | Team lead |
| P1 | 72 hours | Weekly review |
| P2 | 1 week | Monthly review |

### Baseline Snapshot for Alerting

```json
{
  "date": "2026-04-12",
  "rankings": {
    "epoxy molding compound suppliers": 1,
    "die attach materials": 2,
    "REACH only representative Europe": 3,
    "conductive adhesives manufacturers": 7,
    "thermal interface materials suppliers": null
  },
  "technical": {
    "mobile_score": 53,
    "desktop_score": 61,
    "lcp_mobile": 10.5,
    "cls_desktop": 0.395
  },
  "citations": {
    "rate": 0,
    "queries_tested": 13,
    "engines": ["gemini", "anthropic"]
  },
  "cite_score": 48,
  "cite_verdict": "CAUTIOUS"
}
```
