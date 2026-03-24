"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  Rainey Removal LLC — Chatbot Widget
//
//  Key behaviors:
//  ► Greeting shown ONCE on open; returning to menu uses RETURN_MENU instead
//  ► FAQ keys (containing "_" but not "__") are tracked in `usedKeys` and
//    filtered out of all future quick-reply rows — prevents repetition
//  ► __scroll_quote  → smooth-scrolls to #quote   and closes the chat
//  ► __scroll_contact → smooth-scrolls to #contact and closes the chat
//  ► Messages fade in with a CSS animation (chatbot-fadein class in globals.css)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Phone, ChevronDown } from "lucide-react";
import {
  OPENING,
  RETURN_MENU,
  STEPS,
  FALLBACK,
  PHONE,
  PHONE_HREF,
  type BotStep,
} from "@/app/data/chatbotData";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number;
  from: "bot" | "user";
  text: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

let _id = 0;
const nextId = () => ++_id;

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function triggerAction(action?: BotStep["action"]) {
  if (action === "scrollToQuote")   scrollToSection("quote");
  if (action === "scrollToContact") scrollToSection("contact");
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function Chatbot() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep]         = useState<BotStep>(OPENING);
  const [typing, setTyping]     = useState(false);

  // Track which FAQ quick-reply keys the user has already clicked.
  // A key is considered a "FAQ" if it contains "_" but does NOT start with "__".
  // Example: "junk_items" ✓   "__menu" ✗   "quote" ✗
  const [usedKeys, setUsedKeys] = useState<Set<string>>(new Set());

  // Has the opening greeting been shown yet?
  const greeted = useRef(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Open/close ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true;
      playStep(OPENING);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ── Play a step ──────────────────────────────────────────────────────────────

  function playStep(botStep: BotStep) {
    setTyping(true);
    setStep(botStep);

    botStep.messages.forEach((text, i) => {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: nextId(), from: "bot", text }]);
        if (i === botStep.messages.length - 1) setTyping(false);
      }, 550 * (i + 1));
    });

    if (botStep.action) {
      setTimeout(() => triggerAction(botStep.action), 700);
    }
  }

  // ── Quick reply handler ───────────────────────────────────────────────────────

  function onQuickReply(key: string, label: string) {
    // ── Special scroll-and-close actions ──────────────────────────────────────
    if (key === "__scroll_quote") {
      scrollToSection("quote");
      setOpen(false);
      return;
    }
    if (key === "__scroll_contact") {
      scrollToSection("contact");
      setOpen(false);
      return;
    }

    // ── Add user bubble ────────────────────────────────────────────────────────
    setMessages(prev => [...prev, { id: nextId(), from: "user", text: label }]);

    // ── Mark FAQ key as used (so it disappears from future quick-reply rows) ──
    // Only mark if it's a sub-step key (contains "_" but not "__")
    if (key.includes("_") && !key.startsWith("__")) {
      setUsedKeys(prev => new Set(prev).add(key));
    }

    // ── Navigate ───────────────────────────────────────────────────────────────
    if (key === "__menu") {
      setTimeout(() => playStep(RETURN_MENU), 400);
      return;
    }

    const next = STEPS[key] ?? FALLBACK;
    setTimeout(() => playStep(next), 400);
  }

  // ── Reset ─────────────────────────────────────────────────────────────────────

  function resetChat() {
    setMessages([]);
    setUsedKeys(new Set());
    setTyping(false);
    setStep(OPENING);
    greeted.current = false;
    setTimeout(() => {
      greeted.current = true;
      playStep(OPENING);
    }, 300);
  }

  // ── Filter already-used FAQ quick replies ─────────────────────────────────────

  const visibleReplies = (step.quickReplies ?? []).filter(
    qr => !usedKeys.has(qr.key)
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── FAB toggle ──────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-[#0f172a] text-white
          shadow-[0_4px_24px_rgba(0,0,0,0.28)]
          flex items-center justify-center
          hover:bg-[#1e293b]
          active:scale-95
          transition-all duration-200
        "
      >
        {open
          ? <X size={20} strokeWidth={2.5} />
          : <MessageCircle size={22} strokeWidth={2} />
        }
      </button>

      {/* ── Chat window ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="
            fixed bottom-24 right-6 z-50
            w-[360px] max-w-[calc(100vw-24px)]
            flex flex-col
            rounded-2xl overflow-hidden
            shadow-[0_12px_48px_rgba(0,0,0,0.22)]
            border border-slate-200/60
            bg-white
            chatbot-fadein
          "
        >
          {/* ── Header ────────────────────────────────────────────────────── */}
          <div className="bg-[#0f172a] px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <MessageCircle size={16} className="text-white/80" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white leading-none">
                  Rainey Removal LLC
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[11px] text-slate-400 leading-none">
                    Typically replies instantly
                  </span>
                </div>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-0.5">
              <a
                href={PHONE_HREF}
                aria-label="Call us"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Phone size={15} />
              </a>
              <button
                onClick={resetChat}
                title="Restart chat"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-base leading-none"
              >
                ↺
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* ── Messages ──────────────────────────────────────────────────── */}
          <div
            className="
              flex-1 overflow-y-auto
              px-4 pt-5 pb-3
              space-y-3
              bg-[#f8fafc]
              min-h-[280px] max-h-[360px]
            "
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex chatbot-fadein ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[82%] px-4 py-2.5
                    text-[13px] leading-relaxed whitespace-pre-line
                    rounded-2xl
                    ${msg.from === "bot"
                      ? "bg-white text-slate-800 shadow-sm border border-slate-100/80 rounded-tl-[4px]"
                      : "bg-[#0f172a] text-white rounded-tr-[4px]"
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start chatbot-fadein">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-[4px] px-4 py-3.5 shadow-sm flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:160ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:320ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Quick replies ──────────────────────────────────────────────── */}
          {!typing && visibleReplies.length > 0 && (
            <div className="px-4 py-3 bg-white border-t border-slate-100 flex flex-wrap gap-2 shrink-0">
              {visibleReplies.map(qr => {
                const isCTA =
                  qr.key === "__scroll_quote" ||
                  qr.key === "__scroll_contact";
                const isBack = qr.key === "__menu";

                return (
                  <button
                    key={qr.key}
                    onClick={() => onQuickReply(qr.key, qr.label)}
                    className={`
                      px-3.5 py-1.5 rounded-full text-[12px] font-medium
                      transition-all duration-150 active:scale-[0.97]
                      ${isCTA
                        ? "bg-[#0f172a] text-white hover:bg-[#1e293b] shadow-sm"
                        : isBack
                          ? "border border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600"
                          : "border border-slate-300 text-slate-700 hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a]"
                      }
                    `}
                  >
                    {qr.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div className="px-5 py-3 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-400 tracking-wide">
              Call us anytime
            </span>
            <a
              href={PHONE_HREF}
              className="text-[12px] font-semibold text-[#0f172a] hover:text-slate-500 transition-colors tracking-wide"
            >
              {PHONE}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
