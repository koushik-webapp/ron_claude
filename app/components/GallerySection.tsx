'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type TouchEvent as ReactTouchEvent,
} from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Review = {
  id: number
  type?: 'photo' | 'video'
  title: string
  location: string
  service: string
  src: string
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
  featured: boolean
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const REVIEWS: Review[] = [
  {
    id: 1,
    title: 'Customer Review',
    location: 'Temple University, Philadelphia',
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
    location: 'Columbus, Georgia',
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
    location: 'Fort Worth, Texas',
    service: 'Moving',
    src: '/gallery/reviews/review-5.mp4',
  },
  {
    id: 6,
    title: 'Customer Review',
    location: 'Bloomfield, New Jersey',
    service: 'Moving',
    src: '/gallery/reviews/review-6.mp4',
  },
  {
    id: 7,
    title: 'Customer Review',
    location: 'Middlesex, New Jersey',
    service: 'Moving',
    src: '/gallery/reviews/review-7.mp4',
  },
  {
    id: 8,
    type: 'photo',
    title: 'Happy Customer',
    location: 'Cincinnati, Ohio',
    service: 'Moving',
    src: '/gallery/reviews/review-photo-1.jpg',
  },
  {
    id: 9,
    title: 'Customer Review',
    location: 'Edison, New Jersey',
    service: 'Moving',
    src: '/gallery/reviews/review-8.mp4',
  },
  {
    id: 10,
    title: 'Customer Review',
    location: 'New Jersey',
    service: 'Moving',
    src: '/gallery/reviews/review-9.mp4',
  },
  {
    id: 11,
    type: 'photo',
    title: 'Customer Shout-Out',
    location: 'New Jersey',
    service: 'Moving',
    src: '/gallery/reviews/review-photo-2.jpg',
  },
  {
    id: 12,
    type: 'photo',
    title: 'Happy Customer',
    location: 'Marianna, Florida',
    service: 'Long Distance Moving',
    src: '/gallery/reviews/review-photo-3.jpg',
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
  {
    id: 5,
    type: 'video',
    title: 'On the Job',
    location: 'New Jersey',
    tag: 'Hauling',
    tagColor: '#f59e0b',
    tagRgb: '245,158,11',
    src: '/gallery/jobs/job-5.mp4',
    featured: false,
  },
  {
    id: 7,
    type: 'photo',
    title: 'On the Job',
    location: 'New Jersey',
    tag: 'Garbage Removal',
    tagColor: '#4ade80',
    tagRgb: '74,222,128',
    src: '/gallery/jobs/job-photo-1.jpg',
    featured: false,
  },
  {
    id: 8,
    type: 'photo',
    title: 'Happy Customer',
    location: 'North Carolina',
    tag: 'Moving',
    tagColor: '#60a5fa',
    tagRgb: '96,165,250',
    src: '/gallery/jobs/job-photo-2.jpg',
    featured: false,
  },
  {
    id: 10,
    type: 'photo',
    title: 'Packing Services',
    location: 'New Jersey',
    tag: 'Packing',
    tagColor: '#a78bfa',
    tagRgb: '167,139,250',
    src: '/gallery/jobs/job-photo-4.jpg',
    featured: false,
  },
  {
    id: 11,
    type: 'video',
    title: 'Full Apartment Cleanout',
    location: 'Newark, New Jersey',
    tag: 'Cleanout',
    tagColor: '#4ade80',
    tagRgb: '74,222,128',
    src: '/gallery/jobs/job-7.mp4',
    featured: false,
  },
  {
    id: 12,
    type: 'video',
    title: '3rd Floor, 3-Bedroom Move',
    location: 'Newark, New Jersey',
    tag: 'Moving',
    tagColor: '#60a5fa',
    tagRgb: '96,165,250',
    src: '/gallery/jobs/job-8.mp4',
    featured: false,
  },
  {
    id: 13,
    type: 'video',
    title: 'Garage Cleanout',
    location: 'New Jersey',
    tag: 'Garbage Removal',
    tagColor: '#4ade80',
    tagRgb: '74,222,128',
    src: '/gallery/jobs/job-9.mp4',
    featured: false,
  },
  {
    id: 14,
    type: 'video',
    title: 'Emergency Call',
    location: 'Kenilworth, New Jersey',
    tag: 'Garbage Removal',
    tagColor: '#4ade80',
    tagRgb: '74,222,128',
    src: '/gallery/jobs/job-10.mp4',
    featured: false,
  },
  {
    id: 15,
    type: 'video',
    title: 'Out-of-State Move',
    location: 'Berwick, Pennsylvania',
    tag: 'Moving',
    tagColor: '#60a5fa',
    tagRgb: '96,165,250',
    src: '/gallery/jobs/job-11.mp4',
    featured: false,
  },
  {
    id: 16,
    type: 'video',
    title: 'Packing Services',
    location: 'New Jersey',
    tag: 'Packing',
    tagColor: '#a78bfa',
    tagRgb: '167,139,250',
    src: '/gallery/jobs/job-12.mp4',
    featured: false,
  },
  {
    id: 17,
    type: 'video',
    title: 'Pool Removal',
    location: 'South Amboy, New Jersey',
    tag: 'Pool Removal',
    tagColor: '#22d3ee',
    tagRgb: '34,211,238',
    src: '/gallery/jobs/job-13.mp4',
    featured: false,
  },
  {
    id: 18,
    type: 'photo',
    title: 'NJ to Atlanta',
    location: 'New Jersey',
    tag: 'Auto Transport',
    tagColor: '#f472b6',
    tagRgb: '244,114,182',
    src: '/gallery/jobs/job-photo-5.jpg',
    featured: false,
  },
  {
    id: 19,
    type: 'photo',
    title: 'Apartment Cleanout',
    location: 'New Jersey',
    tag: 'Cleanout',
    tagColor: '#4ade80',
    tagRgb: '74,222,128',
    src: '/gallery/jobs/job-photo-6.jpg',
    featured: false,
  },
  {
    id: 20,
    type: 'photo',
    title: 'On the Road',
    location: 'St. Louis, Missouri',
    tag: 'Long Distance',
    tagColor: '#60a5fa',
    tagRgb: '96,165,250',
    src: '/gallery/jobs/job-photo-7.jpg',
    featured: false,
  },
  {
    id: 21,
    type: 'photo',
    title: 'On the Road',
    location: 'Arizona',
    tag: 'Long Distance',
    tagColor: '#60a5fa',
    tagRgb: '96,165,250',
    src: '/gallery/jobs/job-photo-8.jpg',
    featured: false,
  },
]
// ─── Media helpers ────────────────────────────────────────────────────────────
// Tiles show a small JPEG from the sibling thumbs/ folder (built by
// `npm run gallery:thumbs`), so the page never downloads full videos just to
// show a preview:  /gallery/jobs/job-1.mp4  →  /gallery/jobs/thumbs/job-1.jpg

function thumbFor(src: string) {
  return src.replace(/\/([^/]+)\.[a-z0-9]+$/i, '/thumbs/$1.jpg')
}

const isPhotoSrc = (src: string) => /\.(jpe?g|png|webp|gif)$/i.test(src)

// Hover previews are for mouse users only. On touch screens (iPad, phones) a tap
// would first trigger the hover state, and iOS Safari can then swallow the click.
const isMouse = (e: ReactPointerEvent) => e.pointerType === 'mouse'

// Lets keyboard users open a tile with Enter/Space like a button
function openOnKey(e: ReactKeyboardEvent, open: () => void) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    open()
  }
}

