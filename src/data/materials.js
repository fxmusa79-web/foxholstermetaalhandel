/**
 * Material catalogue.
 * Individual material pages can later be added as /pages/materialen/<slug>/.
 * Do not publish prices or guaranteed purchase.
 */
export const materials = [
  {
    slug: 'ferro',
    name: 'Ferro',
    short: 'IJzerhoudend schroot en staal, van onderdelen tot grotere partijen.',
    description:
      'Ferro omvat ijzer en staal. Denk aan constructiedelen, plaatwerk, buizen of gemengd ijzerhoudend schroot. Of een partij wordt ingenomen hangt af van soort, vervuiling, hoeveelheid en verwerking.',
    examples: ['Staalconstructies', 'Plaat- en buismateriaal', 'IJzeren onderdelen', 'Gemengd ijzerhoudend schroot'],
    image: '/images/materials/ferro.svg',
  },
  {
    slug: 'non-ferro',
    name: 'Non-ferro',
    short: 'Niet-ijzerhoudende metalen zoals koper, aluminium, RVS en messing.',
    description:
      'Non-ferro dekt metalen zonder ijzerbasis. Vaak gaat het om koper, aluminium, RVS, messing of gemengde non-ferro partijen. Scheiding en herkenbaarheid helpen bij de beoordeling.',
    examples: ['Koper en messing', 'Aluminium', 'RVS', 'Gemengde non-ferro partijen'],
    image: '/images/materials/non-ferro.svg',
  },
  {
    slug: 'kabels',
    name: 'Kabels',
    short: 'Koperkabels en overige kabelpartijen, gescheiden of gemengd.',
    description:
      'Kabels kunnen worden aangeboden, van restanten tot grotere partijen. Foto’s van de buitenkant en een doorsnede, plus een inschatting van de hoeveelheid, maken de beoordeling praktischer. Aankoop is geen automatisme.',
    examples: ['Koperkabel', 'Installatiekabel', 'Grondkabel', 'Gemengde kabelrestanten'],
    image: '/images/materials/kabels.svg',
  },
  {
    slug: 'koper',
    name: 'Koper',
    short: 'Koperen leidingen, draad, plaat en overige koperhoudende partijen.',
    description:
      'Koper komt voor als leiding, draad, plaat of restmateriaal. Vermeld of het schoon, geverfd, getint of vermengd is. We beoordelen per partij wat er mogelijk is.',
    examples: ['Koperen leidingen', 'Koperdraad', 'Plaatmateriaal', 'Restpartijen koper'],
    image: '/images/materials/koper.svg',
  },
  {
    slug: 'aluminium',
    name: 'Aluminium',
    short: 'Profielen, plaat, velgen en overige aluminium stromen.',
    description:
      'Aluminium wordt aangeboden als profiel, plaat, gietwerk of gemengd. Geef aan of er nog bevestigingsmateriaal, kunststof of andere vervuiling bij zit.',
    examples: ['Profielen', 'Plaatwerk', 'Gietstukken', 'Productieresten'],
    image: '/images/materials/aluminium.svg',
  },
  {
    slug: 'rvs',
    name: 'RVS',
    short: 'Roestvast staal uit keuken, industrie, leidingwerk of sloop.',
    description:
      'RVS (roestvast staal) komt voor in leidingen, tanks, keukeninrichting en industriële onderdelen. Een aanduiding van type of herkomst helpt, maar is niet verplicht.',
    examples: ['RVS-leidingwerk', 'Tanks en bakken', 'Industriële delen', 'Sloopmateriaal'],
    image: '/images/materials/rvs.svg',
  },
  {
    slug: 'messing',
    name: 'Messing',
    short: 'Kranen, fittingen, staven en overige messinghoudende partijen.',
    description:
      'Messing wordt vaak aangeboden als fittingen, kranen, staven of restmateriaal. Vermeld of het om een schone partij gaat of om gemengd sanitair/metaal.',
    examples: ['Fittingen', 'Kranen', 'Staven', 'Gemengd messing'],
    image: '/images/materials/messing.svg',
  },
  {
    slug: 'motoren',
    name: 'Motoren',
    short: 'Elektromotoren en vergelijkbare aggregaten voor beoordeling.',
    description:
      'Elektromotoren en vergelijkbare units kunnen worden aangeboden. Foto’s van typeplaatje, formaat en eventuele olie of schade zijn nuttig. Ophalen is alleen aan de orde als de partij en locatie dat toelaten.',
    examples: ['Elektromotoren', 'Pompmotoren', 'Industrieel aangedreven units'],
    image: '/images/materials/motoren.svg',
  },
  {
    slug: 'machines',
    name: 'Machines',
    short: 'Afgeschreven machines en metaalhoudende installaties.',
    description:
      'Afgeschreven machines of metaalhoudende installaties vragen vaak een beoordeling op maat. Belangrijk: bereikbaarheid, hijs- of laadmogelijkheid, demontagevraag en of de machine nog vloeistoffen bevat. Niet elke machine wordt ingenomen of opgehaald.',
    examples: ['Productiemachines', 'Werkplaatsmachines', 'Metaalhoudende installaties'],
    image: '/images/materials/machines.svg',
  },
  {
    slug: 'transformatoren',
    name: 'Transformatoren',
    short: 'Transformatoren en vergelijkbare elektrische units, na beoordeling.',
    description:
      'Transformatoren kunnen in aanmerking komen na beoordeling van type, formaat, locatie en eventuele oliehoudendheid. Dit is geen automatische inname. Foto’s, typegegevens en toegang tot de opstellocatie zijn nodig voordat er iets wordt afgesproken.',
    examples: ['Distributietransformatoren', 'Industriële transformatoren'],
    image: '/images/materials/transformatoren.svg',
  },
]

export const materialSelectOptions = [
  { value: 'koper', label: 'Koper' },
  { value: 'kabels', label: 'Kabels' },
  { value: 'aluminium', label: 'Aluminium' },
  { value: 'rvs', label: 'RVS' },
  { value: 'messing', label: 'Messing' },
  { value: 'ferro', label: 'Ferro / ijzer' },
  { value: 'motoren', label: 'Motoren' },
  { value: 'machines', label: 'Machines' },
  { value: 'transformatoren', label: 'Transformatoren' },
  { value: 'gemengd', label: 'Gemengde partij' },
  { value: 'anders', label: 'Anders' },
]

export function materialHref(slug) {
  return `/pages/materialen/#${slug}`
}
