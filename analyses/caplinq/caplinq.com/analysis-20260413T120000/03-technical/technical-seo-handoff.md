---
skill: technical-seo-checker
phase: 03
step: 6
status: DONE_WITH_CONCERNS
timestamp: 20260413T120000
domain: caplinq.com
data_source: tier2_mcp_pagespeed
---

## Handoff Summary — technical-seo-checker

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Audit technical SEO health including Core Web Vitals, crawlability, and AI discoverability
- **Key Findings**: Critical performance issues — Mobile performance score 31/100 (homepage), LCP 9.7s, CLS 0.635. No llms.txt file. Missing structured data. No AI crawler rules in robots.txt. HTTPS valid. Site is slow but crawlable.
- **Evidence**: PageSpeed Insights API (mobile), robots.txt analysis, llms.txt 404, homepage HTML inspection
- **Open Loops**: Desktop performance not fully tested; server response time root cause not identified
- **Maps to**: CITE T07 (HTTPS/security), T08 (technical freshness), T09 (penalty signals), E04 (crawlability)
- **Recommended Next Skill**: on-page-seo-auditor (step 7)
- **Scores**:
  - Technical Score: 4/10
  - CITE E04 (Crawlability): FAIL (homepage), PARTIAL (product pages)
  - CITE T07 (HTTPS): PASS
  - CITE T08 (Technical Freshness): PARTIAL
  - CITE T09 (Penalty Signals): PASS (no visible penalties)

## Full Findings

### Core Web Vitals (Mobile)

| Page | Performance | LCP | CLS | INP/TBT | FCP | TTI |
|------|-------------|-----|-----|---------|-----|-----|
| Homepage | 31/100 | 9.7s | 0.635 | 260ms | 4.1s | 10.1s |
| TIM Page | 54/100 | 8.0s | 0.055 | 200ms | 4.7s | 22.9s |

**Field Data (CrUX):**
- LCP: 5,694ms (POOR - should be <2,500ms)
- CLS: 16 (POOR - should be <0.1)
- INP: 120ms (GOOD - under 200ms threshold)
- Overall: SLOW

### Core Web Vitals Assessment

| Metric | Homepage | TIM Page | Target | Status |
|--------|----------|----------|--------|--------|
| LCP | 9.7s | 8.0s | <2.5s | FAIL |
| CLS | 0.635 | 0.055 | <0.1 | FAIL (homepage) |
| INP/TBT | 260ms | 200ms | <200ms | PARTIAL |
| FCP | 4.1s | 4.7s | <1.8s | FAIL |
| TTI | 10.1s | 22.9s | <3.8s | FAIL |

### AI Discoverability

| Element | Status | Notes |
|---------|--------|-------|
| llms.txt | MISSING (404) | No AI-readable site summary |
| llms-full.txt | NOT CHECKED | Likely missing |
| robots.txt AI rules | NONE | No GPTBot, ClaudeBot, PerplexityBot rules |
| Schema.org | MISSING | No structured data detected |

**robots.txt AI Crawler Status:**
- GPTBot: Not mentioned (allowed by default)
- ClaudeBot: Not mentioned (allowed by default)
- PerplexityBot: Not mentioned (allowed by default)
- CCBot: Not mentioned (allowed by default)

### Technical SEO Elements

| Element | Status | Details |
|---------|--------|---------|
| HTTPS | PASS | Valid SSL certificate |
| Mobile Viewport | PASS | Responsive design implemented |
| Character Encoding | PASS | UTF-8 |
| Title Tag | CONCERN | Not visible in excerpt |
| Meta Description | MISSING | Not found |
| Canonical URL | MISSING | Not specified |
| Open Graph | MISSING | No og: tags |
| Hreflang | MISSING | No language targeting |
| Favicon | PARTIAL | Logo present, declaration unclear |
| GA4 | PASS | G-ZZME4HRWKZ configured |

### Sitemap Status

| Sitemap | URL | Status |
|---------|-----|--------|
| Main | /sitemap.xml | Present |
| Products | /product-sitemap.xml | Present (timeout on fetch) |
| Blog | /blog/sitemap_index.xml | Redirects to blog.caplinq.com |
| Services | /services-sitemap.xml | Present |

### robots.txt Analysis

```
User-agent: *
Disallow: /administrator/
Disallow: /bin/
Disallow: /cli/
Disallow: /installation/
Disallow: /tmp/
[20+ other admin paths]

Sitemap: https://www.caplinq.com/sitemap.xml
Sitemap: https://www.caplinq.com/product-sitemap.xml
Sitemap: https://www.caplinq.com/blog/sitemap_index.xml
Sitemap: https://www.caplinq.com/services-sitemap.xml
```

**Observations:**
- Standard Joomla admin paths blocked
- No AI-specific rules (good for discoverability)
- Multiple sitemaps declared
- No crawl-delay specified

### CITE Dimension Scoring

| CITE Item | Score | Verdict | Evidence |
|-----------|-------|---------|----------|
| T07 (HTTPS/Security) | 85/100 | PASS | Valid SSL, no mixed content warnings |
| T08 (Technical Freshness) | 50/100 | PARTIAL | Joomla CMS, slow performance suggests tech debt |
| T09 (Penalty Signals) | 80/100 | PASS | No manual actions visible, indexed |
| E04 (Crawlability) | 35/100 | FAIL | Slow load times impair crawl efficiency |

### Performance Issues Root Causes (Estimated)

1. **Large images**: No lazy loading, unoptimized images
2. **Render-blocking resources**: JS/CSS blocking first paint
3. **Server response time**: Likely shared hosting or unoptimized backend
4. **CMS overhead**: Joomla framework adding latency
5. **No CDN**: Assets served from origin

### P0 Technical Fixes

| Issue | Impact | Fix | Effort |
|-------|--------|-----|--------|
| Missing llms.txt | AI discoverability | Create llms.txt with site summary | Low |
| Slow LCP (9.7s) | Rankings, UX | Image optimization, lazy loading | Medium |
| High CLS (0.635) | Rankings, UX | Add width/height to images, font loading | Medium |
| Missing meta description | CTR | Add unique descriptions per page | Low |
| Missing structured data | Rich results | Add Organization, Product schema | Medium |
| Missing Open Graph | Social sharing | Add og: tags | Low |

### P1 Technical Improvements

| Issue | Impact | Fix | Effort |
|-------|--------|-----|--------|
| Slow TTI (10-22s) | UX | Defer non-critical JS | Medium |
| No canonical tags | Duplicate content risk | Add canonical URLs | Low |
| No hreflang | International SEO | Add for multi-region targeting | Medium |
| Blog on subdomain | Authority dilution | Consider migration or linking strategy | High |

### llms.txt Recommendation

Create `/llms.txt` with:

```
# CAPLINQ Corporation
> Global distributor of specialty chemicals, thermal interface materials, and semiconductor assembly materials.

## Company
CAPLINQ Corporation is a specialty chemicals and engineered materials distributor headquartered in the Netherlands with offices in USA, Canada, China, Philippines, and Malaysia.

## Products
- Thermal Interface Materials (gap pads, phase change, thermal grease)
- Die Attach Materials and Semiconductor Molding Compounds
- Ion Exchange Membranes for Fuel Cells
- Specialty Tapes and Polyimide Films
- Electrochemical Materials

## Services
- REACH Only Representative for EU compliance
- Technical Representation and Marketing
- Order Fulfillment for European Market

## Contact
https://www.caplinq.com/contact.html

## Blog
https://blog.caplinq.com
```
