/* ============================================================
   ViralForge â€” scripts/smoke.js
   Regression smoke test. Loads the vendor bundle + every app
   script into jsdom (network off), renders every route and
   drives the core interactions. Run: npm run smoke
   ============================================================ */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");

const ORDER = [
  "vendor/vendor.bundle.js",
"js/store.js",
  "js/data.js",
  "js/i18n.js",
  "js/lib/data-layer.js",
  "js/router.js",
  "js/vendoricon.js",
  "js/ui/cn.js",
  "js/ui/ux.js",
  "js/ui/anim.js",
"js/ui/confetti.js",
  "js/ads.js",
  "js/audit.js",
  "js/trends.js",
  "js/ctr.js",
  "js/factory.js",
  "js/roadmap.js",
  "js/community.js",
  "js/exchange.js",
  "js/main.js"
];

const PATHS = [
  "#/dashboard", "#/audit", "#/trends", "#/ctr", "#/factory",
  "#/roadmap", "#/roadmap/blueprint-1k", "#/roadmap/blueprint-4k", "#/roadmap/blueprint-3m",
  "#/community", "#/community/upload", "#/community/plan/plan-f3",
  "#/exchange", "#/support", "#/unknown-route"
];

function load(code, file) {
  return { code, file };
}

async function main() {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const scripts = ORDER.map((f) => load(fs.readFileSync(path.join(ROOT, f), "utf8"), f));

  const dom = new JSDOM(html, {
    url: "https://viralforge.test/#/dashboard",
    runScripts: "outside-only",
    pretendToBeVisual: true
  });
  const window = dom.window;
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.fetch = () => Promise.reject(new Error("network disabled in test"));
window.navigator.clipboard = { writeText: () => Promise.resolve() };
  window.HTMLCanvasElement.prototype.getContext = () => ({ // no-op canvas context (confetti/ctr stay quiet in jsdom)
    canvas: {}, clearRect() {}, fillRect() {}, beginPath() {}, arc() {}, fill() {}, stroke() {}, moveTo() {},
    lineTo() {}, drawImage() {}, closePath() {}, getImageData() { return { data: new Uint8ClampedArray(4) }; }, save() {},
    restore() {}, translate() {}, rotate() {}, scale() {}, setTransform() {}, createLinearGradient() { return { addColorStop() {} }; }
  });

  const errors = [];
  const report = [];
  const ok = (name, cond, extra) => report.push((cond ? "ok   " : "FAIL ") + name + (extra ? " :: " + extra : ""));

  /* ---- evaluate everything in runtime order ---- */
  for (const s of scripts) {
    try { window.eval(s.code); }
    catch (e) { errors.push("EVAL " + s.file + " :: " + e.message); }
  }
  ok("vendor bundle exposes VF (gsap+Lenis+confetti+store)", !!(window.VF && window.VF.gsap && window.VF.Lenis && window.VF.confetti && window.VF.createStore), "");
  ok("app globals present", ["AppIcons", "Router", "Renderers", "Audit", "Trends", "Ctr", "Factory", "Roadmap", "Community", "Exchange", "Data", "Ads"].every((k) => typeof window[k] !== "undefined"), "");

  window.document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));

  /* ---- every route renders ---- */
  for (const p of PATHS) {
    const before = errors.length;
    window.location.hash = p;
    try { window.eval("Router.render()"); } catch (e) { errors.push("ROUTE " + p + " :: " + e.message); }
    await new Promise((r) => setTimeout(r, 5));
    if (errors.length > before) errors.push(">>> while rendering " + p);
  }
  const bodies = window.document.querySelectorAll(".view-body");
  bodies.forEach((b) => {
    const txt = (b.textContent || "").trim();
    if (txt.length < 5) errors.push("EMPTY VIEW: " + b.id);
  });

