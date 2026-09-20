import { materialSelectOptions } from '../data/materials.js'

const SEND_ERROR =
  'Het verzenden is niet gelukt. Probeer het opnieuw of neem direct contact op via 0598-394504.'
const FILE_ERROR = 'Kies JPG, PNG, WebP of HEIC, maximaal 6 foto’s van 8 MB per bestand.'
const MAX_FILES = 6
const MAX_FILE_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])

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
    if (field.closest('[hidden]')) return
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
  const label = submit.dataset.submitLabel || submit.textContent
  if (!submit.dataset.submitLabel) submit.dataset.submitLabel = label
  submit.disabled = submitting
  submit.textContent = submitting ? 'Bezig met verzenden...' : submit.dataset.submitLabel
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

function syncFileInput(input, files) {
  const transfer = new DataTransfer()
  files.forEach((file) => transfer.items.add(file))
  input.files = transfer.files
}

function initPhotoField(form) {
  const input = form.querySelector('[name="photos"]')
  const list = form.querySelector('[data-photo-list]')
  if (!input || !list) return

  let files = []

  const render = () => {
    list.replaceChildren()
    files.forEach((file, index) => {
      const item = document.createElement('li')
      item.className = 'photo-preview__item'
      const thumb = document.createElement('span')
      thumb.className = 'photo-preview__thumb'
      if (file.type && file.type.startsWith('image/') && file.type !== 'image/heic' && file.type !== 'image/heif') {
        const img = document.createElement('img')
        img.alt = ''
        img.src = URL.createObjectURL(file)
        thumb.append(img)
      } else {
        thumb.textContent = 'Foto'
      }
      const meta = document.createElement('span')
      meta.className = 'photo-preview__meta'
      meta.textContent = `${file.name} (${Math.max(1, Math.round(file.size / 1024))} kB)`
      const remove = document.createElement('button')
      remove.type = 'button'
      remove.className = 'photo-preview__remove'
      remove.textContent = 'Verwijderen'
      remove.addEventListener('click', () => {
        files = files.filter((_, current) => current !== index)
        syncFileInput(input, files)
        render()
      })
      item.append(thumb, meta, remove)
      list.append(item)
    })
    list.hidden = files.length === 0
  }

  input.addEventListener('change', () => {
    const next = [...files, ...input.files]
    const valid = []
    for (const file of next) {
      if (valid.length >= MAX_FILES) break
      if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_BYTES) {
        showStatus(form, FILE_ERROR, 'error')
        continue
      }
      valid.push(file)
    }
    files = valid
    syncFileInput(input, files)
    render()
  })
}

function initTransportField(form) {
  const select = form.querySelector('[name="transport"]')
  const addressField = form.querySelector('[data-pickup-address]')
  if (!select || !addressField) return

  const sync = () => {
    const needed = select.value === 'ophalen'
    addressField.hidden = !needed
    const input = addressField.querySelector('input, textarea')
    if (input) input.required = needed
    if (!needed && input) setFieldError(input, '')
  }

  select.addEventListener('change', sync)
  sync()
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

async function submitOffer(form) {
  const payload = new FormData(form)
  payload.set('turnstileToken', readTurnstileToken(form))
  payload.set(
    'privacyConsent',
    payload.get('privacyConsent') === 'true' || payload.get('privacy') === 'on' || payload.get('privacy') === 'true'
      ? 'true'
      : 'false',
  )

  const response = await fetch('/api/offerte', {
    method: 'POST',
    headers: { accept: 'application/json' },
    body: payload,
  })

  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok || !body?.success) {
    throw new Error(body?.error || 'send_failed')
  }
  return body
}

export function initForms() {
  const forms = document.querySelectorAll('[data-offer-form], [data-contact-form]')
  forms.forEach((form) => {
    fillMaterialSelects(form)
    loadTurnstile(form)
    if (form.hasAttribute('data-offer-form')) {
      initPhotoField(form)
      initTransportField(form)
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

      setSubmitting(form, true)
      try {
        const result = form.hasAttribute('data-offer-form') ? await submitOffer(form) : await submitContact(form)
        const reference = result.reference ? ` Referentie: ${result.reference}` : ''
        const thanks = form.hasAttribute('data-offer-form')
          ? 'Bedankt, uw aanvraag is verzonden.'
          : 'Bedankt, uw bericht is verzonden.'
        showStatus(form, `${thanks}${reference}`, 'ok')
        form.reset()
        form.querySelector('[data-photo-list]')?.replaceChildren()
        const photoList = form.querySelector('[data-photo-list]')
        if (photoList) photoList.hidden = true
        form.querySelector('[data-pickup-address]') && initTransportField(form)
      } catch {
        showStatus(form, SEND_ERROR, 'error')
      } finally {
        setSubmitting(form, false)
      }
    })
  })
}
