# Prompting Documentation

> SEO & GEO Skills Library — AI Citation Monitor Prompts

This document details all prompts sent to external LLM engines during company-analysis runs, when they execute, and how many times each is called.

---

## LLM Engines Used

| Engine | Model | API Endpoint | Live Search | Cost |
|--------|-------|--------------|-------------|------|
| Perplexity | sonar | api.perplexity.ai | Yes | $1/MTok + $0.005/search |
| Anthropic Claude | claude-haiku-4-5-20251001 | api.anthropic.com | Optional ($10/1k) | $0.25/MTok in, $1.25/MTok out |
| OpenAI GPT | gpt-4o-search-preview | api.openai.com | Yes | $2.50/MTok in, $10/MTok out |
| Google Gemini | gemini-2.0-flash | generativelanguage.googleapis.com | Yes | Free tier / $0.075/MTok |

All engines are **optional** — the system gracefully degrades to manual checks if API keys are not configured.

---

## Prompt Templates

### CITATION_PROMPT

**Location**: `tools/mcp-servers/ai-citation-monitor.js:23-24`

**Used by**: Perplexity, OpenAI, Gemini, and Anthropic (with web search enabled)

**Template**:
```
Answer this question as helpfully as possible: "{query}"

As part of your response, please mention any specific websites or domains that are authoritative sources on this topic. Include URLs or domain names where relevant.
```

**Parameters**:
- `{query}`: The niche or brand query (e.g., "what is a gas diffusion layer")

**Purpose**: Encourages the LLM to cite authoritative sources, allowing detection of whether the target domain is mentioned in AI-generated responses.

---

### AWARENESS_PROMPT

**Location**: `tools/mcp-servers/ai-citation-monitor.js:26-27`

**Used by**: Anthropic Claude when `ANTHROPIC_WEB_SEARCH=false`

**Template**:
```
I'm researching: "{query}". What websites or domains are authoritative sources on this topic? Please list specific domain names you know about. Does {domain} appear in your knowledge as a relevant source?
```

**Parameters**:
- `{query}`: The topic query
- `{domain}`: The target domain being analyzed (e.g., "caplinq.com")

**Purpose**: Tests brand awareness in training data — whether the LLM "knows" about a domain from its pre-training, even without live web search.

---

## MCP Tools and When They Run

### check_citations

**Pipeline Step**: 1.5 (citation-baseline)  
**Skill**: citation-baseline  
**Queries per run**: 8-10  
**Engines queried**: All 4 (Perplexity, Anthropic, OpenAI, Gemini)  
**Total LLM calls**: 32-40 per analysis

**Query composition**:
- 1x Brand name alone (e.g., "CAPLINQ")
- 1x Brand + primary product category (e.g., "CAPLINQ carbon paper")
- 6-8x Top niche queries the company should be cited for

**CITE mapping**: Feeds C05 (AI Citation Frequency), C06 (Prominence), C07 (Cross-Engine)

---

### compare_competitor_citations

**Pipeline Step**: 3 (competitor-analysis)  
**Skill**: competitor-analysis  
**Queries per run**: 5-10  
**Engines queried**: All 4  
**Total LLM calls**: 20-40 per analysis

**Query composition**:
- Topic queries comparing target domain vs competitors
- Example: "best thermal interface material supplier"

**Output**: Citation share per domain, gaps where competitors win but target does not

---

### get_ai_response_format

**Pipeline Steps**: On-request only (not part of baseline company-analysis)  
**Skills**: seo-content-writer, geo-content-optimizer  
**Queries per run**: 1-5  
**Engines queried**: 1 (Perplexity preferred, then OpenAI, Gemini, Anthropic)  
**Total LLM calls**: 0 in baseline analysis; 1-5 when actively writing content

**When used**: Called when a user is actively writing or optimizing content and wants to match how AI engines format their responses. Not called during the 21-step company-analysis baseline audit.

**Query templates** (geo-content-optimizer):
- "What is [topic]?"
- "How does [topic] work?"
- "Why is [topic] important?"
- "[Topic] vs [alternative]"
- "Best [topic] for [use case]"

**Output**: Response format analysis (paragraph/list/table, word count, starts with direct answer)

---

### track_citation_snapshot

**Pipeline Steps**: 17 (rank-tracker), 18 (performance-reporter), 19 (alert-manager)  
**Skills**: rank-tracker, performance-reporter, alert-manager  
**Queries per run**: 8-10 each  
**Engines queried**: All 4  
**Total LLM calls**: 96-120 per analysis (32-40 x 3 skills)

**Purpose**: Timestamped snapshot of citation state for tracking gains/losses over time

---

## Execution Summary Table

| Step | Skill | MCP Tool | Queries | Engines | Calls |
|------|-------|----------|---------|---------|-------|
| 1.5 | citation-baseline | check_citations | 8-10 | 4 | 32-40 |
| 3 | competitor-analysis | compare_competitor_citations | 5-10 | 4 | 20-40 |
| 13 | seo-content-writer | — | — | — | 0 (recommendations only) |
| 14 | geo-content-optimizer | — | — | — | 0 (recommendations only) |
| 17 | rank-tracker | track_citation_snapshot | 8-10 | 4 | 32-40 |
| 18 | performance-reporter | track_citation_snapshot | 8-10 | 4 | 32-40 |
| 19 | alert-manager | track_citation_snapshot | 8-10 | 4 | 32-40 |

**Total LLM calls per baseline analysis**: ~148-200 (at Tier 2/3 with all engines configured)

**On-request tools** (not in baseline):
- `get_ai_response_format`: 1-5 calls when actively writing content

---

## Query Patterns by Use Case

### Baseline Analysis Queries

