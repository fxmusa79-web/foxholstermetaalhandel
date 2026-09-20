const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_CONTACT = 'info@foxholstermetaalhandel.nl'
const DEFAULT_FROM = 'website@foxholstermetaalhandel.nl'
const USER_ERROR =
  'Het verzenden is niet gelukt. Probeer het opnieuw of neem direct contact op via 0598-394504.'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
const MAX_FILES = 6
const MAX_FILE_BYTES = 8 * 1024 * 1024
const MAX_TOTAL_BYTES = 24 * 1024 * 1024

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'cache-control': 'no-store' },
  })
}

function cleanText(value, max) {
  const text = String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.slice(0, max)
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function truthy(value) {
  return value === true || value === 'true' || value === 'on' || value === '1'
}

function phoneDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

function makeReference(now = new Date()) {
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '')
  const bytes = crypto.getRandomValues(new Uint8Array(2))
  const suffix = [...bytes].map((byte) => byte.toString(16).toUpperCase().padStart(2, '0')).join('')
  return `FOX-O-${ymd}-${suffix}`
}

function fromAddress(env) {
  const email = cleanText(env.FROM_EMAIL || DEFAULT_FROM, 120)
  const name = cleanText(env.FROM_NAME || 'Foxholster Metaalhandel', 80)
  return `${name} <${email}>`
}

function safeFileName(name, index) {
  const raw = String(name || `foto-${index + 1}`).replace(/\\/g, '/')
  const base = raw.split('/').pop() || `foto-${index + 1}`
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
  return cleaned || `foto-${index + 1}`
}

async function verifyTurnstile(token, secret, ip) {
  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (ip) body.set('remoteip', ip)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  if (!response.ok) return false
  const result = await response.json()
  return Boolean(result?.success)
}

async function readOfferInput(request) {
  const type = request.headers.get('content-type') || ''
  if (type.includes('multipart/form-data') || type.includes('application/x-www-form-urlencoded')) {
    const form = await request.formData()
    const files = form
      .getAll('photos')
      .filter((item) => item instanceof File && item.size > 0)
    const data = {}
    for (const [key, value] of form.entries()) {
      if (key === 'photos') continue
      if (typeof value === 'string') data[key] = value
    }
    return { data, files }
  }
  if (type.includes('application/json')) {
    const data = await request.json()
    return { data: data && typeof data === 'object' ? data : {}, files: [] }
  }
  throw new Error('invalid_request')
}

function validateOffer(input) {
  const errors = {}
  const name = cleanText(input.name ?? input.naam, 80)
  const company = cleanText(input.company ?? input.bedrijf, 120)
  const phone = cleanText(input.phone ?? input.telefoon, 40)
  const email = cleanText(input.email, 120).toLowerCase()
  const customerType = cleanText(input.customerType ?? input.klanttype, 40)
  const postalCode = cleanText(input.postalCode ?? input.postcode, 20)
  const city = cleanText(input.city ?? input.plaats, 80)
  const material = cleanText(input.material ?? input.materiaal, 80)
  const quantity = cleanText(input.quantity ?? input.hoeveelheid, 80)
  const transport = cleanText(input.transport, 40)
  const address = cleanText(input.address ?? input.adres, 200)
  const message = cleanText(input.message ?? input.omschrijving, 4000)
  const honeypot = String(input.website ?? '').trim()
  const privacyConsent = truthy(input.privacyConsent ?? input.privacy)
  const turnstileToken = String(input.turnstileToken ?? input['cf-turnstile-response'] ?? '').trim()

  if (name.length < 2) errors.name = 'name'
  if (phoneDigits(phone).length < 8 || phoneDigits(phone).length > 15) errors.phone = 'phone'
  if (!EMAIL_RE.test(email)) errors.email = 'email'
  if (city.length < 2) errors.city = 'city'
  if (!material) errors.material = 'material'
  if (message.length < 10) errors.message = 'message'
  if (!privacyConsent) errors.privacyConsent = 'privacy'

  const allowedTypes = new Set(['particulier', 'zakelijk'])
  const allowedTransport = new Set(['brengen', 'ophalen', 'nader'])

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    honeypotFilled: honeypot.length > 0,
    values: {
      name,
      company,
      phone,
      email,
      customerType: allowedTypes.has(customerType) ? customerType : '',
      postalCode,
      city,
      material,
      quantity,
      transport: allowedTransport.has(transport) ? transport : '',
      address,
      message,
      turnstileToken,
    },
  }
}

