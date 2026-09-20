const { defineConfig } = require('vite')

/**
 * Multi-page Vite config (CommonJS on purpose).
 *
 * Wrangler autoconfig uses a limited parser on vite.config.js and throws:
 *   Error parsing file: .../vite.config.js
 * when it sees ESM `import` / `export`. This file is vite.config.cjs so:
 * - Vite still loads it
 * - Wrangler does not try to parse a vite.config.js
 *
 * Production: npm run build, then wrangler deploy --autoconfig=false
 * (Workers Static Assets from ./dist). Do not pass --config on Windows;
 * Wrangler doubles the absolute path.
 */
module.exports = defineConfig({
  appType: 'mpa',
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
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
