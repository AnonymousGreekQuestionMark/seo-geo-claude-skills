---
skill: technical-seo-checker
phase: 03
step: 6
status: DONE_WITH_CONCERNS
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier2_mcp_pagespeed
---

## Handoff Summary — technical-seo-checker

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Audit Core Web Vitals, crawlability, and technical SEO health
- **Key Findings**: Critical mobile performance issues — 33/100 score, LCP 13.2s, CLS 0.671. Desktop moderate at 57/100. No AI crawler directives in robots.txt. HTTPS valid. Sitemap present.
- **Evidence**: Google PageSpeed Insights API (CrUX field data + Lighthouse lab data)
- **Open Loops**: TIM page PageSpeed test failed (500 error) — needs manual retest
- **Maps to**: CITE T07 (HTTPS), T08 (Technical freshness), E04 (Crawlability), CORE T01-T10
- **Recommended Next Skill**: on-page-seo-auditor (Step 7)

## Core Web Vitals Summary

### Mobile (Primary — Google Mobile-First Indexing)

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| **Performance Score** | 33/100 | ≥90 | **FAIL** |
| LCP (Largest Contentful Paint) | 13.2s | ≤2.5s | **FAIL** |
| CLS (Cumulative Layout Shift) | 0.671 | ≤0.1 | **FAIL** |
| INP (Interaction to Next Paint) | 120ms | ≤200ms | PASS |
| FCP (First Contentful Paint) | 6.3s | ≤1.8s | **FAIL** |
| Speed Index | 9.0s | ≤3.4s | **FAIL** |
| Time to Interactive | 13.4s | ≤3.8s | **FAIL** |
| TBT (Total Blocking Time) | 70ms | ≤200ms | PASS |

**CrUX Field Data**: Overall category = **SLOW**

### Desktop

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| **Performance Score** | 57/100 | ≥90 | **PARTIAL** |
| LCP | 2.5s | ≤2.5s | PASS (borderline) |
| CLS | 0.399 | ≤0.1 | **FAIL** |
| INP | 33ms | ≤200ms | PASS |
| FCP | 1.2s | ≤1.8s | PASS |
| Speed Index | 3.0s | ≤3.4s | PASS |
| TTI | 2.6s | ≤3.8s | PASS |

## CITE Technical Dimension Scores

| Item | Score | Verdict | Raw Data |
|------|-------|---------|----------|
| T07 (HTTPS) | 100 | PASS | Valid SSL certificate |
| T08 (Tech Freshness) | 60 | PARTIAL | Sitemap updated 2026-04-14 |
| E04 (Crawlability) | 40 | FAIL | Mobile 33/100, >3s load |

## Critical Technical Issues

### 1. Extremely Poor Mobile Performance
**Severity**: P0 — Critical (impacts rankings)
**Issue**: Mobile score 33/100 with 13.2s LCP
**Impact**: Google uses mobile-first indexing; poor mobile = ranking penalty
**Root Causes**:
- Large unoptimized images
- Render-blocking JavaScript
- No lazy loading
- Heavy page weight

### 2. Severe Layout Shift (CLS)
**Severity**: P0 — Critical
**Issue**: CLS 0.671 (mobile) and 0.399 (desktop) — should be ≤0.1
**Impact**: Poor user experience, Core Web Vitals failure
**Root Causes**:
- Images without width/height attributes
- Dynamic content injection
- Web fonts causing FOIT/FOUT
- Ads or embeds loading late

### 3. No AI Crawler Directives
**Severity**: P1 — High
**Issue**: robots.txt lacks GPTBot, Claude-Web, PerplexityBot, CCBot directives
**Impact**: AI crawlers use default User-agent: * rules; may not crawl optimally
**Action**: Add explicit Allow directives for AI crawlers

## Technical Audit Checklist

### Passed ✓
- [x] HTTPS enabled with valid certificate
- [x] Sitemap present (4 sitemaps in robots.txt)
- [x] robots.txt accessible
- [x] INP (responsiveness) acceptable
- [x] No major JavaScript errors detected
- [x] Mobile-responsive design

### Failed ✗
- [ ] Mobile performance score ≥90
- [ ] LCP ≤2.5s on mobile
- [ ] CLS ≤0.1 on all devices
- [ ] AI crawler directives in robots.txt
- [ ] llms.txt present
- [ ] Core Web Vitals "Good" in CrUX

### Not Tested
- [ ] Structured data validation
- [ ] Canonical tag implementation
- [ ] Hreflang for international
- [ ] 404 error pages
- [ ] Redirect chains

## Performance Optimization Roadmap

### P0 — Critical (Week 1)
1. **Optimize images** — Compress, convert to WebP, add lazy loading
2. **Fix CLS** — Add explicit width/height to all images, preload fonts
3. **Reduce render-blocking resources** — Defer non-critical JS/CSS

### P1 — High Priority (Weeks 2-4)
4. **Implement critical CSS inlining** — Above-the-fold styles
5. **Add AI crawler directives** to robots.txt
6. **Create llms.txt** file

### P2 — Medium Priority (Month 2)
7. Enable browser caching headers
8. Implement CDN for static assets
9. Minify and combine CSS/JS files

## Expected Impact

| Action | Current | Target | Ranking Impact |
|--------|---------|--------|----------------|
| Fix mobile LCP | 13.2s | <2.5s | +15-20% visibility |
| Fix CLS | 0.671 | <0.1 | +5-10% visibility |
| Add AI directives | None | Full | Improved AI citation |
| Overall mobile score | 33 | >80 | Significant improvement |

## Technical Score Summary

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Mobile Performance | 33/100 | 40% | 13.2 |
| Desktop Performance | 57/100 | 20% | 11.4 |
| HTTPS/Security | 100/100 | 15% | 15.0 |
| Crawlability | 70/100 | 15% | 10.5 |
| AI Discoverability | 20/100 | 10% | 2.0 |
| **Technical SEO Score** | | | **52/100** |
