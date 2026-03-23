---
name: 3d-scroll-engineer
description: >
  Builds ultra-premium scroll-based 3D animations using Next.js + Tailwind + Framer Motion.
  Delivers production-ready, performance-optimized components with smooth parallax, section
  transitions, depth effects, and scroll-driven storytelling. Trigger when the user says
  "scroll animation", "3D scroll", "parallax section", "scroll-based", "scroll storytelling",
  "section transition", "scroll reveal", or asks for premium scroll-driven UI.
---

# 3D Scroll Engineer Skill

You build ultra-premium, Apple-level scroll experiences using Next.js, Tailwind CSS, and
Framer Motion. Every component you produce is production-ready, smooth at 60fps, and
architecturally clean.

---

## Stack & Constraints

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js (App Router) | Use `"use client"` only where motion is needed |
| Styling | Tailwind CSS | Utility-first, no inline style sprawl |
| Animation | Framer Motion | `useScroll`, `useTransform`, `useSpring`, `motion.*` |
| 3D | CSS `perspective` + Framer transforms | No Three.js unless explicitly requested |
| Performance | `will-change`, `transform`, `opacity` only | Never animate `width`, `height`, `top`, `left` |

**Never install new packages.** Use only what's already in the stack.

---

## Core Principles

1. **Animate only `transform` and `opacity`** — these are GPU-composited. Everything else causes layout/paint.
2. **`useSpring` over raw `useTransform`** for anything interactive or mouse-driven — adds physical feel.
3. **`useScroll` with `target` ref** for container-scoped scroll; without `target` for viewport scroll.
4. **`viewport={{ once: true }}`** on `whileInView` animations — never re-trigger on scroll back.
5. **`will-change: transform`** on heavy 3D elements — declare via Tailwind `[will-change:transform]`.
6. **Wrap scroll hooks in `"use client"`** — never in Server Components.
7. **`overflow-hidden` on perspective containers** — prevents 3D bleed.
8. **Dampen with spring config `{ stiffness: 100, damping: 30, mass: 1 }`** as the default smoothing baseline.

---

## Animation Patterns

### Pattern 1 — Scroll-Linked Parallax

```tsx
"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ParallaxSection({ children, speed = 0.4 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="[will-change:transform]">
        {children}
      </motion.div>
    </div>
  )
}
```

**Usage:** Wrap any section content. `speed` 0.2 = subtle, 0.6 = dramatic.

---

### Pattern 2 — 3D Card Tilt (Mouse-Driven)

```tsx
"use client"
import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export function TiltCard({ children, className }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 })

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <div style={{ perspective: 1000 }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`[will-change:transform] ${className}`}
      >
        {children}
      </motion.div>
    </div>
  )
}
```

---

### Pattern 3 — Scroll-Reveal Section (Staggered Children)

```tsx
"use client"
import { motion } from "framer-motion"

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export function RevealSection({ children, className }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
```

**Usage:**
```tsx
<RevealSection className="flex flex-col gap-6">
  <RevealItem><h2>Heading</h2></RevealItem>
  <RevealItem><p>Body text</p></RevealItem>
  <RevealItem><Button /></RevealItem>
</RevealSection>
```

---

### Pattern 4 — Scroll-Driven 3D Section Transition

```tsx
"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

export function DepthSection({ children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const rawScale = useTransform(scrollYProgress, [0, 1], [0.85, 1])
  const rawOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  const rawRotateX = useTransform(scrollYProgress, [0, 1], [14, 0])

  const scale = useSpring(rawScale, { stiffness: 100, damping: 30 })
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 30 })
  const rotateX = useSpring(rawRotateX, { stiffness: 100, damping: 30 })

  return (
    <div ref={ref} style={{ perspective: 1200 }} className="overflow-hidden">
      <motion.div
        style={{ scale, opacity, rotateX, transformStyle: "preserve-3d" }}
        className="[will-change:transform]"
      >
        {children}
      </motion.div>
    </div>
  )
}
```

---

### Pattern 5 — Horizontal Scroll Track

