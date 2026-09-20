const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_CONTACT = 'info@foxholstermetaalhandel.nl'
const DEFAULT_FROM = 'website@foxholstermetaalhandel.nl'
const USER_ERROR =
  'Het verzenden is niet gelukt. Probeer het opnieuw of neem direct contact op via 0598-394504.'

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
  return `FOX-C-${ymd}-${suffix}`
}

function fromAddress(env) {
  const email = cleanText(env.FROM_EMAIL || DEFAULT_FROM, 120)
  const name = cleanText(env.FROM_NAME || 'Foxholster Metaalhandel', 80)
  return `${name} <${email}>`
}

async function readBody(request) {
  const type = request.headers.get('content-type') || ''
  if (type.includes('application/json')) {
    const data = await request.json()
    return data && typeof data === 'object' ? data : {}
  }
  const form = await request.formData()
  return Object.fromEntries(form.entries())
}

function validate(input) {
  const errors = {}
  const name = cleanText(input.name ?? input.naam, 80)
  const phone = cleanText(input.phone ?? input.telefoon, 40)
  const email = cleanText(input.email, 120).toLowerCase()
  const message = cleanText(input.message ?? input.bericht, 4000)
  const company = cleanText(input.company ?? input.bedrijf, 120)
  const honeypot = String(input.website ?? '').trim()
  const privacyConsent = truthy(input.privacyConsent ?? input.privacy)
  const turnstileToken = String(input.turnstileToken ?? input['cf-turnstile-response'] ?? '').trim()

  if (name.length < 2) errors.name = 'name'
  if (phoneDigits(phone).length < 8 || phoneDigits(phone).length > 15) errors.phone = 'phone'
  if (!EMAIL_RE.test(email)) errors.email = 'email'
  if (message.length < 10) errors.message = 'message'
  if (!privacyConsent) errors.privacyConsent = 'privacy'

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    honeypotFilled: honeypot.length > 0,
    values: { name, phone, email, message, company, turnstileToken },
  }
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

function emailBodies(values, reference, submittedAt) {
  const lines = [
    'Nieuwe contactaanvraag via Foxholster Metaalhandel',
    '',
    `Referentie: ${reference}`,
    `Datum/tijd: ${submittedAt}`,
    `Naam: ${values.name}`,
    values.company ? `Bedrijf: ${values.company}` : null,
    `Telefoonnummer: ${values.phone}`,
    `E-mailadres: ${values.email}`,
    '',
    'Bericht:',
    values.message,
    '',
    'Bron: Contactformulier foxholstermetaalhandel.nl',
  ].filter(Boolean)

  const html = `<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:24px;background:#f3f2ee;color:#151617;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d8d5ce;">
      <tr>
        <td style="padding:20px 24px;border-bottom:2px solid #f20d0d;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5c6164;">Contactformulier</p>
          <h1 style="margin:0;font-size:20px;">Nieuwe contactaanvraag</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 16px;">Er is een bericht binnengekomen via het contactformulier.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#5c6164;width:160px;">Referentie</td><td style="padding:8px 0;">${escapeHtml(reference)}</td></tr>
            <tr><td style="padding:8px 0;color:#5c6164;">Datum/tijd</td><td style="padding:8px 0;">${escapeHtml(submittedAt)}</td></tr>
            <tr><td style="padding:8px 0;color:#5c6164;">Naam</td><td style="padding:8px 0;">${escapeHtml(values.name)}</td></tr>
            ${values.company ? `<tr><td style="padding:8px 0;color:#5c6164;">Bedrijf</td><td style="padding:8px 0;">${escapeHtml(values.company)}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#5c6164;">Telefoonnummer</td><td style="padding:8px 0;">${escapeHtml(values.phone)}</td></tr>
            <tr><td style="padding:8px 0;color:#5c6164;">E-mailadres</td><td style="padding:8px 0;">${escapeHtml(values.email)}</td></tr>
          </table>
          <p style="margin:20px 0 8px;color:#5c6164;">Bericht</p>
          <p style="margin:0;white-space:pre-wrap;">${escapeHtml(values.message)}</p>
          <p style="margin:20px 0 0;color:#5c6164;font-size:13px;">Bron: Contactformulier foxholstermetaalhandel.nl</p>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return { text: lines.join('\n'), html }
}

async function sendResend(env, values, reference, submittedAt) {
  const apiKey = env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, reason: 'resend_not_configured' }
  }

  const payload = {
    from: fromAddress(env),
    to: [cleanText(env.CONTACT_EMAIL || DEFAULT_CONTACT, 120)],
    reply_to: values.email,
    subject: 'Nieuwe contactaanvraag via Foxholster Metaalhandel',
    ...emailBodies(values, reference, submittedAt),
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

async function storeLead(env, values, reference, submittedAt) {
  if (!env.DB) return { ok: false, reason: 'db_missing' }
  await env.DB.prepare(
    `INSERT INTO leads (reference, created_at, name, phone, email, company, description, status, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'new', 'contact')`,
  )
    .bind(
      reference,
      submittedAt,
      values.name,
      values.phone,
      values.email,
      values.company || null,
      values.message,
    )
    .run()
  return { ok: true }
}

export async function handleContactConfig(env) {
  return json({
    turnstileSiteKey: env.TURNSTILE_SITE_KEY || null,
  })
}

export async function handleContact(request, env) {
  if (request.method === 'GET') {
    return handleContactConfig(env)
  }
  if (request.method !== 'POST') {
    return json({ success: false, error: 'method_not_allowed' }, 405)
  }

  let input
  try {
    input = await readBody(request)
  } catch {
    return json({ success: false, error: 'invalid_request', message: USER_ERROR }, 400)
  }

  const parsed = validate(input)
  if (parsed.honeypotFilled) {
    return json({ success: false, error: 'invalid_request', message: USER_ERROR }, 400)
  }
  if (!parsed.ok) {
    return json({ success: false, error: 'validation', fields: parsed.errors, message: USER_ERROR }, 400)
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get('CF-Connecting-IP') || ''
    const valid = parsed.values.turnstileToken
      ? await verifyTurnstile(parsed.values.turnstileToken, env.TURNSTILE_SECRET_KEY, ip)
      : false
    if (!valid) {
      console.error('contact_failed', { reason: 'turnstile_rejected' })
      return json({ success: false, error: 'turnstile', message: USER_ERROR }, 400)
    }
  }

  const submittedAt = new Date().toISOString()
  const reference = makeReference()
  const sent = await sendResend(env, parsed.values, reference, submittedAt)
  if (!sent.ok) {
    console.error('contact_failed', {
      reason: sent.reason,
      status: sent.status || 0,
      code: sent.code || '',
    })
    return json({ success: false, error: 'send_failed', message: USER_ERROR }, 503)
  }

  try {
    await storeLead(env, parsed.values, reference, submittedAt)
  } catch (error) {
    console.error('contact_failed', { reason: 'd1_insert_failed' })
  }

  return json({
    success: true,
    reference,
    message: 'Bedankt, uw bericht is verzonden.',
  })
}
