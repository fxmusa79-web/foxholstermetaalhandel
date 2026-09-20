const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
const CLOSE_MS = 280

export function initNavigation() {
  const toggle = document.querySelector('[data-nav-toggle]')
  const drawer = document.getElementById('mobile-nav')
  if (!toggle || !drawer) return

  const panel = drawer.querySelector('.mobile-nav__panel')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lastFocus = null
  let closeTimer = 0

  const setOpen = (open) => {
    window.clearTimeout(closeTimer)
    toggle.setAttribute('aria-expanded', String(open))
    document.body.classList.toggle('is-nav-open', open)
    const label = toggle.querySelector('.u-sr-only')
    if (label) label.textContent = open ? 'Menu sluiten' : 'Menu openen'

    if (open) {
      lastFocus = document.activeElement
      drawer.hidden = false
      requestAnimationFrame(() => {
        drawer.classList.add('is-open')
      })
      const closeBtn = panel?.querySelector('.mobile-nav__close')
      const first = closeBtn || panel?.querySelector(FOCUSABLE)
      first?.focus()
      return
    }

    drawer.classList.remove('is-open')
    const finish = () => {
      drawer.hidden = true
    }
    if (reduced) {
      finish()
    } else {
      closeTimer = window.setTimeout(finish, CLOSE_MS)
    }
    lastFocus?.focus()
  }

  toggle.addEventListener('click', () => {
    setOpen(drawer.hidden)
  })

  drawer.querySelectorAll('[data-nav-close]').forEach((el) => {
    el.addEventListener('click', () => setOpen(false))
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1180) setOpen(false)
  })

  document.addEventListener('keydown', (event) => {
    if (drawer.hidden && !drawer.classList.contains('is-open')) return
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (event.key !== 'Tab' || !panel) return
    if (drawer.hidden) return

    const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => {
      if (el.hasAttribute('disabled')) return false
      return el.getClientRects().length > 0
    })
    if (!nodes.length) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })
}
