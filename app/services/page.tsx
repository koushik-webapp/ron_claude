'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import FloatingNav from '@/components/ui/floating-nav'

// ─── Service data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'garbage-removal',
    num: '01',
    label: 'Junk & Debris',
    title: 'Garbage Removal',
    tagline: 'Same-day. No questions asked.',
    videoSrc: '/videos/garbage-removal.mp4',
    accent: '#f59e0b',
    accentRgb: '245,158,11',
    baseGrad: 'linear-gradient(145deg, #2a1e0e 0%, #1a1408 60%, #241a0e 100%)',
    desc: `We haul away everything — old furniture, appliances, electronics, construction debris, yard waste, and everything in between. No job is too big or too small.`,
    includes: [
      'Full interior & exterior haul-outs',
      'Furniture & appliance removal',
      'Construction & renovation debris',
      'Yard waste & outdoor cleanups',
      'Estate & hoarder cleanouts',
      'Same-day & next-day booking',
    ],
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <rect x="3" y="9" width="26" height="16" rx="3.5" fill="#451a03" stroke="#f59e0b" strokeWidth="1.6" />
        <rect x="8" y="4" width="16" height="7" rx="2.5" fill="#451a03" stroke="#f59e0b" strokeWidth="1.3" />
        <line x1="11" y1="15" x2="21" y2="15" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="11" y1="19" x2="17" y2="19" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'moving',
    num: '02',
    label: 'Relocation',
    title: 'Moving (USA)',
    tagline: 'Local moves. Long-distance too.',
    videoSrc: '/videos/moving.mp4',
    accent: '#60a5fa',
    accentRgb: '96,165,250',
    baseGrad: 'linear-gradient(145deg, #0d1628 0%, #101828 60%, #08101e 100%)',
    desc: `Whether you're moving across the street or across the country, we handle it all. Professional packing, careful loading, and on-time delivery — every time.`,
    includes: [
      'Local & long-distance moves',
      'Professional packing service',
      'Furniture disassembly & reassembly',
      'Fragile item handling',
      'Commercial & office relocations',
      'Storage solutions available',
    ],
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <rect x="2" y="13" width="21" height="12" rx="2.5" fill="#0c1a3a" stroke="#60a5fa" strokeWidth="1.6" />
        <rect x="23" y="17" width="7" height="8" rx="1.5" fill="#0c1a3a" stroke="#60a5fa" strokeWidth="1.6" />
        <circle cx="8" cy="27" r="3" fill="#60a5fa" opacity="0.8" />
        <circle cx="22" cy="27" r="3" fill="#60a5fa" opacity="0.8" />
        <path d="M2 18l5-7h9" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'security',
    num: '03',
    label: 'Protection',
    title: 'Armed Security',
    tagline: 'Licensed. Professional. Discreet.',
    videoSrc: '',
    accent: '#4ade80',
    accentRgb: '74,222,128',
    baseGrad: 'linear-gradient(145deg, #071208 0%, #050e06 60%, #061009 100%)',
    desc: `Our licensed armed security personnel provide professional protection for residences, commercial properties, events, and high-value assets across New Jersey.`,
    includes: [
      'Residential property protection',
      'Commercial & retail security',
      'Event & venue security',
      'Executive & VIP protection',
      'Licensed & fully insured officers',
      'Available 24/7',
    ],
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <path d="M16 3L4 8v9c0 6.5 5.2 11.1 12 13 6.8-1.9 12-6.5 12-13V8L16 3z" fill="#052e16" stroke="#4ade80" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M11 16l4 4 6-6" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

// ─── Garbage Removal Detail Section ───────────────────────────────────────────

const GARBAGE_SERVICES = [
  {
    title: 'Full Junk Removal',
    desc: 'Single items to full truckloads — fast, no-nonsense hauling with zero headache.',
    img: '/svc-full-junk.png',
  },
  {
    title: 'Property Cleanouts',
    desc: 'Whole-home, garage, attic, basement, and commercial cleanouts done in one visit.',
    img: '/svc-property.jpg',
  },
  {
    title: 'Furniture Removal',
    desc: 'Sofas, beds, wardrobes, and oversized pieces cleared without a scratch on your walls.',
    img: '/svc-furniture.jpg',
  },
  {
    title: 'Appliance Removal',
    desc: 'Fridges, washers, dryers, ovens — heavy appliances gone before your next cup of coffee.',
    img: '/svc-appliance.jpg',
  },
  {
    title: 'Construction Debris',
    desc: 'Post-reno cleanup of drywall, lumber, tiles, and mixed jobsite waste — all hauled away.',
    img: '/svc-construction.jpg',
  },
  {
    title: 'Yard Waste Removal',
    desc: 'Branches, brush, old fencing, and outdoor clutter cleared so you can enjoy your space.',
    img: '/svc-yard.jpg',
  },
  {
    title: 'Donation Pickups',
    desc: 'Reusable items sorted and dropped at local charities — giving your junk a second life.',
    img: '/svc-donation.jpg',
  },
  {
    title: 'Light Demolition',
    desc: 'Sheds, decks, cabinets, and interior teardowns handled with full cleanup included.',
    img: '/svc-demolition.jpg',
  },
]

