/**
 * Tests for directory structure in company-analysis orchestration
 * Validates output directory creation and organization
 */
import { describe, it, expect } from 'vitest';

// Phase directory structure from company-analysis SKILL.md
const PHASE_DIRECTORIES = [
  '01-domain-baseline',
  '02-research',
  '03-technical',
  '04-content',
  '05-recommendations',
  '06-monitoring',
  '07-memory'
];

// Handoff files per phase
const HANDOFF_FILES = {
  '01-domain-baseline': [
    'entity-optimizer-handoff.md',
    'citation-baseline-handoff.md'
  ],
  '02-research': [
    'keyword-research-handoff.md',
    'competitor-analysis-handoff.md',
    'serp-analysis-handoff.md',
    'content-gap-analysis-handoff.md'
  ],
  '03-technical': [
    'technical-seo-handoff.md',
    'on-page-seo-handoff.md',
    'internal-linking-handoff.md',
    'backlink-handoff.md',
    'domain-authority-handoff.md'
  ],
  '04-content': [
    'content-quality-handoff.md',
    'content-refresher-handoff.md'
  ],
  '05-recommendations': [
    'seo-content-handoff.md',
    'geo-content-handoff.md',
    'meta-tags-handoff.md',
    'schema-markup-handoff.md'
  ],
  '06-monitoring': [
    'rank-tracker-handoff.md',
    'performance-reporter-handoff.md',
    'alert-manager-handoff.md'
  ],
  '07-memory': [
    'memory-snapshot.md'
  ]
};

// Total expected handoff files
const TOTAL_HANDOFF_FILES = Object.values(HANDOFF_FILES).flat().length;

describe('Directory Structure Constants', () => {
  describe('Phase directories', () => {
    it('has exactly 7 phase directories', () => {
      expect(PHASE_DIRECTORIES).toHaveLength(7);
    });

    it('phase directories are numbered 01-07', () => {
      PHASE_DIRECTORIES.forEach((dir, index) => {
        const expectedPrefix = String(index + 1).padStart(2, '0');
        expect(dir.startsWith(expectedPrefix)).toBe(true);
      });
    });

    it('includes all expected phases', () => {
      expect(PHASE_DIRECTORIES).toContain('01-domain-baseline');
      expect(PHASE_DIRECTORIES).toContain('02-research');
      expect(PHASE_DIRECTORIES).toContain('03-technical');
      expect(PHASE_DIRECTORIES).toContain('04-content');
      expect(PHASE_DIRECTORIES).toContain('05-recommendations');
      expect(PHASE_DIRECTORIES).toContain('06-monitoring');
      expect(PHASE_DIRECTORIES).toContain('07-memory');
    });
  });

  describe('Handoff file counts', () => {
    it('01-domain-baseline has 2 handoff files', () => {
      expect(HANDOFF_FILES['01-domain-baseline']).toHaveLength(2);
    });

    it('02-research has 4 handoff files', () => {
      expect(HANDOFF_FILES['02-research']).toHaveLength(4);
    });

    it('03-technical has 5 handoff files', () => {
      expect(HANDOFF_FILES['03-technical']).toHaveLength(5);
    });

    it('04-content has 2 handoff files', () => {
      expect(HANDOFF_FILES['04-content']).toHaveLength(2);
    });

    it('05-recommendations has 4 handoff files', () => {
      expect(HANDOFF_FILES['05-recommendations']).toHaveLength(4);
    });

    it('06-monitoring has 3 handoff files', () => {
      expect(HANDOFF_FILES['06-monitoring']).toHaveLength(3);
    });

    it('07-memory has 1 handoff file', () => {
      expect(HANDOFF_FILES['07-memory']).toHaveLength(1);
    });

    it('total handoff files is 21', () => {
      expect(TOTAL_HANDOFF_FILES).toBe(21);
    });
  });

  describe('Handoff file naming convention', () => {
    it('all handoff files end with -handoff.md or -snapshot.md', () => {
      Object.values(HANDOFF_FILES).flat().forEach(file => {
        expect(
          file.endsWith('-handoff.md') || file.endsWith('-snapshot.md'),
          `${file} should end with -handoff.md or -snapshot.md`
        ).toBe(true);
      });
    });

    it('all handoff files are kebab-case', () => {
      Object.values(HANDOFF_FILES).flat().forEach(file => {
        const nameWithoutExtension = file.replace(/\.md$/, '');
        expect(nameWithoutExtension).toMatch(/^[a-z-]+$/);
      });
    });
  });
});

