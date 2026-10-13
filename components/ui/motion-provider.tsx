'use client'

import type { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

// Honors the OS "Reduce Motion" setting (iPhone: Settings → Accessibility →
// Motion): framer-motion skips movement animations, opacity fades still run.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
