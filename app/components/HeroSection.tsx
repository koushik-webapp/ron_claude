'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#060610]">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      {/* Left gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#060610] via-[#060610]/70 to-transparent pointer-events-none" />

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060610] to-transparent pointer-events-none" />

      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#060610] to-transparent pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 lg:px-24 max-w-4xl">

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-blue-500/25 bg-blue-500/8 backdrop-blur-md w-fit"
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-300 text-xs font-semibold tracking-widest uppercase">
            Available 24/7 &nbsp;·&nbsp; Same-Day Service
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-6"
        >
          We Remove
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
            Anything.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-md leading-relaxed"
        >
          Rainey Removal — packing and moving services made easy.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="flex flex-wrap gap-4 mb-14"
        >
          {/* Primary CTA */}
          <button className="group relative px-8 py-4 bg-blue-600 text-white font-bold text-base md:text-lg rounded-2xl overflow-hidden shadow-lg shadow-blue-950/60 hover:shadow-blue-700/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200">
            <span className="relative z-10 flex items-center gap-2">
              Get Free Quote
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Secondary CTA */}
          <button className="group flex items-center gap-3 px-8 py-4 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-bold text-base md:text-lg rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-200 shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </span>
            Call Now
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="flex flex-wrap gap-8 pt-6 border-t border-white/8"
        >
          {[
            { value: '10K+', label: 'Jobs Completed' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '2hr', label: 'Avg Response Time' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-2xl font-black text-white">{value}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