const WHAT_WE_TAKE = [
  'Furniture', 'Appliances', 'Electronics', 'Mattresses', 'Office Equipment',
  'Construction Debris', 'Yard Waste', 'Household Junk', 'Tires', 'Gym Equipment',
  'Hot Tubs', 'Play Equipment', 'Pianos', 'Storage Units', 'And more...',
]

function GarbageServiceCard({ item, index }: { item: typeof GARBAGE_SERVICES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 cursor-default bg-white"
    >
      {/* Photo */}
      <div className="relative h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Text */}
      <div className="p-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">{item.title}</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  )
}

function GarbageRemovalDetails() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 py-24">

        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-green-600 mb-4">
            Garbage Removal Services
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
              Every type of junk.<br />
              <span className="text-green-600">One crew to clear it.</span>
            </h2>
            <p className="text-[15px] text-slate-500 leading-relaxed max-w-[340px] md:text-right">
              From single items to full estate cleanouts — we show up, we haul it, we're done.
            </p>
          </div>
        </motion.div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {GARBAGE_SERVICES.map((item, i) => (
            <GarbageServiceCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* What We Take */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm px-8 md:px-12 py-10">
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-green-600 mb-3">What We Take</p>
            <h3 className="text-2xl font-black text-slate-900 mb-8">
              If you can name it, we can haul it.
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {WHAT_WE_TAKE.map((item) => (
                <span
                  key={item}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-[12px] font-semibold border transition-colors duration-200 ${
                    item === 'And more...'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  {item !== 'And more...' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 shrink-0" />
                  )}
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)' }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 0%, transparent 50%), radial-gradient(circle at 80% 20%, #86efac 0%, transparent 40%)'
          }} />
          <div className="relative px-8 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-green-400 mb-3">Ready to start?</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.1] mb-3">
                Ready to Clear Your Space?
              </h3>
              <p className="text-[15px] text-green-100/70 leading-relaxed max-w-[380px]">
                Book your junk removal in minutes. We handle the heavy lifting — you just point and we haul.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <motion.a
                href="#"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="qf-trigger inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 text-[13px] font-bold tracking-wide shadow-lg hover:bg-green-50 transition-colors duration-200"
              >
                Get Free Quote
              </motion.a>
              <motion.a
                href="tel:2010502253"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-green-500/40 text-white text-[13px] font-bold tracking-wide hover:border-green-400 hover:bg-white/5 transition-all duration-200"
              >
                Book Now →
              </motion.a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

// ─── Moving Detail Section ────────────────────────────────────────────────────

const MOVING_SERVICES = [
  {
    title: 'Local Moving',
    desc: "Fast, careful moves within the city — every belonging treated like it's our own.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 12h18M3 12l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    title: 'Long Distance Moving',
    desc: 'State-to-state relocation with real-time coordination and secure, on-time delivery.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M2 13h14l-3-6H5L2 13z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M16 13h4l2 4H16v-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <circle cx="6" cy="17" r="2" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="18" cy="17" r="2" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    title: 'Residential Moving',
    desc: 'Stress-free home moves from studios to large houses — fully managed, start to finish.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Commercial Moving',
    desc: 'Office and business relocations executed with precision to keep your downtime near zero.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Packing Services',
    desc: 'Professional packing with premium materials so nothing shifts, scratches, or breaks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Unpacking Services',
    desc: 'We settle you in faster — unboxing, organizing, and placing items exactly where you want.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M5 8h14l-1.5 9a2 2 0 01-2 1.5H8.5a2 2 0 01-2-1.5L5 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Furniture Assembly',
    desc: 'Careful disassembly at pickup, full reassembly at delivery — no missing bolts, no guesswork.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="2" y="8" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 18v2M18 18v2M12 13v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Heavy Item Moving',
    desc: 'Pianos, safes, gym equipment — we have the crew and equipment to move it safely.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 3v4M8 5l2.5 2.5M16 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <rect x="3" y="11" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 11V9a2 2 0 014 0v2M13 11V9a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    title: 'Same-Day Moving',
    desc: "Last-minute move? We mobilize fast so you're not stuck waiting when time is short.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Storage Solutions',
    desc: "Flexible short and long-term storage so your timeline stays yours — not the move's.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="2" y="5" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="2" y="13" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 9v4M18 9v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="1" fill="currentColor"/>
        <circle cx="12" cy="15" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: 'Loading & Unloading',
    desc: 'Labor-only help for trucks, pods, or storage units — we bring the muscle, you bring the plan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Specialty Item Handling',
    desc: 'Artwork, electronics, antiques, and high-value items packed and moved with white-glove care.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

const WHAT_WE_MOVE = [
  'Furniture', 'Boxes & Household Items', 'Office Equipment', 'Electronics',
  'Appliances', 'Mattresses', 'Fragile Items', 'Gym Equipment',
  'Pianos', 'Artwork & Antiques', 'Storage Units', 'And more',
]

function MovingServiceCard({ item, index }: { item: typeof MOVING_SERVICES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.07 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/60 transition-all duration-300 cursor-default"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1.5px rgba(96,165,250,0.25)' }} />

      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-200">
        {item.icon}
      </div>

      <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">{item.title}</h3>
      <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>

      <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  )
}

function MovingDetails() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 py-24">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-blue-500 mb-4">
            Moving Services
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
              Every move, covered.<br />
              <span className="text-blue-500">Local or across the country.</span>
            </h2>
            <p className="text-[15px] text-slate-500 leading-relaxed max-w-[340px] md:text-right">
              Full-service moving from first box to last piece of furniture — we handle every detail.
            </p>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {MOVING_SERVICES.map((item, i) => (
            <MovingServiceCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* What We Move */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm px-8 md:px-12 py-10">
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-blue-500 mb-3">What We Move</p>
            <h3 className="text-2xl font-black text-slate-900 mb-8">
              If it fits in a home, we can move it.
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {WHAT_WE_MOVE.map((item) => (
                <span
                  key={item}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-[12px] font-semibold border transition-colors duration-200 ${
                    item === 'And more'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {item !== 'And more' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 shrink-0" />
                  )}
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #0c1a3a 0%, #1e3a6e 50%, #1d4ed8 100%)' }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #93c5fd 0%, transparent 50%), radial-gradient(circle at 80% 20%, #bfdbfe 0%, transparent 40%)'
          }} />
          <div className="relative px-8 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-blue-300 mb-3">Ready to move?</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.1] mb-3">
                Your next chapter starts here.
              </h3>
              <p className="text-[15px] text-blue-100/70 leading-relaxed max-w-[380px]">
                Get a free quote in minutes. We'll handle the heavy lifting so you can focus on what's next.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <motion.a
                href="#"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="qf-trigger inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 text-[13px] font-bold tracking-wide shadow-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Get Free Quote
              </motion.a>
              <motion.a
                href="tel:2010502253"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-blue-400/40 text-white text-[13px] font-bold tracking-wide hover:border-blue-300 hover:bg-white/5 transition-all duration-200"
              >
                Book Now →
              </motion.a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

// ─── Service Card (full width alternating layout) ─────────────────────────────

function ServiceBlock({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hovered, setHovered] = useState(false)
  const isEven = index % 2 === 0

  return (
    <div ref={ref} id={service.id} className="py-20 border-b border-zinc-900">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${!isEven ? 'lg:[direction:rtl]' : ''}`}>

          {/* Visual card */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -40 : 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:[direction:ltr]"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              style={{ minHeight: '400px', background: service.baseGrad }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Particle streaks */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    height: '1.5px',
                    width: `${80 + i * 40}px`,
                    top: `${20 + i * 20}%`,
                    borderRadius: '2px',
                    background: `linear-gradient(to right, transparent, rgba(${service.accentRgb},0.35), transparent)`,
                  }}
                  animate={{ x: ['-10%', '120%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 4 + i * 1.2, repeat: Infinity, delay: i * 0.9, ease: 'linear' }}
                />
              ))}

              {/* Video */}
              {service.videoSrc && (
                <motion.video
                  src={service.videoSrc}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ opacity: hovered ? 0.6 : 0.28 }}
                  transition={{ duration: 0.7 }}
                  onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none' }}
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)' }} />

              {/* Scan line */}
              <motion.div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  height: '1px',
                  background: `linear-gradient(to right, transparent, rgba(${service.accentRgb},0.5), transparent)`,
                }}
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />

              {/* Border glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                  boxShadow: hovered
                    ? `inset 0 0 0 1px rgba(${service.accentRgb},0.4), 0 0 40px rgba(${service.accentRgb},0.08)`
                    : 'inset 0 0 0 1px rgba(255,255,255,0.07)',
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Number watermark */}
              <div className="absolute bottom-6 right-8 select-none pointer-events-none">
                <span className="text-[80px] font-black leading-none" style={{ color: `rgba(${service.accentRgb},0.12)` }}>
                  {service.num}
                </span>
              </div>

              {/* Icon + label */}
              <div className="absolute top-7 left-7 flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `rgba(${service.accentRgb},0.10)`, border: `1px solid rgba(${service.accentRgb},0.22)` }}
                >
                  {service.icon}
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: `rgba(${service.accentRgb},0.6)` }}>
                    {service.label}
                  </p>
                  <p className="text-[13px] font-bold text-white">{service.title}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 40 : -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="flex flex-col gap-6 lg:[direction:ltr]"
          >
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: service.accent }}>
                {service.num} — {service.label}
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] mb-3">
                {service.title}
              </h2>
              <p className="text-[15px] font-medium text-zinc-500 tracking-wide">
                {service.tagline}
              </p>
            </div>

            <div className="h-px bg-zinc-800 w-12" />

            <p className="text-[15px] text-zinc-400 leading-relaxed">
              {service.desc}
            </p>

            {/* Includes list */}
            <ul className="flex flex-col gap-2.5">
              {service.includes.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px] text-zinc-300">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: `rgba(${service.accentRgb},0.12)`, border: `1px solid rgba(${service.accentRgb},0.28)` }}>
                    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                      <path d="M2 5l2 2 4-4" stroke={service.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex items-center gap-4 pt-2">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[12px] font-bold tracking-wide text-white"
                style={{
                  background: `linear-gradient(135deg, rgba(${service.accentRgb},0.9) 0%, rgba(${service.accentRgb},0.7) 100%)`,
                  boxShadow: `0 0 0 1px rgba(${service.accentRgb},0.30), 0 8px 24px rgba(${service.accentRgb},0.20)`,
                }}
              >
                Book This Service
                <span>→</span>
              </motion.a>
              <a href="tel:2010502253" className="text-[12px] font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">
                or call us
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <FloatingNav />

      {/* ── Fleet Hero ─────────────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: 'calc(100vh - 60px)', marginTop: '60px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fleet-hero.png"
          alt="Rainey Removal LLC fleet — van, box truck, and pickup"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,9,11,0.90) 0%, rgba(9,9,11,0.3) 50%, rgba(9,9,11,0.1) 100%)' }} />

        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-10 left-8 md:left-16"
        >
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-green-500">Our Fleet</p>
        </motion.div>

        {/* Center / bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tight leading-[1.0] mb-4">
              Every job. Every size.<br />
              <span className="text-green-500">We handle it.</span>
            </h1>
            <p className="text-[15px] text-zinc-400 leading-relaxed max-w-[460px] mb-10">
              From a single item to a full estate — our fleet is equipped, wrapped, and ready to roll anywhere in the USA.
            </p>

            {/* Stat bar */}
            <div className="flex flex-wrap items-center gap-10">
              {[
                { num: '3', label: 'Vehicles in fleet' },
                { num: '24/7', label: 'Available' },
                { num: 'NJ + USA', label: 'Service area' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-10">
                  <div>
                    <p className="text-3xl font-black text-white leading-none">{stat.num}</p>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="w-px h-8 bg-zinc-700" />}
                </div>
              ))}
              <a
                href="tel:2010502253"
                className="ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-600 bg-zinc-900/70 backdrop-blur-sm text-[13px] font-semibold text-white hover:border-green-500 hover:text-green-400 transition-all duration-200"
              >
                (201) 050-2253
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Service blocks */}
      <GarbageRemovalDetails />
      {SERVICES.filter(s => s.id !== 'garbage-removal').map((service, i) => (
        <div key={service.id}>
          <ServiceBlock service={service} index={i} />
          {service.id === 'moving' && <MovingDetails />}
        </div>
      ))}

      {/* Bottom CTA */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-zinc-600 mb-5">Ready to get started?</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-8">
            Get a free quote<br />
            <span className="text-zinc-600">in under 60 seconds.</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-[13px] font-bold tracking-wide text-white"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 60%, #166534 100%)',
                boxShadow: '0 0 0 1px rgba(74,222,128,0.25), 0 8px 32px rgba(22,163,74,0.28)',
              }}
            >
              Book Now →
            </motion.a>
            <a
              href="tel:2010502253"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-zinc-700 text-[13px] font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition-all duration-200"
            >
              (201) 050-2253
            </a>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
