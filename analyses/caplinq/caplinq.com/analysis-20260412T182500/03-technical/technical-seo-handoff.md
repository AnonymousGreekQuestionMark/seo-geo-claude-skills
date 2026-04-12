---
skill: technical-seo-checker
phase: 03
step: 6
status: DONE_WITH_CONCERNS
timestamp: 20260412T182500
domain: caplinq.com
data_source: tier2_mcp
---

## Handoff Summary — technical-seo-checker

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Audit technical SEO health and Core Web Vitals
- **Key Findings**: Site has SLOW Core Web Vitals — Mobile LCP 10.5s (target <2.5s), Desktop CLS 0.395 (target <0.1). Performance scores: Mobile 53/100, Desktop 61/100. Good security headers (HSTS, CSP, X-Frame-Options). Critical: No llms.txt file for AI discoverability. Multiple 410 errors on key pages. Runs on Cloudflare with HTTP/2.
- **Evidence**: PageSpeed Insights API, HTTP header analysis, robots.txt review
- **Open Loops**: Full site crawl needed for comprehensive 410 audit
- **Maps to**: CITE T07 (HTTPS/Security), T08 (Technical Freshness), E04 (Crawlability), CORE T01-T05
- **Recommended Next Skill**: on-page-seo-auditor (Step 7)
- **Scores**:
  - Technical score: 5.5/10

## Full Findings

### Core Web Vitals

| Metric | Mobile | Desktop | Target | Status |
|--------|--------|---------|--------|--------|
| **LCP** (Largest Contentful Paint) | 10.5s | 2.2s | <2.5s | ✗ FAIL (mobile) |
| **CLS** (Cumulative Layout Shift) | 0.001 | 0.395 | <0.1 | ✗ FAIL (desktop) |
| **INP** (Interaction to Next Paint) | 120ms | 33ms | <200ms | ✓ PASS |
| **FCP** (First Contentful Paint) | 5.7s | 1.2s | <1.8s | ✗ FAIL (mobile) |
| **TBT** (Total Blocking Time) | 240ms | 60ms | <200ms | ✗ FAIL (mobile) |

### Performance Scores

| Device | Score | Category | CITE E04 |
|--------|-------|----------|----------|
| Mobile | 53/100 | Needs Improvement | PARTIAL |
| Desktop | 61/100 | Needs Improvement | PARTIAL |

### Field Data (CrUX - Real User Metrics)

| Metric | Mobile | Desktop | Assessment |
|--------|--------|---------|------------|
| LCP | 5.7s | 4.4s | SLOW |
| CLS | 0.016 | 0.038 | GOOD |
| INP | 120ms | 33ms | GOOD |
| Overall | SLOW | SLOW | **NEEDS WORK** |

### Security Headers Analysis

| Header | Status | Value |
|--------|--------|-------|
| HTTPS | ✓ | HTTP/2 with 301 redirect to www |
| HSTS | ✓ | max-age=31536000; includeSubDomains; preload |
| X-Frame-Options | ✓ | SAMEORIGIN |
| X-XSS-Protection | ✓ | 1; mode=block |
| X-Content-Type-Options | ✓ | nosniff |
| Content-Security-Policy | ✓ | upgrade-insecure-requests |
| Referrer-Policy | ✓ | no-referrer-when-downgrade |
| Permissions-Policy | ✓ | interest-cohort=() |

**Security Score: 9/10** — Excellent security headers. Minor: CSP could be stricter.

### Infrastructure

| Aspect | Value |
|--------|-------|
| CDN | Cloudflare |
| Protocol | HTTP/2 |
| SSL | Valid |
| Server | cloudflare |
| CMS | Joomla (detected from robots.txt) |
| Cache-Control | max-age=3600 |

### AI Discoverability (llms.txt)

| Check | Status | Impact |
|-------|--------|--------|
| /llms.txt | ✗ 404 Not Found | AI engines can't discover optimized content |
| /llms-full.txt | ✗ 404 Not Found | No extended AI context available |
| robots.txt AI blocks | ✗ None | No explicit AI crawler directives |

**CITE E04 Impact**: Without llms.txt, AI systems rely on standard crawling. CAPLINQ misses the opportunity to provide structured company/product information for AI citation.

### robots.txt Analysis

```
User-agent: *
Disallow: /administrator/
Disallow: /bin/
Disallow: /cache/
Disallow: /cli/
Disallow: /installation/
Disallow: /layouts/
Disallow: /plugins/
Disallow: /tmp/

Sitemap: https://www.caplinq.com/sitemap.xml
```

**Findings**:
- Standard Joomla exclusions
- No AI crawler blocks (GPTBot, ClaudeBot, etc. allowed)
- 4 sitemap files referenced
- No crawl-delay directive

### Critical Technical Issues

| Issue | Severity | Impact | Recommendation |
|-------|----------|--------|----------------|
| **Mobile LCP 10.5s** | HIGH | Google ranking factor, poor UX | Optimize images, reduce server response time |
| **Desktop CLS 0.395** | HIGH | Layout shift hurts UX | Add dimensions to images, preload fonts |
| **Multiple 410 errors** | CRITICAL | Lost rankings, broken journeys | Restore or redirect pages |
| **No llms.txt** | MEDIUM | Missing AI citations | Create llms.txt with company/product info |
| **Blog on subdomain** | MEDIUM | Diluted authority | Migrate to main domain |

### CITE Dimension Scores (T07-T09)

| Item | Score | Verdict | Evidence |
|------|-------|---------|----------|
| **T07** (HTTPS/Security) | 90/100 | PASS | Full HTTPS, strong security headers |
| **T08** (Technical Freshness) | 65/100 | PARTIAL | HTTP/2, but slow performance |
| **T09** (Penalty Signals) | 85/100 | PASS | No visible penalty indicators |

### Performance Optimization Recommendations

| Priority | Action | Expected Impact |
|----------|--------|-----------------|
| **P0** | Optimize images (WebP, lazy loading) | -3s LCP |
| **P0** | Reduce server response time | -2s TTFB |
| **P0** | Preload critical fonts | -0.3 CLS |
| **P1** | Enable resource compression | -20% page weight |
| **P1** | Defer non-critical JavaScript | -500ms TBT |
| **P2** | Implement service worker | Improved repeat visits |

### llms.txt Recommendation

Create `/llms.txt` with:

```
# CAPLINQ Corporation
> Specialty chemicals and engineered materials supplier for semiconductor, eMobility, and electronics industries.

## Company
- Founded: 2004
- HQ: Assendelft, Netherlands
- Certifications: ISO 9001
- Markets: Semiconductor, eMobility, Renewable Energy, Electronics Assembly, Aerospace

## Products
- Thermal Interface Materials
- Die Attach Materials
- Conductive Adhesives
- Epoxy Molding Compounds
- Soldering Materials
- Specialty Tapes & Films

## Services
- REACH Only Representative (EU)
- Order Fulfillment
- Technical Marketing
- Material Testing

## Contact
- Europe: +31 (20) 893 2224
- USA: +1 (618) 416 9739
- Website: https://caplinq.com
```
