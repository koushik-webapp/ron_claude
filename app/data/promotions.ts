// ─────────────────────────────────────────────────────────────────────────────
// PROMOTIONS — single source of truth
//
// Everything about a running promo lives here: copy, dates, artwork, contact.
// The pop-up, the docked bar and /promotions all read from this file, so
// changing a date or a headline in one place updates every surface.
//
// To run a new promo: edit ACTIVE_PROMO (or swap in a new object). To take the
// promo down early, set `endsOn` to a past date — no code changes needed.
// ─────────────────────────────────────────────────────────────────────────────

export type PromoFeature = {
  /** lucide-react icon name, resolved by the consuming component */
  icon: 'truck' | 'map-pin' | 'package' | 'shield-check' | 'users'
  title: string
}

export type Promo = {
  id: string
  /** Small label above the headline */
  eyebrow: string
  /** Split headline so the two halves can be styled differently, as on the flyer */
  headlineTop: string
  headlineBottom: string
  subhead: string
  discountValue: string
  discountAudience: string
  discountSuffix: string
  /** Inclusive date range, local time. Month is 1-indexed for readability. */
  startsOn: { year: number; month: number; day: number }
  endsOn: { year: number; month: number; day: number }
  pitchQuestion: string
  pitchAnswer: string
  features: PromoFeature[]
  servingBanner: string
  trustPoints: string[]
  /** Campus called out on the flyer artwork */
  featuredCampus: { name: string; building: string; address: string }
  /** Schools the offer is advertised for */
  campuses: string[]
  flyer: { src: string; width: number; height: number; alt: string }
  cta: { label: string; detailsLabel: string }
  contact: { phone: string; phoneHref: string; email: string; website: string }
}

export const ACTIVE_PROMO: Promo = {
  id: 'back-2-school-2026',
  eyebrow: 'Limited Time Offer',
  headlineTop: 'Back 2',
  headlineBottom: 'School',
  subhead: 'Move-In Special!',
  discountValue: '15%',
  discountAudience: 'College Students',
  discountSuffix: 'your move-in!',

  // Aug 1 2026 → Sep 14 2026, both inclusive.
  startsOn: { year: 2026, month: 8, day: 1 },
  endsOn: { year: 2026, month: 9, day: 14 },

  pitchQuestion: 'Moving into your dorm or off-campus apartment?',
  pitchAnswer: "We've got you covered!",

  features: [
    { icon: 'truck',        title: 'Dorm & Apartment Move-Ins' },
    { icon: 'map-pin',      title: 'Local & Long-Distance Moves' },
    { icon: 'package',      title: 'Professional, Reliable, Affordable' },
    { icon: 'shield-check', title: 'Care & Attention to Every Detail' },
    { icon: 'users',        title: 'Friendly & Experienced Team' },
  ],

  servingBanner: 'Serving customers throughout the county!',

  trustPoints: [
    'We go anywhere in the county!',
    'On time. Every time.',
    'Affordable rates.',
    'Stress-free moving.',
  ],

  featuredCampus: {
    name: 'Howard University',
    building: 'Plaza Tower East',
    address: '2251 Sherman Avenue',
  },

  // Order follows the flyer: left column top-to-bottom, then right column.
  campuses: [
    'Howard University',
    'Hampton University',
    'Morgan State University',
    "Mount St. Mary's University",
    'Rutgers University',
    'New Jersey Institute of Technology',
    'Montclair State University',
    'Bowie State University',
    'University of Maryland',
    'Georgetown University',
    'George Washington University',
    'Coppin State University',
    "Saint Peter's University",
    'Kean University',
    'Seton Hall University',
    'Delaware State University',
  ],

  flyer: {
    src: '/promos/back-2-school-2026.jpg',
    width: 1234,
    height: 1600,
    alt:
      'Rainey Removal LLC Back 2 School Move-In Special — 15% off move-in for college students, ' +
      'valid August 1 through September 14. Dorm and apartment move-ins, local and long-distance. ' +
      'Call 201-850-2253.',
  },

  cta: { label: 'Book Your Move', detailsLabel: 'See Full Details' },

  contact: {
    phone: '(201) 850-2253',
    phoneHref: 'tel:2018502253',
    email: 'Ofc.QuranRainey@gmail.com',
    website: 'raineyremoval.com',
  },
}

// ── Date helpers ─────────────────────────────────────────────────────────────

/** Local midnight at the start of the promo's first day. */
function startBoundary(p: Promo): Date {
  return new Date(p.startsOn.year, p.startsOn.month - 1, p.startsOn.day, 0, 0, 0, 0)
}

/**
 * Local midnight at the END of the promo's last day, so `endsOn` is inclusive —
 * a promo ending Sep 14 stays live through all of Sep 14.
 */
function endBoundary(p: Promo): Date {
  return new Date(p.endsOn.year, p.endsOn.month - 1, p.endsOn.day + 1, 0, 0, 0, 0)
}

export function isPromoActive(p: Promo = ACTIVE_PROMO, now: Date = new Date()): boolean {
  return now >= startBoundary(p) && now < endBoundary(p)
}

export function hasPromoEnded(p: Promo = ACTIVE_PROMO, now: Date = new Date()): boolean {
  return now >= endBoundary(p)
}

/** e.g. "August 1 – September 14, 2026" */
export function formatPromoRange(p: Promo = ACTIVE_PROMO): string {
  const fmt = (y: number, m: number, d: number) =>
    new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const start = fmt(p.startsOn.year, p.startsOn.month, p.startsOn.day)
  const end = fmt(p.endsOn.year, p.endsOn.month, p.endsOn.day)
  return `${start} – ${end}, ${p.endsOn.year}`
}

/** Compact form for tight spaces, e.g. "Aug 1 – Sep 14" */
export function formatPromoRangeShort(p: Promo = ACTIVE_PROMO): string {
  const fmt = (y: number, m: number, d: number) =>
    new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(p.startsOn.year, p.startsOn.month, p.startsOn.day)} – ${fmt(
    p.endsOn.year,
    p.endsOn.month,
    p.endsOn.day,
  )}`
}

/** sessionStorage key — per-promo so a new promo shows again to everyone. */
export const promoSeenKey = (p: Promo = ACTIVE_PROMO) => `rainey:promo:${p.id}:seen`
