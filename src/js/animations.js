/**
 * Subtle progressive enhancement only.
 * Content remains fully visible without these animations.
 */
export function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
    document.querySelectorAll('[data-process]').forEach((el) => {
      el.querySelector('.process-line')?.classList.add('is-drawn')
      el.querySelector('.cable-line')?.classList.add('is-drawn')
    })
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )

  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))

  const processObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.querySelector('.process-line')?.classList.add('is-drawn')
        entry.target.querySelector('.cable-line')?.classList.add('is-drawn')
        processObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
  )

  document.querySelectorAll('[data-process]').forEach((el) => processObserver.observe(el))
}
