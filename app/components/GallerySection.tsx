'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Review = {
  id: number
  title: string
  location: string
  service: string
  src: string
  thumb?: string
}

type JobItem = {
  id: number
  type: 'photo' | 'video'
  title: string
  location: string
  tag: string
  tagColor: string
  tagRgb: string
  src: string
  thumb?: string
  featured: boolean
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const REVIEWS: Review[] = [
  {
    id: 1,
    title: 'Customer Review',
    location: 'New Jersey',
    service: 'Junk Removal',
    src: '/gallery/reviews/review-1.mp4',
  },
  {
    id: 2,
    title: 'Customer Review',
    location: 'New Jersey',
    service: 'Moving',
    src: '/gallery/reviews/review-2.mp4',
  },
  {
    id: 3,
    title: 'Customer Review',
    location: 'New Jersey',
    service: 'Hauling',
    src: '/gallery/reviews/review-3.mp4',
  },
  {
    id: 4,
    title: 'Customer Review',
    location: 'New Jersey',
    service: 'Cleanout',
    src: '/gallery/reviews/review-4.mp4',
  },
  {
    id: 5,
    title: 'Customer Review',
    location: 'New Jersey',
    service: 'Moving',
    src: '/gallery/reviews/review-5.mp4',
  },
]

const JOB_ITEMS: JobItem[] = [
  {
    id: 1,
    type: 'video',
    title: 'Job in Progress',
    location: 'New Jersey',
    tag: 'Moving',
    tagColor: '#60a5fa',
    tagRgb: '96,165,250',
    src: '/gallery/jobs/job-1.mp4',
    featured: true,
  },
  {
    id: 2,
    type: 'video',
    title: 'On the Job',
    location: 'New Jersey',
    tag: 'Hauling',
    tagColor: '#f59e0b',
    tagRgb: '245,158,11',
    src: '/gallery/jobs/job-2.mp4',
    featured: false,
  },
  {
    id: 3,
    type: 'video',
    title: 'Team in Action',
    location: 'New Jersey',
    tag: 'Junk Removal',
    tagColor: '#f59e0b',
    tagRgb: '245,158,11',
    src: '/gallery/jobs/job-3.mp4',
    featured: false,
  },
]

// ─── Video Modal ──────────────────────────────────────────────────────────────

function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl mx-4"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={src}
          controls
          autoPlay
          playsInline
          muted
          className="w-full rounded-2xl"
          style={{ maxHeight: '78vh' }}
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Review Tile ──────────────────────────────────────────────────────────────
// Expands on hover; video plays with audio

function ReviewTile({
  review,
  isHovered,
  isAnyHovered,
  onHover,
  onLeave,
  onOpen,
  index,
}: {
  review: Review
  isHovered: boolean
  isAnyHovered: boolean
  onHover: () => void
  onLeave: () => void
  onOpen: () => void
  index: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [thumbError, setThumbError] = useState(false)

  // Show first frame as thumbnail on mount — play+pause forces the browser to decode and paint the frame
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const showFirstFrame = () => {
      vid.currentTime = 0.1
      vid.muted = true
      vid.play().then(() => vid.pause()).catch(() => {})
    }
    if (vid.readyState >= 1) {
      showFirstFrame()
    } else {
      vid.addEventListener('loadedmetadata', showFirstFrame, { once: true })
      vid.load()
    }
  }, [])

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    if (isHovered) {
      vid.currentTime = 0
      vid.muted = false
      vid.play().catch(() => {
        vid.muted = true
        vid.play().catch(() => {})
      })
    } else {
      vid.pause()
      vid.currentTime = 0.1
      vid.muted = true
    }
  }, [isHovered])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onOpen}
      style={{
        flex: '1 1 0%',
        minWidth: 0,
        height: '320px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        cursor: 'pointer',
        background: '#0f0f0f',
      }}
    >
      {/* Thumbnail (shown when idle) */}
      {!thumbError && review.thumb && (
        <img
          src={review.thumb}
          alt={review.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isHovered ? 0 : 0.68,
            transition: 'opacity 0.35s ease',
          }}
          onError={() => setThumbError(true)}
        />
      )}

      {/* Video — shows first frame at rest, plays on hover */}
      <video
        ref={videoRef}
        src={review.src}
        playsInline
        loop
        preload="auto"
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          objectPosition: 'top center',
          opacity: isHovered ? 1 : 0.72,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Dark gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(175deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* Border ring */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: isHovered
            ? 'inset 0 0 0 1.5px rgba(255,255,255,0.18), 0 24px 48px rgba(0,0,0,0.55)'
            : 'inset 0 0 0 1px rgba(255,255,255,0.07)',
          transition: 'box-shadow 0.35s ease',
        }}
      />

      {/* Play icon (idle state) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.25s ease' }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '7px 0 7px 13px',
              borderColor: 'transparent transparent transparent white',
              marginLeft: '2px',
            }}
          />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
        <p className="text-white font-bold text-[13px] leading-tight mb-0.5">{review.title}</p>
        <span className="text-[10px] text-zinc-500">{review.service}</span>
      </div>
    </motion.div>
  )
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({
  item,
  index,
  onPlayVideo,
}: {
  item: JobItem
  index: number
  onPlayVideo: (src: string) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const showFirstFrame = () => {
      vid.currentTime = 0.1
      vid.muted = true
      vid.play().then(() => vid.pause()).catch(() => {})
    }
    if (vid.readyState >= 1) {
      showFirstFrame()
    } else {
      vid.addEventListener('loadedmetadata', showFirstFrame, { once: true })
      vid.load()
    }
  }, [])

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    if (hovered) {
      vid.currentTime = 0
      vid.play().catch(() => {})
    } else {
      vid.pause()
      vid.currentTime = 0.1
    }
  }, [hovered])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPlayVideo(item.src)}
      style={{
        flex: '0 0 calc(20% - 10px)',
        width: 'calc(20% - 10px)',
        minWidth: 0,
        height: '320px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        cursor: 'pointer',
        background: '#0f0f0f',
      }}
    >
      {/* Video — first frame as thumbnail, plays muted on hover */}
      <video
        ref={videoRef}
        src={item.src}
        muted
        playsInline
        loop
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          objectPosition: 'top center',
          opacity: hovered ? 1 : 0.72,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Dark gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(175deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* Border ring */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: hovered
            ? 'inset 0 0 0 1.5px rgba(255,255,255,0.18), 0 24px 48px rgba(0,0,0,0.55)'
            : 'inset 0 0 0 1px rgba(255,255,255,0.07)',
          transition: 'box-shadow 0.35s ease',
        }}
      />

      {/* Play icon */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: hovered ? 0 : 1, transition: 'opacity 0.25s ease' }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        >
          <div
            style={{
              width: 0, height: 0,
              borderStyle: 'solid',
              borderWidth: '7px 0 7px 13px',
              borderColor: 'transparent transparent transparent white',
              marginLeft: '2px',
            }}
          />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
        <p className="text-white font-bold text-[13px] leading-tight mb-0.5">{item.title}</p>
        <span className="text-[10px] text-zinc-500">{item.tag}</span>
      </div>
    </motion.div>
  )
}

