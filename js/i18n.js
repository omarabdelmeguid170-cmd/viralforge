/* ============================================================
   ViralForge — i18n.js
   Bilingual shell (English / Arabic) + theme persistence.
   - LANG: document.documentElement lang/dir + dictionary lookup.
   - THEME: dark (default) / light, persisted, respects system.
   Both stored in localStorage (vf_lang / vf_theme).
   Deep generated content (plans, seeds, scripts, trend items)
   stays in English for now — the chrome, nav, headers, buttons
   and forms are fully translated.
   ============================================================ */

(function () {
  const LS = () => {
    try { return window.localStorage; } catch (e) { return null; }
  };
  const D = {
    en: {
      /* nav */
      "nav.cmd": "Command Center",
      "nav.ai": "AI Virtual Employee",
      "nav.growth": "Growth Hub",
      "nav.project": "Project",
      "nav.dashboard": "Dashboard",
      "nav.audit": "Live Channel Audit",
      "nav.trends": "24H Viral Engine",
      "nav.ctr": "CTR Predictor",
      "nav.factory": "Script & Idea Factory",
      "nav.roadmap": "Milestone Roadmaps",
      "nav.community": "Community Plan Hub",
      "nav.exchange": "Creator Exchange",
      "nav.support": "Open Source & Support",

      /* topbar / footer */
      "free": "100% FREE",
      "supportUs": "Support Us",
      "themeDark": "Switch to light mode",
      "themeLight": "Switch to dark mode",
      "langBtn": "ع",
      "langTitle": "Switch language / تغيير اللغة",
      "foot.note": "How to support us →",

      /* common */
      "common.open": "Open tool →",
      "common.back": "Back",
      "common.copy": "Copied to clipboard.",
      "common.run": "Run",
      "common.now": "Now",

      /* dashboard */
      "dash.badge": "AI EMPLOYEE ONLINE · 24/7",
      "dash.hero1": "Your channel’s full-time AI <span class=\"glow-red-text\">viral employee</span>,<br/>working while you sleep.",
      "dash.hero2": "Live audits, a 24-hour traffic engine, CTR prediction, scripts, roadmaps and a community growth army. <b style=\"color:var(--text)\">{free}</b>",
      "dash.go": "GO VIRAL",
      "dash.armed": "24h traffic engine armed",
      "dash.auditBtn": "Audit my channel",
      "dash.scanBtn": "Scan viral trends",
      "dash.startBtn": "Start a blueprint",
      "kpi.health": "Channel health",
      "kpi.grade": "grade {g}",
      "kpi.noAudit": "run an audit",
      "kpi.signals": "Trend signals",
      "kpi.scanned": "scanned {r}",
      "kpi.noScan": "scan the feed",
      "kpi.progress": "Blueprint progress",
      "kpi.active": "{n} active",
      "kpi.noActive": "pick a plan",
      "kpi.plans": "Community plans",
      "kpi.peers": "yours + peers",
      "dash.sec.employee": "AI Virtual Employee",
      "dash.sec.live": "Live snapshot",
      "dash.sec.blueprints": "Active blueprints",
      "dash.mod.audit": "Live Channel Audit",
      "dash.mod.auditD": "Instant health score + optimization plan from real metrics.",
      "dash.mod.trends": "24H Viral Traffic Engine",
      "dash.mod.trendsD": "Finds trending windows to spike views within a day.",
      "dash.mod.ctr": "Thumbnail & Title CTR Predictor",
      "dash.mod.ctrD": "Score packaging before you upload — no more guesswork.",
      "dash.mod.factory": "Script & Idea Factory",
      "dash.mod.factoryD": "Bank high-CTR ideas, hooks and full scripts instantly.",
      "dash.mod.exchange": "Creator Exchange",
      "dash.mod.exchangeD": "Safe cross-promos to jumpstart first traffic.",
      "dash.mod.community": "Community Plan Hub",
      "dash.mod.communityD": "Steal + share growth roadmaps that actually worked.",
      "dash.lastAudit": "Last channel audit",
      "dash.noAuditT": "No audit yet",
      "dash.noAuditD": "Run the live audit to arm your dashboard.",
      "dash.startAudit": "Start the audit",
      "dash.hottest": "Hottest trend right now",
      "dash.velocity": "velocity",
      "dash.views": "views",
      "dash.play": "Your play",
      "dash.openEngine": "Open the engine →",
      "dash.engineIdle": "Engine idle",
      "dash.engineIdleD": "Scan the global feed to catch your next spike window.",
      "dash.scanTrends": "Scan trends",
      "dash.actions": "actions",
      "dash.keepFree": "Keep ViralForge free, forever",
      "dash.keepFreeD": "No paywalls here, by design. If the platform earned you a single video, buy us a coffee or become a patron.",
      "dash.mission": "Your private mission station",
      "dash.missionD": "Everything you do — audits, roadmaps, plans — stays in this browser. Nothing is uploaded, tracked or sold.",
      "dash.export": "Export all data",

      /* support page */
      "sup.title1": "Open Source &amp; Support",
      "sup.tag": "100% FREE",
      "sup.sub": "{free} Built so anyone can host, fork, and improve it.",
      "sup.card1T": "Free, by architecture — not by accident",
      "sup.card1D": "ViralForge runs entirely in your browser: zero servers, zero hosted accounts, zero tracking, zero paywalls. Your YouTube API key and all your progress never leave your machine.",
      "sup.mit": "MIT license",
      "sup.howAlive": "How this platform stays alive",
      "sup.osT": "Open source",
      "sup.osD": "The whole platform is public under MIT. Fork it, self-host it, submit the community plans you want in the shared index.",
      "sup.viewSource": "View the source",
      "sup.repoSoon": "Public repo coming soon",
      "sup.donT": "Donations",
      "sup.donD": "No ads-blocking-you, no premium tier. A coffee or a dollar keeps this side project hosted for the next creator who needs it.",
      "sup.donEmpty": "Donation buttons appear here once the owner adds their funding links (see CONFIG in js/data.js).",
      "sup.adsT": "Ad zones (owner)",
      "sup.adsD": "If you self-host this, paste your ad code where the dashed slots sit: sidebar 240×400, footer 728×90. Visitors still get everything for free.",
      "sup.noPaywall": "No paywall, ever",
      "sup.contribute": "Contribute",
      "sup.planIndexT": "Submit to the plan index",
      "sup.planIndexD": "Export your community plan as JSON (Community Hub → Save), then open a PR adding it to the hosted index.",
      "sup.publishHub": "Publish via the Hub",
      "sup.codeT": "Code, translate, document",
      "sup.codeD": "Open an issue for bugs, PR translations, improve the scoring heuristics.",
      "sup.heur": "heuristics & scoring welcome",
      "sup.privacyT": "Privacy reset",
      "sup.privacyD": "Every byte ViralForge stores is in this browser only. Wipe it all below.",
      "sup.wipe": "Wipe all ViralForge data",
      "sup.foot": "ViralForge v{ver} · MIT · Built for creators, by creators.",

      /* module headers */
      "audit.h": "Live YouTube Audit",
      "audit.s": "Your 24/7 channel manager connects to your channel metrics and returns an instant health score plus an optimization playbook. No account needed — API key (optional) never leaves your browser.",
      "trends.h": "24-Hour Viral Traffic Engine",
      "trends.s": "Scans global YouTube trending data, scores each video’s viral velocity, and hands you the exact “publish now” plays that can spike your views inside 24 hours.",
      "ctr.h": "Thumbnail &amp; Title CTR Predictor",
      "ctr.s": "Drop in a thumbnail and a title. The predictor scores visual contrast, color heat, face-framing and emotional triggers — then hands you a before-upload fix list.",
      "factory.h": "Script &amp; Idea Factory",
      "factory.s": "Pick your niche and format — the factory machines ideas, hook variations, and a full script you can record today.",
      "roadmap.h": "Milestone Roadmap Hub",
      "roadmap.s": "Pre-built, step-by-step growth plans. Follow the timeline, tick the daily actions, and earn milestone badges as your channel climbs.",
      "community.h": "Community Plan Hub",
      "community.s": "Borrow battle-tested YouTube growth strategies from real creators. Upvote, rate, comment, and clone any plan into your own workspace.",
      "community.publishPlan": "Publish your plan",
      "community.upload.h": "Publish your growth plan",
      "community.upload.s": "Share the roadmap that worked (or warn others off the one that didn’t). Plans appear instantly in the marketplace.",
      "exchange.h": "Creator Exchange Network",
      "exchange.s": "Cross-promotions, niche collaborations and direct audience sharing to jumpstart video traffic — safely and without buying views."
    },
    ar: {
      "nav.cmd": "مركز القيادة",
      "nav.ai": "الموظف الذكي",
      "nav.growth": "مركز النمو",
      "nav.project": "المشروع",
      "nav.dashboard": "لوحة التحكم",
      "nav.audit": "فحص القناة المباشر",
      "nav.trends": "محرك الفيروسي 24 ساعة",
      "nav.ctr": "متنبئ النقرات CTR",
      "nav.factory": "مصنع الأفكار والسكريبت",
      "nav.roadmap": "خارطات المعالم",
      "nav.community": "مركز خطط المجتمع",
      "nav.exchange": "تبادل المبدعين",
      "nav.support": "المفتوح المصدر والدعم",

      "free": "مجاني 100%",
      "supportUs": "ادعمنا",
      "themeDark": "التبديل إلى الوضع الفاتح",
      "themeLight": "التبديل إلى الوضع الداكن",
      "langBtn": "EN",
      "langTitle": "Switch language / تغيير اللغة",
      "foot.note": "كيف تدعمنا ←",

      "common.open": "افتح الأداة ←",
      "common.back": "رجوع",
      "common.copy": "تم النسخ إلى الحافظة.",
      "common.run": "تشغيل",
      "common.now": "الآن",

      "dash.badge": "الموظف الذكي متصل · 24/7",
      "dash.hero1": "<span class=\"glow-red-text\">موظف الفيروس</span> الذكي لقناتك بدوام كامل،<br/>يعمل بينما تنام.",
      "dash.hero2": "فحوصات مباشرة، محرك فيروسي على مدار الساعة، توقع CTR، سكريبتات، خارطات وطموح نمو جماعي. <b style=\"color:var(--text)\">{free}</b>",
      "dash.go": "انطلق بقوة",
      "dash.armed": "محرك الفيروسي جاهز",
      "dash.auditBtn": "افحص قناتي",
      "dash.scanBtn": "امسح الاتجاهات الرائجة",
      "dash.startBtn": "ابدأ خارطة",
      "kpi.health": "صحة القناة",
      "kpi.grade": "درجة {g}",
      "kpi.noAudit": "إجراء فحص",
      "kpi.signals": "إشارات الاتجاهات",
      "kpi.scanned": "تم مسح {r}",
      "kpi.noScan": "امسح الموجة",
      "kpi.progress": "تقدّم الخارطة",
      "kpi.active": "{n} نشطة",
      "kpi.noActive": "اختر خطة",
      "kpi.plans": "خطط المجتمع",
      "kpi.peers": "خططك وخطوط زملائك",
      "dash.sec.employee": "الموظف الذكي",
      "dash.sec.live": "لمحة حية",
      "dash.sec.blueprints": "الخارطات النشطة",
      "dash.mod.audit": "فحص القناة المباشر",
      "dash.mod.auditD": "درجة صحة فورية وخطة تحسين من مقاييس حقيقية.",
      "dash.mod.trends": "محرك الفيروسي 24 ساعة",
      "dash.mod.trendsD": "يكشف نوافذ الاتجاهات الرائجة لرفع المشاهدات خلال يوم.",
      "dash.mod.ctr": "متنبئ CTR للصورة والعنوان",
      "dash.mod.ctrD": "قيّم غلاف الفيديو قبل الرفع — بلا تخمين.",
      "dash.mod.factory": "مصنع السكريبت والأفكار",
      "dash.mod.factoryD": "أفكار عالية CTR وخطافات وسكريبتات كاملة فوراً.",
      "dash.mod.exchange": "تبادل المبدعين",
      "dash.mod.exchangeD": "ترويج متبادل آمن يطلق أول حركة مرور لك.",
      "dash.mod.community": "مركز خطط المجتمع",
      "dash.mod.communityD": "اسرق وشارك خارطات نمو مجرّبة فعلاً.",
      "dash.lastAudit": "آخر فحص للقناة",
      "dash.noAuditT": "لا يوجد فحص بعد",
      "dash.noAuditD": "شغّل الفحص المباشر لتجهيز لوحة تحكمك.",
      "dash.startAudit": "ابدأ الفحص",
      "dash.hottest": "الاتجاه الأكثر سخونة الآن",
      "dash.velocity": "سرعة الانتشار",
      "dash.views": "مشاهدة",
      "dash.play": "خطوتك الآن",
      "dash.openEngine": "افتح المحرك ←",
      "dash.engineIdle": "المحرك خامل",
      "dash.engineIdleD": "امسح الموجة العالمية لالتقاط نافذة الانتشار التالية.",
      "dash.scanTrends": "امسح الاتجاهات",
      "dash.actions": "إجراء",
      "dash.keepFree": "أبقِ ViralForge مجانيًا للأبد",
      "dash.keepFreeD": "لا جدران دفع هنا، بالتصميم. إن كان المشروع أفادك بقدر فيديو واحد، ادعمنا بقهوة أو انضم كراعٍ.",
      "dash.mission": "محطتك الخاصة والسرية",
      "dash.missionD": "كل ما تفعله — فحوصات وخارطات وخطط — يبقى في متصفحك. لا يُرفع ولا يُتتبع ولا يُباع شيء.",
      "dash.export": "تصدير كل البيانات",

      "sup.title1": "المفتوح المصدر والدعم",
      "sup.tag": "مجاني 100%",
      "sup.sub": "{free} مبني ليستطيعه أي أحد استضافة وتحسينه.",
      "sup.card1T": "مجاني بالهندسة، لا بالمصادفة",
      "sup.card1D": "ViralForge يعمل كلياً في متصفحك: صفر خوادم، صفر حسابات، صفر تتبع، صفر جدران دفع. مفتاح YouTube الخاص بك وكل تقدمك لا يغادران جهازك أبدًا.",
      "sup.mit": "رخصة MIT",
      "sup.howAlive": "كيف يظل هذا المشروع حيًا؟",
      "sup.osT": "المفتوح المصدر",
      "sup.osD": "المشروع كله عام تحت MIT. انسخه، استضفه، وأرسل خطط المجتمع التي تريدها للفهرس المشترك.",
      "sup.viewSource": "عرض المصدر",
      "sup.repoSoon": "المستودع العام قريبًا",
      "sup.donT": "التبرعات",
      "sup.donD": "لا إعلانات تعترضك، ولا طبقة مميزة مدفوعة. قهوة أو دولار يحافظ على تشغيل المشروع للمبدع التالي.",
      "sup.donEmpty": "ستظهر أزرار التبرع هنا بمجرد أن يضيف المالك روابط التمويل (انظر CONFIG في js/data.js).",
      "sup.adsT": "مناطق الإعلان (للمالك)",
      "sup.adsD": "إن استضفت الموقع بنفسك، ضع كود إعلانك في الإطارات المنقطة: الشريط الجانبي 240×400 والتذييل 728×90.",
      "sup.noPaywall": "لا جدران دفع أبداً",
      "sup.contribute": "ساهم",
      "sup.planIndexT": "أضف خطة للفهرس",
      "sup.planIndexD": "صدّر خطتك بصيغة JSON (مركز المجتمع ← حفظ) ثم افتح PR لإضافتها للفهرس المستضاف.",
      "sup.publishHub": "انشر عبر المركز",
      "sup.codeT": "برمج، ترجم، وثّق",
      "sup.codeD": "افتح Issue للثغرات وترجم وسرّع خوارزميات التقييم.",
      "sup.heur": "الخوارزميات والتقييم قيد الترحيب",
      "sup.privacyT": "إعادة ضبط الخصوصية",
      "sup.privacyD": "كل بايت يخزنه ViralForge يبقى في متصفحك. امسحه بالكامل من الأسفل.",
      "sup.wipe": "مسح كل بيانات ViralForge",
      "sup.foot": "ViralForge الإصدار {ver} · MIT · صُنع للمبدعين، من المبدعين.",

      "audit.h": "فحص يوتيوب المباشر",
      "audit.s": "مديرك الذكي على مدار الساعة يتصل بمقاييس قناتك ويرد بدرجة صحة فورية وخطة تحسين. لا حاجة لحساب — مفتاح API (اختياري) لا يغادر متصفحك أبدًا.",
      "trends.h": "محرك الفيروسي لمدة 24 ساعة",
      "trends.s": "يمسح بيانات يوتيوب الرائجة عالمياً، يقيس سرعة انتشار كل فيديو، ويمنحك خطوات “انشر الآن” الدقيقة لرفع مشاهداتك خلال 24 ساعة.",
      "ctr.h": "متنبئ CTR للصورة والعنوان",
      "ctr.s": "ضع صورة مصغرة وعنواناً. يقيس المتنبئ التباين البصري وحرارة الألوان وتأطير الوجه والمحفزات العاطفية — ثم يمنحك قائمة إصلاحات قبل الرفع.",
      "factory.h": "مصنع السكريبت والأفكار",
      "factory.s": "اختر مجالك وصيغتك — ينتج المصنع أفكاراً وخطافات وسكريبت كاملاً يمكنك تسجيله اليوم.",
      "roadmap.h": "مركز خارطات المعالم",
      "roadmap.s": "خطط نمو جاهزة خطوة بخطوة. اتبع الجدول، فعّل الإجراءات اليومية، واحصد شارات المعالم كلما صعدت قناتك.",
      "community.h": "مركز خطط المجتمع",
      "community.s": "استعِر استراتيجيات نمو مجرّبة من مبدعين حقيقيين. صوّت، قيّم، علّق، وانسخ أي خطة إلى مساحتك.",
      "community.publishPlan": "انشر خطتك",
      "community.upload.h": "انشر خطتك للنمو",
      "community.upload.s": "شارك الخارطة التي نجحت (أو حذّر الآخرين من التي أخفقت). تظهر الخطط فوراً في السوق.",
      "exchange.h": "شبكة تبادل المبدعين",
      "exchange.s": "ترويج متبادل وتعاونات تخصصية ومشاركة جمهور مباشرة لإطلاق حركة مرور فيديوهاتك — بأمان وبدون شراء مشاهدات."
    }
  };

  const PREF_LIGHT = () => typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: light)").matches;

  window.I18n = {
    dict: D,

    init() {
      /* language */
      const l = LS() && LS().getItem("vf_lang");
      const auto = ((navigator.language || "en").toLowerCase().indexOf("ar") === 0) ? "ar" : "en";
      this.setLang(l || auto, false);

      /* theme */
      let t = LS() && LS().getItem("vf_theme");
      if (!t) t = PREF_LIGHT() ? "light" : "dark";
      this.setTheme(t, false);

      /* static chrome (nav + topbar) */
      this.applyChrome();
    },

    get lang() { return (document.documentElement.lang === "ar") ? "ar" : "en"; },
    get isAr() { return this.lang === "ar"; },
    get theme() { return document.documentElement.dataset.theme || "dark"; },

    t(key, vars) {
      const dict = this.dict[this.lang] || this.dict.en;
      const en = this.dict.en[key];
      let s = dict[key] || en || key;
      if (vars) for (const k in vars) s = s.split("{" + k + "}").join(String(vars[k]));
      return s;
    },

    setLang(lang, persist = true) {
      if (lang !== "ar") lang = "en";
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      if (persist && LS()) { try { LS().setItem("vf_lang", lang); } catch (e) {} }
      this.applyChrome().applyButtons();
      if (persist && window.Router && document.readyState !== "loading") {
        try { Router.render(); } catch (e) {}
      }
    },

    toggleLang() { this.setLang(this.lang === "ar" ? "en" : "ar"); },

    setTheme(theme, persist = true) {
      if (theme !== "light") theme = "dark";
      document.documentElement.dataset.theme = theme;
      if (persist && LS()) { try { LS().setItem("vf_theme", theme); } catch (e) {} }
      this.applyButtons();
    },

    toggleTheme() { this.setTheme(this.theme === "dark" ? "light" : "dark"); },

    /* static chrome: sidebar nav labels + footer note (rendered once in HTML) */
    applyChrome() {
      document.querySelectorAll("[data-nav]").forEach((a) => {
        const key = "nav." + a.getAttribute("data-nav");
        const target = a.querySelector("span:last-child");
        if (target) target.textContent = LV(this.t(key));
      });
      document.querySelectorAll("[data-navgroup]").forEach((g) => {
        g.textContent = this.t("nav." + g.getAttribute("data-navgroup"));
      });
      const foot = document.getElementById("footNote");
      if (foot) foot.innerHTML = "<b>ViralForge</b> is 100% free, forever. Open source under MIT. <a href=\"#/support\">" + this.t("foot.note") + "</a>";
      return this;
    },

    applyButtons() {
      const themeBtn = document.getElementById("btnTheme");
      const ico = document.getElementById("themeIco");
      if (ico) {
        const sun = window.VF && VF.lucideIcon ? VF.lucideIcon(this.theme === "dark" ? "sun" : "moon") : (this.theme === "dark" ? "&#9788;" : "&#9789;");
        ico.innerHTML = sun;
      }
      if (themeBtn) themeBtn.title = this.t(this.theme === "dark" ? "themeDark" : "themeLight");
      const langBtn = document.getElementById("btnLang");
      const lbl = document.getElementById("langLbl");
      if (lbl) lbl.textContent = this.t("langBtn");
      if (langBtn) langBtn.title = this.t("langTitle");
      const don = document.getElementById("navDonate");
      if (don) don.innerHTML = "<span>&#9749;</span> " + LV(this.t("supportUs"));
      const free = document.getElementById("badgeFree");
      if (free) free.textContent = LV(this.t("free"));
      return this;
    }
  };

  function LV(s) { return s.replace(/&amp;/g, "&").replace(/&#8594;/g, "→").replace(/&#8599;/g, "↗"); }

  /* global translate helper for all modules */
  window.T = (k, v) => window.I18n ? I18n.t(k, v) : k;
})();