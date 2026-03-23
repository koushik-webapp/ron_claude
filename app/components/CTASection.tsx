'use client'

import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="relative bg-zinc-950 border-t border-zinc-800 py-28 px-6 md:px-10 lg:px-20 overflow-hidden">
      {/* Subtle green glow */}
      <div className="absolute inset-0 bg-green-600/5 pointer-events-none" />

      <div className="max-w-[1100px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500 mb-4">
            Get Started Today
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] mb-5">
            Ready to clear the clutter?
          </h2>
          <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-md mx-auto mb-10">
            Same-day service available. Free quote. No commitment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#"
              className="px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-colors w-full sm:w-auto text-center"
            >
              Get a Free Quote
            </a>
            <a
              href="tel:+12010502253"
              className="px-8 py-3.5 border border-zinc-600 text-zinc-300 font-semibold rounded-xl hover:border-zinc-400 hover:text-white transition-colors w-full sm:w-auto text-center"
            >
              Call (201) 050-2253
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {['Licensed & Insured', 'Upfront Pricing', 'No Hidden Fees'].map((trust, i) => (
              <span key={trust} className="flex items-center gap-2 text-xs text-zinc-600">
                <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 shrink-0">
                  <circle cx="7" cy="7" r="6" fill="#14532d" />
                  <path d="M4.5 7l2 2 3-3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {trust}
                {i < 2 && <span className="hidden sm:inline text-zinc-700 ml-4">·</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