function describeOffer(values, uploads) {
  const lines = [
    values.customerType ? `Type klant: ${values.customerType}` : null,
    values.company ? `Bedrijf: ${values.company}` : null,
    values.postalCode || values.city ? `Locatie: ${[values.postalCode, values.city].filter(Boolean).join(' ')}` : null,
    `Materiaal: ${values.material}`,
    values.quantity ? `Hoeveelheid: ${values.quantity}` : null,
    values.transport ? `Brengen / ophalen: ${values.transport}` : null,
    values.address ? `Adres: ${values.address}` : null,
    '',
    values.message,
    '',
    uploads.length ? `Foto’s: ${uploads.length} bestand(en) opgeslagen.` : 'Foto’s: geen bestanden meegestuurd.',
  ].filter((line) => line !== null)
  return lines.join('\n')
}

function emailBodies(values, reference, submittedAt, uploads) {
  const description = describeOffer(values, uploads)
  const lines = [
    'Nieuwe metaalaanbieding via Foxholster Metaalhandel',
    '',
    `Referentie: ${reference}`,
    `Datum/tijd: ${submittedAt}`,
    `Naam: ${values.name}`,
    `Telefoonnummer: ${values.phone}`,
    `E-mailadres: ${values.email}`,
    '',
    description,
    '',
    'Bron: Aanmeldformulier foxholstermetaalhandel.nl',
  ]

  const uploadRows = uploads.length
    ? uploads
        .map((file) => `<tr><td style="padding:8px 0;color:#5c6164;">Foto</td><td style="padding:8px 0;">${escapeHtml(file.name)} (${Math.round(file.size / 1024)} kB)</td></tr>`)
        .join('')
    : '<tr><td style="padding:8px 0;color:#5c6164;">Foto’s</td><td style="padding:8px 0;">Geen bestanden meegestuurd</td></tr>'

  const html = `<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:24px;background:#f3f2ee;color:#151617;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d8d5ce;">
      <tr>
        <td style="padding:20px 24px;border-bottom:2px solid #f20d0d;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5c6164;">Metaal aanbieden</p>
          <h1 style="margin:0;font-size:20px;">Nieuwe metaalaanbieding</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 16px;">Er is een partij aangemeld via het formulier Metaal aanbieden.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#5c6164;width:160px;">Referentie</td><td style="padding:8px 0;">${escapeHtml(reference)}</td></tr>
            <tr><td style="padding:8px 0;color:#5c6164;">Datum/tijd</td><td style="padding:8px 0;">${escapeHtml(submittedAt)}</td></tr>
            <tr><td style="padding:8px 0;color:#5c6164;">Naam</td><td style="padding:8px 0;">${escapeHtml(values.name)}</td></tr>
            ${values.company ? `<tr><td style="padding:8px 0;color:#5c6164;">Bedrijf</td><td style="padding:8px 0;">${escapeHtml(values.company)}</td></tr>` : ''}
            ${values.customerType ? `<tr><td style="padding:8px 0;color:#5c6164;">Type klant</td><td style="padding:8px 0;">${escapeHtml(values.customerType)}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#5c6164;">Telefoonnummer</td><td style="padding:8px 0;">${escapeHtml(values.phone)}</td></tr>
            <tr><td style="padding:8px 0;color:#5c6164;">E-mailadres</td><td style="padding:8px 0;">${escapeHtml(values.email)}</td></tr>
            <tr><td style="padding:8px 0;color:#5c6164;">Locatie</td><td style="padding:8px 0;">${escapeHtml([values.postalCode, values.city].filter(Boolean).join(' '))}</td></tr>
            <tr><td style="padding:8px 0;color:#5c6164;">Materiaal</td><td style="padding:8px 0;">${escapeHtml(values.material)}</td></tr>
            ${values.quantity ? `<tr><td style="padding:8px 0;color:#5c6164;">Hoeveelheid</td><td style="padding:8px 0;">${escapeHtml(values.quantity)}</td></tr>` : ''}
            ${values.transport ? `<tr><td style="padding:8px 0;color:#5c6164;">Brengen / ophalen</td><td style="padding:8px 0;">${escapeHtml(values.transport)}</td></tr>` : ''}
            ${values.address ? `<tr><td style="padding:8px 0;color:#5c6164;">Adres</td><td style="padding:8px 0;">${escapeHtml(values.address)}</td></tr>` : ''}
            ${uploadRows}
          </table>
          <p style="margin:20px 0 8px;color:#5c6164;">Omschrijving</p>
          <p style="margin:0;white-space:pre-wrap;">${escapeHtml(values.message)}</p>
          <p style="margin:20px 0 0;color:#5c6164;font-size:13px;">Bron: Aanmeldformulier foxholstermetaalhandel.nl</p>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return { text: lines.join('\n'), html }
}

