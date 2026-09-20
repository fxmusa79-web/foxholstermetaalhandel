/**
 * Central business details for Foxholster Metaalhandel.
 *
 * Confirmed contact, address, KvK and registration numbers live here.
 * Do not invent BTW, opening hours, geo coordinates or reviews.
 */
export const SITE_ORIGIN = 'https://foxholstermetaalhandel.nl'

export const business = {
  companyName: 'Foxholster Metaalhandel',
  shortName: 'Foxholster',
  phone: '0598-394504',
  privatePhone: '0598-380686',
  mobileFallback: '06-50565966',
  email: 'info@foxholstermetaalhandel.nl',
  street: 'G. Imbosstraat 60',
  postalCode: '9607 PE',
  city: 'Foxhol',
  region: 'Groningen',
  country: 'NL',
  kvk: '02326351',
  vat: '[BTW-NUMMER]',
  openingHours: '[OPENINGSTIJDEN]',
  availabilityNote: 'Neem contact op voor actuele bereikbaarheid.',
  domain: SITE_ORIGIN,
  audience: 'Particulier & zakelijk',
  locationFocus: 'Foxhol en omgeving',
  experience: 'Meer dan 35 jaar',
  experienceLine: 'Meer dan 35 jaar ervaring',
  experienceIntro:
    'Al meer dan 35 jaar actief in de in- en verkoop van metalen, kabels en bruikbare materialen vanuit Foxhol.',
  collectionNumber: '01.853',
  processorNumber: '0.1V',
  vihb: 'GR 5-3716',
  googleProfileUrl: 'https://share.google/Xq5MsQbm5nzGwm0Ob',
  whatsappMessage: 'Goedendag, ik neem contact op via de website van Foxholster Metaalhandel.',
}

export const navItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'metaal-inkoop', label: 'Metaal inkoop', href: '/pages/metaal-inkoop/' },
  { id: 'materialen', label: 'Materialen', href: '/pages/materialen/' },
  { id: 'zakelijk', label: 'Zakelijk', href: '/pages/zakelijk/' },
  { id: 'ophalen-demontage', label: 'Ophalen / Demontage', href: '/pages/ophalen-demontage/' },
  { id: 'werkgebied', label: 'Werkgebied', href: '/pages/werkgebied/' },
  { id: 'over-ons', label: 'Over ons', href: '/pages/over-ons/' },
  { id: 'contact', label: 'Contact', href: '/pages/contact/' },
]

export const primaryCta = {
  label: 'Metaal aanbieden',
  href: '/pages/metaal-aanbieden/',
}

export const legalLinks = [
  { id: 'privacybeleid', label: 'Privacy', href: '/pages/privacybeleid/' },
  { id: 'algemene-voorwaarden', label: 'Algemene voorwaarden', href: '/pages/algemene-voorwaarden/' },
  { id: 'cookiebeleid', label: 'Cookiebeleid', href: '/pages/cookiebeleid/' },
]

export const footerServices = [
  { label: 'Metaal inkoop', href: '/pages/metaal-inkoop/' },
  { label: 'Kabels', href: '/pages/materialen/#kabels' },
  { label: 'Koper', href: '/pages/materialen/#koper' },
  { label: 'Machines', href: '/pages/materialen/#machines' },
  { label: "Accu's", href: '/pages/materialen/#accus' },
  { label: 'Grondkabels', href: '/pages/materialen/#grondkabels' },
  { label: 'Sloopwerken', href: '/pages/ophalen-demontage/' },
  { label: 'Zakelijk', href: '/pages/zakelijk/' },
]

export const serviceLinks = footerServices

export function isPlaceholder(value) {
  return typeof value === 'string' && value.includes('[')
}

export function phoneHref(number = business.phone) {
  if (isPlaceholder(number)) return '/pages/contact/'
  const digits = String(number).replace(/\D/g, '')
  if (!digits) return '/pages/contact/'
  if (digits.startsWith('0')) return `tel:+31${digits.slice(1)}`
  return `tel:+${digits}`
}

export function emailHref() {
  if (isPlaceholder(business.email)) return '/pages/contact/'
  return `mailto:${business.email}`
}

export function whatsappHref() {
  const digits = String(business.mobileFallback).replace(/\D/g, '')
  const intl = digits.startsWith('0') ? `31${digits.slice(1)}` : digits
  const text = encodeURIComponent(business.whatsappMessage)
  return `https://wa.me/${intl}?text=${text}`
}

export function formattedAddress() {
  return `${business.street}, ${business.postalCode} ${business.city}`
}

export function pageUrl(pathname = '/') {
  const origin = SITE_ORIGIN.replace(/\/$/, '')
  if (!pathname || pathname === '/') return `${origin}/`
  return `${origin}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}
