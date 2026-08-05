'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap, ChevronRight } from 'lucide-react'
import {
  ACTIVE_PROMO,
  isPromoActive,
  formatPromoRangeShort,
  promoSeenKey,
} from '@/app/data/promotions'

// ─────────────────────────────────────────────────────────────────────────────
// Promo pop-up + docked bar
//
//   open   → full flyer modal over a dimmed backdrop
//   docked → compact pill in the top-right, under the nav; click to re-open
//   hidden → promo is outside its date window, so nothing renders at all
//
// Shown once per browser session (sessionStorage). Closing docks it rather than
// removing it, so the offer stays one click away for the rest of the visit.
// ─────────────────────────────────────────────────────────────────────────────

type PromoState = 'hidden' | 'open' | 'docked'

const P = ACTIVE_PROMO

export default function PromoModal() {
  const [state, setState] = useState<PromoState>('hidden')
  const pathname = usePathname()
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<Element | null>(null)

  // ── Decide the initial state on the client only ──────────────────────────
  // Date and sessionStorage are both client-side facts. Starting at 'hidden'
  // and correcting after mount keeps the server and client markup identical,
  // so there is no hydration mismatch and no flash of a stale offer.
  useEffect(() => {
    if (!isPromoActive(P)) return

    const alreadySeen =
      typeof window !== 'undefined' && window.sessionStorage.getItem(promoSeenKey(P)) === '1'

    // On the promotions page itself the pop-up would be redundant — the whole
    // page is the offer. Dock straight away instead.
    const onPromoPage = pathname === '/promotions'

    // set-state-in-effect is intentional and runs once: the decision depends on
    // sessionStorage and the current date, neither of which exists during SSR.
    // Deriving it in useState would make the first client render differ from the
    // server HTML and trip a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(alreadySeen || onPromoPage ? 'docked' : 'open')
  }, [pathname])

  const dock = useCallback(() => {
    setState('docked')
    try {
      window.sessionStorage.setItem(promoSeenKey(P), '1')
    } catch {
      // Private mode / storage disabled — the pop-up simply shows again later.
    }
  }, [])

  const open = useCallback(() => setState('open'), [])

  // ── Scroll lock ──────────────────────────────────────────────────────────
  // Deliberately locks <html>, NOT <body>: HeroPremium owns body.style.overflow
  // for its scroll-scrub lock. Writing to body here would release the hero's
  // lock when the modal closes and let the page scroll mid-animation.
  useEffect(() => {
    if (state !== 'open') return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [state])

  // ── Escape to close, and focus management ────────────────────────────────
  useEffect(() => {
    if (state !== 'open') return

    lastFocused.current = document.activeElement
    closeBtnRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dock()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus()
    }
  }, [state, dock])

  if (state === 'hidden') return null

  const range = formatPromoRangeShort(P)

  return (
    <>
      {/* ── Docked bar — top-right, tucked under the 60px nav ─────────────── */}
      <AnimatePresence>
        {state === 'docked' && (
          <motion.button
            type="button"
            onClick={open}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            aria-label={`Reopen ${P.headlineTop} ${P.headlineBottom} offer — ${P.discountValue} off`}
            className="group fixed top-[70px] right-3 sm:right-4 z-[45] flex items-center gap-2.5
                       rounded-full border border-lime-400/40 bg-zinc-950/95 py-2 pl-3 pr-2.5
                       shadow-lg shadow-black/30 backdrop-blur-sm
                       transition-colors hover:border-lime-400 hover:bg-zinc-900"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-400/15"
              aria-hidden="true"
            >
              <GraduationCap size={13} className="text-lime-400" />
            </span>

            <span className="flex items-baseline gap-1.5">
              <span className="text-[12px] font-black tracking-tight text-lime-400">
                {P.discountValue} OFF
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 sm:inline">
                {P.headlineTop} {P.headlineBottom}
              </span>
            </span>

            <ChevronRight
              size={13}
              className="text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-lime-400"
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Flyer modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {state === 'open' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={dock}
              aria-hidden="true"
            />

            {/* Panel — scales toward the top-right on exit, so closing reads as
                the offer flying into the docked bar. */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="promo-modal-title"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: 160, y: -220 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              style={{ transformOrigin: 'top right' }}
              className="relative flex max-h-[94vh] w-full max-w-[430px] flex-col overflow-hidden
                         rounded-2xl border border-lime-400/25 bg-zinc-950 shadow-2xl shadow-black/60"
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-4 py-2.5">
                <div className="min-w-0">
                  <p
                    id="promo-modal-title"
                    className="truncate text-[11px] font-black uppercase tracking-[0.16em] text-lime-400"
                  >
                    {P.headlineTop} {P.headlineBottom} — {P.discountValue} Off
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium tracking-wide text-zinc-500">
                    {range} · {P.discountAudience}
                  </p>
                </div>

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={dock}
                  aria-label="Close offer"
                  className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors
                             hover:bg-zinc-800 hover:text-white
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Flyer artwork */}
              <div className="relative min-h-0 flex-1 bg-black">
                <Image
                  src={P.flyer.src}
                  alt={P.flyer.alt}
                  width={P.flyer.width}
                  height={P.flyer.height}
                  priority
                  sizes="(max-width: 640px) 92vw, 430px"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Footer CTAs */}
              <div className="flex shrink-0 items-center gap-2 border-t border-zinc-800 bg-zinc-950 px-3 py-3">
                {/* qf-trigger is picked up by the delegated listener in
                    public/quote-form.js, so this works even though the button
                    mounts long after that script runs. Dock first so the two
                    modals never stack. */}
                <button
                  type="button"
                  onClick={dock}
                  className="qf-trigger flex-1 rounded-full bg-lime-400 px-4 py-2.5 text-[12px]
                             font-black uppercase tracking-[0.08em] text-zinc-950 transition-colors hover:bg-lime-300
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
                >
                  {P.cta.label}
                </button>

                <a
                  href="/promotions"
                  onClick={dock}
                  className="rounded-full border border-zinc-700 px-4 py-2.5 text-[12px] font-semibold
                             text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
                >
                  {P.cta.detailsLabel}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
