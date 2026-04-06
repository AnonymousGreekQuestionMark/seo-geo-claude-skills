---
skill: internal-linking-optimizer
phase: 03
step: 9
status: DONE
timestamp: 20260404T140000
domain: caplinq.com
---

## Handoff Summary — internal-linking-optimizer

- **Status**: DONE
- **Objective**: Audit internal link structure and identify optimization opportunities
- **Key Findings**: Main site has good navigation-level linking (mega-menu, breadcrumbs). Product category pages link well to subcategories and applications. The primary opportunity is improved blog-to-product cross-linking and creating topic cluster hub pages. The blog subdomain (blog.caplinq.com) is the most significant structural issue — blog content doesn't accumulate authority on the main domain.
- **Evidence**: Sitemap (127 main URLs + 290 blog), product page analysis (TIM page has 25+ internal links), breadcrumb confirmed, CMS architecture (Joomla)
- **Open Loops**: Orphan page analysis requires crawl data; actual link equity flow unknown without tools
- **Recommended Next Skill**: backlink-analyzer

## Full Findings

### Site Architecture Assessment

**Hub Pages (well-linked):**
- /thermal-interface-materials.html — 7 subcategories + 5 applications = 12+ links ✅
- /electrochemical-materials.html — 6 subcategories + application links ✅
- Homepage — mega-menu covers all primary categories ✅

**Potential Orphan Areas:**
- Service pages (Order Fulfillment, REACH, Testing) — likely fewer inbound internal links
- Resource/document pages (TDS, SDS, RoHS) — may have low internal link equity
- Glossary — potentially isolated from main product pages

### Topic Cluster Architecture (Recommended)

Current state: **Spoke model** — many individual product pages linked from navigation, but no dedicated hub pages that serve as topic authority centers.

Recommended structure:
```
PILLAR HUB: "Thermal Interface Materials Complete Guide"
  ├── Phase Change Materials (existing subcategory)
  ├── Thermal Gap Pads (existing subcategory)
  ├── Thermal Putty Pads (existing subcategory)
  ├── Thermal Grease (existing subcategory)
  ├── Blog: "TIM selection for semiconductor packaging" (link from hub)
  ├── Blog: "Phase change material vs thermal gap pad" (link from hub)
  └── Application: Semiconductors thermal management (link from hub)
```

### Blog-to-Main Site Linking

**Critical Issue**: blog.caplinq.com is a separate subdomain. This means:
- Blog posts don't directly pass internal link equity to caplinq.com pages
- Blog content competes with main site for brand queries
- 290 high-quality blog posts are not leveraging their authority for main site product rankings

**Recommendation**: Either (a) migrate blog to caplinq.com/blog/ to unify authority, or (b) ensure every blog post has 2–3 contextual internal links back to relevant caplinq.com product pages using keyword-rich anchor text.

### Anchor Text Analysis

| Observed Pattern | Status | Recommendation |
|-----------------|--------|----------------|
| Navigation links | Generic ("Products", "Applications") | Keep — navigation should be generic |
| Subcategory links | Descriptive ("Phase Change Materials") | ✅ Good |
| Cross-category links | Unknown quality | Audit for keyword-rich anchor text |
| Blog post links | Unknown | Add product page links with exact-match anchors |

### Priority Fixes

1. **Create pillar hub pages** for TIM, electrochemical materials, die attach — link all related content to these hubs
2. **Add contextual blog-to-product links** — every blog post should link to 2–3 product pages
3. **Audit service page internal links** — ensure REACH, Order Fulfillment, Testing pages receive links from relevant product and blog pages
4. **Link glossary to product pages** — every glossary term should link to the relevant product category
5. **Add breadcrumbs with schema** — already likely present; verify BreadcrumbList schema implementation
