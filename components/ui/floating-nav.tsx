"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown, Instagram, Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MobileNavOverlay } from "@/components/ui/text-roll-navigation";

const NAV_LINKS = [
  {
    label: "Services",
    href: "/services",
    // Hrefs match the section ids on /services (slugifying the labels gave
    // #moving-usa / #armed-security, which don't exist)
    children: [
      { label: "Garbage Removal", href: "/services#garbage-removal" },
      { label: "Moving (USA)",    href: "/services#moving" },
      { label: "Armed Security",  href: "/services#security" },
    ],
  },
  { label: "Gallery",      href: "/gallery" },
  // Add { label: "Promotions", href: "/promotions" } back when a new promo runs
];

const FloatingNav = () => {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close the services dropdown on a click/tap anywhere outside it
  useEffect(() => {
    if (!openDropdown) return;
    const onDown = (e: PointerEvent) => {
      if (!linksRef.current?.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openDropdown]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* ── Main nav ─────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/rainey-logo.png"
              alt="Rainey Removal LLC"
              width={48}
              height={37}
              className="object-contain select-none"
              style={{ mixBlendMode: 'multiply' }}
              priority
            />
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-black tracking-[0.12em] uppercase text-slate-900">
                Rainey Removal
              </span>
              <span className="w-px h-3.5 bg-slate-300" />
              <span className="text-[11px] font-medium text-slate-400 tracking-wide">LLC</span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul ref={linksRef} className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="relative">
                {link.children ? (
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      className="flex items-center px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
                    >
                      {link.label}
                    </Link>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.label ? null : link.label)
                      }
                      aria-label={`${link.label} menu`}
                      aria-expanded={openDropdown === link.label}
                      className="flex items-center px-1 py-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
                    >
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {link.children && openDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.14 }}
                      className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:2018502253"
              className="hidden lg:inline text-[13px] font-semibold text-slate-500 hover:text-slate-900 tracking-wide whitespace-nowrap transition-colors"
            >
              (201) 850-2253
            </a>
            <a
              href="https://www.instagram.com/ronrainey/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:block p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.facebook.com/Rainey.1985"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:block p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
            <button
              type="button"
              className="qf-trigger px-5 py-2.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide whitespace-nowrap hover:bg-slate-700 transition-colors duration-200 shadow-sm"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="md:hidden p-3 -mr-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileNavOverlay onClose={closeMobile} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingNav;
