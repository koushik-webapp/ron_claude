/**
 * ═══════════════════════════════════════════════════════════════
 *  Rainey Removal LLC — Premium Chatbot  v5.0
 *  Classic chat layout · Animated · Vanilla JS · No dependencies
 * ═══════════════════════════════════════════════════════════════
 *
 *  QUICK EDIT GUIDE
 *  ─────────────────────────────────────────────────────────────
 *  Phone              →  CONFIG.phone / CONFIG.phoneHref  (~30)
 *  Section IDs        →  CONFIG.quoteId / CONFIG.contactId (~33)
 *  Colors             →  C object                         (~48)
 *  Animation timing   →  ANIM object                      (~70)
 *  Service icons      →  ICONS object                     (~88)
 *  Bot text           →  FLOW.[step].messages             (~160)
 *  Window open anim   →  #cb-window CSS + openChat()
 *  Message slide-up   →  @keyframes cbSlideUp in STYLES
 *  Typing dots        →  showTyping() + @keyframes cbDotBounce
 *  Truck animation    →  showStepAnim() + @keyframes cbFill/cbTruckDrive
 *  Junk animation     →  showJunkAnim() + @keyframes cbJunkFly/cbBinIn
 *  Security animation →  showSecurityAnim() + @keyframes cbShieldIn/cbScanSweep/cbCheckIn
 *  Inline chips       →  showInlineReplies() + .cb-chips-row CSS
 *  Footer actions     →  #cb-footer in buildWidget() + bindEvents()
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────
     CONFIG
  ──────────────────────────────────────────────────────────── */

  var CONFIG = {
    phone:         '(201) 050-2253',
    phoneHref:     'tel:2010502253',
    quoteId:       'quote',
    contactId:     'contact',
    localHeadline: 'We\u2019re local \u2014 all of New Jersey, plus USA-wide.',
    localDetail:   'We regularly serve North Jersey, Jersey City, Hoboken, Newark, and surrounding areas. Same-day service is often available.',
    usaDetail:     'We also coordinate long-distance moves and deliveries across the entire USA.',
  };

  /* ────────────────────────────────────────────────────────────
     COLORS  ← change entire theme here
  ──────────────────────────────────────────────────────────── */

  var C = {
    windowBg:     '#ffffff',
    headerBg:     '#1c1c1e',
    msgBg:        '#f8fafc',
    botBubble:    '#ffffff',
    userBubble:   '#1c1c1e',
    textPrimary:  '#1c1c1e',
    textSecondary:'#6e6e73',
    textMuted:    '#aeaeb2',
    textInverse:  '#ffffff',
    chipBorder:   '#e5e5ea',
    chipBg:       '#ffffff',
    chipHoverBg:  '#f2f2f7',
    ctaBg:        '#1c1c1e',
    ctaHoverBg:   '#3a3a3c',
    accent:       '#34c759',
    windowShadow: '0 32px 96px rgba(0,0,0,0.13), 0 8px 32px rgba(0,0,0,0.06)',
    fabShadow:    '0 4px 28px rgba(0,0,0,0.28)',
  };

  /* ────────────────────────────────────────────────────────────
     ANIMATION TIMING  ← edit all durations here (milliseconds)
  ──────────────────────────────────────────────────────────── */

  var ANIM = {
    openDelay:    200,    /* delay before greeting after window opens        */
    truckTotal:   1350,   /* total truck animation duration                  */
    truckFadeAt:  1080,   /* when truck card starts fading out               */
    truckCssDur:  '1.1s', /* CSS animation-duration for truck elements       */
    mapTotal:     1550,   /* total map animation duration                    */
    mapFadeAt:    1260,   /* when map card starts fading out                 */
    mapCssDur:    '1.3s', /* CSS animation-duration for map elements         */
    junkTotal:    1500,   /* ← Junk animation total duration                 */
    junkFadeAt:   1200,   /* ← when junk card starts fading out              */
    secTotal:     1700,   /* ← Security animation total duration             */
    secFadeAt:    1380,   /* ← when security card starts fading out          */
    chipDelay:    160,    /* gap between anim end and icon chip appear        */
    typingGap:    700,    /* pause between typing indicator and bubble        */
  };

  /* ────────────────────────────────────────────────────────────
     SERVICE ICONS  ← replace SVG paths to swap icons
  ──────────────────────────────────────────────────────────── */

  var ICONS = {
    quote:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
        '<polyline points="14 2 14 8 20 8"/>' +
        '<line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' +
        '<polyline points="10 9 9 9 8 9"/>' +
      '</svg>',
    junk:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="3 6 5 6 21 6"/>' +
        '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>' +
      '</svg>',
    moving:
      '<svg width="17" height="13" viewBox="0 0 24 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="1" y="2" width="14" height="11" rx="1.5"/>' +
        '<polygon points="15 6 20 6 23 10 23 13 15 13 15 6"/>' +
        '<circle cx="5.5" cy="15.5" r="2.5"/><circle cx="18.5" cy="15.5" r="2.5"/>' +
      '</svg>',
    security:
      '<svg width="14" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' +
      '</svg>',
    areas:
      '<svg width="13" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>' +
        '<circle cx="12" cy="10" r="3"/>' +
      '</svg>',
    contact:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>' +
      '</svg>',
  };

  /* ── Truck SVG used inside route animations ─────────────────── */
  var TRUCK_SVG =
    '<svg width="22" height="14" viewBox="0 0 26 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="1" y="1" width="15" height="11" rx="1.5"/>' +
      '<polygon points="16 4 22 4 25 9 25 12 16 12 16 4"/>' +
      '<circle cx="5.5" cy="15" r="2.5"/><circle cx="20" cy="15" r="2.5"/>' +
    '</svg>';

  /* ── Map pin SVG used inside map animation ──────────────────── */
  var PIN_SVG =
    '<svg width="11" height="15" viewBox="0 0 12 18" fill="currentColor">' +
      '<path d="M6 0C2.7 0 0 2.7 0 6c0 4.5 6 12 6 12s6-7.5 6-12c0-3.3-2.7-6-6-6zm0 8.5C4.6 8.5 3.5 7.4 3.5 6S4.6 3.5 6 3.5 8.5 4.6 8.5 6 7.4 8.5 6 8.5z"/>' +
    '</svg>';

  /* ────────────────────────────────────────────────────────────
     FLOW DATA
     ─────────────────────────────────────────────────────────
     anim → 'truck' | 'map' | 'junk' | 'security'
     iconKey → key in ICONS (chip shown after anim)
  ──────────────────────────────────────────────────────────── */

  function mainMenu() {
    return [
      { label: 'Get a Quote',    key: 'quote',    menu: true },
      { label: 'Junk Removal',   key: 'junk',     menu: true },
      { label: 'Moving',         key: 'moving',   menu: true },
      { label: 'Armed Security', key: 'security', menu: true },
      { label: 'Service Areas',  key: 'areas',    menu: true },
      { label: 'Contact Us',     key: 'contact',  menu: true },
    ];
  }

  var FLOW = {

    opening: {
      id: 'opening',
      messages: ['Hi! How can I help you today?'],
      replies: mainMenu(),
    },

    return: {
      id: 'return',
      messages: ['Anything else I can help with today?'],
      replies: mainMenu(),
    },

    /* ── Get a Quote ── truck animation ──────────────────────── */
    quote: {
      id: 'quote',
      anim:      'truck',
      animLabel: 'Preparing your estimate\u2026',
      iconKey:   'quote',
      iconLabel: 'Get a Quote',
      messages:  ['Let\u2019s get your estimate \u2014 tap below.'],
      replies: [
        { label: 'Get a Quote \u2192', key: '__scroll_quote', cta: true  },
        { label: 'Back to menu',       key: '__menu',         back: true },
      ],
    },

    /* ── Junk Removal ── junk animation ← ANIM.junkTotal ─────── */
    junk: {
      id: 'junk',
      anim:      'junk',
      animLabel: 'Clearing the load\u2026',
      iconKey:   'junk',
      iconLabel: 'Junk Removal',
      messages: [
        'Here\u2019s what we can remove for you.',
        'We handle:\n\u2022 Full junk removal\n\u2022 Property cleanouts\n\u2022 Furniture \u0026 appliance removal\n\u2022 Construction debris\n\u2022 Yard waste\n\u2022 Donation pickups\n\u2022 Light demolition',
        'For unusual items, call us at ' + CONFIG.phone + '.',
      ],
      replies: [
        { label: 'What items do you take?', key: 'junk_items',   faq: true  },
        { label: 'Same-day service?',       key: 'junk_sameday', faq: true  },
        { label: 'How does pricing work?',  key: 'junk_pricing', faq: true  },
        { label: 'Back to menu',            key: '__menu',       back: true },
      ],
    },

    junk_items: {
      id: 'junk_items',
      messages: [
        'We take almost everything \u2014 furniture, appliances, yard waste, construction debris, and general household junk.',
        'For hazardous materials or very large loads, call us at ' + CONFIG.phone + '.',
      ],
      replies: [
        { label: 'Same-day service?',     key: 'junk_sameday', faq: true  },
        { label: 'How does pricing work?',key: 'junk_pricing', faq: true  },
        { label: 'Back to menu',          key: '__menu',       back: true },
      ],
    },

    junk_sameday: {
      id: 'junk_sameday',
      messages: [
        'Yes \u2014 same-day service is available based on scheduling.',
        'Call us at ' + CONFIG.phone + ' to check today\u2019s availability.',
      ],
      replies: [
        { label: 'What items do you take?', key: 'junk_items',   faq: true  },
        { label: 'How does pricing work?',  key: 'junk_pricing', faq: true  },
        { label: 'Back to menu',            key: '__menu',       back: true },
      ],
    },

    junk_pricing: {
      id: 'junk_pricing',
      messages: [
        'Pricing is based on volume, item type, and location.',
        'Use our quote form for an estimate, or call ' + CONFIG.phone + ' for a custom quote.',
      ],
      replies: [
        { label: 'Get a Quote \u2192',      key: '__scroll_quote', cta: true  },
        { label: 'What items do you take?', key: 'junk_items',     faq: true  },
        { label: 'Back to menu',            key: '__menu',         back: true },
      ],
    },

    /* ── Moving ── truck animation ───────────────────────────── */
    moving: {
      id: 'moving',
      anim:      'truck',
      animLabel: 'On the way\u2026',
      iconKey:   'moving',
      iconLabel: 'Moving',
      messages: [
        'Got it \u2014 here\u2019s how we can help with your move.',
        'We offer:\n\u2022 Local \u0026 long-distance moving\n\u2022 Residential \u0026 commercial\n\u2022 Packing \u0026 unpacking\n\u2022 Furniture assembly\n\u2022 Heavy item moving',
        'For large or custom jobs, call us at ' + CONFIG.phone + '.',
      ],
      replies: [
        { label: 'Long-distance moving?',    key: 'moving_longdistance', faq: true  },
        { label: 'Do you move heavy items?', key: 'moving_heavy',        faq: true  },
        { label: 'How does pricing work?',   key: 'moving_pricing',      faq: true  },
        { label: 'Back to menu',             key: '__menu',              back: true },
      ],
    },

    moving_longdistance: {
      id: 'moving_longdistance',
      messages: [
        'Yes \u2014 we offer long-distance moving across the entire USA.',
        'Call us at ' + CONFIG.phone + ' to discuss your route and timeline.',
      ],
      replies: [
        { label: 'Do you move heavy items?', key: 'moving_heavy',   faq: true  },
        { label: 'How does pricing work?',   key: 'moving_pricing', faq: true  },
        { label: 'Back to menu',             key: '__menu',         back: true },
      ],
    },

    moving_heavy: {
      id: 'moving_heavy',
      messages: [
        'Absolutely \u2014 pianos, safes, gym equipment, large appliances. We have the right tools and team.',
        'Call ' + CONFIG.phone + ' for specialty moves.',
      ],
      replies: [
        { label: 'Long-distance moving?', key: 'moving_longdistance', faq: true  },
        { label: 'How does pricing work?',key: 'moving_pricing',      faq: true  },
        { label: 'Back to menu',          key: '__menu',              back: true },
      ],
    },

    moving_pricing: {
      id: 'moving_pricing',
      messages: [
        'Moving prices depend on distance, volume, and services required.',
        'Get an estimate via our quote form or call ' + CONFIG.phone + '.',
      ],
      replies: [
        { label: 'Get a Quote \u2192', key: '__scroll_quote', cta: true  },
        { label: 'Back to menu',       key: '__menu',         back: true },
      ],
    },

    /* ── Armed Security ── security animation ← ANIM.secTotal ── */
    security: {
      id: 'security',
      anim:      'security',
      animLabel: 'Verifying credentials\u2026',
      iconKey:   'security',
      iconLabel: 'Armed Security',
      messages: [
        'Here\u2019s an overview of our security services.',
        'We provide licensed armed security for:\n\u2022 Residential properties\n\u2022 Commercial properties\n\u2022 Events\n\u2022 Executive \u0026 VIP protection',
        'For detailed inquiries, please call ' + CONFIG.phone + '.',
      ],
      replies: [
        { label: 'Are you licensed \u0026 insured?',   key: 'security_licensed', faq: true  },
        { label: 'What security do you provide?', key: 'security_types',    faq: true  },
        { label: 'How do I request a quote?',     key: 'security_quote',    faq: true  },
        { label: 'Back to menu',                  key: '__menu',            back: true },
      ],
    },

    security_licensed: {
      id: 'security_licensed',
      messages: ['Yes. All personnel are fully licensed and insured under New Jersey state requirements.'],
      replies: [
        { label: 'What security do you provide?',key: 'security_types', faq: true  },
        { label: 'How do I request a quote?',    key: 'security_quote', faq: true  },
        { label: 'Back to menu',                 key: '__menu',         back: true },
      ],
    },

    security_types: {
      id: 'security_types',
      messages: [
        'We cover residential, commercial, and event security, plus executive and VIP protection.',
        'Contact us at ' + CONFIG.phone + ' for specific requirements.',
      ],
      replies: [
        { label: 'Are you licensed \u0026 insured?',key: 'security_licensed', faq: true  },
        { label: 'How do I request a quote?',  key: 'security_quote',    faq: true  },
        { label: 'Back to menu',               key: '__menu',            back: true },
      ],
    },

    security_quote: {
      id: 'security_quote',
      messages: ['Call us at ' + CONFIG.phone + ', or use our Contact form and we\u2019ll follow up promptly.'],
      replies: [
        { label: 'Contact Us \u2192', key: '__scroll_contact', cta: true  },
        { label: 'Back to menu',      key: '__menu',           back: true },
      ],
    },

    /* ── Service Areas ── map animation ──────────────────────── */
    areas: {
      id: 'areas',
      anim:      'map',
      animLabel: 'Checking your area\u2026',
      iconKey:   'areas',
      iconLabel: 'Service Areas',
      messages: [
        CONFIG.localHeadline,
        CONFIG.localDetail,
        CONFIG.usaDetail,
      ],
      replies: [
        { label: 'Get a Quote \u2192', key: '__scroll_quote',   cta: true  },
        { label: 'Contact Us \u2192',  key: '__scroll_contact', cta: true  },
        { label: 'Back to menu',       key: '__menu',           back: true },
      ],
    },

    /* ── Contact Us ─────────────────────────────────────────── */
    contact: {
      id: 'contact',
      iconKey:   'contact',
      iconLabel: 'Contact Us',
      messages: ['You can reach us below, or call us directly.'],
      replies: [
        { label: 'Contact Us \u2192', key: '__scroll_contact', cta: true  },
        { label: 'Back to menu',      key: '__menu',           back: true },
      ],
    },
  };

  var FALLBACK = {
    id: 'fallback',
    messages: ['For help, call us at ' + CONFIG.phone + ' or visit the Contact Us section.'],
    replies: [
      { label: 'Contact Us \u2192', key: '__scroll_contact', cta: true  },
      { label: 'Back to menu',      key: '__menu',           back: true },
    ],
  };

  /* ────────────────────────────────────────────────────────────
     STYLES
     ─────────────────────────────────────────────────────────
     KEY LAYOUT CHANGE from v4:
     ► #cb-replies fixed panel REMOVED — no more bottom button grid
     ► Quick reply chips now live INSIDE #cb-messages as .cb-chips-row
     ► Classic chat: bot bubbles left, user bubbles right
     ► Chips appear inline below latest bot message, disappear on click
  ──────────────────────────────────────────────────────────── */

  var STYLES =

    /* ── Reset ──────────────────────────────────────────────── */
    '#cb-widget,#cb-widget *{box-sizing:border-box;margin:0;padding:0;' +
    "font-family:-apple-system,'SF Pro Display',BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
    '-webkit-font-smoothing:antialiased}' +

    /* ── FAB ─────────────────────────────────────────────────── */
    '#cb-fab{position:fixed;bottom:28px;right:28px;z-index:9999;width:58px;height:58px;' +
    'border-radius:50%;background:' + C.ctaBg + ';color:' + C.textInverse + ';border:none;cursor:pointer;' +
    'display:flex;align-items:center;justify-content:center;box-shadow:' + C.fabShadow + ';' +
    'transition:background 0.2s,transform 0.18s,box-shadow 0.2s;outline:none}' +
    '#cb-fab:hover{background:' + C.ctaHoverBg + ';transform:translateY(-2px);box-shadow:0 8px 36px rgba(0,0,0,0.36)}' +
    '#cb-fab:active{transform:scale(0.94)}' +
    '#cb-fab svg{pointer-events:none}' +
    '#cb-icon-close{display:none}' +

    /* ── Chat window ← open/close animation ─────────────────── */
    '#cb-window{position:fixed;bottom:100px;right:28px;z-index:9998;' +
    'width:400px;max-width:calc(100vw - 32px);display:flex;flex-direction:column;' +
    'border-radius:26px;overflow:hidden;background:' + C.windowBg + ';' +
    'box-shadow:' + C.windowShadow + ';border:1px solid rgba(0,0,0,0.06);' +
    'transform-origin:bottom right;' +
    'transform:scale(0.94) translateY(14px);opacity:0;pointer-events:none;' +
    'transition:transform 0.28s cubic-bezier(0.32,0.72,0,1),opacity 0.2s ease}' +
    '#cb-window.cb-open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}' +

    /* ── Header ─────────────────────────────────────────────── */
    '#cb-header{background:' + C.headerBg + ';padding:20px 20px 18px;' +
    'display:flex;align-items:center;justify-content:space-between;flex-shrink:0;gap:16px}' +
    '#cb-header-left{display:flex;align-items:center;gap:12px;min-width:0}' +
    '#cb-avatar{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.08);' +
    'border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
    '#cb-name{font-size:14px;font-weight:600;color:' + C.textInverse + ';letter-spacing:-0.01em;line-height:1}' +
    '#cb-status{display:flex;align-items:center;gap:6px;margin-top:4px}' +
    '#cb-dot{width:6px;height:6px;border-radius:50%;background:' + C.accent + ';flex-shrink:0;animation:cbPulse 2.6s infinite}' +
    '#cb-status-text{font-size:11.5px;color:rgba(174,174,178,0.9);line-height:1;font-weight:400}' +
    '#cb-header-right{display:flex;align-items:center;gap:2px;flex-shrink:0}' +
    '#cb-header-right button,#cb-header-right a{width:32px;height:32px;border-radius:9px;' +
    'background:transparent;border:none;color:rgba(174,174,178,0.9);cursor:pointer;' +
    'display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:15px;' +
    'transition:background 0.15s,color 0.15s;outline:none}' +
    '#cb-header-right button:hover,#cb-header-right a:hover{background:rgba(255,255,255,0.1);color:' + C.textInverse + '}' +

    /* ════════════════════════════════════════════════════════
       CLASSIC CHAT MESSAGE AREA
       ← Bot bubbles on the LEFT, user bubbles on the RIGHT
       ← Quick reply chips appear INLINE here as .cb-chips-row
       ← No fixed button panel below — this is the only scroll area
       ════════════════════════════════════════════════════════ */
    /* ← gap:14px = spacing between all message bubbles/chips (was 10px)
       ← padding-top 28px gives more breathing room at the top       */
    '#cb-messages{flex:1;overflow-y:auto;padding:28px 18px 22px;display:flex;flex-direction:column;' +
    'gap:14px;background:' + C.msgBg + ';min-height:320px;max-height:430px;scroll-behavior:smooth}' +
    '#cb-messages::-webkit-scrollbar{width:0}' +

    /* Message rows ← slide-up entry animation */
    '.cb-msg{display:flex;animation:cbSlideUp 0.24s ease forwards;opacity:0}' +
    '.cb-bot{justify-content:flex-start}.cb-user{justify-content:flex-end}' +

    /* Bot bubble — roomy white card, left tail
       ← padding: 16px vertical / 26px horizontal  (wider than before)
       ← max-width raised to 90% for more text room */
    '.cb-bot .cb-bubble{background:' + C.botBubble + ';color:' + C.textPrimary + ';' +
    'border-radius:20px 20px 20px 5px;padding:16px 26px;' +
    'font-size:14px;line-height:1.72;white-space:pre-line;word-wrap:break-word;max-width:90%;' +
    'box-shadow:0 1px 6px rgba(0,0,0,0.07);border:1px solid rgba(0,0,0,0.05)}' +

    /* User bubble — dark, right tail
       ← padding: 14px vertical / 26px horizontal  (wider than before)
       ← max-width raised to 84% */
    '.cb-user .cb-bubble{background:' + C.userBubble + ';color:' + C.textInverse + ';' +
    'border-radius:20px 20px 5px 20px;padding:14px 26px;font-size:14px;line-height:1.6;max-width:84%}' +

    /* Typing dots ← @keyframes cbDotBounce */
    '.cb-typing-dots{display:flex !important;align-items:center;gap:5px;padding:13px 17px !important}' +
    '.cb-typing-dots span{width:7px;height:7px;border-radius:50%;background:' + C.textMuted + ';' +
    'display:block;animation:cbDotBounce 1.1s infinite ease-in-out}' +
    '.cb-typing-dots span:nth-child(2){animation-delay:0.18s}' +
    '.cb-typing-dots span:nth-child(3){animation-delay:0.36s}' +

    /* Service icon chip ← shown before first message of each service step */
    '.cb-chip-wrap{display:flex;animation:cbSlideUp 0.22s ease forwards;opacity:0}' +
    '.cb-chip{display:inline-flex;align-items:center;gap:7px;' +
    'border:1.5px solid ' + C.chipBorder + ';border-radius:999px;' +
    'padding:5px 13px 5px 10px;background:transparent}' +
    '.cb-chip-icon{color:' + C.textSecondary + ';display:flex;align-items:center}' +
    '.cb-chip-label{font-size:11.5px;font-weight:500;color:' + C.textSecondary + ';letter-spacing:0.01em}' +

    /* ════════════════════════════════════════════════════════
       INLINE QUICK REPLY CHIPS
       ← Replaces the old fixed #cb-replies panel entirely
       ← Chips live inside #cb-messages as .cb-chips-row div
       ← showInlineReplies() creates them after last bot message
       ← removeInlineReplies() cleans them up on reply click
       ← To change chip colors: edit .cb-chip-btn vars below
       ════════════════════════════════════════════════════════ */
    '.cb-chips-row{display:flex;flex-wrap:wrap;gap:8px;padding:4px 0 2px;' +
    'animation:cbSlideUp 0.22s ease forwards;opacity:0}' +

    /* Default chip */
    '.cb-chip-btn{padding:8px 15px;border-radius:999px;font-size:13px;font-weight:500;line-height:1;' +
    'cursor:pointer;outline:none;border:1.5px solid ' + C.chipBorder + ';' +
    'background:' + C.chipBg + ';color:' + C.textPrimary + ';white-space:nowrap;' +
    'transition:background 0.14s,color 0.14s,border-color 0.14s,transform 0.12s,box-shadow 0.14s}' +
    '.cb-chip-btn:hover{background:' + C.chipHoverBg + ';border-color:#d1d1d6;transform:translateY(-1px)}' +
    '.cb-chip-btn:active{transform:scale(0.97)}' +

    /* CTA chip ← dark filled */
    '.cb-chip-btn-cta{background:' + C.ctaBg + ';color:' + C.textInverse + ';' +
    'border-color:' + C.ctaBg + ';box-shadow:0 2px 8px rgba(0,0,0,0.16)}' +
    '.cb-chip-btn-cta:hover{background:' + C.ctaHoverBg + ';border-color:' + C.ctaHoverBg + ';' +
    'box-shadow:0 4px 14px rgba(0,0,0,0.22)}' +

    /* Back chip ← minimal, muted */
    '.cb-chip-btn-back{background:transparent;border-color:transparent;font-size:12px;' +
    'font-weight:400;color:' + C.textMuted + ';padding:8px 10px;box-shadow:none}' +
    '.cb-chip-btn-back:hover{background:rgba(0,0,0,0.04);color:' + C.textSecondary + ';transform:none}' +

    /* ════════════════════════════════════════════════════════
       TRUCK / MAP ROUTE ANIMATION CARD
       ← Identical to v4 — appears as bot-aligned card
       ← .cb-anim-out triggers CSS fade before DOM removal
       ════════════════════════════════════════════════════════ */
    '.cb-anim{display:flex;justify-content:flex-start;' +
    'animation:cbSlideUp 0.22s ease forwards;opacity:0;' +
    'transition:opacity 0.28s ease,transform 0.28s ease}' +
    '.cb-anim.cb-anim-out{opacity:0 !important;transform:translateY(-5px)}' +

    '.cb-anim-card{background:' + C.botBubble + ';border-radius:18px 18px 18px 4px;' +
    'padding:16px 20px 12px;min-width:210px;max-width:260px;' +
    'box-shadow:0 1px 6px rgba(0,0,0,0.07);border:1px solid rgba(0,0,0,0.05)}' +

    '.cb-track{display:flex;align-items:center;gap:7px;padding-top:16px;position:relative}' +
    '.cb-rail{flex:1;position:relative;height:20px;display:flex;align-items:center}' +
    '.cb-rail::after{content:"";position:absolute;left:0;right:0;top:50%;' +
    'transform:translateY(-50%);height:1.5px;background:#e5e5ea;border-radius:1px}' +
    '.cb-rail-fill{position:absolute;left:0;top:50%;transform:translateY(-50%);' +
    'height:1.5px;background:' + C.ctaBg + ';width:0;border-radius:1px;z-index:1}' +
    '.cb-anim-truck .cb-rail-fill{animation:cbFill ' + ANIM.truckCssDur + ' ease-in-out forwards}' +
    '.cb-anim-map   .cb-rail-fill{animation:cbFill ' + ANIM.mapCssDur   + ' ease-in-out forwards}' +
    '.cb-truck-mover{position:absolute;top:50%;left:0;transform:translateY(-155%);z-index:2;color:' + C.ctaBg + '}' +
    '.cb-anim-truck .cb-truck-mover{animation:cbTruckDrive ' + ANIM.truckCssDur + ' ease-in-out forwards}' +
    '.cb-anim-map   .cb-truck-mover{animation:cbTruckDrive ' + ANIM.mapCssDur   + ' ease-in-out forwards}' +
    '.cb-dot-s,.cb-dot-e{width:7px;height:7px;border-radius:50%;background:' + C.ctaBg + ';flex-shrink:0;z-index:1}' +
    '.cb-dot-s{opacity:0.3}.cb-dot-e{opacity:1}' +
    '.cb-pin{flex-shrink:0;display:flex;align-items:center;color:' + C.ctaBg + '}' +
    '.cb-pin-s{opacity:0.35}.cb-pin-e{opacity:1}' +
    '.cb-anim-label{margin-top:10px;font-size:11px;font-weight:400;color:' + C.textMuted + ';letter-spacing:0.04em}' +

    /* ════════════════════════════════════════════════════════
       JUNK REMOVAL ANIMATION
       ← showJunkAnim() builds the DOM; CSS drives it entirely
       ← Items (.cb-junk-item-1/2/3) slide right → shrink → fade
         into the bin using staggered animation-delay
       ← Bin (.cb-junk-bin) fades in first via cbBinIn
       ← To change item timing: edit animation delays below
       ← To change total duration: edit ANIM.junkTotal/junkFadeAt
       ════════════════════════════════════════════════════════ */
    '.cb-junk-scene{display:flex;align-items:flex-end;justify-content:center;' +
    'gap:14px;padding:14px 8px 6px;min-width:190px}' +
    '.cb-junk-items-group{display:flex;gap:8px;align-items:flex-end}' +
    '.cb-junk-item{color:#aeaeb2;flex-shrink:0;opacity:1}' +
    /* ← stagger: item1 goes first, item3 last */
    '.cb-junk-item-1{animation:cbJunkFly 0.72s ease-in 0.06s forwards}' +
    '.cb-junk-item-2{animation:cbJunkFly 0.72s ease-in 0.30s forwards}' +
    '.cb-junk-item-3{animation:cbJunkFly 0.72s ease-in 0.54s forwards}' +
    /* ← bin appears first so items have something to fly into */
    '.cb-junk-bin{color:' + C.textPrimary + ';flex-shrink:0;opacity:0;' +
    'animation:cbBinIn 0.38s ease 0s forwards}' +

    /* ════════════════════════════════════════════════════════
       ARMED SECURITY ANIMATION
       ← showSecurityAnim() builds the DOM; CSS drives it
       ← Shield (.cb-shield-wrap) scales in via cbShieldIn
       ← Scan line (.cb-scan-line) sweeps top→bottom via cbScanSweep
       ← Check mark (.cb-sec-check) appears last via cbCheckIn
       ← To change timing: edit animation delays + ANIM.sec*
       ════════════════════════════════════════════════════════ */
    '.cb-sec-scene{display:flex;align-items:center;justify-content:center;' +
    'padding:14px 8px 6px}' +
    '.cb-shield-wrap{position:relative;width:48px;height:56px;' +
    'animation:cbShieldIn 0.48s cubic-bezier(0.34,1.56,0.64,1) forwards;opacity:0}' +
    '.cb-shield-wrap>svg{display:block;color:' + C.textPrimary + '}' +
    /* ← scan line: thin horizontal bar sweeping down the shield */
    '.cb-scan-line{position:absolute;left:22%;right:22%;height:1px;top:18%;' +
    'background:linear-gradient(90deg,transparent,rgba(28,28,30,0.32),transparent);' +
    'opacity:0;animation:cbScanSweep 0.62s ease-in-out 0.52s forwards}' +
    /* ← check mark centered inside shield */
    '.cb-sec-check{position:absolute;top:50%;left:50%;' +
    'transform:translate(-50%,-46%);opacity:0;color:' + C.textPrimary + ';' +
    'animation:cbCheckIn 0.28s ease 1.08s forwards}' +

    /* ── Footer ← simplified: Call Now + Get a Quote only ───── */
    '#cb-footer{padding:12px 20px 14px;background:' + C.windowBg + ';' +
    'border-top:1px solid rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:center;' +
    'flex-shrink:0;gap:18px}' +
    '#cb-footer-call{font-size:12.5px;font-weight:500;color:' + C.textSecondary + ';' +
    'text-decoration:none;display:flex;align-items:center;gap:5px;transition:color 0.15s}' +
    '#cb-footer-call:hover{color:' + C.textPrimary + '}' +
    '#cb-footer-sep{width:1px;height:12px;background:rgba(0,0,0,0.1)}' +
    '#cb-footer-quote{font-size:12.5px;font-weight:500;color:' + C.ctaBg + ';' +
    'text-decoration:none;cursor:pointer;background:none;border:none;' +
    'transition:color 0.15s;padding:0;outline:none}' +
    '#cb-footer-quote:hover{color:' + C.ctaHoverBg + '}' +

    /* ── Mobile ─────────────────────────────────────────────── */
    '@media(max-width:480px){' +
    '#cb-window{bottom:88px;right:16px;width:calc(100vw - 32px);border-radius:20px}' +
    '#cb-fab{bottom:20px;right:20px;width:54px;height:54px}}' +

    /* ════════════════════════════════════════════════════════
       KEYFRAMES
       ════════════════════════════════════════════════════════ */

    /* Message + chip slide-up entry */
    '@keyframes cbSlideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}' +

    /* Typing dots */
    '@keyframes cbDotBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}' +

    /* Online dot pulse */
    '@keyframes cbPulse{0%,100%{opacity:1}50%{opacity:0.4}}' +

    /* Truck: progress fill + truck drive */
    '@keyframes cbFill{from{width:0}to{width:100%}}' +
    '@keyframes cbTruckDrive{from{left:0}to{left:calc(100% - 24px)}}' +

    /* ── Junk animation keyframes ── */
    /* Items fly toward the bin, shrink, and vanish */
    '@keyframes cbJunkFly{' +
    '0%{opacity:1;transform:translateX(0) scale(1)}' +
    '55%{opacity:0.45;transform:translateX(20px) scale(0.65)}' +
    '100%{opacity:0;transform:translateX(34px) scale(0.2)}}' +
    /* Bin fades in */
    '@keyframes cbBinIn{from{opacity:0}to{opacity:1}}' +

    /* ── Security animation keyframes ── */
    /* Shield scales in with slight overshoot */
    '@keyframes cbShieldIn{' +
    'from{opacity:0;transform:scale(0.8)}' +
    'to{opacity:1;transform:scale(1)}}' +
    /* Scan line sweeps from top to bottom of shield */
    '@keyframes cbScanSweep{' +
    '0%{top:18%;opacity:0.85}' +
    '100%{top:76%;opacity:0}}' +
    /* Check mark appears inside shield */
    '@keyframes cbCheckIn{' +
    'from{opacity:0;transform:translate(-50%,-46%) scale(0.5)}' +
    'to{opacity:0.8;transform:translate(-50%,-46%) scale(1)}}' +

  '';

  /* ────────────────────────────────────────────────────────────
     STATE
  ──────────────────────────────────────────────────────────── */

  var state = {
    open:        false,
    greeted:     false,
    currentStep: null,
    usedKeys:    {},
  };

  var el = {};

  /* ────────────────────────────────────────────────────────────
     INIT
  ──────────────────────────────────────────────────────────── */

  function init() {
    injectStyles();
    buildWidget();
    bindEvents();
  }

  function injectStyles() {
    var tag = document.createElement('style');
    tag.id = 'cb-stylesheet';
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }

  function buildWidget() {
    var root = document.createElement('div');
    root.id = 'cb-widget';

    root.innerHTML =
      '<button id="cb-fab" aria-label="Toggle chat">' +
        '<svg id="cb-icon-chat" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
        '</svg>' +
        '<svg id="cb-icon-close" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
      '</button>' +

      '<div id="cb-window" role="dialog" aria-label="Chat with Rainey Removal">' +

        /* Header */
        '<div id="cb-header">' +
          '<div id="cb-header-left">' +
            '<div id="cb-avatar">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
              '</svg>' +
            '</div>' +
            '<div>' +
              '<p id="cb-name">Rainey Removal LLC</p>' +
              '<div id="cb-status"><span id="cb-dot"></span><span id="cb-status-text">Online</span></div>' +
            '</div>' +
          '</div>' +
          '<div id="cb-header-right">' +
            '<a href="' + CONFIG.phoneHref + '" aria-label="Call us" title="Call us">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>' +
              '</svg>' +
            '</a>' +
            '<button id="cb-restart" title="Restart">\u21BA</button>' +
            '<button id="cb-close" title="Close">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                '<polyline points="18 15 12 21 6 15"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</div>' +

        /* Messages — chips live inside here, no separate reply panel */
        '<div id="cb-messages" role="log" aria-live="polite"></div>' +

        /* Footer — Call Now + Get a Quote only */
        '<div id="cb-footer">' +
          '<a id="cb-footer-call" href="' + CONFIG.phoneHref + '">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>' +
            '</svg>' +
            CONFIG.phone +
          '</a>' +
          '<div id="cb-footer-sep"></div>' +
          '<button id="cb-footer-quote">Get a Quote</button>' +
        '</div>' +

      '</div>';

    document.body.appendChild(root);

    el = {
      fab:         document.getElementById('cb-fab'),
      window:      document.getElementById('cb-window'),
      iconChat:    document.getElementById('cb-icon-chat'),
      iconClose:   document.getElementById('cb-icon-close'),
      messages:    document.getElementById('cb-messages'),
      restart:     document.getElementById('cb-restart'),
      close:       document.getElementById('cb-close'),
      footerQuote: document.getElementById('cb-footer-quote'),
    };
  }

  function bindEvents() {
    el.fab.addEventListener('click', toggleChat);
    el.close.addEventListener('click', closeChat);
    el.restart.addEventListener('click', restartChat);
    /* Footer "Get a Quote" → open premium quote modal */
    el.footerQuote.addEventListener('click', function () {
      closeChat();
      setTimeout(function () {
        if (typeof window.openQuoteModal === 'function') window.openQuoteModal();
      }, 320);
    });
  }

  /* ────────────────────────────────────────────────────────────
     OPEN / CLOSE
     ← Window animation is CSS-only (see #cb-window transition)
     ← openDelay lets window finish opening before first message
  ──────────────────────────────────────────────────────────── */

  function toggleChat() { state.open ? closeChat() : openChat(); }

  function openChat() {
    state.open = true;
    el.window.classList.add('cb-open');
    el.iconChat.style.display  = 'none';
    el.iconClose.style.display = 'block';
    if (!state.greeted) {
      state.greeted = true;
      setTimeout(function () { playStep(FLOW.opening); }, ANIM.openDelay);
    }
  }

  function closeChat() {
    state.open = false;
    el.window.classList.remove('cb-open');
    el.iconChat.style.display  = 'block';
    el.iconClose.style.display = 'none';
  }

  function restartChat() {
    state.greeted  = false;
    state.usedKeys = {};
    el.messages.innerHTML = ''; /* clears bubbles + inline chips (all inside messages) */
    removeTyping();
    removeStepAnim();
    setTimeout(function () {
      state.greeted = true;
      playStep(FLOW.opening);
    }, 180);
  }

  /* ────────────────────────────────────────────────────────────
     STEP PLAYBACK
     ← Plays optional animation, then optional icon chip,
       then types each message, then injects inline chips.
  ──────────────────────────────────────────────────────────── */

  function playStep(step) {
    state.currentStep = step;
    removeInlineReplies(); /* clear any existing chip row */

    var msgs  = step.messages || [];
    var delay = 0;

    /* ── 1. Service animation ─────────────────────────────────
       truck/map → showStepAnim()
       junk      → showJunkAnim()   ← ANIM.junkTotal/junkFadeAt
       security  → showSecurityAnim() ← ANIM.secTotal/secFadeAt  */
    if (step.anim) {
      var totalDur, fadeAt;
      if      (step.anim === 'truck')    { totalDur = ANIM.truckTotal; fadeAt = ANIM.truckFadeAt; }
      else if (step.anim === 'map')      { totalDur = ANIM.mapTotal;   fadeAt = ANIM.mapFadeAt;   }
      else if (step.anim === 'junk')     { totalDur = ANIM.junkTotal;  fadeAt = ANIM.junkFadeAt;  }
      else if (step.anim === 'security') { totalDur = ANIM.secTotal;   fadeAt = ANIM.secFadeAt;   }

      if (step.anim === 'truck' || step.anim === 'map') {
        showStepAnim(step.anim, step.animLabel || '');
      } else if (step.anim === 'junk') {
        showJunkAnim(step.animLabel || '');
      } else if (step.anim === 'security') {
        showSecurityAnim(step.animLabel || '');
      }

      setTimeout(function () {
        var a = document.getElementById('cb-step-anim');
        if (a) a.classList.add('cb-anim-out');
      }, fadeAt);
      setTimeout(removeStepAnim, totalDur);
      delay += totalDur + 80;
    }

    /* ── 2. Service icon chip ─────────────────────────────────
       ← small outline pill shown after animation             */
    if (step.iconKey && ICONS[step.iconKey]) {
      setTimeout(function () {
        addIconChip(ICONS[step.iconKey], step.iconLabel || '');
      }, delay);
      delay += ANIM.chipDelay;
    }

    /* ── 3. Message bubbles (typing indicator before each) ─── */
    msgs.forEach(function (text, i) {
      var isLast = (i === msgs.length - 1);
      setTimeout(function () { removeTyping(); showTyping(); }, delay);
      delay += ANIM.typingGap;
      setTimeout(function () {
        removeTyping();
        addBotBubble(text);
        if (isLast) {
          setTimeout(function () { showInlineReplies(step); }, 220);
        }
      }, delay);
      delay += 140;
    });
  }

  /* ────────────────────────────────────────────────────────────
     TRUCK / MAP ROUTE ANIMATION
     ← Same as v4 — card injected into #cb-messages
  ──────────────────────────────────────────────────────────── */

  function showStepAnim(type, label) {
    var isMap = (type === 'map');
    var trackHTML = isMap
      ? '<div class="cb-track">' +
          '<div class="cb-pin cb-pin-s">' + PIN_SVG + '</div>' +
          '<div class="cb-rail"><div class="cb-rail-fill"></div><div class="cb-truck-mover">' + TRUCK_SVG + '</div></div>' +
          '<div class="cb-pin cb-pin-e">' + PIN_SVG + '</div>' +
        '</div>'
      : '<div class="cb-track">' +
          '<div class="cb-dot-s"></div>' +
          '<div class="cb-rail"><div class="cb-rail-fill"></div><div class="cb-truck-mover">' + TRUCK_SVG + '</div></div>' +
          '<div class="cb-dot-e"></div>' +
        '</div>';

    var animEl = document.createElement('div');
    animEl.id = 'cb-step-anim';
    animEl.className = 'cb-anim';
    animEl.innerHTML =
      '<div class="cb-anim-card cb-anim-' + type + '">' +
        trackHTML +
        '<div class="cb-anim-label">' + escHtml(label) + '</div>' +
      '</div>';
    el.messages.appendChild(animEl);
    scrollBottom();
  }

  /* ────────────────────────────────────────────────────────────
     JUNK REMOVAL ANIMATION
     ← Trash bin appears, then 3 junk items slide in one by one
     ← Items driven by cbJunkFly keyframe with staggered delays
     ← Bin driven by cbBinIn keyframe
     ← To change item shapes: edit the SVGs inside this function
     ← To change animation speed: edit ANIM.junkTotal/junkFadeAt
       and the animation-delay values in .cb-junk-item-1/2/3 CSS
  ──────────────────────────────────────────────────────────── */

  function showJunkAnim(label) {
    var binSVG =
      '<svg width="28" height="32" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="2 5 4 5 22 5"/>' +
        '<path d="M20 5v19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5m3 0V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>' +
        '<line x1="10" y1="11" x2="10" y2="19"/><line x1="14" y1="11" x2="14" y2="19"/>' +
      '</svg>';

    /* Item SVGs — simple box shapes: premium, not cartoonish */
    var item1 =
      '<svg width="13" height="15" viewBox="0 0 13 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
        '<rect x="1" y="1" width="11" height="13" rx="2"/><line x1="1" y1="5" x2="12" y2="5"/>' +
      '</svg>';
    var item2 =
      '<svg width="11" height="13" viewBox="0 0 11 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
        '<rect x="1" y="1" width="9" height="11" rx="1.5"/>' +
      '</svg>';
    var item3 =
      '<svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
        '<rect x="1" y="1" width="13" height="9" rx="1.5"/><line x1="1" y1="4" x2="14" y2="4"/>' +
      '</svg>';

    var animEl = document.createElement('div');
    animEl.id = 'cb-step-anim';
    animEl.className = 'cb-anim';
    animEl.innerHTML =
      '<div class="cb-anim-card">' +
        '<div class="cb-junk-scene">' +
          '<div class="cb-junk-items-group">' +
            '<div class="cb-junk-item cb-junk-item-1">' + item1 + '</div>' +
            '<div class="cb-junk-item cb-junk-item-2">' + item2 + '</div>' +
            '<div class="cb-junk-item cb-junk-item-3">' + item3 + '</div>' +
          '</div>' +
          '<div class="cb-junk-bin">' + binSVG + '</div>' +
        '</div>' +
        '<div class="cb-anim-label">' + escHtml(label) + '</div>' +
      '</div>';
    el.messages.appendChild(animEl);
    scrollBottom();
  }

  /* ────────────────────────────────────────────────────────────
     ARMED SECURITY ANIMATION
     ← Shield scales in (cbShieldIn, 0–0.48s)
     ← Scan line sweeps top→bottom (cbScanSweep, 0.52–1.14s)
     ← Check mark appears inside (cbCheckIn, 1.08–1.36s)
     ← All CSS-driven; DOM built by this function only
     ← To swap icons: replace the SVG strings below
     ← To change timing: edit ANIM.secTotal/secFadeAt
       and the animation-delay values in .cb-scan-line/.cb-sec-check CSS
  ──────────────────────────────────────────────────────────── */

  function showSecurityAnim(label) {
    var shieldSVG =
      '<svg width="44" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' +
      '</svg>';

    var checkSVG =
      '<svg width="14" height="11" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="1 6 6 10.5 15 1"/>' +
      '</svg>';

    var animEl = document.createElement('div');
    animEl.id = 'cb-step-anim';
    animEl.className = 'cb-anim';
    animEl.innerHTML =
      '<div class="cb-anim-card">' +
        '<div class="cb-sec-scene">' +
          '<div class="cb-shield-wrap">' +
            shieldSVG +
            '<div class="cb-scan-line"></div>' +
            '<div class="cb-sec-check">' + checkSVG + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="cb-anim-label">' + escHtml(label) + '</div>' +
      '</div>';
    el.messages.appendChild(animEl);
    scrollBottom();
  }

  function removeStepAnim() {
    var a = document.getElementById('cb-step-anim');
    if (a) a.remove();
  }

  /* ────────────────────────────────────────────────────────────
     SERVICE ICON CHIP
     ← Small outline pill shown before the first message bubble
  ──────────────────────────────────────────────────────────── */

  function addIconChip(svgHtml, label) {
    var wrap = document.createElement('div');
    wrap.className = 'cb-chip-wrap';
    wrap.innerHTML =
      '<div class="cb-chip">' +
        '<span class="cb-chip-icon">' + svgHtml + '</span>' +
        '<span class="cb-chip-label">' + escHtml(label) + '</span>' +
      '</div>';
    el.messages.appendChild(wrap);
    scrollBottom();
  }

  /* ────────────────────────────────────────────────────────────
     BUBBLES
  ──────────────────────────────────────────────────────────── */

  function addBotBubble(text) {
    var row = document.createElement('div');
    row.className = 'cb-msg cb-bot';
    var b = document.createElement('div');
    b.className = 'cb-bubble';
    b.innerHTML = escHtml(text).replace(/\n/g, '<br>');
    row.appendChild(b);
    el.messages.appendChild(row);
    scrollBottom();
  }

  function addUserBubble(text) {
    var row = document.createElement('div');
    row.className = 'cb-msg cb-user';
    var b = document.createElement('div');
    b.className = 'cb-bubble';
    b.textContent = text;
    row.appendChild(b);
    el.messages.appendChild(row);
    scrollBottom();
  }

  /* ────────────────────────────────────────────────────────────
     TYPING INDICATOR
     ← 3-dot bounce defined in @keyframes cbDotBounce
  ──────────────────────────────────────────────────────────── */

  function showTyping() {
    if (document.getElementById('cb-typing')) return;
    var row = document.createElement('div');
    row.id = 'cb-typing';
    row.className = 'cb-msg cb-bot';
    row.innerHTML = '<div class="cb-bubble cb-typing-dots"><span></span><span></span><span></span></div>';
    el.messages.appendChild(row);
    scrollBottom();
  }

  function removeTyping() {
    var t = document.getElementById('cb-typing');
    if (t) t.remove();
  }

  /* ────────────────────────────────────────────────────────────
     INLINE QUICK REPLY CHIPS
     ← showInlineReplies() injects a .cb-chips-row div into
       #cb-messages directly below the last bot bubble
     ← Replaces the old fixed #cb-replies panel from v4
     ← removeInlineReplies() removes the chip row from the DOM
     ← FAQ keys tracked in state.usedKeys (reply.faq === true)
       — used chips are filtered from future steps' chip rows
  ──────────────────────────────────────────────────────────── */

  function showInlineReplies(step) {
    removeInlineReplies();

    var visible = (step.replies || []).filter(function (r) {
      return !state.usedKeys[r.key];
    });
    if (visible.length === 0) return;

    var row = document.createElement('div');
    row.id = 'cb-chips-row';
    row.className = 'cb-chips-row';

    visible.forEach(function (reply) {
      var btn = document.createElement('button');
      var cls = 'cb-chip-btn';
      if (reply.cta)  cls += ' cb-chip-btn-cta';
      if (reply.back) cls += ' cb-chip-btn-back';
      btn.className   = cls;
      btn.textContent = reply.label;
      btn.addEventListener('click', function () { onReply(reply); });
      row.appendChild(btn);
    });

    el.messages.appendChild(row);
    scrollBottom();
  }

  function removeInlineReplies() {
    var r = document.getElementById('cb-chips-row');
    if (r) r.remove();
  }

  /* ────────────────────────────────────────────────────────────
     REPLY HANDLER
  ──────────────────────────────────────────────────────────── */

  function onReply(reply) {
    if (reply.faq) state.usedKeys[reply.key] = true;

    removeInlineReplies();
    addUserBubble(reply.label);

    if (reply.key === '__scroll_quote') {
      closeChat();
      setTimeout(function () {
        if (typeof window.openQuoteModal === 'function') window.openQuoteModal();
      }, 320);
      return;
    }
    if (reply.key === '__scroll_contact') {
      scrollTo(CONFIG.contactId);
      setTimeout(closeChat, 300);
      return;
    }
    if (reply.key === '__menu') {
      setTimeout(function () { playStep(FLOW.return); }, 440);
      return;
    }

    var next = FLOW[reply.key] || FALLBACK;
    setTimeout(function () { playStep(next); }, 440);
  }

  /* ────────────────────────────────────────────────────────────
     UTILITIES
  ──────────────────────────────────────────────────────────── */

  function scrollTo(id) {
    var t = document.getElementById(id);
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollBottom() {
    el.messages.scrollTop = el.messages.scrollHeight;
  }

  function escHtml(str) {
    return str
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ────────────────────────────────────────────────────────────
     BOOT
  ──────────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
