# Subscription Overview

Cost and capability breakdown for running the SEO & GEO Skills Library at three operating levels: free tier, product level (DIY paid APIs), and enterprise level (premium data subscriptions).

---

## Tier 1 — Free (Now)

Everything buildable with free accounts and the API keys you already have. Suitable for personal use, client demos, and 1–5 analyses per month.

| Capability | Tool | Free Limit | Constraint |
|-----------|------|-----------|-----------|
| AI citation monitoring | Anthropic + OpenAI + Gemini APIs | Pay-per-token (existing keys) | Perplexity requires $5 minimum |
| SERP analysis + rank tracking | Serper.dev | 2,500 queries/month | Resets monthly |
| Keyword + backlink data | DataForSEO | $1 trial credit | $50 prepaid required after trial |
| Page Speed / Core Web Vitals | Google PageSpeed Insights API | 25,000 requests/day | None in practice |
| Entity / Knowledge Graph | Wikidata SPARQL | 60s query time limit | Practical limit ~100 queries/min |
| Knowledge Graph (Google) | Google Knowledge Graph API | 100,000 reads/day | None in practice |
| Brand mention monitoring | Google Custom Search API | 100 queries/day | Low limit — enough for 5–10 brand checks |
| Open PageRank (basic DR) | Open PageRank API (domcop.com) | 10,000 calls/hour | None in practice |
| Schema validation | schema.org validator | Unlimited | None |
| Site crawl (technical audit) | Crawl4AI (local) | Unlimited | Runs on your machine; speed limited by hardware |
| Analytics / traffic | GA4 or GSC | Free | Site ownership required |

**What you cannot do at free tier:**
- Comprehensive backlink profiles (DataForSEO Backlinks API has a $100/month minimum)
- Traffic estimates for sites you don't own (no free third-party traffic API)
- More than 100 brand mention checks per day
- Automated competitor rank monitoring at scale

---

## Tier 2 — Product Level (DIY Paid APIs)

Switches the same self-built MCP servers to paid API tiers. No premium subscriptions — pure pay-per-use or low-commitment plans. Suitable for an agency or SaaS product running 10–500 analyses per month.

| Capability | Tool | Paid Model | Cost |
|-----------|------|-----------|------|
| AI citation monitoring | Claude Haiku 4.5 + GPT-4o-mini + Gemini Flash + Perplexity Sonar | Per token | See cost breakdown below |
| SERP analysis + rank tracking | Serper.dev Starter | $50 for 50,000 queries | $0.001/query |
| Keyword data (volume, KD) | DataForSEO Keywords Data API | Pay-per-query | $0.0006/query (standard) |
| Backlink profiles | DataForSEO Backlinks API | $100/month minimum + rows | $0.02/request + $0.00003/row |
| Domain metrics | DataForSEO Domain Analytics | Pay-per-query | $0.01/task |
| Traffic estimates (3rd party) | DataForSEO Traffic Analytics | Pay-per-query | ~$0.02/domain |
| Page Speed / CWV | Google PageSpeed Insights API | Free within 25k/day | $0.00 |
| Entity / Knowledge Graph | Wikidata + Google KG API | Free within 100k/day | $0.00 |
| Brand monitoring | Google Custom Search | $5/1,000 queries beyond 100/day | $0.005/query |
| Schema validation | schema.org validator | Unlimited free | $0.00 |
| Site crawl | Crawl4AI hosted (AWS/GCP) | Infrastructure cost | ~$0.001/page crawled |

**Upgrade notes:**
- DataForSEO covers keyword research, SERP, backlinks, rank tracking, and domain metrics under one account. The $100/month backlinks minimum only makes sense at ~50+ reports/month — below that, rely on Open PageRank (free) for basic DR and skip detailed backlink rows.
- Google Custom Search API is being shut down to new customers (January 2027 migration deadline). Alternative for brand monitoring at scale: DataForSEO's Mentions API.
- Crawl4AI self-hosting costs ($200–800/month AWS/GCP) only apply if running it as a hosted service. For personal/agency use, it runs free on your own machine.

---

## Tier 3 — Enterprise Level (Premium Subscriptions)

