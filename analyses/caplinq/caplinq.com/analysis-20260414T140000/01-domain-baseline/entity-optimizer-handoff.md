---
skill: entity-optimizer
phase: 01
step: 1
status: DONE
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier1_webfetch
---

## Handoff Summary — entity-optimizer

- **Status**: DONE
- **Objective**: Establish canonical entity profile for CAPLINQ Corporation
- **Key Findings**: CAPLINQ is a specialty chemicals distributor founded in 2006 with ~62 employees across 3 continents. ISO 9001 certified. Dual business model: Channel Market Partner + own-brand manufacturer. Strong B2B positioning in semiconductor, eMobility, and renewable energy markets.
- **Evidence**: Homepage, About page, Crunchbase, LinkedIn company profile
- **Open Loops**: None
- **Maps to**: CORE Exp01-Exp10 (Experience), Ept01-Ept10 (Expertise), A01-A10 (Authoritativeness)
- **Recommended Next Skill**: citation-baseline (Step 1.5)

## Entity Profile

### Core Identity
| Field | Value |
|-------|-------|
| Legal Name | CAPLINQ Corporation |
| Founded | 2006 |
| Headquarters | Industrieweg 15E, 1566JN Assendelft, The Netherlands |
| Employees | ~62 (as of 2026) |
| Industry | Specialty Chemicals Distribution |
| Certifications | ISO 9001 |

### Global Presence
| Entity | Location |
|--------|----------|
| CAPLINQ Europe BV | Netherlands (HQ) |
| CAPLINQ Americas, Inc. | Michigan, USA |
| CAPLINQ Corporation | Ottawa, Canada |
| CAPLINQ China | Shenzhen, China |
| CAPLINQ Philippines, Inc. | Metro Manila, Philippines |
| Krayden (M) Sdn. Bhd. | Penang, Malaysia |

### Business Model
CAPLINQ operates a dual model:
1. **Channel Market Partner**: Acts as European market extension for specialty chemicals suppliers
2. **Own-Brand Manufacturer**: Develops, manufactures, and markets niche high-value products

### Target Markets
- Semiconductors (including 5G)
- eMobility / Electric Vehicles
- Renewable Energy (fuel cells, electrolyzers)
- Power Distribution
- Electronics Assembly
- Aerospace

### Product Categories (16 categories, 104 URLs)
1. Adhesives & Sealants
2. Coatings & Powders
3. Die Attach Materials
4. Electrochemical Materials
5. Electronics Assembly Adhesives & Inks
6. Encapsulants & Underfills
7. Fine & Specialty Chemicals
8. Molding Compounds
9. Semiconductor Mold Maintenance
10. Soldering Materials
11. Specialty Tapes & Films
12. Surface Treatments
13. Thermal Interface Materials
14. Conductive Plastics
15. EMI Shielding Materials
16. Anti-static Products

### Proprietary Brands
- CHEMLINQ (specialty chemicals)
- LINQSOL (solder materials)
- LINQCELL (electrochemical)
- LINQBOND (adhesives)
- OPTOLINQ (optoelectronics)
- LINQALLOY (alloys)
- LINQSTAT (anti-static)
- SMARTLINQ (smart materials)
- LINQSIL (silicones)
- LINQTAPE (specialty tapes)

### Hero Keywords (derived from products + market positioning)
1. thermal interface materials
2. die attach materials
3. ion exchange membranes
4. polyimide tape
5. REACH only representative
6. epoxy molding compounds
7. conformal coatings
8. conductive adhesives
9. fuel cell components
10. semiconductor packaging materials

### Key Clients/Partners (visible on site)
Intel, Apple, Bosch, Honeywell, NXP, Broadcom

### Value Propositions
1. "Products that Perform" — engineered specialty materials
2. "Knowledge that Serves" — technical expertise and support
3. "Service that Delivers" — global distribution network

### Digital Presence
| Platform | Status |
|----------|--------|
| Website | caplinq.com (main) + blog.caplinq.com |
| LinkedIn | Active company page |
| Blog | ~1-2 posts/week, multiple authors |
| llms.txt | Missing (404) |
| Schema Markup | Not detected on homepage |

### AI Discoverability Issues
- **llms.txt**: Returns 404 — no AI-specific content guidance
- **robots.txt**: No AI crawler directives (GPTBot, Claude-Web not addressed)
- **Schema**: No JSON-LD structured data on homepage
- **Knowledge Graph**: Not visible in search results

## CORE-EEAT Dimension Scores (Entity-Level)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Experience (Exp) | 70 | 20+ years in market, diverse product portfolio |
| Expertise (Ept) | 75 | Technical blog content, ISO certification, specialized products |
| Authoritativeness (A) | 55 | Major clients shown but limited third-party citations |
| Trustworthiness (T) | 70 | ISO 9001, established global presence, professional site |

## Recommendations

### P0 — Critical
1. Create `llms.txt` file with company overview, products, and citation preferences
2. Add Organization schema markup to homepage with sameAs links
3. Add Product schema to category pages

### P1 — High Priority
4. Add AI crawler permissions in robots.txt (GPTBot, Claude-Web, Bingbot)
5. Build Knowledge Panel presence via Wikidata entity creation
6. Add author schema to blog posts

### P2 — Medium Priority
7. Add FAQ schema to product pages
8. Create industry-specific landing pages optimized for AI queries
9. Build backlinks from industry publications for entity authority
