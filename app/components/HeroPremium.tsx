'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, useSpring, type MotionValue } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// LEFT PANEL — static sub-components
// ─────────────────────────────────────────────────────────────────────────────

const WORDS = ['Fast', 'Reliable', 'Local']

const SERVICES = [
  'Armed Security',
  'Moving',
  'Garbage Removal',
  'Local / Out-of-State',
  'Vehicle Transport',
]

const STATS = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-green-500">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    value: '4.9',
    label: 'Rating',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-green-500">
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l1.5 6h9l1.5-6H5.5L4.5 4H3z" />
      </svg>
    ),
    value: '2,000+',
    label: 'Jobs Completed',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-green-500">
        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
      </svg>
    ),
    value: 'Licensed',
    label: '& Insured',
  },
]

function LeftPanel({ mouseY }: { mouseY: MotionValue<number> }) {
  return (
    <>
      {/* ── Man — z-10, behind van ────────────────────────────────────────── */}
      {/* Sized to live comfortably inside the left column (~22% wide)        */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block absolute z-10 pointer-events-none"
        style={{ width: '28%', height: '68vh', bottom: '13%', left: '-8.5%', y: mouseY }}
      >
        {/* Soft ambient light behind him — eliminates the "pasted" look */}
        <div
          className="absolute inset-0 -inset-x-4"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 75%, rgba(248,250,252,0.95) 0%, transparent 72%)',
          }}
        />
        <Image
          src="/hero-man-v3.png"
          alt="Rainey Removal — crew member"
          fill
          priority
          className="object-contain select-none"
          style={{
            objectPosition: 'center bottom',
            mixBlendMode: 'multiply',
            filter:
              'contrast(1.04) brightness(1.01) drop-shadow(0px 6px 20px rgba(0,0,0,0.13))',
          }}
          sizes="21vw"
        />
        {/* Ground shadow under feet */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: '55%',
            height: '14px',
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.10) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* ── Unified text + stats column — z-30 ───────────────────────────── */}
      {/* Same left/width as the man so everything shares one grid line      */}
      <div
        className="hidden lg:flex absolute left-0 top-0 bottom-0 z-30 flex-col pointer-events-none"
        style={{ width: '22%', paddingLeft: '1rem', paddingRight: '0.75rem' }}
      >
        {/* Middle space — man image lives here visually */}
        <div className="flex-1" />

        {/* Words — below the man, near the bottom */}
        <div className="flex flex-col gap-2.5 pb-[8vh]">
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.5, x: 0 }}
              transition={{ delay: 0.35 + i * 0.13, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11px] font-black tracking-[0.20em] uppercase text-slate-700 leading-none"
            >
              {word}
            </motion.span>
          ))}
        </div>

      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TUNING
// ─────────────────────────────────────────────────────────────────────────────

