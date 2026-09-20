import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

/**
 * Multi-page Vite config.
 * Each public HTML page is an explicit Rollup input so `npm run build`
 * emits all routes under /pages/...
 *
 * Production: `npm run build` then `npx wrangler deploy`
 * (Workers Static Assets from ./dist).
 */
export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        metaalInkoop: resolve(root, 'pages/metaal-inkoop/index.html'),
        materialen: resolve(root, 'pages/materialen/index.html'),
        zakelijk: resolve(root, 'pages/zakelijk/index.html'),
        ophalen: resolve(root, 'pages/ophalen-demontage/index.html'),
        werkgebied: resolve(root, 'pages/werkgebied/index.html'),
        overOns: resolve(root, 'pages/over-ons/index.html'),
        faq: resolve(root, 'pages/veelgestelde-vragen/index.html'),
        contact: resolve(root, 'pages/contact/index.html'),
        aanbieden: resolve(root, 'pages/metaal-aanbieden/index.html'),
        privacy: resolve(root, 'pages/privacybeleid/index.html'),
        voorwaarden: resolve(root, 'pages/algemene-voorwaarden/index.html'),
        cookies: resolve(root, 'pages/cookiebeleid/index.html'),
      },
    },
  },
})