// Tile preview image. Falls back to the full photo (or hides, for a video) if a
// thumbnail hasn't been generated yet.
function TileThumb({ src, alt, style }: { src: string; alt: string; style?: CSSProperties }) {
  const [failed, setFailed] = useState(false)
  if (failed && !isPhotoSrc(src)) return null
  return (
    <img
      src={failed ? src : thumbFor(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ objectPosition: 'top center', ...style }}
    />
  )
}

function PlayIcon({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const sm = size === 'sm'
  return (
    <div
      className={`${sm ? 'w-10 h-10' : 'w-11 h-11'} rounded-full flex items-center justify-center`}
      style={{ background: sm ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.10)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: sm ? '6px 0 6px 12px' : '7px 0 7px 13px',
          borderColor: 'transparent transparent transparent white',
          marginLeft: '2px',
        }}
      />
    </div>
  )
}

// ─── Video Modal ──────────────────────────────────────────────────────────────

function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  const isPhoto = isPhotoSrc(src)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Start playback immediately. This still runs inside the tap/click that opened
  // the modal, which is what lets iOS Safari play with sound. If the browser
  // refuses, the native controls stay up so one more tap plays it.
  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  // Esc closes; the page behind stops scrolling while the modal is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <motion.div
      // Above the nav, promo bar and the chatbot launcher (z-index 9999)
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
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
        {isPhoto ? (
          <img
            src={src}
            alt=""
            className="w-full rounded-2xl"
            style={{ maxHeight: '78vh', objectFit: 'contain' }}
          />
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={thumbFor(src)}
            controls
            playsInline
            preload="auto"
            className="w-full rounded-2xl"
            style={{ maxHeight: '78vh' }}
          />
        )}
        <button
          onClick={onClose}
          aria-label="Close"
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
// Tablet/desktop. With a mouse, hovering plays the clip with sound; on touch
// screens a tap opens it in the modal. The clip only downloads on first hover.

