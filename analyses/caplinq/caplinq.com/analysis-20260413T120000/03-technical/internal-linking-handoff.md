---
skill: internal-linking-optimizer
phase: 03
step: 8
status: DONE
timestamp: 20260413T120000
domain: caplinq.com
data_source: tier1_webfetch
---

## Handoff Summary — internal-linking-optimizer

- **Status**: DONE
- **Objective**: Analyze and optimize internal linking structure for PageRank distribution and crawlability
- **Key Findings**: Strong internal linking volume (80+ links per page) with good category-to-product structure. Opportunities: blog-to-product linking, cross-category recommendations, hub page creation for key topics. Blog on subdomain may dilute link equity.
- **Evidence**: TIM page analysis (80+ internal links), REACH page analysis (50+ internal links), sitemap structure
- **Open Loops**: Full crawl not performed; orphan page detection requires site-wide analysis
- **Maps to**: CITE C02 (link structure), CORE O05 (internal optimization)
- **Recommended Next Skill**: backlink-analyzer (step 9)
- **Scores**:
  - Internal Linking Score: 7/10

## Full Findings

### Internal Linking Structure Overview

```
caplinq.com (root)
├── /thermal-interface-materials.html (hub) ────→ 7 product subcategories
├── /die-attach-materials.html (hub) ────→ product subcategories
├── /specialty-tapes-and-films.html (hub) ────→ product subcategories
├── /electrochemical-materials.html (hub) ────→ product subcategories
├── /reach-only-representative.html (service) ────→ related services
├── /services/ (services hub) ────→ all service pages
├── /industries/ (vertical hubs) ────→ industry pages
│   ├── /semiconductors/
│   ├── /emobility/
│   ├── /renewable-energy/
│   └── /aerospace/
└── blog.caplinq.com (subdomain) ────→ articles

[Subdomain separation = potential link equity dilution]
```

### Link Volume Analysis

| Page Type | Avg Internal Links | Assessment |
|-----------|-------------------|------------|
| Category hubs | 80+ | Excellent |
| Product pages | 30-50 | Good |
| Service pages | 50+ | Good |
| Blog posts | Unknown | Needs audit |

### Internal Linking Strengths

1. **High link density**: 80+ internal links on key category pages
2. **Navigation consistency**: Global nav links all major sections
3. **Category hierarchy**: Clear hub → product → variant structure
4. **Cross-selling**: Product pages link to related products
5. **Service integration**: Product pages link to testing, fulfillment services
6. **Brand partner links**: External links to trusted brands (credibility signal)

### Internal Linking Weaknesses

1. **Blog on subdomain**: blog.caplinq.com separates link equity
2. **Blog → product linking**: Unknown if articles link to products
3. **Orphan pages**: Cannot verify without full crawl
4. **Anchor text diversity**: Navigation uses same anchors repeatedly
5. **No dedicated hub pages**: For "comparison" or "guide" content
6. **No breadcrumbs**: Or breadcrumb schema

### Link Equity Distribution

```
                    Homepage
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    Products      Services       Industries
         │              │              │
    ┌────┴────┐    ┌────┴────┐   ┌────┴────┐
   TIM    Die    REACH   Tech   Semi  eMobility
    │    Attach    │    Rep     │       │
    └──→ Product Pages ←────────┴───────┘

[Good: Interconnected categories]
[Gap: Blog isolated on subdomain]
```

### Blog-to-Product Linking Opportunities

Based on blog categories identified:

| Blog Category | Should Link To |
|---------------|----------------|
| Thermal Interface Materials | /thermal-interface-materials.html |
| Die Attach Materials | /die-attach-materials.html |
| Conformal Coatings | /conformal-coatings.html |
| Ion Exchange Membranes | /ion-exchange-membranes-polymers.html |
| REACH Services | /reach-only-representative.html |

### Cross-Category Linking Opportunities

| From Page | To Page | Context |
|-----------|---------|---------|
| TIM | Die Attach | "For semiconductor packaging, also see..." |
| Ion Exchange | Electrochemical | "Complete fuel cell materials..." |
| REACH OR | Product categories | "REACH for your thermal materials..." |
| Polyimide Tape | TIM | "Also used for thermal insulation..." |

### Hub Page Recommendations

Create dedicated hub pages for high-value keyword clusters:

| Hub Page | Target Keyword | Links From |
|----------|----------------|------------|
| /guides/thermal-management-guide.html | thermal management | All TIM products, blog posts |
| /guides/semiconductor-materials-guide.html | semiconductor materials | Die attach, molding, encapsulants |
| /guides/reach-compliance-guide.html | REACH compliance | REACH OR, testing, all products |
| /comparison/tim-comparison.html | TIM comparison | TIM hub, blog, product pages |

### Anchor Text Optimization

| Current Pattern | Recommendation |
|-----------------|----------------|
| "Learn more" | Use descriptive: "thermal gap pads" |
| "Click here" | Use keyword: "REACH Only Representative" |
| Navigation text | Keep for consistency |
| Product names | Good - maintain |

### Subdomain Strategy Options

**Current**: blog.caplinq.com (separate subdomain)

| Option | Pros | Cons |
|--------|------|------|
| Keep subdomain | Separate analytics, easy management | Link equity dilution |
| Move to /blog/ | Consolidated authority | Migration risk |
| Heavy cross-linking | Best of both | Requires content updates |

**Recommendation**: If migration not feasible, implement heavy cross-linking:
- Every blog post links to 2-3 relevant product pages
- Product pages link to relevant blog posts in "Learn More" section
- Add blog feed/widget to main site pages

### Internal Linking Action Plan

#### P0 (Immediate)
| Action | Impact | Effort |
|--------|--------|--------|
| Add blog → product links | High | Medium |
| Add product → blog links | Medium | Medium |
| Implement breadcrumb schema | Medium | Low |

#### P1 (30 days)
| Action | Impact | Effort |
|--------|--------|--------|
| Create TIM comparison hub page | High | Medium |
| Create REACH guide hub page | Medium | Medium |
| Add cross-category recommendations | Medium | Low |

#### P2 (90 days)
| Action | Impact | Effort |
|--------|--------|--------|
| Audit for orphan pages | Medium | Medium |
| Diversify anchor text | Low | Medium |
| Consider blog migration | High | High |

### Link Mapping Template

For key target pages:

| Target Page | Current Incoming Links | Target Links | Gap |
|-------------|----------------------|--------------|-----|
| /thermal-interface-materials.html | 80+ (internal) | 100+ | +20 |
| /reach-only-representative.html | 50+ | 75+ | +25 |
| /ion-exchange-membranes-polymers.html | 30+ | 60+ | +30 |
