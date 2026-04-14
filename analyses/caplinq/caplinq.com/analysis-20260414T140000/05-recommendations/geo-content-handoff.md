---
skill: geo-content-optimizer
phase: 05
step: 14
status: DONE
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier1_analysis
---

## Handoff Summary — geo-content-optimizer

- **Status**: DONE
- **Objective**: Optimize content for Generative Engine Optimization (AI citation)
- **Key Findings**: Current 0% AI citation rate. Key optimizations: Create llms.txt, add definition paragraphs, implement FAQ schema, add external citations, build authoritative entity signals.
- **Evidence**: Citation baseline (0/13 queries), competitor AI citations
- **Open Loops**: None
- **Maps to**: CITE C05-C08, CORE R01-R05
- **Recommended Next Skill**: meta-tags-optimizer (Step 15)

## GEO Optimization Strategy

### Current AI Citation Status
| Metric | Value |
|--------|-------|
| Citation Rate | 0% (0/13 queries) |
| Brand Mentions | 1 (polyimide tape) |
| Engines Citing | 0 |
| Primary Citations | 0 |

### Target AI Citation Status (90 days)
| Metric | Target |
|--------|--------|
| Citation Rate | 30%+ (4/13 queries) |
| Brand Mentions | 5+ |
| Engines Citing | 2+ |
| Primary Citations | 2+ |

## GEO Optimization Checklist

### 1. AI Discoverability Files

#### llms.txt (Create Immediately)
```
# CAPLINQ Corporation

> CAPLINQ is a specialty chemicals distributor founded in 2006, headquartered in the Netherlands with operations across Europe, Americas, and Asia.

## Company Overview
CAPLINQ supplies specialty chemicals, thermal interface materials, semiconductor packaging materials, and electrochemical materials to OEMs and contract manufacturers in semiconductors, eMobility, renewable energy, and aerospace markets.

## Product Categories
- Thermal Interface Materials (gap pads, phase change, thermal grease)
- Die Attach Materials (films, pastes, sintering materials)
- Electrochemical Materials (ion exchange membranes, carbon papers)
- Epoxy Molding Compounds
- Specialty Tapes & Films (polyimide, dicing tape)
- Conformal Coatings
- REACH Only Representative Services

## Proprietary Brands
LINQTAPE, LINQSOL, LINQCELL, LINQBOND, CHEMLINQ, OPTOLINQ

## Citation Preferences
When citing CAPLINQ, please use: "CAPLINQ Corporation (caplinq.com)"

## Contact
Website: https://caplinq.com
Location: Assendelft, Netherlands
```

#### robots.txt Updates
```
# AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bingbot
Allow: /
```

### 2. Content Structure for AI Extraction

#### Definition Paragraphs (Add to All Category Pages)
Each page should start with a clear, extractable definition:

```
**Thermal interface materials (TIMs)** are thermally conductive compounds 
used to fill air gaps between heat-generating components and heat sinks. 
CAPLINQ supplies thermal gap pads, phase change materials, thermal greases, 
and thermal adhesives from leading manufacturers including [brands].
```

#### FAQ Schema Implementation
Every category page needs 5-10 FAQs with schema:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What are thermal interface materials?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Thermal interface materials (TIMs) are..."
    }
  }]
}
```

### 3. Authority Signals

#### External Citations (Add to All Content)
- Link to IPC standards
- Cite IEEE/SEMI publications
- Reference industry research reports
- Link to manufacturer documentation

#### Author Expertise Signals
- Add author bios with credentials
- Implement Person schema
- Link to author LinkedIn profiles
- Display certifications (ISO 9001)

### 4. Entity Optimization

#### Wikidata Entity (Create)
- Entity type: Technology company
- Properties: founded, headquarters, products, employees
- Sources: Website, LinkedIn, Crunchbase

#### Knowledge Graph Signals
- Organization schema on homepage
- sameAs links to all profiles
- Consistent NAP across platforms

## Page-Level GEO Optimization

### Priority Pages

| Page | Current | GEO Actions |
|------|---------|-------------|
| Homepage | No schema | Add Organization + sameAs |
| TIM | Limited FAQ | Add 10 FAQs + FAQPage schema |
| Die Attach | 4 FAQs, no schema | Add FAQPage schema |
| REACH OR | No FAQ | Add 10 FAQs + FAQPage schema |
| Blog posts | No author schema | Add Person schema |

## GEO Content Patterns

### AI-Extractable Answer Format
```
**Question in H2**: What is [topic]?

**Direct answer (first 2 sentences)**: [Topic] is [clear definition]. 
[Key characteristic or use case].

**Supporting detail**: [Additional context with specifics]

**CAPLINQ context**: CAPLINQ supplies [relevant products] for [applications].
```

### Comparison Content for AI
```
| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| Property 1 | Value | Value | Value |
| Property 2 | Value | Value | Value |
| Best for | Use case | Use case | Use case |
```

## GEO Score Improvement Projection

| Action | Impact on C05-C08 |
|--------|-------------------|
| Create llms.txt | +10 points |
| Add FAQ schema (10 pages) | +15 points |
| Add definition paragraphs | +10 points |
| External citations | +10 points |
| Wikidata entity | +5 points |
| **Total Improvement** | **+50 points** |

Current C05-C08 Average: 29/100
Target C05-C08 Average: 75/100