function ReviewTile({
  review,
  isHovered,
  onHover,
  onLeave,
  onOpen,
  index,
}: {
  review: Review
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onOpen: () => void
  index: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const isVideo = review.type !== 'photo'

  useEffect(() => {
    if (!isVideo) return
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
      vid.muted = true
    }
  }, [isHovered, isVideo])

  const showVideo = isHovered && playing

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      onPointerEnter={(e) => { if (isMouse(e)) onHover() }}
      onPointerLeave={onLeave}
      onClick={onOpen}
      onKeyDown={(e) => openOnKey(e, onOpen)}
      role="button"
      tabIndex={0}
      aria-label={`${review.title} — ${review.location}`}
      style={{
        width: '100%',
        height: '320px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        cursor: 'pointer',
        background: '#0f0f0f',
      }}
    >
      {isVideo && (
        <video
          ref={videoRef}
          src={review.src}
          playsInline
          loop
          muted
          preload="none"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'top center' }}
        />
      )}

      {/* Thumbnail — stays on top until the clip is actually playing */}
      <TileThumb
        src={review.src}
        alt={review.title}
        style={{
          opacity: showVideo ? 0 : isHovered ? 1 : 0.72,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Dark gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(175deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.82) 100%)',
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

      {/* Play icon — videos only, until playback starts */}
      {isVideo && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: showVideo ? 0 : 1, transition: 'opacity 0.25s ease' }}
        >
          <PlayIcon />
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
        <p className="text-white font-bold text-[13px] leading-tight mb-0.5">{review.title}</p>
        <span className="text-[10px] text-zinc-400">{review.service}</span>
      </div>
    </motion.div>
  )
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
// Tablet/desktop. Mouse hover plays the clip muted; tap/click opens the modal.

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
  const [playing, setPlaying] = useState(false)
  const isVideo = item.type === 'video'

  useEffect(() => {
    if (!isVideo) return
    const vid = videoRef.current
    if (!vid) return
    if (hovered) {
      vid.currentTime = 0
      vid.play().catch(() => {})
    } else {
      vid.pause()
    }
  }, [hovered, isVideo])

  const showVideo = hovered && playing
  const open = () => onPlayVideo(item.src)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      onPointerEnter={(e) => { if (isMouse(e)) setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
      onClick={open}
      onKeyDown={(e) => openOnKey(e, open)}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} — ${item.tag}`}
      style={{
        width: '100%',
        height: '320px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        cursor: 'pointer',
        background: '#0f0f0f',
      }}
    >
      {isVideo && (
        <video
          ref={videoRef}
          src={item.src}
          muted
          playsInline
          loop
          preload="none"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'top center' }}
        />
      )}

      {/* Thumbnail — stays on top until the clip is actually playing */}
      <TileThumb
        src={item.src}
        alt={item.title}
        style={{
          opacity: showVideo ? 0 : hovered ? 1 : 0.72,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Dark gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(175deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.82) 100%)',
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

      {/* Play icon — videos only, until playback starts */}
      {isVideo && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: showVideo ? 0 : 1, transition: 'opacity 0.25s ease' }}
        >
          <PlayIcon />
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
        <p className="text-white font-bold text-[13px] leading-tight mb-0.5">{item.title}</p>
        <span className="text-[10px] text-zinc-400">{item.tag}</span>
      </div>
    </motion.div>
  )
}

// ─── Mobile Tile ──────────────────────────────────────────────────────────────
// Phones show the thumbnail only — no <video> element at all — so nothing heavy
// downloads until the visitor taps a tile and it opens in the modal.

function MobileTile({
  src,
  title,
  subtitle,
  isVideo,
  index,
  onOpen,
}: {
  src: string
  title: string
  subtitle: string
  isVideo: boolean
  index: number
  onOpen: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      // Stagger within a row only, so tiles far down the page don't lag behind the scroll
      transition={{ duration: 0.6, delay: (index % 2) * 0.08 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ height: '175px', background: '#0f0f0f' }}
      onClick={onOpen}
      onKeyDown={(e) => openOnKey(e, onOpen)}
      role="button"
      tabIndex={0}
      aria-label={`${title} — ${subtitle}`}
    >
      <TileThumb src={src} alt={title} style={{ opacity: 0.72 }} />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(175deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)' }}
      />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayIcon size="sm" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-bold text-[12px] leading-tight">{title}</p>
        <p className="text-zinc-400 text-[10px]">{subtitle}</p>
      </div>
    </motion.div>
  )
}

// ─── Slider ───────────────────────────────────────────────────────────────────
// Tablet/desktop: two rows of tiles that slide one column per arrow click, or a
// page per swipe on touch screens. The number of columns adapts to the width so
// tiles never get too narrow on tablets.

const SLIDER_GAP = 12
const SLIDER_ROWS = 2
const SLIDER_MAX_COLUMNS = 5
const SLIDER_MIN_CARD = 200

function useSlider(viewportRef: RefObject<HTMLDivElement | null>, itemCount: number) {
  const [rawIndex, setIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const update = () => setContainerWidth(el.offsetWidth)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [viewportRef])

  const columnsVisible = containerWidth > 0
    ? Math.max(2, Math.min(SLIDER_MAX_COLUMNS, Math.floor((containerWidth + SLIDER_GAP) / (SLIDER_MIN_CARD + SLIDER_GAP))))
    : SLIDER_MAX_COLUMNS
  const cardWidth = containerWidth > 0
    ? (containerWidth - SLIDER_GAP * (columnsVisible - 1)) / columnsVisible
    : 220
  const maxIndex = Math.max(0, Math.ceil(itemCount / SLIDER_ROWS) - columnsVisible)
  // Clamped on read too, so a resize that fits more columns never leaves a gap
  const index = Math.min(rawIndex, maxIndex)
  const go = (delta: number) =>
    setIndex(i => Math.max(0, Math.min(maxIndex, Math.min(i, maxIndex) + delta)))

  return { index, maxIndex, cardWidth, columnsVisible, go }
}

// Horizontal swipe → callback; mostly-vertical drags are ignored so the page still scrolls
function useSwipe(onSwipe: (dir: 1 | -1) => void) {
  const start = useRef<{ x: number; y: number } | null>(null)
  return {
    onTouchStart: (e: ReactTouchEvent) => {
      const t = e.touches[0]
      start.current = { x: t.clientX, y: t.clientY }
    },
    onTouchEnd: (e: ReactTouchEvent) => {
      const s = start.current
      start.current = null
      if (!s) return
      const t = e.changedTouches[0]
      const dx = t.clientX - s.x
      const dy = t.clientY - s.y
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) onSwipe(dx < 0 ? 1 : -1)
    },
  }
}

function ArrowButton({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
      style={{
        border: '1px solid',
        borderColor: disabled ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.18)',
        color: disabled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.75)',
        background: disabled ? 'transparent' : 'rgba(255,255,255,0.04)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
        {dir === 'prev'
          ? <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </button>
  )
}

function sliderTrackStyle(slider: ReturnType<typeof useSlider>): CSSProperties {
  return {
    display: 'grid',
    gridTemplateRows: `repeat(${SLIDER_ROWS}, auto)`,
    gridAutoFlow: 'column',
    gridAutoColumns: `${slider.cardWidth}px`,
    gap: SLIDER_GAP,
    transform: `translateX(-${slider.index * (slider.cardWidth + SLIDER_GAP)}px)`,
    transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
  }
}

// Entrance stagger by column, so the second row animates in with the first
const columnOf = (i: number) => Math.floor(i / SLIDER_ROWS) % SLIDER_MAX_COLUMNS

// ─── Section ──────────────────────────────────────────────────────────────────

export default function GallerySection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [hoveredReview, setHoveredReview] = useState<number | null>(null)
  const closeModal = useCallback(() => setActiveVideo(null), [])

  const reviewViewportRef = useRef<HTMLDivElement>(null)
  const jobViewportRef = useRef<HTMLDivElement>(null)
  const reviewSlider = useSlider(reviewViewportRef, REVIEWS.length)
  const jobSlider = useSlider(jobViewportRef, JOB_ITEMS.length)
  const reviewSwipe = useSwipe(dir => reviewSlider.go(dir * reviewSlider.columnsVisible))
  const jobSwipe = useSwipe(dir => jobSlider.go(dir * jobSlider.columnsVisible))

  return (
    <section className="bg-zinc-950 py-28 px-6 md:px-10 lg:px-20">
      <AnimatePresence>
        {activeVideo && (
          <VideoModal key={activeVideo} src={activeVideo} onClose={closeModal} />
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
            <div className="hidden md:flex gap-2 shrink-0">
              <ArrowButton
                dir="prev"
                onClick={() => reviewSlider.go(-1)}
                disabled={reviewSlider.index === 0}
              />
              <ArrowButton
                dir="next"
                onClick={() => reviewSlider.go(1)}
                disabled={reviewSlider.index >= reviewSlider.maxIndex}
              />
            </div>
          </div>

          {/* Tablet/desktop: two-row slider */}
          <div className="hidden md:block">
            <div ref={reviewViewportRef} style={{ overflow: 'hidden' }} {...reviewSwipe}>
              <div style={sliderTrackStyle(reviewSlider)}>
                {REVIEWS.map((review, i) => (
                  <ReviewTile
                    key={review.id}
                    review={review}
                    index={columnOf(i)}
                    isHovered={hoveredReview === review.id}
                    onHover={() => setHoveredReview(review.id)}
                    onLeave={() => setHoveredReview(null)}
                    onOpen={() => setActiveVideo(review.src)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: 2-col grid, tap to open */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {REVIEWS.map((review, i) => (
              <MobileTile
                key={review.id}
                src={review.src}
                title={review.title}
                subtitle={review.location}
                isVideo={review.type !== 'photo'}
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
            <div className="hidden md:flex gap-2 shrink-0">
              <ArrowButton
                dir="prev"
                onClick={() => jobSlider.go(-1)}
                disabled={jobSlider.index === 0}
              />
              <ArrowButton
                dir="next"
                onClick={() => jobSlider.go(1)}
                disabled={jobSlider.index >= jobSlider.maxIndex}
              />
            </div>
          </div>

          {/* Tablet/desktop: two-row slider */}
          <div className="hidden md:block">
            <div ref={jobViewportRef} style={{ overflow: 'hidden' }} {...jobSwipe}>
              <div style={sliderTrackStyle(jobSlider)}>
                {JOB_ITEMS.map((item, i) => (
                  <JobCard key={item.id} item={item} index={columnOf(i)} onPlayVideo={setActiveVideo} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: 2-col grid, tap to open */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {JOB_ITEMS.map((item, i) => (
              <MobileTile
                key={item.id}
                src={item.src}
                title={item.title}
                subtitle={item.tag}
                isVideo={item.type === 'video'}
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
