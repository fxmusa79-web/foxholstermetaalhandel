import { materialSelectOptions } from '../data/materials.js'

/**
 * Frontend-only form behaviour.
 *
 * FUTURE INTEGRATION POINT
 * -------------------------
 * Replace `submitToPlaceholder()` with a POST to a Cloudflare Worker.
 * Intended later stack (NOT configured in this project):
 * - Cloudflare Worker endpoint
 * - Resend for e-mail delivery
 * - Cloudflare Turnstile for bot protection
 *
 * Do not invent endpoint URLs, API keys or secrets here.
 * Do not show a fake "verzonden" success state until a real backend exists.
 */

const STATUS_MESSAGE =
  'Het formulier is nog niet gekoppeld aan verzending. Uw gegevens zijn niet verzonden. Bel, WhatsApp of e-mail ons om de partij of vraag door te geven.'

function fillMaterialSelects(root) {
  root.querySelectorAll('[data-material-options]').forEach((select) => {
    if (select.dataset.filled === 'true') return
    const placeholder = select.querySelector('option[value=""]')
    select.innerHTML = ''
    if (placeholder) select.append(placeholder)
    else {
      const option = document.createElement('option')
      option.value = ''
      option.textContent = 'Kies een type'
      select.append(option)
    }
    materialSelectOptions.forEach((item) => {
      const option = document.createElement('option')
      option.value = item.value
      option.textContent = item.label
      select.append(option)
    })
    select.dataset.filled = 'true'
    applyMaterialQuery(select)
  })
}

function applyMaterialQuery(select) {
  const value = new URLSearchParams(window.location.search).get('materiaal')
  if (!value) return
  const exists = [...select.options].some((option) => option.value === value)
  if (exists) select.value = value
}

function setFieldError(field, message) {
  const holder = field.closest('.form-field')?.querySelector('.field-error')
  field.setAttribute('aria-invalid', message ? 'true' : 'false')
  if (holder) holder.textContent = message || ''
}

function validateForm(form) {
  let ok = true
  form.querySelectorAll('[required]').forEach((field) => {
    let message = ''
    if (field.type === 'checkbox' && !field.checked) {
      message = 'Bevestig de privacyverklaring om verder te gaan.'
    } else if (field.type === 'email' && field.value && !field.validity.valid) {
      message = 'Vul een geldig e-mailadres in.'
    } else if (!field.value || !String(field.value).trim()) {
      message = 'Dit veld is verplicht.'
    } else if (!field.validity.valid) {
      message = field.validationMessage
    }
    setFieldError(field, message)
    if (message) ok = false
  })
  return ok
}

async function submitToPlaceholder(_payload) {
  // TODO: POST JSON to the future Worker endpoint once it exists.
  // Example shape (do not enable until the endpoint is real):
  // await fetch(import.meta.env.VITE_FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  return { ok: false, deferred: true }
}

function showStatus(form, text) {
  const status = form.querySelector('[data-form-status]')
  if (!status) return
  status.hidden = false
  status.textContent = text
}

export function initForms() {
  const forms = document.querySelectorAll('[data-offer-form], [data-contact-form]')
  forms.forEach((form) => {
    fillMaterialSelects(form)

    form.addEventListener('input', (event) => {
      const field = event.target
      if (field instanceof HTMLElement && field.hasAttribute('required')) {
        setFieldError(field, '')
      }
    })

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      if (!validateForm(form)) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]')
        firstInvalid?.focus()
        return
      }

      const submit = form.querySelector('[type="submit"]')
      if (submit) submit.disabled = true

      const data = new FormData(form)
      const payload = Object.fromEntries(data.entries())
      payload.photos = data.getAll('photos')

      try {
        await submitToPlaceholder(payload)
        showStatus(form, STATUS_MESSAGE)
      } catch (error) {
        showStatus(form, STATUS_MESSAGE)
      } finally {
        if (submit) submit.disabled = false
      }
    })
  })
}
