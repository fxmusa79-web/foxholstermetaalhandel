/**
 * Foxholster Metaalhandel Worker.
 *
 * Static files come from ./dist via Workers Static Assets (env.ASSETS).
 * This script runs first so HTTP visitors are sent to HTTPS.
 * /api/* returns 501 until Resend/Turnstile are configured.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const host = url.hostname
    const isLocal =
      host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')

    if (url.protocol === 'http:' && !isLocal) {
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname.startsWith('/api/')) {
      return Response.json(
        {
          success: false,
          error: 'not_configured',
        },
        {
          status: 501,
          headers: { 'cache-control': 'no-store' },
        },
      )
    }

    return env.ASSETS.fetch(request)
  },
}
