'use client'

const NAV_SERVICES = [
  'Junk Removal',
  'Moving Services',
  'Packing & Unpacking',
  'Furniture Removal',
  'Construction Debris',
  'Estate Cleanouts',
]

const NAV_AREAS = [
  'Jersey City',
  'Bayonne',
  'Hoboken',
  'Union City',
  'Newark',
  'Kearny',
  'Secaucus',
  'Weehawken',
]

const NAV_COMPANY = [
  'About',
  'Pricing',
  'FAQ',
  'Contact',
  'Privacy Policy',
]

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H8.079V12h2.359V9.742c0-2.325 1.383-3.61 3.503-3.61 1.014 0 2.073.181 2.073.181v2.282h-1.168c-1.15 0-1.508.713-1.508 1.444V12h2.566l-.41 2.891h-2.156v6.987C18.343 21.128 22 16.991 22 12z" fill="currentColor" />
    </svg>
  )
}

export default function FooterSection() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-8 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <p className="text-lg font-black tracking-tight mb-1">
              <span className="text-white">Rainey </span>
              <span className="text-green-400">Removal</span>
              <span className="text-white"> LLC</span>
            </p>
            <p className="text-sm text-zinc-500 font-light mb-5">Fast. Clean. Reliable.</p>

            <div className="space-y-2 mb-6">
              <a
                href="tel:+12010502253"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
                  <path d="M2 3a1 1 0 011-1h2.5l1 3-1.5 1.5a10.7 10.7 0 004.5 4.5L11 9.5l3 1v2.5a1 1 0 01-1 1C6.418 14.5 2 10.082 2 5.5V3z" stroke="#71717a" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                (201) 050-2253
              </a>
              <a
                href="mailto:info@raineyremoval.com"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="#71717a" strokeWidth="1.2" />
                  <path d="M1 5l7 5 7-5" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                info@raineyremoval.com
              </a>
            </div>

            <div className="flex gap-3">
              {[
                { icon: <InstagramIcon />, label: 'Instagram' },
                { icon: <FacebookIcon />, label: 'Facebook' },
                { icon: <GoogleIcon />, label: 'Google' },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-green-400 hover:border-zinc-700 transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-5">Services</p>
            <ul className="space-y-3">
              {NAV_SERVICES.map((s) => (
                <li key={s}>
                  <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-5">Service Areas</p>
            <ul className="space-y-3">
              {NAV_AREAS.map((a) => (
                <li key={a}>
                  <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {a}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-5">Company</p>
            <ul className="space-y-3">
              {NAV_COMPANY.map((c) => (
                <li key={c}>
                  <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; 2025 Rainey Removal LLC. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Jersey City, NJ
          </p>
        </div>
      </div>
    </footer>
  )
}
