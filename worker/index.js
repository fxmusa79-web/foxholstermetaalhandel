/**
 * Foxholster Metaalhandel Worker.
 *
 * Static files come from ./dist via Workers Static Assets (env.ASSETS).
 * This script runs first so HTTP visitors are sent to HTTPS.
 * /api/contact and /api/offerte handle the public forms.
 */
import { handleContact, handleContactConfig } from './contact.js'
import { handleOffer } from './offer.js'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const host = url.hostname
    const isLocal =
      host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')
    const isWorkersDev = host.endsWith('.workers.dev')

    if (url.protocol === 'http:' && !isLocal) {
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }

    if (host === 'www.foxholstermetaalhandel.nl') {
      url.hostname = 'foxholstermetaalhandel.nl'
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
      return handleContact(request, env)
    }

    if (url.pathname === '/api/offerte' || url.pathname === '/api/offerte/') {
      return handleOffer(request, env)
    }

    if (url.pathname === '/api/config') {
      return handleContactConfig(env)
    }

    if (url.pathname.startsWith('/api/')) {
      return Response.json(
        {
          success: false,
          error: 'not_found',
        },
        {
          status: 404,
          headers: { 'cache-control': 'no-store' },
        },
      )
    }

    const asset = await env.ASSETS.fetch(request)
    if (asset.status !== 404) return withHostHeaders(asset, isWorkersDev)

    const notFound = await env.ASSETS.fetch(new URL('/404.html', request.url))
    return withHostHeaders(
      new Response(notFound.body, {
        status: 404,
        statusText: 'Not Found',
        headers: notFound.headers,
      }),
      isWorkersDev,
    )
  },
}

function withHostHeaders(response, isWorkersDev) {
  if (!isWorkersDev) return response
  const headers = new Headers(response.headers)
  headers.set('x-robots-tag', 'noindex, nofollow')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
