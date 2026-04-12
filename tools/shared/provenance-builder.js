/**
 * Provenance Builder
 * Builds comprehensive 120-item score provenance (40 CITE + 80 CORE-EEAT)
 * Used by company-analysis orchestration to track all score sources
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * CITE Framework - 40 items across 4 dimensions
 */
const CITE_ITEMS = {
  C: [
    { id: 'C01', name: 'Referring Domains Volume', threshold: '>=500 unique referring domains' },
    { id: 'C02', name: 'Referring Domains Quality', threshold: '>=20% of referring domains have DA/DR 50+' },
    { id: 'C03', name: 'Link Equity Distribution', threshold: 'Top sources <1,000 outbound domains' },
    { id: 'C04', name: 'Link Velocity', threshold: 'No month >3x average growth' },
    { id: 'C05', name: 'AI Citation Frequency', threshold: 'Cited by >=2 AI engines on >=10 queries' },
    { id: 'C06', name: 'AI Citation Prominence', threshold: 'Primary/sole source in >=50% of AI citations' },
    { id: 'C07', name: 'Cross-Engine Citation', threshold: 'Cited by >=3 different AI engines' },
    { id: 'C08', name: 'Citation Sentiment', threshold: '>=80% positive/neutral context' },
    { id: 'C09', name: 'Editorial Link Ratio', threshold: '>=60% editorial backlinks' },
    { id: 'C10', name: 'Link Source Diversity', threshold: '>=3 industries, >=5 regions' }
  ],
  I: [
    { id: 'I01', name: 'Knowledge Graph Presence', threshold: 'Entity in >=2 knowledge graphs' },
    { id: 'I02', name: 'Brand Search Volume', threshold: '>=1,000 monthly exact-match searches' },
    { id: 'I03', name: 'Brand SERP Ownership', threshold: '>=7 first-page results controlled' },
    { id: 'I04', name: 'Schema.org Coverage', threshold: '>=50% of pages with Schema markup' },
    { id: 'I05', name: 'Author Entity Recognition', threshold: '>=80% verifiable author identities' },
    { id: 'I06', name: 'Domain Tenure', threshold: 'Registered >=5 years active' },
    { id: 'I07', name: 'Cross-Platform Consistency', threshold: 'Identical brand across platforms' },
    { id: 'I08', name: 'Niche Consistency', threshold: 'Same niche >=3 years' },
    { id: 'I09', name: 'Unlinked Brand Mentions', threshold: '>=50 third-party mentions' },
    { id: 'I10', name: 'Query-Brand Association', threshold: 'Brand in industry autocomplete' }
  ],
  T: [
    { id: 'T01', name: 'Link Profile Naturalness', threshold: 'No month >15% of total backlinks' },
    { id: 'T02', name: 'Dofollow Ratio Normality', threshold: 'Dofollow 40-85%' },
    { id: 'T03', name: 'Link-Traffic Coherence', threshold: 'Links proportional to traffic', isVeto: true },
    { id: 'T04', name: 'IP/Network Diversity', threshold: '>=100 unique C-class IPs' },
    { id: 'T05', name: 'Backlink Profile Uniqueness', threshold: 'No domain shares >60%', isVeto: true },
    { id: 'T06', name: 'WHOIS & Registration Transparency', threshold: 'Public WHOIS, stable >=2 years' },
    { id: 'T07', name: 'Technical Security', threshold: 'HTTPS + HSTS, no malware' },
    { id: 'T08', name: 'Content Freshness Signal', threshold: 'Updated within 90 days' },
    { id: 'T09', name: 'Penalty & Deindex History', threshold: 'No manual actions', isVeto: true },
    { id: 'T10', name: 'Review & Reputation Signals', threshold: '>=3.5/5 on >=2 platforms' }
  ],
  E: [
    { id: 'E01', name: 'Organic Search Visibility', threshold: '>=1,000 keywords in top 100' },
    { id: 'E02', name: 'Organic Traffic Estimate', threshold: '>=10,000 monthly visits' },
    { id: 'E03', name: 'SERP Feature Ownership', threshold: '>=3 SERP feature types' },
    { id: 'E04', name: 'Technical Crawlability', threshold: 'AI-friendly robots.txt, <3s load' },
    { id: 'E05', name: 'Multi-Platform Footprint', threshold: '>=3 platforms with activity' },
    { id: 'E06', name: 'Authoritative Media Coverage', threshold: '>=3 authoritative publications' },
    { id: 'E07', name: 'Topical Authority Depth', threshold: 'Long-tail rankings deep in niche' },
    { id: 'E08', name: 'Topical Authority Breadth', threshold: '>=70% sub-topics covered' },
    { id: 'E09', name: 'Geographic Reach', threshold: 'Traffic from >=10 countries' },
    { id: 'E10', name: 'Industry Share of Voice', threshold: '>=5% visibility in top 50 keywords' }
  ]
};

