/* ============================================================
   ViralForge — audit.js
   AI Virtual Employee · Live YouTube Audit.
   Real data via optional YouTube Data API v3 key (stays in your
   browser), or offline Quick Self-Assessment. Produces a health
   score + optimization plan.
   ============================================================ */

(function () {
  const SCOPE = "auditplan";

  function fmt(n) {
    n = Math.round(n);
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return "" + n;
  }

  function gradeOf(v) { return v >= 21 ? "A" : v >= 16 ? "B" : v >= 11 ? "C" : v >= 6 ? "D" : "F"; }

  /* ---- scoring engine ---- */
  function scoreFrom(m) {
    const s = {};
    s.subs = Math.min(25, Math.log10(Math.max(10, m.subs)) * 6.2);
    const ratio = m.avgViews / Math.max(1, m.subs);
    s.engage = Math.min(25, Math.max(0, ratio * 20 + 3));
    s.pack = Math.min(25, Math.max(0, ((m.ctr - 2) / 8) * 25));
    s.ret = Math.min(25, Math.max(0, ((m.ret - 30) / 40) * 25));
    if (m.uploadsPerMonth >= 4) s.cons = 25;
    else if (m.uploadsPerMonth === 3) s.cons = 22;
    else if (m.uploadsPerMonth === 2) s.cons = 17;
    else if (m.uploadsPerMonth === 1) s.cons = 10;
    else s.cons = 3;
    s.total = Math.round(s.subs + s.engage + s.cons + s.pack + s.ret);
    s.total = Math.max(3, Math.min(100, s.total));

    s.grade = s.total >= 90 ? "A" : s.total >= 75 ? "B" : s.total >= 60 ? "C" : s.total >= 45 ? "D" : "F";
    s.grades = {
      Audience: gradeOf(s.subs),
      Engagement: gradeOf(s.engage),
      Consistency: gradeOf(s.cons),
      Packaging: gradeOf(s.pack),
      Retention: gradeOf(s.ret)
    };
    return s;
  }

  function recs(m, s) {
    const out = [];
    const push = (t, module, who) => out.push({ t, module, who });
    if (s.grades.Audience === "F" || s.grades.Audience === "D") push("Do a hashtag + niche audit. Your subscriber base is thin — this is the phase for clarity, not content spray.", "factory");
    if (s.grades.Engagement === "F" || s.grades.Engagement === "D") push("Average views are far below your subscriber count. Improve next-video suggestibility: end screens, cards, and binge series.", "factory");
    if (m.uploadsPerMonth < 3) push("Posting under 3x/month starves the algorithm. Set a 1 long-form + 2 Shorts weekly floor.", "trends");
    if (m.uploadsPerMonth === 0) push("Zero uploads in 30 days: the channel is dormant. Restart with a 3-video launch window instead of a random upload.", "roadmap");
    if (s.grades.Packaging === "F" || s.grades.Packaging === "D") push("Thumbnails/titles underperform. Run every thumbnail through the CTR Predictor before upload and target 5%+ CTR.", "ctr");
    if (s.grades.Retention === "F" || s.grades.Retention === "D") push("Retention under 40% caps reach. Cut every intro to under 10s and add a pattern interrupt every 90 seconds.", "ctr");
    if (s.subs < 500) push("Sub-count under 500: double down on Shorts discovery to flood your subscriber base with high-intent viewers.", "trends");
    if (m.avgViews < 200) push("This channel is invisible per-video. One Short a day for 14 days can restart the recommendation cycle.", "trends");

    if (!out.length) push("Solid foundation. Next step: scale output — more long-forms per week and defend packaging quality.", "roadmap");
    // fill to 5
    const extra = [
      ["Pin a channel trailer with your best 40 seconds.", "roadmap"],
      ["Reply to every comment within 24h for the first 3 weeks.", "exchange"],
      ["Write clickbait-honest titles: specific promise + curiosity.", "factory"],
      ["Create a binge stack (parts 1-2-3) to raise suggestion traffic.", "factory"],
      ["Join the Creator Exchange for one collab this month.", "exchange"]
    ];
    for (const e of extra) { if (out.length >= 6) break; out.push({ t: e[0], module: e[1], who: "boost" }); }
    return out;
  }

  /* ---- HTML rendering helpers ---- */
  function gradeBadge(g) {
    const cls = Ui.cn("chip", g === "A" ? "chip-green" : g === "B" ? "chip-cyan" : g === "C" ? "chip-amber" : "chip-red");
    return '<span class="' + cls + '">Grade ' + g + '</span>';
  }

  function ringSVG(score) {
    const r = 74, c = 2 * Math.PI * r;
    const off = c - (score / 100) * c;
    const col = score >= 75 ? "#00ff88" : score >= 55 ? "#00e5ff" : score >= 40 ? "#ffb547" : "#ff4757";
    return '<div class="ring">' +
      '<svg width="168" height="168">' +
      '<circle cx="84" cy="84" r="' + r + '" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="12" />' +
      '<circle cx="84" cy="84" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 84 84)" style="filter:drop-shadow(0 0 8px ' + col + ')"/>' +
      '</svg>' +
      '<div class="ring-val" style="color:' + col + '">' + score + '</div>' +
      '<div class="ring-label">Channel Health</div></div>';
  }

  /* ---- main view ---- */
  function render() {
    const last = Store.get("lastaudit", null);
    const lastHTML = last ? lastCard(last) : "";
    const el = document.getElementById("m-audit");
    el.innerHTML =
      '<div class="page-head">' +
      '<h1 class="page-title">' + AppIcons.pulse + ' ' + T("audit.h") + ' <span class="tag tag-red">AI VIRTUAL EMPLOYEE</span></h1>' +
      '<p class="page-sub">' + T("audit.s") + '</p>' +
      '</div>' +
      '<div class="grid grid-2">' +
      '<div class="card">' +
      '<div class="card-head"><h3 class="card-title">' + AppIcons.tv + ' Connect a channel</h3><span class="tag tag-cyan">Live data</span></div>' +
      '<div class="field"><label>Channel handle or URL</label>' +
      '<input type="text" id="auditHandle" placeholder="@yourchannel  |  youtube.com/@yourchannel" value="' + (Store.string("audit_handle", "")) + '" />' +
      '<span class="hint">Your channel handle from your channel URL. e.g. <span class="mono">@MrBeast</span></span></div>' +
      '<div class="field"><label>YouTube Data API v3 key <span class="dim">(optional)</span></label>' +
      '<input type="text" id="auditKey" placeholder="AIza..." value="' + (Store.string("audit_key", "")) + '" />' +
      '<span class="hint">Free from <span class="mono">console.cloud.google.com</span> → Enable “YouTube Data API v3”. Stored only in your browser. Without it we crunch a self-assessment instead.</span></div>' +
      '<button class="btn btn-primary btn-lg btn-block" id="btnRunLive">' + AppIcons.bolt + ' Run Live Audit &nbsp;<span class="spinner" id="liveSpin" style="display:none"></span></button>' +
      '<p class="small dim mt-8 center">No key? That is fine — <a href="#/audit?mode=quick">use the smart self-assessment below</a>.</p>' +
      '</div>' +
      '<div class="card">' +
      '<div class="card-head"><h3 class="card-title">' + AppIcons.sparkle + ' Offline Quick Audit</h3><span class="tag tag-green">Instant</span></div>' +
      '<p class="small muted mb-12">Answer honestly — the estimator works fine with estimates, and the action plan is what matters.</p>' +
      '<div class="field-grid">' +
      '<div class="field"><label>Subscribers</label><input type="number" id="sa_subs" value="320" min="0" /></div>' +
      '<div class="field"><label>Total channel views</label><input type="number" id="sa_views" value="12000" min="0" /></div>' +
      '<div class="field"><label>Uploads (last 30 days)</label><input type="number" id="sa_upl" value="2" min="0" /></div>' +
      '<div class="field"><label>Avg views / video</label><input type="number" id="sa_avg" value="68" min="0" /></div>' +
      '<div class="field"><label>Est. click-through rate %</label><input type="number" id="sa_ctr" value="3.4" min="0" step="0.1" /></div>' +
      '<div class="field"><label>Est. retention %</label><input type="number" id="sa_ret" value="38" min="0" step="1" /></div>' +
      '</div>' +
      '<button class="btn btn-green btn-lg btn-block" onclick="Audit.runQuick()">' + AppIcons.zap + ' Score My Channel</button>' +
      '</div>' +
      '</div>' +
      (lastHTML ? '<div class="panel">' + lastHTML + '</div>' : '') +
      '<div class="panel"><div id="auditResult"></div></div>';

    const btn = document.getElementById("btnRunLive");
    btn.addEventListener("click", runLive);
    document.getElementById("auditKey").addEventListener("blur", () => Store.set("audit_key", document.getElementById("auditKey").value.trim()));
    document.getElementById("auditHandle").addEventListener("blur", () => Store.set("audit_handle", document.getElementById("auditHandle").value.trim()));
  }

  function lastCard(last) {
    return '<div class="card glow-cyan" style="cursor:pointer" onclick="window.location.hash=\'#/dashboard\'">' +
      '<div class="flex"><div>' + ringSVG(last.score) + '</div>' +
      '<div class="grow">' +
      '<h3 class="card-title">' + AppIcons.clock + ' Last audit · ' + last.date + '</h3>' +
      '<p class="small muted">' + (last.channel || "My channel") + ' — grade ' + last.grade + ' · ' + last.plan.length + ' actions queued.</p>' +
      '<div class="flex wrap gap-8 mt-12">' +
      Object.keys(last.grades).map((k) => '<span class="chip"><b>' + k + '</b> ' + gradeBadgeMini(last.grades[k]) + '</span>').join("") +
      '</div></div></div></div>';
  }
  function gradeBadgeMini(g) {
    const c = g === "A" ? "var(--green)" : g === "B" ? "var(--cyan)" : g === "C" ? "var(--amber)" : "var(--danger)";
    return '<span style="color:' + c + '">' + g + '</span>';
  }

  /* ---- live audit ---- */
  async function runLive() {
    const handle = document.getElementById("auditHandle").value.trim().replace(/^@/, "").replace(/^.*youtube\.com\/@?/, "").replace(/\/.*$/, "");
    const key = document.getElementById("auditKey").value.trim();
    if (!handle) return Renderers.toast("Enter a channel handle first.", "bad");

    const spin = document.getElementById("liveSpin");
    const btn = document.getElementById("btnRunLive");
    spin.style.display = "inline-block";
    btn.disabled = true;

    const res = document.getElementById("auditResult");
    res.innerHTML = '<div class="card center"><span class="spinner"></span><p class="mt-12">Contacting YouTube…</p></div>';

    try {
      let ch = await fetchChannel(handle, key);
      if (!ch) throw new Error("Channel not found");

      let recent = [];
      if (key) {
        try { recent = await recentVideos(ch.id, key); } catch (e) { recent = []; }
      }

      const m = metrics(ch, recent);
      const s = scoreFrom(m);
      const plan = recs(m, s);
      finish(m, s, plan, ch.snippet.title, key ? true : false);
    } catch (e) {
      res.innerHTML = '<div class="card glow-red"><h3 class="card-title" style="color:var(--danger)">' + AppIcons.shield + ' Audit could not pull live data</h3>' +
        '<p class="small muted mt-8">' + esc(e.message || e) + '</p>' +
        '<p class="small muted mt-8">Tips: no API key provided? Add a free YouTube Data API v3 key above. Wrong handle? Use the exact handle from your channel URL.</p></div>';
    } finally {
      spin.style.display = "none";
      btn.disabled = false;
    }
  }

  async function reqJson(url) {
    if (window.Data) return Data.fetchJson(url, { ttl: 0 });
    return fetch(url, { cache: "no-store" }).then((r) => r.json());
  }

  async function fetchChannel(handle, key) {
    if (!key) throw new Error("An API key is required to connect to YouTube. Add a free key above, or use the Quick Audit.");
    const base = "https://www.googleapis.com/youtube/v3/channels";
    const url = base + "?part=snippet,statistics&forHandle=" + encodeURIComponent(handle) + "&key=" + encodeURIComponent(key);
    const data = await reqJson(url);
    if (data.error) throw new Error(data.error.message || "API error");
    if (!data.items || !data.items.length) {
      const alt = base + "?part=snippet,statistics&forUsername=" + encodeURIComponent(handle) + "&key=" + encodeURIComponent(key);
      const d2 = await reqJson(alt);
      if (d2.items && d2.items.length) return d2.items[0];
      throw new Error("Channel '" + handle + "' not found on YouTube.");
    }
    return data.items[0];
  }

  async function recentVideos(channelId, key) {
    const sd = await reqJson("https://www.googleapis.com/youtube/v3/search?part=id&channelId=" + encodeURIComponent(channelId) +
      "&maxResults=12&order=date&type=video&key=" + encodeURIComponent(key));
    const ids = (sd.items || []).map((i) => i.id.videoId).join(",");
    if (!ids) return [];
    const vd = await reqJson("https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=" + ids + "&key=" + encodeURIComponent(key));
    return (vd.items || []).map((it) => ({
      viewCount: parseInt(it.statistics.viewCount || 0, 10),
      likeCount: parseInt(it.statistics.likeCount || 0, 10),
      commentCount: parseInt(it.statistics.commentCount || 0, 10),
      title: it.snippet.title,
      published: it.snippet.publishedAt
    }));
  }

  function metrics(ch, recent) {
    const st = ch.statistics || {};
    const subs = parseInt(st.subscriberCount || 0, 10);
    const totalViews = parseInt(st.viewCount || 0, 10);
    const videos = parseInt(st.videoCount || 0, 10);
    const avg = recent.length ? recent.reduce((a, v) => a + v.viewCount, 0) / recent.length : totalViews / Math.max(1, videos);
    const likes = recent.reduce((a, v) => a + v.likeCount, 0);
    const engRate = recent.length > 0 && avg > 0 ? (likes + recent.reduce((a, v) => a + v.commentCount, 0)) / Math.max(1, recent.length) / avg * 100 : 0;
    const pub = ch.snippet ? new Date(ch.snippet.publishedAt) : new Date();
    const days = Math.max(1, (Date.now() - pub.getTime()) / 86400000);
    return {
      subs, totalViews, videos, avgViews: avg,
      viewsPerDay: totalViews / days, uploadsPerMonth: videos / Math.max(1, days / 30),
      ctr: totalViews / Math.max(1, videos) / Math.max(1, subs) * 100,
      ret: engRate > 0 ? Math.min(90, 40 + engRate * 14) : 42
    };
  }

  /* ---- quick audit ---- */
  function runQuick() {
    const g = (id) => parseFloat(document.getElementById(id).value) || 0;
    const m = {
      subs: g("sa_subs"), totalViews: g("sa_views"), videos: Math.max(1, Math.round(g("sa_views") / Math.max(1, g("sa_avg")))),
      avgViews: g("sa_avg"), uploadsPerMonth: g("sa_upl"),
      ctr: g("sa_ctr"), ret: g("sa_ret")
    };
    const s = scoreFrom(m);
    const plan = recs(m, s);
    finish(m, s, plan, "My channel (self-assessment)");
  }

  /* ---- results ---- */
  function finish(m, s, plan, channel, live) {
    Store.set("lastaudit", { date: new Date().toLocaleDateString(), score: s.total, grade: s.grade, grades: s.grades, channel, plan: plan.map((p) => p.t) });
    if (window.Ux) { try { Ux.setAudit(s.grade); } catch (e) {} }
    if (s.grade === "A" && window.Confetti) {
      try { Confetti.burst({ particleCount: 180, spread: 100, origin: { y: 0.45 } }); } catch (e) {}
    }

    const res = document.getElementById("auditResult");
    res.innerHTML =
      '<div class="card glow-green"><div class="flex-col">' +
      '<div class="flex wrap gap-12">' + ringSVG(s.total) +
      '<div class="grow">' +
      '<div class="flex wrap gap-8 align-center">' +
      '<h3 class="card-title">' + (live ? AppIcons.tv : AppIcons.sparkle) + ' ' + esc(channel) + '</h3>' +
      '<span class="tag tag-green">Health: ' + s.grade + '</span>' +
      (live ? '<span class="tag tag-cyan">LIVE DATA</span>' : '<span class="tag tag-amber">ESTIMATED</span>') +
      '</div>' +
      '<div class="grid grid-3 mt-16 gap-12">' +
      stat(m.subs, "Subscribers", "var(--red)") +
      stat(fmt(m.totalViews), "Total views", "var(--cyan)") +
      stat(fmt(m.avgViews), "Avg views / video", "var(--green)") +
      stat(m.uploadsPerMonth.toFixed(1) + "/mo", "Upload cadence", "var(--purple)") +
      stat(live ? m.viewsPerDay.toFixed(0) : "—", "Views / day", "var(--amber)") +
      stat(m.ctr.toFixed(1) + "%", "Est. CTR", "var(--green)") +
      '</div></div></div>' +

      '<div class="divider"></div>' +
      '<div class="grid grid-5 gap-8" style="grid-template-columns:repeat(5,1fr)">' +
      Object.keys(s.grades).map((k) =>
        '<div class="center card" style="padding:12px"><div class="small dim" style="font-weight:800;letter-spacing:.6px;text-transform:uppercase">' + k + '</div>' +
        '<div style="font-size:22px;font-weight:900;margin-top:4px" class="' + (s.grades[k] === 'A' ? 'glow-green-text' : s.grades[k] === 'B' ? 'glow-cyan-text' : s.grades[k] === 'C' ? '' : 'glow-red-text') + '">' + s.grades[k] + '</div>' + gradeBadge(s.grades[k]) + '</div>'
      ).join("") + '</div>' +
      '</div></div>' +

      '<div class="card mt-16">' +
      '<h3 class="card-title">' + AppIcons.brain + ' AI Optimization Playbook</h3>' +
      '<p class="small muted mb-12">Prioritized, tick-box-able actions. Check them off — progress is saved and mirrored on your dashboard.</p>' +
      '<div class="check-list" id="auditCheckList">' +
      plan.map((p, i) => checklistItem(i, p.t, p.module)).join("") +
      '</div>' +
      '<div class="flex gap-12 mt-16 wrap">' +
      '<button class="btn btn-cyan btn-sm" onclick="Audit.copyPlan()">' + AppIcons.copy + ' Copy action plan</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="Audit.exportAudit()">' + AppIcons.download + ' Save as JSON</button>' +
      '</div></div>';

    res.querySelectorAll("input[type=checkbox]").forEach((cb) => {
      cb.checked = Store.isChecked(SCOPE, cb.id);
      const item = cb.closest(".check-item");
      if (cb.checked) item.classList.add("done");
      cb.addEventListener("change", () => {
        Store.toggleChecked(SCOPE, cb.id);
        cb.closest(".check-item").classList.toggle("done", cb.checked);
        Renderers.toast(cb.checked ? "Logged as done. Onward!" : "Un-logged.", cb.checked ? "good" : "");
      });
    });
  }

  function checklistItem(i, text, moduleLink) {
    const modLink = moduleLink ? ' <span class="where" onclick="event.preventDefault();window.location.hash=\'#/' + moduleLink + '\'"><a href="#/' + moduleLink + '">' + AppIcons.external + ' open module</a></span>' : "";
    return '<div class="check-item"><input type="checkbox" id="audit_' + i + '" /><span class="txt">' + esc(text) + modLink + '</span></div>';
  }

  function stat(num, name, color) {
    return '<div class="stat"><div class="stat-ico" style="background:' + color + '1a;color:' + color + '">' + AppIcons.chart + '</div>' +
      '<div><div class="stat-num">' + num + '</div><div class="stat-name">' + name + '</div></div></div>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function copyPlan() {
    const last = Store.get("lastaudit", null);
    if (!last) return Renderers.toast("Run an audit first.", "bad");
    const txt = "ViralForge Audit — " + last.channel + "\nHealth: " + last.score + " (grade " + last.grade + ")\n\n" +
      last.plan.map((p, i) => (i + 1) + ". " + p).join("\n");
    Renderers.copy(txt, "Action plan copied — paste it into your project notes.");
  }

  function exportAudit() {
    const last = Store.get("lastaudit", null);
    if (!last) return Renderers.toast("Nothing to export yet.", "bad");
    Renderers.download("viralforge-audit.json", JSON.stringify(last, null, 2));
    Renderers.toast("Audit saved as JSON.", "good");
  }

  window.Audit = { render, runLive, runQuick, copyPlan, exportAudit, esc, fmt, scoreFrom };
})();