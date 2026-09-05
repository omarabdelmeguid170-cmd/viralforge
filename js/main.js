/* ============================================================
   ViralForge — main.js
   Boot, router wiring, dashboard, support page, shared UI utils.
   ============================================================ */

(function () {
  /* ================= shared utils (Renderers) ================= */
  function toast(msg, type) {
    const wrap = document.getElementById("toastWrap");
    if (!wrap) return;
    const t = document.createElement("div");
    t.className = window.Ui
      ? Ui.cn("toast", type === "good" ? "good" : type === "bad" ? "bad" : "")
      : ("toast " + (type || ""));
    t.innerHTML = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = ".4s"; }, 2800);
    setTimeout(() => t.remove(), 3300);
  }

  function copy(text, okMsg) {
    const done = () => toast(okMsg || "Copied to clipboard.", "good");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else fallbackCopy(text, done);
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { toast("Copy failed — select manually.", "bad"); }
    ta.remove();
  }

  function download(name, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function fmt(n) { n = Math.round(n || 0); return n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : "" + n; }

  window.Renderers = { toast, copy, download, esc, fmt };

  /* ================= dashboard ================= */
  function dashboard() {
    const el = document.getElementById("m-dashboard");
    const lastAudit = Store.get("lastaudit", null);
    const trend = Store.get("trendscan", null);
    const roadmapPct = Math.round(window.BLUEPRINTS.reduce((a, b) => a + Roadmap.progressOf(b).pct, 0) / window.BLUEPRINTS.length);
    const communityCount = (Store.get("community_plans", null) || window.SEED_PLANS).length;
    const active = window.BLUEPRINTS.filter((b) => Roadmap.progressOf(b).done > 0).length;

    el.innerHTML =
      /* hero */
      '<div class="card glow-red noise-glow" style="border:none;background:var(--hero-grad);padding:26px">' +
      '<div class="flex col-wrap gap-12" style="align-items:center;flex-wrap:wrap">' +
      '<div class="grow">' +
      '<div class="flex gap-8 wrap align-center mb-8">' +
      '<span class="badge-pill earned"><span class="badge-ico">&#9679;</span> ' + T("dash.badge") + '</span>' +
      '<span class="tag tag-cyan">Open source · v' + CONFIG.version + '</span>' +
      '</div>' +
      '<h1 style="font-size:30px;font-weight:900;letter-spacing:-.5px;line-height:1.15">' + T("dash.hero1") + '</h1>' +
      '<p class="mt-12" style="max-width:680px;color:var(--muted)">' + T("dash.hero2", { free: CONFIG.free }) + '</p>' +
      '</div>' +
      '<div class="center">' +
      '<div class="badge-pill earned" style="font-size:26px;padding:16px 22px">' + AppIcons.rocket + ' ' + T("dash.go") + '</div>' +
      '<div class="small dim mt-8">' + T("dash.armed") + '</div>' +
      '</div>' +
      '</div>' +
      '<div class="flex wrap gap-8 mt-16">' +
      '<a class="btn btn-primary btn-lg" href="#/audit">' + AppIcons.pulse + ' ' + T("dash.auditBtn") + '</a>' +
      '<a class="btn btn-cyan btn-lg" href="#/trends">' + AppIcons.bolt + ' ' + T("dash.scanBtn") + '</a>' +
      '<a class="btn btn-ghost btn-lg" href="#/roadmap">' + AppIcons.map + ' ' + T("dash.startBtn") + '</a>' +
      '</div>' +
      '</div>' +

      /* KPI row */
      '<div class="grid grid-4 mt-16">' +
      kpi(lastAudit ? lastAudit.score : "—", T("kpi.health"), lastAudit ? T("kpi.grade", { g: lastAudit.grade }) : T("kpi.noAudit"), "red", AppIcons.chart) +
      kpi(trend ? trend.items.length : "—", T("kpi.signals"), trend ? T("kpi.scanned", { r: trend.region || "" }) : T("kpi.noScan"), "cyan", AppIcons.bolt) +
      kpi(roadmapPct + "%", T("kpi.progress"), active ? T("kpi.active", { n: active }) : T("kpi.noActive"), "green", AppIcons.map) +
      kpi(communityCount, T("kpi.plans"), T("kpi.peers"), "purple", AppIcons.users) +
      '</div>' +

      /* command grid */
      '<div class="section-title">' + T("dash.sec.employee") + ' <span class="line"></span></div>' +
      '<div class="grid grid-3">' +
      moduleCard(AppIcons.pulse, "#/audit", T("dash.mod.audit"), T("dash.mod.auditD"), "red") +
      moduleCard(AppIcons.bolt, "#/trends", T("dash.mod.trends"), T("dash.mod.trendsD"), "cyan") +
      moduleCard(AppIcons.eye, "#/ctr", T("dash.mod.ctr"), T("dash.mod.ctrD"), "green") +
      moduleCard(AppIcons.pen, "#/factory", T("dash.mod.factory"), T("dash.mod.factoryD"), "purple") +
      moduleCard(AppIcons.swap, "#/exchange", T("dash.mod.exchange"), T("dash.mod.exchangeD"), "red") +
      moduleCard(AppIcons.users, "#/community", T("dash.mod.community"), T("dash.mod.communityD"), "cyan") +
      '</div>' +

      /* live panels */
      '<div class="section-title">' + T("dash.sec.live") + ' <span class="line"></span></div>' +
      '<div class="grid grid-2">' +
      (lastAudit ?
        '<div class="card glow-red"><h3 class="card-title">' + AppIcons.pulse + ' ' + T("dash.lastAudit") + '</h3>' +
        '<div class="flex gap-16 wrap" style="align-items:center" class="mt-8">' +
        '<div><div class="stat-num" style="font-size:44px;font-weight:900">' + lastAudit.score + '<small>/100</small></div><div class="small dim">' + esc(lastAudit.channel) + '</div></div>' +
        '<div class="grow">' + Object.keys(lastAudit.grades).map((k) => barRow(k, lastAudit.grades[k])).join("") + '</div>' +
        '</div><a class="btn btn-ghost btn-sm mt-12" href="#/audit">' + T("common.run") + ' &#8594;</a></div>' :
        '<div class="card"><div class="empty-state" style="border:none;padding:26px"><div class="big">📊</div><b>' + T("dash.noAuditT") + '</b><br/><span class="dim">' + T("dash.noAuditD") + '</span><br/><a class="btn btn-primary btn-sm mt-12" href="#/audit" style="margin-top:12px">' + T("dash.startAudit") + '</a></div></div>') +
      (trend && trend.items.length ?
        '<div class="card glow-cyan"><h3 class="card-title">' + AppIcons.bolt + ' ' + T("dash.hottest") + '</h3>' +
        '<p style="font-weight:700;margin-top:6px">' + esc(trend.items[0].title) + '</p>' +
        '<div class="flex wrap gap-8 mt-12">' +
        '<span class="badge-pill ' + (trend.items[0].score >= 70 ? "earned" : "next") + '">' + trend.items[0].score + ' ' + T("dash.velocity") + '</span>' +
        '<span class="tag tag-red">' + trend.items[0].label + '</span>' +
        '<span class="tag tag-green">' + fmt(trend.items[0].views) + ' ' + T("dash.views") + '</span>' +
        '</div><div class="divider"></div><p class="small dim">' + T("dash.play") + ': ' + (trend.dfyS && trend.dfyS[0] ? esc(trend.dfyS[0].action) : "react / test / break it down in a Short, publish within 6h.") + '</p>' +
        '<a class="btn btn-ghost btn-sm mt-12" href="#/trends">' + T("dash.openEngine") + '</a></div>' :
        '<div class="card"><div class="empty-state" style="border:none;padding:26px"><div class="big">⚡</div><b>' + T("dash.engineIdle") + '</b><br/><span class="dim">' + T("dash.engineIdleD") + '</span><br/><a class="btn btn-cyan btn-sm mt-12" href="#/trends">' + T("dash.scanTrends") + '</a></div></div>') +
      '</div>' +

      /* roadmaps row */
      '<div class="section-title">' + T("dash.sec.blueprints") + ' <span class="line"></span></div>' +
      '<div class="grid grid-3">' +
      window.BLUEPRINTS.map((b) => {
        const p = Roadmap.progressOf(b);
        return '<a class="card interactive ' + { red: "glow-red", cyan: "glow-cyan", green: "glow-green" }[b.grad] + '" href="#/roadmap/' + b.id + '" style="text-decoration:none;color:inherit">' +
          '<div class="flex gap-8" style="align-items:center"><b style="flex:1">' + esc(b.title) + '</b><span class="tag tag-' + b.grad + '">' + p.pct + '%</span></div>' +
          '<div class="bar bar-' + b.grad + ' mt-12"><span style="width:' + p.pct + '%"></span></div>' +
          '<div class="small dim mt-8">' + p.done + '/' + p.tot + ' ' + T("dash.actions") + '</div></a>';
      }).join("") +
      '</div>' +

      /* ad + donation interstitial */
      '<div class="grid grid-2 mt-16" style="grid-template-columns:1fr 1fr">' +
      '<div class="card glow-green" onclick="window.location.hash=\'#/support\'" style="cursor:pointer">' +
      '<h3 class="card-title">' + AppIcons.heart + ' ' + T("dash.keepFree") + '</h3>' +
      '<p class="small muted">' + T("dash.keepFreeD") + '</p>' +
      '<div class="flex wrap gap-8 mt-12">' +
      '<span class="chip chip-green">BuyMeACoffee &#8599;</span><span class="chip chip-amber">Patreon &#8599;</span><span class="chip chip-cyan">GitHub sponsor &#8599;</span>' +
      '</div></div>' +
      '<div class="card"><h3 class="card-title">' + AppIcons.coins + ' ' + T("dash.mission") + '</h3>' +
      '<p class="small muted">' + T("dash.missionD") + '</p>' +
      '<div class="flex gap-8 wrap mt-12"><button class="btn btn-ghost btn-sm" onclick="Renderers.download(\'viralforge-export.json\', JSON.stringify(statusExport(), null, 2))">' + AppIcons.download + ' ' + T("dash.export") + '</button></div></div>' +
      '</div>';

    /* roadmap + donation rows end */
  }

  function kpi(num, label, sub, grad, ic) {
    const colors = { red: "var(--red)", cyan: "var(--cyan)", green: "var(--green)", purple: "var(--purple)" };
    return '<div class="card"><div class="stat"><div class="stat-ico" style="background:' + colors[grad] + '1a;color:' + colors[grad] + '">' + ic + '</div>' +
      '<div><div class="stat-num">' + num + '</div><div class="stat-name">' + label + '</div><div class="small dim">' + sub + '</div></div></div></div>';
  }

  function moduleCard(icon, href, title, desc, grad) {
    const colors = { red: "var(--red)", cyan: "var(--cyan)", green: "var(--green)", purple: "var(--purple)" };
    return '<a class="card interactive hover-lift" href="' + href + '" style="text-decoration:none;color:inherit">' +
      '<div class="stat-ico" style="background:' + colors[grad] + '1a;color:' + colors[grad] + ';margin-bottom:12px">' + icon + '</div>' +
      '<b>' + title + '</b><p class="small muted mt-8">' + desc + '</p>' +
      '<p class="small mt-12" style="color:' + colors[grad] + '">' + T("common.open") + '</p></a>';
  }

  function barRow(label, grade) {
    const w = { A: 90, B: 78, C: 62, D: 48, F: 25 }[grade] || 50;
    const c = { A: "green", B: "cyan", C: "amber", D: "red", F: "red" }[grade] || "amber";
    return '<div class="meter mt-8"><div style="flex:1"><div class="meter-top"><span class="small dim" style="text-transform:uppercase;font-size:10.5px">' + label + '</span><span class="small" style="font-weight:800">' + grade + '</span></div>' +
      '<div class="bar bar-' + c + '"><span style="width:' + w + '%"></span></div></div></div>';
  }

  function statusExport() {
    const keys = Object.keys(localStorage).filter((k) => k.indexOf("vf_") === 0);
    const data = {};
    keys.forEach((k) => { try { data[k] = JSON.parse(localStorage.getItem(k)); } catch (e) { data[k] = localStorage.getItem(k); } });
    return { exported: new Date().toISOString(), app: CONFIG.name, data };
  }

  /* ================= support ================= */
  function support() {
    const el = document.getElementById("m-support");
    const repo = CONFIG.repoUrl ? CONFIG.repoUrl.split("#")[0] : null;
    const donateRow = (function () {
      const bmc = CONFIG.buymeacoffee, pat = CONFIG.patreon;
      if (!bmc && !pat) return '<p class="small dim mt-12">Donation buttons appear here once the owner adds their funding links (see CONFIG in js/data.js).</p>';
      let h = '<div class="flex gap-8 wrap mt-12">';
      if (bmc) h += '<a class="btn btn-donate btn-sm" href="' + bmc + '" target="_blank" rel="noopener">BuyMeACoffee &#8599;</a>';
      if (pat) h += '<a class="btn btn-donate btn-sm" href="' + pat + '" target="_blank" rel="noopener">Patreon &#8599;</a>';
      return h + '</div>';
    })();
    const sourceBtn = repo
      ? '<a class="btn btn-ghost btn-sm mt-12" href="' + repo + '" target="_blank" rel="noopener">' + AppIcons.link + ' View the source</a>'
      : '<span class="chip chip-green mt-12">Public repo coming soon</span>';
    const repoFooter = repo
      ? '<a class="btn btn-ghost btn-sm mt-12" href="' + repo + '" target="_blank" rel="noopener">' + AppIcons.external + ' github.com/' + esc(repo.replace(/^https?:\/\/(www\.)?github\.com\//, "")) + '</a>'
      : '';
    el.innerHTML =
      '<div class="page-head">' +
      '<h1 class="page-title">' + AppIcons.heart + ' ' + T("sup.title1") + ' <span class="tag tag-green">' + T("sup.tag") + '</span></h1>' +
      '<p class="page-sub">' + T("sup.sub", { free: CONFIG.free }) + '</p>' +
      '</div>' +

      '<div class="card glow-green noise-glow" style="background:var(--support-grad);border:none">' +
      '<div class="flex wrap gap-20" style="align-items:center">' +
      '<div style="font-size:64px;line-height:1">' + AppIcons.crown + '</div>' +
      '<div class="grow">' +
      '<h2 class="card-title" style="font-size:22px">' + T("sup.card1T") + '</h2>' +
      '<p class="small muted mt-8">' + T("sup.card1D") + '</p>' +
      '</div>' +
      '<div class="badge-pill earned" style="font-size:14px">' + T("sup.mit") + '</div>' +
      '</div></div>' +

      '<div class="section-title">' + T("sup.howAlive") + ' <span class="line"></span></div>' +
      '<div class="grid grid-3">' +
      '<div class="card hover-lift"><div class="stat-ico" style="background:rgba(0,229,255,.12);color:var(--cyan)">' + AppIcons.world + '</div><h3 class="card-title">' + T("sup.osT") + '</h3>' +
      '<p class="small muted">' + T("sup.osD") + '</p>' +
      sourceBtn + '</div>' +
      '<div class="card hover-lift"><div class="stat-ico" style="background:rgba(255,181,71,.12);color:var(--amber)">' + AppIcons.coins + '</div><h3 class="card-title">' + T("sup.donT") + '</h3>' +
      '<p class="small muted">' + T("sup.donD") + '</p>' +
      donateRow + '</div>' +
      '<div class="card hover-lift"><div class="stat-ico" style="background:rgba(255,0,0,.12);color:var(--red-soft)">' + AppIcons.tv + '</div><h3 class="card-title">' + T("sup.adsT") + '</h3>' +
      '<p class="small muted">' + T("sup.adsD") + '</p>' +
      '<span class="chip chip-red mt-12">' + T("sup.noPaywall") + '</span></div>' +
      '</div>' +

      '<div class="section-title">' + T("sup.contribute") + ' <span class="line"></span></div>' +
      '<div class="grid grid-3">' +
      '<div class="card"><div class="stat-ico" style="background:rgba(0,255,136,.12);color:var(--green)">' + AppIcons.users + '</div><h3 class="card-title">' + T("sup.planIndexT") + '</h3>' +
      '<p class="small muted">' + T("sup.planIndexD") + '</p>' +
      '<button class="btn btn-ghost btn-sm mt-12" onclick="window.location.hash=\'#/community/upload\'">' + AppIcons.upload + ' ' + T("sup.publishHub") + '</button></div>' +
      '<div class="card"><div class="stat-ico" style="background:rgba(169,123,255,.12);color:var(--purple)">' + AppIcons.sparkle + '</div><h3 class="card-title">' + T("sup.codeT") + '</h3>' +
      '<p class="small muted">' + T("sup.codeD") + '</p>' +
      '<span class="chip chip-purple mt-12">' + T("sup.heur") + '</span></div>' +
      '<div class="card"><div class="stat-ico" style="background:rgba(255,0,0,.12);color:var(--red-soft)">' + AppIcons.shield + '</div><h3 class="card-title">' + T("sup.privacyT") + '</h3>' +
      '<p class="small muted">' + T("sup.privacyD") + '</p>' +
      '<button class="btn btn-ghost btn-sm mt-12" style="color:var(--danger)" onclick="Renderers.wipe()">' + AppIcons.trash + ' ' + T("sup.wipe") + '</button></div>' +
      '</div>' +

      '<div class="divider"></div>' +
      '<div class="center"><p class="small dim">' + T("sup.foot", { ver: CONFIG.version }) + '<br/>' + esc(CONFIG.tagline) + '</p>' +
      repoFooter + '</div>';
  }

  Renderers.wipe = function () {
    if (!confirm("Delete ALL ViralForge data in this browser? This cannot be undone.")) return;
    Object.keys(localStorage).filter((k) => k.indexOf("vf_") === 0).forEach((k) => localStorage.removeItem(k));
    Renderers.toast("All data wiped. Fresh start — go build.", "good");
    window.location.hash = "#/dashboard";
    Router.render();
  };

  /* ================= boot ================= */
  function boot() {
    /* language + theme (nav/topbar labels, dir, persisted) */
    if (window.I18n) { try { I18n.init(); } catch (e) {} }

    /* global smooth scroll (Lenis) */
    if (window.Smooth) { try { Smooth.init(); } catch (e) {} }

    /* push external config links into header */
    try {
      const gh = document.getElementById("navGithub");
      if (CONFIG.repoUrl) { gh.href = CONFIG.repoUrl.split("#")[0]; gh.title = "Fork ViralForge on GitHub"; }
      else { gh.style.display = "none"; }
    } catch (e) {}

    /* monetization zones (AdSense / sponsor) — only activates when configured */
    if (window.Ads) { try { Ads.init(); } catch (e) {} }

    /* routes */
    Router.register("dashboard", dashboard);
    Router.register("audit", Audit.render);
    Router.register("trends", Trends.render);
    Router.register("ctr", Ctr.render);
    Router.register("factory", Factory.render);
    Router.register("roadmap", Roadmap.render);
    Router.register("roadmap/:1", Roadmap.detail);
    Router.register("community", Community.render);
    Router.register("community/upload", Community.upload);
    Router.register("community/plan/:2", Community.detail);
    Router.register("exchange", Exchange.render);
    Router.register("support", support);

    Router.init();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();