---
skill: citation-baseline
phase: 01
step: 1.5
status: DONE
timestamp: 20260412T175045
domain: caplinq.com
---

## Handoff Summary — citation-baseline

- **Status**: DONE
- **Objective**: Measure AI citation frequency for caplinq.com across multiple LLM engines with web search
- **Key Findings**: OpenAI cites caplinq.com on 4/4 test queries; Anthropic 1/4; Gemini 0/4. Strong presence on OpenAI, improvement needed on other engines.
- **Evidence**: 4 queries tested across 3 engines (OpenAI gpt-4o-search-preview, Anthropic claude-sonnet-4-5, Gemini gemini-2.5-flash)
- **Open Loops**: None - all engines responded successfully
- **Maps to**: CITE C05 (AI Citation Frequency), C06 (Citation Prominence), C07 (Cross-Engine Consistency)
- **Recommended Next Skill**: entity-optimizer
- **Scores**:
  - CITE C05: PASS (cited on 4/4 queries by at least one engine)
  - CITE C07: PASS (cited by 2/3 engines)

## Full Findings

### Engines Tested
| Engine | Model | Web Search | Status |
|--------|-------|------------|--------|
| OpenAI | gpt-4o-search-preview | Yes | ✓ Working |
| Anthropic | claude-sonnet-4-5 | Yes | ✓ Working |
| Gemini | gemini-2.5-flash | Yes (Google Search) | ✓ Working |
| Perplexity | - | - | Skipped (no API key) |

### Query Results

| Query | OpenAI | Anthropic | Gemini | Any Citation |
|-------|--------|-----------|--------|--------------|
| CAPLINQ specialty chemicals | ✓ | ✗ | ✗ | Yes |
| thermal interface materials supplier | ✓ | ✓ | ✗ | Yes |
| gas diffusion layer carbon paper | ✓ | ✗ | ✗ | Yes |
| semiconductor mold compounds Europe | ✓ | ✗ | ✗ | Yes |

### Citation Summary
- **Total queries tested**: 4
- **Queries with any citation**: 4/4 (100%)
- **OpenAI citation rate**: 4/4 (100%)
- **Anthropic citation rate**: 1/4 (25%)
- **Gemini citation rate**: 0/4 (0%)

### Insights
1. **OpenAI Strong**: caplinq.com is well-indexed in OpenAI's search sources
2. **Anthropic Partial**: Only cited for "thermal interface materials" - opportunity for GEO optimization
3. **Gemini Gap**: Not citing caplinq.com despite Google Search integration - content may not be optimized for Google's AI features

### Recommendations
- P1: Optimize content for Gemini/Google AI features (structured data, FAQ schema)
- P2: Increase brand mentions across web to improve Anthropic citation
- P3: Monitor citation trends as models update
