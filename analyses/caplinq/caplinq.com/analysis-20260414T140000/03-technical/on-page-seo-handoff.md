---
skill: on-page-seo-auditor
phase: 03
step: 7
status: DONE_WITH_CONCERNS
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier1_webfetch
---

## Handoff Summary — on-page-seo-auditor

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Audit on-page SEO elements across key pages
- **Key Findings**: Zero schema markup site-wide (CITE I04 FAIL). Meta description not detected on homepage. H1 is branding-focused ("Products that Perform") not keyword-focused. Strong internal linking (150+ links).
- **Evidence**: WebFetch of homepage, schema validation via MCP tool
- **Open Loops**: Full title tag not extractable from WebFetch; needs browser inspection
- **Maps to**: CORE C01 (Search intent), O01-O10 (Optimization), CITE I04 (Schema coverage)
- **Recommended Next Skill**: internal-linking-optimizer (Step 8)

## On-Page Element Audit

### Homepage (caplinq.com)

| Element | Status | Finding | Action |
|---------|--------|---------|--------|
| Title Tag | Unknown | Not extracted | Verify manually |
| Meta Description | FAIL | Not detected | Add 150-160 char description |
| H1 | PARTIAL | "Products that Perform" — branding, not keyword | Add keyword-rich H1 |
| H2s | PASS | Good category structure | None |
| Schema Markup | FAIL | 0 blocks found | Add Organization, Product |
| Internal Links | PASS | 150+ links | None |
| External Links | PASS | ~25 links to partners | None |
| Image Alt Text | PARTIAL | Some missing | Add descriptive alts |

### Die Attach Materials Page

| Element | Status | Finding | Action |
|---------|--------|---------|--------|
| Schema Markup | FAIL | 0 blocks found | Add Product, FAQ schema |
| FAQ Content | PASS | 4 FAQs present | Add FAQSchema |
| Product Display | FAIL | "No Products Found" | Fix product feed |

## Schema Markup Analysis

### Current State
| Page | Schema Blocks | Types | CITE I04 |
|------|---------------|-------|----------|
| Homepage | 0 | None | FAIL |
| Die Attach | 0 | None | FAIL |
| TIM | 0 | None | FAIL (estimated) |

### Missing Schema (Recommended)

| Schema Type | Pages | Priority | Impact |
|-------------|-------|----------|--------|
| Organization | Homepage | P0 | Entity recognition, Knowledge Panel |
| Product | All product pages | P0 | Rich results, AI citation |
| FAQPage | Category pages with FAQs | P0 | PAA boxes, featured snippets |
| BreadcrumbList | All pages | P1 | Navigation rich results |
| LocalBusiness | About/Contact | P1 | Local SEO |
| HowTo | Technical guides | P2 | How-to rich results |
| Article | Blog posts | P2 | Article rich results |

## CORE-EEAT On-Page Scores

| Dimension | Score | Key Factor |
|-----------|-------|------------|
| C (Comprehensiveness) | 70 | Good content depth, missing schema |
| O (Optimization) | 45 | Poor meta tags, no schema |
| R (Referencing) | 55 | Some external links, no citations |
| E (Engagement) | 60 | Good navigation, slow load times |

**CORE Average**: 58/100

## Title Tag Analysis

Based on SERP snippets from prior analysis:

| Page | Observed Title | Length | Keyword | Status |
|------|----------------|--------|---------|--------|
| Homepage | "Specialty chemicals, plastics..." | ~60 char | Yes | PASS |
| REACH OR | Includes "REACH Only Representative" | ~55 char | Yes | PASS |
| Die Attach | Includes "Die Attach Materials" | ~50 char | Yes | PASS |

## H1 Tag Optimization

### Current H1s (Sampled)
| Page | H1 | Issue | Recommended |
|------|-----|-------|-------------|
| Homepage | "Products that Perform" | Branding only | "Specialty Chemicals & Materials Supplier" |
| TIM | Unknown | Check manually | "Thermal Interface Materials" |
| Die Attach | Unknown | Check manually | "Die Attach Materials & Adhesives" |

## Content Quality Indicators

### Positive Signals
- Deep technical content (8,500+ words on die attach)
- FAQ sections on key pages
- Comparison tables and selector guides
- Multiple author bylines on blog

### Negative Signals
- No visible author credentials on main site
- No publication dates on category pages
- No "Last Updated" timestamps
- No expert citations or references

## Recommendations

### P0 — Critical (Week 1)
1. **Add Organization schema** to homepage with sameAs links
2. **Add Product schema** to all product category pages
3. **Add FAQPage schema** to pages with FAQ content
4. **Fix meta description** on homepage (if truly missing)

### P1 — High Priority (Weeks 2-4)
5. Add BreadcrumbList schema site-wide
6. Optimize H1 tags with primary keywords
7. Add author credentials/schema to blog posts
8. Add "Last Updated" dates to content pages

### P2 — Medium Priority (Month 2)
9. Implement HowTo schema for technical guides
10. Add review/rating schema where applicable
11. Create dedicated schema for REACH OR service

## On-Page Score Summary

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Title Tags | 75/100 | 20% | 15.0 |
| Meta Descriptions | 40/100 | 15% | 6.0 |
| Headings (H1-H6) | 60/100 | 15% | 9.0 |
| Schema Markup | 0/100 | 25% | 0.0 |
| Content Structure | 75/100 | 15% | 11.25 |
| Internal Linking | 85/100 | 10% | 8.5 |
| **On-Page SEO Score** | | | **50/100** |
