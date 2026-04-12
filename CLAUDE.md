# SEO & GEO Skills Library — Claude Code Context

This plugin provides **21 skills and 10 commands** for Search Engine Optimization (SEO) and Generative Engine Optimization (GEO). All skills follow one shared contract: trigger, quick start, skill contract, handoff summary, and next best skill. Skills are auto-loaded by context; commands are invoked with `/seo:` (or `/geo:` for the company analysis command).

## Skills by Phase

| Phase | Skills |
|-------|--------|
| **Research** | `keyword-research`, `competitor-analysis`, `serp-analysis`, `content-gap-analysis` |
| **Build** | `seo-content-writer`, `geo-content-optimizer`, `meta-tags-optimizer`, `schema-markup-generator` |
| **Optimize** | `on-page-seo-auditor`, `technical-seo-checker`, `internal-linking-optimizer`, `content-refresher` |
| **Monitor** | `rank-tracker`, `backlink-analyzer`, `performance-reporter`, `alert-manager` |
| **Cross-cutting / Protocol** | `content-quality-auditor`, `domain-authority-auditor`, `entity-optimizer`, `memory-management` |
| **Orchestration** | `company-analysis` |

## One-Shot Commands

```
/seo:audit-page        — On-page SEO + CORE-EEAT audit
/seo:audit-domain      — CITE domain authority audit
/seo:check-technical   — Technical SEO health check
/seo:write-content     — SEO + GEO optimized content
/seo:keyword-research  — Keyword discovery and clustering
/seo:optimize-meta     — Title tags and meta descriptions
/seo:generate-schema   — JSON-LD structured data
/seo:report            — Performance report
/seo:setup-alert       — Monitoring alert configuration
/geo:analyze-company   — Full company analysis (all 20 skills) + HTML report
```

## Company-Wide Analysis Workflow

Run all 20 skills against a company domain in one command:

```
/geo:analyze-company caplinq.com
/geo:analyze-company blog.caplinq.com
```

**URL parsing**: strips scheme and path; extracts company root from apex domain (`blog.caplinq.com` → root `caplinq`).

**Output structure:**
```
analyses/
  <company-root>/           # apex domain root (e.g. "caplinq")
    <domain>/               # exact hostname analyzed (e.g. "caplinq.com")
      analysis-<timestamp>/ # YYYYMMDDTHHmmss timestamped run folder
        01-domain-baseline/ # entity-optimizer (+ citation-baseline step)
        02-research/        # keyword-research, competitor-analysis, serp-analysis, content-gap-analysis
        03-technical/       # technical-seo-checker, on-page-seo-auditor, internal-linking-optimizer, backlink-analyzer, domain-authority-auditor
        04-content/         # content-quality-auditor, content-refresher
        05-recommendations/ # seo-content-writer, geo-content-optimizer, meta-tags-optimizer, schema-markup-generator
        06-monitoring/      # rank-tracker, performance-reporter, alert-manager
        07-memory/          # memory-management snapshot
    reports/                # self-contained HTML reports
      <company-root>_<domain>_<timestamp>.html
```

**Skill execution order**: entity-optimizer → keyword-research → competitor-analysis → serp-analysis → content-gap-analysis → technical-seo-checker → on-page-seo-auditor → internal-linking-optimizer → backlink-analyzer → domain-authority-auditor → content-quality-auditor → content-refresher → seo-content-writer → geo-content-optimizer → meta-tags-optimizer → schema-markup-generator → rank-tracker → performance-reporter → alert-manager → memory-management → HTML report.

**Note**: domain-authority-auditor runs after backlink-analyzer and technical-seo-checker so it can read real CITE C/T dimension data from those feeders rather than estimating from scratch.

**Skill**: [orchestration/company-analysis/SKILL.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/orchestration/company-analysis/SKILL.md)

## Quality Frameworks

- **CORE-EEAT** ([references/core-eeat-benchmark.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/references/core-eeat-benchmark.md)): 80-item content quality framework (8 dimensions). GEO Score = CORE avg; SEO Score = EEAT avg. Three veto items: T04, C01, R10.
- **CITE** ([references/cite-domain-rating.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/references/cite-domain-rating.md)): 40-item domain authority framework (4 dimensions). Three veto items: T03, T05, T09.

## Operating Contract

- Shared contract reference: [references/skill-contract.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/references/skill-contract.md)
- Shared state model: [references/state-model.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/references/state-model.md)
- Protocol roles:
  - `content-quality-auditor` = publish readiness gate
  - `domain-authority-auditor` = citation trust gate
  - `entity-optimizer` = canonical entity profile
  - `memory-management` = campaign memory loop
- Hook automation: `hooks/hooks.json` — prompt-based hooks for SessionStart, UserPromptSubmit, PostToolUse, Stop
- Temperature memory: HOT (`memory/hot-cache.md`, 80 lines, auto-loaded) / WARM (`memory/` subdirs) / COLD (`memory/archive/`)
- Dual truncation: HOT tier limited to 80 lines AND 25KB (whichever triggers first)

## Inter-Skill Handoff

When a skill recommends running another, pass: objective, key findings/output, evidence, open loops, target keyword, content type, completion status (DONE/DONE_WITH_CONCERNS/BLOCKED/NEEDS_INPUT), CORE-EEAT dimension scores (e.g., `C:75 O:60 R:80 E:45`), CITE scores, priority item IDs, and content URL.

If `memory-management` is active, prior audit results load automatically from the hot cache in this [CLAUDE.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/CLAUDE.md) file.

## Tool Connector Pattern

Skills use `~~category` placeholders (e.g., `~~SEO tool`, `~~analytics`). Every skill works without any integrations (Tier 1). MCP servers in `.mcp.json` add Ahrefs, SimilarWeb, HubSpot, Amplitude, Notion, Slack.

## Contribution Rules

- All `SKILL.md` files must include: `name`, `version`, `description`, `license`, `compatibility`, `metadata` frontmatter. Recommended: `when_to_use` (underscores, not hyphens) and `argument-hint`.
- `plugin.json` must include: `schemaVersion`, `id`, and `description` on every command and skill entry
- Keep `SKILL.md` body under 350 lines — move detail to `references/` subdirectories
- After updating a skill: update all 5 tracking files — `VERSIONS.md`, `.claude-plugin/plugin.json`, `marketplace.json` (repo root), `README.md` skills table, and this `CLAUDE.md` category table. For orchestration skills, also update the "Company-Wide Analysis Workflow" section above.
- Keep the shared contract and state-model language consistent with `references/skill-contract.md` and `references/state-model.md`
- Branch naming: `feature/skill-name`, `fix/skill-name`, `docs/description`

> [AGENTS.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/AGENTS.md) · [README.md](https://github.com/AnonymousGreekQuestionMark/seo-geo-claude-skills/blob/main/README.md) · Install: [ClawHub](https://clawhub.ai/u/AnonymousGreekQuestionMark) · [skills.sh](https://skills.sh/AnonymousGreekQuestionMark/seo-geo-claude-skills)
