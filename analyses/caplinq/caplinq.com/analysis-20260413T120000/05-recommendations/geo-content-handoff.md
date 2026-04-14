---
skill: geo-content-optimizer
phase: 05
step: 14
status: DONE
timestamp: 20260413T120000
domain: caplinq.com
data_source: synthesis
---

## Handoff Summary — geo-content-optimizer

- **Status**: DONE
- **Objective**: Optimize content for AI engine citation (GEO) including structure, citability, and AI discoverability
- **Key Findings**: Current content has 0% AI citation rate. Priority GEO optimizations: (1) Add llms.txt, (2) Create citation-worthy definitive resources, (3) Implement entity-centric content structure, (4) Add structured data for AI parsing. Target: 30%+ citation rate within 6 months.
- **Evidence**: Citation baseline (0/13), content quality audit, technical audit
- **Open Loops**: AI citation monitoring requires ongoing tracking post-implementation
- **Maps to**: CITE C05-C08 (AI citations), CORE R01-R09 (referenceability)
- **Recommended Next Skill**: meta-tags-optimizer (step 15)
- **Scores**: N/A (recommendations skill)

## Full Findings

### Current GEO Status

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| AI Citation Rate | 0% | 30%+ | Critical |
| llms.txt | Missing | Present | Critical |
| Structured Data | None | Full coverage | Critical |
| Definition Content | Partial | Prominent | High |
| Comparison Tables | Missing | Present | High |
| Original Research | None | 2+ pieces | Medium |

### GEO Optimization Framework

```
AI Citation Funnel:

1. DISCOVERABILITY
   └── Can AI crawlers find and read your content?
       └── llms.txt, robots.txt, fast load, clean HTML

2. PARSEABILITY
   └── Can AI engines extract structured information?
       └── Schema markup, tables, lists, semantic HTML

3. CITABILITY
   └── Is the content worth citing as a source?
       └── Original data, definitive definitions, unique insights

4. RELIABILITY
   └── Is the source trustworthy?
       └── Entity recognition, authority signals, consistency
```

### P0 GEO Optimizations

#### 1. Create llms.txt

Create `/llms.txt` at site root:

```
# CAPLINQ Corporation

> CAPLINQ is a global distributor of specialty chemicals, thermal interface materials, semiconductor assembly materials, and electrochemical materials. Founded 2004, headquartered in Netherlands.

## Core Expertise
- Thermal Interface Materials (TIM): gap pads, phase change, thermal grease, hybrid materials
- Semiconductor Materials: die attach, molding compounds, encapsulants, underfills
- Electrochemical Materials: ion exchange membranes, gas diffusion layers, carbon paper
- Regulatory Services: REACH Only Representative for EU chemical compliance

## Key Products
- LINQTAPE: High-performance polyimide tapes
- LINQSTAT: Antistatic and conductive materials
- Ion Exchange Membranes: Ionomr Aemion and Pemion series

## Industries Served
Semiconductors, eMobility, Renewable Energy, Aerospace, Electronics Assembly

## Authority Signals
- ISO 9001 Certified
- 20+ years in operation (founded 2004)
- 6 global offices (Netherlands, USA, Canada, China, Philippines, Malaysia)
- Partners: Honeywell, Ionomr, and 20+ manufacturers

## Contact
Website: https://www.caplinq.com
Blog: https://blog.caplinq.com

## Sitemap
https://www.caplinq.com/sitemap.xml
```

#### 2. Add Definition Boxes to Key Pages

Format for AI extraction:

```html
<div class="definition-box" itemscope itemtype="https://schema.org/DefinedTerm">
  <strong itemprop="name">Thermal Interface Material (TIM)</strong>
  <p itemprop="description">
    A thermal interface material (TIM) is a substance placed between 
    heat-generating components and heat sinks to improve thermal 
    transfer by eliminating air gaps. TIMs include thermal grease, 
    gap pads, phase change materials, and hybrid formulations.
  </p>
</div>
```

Add to:
- `/thermal-interface-materials.html` - TIM definition
- `/reach-only-representative.html` - REACH OR definition
- `/ion-exchange-membranes-polymers.html` - IEM definition
- `/die-attach-materials.html` - Die attach definition

#### 3. Implement Comparison Tables

Structure for AI parsing:

