# Foxholster Metaalhandel

Frontend foundation for the public website of **Foxholster Metaalhandel**, a Dutch metal trading and recycling company based around Foxhol and Groningen.

This is a local development project. It is not deployed, not connected to a backend, and the production domain is not configured.

## Purpose

A production-ready HTML/CSS/JS starting point: industrial visual system, conversion-focused pages, Dutch copy, placeholders for real company data, and a frontend-only intake form.

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
```

Development typically runs at `http://localhost:5173/` (use the URL Vite prints).

## Folder structure

```
foxholster-metaalhandel/
├── index.html
├── package.json
├── vite.config.js
├── README.md
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
│       ├── business.js      (placeholders)
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

## Placeholders still required

Replace these before go-live (also listed in `src/data/business.js`):

- `[TELEFOONNUMMER]`
- `[E-MAILADRES]`
- `[ADRES]`
- `[POSTCODE]`
- `[PLAATS]`
- `[KVK-NUMMER]`
- `[BTW-NUMMER]`
- `[OPENINGSTIJDEN]`
- `[PRODUCTIEDOMEIN]` — currently documented as `https://www.example.nl`
- Real industrial photographs (current images are local SVG placeholders)
- Google Business Profile URL, if applicable
- Final legal texts (privacy, terms, cookies)
- Canonical / Open Graph / sitemap / JSON-LD URLs (all use `https://www.example.nl`)

## Future integration (not configured)

The intake form in `src/js/forms.js` is prepared so a later Cloudflare Worker can replace `submitToPlaceholder()`.

Intended later stack — **not created in this project**:

- Cloudflare Worker endpoint
- Resend for e-mail
- Cloudflare Turnstile

Do not add `wrangler.toml`, API keys, secrets or fake endpoints until that work is explicitly started.

**Deployment is not configured.** No Cloudflare Pages project, DNS or production publish.

## GitHub

Repository (source control only for now):

https://github.com/fxmusa79-web/foxholstermetaalhandel

Remote uses a dedicated SSH host alias and deploy key:

`git@github-foxholstermetaalhandel:fxmusa79-web/foxholstermetaalhandel.git`

## Intended infrastructure

Nothing below is configured yet except local development and the GitHub repository.

```
Local development (Vite)
        ↓
Git repository (this folder)
        ↓
GitHub (fxmusa79-web/foxholstermetaalhandel)
        ↓
Cloudflare deployment  ← NOT configured yet
```

**Frontend:** Vite static site (`npm run build` → `dist/`)

**Future backend (not implemented):** Cloudflare Worker / Workers for form handling.

**Possible later services (do not create yet):**

- Cloudflare Turnstile
- Resend e-mail API
- form handling
- photo upload handling
- analytics consent
- Cloudflare storage only if actually required

Do not add `wrangler.toml`, API keys, secrets or fake endpoints until that work is explicitly started.

## Fonts

Barlow Condensed and IBM Plex Sans are loaded from Google Fonts via `src/css/base.css`. Replace the `@import` with self-hosted `@font-face` files in `/public/fonts/` if required.

## Robots and sitemap

`robots.txt` currently disallows all crawlers (development). `sitemap.xml` lists public routes under the placeholder domain. Both must be updated when the real domain is known.
