/**
 * Tests for score-provenance.json and prompt-results.json validation
 * Ensures full auditability of scores and LLM calls in company-analysis
 */
import { describe, it, expect } from 'vitest';

// Valid CITE dimension codes
const CITE_DIMENSIONS = ['C', 'I', 'T', 'E'];

// Valid CORE-EEAT dimension codes
const CORE_DIMENSIONS = ['C', 'O', 'R', 'E', 'Exp', 'Ept', 'A', 'T'];

// Valid CITE verdicts
const CITE_VERDICTS = ['TRUSTED', 'CAUTIOUS', 'UNTRUSTED'];

// Skills that can be sources for scores
const VALID_SOURCE_SKILLS = [
  'entity-optimizer', 'citation-baseline', 'keyword-research', 'competitor-analysis',
  'serp-analysis', 'content-gap-analysis', 'technical-seo-checker', 'on-page-seo-auditor',
  'internal-linking-optimizer', 'backlink-analyzer', 'domain-authority-auditor',
  'content-quality-auditor', 'content-refresher', 'seo-content-writer',
  'geo-content-optimizer', 'meta-tags-optimizer', 'schema-markup-generator',
  'rank-tracker', 'performance-reporter', 'alert-manager', 'memory-management',
  'estimated' // for items without feeder data
];

// LLM engines used in ai-citation-monitor
const VALID_LLM_ENGINES = ['perplexity', 'anthropic', 'openai', 'gemini'];

/**
 * Validate score-provenance.json structure
 */
