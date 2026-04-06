---
skill: internal-linking-optimizer
phase: 03
step: 9
status: DONE
timestamp: 20260404T150000
domain: blog.caplinq.com
---

## Handoff Summary — internal-linking-optimizer

- **Status**: DONE
- **Objective**: Internal link structure optimization for blog.caplinq.com
- **Key Findings**: Blog has decent post-to-post linking (3–5 related posts per article) and good post-to-product linking (3–5 product links per article). Primary gap: no hub/pillar blog posts that consolidate multiple related posts into an authoritative cluster. The cross-domain links to caplinq.com are present but don't create a bidirectional link loop (main site doesn't link back to blog posts contextually).
- **Evidence**: Die attach post (3 related blog posts + 3 product links), PFAS-free GDL post (4 blog links + 5 product links)
- **Open Loops**: Full internal link graph requires crawl tool; orphan posts unknown
- **Recommended Next Skill**: backlink-analyzer

## Full Findings

### Current Internal Linking Assessment

**Blog → Main Site**: ✅ Active — posts link to product pages on caplinq.com  
**Main Site → Blog**: ❌ Weak — product pages don't contextually link to relevant blog posts  
**Blog → Blog**: ✅ Active — 3–5 related post links per article  
**Blog Hub Pages**: ❌ Missing — no pillar posts aggregating topic clusters

### Key Gap: No Pillar Blog Posts

A pillar blog post (2,000+ words) linking to all related posts in a topic cluster would:
1. Concentrate internal link equity on the most important posts
2. Create a clear entry point for readers and search engines
3. Rank for broader informational queries

**Recommended Pillar Post Additions:**
- "Complete Guide to Die Attach Materials: Selection, Storage, Dispensing, Curing" — links to 8+ existing posts
- "Electrochemical Materials for Hydrogen Applications: A Comprehensive Guide" — links to 5+ existing posts
- "Thermal Interface Materials Best Practices: Selection, Installation, Testing" — links to existing TIM posts

### Cross-Domain Link Loop (Fix Required)

Current state:
```
blog.caplinq.com/pfas-free-gdl-post → caplinq.com/electrochemical-materials.html [link exists ✅]
caplinq.com/electrochemical-materials.html → blog.caplinq.com/pfas-free-gdl-post [MISSING ❌]
```

Every product category page on caplinq.com should have a "From Our Blog:" section linking to 3–5 relevant blog posts. This creates a bidirectional link loop that would strengthen both domains.

### Anchor Text Quality
From analyzed posts: anchor text is descriptive and keyword-relevant (e.g., "LOCTITE ABLESTIK 84-1LMI", "die attach epoxy storage"). This is good practice — maintain this pattern.
