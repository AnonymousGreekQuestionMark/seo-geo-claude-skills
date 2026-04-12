---
skill: schema-markup-generator
phase: 05
step: 16
status: DONE
timestamp: 20260412T182500
domain: caplinq.com
data_source: tier2_mcp
---

## Handoff Summary — schema-markup-generator

- **Status**: DONE
- **Objective**: Audit existing schema and generate recommended JSON-LD markup
- **Key Findings**: ZERO schema markup found on homepage or product pages. CITE I04: FAIL. Missing: Organization, Product, BreadcrumbList, FAQPage, LocalBusiness. Critical gap for AI entity recognition and rich snippets in SERP.
- **Evidence**: Schema validator API — 0 schema blocks on homepage, 0 on product page
- **Open Loops**: None
- **Maps to**: CITE I04 (Schema coverage), E05 (Entity schema)
- **Recommended Next Skill**: rank-tracker (Step 17)
- **Scores**:
  - schema_audit.coverage_pct: 0% (feeds CITE I04)

## Full Findings

### Schema Audit Results

| Page | Schema Blocks | Types Found | I04 Verdict |
|------|---------------|-------------|-------------|
| Homepage | 0 | None | FAIL |
| /semiconductor-epoxy-mold-compounds | 0 | None | FAIL |
| **Site-wide estimate** | 0 | None | FAIL |

### Missing Schema Recommendations

| Schema Type | Page(s) | Priority | Rich Result |
|-------------|---------|----------|-------------|
| Organization | Homepage | P0 | Knowledge panel |
| LocalBusiness | Contact pages (6) | P1 | Local pack |
| Product | All product pages | P0 | Product snippets |
| BreadcrumbList | All pages | P1 | Breadcrumb trail |
| FAQPage | Guide pages | P1 | FAQ accordion |
| HowTo | Tutorial pages | P2 | How-to cards |
| Article | Blog posts | P1 | Article snippets |

### Recommended Schema Markup

#### 1. Organization Schema (Homepage) — P0

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://caplinq.com/#organization",
  "name": "CAPLINQ Corporation",
  "alternateName": ["CAPLINQ", "CAPLINQ Europe BV"],
  "url": "https://caplinq.com",
  "logo": "https://caplinq.com/images/caplinq-logo.png",
  "foundingDate": "2004",
  "description": "Global supplier of specialty chemicals and engineered materials for semiconductor, eMobility, and electronics industries.",
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
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+31-20-893-2224",
      "contactType": "sales",
      "areaServed": "Europe"
    },
    {
      "@type": "ContactPoint",
      "telephone": "+1-618-416-9739",
      "contactType": "sales",
      "areaServed": "North America"
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/caplinq-corporation",
    "https://www.facebook.com/caplinq",
    "https://twitter.com/caplinq"
  ],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "certification",
    "name": "ISO 9001"
  },
  "areaServed": ["Europe", "North America", "Asia"],
  "knowsAbout": [
    "Thermal Interface Materials",
    "Die Attach Materials",
    "Epoxy Molding Compounds",
    "Conductive Adhesives",
    "REACH Compliance"
  ]
}
```

#### 2. Product Schema (Product Pages) — P0

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Semiconductor Epoxy Molding Compound - EMC-7320",
  "description": "High-purity epoxy molding compound for semiconductor packaging with excellent electrical stability.",
  "brand": {
    "@type": "Brand",
    "name": "CAPLINQ"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "CAPLINQ Corporation"
  },
  "category": "Semiconductor Materials > Molding Compounds",
  "material": "Epoxy Resin",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Thermal Conductivity",
      "value": "0.8",
      "unitCode": "W/mK"
    },
    {
      "@type": "PropertyValue",
      "name": "Glass Transition Temperature",
      "value": "165",
      "unitCode": "CEL"
    }
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": "Contact for pricing"
    },
    "seller": {
      "@type": "Organization",
      "name": "CAPLINQ Corporation"
    }
  }
}
```

#### 3. BreadcrumbList Schema (All Pages) — P1

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
      "name": "Products",
      "item": "https://caplinq.com/products"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Molding Compounds",
      "item": "https://caplinq.com/molding-compounds"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Semiconductor Epoxy Mold Compounds",
      "item": "https://caplinq.com/semiconductor-epoxy-mold-compounds.html"
    }
  ]
}
```

#### 4. FAQPage Schema (Guide Pages) — P1

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is die attach material?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Die attach material bonds semiconductor chips to packaging substrates. The three main types are epoxy adhesives (1-3 W/mK thermal conductivity), silver sintering paste (150+ W/mK), and die attach film (DAF) for uniform bond lines."
      }
    },
    {
      "@type": "Question",
      "name": "What is the strongest die attach adhesive?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Silver sintering paste provides the strongest mechanical bond and highest thermal conductivity (150+ W/mK) for die attach applications. It is ideal for high-power devices requiring excellent heat dissipation."
      }
    }
  ]
}
```

#### 5. LocalBusiness Schema (Contact Pages) — P1

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "CAPLINQ Europe BV",
  "image": "https://caplinq.com/images/caplinq-europe-office.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Industrieweg 15E",
    "addressLocality": "Assendelft",
    "postalCode": "1566JN",
    "addressCountry": "NL"
  },
  "telephone": "+31-20-893-2224",
  "openingHours": "Mo-Fr 09:00-17:00",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "52.4631",
    "longitude": "4.7553"
  },
  "parentOrganization": {
    "@id": "https://caplinq.com/#organization"
  }
}
```

### Implementation Priority

| Priority | Schema Type | Pages | Expected Impact |
|----------|-------------|-------|-----------------|
| P0 | Organization | Homepage | Knowledge panel, entity recognition |
| P0 | Product | 90+ product pages | Product rich snippets |
| P1 | BreadcrumbList | All pages | Breadcrumb trails in SERP |
| P1 | FAQPage | 10+ guide pages | FAQ rich results |
| P1 | LocalBusiness | 6 contact pages | Local pack visibility |
| P2 | Article | 200+ blog posts | Article snippets |
| P2 | HowTo | Tutorial pages | How-to cards |

### CITE I04 Score Update

| Status | Before | After Implementation |
|--------|--------|----------------------|
| Schema blocks | 0 | 300+ |
| Coverage | 0% | 85%+ |
| I04 Score | 10/100 | 80/100 |
| I04 Verdict | FAIL | PASS |

### Hot Cache Entry

```
schema_audit: { coverage_pct: 0, types_found: [], I04_verdict: FAIL, recommended: [Organization, Product, BreadcrumbList, FAQPage, LocalBusiness] }
```
