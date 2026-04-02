'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const TIERS = [
  {
    name: 'Small Load',
    volume: '1/8 truck',
    price: 'Starting at $149',
    items: ['1–3 items', 'Quick pickups', 'Single room', 'Same-day available'],
    featured: false,
  },
  {
    name: 'Medium Load',
    volume: '1/2 truck',
    price: 'Starting at $299',
    items: ['4–8 items', 'Multi-room cleanouts', 'Furniture & appliances', 'Most popular choice'],
    featured: true,
  },
  {
    name: 'Full Load',
    volume: 'Full truck',
    price: 'Starting at $499',
    items: ['Full home or office', 'Estate cleanouts', 'Construction debris', 'Best value for large jobs'],
    featured: false,
  },
]

export default function PricingSection() {
  return (
    <section className="bg-zinc-950 py-28 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500 mb-4">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
            Clear pricing.<br />
            <span className="text-zinc-500">No surprises.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
        >
          {TIERS.map(({ name, volume, price, items, featured }) => (
            <motion.div
              key={name}
              variants={item}
              className={`relative flex flex-col rounded-2xl p-8 transition-all duration-500 ${
                featured
                  ? 'bg-green-950 border border-green-800 ring-2 ring-green-600 shadow-2xl shadow-green-950/50'
                  : 'bg-zinc-900 border border-zinc-800 hover:shadow-xl hover:shadow-green-950/50 hover:border-green-800'
              }`}
            >
              {featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-lg bg-green-600 text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-[11px] font-bold tracking-widest uppercase mb-1 ${featured ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {volume}
                </p>
                <h3 className="text-xl font-black tracking-tight mb-3 text-white">
                  {name}
                </h3>
                <p className={`text-3xl font-black tracking-tight ${featured ? 'text-green-300' : 'text-white'}`}>
                  {price}
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {items.map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
                      <circle cx="8" cy="8" r="7" fill={featured ? '#166534' : '#14532d'} />
                      <path d="M5 8l2 2 4-4" stroke={featured ? '#4ade80' : '#22c55e'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={`text-sm ${featured ? 'text-zinc-300' : 'text-zinc-400'}`}>{i}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`qf-trigger block text-center px-6 py-3 font-bold rounded-xl transition-colors ${
                  featured
                    ? 'bg-green-600 text-white hover:bg-green-500'
                    : 'border border-zinc-700 text-zinc-300 font-semibold hover:border-zinc-500 hover:text-white'
                }`}
              >
                Get a Quote
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-xs text-zinc-600 max-w-lg mx-auto leading-relaxed">
            *Final price depends on volume, access, and location. Free quote always provided before service begins.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="qf-trigger inline-block px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-colors text-base"
            >
              Get Your Free Quote
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
