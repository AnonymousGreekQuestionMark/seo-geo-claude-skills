---
skill: schema-markup-generator
phase: 05
step: 16
status: DONE
timestamp: 20260404T150000
domain: blog.caplinq.com
---

## Handoff Summary — schema-markup-generator

- **Status**: DONE
- **Objective**: Schema markup recommendations for blog.caplinq.com
- **Key Findings**: Blog already has Article + Person + BreadcrumbList schema (strong foundation). Missing: FAQPage, HowTo, and Organization schema. Adding these would significantly increase SERP feature eligibility. Yoast SEO can add some of these via plugins.
- **Evidence**: Schema confirmed on two analyzed posts (Article, Person, WebPage, BreadcrumbList)
- **Open Loops**: FAQPage and HowTo not confirmed on existing posts
- **Recommended Next Skill**: rank-tracker

## Full Findings

### Existing Schema (Confirmed ✅)
- Article (all posts)
- Person (per post, with author)
- BreadcrumbList (all posts)
- WebPage (all posts)
- ImageObject (featured images)

### Missing Schema (Priority Additions)

#### FAQPage — Apply to Posts with Q&A Content

Use Yoast SEO FAQ block (built-in) to automatically generate FAQPage schema:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Should you remove the syringe plunger during die attach dispensing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Removing the syringe plunger benefits systems like the ESEC S2100 by enabling air venting and machine control. Risks include contamination and filler settling in highly filled epoxy systems. Best practice: follow equipment manufacturer guidelines and use suck-back pressure to prevent dripping."
      }
    }
  ]
}
```

**Recommended Yoast Action**: Use "FAQ block" in WordPress post editor for all Q&A sections — Yoast automatically generates FAQPage JSON-LD.

---

#### HowTo — Apply to Process-Describing Posts

For die attach dispensing post:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Remove a Die Attach Syringe Plunger Safely",
  "description": "Best practices for removing syringe plungers during die attach dispensing to prevent contamination and maintain material integrity.",
  "step": [
    {"@type": "HowToStep", "name": "Prepare the dispensing machine", "text": "Ensure the machine is set to proper pressure and temperature for the die attach material."},
    {"@type": "HowToStep", "name": "Remove the plunger", "text": "Slowly remove the plunger to avoid introducing air bubbles. For filled systems, minimize exposure time."},
    {"@type": "HowToStep", "name": "Configure suck-back pressure", "text": "Set suck-back to 5–10 ms to prevent dripping after plunger removal."}
  ]
}
```

---

#### Organization — Link Blog to Parent Entity

Add to blog site header (via Yoast or custom code):

```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "CAPLINQ Technical Blog",
  "url": "https://blog.caplinq.com",
  "publisher": {
    "@type": "Organization",
    "name": "CAPLINQ Corporation",
    "url": "https://www.caplinq.com",
    "sameAs": ["https://www.linkedin.com/company/caplinq"]
  }
}
```

This critical schema links the blog to its parent entity — improving entity resolution and authority consolidation.

### Implementation Priority
1. FAQPage via Yoast FAQ blocks — top 20 posts (immediate; uses built-in tool)
2. Organization/publisher schema on blog header — entity link to main site (1 code change)
3. HowTo schema on process posts — manual addition or Yoast plugin
4. Author page schema enhancement — add jobTitle, worksFor to existing Person schema

### Validation
```
Google Rich Results Test: search.google.com/test/rich-results
Test each post URL after schema additions
```
