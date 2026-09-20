# Foxholster Metaalhandel

Public website for **Foxholster Metaalhandel**, a Dutch metal trading and recycling company in Foxhol / Groningen.

Production domain: `https://foxholstermetaalhandel.nl`

The site is a Vite multi-page static frontend, deployed with Cloudflare Workers Static Assets. Contact and offer forms are visible but not yet connected to a backend (Resend / Turnstile are not configured).

## Purpose

Industrial public website: Dutch copy, real company details and photographs, conversion-focused pages, and a frontend-only intake form until Resend/Turnstile are connected.

## Technology

- Vite (vanilla)
- HTML
- Modular CSS
- Vanilla JavaScript
- npm

No React, Vue, Angular or Tailwind.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run deploy
```

Cloudflare Workers Builds is configured to run `npm run build` then `npx wrangler deploy`.

Development typically runs at `http://localhost:5173/` (use the URL Vite prints).

## Folder structure

```
foxholster-metaalhandel/
├── index.html
├── package.json
├── wrangler.jsonc
├── worker/
│   └── index.js
├── public/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/
│       └── brand/
│           ├── logo-header.png          (original, untouched)
│           ├── favicon-and-icon.png     (original, untouched)
│           ├── logo-header-web.webp
│           └── icon-web.webp
├── src/
│   ├── css/
│   ├── js/
│   └── data/
│       ├── business.js
│       ├── materials.js
│       └── faqs.js
└── pages/
    ├── metaal-inkoop/
    ├── materialen/
    ├── zakelijk/
    ├── ophalen-demontage/
    ├── werkgebied/
    ├── over-ons/
    ├── veelgestelde-vragen/
    ├── contact/
    ├── metaal-aanbieden/
    ├── privacybeleid/
    ├── algemene-voorwaarden/
    └── cookiebeleid/
```

Shared chrome (topbar, header, mobile nav, footer, cookie UI) is injected by `src/js/components.js`. Page content and SEO tags live in each HTML file.

Desktop header uses `logo-header-web.webp` (PNG fallback). Below 700px the compact brand mark `icon-web.webp` is shown. Original high-resolution PNGs stay untouched in `public/images/brand/`.

## Remaining placeholders

Confirmed contact, address, KvK and registrations are in `src/data/business.js`. Still not published because they are not supplied:

- `[BTW-NUMMER]`
- `[OPENINGSTIJDEN]`
- Google Business Profile URL, if applicable
- Final legal texts (privacy, terms, cookies)

Canonical, Open Graph, sitemap and JSON-LD URLs use `https://foxholstermetaalhandel.nl`.

## Form and API backend

`POST /api/contact` sends contact enquiries through the Worker, Resend and D1. Runtime secrets stay in Cloudflare Worker Settings (or local `.dev.vars`) and are never committed.

The offer form on `/pages/metaal-aanbieden/` stays frontend-only until that endpoint is added.

## Deployment

GitHub repository: https://github.com/fxmusa79-web/foxholstermetaalhandel

Remote:

`git@github-foxholstermetaalhandel:fxmusa79-web/foxholstermetaalhandel.git`

Cloudflare Workers Builds should run:

1. `npm run build`
2. `npx wrangler deploy`

Worker name: `foxholstermetaalhandel`. Custom domain attachment stays in the Cloudflare dashboard so DNS is not duplicated from Wrangler.

```
Vite build → dist/
        ↓
Cloudflare Workers Static Assets
        ↓
https://foxholstermetaalhandel.nl
```

## Fonts

Barlow Condensed and IBM Plex Sans are loaded from Google Fonts via `src/css/base.css`. Replace the `@import` with self-hosted `@font-face` files in `/public/fonts/` if required.

## Robots and sitemap

`robots.txt` allows crawling and points to `https://foxholstermetaalhandel.nl/sitemap.xml`. Public page URLs live under `/pages/...`.
