/**
 * ═══════════════════════════════════════════════════════════
 *  Rainey Removal LLC — Premium Multi-Step Quote Form  v2.0
 *  Dark glassmorphism · Animated cards · Vanilla JS · No deps
 * ═══════════════════════════════════════════════════════════
 *
 *  QUICK EDIT GUIDE
 *  ─────────────────────────────────────────────────────────
 *  Phone / business name  →  QF object            (~20)
 *  Service cards          →  SERVICES array        (~28)
 *  Step 2 fields          →  DETAIL_FIELDS object  (~60)
 *  Colors / spacing       →  CSS variables in STYLES
 *  Trigger selector       →  bindTriggers()
 *  Connect Get-a-Quote btn→  add class="qf-trigger" OR data-qf-trigger
 *                            OR data-quote-trigger to any element.
 *                            window.openQuoteModal() also works.
 * ═══════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     CONFIG  ← edit phone and name here
  ───────────────────────────────────────────────────────── */
  var QF = {
    phone:      '(201) 050-2253',
    phoneHref:  'tel:2010502253',
    name:       'Rainey Removal LLC',
    totalSteps: 4,
  };

  /* ─────────────────────────────────────────────────────────
     SERVICES  ← add / remove / rename service cards here
  ───────────────────────────────────────────────────────── */
  var SERVICES = [
    {
      id:    'junk',
      label: 'Junk Removal',
      sub:   'Furniture, appliances & debris',
      icon:
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          '<polyline points="3 6 5 6 21 6"/>' +
          '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>' +
          '<line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>' +
        '</svg>',
    },
    {
      id:    'moving',
      label: 'Moving',
      sub:   'Local & long-distance moves',
      icon:
        '<svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="1" y="2" width="17" height="13" rx="2"/>' +
          '<polygon points="18 7 24 7 28 12 28 15 18 15 18 7"/>' +
          '<circle cx="6.5" cy="18" r="2.5"/><circle cx="22" cy="18" r="2.5"/>' +
        '</svg>',
    },
    {
      id:    'security',
      label: 'Armed Security',
      sub:   'Residential, events & VIP',
      icon:
        '<svg width="26" height="28" viewBox="0 0 24 26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 24s9-4.5 9-11.25V5.625L12 3 3 5.625V12.75C3 19.5 12 24 12 24z"/>' +
          '<polyline points="8.5 12 11 14.5 15.5 10"/>' +
        '</svg>',
    },
  ];

  /* ─────────────────────────────────────────────────────────
     DETAIL FIELDS  ← edit step-2 fields per service here
  ───────────────────────────────────────────────────────── */
  var DETAIL_FIELDS = {

    junk: {
      heading: 'Tell us about the job',
      fields: [
        { type: 'text',     id: 'location',  label: 'Service location', placeholder: 'City or zip code', required: true },
        { type: 'date',     id: 'date',      label: 'When do you need service?', required: false },
        {
          type: 'chips-single', id: 'jobSize', label: 'Job size',
          options: ['Single item', 'Few items', 'Half load', 'Full load'],
        },
        {
          type: 'chips-multi', id: 'extras', label: 'Any extras?',
          options: ['Heavy items', 'Stairs involved', 'Same-day request'],
        },
        { type: 'textarea', id: 'notes', label: 'What needs to be removed?', placeholder: 'Old sofa, refrigerator\u2026', required: false },
      ],
    },

    moving: {
      heading: 'Tell us about your move',
      fields: [
        { type: 'text',     id: 'from',      label: 'Moving from', placeholder: 'City or zip code', required: true },
        { type: 'text',     id: 'to',        label: 'Moving to',   placeholder: 'City or zip code', required: true },
        {
          type: 'chips-single', id: 'moveType', label: 'Move type',
          options: ['Local', 'Long-distance'],
        },
        { type: 'date',     id: 'date',      label: 'Date needed', required: false },
        {
          type: 'chips-multi', id: 'extras', label: 'Any extras?',
          options: ['Packing help needed', 'Heavy items', 'Stairs / elevator'],
        },
        { type: 'textarea', id: 'notes', label: 'Tell us about your move', placeholder: 'Number of rooms, special items\u2026', required: false },
      ],
    },

    security: {
      heading: 'Tell us about your request',
      fields: [
        { type: 'text',     id: 'location',  label: 'Location / address', placeholder: 'City or address', required: true },
        { type: 'date',     id: 'date',      label: 'Date needed', required: false },
        {
          type: 'chips-single', id: 'secType', label: 'Type of security',
          options: ['Residential', 'Commercial', 'Event', 'Executive / VIP'],
        },
        {
          type: 'chips-multi', id: 'extras', label: 'Any extras?',
          options: ['Overnight coverage', 'Multiple officers needed', 'Urgent request'],
        },
        { type: 'textarea', id: 'notes', label: 'Tell us about your request', placeholder: 'Event size, dates, special needs\u2026', required: false },
      ],
    },
  };

  /* ─────────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────────── */
  var state = {
    step:    1,
    service: null,
    going:   1,     /* 1 = forward, -1 = backward */
    data:    {},
  };

  var el = {};

  /* ═════════════════════════════════════════════════════════
     STYLES  — Premium dark glassmorphism theme
     ← All CSS lives here, prefix qf- avoids conflicts
  ═════════════════════════════════════════════════════════ */
  var STYLES = `
    /* ── Reset ─────────────────────────────────────────────── */
    #qf-overlay,#qf-overlay *{box-sizing:border-box;margin:0;padding:0;
      font-family:-apple-system,'SF Pro Display',BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      -webkit-font-smoothing:antialiased}

    /* ── Overlay backdrop ───────────────────────────────────── */
    body.qf-modal-open{overflow:hidden}
    #qf-overlay{
      position:fixed;top:0;left:0;right:0;bottom:0;
      z-index:999999;
      background:rgba(0,0,0,0.55);
      backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
      display:flex;align-items:center;justify-content:center;
      padding:20px;
      opacity:0;pointer-events:none;visibility:hidden;
      transition:opacity 0.28s ease,visibility 0s linear 0.28s}
    #qf-overlay.is-open{
      opacity:1;pointer-events:auto;visibility:visible;
      transition:opacity 0.28s ease,visibility 0s linear 0s}

    /* ── Modal card ─────────────────────────────────────────── */
    #qf-modal{
      --qf-bg:        #0d1117;
      --qf-bg2:       #13161f;
      --qf-border:    rgba(255,255,255,0.08);
      --qf-text:      #f1f5f9;
      --qf-muted:     #94a3b8;
      --qf-green:     #22c55e;
      --qf-green-glow:rgba(34,197,94,0.18);
      --qf-radius:    14px;
      --qf-shadow:    0 20px 60px rgba(0,0,0,0.55),
                      0 0 0 1px rgba(255,255,255,0.07);

      position:relative;
      width:100%;
      background:var(--qf-bg);
      border-radius:24px;
      border:1px solid rgba(255,255,255,0.08);
      box-shadow:var(--qf-shadow);
      overflow:hidden;
      transform:scale(0.94) translateY(20px);
      transition:transform 0.32s cubic-bezier(0.32,0.72,0,1)}
    #qf-overlay.is-open #qf-modal{transform:scale(1) translateY(0)}

    /* ── Truck progress bar ─────────────────────────────────────
       padding-top:28px gives the 16px-tall truck SVG + 6px gap
       full clearance above the 2px rail inside #qf-modal's
       overflow:hidden.  Maths: 28px − (2+6+16) = 4px spare.
    ─────────────────────────────────────────────────────────── */
    #qf-progress-area{
      padding:28px 28px 12px;
      background:var(--qf-bg);
      flex-shrink:0;
      position:relative}

    /* The rail */
    #qf-progress-track{
      position:relative;
      height:2px;
      background:rgba(255,255,255,0.10);
      border-radius:2px}

    /* Green fill */
    #qf-progress-fill{
      height:100%;
      background:#22c55e;
      border-radius:2px;
      width:0%;
      transition:width 0.65s cubic-bezier(0.4,0,0.2,1)}

    /* Step dots — slightly larger for visibility */
    .qf-step-dot{
      position:absolute;
      top:50%;
      width:6px;height:6px;
      border-radius:50%;
      background:rgba(255,255,255,0.15);
      transform:translate(-50%,-50%);
      transition:background 0.4s,box-shadow 0.35s;
      pointer-events:none}
    .qf-step-dot.qf-dot-active{
      background:#22c55e;
      box-shadow:none}

    /* Truck anchor — z-index 4 keeps it above the boxes below */
    #qf-truck-anchor{
      position:absolute;
      top:0;left:0%;
      height:100%;
      pointer-events:none;
      z-index:4;
      transition:left 0.65s cubic-bezier(0.4,0,0.2,1),opacity 0.7s ease}
    /* Fade triggered by JS adding this class on submit */
    #qf-truck-anchor.qf-truck-done{opacity:0}

    /* Truck floats 6px above the rail, centred on the anchor */
    #qf-truck-wrap{
      position:absolute;
      bottom:calc(100% + 6px);
      left:0;
      transform:translateX(-50%);
      line-height:0}

    /* ── Pickup box ───────────────────────────────────────────
       Sits on the rail surface at step 2 (left:33.33%).
       When the truck arrives it lifts upward and fades out,
       implying pickup. It is NOT inside or attached to the truck.
    ─────────────────────────────────────────────────────────── */
    #qf-pickup-box{
      position:absolute;
      left:33.33%;
      top:50%;
      transform:translate(-50%,calc(-100% - 5px));
      z-index:3;
      width:9px;height:9px;
      border:1.5px solid rgba(74,222,128,0.85);
      border-radius:2px;
      background:rgba(74,222,128,0.14);
      opacity:1;
      pointer-events:none;
      transition:opacity 0.5s ease,transform 0.5s ease}
    /* Lifted = picked up: rises and disappears */
    #qf-pickup-box.qf-box-lifted{
      opacity:0;
      transform:translate(-50%,calc(-100% - 17px))}

    /* ── Drop box ─────────────────────────────────────────────
       Hidden until truck reaches step 4. Then fades in and
       settles downward onto the rail surface — delivery implied.
    ─────────────────────────────────────────────────────────── */
    #qf-drop-box{
      position:absolute;
      left:100%;
      top:50%;
      transform:translate(-50%,calc(-100% - 17px));
      z-index:3;
      width:9px;height:9px;
      border:1.5px solid rgba(74,222,128,0.85);
      border-radius:2px;
      background:rgba(74,222,128,0.14);
      opacity:0;
      pointer-events:none;
      transition:opacity 0.5s ease,transform 0.5s ease}
    /* Dropped = delivered: settles down onto surface */
    #qf-drop-box.qf-box-dropped{
      opacity:1;
      transform:translate(-50%,calc(-100% - 5px))}

    /* ── Header ─────────────────────────────────────────────── */
    #qf-header{
      padding:22px 28px 18px;
      display:flex;align-items:center;justify-content:space-between;
      border-bottom:1px solid var(--qf-border);
      background:var(--qf-bg)}
    #qf-header-left{display:flex;flex-direction:column;gap:3px}
    #qf-step-label{
      font-size:11px;font-weight:600;
      color:var(--qf-green);
      letter-spacing:0.1em;text-transform:uppercase}
    #qf-header-title{
      font-size:17px;font-weight:700;color:var(--qf-text);
      letter-spacing:-0.02em}
    #qf-close{
      width:34px;height:34px;border-radius:50%;
      border:1px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.04);
      color:var(--qf-muted);
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;
      transition:background 0.15s,color 0.15s,border-color 0.15s;
      flex-shrink:0;outline:none}
    #qf-close:hover{
      background:rgba(255,255,255,0.1);
      color:var(--qf-text);
      border-color:rgba(255,255,255,0.2)}

    /* ── Body ───────────────────────────────────────────────── */
    #qf-body{
      padding:28px 28px 8px;
      background:var(--qf-bg);
      overflow-y:auto;
      max-height:calc(100vh - 240px);
      min-height:280px}
    #qf-body::-webkit-scrollbar{width:0}

    /* ── Step container ─────────────────────────────────────── */
    .qf-step{animation:qfStepIn 0.3s ease forwards;opacity:0}
    .qf-step.qf-step-back{animation:qfStepInBack 0.3s ease forwards}

    /* ── Step 1: service cards ──────────────────────────────── */
    .qf-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:4px}
    .qf-card{
      position:relative;overflow:hidden;
      border:1.5px solid rgba(255,255,255,0.07);
      border-radius:var(--qf-radius);
      padding:24px 16px 20px;
      cursor:pointer;
      background:var(--qf-bg2);
      display:flex;flex-direction:column;align-items:center;
      gap:12px;text-align:center;
      transition:border-color 0.22s,box-shadow 0.22s,transform 0.2s,background 0.22s}
    .qf-card:hover{
      border-color:rgba(34,197,94,0.4);
      box-shadow:0 0 0 1px rgba(34,197,94,0.1),
                 0 6px 22px rgba(0,0,0,0.35);
      transform:translateY(-4px);
      background:#161b27}

    /* Selected state — green glow border + dark green tint bg */
    .qf-card.qf-selected{
      border-color:#22c55e;
      background:#0f1e14;
      box-shadow:0 0 0 1px rgba(34,197,94,0.25),
                 0 0 16px rgba(34,197,94,0.08),
                 0 6px 22px rgba(0,0,0,0.35)}

    /* Shimmer scan sweep on selected card */
    .qf-card.qf-selected::after{
      content:'';
      position:absolute;top:0;left:-100%;width:55%;height:100%;
      background:linear-gradient(105deg,
        transparent 30%,rgba(34,197,94,0.09) 50%,transparent 70%);
      animation:qfCardScan 2.2s ease-in-out infinite;
      pointer-events:none}

    /* Card icon — animates color and scale */
    .qf-card-icon{
      width:56px;height:56px;border-radius:14px;
      background:rgba(255,255,255,0.05);
      display:flex;align-items:center;justify-content:center;
      color:var(--qf-muted);
      transition:background 0.22s,color 0.22s,transform 0.22s,box-shadow 0.22s}
    .qf-card:hover .qf-card-icon{
      color:#86efac;
      background:rgba(34,197,94,0.1);
      transform:scale(1.06)}
    .qf-card.qf-selected .qf-card-icon{
      background:rgba(34,197,94,0.14);
      color:#4ade80;
      transform:scale(1.08)}

    .qf-card-label{
      font-size:13.5px;font-weight:600;
      color:var(--qf-text);letter-spacing:-0.01em;
      transition:color 0.18s}
    .qf-card.qf-selected .qf-card-label{color:#86efac}
    .qf-card-sub{font-size:11.5px;color:var(--qf-muted);line-height:1.4}

    /* Selection checkmark ring */
    .qf-card-check{
      position:absolute;top:10px;right:10px;
      width:20px;height:20px;border-radius:50%;
      border:1.5px solid rgba(255,255,255,0.15);
      background:transparent;
      display:flex;align-items:center;justify-content:center;
      transition:border-color 0.18s,background 0.18s,box-shadow 0.18s}
    .qf-card.qf-selected .qf-card-check{
      border-color:var(--qf-green);
      background:var(--qf-green)}
    .qf-check-svg{
      width:10px;height:8px;opacity:0;
      transition:opacity 0.15s;stroke:#fff;fill:none;
      stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
    .qf-card.qf-selected .qf-check-svg{opacity:1}

    /* ── Step question heading ──────────────────────────────── */
    .qf-q{font-size:20px;font-weight:700;color:var(--qf-text);
      letter-spacing:-0.025em;margin-bottom:6px}
    .qf-q-sub{font-size:14px;color:var(--qf-muted);margin-bottom:22px;line-height:1.5}

    /* ── Form fields ────────────────────────────────────────── */
    .qf-fields{display:flex;flex-direction:column;gap:18px;margin-top:4px}
    .qf-field{display:flex;flex-direction:column;gap:6px}
    .qf-label{
      font-size:12.5px;font-weight:600;
      color:#cbd5e1;letter-spacing:0.01em}
    .qf-req{color:#f87171;margin-left:2px}

    /* Inputs — dark bg, green focus glow */
    .qf-input,.qf-textarea{
      width:100%;padding:13px 16px;
      border:1.5px solid rgba(255,255,255,0.1);
      border-radius:10px;
      font-size:14px;color:var(--qf-text);
      background:rgba(255,255,255,0.04);
      outline:none;
      transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;
      font-family:inherit}
    .qf-input:focus,.qf-textarea:focus{
      border-color:#22c55e;
      background:rgba(34,197,94,0.04);
      box-shadow:0 0 0 3px rgba(34,197,94,0.12),
                 0 0 12px rgba(34,197,94,0.08)}
    .qf-input::placeholder,.qf-textarea::placeholder{
      color:rgba(255,255,255,0.2)}
    .qf-textarea{resize:none;min-height:88px;line-height:1.6}
    .qf-input[type=date]::-webkit-calendar-picker-indicator{
      opacity:0.3;cursor:pointer;filter:invert(1)}

    /* 2-col layout */
    .qf-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}

    /* Single-select chips */
    .qf-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px}
    .qf-chip{
      padding:9px 18px;border-radius:999px;
      border:1.5px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.04);
      color:#d1d5db;
      font-size:13px;font-weight:500;
      cursor:pointer;
      transition:border-color 0.15s,background 0.15s,color 0.15s,
                 transform 0.12s,box-shadow 0.15s;
      outline:none;white-space:nowrap}
    .qf-chip:hover{
      border-color:rgba(34,197,94,0.45);
      color:#86efac;
      transform:translateY(-1px);
      background:rgba(34,197,94,0.07)}
    .qf-chip.qf-chip-on{
      background:linear-gradient(135deg,#166534,#15803d);
      color:#fff;border-color:transparent;
      box-shadow:0 0 8px rgba(34,197,94,0.2)}

    /* Multi-select checkboxes */
    .qf-checks{display:flex;flex-direction:column;gap:10px;margin-top:2px}
    .qf-check-label{
      display:flex;align-items:center;gap:11px;
      cursor:pointer;font-size:13.5px;color:#d1d5db;
      user-select:none}
    .qf-check-label input[type=checkbox]{display:none}
    .qf-check-box{
      width:20px;height:20px;border-radius:6px;
      border:1.5px solid rgba(255,255,255,0.12);
      background:rgba(255,255,255,0.04);flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      transition:border-color 0.15s,background 0.15s,box-shadow 0.15s}
    .qf-check-label:has(input:checked) .qf-check-box{
      background:var(--qf-green);border-color:var(--qf-green)}
    .qf-check-icon{
      width:11px;height:9px;opacity:0;
      stroke:#fff;fill:none;stroke-width:2.2;
      stroke-linecap:round;stroke-linejoin:round;
      transition:opacity 0.12s}
    .qf-check-label:has(input:checked) .qf-check-icon{opacity:1}

    /* Contact preference chips */
    .qf-contact-chips{display:flex;gap:8px;flex-wrap:wrap}
    .qf-contact-chip{
      padding:10px 20px;border-radius:10px;
      border:1.5px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.04);
      color:#d1d5db;
      font-size:13.5px;font-weight:500;cursor:pointer;
      transition:border-color 0.15s,background 0.15s,
                 color 0.15s,box-shadow 0.15s;
      outline:none;flex:1;text-align:center;white-space:nowrap}
    .qf-contact-chip:hover{
      border-color:rgba(34,197,94,0.45);color:#86efac;
      background:rgba(34,197,94,0.06)}
    .qf-contact-chip.qf-chip-on{
      border-color:#22c55e;
      background:rgba(34,197,94,0.12);color:#4ade80}

    /* Step 4: review rows */
    .qf-review{
      display:flex;flex-direction:column;gap:1px;
      border:1px solid rgba(255,255,255,0.07);
      border-radius:14px;overflow:hidden;margin-top:4px}
    .qf-review-row{
      display:flex;align-items:baseline;justify-content:space-between;
      padding:14px 18px;
      background:rgba(255,255,255,0.03);
      gap:16px}
    .qf-review-row:not(:last-child){
      border-bottom:1px solid rgba(255,255,255,0.05)}
    .qf-review-key{
      font-size:12px;font-weight:600;color:var(--qf-muted);
      letter-spacing:0.04em;text-transform:uppercase;
      white-space:nowrap;flex-shrink:0}
    .qf-review-val{
      font-size:13.5px;color:var(--qf-text);font-weight:500;
      text-align:right;line-height:1.45}
    .qf-review-empty{
      font-size:13px;color:rgba(255,255,255,0.2);font-style:italic}

    /* ── Footer nav ─────────────────────────────────────────── */
    #qf-footer{
      padding:20px 28px 24px;
      display:flex;align-items:center;justify-content:space-between;gap:12px;
      border-top:1px solid var(--qf-border);
      background:var(--qf-bg);flex-shrink:0}

    #qf-back{
      padding:13px 22px;border-radius:10px;
      border:1.5px solid rgba(255,255,255,0.1);
      background:transparent;color:var(--qf-muted);
      font-size:14px;font-weight:500;cursor:pointer;
      transition:border-color 0.15s,color 0.15s;outline:none}
    #qf-back:hover{
      border-color:rgba(255,255,255,0.25);color:var(--qf-text)}
    #qf-back[hidden]{display:none !important}

    /* Continue / Submit button — green gradient with shine sweep */
    #qf-next{
      position:relative;overflow:hidden;
      flex:1;padding:14px 24px;border-radius:10px;
      border:none;
      background:linear-gradient(135deg,#16a34a 0%,#15803d 60%,#166534 100%);
      color:#fff;
      font-size:14.5px;font-weight:700;
      cursor:pointer;letter-spacing:-0.01em;
      transition:transform 0.15s,box-shadow 0.15s,filter 0.15s;
      outline:none;
      box-shadow:0 3px 14px rgba(22,163,74,0.3),
                 0 0 0 1px rgba(74,222,128,0.15)}
    /* Hover shine sweep via pseudo */
    #qf-next::after{
      content:'';
      position:absolute;top:0;left:-100%;width:45%;height:100%;
      background:linear-gradient(105deg,
        transparent 25%,rgba(255,255,255,0.09) 50%,transparent 75%);
      transition:left 0.55s ease;pointer-events:none}
    #qf-next:hover::after{left:160%}
    #qf-next:hover{
      transform:translateY(-1px);filter:brightness(1.06);
      box-shadow:0 5px 20px rgba(22,163,74,0.4),
                 0 0 0 1px rgba(74,222,128,0.2)}
    #qf-next:active{transform:scale(0.98)}
    #qf-next:disabled{
      background:rgba(255,255,255,0.08);
      box-shadow:none;cursor:not-allowed;
      transform:none;filter:none;
      color:rgba(255,255,255,0.25)}
    #qf-next:disabled::after{display:none}

    /* ── Success state ──────────────────────────────────────── */
    #qf-success{
      display:flex;flex-direction:column;align-items:center;
      padding:52px 28px 48px;text-align:center;gap:16px;
      background:var(--qf-bg)}
    .qf-success-ring{
      width:72px;height:72px;border-radius:50%;
      background:rgba(34,197,94,0.1);
      border:2px solid rgba(34,197,94,0.3);
      display:flex;align-items:center;justify-content:center;
      animation:qfSuccessIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
      box-shadow:0 0 18px rgba(34,197,94,0.15)}
    .qf-success-ring svg{stroke:var(--qf-green)}
    .qf-success-h{
      font-size:22px;font-weight:700;color:var(--qf-text);
      letter-spacing:-0.025em}
    .qf-success-p{
      font-size:14.5px;color:var(--qf-muted);
      line-height:1.6;max-width:360px}
    .qf-success-phone{
      margin-top:6px;display:inline-flex;align-items:center;gap:8px;
      font-size:15px;font-weight:600;color:var(--qf-text);
      text-decoration:none;padding:13px 24px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.04);
      transition:border-color 0.15s,box-shadow 0.15s,background 0.15s}
    .qf-success-phone:hover{
      border-color:rgba(34,197,94,0.4);
      background:rgba(34,197,94,0.06);
      box-shadow:0 0 16px rgba(34,197,94,0.12)}
    .qf-success-close{
      margin-top:4px;background:none;border:none;
      font-size:13.5px;color:var(--qf-muted);cursor:pointer;padding:8px;
      transition:color 0.15s}
    .qf-success-close:hover{color:var(--qf-text)}

    /* ── Validation error ───────────────────────────────────── */
    .qf-error{font-size:12px;color:#f87171;margin-top:4px;display:none}
    .qf-field.qf-invalid .qf-input,
    .qf-field.qf-invalid .qf-textarea{
      border-color:#f87171;
      box-shadow:0 0 0 3px rgba(248,113,113,0.12)}
    .qf-field.qf-invalid .qf-error{display:block}

    /* ── Mobile ─────────────────────────────────────────────── */
    @media(max-width:540px){
      #qf-overlay{padding:12px 0 0;align-items:flex-end}
      #qf-modal{border-radius:24px 24px 0 0;max-height:92vh}
      .qf-cards{grid-template-columns:1fr}
      .qf-card{flex-direction:row;text-align:left;padding:16px 18px;gap:14px}
      .qf-card-icon{width:44px;height:44px;flex-shrink:0}
      .qf-card-text{display:flex;flex-direction:column;gap:2px}
      .qf-row-2{grid-template-columns:1fr}
      #qf-body{padding:22px 20px 8px;max-height:calc(100vh - 220px)}
      #qf-header{padding:18px 20px 16px}
      #qf-footer{padding:16px 20px 20px}
      .qf-contact-chips{flex-direction:column}
    }

    /* ── Keyframes ──────────────────────────────────────────── */
    @keyframes qfStepIn{
      from{opacity:0;transform:translateX(28px)}
      to{opacity:1;transform:translateX(0)}}
    @keyframes qfStepInBack{
      from{opacity:0;transform:translateX(-28px)}
      to{opacity:1;transform:translateX(0)}}
    @keyframes qfSuccessIn{
      from{opacity:0;transform:scale(0.7)}
      to{opacity:1;transform:scale(1)}}
    @keyframes qfCardScan{
      0%{left:-100%}
      100%{left:160%}}

    /* ── Outer wrapper (keeps modal centred in overlay flexbox) ── */
    #qf-modal-outer{
      position:relative;
      width:100%;max-width:620px}

    /* ── Ambient background blobs ───────────────────────────────
       Very faint radial gradients that drift slowly behind the
       modal content. z-index:0 keeps them behind everything.
    ─────────────────────────────────────────────────────────── */
    #qf-ambient{
      position:absolute;
      inset:0;
      pointer-events:none;
      overflow:hidden;
      border-radius:inherit;
      z-index:0}
    .qf-blob{
      position:absolute;
      border-radius:50%;
      pointer-events:none;
      animation:qfBlobFloat 20s ease-in-out infinite}
    .qf-blob-1{
      width:320px;height:320px;
      top:-100px;right:-80px;
      background:radial-gradient(circle,rgba(34,197,94,0.05) 0%,transparent 68%);
      animation-duration:22s}
    .qf-blob-2{
      width:240px;height:240px;
      bottom:-80px;left:-60px;
      background:radial-gradient(circle,rgba(34,197,94,0.04) 0%,transparent 68%);
      animation-duration:17s;
      animation-delay:-9s}
    @keyframes qfBlobFloat{
      0%,100%{transform:translate(0,0) scale(1)}
      33%{transform:translate(18px,-14px) scale(1.04)}
      66%{transform:translate(-12px,18px) scale(0.96)}}

    /* Modal content layers sit above the blobs */
    #qf-progress-area,#qf-header,#qf-body,#qf-footer{
      position:relative;z-index:1}

    /* ── Corner accents ──────────────────────────────────────────
       Tiny L-shaped marks at each modal corner, softly pulsing
       one by one in sequence. Subtle — opacity stays very low.
    ─────────────────────────────────────────────────────────── */
    .qf-corner{
      position:absolute;
      width:14px;height:14px;
      pointer-events:none;
      z-index:5;
      opacity:0.2;
      animation:qfCornerPulse 5s ease-in-out infinite}
    .qf-corner::before,.qf-corner::after{
      content:'';
      position:absolute;
      background:rgba(74,222,128,0.8);
      border-radius:1px}
    .qf-corner::before{width:14px;height:1.5px;top:0;left:0}
    .qf-corner::after {width:1.5px;height:14px;top:0;left:0}

    .qf-corner-tl{top:10px;left:10px;animation-delay:0s}
    .qf-corner-tr{top:10px;right:10px;transform:scaleX(-1);animation-delay:1.25s}
    .qf-corner-br{bottom:10px;right:10px;transform:scale(-1);animation-delay:2.5s}
    .qf-corner-bl{bottom:10px;left:10px;transform:scaleY(-1);animation-delay:3.75s}

    @keyframes qfCornerPulse{
      0%,55%,100%{opacity:0.18}
      18%{opacity:0.6}}

    /* ── Service card hover sweep ───────────────────────────────
       A soft gradient sweeps left→right on hover via CSS transition.
       Uses ::before so it doesn't conflict with the selected shimmer.
    ─────────────────────────────────────────────────────────── */
    .qf-card::before{
      content:'';
      position:absolute;
      top:0;left:-65%;
      width:50%;height:100%;
      background:linear-gradient(105deg,
        transparent 25%,rgba(255,255,255,0.04) 50%,transparent 75%);
      transition:left 0.55s ease;
      pointer-events:none;
      z-index:1}
    .qf-card:hover::before{left:115%}

    /* ── Icon micro-interactions (hover only, CSS transitions) ─── */
    /* Applied to the icon container; barely perceptible, no keyframes */
    .qf-card[data-svc="junk"]:hover .qf-card-icon{
      transform:scale(1.06) rotate(-3deg)}
    .qf-card[data-svc="moving"]:hover .qf-card-icon{
      transform:scale(1.06) translateX(2px)}
    .qf-card[data-svc="security"]:hover .qf-card-icon{
      transform:scale(1.06);
      box-shadow:0 0 10px rgba(34,197,94,0.12)}

    /* Selected state overrides the hover micro-interaction */
    .qf-card.qf-selected .qf-card-icon{
      transform:scale(1.08) !important}
  `;

  /* ═════════════════════════════════════════════════════════
     INIT
  ═════════════════════════════════════════════════════════ */

  function init() {
    /* Duplicate-init guard — Next.js hot reload safety */
    if (document.getElementById('qf-overlay')) {
      console.log('[QuoteForm] already initialised — skipping');
      window.openQuoteModal = openModal;
      window.testQuoteModal = openModal;
      return;
    }

    console.log('[QuoteForm] initialising…');
    injectStyles();
    buildModal();
    bindTriggers();

    /* Expose global openers for chatbot, nav, and external callers */
    window.openQuoteModal = openModal;
    window.testQuoteModal = openModal;

    var triggerCount = document.querySelectorAll('.qf-trigger,[data-qf-trigger],[data-quote-trigger]').length;
    console.log('[QuoteForm] ready \u2713  triggers in DOM right now:', triggerCount);
  }

  function injectStyles() {
    if (document.getElementById('qf-stylesheet')) return;
    var tag = document.createElement('style');
    tag.id  = 'qf-stylesheet';
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }

  /* ═════════════════════════════════════════════════════════
     BUILD MODAL
  ═════════════════════════════════════════════════════════ */

  function buildModal() {
    var root = document.createElement('div');
    root.id  = 'qf-overlay';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Get a quote');

    /*
     * Truck SVG — premium monoline side-view, 28×15 canvas.
     * Two tyres only (front under cab, rear under trailer).
     * All strokes #4ade80 at full opacity — crisp on dark bg.
     * Purely outline / minimal-fill — no chunky cartoon shapes.
     */
    var truckSvg =
      '<svg width="28" height="15" viewBox="0 0 28 15" fill="none"' +
          ' xmlns="http://www.w3.org/2000/svg">' +
        /* ── cargo / trailer body ── */
        '<rect x="0.75" y="0.75" width="15.5" height="9.5" rx="1.75"' +
          ' stroke="#4ade80" stroke-width="1.25" fill="none"/>' +
        /* ── cab ── */
        '<path d="M16.25 2.5 L16.25 10.25 L27.25 10.25 L27.25 6.25 L24.75 2.5 Z"' +
          ' stroke="#4ade80" stroke-width="1.25" fill="rgba(74,222,128,0.05)"/>' +
        /* ── windshield (fill only — clean, no distracting outline) ── */
        '<path d="M17.75 3.75 L17.75 6 L26.5 6 L24.5 3.75 Z"' +
          ' fill="rgba(74,222,128,0.18)" stroke="none"/>' +
        /* ── headlight dot ── */
        '<circle cx="26.75" cy="8.75" r="0.85" fill="#4ade80"/>' +
        /* ── 2 tyres only ── */
        '<circle cx="5.5"  cy="13" r="1.9" stroke="#4ade80" stroke-width="1.2" fill="none"/>' +
        '<circle cx="21.5" cy="13" r="1.9" stroke="#4ade80" stroke-width="1.2" fill="none"/>' +
      '</svg>';

    root.innerHTML =
      '<div id="qf-modal-outer">' +
        '<div id="qf-modal">' +

          /* very faint ambient blobs — z-index 0, behind all content */
          '<div id="qf-ambient">' +
            '<div class="qf-blob qf-blob-1"></div>' +
            '<div class="qf-blob qf-blob-2"></div>' +
          '</div>' +

          /* corner accent marks */
          '<div class="qf-corner qf-corner-tl"></div>' +
          '<div class="qf-corner qf-corner-tr"></div>' +
          '<div class="qf-corner qf-corner-br"></div>' +
          '<div class="qf-corner qf-corner-bl"></div>' +

          /* truck progress area */
          '<div id="qf-progress-area">' +
            '<div id="qf-progress-track">' +
              '<div id="qf-progress-fill"></div>' +
              /* step dots */
              '<span class="qf-step-dot qf-dot-active" style="left:0%"></span>' +
              '<span class="qf-step-dot" style="left:33.33%"></span>' +
              '<span class="qf-step-dot" style="left:66.66%"></span>' +
              '<span class="qf-step-dot" style="left:100%"></span>' +
              /* pickup box — on the rail at 33.33%, separate from the truck */
              '<div id="qf-pickup-box"></div>' +
              /* drop box — on the rail at 100%, separate from the truck */
              '<div id="qf-drop-box"></div>' +
              /* truck anchor — left % updated by JS; box NOT inside */
              '<div id="qf-truck-anchor">' +
                '<div id="qf-truck-wrap">' +
                  truckSvg +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div id="qf-header">' +
            '<div id="qf-header-left">' +
              '<span id="qf-step-label">Step 1 of ' + QF.totalSteps + '</span>' +
              '<span id="qf-header-title">What do you need help with?</span>' +
            '</div>' +
            '<button id="qf-close" aria-label="Close">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">' +
                '<line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +

          '<div id="qf-body"></div>' +

          '<div id="qf-footer">' +
            '<button id="qf-back" hidden>Back</button>' +
            '<button id="qf-next">Continue</button>' +
          '</div>' +

        '</div>' +
      '</div>';

    document.body.appendChild(root);

    el = {
      overlay:      document.getElementById('qf-overlay'),
      modal:        document.getElementById('qf-modal'),
      fill:         document.getElementById('qf-progress-fill'),
      truckAnchor:  document.getElementById('qf-truck-anchor'),
      stepDots:     document.querySelectorAll('.qf-step-dot'),
      stepLbl:      document.getElementById('qf-step-label'),
      title:        document.getElementById('qf-header-title'),
      close:        document.getElementById('qf-close'),
      body:         document.getElementById('qf-body'),
      footer:       document.getElementById('qf-footer'),
      back:         document.getElementById('qf-back'),
      next:         document.getElementById('qf-next'),
    };

    el.close.addEventListener('click', closeModal);
    el.overlay.addEventListener('click', function (e) {
      if (e.target === el.overlay) closeModal();
    });
    el.back.addEventListener('click', handleBack);
    el.next.addEventListener('click', handleNext);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.step > 0) closeModal();
    });
  }

  /* ═════════════════════════════════════════════════════════
     TRIGGER BINDING
     Single document-level delegation listener.
     Catches:
       • .qf-trigger class
       • [data-qf-trigger] attribute
       • [data-quote-trigger] attribute
       • Any <a> or <button> whose visible text is "Get a Quote"
         (case-insensitive, covers chatbot chips and any missed btn)
  ═════════════════════════════════════════════════════════ */

  function bindTriggers() {
    document.addEventListener('click', function (e) {
      /* 1. class / attribute selectors */
      var trigger = e.target.closest('.qf-trigger, [data-qf-trigger], [data-quote-trigger]');

      /* 2. text-content fallback — catches any button/link that says
            "get a quote" in any capitalisation */
      if (!trigger) {
        var btn = e.target.closest('a, button');
        if (btn && /get\s+a\s+(free\s+)?quote/i.test(btn.textContent.trim())) {
          trigger = btn;
        }
      }

      if (!trigger) return;
      e.preventDefault();
      openModal();
    });
  }

  /* ═════════════════════════════════════════════════════════
     OPEN / CLOSE
  ═════════════════════════════════════════════════════════ */

  function openModal() {
    state.step    = 1;
    state.service = null;
    state.going   = 1;
    state.data    = {};
    renderStep(1);

    el.overlay.classList.add('is-open');
    document.body.classList.add('qf-modal-open');

    /* Inline styles as hard fallback over any stylesheet rule */
    el.overlay.style.display        = 'flex';
    el.overlay.style.opacity        = '1';
    el.overlay.style.visibility     = 'visible';
    el.overlay.style.pointerEvents  = 'auto';
    el.overlay.style.zIndex         = '999999';
  }

  function closeModal() {
    el.overlay.classList.remove('is-open');
    document.body.classList.remove('qf-modal-open');

    el.overlay.style.opacity       = '0';
    el.overlay.style.visibility    = 'hidden';
    el.overlay.style.pointerEvents = 'none';

    setTimeout(function () {
      state.step = 1;
      el.body.innerHTML = '';
      el.overlay.style.cssText = '';
    }, 300);
  }

  /* ═════════════════════════════════════════════════════════
     STEP NAVIGATION
  ═════════════════════════════════════════════════════════ */

  function handleNext() {
    if (!validateCurrentStep()) return;
    collectStepData();

    if (state.step === QF.totalSteps) {
      handleSubmit();
      return;
    }
    state.going = 1;
    renderStep(state.step + 1);
  }

  function handleBack() {
    if (state.step <= 1) return;
    state.going = -1;
    renderStep(state.step - 1);
  }

  function renderStep(n) {
    state.step = n;
    updateProgress();
    updateHeader();
    el.back.hidden = (n === 1);
    el.next.disabled = false;
    el.next.textContent = (n === QF.totalSteps) ? 'Request My Quote' : 'Continue';

    var stepEl = document.createElement('div');
    stepEl.className = 'qf-step' + (state.going < 0 ? ' qf-step-back' : '');

    if (n === 1) buildStep1(stepEl);
    if (n === 2) buildStep2(stepEl);
    if (n === 3) buildStep3(stepEl);
    if (n === 4) buildStep4(stepEl);

    el.body.innerHTML = '';
    el.body.appendChild(stepEl);

    if (n === 1) restoreServiceCards();
    if (n === 2) restoreStep2Fields(stepEl);
    if (n === 3) restoreStep3Fields(stepEl);

    el.body.scrollTop = 0;
  }

  function updateProgress() {
    /* ── Fill bar ── */
    el.fill.style.width = (state.step / QF.totalSteps) * 100 + '%';

    /* ── Truck position ── step 1 = 0 %, step 4 = 100 % */
    var truckPct = ((state.step - 1) / (QF.totalSteps - 1)) * 100;
    if (el.truckAnchor) {
      el.truckAnchor.style.left = truckPct + '%';
      el.truckAnchor.classList.remove('qf-truck-done'); /* re-entering cancels fade */
    }

    var pickupBox = document.getElementById('qf-pickup-box');
    var dropBox   = document.getElementById('qf-drop-box');

    if (state.step === 1) {
      /* Reset everything — both boxes to their initial states */
      if (pickupBox) { pickupBox.classList.remove('qf-box-lifted'); }
      if (dropBox)   { dropBox.classList.remove('qf-box-dropped'); }

    } else if (state.step === 2) {
      /* Truck is travelling to the pickup dot.
         After the 0.65 s position transition, lift the box. */
      if (dropBox) dropBox.classList.remove('qf-box-dropped');
      if (pickupBox) {
        pickupBox.classList.remove('qf-box-lifted'); /* ensure visible on back-nav */
        setTimeout(function () {
          pickupBox.classList.add('qf-box-lifted');  /* rises and fades — "picked up" */
        }, 750);
      }

    } else if (state.step === 3) {
      /* Box already gone; drop box still hidden */
      if (pickupBox) pickupBox.classList.add('qf-box-lifted');
      if (dropBox)   dropBox.classList.remove('qf-box-dropped');

    } else if (state.step === 4) {
      /* Truck reached destination.
         After the 0.65 s position transition, drop box settles. */
      if (pickupBox) pickupBox.classList.add('qf-box-lifted');
      if (dropBox) {
        dropBox.classList.remove('qf-box-dropped');
        setTimeout(function () {
          dropBox.classList.add('qf-box-dropped');   /* fades in and settles — "dropped" */
        }, 750);
      }
    }

    /* ── Step dots ── */
    if (el.stepDots) {
      el.stepDots.forEach(function (dot, i) {
        dot.classList.toggle('qf-dot-active', i < state.step);
      });
    }
  }

  var HEADERS = [
    '',
    'What do you need help with?',
    'A few details',
    'Your contact info',
    'Review your request',
  ];

  function updateHeader() {
    el.stepLbl.textContent = 'Step ' + state.step + ' of ' + QF.totalSteps;
    el.title.textContent   = HEADERS[state.step] || '';
  }

  /* ═════════════════════════════════════════════════════════
     STEP BUILDERS
  ═════════════════════════════════════════════════════════ */

  function buildStep1(wrap) {
    var grid = document.createElement('div');
    grid.className = 'qf-cards';

    SERVICES.forEach(function (svc) {
      var card = document.createElement('div');
      card.className = 'qf-card';
      card.dataset.svc = svc.id;
      if (state.service === svc.id) card.classList.add('qf-selected');

      card.innerHTML =
        '<div class="qf-card-check">' +
          '<svg class="qf-check-svg" viewBox="0 0 10 8"><polyline points="1 4 3.8 6.5 9 1"/></svg>' +
        '</div>' +
        '<div class="qf-card-icon">' + svc.icon + '</div>' +
        '<div class="qf-card-text">' +
          '<div class="qf-card-label">' + esc(svc.label) + '</div>' +
          '<div class="qf-card-sub">'   + esc(svc.sub)   + '</div>' +
        '</div>';

      card.addEventListener('click', function () {
        grid.querySelectorAll('.qf-card').forEach(function (c) {
          c.classList.remove('qf-selected');
        });
        card.classList.add('qf-selected');
        state.service = svc.id;
        el.next.disabled = false;
      });

      grid.appendChild(card);
    });

    if (!state.service) el.next.disabled = true;
    wrap.appendChild(grid);
  }

  function restoreServiceCards() {
    if (!state.service) { el.next.disabled = true; return; }
    var card = el.body.querySelector('[data-svc="' + state.service + '"]');
    if (card) card.classList.add('qf-selected');
  }

  function buildStep2(wrap) {
    var def = DETAIL_FIELDS[state.service];
    if (!def) return;

    var container = document.createElement('div');
    container.className = 'qf-fields';

    def.fields.forEach(function (f) {
      container.appendChild(buildField(f));
    });

    wrap.appendChild(container);
  }

  function restoreStep2Fields(wrap) {
    var def = DETAIL_FIELDS[state.service];
    if (!def) return;
    def.fields.forEach(function (f) {
      var saved = state.data[f.id];
      if (!saved) return;
      if (f.type === 'text' || f.type === 'date' || f.type === 'textarea') {
        var inp = wrap.querySelector('#qf-f-' + f.id);
        if (inp) inp.value = saved;
      }
      if (f.type === 'chips-single') {
        wrap.querySelectorAll('[data-single="' + f.id + '"]').forEach(function (c) {
          if (c.dataset.val === saved) c.classList.add('qf-chip-on');
        });
      }
      if (f.type === 'chips-multi') {
        var arr = saved || [];
        wrap.querySelectorAll('[data-multi="' + f.id + '"]').forEach(function (cb) {
          if (arr.indexOf(cb.value) !== -1) cb.checked = true;
        });
      }
    });
  }

  function buildStep3(wrap) {
    var container = document.createElement('div');
    container.className = 'qf-fields';

    var nameRow  = buildField({ type: 'text', id: 'name',  label: 'Full name',     placeholder: 'Your name',      required: true });
    var phoneRow = buildField({ type: 'text', id: 'phone', label: 'Phone number',  placeholder: '(xxx) xxx-xxxx', required: true });
    var emailRow = buildField({ type: 'text', id: 'email', label: 'Email address', placeholder: 'Optional',       required: false });

    var prefField = document.createElement('div');
    prefField.className = 'qf-field';
    prefField.innerHTML =
      '<label class="qf-label">Preferred contact method</label>' +
      '<div class="qf-contact-chips" id="qf-contact-chips">' +
        ['Call','Text','Email'].map(function (m) {
          var on = (state.data.contactPref === m) ? ' qf-chip-on' : '';
          return '<button class="qf-contact-chip' + on + '" data-pref="' + m + '">' + m + '</button>';
        }).join('') +
      '</div>';

    container.appendChild(nameRow);
    container.appendChild(phoneRow);
    container.appendChild(emailRow);
    container.appendChild(prefField);

    prefField.querySelectorAll('.qf-contact-chip').forEach(function (chip) {
      chip.type = 'button';
      chip.addEventListener('click', function () {
        prefField.querySelectorAll('.qf-contact-chip').forEach(function (c) { c.classList.remove('qf-chip-on'); });
        chip.classList.add('qf-chip-on');
        state.data.contactPref = chip.dataset.pref;
      });
    });

    wrap.appendChild(container);
  }

  function restoreStep3Fields(wrap) {
    ['name','phone','email'].forEach(function (id) {
      var inp = wrap.querySelector('#qf-f-' + id);
      if (inp && state.data[id]) inp.value = state.data[id];
    });
  }

  function buildStep4(wrap) {
    var rows  = buildReviewRows();
    var table = document.createElement('div');
    table.className = 'qf-review';

    rows.forEach(function (row) {
      var div = document.createElement('div');
      div.className = 'qf-review-row';
      div.innerHTML =
        '<span class="qf-review-key">' + esc(row.key) + '</span>' +
        '<span class="qf-review-val">' + (row.val ? esc(row.val) : '<em class="qf-review-empty">Not specified</em>') + '</span>';
      table.appendChild(div);
    });

    el.next.textContent = 'Request My Quote';
    wrap.appendChild(table);
  }

  /* ═════════════════════════════════════════════════════════
     FIELD BUILDER
  ═════════════════════════════════════════════════════════ */

  function buildField(f) {
    var wrap = document.createElement('div');
    wrap.className = 'qf-field';
    wrap.id = 'qf-field-' + f.id;

    var lbl = '<label class="qf-label" for="qf-f-' + f.id + '">' +
      esc(f.label) +
      (f.required ? '<span class="qf-req">*</span>' : '') +
      '</label>';

    if (f.type === 'text' || f.type === 'date') {
      wrap.innerHTML = lbl +
        '<input id="qf-f-' + f.id + '" class="qf-input"' +
        ' type="' + f.type + '"' +
        (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') +
        (f.required ? ' data-required' : '') + '>' +
        '<span class="qf-error">This field is required.</span>';
    }

    else if (f.type === 'textarea') {
      wrap.innerHTML = lbl +
        '<textarea id="qf-f-' + f.id + '" class="qf-textarea"' +
        (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') +
        (f.required ? ' data-required' : '') + '></textarea>' +
        '<span class="qf-error">This field is required.</span>';
    }

    else if (f.type === 'chips-single') {
      var chips = f.options.map(function (opt) {
        return '<button type="button" class="qf-chip" data-single="' + f.id + '" data-val="' + esc(opt) + '">' + esc(opt) + '</button>';
      }).join('');
      wrap.innerHTML = lbl + '<div class="qf-chips">' + chips + '</div>';
      wrap.querySelectorAll('.qf-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          wrap.querySelectorAll('.qf-chip').forEach(function (c) { c.classList.remove('qf-chip-on'); });
          chip.classList.add('qf-chip-on');
        });
      });
    }

    else if (f.type === 'chips-multi') {
      var cbs = f.options.map(function (opt) {
        return '<label class="qf-check-label">' +
          '<input type="checkbox" data-multi="' + f.id + '" value="' + esc(opt) + '">' +
          '<span class="qf-check-box">' +
            '<svg class="qf-check-icon" viewBox="0 0 11 9"><polyline points="1 4.5 4 7.5 10 1"/></svg>' +
          '</span>' +
          esc(opt) +
        '</label>';
      }).join('');
      wrap.innerHTML = lbl + '<div class="qf-checks">' + cbs + '</div>';
    }

    return wrap;
  }

  /* ═════════════════════════════════════════════════════════
     DATA COLLECTION
  ═════════════════════════════════════════════════════════ */

  function collectStepData() {
    if (state.step === 1) {
      state.data.serviceName = labelOf(state.service);
    }

    if (state.step === 2) {
      var def = DETAIL_FIELDS[state.service];
      if (!def) return;
      def.fields.forEach(function (f) {
        if (f.type === 'text' || f.type === 'date' || f.type === 'textarea') {
          var inp = document.getElementById('qf-f-' + f.id);
          if (inp) state.data[f.id] = inp.value.trim();
        }
        if (f.type === 'chips-single') {
          var on = el.body.querySelector('[data-single="' + f.id + '"].qf-chip-on');
          state.data[f.id] = on ? on.dataset.val : '';
        }
        if (f.type === 'chips-multi') {
          var checked = el.body.querySelectorAll('[data-multi="' + f.id + '"]:checked');
          state.data[f.id] = Array.prototype.map.call(checked, function (cb) { return cb.value; });
        }
      });
    }

    if (state.step === 3) {
      ['name','phone','email'].forEach(function (id) {
        var inp = document.getElementById('qf-f-' + id);
        if (inp) state.data[id] = inp.value.trim();
      });
    }
  }

  /* ═════════════════════════════════════════════════════════
     VALIDATION
  ═════════════════════════════════════════════════════════ */

  function validateCurrentStep() {
    var ok = true;

    if (state.step === 1) {
      if (!state.service) {
        var cards = el.body.querySelectorAll('.qf-card');
        cards.forEach(function (c) {
          c.style.borderColor = 'rgba(248,113,113,0.6)';
          setTimeout(function () { c.style.borderColor = ''; }, 700);
        });
        ok = false;
      }
    }

    if (state.step === 2 || state.step === 3) {
      el.body.querySelectorAll('[data-required]').forEach(function (inp) {
        var fieldWrap = inp.closest('.qf-field');
        if (!inp.value.trim()) {
          fieldWrap && fieldWrap.classList.add('qf-invalid');
          ok = false;
        } else {
          fieldWrap && fieldWrap.classList.remove('qf-invalid');
        }
      });
      if (state.step === 3) {
        var phoneInp = document.getElementById('qf-f-phone');
        if (phoneInp && phoneInp.value.replace(/\D/g,'').length < 7) {
          var pf = phoneInp.closest('.qf-field');
          if (pf) {
            pf.classList.add('qf-invalid');
            var errEl = pf.querySelector('.qf-error');
            if (errEl) errEl.textContent = 'Enter a valid phone number.';
          }
          ok = false;
        }
      }
    }

    return ok;
  }

  /* ═════════════════════════════════════════════════════════
     REVIEW DATA
  ═════════════════════════════════════════════════════════ */

  function buildReviewRows() {
    var d   = state.data;
    var def = DETAIL_FIELDS[state.service] || { fields: [] };
    var rows = [];

    rows.push({ key: 'Service', val: d.serviceName });

    def.fields.forEach(function (f) {
      var val = d[f.id];
      if (!val || (Array.isArray(val) && val.length === 0)) return;
      var display = Array.isArray(val) ? val.join(', ') : val;
      rows.push({ key: f.label, val: display });
    });

    rows.push({ key: 'Name',  val: d.name  });
    rows.push({ key: 'Phone', val: d.phone });
    if (d.email) rows.push({ key: 'Email', val: d.email });
    if (d.contactPref) rows.push({ key: 'Contact via', val: d.contactPref });

    return rows;
  }

  /* ═════════════════════════════════════════════════════════
     SUBMIT + SUCCESS
  ═════════════════════════════════════════════════════════ */

  function handleSubmit() {
    collectStepData();
    /* Truck fades out cleanly on submit — drop box stays */
    if (el.truckAnchor) el.truckAnchor.classList.add('qf-truck-done');
    showSuccess();
  }

  function showSuccess() {
    el.body.innerHTML = '';
    el.footer.hidden  = true;
    el.next.hidden    = true;

    var successDiv = document.createElement('div');
    successDiv.id  = 'qf-success';
    successDiv.innerHTML =
      '<div class="qf-success-ring">' +
        '<svg width="28" height="22" viewBox="0 0 28 22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
          '<polyline points="2 11 10 19 26 3"/>' +
        '</svg>' +
      '</div>' +
      '<h2 class="qf-success-h">You\u2019re all set!</h2>' +
      '<p class="qf-success-p">Your quote request has been received.<br>We\u2019ll be in touch very soon.</p>' +
      '<a class="qf-success-phone" href="' + QF.phoneHref + '">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
          '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>' +
        '</svg>' +
        'Urgent? Call ' + QF.phone +
      '</a>' +
      '<button class="qf-success-close" onclick="(function(){var o=document.getElementById(\'qf-overlay\');if(o){o.classList.remove(\'is-open\');o.style.cssText=\'\';}document.body.classList.remove(\'qf-modal-open\')})()">Close</button>';

    el.body.appendChild(successDiv);

    el.stepLbl.textContent = 'Request submitted';
    el.title.textContent   = QF.name;
    el.fill.style.width    = '100%';
    el.back.hidden = true;

    setTimeout(function () {
      el.fill.style.boxShadow = '0 0 16px rgba(34,197,94,0.8)';
    }, 200);
  }

  /* ═════════════════════════════════════════════════════════
     UTILITIES
  ═════════════════════════════════════════════════════════ */

  function labelOf(serviceId) {
    var svc = SERVICES.filter(function (s) { return s.id === serviceId; })[0];
    return svc ? svc.label : '';
  }

  function esc(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ═════════════════════════════════════════════════════════
     BOOT
  ═════════════════════════════════════════════════════════ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
