'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs))
}

/* ─── Flickering Grid Canvas ─────────────────────────────────────── */

interface FlickeringGridProps {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  className?: string
}

function FlickeringGrid({
  squareSize = 3,
  gridGap = 6,
  flickerChance = 0.03,
  color = '#4ade80',
  className,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const parseColor = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { r, g, b } = parseColor(color)
    const step = squareSize + gridGap

    let cols: number, rows: number
    let opacities: Float32Array

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      cols = Math.ceil(canvas.width / step)
      rows = Math.ceil(canvas.height / step)
      opacities = new Float32Array(cols * rows)
      for (let i = 0; i < opacities.length; i++) {
        opacities[i] = Math.random() * 0.15 + 0.04
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j
          if (Math.random() < flickerChance) {
            opacities[idx] = Math.random() * 0.5 + 0.04
          }
          ctx.fillStyle = `rgba(${r},${g},${b},${opacities[idx]})`
          ctx.fillRect(i * step, j * step, squareSize, squareSize)
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [squareSize, gridGap, flickerChance, color, parseColor])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full', className)}
    />
  )
}

/* ─── Icons ──────────────────────────────────────────────────────── */

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[17px] h-[17px]">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" strokeWidth="0" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[17px] h-[17px]">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}


/* ─── Data ───────────────────────────────────────────────────────── */

const SOCIALS = [
  { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/ronrainey/' },
  { icon: <FacebookIcon />,  label: 'Facebook',  href: 'https://www.facebook.com/Rainey.1985' },
]

const NAV_LINKS = [
  { label: 'About',   href: '/'        },
  { label: 'FAQ',     href: '/#faq'    },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '#contact' },
]

/* ─── Footer ─────────────────────────────────────────────────────── */

export default function FlickeringFooter() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">

      {/* ── Main row ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-14">
        <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-0">

          {/* ── Brand ── */}
          <div className="flex flex-col gap-5 md:w-[260px] shrink-0">
            <div className="flex items-center gap-3">
              <Image
                src="/rainey-logo-footer.jpeg"
                alt="Rainey Removal LLC"
                width={56}
                height={56}
                className="object-contain select-none rounded-full"
              />
              <div>
                <p className="text-[17px] font-black tracking-tight leading-snug">
                  <span className="text-white">Rainey </span>
                  <span className="text-green-400">Removal</span>
                  <span className="text-white"> LLC</span>
                </p>
                <p className="text-[10px] text-zinc-500 font-medium tracking-[0.2em] uppercase mt-0.5">
                  EST. East Orange
                </p>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-green-400 hover:border-green-400/25 hover:bg-green-400/5 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Working Hours (centered independently) ── */}
          <div className="flex-1 hidden md:flex justify-center">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-[0.2em]">
              Working Hours
            </p>
            <div className="space-y-1.5">
              <p className="text-sm text-zinc-300 font-semibold">Monday – Sunday</p>
              <p className="text-sm text-zinc-500">9:00 am – 6:00 pm EST</p>
            </div>
            <div className="mt-2 space-y-2">
              <a
                href="tel:+12018502253"
                className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-green-400 transition-colors duration-150"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
                  <path d="M2 3a1 1 0 011-1h2.5l1 3-1.5 1.5a10.7 10.7 0 004.5 4.5L11 9.5l3 1v2.5a1 1 0 01-1 1C6.418 14.5 2 10.082 2 5.5V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                (201) 850-2253
              </a>
              <a
                href="mailto:Ofc.QuranRainey@gmail.com"
                className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-green-400 transition-colors duration-150"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Ofc.QuranRainey@gmail.com
              </a>
            </div>
          </div>
          </div>

          {/* Working Hours mobile (shown only on mobile, below brand) */}
          <div className="flex flex-col gap-3 md:hidden">
            <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-[0.2em]">Working Hours</p>
            <div className="space-y-1.5">
              <p className="text-sm text-zinc-300 font-semibold">Monday – Sunday</p>
              <p className="text-sm text-zinc-500">9:00 am – 6:00 pm EST</p>
            </div>
            <div className="mt-2 space-y-2">
              <a href="tel:+12018502253" className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-green-400 transition-colors duration-150">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
                  <path d="M2 3a1 1 0 011-1h2.5l1 3-1.5 1.5a10.7 10.7 0 004.5 4.5L11 9.5l3 1v2.5a1 1 0 01-1 1C6.418 14.5 2 10.082 2 5.5V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                (201) 850-2253
              </a>
              <a href="mailto:Ofc.QuranRainey@gmail.com" className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-green-400 transition-colors duration-150">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Ofc.QuranRainey@gmail.com
              </a>
            </div>
          </div>

          {/* ── Nav links (independent column, pushed right) ── */}
          <div className="flex flex-col gap-3.5 md:pr-4">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm font-bold text-zinc-300 hover:text-green-400 transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* ── Flickering visual band ── */}
      <div className="relative h-40 md:h-52 overflow-hidden border-t border-zinc-800/30">
        <FlickeringGrid squareSize={3} gridGap={7} flickerChance={0.025} color="#4ade80" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/30 to-transparent" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-3xl md:text-5xl font-black tracking-tight text-white/90 select-none"
          >
            Where Strength Meets Service.
          </motion.p>
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-zinc-800/50 px-6 md:px-10 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Rainey Removal LLC. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">East Orange, NJ</p>
        </div>
      </div>

    </footer>
  )
}
