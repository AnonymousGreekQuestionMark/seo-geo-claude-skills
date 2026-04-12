/**
 * MSW handlers for mocking external APIs
 * Used by all MCP server tests
 */
import { http, HttpResponse } from 'msw';

// Default mock responses
const defaults = {
  perplexity: {
    choices: [{ message: { content: 'Test response mentioning caplinq.com as a source.' } }],
    citations: ['https://caplinq.com/products', 'https://example.com/article']
  },
  anthropic: {
    content: [{ type: 'text', text: 'CAPLINQ provides specialty chemicals and materials.' }]
  },
  openai: {
    choices: [{ message: { content: 'Sources include caplinq.com for industrial materials.' } }]
  },
  gemini: {
    candidates: [{ content: { parts: [{ text: 'caplinq.com is mentioned as a supplier.' }] } }]
  },
  serper: {
    organic: [
      { position: 1, title: 'CAPLINQ - Materials', link: 'https://caplinq.com', snippet: 'Leading supplier' },
      { position: 2, title: 'Competitor Site', link: 'https://competitor.com', snippet: 'Another supplier' }
    ],
    peopleAlsoAsk: [{ question: 'What is gas diffusion layer?' }],
    relatedSearches: [{ query: 'carbon paper fuel cell' }],
    answerBox: null,
    knowledgeGraph: null,
    aiOverview: null
  },
  dataforseoKeywords: {
    tasks: [{
      result: [
        { keyword: 'gas diffusion layer', search_volume: 4800, competition: 0.35, cpc: 2.50, keyword_difficulty: 45 },
        { keyword: 'carbon paper', search_volume: 12000, competition: 0.42, cpc: 1.80, keyword_difficulty: 38 }
      ]
    }]
  },
  dataforseoBacklinks: {
    tasks: [{
      result: [{
        rank: 125000,
        referring_domains: 450,
        referring_links: 2100,
        referring_links_dofollow: 1800,
        new_referring_links: 45,
        lost_referring_links: 12
      }]
    }]
  },
  dataforseoSerp: {
    tasks: [{
      result: [{
        items: [
          { type: 'organic', title: 'CAPLINQ', url: 'https://caplinq.com', position: 1, snippet: 'Test' },
          { type: 'organic', title: 'Competitor', url: 'https://competitor.com', position: 2, snippet: 'Test' }
        ]
      }]
    }]
  },
  pagespeed: {
    lighthouseResult: {
      categories: { performance: { score: 0.85 } },
      audits: {
        'largest-contentful-paint': { displayValue: '2.1 s', numericValue: 2100 },
        'total-blocking-time': { displayValue: '50 ms', numericValue: 50 },
        'cumulative-layout-shift': { displayValue: '0.05', numericValue: 0.05 },
        'first-contentful-paint': { displayValue: '1.2 s', numericValue: 1200 },
        'speed-index': { displayValue: '2.5 s', numericValue: 2500 }
      }
    },
    loadingExperience: {
      overall_category: 'FAST',
      metrics: {
        LARGEST_CONTENTFUL_PAINT_MS: { percentile: 2100, category: 'FAST' },
        FIRST_INPUT_DELAY_MS: { percentile: 50, category: 'FAST' },
        CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 0.05, category: 'FAST' }
      }
    }
  },
  wikidata: {
    results: {
      bindings: [{
        item: { value: 'http://www.wikidata.org/entity/Q12345' },
        itemLabel: { value: 'Test Company' },
        itemDescription: { value: 'A test company for unit testing' }
      }]
    }
  },
  wikipedia: {
    query: {
      search: [
        { title: 'Test Company', snippet: 'A company that does testing', pageid: 12345 }
      ]
    }
  },
  googleKg: {
    itemListElement: [{
      result: {
        name: 'Test Company',
        '@type': ['Organization', 'Corporation'],
        description: 'A test company'
      },
      resultScore: 150.5
    }]
  },
  openPageRank: {
    response: [{
      page_rank_integer: 5,
      page_rank_decimal: 5.2,
      rank: 125000,
      domain: 'caplinq.com'
    }]
  },
  googleCse: {
    items: [
      { title: 'Brand Mention 1', link: 'https://example.com/article1', snippet: 'CAPLINQ mentioned here' },
      { title: 'Brand Mention 2', link: 'https://other.com/post', snippet: 'Another CAPLINQ reference' }
    ]
  }
};

