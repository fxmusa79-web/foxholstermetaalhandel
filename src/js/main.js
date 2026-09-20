import '../css/reset.css'
import '../css/variables.css'
import '../css/base.css'
import '../css/layout.css'
import '../css/components.css'
import '../css/forms.css'
import '../css/utilities.css'
import '../css/animations.css'
import '../css/responsive.css'

import { mountChrome } from './components.js'
import { initNavigation } from './navigation.js'
import { initForms } from './forms.js'
import { initConsent } from './consent.js'
import { initAnimations } from './animations.js'
import { initGalleries } from './gallery.js'
import { initContactWidget } from './contact-widget.js'
import { initMaterialPicker } from './picker.js'

document.documentElement.classList.add('js-ready')

const page = document.body?.dataset.page || 'home'

mountChrome(page)
initNavigation()
initForms()
initConsent()
initAnimations()
initGalleries()
initContactWidget()
initMaterialPicker()
initLegalToc()

function initLegalToc() {
  const toc = document.querySelector('[data-legal-toc]')
  if (!toc) return
  const desktop = window.matchMedia('(min-width: 768px)')
  const sync = () => {
    toc.open = desktop.matches
  }
  sync()
  desktop.addEventListener('change', sync)
}