/**
 * CORE-EEAT Framework - 80 items across 8 dimensions
 */
const CORE_EEAT_ITEMS = {
  C: [
    { id: 'C01', name: 'Intent Alignment', priority: 'Dual', isVeto: true },
    { id: 'C02', name: 'Direct Answer', priority: 'GEO' },
    { id: 'C03', name: 'Query Coverage', priority: 'Dual' },
    { id: 'C04', name: 'Definition First', priority: 'GEO' },
    { id: 'C05', name: 'Topic Scope', priority: 'GEO' },
    { id: 'C06', name: 'Audience Targeting', priority: 'Dual' },
    { id: 'C07', name: 'Semantic Coherence', priority: 'GEO' },
    { id: 'C08', name: 'Use Case Mapping', priority: 'GEO' },
    { id: 'C09', name: 'FAQ Coverage', priority: 'GEO' },
    { id: 'C10', name: 'Semantic Closure', priority: 'Dual' }
  ],
  O: [
    { id: 'O01', name: 'Heading Hierarchy', priority: 'Dual' },
    { id: 'O02', name: 'Summary Box', priority: 'GEO' },
    { id: 'O03', name: 'Data Tables', priority: 'GEO' },
    { id: 'O04', name: 'List Formatting', priority: 'GEO' },
    { id: 'O05', name: 'Schema Markup', priority: 'GEO' },
    { id: 'O06', name: 'Section Chunking', priority: 'GEO' },
    { id: 'O07', name: 'Visual Hierarchy', priority: 'SEO' },
    { id: 'O08', name: 'Anchor Navigation', priority: 'Dual' },
    { id: 'O09', name: 'Information Density', priority: 'GEO' },
    { id: 'O10', name: 'Multimedia Structure', priority: 'Dual' }
  ],
  R: [
    { id: 'R01', name: 'Data Precision', priority: 'GEO' },
    { id: 'R02', name: 'Citation Density', priority: 'GEO' },
    { id: 'R03', name: 'Source Hierarchy', priority: 'GEO' },
    { id: 'R04', name: 'Evidence-Claim Mapping', priority: 'GEO' },
    { id: 'R05', name: 'Methodology Transparency', priority: 'GEO' },
    { id: 'R06', name: 'Timestamp & Versioning', priority: 'Dual' },
    { id: 'R07', name: 'Entity Precision', priority: 'GEO' },
    { id: 'R08', name: 'Internal Link Graph', priority: 'SEO' },
    { id: 'R09', name: 'HTML Semantics', priority: 'GEO' },
    { id: 'R10', name: 'Content Consistency', priority: 'Dual', isVeto: true }
  ],
  E: [
    { id: 'E01', name: 'Original Data', priority: 'GEO' },
    { id: 'E02', name: 'Novel Framework', priority: 'GEO' },
    { id: 'E03', name: 'Primary Research', priority: 'GEO' },
    { id: 'E04', name: 'Contrarian View', priority: 'GEO' },
    { id: 'E05', name: 'Proprietary Visuals', priority: 'Dual' },
    { id: 'E06', name: 'Gap Filling', priority: 'GEO' },
    { id: 'E07', name: 'Practical Tools', priority: 'Dual' },
    { id: 'E08', name: 'Depth Advantage', priority: 'GEO' },
    { id: 'E09', name: 'Synthesis Value', priority: 'GEO' },
    { id: 'E10', name: 'Forward Insights', priority: 'GEO' }
  ],
  Exp: [
    { id: 'Exp01', name: 'First-Person Narrative', priority: 'SEO' },
    { id: 'Exp02', name: 'Sensory Details', priority: 'SEO' },
    { id: 'Exp03', name: 'Process Documentation', priority: 'Dual' },
    { id: 'Exp04', name: 'Tangible Proof', priority: 'SEO' },
    { id: 'Exp05', name: 'Usage Duration', priority: 'SEO' },
    { id: 'Exp06', name: 'Problems Encountered', priority: 'Dual' },
    { id: 'Exp07', name: 'Before/After Comparison', priority: 'SEO' },
    { id: 'Exp08', name: 'Quantified Metrics', priority: 'Dual' },
    { id: 'Exp09', name: 'Repeated Testing', priority: 'SEO' },
    { id: 'Exp10', name: 'Limitations Acknowledged', priority: 'GEO' }
  ],
  Ept: [
    { id: 'Ept01', name: 'Author Identity', priority: 'SEO' },
    { id: 'Ept02', name: 'Credentials Display', priority: 'SEO' },
    { id: 'Ept03', name: 'Professional Vocabulary', priority: 'Dual' },
    { id: 'Ept04', name: 'Technical Depth', priority: 'Dual' },
    { id: 'Ept05', name: 'Methodology Rigor', priority: 'GEO' },
    { id: 'Ept06', name: 'Edge Case Awareness', priority: 'Dual' },
    { id: 'Ept07', name: 'Historical Context', priority: 'SEO' },
    { id: 'Ept08', name: 'Reasoning Transparency', priority: 'GEO' },
    { id: 'Ept09', name: 'Cross-domain Integration', priority: 'Dual' },
    { id: 'Ept10', name: 'Editorial Process', priority: 'SEO' }
  ],
  A: [
    { id: 'A01', name: 'Backlink Profile', priority: 'SEO' },
    { id: 'A02', name: 'Media Mentions', priority: 'SEO' },
    { id: 'A03', name: 'Industry Awards', priority: 'SEO' },
    { id: 'A04', name: 'Publishing Record', priority: 'SEO' },
    { id: 'A05', name: 'Brand Recognition', priority: 'Dual' },
    { id: 'A06', name: 'Social Proof', priority: 'SEO' },
    { id: 'A07', name: 'Knowledge Graph Presence', priority: 'Dual' },
    { id: 'A08', name: 'Entity Consistency', priority: 'GEO' },
    { id: 'A09', name: 'Partnership Signals', priority: 'SEO' },
    { id: 'A10', name: 'Community Standing', priority: 'SEO' }
  ],
  T: [
    { id: 'T01', name: 'Legal Compliance', priority: 'SEO' },
    { id: 'T02', name: 'Contact Transparency', priority: 'SEO' },
    { id: 'T03', name: 'Security Standards', priority: 'SEO' },
    { id: 'T04', name: 'Disclosure Statements', priority: 'Dual', isVeto: true },
    { id: 'T05', name: 'Editorial Policy', priority: 'SEO' },
    { id: 'T06', name: 'Correction & Update Policy', priority: 'Dual' },
    { id: 'T07', name: 'Ad Experience', priority: 'SEO' },
    { id: 'T08', name: 'Risk Disclaimers', priority: 'Dual' },
    { id: 'T09', name: 'Review Authenticity', priority: 'Dual' },
    { id: 'T10', name: 'Customer Support', priority: 'SEO' }
  ]
};

