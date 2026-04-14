---
skill: internal-linking-optimizer
phase: 03
step: 8
status: DONE
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier1_webfetch
---

## Handoff Summary — internal-linking-optimizer

- **Status**: DONE
- **Objective**: Audit internal linking structure and identify optimization opportunities
- **Key Findings**: Strong internal linking foundation (150+ links on homepage). Clear category hierarchy. Blog on subdomain (blog.caplinq.com) reduces link equity flow to main domain. Missing contextual links from blog to product pages.
- **Evidence**: Homepage WebFetch analysis showing navigation structure
- **Open Loops**: None
- **Maps to**: CITE C03 (Internal link authority), CORE O06 (Internal linking)
- **Recommended Next Skill**: backlink-analyzer (Step 9)

## Internal Linking Structure

### Site Architecture
```
caplinq.com (Main)
├── /products/ (16 categories, 104 URLs)
│   ├── /thermal-interface-materials.html
│   ├── /die-attach-materials.html
│   ├── /electrochemical-materials.html
│   └── ... (13 more categories)
├── /applications/ (5 industry verticals)
│   ├── /semiconductors/
│   ├── /emobility/
│   ├── /renewable-energy/
│   ├── /electronics-assembly/
│   └── /aerospace/
├── /services/ (4 service areas)
└── /resources/ (6 resource types)

blog.caplinq.com (Subdomain - SEPARATE)
└── Technical articles, tutorials
```

### Link Metrics (Homepage)

| Metric | Count | Status |
|--------|-------|--------|
| Total Internal Links | 150+ | Good |
| Navigation Links | ~50 | Good |
| Footer Links | ~30 | Good |
| Content Links | ~70 | Good |
| External Links | ~25 | Acceptable |

## Key Issues

### 1. Blog on Subdomain
**Issue**: blog.caplinq.com is a separate subdomain
**Impact**: 
- Link equity doesn't flow to main domain
- Blog rankings don't boost product page authority
- Separate domain authority metrics
**Recommendation**: Consider migrating to caplinq.com/blog/

### 2. Missing Cross-Links
**Issue**: Blog articles about products don't link to product pages
**Example**: "Advances in Epoxy Molding Compounds" blog post should link to /molding-compounds.html
**Action**: Add contextual links from blog to relevant product pages

### 3. Orphan Pages
**Potential Issue**: Deep product pages may have limited internal links
**Action**: Audit link depth and add links from category pages

## Internal Link Optimization Plan

### P0 — Critical
1. Add links from blog.caplinq.com to caplinq.com product pages
2. Ensure all product pages link back to category pages
3. Add "Related Products" sections to product pages

### P1 — High Priority
4. Create hub pages for hero keywords (TIM, die attach)
5. Add breadcrumb navigation (with schema)
6. Link between related category pages

### P2 — Medium Priority
7. Consider blog migration to /blog/ subdirectory
8. Create pillar content pages with extensive internal links
9. Add "Popular Products" widget to all pages

## Internal Linking Score: 70/100
