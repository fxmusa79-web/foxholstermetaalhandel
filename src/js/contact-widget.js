import { business, phoneHref } from '../data/business.js'

const WHATSAPP_TEXT = encodeURIComponent(
  'Goedendag, ik neem contact op via de website van Foxholster Metaalhandel.',
)
const CLOSE_MS = 260

export function contactWidgetHtml() {
  return `
    <div class="contact-fab" data-contact-fab>
      <div class="contact-fab__menu" id="contact-fab-menu" hidden>
        <a
          class="contact-fab__item"
          href="https://wa.me/31650565966?text=${WHATSAPP_TEXT}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="contact-fab__icon contact-fab__icon--wa" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.44-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.44 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24m-2.73 4.14c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74 1.99.86 2.44.78 2.88.64.44-.13 1.43-.58 1.64-1.15.2-.56.2-1.05.13-1.15-.06-.1-.22-.17-.43-.28-.22-.12-1.32-.65-1.52-.72-.2-.08-.35-.12-.5.12s-.58.72-.71.86c-.13.14-.26.16-.48.05-.22-.1-.93-.34-1.77-1.09-.65-.58-1.09-1.29-1.22-1.51-.13-.22-.01-.33.09-.44.1-.1.22-.25.32-.38.11-.12.14-.22.22-.36.07-.14.04-.27-.02-.38-.06-.12-.5-1.2-.68-1.65-.18-.44-.36-.37-.5-.38-.13 0-.28-.01-.43-.01"/></svg>
          </span>
          <span>
            <strong>WhatsApp</strong>
            <small>${business.mobileFallback}</small>
          </span>
        </a>
        <a class="contact-fab__item" href="${phoneHref(business.phone)}">
          <span class="contact-fab__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6.6 10.8c1.4 2.7 3.9 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"/></svg>
          </span>
          <span>
            <strong>Bel kantoor</strong>
            <small>${business.phone}</small>
          </span>
        </a>
        <a class="contact-fab__item" href="${phoneHref(business.privatePhone)}">
          <span class="contact-fab__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6.6 10.8c1.4 2.7 3.9 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"/></svg>
          </span>
          <span>
            <strong>Bel privé</strong>
            <small>${business.privatePhone}</small>
          </span>
        </a>
      </div>
      <button
        class="contact-fab__toggle"
        type="button"
        aria-expanded="false"
        aria-controls="contact-fab-menu"
        aria-label="Contactmogelijkheden openen"
        data-contact-toggle
      >
        <span class="contact-fab__label">Contact</span>
        <span class="contact-fab__glyph contact-fab__glyph--open" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M4 4h16c.6 0 1 .4 1 1v11c0 .6-.4 1-1 1H8l-4 4v-4H4c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1zm3 4v2h10V8H7zm0 4v2h7v-2H7z"/></svg>
        </span>
        <span class="contact-fab__glyph contact-fab__glyph--close" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/></svg>
        </span>
      </button>
    </div>
  `
}

export function initContactWidget() {
  const root = document.querySelector('[data-contact-fab]')
  const toggle = root?.querySelector('[data-contact-toggle]')
  const menu = root?.querySelector('#contact-fab-menu')
  if (!root || !toggle || !menu) return

  let closeTimer = 0
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const setOpen = (open) => {
    const isOpen = root.classList.contains('is-open')
    if (open === isOpen && (!open || !menu.hidden)) return

    window.clearTimeout(closeTimer)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute(
      'aria-label',
      open ? 'Contactmogelijkheden sluiten' : 'Contactmogelijkheden openen',
    )

    if (open) {
      menu.hidden = false
      requestAnimationFrame(() => {
        root.classList.add('is-open')
      })
      return
    }

    root.classList.remove('is-open')
    if (reduced) {
      menu.hidden = true
      return
    }
    closeTimer = window.setTimeout(() => {
      if (!root.classList.contains('is-open')) menu.hidden = true
    }, CLOSE_MS)
  }

  toggle.addEventListener('click', (event) => {
    event.stopPropagation()
    setOpen(!root.classList.contains('is-open'))
  })

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) setOpen(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !root.classList.contains('is-open')) return
    setOpen(false)
    toggle.focus()
  })

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false))
  })

  syncConsentOffset()
}

function syncConsentOffset() {
  const banner = document.querySelector('[data-consent-banner]')
  const apply = () => {
    const extra =
      banner && !banner.hidden
        ? Math.ceil(banner.getBoundingClientRect().height) + 12
        : 0
    document.documentElement.style.setProperty('--consent-banner-space', `${extra}px`)
  }

  apply()
  if (!banner) return
  new ResizeObserver(apply).observe(banner)
  new MutationObserver(apply).observe(banner, {
    attributes: true,
    attributeFilter: ['hidden'],
  })
}
