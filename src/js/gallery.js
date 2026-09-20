const INTERVAL = 5000
const RESUME_DELAY = 10000

export function initGalleries() {
  document.querySelectorAll('[data-gallery]').forEach(initGallery)
}

function initGallery(root) {
  const track = root.querySelector('[data-gallery-track]')
  const slides = [...root.querySelectorAll('[data-gallery-slide]')]
  const dotsWrap = root.querySelector('[data-gallery-dots]')
  const prev = root.querySelector('[data-gallery-prev]')
  const next = root.querySelector('[data-gallery-next]')
  if (!track || slides.length < 2) return

  let index = 0
  let timer = 0
  let resumeTimer = 0
  let interacting = false
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const carouselQuery = window.matchMedia('(max-width: 767px)')

  slides.forEach((_, i) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'practice-dot'
    btn.setAttribute('aria-label', `Foto ${i + 1} van ${slides.length}`)
    btn.addEventListener('click', () => {
      pause()
      goTo(i)
      scheduleResume()
    })
    dotsWrap?.append(btn)
  })

  const dots = [...(dotsWrap?.querySelectorAll('.practice-dot') || [])]

  const isCarousel = () => carouselQuery.matches

  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length
    if (isCarousel()) {
      const left = slides[index].offsetLeft
      track.scrollTo({
        left,
        behavior: reduced ? 'auto' : 'smooth',
      })
    }
    updateDots()
  }

  const updateDots = () => {
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index)
      if (i === index) dot.setAttribute('aria-current', 'true')
      else dot.removeAttribute('aria-current')
    })
    const status = root.querySelector('[data-gallery-status]')
    if (status) status.textContent = `${index + 1} / ${slides.length}`
  }

  const onScroll = () => {
    if (!isCarousel()) return
    const width = slides[0].getBoundingClientRect().width || 1
    const nextIndex = Math.round(track.scrollLeft / width)
    if (nextIndex !== index && nextIndex >= 0 && nextIndex < slides.length) {
      index = nextIndex
      updateDots()
    }
  }

  const tick = () => {
    if (!isCarousel() || interacting || document.hidden || reduced) return
    goTo(index + 1)
  }

  const start = () => {
    stop()
    if (reduced || !isCarousel()) return
    timer = window.setInterval(tick, INTERVAL)
  }

  const stop = () => {
    window.clearInterval(timer)
    timer = 0
  }

  const pause = () => {
    interacting = true
    stop()
    window.clearTimeout(resumeTimer)
  }

  const scheduleResume = () => {
    window.clearTimeout(resumeTimer)
    resumeTimer = window.setTimeout(() => {
      interacting = false
      start()
    }, RESUME_DELAY)
  }

  track.addEventListener('scroll', onScroll, { passive: true })
  track.addEventListener('pointerdown', pause)
  track.addEventListener('pointerup', scheduleResume)
  track.addEventListener('pointercancel', scheduleResume)
  root.addEventListener('mouseenter', pause)
  root.addEventListener('mouseleave', () => {
    interacting = false
    start()
  })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else if (!interacting) start()
  })
  carouselQuery.addEventListener('change', () => {
    interacting = false
    window.clearTimeout(resumeTimer)
    stop()
    if (isCarousel()) {
      goTo(0)
      track.scrollTo({ left: 0, behavior: 'auto' })
      start()
      return
    }
    updateDots()
  })

  prev?.addEventListener('click', () => {
    pause()
    goTo(index - 1)
    scheduleResume()
  })
  next?.addEventListener('click', () => {
    pause()
    goTo(index + 1)
    scheduleResume()
  })

  const resetToStart = () => {
    index = 0
    track.scrollTo({ left: 0, behavior: 'auto' })
    updateDots()
  }

  resetToStart()
  if (isCarousel()) {
    requestAnimationFrame(resetToStart)
  }
  start()
}
