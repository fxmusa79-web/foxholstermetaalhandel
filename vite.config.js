import { defineConfig } from 'vite'

/**
 * Multi-page Vite config.
 * Each public HTML page is an explicit Rollup input so `npm run build`
 * emits all routes under /pages/...
 *
 * Production: `npm run build` then `npx wrangler deploy --config wrangler.jsonc --autoconfig=false`
 * (Workers Static Assets from ./dist). Keep this file parse-simple: Wrangler
 * autoconfig uses a limited JS parser and chokes on import.meta / node:path.
 */
export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        metaalInkoop: 'pages/metaal-inkoop/index.html',
        materialen: 'pages/materialen/index.html',
        zakelijk: 'pages/zakelijk/index.html',
        ophalen: 'pages/ophalen-demontage/index.html',
        werkgebied: 'pages/werkgebied/index.html',
        overOns: 'pages/over-ons/index.html',
        faq: 'pages/veelgestelde-vragen/index.html',
        contact: 'pages/contact/index.html',
        aanbieden: 'pages/metaal-aanbieden/index.html',
        privacy: 'pages/privacybeleid/index.html',
        voorwaarden: 'pages/algemene-voorwaarden/index.html',
        cookies: 'pages/cookiebeleid/index.html',
      },
    },
  },
})