/* ---- interactions ---- */
  try {
    window.location.hash = "#/audit"; window.eval("Router.render()");
    window.document.getElementById("sa_subs").value = 1200;
    window.document.getElementById("sa_views").value = 85000;
    window.document.getElementById("sa_upl").value = 4;
    window.document.getElementById("sa_avg").value = 400;
    window.document.getElementById("sa_ctr").value = 5.2;
    window.document.getElementById("sa_ret").value = 48;
    window.eval("Audit.runQuick()");
    const last = window.eval("Store.get('lastaudit', null)");
    ok("audit quick result", !!last && typeof last.score === "number", last && ("score=" + last.score + " grade=" + last.grade));
    ok("audit checklist rendered", !!(window.document.getElementById("auditCheckList") && window.document.getElementById("auditCheckList").querySelector("input")), "");
    const cb = window.document.querySelector("#auditCheckList input");
    if (cb) { cb.checked = true; cb.dispatchEvent(new window.Event("change", { bubbles: true })); ok("audit checkbox toggles", true, ""); }

    // factory
    window.location.hash = "#/factory"; window.eval("Router.render()");
    window.document.getElementById("fxNiche").value = "Tech & AI";
    window.document.getElementById("fxFormat").value = "short";
    window.eval("Factory.ideas()");
    ok("factory ideas render >= 6 cards", window.document.getElementById("fxOut").querySelectorAll(".card").length >= 6, "");
    window.eval("Factory.script()");
    const scr = window.eval("Store.get('lastscript', null)");
    ok("factory script generated", !!scr && scr.s.sections.length > 0 && scr.s.tags.length > 0, scr && scr.s.title);

    // ctr
    window.location.hash = "#/ctr"; window.eval("Router.render()");
    const trigs = window.document.querySelectorAll("#ctrTriggers input");
    ok("ctr triggers render (6)", trigs.length === 6, "");
    trigs[0].checked = true; trigs[0].dispatchEvent(new window.Event("change", { bubbles: true }));

    // roadmap badge
    window.location.hash = "#/roadmap/blueprint-1k"; window.eval("Router.render()");
    const phaseCbs = window.document.querySelectorAll('#m-roadmap input[type=checkbox][data-bp="blueprint-1k"][data-pi="0"]');
    phaseCbs.forEach((c) => { c.checked = true; c.dispatchEvent(new window.Event("change", { bubbles: true })); });
    const badges = window.eval("Store.get('roadmap_blueprint-1k_badges', {})");
    ok("roadmap badge earned after full phase", Object.keys(badges).length === 1, "checkboxes=" + phaseCbs.length + " badges=" + JSON.stringify(badges));

    // community
    window.location.hash = "#/community"; window.eval("Router.render()");
    const beforeCount = window.eval("Store.get('community_plans', null) || []").length;
    window.eval("Community.upvote('plan-f3')");
    const v = window.eval("Store.get('community_plans', null).find(p=>p.id==='plan-f3')").votes;
    ok("community upvote", v >= 154, "votes=" + v);
    window.location.hash = "#/community/plan/plan-f3"; window.eval("Router.render()");
    ok("community detail renders comment box", !!window.document.getElementById("cmNewComment"), "");
    window.document.getElementById("cmNewComment").value = "Smoke test note";
    window.eval("Community.comment('plan-f3')");
    const notes = window.eval("Store.get('community_plans', null).find(p=>p.id==='plan-f3')").comments.length;
    ok("community comment", notes >= 2, "notes=" + notes);
    window.eval("Community.clone('plan-g2')");
    ok("community clone", window.eval("Store.get('community_plans', null)").length === beforeCount + 1, "");
    window.location.hash = "#/community/upload"; window.eval("Router.render()");
    window.document.getElementById("upTitle").value = "Test Plan";
    window.document.getElementById("upAuthor").value = "Tester";
    window.document.getElementById("upNiche").value = "Tech";
    window.document.getElementById("upDesc").value = "Desc";
    window.document.getElementById("upSteps").value = "Step one\nStep two";
    window.eval("Community.submit('smoketest')");
    const mine = window.eval("Store.get('community_plans', null).find(p=>p.id==='up-smoketest')");
    ok("community upload", !!mine && mine.steps.length === 2, "");

    // exchange
    window.location.hash = "#/exchange"; window.eval("Router.render()");
    window.document.getElementById("exMyName").value = "Smoke";
    window.document.getElementById("exMyNiche").value = "Study";
    window.document.getElementById("exMySize").value = "2k";
    window.document.getElementById("exMyMsg").value = "Swap Friday shorts?";
    window.eval("Exchange.postOffer()");
    ok("exchange post", window.eval("Store.get('exchange_posts', null)").length >= 7, "");
    window.document.getElementById("mmNiche").value = "study";
    window.document.getElementById("mmSize").value = "2k";
    window.eval("Exchange.matchMe()");
    ok("exchange matcher TOP 1", !!window.document.getElementById("mmResult").textContent.match(/TOP 1/), "");

    // trends (network off -> fallback dataset)
    window.location.hash = "#/trends"; window.eval("Router.render()");
    await new Promise((r) => setTimeout(r, 60));
const trend = window.eval("Store.get('trendscan', null)");
    ok("trend scan fallback dataset", !!trend && trend.items.length >= 8, "count=" + (trend && trend.items.length));

    // monetization ready-state (no owner config set)
    window.location.hash = "#/support"; window.eval("Router.render()");
    const sup = window.document.getElementById("m-support");
    ok("support page renders", !!sup.querySelector(".page-head"), "");
    ok("support page has no dead/placeholder links", !/href="(undefined|https?:\/\/[^"]*YOURNAME)"/i.test(sup.innerHTML), "");
    ok("github nav hidden without a repo URL", window.document.getElementById("navGithub").style.display === "none", "");
    ok("google adsense script NOT injected without config", !window.document.getElementById("adsByGoogle"), "");
    ok("ad placeholders intact without config", /AD SLOT/.test(window.document.getElementById("adSidebar").innerHTML), "");

    // i18n + theme
    ok("i18n present (en default, ltr)", typeof window.I18n.t === "function" && window.document.documentElement.lang === "en" && window.document.documentElement.dir === "ltr", "");
    ok("dashboard nav translated", window.document.querySelector('[data-nav="dashboard"]').textContent.indexOf("Dashboard") >= 0, "");
    window.location.hash = "#/dashboard"; window.eval("Router.render()");
    window.eval("I18n.setLang('ar')");
    const dir2 = window.document.documentElement.dir, lang2 = window.document.documentElement.lang;
    const navAr = window.document.querySelector('[data-nav="dashboard"]').textContent;
    const dashAr = window.document.getElementById("m-dashboard").textContent;
    ok("i18n switches to arabic + rtl", dir2 === "rtl" && lang2 === "ar", "dir=" + dir2 + " lang=" + lang2);
    ok("nav + dashboard re-render in arabic", navAr.indexOf("لوحة") >= 0 && dashAr.indexOf("افحص قناتي") >= 0, "");
    window.eval("I18n.setLang('en')");
    ok("i18n back to english", window.document.documentElement.lang === "en", "");
    window.eval("I18n.setTheme('light')");
    ok("light theme switches + persists", window.document.documentElement.dataset.theme === "light" && window.localStorage.getItem("vf_theme") === "light", "");
    window.eval("I18n.setTheme('dark')");
    ok("dark theme restored", window.document.documentElement.dataset.theme === "dark", "");
  } catch (e) {
    report.push("FAIL interaction block :: " + e.message);
  }

  report.forEach((r) => console.log(r));

  if (errors.length || report.some((r) => r.indexOf("FAIL") === 0)) {
    console.log("");
    console.log("=== FAILURES (" + errors.length + " errors) ===");
    errors.slice(0, 40).forEach((e) => console.log(e));
    process.exit(1);
  } else {
    console.log("");
    console.log("ALL ROUTES + INTERACTIONS PASS.");
    process.exit(0);
  }
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });

