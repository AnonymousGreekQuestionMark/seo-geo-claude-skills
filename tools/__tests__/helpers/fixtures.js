/**
 * Fixture loading utilities
 * Helps load test data from __fixtures__ directory
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, '..', '__fixtures__');

/**
 * Load a JSON fixture file
 * @param {string} relativePath - Path relative to __fixtures__ directory
 * @returns {object} Parsed JSON data
 */
export function loadJsonFixture(relativePath) {
  const fullPath = join(fixturesDir, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Fixture not found: ${relativePath}`);
  }
  return JSON.parse(readFileSync(fullPath, 'utf-8'));
}

/**
 * Load an HTML fixture file
 * @param {string} relativePath - Path relative to __fixtures__ directory
 * @returns {string} HTML content
 */
export function loadHtmlFixture(relativePath) {
  const fullPath = join(fixturesDir, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Fixture not found: ${relativePath}`);
  }
  return readFileSync(fullPath, 'utf-8');
}

/**
 * Load a text fixture file
 * @param {string} relativePath - Path relative to __fixtures__ directory
 * @returns {string} File content
 */
export function loadTextFixture(relativePath) {
  return loadHtmlFixture(relativePath);
}

/**
 * Check if a fixture exists
 * @param {string} relativePath - Path relative to __fixtures__ directory
 * @returns {boolean}
 */
export function fixtureExists(relativePath) {
  return existsSync(join(fixturesDir, relativePath));
}

/**
 * Get the absolute path to a fixture
 * @param {string} relativePath - Path relative to __fixtures__ directory
 * @returns {string} Absolute path
 */
export function getFixturePath(relativePath) {
  return join(fixturesDir, relativePath);
}

// Common test domains
export const TEST_DOMAINS = {
  primary: 'caplinq.com',
  subdomain: 'blog.caplinq.com',
  competitor: 'competitor.com',
  test: 'test.com'
};

// Common test queries
export const TEST_QUERIES = {
  seo: [
    'gas diffusion layer',
    'carbon paper fuel cell',
    'specialty chemicals supplier'
  ],
  brand: [
    'CAPLINQ',
    'CAPLINQ Corporation',
    'caplinq materials'
  ]
};

// Common test keywords
export const TEST_KEYWORDS = [
  'gas diffusion layer',
  'carbon paper',
  'fuel cell materials',
  'gdl membrane',
  'pem fuel cell components'
];

/**
 * Create a mock HTML page with schema
 */
export function createSchemaPage(schemaObjects, title = 'Test Page') {
  const schemaScripts = schemaObjects.map(schema =>
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
  ).join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      ${schemaScripts}
    </head>
    <body>
      <h1>${title}</h1>
      <p>Test content for schema validation.</p>
    </body>
    </html>
  `;
}

/**
 * Create a valid Article schema
 */
export function createValidArticleSchema(overrides = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Test Article Headline',
    author: {
      '@type': 'Person',
      name: 'John Doe'
    },
    datePublished: '2024-01-15',
    publisher: {
      '@type': 'Organization',
      name: 'Test Publisher'
    },
    ...overrides
  };
}

/**
 * Create a valid FAQPage schema
 */
export function createValidFaqSchema(questions = []) {
  const defaultQuestions = [
    { question: 'What is SEO?', answer: 'Search Engine Optimization' },
    { question: 'What is GEO?', answer: 'Generative Engine Optimization' }
  ];

  const faqs = (questions.length > 0 ? questions : defaultQuestions).map(q => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.answer
    }
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
  };
}

/**
 * Create a multi-page site structure for crawler tests
 */
export function createCrawlableSite(pages = 3) {
  const site = {};

  for (let i = 0; i < pages; i++) {
    const isHome = i === 0;
    const path = isHome ? '/' : `/page${i}`;
    const links = [];

    // Each page links to home and next page
    if (!isHome) links.push('/');
    if (i < pages - 1) links.push(`/page${i + 1}`);

    site[path] = {
      title: isHome ? 'Home' : `Page ${i}`,
      h1: isHome ? 'Welcome' : `Page ${i} Content`,
      links,
      hasSchema: i % 2 === 0 // Every other page has schema
    };
  }

  return site;
}