/**
 * Initialize empty provenance structure with all 120 items as PENDING
 * @param {string} domain - Domain being analyzed
 * @param {string} timestamp - Analysis timestamp
 * @returns {Object} Empty provenance structure
 */
export function initProvenance(domain, timestamp) {
  const createPendingItem = (item, framework) => ({
    id: item.id,
    name: item.name,
    score: null,
    status: 'PENDING',
    confidence: null,
    data_source: null,
    raw_data: null,
    threshold: item.threshold || null,
    calculation: null,
    is_veto: item.isVeto || false,
    priority: item.priority || null
  });

  // Build CITE dimensions
  const citeDimensions = {};
  for (const [dim, items] of Object.entries(CITE_ITEMS)) {
    citeDimensions[dim] = {
      score: null,
      items: items.map(item => createPendingItem(item, 'CITE'))
    };
  }

  // Build CORE-EEAT dimensions
  const coreEeatDimensions = {};
  for (const [dim, items] of Object.entries(CORE_EEAT_ITEMS)) {
    coreEeatDimensions[dim] = {
      score: null,
      items: items.map(item => createPendingItem(item, 'CORE_EEAT'))
    };
  }

  // Extract CITE veto items
  const citeVetoItems = [];
  for (const items of Object.values(CITE_ITEMS)) {
    for (const item of items) {
      if (item.isVeto) {
        citeVetoItems.push({ id: item.id, name: item.name, status: 'PENDING', triggered: false });
      }
    }
  }

  // Extract CORE-EEAT veto items
  const coreEeatVetoItems = [];
  for (const items of Object.values(CORE_EEAT_ITEMS)) {
    for (const item of items) {
      if (item.isVeto) {
        coreEeatVetoItems.push({ id: item.id, name: item.name, status: 'PENDING', triggered: false });
      }
    }
  }

  return {
    analysis_metadata: {
      domain,
      timestamp,
      version: '2.0.0'
    },
    cite_provenance: {
      overall: { score: null, verdict: null },
      dimensions: citeDimensions,
      veto_items: citeVetoItems
    },
    core_eeat_provenance: {
      geo_score: null,
      seo_score: null,
      dimensions: coreEeatDimensions,
      veto_items: coreEeatVetoItems
    },
    feeder_chain: []
  };
}

