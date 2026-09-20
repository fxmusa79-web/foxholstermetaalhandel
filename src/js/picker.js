const PICKS = {
  koper: {
    title: 'Koper',
    copy: 'Koperen leidingen, draad, plaat of restpartijen aanbieden? Stuur foto’s en vermeld of het schoon of vermengd is. Beoordeling volgt per partij.',
    href: '/pages/metaal-aanbieden/?materiaal=koper',
    cta: 'Koper aanbieden',
  },
  kabels: {
    title: 'Kabels',
    copy: 'Partijen kabels of grondkabels aanbieden? Stuur foto’s en een geschatte hoeveelheid voor beoordeling.',
    href: '/pages/metaal-aanbieden/?materiaal=kabels',
    cta: 'Kabels aanbieden',
  },
  aluminium: {
    title: 'Aluminium',
    copy: 'Profielen, plaat of productieresten. Geef aan of er bevestigingsmateriaal of andere vervuiling bij zit.',
    href: '/pages/metaal-aanbieden/?materiaal=aluminium',
    cta: 'Aluminium aanbieden',
  },
  rvs: {
    title: 'RVS',
    copy: 'Roestvast staal uit leidingwerk, industrie of sloop kan worden aangeboden. Type of herkomst helpt bij de beoordeling.',
    href: '/pages/metaal-aanbieden/?materiaal=rvs',
    cta: 'RVS aanbieden',
  },
  messing: {
    title: 'Messing',
    copy: 'Fittingen, kranen, staven of restmateriaal. Vermeld of het een schone partij is of gemengd sanitair/metaal.',
    href: '/pages/metaal-aanbieden/?materiaal=messing',
    cta: 'Messing aanbieden',
  },
  ferro: {
    title: 'IJzer / ferro',
    copy: 'IJzerhoudend schroot en staal, van onderdelen tot grotere partijen. Soort, hoeveelheid en vervuiling bepalen of inname past.',
    href: '/pages/metaal-aanbieden/?materiaal=ferro',
    cta: 'Ferro aanbieden',
  },
  accus: {
    title: "Accu's",
    copy: 'Gebruikte accu’s kunnen worden aangeboden. Geef type en hoeveelheid door, vooral bij grotere aantallen.',
    href: '/pages/metaal-aanbieden/?materiaal=accus',
    cta: "Accu's aanbieden",
  },
  grondkabels: {
    title: 'Grondkabels',
    copy: 'Grondkabels en grotere kabelpartijen bekijken we op soort, hoeveelheid en bereikbaarheid. Foto’s maken de beoordeling praktischer.',
    href: '/pages/metaal-aanbieden/?materiaal=grondkabels',
    cta: 'Grondkabels aanbieden',
  },
  motoren: {
    title: 'Motoren',
    copy: 'Elektromotoren en vergelijkbare units. Foto’s van typeplaatje, formaat en eventuele olie of schade zijn nuttig.',
    href: '/pages/metaal-aanbieden/?materiaal=motoren',
    cta: 'Motoren aanbieden',
  },
  machines: {
    title: 'Machines',
    copy: 'Afgeschreven machines of metaalhoudende installaties vragen om foto’s van toegang, hijsen/laden en eventuele vloeistoffen.',
    href: '/pages/metaal-aanbieden/?materiaal=machines',
    cta: 'Machines aanbieden',
  },
  anders: {
    title: 'Anders',
    copy: 'Twijfelt u over het type materiaal? Stuur foto’s en een korte omschrijving. We kijken of de partij in aanmerking komt.',
    href: '/pages/metaal-aanbieden/?materiaal=anders',
    cta: 'Materiaal aanbieden',
  },
}

export function initMaterialPicker() {
  const root = document.querySelector('[data-picker]')
  if (!root) return

  const buttons = [...root.querySelectorAll('[data-pick]')]
  const panel = root.querySelector('[data-picker-panel]')
  const title = root.querySelector('[data-picker-title]')
  const copy = root.querySelector('[data-picker-copy]')
  const cta = root.querySelector('[data-picker-cta]')
  if (!panel || !title || !copy || !cta || !buttons.length) return

  const select = (key, button) => {
    const item = PICKS[key]
    if (!item) return
    buttons.forEach((btn) => {
      const on = btn === button
      btn.classList.toggle('is-active', on)
      btn.setAttribute('aria-pressed', String(on))
    })
    title.textContent = item.title
    copy.textContent = item.copy
    cta.href = item.href
    cta.textContent = item.cta
    panel.hidden = false
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => select(button.dataset.pick, button))
  })
}