#### Brand Awareness (citation-baseline, Step 1.5)
```
"CAPLINQ"
"CAPLINQ carbon paper"
"gas diffusion layer manufacturer"
"GDL for fuel cells"
"thermal interface materials supplier"
"conductive adhesives for electronics"
"PFAS-free GDL alternatives"
"fuel cell components supplier Europe"
```

#### Competitor Comparison (competitor-analysis, Step 3)
```
"best thermal interface material supplier"
"fuel cell GDL suppliers comparison"
"where to buy carbon paper for fuel cells"
"top specialty chemicals distributors"
```

### On-Request Queries (not in baseline)

#### Content Format Analysis (geo-content-optimizer)
Used when actively writing content to match AI response formats:
```
"What is a gas diffusion layer?"
"How does a fuel cell GDL work?"
"Why is thermal conductivity important for electronics?"
"Carbon paper vs carbon cloth for fuel cells"
"Best GDL for PEM fuel cells"
```

---

## Tier Handling

### Tier 2/3 (MCP tools connected)
- All prompts executed automatically via `ai-citation-monitor` MCP server
- Full responses logged to `prompt-results.json`
- HTML report Tab 8 displays all prompts and responses

### Tier 1 (No MCP tools)
- MCP tools return `tier1Manual` fallback
- Returns instructions for user to execute queries manually:
  ```
  Perplexity: https://www.perplexity.ai — search "{query}", check if {domain} appears in citations
  ChatGPT: https://chatgpt.com — ask "{query}", check if {domain} is mentioned
  Claude.ai: https://claude.ai — ask "{query}", check if {domain} is mentioned
  ```
- Appendix logs these as `source: "manual_required"` entries

---

## Output Files

### prompt-results.json

**Location**: `analyses/<company-root>/<domain>/analysis-<timestamp>/prompt-results.json`

**Structure**:
```json
{
  "analysis_metadata": {
    "domain": "caplinq.com",
    "timestamp": "20260412T140000",
    "tier": 2,
    "version": "6.5.0"
  },
  "prompt_results": [
    {
      "step": "1.5",
      "skill": "citation-baseline",
      "tool": "check_citations",
      "timestamp_utc": "2026-04-12T14:02:34Z",
      "engine": "perplexity",
      "model": "sonar",
      "live_search": true,
      "prompt": {
        "type": "CITATION_PROMPT",
        "query": "what is a gas diffusion layer",
        "domain": "caplinq.com"
      },
      "response": {
        "full_text": "A gas diffusion layer (GDL) is...",
        "excerpt": "A gas diffusion layer (GDL) is...",
        "word_count": 245,
        "citations": ["https://example.com/gdl"],
        "domain_cited": true
      }
    }
  ],
  "webfetch_calls": [
    {
      "step": "1",
      "skill": "entity-optimizer",
      "url": "https://caplinq.com/",
      "timestamp_utc": "2026-04-12T14:01:12Z",
      "status": 200,
      "content_type": "text/html",
      "response_length": 45230
    }
  ],
  "summary": {
    "total_llm_calls": 156,
    "by_engine": {
      "perplexity": 40,
      "anthropic": 40,
      "openai": 40,
      "gemini": 36
    },
    "total_webfetch_calls": 15,
    "total_tokens_estimated": 25000
  }
}
```

### HTML Report Tab 8 (Prompt Appendix)

- Collapsible sections by engine
- Full prompt text displayed
- Full response text displayed (scrollable, max-height 300px)
- Citation findings per query (domain cited, citation count, rate)
- WebFetch calls table (URL, status, size)

### score-provenance.json

**Location**: `analyses/<company-root>/<domain>/analysis-<timestamp>/score-provenance.json`

**Purpose**: Full auditability — traces every CITE and CORE-EEAT score to its source data.

**Structure**:
```json
{
  "analysis_metadata": {
    "domain": "caplinq.com",
    "timestamp": "20260412T140000",
    "version": "1.2.0"
  },
  "cite_provenance": {
    "overall": { "score": 52, "verdict": "CAUTIOUS" },
    "dimensions": {
      "C": {
        "score": 55,
        "items": [
          {
            "id": "C02",
            "name": "Referring Domain Count",
            "score": 60,
            "source_skill": "backlink-analyzer",
            "source_step": 9,
            "raw_data": "234 referring domains",
            "calculation": "234 RDs → 60/100 (threshold: 500+ for 80+)"
          }
        ]
      }
    }
  },
  "core_eeat_provenance": {
    "geo_score": 69,
    "seo_score": 69,
    "dimensions": { ... }
  },
  "feeder_chain": [
    { "target": "CITE C02/C04/C10/T01/T02", "source": "backlink-analyzer (step 9)" },
    { "target": "CITE C05-C08", "source": "citation-baseline (step 1.5)" }
  ]
}
```

**Key fields per item**:
- `source_skill`: Which skill produced the data
- `source_step`: Pipeline step number
- `raw_data`: The actual data point extracted
- `calculation`: How raw data was converted to score

---

## Environment Variables

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `PERPLEXITY_API_KEY` | No | — | Most accurate for current citations (live web) |
| `ANTHROPIC_API_KEY` | No | — | Already set in Claude Code |
| `ANTHROPIC_WEB_SEARCH` | No | false | Set to `true` for live search ($10/1k) |
| `OPENAI_API_KEY` | No | — | Uses gpt-4o-search-preview |
| `GEMINI_API_KEY` | No | — | Free tier available |

At least one engine must be configured for Tier 2/3 operation.

---

## Related Files

- **MCP Server**: `tools/mcp-servers/ai-citation-monitor.js`
- **Config**: `tools/shared/config.js`
- **Orchestration**: `orchestration/company-analysis/SKILL.md`
- **CITE Framework**: `references/cite-domain-rating.md` (C05-C08 = AI citations)
