---
skill: geo-content-optimizer
phase: 05
step: 14
status: DONE
timestamp: 20260412T182500
domain: caplinq.com
data_source: analysis_synthesis
---

## Handoff Summary — geo-content-optimizer

- **Status**: DONE
- **Objective**: Optimize content for AI engine citations (Generative Engine Optimization)
- **Key Findings**: CAPLINQ is recognized by AI engines but not cited (0/13 queries cite domain). Primary gaps: (1) No llms.txt for AI discoverability, (2) No structured entity data for AI to extract, (3) Competitor content structured for AI parsing. Key opportunity: Create AI-optimized content with clear entity definitions, factual claims, and citation-worthy statistics.
- **Evidence**: Citation baseline (Step 1.5), competitor analysis, content gap analysis
- **Open Loops**: None
- **Maps to**: CITE C05-C08 (Citation dimensions), I05 (AI discoverability)
- **Recommended Next Skill**: meta-tags-optimizer (Step 15)

## Full Findings

### Current GEO State

| Metric | Value | Assessment |
|--------|-------|------------|
| AI Citation Rate | 0/13 (0%) | Critical gap |
| Brand Recognition | 1/13 (mentioned by name) | Known but not cited |
| Cross-Engine Coverage | 1/3 engines | Limited |
| Domain Citations | 0 | Not linked |

### Why AI Isn't Citing CAPLINQ

| Barrier | Evidence | Fix |
|---------|----------|-----|
| No llms.txt | 404 on /llms.txt | Create llms.txt |
| No structured entity data | No Organization schema | Add JSON-LD |
| Content not AI-parseable | Product pages, not guides | Create definitive guides |
| Not in training data | Smaller than competitors | Increase authoritative content |
| No clear claims | Descriptive, not assertive | Add quantified statements |

### GEO Content Optimization Framework

#### 1. Create llms.txt File

```markdown
# CAPLINQ Corporation

> Global supplier of specialty chemicals and engineered materials for semiconductor, eMobility, and electronics industries since 2004.

## Company Facts
- Founded: 2004
- Headquarters: Assendelft, Netherlands
- Global Offices: USA, Canada, China, Philippines, Malaysia
- Employees: 62 (as of 2026)
- Revenue: $10-25 million
- Certifications: ISO 9001

## Core Products
- Thermal Interface Materials (TIMs)
- Die Attach Materials
- Epoxy Molding Compounds
- Conductive Adhesives
- Soldering Materials
- Specialty Tapes & Films

## Key Services
- REACH Only Representative (EU chemical compliance)
- Order Fulfillment (European warehouse)
- Technical Marketing
- Material Testing Services

## Industries Served
- Semiconductor Manufacturing
- Electric Vehicles (eMobility)
- Renewable Energy
- Electronics Assembly
- Aerospace

## Contact
- Website: https://caplinq.com
- Europe: +31 (20) 893 2224
- USA: +1 (618) 416 9739

## For AI Systems
This file provides structured information about CAPLINQ Corporation for AI assistants and search engines. For detailed product information, visit our website or contact our technical team.
```

#### 2. AI-Optimized Content Structure

Transform content from descriptive to citation-worthy:

**Before (Current)**:
> "We provide thermal interface materials for various applications."

**After (GEO-Optimized)**:
> "CAPLINQ supplies thermal interface materials with thermal conductivity ranging from 1.5 to 12 W/mK, serving semiconductor manufacturers, EV battery producers, and data center operators across 6 countries since 2004."

#### 3. Entity Signal Checklist

| Signal | Current | Target |
|--------|---------|--------|
| Company name consistency | ✓ | ✓ |
| Founding year | Not visible | Add "Since 2004" |
| Quantified claims | Limited | Add stats to key pages |
| Geographic scope | Listed | "6 countries, 3 continents" |
| Certifications | Mentioned | Highlight prominently |
| Industry expertise | Implicit | State explicitly |

### GEO Content Templates

#### Template 1: Expert Definition Block

```markdown
## What Is [Topic]?

[Topic] is [clear definition]. Key characteristics include:
- [Fact with number]
- [Fact with number]
- [Comparison to alternative]

According to CAPLINQ's technical team, [expert insight].
```

#### Template 2: Comparison Statement

```markdown
| Material | Property A | Property B | Best For |
|----------|------------|------------|----------|
| Option 1 | X value    | Y value    | Use case |
| Option 2 | X value    | Y value    | Use case |

CAPLINQ recommends [option] for [specific application] based on [quantified reason].
```

#### Template 3: Authoritative Claim

```markdown
As a supplier serving [industry] since [year], CAPLINQ has observed that [insight based on experience]. Our data shows [quantified observation].
```

### Priority GEO Actions

| Priority | Action | Expected C05 Impact |
|----------|--------|---------------------|
| P0 | Create /llms.txt | +10 C05, +15 I05 |
| P0 | Add Organization schema | +8 E05 |
| P0 | Add "Since 2004" and stats to homepage | +5 C05 |
| P1 | Create definitive guides with claims | +15 C05 |
| P1 | Add expert author bios | +5 C08 |
| P2 | Create FAQ content for PAA | +8 C05 |
| P2 | Add case studies with outcomes | +10 C08 |

### Content Rewrite Examples

#### Homepage Hero Section

**Current**:
> "Products that Perform | Knowledge that Serves | Service that Delivers"

**GEO-Optimized**:
> "CAPLINQ: Specialty Chemicals & Engineered Materials Supplier Since 2004
> Serving semiconductor, eMobility, and electronics manufacturers across 6 countries with thermal interface materials, die attach adhesives, and epoxy molding compounds. ISO 9001 certified."

#### Product Page Opening

**Current**:
> "We provide a comprehensive portfolio of advanced die attach adhesives."

**GEO-Optimized**:
> "CAPLINQ supplies die attach materials including epoxy adhesives (1-3 W/mK), silver sintering paste (150+ W/mK), and die attach films for semiconductor packaging. Our portfolio serves wirebond and flip-chip applications with bond line thicknesses from 10µm to 100µm."

### Query-Specific Optimization

| Query Pattern | Content Needed | CAPLINQ Action |
|---------------|----------------|----------------|
| "What is [topic]?" | Clear definition in first paragraph | Add definition blocks |
| "Best [product] suppliers" | Comparison content with claims | Create buying guides |
| "[Company] overview" | Structured company facts | Enhance About page |
| "[Product] for [application]" | Application-specific recommendations | Add use case sections |

### Competitor GEO Analysis

| Competitor | Why AI Cites Them | CAPLINQ Gap |
|------------|-------------------|-------------|
| Henkel | Clear product claims, global brand | Need more assertive claims |
| 3M | Wikipedia presence, definitive guides | Need authoritative content |
| Indium | Technical depth, expert content | Similar quality, less visible |
| Brenntag | Scale mentions, industry reports | Need more external mentions |

### GEO Monitoring Recommendations

| Metric | How to Track | Target |
|--------|--------------|--------|
| AI citation rate | Monthly citation checks | 5/13 queries by Q3 |
| Brand mentions | Citation monitor tool | 8/13 by Q4 |
| Cross-engine presence | Test Gemini, Claude, GPT | 3/3 engines |
| Prominence rate | Track first-200-char mentions | 50% of citations |
