/**
 * robots-txt-fetcher.js
 * Fetch and parse robots.txt for a domain, with AI bot classification.
 */

const AI_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'ChatGPT-User',
  'Claude-User',
];

/**
 * Parse raw robots.txt content into structured form.
 * @param {string} raw
 * @returns {{ user_agents: Array, sitemaps: string[], ai_bots: Object, allows_all_ai: boolean }}
 */
function parseRobotsTxt(raw) {
  const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

  const groups = [];
  let current = null;

  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    const field = key.trim().toLowerCase();
    const value = rest.join(':').trim();

    if (field === 'user-agent') {
      if (!current || current.disallow.length > 0 || current.allow.length > 0) {
        current = { name: value, disallow: [], allow: [] };
        groups.push(current);
      } else {
        // Multiple User-agent lines before any directive — merge names
        current.name = `${current.name}, ${value}`;
      }
    } else if (field === 'disallow' && current) {
      if (value) current.disallow.push(value);
    } else if (field === 'allow' && current) {
      if (value) current.allow.push(value);
    }
  }

  const sitemaps = lines
    .filter((l) => l.toLowerCase().startsWith('sitemap:'))
    .map((l) => l.split(':').slice(1).join(':').trim());

  // Classify each AI bot
  const ai_bots = {};
  for (const bot of AI_BOTS) {
    const botLower = bot.toLowerCase();
    // Find a group that matches this bot or wildcard
    const specific = groups.find((g) => g.name.toLowerCase() === botLower);
    const wildcard = groups.find((g) => g.name === '*');

    const group = specific || wildcard;
    if (!group) {
      ai_bots[bot] = 'not_mentioned';
      continue;
    }

    // A Disallow: / means blocked; Disallow: (empty) means allowed
    if (specific) {
      const blocked = specific.disallow.some((d) => d === '/' || d === '');
      // If specific group has Disallow: / → disallow; if Disallow: (empty) → allow; else allow
      ai_bots[bot] = specific.disallow.some((d) => d === '/') ? 'disallow' : 'allow';
    } else {
      // Falls under wildcard
      ai_bots[bot] = wildcard.disallow.some((d) => d === '/') ? 'disallow' : 'allow';
    }
  }

  const allows_all_ai = Object.values(ai_bots).every((v) => v !== 'disallow');

  return { user_agents: groups, sitemaps, ai_bots, allows_all_ai };
}

/**
 * Fetch and parse robots.txt for a domain.
 * @param {string} domain - e.g. 'caplinq.com'
 * @returns {Promise<Object>}
 */
export async function fetchRobotsTxt(domain) {
  const url = `https://${domain}/robots.txt`;
  const fetched_at = new Date().toISOString();

  const empty = {
    domain,
    url,
    fetched_at,
    status_code: null,
    raw_content: '',
    parsed: { user_agents: [], sitemaps: [], ai_bots: {}, allows_all_ai: false },
  };

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });

    const status_code = res.status;

    if (!res.ok) {
      return { ...empty, status_code };
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text')) {
      return { ...empty, status_code, raw_content: `[non-text content-type: ${contentType}]` };
    }

    const raw_content = await res.text();
    const parsed = parseRobotsTxt(raw_content);

    return { domain, url, fetched_at, status_code, raw_content, parsed };
  } catch (e) {
    return { ...empty, error: e.message };
  }
}
