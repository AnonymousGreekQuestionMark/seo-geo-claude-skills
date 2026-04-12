---
name: technical-seo-checker
description: 'Technical SEO audit: Core Web Vitals, crawl, indexing, mobile, speed, architecture, redirects, llms.txt, AI crawlers. 技术SEO/网站速度'
version: "6.5.0"
license: Apache-2.0
compatibility: "Claude Code ≥1.0, skills.sh marketplace, ClawHub marketplace, Vercel Labs skills ecosystem. No system packages required. Optional: MCP network access for SEO tool integrations."
homepage: "https://github.com/aaron-he-zhu/seo-geo-claude-skills"
when_to_use: "Use when checking technical SEO health: site speed, Core Web Vitals, indexing, crawlability, robots.txt, sitemaps, or canonical tags."
argument-hint: "<URL or domain>"
allowed-tools: WebFetch
metadata:
  author: aaron-he-zhu
  version: "6.5.0"
  geo-relevance: "low"
  tags:
    - seo
    - technical-seo
    - core-web-vitals
    - page-speed
    - crawlability
    - indexability
    - mobile-seo
    - site-health
    - lcp
    - cls
    - inp
    - robots-txt
    - xml-sitemap
    - 技术SEO
    - 网站速度
    - テクニカルSEO
    - 기술SEO
    - seo-tecnico
  triggers:
    # EN-formal
    - "technical SEO audit"
    - "check page speed"
    - "Core Web Vitals"
    - "crawl issues"
    - "site indexing problems"
    - "canonical tag issues"
    - "duplicate content"
    - "mobile-friendly check"
    - "site speed"
    - "site health check"
    # EN-casual
    - "my site is slow"
    - "Google can't crawl my site"
    - "Google can't find my pages"
    - "mobile issues"
    - "indexing problems"
    - "why is my site slow"
    # EN-question
    - "how do I fix my page speed"
    - "why is my site not indexed"
    - "how to improve Core Web Vitals"
    - "why did my site disappear from Google"
    # EN-competitor
    - "PageSpeed Insights alternative"
    - "GTmetrix alternative"
    - "Sitebulb alternative"
    # ZH-pro
    - "技术SEO检查"
    - "网站速度优化"
    - "核心网页指标"
    - "爬虫问题"
    - "索引问题"
    - "网站收录"
    - "sitemap提交"
    - "robots设置"
    # ZH-casual
    - "网站加载太慢"
    - "网站太慢了"
    - "Google找不到我的页面"
    - "手机端有问题"
    - "收录不了"
    - "Google收录少"
    # JA
    - "テクニカルSEO"
    - "サイト速度"
    - "コアウェブバイタル"
    - "クロール問題"
    - "インデックス登録"
    - "モバイル最適化"
    # KO
    - "기술 SEO"
    - "사이트 속도"
    - "코어 웹 바이탈"
    - "크롤링 문제"
    - "사이트 왜 이렇게 느려?"
    # ES
    - "auditoría SEO técnica"
    - "velocidad del sitio"
    - "problemas de indexación"
    - "mi sitio no aparece en Google"
    - "velocidad de carga"
    # PT
    - "auditoria SEO técnica"
    - "meu site não aparece no Google"
    - "velocidade de carregamento"
    # Misspellings
    - "techincal SEO"
    - "core web vitalls"
---

# Technical SEO Checker


