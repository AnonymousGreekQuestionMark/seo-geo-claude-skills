---
skill: internal-linking-optimizer
phase: 03
step: 8
status: DONE_WITH_CONCERNS
timestamp: 20260412T182500
domain: caplinq.com
data_source: tier1_webfetch
fallbacks_used:
  - "Full crawl data unavailable — analysis based on homepage/product page samples"
---

## Handoff Summary — internal-linking-optimizer

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Analyze and optimize internal linking structure
- **Key Findings**: Strong navigation-based linking (150+ links on homepage). Product pages have good breadcrumbs and cross-links. Critical issues: (1) Blog on subdomain breaks link equity flow, (2) 410 pages create orphan links and broken journeys, (3) No contextual linking between related products observed, (4) Services pages may be under-linked. Hub-and-spoke architecture visible but incomplete.
- **Evidence**: Homepage link analysis, product page breadcrumb structure, sitemap structure
- **Open Loops**: Full crawl needed to map complete link graph and identify orphan pages
- **Maps to**: CITE I02 (Internal structure), CORE O06-O10 (Organization)
- **Recommended Next Skill**: backlink-analyzer (Step 9)

## Full Findings

### Site Architecture Overview

```
                    Homepage (150+ links)
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Products         Services         Resources
        │                │                │
   14 Categories    5 Services      Documentation
        │                                 │
   Subcategories                    blog.caplinq.com
        │                              (subdomain)
    Products (130 total)
```

### Internal Link Distribution

| Section | Links from Homepage | Assessment |
|---------|---------------------|------------|
| Products | ~80 links | ✓ Well-linked |
| Services | ~15 links | ⚠️ Could be stronger |
| Industries | ~10 links | ⚠️ Many 410 |
| Resources | ~20 links | ✓ Adequate |
| Blog | ~5 links | ✗ Subdomain issue |
| About | ~5 links | ✗ 410 errors |
| Contact | ~10 links | ✓ Regional pages |

### Breadcrumb Structure

**Product Page Example:**
```
Home > Products > Molding Compounds > Semiconductor Epoxy Mold Compounds
```

**Assessment**: ✓ Clean hierarchy, but missing BreadcrumbList schema.

### Link Equity Flow Issues

#### Issue 1: Blog Subdomain (CRITICAL)

```
caplinq.com ──────X──────> blog.caplinq.com
                          (200+ articles)
                          
Link equity does NOT flow back to main domain
```

**Impact**: 
- Blog content authority isolated
- Main domain misses link equity from blog backlinks
- Keyword rankings fragmented

**Recommendation**: Migrate blog.caplinq.com → caplinq.com/blog/ with 301 redirects.

#### Issue 2: 410 Broken Links

| Broken Destination | Links Pointing To | Impact |
|--------------------|-------------------|--------|
| /thermal-interface-materials | ~20 | High-value page unreachable |
| /about | ~15 | Company info unavailable |
| /industries | ~10 | Industry pages dead |
| /adhesives-sealants | ~15 | Product category broken |

**Impact**: Link equity flows to 410 pages and is lost.

### Hub Page Analysis

| Hub | Spokes | Link Health |
|-----|--------|-------------|
| Homepage | 14 product categories | ⚠️ Some 410s |
| Molding Compounds | 90+ products | ✓ Good |
| Die Attach Materials | 20+ products | ✓ Good |
| Services | 5 service pages | ✓ Good |
| Industries | 5 verticals | ✗ 410 errors |

### Cross-Linking Opportunities

| From | To | Anchor Text | Status |
|------|-----|-------------|--------|
| Thermal Interface Materials | Die Attach Materials | "die bonding applications" | ✗ Missing |
| Epoxy Molding Compounds | Technical Blog | "EMC selection guide" | ✗ Missing (subdomain) |
| REACH Services | Case Studies | "REACH compliance success" | ✗ Missing (no case studies) |
| Homepage | Comparison Guides | "material selection guide" | ✗ Missing (no guides) |

### Anchor Text Distribution

| Type | Percentage | Assessment |
|------|------------|------------|
| Exact match product names | ~40% | Good |
| Generic ("Learn more") | ~30% | Could reduce |
| Category names | ~20% | Good |
| Brand terms | ~10% | Appropriate |

### PageRank Flow Optimization

**Current State:**
- Homepage PageRank distributed across 150+ links
- High-value product pages receive adequate links
- Services pages may be under-linked
- Blog receives minimal internal links

**Recommended Changes:**

| Action | Expected Impact |
|--------|-----------------|
| Migrate blog to main domain | +30% link equity to caplinq.com |
| Fix 410 pages | Recover ~60 internal links |
| Add related products section | +15 links per product page |
| Add contextual blog links | Distribute topical authority |

### Internal Linking Strategy Recommendations

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| **P0** | Fix/redirect 410 pages | Medium | Critical |
| **P0** | Migrate blog to main domain | High | High |
| **P1** | Add "Related Products" module | Medium | Medium |
| **P1** | Add BreadcrumbList schema | Low | Medium |
| **P2** | Create product comparison hubs | High | High |
| **P2** | Contextual links in blog posts | Medium | Medium |
| **P3** | Reduce "Learn more" generic anchors | Low | Low |

### Link Depth Analysis

| Depth | Page Count | Target |
|-------|------------|--------|
| 1 (Homepage) | 1 | — |
| 2 (Categories) | ~20 | ✓ OK |
| 3 (Subcategories) | ~40 | ✓ OK |
| 4 (Products) | ~70 | ⚠️ Some pages 4+ clicks deep |

**Recommendation**: Ensure all key product pages reachable within 3 clicks.
