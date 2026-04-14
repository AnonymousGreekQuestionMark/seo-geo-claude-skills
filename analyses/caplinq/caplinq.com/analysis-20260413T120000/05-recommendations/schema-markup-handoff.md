---
skill: schema-markup-generator
phase: 05
step: 16
status: DONE
timestamp: 20260413T120000
domain: caplinq.com
data_source: tier1_webfetch
---

## Handoff Summary — schema-markup-generator

- **Status**: DONE
- **Objective**: Generate Schema.org JSON-LD structured data for key page types and run site-wide audit
- **Key Findings**: No structured data currently detected on caplinq.com. Schema coverage 0% (CITE I04 = FAIL). Priority implementations: Organization (sitewide), FAQPage (REACH, TIM), Product (category pages), Article (blog). Site-wide audit mode: 0/100 coverage.
- **Evidence**: Technical audit, on-page audit, homepage HTML inspection
- **Open Loops**: Implementation requires developer resources; validation post-implementation
- **Maps to**: CITE I04 (Schema Coverage), CORE O05 (Schema Markup)
- **Recommended Next Skill**: rank-tracker (step 17)
- **Scores**:
  - Schema Coverage: 0%
  - CITE I04: FAIL (needs >=50%)

## Full Findings

### Site-Wide Schema Audit

| Page Type | Pages (Est.) | Current Schema | Target Schema | Gap |
|-----------|--------------|----------------|---------------|-----|
| Homepage | 1 | None | Organization, WebSite | Critical |
| Product Categories | 10+ | None | ProductGroup, BreadcrumbList | Critical |
| Product Pages | 100+ | None | Product, Offer | High |
| Service Pages | 5+ | None | Service, FAQPage | High |
| Blog Posts | 50+ | None | Article, FAQPage | High |
| About/Contact | 2+ | None | Organization, ContactPage | Medium |

**Current Coverage: 0%**
**Target Coverage: 80%+**

### Priority Schema Implementations

---

#### 1. Organization Schema (Sitewide)

Add to `<head>` of every page:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.caplinq.com/#organization",
  "name": "CAPLINQ Corporation",
  "alternateName": "CAPLINQ",
  "url": "https://www.caplinq.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.caplinq.com/images/logo.png",
    "width": 250,
    "height": 60
  },
  "foundingDate": "2004",
  "description": "Global distributor of specialty chemicals, thermal interface materials, and semiconductor assembly materials.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Zaandam",
    "addressLocality": "Assendelft",
    "addressCountry": "NL"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+31-75-647-3628",
      "contactType": "sales",
      "areaServed": "EU",
      "availableLanguage": ["English", "Dutch", "German"]
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/caplinq",
    "https://twitter.com/caplinq",
    "https://www.facebook.com/caplinq"
  ],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "certification",
    "name": "ISO 9001"
  }
}
```

---

#### 2. WebSite Schema (Homepage only)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.caplinq.com/#website",
  "name": "CAPLINQ Corporation",
  "url": "https://www.caplinq.com",
  "publisher": {
    "@id": "https://www.caplinq.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.caplinq.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

#### 3. FAQPage Schema (REACH OR Page)

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
        "text": "A REACH Only Representative (OR) is a legal entity established in the European Union that assumes REACH registration obligations on behalf of non-EU manufacturers. Under Article 8 of REACH, the OR becomes responsible for registration, compliance, and communication with ECHA."
      }
    },
    {
      "@type": "Question",
      "name": "Why do I need a REACH Only Representative?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Non-EU manufacturers cannot directly register substances with ECHA. Appointing an OR allows you to maintain EU market access, protects your confidential business information, and relieves your EU importers of registration obligations."
      }
    },
    {
      "@type": "Question",
      "name": "What is the US equivalent of REACH?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The US equivalent of REACH is TSCA (Toxic Substances Control Act), administered by the EPA. While both regulate chemicals, REACH requires pre-market registration while TSCA focuses on reporting and risk evaluation of existing chemicals."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a REACH Only Representative cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "REACH OR costs vary based on tonnage band, substance complexity, and required services. Typical annual fees range from €2,000-€15,000. Initial registration costs depend on whether you join a consortium or submit individually."
      }
    }
  ]
}
```

---

#### 4. Service Schema (REACH OR Page)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "REACH Only Representative Services",
  "serviceType": "Chemical Regulatory Compliance",
  "provider": {
    "@id": "https://www.caplinq.com/#organization"
  },
  "areaServed": {
    "@type": "Place",
    "name": "European Union"
  },
  "description": "CAPLINQ serves as REACH Only Representative for non-EU manufacturers, handling ECHA registration, compliance monitoring, and regulatory liaison.",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "REACH Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "REACH Registration"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Only Representative Appointment"
        }
      }
    ]
  }
}
```

---

#### 5. ProductGroup Schema (TIM Category Page)

```json
{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "Thermal Interface Materials",
  "description": "Thermal interface materials (TIMs) including gap pads, thermal grease, phase change materials, and hybrid formulations for electronics thermal management.",
  "url": "https://www.caplinq.com/thermal-interface-materials.html",
  "brand": {
    "@type": "Brand",
    "name": "CAPLINQ"
  },
  "hasVariant": [
    {
      "@type": "Product",
      "name": "Thermal Gap Pads",
      "url": "https://www.caplinq.com/thermal-gap-pads.html"
    },
    {
      "@type": "Product",
      "name": "Thermal Grease",
      "url": "https://www.caplinq.com/thermal-grease.html"
    },
    {
      "@type": "Product",
      "name": "Phase Change Materials",
      "url": "https://www.caplinq.com/phase-change-materials.html"
    }
  ],
  "variesBy": [
    "https://schema.org/thermalConductivity",
    "https://schema.org/material"
  ]
}
```

---

#### 6. Article Schema (Blog Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "[Article Title]",
  "description": "[Article description]",
  "image": "[Article image URL]",
  "datePublished": "[ISO date]",
  "dateModified": "[ISO date]",
  "author": {
    "@type": "Organization",
    "name": "CAPLINQ Technical Team",
    "@id": "https://www.caplinq.com/#organization"
  },
  "publisher": {
    "@id": "https://www.caplinq.com/#organization"
  },
  "mainEntityOfPage": "[Article URL]",
  "keywords": "[comma-separated keywords]"
}
```

---

#### 7. BreadcrumbList Schema (All Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.caplinq.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Thermal Interface Materials",
      "item": "https://www.caplinq.com/thermal-interface-materials.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Thermal Gap Pads",
      "item": "https://www.caplinq.com/thermal-gap-pads.html"
    }
  ]
}
```

---

### Implementation Priority

| Priority | Schema Type | Pages | Impact |
|----------|-------------|-------|--------|
| P0 | Organization | All | CITE I01, entity recognition |
| P0 | FAQPage | REACH, TIM | Rich results, PAA |
| P0 | WebSite | Homepage | Sitelinks search |
| P1 | ProductGroup | Category pages | Product carousels |
| P1 | Article | Blog posts | Article rich results |
| P1 | BreadcrumbList | All | Navigation rich results |
| P2 | Product | Product pages | Shopping integration |
| P2 | Service | Service pages | Service rich results |

### Validation Checklist

- [ ] Test with Google Rich Results Test
- [ ] Validate with Schema.org Validator
- [ ] Check Search Console for errors
- [ ] Monitor rich result appearance
- [ ] Track CITE I04 improvement