> **[SEO & GEO Skills Library](https://github.com/aaron-he-zhu/seo-geo-claude-skills)** · 20 skills for SEO + GEO · [ClawHub](https://clawhub.ai/u/aaron-he-zhu) · [skills.sh](https://skills.sh/aaron-he-zhu/seo-geo-claude-skills)
> **System Mode**: This optimization skill follows the shared [Skill Contract](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/skill-contract.md) and [State Model](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/state-model.md).


This skill performs comprehensive technical SEO audits to identify issues that may prevent search engines from properly crawling, indexing, and ranking your site.

**System role**: Optimization layer skill. It turns weak pages, structures, and technical issues into prioritized repair work.

## When This Must Trigger

Use this when the conversation involves any of these situations — even if the user does not use SEO terminology:

Use this whenever the task needs a diagnosis or repair plan that should feed directly into remediation work, not just a one-time opinion.

- Launching a new website
- Diagnosing ranking drops
- Pre-migration SEO audits
- Regular technical health checks
- Identifying crawl and index issues
- Improving site performance
- Fixing Core Web Vitals issues

## What This Skill Does

1. **Crawlability Audit**: Checks robots.txt, sitemaps, crawl issues
2. **Indexability Review**: Analyzes index status and blockers
3. **Site Speed Analysis**: Evaluates Core Web Vitals and performance
4. **Mobile-Friendliness**: Checks mobile optimization
5. **Security Check**: Reviews HTTPS and security headers
6. **Structured Data Audit**: Validates schema markup
7. **URL Structure Analysis**: Reviews URL patterns and redirects
8. **International SEO**: Checks hreflang and localization

## Quick Start

Start with one of these prompts. Finish with a short handoff summary using the repository format in [Skill Contract](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/skill-contract.md).

### Full Technical Audit

```
Perform a technical SEO audit for [URL/domain]
```

### Specific Issue Check

```
Check Core Web Vitals for [URL]
```

```
Audit crawlability and indexability for [domain]
```

### Pre-Migration Audit

```
Technical SEO checklist for migrating [old domain] to [new domain]
```

## Skill Contract

**Expected output**: a scored diagnosis, prioritized repair plan, and a short handoff summary ready for `memory/audits/`.

- **Reads**: the current page or site state, symptoms, prior audits, and current priorities from [CLAUDE.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/CLAUDE.md) and the shared [State Model](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/references/state-model.md) when available.
- **Writes**: a user-facing audit or optimization plan plus a reusable summary that can be stored under `memory/audits/`.
- **Promotes**: blocking defects, repeated weaknesses, and fix priorities to `memory/open-loops.md` and `memory/decisions.md`.
- **Maps to**: CITE T07 (HTTPS/security), T08 (content freshness), T09 (penalty history), T03 (link-traffic coherence), I01 (brand knowledge via llms.txt H1), I04 (schema coverage — llms.txt as structured brand declaration); CORE T03 (security standards), A07 (brand signals), O05 (structured data)
- **Next handoff**: use the `Next Best Skill` below when the repair path is clear.

## Data Sources

> See [CONNECTORS.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/CONNECTORS.md) for tool category placeholders.

**With ~~web crawler + ~~page speed tool + ~~CDN connected:**
Claude can automatically crawl the entire site structure via ~~web crawler, pull Core Web Vitals and performance metrics from ~~page speed tool, analyze caching headers from ~~CDN, and fetch mobile-friendliness data. This enables comprehensive automated technical audits.

**With manual data only:**
Ask the user to provide:
1. Site URL(s) to audit
2. PageSpeed Insights screenshots or reports
3. robots.txt file content
4. sitemap.xml URL or file

Proceed with the full audit using provided data. Note in the output which findings are from automated crawl vs. manual review.

## Instructions

When a user requests a technical SEO audit:

1. **Audit Crawlability**

   ```markdown
   ## Crawlability Analysis
   
   ### Robots.txt Review
   
   **URL**: [domain]/robots.txt
   **Status**: [Found/Not Found/Error]
   
   **Current Content**:
   ```
   [robots.txt content]
   ```
   
   | Check | Status | Notes |
   |-------|--------|-------|
   | File exists | ✅/❌ | [notes] |
   | Valid syntax | ✅/⚠️/❌ | [errors found] |
   | Sitemap declared | ✅/❌ | [sitemap URL] |
   | Important pages blocked | ✅/⚠️/❌ | [blocked paths] |
   | Assets blocked | ✅/⚠️/❌ | [CSS/JS blocked?] |
   | Correct user-agents | ✅/⚠️/❌ | [notes] |
   | AI training bots addressed | ✅/⚠️/❌ | GPTBot, ClaudeBot, Google-Extended, CCBot |
   | AI retrieval bots allowed | ✅/⚠️/❌ | ChatGPT-User, Claude-User, PerplexityBot |
   | Training/retrieval distinction | ✅/⚠️/❌ | Blocks training, allows retrieval (recommended) |
   | Deprecated AI user-agents | ⚠️/✅ | Uses Claude-Web or anthropic-ai (deprecated) |
   | llms.txt accessible to AI bots | ✅/❌ | /llms.txt not blocked by Disallow rules |
   
   **Issues Found**:
   - [Issue 1]
   - [Issue 2]
   
   **Recommended robots.txt**:
   ```
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /private/
   
   Sitemap: https://example.com/sitemap.xml
   ```
   
   ---
   
   ### XML Sitemap Review
   
   **Sitemap URL**: [URL]
   **Status**: [Found/Not Found/Error]
   
   | Check | Status | Notes |
   |-------|--------|-------|
   | Sitemap exists | ✅/❌ | [notes] |
   | Valid XML format | ✅/⚠️/❌ | [errors] |
   | In robots.txt | ✅/❌ | [notes] |
   | Submitted to ~~search console | ✅/⚠️/❌ | [notes] |
   | URLs count | [X] | [appropriate?] |
   | Only indexable URLs | ✅/⚠️/❌ | [notes] |
   | Includes priority | ✅/⚠️ | [notes] |
   | Includes lastmod | ✅/⚠️ | [accurate?] |
   
   **Issues Found**:
   - [Issue 1]
   
   ---
   
   ### Crawl Budget Analysis
   
   | Factor | Status | Impact |
   |--------|--------|--------|
   | Crawl errors | [X] errors | [Low/Med/High] |
   | Duplicate content | [X] pages | [Low/Med/High] |
   | Thin content | [X] pages | [Low/Med/High] |
   | Redirect chains | [X] found | [Low/Med/High] |
   | Orphan pages | [X] found | [Low/Med/High] |
   
   **Crawlability Score**: [X]/10
   ```
   
   ---
   
   ### AI Discoverability Files Review
   
   #### llms.txt
   
   **URL**: [domain]/llms.txt
   **Status**: [Found/Not Found/Error]
   **Content-Type**: [text/plain | text/markdown | other]
   **File Size**: [X] KB
   
   **Current Content** (if found):
   ```
   [llms.txt content — show first 50 lines if large]
   ```
   
   | Check | Status | Notes |
   |-------|--------|-------|
   | File exists at root | ✅/❌ | [notes] |
   | H1 heading present (required) | ✅/❌ | [content of H1] |
   | Blockquote summary present | ✅/❌ | [first 100 chars] |
   | Valid Markdown syntax | ✅/⚠️/❌ | [errors found] |
   | Links use canonical URLs | ✅/⚠️/❌ | [duplicates or params found] |
   | Link targets return 200 | ✅/⚠️/❌ | [broken links count] |
   | File size ≤ 10 KB | ✅/⚠️ | [actual size] |
   | Content current (no stale products/dates) | ✅/⚠️/❌ | [stale items] |
   | Limited to 5–20 key pages | ✅/⚠️ | [actual count] |
   | Has ## Optional section | ✅/❌ | [present for secondary content?] |
   
   **Issues Found**:
   - [Issue 1]
   - [Issue 2]
   
   **If llms.txt is missing — draft recommendation**:
   
   > ⚠️ llms.txt not found. While no major AI provider has confirmed using llms.txt as a ranking signal (as of April 2026), it is low-cost insurance for forward-looking GEO optimization. Priority: P2 (low effort, speculative benefit). Effort: 30 minutes.
   
   ```markdown
   # [Company Name]
   
   > [One-line description from homepage H1 or meta description]
   
   ## [Primary Product/Service Category]
   
   - [Key Page 1](https://domain/page-1): [Description from meta or H1]
   - [Key Page 2](https://domain/page-2): [Description]
   - [Key Page 3](https://domain/page-3): [Description]
   
   ## Documentation
   
   - [Getting Started](https://domain/docs/): [Description]
   - [API Reference](https://domain/api/): [Description]
   
   ## Optional
   
   - [Blog](https://domain/blog/): Secondary content
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
   
   **Recommendation**: [Present if documentation-heavy site; skip if ≤10 pages of documentation]
   
   ---
   
   #### robots-ai.txt (emerging)
   
   **URL**: [domain]/robots-ai.txt
   **Status**: [Found/Not Found/N/A]
   
   **Note**: This is an emerging specification (v1.1.0, Jan 2026). Mention if present; do not flag absence as an issue.

2. **Audit Indexability**

   ```markdown
   ## Indexability Analysis
   
   ### Index Status Overview
   
   | Metric | Count | Notes |
   |--------|-------|-------|
   | Pages in sitemap | [X] | |
   | Pages indexed | [X] | [source: site: search] |
   | Index coverage ratio | [X]% | [good if >90%] |
   
   ### Index Blockers Check
   
   | Blocker Type | Found | Pages Affected |
   |--------------|-------|----------------|
   | noindex meta tag | [X] | [list or "none"] |
   | noindex X-Robots | [X] | [list or "none"] |
   | Robots.txt blocked | [X] | [list or "none"] |
   | Canonical to other | [X] | [list or "none"] |
   | 4xx/5xx errors | [X] | [list or "none"] |
   | Redirect loops | [X] | [list or "none"] |
   
   ### Canonical Tags Audit
   
   | Check | Status | Notes |
   |-------|--------|-------|
   | Canonicals present | ✅/⚠️/❌ | [X]% of pages |
   | Self-referencing | ✅/⚠️/❌ | [notes] |
   | Consistent (HTTP/HTTPS) | ✅/⚠️/❌ | [notes] |
   | Consistent (www/non-www) | ✅/⚠️/❌ | [notes] |
   | No conflicting signals | ✅/⚠️/❌ | [notes] |
   
   ### Duplicate Content Issues
   
   | Issue Type | Count | Examples |
   |------------|-------|----------|
   | Exact duplicates | [X] | [URLs] |
   | Near duplicates | [X] | [URLs] |
   | Parameter duplicates | [X] | [URLs] |
   | WWW/non-WWW | [X] | [notes] |
   | HTTP/HTTPS | [X] | [notes] |
   
   **Indexability Score**: [X]/10
   ```

3. **Audit Site Speed & Core Web Vitals** — CWV metrics (LCP/FID/CLS/INP), additional performance metrics (TTFB/FCP/Speed Index/TBT), resource loading breakdown, optimization recommendations

   > **Reference**: See [references/technical-audit-templates.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-templates.md) for the performance analysis template (Step 3).

4. **Audit Mobile-Friendliness** — Mobile-friendly test, responsive design check, mobile-first indexing verification

   > **Reference**: See [references/technical-audit-templates.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-templates.md) for the mobile optimization template (Step 4).

5. **Audit Security & HTTPS** — SSL certificate, HTTPS enforcement, mixed content, HSTS, security headers (CSP, X-Frame-Options, etc.)

   > **Reference**: See [references/technical-audit-templates.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-templates.md) for the security analysis template (Step 5).

6. **Audit URL Structure** — URL patterns, issues (dynamic params, session IDs, uppercase), redirect analysis (chains, loops, 302s)

   > **Reference**: See [references/technical-audit-templates.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-templates.md) for the URL structure template (Step 6).

7. **Audit Structured Data** — Schema markup validation, missing schema opportunities. CORE-EEAT alignment: maps to O05.

   > **Reference**: See [references/technical-audit-templates.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-templates.md) for the structured data template (Step 7).

8. **Audit International SEO (if applicable)** — Hreflang implementation, language/region targeting

   > **Reference**: See [references/technical-audit-templates.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-templates.md) for the international SEO template (Step 8).

9. **Generate Technical Audit Summary** — Overall health score with visual breakdown, critical/high/medium issues, quick wins, implementation roadmap (weeks 1-4+), monitoring recommendations

   > **Reference**: See [references/technical-audit-templates.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-templates.md) for the audit summary template (Step 9).

## Validation Checkpoints

### Input Validation
- [ ] Site URL or domain clearly specified
- [ ] Access to technical data (robots.txt, sitemap, or crawl results)
- [ ] Performance metrics available (via ~~page speed tool or screenshots)

### Output Validation
- [ ] Every recommendation cites specific data points (not generic advice)
- [ ] All issues include affected URLs or page counts
- [ ] Performance metrics include actual numbers with units (seconds, KB, etc.)
- [ ] Source of each data point clearly stated (~~web crawler data, ~~page speed tool, user-provided, or estimated)

## Example

> **Reference**: See [references/technical-audit-example.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-example.md) for a full worked example (cloudhosting.com technical audit) and the comprehensive technical SEO checklist.

## Tips for Success

1. **Prioritize by impact** - Fix critical issues first
2. **Monitor continuously** - Use ~~search console alerts
3. **Test changes** - Verify fixes work before deploying widely
4. **Document everything** - Track changes for troubleshooting
5. **Regular audits** - Schedule quarterly technical reviews

> **Technical reference**: For issue severity framework, prioritization matrix, and Core Web Vitals optimization quick reference, see [references/http-status-codes.md](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/http-status-codes.md).


### Save Results

After delivering audit or optimization findings to the user, ask:

> "Save these results for future sessions?"

If yes, write a dated summary to `memory/audits/technical-seo-checker/YYYY-MM-DD-<topic>.md` containing:
- One-line verdict or headline finding
- Top 3-5 actionable items
- Open loops or blockers
- Source data references
- **AI Discoverability**:
  - llms.txt: [Present/Missing] | [X] pages listed | [X] KB | Issues: [list or "none"]
  - llms-full.txt: [Present/Missing] | [X] KB
  - robots.txt AI bot coverage: Training blocked: [Y/N] | Retrieval allowed: [Y/N]
  - Deprecated user-agents in use: [list or "none"]

If any veto-level issue was found (CORE-EEAT T04, C01, R10 or CITE T03, T05, T09), also append a one-liner to `memory/hot-cache.md` without asking.

## Reference Materials

- [robots.txt Reference](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/robots-txt-reference.md) — Syntax guide, templates, common configurations
- [HTTP Status Codes](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/http-status-codes.md) — SEO impact of each status code, redirect best practices
- [Technical Audit Templates](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-templates.md) — Detailed output templates for steps 3-9 (CWV, mobile, security, URL structure, structured data, international, audit summary)
- [Technical Audit Example & Checklist](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/technical-audit-example.md) — Full worked example and comprehensive technical SEO checklist
- [llms.txt Reference](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/references/llms-txt-reference.md) — llms.txt/llms-full.txt specification, AI crawler user-agents, site-type templates

## Next Best Skill

- **Primary**: [on-page-seo-auditor](https://github.com/aaron-he-zhu/seo-geo-claude-skills/blob/main/optimize/on-page-seo-auditor/SKILL.md) — continue from infrastructure issues into page-level remediation.
