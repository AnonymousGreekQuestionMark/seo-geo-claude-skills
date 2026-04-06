---
skill: alert-manager
phase: 06
step: 19
status: DONE
timestamp: 20260404T140000
domain: caplinq.com
---

## Handoff Summary — alert-manager

- **Status**: DONE
- **Objective**: Configure monitoring alerts for caplinq.com based on baselines from Steps 17–18
- **Key Findings**: Alert configuration defined across 6 categories. Primary risks are (1) Joomla CWV degradation, (2) hero keyword ranking drops if competitors publish pillar content, (3) REACH regulatory changes that require content updates. All alerts are ready to implement in Search Console + Google Analytics + an uptime monitor.
- **Evidence**: Technical audit (Step 7), keyword list (Step 17), performance baseline (Step 18), CITE assessment (Step 2)
- **Open Loops**: Tool integration required to activate alerts; Slack/email endpoint needed for notifications
- **Recommended Next Skill**: memory-management

## Full Findings

### Alert Configuration

#### Category 1: Ranking Alerts
| Alert | Condition | Priority | Response |
|-------|-----------|----------|----------|
| Hero keyword position drop | Any of top 10 keywords drops >5 positions in a week | 🔴 Critical | Investigate SERP change; check competitor; refresh content |
| New competitor in top 5 | New URL enters top 5 for hero keyword | 🟡 High | Audit competitor content; update CAPLINQ pillar page |
| Featured snippet lost | CAPLINQ loses a featured snippet | 🟡 High | Re-optimize answer format; update FAQPage schema |
| GEO visibility drop | CAPLINQ stops appearing in AI Overview | 🟡 High | Check content freshness; add GEO signals |

#### Category 2: Traffic Alerts
| Alert | Condition | Priority | Response |
|-------|-----------|----------|----------|
| Organic traffic drop | Monthly organic visits -20% vs. prior month | 🔴 Critical | Full technical + content audit |
| Traffic drop on TIM page | /thermal-interface-materials.html traffic -30% | 🟡 High | Check rankings, CWV, SERP feature changes |
| Sudden spike | +100% traffic in 48h on any page | ℹ️ Info | Investigate source; capitalize if positive |

#### Category 3: Technical Alerts
| Alert | Condition | Priority | Response |
|-------|-----------|----------|----------|
| CWV degradation | LCP >4s or CLS >0.25 on any core page | 🔴 Critical | Check recent CMS updates; CDN; image changes |
| Site downtime | 5-minute downtime detected | 🔴 Critical | Contact hosting; post status update |
| Crawl errors spike | >20 new 404 errors in Search Console | 🟡 High | Fix broken links or implement redirects |
| Index coverage drop | >10% of indexed pages lose coverage | 🔴 Critical | Check robots.txt; canonical tags |
| SSL expiry warning | SSL certificate expires in <14 days | 🟡 High | Renew certificate immediately |

#### Category 4: Backlink Alerts
| Alert | Condition | Priority | Response |
|-------|-----------|----------|----------|
| Toxic link spike | Spam referring domains +20 in a week | 🟡 High | Review links; disavow if needed |
| Lost key links | High-DR referring domain removes link | ℹ️ Info | Reach out to publisher for reinstatement |

#### Category 5: Competitor Alerts
| Alert | Condition | Priority | Response |
|-------|-----------|----------|----------|
| Competitor new content | SpecialChem publishes new TIM guide | ℹ️ Info | Compare coverage; update CAPLINQ content |
| Competitor acquires featured snippet | Competitor takes snippet for hero keyword | 🟡 High | Re-optimize answer format |

#### Category 6: REACH/Regulatory Alerts
| Alert | Condition | Priority | Response |
|-------|-----------|----------|----------|
| ECHA SVHC update | New substances added to SVHC candidate list | 🟡 High | Update REACH compliance content within 5 days |
| PFAS restriction announcement | EU PFAS restriction update | 🟡 High | Update electrochemical materials + REACH content |

---

### Notification Setup
- **Channel 1**: Email to [SEO team lead] for all Critical alerts
- **Channel 2**: Slack #seo-alerts for all High + Critical alerts
- **Channel 3**: Weekly summary email for Info alerts

### Alert Implementation Tools
- Google Search Console: ranking + index coverage alerts (built-in)
- Google Analytics 4: traffic anomaly alerts (use GA4 Insights)
- UptimeRobot (free): site availability monitoring
- Ahrefs Alerts (if connected): backlink + ranking alerts
- ECHA website: manual SVHC list check monthly
