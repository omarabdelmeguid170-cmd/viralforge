# 🚀 ViralForge — AI YouTube Channel Manager & Viral Growth Hub

A **100% free, open-source** web platform that acts as a full-time AI employee dedicated to scaling YouTube channels — live audits, a 24-hour viral traffic engine, CTR prediction, a script factory, milestone roadmaps, a community plan marketplace, and a creator exchange network.

**Zero servers. Zero paywalls. Zero accounts. Zero tracking.**
Everything runs client-side in your browser and persists to `localStorage`. Animations (GSAP/Lenis), confetti, icons (Lucide) and state (Zustand) are bundled locally — the site ships with **zero runtime CDN dependencies**.

---

## ✨ Core Modules

### 👤 AI Virtual Employee (24/7 Channel Manager)
| Module | What it does |
| --- | --- |
| **Live Channel Audit** | Connects to a channel via the YouTube Data API v3 (optional free key) or a smart self-assessment; returns a weighted **Channel Health Score (A–F)**, grade breakdown, and a tick-box optimization playbook. |
| **24-Hour Viral Traffic Engine** | Pulls real YouTube most-popular feeds (per region) through a CORS mirror, scores **viral velocity**, and auto-derives “create now” plays mapped to your niche + a 24h action checklist. |
| **Thumbnail & Title CTR Predictor** | Drag-and-drop thumbnail tester with real pixel analysis: visual contrast, color heat, saturation, center framing, skin-tone **face-framing estimate**, plus title power/length/emoji/trigger scoring → predicted CTR + pre-upload fix list. |
| **Script & Idea Factory** | Generates 10 high-CTR idea patterns plus full Shorts/long-form scripts (hook formula, tone, CTA, timing) instantly. |

### 🗺 Structured Milestone Roadmap Hub
Pre-built interactive growth plans with timeline milestones, daily action checklists, progress bars, and stage-completion **milestone badges**:
1. **The 1,000 Subscribers Blueprint** (30 days)
2. **The 4,000 Watch Hours Acceleration Plan** (90 days)
3. **The 3 Million Shorts Views Viral Blueprint** (30 days)

### 👥 Community Plan Hub (Open-Source Sharing)
- Submit & publish your own growth plans (works instantly in-browser).
- Browse, search, **upvote, rate, comment**, and **clone** plans.
- Export/import plans as JSON; upstream to the shared index via GitHub PR.

### 🤝 Creator Exchange Network
Community wall for **safe cross-promotions** — shoutout swaps, collabs, featured spots, live-stream trains — plus a **partner matcher** that ranks compatible swaps by niche + audience size, with safe-swap rules built in.

### ☕ Open-Source & Monetization Architecture
- 100% free notice + public GitHub repo links throughout.
- Integrated dashed **ad-slot zones** (sidebar 240×400, footer 728×90, in-feed) for self-hosters.
- **Donation support** (BuyMeACoffee / Patreon / GitHub sponsor) wired in without any feature being locked.

---

## 🛠 Tech Stack
Pure **HTML + CSS + vanilla JavaScript** (IIFE modules). No frameworks and **no external CDN at runtime** — that's the whole point of fast + free + forkable. Third-party UI/utility libraries are pre-bundled into a single vendored file so the deployed site stays fully self-contained.

**Bundled libraries (v1.2.0):**
| Library | Role |
| --- | --- |
| **GSAP** | View-entrance animations (cards, progress bars, health rings) |
| **Lenis** | Global smooth scrolling (respects `prefers-reduced-motion`) |
| **canvas-confetti** | Milestone badges, blueprint completion, publishes, top-10% CTR |
| **@formkit/auto-animate** | Layout transitions on dynamic walls/grids |
| **lucide** | Icon engine (replaces the old hand-drawn set, with fallbacks) |
| **zustand** (`createStore`) | Lightweight global UI state (`Ux`) |
| **clsx + tailwind-merge** | `cn()` class-name merger utility |
| *(own)* **data-layer.js** | Cached fetch layer (TTL + request dedupe) standing in for a query client |

```
viralforge/
├─ index.html             # SPA shell (sidebar, topbar, views)
├─ css/styles.css         # Dark neon SaaS theme (responsive) + Lenis support
├─ vendor/                # vendor.bundle.js → exposes window.VF (committed, no npm needed to serve)
├─ scripts/
│  ├─ build-vendor.mjs    # bundle deps → vendor/vendor.bundle.js (npm run vendor)
│  ├─ smoke.js            # jsdom regression test (npm run smoke)
│  └─ check-js.mjs        # node --check on all first-party JS (npm run check)
├─ js/
│  ├─ store.js            # localStorage persistence layer
│  ├─ data.js             # config, blueprints, seeds, templates
│  ├─ lib/data-layer.js   # cached fetch (query-client stand-in)
│  ├─ vendoricon.js       # icon registry: Lucide-first, inline-SVG fallback
│  ├─ ads.js              # AdSense/sponsor zone injector (activates via CONFIG)
│  ├─ i18n.js             # EN/AR dictionary + theme + RTL + lang persistence
│  ├─ router.js           # tiny hash router (+ entrance animations)
│  ├─ ui/
│  │  ├─ cn.js            # class merger
│  │  ├─ ux.js            # zustand UI store
│  │  ├─ anim.js          # Lenis + GSAP + AutoAnimate (motion layer)
│  │  └─ confetti.js      # confetti helper
│  ├─ main.js             # boot, dashboard, support, UI utils
│  ├─ audit.js            # Live Channel Audit
│  ├─ trends.js           # 24H Viral Traffic Engine
│  ├─ ctr.js              # CTR Predictor (canvas pixel analysis)
│  ├─ factory.js          # Script & Idea Factory
│  ├─ roadmap.js          # Milestone Roadmap Hub
│  ├─ community.js        # Community Plan Hub
│  └─ exchange.js         # Creator Exchange Network
├─ package.json
├─ README.md
└─ LICENSE                # MIT
```

## ▶️ Run it locally
The site works by opening `index.html` directly (no build needed — `vendor/vendor.bundle.js` is committed). For the trend feed to reach the CORS mirrors, serve the folder instead:

```bash
npm install      # once: installs dev tooling (esbuild, jsdom)
npm run serve    # static server on :3000   (or: npx serve .)
```

If you change `node_modules` or want to refresh the vendored bundle:
```bash
npm run vendor   # rebuild vendor/vendor.bundle.js from source deps
npm run check    # syntax-check all first-party JS
npm run smoke    # full jsdom regression suite (routes + interactions)
```

## 🚀 Deploy free
Static host, single folder, ~zero config:
- **GitHub Pages** — push the folder to a repo, enable Pages on `main`.
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder or connect the repo.

## 🔑 Optional: Live audit with real YouTube data
1. Go to https://console.cloud.google.com → create a project → **Enable APIs** → **YouTube Data API v3**.
2. Create an **API key** under *Credentials*.
3. Paste it into the Live Audit form. ⚠️ The key stays in your *own browser* only (it's used to call the public YouTube API). Without a key the Quick Audit still gives a full score + plan.

## 🌐 The trend feed & CORS
The 24H Viral Engine reads the public YouTube most-popular RSS feed through keyless public CORS mirrors (`allorigins.win`, then `corsproxy.io`). If both are unreachable (fully offline), it falls back to a demo dataset so the UI keeps working.

## 🎨 Language & theme
- **English / العربية** — toggle in the topbar. Arabic switches the whole shell to RTL instantly (persisted as `vf_lang`; auto-detects if your browser language starts with `ar`). Deep generated content (audit plans, scripts, trend items) stays English by design.
- **Dark / Light** — toggle in the topbar (persisted as `vf_theme`). Defaults to your OS preference, applied before first paint (no flash). Light mode is a full recolor via `:root[data-theme="light"]`.

## 🎁 Supporting & monetizing (self-hosters)
Centralize everything in `CONFIG` (`js/data.js`) — nothing renders dead links when empty:

- **Donation gateways** — set `CONFIG.buymeacoffee` and/or `CONFIG.patreon` to your URLs; the Support page buttons appear automatically.
- **Repo link** — set `CONFIG.repoUrl` to activate the GitHub button in the header, "View the source", and the "Contribute on GitHub" buttons. Until then they're hidden (or show a "coming soon" chip).
- **Google AdSense — ready out of the box.** The dashed zones (sidebar 240×400, footer 728×90) become live ad units the moment you set:
  ```js
  adsense: {
    client: "ca-pub-XXXXXXXXXXXXXXXX",   // your publisher id
    slots: { sidebar: "ADSLOTID", footer: "ADSLOTID" } // your <ins> unit ids
  }
  ```
  `js/ads.js` then injects the `<ins class="adsbygoogle">` units and loads the `adsbygoogle.js` script itself — no manual code pasting.
- **Sponsor fallback** — instead of AdSense, set `adsense.custom` to a URL (BuyMeACoffee page, your product, an affiliate link) and both zones render as a styled sponsor link card.
- **Zero ads by default** — with nothing configured, the dashed placeholders stay and visitors keep 100% of features free. That's a feature, not a bug.

## 🛠 Contributing
- **Plans**: publish via the Community Hub, export the JSON, then PR it into `js/data.js` (`SEED_PLANS`).
- **Code**: open issues/PRs for the scoring heuristics, translations, or new blueprints.

## 📄 License
MIT — use it, fork it, self-host it, sell against it if you dare. See `LICENSE`.

---
*Built by creators, for creators. If ViralForge earns you one video, buy the host a coffee.* ☕