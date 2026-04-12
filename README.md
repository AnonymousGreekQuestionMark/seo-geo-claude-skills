# SEO & GEO Skills Library

**Send a URL. Get a full SEO + GEO analysis with an HTML report.**

[![Version](https://img.shields.io/badge/version-6.4.0-orange)](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/VERSIONS.md)
[![License](https://img.shields.io/badge/license-Apache%202.0-green)](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-purple)](https://claude.ai/download)

21 skills and 10 commands for Search Engine Optimization (SEO) and Generative Engine Optimization (GEO). Works with [Claude Code](https://claude.ai/download), [Cursor](https://cursor.com), and other Claude-compatible agents. No dependencies, no API keys required.

> **SEO** gets you ranked in search results. **GEO** gets you cited by AI systems (ChatGPT, Perplexity, Google AI Overviews). This library covers both — and can analyze an entire company domain in one command.

---

## Just send a URL

The fastest way to start — one command, any domain:

```
/geo:analyze-company caplinq.com
```

The agent runs all 20 skills in sequence, saves organized results, and generates a self-contained HTML report. No other input needed.

You can also type a bare domain or say "analyze caplinq.com" and Claude will recognize it as a company analysis request — but `/geo:analyze-company` is the reliable path and the one to use if you want it to run every time without ambiguity.

> **First time?** You need to install this library before commands like `/geo:analyze-company` are available. See [Install](#install) below — it's a one-time setup that takes under a minute.

---

## What You Get

One command runs a 21-step analysis across 7 phases:

| Phase | Skills | Output |
|-------|--------|--------|
| **01 Domain Baseline** | entity-optimizer, domain-authority-auditor | CITE score (40-item), entity profile |
| **02 Research** | keyword-research, competitor-analysis, serp-analysis, content-gap-analysis | Keyword clusters, competitor gaps, SERP features |
| **03 Technical** | technical-seo-checker, on-page-seo-auditor, internal-linking-optimizer, backlink-analyzer | Core Web Vitals, crawl issues, link profile |
| **04 Content Quality** | content-quality-auditor, content-refresher | CORE-EEAT score (80-item), refresh candidates |
| **05 Recommendations** | seo-content-writer, geo-content-optimizer, meta-tags-optimizer, schema-markup-generator | Content briefs, GEO actions, meta tags, JSON-LD |
| **06 Monitoring** | rank-tracker, performance-reporter, alert-manager | Keyword tracking setup, KPI baseline, alert config |
| **07 Memory** | memory-management | Campaign memory snapshot |

**Final output**: `analyses/<company>/<domain>/analysis-<timestamp>/` (20 handoff files) + one self-contained HTML report at `analyses/<company>/reports/`.

### HTML Report

Dark-mode, fully self-contained (no external dependencies). Tabs for each phase, color-coded scores, CITE verdict badge, CORE-EEAT dimension grid, and a prioritized 90-day action plan.

---

## Install

Skills and commands like `/geo:analyze-company` only work after you've installed this library once. Here's how depending on what tool you're using.

### Claude Code (recommended)

[Claude Code](https://claude.ai/download) is Anthropic's official CLI. If you haven't installed it yet, download it first.

**Step 1 — Download this library:**
```bash
git clone https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills.git
```

**Step 2 — Start Claude Code with the library loaded:**
```bash
claude --plugin-dir ./seo-geo-claude-skills
```

That's it. Every `/geo:` command is now available in your Claude session. You run this once per terminal session (or add it to a shell alias so you don't have to type it every time).

> If you don't have `git` installed, [download it here](https://git-scm.com/downloads). If you're on Mac, running `git` in Terminal for the first time will prompt you to install it automatically.

### Cursor / Windsurf / other Claude-compatible agents

```bash
npx skills add AnonymousGreekQuestionMark/seo-geo-claude-skills
```

This installs the skills into your agent's context. `npx` comes with Node.js — [download Node here](https://nodejs.org) if you don't have it.

---

## Quick Start

```bash
# Full company analysis — just provide a domain
/geo:analyze-company caplinq.com

# Analyze a subdomain separately
/geo:analyze-company blog.caplinq.com

# Include specific pages in the on-page audit
/geo:analyze-company acme.io pages="https://acme.io/product,https://acme.io/about"
```

Works in **Tier 1** (no MCP tools needed) using publicly available data. If Ahrefs, Amplitude, or other MCP servers are connected, skills use them automatically.

---

## Individual Skills

Use skills individually for targeted tasks — or let `company-analysis` chain them all.

### Orchestration

| Skill | What it does |
|-------|-------------|
| [company-analysis](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/orchestration/company-analysis/SKILL.md) | Runs all 20 skills in sequence, saves phase-organized results, generates HTML report |

### Research

| Skill | What it does |
|-------|-------------|
| [keyword-research](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/research/keyword-research/SKILL.md) | Discover keywords with intent analysis, difficulty scoring, and topic clustering |
| [competitor-analysis](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/research/competitor-analysis/SKILL.md) | Analyze competitor SEO/GEO strategies and find their weaknesses |
| [serp-analysis](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/research/serp-analysis/SKILL.md) | Analyze search results and AI answer patterns for target queries |
| [content-gap-analysis](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/research/content-gap-analysis/SKILL.md) | Find content opportunities your competitors cover but you don't |

### Build

| Skill | What it does |
|-------|-------------|
| [seo-content-writer](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/build/seo-content-writer/SKILL.md) | Write search-optimized content with proper structure and keyword placement |
| [geo-content-optimizer](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/build/geo-content-optimizer/SKILL.md) | Make content quotable and citable by AI systems |
| [meta-tags-optimizer](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/build/meta-tags-optimizer/SKILL.md) | Create compelling titles, descriptions, and Open Graph tags |
| [schema-markup-generator](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/build/schema-markup-generator/SKILL.md) | Generate JSON-LD structured data for rich results |

### Optimize

| Skill | What it does |
|-------|-------------|
| [on-page-seo-auditor](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/optimize/on-page-seo-auditor/SKILL.md) | Audit on-page elements with a scored report and fix recommendations |
| [technical-seo-checker](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/optimize/technical-seo-checker/SKILL.md) | Check crawlability, indexing, Core Web Vitals, and site architecture |
| [internal-linking-optimizer](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/optimize/internal-linking-optimizer/SKILL.md) | Optimize internal link structure for better crawling and authority flow |
| [content-refresher](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/optimize/content-refresher/SKILL.md) | Update outdated content to recover or improve rankings |

### Monitor

| Skill | What it does |
|-------|-------------|
| [rank-tracker](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/monitor/rank-tracker/SKILL.md) | Track keyword positions over time in both SERP and AI responses |
| [backlink-analyzer](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/monitor/backlink-analyzer/SKILL.md) | Analyze backlink profile, find opportunities, detect toxic links |
| [performance-reporter](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/monitor/performance-reporter/SKILL.md) | Generate SEO/GEO performance reports for stakeholders |
| [alert-manager](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/monitor/alert-manager/SKILL.md) | Set up alerts for ranking drops, traffic changes, and technical issues |

### Protocol Layer (cross-cutting)

| Skill | What it does |
|-------|-------------|
| [content-quality-auditor](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/cross-cutting/content-quality-auditor/SKILL.md) | 80-item CORE-EEAT publish readiness gate |
| [domain-authority-auditor](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/cross-cutting/domain-authority-auditor/SKILL.md) | 40-item CITE citation trust gate |
| [entity-optimizer](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/cross-cutting/entity-optimizer/SKILL.md) | Canonical entity profile for brand/entity truth |
| [memory-management](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/cross-cutting/memory-management/SKILL.md) | Campaign memory loop for durable context across sessions |

---

## Commands

One-shot tasks with explicit input and structured output.

| Command | Description |
|---------|-------------|
| `/geo:analyze-company <domain>` | Run all 20 skills end-to-end and generate an HTML report in `analyses/` |
| `/geo:audit-page <URL>` | On-page SEO + CORE-EEAT content quality audit |
| `/geo:audit-domain <domain>` | Full CITE domain authority audit (40-item) |
| `/geo:check-technical <URL>` | Technical SEO health check |
| `/geo:write-content <topic>` | Write SEO + GEO optimized content |
| `/geo:keyword-research <seed>` | Keyword discovery and clustering |
| `/geo:optimize-meta <URL>` | Optimize title, description, and OG tags |
| `/geo:generate-schema <type>` | Generate JSON-LD structured data |
| `/geo:report <domain> <period>` | SEO/GEO performance report |
| `/geo:setup-alert <metric>` | Configure monitoring alerts |

---

## Quality Frameworks

- **CORE-EEAT** (80 items, 8 dimensions) — content quality. GEO Score = CORE avg; SEO Score = EEAT avg. Three veto items: T04, C01, R10.
- **CITE** (40 items, 4 dimensions) — domain authority. Three veto items: T03, T05, T09.

Scores are color-coded throughout: green ≥80, amber 60–79, red <60.

---

## Other Start Points

| Goal | Command |
|------|---------|
| Audit a single page | `/geo:audit-page https://example.com/page` |
| Fix technical issues | `/geo:check-technical example.com` |
| Check domain authority | `/geo:audit-domain example.com` |
| Write new content | `/geo:write-content "your topic"` |
| Full company audit | `/geo:analyze-company example.com` |

---

## Operating Model

Every skill follows the same contract: trigger → quick start → skill contract → handoff → next best skill. Four skills form the protocol layer: `content-quality-auditor` (publish gate), `domain-authority-auditor` (trust gate), `entity-optimizer` (entity truth), `memory-management` (campaign memory).

Three-tier memory model keeps context across sessions: **HOT** (80 lines, auto-loaded) → **WARM** (on-demand) → **COLD** (archive).

References: [skill-contract.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/references/skill-contract.md) · [state-model.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/references/state-model.md)

---

## Contributing

See [CONTRIBUTING.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/CONTRIBUTING.md). Branch naming: `feature/skill-name`, `fix/skill-name`, `docs/description`. After updating a skill, update all 5 tracking files: `VERSIONS.md`, `.claude-plugin/plugin.json`, `marketplace.json`, `README.md`, and `CLAUDE.md`.

---

## Disclaimer

These skills assist with SEO and GEO workflows but do not guarantee search rankings, AI citations, or traffic results. Always verify recommendations before making significant changes to your content strategy.

## License

Apache License 2.0
