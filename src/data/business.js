/**
 * Central business details for Foxholster Metaalhandel.
 *
 * Replace every [PLACEHOLDER] before production.
 * Do not invent telephone numbers, addresses, KvK, BTW or opening hours.
 *
 * PLACEHOLDER_DOMAIN must be replaced with the real production domain.
 * Sitemap, canonical URLs, Open Graph URLs and JSON-LD currently use this value.
 */
export const PLACEHOLDER_DOMAIN = 'https://www.example.nl'

export const business = {
  companyName: 'Foxholster Metaalhandel',
  shortName: 'Foxholster',
  phone: '[TELEFOONNUMMER]',
  email: '[E-MAILADRES]',
  street: '[ADRES]',
  postalCode: '[POSTCODE]',
  city: '[PLAATS]',
  region: 'Groningen',
  country: 'NL',
  kvk: '[KVK-NUMMER]',
  vat: '[BTW-NUMMER]',
  openingHours: '[OPENINGSTIJDEN]',
  domain: '[PRODUCTIEDOMEIN]',
  placeholderDomain: PLACEHOLDER_DOMAIN,
  audience: 'Particulier & zakelijk',
  locationFocus: 'Foxhol en omgeving',
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
  { id: 'privacybeleid', label: 'Privacybeleid', href: '/pages/privacybeleid/' },
  { id: 'algemene-voorwaarden', label: 'Algemene voorwaarden', href: '/pages/algemene-voorwaarden/' },
  { id: 'cookiebeleid', label: 'Cookiebeleid', href: '/pages/cookiebeleid/' },
]

export const serviceLinks = [
  { label: 'Metaal inkoop', href: '/pages/metaal-inkoop/' },
  { label: 'Zakelijk', href: '/pages/zakelijk/' },
  { label: 'Ophalen / demontage', href: '/pages/ophalen-demontage/' },
  { label: 'Werkgebied', href: '/pages/werkgebied/' },
  { label: 'Contact', href: '/pages/contact/' },
]

export function isPlaceholder(value) {
  return typeof value === 'string' && value.includes('[')
}

export function phoneHref() {
  if (isPlaceholder(business.phone)) return '/pages/contact/'
  return `tel:${business.phone.replace(/\s+/g, '')}`
}

export function emailHref() {
  if (isPlaceholder(business.email)) return '/pages/contact/'
  return `mailto:${business.email}`
}

export function formattedAddress() {
  return `${business.street}, ${business.postalCode} ${business.city}`
}

export function pageUrl(pathname = '/') {
  const origin = PLACEHOLDER_DOMAIN.replace(/\/$/, '')
  if (!pathname || pathname === '/') return `${origin}/`
  return `${origin}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}
