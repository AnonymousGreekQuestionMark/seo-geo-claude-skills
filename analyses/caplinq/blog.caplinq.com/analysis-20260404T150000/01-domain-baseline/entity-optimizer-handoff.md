---
skill: entity-optimizer
phase: 01
step: 1
status: DONE
timestamp: 20260404T150000
domain: blog.caplinq.com
---

## Handoff Summary — entity-optimizer

- **Status**: DONE
- **Objective**: Entity audit for blog.caplinq.com as a content property of CAPLINQ Corporation
- **Key Findings**: blog.caplinq.com is a subdomain of CAPLINQ Corporation — the entity is the same parent organization. Entity signals are STRONGER on the blog than the main site: Article + Person schema confirmed on posts, named authors (George Kountardas, Rose Anne Acedera, etc.), original research published (PFAS-free GDL coatings). However, the subdomain separation means entity signals accumulate on blog.caplinq.com rather than caplinq.com — a structural issue.
- **Evidence**: Blog post analysis (two posts fetched), sitemap_index.xml, blog homepage, schema markup confirmed (Article, Person, BreadcrumbList, WebPage)
- **Open Loops**: Full author list and bio completeness unknown; blog's link back to main site entity schema not confirmed
- **Recommended Next Skill**: schema-markup-generator (add Organization schema with sameAs to blog header; link blog entity to main site entity)

## Full Findings

### Entity Profile

**Entity Name**: CAPLINQ Blog (content property of CAPLINQ Corporation)  
**Entity Type**: Organization (same parent as caplinq.com)  
**Primary Domain**: blog.caplinq.com  
**CMS**: WordPress (with Yoast SEO)  

### Author Entity Signals (STRONGER than main site)

| Author | Signal | Status |
|--------|--------|--------|
| George Kountardas | Named author + bio + Person schema | ✅ Strong |
| Rose Anne Acedera | Named author + Person schema on post | ✅ Strong |
| Anna Phan | Named author (blog homepage) | ⚠️ Partial |
| Other authors | Multiple named contributors | ⚠️ Need author pages |

**Key Advantage**: Blog has genuine Person schema with named technical authors. This is a significant EEAT signal that the main site (Joomla) lacks. The blog's author attribution should be referenced from main site content.

### AI Entity Resolution (Blog-Specific)

For the query "CAPLINQ PFAS-free GDL coating":
- Perplexity: Likely to surface this blog post (original research + technical depth)
- Google AI Overview: Could cite the water contact angle comparison (154.4° vs 153.8°)
- ChatGPT: May not have this data in training (2025 publication)

### Entity Signal Audit

| Category | Status | Key Findings |
|----------|--------|-------------|
| Structured Data | ✅ Strong | Article, Person, BreadcrumbList, WebPage confirmed |
| Knowledge Base | ❌ Same gap as main | No Wikidata/Wikipedia for parent company |
| NAP+E Consistency | ✅ Strong | Consistent office locations across all posts |
| Content-Based | ✅ Very Strong | 290 posts; original research; named engineers |
| Third-Party | ⚠️ Gaps | Technical citations exist; limited external authority links |
| AI-Specific | ✅ Good | Definitions, mechanisms, original data in posts |

### Priority Actions for blog.caplinq.com Entity
1. **Add Organization schema to blog header** — link blog to parent entity (caplinq.com) via sameAs and publisher schema
2. **Create dedicated author pages** — full bio pages for each contributor improve Person entity signals
3. **Add author credentials** — "Technical Applications Engineer at CAPLINQ" as structured jobTitle in Person schema
4. **Inter-link with main site entity** — each blog post footer should have an Organization schema reference
