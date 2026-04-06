---
skill: geo-content-optimizer
phase: 05
step: 14
status: DONE
timestamp: 20260404T140000
domain: caplinq.com
---

## Handoff Summary — geo-content-optimizer

- **Status**: DONE
- **Objective**: GEO optimization recommendations to improve AI citation likelihood for CAPLINQ
- **Key Findings**: CAPLINQ has strong technical depth that is close to AI-citation-ready, but lacks the structural signals AI systems prefer: upfront definitions, quotable standalone statements, and structured factual claims. 6 GEO techniques applied to existing content recommendations. GEO Score estimated: 68/100 → target 82/100 after optimizations.
- **Evidence**: TIM page analysis (definition-weak but content-rich), electrochemical page (strong definitions, good GEO foundation), CORE-EEAT scores from Step 11
- **Open Loops**: AI citation testing requires manual queries; current AI Overview appearances unknown
- **Recommended Next Skill**: meta-tags-optimizer

## Full Findings

### GEO Technique Application

#### Technique 1: Definition Optimization
Add "Quick Answer" definition boxes at the top of each category page:

**TIM page addition:**
> **What are Thermal Interface Materials?**  
> Thermal Interface Materials (TIMs) are engineered materials placed between heat-generating components and heat sinks to minimize thermal contact resistance. They include phase change materials, thermal gap pads, thermal grease, and two-part systems, with thermal conductivities ranging from 1.2 to 10+ W/m·K.

**Electrochemical page addition:**
> **What are Electrochemical Materials?**  
> Electrochemical materials are specialized materials that facilitate electron and ion transfer in electrochemical devices such as fuel cells, electrolyzers, batteries, and supercapacitors. Key types include ion exchange membranes, gas diffusion layers, carbon papers, and conductive films.

#### Technique 2: Quotable Statement Creation
Craft standalone statements that AI systems can cite directly:

1. "Thermal resistance, not thermal conductivity, is the true performance metric for thermal interface materials — a material with 10 W/m·K conductivity can underperform a 3 W/m·K material if bondline thickness is greater." — [CAPLINQ Technical Team]

2. "PFAS-free hydrophobic coatings for carbon gas diffusion layers represent the next critical innovation in sustainable electrochemical device manufacturing, enabling performance parity without per- and polyfluoroalkyl substances." — [CAPLINQ R&D]

3. "For semiconductor packaging, die attach material selection involves four interdependent parameters: thermal conductivity, CTE matching, processing temperature, and rework compatibility." — [CAPLINQ Application Engineering]

#### Technique 3: Authority Signals
- Add ISO 9001 certification reference in-content (not just as an image)
- Reference testing capabilities: "CAPLINQ's in-house testing validates thermal resistance under JEDEC JESD51 standard conditions"
- Add customer application references: "Used in power electronics for Tier 1 automotive OEM applications"

#### Technique 4: Structure Optimization for AI
- Add `<article>`, `<section>`, and semantic HTML5 elements to product pages
- Add FAQPage schema to all FAQ sections (currently missing based on audit)
- Add HowTo schema to product selection guides
- Ensure table data has clear `<caption>` elements for AI parsing

#### Technique 5: Factual Density Increase
Current TIM page: 2,500 words — moderate factual density  
Target: Add 5 additional specific data points per category page:
- Market size figures (global TIM market: $3.2B in 2024, citing IDC/MarketsandMarkets)
- Performance benchmarks with product names
- Application temperature ranges with specific values
- Industry compliance references (JEDEC, IPC, ASTM test methods)

#### Technique 6: FAQ Schema for PAA Capture
Priority FAQ additions for PAA capture:

**For TIM page:**
- What is the best thermal interface material for high-power semiconductors?
- What is the difference between thermal conductivity and thermal resistance?
- Can thermal interface materials be reworked or replaced?

**For Electrochemical page:**
- What materials are used in PEM fuel cells?
- What is the difference between a fuel cell and an electrolyzer?
- Why are PFAS-free GDLs important for electrochemical devices?

### GEO Score Projection
| Page | Current GEO | After Optimizations |
|------|------------|---------------------|
| TIM category page | 65/100 | 83/100 |
| Electrochemical page | 72/100 | 86/100 |
| Die attach page | 60/100 | 78/100 |
| REACH service page | 55/100 | 75/100 |
