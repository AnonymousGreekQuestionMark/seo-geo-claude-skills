---
skill: rank-tracker
phase: 06
step: 17
status: DONE
timestamp: 20260413T120000
domain: caplinq.com
data_source: tier2_mcp_serper
---

## Handoff Summary — rank-tracker

- **Status**: DONE
- **Objective**: Establish ranking baselines and monitoring for priority keywords
- **Key Findings**: Tracking 15 priority keywords. Current positions: #3 REACH OR, #7 polyimide tape, #9 ion exchange. Not ranking for TIM suppliers or die attach. Baseline established for ongoing monitoring.
- **Evidence**: SERP analysis results from step 4
- **Open Loops**: Weekly/monthly tracking requires scheduled runs; competitor tracking not implemented
- **Maps to**: CITE E01 (organic visibility), E10 (share of voice)
- **Recommended Next Skill**: performance-reporter (step 18)
- **Scores**: N/A (monitoring setup)

## Full Findings

### Baseline Rankings (April 2026)

| Keyword | Position | URL | Status |
|---------|----------|-----|--------|
| REACH only representative Europe | **#3** | /reach-only-representative.html | Tracking |
| polyimide tape suppliers | **#7** | /polyimide-tapes-and-films.html | Tracking |
| ion exchange membrane suppliers | **#9** | /ion-exchange-membranes-polymers.html | Tracking |
| thermal interface materials suppliers | Not found | — | Target |
| die attach materials semiconductor | Not found | — | Target |
| thermal gap pads | Unknown | — | To verify |
| phase change materials thermal | Unknown | — | To verify |
| REACH registration Europe | Unknown | — | To verify |
| semiconductor molding compounds | Unknown | — | To verify |
| electrically conductive adhesive | Unknown | — | To verify |

### Keyword Tracking Setup

#### Tier 1 — Core Keywords (Track Weekly)

| Keyword | Current | Target | Priority |
|---------|---------|--------|----------|
| REACH only representative Europe | #3 | #1 | P0 |
| thermal interface materials | Not ranking | Top 10 | P0 |
| thermal interface materials suppliers | Not ranking | Top 10 | P0 |
| die attach materials | Not ranking | Top 10 | P0 |
| ion exchange membrane suppliers | #9 | Top 5 | P1 |

#### Tier 2 — Product Keywords (Track Bi-weekly)

| Keyword | Current | Target |
|---------|---------|--------|
| polyimide tape suppliers | #7 | Top 5 |
| thermal gap pads | To verify | Top 10 |
| phase change materials | To verify | Top 10 |
| thermal grease industrial | To verify | Top 10 |
| semiconductor encapsulant | To verify | Top 20 |

#### Tier 3 — Long-tail Keywords (Track Monthly)

| Keyword | Target |
|---------|--------|
| REACH only representative cost | Top 5 |
| best thermal interface material for GPU | Top 10 |
| polyimide tape vs Kapton | Top 5 |
| ion exchange membrane price | Top 10 |
| die attach adhesive vs solder | Top 10 |

### Ranking Goals

| Timeframe | Goal |
|-----------|------|
| 30 days | REACH OR → #1, maintain other rankings |
| 60 days | TIM page → Top 10 after content optimization |
| 90 days | Die attach guide → Top 10 after publication |
| 6 months | 5+ keywords in top 5, 10+ in top 10 |

### Tracking Configuration

```yaml
rank_tracker:
  domain: caplinq.com
  
  keywords:
    tier1:
      - query: "REACH only representative Europe"
        frequency: weekly
        target: 1
        current: 3
      - query: "thermal interface materials suppliers"
        frequency: weekly
        target: 10
        current: null
      # ... more tier 1
    
    tier2:
      - query: "polyimide tape suppliers"
        frequency: biweekly
        target: 5
        current: 7
      # ... more tier 2
    
    tier3:
      - query: "best thermal interface material"
        frequency: monthly
        target: 10
      # ... more tier 3
  
  alerts:
    position_drop: 3  # Alert if drops 3+ positions
    position_gain: 5  # Notify on 5+ position gain
    
  competitors:
    - laird.com
    - indium.com
    - intertek.com
    - henkel-adhesives.com
```

### Visibility Score Calculation

```
Visibility Score = Σ (CTR_weight × keyword_volume)

Position CTR weights:
#1: 31.7%
#2: 24.7%
#3: 18.7%
#4: 13.6%
#5: 9.5%
#6-10: 2-5%
#11+: <1%
```

Current estimated visibility: **LOW** (only 3 keywords ranking in top 10)

### SERP Feature Tracking

| Query | Features Present | CAPLINQ Owns | Target |
|-------|------------------|--------------|--------|
| REACH only representative | Answer box, PAA | None | Answer box |
| thermal interface materials | Featured snippet | None | Snippet |
| polyimide tape | None | None | — |
| ion exchange membrane | Featured snippet | None | Snippet |

### Reporting Schedule

| Report | Frequency | Contents |
|--------|-----------|----------|
| Position check | Weekly | Tier 1 keywords |
| Full report | Monthly | All keywords, trends, competitors |
| Executive summary | Quarterly | Visibility score, goals progress |

### Alert Thresholds

| Event | Threshold | Action |
|-------|-----------|--------|
| Major drop | >5 positions | Immediate investigation |
| Gradual decline | 3+ positions over 2 weeks | Review content freshness |
| New ranking | Enters top 20 | Optimize for top 10 |
| Lost ranking | Exits top 100 | Check technical issues |
| Competitor movement | Top competitor gains 5+ | Competitive analysis |
