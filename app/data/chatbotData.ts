// ─────────────────────────────────────────────────────────────────────────────
//  Rainey Removal LLC — Chatbot Flow Data
//  ► To change the phone number: update PHONE and PHONE_HREF below
//  ► To change section scroll targets: update action values ("scrollToQuote" / "scrollToContact")
//    and match the IDs in your page (e.g. id="quote", id="contact")
//  ► FAQ removal: any QuickReply key that contains "_" (e.g. "junk_items") is
//    automatically removed from future options once clicked — handled in Chatbot.tsx
// ─────────────────────────────────────────────────────────────────────────────

// ── 📞 Business info — change here ───────────────────────────────────────────
export const PHONE      = "(201) 050-2253";
export const PHONE_HREF = "tel:2010502253";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface QuickReply {
  label: string;
  key: string;
}

export interface BotStep {
  id: string;
  messages: string[];
  quickReplies?: QuickReply[];
  action?: "scrollToQuote" | "scrollToContact";
}

// ── Main menu (shown ONCE at open) ────────────────────────────────────────────

export const OPENING: BotStep = {
  id: "opening",
  messages: ["Hi! How can I help you today?"],
  quickReplies: [
    { label: "Get a Quote",    key: "quote"    },
    { label: "Junk Removal",   key: "junk"     },
    { label: "Moving",         key: "moving"   },
    { label: "Armed Security", key: "security" },
    { label: "Service Areas",  key: "areas"    },
    { label: "Contact Us",     key: "contact"  },
  ],
};

// ── Return menu (shown after first greeting — no repeated "Hi!") ──────────────

export const RETURN_MENU: BotStep = {
  id: "return_menu",
  messages: ["Is there anything else I can help you with?"],
  quickReplies: [
    { label: "Get a Quote",    key: "quote"    },
    { label: "Junk Removal",   key: "junk"     },
    { label: "Moving",         key: "moving"   },
    { label: "Armed Security", key: "security" },
    { label: "Service Areas",  key: "areas"    },
    { label: "Contact Us",     key: "contact"  },
  ],
};

// ── Step responses ─────────────────────────────────────────────────────────────

export const STEPS: Record<string, BotStep> = {

  // ── 1. Get a Quote ──────────────────────────────────────────────────────────
  // Action scrollToQuote fires automatically. Button "__scroll_quote" closes
  // the chat + scrolls — handled in Chatbot.tsx.
  quote: {
    id: "quote",
    messages: ["Sure — click below and we'll get you a quick estimate."],
    quickReplies: [
      { label: "Get a Quote →", key: "__scroll_quote" },
      { label: "Back to menu",  key: "__menu"         },
    ],
    action: "scrollToQuote",
  },

  // ── 2. Junk Removal ─────────────────────────────────────────────────────────
  junk: {
    id: "junk",
    messages: [
      "We handle all types of junk removal:\n\n• Full junk removal\n• Property cleanouts\n• Furniture & appliance removal\n• Construction debris\n• Yard waste\n• Donation pickups\n• Light demolition",
      `For unusual items, call us at ${PHONE}.`,
    ],
    quickReplies: [
      { label: "What items do you take?",  key: "junk_items"   },
      { label: "Same-day service?",        key: "junk_sameday" },
      { label: "How does pricing work?",   key: "junk_pricing" },
      { label: "Back to menu",             key: "__menu"       },
    ],
  },

  junk_items: {
    id: "junk_items",
    messages: [
      "We take almost everything — furniture, appliances, yard waste, construction debris, and general household junk.",
      `For hazardous materials or unusually large loads, call us at ${PHONE}.`,
    ],
    quickReplies: [
      { label: "Same-day service?",     key: "junk_sameday" },
      { label: "How does pricing work?",key: "junk_pricing" },
      { label: "Back to menu",          key: "__menu"       },
    ],
  },

  junk_sameday: {
    id: "junk_sameday",
    messages: [
      "Yes — same-day service is available based on scheduling.",
      `Call us at ${PHONE} to check today's availability.`,
    ],
    quickReplies: [
      { label: "What items do you take?", key: "junk_items"  },
      { label: "How does pricing work?",  key: "junk_pricing"},
      { label: "Back to menu",            key: "__menu"      },
    ],
  },

  junk_pricing: {
    id: "junk_pricing",
    messages: [
      "Pricing is based on volume, item type, and location.",
      `Use our quote form for an estimate, or call ${PHONE} for a custom quote.`,
    ],
    quickReplies: [
      { label: "Get a Quote →",          key: "__scroll_quote" },
      { label: "What items do you take?",key: "junk_items"     },
      { label: "Back to menu",           key: "__menu"         },
    ],
    action: "scrollToQuote",
  },

  // ── 3. Moving ───────────────────────────────────────────────────────────────
  moving: {
    id: "moving",
    messages: [
      "We offer full moving services:\n\n• Local & long-distance moving\n• Residential & commercial moving\n• Packing & unpacking\n• Furniture assembly\n• Heavy item moving",
      `For large, urgent, or custom jobs, call us at ${PHONE}.`,
    ],
    quickReplies: [
      { label: "Long-distance moving?",   key: "moving_longdistance" },
      { label: "Do you move heavy items?",key: "moving_heavy"        },
      { label: "How does pricing work?",  key: "moving_pricing"      },
      { label: "Back to menu",            key: "__menu"              },
    ],
  },

  moving_longdistance: {
    id: "moving_longdistance",
    messages: [
      "Yes — we offer long-distance moving across the entire USA.",
      `Call us at ${PHONE} to discuss your route, timeline, and get a custom quote.`,
    ],
    quickReplies: [
      { label: "Do you move heavy items?",key: "moving_heavy"  },
      { label: "How does pricing work?",  key: "moving_pricing"},
      { label: "Back to menu",            key: "__menu"        },
    ],
  },

  moving_heavy: {
    id: "moving_heavy",
    messages: [
      "Absolutely — pianos, safes, gym equipment, large appliances. We have the right tools and crew for heavy items.",
      `Call ${PHONE} for specialty or oversized item moves.`,
    ],
    quickReplies: [
      { label: "Long-distance moving?", key: "moving_longdistance"},
      { label: "How does pricing work?",key: "moving_pricing"     },
      { label: "Back to menu",          key: "__menu"             },
    ],
  },

  moving_pricing: {
    id: "moving_pricing",
    messages: [
      "Moving prices depend on distance, volume, and services required.",
      `Get an estimate via our quote form or call ${PHONE} for a custom quote.`,
    ],
    quickReplies: [
      { label: "Get a Quote →", key: "__scroll_quote" },
      { label: "Back to menu",  key: "__menu"         },
    ],
    action: "scrollToQuote",
  },

  // ── 4. Armed Security ───────────────────────────────────────────────────────
  security: {
    id: "security",
    messages: [
      "We provide licensed armed security for:\n\n• Residential properties\n• Commercial properties\n• Events\n• Executive / VIP protection",
      `For detailed or urgent inquiries, please call ${PHONE}.`,
    ],
    quickReplies: [
      { label: "Are you licensed & insured?",   key: "security_licensed" },
      { label: "What security do you provide?", key: "security_types"    },
      { label: "How do I request a quote?",     key: "security_quote"    },
      { label: "Back to menu",                  key: "__menu"            },
    ],
  },

  security_licensed: {
    id: "security_licensed",
    messages: [
      "Yes. All personnel are fully licensed and insured in accordance with New Jersey state requirements.",
    ],
    quickReplies: [
      { label: "What security do you provide?",key: "security_types" },
      { label: "How do I request a quote?",    key: "security_quote" },
      { label: "Back to menu",                 key: "__menu"         },
    ],
  },

  security_types: {
    id: "security_types",
    messages: [
      "We cover residential, commercial, and event security, as well as executive and VIP protection.",
      `Contact us directly at ${PHONE} for specific requirements.`,
    ],
    quickReplies: [
      { label: "Are you licensed & insured?",key: "security_licensed"},
      { label: "How do I request a quote?",  key: "security_quote"  },
      { label: "Back to menu",               key: "__menu"          },
    ],
  },

  security_quote: {
    id: "security_quote",
    messages: [
      `Call us at ${PHONE} or use the Contact Us form and we will follow up promptly.`,
    ],
    quickReplies: [
      { label: "Contact Us →", key: "__scroll_contact" },
      { label: "Back to menu", key: "__menu"           },
    ],
    action: "scrollToContact",
  },

  // ── 5. Service Areas ────────────────────────────────────────────────────────
  areas: {
    id: "areas",
    messages: [
      "We serve all of New Jersey locally, and provide long-distance moving and deliveries across the entire USA.",
      `Call us at ${PHONE} to confirm availability in your area.`,
    ],
    quickReplies: [
      { label: "Get a Quote →", key: "__scroll_quote"  },
      { label: "Contact Us →",  key: "__scroll_contact"},
      { label: "Back to menu",  key: "__menu"          },
    ],
  },

  // ── 6. Contact Us ────────────────────────────────────────────────────────────
  // Action scrollToContact fires automatically.
  contact: {
    id: "contact",
    messages: ["You can reach us here, or call us directly."],
    quickReplies: [
      { label: "Contact Us →", key: "__scroll_contact" },
      { label: "Back to menu", key: "__menu"           },
    ],
    action: "scrollToContact",
  },
};

// ── Fallback ───────────────────────────────────────────────────────────────────

export const FALLBACK: BotStep = {
  id: "fallback",
  messages: [
    `For detailed help, please call us at ${PHONE} or use the Contact Us section on our website.`,
  ],
  quickReplies: [
    { label: "Contact Us →", key: "__scroll_contact" },
    { label: "Back to menu", key: "__menu"           },
  ],
};
