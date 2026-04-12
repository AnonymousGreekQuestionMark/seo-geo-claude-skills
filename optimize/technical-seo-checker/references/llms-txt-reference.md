# llms.txt Reference Guide

> Part of [technical-seo-checker](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/SKILL.md). See also: [robots-txt-reference.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/robots-txt-reference.md)

Complete reference for creating, testing, and maintaining llms.txt and llms-full.txt files for AI discoverability.

---

## 1. What These Files Are

### llms.txt

A Markdown file served at `<domain>/llms.txt` that gives LLMs a curated, human-readable map of a site's most important content. Proposed by Jeremy Howard (Answer.AI) in 2024, hosted at [llmstxt.org](https://llmstxt.org/).

**Purpose**: Curation. Unlike robots.txt (exclusion) and sitemap.xml (discovery), llms.txt tells AI models *what matters most* in a format they natively understand (Markdown).

### llms-full.txt

A companion file at `<domain>/llms-full.txt` containing a fuller text export of the site's key documentation in a single file. Gives AI crawlers a single high-signal ingestion point instead of forcing them to stitch together many pages.

- Size guidance: under 100 KB
- Same Markdown format as llms.txt but with inline content, not just links
- Evidence suggests AI agents visit `llms-full.txt` over 2x more than `llms.txt`

### robots-ai.txt (emerging)

