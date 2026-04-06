---
skill: technical-seo-checker
phase: 03
step: 7
status: DONE_WITH_CONCERNS
timestamp: 20260404T140000
domain: caplinq.com
---

## Handoff Summary — technical-seo-checker

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Technical SEO health check for caplinq.com
- **Key Findings**: Site runs Joomla CMS (legacy platform with known Core Web Vitals challenges). Sitemap structure is good (4 sitemaps, properly organized). robots.txt is clean. Primary concern: Joomla typically generates slow page loads and mobile experience issues. Blog redirect (caplinq.com/blog/ → blog.caplinq.com) creates crawl/canonicalization complexity.
- **Evidence**: robots.txt analysis, sitemap structure (4 sitemaps), CMS detection (Joomla, from robots.txt directives), blog subdomain redirect detected during fetching
- **Open Loops**: PageSpeed Insights data unavailable; actual CWV metrics unknown; crawl coverage unknown
- **Recommended Next Skill**: on-page-seo-auditor
- **Scores**: Technical score: **5.5/10** (estimated — Joomla penalty likely on CWV)

## Full Findings

### Crawlability (Score: 7/10)
| Check | Status | Finding |
|-------|--------|---------|
| robots.txt | ✅ Pass | Properly configured; CMS system dirs blocked; content dirs accessible |
| XML Sitemap | ✅ Pass | 4 sitemaps registered (main, products, blog index, services) |
| Sitemap health | ⚠️ Partial | blog/sitemap redirects to blog.caplinq.com — split domain setup |
| Crawl budget | ✅ Pass | 127 static URLs + 290 blog posts = manageable crawl budget |
| Redirect chains | ⚠️ Unknown | www→non-www or HTTPS redirect behavior unverified |
| Internal link depth | ✅ Pass | Navigation structure is organized; product categories well-linked |

### Indexability (Score: 6/10)
| Check | Status | Finding |
|-------|--------|---------|
| HTTPS | ✅ Pass | Site serves HTTPS correctly |
| Canonical tags | ⚠️ Unknown | Joomla may generate duplicate content without careful canonical config |
| Duplicate content | ⚠️ Risk | E-commerce/product sites often suffer from parameter-based duplicates |
| hreflang | ⚠️ Not detected | Multi-currency site serves international; no hreflang confirmed |
| Pagination | ⚠️ Unknown | Product catalog pagination needs canonical or rel=next handling |

### Core Web Vitals (Score: 4/10 — estimated)
| Metric | Est. Status | Notes |
|--------|-------------|-------|
| LCP (Largest Contentful Paint) | ⚠️ Likely Poor | Joomla + product images = slow LCP; target <2.5s, likely >4s |
| FID/INP (Interaction to Next Paint) | ⚠️ Unknown | JS-heavy Joomla pages may have high INP |
| CLS (Cumulative Layout Shift) | ⚠️ Unknown | Product image lazy loading may cause CLS |
| TTFB (Time to First Byte) | ⚠️ Unknown | Server location + CDN unknown |

### Mobile (Score: 6/10)
| Check | Status | Finding |
|-------|--------|---------|
| Responsive design | ✅ Likely | Mobile/desktop detection script noted in page source |
| Viewport meta | ✅ Likely | Standard Joomla template includes viewport meta |
| Touch targets | ⚠️ Unknown | Requires manual mobile testing |
| Font sizes | ⚠️ Unknown | Technical content (spec tables) may be too small on mobile |

### URL Structure (Score: 7/10)
| Check | Status | Finding |
|-------|--------|---------|
| URL format | ✅ Pass | Clean SEF URLs (e.g., /thermal-interface-materials.html) |
| URL length | ✅ Pass | URLs appear concise and descriptive |
| Special characters | ✅ Pass | No URL encoding issues observed |
| Subdomain split | ⚠️ Concern | Main site on caplinq.com; blog on blog.caplinq.com — PageRank split |

### Key Technical Issues to Fix

1. **CRITICAL: Blog subdomain PageRank leak** — blog.caplinq.com content doesn't pass full authority back to main domain; consider migrating to caplinq.com/blog/
2. **HIGH: Joomla CWV optimization** — Enable Joomla cache, CDN (Cloudflare), image compression; target LCP <2.5s
3. **HIGH: Canonical tag audit** — Review all product/category pages for proper canonicalization
4. **MEDIUM: International SEO (hreflang)** — Multi-currency site serving global audience needs hreflang implementation
5. **MEDIUM: Duplicate content check** — Audit for URL parameter issues (e.g., /category?sort=price)
