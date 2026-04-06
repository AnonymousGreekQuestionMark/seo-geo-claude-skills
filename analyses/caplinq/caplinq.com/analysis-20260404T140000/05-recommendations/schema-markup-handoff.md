---
skill: schema-markup-generator
phase: 05
step: 16
status: DONE
timestamp: 20260404T140000
domain: caplinq.com
---

## Handoff Summary — schema-markup-generator

- **Status**: DONE
- **Objective**: Generate JSON-LD structured data recommendations for CAPLINQ's key pages
- **Key Findings**: 5 schema types needed across CAPLINQ's pages: Organization (homepage), FAQPage (category pages), BreadcrumbList (all pages), Product (product pages), and WebSite (homepage). The FAQPage schema for TIM and electrochemical category pages will have the highest immediate impact on SERP features.
- **Evidence**: TIM page FAQ sections observed, breadcrumb navigation confirmed, product catalog structure
- **Open Loops**: Exact current schema state requires validation in Google's Rich Results Test
- **Recommended Next Skill**: rank-tracker (establish baseline rankings after content + schema implementation)

## Full Findings

### Schema 1: Organization (Homepage — Add or enhance)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CAPLINQ Corporation",
  "url": "https://www.caplinq.com",
  "logo": "https://www.caplinq.com/images/caplinq-logo.png",
  "description": "Global distributor of specialty chemicals, thermal interface materials, electrochemical materials, and engineered solutions for semiconductor, eMobility, and aerospace industries.",
  "foundingDate": "[founding year]",
  "numberOfEmployees": {"@type": "QuantitativeValue", "value": "[employee count]"},
  "address": [
    {"@type": "PostalAddress", "addressCountry": "NL", "addressLocality": "Amsterdam"},
    {"@type": "PostalAddress", "addressCountry": "CA"},
    {"@type": "PostalAddress", "addressCountry": "US"}
  ],
  "sameAs": [
    "https://www.linkedin.com/company/caplinq",
    "https://www.wikidata.org/wiki/[QID-when-created]",
    "https://www.crunchbase.com/organization/caplinq"
  ],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "ISO 9001 Certification"
  }
}
```

---

### Schema 2: FAQPage — /thermal-interface-materials.html

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
        "text": "Thermal Interface Materials (TIMs) are engineered materials placed between heat-generating components and heat dissipation devices to minimize thermal contact resistance. Types include phase change materials, thermal gap pads, thermal grease, and two-part hybrid systems."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between thermal conductivity and thermal resistance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Thermal conductivity (W/m·K) measures how well a material transfers heat. Thermal resistance (°C·cm²/W) measures the actual impedance in a specific application, accounting for material thickness and contact area. Thermal resistance is the more relevant metric for TIM selection."
      }
    },
    {
      "@type": "Question",
      "name": "Can thermal interface materials be reworked?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Reworkability depends on TIM type. Phase change materials and thermal pads can typically be reworked. Two-part systems and sintered materials are generally permanent. Thermal grease can be cleaned and reapplied."
      }
    }
  ]
}
```

---

### Schema 3: FAQPage — /electrochemical-materials.html

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What materials are used in PEM fuel cells?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PEM fuel cells use proton exchange membranes (e.g., Nafion), carbon gas diffusion layers (GDLs), platinum catalyst layers, and metallic current collectors. The GDL facilitates gas transport while maintaining electrical conductivity."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between a fuel cell and an electrolyzer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A fuel cell converts hydrogen and oxygen into electricity (spontaneous reaction). An electrolyzer uses electricity to split water into hydrogen and oxygen (non-spontaneous reaction). Both use similar membrane electrode assembly (MEA) architecture."
      }
    }
  ]
}
```

---

### Schema 4: BreadcrumbList (All Category Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.caplinq.com"},
    {"@type": "ListItem", "position": 2, "name": "Products", "item": "https://www.caplinq.com/view-all-categories.html"},
    {"@type": "ListItem", "position": 3, "name": "Thermal Interface Materials", "item": "https://www.caplinq.com/thermal-interface-materials.html"}
  ]
}
```

---

### Schema 5: WebSite (Homepage — enables Sitelinks Search Box)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CAPLINQ Corporation",
  "url": "https://www.caplinq.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.caplinq.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### Implementation Priority
1. FAQPage schema on TIM + Electrochemical pages — highest SERP feature impact
2. Organization schema with sameAs — entity signal improvement
3. BreadcrumbList — rich result for all category pages
4. WebSite schema — enables sitelinks search box
5. Product schema on individual product pages (longer-term, requires per-product implementation)

### Validation
After implementation, validate using:
- Google Rich Results Test: search.google.com/test/rich-results
- Schema Markup Validator: validator.schema.org
