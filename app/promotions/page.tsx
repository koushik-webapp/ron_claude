import Image from 'next/image'
import {
  Truck,
  MapPin,
  Package,
  ShieldCheck,
  Users,
  Check,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  CalendarDays,
} from 'lucide-react'
import PromoExpiryNotice from '../components/PromoExpiryNotice'
import { ACTIVE_PROMO, formatPromoRange, type PromoFeature } from '../data/promotions'

export const metadata = {
  title: 'Promotions | Rainey Removal LLC',
  description:
    'Back 2 School Move-In Special — 15% off move-ins for college students, August 1 through September 14. Dorm and off-campus apartment moves, local and long-distance.',
}

const P = ACTIVE_PROMO

const ICONS: Record<PromoFeature['icon'], typeof Truck> = {
  truck: Truck,
  'map-pin': MapPin,
  package: Package,
  'shield-check': ShieldCheck,
  users: Users,
}

// Dot texture echoing the flyer's halftone background.
const DOTS = {
  backgroundImage: 'radial-gradient(rgba(163,230,53,0.10) 1px, transparent 1px)',
  backgroundSize: '14px 14px',
}

export default function PromotionsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-zinc-950 pt-[60px] text-white">
      <PromoExpiryNotice />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 opacity-70" style={DOTS} aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(163,230,53,0.13) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Copy on the left, flyer filling the space on the right. Collapses to
            one column below lg, where the flyer sits under the CTAs. */}
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:px-10 md:py-20 lg:grid-cols-[1fr_minmax(300px,380px)] lg:gap-14">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400/15">
                <GraduationCap size={15} className="text-lime-400" aria-hidden="true" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-lime-400">
                {P.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl md:text-7xl">
              <span className="block text-white">{P.headlineTop}</span>
              <span className="block text-lime-400">{P.headlineBottom}</span>
            </h1>

            {/* Skewed subhead banner, as on the flyer */}
            <div className="mt-5 inline-block -skew-y-1 bg-lime-400 px-4 py-1.5">
              <p className="skew-y-1 text-[15px] font-black uppercase tracking-[0.06em] text-zinc-950 sm:text-lg">
                {P.subhead}
              </p>
            </div>

            {/* Date range */}
            <p className="mt-6 flex items-center gap-2 text-[13px] font-semibold tracking-wide text-zinc-400">
              <CalendarDays size={15} className="text-zinc-500" aria-hidden="true" />
              {formatPromoRange(P)}
            </p>

            {/* Discount block */}
            <div className="mt-9 flex flex-wrap items-end gap-x-8 gap-y-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-400">
                  {P.discountAudience}
                </p>
                <p className="mt-1 flex items-start leading-none">
                  <span className="text-6xl font-black tracking-tighter text-lime-400 sm:text-7xl">
                    {P.discountValue}
                  </span>
                  <span className="mt-1.5 ml-1.5 text-2xl font-black uppercase text-white sm:text-3xl">
                    Off
                  </span>
                </p>
                <p className="mt-1.5 text-[13px] font-bold uppercase tracking-[0.10em] text-zinc-300">
                  {P.discountSuffix}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  className="qf-trigger rounded-full bg-lime-400 px-7 py-3 text-[12px] font-black uppercase tracking-[0.10em] text-zinc-950 transition-colors hover:bg-lime-300"
                >
                  {P.cta.label}
                </button>
                <a
                  href={P.contact.phoneHref}
                  className="flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-[12px] font-bold tracking-wide text-zinc-200 transition-colors hover:border-lime-400 hover:text-lime-400"
                >
                  <Phone size={14} aria-hidden="true" />
                  {P.contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Flyer — the hero's visual anchor */}
          <div className="mx-auto w-full max-w-[380px] lg:mx-0">
            <div
              className="overflow-hidden rounded-xl border border-lime-400/25 bg-black shadow-2xl shadow-black/50"
              style={{ boxShadow: '0 0 0 1px rgba(163,230,53,0.08), 0 24px 60px -20px rgba(0,0,0,0.9)' }}
            >
              <Image
                src={P.flyer.src}
                alt={P.flyer.alt}
                width={P.flyer.width}
                height={P.flyer.height}
                priority
                sizes="380px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pitch ────────────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-5xl px-6 py-11 md:px-10">
          <p className="text-xl font-bold uppercase leading-snug tracking-tight text-zinc-300 sm:text-2xl">
            {P.pitchQuestion}
          </p>
          <p className="mt-2 text-2xl font-black uppercase italic tracking-tight text-lime-400 sm:text-3xl">
            {P.pitchAnswer}
          </p>
        </div>
      </section>

      {/* ── Feature pillars ──────────────────────────────────────────────── */}
      <section className="border-b border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-14 md:px-10">
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 sm:grid-cols-2 lg:grid-cols-5">
            {P.features.map((f) => {
              const Icon = ICONS[f.icon]
              return (
                <li key={f.title} className="flex flex-col items-center gap-3 bg-zinc-950 px-4 py-8 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/10">
                    <Icon size={19} className="text-lime-400" aria-hidden="true" />
                  </span>
                  <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.10em] text-zinc-300">
                    {f.title}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ── Serving banner ───────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-lime-400 py-3.5">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2.5 px-6 md:px-10">
          <MapPin size={17} className="shrink-0 text-zinc-950" aria-hidden="true" />
          <p className="text-center text-[13px] font-black uppercase tracking-[0.10em] text-zinc-950 sm:text-base">
            {P.servingBanner}
          </p>
        </div>
      </section>

      {/* ── Campuses ─────────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-14 md:px-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[10px] font-light uppercase tracking-[0.34em] text-zinc-500">
              Campuses We Serve
            </span>
            <span className="h-px flex-1 bg-zinc-800" />
          </div>
          <p className="mb-8 max-w-2xl text-[13px] leading-relaxed text-zinc-500">
            Move-in help at these schools and anywhere else in the county — if your campus
            isn&apos;t listed, call us anyway.
          </p>

          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {P.campuses.map((school) => (
              <li
                key={school}
                className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3.5 py-3 transition-colors hover:border-lime-400/40 hover:bg-zinc-900"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime-400" aria-hidden="true" />
                <span className="text-[12px] font-semibold leading-snug text-zinc-300">{school}</span>
              </li>
            ))}
          </ul>

          {/* Featured campus from the flyer */}
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-lime-400/25 bg-lime-400/[0.06] px-5 py-4">
            <span className="text-[10px] font-black uppercase tracking-[0.20em] text-lime-400">
              Now Moving
            </span>
            <span className="text-[13px] font-bold text-white">{P.featuredCampus.name}</span>
            <span className="text-[13px] text-zinc-400">
              {P.featuredCampus.building} · {P.featuredCampus.address}
            </span>
          </div>
        </div>
      </section>

      {/* ── Trust points + contact ───────────────────────────────────────── */}
      <section className="border-b border-zinc-800">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 py-14 md:grid-cols-2 md:px-10">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Why students book us
            </h2>
            <ul className="mt-7 flex flex-col gap-4">
              {P.trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-lime-400/40 bg-lime-400/10">
                    <Check size={13} className="text-lime-400" aria-hidden="true" />
                  </span>
                  <span className="text-[14px] font-semibold uppercase tracking-wide text-zinc-300">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

          </div>

          {/* Contact card — takes the column the flyer used to occupy, now that
              the flyer anchors the hero instead. */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-[10px] font-light uppercase tracking-[0.34em] text-zinc-500">
                Book It In
              </span>
              <span className="h-px flex-1 bg-zinc-800" />
            </div>

            <p className="text-[14px] leading-relaxed text-zinc-400">
              Call, text or email — mention the Back 2 School special and we&apos;ll apply your{' '}
              <span className="font-bold text-lime-400">{P.discountValue} off</span>.
            </p>

            <div className="mt-6 flex flex-col gap-4 border-t border-zinc-800 pt-6">
              <a
                href={P.contact.phoneHref}
                className="flex items-center gap-3 text-[15px] font-bold text-zinc-100 transition-colors hover:text-lime-400"
              >
                <Phone size={16} className="shrink-0 text-lime-400" aria-hidden="true" />
                {P.contact.phone}
              </a>
              <a
                href={`mailto:${P.contact.email}`}
                className="flex items-center gap-3 break-all text-[13px] text-zinc-400 transition-colors hover:text-lime-400"
              >
                <Mail size={16} className="shrink-0 text-lime-400" aria-hidden="true" />
                {P.contact.email}
              </a>
              <span className="flex items-center gap-3 text-[13px] text-zinc-400">
                <Globe size={16} className="shrink-0 text-lime-400" aria-hidden="true" />
                {P.contact.website}
              </span>
            </div>

            <button
              type="button"
              className="qf-trigger mt-7 w-full rounded-full bg-lime-400 px-6 py-3 text-[12px] font-black uppercase tracking-[0.10em] text-zinc-950 transition-colors hover:bg-lime-300"
            >
              {P.cta.label}
            </button>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-70" style={DOTS} aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center md:px-10">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Book your move{' '}
            <span className="italic text-lime-400">today!</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-zinc-400">
            {P.discountValue} off for {P.discountAudience.toLowerCase()} — {formatPromoRange(P)}.
            Mention the Back 2 School special when you book.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="qf-trigger rounded-full bg-lime-400 px-8 py-3.5 text-[12px] font-black uppercase tracking-[0.10em] text-zinc-950 transition-colors hover:bg-lime-300"
            >
              {P.cta.label}
            </button>
            <a
              href={P.contact.phoneHref}
              className="rounded-full border border-zinc-700 px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.10em] text-zinc-200 transition-colors hover:border-lime-400 hover:text-lime-400"
            >
              Call {P.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
