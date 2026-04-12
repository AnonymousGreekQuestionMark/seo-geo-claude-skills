---
skill: keyword-research
phase: 02
step: 2
status: DONE_WITH_CONCERNS
timestamp: 20260412T182500
domain: caplinq.com
data_source: tier1_webfetch
fallbacks_used:
  - "Most category pages return HTTP 410 — analysis based on homepage, services, blog"
---

## Handoff Summary — keyword-research

- **Status**: DONE_WITH_CONCERNS
- **Objective**: Identify keyword opportunities across product categories and industries
- **Key Findings**: CAPLINQ targets highly technical B2B keywords in specialty chemicals and semiconductor materials. Blog has 400+ category tags indicating deep topical coverage. Primary opportunity: "thermal interface materials", "conductive adhesives", "die attach materials". Critical gap: many product category pages return 410 (removed), hurting keyword targeting.
- **Evidence**: Homepage, /services page, blog.caplinq.com (200+ articles), sitemap.xml
- **Open Loops**: Cannot access individual product category pages (/thermal-interface-materials, /adhesives-sealants, /semiconductor-materials all return 410). Keyword volume data requires DataForSEO/Ahrefs API.
- **Maps to**: CORE-EEAT C01-C05 (Content relevance), R01-R05 (Research depth), CITE I01-I03 (Indexability)
- **Recommended Next Skill**: competitor-analysis (Step 3)

## Full Findings

### Primary Keyword Clusters

| Cluster | Keywords | Search Intent | Priority |
|---------|----------|---------------|----------|
| **Thermal Management** | thermal interface materials, TIM suppliers, thermal gap pads, phase change materials, heat transfer fluids | Transactional/Commercial | P0 |
| **Semiconductor Materials** | die attach materials, molding compounds, encapsulants, underfills, solder paste | Transactional/Commercial | P0 |
| **Conductive Materials** | conductive adhesives, conductive polymers, EMI shielding materials | Transactional/Commercial | P0 |
| **REACH Compliance** | REACH only representative, EU chemical compliance, SDS management | Informational/Commercial | P1 |
| **Industry Applications** | semiconductor packaging materials, eMobility materials, aerospace adhesives | Commercial | P1 |

### Long-Tail Keyword Opportunities

| Keyword Pattern | Intent | Content Gap |
|-----------------|--------|-------------|
| "thermally conductive electrically insulating materials" | Informational | Blog covers this |
| "direct-to-chip cooling solutions" | Commercial | Emerging topic |
| "conformal coating defects prevention" | Informational | Blog article exists |
| "die attach paste vs film" | Informational | Comparison content needed |
| "REACH only representative Europe" | Commercial | Service page available |
| "best solder paste for semiconductor" | Transactional | Category page missing |

### Keyword Clusters by Product Category

**1. Thermal Interface Materials**
- thermal grease, thermal paste, thermal pads, gap fillers
- phase change materials, thermal interface material suppliers
- thermal conductivity W/mK specifications

**2. Adhesives & Sealants**
- conductive adhesives, structural adhesives, UV-cure adhesives
- epoxy adhesives, silicone sealants, threadlockers
- aerospace-grade adhesives, medical-grade adhesives

**3. Semiconductor Packaging**
- epoxy molding compounds (EMC), die attach adhesives
- underfill materials, glob top encapsulants
- solder balls, tacky flux, leadframe materials

**4. Electrochemical Materials**
- ion exchange membranes, fuel cell materials
- electrolyzer components, gas diffusion layers

**5. Specialty Tapes & Films**
- polyimide tapes (Kapton alternatives), PTFE tapes
- dicing tapes, thermal release tapes
- conductive films, EMI shielding tapes

### Industry Vertical Keywords

| Industry | Keywords | Content Status |
|----------|----------|----------------|
| Semiconductors | semiconductor packaging, backend processing, wafer processing | Active |
| eMobility | EV battery materials, power electronics, automotive adhesives | Active |
| Renewable Energy | solar panel materials, wind turbine adhesives, fuel cell MEA | Active |
| Aerospace | aerospace-grade tapes, high-temp materials, AS9100 | Limited |
| Data Centers | thermal management, direct liquid cooling, server cooling | Blog coverage |

### Branded Keywords

| Brand | Products | Opportunity |
|-------|----------|-------------|
| LINQTAPE | Polyimide tapes, PTFE tapes | Own brand — optimize |
| LINQSTAT | Conductive polymers | Own brand — optimize |
| LINQBOND | Adhesives | Own brand — optimize |
| CHEMLINQ | Specialty chemicals | Own brand — optimize |
| LINQSOL | Soldering materials | Own brand — optimize |

### Competitor Keyword Gaps (Preliminary)

Based on citation baseline, competitors appearing for target keywords:
- **Henkel** (Bergquist brand) — thermal interface materials
- **3M** — thermal tapes, conductive adhesives
- **Dow** — silicone materials
- **Indium Corporation** — solder paste
- **MacDermid Alpha** — electronics assembly

### Technical SEO Keyword Issues

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| Category pages return 410 | HIGH | Many target keywords have no landing page |
| Blog on subdomain | MEDIUM | Blog content may not pass full authority to main domain |
| No llms.txt | MEDIUM | AI engines cannot discover keyword-optimized content |

### Recommended Keyword Strategy

1. **P0 — Fix 410 errors**: Restore or redirect product category pages
2. **P0 — Target "best X suppliers" queries**: Create comparison/guide content
3. **P1 — Consolidate blog authority**: Consider blog.caplinq.com → caplinq.com/blog
4. **P1 — Long-tail content**: Technical guides for each product category
5. **P2 — Industry pages**: Dedicated landing pages per vertical
