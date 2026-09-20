/**
 * Shared SEO identifiers for Foxholster Metaalhandel.
 * Keep Organization/LocalBusiness on one @id. Do not invent hours, ratings or geo.
 *
 * Future material detail pages may live at /pages/materialen/{slug}/
 * (koper, kabels, ferro, aluminium, rvs, messing, widia-hss, wolfraam,
 * molybdeen, grondkabels). Only publish a detail page with unique useful
 * content, examples and photography. Do not auto-generate thin pages.
 */
import { SITE_ORIGIN, business } from './business.js'

export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/hero/hero-desktop.png`
export const LOGO_URL = `${SITE_ORIGIN}/images/brand/logo-header-web.png`

export const breadcrumbPages = {
  'metaal-inkoop': { label: 'Metaal inkoop', href: '/pages/metaal-inkoop/' },
  materialen: { label: 'Materialen', href: '/pages/materialen/' },
  zakelijk: { label: 'Zakelijk', href: '/pages/zakelijk/' },
  'ophalen-demontage': { label: 'Ophalen / Demontage', href: '/pages/ophalen-demontage/' },
  werkgebied: { label: 'Werkgebied', href: '/pages/werkgebied/' },
  'over-ons': { label: 'Over ons', href: '/pages/over-ons/' },
  contact: { label: 'Contact', href: '/pages/contact/' },
  'metaal-aanbieden': { label: 'Metaal aanbieden', href: '/pages/metaal-aanbieden/' },
  'veelgestelde-vragen': { label: 'Veelgestelde vragen', href: '/pages/veelgestelde-vragen/' },
  privacybeleid: { label: 'Privacybeleid', href: '/pages/privacybeleid/' },
  'algemene-voorwaarden': { label: 'Algemene voorwaarden', href: '/pages/algemene-voorwaarden/' },
  cookiebeleid: { label: 'Cookiebeleid', href: '/pages/cookiebeleid/' },
  disclaimer: { label: 'Disclaimer', href: '/pages/disclaimer/' },
}

export function organizationEntity() {
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORGANIZATION_ID,
    name: business.companyName,
    url: `${SITE_ORIGIN}/`,
    logo: LOGO_URL,
    image: LOGO_URL,
    email: business.email,
    telephone: '+31598394504',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      postalCode: business.postalCode,
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    identifier: {
      '@type': 'PropertyValue',
      name: 'KvK',
      value: business.kvk,
    },
    sameAs: [business.googleProfileUrl],
    areaServed: [
      { '@type': 'Place', name: 'Foxhol' },
      { '@type': 'Place', name: 'Groningen' },
      { '@type': 'Place', name: 'Noord-Nederland' },
    ],
  }
}
