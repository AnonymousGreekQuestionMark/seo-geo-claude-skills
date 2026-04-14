---
skill: alert-manager
phase: 06
step: 19
status: DONE
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier1_analysis
---

## Handoff Summary — alert-manager

- **Status**: DONE
- **Objective**: Configure monitoring alerts for critical SEO and GEO metrics
- **Key Findings**: Priority alerts needed for: ranking drops, mobile performance, AI citation changes, schema validation errors.
- **Evidence**: Analysis of current metrics and thresholds
- **Open Loops**: None
- **Maps to**: All CITE and CORE-EEAT monitoring
- **Recommended Next Skill**: memory-management (Step 20)

## Alert Configuration

### Critical Alerts (Immediate Action)

| Alert | Condition | Channel | Frequency |
|-------|-----------|---------|-----------|
| Ranking Drop | Any top-5 keyword drops >3 positions | Email | Daily |
| Mobile Score | PageSpeed mobile <30 | Email | Weekly |
| Site Down | Homepage 5xx or timeout | SMS | Real-time |
| Manual Penalty | GSC manual action detected | Email + SMS | Real-time |
| Deindex | >10% pages deindexed | Email | Daily |

### Warning Alerts (Review Required)

| Alert | Condition | Channel | Frequency |
|-------|-----------|---------|-----------|
| Ranking Fluctuation | Top-10 keyword moves >5 positions | Email | Weekly |
| Traffic Drop | Organic traffic down >20% WoW | Email | Weekly |
| Crawl Errors | >50 new 404s in GSC | Email | Weekly |
| CWV Regression | Any Core Web Vital moves to "Poor" | Email | Weekly |

### Positive Alerts (Celebrate)

| Alert | Condition | Channel | Frequency |
|-------|-----------|---------|-----------|
| New Top 10 | Keyword enters top 10 | Email | Weekly |
| Featured Snippet | Acquired new featured snippet | Email | Weekly |
| AI Citation | Domain cited by AI engine | Email | Weekly |
| Backlink Gain | New DA 50+ referring domain | Email | Weekly |

## Monitoring Metrics

### Search Rankings (Weekly)
- 16 tracked keywords
- Position changes vs baseline
- Competitor position changes
- SERP feature changes

### Technical Health (Weekly)
- PageSpeed scores (mobile + desktop)
- Core Web Vitals (LCP, CLS, INP)
- Crawl errors (GSC)
- Index coverage (GSC)

### AI Citation (Monthly)
- Citation rate across 13 test queries
- Engine coverage (Gemini, OpenAI, Perplexity, Claude)
- Brand mention tracking
- Competitor citation changes

### Backlinks (Monthly)
- New referring domains
- Lost referring domains
- Toxic link alerts
- Competitor backlink gains

## Alert Priority Matrix

| Severity | Response Time | Escalation |
|----------|---------------|------------|
| Critical | <4 hours | Team lead + stakeholder |
| Warning | <24 hours | Team lead |
| Info | Weekly review | None |
| Positive | Weekly report | Share with team |

## Recommended Tools

| Tool | Purpose | Alert Type |
|------|---------|------------|
| Google Search Console | Index, rankings, penalties | Native |
| Google Analytics | Traffic drops | Native |
| PageSpeed Insights | Performance regression | Scheduled |
| SERP Analyzer MCP | Ranking changes | Scheduled |
| Citation Monitor MCP | AI citation changes | Scheduled |
| UptimeRobot | Site availability | Native |

## Alert Schedule

| Frequency | Checks |
|-----------|--------|
| Real-time | Site availability |
| Daily | Ranking changes, crawl errors |
| Weekly | Performance scores, traffic, backlinks |
| Monthly | AI citations, comprehensive audit |
| Quarterly | Full CITE + CORE-EEAT re-assessment |