Switches to premium data vendors for the highest-accuracy backlink and traffic data. Relevant if selling to enterprise clients who require Ahrefs-grade data provenance or if running 1,000+ analyses per month.

| Capability | Tool | Model | Cost |
|-----------|------|-------|------|
| Backlink profiles (comprehensive) | Ahrefs API | Annual subscription | $1,499+/month (Enterprise tier) |
| Traffic estimation (highest accuracy) | SimilarWeb API | Negotiated annual | $75,000–$200,000+/year |
| AI citation monitoring (managed) | Otterly.ai | Monthly subscription | $29–$489/month by prompt volume |
| Everything else | Same as Tier 2 | — | Same as Tier 2 |

**Reality check on Tier 3:**
- Ahrefs and SimilarWeb are subscription-only with no per-query option. The economics only make sense at high volume (500+ reports/month) or when clients specifically require their data.
- Otterly.ai ($189/month for 100 prompts) costs more per citation check than building the AI citation monitor yourself using LLM APIs. The self-built version is better value at any scale.
- The Tier 2 DIY stack produces nearly equivalent output for 95% of use cases at 1/50th the cost.

---

## Cost Per Report Run — Breakdown

A "report run" = one full `/geo:analyze-company` execution: all 20 skills, 7 phase folders, HTML report.

Assumptions per run:
- 20 target queries for AI citation monitoring
- 50 keyword lookups
- 5 competitor domains analyzed
- 1 domain backlink check (100 rows)
- 20 SERP position checks
- 50 pages crawled for technical audit
- 10 brand mention queries

### Tier 1 — Free (within free limits)

| Component | Tool | Queries | Unit Cost | Run Cost |
|-----------|------|---------|-----------|----------|
| AI citation (Claude Haiku) | Anthropic API | 20 queries × ~1,500 tokens | $1/MTok in, $5/MTok out | $0.11 |
| AI citation (GPT-4o-mini) | OpenAI API | 20 queries × ~1,500 tokens | $0.15/MTok in, $0.60/MTok out | $0.02 |
| AI citation (Gemini Flash) | Google AI | 20 queries × ~1,500 tokens | $0.35/MTok in, $1.05/MTok out | $0.03 |
| AI citation (Perplexity Sonar) | Perplexity API | 20 queries + 20 web searches | $1/MTok + $0.005/search | $0.13 |
| SERP analysis | Serper.dev | 20 queries | Free tier | $0.00 |
| Keyword data | DataForSEO | 50 queries | Trial credit | ~$0.03 |
| Domain metrics | DataForSEO | 5 domains | Trial credit | ~$0.05 |
| Backlinks (basic) | Open PageRank | 1 domain | Free | $0.00 |
| Page Speed | Google PSI API | 5 URLs | Free | $0.00 |
| Entity check | Wikidata + Google KG | 5 queries | Free | $0.00 |
| Brand mentions | Google Custom Search | 10 queries | Free (within 100/day) | $0.00 |
| Schema validation | schema.org | 10 URLs | Free | $0.00 |
| Site crawl | Crawl4AI (local) | 50 pages | Free | $0.00 |
| **Total** | | | | **~$0.37** |

> Free tier is bounded by Serper.dev (2,500/month) and Google Custom Search (100/day). At 5 reports/month you stay well within limits.

---

### Tier 2 — Product Level (paid APIs, no premium subscriptions)

| Component | Tool | Queries | Unit Cost | Run Cost |
|-----------|------|---------|-----------|----------|
| AI citation (all 4 engines) | LLM APIs | 20 queries each | Same as Tier 1 | $0.29 |
| SERP analysis | Serper.dev | 20 queries | $0.001/query | $0.02 |
| Keyword data | DataForSEO | 50 queries | $0.0006/query | $0.03 |
| Competitor SERP | DataForSEO | 20 queries × 5 competitors | $0.0006/query | $0.06 |
| Domain metrics | DataForSEO | 5 domains | $0.01/task | $0.05 |
| Backlinks (full) | DataForSEO | 1 domain + 100 rows | $0.02 + 100×$0.00003 | $0.023 |
| Traffic estimate | DataForSEO | 1 domain | ~$0.02/domain | $0.02 |
| Rank tracking | DataForSEO | 20 keywords | $0.0006/query | $0.012 |
| Page Speed | Google PSI | 5 URLs | Free | $0.00 |
| Entity + KG | Wikidata + Google KG | 5 queries | Free | $0.00 |
| Brand mentions | Google Custom Search | 10 queries | $0.005/query (beyond free) | $0.05 |
| Schema validation | schema.org | 10 URLs | Free | $0.00 |
| Site crawl | Crawl4AI (hosted) | 50 pages | $0.001/page | $0.05 |
| **Total** | | | | **~$0.58** |

