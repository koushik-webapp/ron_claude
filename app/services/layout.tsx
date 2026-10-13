import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// The services page is a client component, so its metadata lives here —
// without it the page reused the home page's title and description
export const metadata: Metadata = {
  title: 'Services | Rainey Removal LLC',
  description:
    'Garbage removal and cleanouts, local and long-distance moving across the USA, and armed security — Rainey Removal LLC, New Jersey.',
}

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children
}
