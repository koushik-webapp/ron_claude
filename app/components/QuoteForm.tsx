'use client'

import { useState } from 'react'

type FormState = {
  name: string
  email: string
  phone: string
  message: string
  honeypot: string // hidden spam trap
}

const INITIAL: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
  honeypot: '',
}

export default function QuoteForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)
      setForm(INITIAL)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/40 transition-all duration-200'

  const labelClass = 'block text-[11px] font-semibold tracking-[0.12em] uppercase text-zinc-500 mb-1.5'

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-8 gap-5">
        <div className="w-12 h-12 rounded-full bg-green-950/60 border border-green-800 flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
            <path d="M5 10l3.5 3.5L15 7" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-[15px] mb-1">Request Received</p>
          <p className="text-zinc-400 text-[13px] leading-relaxed max-w-[260px]">
            We'll be in touch shortly. For urgent needs, call us directly.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 flex flex-col gap-5">
      {/* Honeypot — hidden from real users, bots fill it in */}
      <input
        type="text"
        name="honeypot"
        value={form.honeypot}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
        aria-hidden="true"
      />

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Smith"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      {/* Email + Phone row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(201) 000-0000"
            value={form.phone}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>Tell us what you need removed</label>
        <textarea
          id="message"
          name="message"
          placeholder="Furniture, appliances, construction debris, full cleanout..."
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-[12px] text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold text-[13px] tracking-wide transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending...
          </>
        ) : (
          'Get My Free Quote'
        )}
      </button>
    </form>
  )
}
