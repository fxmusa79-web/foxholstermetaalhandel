/**
 * Foxholster Metaalhandel Worker.
 *
 * HTML, CSS, JS and images are served from ./dist via Workers Static Assets.
 * This script runs only for /api/* (see wrangler.jsonc run_worker_first).
 *
 * Later endpoints (not configured yet — no secrets in this repo):
 * - POST /api/contact
 * - POST /api/aanbieden
 * - Turnstile verification
 * - Resend mail
 * - optional R2 uploads / D1 storage
 */
export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (!url.pathname.startsWith('/api/')) {
      return new Response('Not found', { status: 404 })
    }

    return Response.json(
      {
        ok: false,
        error: 'not_configured',
        message: 'Dit API-eindpunt is nog niet actief.',
      },
      {
        status: 501,
        headers: { 'cache-control': 'no-store' },
      },
    )
  },
}
