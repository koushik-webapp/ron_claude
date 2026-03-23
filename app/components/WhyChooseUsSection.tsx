'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const FEATURES = [
  {
    name: 'Same-Day Available',
    desc: 'Book in the morning, we\'re there by afternoon.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="8" stroke="#4ade80" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Licensed & Insured',
    desc: 'Fully covered for your peace of mind.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M10 2L3 5v5c0 4.418 3.134 7.5 7 8 3.866-.5 7-3.582 7-8V5l-7-3z" stroke="#4ade80" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7 10l2 2 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Upfront Pricing',
    desc: 'Know the price before we touch a thing.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="8" stroke="#4ade80" strokeWidth="1.5" />
        <path d="M10 6v1m0 6v1m-2.5-4.5h3.5a1 1 0 010 2H9a1 1 0 000 2h3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Professional Crew',
    desc: 'Trained, vetted, and respectful every time.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="7" cy="6" r="3" stroke="#4ade80" strokeWidth="1.5" />
        <circle cx="13" cy="6" r="3" stroke="#4ade80" strokeWidth="1.5" />
        <path d="M2 17c0-3 2-5 5-5h6c3 0 5 2 5 5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Eco-Conscious Disposal',
    desc: 'We donate and recycle before we dump.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M10 2c-2 3-5 4-5 7a5 5 0 0010 0c0-3-3-4-5-7z" stroke="#4ade80" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 13v5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Stress-Free Service',
    desc: 'You point, we lift. It\'s that simple.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="8" stroke="#4ade80" strokeWidth="1.5" />
        <path d="M7 10l2 2 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function WhyChooseUsSection() {
  return (
    <section className="bg-zinc-950 py-28 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500 mb-4">
              Why Us
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Built on trust.<br />
              <span className="text-zinc-500">Powered by speed.</span>
            </h2>
            <p className="text-lg text-zinc-400 font-light leading-relaxed mb-8 max-w-md">
              We&apos;re not the biggest company — we&apos;re just the most reliable one in your neighborhood.
            </p>
            <a
              href="#"
              className="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-colors"
            >
              Get a Free Quote
            </a>
          </motion.div>

          {/* Right side — feature grid */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {FEATURES.map(({ name, desc, icon }) => (
              <motion.div
                key={name}
                variants={item}
                className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900 hover:shadow-xl hover:shadow-green-950/50 hover:border-green-800 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-xl bg-green-950/60 border border-green-900 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
