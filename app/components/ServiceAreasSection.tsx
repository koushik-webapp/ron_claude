'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const AREAS = [
  { name: 'Jersey City', note: 'Typically within 1 hour' },
  { name: 'Bayonne', note: 'Typically within 1 hour' },
  { name: 'Hoboken', note: 'Typically within 1 hour' },
  { name: 'Union City', note: 'Typically within 2 hours' },
  { name: 'Newark', note: 'Typically within 2 hours' },
  { name: 'Kearny', note: 'Typically within 2 hours' },
  { name: 'Secaucus', note: 'Typically within 2 hours' },
  { name: 'Weehawken', note: 'Typically within 1 hour' },
  { name: 'North Bergen', note: 'Typically within 2 hours' },
  { name: 'Elizabeth', note: 'Typically within 2 hours' },
]

export default function ServiceAreasSection() {
  return (
    <section className="bg-zinc-950 py-28 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500 mb-4">
              Coverage
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Serving all of<br />
              <span className="text-zinc-500">Hudson County &amp; beyond.</span>
            </h2>
            <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-md mb-8">
              Based in Jersey City. Available across northern New Jersey with same-day availability.
            </p>

            {/* Mobile chips */}
            <div className="flex flex-wrap gap-2 lg:hidden">
              {AREAS.map(({ name }) => (
                <span
                  key={name}
                  className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-sm font-semibold text-zinc-300"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — location cards (desktop) */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {AREAS.map(({ name, note }) => (
              <motion.div
                key={name}
                variants={item}
                className="group p-5 rounded-2xl border border-zinc-800 bg-zinc-900 hover:shadow-xl hover:shadow-green-950/50 hover:border-green-800 transition-all duration-500 flex items-center justify-between"
              >
                <div>
                  <p className="text-base font-bold text-white">{name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{note}</p>
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-green-950/60 text-green-400 border border-green-900 shrink-0 ml-3">
                  Fast response
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
