"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  {
    label: "Services",
    href: "/services",
    children: ["Garbage Removal", "Moving (USA)", "Armed Security"],
  },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Contact",      href: "/#contact" },
];

const FloatingNav = () => {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* ── Main nav ─────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-[60px]">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/rainey-logo.png"
              alt="Rainey Removal LLC"
              width={48}
              height={48}
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
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="relative">
                {link.children ? (
                  <div className="flex items-center">
                    <a
                      href={link.href}
                      className="flex items-center px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
                    >
                      {link.label}
                    </a>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.label ? null : link.label)
                      }
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
                  <a
                    href={link.href}
                    className="flex items-center px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
                  >
                    {link.label}
                  </a>
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
                      {link.children.map((child) => {
                        const slug = child.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')
                        return (
                          <a
                            key={child}
                            href={`/services#${slug}`}
                            className="block px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            {child}
                          </a>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:2010502253"
              className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 tracking-wide transition-colors"
            >
              (201) 050-2253
            </a>
            <a
              href="#"
              className="qf-trigger px-5 py-2.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide hover:bg-slate-700 transition-colors duration-200 shadow-sm"
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-100 bg-white"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-3 text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-3 mt-1 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href="tel:2010502253"
                    className="px-4 py-3 text-[13px] font-semibold text-center text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    (201) 050-2253
                  </a>
                  <a
                    href="#"
                    className="qf-trigger px-4 py-3 text-[11px] font-bold text-center text-white bg-slate-900 hover:bg-slate-700 rounded-full transition-colors tracking-wide"
                  >
                    Get a Quote
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default FloatingNav;
