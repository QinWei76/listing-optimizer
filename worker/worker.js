// ListingAI — Cloudflare Worker
// Proxies DeepSeek API calls so the API key stays off the frontend.

const DEEPSEEK_API = 'https://api.deepseek.com/chat/completions';

export default {
  async fetch(request, env) {
    // --- CORS preflight ---
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin':  '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/generate') {
      return new Response('Not found', { status: 404 });
    }

    try {
      const body = await request.json();

      // Forward to DeepSeek
      const upstream = await fetch(DEEPSEEK_API, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model:        'deepseek-chat',
          messages:     body.messages,
          temperature:  body.temperature  || 0.5,
          max_tokens:   body.max_tokens   || 2000,
        }),
      });

      const data = await upstream.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type':               'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          'Content-Type':               'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  }
};
