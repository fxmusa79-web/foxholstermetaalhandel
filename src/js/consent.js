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
  if (!readConsent()) banner.hidden = false

  const closePanel = () => {
    panel.hidden = true
  }

  const openPanel = () => {
    const current = readConsent() || defaultConsent
    if (analyticsToggle) analyticsToggle.checked = Boolean(current.analytics)
    panel.hidden = false
    panel.querySelector('[data-consent-save]')?.focus()
  }

  document.querySelector('[data-consent-necessary]')?.addEventListener('click', () => {
    applyConsent(writeConsent({ analytics: false }))
    banner.hidden = true
  })

  document.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
    applyConsent(writeConsent({ analytics: true }))
    banner.hidden = true
  })

  document.querySelectorAll('[data-consent-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      banner.hidden = true
      openPanel()
    })
  })

  document.querySelector('[data-consent-close]')?.addEventListener('click', closePanel)

  document.querySelector('[data-consent-save]')?.addEventListener('click', () => {
    applyConsent(writeConsent({ analytics: Boolean(analyticsToggle?.checked) }))
    closePanel()
    banner.hidden = true
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closePanel()
  })
}