// ─── Mobile Video Tiles ───────────────────────────────────────────────────────
// These replicate the desktop first-frame useEffect so iOS shows a thumbnail
// instead of a black box. preload="metadata" loads nothing on iOS; preload="auto"
// combined with vid.load() + loadedmetadata + play/pause forces the first frame.

function MobileReviewTile({ review, index, onOpen }: { review: Review; index: number; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const showFirstFrame = () => {
      vid.currentTime = 0.1
      vid.muted = true
      vid.play().then(() => vid.pause()).catch(() => {})
    }
    if (vid.readyState >= 1) {
      showFirstFrame()
    } else {
      vid.addEventListener('loadedmetadata', showFirstFrame, { once: true })
      vid.load()
    }
  }, [])

  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ height: '175px', background: '#0f0f0f' }}
      onClick={onOpen}
    >
      <video
        ref={videoRef}
        src={review.src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'top center', opacity: 0.72 }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(175deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '6px 0 6px 12px', borderColor: 'transparent transparent transparent white', marginLeft: '2px' }} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-bold text-[12px] leading-tight">{review.title}</p>
        <p className="text-zinc-400 text-[10px]">{review.location}</p>
      </div>
    </motion.div>
  )
}

function MobileJobTile({ item, index, onOpen }: { item: JobItem; index: number; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const showFirstFrame = () => {
      vid.currentTime = 0.1
      vid.muted = true
      vid.play().then(() => vid.pause()).catch(() => {})
    }
    if (vid.readyState >= 1) {
      showFirstFrame()
    } else {
      vid.addEventListener('loadedmetadata', showFirstFrame, { once: true })
      vid.load()
    }
  }, [])

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ height: '175px', background: '#0f0f0f' }}
      onClick={onOpen}
    >
      <video
        ref={videoRef}
        src={item.src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'top center', opacity: 0.72 }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '6px 0 6px 12px', borderColor: 'transparent transparent transparent white', marginLeft: '2px' }} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-bold text-[12px] leading-tight">{item.title}</p>
        <p className="text-zinc-400 text-[10px]">{item.tag}</p>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function GallerySection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [hoveredReview, setHoveredReview] = useState<number | null>(null)

  return (
    <section className="bg-zinc-950 py-28 px-6 md:px-10 lg:px-20">
      <AnimatePresence>
        {activeVideo && (
          <VideoModal src={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>

      <div ref={ref} className="max-w-[1200px] mx-auto">

        {/* ── Main header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-600 mb-4">
            Proof of work
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
            Gallery<br />
            <span className="text-[#4ade80]">Real jobs. Real reviews. Real results.</span>
          </h2>
        </motion.div>

        {/* ══ SUBSECTION 1 — CUSTOMER REVIEWS ════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Sub-header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="shrink-0">
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-600 mb-1">
                Section 01
              </p>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Customer Reviews
              </h3>
            </div>
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] text-zinc-600 shrink-0 hidden sm:block">
              Hover to watch
            </span>
          </div>

          {/* Desktop: expanding flex tiles */}
          <div
            className="hidden md:flex gap-3"
            style={{ alignItems: 'flex-start' }}
          >
            {REVIEWS.map((review, i) => (
              <ReviewTile
                key={review.id}
                review={review}
                index={i}
                isHovered={hoveredReview === review.id}
                isAnyHovered={hoveredReview !== null}
                onHover={() => setHoveredReview(review.id)}
                onLeave={() => setHoveredReview(null)}
                onOpen={() => setActiveVideo(review.src)}
              />
            ))}
          </div>

          {/* Mobile: 2-col grid, tap to open */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {REVIEWS.map((review, i) => (
              <MobileReviewTile
                key={review.id}
                review={review}
                index={i}
                onOpen={() => setActiveVideo(review.src)}
              />
            ))}
          </div>
        </motion.div>

        {/* ══ SUBSECTION 2 — ON THE JOB ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20"
        >
          {/* Sub-header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="shrink-0">
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-600 mb-1">
                Section 02
              </p>
              <h3 className="text-2xl font-black text-white tracking-tight">
                On the Job
              </h3>
            </div>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Desktop: same flex tile row as reviews */}
          <div className="hidden md:flex gap-3" style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            {JOB_ITEMS.map((item, i) => (
              <JobCard key={item.id} item={item} index={i} onPlayVideo={setActiveVideo} />
            ))}
          </div>

          {/* Mobile: 2-col grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {JOB_ITEMS.map((item, i) => (
              <MobileJobTile
                key={item.id}
                item={item}
                index={i}
                onOpen={() => setActiveVideo(item.src)}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Footer strip ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-14 pt-8 border-t border-zinc-900 flex items-center justify-between flex-wrap gap-4"
        >
          <p className="text-[13px] text-zinc-600">
            Every job documented. Every client satisfied.
          </p>
          <div className="flex items-center flex-wrap gap-2">
            {['Junk Removal', 'Moving', 'Cleanout', 'Hauling', 'Same-Day'].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full text-zinc-600 border border-zinc-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
