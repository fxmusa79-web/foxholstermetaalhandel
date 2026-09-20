const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function initNavigation() {
  const toggle = document.querySelector('[data-nav-toggle]')
  const drawer = document.getElementById('mobile-nav')
  if (!toggle || !drawer) return

  const panel = drawer.querySelector('.mobile-nav__panel')
  let lastFocus = null

  const setOpen = (open) => {
    drawer.hidden = !open
    drawer.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    document.body.classList.toggle('is-nav-open', open)
    const label = toggle.querySelector('.u-sr-only')
    if (label) label.textContent = open ? 'Menu sluiten' : 'Menu openen'

    if (open) {
      lastFocus = document.activeElement
      const first = panel?.querySelector(FOCUSABLE)
      first?.focus()
    } else {
      lastFocus?.focus()
    }
  }

  toggle.addEventListener('click', () => {
    setOpen(drawer.hidden)
  })

  drawer.querySelectorAll('[data-nav-close]').forEach((el) => {
    el.addEventListener('click', () => setOpen(false))
  })

  document.addEventListener('keydown', (event) => {
    if (drawer.hidden) return
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (event.key !== 'Tab' || !panel) return

    const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
    )
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