A plain-text file following robots.txt syntax conventions but providing AI-crawler-specific access directives. Published as Version 1.1.0 on 2026-01-12 by 365i at [ai-visibility.org.uk](https://www.ai-visibility.org.uk/).

**Current status**: Very early; limited adoption. Supplements (does not replace) standard robots.txt.

### Comparison Table

| File | Purpose | Format | Controls |
|------|---------|--------|----------|
| `robots.txt` | **Exclusion** — tells crawlers where NOT to go | Plain text, directive-based | Crawl access (allow/disallow per user-agent) |
| `sitemap.xml` | **Discovery** — tells crawlers what pages exist | XML | Page inventory, priority, lastmod |
| `llms.txt` | **Curation** — tells LLMs what content matters | Markdown | AI comprehension, brand identity |
| `llms-full.txt` | **Ingestion** — gives LLMs full content in one file | Markdown | Deep understanding without multi-page crawl |
| `robots-ai.txt` | **AI-specific exclusion** — fine-grained AI crawler rules | Plain text (robots.txt syntax) | Training vs. retrieval access per AI bot |

**Critical prerequisite**: `robots.txt` must not block AI crawlers from reaching `llms.txt`. If `robots.txt` disallows GPTBot or ClaudeBot from `/`, they can't read `llms.txt` even if it exists. Always check robots.txt first.

---

## 2. llms.txt Specification

### Required Elements

- **H1 heading**: Site/company name (the only mandatory element in the specification)

### Recommended Elements

- **Blockquote summary**: One-line elevator pitch (first line after H1)
- **Prose context**: Optional free-form Markdown giving additional context
- **H2 sections**: Grouped links by category
- **Link format**: `- [Page Title](https://url): Short description`
- **## Optional section**: Special H2 marking lower-priority resources that can be skipped in short-context scenarios

### Rules

| Rule | Guidance |
|------|----------|
| File location | `<domain>/llms.txt` (root path; subpath variants allowed) |
| Format | Markdown |
| Content-Type | `text/plain; charset=utf-8` or `text/markdown` |
| Size | Under 10 KB for llms.txt, under 100 KB for llms-full.txt |
| URL format | One intent = one canonical URL — no `?utm=`, no filter params, no www/non-www duplicates |
| Page count | 5–20 reference pages recommended — not entire site inventory |
| Maintenance | Update with every major content/product change; include a date if possible |

---

## 3. AI Crawler User-Agents

### Training Crawlers (block recommended)

These crawlers index content for model training datasets. Blocking is reasonable to prevent content from entering training datasets without consent.

| Provider | User-Agent | Purpose |
|----------|-----------|---------|
| OpenAI | `GPTBot` | Model training data |
| Anthropic | `ClaudeBot` | Model training data |
| Google | `Google-Extended` | Gemini training data |
| Meta | `Meta-ExternalAgent` | LLaMA training |
| Meta | `Meta-ExternalFetcher` | LLaMA training |
| Common Crawl | `CCBot` | Open training datasets |
| Apple | `Applebot-Extended` | Apple Intelligence training |
| ByteDance | `Bytespider` | Model training |

### Retrieval Crawlers (allow recommended)

These crawlers fetch content for live AI answers. Blocking these prevents your content from appearing in AI-generated responses — the core goal of GEO optimization.

| Provider | User-Agent | Purpose |
|----------|-----------|---------|
| OpenAI | `ChatGPT-User` | Real-time retrieval for ChatGPT answers |
| OpenAI | `OAI-SearchBot` | Search indexing for ChatGPT search |
| Anthropic | `Claude-User` | Real-time page fetch when user asks Claude |
| Anthropic | `Claude-SearchBot` | Search result indexing |
| Perplexity | `PerplexityBot` | Indexing for Perplexity search |
| Perplexity | `Perplexity-User` | Real-time retrieval |

### Deprecated User-Agents (do not use in new rules)

| Deprecated | Replaced By |
|------------|-------------|
| `Claude-Web` | `ClaudeBot` + `Claude-User` + `Claude-SearchBot` |
| `anthropic-ai` | `ClaudeBot` |

---

## 4. Recommended robots.txt Strategy

Block training crawlers, allow retrieval crawlers:

```
# Block AI training
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Bytespider
Disallow: /

# Allow AI retrieval (live answers)
User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /
```

**Note**: Ensure `/llms.txt` is accessible to retrieval bots. If you have broad `Disallow: /` rules, add explicit `Allow: /llms.txt` for retrieval bots.

---

## 5. Site-Type Templates

### SaaS / B2B Product

```markdown
# [Product Name]

> [One-line value prop from homepage]

## Product

- [Features](https://domain/features): Core product capabilities
- [Pricing](https://domain/pricing): Plans and pricing
- [Integrations](https://domain/integrations): Third-party connections
- [Security](https://domain/security): Compliance and data protection

## Documentation

- [Getting Started](https://domain/docs/): Quick start guide
- [API Reference](https://domain/api/): Developer documentation
- [Changelog](https://domain/changelog): Product updates

## Optional

- [Blog](https://domain/blog): Industry insights
- [Case Studies](https://domain/customers): Customer stories
- [About](https://domain/about): Company background
```

### E-commerce

```markdown
# [Store Name]

> [One-line description — e.g., "Premium outdoor gear for adventurers"]

## Shop

- [All Products](https://domain/products): Complete catalog
- [Best Sellers](https://domain/best-sellers): Top products
- [New Arrivals](https://domain/new): Latest additions

## Categories

- [Category A](https://domain/category-a): [Description]
- [Category B](https://domain/category-b): [Description]

## Support

- [Shipping & Returns](https://domain/shipping): Delivery information
- [FAQ](https://domain/faq): Common questions
- [Contact](https://domain/contact): Customer support

## Optional

- [Blog](https://domain/blog): Product guides and tips
- [About](https://domain/about): Our story
```

### Content Publisher / Blog

```markdown
# [Publication Name]

> [One-line editorial focus — e.g., "In-depth analysis of AI and machine learning"]

## Topics

- [Topic A](https://domain/topic-a): Core coverage area
- [Topic B](https://domain/topic-b): Secondary focus
- [Guides](https://domain/guides): How-to content

## Popular

- [Most Read](https://domain/popular): High-traffic articles
- [Editor's Picks](https://domain/picks): Curated selections

## About

- [Editorial Policy](https://domain/editorial): Standards and corrections
- [Authors](https://domain/authors): Writer profiles
- [Contact](https://domain/contact): Tips and inquiries

## Optional

- [Archive](https://domain/archive): Historical content
- [Newsletter](https://domain/newsletter): Email signup
```

### Documentation Site

```markdown
# [Product] Documentation

> Official documentation for [Product]

## Getting Started

- [Installation](https://domain/install): Setup guide
- [Quick Start](https://domain/quickstart): First steps
- [Configuration](https://domain/config): Settings reference

## Reference

- [API](https://domain/api): API documentation
- [CLI](https://domain/cli): Command reference
- [SDK](https://domain/sdk): Library reference

## Guides

- [Tutorials](https://domain/tutorials): Step-by-step guides
- [Examples](https://domain/examples): Code samples
- [Best Practices](https://domain/best-practices): Recommendations

## Optional

- [Changelog](https://domain/changelog): Version history
- [Community](https://domain/community): Forums and Discord
- [Contributing](https://domain/contributing): How to contribute
```

---

## 6. Common Mistakes

### 1. Missing H1

**Problem**: llms.txt without an H1 heading fails the only required element in the specification.

**Fix**: Always start with `# Site Name` as the first line.

### 2. File Too Large

**Problem**: Files over 10 KB exceed recommended size and may be truncated by AI systems.

**Fix**: Limit to 5–20 key pages. Move secondary content to `llms-full.txt` or the `## Optional` section.

### 3. Broken Links

**Problem**: Links returning 404 signal neglect and reduce trust.

**Fix**: Verify all link targets before publishing. Update llms.txt when pages move or are deleted.

### 4. Non-Canonical URLs

**Problem**: Using `www.domain.com` in some links and `domain.com` in others, or including UTM parameters.

**Fix**: Use a single canonical URL format throughout. Strip tracking parameters.

### 5. Too Many Pages

**Problem**: Listing 50+ pages defeats the purpose of curation.

**Fix**: This is curation, not a sitemap. Focus on 5–20 most important pages only.

### 6. Stale Content

**Problem**: Referencing discontinued products, old pricing, or outdated dates.

**Fix**: Update llms.txt with every major content/product change. Stale content is worse than no file.

### 7. H1 Doesn't Match Entity Name

**Problem**: llms.txt H1 says "ACME Corp" but homepage says "Acme Solutions Inc." and schema.org says "Acme".

**Fix**: Align llms.txt H1 with canonical entity name from schema.org Organization markup and homepage. This inconsistency weakens AI entity resolution (CITE-I10 Brand Consistency).

---

## 7. Adoption Reality (as of April 2026)

Be honest with users about the current state of llms.txt adoption and effectiveness:

| Finding | Source |
|---------|--------|
| ~10% adoption rate among 300K domains surveyed | SE Ranking |
| 844,000+ sites implemented | BuiltWith |
| 0.1% of AI bot hits targeted /llms.txt over 60K visits | Otterly.ai GEO study |
| 8 of 9 tested sites saw no measurable traffic change | Search Engine Land |
| "No AI system currently uses llms.txt" — John Mueller | Semrush |
| Anthropic published llms.txt on their own site | LinkBuildingHQ |
| No correlation with AI citations found (statistical + ML analysis) | SE Ranking |

**Bottom line**: llms.txt is low-cost to implement (~30 minutes) but has no proven impact on AI citations yet. The recommendation should be:

> "Implement because it's cheap insurance and the standard is gaining momentum, but don't expect measurable results today."

Frame as **forward-looking GEO hygiene**, not a ranking factor.

---

## 8. Pre-Publish Checklist

Before publishing llms.txt:

- [ ] H1 matches canonical entity name (schema.org Organization, homepage H1)
- [ ] Blockquote summary matches or aligns with homepage meta description
- [ ] Limited to 5–20 key pages (not a sitemap)
- [ ] All links use canonical URL format (consistent www/non-www, no tracking params)
- [ ] All link targets return 200 (no broken links)
- [ ] File size under 10 KB
- [ ] No stale products, pricing, or dates
- [ ] Has `## Optional` section for secondary content
- [ ] robots.txt allows AI retrieval bots to access /llms.txt
- [ ] Content-Type header is `text/plain` or `text/markdown`

---

## Sources

### Specifications
- [llmstxt.org — Official llms.txt specification](https://llmstxt.org/)
- [robots-ai.txt Specification v1.1.0 (365i / AI Visibility Definition)](https://www.ai-visibility.org.uk/)

### Guides and Best Practices
- [Bluehost — What is llms.txt? (2026 Guide)](https://www.bluehost.com/blog/what-is-llms-txt/)
- [CrawlerOptic — 10 Essential llms.txt Best Practices for 2026](https://www.crawleroptic.com/blog/llms-txt-best-practices)
- [Semrush — What Is LLMs.txt & Should You Use It?](https://www.semrush.com/blog/llms-txt/)

### AI Crawler User-Agents
- [robotstxt.com — AI/LLM User-Agents Blocking Guide](https://robotstxt.com/ai)
- [ALM Corp — Anthropic's Three-Bot Framework](https://almcorp.com/blog/anthropic-claude-bots-robots-txt-strategy/)
- [Perplexity — Crawler Documentation](https://docs.perplexity.ai/guides/bots)

### Adoption Studies
- [SE Ranking — LLMs.txt: Why Brands Rely On It and Why It Doesn't Work](https://seranking.com/blog/llms-txt/)
- [Otterly.ai — llms.txt and AI Visibility: GEO Study Results](https://otterly.ai/blog/the-llms-txt-experiment/)
- [Search Engine Land — llms.txt isn't robots.txt: It's a treasure map for AI](https://searchengineland.com/llms-txt-isnt-robots-txt-its-a-treasure-map-for-ai-456586)