/**
 * Update a single CITE item
 * @param {Object} provenance - Provenance object to update
 * @param {string} itemId - Item ID (e.g., 'C05')
 * @param {Object} data - Update data
 */
export function updateCiteItem(provenance, itemId, data) {
  const dim = itemId.charAt(0);
  const dimension = provenance.cite_provenance.dimensions[dim];
  if (!dimension) return;

  const item = dimension.items.find(i => i.id === itemId);
  if (!item) return;

  Object.assign(item, {
    score: data.score ?? item.score,
    status: data.status ?? (data.score >= 80 ? 'PASS' : data.score >= 50 ? 'PARTIAL' : 'FAIL'),
    confidence: data.confidence ?? item.confidence,
    data_source: data.data_source ?? item.data_source,
    raw_data: data.raw_data ?? item.raw_data,
    calculation: data.calculation ?? item.calculation
  });

  // Update veto items if this is a veto
  if (item.is_veto) {
    const vetoItem = provenance.cite_provenance.veto_items.find(v => v.id === itemId);
    if (vetoItem) {
      vetoItem.status = item.status;
      vetoItem.triggered = item.status === 'FAIL';
    }
  }
}

/**
 * Update a single CORE-EEAT item
 * @param {Object} provenance - Provenance object to update
 * @param {string} itemId - Item ID (e.g., 'C01', 'Exp05')
 * @param {Object} data - Update data
 */
export function updateCoreEeatItem(provenance, itemId, data) {
  // Determine dimension from ID
  let dim;
  if (itemId.startsWith('Exp')) dim = 'Exp';
  else if (itemId.startsWith('Ept')) dim = 'Ept';
  else dim = itemId.charAt(0);

  const dimension = provenance.core_eeat_provenance.dimensions[dim];
  if (!dimension) return;

  const item = dimension.items.find(i => i.id === itemId);
  if (!item) return;

  Object.assign(item, {
    score: data.score ?? item.score,
    status: data.status ?? (data.score >= 80 ? 'PASS' : data.score >= 50 ? 'PARTIAL' : 'FAIL'),
    confidence: data.confidence ?? item.confidence,
    data_source: data.data_source ?? item.data_source,
    raw_data: data.raw_data ?? item.raw_data,
    calculation: data.calculation ?? item.calculation
  });

  // Update veto items if this is a veto
  if (item.is_veto) {
    const vetoItem = provenance.core_eeat_provenance.veto_items.find(v => v.id === itemId);
    if (vetoItem) {
      vetoItem.status = item.status;
      vetoItem.triggered = item.status === 'FAIL';
    }
  }
}

/**
 * Add feeder chain entry
 * @param {Object} provenance - Provenance object
 * @param {string} target - Target items (e.g., 'CITE C01-C04')
 * @param {string} source - Source skill
 * @param {string|number} step - Pipeline step
 * @param {string} status - Execution status
 */
export function addFeederChain(provenance, target, source, step, status) {
  provenance.feeder_chain.push({ target, source, step, status });
}

/**
 * Calculate dimension scores and overall scores
 * @param {Object} provenance - Provenance object to finalize
 */
