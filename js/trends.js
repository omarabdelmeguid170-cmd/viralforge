/* ============================================================
   ViralForge — trends.js
   AI Virtual Employee · 24-Hour Viral Traffic Engine.
   Scans real YouTube trending feeds (proxied), scores viral
   velocity, and maps niches → "create now" plays.
   ============================================================ */

(function () {
  const REGIONS = { US: "US", GB: "GB", IN: "IN", CA: "CA", AU: "AU", JP: "JP", KR: "KR", DE: "DE", FR: "FR", BR: "BR" };
  const PROXIES = [
    (u) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
    (u) => "https://corsproxy.io/?url=" + encodeURIComponent(u)
  ];
  const FEED = "https://www.youtube.com/feeds/videos.xml?chart=mostpopular&regionCode=";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function render() {
    const el = document.getElementById("m-trends");
    el.innerHTML =
      '<div class="page-head">' +
      '<h1 class="page-title">' + AppIcons.bolt + ' ' + T("trends.h") + ' <span class="tag tag-red">REAL-TIME</span></h1>' +
      '<p class="page-sub">' + T("trends.s") + '</p>' +
      '</div>' +
      '<div class="card glow-red">' +
      '<div class="card-head flex-wrap">' +
      '<h3 class="card-title">' + AppIcons.tv + ' Live Trending Feed</h3>' +
      '<div class="flex gap-8 wrap">' +
      '<select id="trRegion" style="max-width:150px" title="Region">' +
      Object.keys(REGIONS).map((k) => '<option value="' + k + '">' + REGIONS[k] + '</option>').join("") +
      '</select>' +
      '<button class="btn btn-primary btn-sm" id="btnScan"><span id="scanIco">' + AppIcons.bolt + '</span> Scan now</button>' +
      '</div></div>' +
      '<p class="small dim">Sources: YouTube most-popular RSS feed per region, parsed through a public CORS mirror. Data refreshes live on every scan.</p>' +
      '</div>' +
      '<div class="grid grid-2 mt-16" style="grid-template-columns:1.6fr 1fr">' +
      '<div class="card" id="trendCard"><div class="center" style="padding:32px"><p class="dim mb-12">Hit <b>Scan now</b> to pull the freshest trending data.</p><button class="btn btn-primary" onclick="Trends.scan()">' + AppIcons.bolt + ' Scan the global feed</button></div></div>' +
      '<div id="trendPlays" class="flex-col gap-16"></div>' +
      '</div>';

    const btn = document.getElementById("btnScan");
    btn.addEventListener("click", () => Trends.scan());

    /* auto-scan once if we have nothing */
    const cached = Store.get("trendscan", null);
    if (cached && cached.items && cached.items.length) {
      Trends.renderScan(cached);
    } else {
      Trends.scan();
    }
  }

  async function scan() {
    const region = document.getElementById("trRegion").value;
    const card = document.getElementById("trendCard");
    card.innerHTML = '<div class="center" style="padding:32px"><span class="spinner"></span><p class="muted mt-12">Pulling ' + region + ' trending feed + scoring velocity…</p></div>';

    let rss = null;
    for (const proxy of PROXIES) {
      const url = proxy(FEED + region);
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 9000);
        if (window.Data) {
          rss = await Data.fetchText(url, { ttl: 0, signal: ctrl.signal });
        } else {
          const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
          if (res.ok) rss = await res.text();
        }
        clearTimeout(t);
        if (rss) break;
      } catch (e) { /* try next proxy */ }
    }

    let items;
    if (rss) {
      items = parseFeed(rss);
    } else {
      items = null;
    }

    if (!items || !items.length) {
      Renderers.toast("Feed unreachable (offline/CORS) — showing demo dataset.", "");
      items = window.TREND_FALLBACK.map((t, i) => expandFallback(t, i, region));
    }

    const scored = scoreItems(items);
    const result = { region, scanned: new Date().toISOString(), items: scored, dfyS: dfy(scored) };
    Store.set("trendscan", result);
    renderScan(result);
  }

  function expandFallback(t, i, region) {
    const hours = t.hours;
    const views = parseInt(t.views.replace(/\D/g, ""), 10) || 100000;
    return {
      title: t.title, link: "https://www.youtube.com/results?search_query=" + encodeURIComponent(t.title),
      published: new Date(Date.now() - hours * 3600000).toISOString(),
      ageHours: hours, views, likes: parseInt((t.likes || "1K").replace(/\D/g, ""), 10) || 1000,
      region, channel: "Trending · " + t.cat, verified: t.verified
    };
  }

  function parseFeed(xml) {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const entries = doc.querySelectorAll("entry");
    const out = [];
    entries.forEach((en) => {
      const title = en.querySelector("title").textContent;
      const linkEl = en.querySelector("link");
      const link = linkEl ? linkEl.getAttribute("href") : "";
      const published = en.querySelector("published");
      const statEl = en.querySelector("media\\:statistics");
      const commEl = en.querySelector("media\\:community yt\\:statistics");
      const views = statEl ? parseInt(statEl.getAttribute("views") || "0", 10) || 0 : 0;
      const likes = commEl ? parseInt(commEl.getAttribute("likes") || "0", 10) || 0 : 0;
      const ageHours = published ? Math.max(0.1, (Date.now() - new Date(published.textContent).getTime()) / 3600000) : 24;
      out.push({
        title, link,
        likes, views: views || 0,
        ageHours, channel: "Trend feed", region: "RSS",
        published: published ? published.textContent : new Date().toISOString(),
        verified: !!views
      });
    });
    return out;
  }

  function scoreItems(items) {
    const rates = items.map((v) => v.views / Math.max(1, v.ageHours));
    const maxRate = Math.max.apply(null, rates.concat([1]));
    return items.map((v) => {
      const ratePct = ((v.views / Math.max(1, v.ageHours)) / maxRate) * 60;
      let fresh = 0;
      if (v.ageHours < 6) fresh = 20;
      else if (v.ageHours < 12) fresh = 13;
      else if (v.ageHours < 24) fresh = 7;
      else if (v.ageHours < 48) fresh = 2;
      const score = Math.min(99, Math.round(ratePct + fresh));
      const label = score >= 70 ? ["Explosive", "red"] : score >= 48 ? ["Fast", "cyan"] : score >= 32 ? ["Climbing", "green"] : ["Monitor", "amber"];
      return Object.assign({}, v, { score, label: label[0], labelCls: label[1] });
    }).sort((a, b) => b.score - a.score);
  }

  /* derive your plays: matched niches + create-now actions */
  function dfy(items) {
    const seen = {};
    const plays = [];
    items.forEach((v) => {
      const low = v.title.toLowerCase();
      for (const row of window.TREND_MAP) {
        for (const k of row.k) {
          if (low.indexOf(k) !== -1 && !seen[row.niche]) {
            seen[row.niche] = true;
            plays.push({ niche: row.niche, action: row.action, title: v.title, score: v.score });
            return;
          }
        }
      }
    });
    if (plays.length < 4) {
      const extras = ["Self-improvement", "Reaction / commentary", "Reviews & comparisons"].filter((x) => !seen[x]).slice(0, 4 - plays.length)
        .forEach((n, i) => plays.push({ niche: n, action: "Reaction: take the top trend and add your niche spin — record this hour.", title: items[i % items.length].title, score: 60 }));
    }
    return plays.slice(0, 5);
  }

  function renderScan(result) {
    const card = document.getElementById("trendCard");
    if (!card) return;

    const top = result.items.slice(0, 8);
    card.innerHTML =
      '<div class="flex wrap gap-8 mb-12">' +
      '<span class="tag tag-cyan">Region: ' + result.region + '</span>' +
      '<span class="tag tag-green">' + result.items.length + ' videos scored</span>' +
      '<span class="tag tag-amber">Scanned ' + timeAgo(result.scanned) + '</span>' +
      '</div>' +
      encodeTable(top) +
      '<div class="flex wrap gap-8 mt-12">' +
      '<button class="btn btn-ghost btn-sm" onclick="Trends.refresh()">' + AppIcons.refresh + ' Rescan</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="Trends.exportScan()">' + AppIcons.download + ' Export' + '</button>' +
      '</div>';

    const plays = renderPlays(result);
    document.getElementById("trendPlays").innerHTML = plays;
  }

  function encodeTable(items) {
    return '<div class="table-wrap"><table>' +
      '<thead><tr><th>#</th><th>Trending video</th><th>Velocity</th><th>Age</th><th>Boost</th></tr></thead><tbody>' +
      items.map((v, i) =>
        '<tr>' +
        '<td style="font-weight:800" class="' + (i === 0 ? "glow-red-text" : i === 1 ? "glow-cyan-text" : i === 2 ? "glow-green-text" : "dim") + '">' + (i + 1) + '</td>' +
        '<td><a href="' + esc(v.link) + '" target="_blank" rel="noopener">' + esc(v.title) + '</a>' +
        '<div class="small dim mt-4">' + (esc(v.channel) || "") + (v.verified ? ' <span class="chip chip-cyan">verified</span>' : "") + '</div></td>' +
        '<td><div style="min-width:110px"><div class="meter-top"><span class="small" style="font-weight:800">' + v.score + '</span><span class="chip chip-' + v.labelCls + '">' + v.label + '</span></div>' +
        '<div class="bar bar-' + v.labelCls + '"><span style="width:' + v.score + '%"></span></div></div></td>' +
        '<td class="dim">' + ageText(v.ageHours) + '</td>' +
        '<td class="dim">' + fmtV(v.views) + ' views</td>' +
        '</tr>'
      ).join("") +
      '</tbody></table></div>';
  }

  function renderPlays(result) {
    const plays = result.dfyS || dfy(result.items);
    const topPick = result.items[0];
    return '' +
      '<div class="card glow-green"><h3 class="card-title">' + AppIcons.brain + ' Your “Create Now” Plays</h3>' +
      '<p class="small dim mb-12">Niches & actions auto-derived from today’s trend surface.</p>' +
      '<div class="flex-col gap-8">' +
      plays.map((p, i) =>
        '<div class="check-item"><span class="txt"><b class="glow-green-text">' + esc(p.niche) + '</b><br/><span class="small muted">' + esc(p.action) + '</span><br/><span class="small dim">signal › ' + esc(trunc(p.title, 58)) + '</span></span></div>'
      ).join("") +
      '</div></div>' +
      (topPick ? '<div class="card glow-cyan"><h3 class="card-title">' + AppIcons.rocket + ' 24-Hour Spike Play</h3>' +
        '<p class="small muted">Hottest item right now:</p>' +
        '<p class="mt-8" style="font-weight:700">' + esc(trunc(topPick.title, 72)) + '</p>' +
        '<div class="divider"></div>' +
        '<p class="small">Your angle: film a 45-second reaction/commentary or “I tested it” Short, publish within 6 hours, add #' + esc(topPick.title.split(" ").slice(0, 3).join("")) + ' and title it with the trend keyword.</p>' +
        '<button class="btn btn-cyan btn-sm mt-12" onclick="Trends.copyPlay()">' + AppIcons.copy + ' Copy spike brief</button></div>' : '') +
      '<div class="card"><h3 class="card-title">' + AppIcons.check + ' 24h Action Checklist</h3><div class="check-list">' +
      ["Record + edit a Short that rides the #1 trend", "Publish in the next 6h; push via community post", "Re-cut 2 old videos around trend keywords", "Drop a matching idea into the Script & Idea Factory", "Bank the scores; rescan tomorrow same time"].map((t, i) =>
        '<div class="check-item"><input type="checkbox" id="td_' + i + '"/><span class="txt">' + t + '</span></div>').join("") +
      '</div></div>';
  }

  function copyPlay() {
    const r = Store.get("trendscan", null);
    if (!r || !r.items.length) return Renderers.toast("Scan first.", "bad");
    const top = r.items[0];
    const txt = "VIRALFORGE SPIKE BRIEF — " + new Date().toLocaleString() +
      "\nTrend: " + top.title +
      "\nScore: " + top.score + " (" + top.label + "), " + fmtV(top.views) + " views in " + ageText(top.ageHours) +
      "\n\nAction: publish a 45-60s Short within 6h.\nAngle: react / test / 3-point breakdown with the trend keyword in the title.\nPost to community + Creator Exchange after upload.";
    Renderers.copy(txt, "Spike brief copied.");
  }

  function exportScan() {
    const r = Store.get("trendscan", null);
    if (!r) return Renderers.toast("Nothing scanned yet.", "bad");
    Renderers.download("viralforge-trendscan.json", JSON.stringify(r.items, null, 2));
    Renderers.toast("Trend scan exported.", "good");
  }

  function refresh() { Trends.scan(); }

  /* ---- small utils ---- */
  function ageText(h) {
    if (h < 1) return Math.round(h * 60) + "m ago";
    if (h < 24) return Math.round(h) + "h ago";
    return (h / 24).toFixed(1) + "d ago";
  }
  function timeAgo(iso) {
    const d = (Date.now() - new Date(iso).getTime()) / 60000;
    return d < 1 ? "just now" : d < 60 ? Math.round(d) + "m ago" : Math.round(d / 60) + "h ago";
  }
  function fmtV(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return "" + n;
  }
  function trunc(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }

  const Icons = { refresh: AppIcons.refresh, download: AppIcons.download };
  window.Trends = { render, scan, refresh, copyPlay, exportScan, renderScan, _icons: Icons };
})();