export const handlers = [
  // Perplexity API
  http.post('https://api.perplexity.ai/chat/completions', () => {
    return HttpResponse.json(defaults.perplexity);
  }),

  // Anthropic Claude API
  http.post('https://api.anthropic.com/v1/messages', () => {
    return HttpResponse.json(defaults.anthropic);
  }),

  // OpenAI API
  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json(defaults.openai);
  }),

  // Google Gemini API
  http.post(/generativelanguage\.googleapis\.com.*generateContent/, () => {
    return HttpResponse.json(defaults.gemini);
  }),

  // Serper.dev API
  http.post('https://google.serper.dev/search', () => {
    return HttpResponse.json(defaults.serper);
  }),

  // DataForSEO Keywords API
  http.post('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', () => {
    return HttpResponse.json(defaults.dataforseoKeywords);
  }),

  // DataForSEO Backlinks API
  http.post('https://api.dataforseo.com/v3/backlinks/summary/live', () => {
    return HttpResponse.json(defaults.dataforseoBacklinks);
  }),

  // DataForSEO Domain Metrics API
  http.post('https://api.dataforseo.com/v3/dataforseo_labs/google/domain_metrics_by_categories/live', () => {
    return HttpResponse.json({
      tasks: [{
        result: [{
          metrics: {
            organic: { keywords_in_top_10: 150, etv: 25000 }
          }
        }]
      }]
    });
  }),

  // DataForSEO SERP API
  http.post('https://api.dataforseo.com/v3/serp/google/organic/live/regular', () => {
    return HttpResponse.json(defaults.dataforseoSerp);
  }),

  // Google PageSpeed Insights API
  http.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', () => {
    return HttpResponse.json(defaults.pagespeed);
  }),

  // Wikidata SPARQL
  http.get('https://query.wikidata.org/sparql', () => {
    return HttpResponse.json(defaults.wikidata);
  }),

  // Wikipedia API
  http.get('https://en.wikipedia.org/w/api.php', () => {
    return HttpResponse.json(defaults.wikipedia);
  }),

  // Google Knowledge Graph API
  http.get('https://kgsearch.googleapis.com/v1/entities:search', () => {
    return HttpResponse.json(defaults.googleKg);
  }),

  // Open PageRank API
  http.get(/openpagerank\.com\/api\/v1\.0\/getPageRank/, () => {
    return HttpResponse.json(defaults.openPageRank);
  }),

  // Google Custom Search API
  http.get('https://www.googleapis.com/customsearch/v1', () => {
    return HttpResponse.json(defaults.googleCse);
  }),

  // Generic HTML page for crawler/schema tests
  http.get(/https?:\/\/test\.com.*/, ({ request }) => {
    const url = new URL(request.url);

    if (url.pathname === '/schema-valid') {
      return new HttpResponse(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Test Article</title>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Test Article Title",
              "author": {"@type": "Person", "name": "John Doe"},
              "datePublished": "2024-01-15",
              "publisher": {"@type": "Organization", "name": "Test Org"}
            }
          </script>
        </head>
        <body>
          <h1>Test Article</h1>
          <p>This is test content.</p>
          <a href="/page1">Page 1</a>
          <a href="/page2">Page 2</a>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    if (url.pathname === '/schema-invalid') {
      return new HttpResponse(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Schema</title>
          <script type="application/ld+json">
            {"@context": "https://schema.org", "@type": "Article"}
          </script>
        </head>
        <body><h1>Missing Fields</h1></body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // Default page
    return new HttpResponse(`
      <!DOCTYPE html>
      <html>
      <head><title>Test Page</title></head>
      <body>
        <h1>Test Page</h1>
        <a href="/page1">Link 1</a>
        <a href="/page2">Link 2</a>
      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  })
];

// Export defaults for assertions in tests
export { defaults };

// Helper to create error responses
export function createErrorHandler(url, status, message) {
  return http.all(url, () => {
    return new HttpResponse(message, { status });
  });
}

// Helper to create custom response handlers
export function createCustomHandler(method, url, response) {
  const httpMethod = method.toLowerCase() === 'post' ? http.post : http.get;
  return httpMethod(url, () => {
    return HttpResponse.json(response);
  });
}
