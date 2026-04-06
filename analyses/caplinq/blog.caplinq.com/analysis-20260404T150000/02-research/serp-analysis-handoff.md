---
skill: serp-analysis
phase: 02
step: 5
status: DONE
timestamp: 20260404T150000
domain: blog.caplinq.com
---

## Handoff Summary — serp-analysis

- **Status**: DONE
- **Objective**: SERP analysis for blog.caplinq.com content types
- **Key Findings**: Blog content targets low-competition long-tail queries where featured snippets and PAA boxes are achievable. The PFAS-free GDL post targets an AI Overview opportunity — it's original research that AI systems will want to cite for hydrogen/electrolyzer queries. Die attach posts compete primarily with manufacturer PDFs/datasheets, where indexable HTML content has a ranking advantage.
- **Evidence**: Blog post content analysis, known SERP patterns for B2B technical content
- **Open Loops**: Live SERP checks not possible in Tier 1
- **Recommended Next Skill**: content-gap-analysis

## Full Findings

### SERP Patterns for Blog Target Queries

#### "die attach dispensing optimization" (Ultra-long-tail)
- SERP: Likely manufacturer PDFs, forum posts, sparse indexable content
- CAPLINQ Opportunity: HIGH — readable HTML post with practical guidance outranks PDFs for this intent
- SERP Features: Featured Snippet achievable (step-by-step format exists in post)
- Format recommendation: Add numbered process steps with schema HowTo markup

#### "PFAS-free gas diffusion layer" (Emerging topic)
- SERP: Academic papers, regulatory documents, thin commercial content
- CAPLINQ Opportunity: VERY HIGH — only distributor with original GDL coating R&D published
- SERP Features: AI Overview very likely (original data + emerging regulatory topic)
- Format recommendation: Add definition + quotable statement at top; FAQPage schema

#### "carbon paper vs carbon cloth GDL" (Informational)
- SERP: Academic comparisons, manufacturer spec sheets
- CAPLINQ Opportunity: HIGH — neutral comparison from distributor perspective fills gap
- SERP Features: Featured Snippet (comparison table format)
- Format recommendation: Add explicit comparison table; add FAQPage schema

#### "sapphire substrates LED manufacturing" (Niche)
- SERP: Academic + manufacturer content dominant
- CAPLINQ Opportunity: MEDIUM — alumina/sapphire blog post targets niche engineers
- SERP Features: Limited; no strong AI Overview signal

### AI Overview Opportunities

| Query | AI Overview Likelihood | Blog Post Exists | Action |
|-------|----------------------|-----------------|--------|
| "what is a gas diffusion layer" | High | Indirect | Create dedicated definition post |
| "PFAS regulations fuel cell materials" | High | Yes (partial) | Add FAQ schema to existing post |
| "die attach dispensing best practices" | Medium | Yes | Add HowTo schema + summary box |
| "types of die attach materials" | Medium | Partial | Create dedicated comparison post |
