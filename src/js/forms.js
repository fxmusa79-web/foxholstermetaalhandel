import { materialSelectOptions } from '../data/materials.js'

const OFFER_STATUS_MESSAGE =
  'Het formulier is nog niet gekoppeld aan verzending. Uw gegevens zijn niet verzonden. Bel, WhatsApp of e-mail ons om de partij of vraag door te geven.'
const SEND_ERROR =
  'Het verzenden is niet gelukt. Probeer het opnieuw of neem direct contact op via 0598-394504.'

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

function showStatus(form, text, tone = 'info') {
  const status = form.querySelector('[data-form-status]')
  if (!status) return
  status.hidden = false
  status.textContent = text
  status.classList.remove('form-status--info', 'form-status--ok', 'form-status--error')
  status.classList.add(`form-status--${tone}`)
}

function setSubmitting(form, submitting) {
  const submit = form.querySelector('[type="submit"]')
  if (!submit) return
  const label = submit.dataset.submitLabel || 'Verstuur bericht'
  submit.disabled = submitting
  submit.textContent = submitting ? 'Bericht versturen...' : label
}

async function loadTurnstile(form) {
  const slot = form.querySelector('[data-turnstile]')
  if (!slot || slot.dataset.ready === 'true') return
  try {
    const response = await fetch('/api/config', { headers: { accept: 'application/json' } })
    if (!response.ok) return
    const data = await response.json()
    const siteKey = data?.turnstileSiteKey
    if (!siteKey) return

    slot.hidden = false
    slot.dataset.ready = 'true'
    const widget = document.createElement('div')
    widget.className = 'cf-turnstile'
    widget.dataset.sitekey = siteKey
    widget.dataset.theme = 'light'
    slot.append(widget)

    if (!document.querySelector('script[data-turnstile]')) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.dataset.turnstile = 'true'
      document.head.append(script)
    }
  } catch {
    /* Turnstile remains unused if the config endpoint is unavailable. */
  }
}

function readTurnstileToken(form) {
  const field = form.querySelector('[name="cf-turnstile-response"]')
  return field instanceof HTMLInputElement ? field.value : ''
}

async function submitContact(form) {
  const data = new FormData(form)
  const payload = {
    name: String(data.get('name') || ''),
    company: String(data.get('company') || ''),
    phone: String(data.get('phone') || ''),
    email: String(data.get('email') || ''),
    message: String(data.get('message') || ''),
    privacyConsent: data.get('privacyConsent') === 'true' || data.get('privacyConsent') === 'on',
    website: String(data.get('website') || ''),
    turnstileToken: readTurnstileToken(form),
  }

  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok || !body?.success) {
    throw new Error('send_failed')
  }
  return body
}

export function initForms() {
  const forms = document.querySelectorAll('[data-offer-form], [data-contact-form]')
  forms.forEach((form) => {
    fillMaterialSelects(form)
    if (form.hasAttribute('data-contact-form')) {
      loadTurnstile(form)
    }

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

      if (form.hasAttribute('data-offer-form')) {
        showStatus(form, OFFER_STATUS_MESSAGE, 'info')
        return
      }

      setSubmitting(form, true)
      try {
        const result = await submitContact(form)
        const reference = result.reference ? ` Referentie: ${result.reference}` : ''
        showStatus(form, `Bedankt, uw bericht is verzonden.${reference}`, 'ok')
        form.reset()
      } catch {
        showStatus(form, SEND_ERROR, 'error')
      } finally {
        setSubmitting(form, false)
      }
    })
  })
}
