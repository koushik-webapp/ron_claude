"use client";

import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, X } from "lucide-react";

const cn = (...arr: Array<string | false | null | undefined>) =>
  arr.filter(Boolean).join(" ");

const STAGGER = 0.035;

export const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = false }) => (
  <motion.span
    initial="initial"
    whileHover="hovered"
    className={cn("relative block overflow-hidden cursor-pointer", className)}
    style={{ lineHeight: 0.85 }}
    aria-label={children}
  >
    <div>
      {children.split("").map((l, i) => {
        const delay = center
          ? STAGGER * Math.abs(i - (children.length - 1) / 2)
          : STAGGER * i;
        return (
          <motion.span
            key={`top-${i}`}
            className="inline-block"
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ ease: "easeInOut", delay }}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        );
      })}
    </div>
    <div className="absolute inset-0">
      {children.split("").map((l, i) => {
        const delay = center
          ? STAGGER * Math.abs(i - (children.length - 1) / 2)
          : STAGGER * i;
        return (
          <motion.span
            key={`bot-${i}`}
            className="inline-block"
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ ease: "easeInOut", delay }}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        );
      })}
    </div>
  </motion.span>
);

const NAV_ITEMS = [
  { name: "Home",     href: "/" },
  { name: "Services", href: "/services" },
  { name: "Gallery",  href: "/gallery" },
];

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const MobileNavOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.22 }}
    className="fixed inset-0 z-[100] flex flex-col bg-zinc-950"
  >
    {/* Top bar */}
    <div className="flex items-center justify-between px-6 h-[60px] border-b border-zinc-800 shrink-0">
      <span className="text-[13px] font-black tracking-[0.12em] uppercase text-white">
        Rainey Removal
      </span>
      <button
        onClick={onClose}
        className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
        aria-label="Close menu"
      >
        <X size={20} />
      </button>
    </div>

    {/* Nav links — centered */}
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
      {NAV_ITEMS.map((item, i) => (
        <motion.div
          key={item.name}
          custom={i}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-center"
        >
          <a
            href={item.href}
            onClick={onClose}
            className="group relative inline-block text-white hover:text-green-400 transition-colors duration-200"
          >
            <TextRoll
              center
              className="text-5xl font-extrabold uppercase tracking-[-0.02em]"
            >
              {item.name}
            </TextRoll>
            <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-green-400 transition-all duration-300 group-hover:w-full" />
          </a>
        </motion.div>
      ))}

      {/* Divider */}
      <motion.div
        custom={NAV_ITEMS.length}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="w-16 h-px bg-zinc-700 my-4"
      />

      {/* CTA */}
      <motion.div
        custom={NAV_ITEMS.length + 1}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <a
          href="#"
          onClick={onClose}
          className="qf-trigger inline-block px-8 py-3 rounded-full bg-green-600 text-white text-[13px] font-bold tracking-wide hover:bg-green-500 transition-colors"
        >
          Get a Quote
        </a>
      </motion.div>
    </div>

    {/* Bottom bar */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="shrink-0 px-6 pb-8 pt-4 border-t border-zinc-800 flex items-center justify-between"
    >
      <a
        href="tel:2018502253"
        className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        (201) 850-2253
      </a>
      <div className="flex items-center gap-3">
        <a
          href="https://www.instagram.com/ronrainey/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
          aria-label="Instagram"
        >
          <Instagram size={18} />
        </a>
        <a
          href="https://www.facebook.com/Rainey.1985"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
          aria-label="Facebook"
        >
          <Facebook size={18} />
        </a>
      </div>
    </motion.div>
  </motion.div>
);
