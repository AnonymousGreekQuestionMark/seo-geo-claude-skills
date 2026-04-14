---
skill: alert-manager
phase: 06
step: 19
status: DONE
timestamp: 20260413T120000
domain: caplinq.com
data_source: synthesis
---

## Handoff Summary — alert-manager

- **Status**: DONE
- **Objective**: Configure monitoring alerts for critical SEO and GEO metrics
- **Key Findings**: 12 alert rules defined across 4 categories: Rankings (position drops), Technical (CWV failures), Citations (rate changes), Authority (score drops). Alert thresholds calibrated to current baseline.
- **Evidence**: Performance baseline from all prior skills
- **Open Loops**: Alert delivery requires Slack/email integration; automated monitoring requires scheduled runs
- **Maps to**: All CITE and CORE dimensions (monitoring layer)
- **Recommended Next Skill**: memory-management (step 20)
- **Scores**: N/A (monitoring setup)

## Full Findings

### Alert Configuration

#### Category 1: Ranking Alerts

| Alert | Trigger | Severity | Action |
|-------|---------|----------|--------|
| Major Position Drop | Any top 10 keyword drops 5+ positions | Critical | Immediate investigation |
| Gradual Decline | 3+ position drop over 2 weeks | Warning | Review content/technical |
| Lost Top 10 | Keyword exits top 10 | Warning | Competitive analysis |
| REACH OR Drop | Position > #5 | Critical | Priority remediation |
| Featured Snippet Lost | Loses any owned snippet | Warning | Re-optimize content |

#### Category 2: Technical Alerts

| Alert | Trigger | Severity | Action |
|-------|---------|----------|--------|
| Performance Crash | Mobile score drops below 25 | Critical | Emergency fix |
| CWV Failure | LCP > 4s or CLS > 0.25 | Warning | Performance audit |
| Indexing Issue | Pages deindexed | Critical | Check GSC, robots.txt |
| SSL Expiry | Certificate < 14 days | Critical | Renew immediately |
| Uptime Issue | Site down > 5 minutes | Critical | Escalate to hosting |

#### Category 3: Citation Alerts

| Alert | Trigger | Severity | Action |
|-------|---------|----------|--------|
| Citation Rate Change | Brand citation drops to 0% | Warning | Check content/technical |
| Negative Citation | Negative sentiment detected | Warning | Review source, respond |
| Competitor Citation | Competitor cited on our keywords | Info | Competitive content analysis |
| New Engine Citation | Cited by new AI engine | Info | Celebrate, document |

#### Category 4: Authority Alerts

| Alert | Trigger | Severity | Action |
|-------|---------|----------|--------|
| CITE Score Drop | Score drops 5+ points | Warning | Run diagnostic audit |
| Toxic Link Spike | Suspicious backlink pattern | Warning | Disavow review |
| Penalty Detection | Manual action in GSC | Critical | Immediate remediation |
| PageRank Drop | PR drops a full point | Warning | Backlink analysis |

### Alert Thresholds (Calibrated to Baseline)

| Metric | Current | Warning | Critical |
|--------|---------|---------|----------|
| REACH OR Position | 3 | > 5 | > 10 |
| Mobile Performance | 31 | < 25 | < 15 |
| LCP | 9.7s | > 12s | > 15s |
| AI Citation Rate | 0% | Stays 0% for 30d | N/A |
| CITE Score | 52 | < 47 | < 40 |
| Keywords Top 10 | 3 | < 2 | 0 |

### Alert Rule Definitions

```yaml
alerts:
  rankings:
    - name: "Major Position Drop"
      condition: "position_change <= -5 AND previous_position <= 10"
      severity: critical
      channels: [email, slack]
      message: "🚨 {keyword} dropped from #{prev} to #{current}"
      
    - name: "REACH OR Protection"
      condition: "keyword='REACH only representative Europe' AND position > 5"
      severity: critical
      channels: [email, slack, sms]
      message: "🚨 REACH OR keyword at position #{current} (target: #1-3)"
  
  technical:
    - name: "Performance Crash"
      condition: "mobile_score < 25"
      severity: critical
      channels: [email, slack]
      message: "🚨 Mobile performance at {score}/100"
      
    - name: "CWV Failure"
      condition: "lcp > 4000 OR cls > 0.25"
      severity: warning
      channels: [slack]
      message: "⚠️ Core Web Vitals failing: LCP={lcp}ms, CLS={cls}"
  
  citations:
    - name: "Citation Stagnation"
      condition: "brand_citation_rate = 0 AND days_since_baseline > 30"
      severity: warning
      channels: [email]
      message: "⚠️ No AI citations after 30 days of GEO work"
  
  authority:
    - name: "CITE Score Drop"
      condition: "cite_score < previous_cite_score - 5"
      severity: warning
      channels: [email, slack]
      message: "⚠️ CITE score dropped from {prev} to {current}"
```

### Alert Delivery Channels

| Channel | Use Case | Setup Status |
|---------|----------|--------------|
| Email | All alerts | Requires config |
| Slack | Real-time alerts | Requires webhook |
| SMS | Critical only | Requires Twilio |
| Dashboard | All alerts | Part of reporting |

### Alert Escalation Matrix

| Severity | Response Time | Escalation |
|----------|---------------|------------|
| Critical | < 1 hour | Immediate team notification |
| Warning | < 24 hours | Next business day review |
| Info | < 1 week | Weekly report inclusion |

### Monitoring Schedule

| Check | Frequency | Tool |
|-------|-----------|------|
| Rankings | Daily | serp-analyzer MCP |
| Technical | Daily | pagespeed MCP |
| Citations | Weekly | ai-citation-monitor MCP |
| Authority | Monthly | Full CITE audit |

### Alert Response Playbooks

#### Playbook: Major Position Drop
1. Check Google Search Console for issues
2. Verify page is indexed and rendering
3. Check for competitor content changes
4. Review recent site changes
5. Analyze backlink changes
6. Update content if needed

#### Playbook: Technical Performance Issue
1. Check PageSpeed Insights for specifics
2. Identify largest contributors (images, JS, etc.)
3. Implement quick wins (compression, caching)
4. Schedule deeper optimization if needed
5. Re-test and verify improvement

#### Playbook: Citation Rate Stagnation
1. Verify llms.txt is accessible
2. Check structured data implementation
3. Review content citability (definitions, data)
4. Test with manual AI queries
5. Adjust GEO content strategy

### Implementation Checklist

- [ ] Configure email alerts
- [ ] Set up Slack webhook
- [ ] Create alert dashboard
- [ ] Document response playbooks
- [ ] Train team on alert handling
- [ ] Test alert delivery
- [ ] Schedule monitoring runs
