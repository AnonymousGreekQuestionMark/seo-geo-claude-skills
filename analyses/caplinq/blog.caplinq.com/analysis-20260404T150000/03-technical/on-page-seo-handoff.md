---
skill: on-page-seo-auditor
phase: 03
step: 8
status: DONE
timestamp: 20260404T150000
domain: blog.caplinq.com
---

## Handoff Summary — on-page-seo-auditor

- **Status**: DONE
- **Objective**: On-page SEO audit for key blog posts
- **Key Findings**: Blog posts have strong heading structure, named authors, and technical depth. On-page weakness is relatively short post length (1,000 words typical — shorter than pillar content competitors), lack of FAQPage/HowTo schema, and meta description optimization likely handled by Yoast auto-generation. The PFAS-free GDL post is the standout — original data makes it a natural AI citation candidate.
- **Evidence**: Two full posts analyzed (die attach dispensing ~1,034 words; PFAS-free GDL ~976 words), schema confirmed, author attribution confirmed
- **Open Loops**: Meta description content unknown; image alt text quality unknown for most posts
- **Recommended Next Skill**: internal-linking-optimizer
- **Scores**: On-page average score: **7.5/10** (strong author + schema; weak on length + FAQ schema)

## Full Findings

### Post-Level Audit

#### Post 1: "Optimizing Die Attach Dispensing" (George Kountardas)
| Element | Score | Finding |
|---------|-------|---------|
| Title tag | 7/10 | Descriptive; could include keyword variant |
| Author attribution | 10/10 | Named author + Person schema + bio ✅ |
| Schema | 7/10 | Article + Person confirmed; missing HowTo |
| Content depth | 6/10 | 1,034 words; covers topic but could be deeper |
| Heading structure | 8/10 | Clear H1 + 5 H2s with logical flow |
| Internal links | 7/10 | Links to 3 related posts + 3 product pages ✅ |
| FAQ/GEO signals | 5/10 | Implied Q&A structure; no explicit FAQ section |
| Images | 6/10 | 1 featured + 3 diagrams; alt text quality unknown |

**Post 1 Overall: 7/10**

#### Post 2: "PFAS-free Hydrophobic Coatings for GDLs" (Rose Anne Acedera)
| Element | Score | Finding |
|---------|-------|---------|
| Title tag | 9/10 | "CAPLINQ Develops…" — brand + topic + uniqueness ✅ |
| Author attribution | 10/10 | Named technical engineer + Person schema ✅ |
| Original data | 10/10 | Water contact angle (154.4° vs 153.8°); HFR 1.8 kΩ ✅ |
| Schema | 7/10 | Article + Person confirmed; missing FAQPage |
| Content depth | 7/10 | ~976 words — original research but could elaborate more |
| Heading structure | 9/10 | 6 meaningful H2s covering background → outlook |
| Internal links | 8/10 | 4 blog links + 5 product links ✅ |
| GEO signals | 8/10 | Quotable data; definitions; mechanisms explained |
| External links | 6/10 | PFAS regulation links; could add more authoritative citations |

**Post 2 Overall: 8.5/10**

### Priority On-Page Fixes Across Blog

1. **P0**: Add FAQPage JSON-LD to top 20 posts with existing FAQ content
2. **P0**: Add HowTo JSON-LD to process-describing posts (die attach dispensing, dispensing optimization)
3. **P1**: Extend post length for thin posts (<800 words) on important keywords to 1,500+ words
4. **P1**: Add external citations to industry standards (IPC, JEDEC, ASTM) in technical posts
5. **P1**: Add "Key Takeaways" box at top of each post — GEO signal + UX improvement
6. **P2**: Audit and optimize all image alt text (especially featured images)
7. **P2**: Add author credential display on every post (jobTitle, company, expertise area)
