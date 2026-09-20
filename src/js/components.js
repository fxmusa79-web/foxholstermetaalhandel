import {
  business,
  navItems,
  primaryCta,
  legalLinks,
  footerServices,
  phoneHref,
  emailHref,
  whatsappHref,
} from '../data/business.js'
import { contactWidgetHtml } from './contact-widget.js'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function navMarkup(page, className, withChevron = false) {
  const chevron = withChevron
    ? '<span class="mobile-nav__chevron" aria-hidden="true">→</span>'
    : ''
  return `
    <ul class="${className}">
      ${navItems
        .map((item) => {
          const current = item.id === page ? ' aria-current="page"' : ''
          return `<li><a href="${item.href}"${current}><span>${escapeHtml(item.label)}</span>${chevron}</a></li>`
        })
        .join('')}
    </ul>
  `
}

function googleMarkHtml() {
  return `
    <svg class="google-mark" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.64-.23-2.43H12v4.6h6.46a5.52 5.52 0 0 1-2.4 3.62v3.01h3.88c2.27-2.09 3.55-5.17 3.55-8.8z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.93l-3.88-3.01c-1.08.72-2.46 1.14-4.07 1.14-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24z"/>
      <path fill="#FBBC05" d="M5.27 14.24A7.21 7.21 0 0 1 4.89 12c0-.78.13-1.53.38-2.24V6.65H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.35l4-3.11z"/>
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.65l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"/>
    </svg>
  `
}

function iconPhone() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M7.2 3.8h3.1l1.1 2.8-1.7 1.1a12.4 12.4 0 0 0 6.6 6.6l1.1-1.7 2.8 1.1v3.1c0 .8-.7 1.5-1.5 1.5C9.9 18.3 5.7 14.1 5.7 5.3c0-.8.7-1.5 1.5-1.5z"/></svg>`
}

function iconWhatsapp() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.44-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.44 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24"/></svg>`
}

