---
skill: rank-tracker
phase: 06
step: 17
status: DONE
timestamp: 20260404T140000
domain: caplinq.com
---

## Handoff Summary — rank-tracker

- **Status**: DONE
- **Objective**: Establish baseline keyword tracking setup for caplinq.com
- **Key Findings**: Baseline rankings cannot be established without a rank tracking tool (Ahrefs, Semrush, or Search Console access). This document establishes the tracking configuration — keyword list, tracking segments, and alert thresholds — ready for tool implementation.
- **Evidence**: Keyword research from Step 3, content gap analysis from Step 6, SERP analysis from Step 5
- **Open Loops**: Actual current positions unknown; requires rank tracking tool to populate baseline
- **Recommended Next Skill**: performance-reporter

## Full Findings

### Tracking Configuration

**Primary Tracking Domain**: caplinq.com  
**Secondary Domain**: blog.caplinq.com (track separately)  
**Tracking Location**: Global + Netherlands + United States + Canada (3 primary markets)  
**Tracking Frequency**: Weekly

---

### Priority Keyword Tracking List

#### Tier 1 — Hero Keywords (track weekly)
| # | Keyword | Intent | Target Page | Baseline (to populate) |
|---|---------|--------|------------|------------------------|
| 1 | thermal interface materials | Commercial | /thermal-interface-materials.html | — |
| 2 | die attach materials | Commercial | /die-attach-materials.html | — |
| 3 | ion exchange membranes | Informational | /electrochemical-materials.html | — |
| 4 | electrochemical materials | Informational | /electrochemical-materials.html | — |
| 5 | REACH representation service | Transactional | /reach-services.html | — |
| 6 | thermal gap pad | Commercial | /thermal-gap-pads.html | — |
| 7 | carbon gas diffusion layer | Informational | /electrochemical-materials.html | — |
| 8 | phase change material TIM | Commercial | /phase-change-materials.html | — |
| 9 | semiconductor molding compound | Commercial | /molding-compounds.html | — |
| 10 | PFAS-free GDL coating | Informational | blog post | — |

#### Tier 2 — Growth Keywords (track bi-weekly)
| # | Keyword | Intent | Target Page |
|---|---------|--------|------------|
| 11 | thermal interface material selection guide | Informational | [new content] |
| 12 | PEM electrolyzer materials | Informational | [new content] |
| 13 | die attach materials comparison | Informational | [new content] |
| 14 | EU REACH compliance chemicals | Informational | [new content] |
| 15 | eMobility thermal management materials | Commercial | /emobility.html |

#### Tier 3 — GEO/AI Monitoring Keywords (track monthly)
- "what are thermal interface materials" → monitor AI Overview presence
- "how do ion exchange membranes work" → monitor AI Overview presence
- "CAPLINQ" (branded) → monitor Knowledge Panel presence
- "types of die attach materials" → monitor Featured Snippet + PAA

---

### SERP Feature Tracking
| Feature | Target Keywords | Current Status |
|---------|----------------|----------------|
| Featured Snippet | "thermal interface material selection" | Not tracked yet |
| AI Overview | "what are thermal interface materials" | Not tracked yet |
| PAA | "types of die attach" | Not tracked yet |
| Knowledge Panel | "CAPLINQ" | Likely absent |

---

### Ranking Alert Thresholds
- **Critical Alert**: Top 10 keyword drops >5 positions
- **Warning Alert**: Top 20 keyword drops >10 positions
- **Opportunity Alert**: Any keyword enters top 20 for first time

---

### GEO Visibility Tracking
Quarterly manual tests:
- Ask ChatGPT: "What are the best thermal interface materials for power electronics?"
- Ask Perplexity: "Who distributes ion exchange membranes for fuel cells?"
- Ask Claude: "What should I know about EU REACH representation for specialty chemicals?"
Record whether caplinq.com is cited. Target: cited in at least 2 of 3 AI systems by Q4 2026.
