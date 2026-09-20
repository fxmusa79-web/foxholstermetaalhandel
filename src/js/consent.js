const STORAGE_KEY = 'fm-consent'

const defaultConsent = {
  necessary: true,
  analytics: false,
  updatedAt: null,
}

function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      updatedAt: parsed.updatedAt || null,
    }
  } catch {
    return null
  }
}

function writeConsent(next) {
  const value = {
    necessary: true,
    analytics: Boolean(next.analytics),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  return value
}

function applyConsent(consent) {
  document.documentElement.dataset.consentAnalytics = String(Boolean(consent?.analytics))
  // Analytics scripts are intentionally NOT loaded in this foundation.
}

export function initConsent() {
  const banner = document.querySelector('[data-consent-banner]')
  const panel = document.querySelector('[data-consent-panel]')
  const analyticsToggle = document.querySelector('[data-consent-analytics]')
  if (!banner || !panel) return

  const stored = readConsent() || defaultConsent
  applyConsent(stored)
  if (analyticsToggle) analyticsToggle.checked = Boolean(stored.analytics)

  const setCookieSpace = (on) => {
    const root = document.documentElement
    root.classList.toggle('cookie-open', on)
    document.body?.classList.toggle('cookie-open', on)
    if (!on) {
      root.style.setProperty('--cookie-height', '0px')
      root.style.setProperty('--consent-banner-space', '0px')
      return
    }
    const height = Math.ceil(banner.getBoundingClientRect().height)
    root.style.setProperty('--cookie-height', `${height}px`)
    root.style.setProperty('--consent-banner-space', `${height + 24}px`)
  }

  const showBanner = () => {
    banner.hidden = false
    requestAnimationFrame(() => {
      banner.classList.add('is-in')
      setCookieSpace(true)
    })
  }

  const hideBanner = () => {
    banner.classList.remove('is-in')
    setCookieSpace(false)
    banner.hidden = true
  }

  const panelFocusables = () =>
    [...panel.querySelectorAll('button, [href], input:not([disabled]), select, textarea')].filter(
      (el) => !el.hasAttribute('hidden') && el.tabIndex !== -1
    )

  const closePanel = () => {
    panel.hidden = true
    if (!readConsent()) showBanner()
  }

  const openPanel = () => {
    const current = readConsent() || defaultConsent
    if (analyticsToggle) analyticsToggle.checked = Boolean(current.analytics)
    hideBanner()
    panel.hidden = false
    panel.querySelector('[data-consent-save]')?.focus()
  }

  if (!readConsent()) showBanner()

  const spaceObserver = new ResizeObserver(() => {
    if (!banner.hidden) setCookieSpace(true)
  })
  spaceObserver.observe(banner)

  document.querySelector('[data-consent-necessary]')?.addEventListener('click', () => {
    applyConsent(writeConsent({ analytics: false }))
    hideBanner()
  })

  document.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
    applyConsent(writeConsent({ analytics: true }))
    hideBanner()
  })

  document.querySelectorAll('[data-consent-open]').forEach((btn) => {
    btn.addEventListener('click', openPanel)
  })

  document.querySelector('[data-consent-close]')?.addEventListener('click', closePanel)

  document.querySelector('[data-consent-save]')?.addEventListener('click', () => {
    applyConsent(writeConsent({ analytics: Boolean(analyticsToggle?.checked) }))
    panel.hidden = true
    hideBanner()
  })

  panel.addEventListener('click', (event) => {
    if (event.target === panel) closePanel()
  })

  document.addEventListener('keydown', (event) => {
    if (panel.hidden) return
    if (event.key === 'Escape') {
      closePanel()
      return
    }
    if (event.key !== 'Tab') return
    const items = panelFocusables()
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })
}
