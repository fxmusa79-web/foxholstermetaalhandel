import {
  business,
  navItems,
  primaryCta,
  legalLinks,
  footerServices,
  phoneHref,
  emailHref,
} from '../data/business.js'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function navMarkup(page, className) {
  return `
    <ul class="${className}">
      ${navItems
        .map((item) => {
          const current = item.id === page ? ' aria-current="page"' : ''
          return `<li><a href="${item.href}"${current}>${escapeHtml(item.label)}</a></li>`
        })
        .join('')}
    </ul>
  `
}

export function topbarHtml() {
  return `
    <div class="topbar">
      <div class="container topbar__inner">
        <div class="topbar__meta">
          <a href="${phoneHref()}">${escapeHtml(business.phone)}</a>
          <a href="${emailHref()}">${escapeHtml(business.email)}</a>
        </div>
        <span class="topbar__tag">${escapeHtml(business.audience)}</span>
      </div>
    </div>
  `
}

export function headerHtml(page) {
  return `
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="/" aria-label="Foxholster Metaalhandel - Home">
          <picture class="brand__logo brand__logo--full">
            <source type="image/webp" srcset="/images/brand/logo-header-web.webp" />
            <img src="/images/brand/logo-header-web.png" width="870" height="290" alt="Foxholster Metaalhandel" />
          </picture>
          <picture class="brand__logo brand__logo--mark">
            <source type="image/webp" srcset="/images/brand/icon-web.webp" />
            <img src="/images/brand/icon-web.png" width="256" height="256" alt="" />
          </picture>
        </a>
        <nav class="nav-desktop" aria-label="Hoofdnavigatie">
          ${navMarkup(page, 'nav-desktop__list')}
        </nav>
        <div class="header-actions">
          <a class="btn btn--primary btn--small" href="${primaryCta.href}">${escapeHtml(primaryCta.label)}</a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" data-nav-toggle>
            <span></span><span></span><span></span>
            <span class="u-sr-only">Menu openen</span>
          </button>
        </div>
      </div>
    </header>
    <div class="mobile-nav" id="mobile-nav" hidden>
      <div class="mobile-nav__backdrop" data-nav-close></div>
      <div class="mobile-nav__panel" role="dialog" aria-modal="true" aria-label="Mobiel menu">
        <div class="mobile-nav__head">
          <strong>Menu</strong>
          <button class="btn btn--outline btn--small" type="button" data-nav-close>Sluiten</button>
        </div>
        <nav aria-label="Mobiele navigatie">
          ${navMarkup(page, 'mobile-nav__list')}
        </nav>
        <p class="u-mt-lg">
          <a class="btn btn--primary" href="${primaryCta.href}">${escapeHtml(primaryCta.label)}</a>
        </p>
        <p class="u-mt-sm">
          <a class="btn btn--outline" href="${phoneHref()}">Bel direct</a>
        </p>
      </div>
    </div>
  `
}

export function footerHtml() {
  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a class="footer-logo" href="/" aria-label="Foxholster Metaalhandel - Home">
            <span class="footer-logo__panel">
              <img src="/images/brand/icon-web.png" width="256" height="256" alt="" />
            </span>
          </a>
          <h2>${escapeHtml(business.companyName)}</h2>
          <p>${escapeHtml(business.experienceIntro)}</p>
        </div>
        <div>
          <h2>Contact</h2>
          <div class="footer-meta">
            <span>${escapeHtml(business.street)}</span>
            <span>${escapeHtml(business.postalCode)} ${escapeHtml(business.city)}</span>
            <a href="${phoneHref()}">${escapeHtml(business.phone)}</a>
            <a href="${emailHref()}">${escapeHtml(business.email)}</a>
          </div>
          <div class="footer-meta footer-meta--sub">
            <span>Privé: <a href="${phoneHref(business.privatePhone)}">${escapeHtml(business.privatePhone)}</a></span>
            <span>B.g.g.: <a href="${phoneHref(business.mobileFallback)}">${escapeHtml(business.mobileFallback)}</a></span>
          </div>
        </div>
        <div>
          <h2>Diensten</h2>
          <ul class="footer-links">
            ${footerServices.map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h2>Navigatie</h2>
          <ul class="footer-links">
            ${navItems.map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <ul class="footer-reg">
          <li>KvK: ${escapeHtml(business.kvk)}</li>
          <li>Inzamel nr.: ${escapeHtml(business.collectionNumber)}</li>
          <li>BE/verwerker: ${escapeHtml(business.processorNumber)}</li>
          <li>VIHB: ${escapeHtml(business.vihb)}</li>
        </ul>
        <div class="footer-legal">
          ${legalLinks.map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join('')}
          <button class="cookie-settings" type="button" data-consent-open>Cookie-instellingen</button>
        </div>
      </div>
    </footer>
  `
}

export function consentHtml() {
  return `
    <div class="consent-banner" data-consent-banner hidden>
      <div class="consent-banner__inner">
        <p>We gebruiken noodzakelijke cookies voor de werking van de site. Analytics wordt pas geladen na toestemming en is in deze ontwikkelversie nog niet actief.</p>
        <div class="consent-actions">
          <button class="btn btn--outline btn--small" type="button" data-consent-necessary>Alleen noodzakelijk</button>
          <button class="btn btn--primary btn--small" type="button" data-consent-accept>Analytics toestaan</button>
          <button class="btn btn--outline btn--small" type="button" data-consent-open>Instellingen</button>
        </div>
      </div>
    </div>
    <div class="consent-panel" data-consent-panel hidden>
      <div class="consent-panel__inner" role="dialog" aria-modal="true" aria-labelledby="consent-title">
        <h2 id="consent-title">Cookie-instellingen</h2>
        <div class="consent-row">
          <div>
            <strong>Noodzakelijk</strong>
            <p class="u-muted">Vereist voor de werking van de website. Altijd aan.</p>
          </div>
          <label>
            <span class="u-sr-only">Noodzakelijke cookies</span>
            <input type="checkbox" checked disabled>
          </label>
        </div>
        <div class="consent-row">
          <div>
            <strong>Analytics</strong>
            <p class="u-muted">Nog niet gekoppeld. Er wordt geen meetscript geladen.</p>
          </div>
          <label>
            <span class="u-sr-only">Analytics cookies</span>
            <input type="checkbox" data-consent-analytics>
          </label>
        </div>
        <div class="consent-actions">
          <button class="btn btn--primary btn--small" type="button" data-consent-save>Opslaan</button>
          <button class="btn btn--outline btn--small" type="button" data-consent-close>Sluiten</button>
        </div>
      </div>
    </div>
  `
}

export function mountChrome(page) {
  const topbar = document.querySelector('[data-partial="topbar"]')
  const header = document.querySelector('[data-partial="header"]')
  const footer = document.querySelector('[data-partial="footer"]')
  const consent = document.querySelector('[data-partial="consent"]')

  if (topbar) topbar.outerHTML = topbarHtml()
  if (header) header.outerHTML = headerHtml(page)
  if (footer) footer.outerHTML = footerHtml()
  if (consent) consent.outerHTML = consentHtml()
}
