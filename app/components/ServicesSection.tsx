'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Per-card cinematic config ────────────────────────────────────────────────

const CARDS = [
  {
    num: '01',
    title: 'Garbage Removal',
    desc: 'Furniture, electronics, appliances, junk — we haul it all away, responsibly and same day.',
    videoSrc: '/videos/garbage-removal.mp4',
    gifSrc: '',
    accent: '#f59e0b',       // amber
    accentRgb: '245,158,11',
    baseGrad: 'linear-gradient(145deg, #1c1407 0%, #120e04 60%, #1a1206 100%)',
    glowColor: 'rgba(245,158,11,0.18)',
    glowHover: 'rgba(245,158,11,0.35)',
    particles: [
      { w: 120, top: 28, delay: 0,   dur: 5.5 },
      { w: 80,  top: 52, delay: 1.4, dur: 4.2 },
      { w: 160, top: 70, delay: 0.7, dur: 6.8 },
      { w: 60,  top: 40, delay: 2.1, dur: 3.9 },
    ],
    particleColor: 'rgba(245,158,11,0.28)',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
        <rect x="3" y="8" width="22" height="14" rx="3" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
        <rect x="7" y="4" width="14" height="5" rx="2" fill="#451a03" stroke="#f59e0b" strokeWidth="1.2" />
        <line x1="10" y1="13" x2="18" y2="13" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="17" x2="15" y2="17" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Moving (USA)',
    desc: 'Local and out-of-state moves handled with care and efficiency — anywhere in the country.',
    videoSrc: '/videos/moving.mp4',
    gifSrc: '',
    accent: '#60a5fa',       // blue
    accentRgb: '96,165,250',
    baseGrad: 'linear-gradient(145deg, #060d1c 0%, #080f1f 60%, #04091a 100%)',
    glowColor: 'rgba(96,165,250,0.15)',
    glowHover: 'rgba(96,165,250,0.30)',
    particles: [
      { w: 180, top: 62, delay: 0,   dur: 4.0 },
      { w: 100, top: 72, delay: 1.0, dur: 3.2 },
      { w: 140, top: 80, delay: 0.5, dur: 5.0 },
      { w: 70,  top: 55, delay: 2.0, dur: 3.8 },
    ],
    particleColor: 'rgba(96,165,250,0.22)',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
        <rect x="2" y="12" width="18" height="10" rx="2" fill="#0c1a3a" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="20" y="15" width="6" height="7" rx="1" fill="#0c1a3a" stroke="#60a5fa" strokeWidth="1.5" />
        <circle cx="7" cy="24" r="2.5" fill="#60a5fa" opacity="0.75" />
        <circle cx="20" cy="24" r="2.5" fill="#60a5fa" opacity="0.75" />
        <path d="M2 16l4-6h8" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Armed Security',
    desc: 'Licensed armed security personnel for residential, commercial, and event protection.',
    videoSrc: '/security.mp4',
    gifSrc: '',
    accent: '#4ade80',       // green
    accentRgb: '74,222,128',
    baseGrad: 'linear-gradient(145deg, #071208 0%, #050e06 60%, #061009 100%)',
    glowColor: 'rgba(74,222,128,0.14)',
    glowHover: 'rgba(74,222,128,0.28)',
    particles: [
      { w: 90,  top: 22, delay: 0,   dur: 7.0 },
      { w: 50,  top: 45, delay: 1.8, dur: 5.5 },
      { w: 70,  top: 65, delay: 0.9, dur: 6.2 },
      { w: 40,  top: 35, delay: 3.0, dur: 4.8 },
    ],
    particleColor: 'rgba(74,222,128,0.20)',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
        <path d="M14 3L4 7v8c0 5.5 4.5 9.5 10 11 5.5-1.5 10-5.5 10-11V7L14 3z" fill="#052e16" stroke="#4ade80" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 14l3 3 5-5" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

// ─── Card ─────────────────────────────────────────────────────────────────────

function ServiceCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: index * 0.13 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className="relative overflow-hidden rounded-2xl cursor-default flex flex-col"
      style={{ minHeight: '420px', background: card.baseGrad }}
    >
      {/* ── Animated particle streaks ──────────────────────────────────────── */}
      {card.particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            height: '1.5px',
            width: `${p.w}px`,
            top: `${p.top}%`,
            left: '-20%',
            borderRadius: '2px',
            background: `linear-gradient(to right, transparent, ${card.particleColor}, transparent)`,
          }}
          animate={{ x: ['0px', '600px'], opacity: [0, 1, 0] }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}

      {/* ── Ambient bottom glow ────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '55%' }}
        animate={{ opacity: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{
          width: '100%', height: '100%',
          background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${card.glowHover} 0%, transparent 70%)`,
        }} />
      </motion.div>

      {/* ── Top corner glow on hover ───────────────────────────────────────── */}
      <motion.div
        className="absolute top-0 right-0 pointer-events-none"
        style={{ width: '50%', height: '40%' }}
        animate={{ opacity: hovered ? 0.8 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{
          width: '100%', height: '100%',
          background: `radial-gradient(ellipse at 80% 10%, rgba(${card.accentRgb},0.18) 0%, transparent 65%)`,
        }} />
      </motion.div>

      {/* ── Scan line (security card style) — accent colored ─────────────── */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: '1px',
          background: `linear-gradient(to right, transparent 0%, rgba(${card.accentRgb},0.35) 20%, rgba(${card.accentRgb},0.55) 50%, rgba(${card.accentRgb},0.35) 80%, transparent 100%)`,
        }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 4 + index * 0.8, repeat: Infinity, ease: 'linear', delay: index * 1.2 }}
      />

      {/* ── Real video background ─────────────────────────────────────────── */}
      {card.videoSrc && (
        <motion.video
          src={card.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          animate={{ opacity: hovered ? 0.95 : 0.75 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none' }}
        />
      )}

      {/* ── GIF background ────────────────────────────────────────────────── */}
      {card.gifSrc && (
        <motion.img
          src={card.gifSrc}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          animate={{ opacity: hovered ? 0.95 : 0.75 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />
      )}

      {/* ── Dark overlay for readability ──────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(175deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%)' }}
      />

      {/* ── Border (brightens on hover) ───────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: hovered
            ? `inset 0 0 0 1px rgba(${card.accentRgb},0.40), 0 24px 48px rgba(0,0,0,0.6), 0 0 30px rgba(${card.accentRgb},0.10)`
            : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
        }}
        transition={{ duration: 0.4 }}
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col h-full p-8">
        {/* Number */}
        <span
          className="text-[11px] font-bold tracking-[0.28em] mb-auto"
          style={{ color: `rgba(${card.accentRgb},0.45)` }}
        >
          {card.num}
        </span>

        <div className="flex flex-col gap-4 mt-auto">
          {/* Icon */}
          <motion.div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            animate={{
              backgroundColor: hovered ? `rgba(${card.accentRgb},0.18)` : `rgba(${card.accentRgb},0.08)`,
              boxShadow: hovered
                ? `0 0 0 1px rgba(${card.accentRgb},0.40), 0 0 20px rgba(${card.accentRgb},0.25)`
                : `0 0 0 1px rgba(${card.accentRgb},0.18)`,
            }}
            transition={{ duration: 0.4 }}
          >
            {card.icon}
          </motion.div>

          {/* Title + desc */}
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight leading-tight mb-2">
              {card.title}
            </h3>
            <p className="text-[13px] text-zinc-400 leading-relaxed">
              {card.desc}
            </p>
          </div>

          {/* CTA */}
          <motion.div
            className="flex items-center gap-2"
            animate={{ x: hovered ? 5 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="text-[12px] font-semibold tracking-[0.08em]"
              style={{ color: card.accent }}
            >
              Learn more →
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-zinc-950 py-28 px-6 md:px-10 lg:px-20">
      <div ref={ref} className="max-w-[1200px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-600 mb-4">
            What We Do
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
            Every job. Every size.<br />
            <span className="text-zinc-600">We handle it.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card, i) => (
            <ServiceCard key={card.title} card={card} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
