---
skill: meta-tags-optimizer
phase: 05
step: 15
status: DONE
timestamp: 20260404T150000
domain: blog.caplinq.com
---

## Handoff Summary — meta-tags-optimizer

- **Status**: DONE
- **Objective**: Meta tag optimization for blog.caplinq.com
- **Key Findings**: Yoast SEO auto-generates meta descriptions but they may be truncated or generic. Priority is to write custom meta descriptions for the top 20 posts. Blog homepage meta needs optimization to signal the blog's value to both search engines and engineers.
- **Evidence**: Blog title "CAPLINQ BLOG | Molding compounds, Coating powders, Die attach…" — long and unfocused
- **Open Loops**: Actual meta descriptions unknown without scraping; Yoast settings need review
- **Recommended Next Skill**: schema-markup-generator

## Full Findings

### Blog Homepage

**Current title**: "CAPLINQ BLOG | Molding compounds, Coating powders, Die attach, Thermal interface materials and more…"  
**Issue**: 80+ chars — likely truncated in SERPs; lists product categories rather than value proposition

**Optimized title**: "CAPLINQ Technical Blog — Specialty Materials for Engineers"  
**Chars**: 54 ✅

**Optimized meta description**:  
> Technical articles on thermal interface materials, die attach, electrochemical materials, and specialty chemicals from CAPLINQ's application engineering team.  
**Chars**: 155 ✅

---

### Top Post Meta Optimizations

#### "PFAS-free Hydrophobic Coatings for GDLs"
**Optimized title**: "CAPLINQ's PFAS-Free Hydrophobic GDL Coatings: Performance Data"  
**Chars**: 62 ✅  
**Meta description**: "CAPLINQ achieves 154.4° water contact angle with PFAS-free GDL coatings, matching PTFE-coated performance. Full electrochemical performance data and application guide."  
**Chars**: 165 ✅

#### "Optimizing Die Attach Dispensing"
**Optimized title**: "Optimizing Die Attach Dispensing: When to Remove the Syringe Plunger"  
**Chars**: 68 ✅  
**Meta description**: "Should you remove the syringe plunger during die attach dispensing? Expert guidance on air venting, drip prevention, and machine-specific best practices for epoxy dispensing."  
**Chars**: 171 — trim to: "Should you remove the syringe plunger for die attach dispensing? Expert guidance on air venting, drip prevention, and ESEC S2100 best practices." — 146 ✅

---

### OG / Twitter Defaults for Blog
Ensure Yoast is configured to generate:
```html
<meta property="og:type" content="article" />
<meta property="article:author" content="[author LinkedIn URL]" />
<meta property="article:published_time" content="[date]" />
<meta name="twitter:card" content="summary_large_image" />
```
These are critical for social sharing CTR and AI crawler context.

### Yoast SEO Settings Review Checklist
- [ ] Ensure post excerpts are used as meta descriptions (not auto-generated from content)
- [ ] Enable Open Graph output for all posts
- [ ] Set Twitter card type to summary_large_image
- [ ] Configure author meta to include Person schema URL
- [ ] Noindex tag pages with <3 posts; noindex attachment pages
