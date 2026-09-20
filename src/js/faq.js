export function initFaq() {
  document.querySelectorAll('.faq-list details').forEach((details, index) => {
    details.removeAttribute('open')

    const summary = details.querySelector('summary')
    if (!summary) return

    let panel = details.querySelector('.faq-item__panel')
    if (!panel) {
      panel = document.createElement('div')
      panel.className = 'faq-item__panel'
      const rest = [...details.childNodes].filter((node) => node !== summary)
      rest.forEach((node) => panel.append(node))
      details.append(panel)
    }

    if (!panel.id) {
      panel.id = `faq-panel-${index + 1}`
    }

    summary.setAttribute('aria-controls', panel.id)
    summary.setAttribute('aria-expanded', 'false')

    details.addEventListener('toggle', () => {
      summary.setAttribute('aria-expanded', details.open ? 'true' : 'false')
    })
  })
}
