// api/generate.js — Vercel Serverless Function
// This keeps your Anthropic API key safe on the server.
// Set ANTHROPIC_API_KEY in your Vercel environment variables.

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
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { prompt } = body;
  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Prompt required' }), { status: 400 });
  }

  const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!anthropicResponse.ok) {
    const err = await anthropicResponse.text();
    return new Response(JSON.stringify({ error: 'Upstream API error', detail: err }), { status: 502 });
  }

  // Stream the response directly back to the browser
  return new Response(anthropicResponse.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
