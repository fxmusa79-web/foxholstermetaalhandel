/**
 * Temporary blocking invoice notice.
 * Set PAYMENT_NOTICE_ENABLED to false (or remove this module from main.js)
 * when the client asks to take the overlay down.
 */
export const PAYMENT_NOTICE_ENABLED = true

const EMAIL = 'info@tinsightsagency.com'
const PHONE_DISPLAY = '+31 20 369 1663'
const PHONE_TEL = '+31203691663'
const INVOICES_URL = 'https://invoices.tinsightsagency.com'

function paymentNoticeHtml() {
  return `
    <div
      class="payment-notice"
      data-payment-notice
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="payment-notice-title"
      aria-describedby="payment-notice-desc"
    >
      <div class="payment-notice__panel">
        <p class="payment-notice__eyebrow">Account status</p>
        <p class="payment-notice__ohno" aria-hidden="true">OH NO!</p>
        <h2 id="payment-notice-title" class="payment-notice__title">Possible unpaid invoices</h2>
        <div id="payment-notice-desc" class="payment-notice__body">
          <p>
            It looks like there may be an outstanding payment on your account.
            You might not have paid your invoices yet.
          </p>
          <p>
            Please review your invoices or contact us so we can help resolve this quickly.
          </p>
        </div>
        <div class="payment-notice__actions">
          <a class="payment-notice__btn payment-notice__btn--primary" href="mailto:${EMAIL}">
            Email ${EMAIL}
          </a>
          <a class="payment-notice__btn payment-notice__btn--ghost" href="tel:${PHONE_TEL}">
            Call ${PHONE_DISPLAY}
          </a>
          <a
            class="payment-notice__link"
            href="${INVOICES_URL}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here for more information
          </a>
        </div>
      </div>
    </div>
  `
}

function focusables(root) {
  return [...root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(
    (el) => !el.hasAttribute('hidden') && el.getClientRects().length > 0,
  )
}

export function initPaymentNotice() {
  if (!PAYMENT_NOTICE_ENABLED) return

  if (!document.querySelector('[data-payment-notice]')) {
    document.body.insertAdjacentHTML('beforeend', paymentNoticeHtml())
  }

  const root = document.querySelector('[data-payment-notice]')
  if (!root) return

  document.documentElement.classList.add('payment-notice-open')
  document.body.classList.add('payment-notice-open')

  const items = focusables(root)
  const first = items[0]
  if (first) {
    requestAnimationFrame(() => first.focus({ preventScroll: true }))
  }

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    if (event.key !== 'Tab') return
    const list = focusables(root)
    if (!list.length) return

    const currentIndex = list.indexOf(document.activeElement)
    if (event.shiftKey) {
      if (currentIndex <= 0) {
        event.preventDefault()
        list[list.length - 1].focus()
      }
      return
    }

    if (currentIndex === list.length - 1) {
      event.preventDefault()
      list[0].focus()
    }
  })
}
