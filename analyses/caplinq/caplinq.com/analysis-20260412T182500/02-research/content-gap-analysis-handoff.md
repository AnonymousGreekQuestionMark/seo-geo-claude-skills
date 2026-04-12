---
skill: content-gap-analysis
phase: 02
step: 5
status: DONE
timestamp: 20260412T182500
domain: caplinq.com
data_source: tier1_webfetch
---

## Handoff Summary — content-gap-analysis

- **Status**: DONE
- **Objective**: Identify content gaps vs competitors and missed keyword opportunities
- **Key Findings**: Major gaps identified: (1) No comparison/buying guides — competitors win "best X" queries, (2) Missing industry vertical pages (automotive, aerospace, medical), (3) No case studies or customer success stories, (4) Blog on subdomain dilutes main domain authority, (5) Multiple category pages return 410 (broken). Content exists but is fragmented and not optimized for commercial intent queries.
- **Evidence**: SERP analysis (Step 4), competitor analysis (Step 3), keyword research (Step 2), sitemap analysis
- **Open Loops**: Detailed content audit requires crawl data (blocked in Tier 1)
- **Maps to**: CORE-EEAT C01-C10 (Content), O01-O10 (Originality), R01-R10 (Research)
- **Recommended Next Skill**: technical-seo-checker (Step 6)

## Full Findings

### Content Gap Matrix

| Content Type | CAPLINQ | Indium | Henkel | Brenntag | Gap |
|--------------|---------|--------|--------|----------|-----|
| Product pages | ✓ (but 410s) | ✓ | ✓ | ✓ | Fix 410s |
| Comparison guides | ✗ | ✓ | ✓ | ✓ | **CRITICAL** |
| Case studies | ✗ | ✓ | ✓ | ✓ | **CRITICAL** |
| Technical blog | ✓ (subdomain) | ✓ | ✓ | ✓ | Consolidate |
| Industry pages | ✗ | ✓ | ✓ | ✓ | **HIGH** |
| Resource library | ✓ | ✓ | ✓ | ✓ | OK |
| FAQ content | ✗ | ✓ | ✓ | ✗ | **MEDIUM** |
| Video content | ✗ | ✓ | ✓ | ✓ | **MEDIUM** |
| Product configurator | ✗ | ✗ | ✓ | ✗ | LOW |
| Multilingual | ✗ | ✓ (11) | ✓ | ✓ | **HIGH** |

### Critical Content Gaps

#### Gap 1: No "Best X" or Comparison Content

**Current State**: CAPLINQ ranks for product pages but not for comparison/buying guide queries.

**Evidence from SERP**:
- "Best thermal interface materials suppliers" → Laird wins
- "Conductive adhesives comparison" → Henkel wins
- "Die attach paste vs film" → No CAPLINQ content

**Recommendation**: Create 5-10 comparison guides:
1. "Thermal Interface Materials: Complete Buying Guide"
2. "Die Attach Materials Comparison: Epoxy vs Silver Sintering vs Film"
3. "Best Conductive Adhesives for Electronics Assembly"
4. "Epoxy Molding Compounds: Selection Guide"
5. "REACH Compliance: Complete Guide for Chemical Importers"

#### Gap 2: Missing Industry Vertical Pages

**Current State**: CAPLINQ mentions serving automotive, aerospace, semiconductor, eMobility — but no dedicated landing pages.

**Competitor Comparison**:
- Brenntag: /industries/automotive/, /industries/electronics/
- Henkel: /industries/automotive/, /industries/aerospace/
- CAPLINQ: ✗ Industry pages return 410

**Recommendation**: Create 5 industry hub pages:
1. /industries/semiconductor/ — materials for backend packaging
2. /industries/automotive/ — automotive adhesives, EV battery materials
3. /industries/aerospace/ — aerospace-grade tapes, high-temp materials
4. /industries/emobility/ — power electronics, battery assembly
5. /industries/renewable-energy/ — solar, wind, fuel cell materials

#### Gap 3: No Case Studies or Social Proof

**Current State**: No visible customer success stories, testimonials, or case studies on main site.

**E-E-A-T Impact**: Missing experience signals — critical for B2B trust.

**Competitor Comparison**:
- Brenntag: Case study library with industry filters
- Indium: Application success stories in blog
- CAPLINQ: Zero case studies found

**Recommendation**: Create 5-8 case studies:
- "How [Semiconductor Manufacturer] Reduced Packaging Defects with CAPLINQ EMC"
- "European Medical Device Company Achieves REACH Compliance with CAPLINQ OR Services"
- "EV Battery Assembly: Thermal Interface Material Selection for [OEM]"

#### Gap 4: Blog on Subdomain Dilutes Authority

**Current State**: Blog lives at blog.caplinq.com (separate subdomain).

**SEO Impact**:
- Links to blog don't pass authority to main domain
- Blog ranks independently, doesn't boost caplinq.com
- Competitors have blog on main domain (/blog/)

**Recommendation**: Migrate blog.caplinq.com → caplinq.com/blog/ with 301 redirects.

#### Gap 5: HTTP 410 Errors on Key Pages

**Current State**: Multiple product category pages return 410:
- /thermal-interface-materials → 410
- /adhesives-sealants → 410
- /semiconductor-materials → 410
- /about → 410
- /industries → 410

**Impact**: Cannot rank for target keywords, broken user journeys.

**Recommendation**: P0 fix — restore or redirect all 410 pages.

### Content Inventory Summary

| Section | Pages Found | Status |
|---------|-------------|--------|
| Homepage | 1 | ✓ Live |
| Product categories | 14+ | ~50% returning 410 |
| Services | 5+ | ✓ Live |
| Blog (subdomain) | 200+ | ✓ Live (separate domain) |
| About/Company | Unknown | 410 |
| Contact | 6 (regional) | ✓ Live |
| Resources | Unknown | Mixed |

### Keyword-to-Content Mapping Gaps

| Target Keyword | Expected Content | Actual Status |
|----------------|------------------|---------------|
| thermal interface materials suppliers | /thermal-interface-materials/ | 410 (BROKEN) |
| conductive adhesives manufacturers | /electrically-conductive-adhesives.html | Live (#7) |
| die attach materials | /die-attach-materials.html | Live (#2) |
| best epoxy molding compounds | Comparison guide | MISSING |
| REACH compliance services | /reach-only-representative.html | Live (#3) |
| automotive adhesives supplier | /industries/automotive/ | 410/MISSING |
| semiconductor packaging materials | Category page | Partial |

### GEO-Specific Content Gaps

| Gap | Impact on AI Citations | Recommendation |
|-----|------------------------|----------------|
| No llms.txt | AI crawlers can't discover content | Create /llms.txt |
| No company overview for AI | Brand queries not answered | Create AI-optimized "About" page |
| Fragmented entity data | AI can't build complete profile | Consolidate entity info on homepage |
| No authoritative lists | Lose "best X" citations | Create definitive guides |

### Content Gap Prioritization

| Priority | Gap | Effort | Impact |
|----------|-----|--------|--------|
| **P0** | Fix 410 errors | Medium | Critical |
| **P0** | Create 3 comparison guides | High | High |
| **P1** | Add 5 case studies | Medium | High |
| **P1** | Create industry vertical pages | High | High |
| **P1** | Migrate blog to main domain | Medium | Medium |
| **P2** | Add FAQ content for PAA | Low | Medium |
| **P2** | Create llms.txt | Low | Medium |
| **P3** | Add video content | High | Low |
| **P3** | Multilingual content | Very High | Medium |
