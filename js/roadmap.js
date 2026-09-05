/* ============================================================
   ViralForge — roadmap.js
   Structured Milestone Roadmap Hub. Three pre-built blueprints
   with timeline milestones, daily checklists, progress tracking
   and earned badges. Progress persisted locally.
   ============================================================ */

(function () {
  const ICON = { red: AppIcons.flag, cyan: AppIcons.clock, green: AppIcons.bolt };

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function scopeFor(id) { return "roadmap_" + id; }
  function badgeScope(id) { return "roadmap_" + id + "_badges"; }

  function progressOf(blueprint) {
    const scope = scopeFor(blueprint.id);
    const map = Store.get(scope, {});
    let tot = 0, done = 0;
    blueprint.phases.forEach((ph, pi) => ph.tasks.forEach((t, ti) => {
      tot++;
      if (map[ph.id ? ph.id : pi + "_" + ti]) done++;
    }));
    return { tot, done, pct: tot ? Math.round((done / tot) * 100) : 0 };
  }

  function taskKey(pi, ti) { return pi + "_" + ti; }

  /* ---------- list ---------- */
  function render() {
    const el = document.getElementById("m-roadmap");
    el.innerHTML =
      '<div class="page-head">' +
      '<h1 class="page-title">' + AppIcons.map + ' ' + T("roadmap.h") + ' <span class="tag tag-green">PROGRESS TRACKED</span></h1>' +
      '<p class="page-sub">' + T("roadmap.s") + '</p>' +
      '</div>' +
      '<div class="grid grid-3">' +
      window.BLUEPRINTS.map((b) => {
        const p = progressOf(b);
        const grad = { red: "glow-red", cyan: "glow-cyan", green: "glow-green" }[b.grad];
        return '<div class="card interactive noise-glow ' + grad + '" onclick="window.location.hash=\'#/roadmap/' + b.id + '\'">' +
          '<div class="plan-ico" style="background:var(--grad-' + b.grad + ');color:#fff">' + ICON[b.grad] + '</div>' +
          '<div class="flex wrap gap-6 mb-8">' + b.meta.map((m) => '<span class="chip chip-' + b.grad + '">' + esc(m) + '</span>').join("") +
          '<span class="chip" style="margin-left:auto">' + b.days + ' days</span></div>' +
          '<h3 class="card-title" style="font-size:16px">' + esc(b.title) + '</h3>' +
          '<p class="small muted mt-8">' + esc(b.tagline) + '</p>' +
          '<div class="mt-16">' +
          '<div class="meter-top"><span class="small dim">' + p.done + ' / ' + p.tot + ' actions</span><span class="small" style="font-weight:800" class="' + (p.pct === 100 ? "glow-green-text" : "glow-red-text") + '">' + p.pct + '%</span></div>' +
          '<div class="bar bar-' + b.grad + ' mt-8"><span style="width:' + p.pct + '%"></span></div>' +
          '</div></div>';
      }).join("") +
      '</div>' +
      '<div class="card mt-16 glow-cyan">' +
      '<div class="flex wrap gap-12" style="align-items:center">' +
      '<div class="stat-ico" style="background:rgba(0,229,255,.12);color:var(--cyan)">' + AppIcons.trophy + '</div>' +
      '<div class="grow"><h3 class="card-title">Badge rules</h3>' +
      '<p class="small muted">Finish every action inside a phase and you earn that phase’s milestone badge. All three blueprints = the ViralForge Founder trophy.</p></div>' +
      '<div id="founderBadge" class="center">' + badgeBoard() + '</div>' +
      '</div></div>';
  }

  function badgeBoard() {
    const allDone = window.BLUEPRINTS.every((b) => progressOf(b).pct === 100);
    return '<div class="' + Ui.cn("badge-pill", allDone ? "earned" : "next") + '" style="font-size:12px">' + AppIcons.crown + ' ' + (allDone ? "FOUNDER TROPHY EARNED" : "COMPLETE ALL 3 PLANS") + '</div>';
  }

  /* ---------- detail ---------- */
  function detail(id) {
    const b = window.BLUEPRINTS.find((x) => x.id === id);
    const el = document.getElementById("m-roadmap");
    if (!b) { el.innerHTML = '<div class="empty-state"><div class="big">🧭</div>Blueprint not found.<br/><a href="#/roadmap">Back to roadmaps</a></div>'; return; }

    const p = progressOf(b);
    const badges = Store.get(badgeScope(id), {});
    const scope = scopeFor(id);

    el.innerHTML =
      '<div class="page-head">' +
      '<a class="small dim" href="#/roadmap">&#8592; All roadmaps</a>' +
      '<h1 class="page-title">' + ICON[b.grad] + ' ' + esc(b.title) + ' <span class="tag tag-' + b.grad + '">' + b.days + '-DAY PLAN</span></h1>' +
      '<p class="page-sub">' + esc(b.tagline) + '</p>' +
      '</div>' +

      '<div class="card glow-' + b.grad + '">' +
      '<div class="flex wrap gap-12" style="align-items:center">' +
      '<div class="grow">' +
      '<div class="meter-top"><span class="small dim">' + p.done + ' of ' + p.tot + ' actions complete</span><span class="small" style="font-weight:800;font-size:18px">' + p.pct + '%</span></div>' +
      '<div class="bar bar-' + b.grad + ' mt-8" style="height:12px"><span style="width:' + p.pct + '%"></span></div>' +
      '</div>' +
      '<div class="center"><div class="' + Ui.cn("badge-pill", p.pct === 100 ? "earned" : "next") + '">' + (p.pct === 100 ? AppIcons.trophy + " PLAN COMPLETE" : AppIcons.lock + " " + (100 - p.pct) + "% TO GO") + '</div>' +
      '<div class="small dim mt-8">' + Object.keys(badges).length + ' milestone badge' + (Object.keys(badges).length === 1 ? "" : "s") + ' won</div></div>' +
      '</div></div>' +

      '<div class="mt-20" style="position:relative">' +
      b.phases.map((ph, pi) => {
        const doneIn = ph.tasks.filter((t, ti) => Store.isChecked(scope, taskKey(pi, ti))).length;
        const all = doneIn === ph.tasks.length;
        const earned = !!(badges[pi]);
        const state = all ? "done" : (pi === 0 || Store.isChecked(scope, taskKey(pi - 1, ph.tasks.length - 1)) ? "now" : "locked");
        const stLabel = state === "done" ? 'FINISHED' : state === "now" ? 'CURRENT' : 'NOT YET';
        return '<div class="milestone">' +
          '<div class="node ' + state + '">' + (state === "done" ? "&#10003;" : pi + 1) + '</div>' +
          '<div class="mbody">' +
          '<div class="mtitle">' + esc(ph.title) +
          '<span class="' + Ui.cn("badge-pill", earned ? "earned" : "next") + '">' + (earned ? AppIcons.trophy + " Badge " + new Date(badges[pi]).toLocaleDateString() : AppIcons.check + " " + stLabel) + '</span>' +
          '</div>' +
          '<p class="small muted mb-12">' + esc(ph.desc) + '</p>' +
          '<div class="check-list">' +
          ph.tasks.map((t, ti) => {
            const key = taskKey(pi, ti);
            const done = Store.isChecked(scope, key);
            return '<div class="check-item ' + (done ? "done" : "") + '">' +
              '<input type="checkbox" data-bp="' + b.id + '" data-key="' + key + '" data-pi="' + pi + '" ' + (done ? "checked" : "") + ' />' +
              '<span class="txt">' + esc(t.t) + tagLink(t.m) + '</span>' +
              '</div>';
          }).join("") +
          '</div>' +
          '<div class="meter-top mt-12" style="max-width:320px"><span class="small dim">' + doneIn + '/' + ph.tasks.length + ' in this phase</span></div>' +
          '<div class="bar bar-' + b.grad + ' mt-8" style="max-width:320px"><span style="width:' + Math.round(doneIn / ph.tasks.length * 100) + '%"></span></div>' +
          '</div></div>';
      }).join("") +
      '</div>' +

      '<div class="flex gap-12 wrap mt-16">' +
      '<button class="btn btn-ghost" onclick="Roadmap.copyProgress(\'' + b.id + '\')">' + AppIcons.copy + ' Copy progress summary</button>' +
      '<button class="btn btn-ghost" onclick="Roadmap.reset(\'' + b.id + '\')">' + AppIcons.trash + ' Reset this plan</button>' +
      '<span class="small dim grow center">Progress autosaves in your browser as you tick.</span>' +
      '</div>';

    el.querySelectorAll('input[type=checkbox][data-bp="' + b.id + '"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        Store.toggleChecked(scope, cb.getAttribute("data-key"));
        cb.closest(".check-item").classList.toggle("done", cb.checked);
        checkPhaseBadge(b, parseInt(cb.getAttribute("data-pi"), 10));
        Renderers.toast(cb.checked ? "Action logged. Consistency beats intensity." : "Action reopened.", cb.checked ? "good" : "");
        const pct = progressOf(b).pct;
        if (window.Ux) { try { Ux.setRoadmap(pct); } catch (e) {} }
        if (pct === 100) {
          Renderers.toast("🎉 Blueprint complete — Founder-trophy candidate!", "good");
          if (window.Confetti) { try { Confetti.big(); } catch (e) {} }
        }
      });
    });

    const phaseBox = el.querySelector(".mt-20");
    if (phaseBox && window.Auto) { try { Auto.attach(phaseBox); } catch (e) {} }
  }

  function checkPhaseBadge(b, pi) {
    const badges = Store.get(badgeScope(b.id), {});
    if (badges[pi]) return;
    const scope = scopeFor(b.id);
    const all = b.phases[pi].tasks.every((t, ti) => Store.isChecked(scope, taskKey(pi, ti)));
    if (all) {
      badges[pi] = new Date().toISOString();
      Store.set(badgeScope(b.id), badges);
      Renderers.toast("🎖 Milestone badge earned: “" + b.phases[pi].title + "”", "good");
      if (window.Confetti) {
        try { Confetti.burst({ particleCount: 170, spread: 80, origin: { y: 0.4 } }); } catch (e) {}
      }
    }
  }

  function tagLink(m) {
    if (!m) return "";
    return ' <span class="where"><a href="#/' + m + '">' + AppIcons.external + ' tool</a></span>';
  }

  function copyProgress(id) {
    const b = window.BLUEPRINTS.find((x) => x.id === id);
    const p = progressOf(b);
    const badges = Store.get(badgeScope(id), {});
    const txt = "VIRALFORGE ROADMAP — " + b.title + "\nProgress: " + p.pct + "% (" + p.done + "/" + p.tot + " actions)\nMilestones: " + Object.keys(badges).length + "/" + b.phases.length + " badges\n\n" +
      b.phases.map((ph, pi) => {
        const done = ph.tasks.filter((t, ti) => Store.isChecked(scopeFor(id), taskKey(pi, ti))).length;
        return "- " + ph.title + " (" + done + "/" + ph.tasks.length + (badges[pi] ? " · badge won" : "") + ")";
      }).join("\n");
    Renderers.copy(txt, "Progress summary copied.");
  }

  function reset(id) {
    if (!confirm("Reset ALL progress for this blueprint? This cannot be undone.")) return;
    Store.remove(scopeFor(id));
    Store.remove(badgeScope(id));
    Renderers.toast("Blueprint reset. Fresh start — go get it.", "good");
    Roadmap.detail(id);
  }

  window.Roadmap = { render, detail, copyProgress, reset, progressOf };
})();