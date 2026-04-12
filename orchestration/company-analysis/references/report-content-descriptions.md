# Report Section Descriptions

> Reference file for HTML tooltips and PDF section introductions.
> Used by Step 21 (HTML) and Step 21.7 (PDF) in company-analysis orchestration.

## Section Descriptions (2-line summaries for PDF)

### Executive Summary
Your company's overall digital health at a glance. This section shows domain authority scores, content quality ratings, and the most critical findings requiring immediate attention.

### Domain Baseline
How search engines and AI systems recognize your company as an entity. Strong entity signals help your content appear in Knowledge Panels, AI-generated answers, and featured snippets.

### Research
Keyword opportunities, competitive positioning, and content gaps in your market. This analysis identifies where you can win traffic, visibility, and AI citations from your target audience.

### Technical
Website performance, crawlability, and search engine accessibility issues. Technical problems can prevent even excellent content from ranking well or being cited by AI systems.

### Content Quality
How well your content meets both human reader needs and AI citation criteria. High-quality, verifiable content gets cited by AI assistants and ranks better in traditional search.

### Recommendations
Prioritized improvements with specific implementation guidance for your team. Each recommendation maps to a measurable improvement in your visibility and authority scores.

### Monitoring
Tracking setup for keyword rankings, traffic trends, and AI citation frequency. Ongoing monitoring catches problems early and measures the impact of your improvements.

### Next Steps
Your 90-day action plan with priorities and expected impact estimates. Start with P0 (critical) items for the fastest improvements to your digital presence.

---

## Tooltip Text (hover descriptions for HTML)

Use these as `data-tooltip` attribute values on section `<h2>` headers.

| Section | Tooltip Text |
|---------|-------------|
| `executive_summary` | Overview of domain authority (CITE) and content quality (CORE-EEAT) scores with the most critical findings requiring action. |
| `domain_baseline` | Entity recognition status across search engines, knowledge graphs, and AI systems like ChatGPT and Perplexity. |
| `research` | Keyword opportunities, competitive gaps, and search result features you should target for maximum visibility. |
| `technical` | Crawlability, page speed, mobile optimization, and URL structure issues that affect search rankings. |
| `content_quality` | AI citation readiness (GEO signals) and credibility factors (EEAT) that determine content authority. |
| `recommendations` | Schema markup, meta tags, and content optimization priorities with implementation guidance. |
| `monitoring` | Keyword tracking, citation monitoring, and alert configuration for ongoing measurement. |
| `next_steps` | Prioritized 90-day roadmap with effort estimates and expected impact for each action item. |
| `prompt_appendix` | Raw AI queries, responses, and citation data used to generate this analysis. |

---

## Score Threshold Explanations (for tooltips and PDF)

### CITE Verdict (Domain Authority)
| Verdict | Score Range | Meaning |
|---------|-------------|---------|
| TRUSTED | 70-100 | Strong domain authority; AI systems and search engines confidently cite this source |
| CAUTIOUS | 50-69 | Moderate authority; some trust signals present but gaps exist |
| UNTRUSTED | 0-49 | Weak authority; significant improvements needed before reliable citations |

### CORE-EEAT Scores (Content Quality)
| Score | Meaning |
|-------|---------|
| 80-100 | Excellent — content meets highest quality standards |
| 60-79 | Good — solid foundation with room for improvement |
| 40-59 | Fair — notable gaps that limit visibility |
| 0-39 | Poor — significant quality issues need addressing |

### Priority Levels (Action Plan)
| Priority | Timeline | Description |
|----------|----------|-------------|
| P0 | This week | Critical issues blocking visibility or trust |
| P1 | This month | High-impact improvements with clear ROI |
| P2 | This quarter | Important but not urgent optimizations |
| P3 | Backlog | Nice-to-have enhancements when capacity allows |
