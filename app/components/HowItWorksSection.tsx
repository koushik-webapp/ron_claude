'use client'

import React from 'react'
import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const STEPS = [
  {
    number: '1',
    title: 'Get a Quote',
    desc: "Call or fill out our quick form. We'll give you a clear, upfront price — no surprises.",
  },
  {
    number: '2',
    title: 'Schedule Your Pickup',
    desc: 'Choose a time that works for you. Same-day and next-day slots available.',
  },
  {
    number: '3',
    title: 'We Handle Everything',
    desc: 'Our crew shows up on time, does the heavy lifting, and leaves your space spotless.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-black py-28 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center -mt-8"
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-green-600 mb-4">
            The Process
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
            Three <span className="text-green-400">steps.</span><br />
            <span className="text-zinc-600">That&apos;s all it takes.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-0 items-start"
        >
          {STEPS.map(({ number, title, desc }, idx) => (
            <React.Fragment key={title}>
              <motion.div variants={item} className="p-8">
                <span className="text-7xl font-black text-green-900/60 leading-none select-none block -ml-1 mb-1">
                  {number}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 -mt-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </motion.div>

              {idx < STEPS.length - 1 && (
                <div key={`connector-${idx}`} className="hidden md:flex items-center justify-center pt-16 px-2">
                  <div className="h-px w-4 bg-green-900/50" />
                  <span className="text-green-700 text-base font-light mx-1 leading-none">→</span>
                  <div className="h-px w-4 bg-green-900/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex justify-center mt-16"
        >
          <motion.a
            href="#quote"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative group inline-flex items-center gap-3 px-10 py-4 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 60%, #166534 100%)',
              boxShadow: '0 0 0 1px rgba(74,222,128,0.25), 0 8px 32px rgba(22,163,74,0.30)',
            }}
          >
            {/* Shimmer sweep on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
              }}
            />
            <span className="relative text-[13px] font-bold tracking-[0.12em] uppercase text-white">
              Get a Free Quote
            </span>
            <motion.span
              className="relative text-green-200 text-sm"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>

      </div>
    </section>
  )
}