const CFG = {
  TOTAL:          500,
  VIDEO_DURATION: 5.04,
  MOUSE_SCALE:    0.32,
  DELTA_MAX:      44,
  MOMENTUM_DAMP:      0.18,
  MOMENTUM_THRESHOLD: 0.75,
  LERP: 0.26,
  SNAP: 0.05,
  tagStart: 0.82,
  tagEnd:   0.94,
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroPremium() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progress = useMotionValue(0)

  // ── Mouse parallax for left panel ────────────────────────────────────────
  const rawMouseY  = useMotionValue(0)
  const smoothY    = useSpring(rawMouseY, { stiffness: 60, damping: 20, mass: 0.8 })
  const panelY     = useTransform(smoothY, [-1, 1], [-7, 7])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const norm = (e.clientY / window.innerHeight) * 2 - 1
      rawMouseY.set(norm)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawMouseY])

  // ── Services reveal ───────────────────────────────────────────────────────
  const [servicesIn, setServicesIn] = useState(false)
  useEffect(() => {
    return progress.on('change', v => setServicesIn(v >= CFG.tagStart))
  }, [progress])

  // ── Prime video for instant seeking ──────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const prime = () => { v.play().then(() => { v.pause() }).catch(() => {}) }
    if (v.readyState >= 3) prime()
    else v.addEventListener('canplaythrough', prime, { once: true })
  }, [])

  // ── Scrub timeline ────────────────────────────────────────────────────────
  useEffect(() => {
    const { TOTAL, VIDEO_DURATION } = CFG
    let target       = 0
    let display      = 0
    let rafId        = 0
    let prevAbsDelta = 0
    let pageReleased = false

    const lockPage    = () => { document.body.style.overflow = 'hidden' }
    const releasePage = () => { document.body.style.overflow = ''       }
    lockPage()

    const tick = () => {
      const diff = target - display
      if (Math.abs(diff) <= CFG.SNAP) {
        display = target
      } else {
        display += diff * CFG.LERP
      }
      const p = display / TOTAL
      const v = videoRef.current
      if (v) v.currentTime = Math.max(0, Math.min(VIDEO_DURATION, p * VIDEO_DURATION))
      progress.set(Math.max(0, Math.min(1, p)))
      if (Math.abs(target - display) > CFG.SNAP) rafId = requestAnimationFrame(tick)
    }

    const scheduleRaf = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(tick) }

    const processDelta = (rawDelta: number): number => {
      const abs = Math.abs(rawDelta)
      const isMouse = Number.isInteger(rawDelta) && abs >= 100
      let delta = isMouse ? rawDelta * CFG.MOUSE_SCALE : rawDelta
      const isMomentum = !isMouse && prevAbsDelta > 8 && abs < prevAbsDelta * CFG.MOMENTUM_THRESHOLD
      if (isMomentum) delta *= CFG.MOMENTUM_DAMP
      prevAbsDelta = abs
      return Math.sign(delta) * Math.min(Math.abs(delta), CFG.DELTA_MAX)
    }

    const onWheel = (e: WheelEvent) => {
      const delta   = processDelta(e.deltaY)
      const atEnd   = target >= TOTAL && delta > 0
      const atStart = target <= 0    && delta < 0

      if (atEnd) {
        if (!pageReleased) {
          releasePage()
          pageReleased = true
          setTimeout(() => window.scrollBy({ top: 60, behavior: 'smooth' }), 16)
        }
        return
      }
      if (pageReleased && delta < 0 && window.scrollY === 0) {
        lockPage(); pageReleased = false
      }
      if (pageReleased) return
      if (atStart) { e.preventDefault(); return }
      e.preventDefault()
      target = Math.max(0, Math.min(TOTAL, target + delta))
      scheduleRaf()
    }

    const onScroll = () => {
      if (window.scrollY === 0 && pageReleased) {
        pageReleased = false
        lockPage()
        const v = videoRef.current
        if (v) v.currentTime = Math.max(0, Math.min(VIDEO_DURATION, (target / TOTAL) * VIDEO_DURATION))
      }
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      const dy    = touchY - e.touches[0].clientY
      touchY      = e.touches[0].clientY
      const delta = dy * 2
      if (target >= TOTAL && delta > 0) {
        if (!pageReleased) { releasePage(); pageReleased = true; setTimeout(() => window.scrollBy({ top: 60, behavior: 'smooth' }), 16) }
        return
      }
      if (pageReleased) return
      e.preventDefault()
      target = Math.max(0, Math.min(TOTAL, target + delta))
      scheduleRaf()
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('scroll',     onScroll,     { passive: true  })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      cancelAnimationFrame(rafId)
      releasePage()
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('scroll',     onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [progress])

  // ── Tagline ──────────────────────────────────────────────────────────────
  const tagOp = useTransform(progress, [CFG.tagStart, CFG.tagEnd], [0, 1])
  const tagY  = useTransform(progress, [CFG.tagStart, CFG.tagEnd], [8, 0])

  return (
    <section
      className="relative h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 45%, #f0f1f3 100%)',
      }}
    >

      {/* ── Studio depth glow — centre, behind van ───────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 72%, rgba(220,222,226,0.55) 0%, transparent 100%)',
        }}
      />

      {/* ── Vignette — edges only, barely visible ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(0,0,0,0.032) 100%)',
        }}
      />

      {/* ── Left panel ───────────────────────────────────────────────────── */}
      <LeftPanel mouseY={panelY} />

      {/* ── Scroll-scrubbed video ─────────────────────────────────────────── */}
      {/* Mobile: floats just below tagline text; sm+: anchored to bottom    */}
      <div className="absolute inset-x-0 bottom-0 top-0 flex items-start pt-[40vh] sm:items-end sm:pt-0 justify-center z-20"
           style={{ paddingBottom: '2vh' }}>
        <video
          ref={videoRef}
          src="/hero-van-scrub.mp4"
          muted
          playsInline
          preload="auto"
          className="w-auto h-auto max-w-[96vw] max-h-[68vh] sm:max-h-[84vh] select-none"
          style={{
            mixBlendMode: 'multiply',
            /* Clip only the watermark strip — minimal, not the wheels */
            clipPath: 'inset(0 0 4% 0)',
          }}
        />
      </div>

      {/* Ground shadow — makes van feel anchored to the floor */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-21"
        style={{
          height: '12vh',
          background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(0,0,0,0.07) 0%, transparent 100%)',
        }}
      />

      {/* Bottom fade — blends watermark clip seam into white */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-25"
        style={{ height: '10%', background: 'linear-gradient(to bottom, transparent, #f0f1f3)' }}
      />

      {/* ── Tagline ───────────────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: tagOp, y: tagY }}
        className="absolute inset-0 z-40 flex flex-col items-center justify-start pt-[12vh] sm:pt-[7vh] pointer-events-none"
      >
        <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-center leading-[1.2] flex flex-wrap items-center justify-center gap-y-1">
          <span className="bg-white text-slate-900 px-3 py-1">We Move</span>
          <span className="bg-slate-900 text-white px-3 py-1">Anything</span>
          <span className="bg-slate-900 text-green-400 px-3 py-1">Anywhere</span>
        </p>
      </motion.div>

      {/* ── Services reveal — right side, scroll-end ─────────────────────── */}
      <motion.div
        style={{ opacity: tagOp, top: '18vh', width: '220px' }}
        className="absolute right-[1%] z-40 pointer-events-none hidden lg:flex flex-col"
      >
        {/* Section label + rule */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[8px] font-light tracking-[0.40em] uppercase text-slate-400 shrink-0">
            Services
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(148,163,184,0.28)' }} />
        </div>

        {/* Staggered service list */}
        <motion.div
          initial="hidden"
          animate={servicesIn ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } } }}
          className="flex flex-col gap-[13px]"
        >
          {SERVICES.map((svc) => (
            <motion.span
              key={svc}
              variants={{
                hidden:  { opacity: 0, y: 9 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
              }}
              className="text-[12px] font-semibold tracking-[0.18em] uppercase text-slate-700 leading-none"
            >
              {svc}
            </motion.span>
          ))}
        </motion.div>

        {/* Trust stats — beneath the service list */}
        <motion.div
          initial="hidden"
          animate={servicesIn ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.10, delayChildren: 0.60 } } }}
          className="flex flex-col gap-[14px] mt-6 pt-5"
          style={{ borderTop: '1px solid rgba(148,163,184,0.22)' }}
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={{
                hidden:  { opacity: 0, y: 7 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
              }}
              className="flex items-center gap-2.5"
            >
              <div className="w-[26px] h-[26px] rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-800 leading-none">{s.value}</p>
                <p className="text-[9.5px] text-slate-400 tracking-[0.08em] mt-[3px]">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </motion.div>

      {/* ── Sub caption ───────────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: tagOp }}
        className="absolute bottom-[14vh] sm:bottom-16 left-0 right-0 z-40 flex items-center justify-center px-10 pointer-events-none"
      >
        <p className="flex-1 text-center text-[10px] sm:text-base font-semibold tracking-[0.18em] uppercase text-green-500">
          Garbage Removal&nbsp;&nbsp;·&nbsp;&nbsp;Moving&nbsp;&nbsp;·&nbsp;&nbsp;Local &amp; Out of State
        </p>
        <p className="hidden sm:block absolute right-10 text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-400 text-right">
          Est.&nbsp;<span className="text-slate-600">East Orange, New Jersey</span>
        </p>
      </motion.div>


    </section>
  )
}
