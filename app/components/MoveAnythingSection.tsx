'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const CATEGORIES = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <rect x="2" y="18" width="28" height="12" rx="3" fill="#14532d" />
        <rect x="6" y="10" width="20" height="10" rx="2" fill="#166534" />
        <rect x="10" y="4"  width="12" height="8"  rx="2" fill="#16a34a" />
        <rect x="14" y="20" width="4" height="8"   fill="#22c55e" opacity="0.5" />
      </svg>
    ),
    title: 'Furniture',
    items: ['Sofas & sectionals', 'Beds & mattresses', 'Tables, desks & chairs', 'Wardrobes & dressers'],
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <rect x="4" y="6"  width="24" height="20" rx="3" fill="#14532d" />
        <rect x="8" y="10" width="16" height="10" rx="2" fill="#16a34a" />
        <rect x="13" y="24" width="6"  height="4" rx="1" fill="#166534" />
        <circle cx="16" cy="15" r="3" fill="#22c55e" opacity="0.5" />
      </svg>
    ),
    title: 'Electronics & Office',
    items: ['TVs & home cinema', 'Computers & monitors', 'Office equipment', 'Printers & servers'],
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <rect x="2" y="14" width="28" height="10" rx="4" fill="#14532d" />
        <rect x="4" y="10" width="8"  height="6"  rx="2" fill="#16a34a" />
        <circle cx="9"  cy="26" r="4" fill="#22c55e" opacity="0.35" />
        <circle cx="23" cy="26" r="4" fill="#22c55e" opacity="0.35" />
        <rect x="12" y="8" width="16" height="8" rx="2" fill="#166534" />
      </svg>
    ),
    title: 'Heavy & Oversized',
    items: ['Pianos & safes', 'Gym equipment', 'Hot tubs & spas', 'Commercial machinery'],
  },
]

export default function MoveAnythingSection() {
  return (
    <section className="relative z-10 bg-white pt-24 pb-28 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-400 mb-4">
            What we move
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.05] mb-5">
            If it fits in a truck,<br />
            <span className="text-slate-400">we&apos;ll move it.</span>
          </h2>
          <p className="text-lg text-slate-500 font-light max-w-lg leading-relaxed">
            No job too big, no item too awkward. Our crews are trained, equipped, and ready.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {CATEGORIES.map(({ icon, title, items }) => (
            <motion.div
              key={title}
              variants={item}
              className="group p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:border-green-400 hover:shadow-xl hover:shadow-green-100 transition-all duration-500 [will-change:transform]"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6 transition-colors duration-300">
                {icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">{title}</h3>
              <ul className="space-y-2.5">
                {items.map(i => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-16 pt-12 border-t border-slate-200 flex flex-wrap justify-between gap-8"
        >
          {[
            ['1,200+', 'Successful jobs'],
            ['4.9 / 5', 'Average rating'],
            ['Same day', 'Service available'],
            ['24 / 7', 'Support line'],
          ].map(([val, label]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{val}</span>
              <span className="text-sm text-slate-400 font-light">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