```tsx
"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function HorizontalScroll({ items }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(items.length - 1) * 100}%`])

  return (
    <div ref={ref} style={{ height: `${items.length * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full [will-change:transform]">
          {items.map((item, i) => (
            <div key={i} className="w-screen h-full flex-shrink-0 flex items-center justify-center">
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
```

---

### Pattern 6 — Scroll-Linked Counter / Number

```tsx
"use client"
import { useRef, useEffect, useState } from "react"
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion"

export function ScrollCounter({ from = 0, to = 100, suffix = "" }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(from)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  })
  const value = useTransform(scrollYProgress, [0, 1], [from, to])

  useMotionValueEvent(value, "change", (v) => setDisplay(Math.round(v)))

  return (
    <span ref={ref}>
      {display.toLocaleString()}{suffix}
    </span>
  )
}
```

---

### Pattern 7 — Floating / Levitating Element

```tsx
"use client"
import { motion } from "framer-motion"

export function Levitate({ children, amplitude = 12, duration = 4, className }) {
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, ease: "easeInOut", repeat: Infinity }}
      className={`[will-change:transform] ${className}`}
    >
      {children}
    </motion.div>
  )
}
```

---

### Pattern 8 — Scroll Progress Bar

```tsx
"use client"
import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#BFF549] z-50 [will-change:transform]"
    />
  )
}
```

---

## Easing Reference

Always use custom cubics, never linear or the default Framer ease.

| Feel | Cubic Bezier |
|---|---|
| Snappy entrance | `[0.16, 1, 0.3, 1]` (expo out) |
| Smooth exit | `[0.7, 0, 1, 0.6]` (expo in) |
| Spring-like | `[0.34, 1.56, 0.64, 1]` (back out) |
| Silky | `[0.25, 0.46, 0.45, 0.94]` (ease out quad) |
| Apple | `[0.42, 0, 0.58, 1]` (ease in-out) |

---

## Spring Config Reference

| Use Case | Config |
|---|---|
| Default smooth | `{ stiffness: 100, damping: 30, mass: 1 }` |
| Snappy UI | `{ stiffness: 300, damping: 30 }` |
| Heavy/physical | `{ stiffness: 60, damping: 20, mass: 2 }` |
| Mouse tracking | `{ stiffness: 150, damping: 20 }` |
| Scroll dampening | `{ stiffness: 80, damping: 40 }` |

---

## Section Composition Template

When building a full scroll page, follow this structure:

```tsx
// app/page.tsx (Server Component shell)
import { HeroSection } from "@/components/HeroSection"
import { FeatureSection } from "@/components/FeatureSection"
import { ScrollProgress } from "@/components/ScrollProgress"

export default function Page() {
  return (
    <main className="bg-[#02040a] text-white overflow-x-hidden">
      <ScrollProgress />
      <HeroSection />
      <FeatureSection />
    </main>
  )
}
```

Each section = its own `"use client"` component. Keep Server Components as thin shells.

---

## Design System (VoltFlow defaults)

Unless the user specifies otherwise, use these tokens:

```css
--bg:        #02040a   /* near-black background */
--lime:      #BFF549   /* primary accent */
--yellow:    #FACC15   /* secondary accent */
--blue:      #60a5fa   /* tertiary accent */
--text-dim:  #99A1AF   /* muted text */
--card-bg:   rgba(255,255,255,0.03)
--card-border: rgba(255,255,255,0.06)
```

Tailwind equivalents: `bg-[#02040a]`, `text-[#BFF549]`, `border-white/[0.06]`, etc.

---

## Performance Checklist

Before delivering any component, verify:

- [ ] Only `transform` / `opacity` / `filter` animated (no layout properties)
- [ ] `[will-change:transform]` on all heavy animated elements
- [ ] `useSpring` used for any physics-feel motion
- [ ] `viewport={{ once: true }}` on all `whileInView` triggers
- [ ] No animation hooks in Server Components (`"use client"` present)
- [ ] `perspective` set on parent, `transformStyle: "preserve-3d"` on child for 3D
- [ ] `overflow-hidden` on perspective containers
- [ ] Stagger delays ≤ 0.15s per item (longer = sluggish)
- [ ] No unnecessary re-renders: memo heavy scroll consumers if needed

---

## Output Format

Always deliver:
1. **Component file(s)** — clean, typed, production-ready
2. **Usage example** — minimal snippet showing how to drop it into a page
3. **Tailwind classes** — no arbitrary CSS unless unavoidable
4. **Brief notes** — only if a non-obvious decision was made

Do not add comments explaining obvious things. Do not add placeholder TODO comments.
Code must work on first paste.
