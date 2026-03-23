'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'What items do you take?',
    a: 'We take almost everything — furniture, appliances, electronics, mattresses, yard waste, construction debris, and more. The few exceptions are hazardous materials like paint, chemicals, and asbestos.',
  },
  {
    q: 'Do you offer same-day service?',
    a: 'Yes. We maintain daily availability for same-day and next-day bookings across our service area. Call us early for the best slot availability.',
  },
  {
    q: 'Do you handle heavy lifting?',
    a: 'Absolutely. Our team is trained and equipped for heavy items including safes, pianos, gym equipment, and large appliances. No extra charge for heavy items.',
  },
  {
    q: 'Do you serve apartments and businesses?',
    a: 'Yes. We work with homeowners, renters, property managers, landlords, offices, and commercial spaces of all sizes.',
  },
  {
    q: 'How does pricing work?',
    a: 'We provide a free upfront quote based on the volume of items and access to your space. The price is locked in before we start — no surprises at the end.',
  },
  {
    q: 'What happens to my stuff after removal?',
    a: 'We prioritize donation and recycling. Usable items go to local charities. Everything else is disposed of responsibly and legally.',
  },
]

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full text-left text-base font-bold text-white py-5 flex items-center justify-between cursor-pointer gap-4 focus:outline-none group"
      >
        <span className="group-hover:text-green-400 transition-colors">{q}</span>
        <span
          className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-green-600 border-green-600 rotate-45' : 'bg-zinc-900 border-zinc-700'
          }`}
        >
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <path
              d="M6 2v8M2 6h8"
              stroke={isOpen ? '#fff' : '#4ade80'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-zinc-400 leading-relaxed pb-5 pr-10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-zinc-900 py-28 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24"
          >
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500 mb-4">
              FAQ
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Questions<br />
              <span className="text-zinc-500">answered.</span>
            </h2>
            <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-md mb-8">
              Still have questions? Give us a call — we&apos;re happy to walk you through anything.
            </p>
            <a
              href="tel:+12010502253"
              className="inline-block px-6 py-3 border border-zinc-700 text-zinc-300 font-semibold rounded-xl hover:border-zinc-500 hover:text-white transition-colors"
            >
              Call (201) 050-2253
            </a>
          </motion.div>

          {/* Right — Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-6 divide-y-0"
          >
            {FAQS.map(({ q, a }, idx) => (
              <FAQItem
                key={q}
                q={q}
                a={a}
                isOpen={openIndex === idx}
                onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
