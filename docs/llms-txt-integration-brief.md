# llms.txt / AI Discoverability Integration — Developer Brief

> **Purpose**: Add llms.txt (and related AI discoverability files) fetching, analysis, and recommendations to the SEO & GEO Skills Library.
> **Author**: Auto-generated from research conducted 2026-04-12.
> **Status**: Proposal — not yet implemented.

---

## 1. Background: What These Files Are

### 1.1 llms.txt

A Markdown file served at `<domain>/llms.txt` that gives LLMs a curated, human-readable map of a site's most important content. Proposed by Jeremy Howard (Answer.AI) in 2024, hosted at [llmstxt.org](https://llmstxt.org/).

**Purpose**: Curation. Unlike robots.txt (exclusion) and sitemap.xml (discovery), llms.txt tells AI models *what matters most* in a format they natively understand (Markdown).

**Specification** (from [llmstxt.org](https://llmstxt.org/)):

```markdown
# Site Name                          ← H1 (REQUIRED — only mandatory element)

> One-line elevator pitch             ← Blockquote summary (recommended)

Optional prose giving context.        ← Free-form Markdown (optional)

## Section Name                       ← H2-delimited sections (optional)

- [Page Title](https://url): Short description   ← Link entries
- [Another Page](https://url): Description

## Optional                           ← Special H2 — marks lower-priority resources
                                        that can be skipped in short-context scenarios

- [Blog](https://url): Secondary content
```

**Rules**:
- File location: `<domain>/llms.txt` (root path; subpath variants allowed)
- Format: Markdown
- Content-Type: `text/plain; charset=utf-8` or `text/markdown`
- Size guidance: under 10 KB for llms.txt ([source](https://www.crawleroptic.com/blog/llms-txt-best-practices))
- One intent = one canonical URL — no `?utm=`, no filter params, no www/non-www duplicates
- 5–20 reference pages recommended — not entire site inventory
- Update with every major content/product change; include a date if possible

### 1.2 llms-full.txt

A companion file at `<domain>/llms-full.txt` containing a fuller text export of the site's key documentation in a single file. Gives AI crawlers a single high-signal ingestion point instead of forcing them to stitch together many pages.

**Rules**:
- Size guidance: under 100 KB ([source](https://www.crawleroptic.com/blog/llms-txt-best-practices))
- Same Markdown format as llms.txt but with inline content, not just links
- Evidence suggests AI agents visit `llms-full.txt` over 2× more than `llms.txt` ([source](https://www.bluehost.com/blog/what-is-llms-txt/))

### 1.3 robots-ai.txt (emerging alternative)

A plain-text file following robots.txt syntax conventions but providing AI-crawler-specific access directives. Published as [Version 1.1.0 on 2026-01-12](https://www.ai-visibility.org.uk/) by 365i. Supplements (does not replace) standard robots.txt. Adds optional directives like `Request-rate` and `Visit-time` for AI-specific bots.

**Current status**: Very early; limited adoption. Included here for completeness.

### 1.4 How These Relate to robots.txt

| File | Purpose | Format | Controls |
|------|---------|--------|----------|
| `robots.txt` | **Exclusion** — tells crawlers where NOT to go | Plain text, directive-based | Crawl access (allow/disallow per user-agent) |
| `sitemap.xml` | **Discovery** — tells crawlers what pages exist | XML | Page inventory, priority, lastmod |
| `llms.txt` | **Curation** — tells LLMs what content matters | Markdown | AI comprehension, brand identity |
| `llms-full.txt` | **Ingestion** — gives LLMs full content in one file | Markdown | Deep understanding without multi-page crawl |
| `robots-ai.txt` | **AI-specific exclusion** — fine-grained AI crawler rules | Plain text (robots.txt syntax) | Training vs. retrieval access per AI bot |

**Critical prerequisite**: `robots.txt` must not block AI crawlers from reaching `llms.txt`. If `robots.txt` disallows GPTBot or ClaudeBot from `/`, they can't read `llms.txt` even if it exists. Always check robots.txt first.

---

## 2. Current Adoption Reality (as of April 2026)

**Be honest with users about the state of play.** The skill must present this data, not oversell.

| Data point | Finding | Source |
|------------|---------|--------|
| Adoption rate | ~10% of 300K domains surveyed | [SE Ranking](https://seranking.com/blog/llms-txt/) |
| BuiltWith tracking | 844,000+ sites implemented | [Bluehost](https://www.bluehost.com/blog/what-is-llms-txt/) |
| AI crawlers reading the file | 0.1% of AI bot hits targeted `/llms.txt` over 60K visits | [Otterly.ai GEO study](https://otterly.ai/blog/the-llms-txt-experiment/) |
| Traffic impact | 8 of 9 tested sites saw no measurable change | [Search Engine Land](https://searchengineland.com/llms-txt-isnt-robots-txt-its-a-treasure-map-for-ai-456586) |
| Google's John Mueller | "No AI system currently uses llms.txt" | [Semrush](https://www.semrush.com/blog/llms-txt/) |
| Anthropic | Published llms.txt on their own site; Claude endorsed concept Nov 2024 | [LinkBuildingHQ](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/) |
| Correlation with AI citations | No correlation found (both statistical analysis and ML) | [SE Ranking](https://seranking.com/blog/llms-txt/) |

**Bottom line**: llms.txt is low-cost to implement but has no proven impact on AI citations yet. The recommendation should be "implement because it's cheap insurance and the standard is gaining momentum, but don't expect measurable results today." Framed as forward-looking GEO hygiene, not a ranking factor.

---

## 3. AI Crawler User-Agents (Reference for robots.txt audit)

The `technical-seo-checker` currently audits robots.txt but only checks generic user-agents. The audit should expand to cover AI-specific bots. Current known user-agents as of April 2026:

### Training Crawlers (index content for model training)

| Provider | User-Agent | Purpose |
|----------|-----------|---------|
| OpenAI | `GPTBot` | Model training data |
| Anthropic | `ClaudeBot` | Model training data |
| Google | `Google-Extended` | Gemini training data |
| Meta | `Meta-ExternalAgent`, `Meta-ExternalFetcher` | LLaMA training |
| Common Crawl | `CCBot` | Open training datasets |
| Apple | `Applebot-Extended` | Apple Intelligence training |
| ByteDance | `Bytespider` | Model training |

### Retrieval Crawlers (fetch content for live AI answers)

| Provider | User-Agent | Purpose |
|----------|-----------|---------|
| OpenAI | `ChatGPT-User` | Real-time retrieval for ChatGPT answers |
| OpenAI | `OAI-SearchBot` | Search indexing for ChatGPT search |
| Anthropic | `Claude-User` | Real-time page fetch when user asks Claude |
| Anthropic | `Claude-SearchBot` | Search result indexing |
| Perplexity | `PerplexityBot` | Indexing for Perplexity search |
| Perplexity | `Perplexity-User` | Real-time retrieval |

### Deprecated (do not use in new rules)

| User-Agent | Replaced by |
|------------|-------------|
| `Claude-Web` | `ClaudeBot` + `Claude-User` + `Claude-SearchBot` |
| `anthropic-ai` | `ClaudeBot` |

**Recommended robots.txt strategy** (2026 consensus): Block training crawlers, allow retrieval crawlers. This prevents content from entering training datasets while still appearing in live AI answers.

```
# Block AI training
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
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

Sources: [Anthropic's three-bot framework](https://almcorp.com/blog/anthropic-claude-bots-robots-txt-strategy/), [AI user-agent blocking guide](https://robotstxt.com/ai), [Momentic AI crawler list](https://momenticmarketing.com/blog/ai-search-crawlers-bots), [Perplexity crawler docs](https://docs.perplexity.ai/guides/bots), [Cloudflare on Perplexity evasion](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/)

---

## 4. Implementation Plan for the Skills Library

### 4.1 Where to Add: `technical-seo-checker` (primary home)

**Rationale**: This skill already fetches `robots.txt` and `sitemap.xml` in Step 1 ("Audit Crawlability"). Adding `llms.txt` / `llms-full.txt` fetching here follows the same pattern and keeps all "root-path file" checks in one place.

#### Changes to `optimize/technical-seo-checker/SKILL.md`

**A. Add to Step 1 — Crawlability Audit, after the Robots.txt Review and XML Sitemap Review blocks:**

```markdown
### AI Discoverability Files Review

#### llms.txt

**URL**: [domain]/llms.txt
**Status**: [Found/Not Found/Error]
**Content-Type**: [text/plain | text/markdown | other]
**File Size**: [X] KB

**Current Content**:
```
[llms.txt content]
```

| Check | Status | Notes |
|-------|--------|-------|
| File exists at root | ✅/❌ | [notes] |
| H1 heading present (required) | ✅/❌ | [content of H1] |
| Blockquote summary present | ✅/❌ | [content] |
| Valid Markdown syntax | ✅/⚠️/❌ | [errors found] |
| Links use canonical URLs | ✅/⚠️/❌ | [duplicates or params found] |
| Link targets return 200 | ✅/⚠️/❌ | [broken links count] |
| File size ≤ 10 KB | ✅/⚠️ | [actual size] |
| Content current (no stale products/dates) | ✅/⚠️/❌ | [stale items] |
| Sections limited to 5–20 key pages | ✅/⚠️ | [actual count] |
| Has ## Optional section for secondary content | ✅/❌ | [notes] |

**Issues Found**:
- [Issue 1]
- [Issue 2]

**If missing — recommended llms.txt**:
```
# [Company Name]

> [One-line description from homepage H1 or meta description]

## [Primary Product/Service Category]

- [Key Page 1](https://domain/page-1): [Description]
- [Key Page 2](https://domain/page-2): [Description]

## Documentation

- [Getting Started](https://domain/docs/): [Description]
- [API Reference](https://domain/api/): [Description]

## Optional

- [Blog](https://domain/blog/): [Description]
- [About](https://domain/about/): Company background
```

---

#### llms-full.txt

**URL**: [domain]/llms-full.txt
**Status**: [Found/Not Found/Error]
**File Size**: [X] KB

| Check | Status | Notes |
|-------|--------|-------|
| File exists | ✅/❌ | [notes] |
| File size ≤ 100 KB | ✅/⚠️ | [actual size] |
| Contains inline content (not just links) | ✅/❌ | [notes] |
| Content aligns with llms.txt sections | ✅/⚠️/❌ | [mismatches] |

**Recommendation**: [Present if documentation-heavy site; skip if ≤10 pages]

---

#### robots-ai.txt (emerging)

**URL**: [domain]/robots-ai.txt
**Status**: [Found/Not Found/N/A]

**Note**: This is an emerging specification (v1.1.0, Jan 2026). Mention if present; do not flag absence as an issue.
```

**B. Expand the Robots.txt Review table to include AI crawler user-agent checks:**

Add these rows to the existing robots.txt check table:

```markdown
| AI training bots addressed | ✅/⚠️/❌ | GPTBot, ClaudeBot, Google-Extended, CCBot |
| AI retrieval bots addressed | ✅/⚠️/❌ | ChatGPT-User, Claude-User, PerplexityBot |
| Training/retrieval distinction | ✅/⚠️/❌ | Blocks training, allows retrieval (recommended) |
| Deprecated AI user-agents | ⚠️/✅ | Uses Claude-Web or anthropic-ai (deprecated) |
| llms.txt accessible to AI bots | ✅/❌ | Not blocked by Disallow rules |
```

**C. Add a reference file**: Create `optimize/technical-seo-checker/references/llms-txt-reference.md` (parallel to the existing `robots-txt-reference.md`) containing:
- Full llms.txt specification
- llms-full.txt guidance
- Example files for different site types (SaaS, e-commerce, blog, documentation)
- AI crawler user-agent reference table
- Common mistakes

### 4.2 Where to Add: `geo-content-optimizer` (secondary — recommendations)

**Rationale**: This skill advises on GEO optimization strategies. It should recommend llms.txt as part of AI discoverability, and check for alignment between llms.txt content and the site's entity profile.

#### Changes to `build/geo-content-optimizer/SKILL.md`

Add a check in the optimization workflow:

```markdown
### AI Discoverability Alignment

If `llms.txt` exists (from `technical-seo-checker` handoff):
- Does the H1 match the site's canonical entity name (from `entity-optimizer`)?
- Does the blockquote align with the homepage H1 and meta description?
- Are the linked pages the same ones being optimized for GEO?
- Does the content structure match the 4-engine priority table?
  - Google AI Overview: prefers structured, factual summaries
  - ChatGPT: prefers comprehensive pages with clear sections
  - Perplexity: prefers pages with citations and data
  - Claude: prefers well-structured, authoritative content

If `llms.txt` is missing:
- Recommend creating one using the entity profile from `entity-optimizer`
- Generate a draft based on the site's pillar pages identified in `keyword-research`
```

### 4.3 Where to Add: `entity-optimizer` (tertiary — input signal)

**Rationale**: The entity optimizer audits 47 signals for brand identity resolution. If `llms.txt` exists, it's a first-party declaration of "this is who we are and what matters" — a direct input to entity resolution.

#### Changes to `cross-cutting/entity-optimizer/SKILL.md`

Add to the signal audit checklist:

```markdown
### Signal 48: llms.txt Self-Declaration

- [ ] llms.txt exists at domain root
- [ ] H1 matches canonical entity name
- [ ] Blockquote aligns with Knowledge Graph description (if present)
- [ ] Linked pages cover the entity's primary topics/products
- [ ] No contradictions with schema.org Organization markup
```

### 4.4 CITE Framework Mapping

The llms.txt checks map to these existing CITE items:

| CITE Item | How llms.txt feeds it |
|-----------|----------------------|
| **I01 Brand Knowledge** | H1 + blockquote = the brand's self-declared identity for AI systems |
| **I03 AI Answer Presence** | If llms.txt is well-structured and AI retrieval bots can access it, likelihood of citation increases (speculative, unproven) |
| **I04 Schema.org Coverage** | llms.txt JSON-LD alignment check (best practice #7 from CrawlerOptic) |
| **I10 Brand Consistency** | Cross-check llms.txt H1 vs homepage H1 vs schema.org name vs Knowledge Graph |
| **T07 Crawlability** | llms.txt accessibility to AI bots (not blocked by robots.txt) |

### 4.5 CORE-EEAT Mapping

| CORE-EEAT Item | How llms.txt feeds it |
|----------------|----------------------|
| **A07 Brand Signals** | llms.txt is a structured brand signal specifically for AI systems |
| **A08 Entity Association** | llms.txt links declare the entity's topic associations |
| **O05 Structured Data** | llms.txt is structured content optimized for machine consumption |

### 4.6 Company Analysis Pipeline Integration

In the `company-analysis` orchestration:

- **No new step needed** — the `technical-seo-checker` (Step 7) already runs; it just needs to include the new llms.txt checks.
- The `geo-content-optimizer` (Step 14) picks up the llms.txt findings from the Step 7 handoff and incorporates them into recommendations.
- The `entity-optimizer` (Step 1) reads llms.txt as input signal #48.

**Order consideration**: `entity-optimizer` runs at Step 1 and would ideally read `llms.txt` as an input. This works because `entity-optimizer` already `WebFetch`es the homepage — adding a `WebFetch` of `/llms.txt` is trivial. The technical-seo-checker at Step 7 does the deeper audit (syntax, links, size, staleness).

### 4.7 Handoff Template Addition

Add to the `technical-seo-checker` handoff summary:

```markdown
- **AI Discoverability**:
  - llms.txt: [Present/Missing] | [X] pages listed | [X] KB | Issues: [list]
  - llms-full.txt: [Present/Missing] | [X] KB
  - robots.txt AI bot coverage: [Training blocked: Y/N] [Retrieval allowed: Y/N]
  - Deprecated user-agents in use: [list or "none"]
```

---

## 5. Recommendations the Skill Should Generate

When auditing a site, the skill should produce actionable recommendations based on findings. Here's the decision tree:

### 5.1 If llms.txt is missing

```
⚠️ RECOMMENDATION: Create /llms.txt

AI discoverability file not found. While no major AI provider has confirmed
using llms.txt as a ranking signal (as of April 2026), it is low-cost
insurance for forward-looking GEO optimization.

Priority: P2 (low effort, speculative benefit)
Effort: 30 minutes
Action: Create a Markdown file at /llms.txt with:
  1. H1: Your company/site name
  2. Blockquote: One-line description matching your homepage H1
  3. 5–15 links to your most important pages, grouped by category
  4. ## Optional section for blog/secondary content

[Draft llms.txt generated from site analysis below]
```

### 5.2 If llms.txt exists but has issues

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| Missing H1 | High | Add H1 — it's the only required element in the spec |
| No blockquote summary | Medium | Add a one-line description matching homepage meta |
| File > 10 KB | Medium | Trim to top 15 pages; move rest to llms-full.txt |
| Broken links (404s) | High | Fix or remove — broken links signal neglect |
| Non-canonical URLs (www, params) | Medium | Use single canonical form, add 301 redirects |
| > 50 pages listed | Medium | Curate to 5–20; this is curation, not a sitemap |
| Stale content (old product names, dates) | High | Update immediately — stale content is worse than no file |
| H1 doesn't match homepage H1 | Medium | Align — mismatches reduce AI confidence signals |
| No ## Optional section | Low | Consider adding for secondary content |

### 5.3 If robots.txt blocks AI retrieval bots

```
🔴 CRITICAL: robots.txt blocks AI retrieval crawlers

Your robots.txt blocks [ChatGPT-User / Claude-User / PerplexityBot] from
accessing your site. This prevents your content from appearing in AI-generated
answers — the core goal of GEO optimization.

Distinction:
  - Training bots (GPTBot, ClaudeBot, Google-Extended): blocking is reasonable
    to prevent content from entering training datasets.
  - Retrieval bots (ChatGPT-User, Claude-User, PerplexityBot): blocking these
    prevents your content from appearing in live AI search answers.

Recommendation: Allow retrieval bots while blocking training bots.
```

### 5.4 If robots.txt uses deprecated user-agents

```
⚠️ robots.txt references deprecated AI user-agents

Found: "User-agent: Claude-Web" — this user-agent was deprecated by Anthropic.
Current Anthropic bots are:
  - ClaudeBot (training)
  - Claude-User (retrieval)
  - Claude-SearchBot (search indexing)

Update your robots.txt to use current user-agent strings.
```

### 5.5 If llms.txt and entity profile conflict

```
⚠️ Entity mismatch between llms.txt and site signals

llms.txt H1: "ACME Solutions"
Homepage H1: "ACME — Enterprise Cloud Platform"
Schema.org name: "Acme Solutions Inc."
Knowledge Graph: "Acme Solutions"

Recommendation: Align all four to a single canonical name.
This inconsistency weakens AI entity resolution (CITE-I10 Brand Consistency).
```

---

## 6. Implementation Checklist

- [ ] Add llms.txt / llms-full.txt / robots-ai.txt fetch + audit to `technical-seo-checker` Step 1
- [ ] Expand robots.txt audit table with AI crawler user-agent checks (training vs retrieval distinction)
- [ ] Create `optimize/technical-seo-checker/references/llms-txt-reference.md`
- [ ] Add AI discoverability alignment check to `geo-content-optimizer`
- [ ] Add signal #48 (llms.txt self-declaration) to `entity-optimizer`
- [ ] Update handoff template with AI discoverability summary block
- [ ] Map new checks to CITE items (I01, I03, I04, I10, T07) and CORE-EEAT items (A07, A08, O05)
- [ ] Update `current-pipeline-state.md` concern #5 (dangling CITE items) to note partial resolution
- [ ] Add llms.txt to the `company-analysis` orchestration's Step 0 WebFetch list (homepage, robots.txt, sitemap, **llms.txt**)
- [ ] Update VERSIONS.md and plugin.json for skills that change

---

## 7. Sources

### Specifications
- [llmstxt.org — Official llms.txt specification](https://llmstxt.org/)
- [robots-ai.txt Specification v1.1.0 (365i / AI Visibility Definition)](https://www.ai-visibility.org.uk/)

### Guides and Best Practices
- [Bluehost — What is llms.txt? (2026 Guide)](https://www.bluehost.com/blog/what-is-llms-txt/)
- [CrawlerOptic — 10 Essential llms.txt Best Practices for 2026](https://www.crawleroptic.com/blog/llms-txt-best-practices)
- [Incremys — LLMS.txt Complete Guide With Examples (2026)](https://www.incremys.com/en/resources/blog/llms-txt)
- [Semrush — What Is LLMs.txt & Should You Use It?](https://www.semrush.com/blog/llms-txt/)
- [GitBook — What is llms.txt?](https://www.gitbook.com/blog/what-is-llms-txt)
- [Mintlify — What is llms.txt? Breaking down the skepticism](https://www.mintlify.com/blog/what-is-llms-txt)

### Comparative Analysis (llms.txt vs robots.txt)
- [Search Engine Land — llms.txt isn't robots.txt: It's a treasure map for AI](https://searchengineland.com/llms-txt-isnt-robots-txt-its-a-treasure-map-for-ai-456586)
- [Cension AI — LLMs.txt vs Robots.txt: Key Differences Explained](https://cension.ai/blog/llms-txt-robots-txt-differences/)
- [Qwairy — AI Crawlers & Technical Optimization Guide](https://www.qwairy.co/guides/complete-guide-to-robots-txt-and-llms-txt-for-ai-crawlers)

### Adoption Data and Effectiveness Studies
- [Otterly.ai — llms.txt and AI Visibility: GEO Study Results](https://otterly.ai/blog/the-llms-txt-experiment/)
- [SE Ranking — LLMs.txt: Why Brands Rely On It and Why It Doesn't Work](https://seranking.com/blog/llms-txt/)
- [LinkBuildingHQ — Should Websites Implement llms.txt in 2026?](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/)
- [Hyperleap AI — llms.txt Explained: Should Your SaaS Site Have One in 2026?](https://hyperleap.ai/blog/llms-txt-explained-saas-generator)

### AI Crawler User-Agents
- [robotstxt.com — AI/LLM User-Agents Blocking Guide](https://robotstxt.com/ai)
- [ALM Corp — Anthropic's Three-Bot Framework](https://almcorp.com/blog/anthropic-claude-bots-robots-txt-strategy/)
- [Momentic — List of Top AI Search Crawlers + User Agents](https://momenticmarketing.com/blog/ai-search-crawlers-bots)
- [Perplexity — Crawler Documentation](https://docs.perplexity.ai/guides/bots)
- [Cloudflare — Perplexity stealth crawlers report](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/)
- [Search Engine Journal — Anthropic's Claude Bots and robots.txt](https://www.searchenginejournal.com/anthropics-claude-bots-make-robots-txt-decisions-more-granular/568253/)