async function sendResend(env, values, reference, submittedAt, uploads) {
  const apiKey = env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, reason: 'resend_not_configured' }
  }

  const payload = {
    from: fromAddress(env),
    to: [cleanText(env.CONTACT_EMAIL || DEFAULT_CONTACT, 120)],
    reply_to: values.email,
    subject: 'Nieuwe metaalaanbieding via Foxholster Metaalhandel',
    ...emailBodies(values, reference, submittedAt, uploads),
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (response.ok) return { ok: true }

  let code = ''
  try {
    const body = await response.json()
    code = body?.message || body?.name || ''
  } catch {
    code = ''
  }
  return { ok: false, reason: 'resend_rejected', status: response.status, code }
}

function validateFiles(files) {
  if (files.length > MAX_FILES) return { ok: false, error: 'too_many_files' }
  let total = 0
  for (const file of files) {
    const type = String(file.type || '').toLowerCase()
    if (!ALLOWED_TYPES.has(type)) return { ok: false, error: 'invalid_type' }
    if (file.size > MAX_FILE_BYTES) return { ok: false, error: 'file_too_large' }
    total += file.size
  }
  if (total > MAX_TOTAL_BYTES) return { ok: false, error: 'total_too_large' }
  return { ok: true }
}

async function storeUploads(env, files, reference) {
  if (!files.length) return []
  if (!env.UPLOADS) return { error: 'r2_missing' }

  const stored = []
  for (const [index, file] of files.entries()) {
    const name = safeFileName(file.name, index)
    const key = `offers/${reference}/${String(index + 1).padStart(2, '0')}-${name}`
    await env.UPLOADS.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
      customMetadata: {
        reference,
        originalName: String(file.name || name).slice(0, 120),
      },
    })
    stored.push({ key, name, size: file.size, type: file.type })
  }
  return stored
}

async function storeLead(env, values, reference, submittedAt, uploads) {
  if (!env.DB) return { ok: false, reason: 'db_missing' }
  await env.DB.prepare(
    `INSERT INTO leads (reference, created_at, name, phone, email, company, description, status, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'new', 'offer')`,
  )
    .bind(
      reference,
      submittedAt,
      values.name,
      values.phone,
      values.email,
      values.company || null,
      describeOffer(values, Array.isArray(uploads) ? uploads : []),
    )
    .run()
  return { ok: true }
}

export async function handleOffer(request, env) {
  if (request.method !== 'POST') {
    return json({ success: false, error: 'method_not_allowed' }, 405)
  }

  let payload
  try {
    payload = await readOfferInput(request)
  } catch {
    return json({ success: false, error: 'invalid_request', message: USER_ERROR }, 400)
  }

  const parsed = validateOffer(payload.data)
  if (parsed.honeypotFilled) {
    return json({ success: false, error: 'invalid_request', message: USER_ERROR }, 400)
  }
  if (!parsed.ok) {
    return json({ success: false, error: 'validation', fields: parsed.errors, message: USER_ERROR }, 400)
  }

  const filesOk = validateFiles(payload.files)
  if (!filesOk.ok) {
    return json({ success: false, error: filesOk.error, message: USER_ERROR }, 400)
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get('CF-Connecting-IP') || ''
    const valid = parsed.values.turnstileToken
      ? await verifyTurnstile(parsed.values.turnstileToken, env.TURNSTILE_SECRET_KEY, ip)
      : false
    if (!valid) {
      console.error('offer_failed', { reason: 'turnstile_rejected' })
      return json({ success: false, error: 'turnstile', message: USER_ERROR }, 400)
    }
  }

  const submittedAt = new Date().toISOString()
  const reference = makeReference()
  const uploads = await storeUploads(env, payload.files, reference)
  if (uploads?.error) {
    console.error('offer_failed', { reason: uploads.error })
    return json({ success: false, error: 'upload_failed', message: USER_ERROR }, 503)
  }

  const sent = await sendResend(env, parsed.values, reference, submittedAt, uploads)
  if (!sent.ok) {
    console.error('offer_failed', {
      reason: sent.reason,
      status: sent.status || 0,
      code: sent.code || '',
    })
    return json({ success: false, error: 'send_failed', message: USER_ERROR }, 503)
  }

  try {
    await storeLead(env, parsed.values, reference, submittedAt, uploads)
  } catch {
    console.error('offer_failed', { reason: 'd1_insert_failed' })
  }

  return json({
    success: true,
    reference,
    message: 'Bedankt, uw aanvraag is verzonden.',
  })
}