> DataForSEO Backlinks API has a $100/month minimum commitment. At fewer than 50 reports/month, use Open PageRank (free) for basic DR and skip detailed backlink rows to avoid the minimum. Blended cost rises to ~$0.75 if the backlinks minimum is amortized over 10 reports/month ($0.17 overhead per report).

---

### Tier 3 — Enterprise Level (premium subscriptions included)

| Component | Tool | Model | Monthly Cost | Per-Report (100 runs/month) |
|-----------|------|-------|-------------|----------------------------|
| Backlinks + keywords | Ahrefs API Enterprise | Subscription | $1,499/month | $14.99 |
| Traffic estimation | SimilarWeb API | Negotiated | ~$6,250/month (low-end annual) | $62.50 |
| AI citation (managed) | Otterly.ai Standard | Subscription | $189/month | $1.89 |
| All other APIs | Same as Tier 2 | Pay-per-use | ~$0.29/report | $0.29 |
| **Total** | | | **~$7,938/month** | **~$79.67/report** |

> At 100 reports/month, Tier 3 costs $79.67/report vs $0.58 at Tier 2 — a 137× price difference for marginal data quality improvement. Tier 3 only makes economic sense when selling to enterprise clients who require Ahrefs/SimilarWeb data provenance in contracts, or when running 1,000+ reports/month (which spreads the subscription costs).

---

## Summary: Which Tier for Which Use Case

| Use Case | Recommended Tier | Cost/Report | Monthly (est.) |
|----------|-----------------|-------------|----------------|
| Personal use / learning | Tier 1 (free) | ~$0.37 | <$5 |
| Freelance / agency (1–10 clients) | Tier 1–2 | $0.37–$0.58 | $5–$30 |
| SaaS product (10–100 clients) | Tier 2 | ~$0.58–$0.75 | $50–$500 |
| Enterprise SaaS (100+ clients) | Tier 2 + selective Tier 3 | $1–$5 | $500–$5,000 |
| Full Tier 3 | Only if clients contractually require Ahrefs/SimilarWeb | ~$79 | $7,500+ |

**Key decision point**: Tier 2 DIY stack (DataForSEO + self-built AI citation monitor + free APIs) produces 90–95% of the output quality of Tier 3 at roughly 1% of the cost per report. Move to Tier 3 only when a specific client contract or data quality requirement forces it.

---

## API Keys Required Per Tier

### Tier 1
| Key | Service | Cost |
|-----|---------|------|
| `GOOGLE_API_KEY` | Google Cloud (KG + PSI + Custom Search) | Free |
| `SERPER_API_KEY` | Serper.dev | Free (2,500/month) |
| `OPR_API_KEY` | Open PageRank (domcop.com) | Free |
| `OPENAI_API_KEY` | OpenAI | $5 free credit |
| `GEMINI_API_KEY` | Google AI Studio | Free tier |
| `PERPLEXITY_API_KEY` | Perplexity | $5 minimum |
| `ANTHROPIC_API_KEY` | Anthropic | Already have (Claude Code) |

### Tier 2 (adds to Tier 1)
| Key | Service | Cost |
|-----|---------|------|
| `DATAFORSEO_LOGIN` | DataForSEO | $50 prepaid (no expiry) |
| `DATAFORSEO_PASSWORD` | DataForSEO | — |

### Tier 3 (adds to Tier 2)
| Key | Service | Cost |
|-----|---------|------|
| `AHREFS_API_KEY` | Ahrefs Enterprise API | $1,499+/month |
| `SIMILARWEB_API_KEY` | SimilarWeb Enterprise | $75,000+/year |
| `OTTERLY_API_KEY` | Otterly.ai | $29–$489/month |
