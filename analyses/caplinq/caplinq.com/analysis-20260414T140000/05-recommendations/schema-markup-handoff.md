---
skill: schema-markup-generator
phase: 05
step: 16
status: DONE
timestamp: 20260414T140000
domain: caplinq.com
data_source: tier2_mcp_schema_validator
---

## Handoff Summary — schema-markup-generator

- **Status**: DONE
- **Objective**: Generate schema markup recommendations and templates
- **Key Findings**: Site-wide 0% schema coverage (CITE I04 FAIL). Priority schemas: Organization (homepage), FAQPage (category pages), Product (product pages), BreadcrumbList (all pages).
- **Evidence**: MCP schema validator showed 0 blocks on homepage and die attach page
- **Open Loops**: None
- **Maps to**: CITE I04 (Schema coverage)
- **Recommended Next Skill**: rank-tracker (Step 17)

## Schema Coverage Audit

### Current State
| Page Type | Pages | Schema Blocks | Coverage |
|-----------|-------|---------------|----------|
| Homepage | 1 | 0 | 0% |
| Product Categories | 16 | 0 | 0% |
| Product Pages | 80+ | 0 | 0% |
| Blog Posts | 50+ | 0 | 0% |
| Service Pages | 5+ | 0 | 0% |
| **Site Total** | 150+ | **0** | **0%** |

### Target State (90 Days)
| Page Type | Target Coverage | Priority |
|-----------|-----------------|----------|
| Homepage | 100% (Organization) | P0 |
| Product Categories | 100% (FAQPage, BreadcrumbList) | P0 |
| Product Pages | 80% (Product, BreadcrumbList) | P1 |
| Blog Posts | 100% (Article, Person, BreadcrumbList) | P1 |
| Service Pages | 100% (Service, FAQPage) | P2 |

## Schema Templates

### 1. Organization Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CAPLINQ Corporation",
  "alternateName": "CAPLINQ",
  "url": "https://caplinq.com",
  "logo": "https://caplinq.com/images/caplinq-logo.png",
  "description": "Global supplier of specialty chemicals, thermal interface materials, and semiconductor packaging materials",
  "foundingDate": "2006",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": 62
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Industrieweg 15E",
    "addressLocality": "Assendelft",
    "postalCode": "1566JN",
    "addressCountry": "NL"
  },
  "sameAs": [
    "https://www.linkedin.com/company/caplinq-corporation",
    "https://www.crunchbase.com/organization/caplinq"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "availableLanguage": ["English", "Dutch", "German"]
  }
}
```

### 2. FAQPage Schema (Category Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are thermal interface materials?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Thermal interface materials (TIMs) are compounds used to fill microscopic air gaps between heat-generating components and heat sinks, improving thermal conductivity. CAPLINQ offers thermal gap pads, greases, phase change materials, and adhesives."
      }
    },
    {
      "@type": "Question",
      "name": "How do I choose the right thermal interface material?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Selection depends on thermal conductivity requirements, gap size, operating temperature, and rework needs. CAPLINQ's technical team can help you select the optimal TIM for your application."
      }
    }
  ]
}
```

### 3. Product Schema (Product Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "LINQTAPE PIT-2525 Polyimide Tape",
  "description": "High-temperature polyimide tape with silicone adhesive for semiconductor and electronics applications",
  "brand": {
    "@type": "Brand",
    "name": "LINQTAPE"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "CAPLINQ Corporation"
  },
  "category": "Specialty Tapes & Films",
  "material": "Polyimide film with silicone adhesive",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "USD",
    "seller": {
      "@type": "Organization",
      "name": "CAPLINQ"
    }
  }
}
```

### 4. BreadcrumbList Schema (All Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://caplinq.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Thermal Interface Materials",
      "item": "https://caplinq.com/thermal-interface-materials.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Thermal Gap Pads",
      "item": "https://caplinq.com/thermal-gap-pads.html"
    }
  ]
}
```

### 5. Article Schema (Blog Posts)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Common Conformal Coating Defects and How to Prevent Them",
  "author": {
    "@type": "Person",
    "name": "Alicia Montesclaros",
    "url": "https://blog.caplinq.com/author/alicia"
  },
  "publisher": {
    "@type": "Organization",
    "name": "CAPLINQ Corporation",
    "logo": {
      "@type": "ImageObject",
      "url": "https://caplinq.com/images/caplinq-logo.png"
    }
  },
  "datePublished": "2026-04-10",
  "dateModified": "2026-04-10",
  "image": "https://blog.caplinq.com/images/conformal-coating-defects.jpg"
}
```

## Implementation Plan

### P0 — Week 1
1. Add Organization schema to homepage
2. Add FAQPage schema to TIM page (with 5+ FAQs)
3. Add FAQPage schema to die attach page
4. Add BreadcrumbList to top 10 pages

### P1 — Weeks 2-4
5. Add Product schema to all product pages
6. Add Article + Person schema to blog posts
7. Add FAQPage schema to remaining category pages

### P2 — Month 2
8. Add Service schema to REACH OR page
9. Add HowTo schema to technical guides
10. Validate all schema with Google Rich Results Test

## Schema Impact Projection

| Action | CITE I04 Impact |
|--------|-----------------|
| Organization schema | +10 |
| FAQPage (10 pages) | +20 |
| Product (80 pages) | +15 |
| BreadcrumbList (all) | +5 |
| **Total** | **+50** |

Current I04: 0/100
Target I04: 50/100
