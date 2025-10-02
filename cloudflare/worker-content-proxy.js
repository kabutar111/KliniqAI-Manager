export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = env.CORS_ORIGIN || '*';
    const betaMode = (env.INTERNAL_BETA || 'false').toLowerCase() === 'true';

    // Simple health
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'content-type': 'application/json', 'access-control-allow-origin': origin },
      });
    }

    // Only serve under /content/
    if (!url.pathname.startsWith('/content/')) {
      return new Response('Not Found', { status: 404, headers: { 'access-control-allow-origin': origin } });
    }

    // Optional simple gating for staging
    if (betaMode) {
      const provided = request.headers.get('x-beta-key') || '';
      if (!env.BETA_KEY || provided !== env.BETA_KEY) {
        return new Response('Forbidden', { status: 403, headers: { 'access-control-allow-origin': origin } });
      }
    }

    const key = url.pathname.replace(/^\/content\//, '');
    try {
      const obj = await env.CONTENT_BUCKET.get(key);
      if (!obj) {
        return new Response('Not Found', { status: 404, headers: { 'access-control-allow-origin': origin } });
      }
      const headers = new Headers();
      headers.set('access-control-allow-origin', origin);
      headers.set('cache-control', 'public, max-age=86400, s-maxage=604800, immutable');
      headers.set('etag', obj.httpEtag || '');
      if (obj.httpMetadata?.contentType) headers.set('content-type', obj.httpMetadata.contentType);
      if (obj.httpMetadata?.contentLanguage) headers.set('content-language', obj.httpMetadata.contentLanguage);

      return new Response(obj.body, { status: 200, headers });
    } catch (err) {
      return new Response('Internal Error', { status: 500, headers: { 'access-control-allow-origin': origin } });
    }
  },
};

