export async function post(url, headers, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${url} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function get(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${url} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export function ok(data) {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

export function err(message) {
  return { content: [{ type: 'text', text: JSON.stringify({ error: message }) }], isError: true };
}

export function tier1Manual(tool, manualSteps, dataTemplate) {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        tier: 1,
        data_source: 'manual_or_estimated',
        confidence: 'low',
        tool,
        manual_steps: manualSteps,
        data_template: dataTemplate,
        instruction: 'No API key configured for this tool. Use the manual_steps above to gather data, or proceed with AI estimation and note confidence as low/estimated in the handoff summary.',
      }, null, 2),
    }],
  };
}
