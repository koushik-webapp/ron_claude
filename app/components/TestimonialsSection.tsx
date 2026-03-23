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

const TESTIMONIALS = [
  {
    quote: 'They came the same day I called and cleared out my entire garage in under 3 hours. Unbelievable.',
    name: 'Marcus T.',
    location: 'Jersey City',
  },
  {
    quote: 'Super professional team. Took apart my old furniture, hauled everything, and left no mess behind.',
    name: 'Priya S.',
    location: 'Hoboken',
  },
  {
    quote: 'Used them for a full estate cleanout after my mother passed. They were respectful and incredibly efficient.',
    name: 'Daniel R.',
    location: 'Bayonne',
  },
  {
    quote: 'Quoted me a fair price upfront and stuck to it. No hidden fees. Highly recommend.',
    name: 'Aisha M.',
    location: 'Newark',
  },
  {
    quote: 'Moved my entire apartment in half the time I expected. Worth every penny.',
    name: 'Kevin L.',
    location: 'Union City',
  },
  {
    quote: 'They took items I didn\'t think anyone would — old mattress, broken treadmill, construction scraps. All gone.',
    name: 'Sofia G.',
    location: 'Kearny',
  },
]

function StarRating() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
          <path d="M8 1l1.85 3.748L14 5.522l-3 2.924.708 4.13L8 10.4l-3.708 2.176L5 8.446 2 5.522l4.15-.774L8 1z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="bg-zinc-900 py-28 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500 mb-4">
            Reviews
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
            Trusted by your neighbors.
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map(({ quote, name, location }) => (
            <motion.div
              key={name}
              variants={item}
              className="group p-8 rounded-2xl border border-zinc-800 bg-zinc-950 hover:shadow-xl hover:shadow-green-950/50 hover:border-green-800 transition-all duration-500 flex flex-col"
            >
              <StarRating />
              <span className="text-5xl font-black text-green-900 leading-none mt-3 select-none">&ldquo;</span>
              <p className="text-sm text-zinc-300 leading-relaxed -mt-2 flex-1">{quote}</p>
              <p className="text-xs font-bold text-white uppercase tracking-wider mt-4">
                {name}&nbsp;&nbsp;·&nbsp;&nbsp;<span className="text-zinc-500 font-semibold normal-case tracking-normal">{location}</span>
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