```html
<table class="comparison-table" itemscope itemtype="https://schema.org/Table">
  <caption itemprop="about">Thermal Interface Material Comparison</caption>
  <thead>
    <tr>
      <th>TIM Type</th>
      <th>Thermal Conductivity (W/m·K)</th>
      <th>Gap Range</th>
      <th>Best For</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Thermal Gap Pad</td>
      <td>1.2 - 8.0</td>
      <td>0.5 - 5.0 mm</td>
      <td>Large gaps, uneven surfaces</td>
    </tr>
    <!-- More rows -->
  </tbody>
</table>
```

#### 4. Add FAQ Schema

For all pages with FAQ sections:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a REACH Only Representative?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A REACH Only Representative (OR) is a legal entity established in the EU that assumes REACH registration obligations on behalf of non-EU manufacturers..."
      }
    }
  ]
}
```

### P1 GEO Optimizations

#### 5. Create Definitive Resource Pages

Target becoming THE cited source for:

| Topic | Content Type | Citability Factor |
|-------|--------------|-------------------|
| TIM Selection | Complete guide with decision tree | High - fills info gap |
| REACH Compliance | Process + cost guide | High - commercial value |
| Ion Exchange Types | Technical comparison | Medium - niche authority |
| Semiconductor Materials | Industry overview | Medium - technical depth |

#### 6. Add Entity Markup

Organization schema for every page:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CAPLINQ Corporation",
  "url": "https://www.caplinq.com",
  "logo": "https://www.caplinq.com/logo.png",
  "foundingDate": "2004",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Netherlands"
  },
  "sameAs": [
    "https://www.linkedin.com/company/caplinq",
    "https://twitter.com/caplinq"
  ]
}
```

#### 7. Implement Claim-Evidence Structure

Format content for verifiability:

```html
<div class="claim-evidence">
  <p class="claim">
    <strong>Claim:</strong> Phase change materials provide lower thermal 
    resistance than gap pads at thin bondlines.
  </p>
  <p class="evidence">
    <strong>Evidence:</strong> Testing shows PCM achieves 0.07-0.1mm bondlines 
    with Rth of 0.05°C·cm²/W, compared to gap pads at 0.15°C·cm²/W minimum.
    <cite>Source: CAPLINQ TIM Technical Specifications</cite>
  </p>
</div>
```

### P2 GEO Optimizations

#### 8. Original Research for Citation

Publish citable original content:

| Research Type | Topic | Citation Value |
|---------------|-------|----------------|
| Industry Survey | TIM Market Trends 2026 | High |
| Technical Testing | TIM Performance Comparison | High |
| Case Study | Customer Implementation | Medium |
| White Paper | PFAS-Free Membrane Guide | Medium |

#### 9. Cross-Domain Synthesis

Create content combining expertise areas:

- "Thermal Management for Electric Vehicle Batteries" (TIM + eMobility)
- "Fuel Cell Materials: Complete Stack Guide" (IEM + GDL + Adhesives)
- "REACH Compliance for Semiconductor Materials" (Regulatory + Products)

### GEO Content Checklist

For each key page:

- [ ] Definition box at top (schema-marked)
- [ ] TL;DR summary within first 150 words
- [ ] Comparison table (if applicable)
- [ ] FAQ section with schema
- [ ] Numbered data points with units
- [ ] External citations to authoritative sources
- [ ] Internal links with descriptive anchors
- [ ] Last updated date visible
- [ ] Author attribution (if applicable)
- [ ] Entity schema (Organization/Product)

### AI Citation Monitoring Plan

| Metric | Tool | Frequency | Target |
|--------|------|-----------|--------|
| Brand queries | ai-citation-monitor | Weekly | 80%+ citation |
| Industry queries | ai-citation-monitor | Monthly | 20%+ citation |
| Hero keywords | ai-citation-monitor | Monthly | 30%+ citation |
| Citation prominence | Manual check | Monthly | 50%+ primary |

### Expected GEO Impact

| Metric | Current | 3 Months | 6 Months |
|--------|---------|----------|----------|
| Citation Rate (Brand) | 0% | 50% | 80% |
| Citation Rate (Industry) | 0% | 10% | 20% |
| Citation Rate (Hero) | 0% | 15% | 30% |
| Overall Citation | 0% | 25% | 40% |