function iconMail() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 7h16v10H4z"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 7l8 6 8-6"/></svg>`
}

export function topbarHtml() {
  return `
    <div class="topbar">
      <div class="container topbar__inner">
        <a class="topbar__phone" href="${phoneHref()}">${escapeHtml(business.phone)}</a>
        <a class="topbar__email" href="${emailHref()}">${escapeHtml(business.email)}</a>
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
      <div class="mobile-nav__panel" role="dialog" aria-modal="true" aria-labelledby="mobile-nav-title">
        <div class="mobile-nav__head">
          <a class="mobile-nav__brand" href="/" aria-label="Foxholster Metaalhandel - Home">
            <img src="/images/brand/icon-web.png" width="40" height="40" alt="" />
            <span>
              <strong>Foxholster</strong>
              <small id="mobile-nav-title">Menu</small>
            </span>
          </a>
          <button class="mobile-nav__close" type="button" data-nav-close>
            <span aria-hidden="true">×</span>
            Sluiten
          </button>
        </div>
        <nav aria-label="Mobiele navigatie">
          ${navMarkup(page, 'mobile-nav__list', true)}
        </nav>
        <p class="mobile-nav__cta">
          <a class="btn btn--primary" href="${primaryCta.href}">${escapeHtml(primaryCta.label)}</a>
        </p>
        <div class="mobile-nav__contact">
          <p class="mobile-nav__section">Contact</p>
          <a class="mobile-nav__row" href="${phoneHref()}">
            <span class="mobile-nav__icon" aria-hidden="true">${iconPhone()}</span>
            <span>
              <small>Kantoor</small>
              <strong>${escapeHtml(business.phone)}</strong>
            </span>
          </a>
          <a class="mobile-nav__row" href="${phoneHref(business.privatePhone)}">
            <span class="mobile-nav__icon" aria-hidden="true">${iconPhone()}</span>
            <span>
              <small>Privé</small>
              <strong>${escapeHtml(business.privatePhone)}</strong>
            </span>
          </a>
          <a class="mobile-nav__row" href="${whatsappHref()}" target="_blank" rel="noopener noreferrer">
            <span class="mobile-nav__icon mobile-nav__icon--wa" aria-hidden="true">${iconWhatsapp()}</span>
            <span>
              <small>WhatsApp / b.g.g.</small>
              <strong>${escapeHtml(business.mobileFallback)}</strong>
            </span>
          </a>
          <a class="mobile-nav__row" href="${emailHref()}">
            <span class="mobile-nav__icon" aria-hidden="true">${iconMail()}</span>
            <span>
              <small>E-mail</small>
              <strong>${escapeHtml(business.email)}</strong>
            </span>
          </a>
          <a
            class="mobile-nav__google"
            href="${business.googleProfileUrl}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${googleMarkHtml()}
            <span>Bekijk ons op Google</span>
          </a>
        </div>
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
            <a
              class="footer-google"
              href="${business.googleProfileUrl}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${googleMarkHtml()}
              <span>Google Bedrijfsprofiel <span aria-hidden="true">→</span></span>
            </a>
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
      <div class="container footer-certs">
        <p class="footer-certs__label">Registraties &amp; kwaliteit</p>
        ${certLogosHtml('cert-logos cert-logos--footer')}
      </div>
    </footer>
  `
}

export function consentHtml() {
  return `
    <div class="consent-banner" data-consent-banner hidden>
      <div class="consent-banner__inner">
        <p class="consent-banner__text">
          Deze website gebruikt noodzakelijke opslag om uw cookievoorkeur te onthouden. Optionele analytics wordt alleen
          geactiveerd na toestemming, als die dienst is ingeschakeld.
          <a href="/pages/cookiebeleid/">Lees het cookiebeleid</a>.
        </p>
        <div class="consent-actions">
          <button class="consent-btn consent-btn--ghost" type="button" data-consent-necessary>Alleen noodzakelijk</button>
          <button class="consent-btn consent-btn--primary" type="button" data-consent-accept>Analytics toestaan</button>
          <button class="consent-btn consent-btn--text" type="button" data-consent-open>Instellingen</button>
        </div>
      </div>
    </div>
    <div class="consent-panel" data-consent-panel hidden>
      <div class="consent-panel__inner" role="dialog" aria-modal="true" aria-labelledby="consent-title">
        <h2 id="consent-title">Cookie-instellingen</h2>
        <div class="consent-row">
          <div>
            <strong>Noodzakelijk</strong>
            <p class="u-muted">Nodig om de website te laten werken en uw cookievoorkeur te onthouden. Altijd aan.</p>
          </div>
          <label>
            <span class="u-sr-only">Noodzakelijke cookies</span>
            <input type="checkbox" checked disabled>
          </label>
        </div>
        <div class="consent-row">
          <div>
            <strong>Analytics</strong>
            <p class="u-muted">Optioneel en niet vooraf aangevinkt. Wordt alleen gebruikt na toestemming, als een analyticsdienst is gekoppeld. Op dit moment is geen optionele analytics actief.</p>
          </div>
          <label>
            <span class="u-sr-only">Analytics cookies</span>
            <input type="checkbox" data-consent-analytics>
          </label>
        </div>
        <div class="consent-actions">
          <button class="consent-btn consent-btn--primary" type="button" data-consent-save>Opslaan</button>
          <button class="consent-btn consent-btn--ghost" type="button" data-consent-close>Sluiten</button>
        </div>
      </div>
    </div>
  `
}

export function certLogosHtml(className = 'cert-logos') {
  return `
    <ul class="${className}">
      <li>
        <img src="/images/certifications/mrf-metaal-recycling-federatie-logo.png" width="296" height="100" alt="Metaal Recycling Federatie" />
      </li>
      <li>
        <img src="/images/certifications/ecostars-fleet-recognition-logo.png" width="752" height="188" alt="ECOSTARS fleet recognition" />
      </li>
      <li>
        <span class="iso-badge">
          <strong>ISO 9001</strong>
          <small>Kwaliteitsmanagement</small>
        </span>
      </li>
      <li>
        <span class="iso-badge">
          <strong>ISO 14001</strong>
          <small>Milieumanagement</small>
        </span>
      </li>
    </ul>
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
  if (!document.querySelector('[data-contact-fab]')) {
    document.body.insertAdjacentHTML('beforeend', contactWidgetHtml())
  }
}