function validateScoreProvenance(provenance) {
  const errors = [];

  // Check required top-level fields
  if (!provenance.analysis_metadata) {
    errors.push('Missing analysis_metadata');
  } else {
    if (!provenance.analysis_metadata.domain) errors.push('Missing analysis_metadata.domain');
    if (!provenance.analysis_metadata.timestamp) errors.push('Missing analysis_metadata.timestamp');
    if (!provenance.analysis_metadata.version) errors.push('Missing analysis_metadata.version');
  }

  // Check CITE provenance
  if (!provenance.cite_provenance) {
    errors.push('Missing cite_provenance');
  } else {
    if (provenance.cite_provenance.overall?.verdict &&
        !CITE_VERDICTS.includes(provenance.cite_provenance.overall.verdict)) {
      errors.push(`Invalid CITE verdict: ${provenance.cite_provenance.overall.verdict}`);
    }

    // Check each dimension has items
    if (provenance.cite_provenance.dimensions) {
      CITE_DIMENSIONS.forEach(dim => {
        if (!provenance.cite_provenance.dimensions[dim]) {
          errors.push(`Missing CITE dimension: ${dim}`);
        }
      });
    }
  }

  // Check CORE-EEAT provenance
  if (!provenance.core_eeat_provenance) {
    errors.push('Missing core_eeat_provenance');
  } else {
    if (provenance.core_eeat_provenance.geo_score === undefined) {
      errors.push('Missing core_eeat_provenance.geo_score');
    }
    if (provenance.core_eeat_provenance.seo_score === undefined) {
      errors.push('Missing core_eeat_provenance.seo_score');
    }
  }

  // Check feeder chain
  if (!provenance.feeder_chain || !Array.isArray(provenance.feeder_chain)) {
    errors.push('Missing or invalid feeder_chain array');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a single score item in provenance
 */
function validateScoreItem(item) {
  const errors = [];

  if (!item.id) errors.push('Missing item.id');
  if (!item.name) errors.push('Missing item.name');
  if (item.score === undefined) errors.push('Missing item.score');
  if (!item.source_skill) {
    errors.push('Missing item.source_skill');
  } else if (!VALID_SOURCE_SKILLS.includes(item.source_skill)) {
    errors.push(`Invalid source_skill: ${item.source_skill}`);
  }
  if (item.source_step === undefined && item.source_skill !== 'estimated') {
    errors.push('Missing item.source_step');
  }
  if (!item.raw_data) errors.push('Missing item.raw_data');
  if (!item.calculation) errors.push('Missing item.calculation');

  return { valid: errors.length === 0, errors };
}

/**
 * Validate prompt-results.json structure
 */
function validatePromptResults(results) {
  const errors = [];

  // Check required top-level fields
  if (!results.analysis_metadata) {
    errors.push('Missing analysis_metadata');
  }

  if (!results.prompt_results || !Array.isArray(results.prompt_results)) {
    errors.push('Missing or invalid prompt_results array');
  }

  if (!results.webfetch_calls || !Array.isArray(results.webfetch_calls)) {
    errors.push('Missing or invalid webfetch_calls array');
  }

  // Validate individual prompt results
  if (results.prompt_results) {
    results.prompt_results.forEach((pr, idx) => {
      if (!pr.step) errors.push(`prompt_results[${idx}]: Missing step`);
      if (!pr.skill) errors.push(`prompt_results[${idx}]: Missing skill`);
      if (!pr.engine) {
        errors.push(`prompt_results[${idx}]: Missing engine`);
      } else if (!VALID_LLM_ENGINES.includes(pr.engine) && pr.source !== 'manual_required') {
        errors.push(`prompt_results[${idx}]: Invalid engine: ${pr.engine}`);
      }
      if (!pr.prompt) errors.push(`prompt_results[${idx}]: Missing prompt`);
      if (!pr.response && pr.source !== 'manual_required') {
        errors.push(`prompt_results[${idx}]: Missing response`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

describe('Score Provenance Validation', () => {
  const sampleProvenance = {
    analysis_metadata: {
      domain: 'caplinq.com',
      timestamp: '20260412T140000',
      version: '1.2.0'
    },
    cite_provenance: {
      overall: { score: 52, verdict: 'CAUTIOUS' },
      dimensions: {
        C: {
          score: 55,
          items: [
            {
              id: 'C02',
              name: 'Referring Domain Count',
              score: 60,
              source_skill: 'backlink-analyzer',
              source_step: 9,
              raw_data: '234 referring domains',
              calculation: '234 RDs → 60/100 (threshold: 500+ for 80+)'
            }
          ]
        },
        I: { score: 35, items: [] },
        T: { score: 65, items: [] },
        E: { score: 52, items: [] }
      }
    },
    core_eeat_provenance: {
      geo_score: 69,
      seo_score: 69,
      dimensions: {}
    },
    feeder_chain: [
      { target: 'CITE C02/C04/C10/T01/T02', source: 'backlink-analyzer (step 9)' },
      { target: 'CITE C05-C08', source: 'citation-baseline (step 1.5)' }
    ]
  };

  describe('validateScoreProvenance', () => {
    it('valid provenance passes validation', () => {
      const { valid, errors } = validateScoreProvenance(sampleProvenance);
      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('detects missing analysis_metadata', () => {
      const invalid = { ...sampleProvenance };
      delete invalid.analysis_metadata;
      const { valid, errors } = validateScoreProvenance(invalid);
      expect(valid).toBe(false);
      expect(errors).toContain('Missing analysis_metadata');
    });

    it('detects missing cite_provenance', () => {
      const invalid = { ...sampleProvenance };
      delete invalid.cite_provenance;
      const { valid, errors } = validateScoreProvenance(invalid);
      expect(valid).toBe(false);
      expect(errors).toContain('Missing cite_provenance');
    });

    it('detects invalid CITE verdict', () => {
      const invalid = {
        ...sampleProvenance,
        cite_provenance: {
          ...sampleProvenance.cite_provenance,
          overall: { score: 52, verdict: 'INVALID' }
        }
      };
      const { valid, errors } = validateScoreProvenance(invalid);
      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('Invalid CITE verdict'))).toBe(true);
    });

    it('detects missing feeder_chain', () => {
      const invalid = { ...sampleProvenance };
      delete invalid.feeder_chain;
      const { valid, errors } = validateScoreProvenance(invalid);
      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('feeder_chain'))).toBe(true);
    });
  });

  describe('validateScoreItem', () => {
    const validItem = {
      id: 'C02',
      name: 'Referring Domain Count',
      score: 60,
      source_skill: 'backlink-analyzer',
      source_step: 9,
      raw_data: '234 referring domains',
      calculation: '234 RDs → 60/100 (threshold: 500+ for 80+)'
    };

    it('valid item passes validation', () => {
      const { valid, errors } = validateScoreItem(validItem);
      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('detects missing source_skill', () => {
      const invalid = { ...validItem };
      delete invalid.source_skill;
      const { valid, errors } = validateScoreItem(invalid);
      expect(valid).toBe(false);
      expect(errors).toContain('Missing item.source_skill');
    });

    it('detects invalid source_skill', () => {
      const invalid = { ...validItem, source_skill: 'unknown-skill' };
      const { valid, errors } = validateScoreItem(invalid);
      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('Invalid source_skill'))).toBe(true);
    });

    it('allows estimated as source_skill', () => {
      const estimated = {
        ...validItem,
        source_skill: 'estimated',
        source_step: undefined,
        calculation: 'Estimated based on domain age and content volume'
      };
      delete estimated.source_step;
      const { valid } = validateScoreItem(estimated);
      expect(valid).toBe(true);
    });

    it('detects missing raw_data', () => {
      const invalid = { ...validItem };
      delete invalid.raw_data;
      const { valid, errors } = validateScoreItem(invalid);
      expect(valid).toBe(false);
      expect(errors).toContain('Missing item.raw_data');
    });

    it('detects missing calculation', () => {
      const invalid = { ...validItem };
      delete invalid.calculation;
      const { valid, errors } = validateScoreItem(invalid);
      expect(valid).toBe(false);
      expect(errors).toContain('Missing item.calculation');
    });
  });
});

describe('Prompt Results Validation', () => {
  const samplePromptResults = {
    analysis_metadata: {
      domain: 'caplinq.com',
      timestamp: '20260412T140000',
      tier: 2,
      version: '6.5.0'
    },
    prompt_results: [
      {
        step: '1.5',
        skill: 'citation-baseline',
        tool: 'check_citations',
        timestamp_utc: '2026-04-12T14:02:34Z',
        engine: 'perplexity',
        model: 'sonar',
        live_search: true,
        prompt: {
          type: 'CITATION_PROMPT',
          query: 'what is a gas diffusion layer',
          domain: 'caplinq.com'
        },
        response: {
          full_text: 'A gas diffusion layer (GDL) is...',
          excerpt: 'A gas diffusion layer (GDL) is...',
          word_count: 245,
          citations: ['https://example.com/gdl'],
          domain_cited: true
        }
      }
    ],
    webfetch_calls: [
      {
        step: '1',
        skill: 'entity-optimizer',
        url: 'https://caplinq.com/',
        timestamp_utc: '2026-04-12T14:01:12Z',
        status: 200,
        content_type: 'text/html',
        response_length: 45230
      }
    ],
    summary: {
      total_llm_calls: 156,
      by_engine: { perplexity: 40, anthropic: 40, openai: 40, gemini: 36 },
      total_webfetch_calls: 15
    }
  };

  describe('validatePromptResults', () => {
    it('valid prompt results pass validation', () => {
      const { valid, errors } = validatePromptResults(samplePromptResults);
      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('detects missing analysis_metadata', () => {
      const invalid = { ...samplePromptResults };
      delete invalid.analysis_metadata;
      const { valid, errors } = validatePromptResults(invalid);
      expect(valid).toBe(false);
      expect(errors).toContain('Missing analysis_metadata');
    });

    it('detects missing prompt_results array', () => {
      const invalid = { ...samplePromptResults };
      delete invalid.prompt_results;
      const { valid, errors } = validatePromptResults(invalid);
      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('prompt_results'))).toBe(true);
    });

    it('detects invalid engine in prompt result', () => {
      const invalid = {
        ...samplePromptResults,
        prompt_results: [
          { ...samplePromptResults.prompt_results[0], engine: 'invalid-engine' }
        ]
      };
      const { valid, errors } = validatePromptResults(invalid);
      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('Invalid engine'))).toBe(true);
    });

    it('allows manual_required source without engine validation', () => {
      const manualFallback = {
        ...samplePromptResults,
        prompt_results: [
          {
            step: '1.5',
            skill: 'citation-baseline',
            tool: 'check_citations',
            source: 'manual_required',
            engine: 'manual',
            prompt: { query: 'test' }
          }
        ]
      };
      const { valid } = validatePromptResults(manualFallback);
      expect(valid).toBe(true);
    });
  });

  describe('LLM Engine Coverage', () => {
    it('all 4 engines should be valid', () => {
      expect(VALID_LLM_ENGINES).toContain('perplexity');
      expect(VALID_LLM_ENGINES).toContain('anthropic');
      expect(VALID_LLM_ENGINES).toContain('openai');
      expect(VALID_LLM_ENGINES).toContain('gemini');
      expect(VALID_LLM_ENGINES).toHaveLength(4);
    });
  });
});

describe('Feeder Chain Validation', () => {
  const expectedFeederMappings = [
    { target: 'CITE C02/C04/C10/T01/T02', source: 'backlink-analyzer' },
    { target: 'CITE T07/T08/T09', source: 'technical-seo-checker' },
    { target: 'CITE C05-C08', source: 'citation-baseline' },
    { target: 'CITE I04', source: 'schema-markup-generator' },
    { target: 'CORE C/O/R/E (page-level)', source: 'on-page-seo-auditor' },
    { target: 'CORE Exp/Ept', source: 'entity-optimizer' },
    { target: 'CORE A/T (org-level)', source: 'domain-authority-auditor' }
  ];

  it('all expected feeder mappings exist', () => {
    expectedFeederMappings.forEach(mapping => {
      expect(mapping.target).toBeDefined();
      expect(mapping.source).toBeDefined();
      expect(VALID_SOURCE_SKILLS).toContain(mapping.source);
    });
  });

  it('CITE dimensions have designated feeders', () => {
    const citeFeeders = expectedFeederMappings.filter(m => m.target.includes('CITE'));
    expect(citeFeeders.length).toBeGreaterThanOrEqual(4); // C, I, T, E dimensions
  });

  it('CORE-EEAT dimensions have designated feeders', () => {
    const coreFeeders = expectedFeederMappings.filter(m => m.target.includes('CORE'));
    expect(coreFeeders.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Provenance Builder - PENDING to NOT_ASSESSED', () => {
  // Simulate the provenance-builder behavior
  function simulateFinalizeProvenance(provenance) {
    // Mark remaining PENDING items as NOT_ASSESSED
    for (const dimension of Object.values(provenance.cite_provenance.dimensions)) {
      if (dimension.items) {
        for (const item of dimension.items) {
          if (item.status === 'PENDING') {
            item.status = 'NOT_ASSESSED';
            item.reason = 'Item not evaluated in this analysis run';
          }
        }
      }
    }
    for (const dimension of Object.values(provenance.core_eeat_provenance.dimensions)) {
      if (dimension.items) {
        for (const item of dimension.items) {
          if (item.status === 'PENDING') {
            item.status = 'NOT_ASSESSED';
            item.reason = 'Item not evaluated in this analysis run';
          }
        }
      }
    }
    return provenance;
  }

  it('converts PENDING items to NOT_ASSESSED after finalization', () => {
    const provenance = {
      cite_provenance: {
        dimensions: {
          C: {
            items: [
              { id: 'C01', status: 'PENDING' },
              { id: 'C02', status: 'PASS', score: 75 },
              { id: 'C03', status: 'PENDING' }
            ]
          },
          I: { items: [] },
          T: { items: [] },
          E: { items: [] }
        }
      },
      core_eeat_provenance: {
        dimensions: {
          C: {
            items: [
              { id: 'C01', status: 'FAIL', score: 30 },
              { id: 'C02', status: 'PENDING' }
            ]
          },
          O: { items: [] },
          R: { items: [] },
          E: { items: [] },
          Exp: { items: [] },
          Ept: { items: [] },
          A: { items: [] },
          T: { items: [] }
        }
      }
    };

    const finalized = simulateFinalizeProvenance(provenance);

    // Check CITE items
    const citeC = finalized.cite_provenance.dimensions.C.items;
    expect(citeC[0].status).toBe('NOT_ASSESSED');
    expect(citeC[0].reason).toBe('Item not evaluated in this analysis run');
    expect(citeC[1].status).toBe('PASS'); // Should remain unchanged
    expect(citeC[2].status).toBe('NOT_ASSESSED');

    // Check CORE-EEAT items
    const coreC = finalized.core_eeat_provenance.dimensions.C.items;
    expect(coreC[0].status).toBe('FAIL'); // Should remain unchanged
    expect(coreC[1].status).toBe('NOT_ASSESSED');
  });

  it('handles empty items arrays without error', () => {
    const provenance = {
      cite_provenance: {
        dimensions: {
          C: { items: [] },
          I: { items: [] },
          T: { items: [] },
          E: { items: [] }
        }
      },
      core_eeat_provenance: {
        dimensions: {
          C: { items: [] },
          O: { items: [] },
          R: { items: [] },
          E: { items: [] },
          Exp: { items: [] },
          Ept: { items: [] },
          A: { items: [] },
          T: { items: [] }
        }
      }
    };

    expect(() => simulateFinalizeProvenance(provenance)).not.toThrow();
  });

  it('handles dimensions without items property', () => {
    const provenance = {
      cite_provenance: {
        dimensions: {
          C: { score: 72 }, // No items array (legacy format)
          I: { score: 68 },
          T: { score: 71 },
          E: { score: 65 }
        }
      },
      core_eeat_provenance: {
        dimensions: {
          C: { score: 72, source_skill: 'content-quality-auditor' },
          O: { score: 68 },
          R: { score: 65 },
          E: { score: 70 },
          Exp: { score: 78 },
          Ept: { score: 80 },
          A: { score: 62 },
          T: { score: 68 }
        }
      }
    };

    // Should not throw when items property is missing
    expect(() => simulateFinalizeProvenance(provenance)).not.toThrow();
  });

  it('no PENDING items remain after finalization', () => {
    const provenance = {
      cite_provenance: {
        dimensions: {
          C: { items: [{ id: 'C01', status: 'PENDING' }, { id: 'C02', status: 'PENDING' }] },
          I: { items: [{ id: 'I01', status: 'PENDING' }] },
          T: { items: [] },
          E: { items: [] }
        }
      },
      core_eeat_provenance: {
        dimensions: {
          C: { items: [{ id: 'C01', status: 'PENDING' }] },
          O: { items: [] },
          R: { items: [] },
          E: { items: [] },
          Exp: { items: [] },
          Ept: { items: [] },
          A: { items: [] },
          T: { items: [] }
        }
      }
    };

    const finalized = simulateFinalizeProvenance(provenance);

    // Collect all items and check none are PENDING
    const allItems = [];
    for (const dim of Object.values(finalized.cite_provenance.dimensions)) {
      if (dim.items) allItems.push(...dim.items);
    }
    for (const dim of Object.values(finalized.core_eeat_provenance.dimensions)) {
      if (dim.items) allItems.push(...dim.items);
    }

    const pendingItems = allItems.filter(i => i.status === 'PENDING');
    expect(pendingItems).toHaveLength(0);
  });
});

// Export for use in other tests
export {
  validateScoreProvenance,
  validateScoreItem,
  validatePromptResults,
  CITE_DIMENSIONS,
  CORE_DIMENSIONS,
  CITE_VERDICTS,
  VALID_SOURCE_SKILLS,
  VALID_LLM_ENGINES
};
