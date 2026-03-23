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

const SCENARIOS = [
  { label: 'Garage Cleanout' },
  { label: 'Estate Clearance' },
  { label: 'Office Removal' },
]

function ClutterPattern() {
  const positions = [
    [8, 8], [28, 6], [50, 10], [70, 8], [18, 28], [42, 24], [62, 30], [82, 26],
    [10, 48], [36, 46], [58, 50], [78, 44], [22, 66], [46, 64], [68, 68], [88, 62],
    [14, 82], [40, 80], [60, 84], [80, 78],
  ]
  return (
    <div className="relative w-full h-32 overflow-hidden">
      {positions.map(([x, y], i) => (
        <div
          key={i}
          className="absolute rounded bg-zinc-700"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${10 + (i % 3) * 8}px`,
            height: `${8 + (i % 4) * 5}px`,
            opacity: 0.6 + (i % 3) * 0.15,
            backgroundColor: i % 3 === 0 ? '#3f3f46' : i % 3 === 1 ? '#52525b' : '#27272a',
          }}
        />
      ))}
    </div>
  )
}

function CleanState() {
  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-green-950/40 border border-green-900 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M5 12l5 5L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

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
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {SCENARIOS.map(({ label }) => (
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
              <div className="mx-6 mb-3 rounded-xl bg-zinc-800 overflow-hidden">
                <div className="px-4 pt-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600">Before</span>
                </div>
                <div className="p-4">
                  <ClutterPattern />
                </div>
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
              <div className="mx-6 mb-6 rounded-xl bg-green-950/40 border border-green-900 overflow-hidden">
                <div className="px-4 pt-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-400">After</span>
                </div>
                <div className="p-4">
                  <CleanState />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
