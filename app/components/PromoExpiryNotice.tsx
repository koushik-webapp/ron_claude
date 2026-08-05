'use client'

import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { ACTIVE_PROMO, hasPromoEnded, formatPromoRange } from '@/app/data/promotions'

// The promotions page is statically prerendered, so a build-time date check
// would freeze whatever was true when the site was deployed. Checking after
// mount means the "offer ended" state appears on its own the day after the
// promo closes, with no redeploy.
export default function PromoExpiryNotice() {
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    // Intentional, runs once: the page is static HTML, so "has the promo ended"
    // can only be answered against the visitor's clock, after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnded(hasPromoEnded(ACTIVE_PROMO))
  }, [])

  if (!ended) return null

  return (
    <div className="border-b border-amber-400/25 bg-amber-400/10">
      <div className="mx-auto flex max-w-5xl items-start gap-3 px-6 py-4 md:px-10">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
        <div>
          <p className="text-[13px] font-bold tracking-wide text-amber-300">
            This offer has ended.
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-amber-200/70">
            The Back 2 School Move-In Special ran {formatPromoRange(ACTIVE_PROMO)}. We still move
            students year-round — call{' '}
            <a href={ACTIVE_PROMO.contact.phoneHref} className="font-semibold underline hover:text-amber-100">
              {ACTIVE_PROMO.contact.phone}
            </a>{' '}
            for a current quote.
          </p>
        </div>
      </div>
    </div>
  )
}
