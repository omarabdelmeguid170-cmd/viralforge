/* ============================================================
   ViralForge — community.js
   Community Plan Hub · open-source sharing marketplace.
   Anyone can submit, publish, browse, upvote, rate, comment and
   clone YouTube growth plans. Data lives locally — export/import
   JSON or upstream via GitHub PR on the repo.
   ============================================================ */

(function () {
  const KEY = "community_plans";

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function plans() {
    const p = Store.get(KEY, null);
    if (!Array.isArray(p)) { Store.set(KEY, window.SEED_PLANS); return window.SEED_PLANS.slice(); }
    return p;
  }
  function saveP(list) { Store.set(KEY, list); }
  function find(id) { return plans().find((p) => p.id === id); }
  function stars(r) { return "★".repeat(Math.round(r)) + "<span class='dim'>" + "★".repeat(5 - Math.round(r)) + "</span>"; }

  /* ---------- marketplace ---------- */
  function render() {
    const el = document.getElementById("m-community");
    const list = plans();
    const niches = union(list.map((p) => p.niche)).sort();
    el.innerHTML =
      '<div class="page-head">' +
      '<div class="flex wrap gap-12" style="align-items:center;justify-content:space-between">' +
      '<div><h1 class="page-title">' + AppIcons.users + ' ' + T("community.h") + ' <span class="tag tag-green">OPEN SOURCE</span></h1>' +
      '<p class="page-sub">' + T("community.s") + '</p></div>' +
      '<button class="btn btn-primary btn-lg" onclick="window.location.hash=\'#/community/upload\'">' + AppIcons.upload + ' ' + T("community.publishPlan") + '</button>' +
      '</div></div>' +

      '<div class="card panel">' +
      '<div class="flex wrap gap-12" style="align-items:center">' +
      '<div class="field" style="flex:1;min-width:200px;margin:0">' +
      '<label>' + AppIcons.search + ' Search plans</label>' +
      '<input type="search" id="cmSearch" placeholder="try “Shorts”, “collab”, “dev log”…" />' +
      '</div>' +
      '<div class="field" style="min-width:150px;margin:0"><label>Niche</label><select id="cmNiche"><option value="">All niches</option>' + niches.map((n) => '<option>' + esc(n) + '</option>').join("") + '</select></div>' +
      '<div class="field" style="min-width:140px;margin:0"><label>Difficulty</label><select id="cmDiff"><option value="">Any</option><option>Starters</option><option>Intermediate</option><option>Advanced</option></select></div>' +
      '<div class="field" style="min-width:150px;margin:0"><label>Sort</label><select id="cmSort"><option value="votes">Most upvoted</option><option value="rating">Top rated</option><option value="cloned">Most cloned</option><option value="newest">Newest</option></select></div>' +
      '</div></div>' +

      '<div class="panel" id="cmGrid"></div>' +
      '<div class="muted small center mt-16">Every plan is public-domain-style shareable. Export to JSON, or open a PR to take yours to the hosted index.</div>';

    wireFilters();
    drawGrid(list);
  }

  function wireFilters() {
    ["cmSearch", "cmNiche", "cmDiff", "cmSort"].forEach((id) => {
      document.getElementById(id).addEventListener("input", applyFilters);
    });
    document.getElementById("cmSearch").addEventListener("search", applyFilters);
  }

  function applyFilters() {
    let list = plans().slice();
    const q = (document.getElementById("cmSearch").value || "").toLowerCase();
    const niche = document.getElementById("cmNiche").value;
    const diff = document.getElementById("cmDiff").value;
    const sort = document.getElementById("cmSort").value;
    if (q) list = list.filter((p) => (p.title + " " + p.niche + " " + p.desc + " " + p.tags.join(" ")).toLowerCase().indexOf(q) !== -1);
    if (niche) list = list.filter((p) => p.niche === niche);
    if (diff) list = list.filter((p) => p.difficulty === diff);
    if (sort === "votes") list.sort((a, b) => b.votes - a.votes);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "cloned") list.sort((a, b) => b.cloned - a.cloned);
    else list.sort((a, b) => (b.pub || 0) - (a.pub || 0));
    drawGrid(list);
  }

  function drawGrid(list) {
    const g = document.getElementById("cmGrid");
    if (!g) return;
    if (!list.length) {
      g.innerHTML = '<div class="empty-state"><div class="big">🗂</div>No plans match.<br/><span class="dim">Clear filters or be the first to publish this niche.</span></div>';
      return;
    }
    g.innerHTML = '<div class="grid grid-3">' + list.map(planCard).join("") + '</div>';
    if (window.Auto) { try { Auto.attach(g); } catch (e) {} }
  }

  function planCard(p) {
    return '<div class="card interactive noise-glow plan-card" data-id="' + esc(p.id) + '" onclick="window.location.hash=\'#/community/plan/' + esc(p.id) + '\'">' +
      '<div class="plan-ico" style="background:' + (p.avatar || "#111") + '1a;color:' + (p.avatar || "#00e5ff") + '">' + AppIcons.map + '</div>' +
      '<div class="flex gap-8 wrap mb-8">' +
      '<span class="' + Ui.cn("chip", "chip-" + chipOf(p.difficulty)) + '">' + esc(p.difficulty) + '</span>' +
      '<span class="chip">⏱ ' + esc(p.timeEst) + '</span>' +
      (p.verified ? '<span class="chip chip-green">verified result</span>' : '') +
      '</div>' +
      '<h3 class="card-title" style="font-size:15.5px">' + esc(p.title) + '</h3>' +
      '<p class="small muted mt-8" style="min-height:40px">' + esc(trunc(p.desc, 108)) + '</p>' +
      '<div class="plan-meta mt-8">' +
      '<span class="votes"><b>' + p.votes + '</b> &#9650;</span>' +
      '<span class="rating" title="' + p.rating + '/5">' + stars(p.rating) + ' <span class="dim">(' + p.reviews + ')</span></span>' +
      '<span class="dim">' + AppIcons.clone + ' ' + p.cloned + ' clones</span>' +
      '</div>' +
      '<div class="flex gap-8 mt-12" style="align-items:center">' +
      '<span class="avatar" style="background:' + (p.avatar || "#ff0000") + '">' + esc((p.author || "?").slice(0, 2).toUpperCase()) + '</span>' +
      '<span class="small muted">by <b>' + esc(p.author) + '</b></span>' +
      '<span class="small dim" style="margin-left:auto">' + esc(p.niche) + '</span>' +
      '</div></div>';
  }

  function trunc(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function chipOf(d) { return d === "Starters" ? "green" : d === "Intermediate" ? "cyan" : "purple"; }
  function union(a) { return a.filter((v, i) => a.indexOf(v) === i); }

  /* ---------- detail ---------- */
  function detail(id) {
    const p = find(id);
    const el = document.getElementById("m-community");
    if (!p) { el.innerHTML = '<div class="empty-state"><div class="big">🗂</div>Plan not found — it may have been removed.<br/><a href="#/community">Back to the hub</a></div>'; return; }
    const mine = (p.author || "").slice(0, 2).toUpperCase();

    el.innerHTML =
      '<div class="page-head">' +
      '<a class="small dim" href="#/community">&#8592; All plans</a>' +
      '<div class="flex wrap gap-8" style="align-items:flex-start">' +
      '<div class="grow"><h1 class="page-title">' + esc(p.title) + ' <span class="tag tag-' + chipOf(p.difficulty).replace("chip-", "") + '">' + esc(p.difficulty) + '</span></h1>' +
      '<div class="flex wrap gap-8 mt-8">' + p.tags.map((t) => '<span class="chip">#' + esc(t) + '</span>').join("") + '</div></div>' +
      '<div class="flex gap-8 wrap">' +
      '<button class="btn btn-green" onclick="Community.clone(\'' + esc(p.id) + '\')">' + AppIcons.clone + ' Clone plan</button>' +
      '<button class="btn btn-ghost icon-btn" title="Export JSON" onclick="Community.exportPlan(\'' + esc(p.id) + '\')">' + AppIcons.download + '</button>' +
      '</div></div></div>' +

      '<div class="grid grid-2" style="grid-template-columns:1.5fr 1fr">' +
      '<div class="card">' +
      '<div class="flex wrap gap-16 mb-12" style="align-items:center">' +
      '<span class="avatar" style="width:46px;height:46px;font-size:16px;background:' + (p.avatar || "#ff0000") + '">' + esc(mine) + '</span>' +
      '<div><div class="flex gap-8" style="align-items:center"><b>' + esc(p.author) + '</b>' + (p.verified ? '<span class="tag tag-green">VERIFIED</span>' : '') + '</div>' +
      '<span class="small dim">Niches: ' + esc(p.niche) + ' · Time: ' + esc(p.timeEst) + '</span></div>' +
      '<div class="grow right">' +
      '<button class="btn btn-primary btn-sm" onclick="Community.upvote(\'' + esc(p.id) + '\')">&#9650; <b id="voteN">' + p.votes + '</b> upvote</button>' +
      '<div class="small dim mt-8">' + p.saves + ' saves · ' + p.views + ' street views</div>' +
      '</div></div>' +
      '<p class="small muted mb-16">' + esc(p.desc) + '</p>' +
      '<h3 class="card-title">' + AppIcons.check + ' The steps</h3>' +
      '<div class="check-list">' +
      p.steps.map((s, i) =>
        '<div class="check-item"><span style="color:var(--cyan);font-weight:800">' + (i + 1) + '.</span><span class="txt">' + esc(s) + '</span></div>'
      ).join("") +
      '</div></div>' +

      '<div class="flex-col gap-16">' +
      '<div class="card">' +
      '<div class="flex wrap gap-8" style="align-items:center;justify-content:space-between">' +
      '<h3 class="card-title">' + AppIcons.star + ' Rate this plan</h3>' +
      '<div class="rating" style="font-size:20px">' + stars(p.rating) + ' <span class="small dim">(' + p.rating + ' · ' + p.reviews + ' rates)</span></div>' +
      '</div>' +
      '<div class="flex gap-8 mt-12">' + [1, 2, 3, 4, 5].map((n) => '<button class="btn btn-sm" onclick="Community.rate(\'' + esc(p.id) + '\',' + n + ')">' + n + ' ★</button>').join("") + '</div>' +
      '<p class="small dim mt-8">Be honest — bad plans help creators too.</p>' +
      '</div>' +

      '<div class="card">' +
      '<h3 class="card-title">' + AppIcons.comment + ' Community notes <span class="tag tag-cyan">' + p.comments.length + '</span></h3>' +
      '<div class="flex-col gap-10 mb-12" style="max-height:300px;overflow-y:auto">' +
      (p.comments.length ? p.comments.map((c) =>
        '<div class="flex gap-8"><span class="avatar" style="background:' + (hashColor(c.u)) + '">' + esc(c.u.slice(0, 2).toUpperCase()) + '</span>' +
        '<div class="card" style="background:var(--surface-2);padding:10px 12px;flex:1"><div class="flex gap-8"><b class="small">' + esc(c.u) + '</b><span class="small dim">' + esc(c.d) + '</span><span class="small dim" style="margin-left:auto">&#9650; ' + c.up + '</span></div>' +
        '<p class="small muted mt-4">' + esc(c.c) + '</p></div></div>').join("") :
        '<p class="small dim">No community notes yet — start one:</p>') +
      '</div>' +
      '<div class="flex gap-8"><input type="text" id="cmNewComment" placeholder="Add a note, tip or warning…" /><button class="btn btn-cyan" onclick="Community.comment(\'' + esc(p.id) + '\')">Post</button></div>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function hashColor(s) {
    const colors = ["#ff0000", "#00e5ff", "#00ff88", "#ffb547", "#a97bff", "#ff5ce1"];
    let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return colors[h % colors.length];
  }

  /* ---------- interactions ---------- */
  function upvote(id) {
    const list = plans();
    const p = list.find((x) => x.id === id);
    if (!p) return;
    p.votes++;
    saveP(list);
    const el = document.getElementById("voteN");
    if (el) el.textContent = p.votes;
    Renderers.toast("Upvoted. Visibility +1 for this creator's plan.", "good");
  }

  function rate(id, n) {
    const list = plans();
    const p = list.find((x) => x.id === id);
    if (!p) return;
    const total = p.rating * p.reviews + n;
    p.reviews++;
    p.rating = Math.round((total / p.reviews) * 10) / 10;
    saveP(list);
    Renderers.toast("Rated " + n + "★. New average " + p.rating.toFixed(1), "good");
    detail(id);
  }

  function comment(id) {
    const input = document.getElementById("cmNewComment");
    const text = (input.value || "").trim();
    if (!text) return Renderers.toast("Write a note first.", "bad");
    const list = plans();
    const p = list.find((x) => x.id === id);
    if (!p) return;
    p.comments.push({ u: "You", c: text, d: "just now", up: 1 });
    saveP(list);
    input.value = "";
    Renderers.toast("Note published on this plan.", "good");
    detail(id);
  }

  function clone(id) {
    const src = find(id);
    if (!src) return;
    const c = Object.assign({}, src, {
      id: "clone-" + Date.now(), author: "You (clone)",
      votes: 0, rating: src.rating, reviews: src.reviews,
      cloned: 0, saves: 0, verified: false
    });
    const list = plans();
    list.unshift(c);
    saveP(list);
    Renderers.toast("Plan cloned — it’s now in your workspace to edit and re-publish.", "good");
    window.location.hash = "#/community/plan/" + c.id;
  }

  function exportPlan(id) {
    const p = find(id);
    if (!p) return;
    Renderers.download("plan-" + p.id + ".json", JSON.stringify(p, null, 2));
    Renderers.toast("Plan exported as JSON — share it anywhere.", "good");
  }

  /* ---------- upload ---------- */
  function upload() {
    const el = document.getElementById("m-community");
    el.innerHTML =
      '<div class="page-head">' +
      '<a class="small dim" href="#/community">&#8592; Back to hub</a>' +
      '<h1 class="page-title">' + AppIcons.upload + ' Publish your growth plan <span class="tag tag-green">OPEN SOURCE</span></h1>' +
      '<p class="page-sub">Share the roadmap that worked (or warn others off the one that didn’t). Plans appear instantly in the marketplace.</p>' +
      '</div>' +
      '<div class="grid grid-2" style="grid-template-columns:1.4fr 1fr">' +
      '<div class="card">' +
      '<div class="field"><label>Plan title *</label><input type="text" id="upTitle" placeholder="The 2-Video-a-Week Launch Blueprint" /></div>' +
      '<div class="field-grid">' +
      '<div class="field"><label>Your name / handle *</label><input type="text" id="upAuthor" placeholder="CreatorName" /></div>' +
      '<div class="field"><label>Niche *</label><input type="text" id="upNiche" placeholder="Fitness / Tech / Gaming…" /></div>' +
      '<div class="field"><label>Difficulty</label><select id="upDiff"><option>Starters</option><option>Intermediate</option><option>Advanced</option></select></div>' +
      '<div class="field"><label>Time estimate</label><input type="text" id="upTime" placeholder="6 weeks" /></div>' +
      '</div>' +
      '<div class="field"><label>One-paragraph description *</label><textarea id="upDesc" placeholder="What the plan is, who it’s for, and the one weird trick that makes it work."></textarea></div>' +
      '<div class="field"><label>Steps — one per line *</label><textarea id="upSteps" style="min-height:150px" placeholder="Post 3 shorts a week at a fixed hour&#10;Batch-edit every Friday&#10;…"></textarea></div>' +
      '<div class="field"><label>Tags (comma-separated)</label><input type="text" id="upTags" placeholder="Shorts, Routine, Beginner" /></div>' +
      '<div class="flex wrap gap-12">' +
      '<button class="btn btn-primary btn-lg" onclick="Community.submit(\'' + Date.now() + '\')">' + AppIcons.rocket + ' Publish plan</button>' +
      '<button class="btn btn-ghost" id="upImport">' + AppIcons.upload + ' Import from JSON</button>' +
      '<input type="file" id="upImportInput" accept=".json" hidden />' +
      '</div></div>' +
      '<div class="card glow-green">' +
      '<h3 class="card-title">' + AppIcons.shield + ' Quality rules</h3>' +
      '<div class="check-list">' +
      ['Be specific: numbers, hours, results.', 'No “the algorithm loves it” mystery sauce.', 'Steps should be actionable today, not “eventually”.', 'Credit collaborators if you borrowed pieces.', 'You keep ownership — this is open sharing, not a giveaway.'].map((t, i) =>
        '<div class="check-item"><span class="txt small">' + t + '</span></div>').join("") +
      '</div>' +
      '<div class="divider"></div>' +
      '<h3 class="card-title">' + AppIcons.external + ' Share upstream too</h3>' +
      '<p class="small muted mt-8">This platform runs 100% in your browser. To put your plan on the shared hosted index, open a pull request with a JSON plan file on the project repo.</p>' +
      (CONFIG.repoUrl ? '<a class="btn btn-ghost btn-sm mt-12" href="' + CONFIG.repoUrl.split("#")[0] + '" target="_blank" rel="noopener">' + AppIcons.link + ' Contribute on GitHub</a>' : '<span class="chip chip-purple mt-12">Repo link coming soon</span>') +
      '</div></div>';

    document.getElementById("upImport").addEventListener("click", () => document.getElementById("upImportInput").click());
    document.getElementById("upImportInput").addEventListener("change", (e) => importPlan(e));
  }

  function submit(ts) {
    const g = (id) => document.getElementById(id).value.trim();
    const title = g("upTitle"), author = g("upAuthor"), niche = g("upNiche"), desc = g("upDesc"), stepsRaw = g("upSteps"), tagsRaw = g("upTags");
    if (!title || !author || !niche || !desc || !stepsRaw) return Renderers.toast("Title, author, niche, description and steps are required.", "bad");
    const steps = stepsRaw.split("\n").map((s) => s.trim()).filter(Boolean);
    const plan = {
      id: "up-" + ts, author: author.slice(0, 20), avatar: hashColor(author), niche: niche.slice(0, 24),
      title: title.slice(0, 90), desc: desc.slice(0, 600),
      steps, tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 6),
      difficulty: document.getElementById("upDiff").value, timeEst: g("upTime") || "flexible",
      views: "fresh", saves: 0, rating: 5.0, reviews: 1, cloned: 0, verified: false, votes: 1,
      comments: [], pub: Date.now()
    };
    const list = plans();
    list.unshift(plan);
    saveP(list);
    Renderers.toast("Plan published to the Hub. From everyone: thank you.", "good");
    if (window.Confetti) {
      try { Confetti.burst({ particleCount: 150, spread: 90, origin: { y: 0.5 } }); } catch (e) {}
    }
    window.location.hash = "#/community/plan/" + plan.id;
  }

  function importPlan(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const p = JSON.parse(r.result);
        if (!p.title || !Array.isArray(p.steps)) throw new Error("bad plan");
        p.id = "imp-" + Date.now();
        p.votes = 0; p.cloned = 0; p.comments = p.comments || []; p.pub = Date.now();
        const list = plans();
        list.unshift(p);
        saveP(list);
        Renderers.toast("Plan imported into the Hub.", "good");
        window.location.hash = "#/community/plan/" + p.id;
      } catch (err) { Renderers.toast("Could not parse that JSON file.", "bad"); }
    };
    r.readAsText(f);
  }

  window.Community = { render, detail, upload, submit, upvote, rate, comment, clone, exportPlan, importPlan };
})();