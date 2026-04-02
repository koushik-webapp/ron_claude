'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import QuoteForm from './QuoteForm'

const TRUST_POINTS = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.6">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Same-Day Pickup Available',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.6">
        <path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6z" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Upfront Pricing — No Hidden Fees',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.6">
        <path d="M10 2L3 5.5v5C3 14.6 6.1 17.9 10 19c3.9-1.1 7-4.4 7-8.5v-5L10 2z" strokeLinejoin="round" />
        <path d="M7 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Fully Licensed & Insured',
  },
]

const STATS = [
  { value: '2,000+', label: 'Jobs Completed' },
  { value: '4.9★', label: 'Average Rating' },
  { value: 'Same Day', label: 'Response Time' },
  { value: '100%', label: 'Insured Service' },
]

export default function BookingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="quote" className="bg-zinc-950 py-28 px-6 md:px-10 lg:px-20" style={{ scrollMarginTop: '60px' }}>
      <div ref={ref} className="max-w-[1200px] mx-auto">

        {/* ── Two-column layout ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">

          {/* ── LEFT — copy + trust ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8 lg:sticky lg:top-28"
          >
            {/* Label */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-green-500 mb-4">
                Book a Service
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] mb-4">
                Book Your<br />
                <span className="text-zinc-500">Junk Removal</span>
              </h2>
              <p className="text-[15px] text-zinc-400 leading-relaxed max-w-[340px]">
                Fast quotes. Same-day availability.<br />Professional service, every time.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-800 w-16" />

            {/* Trust points */}
            <div className="flex flex-col gap-4">
              {TRUST_POINTS.map((pt, i) => (
                <motion.div
                  key={pt.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.10 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-950/60 border border-green-900/50 flex items-center justify-center text-green-400 shrink-0">
                    {pt.icon}
                  </div>
                  <span className="text-[13px] font-medium text-zinc-300">
                    {pt.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Phone CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              className="flex items-center gap-4 pt-2"
            >
              <a
                href="tel:2018502253"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-zinc-700 bg-zinc-900 text-white text-[12px] font-bold tracking-wide hover:border-green-700 hover:bg-zinc-800 transition-all duration-300"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-400">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call Now — (201) 850-2253
              </a>
            </motion.div>
          </motion.div>

          {/* ── RIGHT — booking form card ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative"
          >
            {/* Ambient glow behind card */}
            <div
              className="absolute -inset-4 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74,222,128,0.06) 0%, transparent 70%)',
              }}
            />

            {/* Form card */}
            <div
              className="relative rounded-2xl overflow-hidden border border-zinc-800"
              style={{
                background: 'linear-gradient(145deg, #111111 0%, #0d0d0d 100%)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              {/* Card header bar */}
              <div className="px-8 py-5 border-b border-zinc-800/80 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.20em] uppercase text-zinc-500">
                    Rainey Removal LLC
                  </p>
                  <p className="text-[13px] font-semibold text-white mt-0.5">
                    Request a Free Quote
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-green-500 tracking-wide">Available Now</span>
                </div>
              </div>

              <QuoteForm />

              {/* Card footer */}
              <div className="px-8 py-4 border-t border-zinc-800/60 flex items-center gap-2">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-zinc-600">
                  <path fillRule="evenodd" d="M5 4a3 3 0 016 0v1h1a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1h1V4zm3-1.5A1.5 1.5 0 006.5 4v1h3V4A1.5 1.5 0 008 2.5z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] text-zinc-600 tracking-wide">
                  Your information is private and never shared.
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Stats row ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-800"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-950 px-8 py-7 flex flex-col gap-1 items-center text-center"
            >
              <span className="text-2xl font-black text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-zinc-600">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
