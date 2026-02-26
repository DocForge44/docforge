// api/generate.js — Vercel Serverless Function

export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `You are DocForge, an expert legal document drafting assistant. You generate professional, comprehensive, legally-sound business documents.

Guidelines:
- Write in clear, professional legal language
- Include all standard clauses appropriate for the document type
- Use [BRACKETED PLACEHOLDERS] only for items the user must customize (like dates, state/jurisdiction, specific amounts not provided)
- Make documents comprehensive and ready to use
- Add a brief disclaimer at the end noting this is AI-generated and should be reviewed by a licensed attorney for high-stakes use
- Format with clear section headers using markdown (## for main sections)
- Return ONLY the document text, no preamble or explanation`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // DEBUG: log key status (never logs the actual key)
  console.log('API key present:', !!apiKey);
  console.log('API key length:', apiKey ? apiKey.length : 0);
  console.log('API key prefix:', apiKey ? apiKey.substring(0, 10) : 'MISSING');

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { prompt } = body;
  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Prompt required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('Prompt received, length:', prompt.length);
  console.log('Calling Anthropic API...');

  let anthropicResponse;
  try {
    anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    });
  } catch (err) {
    console.log('Fetch error:', String(err));
    return new Response(JSON.stringify({ error: 'Failed to reach Anthropic API', detail: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('Anthropic response status:', anthropicResponse.status);

  if (!anthropicResponse.ok) {
    const errText = await anthropicResponse.text();
    console.log('Anthropic error body:', errText);
    return new Response(JSON.stringify({ error: 'Anthropic API error', status: anthropicResponse.status, detail: errText }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(anthropicResponse.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