export function finalizeProvenance(provenance) {
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

  // Calculate CITE dimension scores
  for (const [dim, dimension] of Object.entries(provenance.cite_provenance.dimensions)) {
    const scoredItems = dimension.items.filter(i => i.score !== null);
    if (scoredItems.length > 0) {
      dimension.score = Math.round(scoredItems.reduce((sum, i) => sum + i.score, 0) / scoredItems.length);
    }
  }

  // Calculate CITE overall score (weighted)
  const citeWeights = { C: 0.35, I: 0.20, T: 0.25, E: 0.20 };
  let citeScore = 0;
  let citeWeightSum = 0;
  for (const [dim, weight] of Object.entries(citeWeights)) {
    const dimScore = provenance.cite_provenance.dimensions[dim]?.score;
    if (dimScore !== null) {
      citeScore += dimScore * weight;
      citeWeightSum += weight;
    }
  }
  if (citeWeightSum > 0) {
    provenance.cite_provenance.overall.score = Math.round(citeScore / citeWeightSum * (1 / citeWeightSum) * citeWeightSum);
    provenance.cite_provenance.overall.score = Math.round(citeScore);
  }

  // Check CITE veto status
  const citeVetoTriggered = provenance.cite_provenance.veto_items.some(v => v.triggered);
  if (citeVetoTriggered) {
    provenance.cite_provenance.overall.verdict = 'UNTRUSTED';
    provenance.cite_provenance.overall.score = Math.min(provenance.cite_provenance.overall.score || 0, 39);
  } else if (provenance.cite_provenance.overall.score >= 75) {
    provenance.cite_provenance.overall.verdict = 'TRUSTED';
  } else if (provenance.cite_provenance.overall.score >= 50) {
    provenance.cite_provenance.overall.verdict = 'CAUTIOUS';
  } else {
    provenance.cite_provenance.overall.verdict = 'UNTRUSTED';
  }

  // Calculate CORE-EEAT dimension scores
  for (const [dim, dimension] of Object.entries(provenance.core_eeat_provenance.dimensions)) {
    const scoredItems = dimension.items.filter(i => i.score !== null);
    if (scoredItems.length > 0) {
      dimension.score = Math.round(scoredItems.reduce((sum, i) => sum + i.score, 0) / scoredItems.length);
    }
  }

  // Calculate GEO Score (CORE average: C, O, R, E)
  const coreDims = ['C', 'O', 'R', 'E'];
  const coreScores = coreDims.map(d => provenance.core_eeat_provenance.dimensions[d]?.score).filter(s => s !== null);
  if (coreScores.length > 0) {
    provenance.core_eeat_provenance.geo_score = Math.round(coreScores.reduce((a, b) => a + b, 0) / coreScores.length);
  }

  // Calculate SEO Score (EEAT average: Exp, Ept, A, T)
  const eeatDims = ['Exp', 'Ept', 'A', 'T'];
  const eeatScores = eeatDims.map(d => provenance.core_eeat_provenance.dimensions[d]?.score).filter(s => s !== null);
  if (eeatScores.length > 0) {
    provenance.core_eeat_provenance.seo_score = Math.round(eeatScores.reduce((a, b) => a + b, 0) / eeatScores.length);
  }
}

/**
 * Save provenance to file
 * @param {string} analysisPath - Path to analysis directory
 * @param {Object} provenance - Provenance object
 */
export async function saveProvenance(analysisPath, provenance) {
  const filePath = path.join(analysisPath, 'score-provenance.json');
  await fs.writeFile(filePath, JSON.stringify(provenance, null, 2));
}

/**
 * Load existing provenance or create new
 * @param {string} analysisPath - Path to analysis directory
 * @param {string} domain - Domain for new provenance
 * @param {string} timestamp - Timestamp for new provenance
 * @returns {Object} Provenance object
 */
export async function loadOrCreateProvenance(analysisPath, domain, timestamp) {
  const filePath = path.join(analysisPath, 'score-provenance.json');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return initProvenance(domain, timestamp);
  }
}

export default {
  CITE_ITEMS,
  CORE_EEAT_ITEMS,
  initProvenance,
  updateCiteItem,
  updateCoreEeatItem,
  addFeederChain,
  finalizeProvenance,
  saveProvenance,
  loadOrCreateProvenance
};
