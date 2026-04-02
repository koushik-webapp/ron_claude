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

const SCENARIOS = [
  {
    label: 'Garage Cleanout',
    before: '/garage-before.jpg',
    after: '/garage-after.png',
  },
  {
    label: 'Estate Clearance',
    before: '/estate-before.png',
    after: '/estate-after.png',
  },
  {
    label: 'Office Removal',
    before: '/office-before.png',
    after: '/office-after.png',
  },
]

export default function BeforeAfterSection() {
  return (
    <section className="bg-zinc-900 py-28 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500 mb-4">
            Real Results
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] mb-4">
            From cluttered to<br />
            <span className="text-zinc-500">completely clean.</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-md mb-16">
            See what a difference a single call makes.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SCENARIOS.map(({ label, before, after }) => (
            <motion.div
              key={label}
              variants={item}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden hover:shadow-xl hover:shadow-green-950/50 hover:border-green-800 transition-all duration-500"
            >
              {/* Label bar */}
              <div className="px-6 pt-6 pb-3">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
              </div>

              {/* Before */}
              <div className="mx-6 mb-3 rounded-xl overflow-hidden">
                <div className="px-0 pt-0">
                  <span className="block px-4 pt-3 pb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 bg-zinc-800">Before</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={before}
                  alt={`${label} before`}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Arrow divider */}
              <div className="flex items-center justify-center py-2">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-3 bg-zinc-700" />
                  <span className="text-zinc-600 text-sm">↓</span>
                  <div className="w-px h-3 bg-zinc-700" />
                </div>
              </div>

              {/* After */}
              <div className="mx-6 mb-6 rounded-xl overflow-hidden border border-green-900">
                <span className="block px-4 pt-3 pb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-green-400 bg-green-950/40">After</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={after}
                  alt={`${label} after`}
                  className="w-full h-48 object-cover"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
