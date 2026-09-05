/* ============================================================
   ViralForge — exchange.js
   Creator Exchange Network · community wall for cross-promotions,
   niche collaborations and audience sharing to jumpstart traffic.
   ============================================================ */

(function () {
  const KEY = "exchange_posts";

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function posts() {
    const p = Store.get(KEY, null);
    if (!Array.isArray(p)) { Store.set(KEY, window.SEED_POSTS); return window.SEED_POSTS.slice(); }
    return p;
  }
  function saveP(list) { Store.set(KEY, list); }

  function render() {
    const el = document.getElementById("m-exchange");
    el.innerHTML =
      '<div class="page-head">' +
      '<div class="flex wrap gap-12" style="align-items:center;justify-content:space-between">' +
      '<div><h1 class="page-title">' + AppIcons.swap + ' ' + T("exchange.h") + ' <span class="tag tag-purple">COMMUNITY</span></h1>' +
      '<p class="page-sub">' + T("exchange.s") + '</p></div>' +
      '<button class="btn btn-purple btn-lg" onclick="Exchange.didOpenModal=true;document.getElementById(\'exForm\').scrollIntoView({behavior:\'smooth\'});document.getElementById(\'exForm\').classList.add(\'glow-purple\')">' + AppIcons.upload + ' Post an offer</button>' +
      '</div></div>' +

      '<div class="grid grid-2" style="grid-template-columns:1.7fr 1fr">' +
      '<div>' +
      '<div class="card mb-16">' +
      '<div class="flex wrap gap-12" style="align-items:center">' +
      '<div class="field" style="flex:1;min-width:180px;margin:0"><label>' + AppIcons.search + ' Search offers</label><input type="search" id="exSearch" placeholder="fitness, study, AI…" /></div>' +
      '<div class="field" style="min-width:150px;margin:0"><label>Type</label><select id="exType"><option value="">Any type</option><option>Shoutout swap</option><option>Collab</option><option>Featured spot</option><option>Live-stream train</option></select></div>' +
      '</div></div>' +
      '<div id="exWall"></div>' +
      '<div class="card mt-16 glow-purple" id="exForm">' +
      '<h3 class="card-title">' + AppIcons.bell + ' Post a cross-promo offer</h3>' +
      '<div class="field-grid">' +
      '<div class="field"><label>Your handle</label><input type="text" id="exMyName" placeholder="CreatorName" /></div>' +
      '<div class="field"><label>Niche</label><input type="text" id="exMyNiche" placeholder="Fitness" /></div>' +
      '<div class="field"><label>Channel size</label><input type="text" id="exMySize" placeholder="1k-5k" /></div>' +
      '<div class="field"><label>Offer type</label><select id="exMyType"><option>Shoutout swap</option><option>Collab</option><option>Featured spot</option><option>Live-stream train</option></select></div>' +
      '</div>' +
      '<div class="field"><label>What you offer / what you want</label><textarea id="exMyMsg" placeholder="We shout each other out in Friday Shorts. Countdown template ready."></textarea></div>' +
      '<button class="btn btn-purple btn-lg" onclick="Exchange.postOffer()">' + AppIcons.zap + ' Publish to the wall</button>' +
      '</div>' +
      '</div>' +

      '<div class="flex-col gap-16">' +
      '<div class="card glow-cyan">' +
      '<h3 class="card-title">' + AppIcons.brain + ' Partner matcher</h3>' +
      '<p class="small dim mb-12">Tell us your niche + size and we’ll rank compatible swap partners already on the wall.</p>' +
      '<div class="field-grid">' +
      '<div class="field"><label>Your niche</label><input type="text" id="mmNiche" placeholder="Study / fitness…" /></div>' +
      '<div class="field"><label>Your size</label><input type="text" id="mmSize" placeholder="1k-5k" /></div>' +
      '</div>' +
      '<button class="btn btn-cyan btn-block" onclick="Exchange.matchMe()">' + AppIcons.rocket + ' Match me with partners</button>' +
      '<div id="mmResult" class="mt-16"></div>' +
      '</div>' +
      '<div class="card glow-green">' +
      '<h3 class="card-title">' + AppIcons.shield + ' Safe-swap rules</h3>' +
      '<div class="check-list">' +
      ['Never pay for shoutouts or buy “promo packs”.', 'Cross-promote only channels your audience would actually like.', 'Agree upfront: what you feature, when, and for how long.', 'Check each other’s engagement rate before swapping.', 'Start with 1 swap; judge by visit quality, not raw subscriber spikes.'].map((t, i) =>
        '<div class="check-item"><input type="checkbox" id="exr_' + i + '"/><span class="txt small">' + t + '</span></div>').join("") +
      '</div></div>' +
      '<div class="card">' +
      '<h3 class="card-title">' + AppIcons.chart + ' How this drives your first traffic</h3>' +
      '<p class="small muted">One featured spot on a same-niche channel under 10k subs typically sends <b>50-300 high-intent views</b> and an instant subscriber quality signal — the exact trust signal new channels need to escape the discovery floor.</p>' +
      '</div></div>' +
      '</div>';

    document.getElementById("exSearch").addEventListener("input", drawWall);
    document.getElementById("exType").addEventListener("change", drawWall);
    drawWall();
  }

  function drawWall() {
    const box = document.getElementById("exWall");
    if (!box) return;
    let list = posts().slice();
    const q = (document.getElementById("exSearch").value || "").toLowerCase();
    const type = document.getElementById("exType").value;
    if (q) list = list.filter((p) => (p.msg + " " + p.niche + " " + p.type).toLowerCase().indexOf(q) !== -1);
    if (type) list = list.filter((p) => p.type === type);
    list.sort((a, b) => b.votes - a.votes);

    box.innerHTML = list.length ? '<div class="flex-col gap-12">' +
      list.map((p) =>
        '<div class="card" data-id="' + esc(p.id) + '">' +
        '<div class="flex gap-12 wrap" style="align-items:flex-start">' +
        '<span class="avatar" style="background:' + (p.avatar || hashColor(p.niche)) + '">' + esc(p.u.slice(0, 2).toUpperCase()) + '</span>' +
        '<div class="grow">' +
        '<div class="flex gap-8 wrap align-center">' +
        '<b>' + esc(p.u) + '</b>' +
        '<span class="' + Ui.cn("chip", "chip-purple") + '">' + esc(p.type) + '</span>' +
        '<span class="chip">' + esc(p.niche) + '</span>' +
        '<span class="' + Ui.cn("chip", "chip-cyan") + '">' + esc(p.size) + ' subs</span>' +
        '</div>' +
        '<p class="small muted mt-8">' + esc(p.msg) + '</p>' +
        '</div>' +
        '<div class="right">' +
        '<button class="btn btn-sm btn-ghost" onclick="Exchange.upvote(\'' + esc(p.id) + '\')">&#9650; <b>' + p.votes + '</b></button>' +
        '<div class="small dim mt-8">' + (p.daysAgo ? p.daysAgo + " ago" : "today") + '</div>' +
        '</div></div></div>'
      ).join("") + '</div>' :
      '<div class="empty-state"><div class="big">🤝</div>No offers match.<br/><span class="dim">Be the first — post your offer below.</span></div>';
    if (window.Auto && box.querySelector(".card")) { try { Auto.attach(box); } catch (e) {} }
  }

  function upvote(id) {
    const list = posts();
    const p = list.find((x) => x.id === id);
    if (!p) return;
    p.votes++;
    saveP(list);
    Renderers.toast("Signal boosted for this creator.", "good");
    drawWall();
  }

  function postOffer() {
    const g = (id) => document.getElementById(id).value.trim();
    const name = g("exMyName"), niche = g("exMyNiche"), size = g("exMySize"), msg = g("exMyMsg");
    if (!name || !niche || !msg) return Renderers.toast("Handle, niche and your message are required.", "bad");
    const p = {
      id: "x-" + Date.now(), u: name.slice(0, 20), avatar: hashColor(name), niche: niche.slice(0, 24),
      size: size || "unknown", type: document.getElementById("exMyType").value,
      msg: msg.slice(0, 280), votes: 1, daysAgo: "just now"
    };
    const list = posts();
    list.unshift(p);
    saveP(list);
    ["exMyName", "exMyNiche", "exMySize", "exMyMsg"].forEach((id) => {
      const el = document.getElementById(id); if (el) el.value = "";
    });
    Renderers.toast("Offer is live on the wall. Watch for replies in the thread.", "good");
    if (window.Confetti) {
      try { Confetti.burst({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
    }
    drawWall();
  }

  /* matcher: simple affinity scoring against wall posts */
  function matchMe() {
    const niche = (document.getElementById("mmNiche").value || "").toLowerCase();
    const sizeRaw = (document.getElementById("mmSize").value || "").toLowerCase();
    const box = document.getElementById("mmResult");
    const parseSize = (s) => parseFloat(s);
    let myMin = 0, myMax = 1000000;
    if (sizeRaw.match(/^[\d.]+k?$/)) {
      const n = parseSize(sizeRaw.replace("k", "")) * (sizeRaw.indexOf("k") !== -1 ? 1000 : 1);
      myMin = Math.max(0, n * 0.5); myMax = n * 5;
    }
    let list = posts().slice();
    list = list.filter((p) => {
      const sz = parseSize((p.size || "").replace(/[^0-9.k]/gi, "").replace("k", "")) * ((p.size || "").indexOf("k") !== -1 ? 1000 : 1);
      if (!sz) return true;
      return !myMin || (sz >= myMin && sz <= myMax);
    });
    list.sort((a, b) => {
      const aScore = scorePost(a, niche);
      const bScore = scorePost(b, niche);
      return bScore - aScore;
    });
    const top = list.slice(0, 3);
    box.innerHTML =
      '<p class="small dim mb-12"><b style="color:var(--cyan)">' + top.length + ' compatible partners</b> ranked by niche overlap + size fit + wall signal.</p>' +
      top.map((p, i) =>
        '<div class="flex gap-8 align-center mt-8"><span class="chip chip-' + (i === 0 ? "green" : "cyan") + '" style="font-size:10px">TOP ' + (i + 1) + '</span>' +
        '<span class="avatar" style="width:30px;height:30px;font-size:11px;flex:0 0 30px;background:' + (p.avatar || hashColor(p.niche)) + '">' + esc(p.u.slice(0, 2).toUpperCase()) + '</span>' +
        '<div class="grow"><b class="small">' + esc(p.u) + '</b> <span class="small dim">· ' + esc(p.niche) + ' · ' + esc(p.size) + '</span><div class="small muted">' + esc(p.type) + ' — ' + esc(trunc(p.msg, 60)) + '</div></div>' +
        '<span class="votes small">' + p.votes + ' &#9650;</span></div>').join("") +
      '<p class="small dim mt-12">Match score blends: keyword overlap with your niche, comparable audience size, and offer type credibility. Always vet engagement manually first.</p>' +
      (top.length ? '' : '<p class="small muted mt-8">Post an offer above to start your network.</p>');
  }

  function scorePost(p, niche) {
    let s = 0;
    const hay = (p.niche + " " + p.msg + " " + p.type).toLowerCase();
    if (niche && niche.length > 2) {
      const words = niche.split(/\s+/);
      for (const w of words) if (w.length > 2 && hay.indexOf(w) !== -1) s += 30;
      s += niche.slice(0, 2) === p.niche.slice(0, 2).toLowerCase() ? 10 : 0;
    }
    s += Math.min(20, p.votes * 2);
    return s;
  }

  function trunc(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function hashColor(s) {
    const colors = ["#a97bff", "#00e5ff", "#00ff88", "#ffb547", "#ff5ce1", "#ff4757"];
    let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return colors[h % colors.length];
  }

  window.Exchange = { render, drawWall, upvote, postOffer, matchMe };
})();