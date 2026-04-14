---
skill: meta-tags-optimizer
phase: 05
step: 15
status: DONE
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier1_analysis
---

## Handoff Summary — meta-tags-optimizer

- **Status**: DONE
- **Objective**: Optimize title tags, meta descriptions, and Open Graph tags
- **Key Findings**: Meta descriptions may be missing or generic on key pages. Title tags appear functional but could be more keyword-optimized. OG tags need verification for social sharing.
- **Evidence**: WebFetch analysis showed meta description not detected on homepage
- **Open Loops**: None
- **Maps to**: CORE O01 (Title tags), O02 (Meta descriptions)
- **Recommended Next Skill**: schema-markup-generator (Step 16)

## Meta Tag Optimization

### Priority Pages

#### Homepage (caplinq.com)
**Current Title**: "Specialty chemicals, plastics, order fulfillment, REACH Only Representative, conductive plastics"
**Issue**: Too long, keyword-stuffed
**Recommended**: "CAPLINQ | Specialty Chemicals & Materials Supplier | Europe, Americas, Asia"
**Length**: 67 characters

**Current Meta Description**: Not detected / possibly missing
**Recommended**: "CAPLINQ supplies thermal interface materials, die attach compounds, and semiconductor packaging materials to OEMs worldwide. ISO 9001 certified. Request samples."
**Length**: 158 characters

#### Thermal Interface Materials
**Recommended Title**: "Thermal Interface Materials | Gap Pads, Greases, Phase Change | CAPLINQ"
**Length**: 64 characters

**Recommended Meta**: "Shop thermal interface materials including gap pads, thermal greases, and phase change materials. Technical support from CAPLINQ's specialists. Request quote."
**Length**: 160 characters

#### Die Attach Materials
**Recommended Title**: "Die Attach Materials | Films, Pastes & Sintering Compounds | CAPLINQ"
**Length**: 64 characters

**Recommended Meta**: "High-performance die attach materials for semiconductor packaging. Films, pastes, and sintering compounds from leading manufacturers. Technical datasheets available."
**Length**: 163 characters

#### REACH Only Representative
**Recommended Title**: "REACH Only Representative Services | EU Compliance | CAPLINQ"
**Length**: 58 characters

**Recommended Meta**: "CAPLINQ provides REACH Only Representative (OR) services for non-EU manufacturers. Expert EU chemical compliance since 2006. Get a compliance consultation."
**Length**: 158 characters

### Meta Tag Templates

#### Product Category Pages
```
Title: [Primary Keyword] | [Secondary Keyword] | CAPLINQ
Length: 50-60 characters

Meta: [Action verb] [primary keyword] including [product types]. 
[Value prop]. [CTA].
Length: 150-160 characters
```

#### Blog Posts
```
Title: [Question/Topic] | CAPLINQ Blog
Length: 50-60 characters

Meta: [Summary of answer/content] [Key takeaway]. 
Read the full guide from CAPLINQ's experts.
Length: 150-160 characters
```

### Open Graph Tags

#### Required OG Tags (All Pages)
```html
<meta property="og:title" content="[Page Title]">
<meta property="og:description" content="[Meta description]">
<meta property="og:image" content="https://caplinq.com/images/og-default.jpg">
<meta property="og:url" content="[Canonical URL]">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CAPLINQ">
```

#### Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Page Title]">
<meta name="twitter:description" content="[Meta description]">
<meta name="twitter:image" content="https://caplinq.com/images/og-default.jpg">
```

## Meta Tag Audit Checklist

| Page | Title OK | Meta OK | OG OK | Action |
|------|----------|---------|-------|--------|
| Homepage | Partial | Missing? | Unknown | P0 Fix |
| TIM | Check | Check | Unknown | P1 Verify |
| Die Attach | Check | Check | Unknown | P1 Verify |
| REACH OR | OK | Check | Unknown | P2 Verify |

## Implementation Priority

### P0 — Immediate
1. Verify and fix homepage meta description
2. Implement OG tags site-wide
3. Shorten homepage title tag

### P1 — This Week
4. Optimize TIM page meta tags
5. Optimize die attach page meta tags
6. Add OG images for main product pages

### P2 — This Month
7. Audit all product category meta tags
8. Optimize blog post meta descriptions
9. Implement Twitter Card tags
