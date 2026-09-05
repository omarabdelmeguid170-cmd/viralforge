/* ============================================================
   ViralForge — ctr.js
   AI Virtual Employee · Thumbnail & Title CTR Predictor.
   Drag-and-drop thumbnail tester. Real pixel analysis on canvas:
   visual contrast, color heat, saturation, center subject framing,
   estimated face-framing (skin-tone heuristic) + emotional trigger
   scoring for the title. All in-browser, zero uploads.
   ============================================================ */

(function () {
  const SCALE = 320; /* analysis width */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function render() {
    const el = document.getElementById("m-ctr");
    el.innerHTML =
      '<div class="page-head">' +
      '<h1 class="page-title">' + AppIcons.eye + ' ' + T("ctr.h") + ' <span class="tag tag-red">AI VIRTUAL EMPLOYEE</span></h1>' +
      '<p class="page-sub">' + T("ctr.s") + '</p>' +
      '</div>' +
      '<div class="grid grid-2">' +
      '<div class="card">' +
      '<h3 class="card-title">' + AppIcons.video + ' 1. Thumbnail</h3>' +
      '<div class="drop-zone" id="dropZone">' + AppIcons.upload + '<div class="mt-8" style="font-weight:700">Drag &amp; drop, or click to pick a file</div>' +
      '<div class="small dim mt-8">JPG / PNG / WEBP — analyzed locally on canvas, never uploaded.</div></div>' +
      '<input type="file" id="thumbFile" accept="image/*" hidden />' +
      '<div class="flex wrap gap-8 mt-12">' +
      '<button class="btn btn-cyan btn-sm" id="btnGenTest">' + AppIcons.sparkle + ' Generate a test thumbnail</button>' +
      '<span class="small dim center grow">or</span>' +
      '<button class="btn btn-ghost btn-sm" id="btnScoreThumb" disabled>' + AppIcons.zap + ' Score thumbnail</button>' +
      '</div>' +
      '<div class="mt-12" id="thumbPreview"></div>' +
      '</div>' +
      '<div class="card">' +
      '<h3 class="card-title">' + AppIcons.pen + ' 2. Title</h3>' +
      '<div class="field"><label>Video title</label><input type="text" id="ctrTitle" placeholder="The $2 Ingredients That Made Me Viral Food" value="" /><span class="hint">Aim for 40-60 characters. Specifics beat hype.</span></div>' +
      '<div class="field"><label>Emotional triggers</label>' +
      '<div class="flex wrap gap-6" id="ctrTriggers"></div>' +
      '<span class="hint">Select what the packaging really sells. The predictor weighs these.</span></div>' +
      '<button class="btn btn-green btn-lg btn-block" onclick="Ctr.score()">' + AppIcons.sparkle + ' Predict CTR now</button>' +
      '</div>' +
      '</div>' +
      '<div class="panel" id="ctrResult"></div>';

    buildTriggers();
    wireUpload();
    document.getElementById("btnGenTest").addEventListener("click", genTestThumb);
    document.getElementById("ctrTitle").addEventListener("input", () => Store.set("ctr_title", document.getElementById("ctrTitle").value));
    document.getElementById("ctrTitle").value = Store.string("ctr_title", "");
  }

  function buildTriggers() {
    const defs = [
      { id: "cur", l: "Curiosity", c: "cyan" },
      { id: "shock", l: "Shock", c: "red" },
      { id: "fomo", l: "FOMO / urgency", c: "amber" },
      { id: "value", l: "Value / save money", c: "green" },
      { id: "humor", l: "Humor", c: "purple" },
      { id: "contro", l: "Controversy", c: "red" }
    ];
    const saved = Store.get("ctr_triggers", ["cur", "value"]);
    document.getElementById("ctrTriggers").innerHTML = defs.map((d) =>
      '<label class="chip chip-' + d.c + '" style="cursor:pointer;user-select:none"><input type="checkbox" value="' + d.id + '" ' + (saved.indexOf(d.id) !== -1 ? "checked" : "") + ' hidden /><span></span>&nbsp;' + d.l + '</label>'
    ).join("");
    syncTriggerVisuals();
    document.querySelectorAll("#ctrTriggers input").forEach((cb) => cb.addEventListener("change", syncTriggerVisuals));
  }
  function syncTriggerVisuals() {
    const sels = [];
    document.querySelectorAll("#ctrTriggers input").forEach((cb) => {
      const chip = cb.closest(".chip");
      if (cb.checked) { cb.nextElementSibling.innerHTML = "&#10003; "; sels.push(cb.value); chip.style.boxShadow = "0 0 12px currentColor"; }
      else { cb.nextElementSibling.innerHTML = ""; chip.style.boxShadow = "none"; }
    });
    Store.set("ctr_triggers", sels);
  }

  /* ============ thumbnail upload / preview ============ */
  let currentImage = null;

  function wireUpload() {
    const zone = document.getElementById("dropZone");
    const file = document.getElementById("thumbFile");
    zone.addEventListener("click", () => file.click());
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault(); zone.classList.remove("drag");
      if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
    });
    file.addEventListener("change", () => file.files[0] && loadFile(file.files[0]));
  }

  function loadFile(f) {
    if (!/image\/(png|jpe?g|webp)/.test(f.type)) return Renderers.toast("Please use PNG, JPG or WEBP.", "bad");
    const url = URL.createObjectURL(f);
    loadImage(url).then((img) => {
      currentImage = img;
      preview(img, f.name);
      document.getElementById("btnScoreThumb").disabled = false;
      Renderers.toast("Thumbnail loaded. Ready to score.", "good");
    }).catch(() => Renderers.toast("Could not read that image.", "bad"));
  }

  function genTestThumb() {
    const c = document.createElement("canvas");
    c.width = 1280; c.height = 720;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, "#ff0000"); grad.addColorStop(0.5, "#7a0bff"); grad.addColorStop(1, "#00e5ff");
    g.fillStyle = grad; g.fillRect(0, 0, 1280, 720);
    /* big face-ish blob center */
    g.fillStyle = "#ffddc8"; g.beginPath(); g.arc(360, 360, 150, 0, 7); g.fill();
    g.fillStyle = "#2a2a35"; g.beginPath(); g.arc(315, 330, 28, 0, 7); g.fill();
    g.beginPath(); g.arc(410, 330, 28, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.font = "900 150px Segoe UI"; g.textAlign = "right";
    g.fillText("SHOCK", 1240, 430);
    g.fillStyle = "#ffe34d"; g.fillText("?", 1240, 600);
    loadImage(c.toDataURL()).then((img) => {
      currentImage = img; preview(img, "test-thumbnail.png");
      document.getElementById("btnScoreThumb").disabled = false;
      if (!document.getElementById("ctrTitle").value) {
        document.getElementById("ctrTitle").value = "I Tried the Diamond Payment Trick (Don't Skip)";
        Store.set("ctr_title", document.getElementById("ctrTitle").value);
      }
    });
  }

  function preview(img, name) {
    const box = document.getElementById("thumbPreview");
    box.innerHTML = '<div class="flex gap-12 align-center wrap">' +
      '<img src="' + img.src + '" style="width:220px;border-radius:10px;border:1px solid var(--line-strong);aspect-ratio:16/9;object-fit:cover" alt="thumbnail preview" />' +
      '<div class="small dim">' + esc(name) + '<br/>' + img.naturalWidth + '×' + img.naturalHeight + ' px — 16:9 target</div></div>';
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("load failed"));
      img.src = src;
    });
  }

  /* ============ pixel analysis ============ */
  function analyze(img) {
    const c = document.createElement("canvas");
    const h = Math.round(SCALE * 9 / 16);
    c.width = SCALE; c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0, SCALE, h);
    let data;
    try { data = g.getImageData(0, 0, SCALE, h).data; } catch (e) {
      return { tainted: true };
    }
    const n = SCALE * h;
    let lumSum = 0, satSum = 0, warm = 0, warmN = 0, edges = 0;
    const lums = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const r = data[i * 4], gg = data[i * 4 + 1], b = data[i * 4 + 2];
      const l = 0.299 * r + 0.587 * gg + 0.114 * b;
      lums[i] = l; lumSum += l;
      const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
      const sat = mx === 0 ? 0 : (mx - mn) / mx;
      satSum += sat;
      if (sat > 0.3) {
        const hue = hueOf(r, gg, b, mx, mn);
        if (hue < 70 || hue > 330) { warm++; }
        warmN++;
      }
    }
    const mean = lumSum / n;
    let varc = 0;
    for (let i = 0; i < n; i++) varc += (lums[i] - mean) * (lums[i] - mean);
    const contrast = Math.sqrt(varc / n);

    /* center vs surround focus */
    const cx = Math.floor(SCALE / 2), cy = Math.floor(h / 2);
    let cSum = 0, cN = 0, sSum = 0, sN = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < SCALE; x++) {
      const d = Math.hypot(x - cx, y - cy);
      const l = lums[y * SCALE + x];
      if (d < 55) { cSum += l; cN++; } else if (d > 95) { sSum += l; sN++; }
    }
    const centerLum = cN ? cSum / cN : mean;
    const ringLum = sN ? sSum / sN : mean;
    const centerFocus = Math.abs(centerLum - ringLum);

    /* face heuristic: skin-toned pixels in upper-center crop */
    let skin = 0, skinN = 0;
    for (let y = Math.floor(h * 0.12); y < Math.floor(h * 0.55); y++) {
      for (let x = Math.floor(SCALE * 0.2); x < Math.floor(SCALE * 0.8); x++) {
        const i = y * SCALE + x;
        const r = data[i * 4], gg = data[i * 4 + 1], b = data[i * 4 + 2];
        if (r > 70 && r > gg && gg >= b && (r - gg) > 14 && (r - b) > 20) skin++;
        skinN++;
      }
    }
    const skinRatio = skin / Math.max(1, skinN);

    /* edge interest via luminance gradient */
    let gxSum = 0, gySum = 0, eN = 0;
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < SCALE - 1; x++) {
      const l = lums[y * SCALE + x];
      gxSum += Math.abs(l - lums[y * SCALE + x - 1]);
      gySum += Math.abs(l - lums[(y - 1) * SCALE + x]);
      eN++;
    }
    edges = (gxSum + gySum) / 2 / eN;

    return {
      tainted: false, contrast, sat: satSum / n,
      warmRatio: warmN ? warm / warmN : 0,
      centerFocus, skinRatio, edges
    };
  }

  function hueOf(r, g, b, mx, mn) {
    const d = mx - mn;
    if (d === 0) return 0;
    if (mx === r) return (60 * ((g - b) / d) + 360) % 360;
    if (mx === g) return 60 * ((b - r) / d) + 120;
    return 60 * ((r - g) / d) + 240;
  }

  function thumbScores(a) {
    const s = {};
    /* contrast: ~25-90 luma std seen in good thumbs */
    s.contrast = clamp(((a.contrast - 25) / 65) * 100);
    s.saturation = clamp((a.sat / 0.6) * 100);
    s.warmth = clamp((a.warmRatio / 0.45) * 100);
    s.focus = clamp(((a.centerFocus - 10) / 70) * 100);
    s.face = clamp((a.skinRatio / 0.14) * 100);
    s.edges = clamp((a.edges / 40) * 100);
    s.total = Math.round(s.contrast * 0.25 + s.focus * 0.2 + s.saturation * 0.15 + s.face * 0.2 + s.warmth * 0.1 + s.edges * 0.1);
    s.grade = s.total >= 75 ? "A" : s.total >= 58 ? "B" : s.total >= 42 ? "C" : s.total >= 28 ? "D" : "F";
    return s;
  }

  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  /* ============ title scoring ============ */
  const POWER = ["secret", "ultimate", "proven", "insane", "shocking", "mistake", "stop", "never", "always", "free", "new", "best", "worst", "delete", "this", "these", "you ", "top", "how", "why", "what", "vs", "under", "over", "only", "truth", "real"];
  const TRIGGER_WEIGHT = { cur: 14, shock: 12, fomo: 12, value: 10, humor: 8, contro: 12 };

  function titleScore(title) {
    const t = title.trim();
    const s = {};
    const len = t.length;
    if (len === 0) { s.total = 0; s.grade = "F"; s.breakdown = {}; return s; }
    s.length = len < 30 ? 30 : len <= 60 ? 100 : len <= 75 ? 70 : 40;
    let power = 0, n; const word = t.toLowerCase();
    for (const p of POWER) if (word.indexOf(p) !== -1) power++;
    s.power = Math.min(100, power * 22);
    const num = /\d/.test(t);
    s.numbers = num ? 100 : 30;
    const emoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g.test(t);
    s.emoji = emoji ? 85 : 55;
    const triggerIds = selectedTriggers();
    s.trigger = triggerIds.length ? 86 : 30;

    s.total = Math.round(s.length * 0.3 + s.power * 0.24 + s.numbers * 0.18 + s.emoji * 0.08 + s.trigger * 0.2);
    s.grade = s.total >= 70 ? "A" : s.total >= 55 ? "B" : s.total >= 40 ? "C" : s.total >= 25 ? "D" : "F";
    s.stats = { len, power, hasNum: num, hasEmoji: emoji, triggers: triggerIds };
    return s;
  }

  function selectedTriggers() {
    return Array.from(document.querySelectorAll("#ctrTriggers input")).filter((cb) => cb.checked).map((cb) => cb.value);
  }

  /* ============ composite ============ */
  function scoreTitleOnly() {
    const titleEl = document.getElementById("ctrTitle");
    const t = titleEl.value;
    if (!t.trim()) { Renderers.toast("Add a title to predict CTR.", "bad"); return null; }
    const ts = titleScore(t);
    return { hasThumb: false, ts, estCTR: (1 + (50 + ts.total) / 2 / 100 * 9.5), title: t };
  }

  function score() {
    const ts = titleScore(document.getElementById("ctrTitle").value);
    if (!ts.total) return Renderers.toast("Add a title to predict CTR.", "bad");
    if (!currentImage) return Renderers.toast("Drop in a thumbnail first.", "bad");

    const a = analyze(currentImage);
    if (a.tainted) return Renderers.toast("Browser security blocked pixel access for that image — try uploading a file instead.", "bad");

    const th = thumbScores(a);
    const estCTR = 1 + ((th.total + ts.total) / 2) / 100 * 10;
    const result = { th, ts, a, estCTR, title: document.getElementById("ctrTitle").value, date: new Date().toLocaleDateString() };
    Store.set("lastctr", result);
    renderResult(result);
  }

  function renderResult(r) {
    const el = document.getElementById("ctrResult");
    const est = r.estCTR.toFixed(1);
    const colC = est >= 7 ? "var(--green)" : est >= 4.5 ? "var(--cyan)" : "var(--amber)";
    const thBars = [
      ["Visual contrast", r.th.contrast, "bar-red"],
      ["Center subject framing", r.th.focus, "bar-cyan"],
      ["Colors / saturation", r.th.saturation, "bar-green"],
      ["Face framing (est.)", r.th.face, "bar-purple"],
      ["Warm color heat", r.th.warmth, "bar-amber"],
      ["Visual noise / edges", r.th.edges, "bar-cyan"]
    ];
    const fixes = [];
    if (r.th.contrast < 55) fixes.push("Boost luma contrast — darken background, brighten subject (target >70 contrast).");
    if (r.th.face < 55) fixes.push("Add a faces/eyes near center-top — viewers click humans first.");
    if (r.th.focus < 50) fixes.push("Strengthen the center subject against the background ring.");
    if (r.th.saturation < 45) fixes.push("Punch up saturation — desaturated thumbs die in the feed.");
    if (r.th.warmth < 40) fixes.push("Add a warm color (red/orange/yellow) accent zone.");
    if (r.ts.length < 30) fixes.push("Title too short — add a specific number or result.");
    if (r.ts.length > 75) fixes.push("Title too long — YouTube truncates around 60 chars.");
    if (!r.ts.stats.hasNum) fixes.push("Put a number in the title (days, $, %, steps).");
    if (r.ts.stats.power < 2) fixes.push("Add a power word: secret / proven / stop / never.");
    if (!r.ts.stats.triggers.length) fixes.push("Pick ≥1 emotional trigger for the packaging.");

    const titleIdeas = fabricateTitles(r.title);
    el.innerHTML =
      '<div class="card glow-green noise-glow">' +
      '<div class="flex wrap gap-16" style="align-items:center">' +
      '<div>' + ringSmall(r.th.total, colC) + '<div class="center small dim" style="margin-top:6px">THUMBNAIL</div></div>' +
      '<div class="grow">' +
      '<div class="flex wrap gap-8 align-center"><h3 class="card-title">Predicted CTR: <span style="color:' + colC + ';font-size:28px">' + est + '%</span></h3>' +
      '<span class="tag ' + (est >= 7 ? "tag-green" : est >= 4.5 ? "tag-cyan" : "tag-amber") + '">' + (est >= 7 ? "TOP 10% performance" : est >= 4.5 ? "Above average" : "Feed-killer — fix before upload") + '</span></div>' +
      '<p class="small muted mt-8">Formula mixes pixel analysis with title semantics + your chosen emotional triggers. Real CTR also depends on audience-match.</p>' +
      '<div class="flex wrap gap-16 mt-12">' +
      '<div style="min-width:150px"><div class="small dim mb-8">Graders</div>' +
      '<div class="flex gap-6 wrap">' + [["Thumbnail", r.th.grade, !0], ["Title", r.ts.grade, !1]].map((g) => '<span class="chip"><b>' + g[0] + '</b> <span class="' + (g[1] === "F" || g[1] === "D" ? "glow-red-text" : g[1] === "C" ? "glow-amber-text" : "glow-green-text") + '">' + g[1] + '</span></span>').join("") + '</div></div>' +
      '<div style="min-width:150px"><div class="small dim mb-8">Raw signals</div><div class="flex gap-6 wrap">' +
      '<span class="chip chip-cyan">' + Math.round(r.a.contrast) + ' contrast</span><span class="chip chip-green">' + Math.round(r.a.sat * 100) + '% sat</span><span class="chip chip-red">' + Math.round(r.a.warmRatio * 100) + '% warm</span><span class="chip chip-purple">' + Math.round(r.a.skinRatio * 100) + '% face</span>' +
      '</div></div></div></div></div>' +
      '</div>' +

      '<div class="grid grid-2 mt-16" style="grid-template-columns:1.5fr 1fr">' +
      '<div class="card">' +
      '<h3 class="card-title">' + AppIcons.chart + ' Breakdown</h3>' +
      thBars.map((b) => meterRow(b[0], b[1], b[2])).join("") +
      '<div class="divider"></div>' +
      meterRow("Title power & length", r.ts.total, "bar-purple") +
      '</div>' +
      '<div class="card glow-red">' +
      '<h3 class="card-title">' + AppIcons.wrench + ' Fix before you upload</h3>' +
      '<div class="check-list">' +
      fixes.map((f, i) => '<div class="check-item"><input type="checkbox" id="ctrf_' + i + '"/><span class="txt">' + f + '</span></div>').join("") +
      '</div></div>' +
      '</div>' +

      '<div class="card mt-16">' +
      '<h3 class="card-title">' + AppIcons.pen + ' Title rewrites worth A/B testing</h3>' +
      '<div class="table-wrap"><table><thead><tr><th>Formula</th><th>Sample title</th><th>Hook</th></tr></thead><tbody>' +
      titleIdeas.map((ti) => '<tr><td class="dim small">' + ti.formula + '</td><td style="font-weight:650">' + ti.title + '</td><td>' + ti.hook + '</td></tr>').join("") +
      '</tbody></table></div>' +
      '<div class="flex gap-12 mt-16 wrap">' +
      '<button class="btn btn-cyan btn-sm" onclick="Ctr.copyReport()">' + AppIcons.copy + ' Copy report</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="Ctr.exportReport()">' + AppIcons.download + ' Save JSON</button>' +
      '</div></div>';

    if (est >= 7 && window.Confetti) {
      try { Confetti.burst({ particleCount: 130, spread: 90, origin: { y: 0.4 } }); } catch (e) {}
    }
  }

  function ringSmall(score, col) {
    const r = 46, c = 2 * Math.PI * r;
    const off = c - (score / 100) * c;
    return '<div class="ring" style="width:120px;height:120px"><svg width="120" height="120">' +
      '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="10"/>' +
      '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 60 60)"/>' +
      '</svg><div class="ring-val" style="font-size:26px;color:' + col + '">' + score + '</div></div>';
  }

  function meterRow(label, val, cls) {
    return '<div class="meter mt-8"><div style="flex:1">' +
      '<div class="meter-top"><span class="small">' + label + '</span><span class="small" style="font-weight:800">' + Math.round(val) + '</span></div>' +
      '<div class="bar ' + cls + '"><span style="width:' + Math.max(3, Math.min(100, val)) + '%"></span></div>' +
      '</div></div>';
  }

  function fabricateTitles(base) {
    const words = base.trim().split(/\s+/);
    const topic = words.slice(0, 4).join(" ").replace(/[?.!]$/, "");
    const shortT = topic.length > 34 ? topic.slice(0, 33) + "…" : topic;
    const hooks = window.FACTORY.hookFormulas;
    return [
      { formula: "Number stack", title: '3 ' + shortT.toTitleCase() + ' rules pros never share', hook: "Specific + curiosity", },
      { formula: "Provocative", title: 'Why "experts" keep lying about ' + shortT.toLowerCase(), hook: "Contrarian pull" },
      { formula: "Direct promise", title: 'I ' + shortT.toLowerCase() + ' in 24 hours — here\'s how', hook: "Self-proof" },
      { formula: "Curiosity gap", title: 'This ' + shortT.toLowerCase() + ' detail changes everything', hook: "Open loop" },
      { formula: "Pattern interrupt", title: 'Stop ' + shortT.toLowerCase() + ' until you see this', hook: "Feed hawk" }
    ].map((h, i) => {
      const hk = hooks[i % hooks.length].name;
      return Object.assign(h, { hook: h.hook + " · " + hooks[i % hooks.length].use.split(" ").slice(0, 3).join(" ") });
    });
  }

  const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
  String.prototype.toTitleCase = function () { return titleCase(String(this)); };

  function copyReport() {
    const r = Store.get("lastctr", null);
    if (!r) return Renderers.toast("Run a prediction first.", "bad");
    const txt = "VIRALFORGE CTR REPORT\nTitle: " + r.title + "\nThumbnail: " + r.th.total + "/100 (" + r.th.grade + ") · Title: " + r.ts.total + "/100 (" + r.ts.grade + ")\nPredicted CTR: " + r.estCTR.toFixed(1) + "%";
    Renderers.copy(txt, "CTR report copied.");
  }
  function exportReport() {
    const r = Store.get("lastctr", null);
    if (!r) return Renderers.toast("Nothing to export yet.", "bad");
    Renderers.download("viralforge-ctr.json", JSON.stringify(r, null, 2));
    Renderers.toast("CTR report saved.", "good");
  }

  window.Ctr = { render, score, copyReport, exportReport };
})();