describe('Directory Path Generation', () => {
  /**
   * Generate full analysis directory structure
   * @param {string} companyRoot
   * @param {string} domain
   * @param {string} timestamp
   * @returns {object}
   */
  function generateDirectoryStructure(companyRoot, domain, timestamp) {
    const basePath = `analyses/${companyRoot}/${domain}/analysis-${timestamp}`;
    const reportDir = `analyses/${companyRoot}/reports`;

    const phaseDirs = {};
    PHASE_DIRECTORIES.forEach(phase => {
      phaseDirs[phase] = `${basePath}/${phase}`;
    });

    const handoffPaths = {};
    Object.entries(HANDOFF_FILES).forEach(([phase, files]) => {
      handoffPaths[phase] = files.map(file => `${basePath}/${phase}/${file}`);
    });

    return {
      basePath,
      reportDir,
      reportPath: `${reportDir}/${companyRoot}_${domain}_${timestamp}.html`,
      phaseDirs,
      handoffPaths,
      allHandoffPaths: Object.values(handoffPaths).flat()
    };
  }

  describe('caplinq.com directory structure', () => {
    const structure = generateDirectoryStructure('caplinq', 'caplinq.com', '20260412T153045');

    it('generates correct base path', () => {
      expect(structure.basePath).toBe('analyses/caplinq/caplinq.com/analysis-20260412T153045');
    });

    it('generates correct report directory', () => {
      expect(structure.reportDir).toBe('analyses/caplinq/reports');
    });

    it('generates correct report path', () => {
      expect(structure.reportPath).toBe('analyses/caplinq/reports/caplinq_caplinq.com_20260412T153045.html');
    });

    it('generates 7 phase directories', () => {
      expect(Object.keys(structure.phaseDirs)).toHaveLength(7);
    });

    it('generates 21 handoff file paths', () => {
      expect(structure.allHandoffPaths).toHaveLength(21);
    });

    it('phase directories are under base path', () => {
      Object.values(structure.phaseDirs).forEach(dir => {
        expect(dir.startsWith(structure.basePath)).toBe(true);
      });
    });

    it('handoff files are under correct phase directories', () => {
      structure.allHandoffPaths.forEach(path => {
        expect(path.startsWith(structure.basePath)).toBe(true);
        expect(path.endsWith('.md')).toBe(true);
      });
    });
  });

  describe('blog.caplinq.com directory structure', () => {
    const structure = generateDirectoryStructure('caplinq', 'blog.caplinq.com', '20260412T153045');

    it('uses same company root folder as apex domain', () => {
      expect(structure.basePath).toContain('/caplinq/');
    });

    it('separates subdomain in domain folder', () => {
      expect(structure.basePath).toContain('/blog.caplinq.com/');
    });

    it('report goes to shared company reports folder', () => {
      expect(structure.reportDir).toBe('analyses/caplinq/reports');
    });

    it('report filename includes subdomain', () => {
      expect(structure.reportPath).toContain('blog.caplinq.com');
    });
  });
});

describe('Phase to Skill Mapping', () => {
  const PHASE_SKILLS = {
    '01-domain-baseline': ['entity-optimizer', 'citation-baseline'],
    '02-research': ['keyword-research', 'competitor-analysis', 'serp-analysis', 'content-gap-analysis'],
    '03-technical': ['technical-seo-checker', 'on-page-seo-auditor', 'internal-linking-optimizer', 'backlink-analyzer', 'domain-authority-auditor'],
    '04-content': ['content-quality-auditor', 'content-refresher'],
    '05-recommendations': ['seo-content-writer', 'geo-content-optimizer', 'meta-tags-optimizer', 'schema-markup-generator'],
    '06-monitoring': ['rank-tracker', 'performance-reporter', 'alert-manager'],
    '07-memory': ['memory-management']
  };

  it('maps correct skills to 01-domain-baseline', () => {
    expect(PHASE_SKILLS['01-domain-baseline']).toContain('entity-optimizer');
    expect(PHASE_SKILLS['01-domain-baseline']).toContain('citation-baseline');
  });

  it('maps correct skills to 02-research', () => {
    expect(PHASE_SKILLS['02-research']).toContain('keyword-research');
    expect(PHASE_SKILLS['02-research']).toContain('competitor-analysis');
    expect(PHASE_SKILLS['02-research']).toContain('serp-analysis');
    expect(PHASE_SKILLS['02-research']).toContain('content-gap-analysis');
  });

  it('maps correct skills to 03-technical', () => {
    expect(PHASE_SKILLS['03-technical']).toContain('technical-seo-checker');
    expect(PHASE_SKILLS['03-technical']).toContain('on-page-seo-auditor');
    expect(PHASE_SKILLS['03-technical']).toContain('internal-linking-optimizer');
    expect(PHASE_SKILLS['03-technical']).toContain('backlink-analyzer');
    expect(PHASE_SKILLS['03-technical']).toContain('domain-authority-auditor');
  });

  it('maps correct skills to 04-content', () => {
    expect(PHASE_SKILLS['04-content']).toContain('content-quality-auditor');
    expect(PHASE_SKILLS['04-content']).toContain('content-refresher');
  });

  it('maps correct skills to 05-recommendations', () => {
    expect(PHASE_SKILLS['05-recommendations']).toContain('seo-content-writer');
    expect(PHASE_SKILLS['05-recommendations']).toContain('geo-content-optimizer');
    expect(PHASE_SKILLS['05-recommendations']).toContain('meta-tags-optimizer');
    expect(PHASE_SKILLS['05-recommendations']).toContain('schema-markup-generator');
  });

  it('maps correct skills to 06-monitoring', () => {
    expect(PHASE_SKILLS['06-monitoring']).toContain('rank-tracker');
    expect(PHASE_SKILLS['06-monitoring']).toContain('performance-reporter');
    expect(PHASE_SKILLS['06-monitoring']).toContain('alert-manager');
  });

  it('maps correct skills to 07-memory', () => {
    expect(PHASE_SKILLS['07-memory']).toContain('memory-management');
  });

  it('total skills across all phases is 21', () => {
    const totalSkills = Object.values(PHASE_SKILLS).flat().length;
    expect(totalSkills).toBe(21);
  });
});

// Export constants for use in other tests
export { PHASE_DIRECTORIES, HANDOFF_FILES, TOTAL_HANDOFF_FILES };
