---
skill: domain-authority-auditor
phase: 03
step: 10
status: DONE
timestamp: 20260412T182500
domain: caplinq.com
data_source: synthesized
---

## Handoff Summary — domain-authority-auditor

- **Status**: DONE
- **Objective**: Score all 40 CITE framework items and determine domain trust verdict
- **Key Findings**: CITE Overall Score: 48/100 — **CAUTIOUS** verdict. Domain has strong technical trust (T: 72) but weak citation signals (C: 35) and limited indexability optimization (I: 40). AI engines recognize the brand but don't cite the domain. No veto items triggered.
- **Evidence**: Synthesized from backlink-analyzer (Step 9), technical-seo-checker (Step 6), citation-baseline (Step 1.5), schema-markup (pending Step 16)
- **Open Loops**: I04 (Schema coverage) pending Step 16 data
- **Maps to**: All CITE dimensions (C01-C10, I01-I10, T01-T10, E01-E10)
- **Recommended Next Skill**: content-quality-auditor (Step 11)
- **Scores**:
  - CITE: C:35/100 I:40/100 T:72/100 E:45/100 | Overall: 48/100 | Verdict: CAUTIOUS

## Full Findings

### CITE Score Summary

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| **C** (Citation) | 35/100 | 30% | 10.5 |
| **I** (Indexability) | 40/100 | 25% | 10.0 |
| **T** (Trust) | 72/100 | 25% | 18.0 |
| **E** (Entity) | 45/100 | 20% | 9.0 |
| **Overall** | | 100% | **48/100** |

### CITE Verdict: CAUTIOUS

```
┌─────────────────────────────────────────────────┐
│                    CAUTIOUS                      │
│                     48/100                       │
│                                                 │
│  AI engines may cite this domain for specific   │
│  queries but will prefer higher-authority       │
│  competitors for competitive topics.            │
└─────────────────────────────────────────────────┘
```

### Dimension C: Citation (35/100)

| Item | Score | Source | Evidence |
|------|-------|--------|----------|
| C01 | 30 | citation-baseline | Known by AI, not linked |
| C02 | 40 | backlink-analyzer | ~100-500 referring domains (est.) |
| C03 | 35 | competitor-analysis | Competitors dominate industry queries |
| C04 | 50 | backlink-analyzer | Assumed diverse (B2B pattern) |
| C05 | 15 | citation-baseline | 0/13 queries cited |
| C06 | 0 | citation-baseline | No citations = no prominence |
| C07 | 20 | citation-baseline | OpenAI errored, only Gemini tested |
| C08 | 70 | citation-baseline | Neutral-positive when mentioned |
| C09 | 40 | analysis | Limited thought leadership content |
| C10 | 60 | backlink-analyzer | No evidence of toxic links |

### Dimension I: Indexability (40/100)

| Item | Score | Source | Evidence |
|------|-------|--------|----------|
| I01 | 80 | technical-seo | robots.txt allows all AI crawlers |
| I02 | 50 | internal-linking | Good structure, but 410s break flow |
| I03 | 70 | sitemap | 4 sitemaps, 130 URLs indexed |
| I04 | 10 | pending | No JSON-LD schema detected |
| I05 | 0 | technical-seo | No llms.txt file |
| I06 | 30 | content-gap | Limited comparison/guide content |
| I07 | 60 | on-page-seo | Good heading hierarchy |
| I08 | 40 | technical-seo | Many 410 errors |
| I09 | 30 | internal-linking | Blog subdomain isolates content |
| I10 | 50 | on-page-seo | Some pages missing meta descriptions |

### Dimension T: Trust (72/100)

| Item | Score | Source | Evidence |
|------|-------|--------|----------|
| T01 | 60 | backlink-analyzer | Natural B2B link profile (assumed) |
| T02 | 55 | analysis | Site since 2004, aged links likely |
| T03 | 90 | technical-seo | Valid HTTPS, strong HSTS |
| T04 | 80 | technical-seo | HTTP/2, Cloudflare CDN |
| T05 | 85 | technical-seo | No penalty signals detected |
| T06 | 70 | entity-optimizer | ISO 9001 certification |
| T07 | 90 | technical-seo | Full security header suite |
| T08 | 65 | technical-seo | Modern infra, slow performance |
| T09 | 85 | analysis | No manual action indicators |
| T10 | 60 | entity-optimizer | Social presence exists |

### Dimension E: Entity (45/100)

| Item | Score | Source | Evidence |
|------|-------|--------|----------|
| E01 | 30 | analysis | No Wikipedia/Wikidata entry |
| E02 | 40 | entity-optimizer | Limited third-party mentions |
| E03 | 50 | entity-optimizer | Name matches across sources |
| E04 | 53 | technical-seo | Mobile performance 53/100 |
| E05 | 10 | on-page-seo | No Organization schema |
| E06 | 60 | entity-optimizer | 6-country presence documented |
| E07 | 50 | entity-optimizer | Industry established, not dominant |
| E08 | 40 | content-gap | No case studies or testimonials |
| E09 | 70 | entity-optimizer | Certifications mentioned |
| E10 | 45 | citation-baseline | Brand known but not authoritative |

### Veto Item Check

| Item | Status | Threshold | Evidence |
|------|--------|-----------|----------|
| **T03** (HTTPS) | ✓ PASS | Must have valid HTTPS | Valid SSL, HSTS enabled |
| **T05** (No Penalties) | ✓ PASS | No manual actions | No evidence of penalties |
| **T09** (No Spam) | ✓ PASS | No spam signals | Clean profile |

**No veto items triggered** — Domain is not disqualified.

### Feeder Chain Documentation

| CITE Item | Source Skill | Step |
|-----------|--------------|------|
| C02, C04, C10, T01, T02 | backlink-analyzer | 9 |
| T03, T07, T08, T09 | technical-seo-checker | 6 |
| C05, C06, C07, C08 | citation-baseline | 1.5 |
| I04 | schema-markup-generator | 16 (pending) |
| E01-E10 | entity-optimizer | 1 |

### Gap to TRUSTED Status

Current: **48/100 (CAUTIOUS)** → Target: **70/100 (TRUSTED)**

| Action | Impact | Priority |
|--------|--------|----------|
| Create llms.txt | +5 I05 | P0 |
| Add Organization schema | +8 E05 | P0 |
| Fix 410 errors | +10 I08 | P0 |
| Migrate blog to main domain | +5 I09 | P1 |
| Build 200 quality backlinks | +15 C02 | P1 |
| Create comparison guides | +10 C09, I06 | P1 |
| Add case studies | +10 E08 | P1 |
| Get Wikipedia mention | +8 E01 | P2 |

**Estimated post-improvement score: 68-72/100 (TRUSTED)**

### Hot Cache Entry

```
cite_verdict: CAUTIOUS
cite_score: 48
cite_dimensions: { C: 35, I: 40, T: 72, E: 45 }
veto_items: none
top_gap: AI citation frequency (C05: 15)
```
