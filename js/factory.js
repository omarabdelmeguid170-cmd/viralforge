/* ============================================================
   ViralForge — factory.js
   AI Virtual Employee · Script & Idea Factory.
   Generates high-CTR ideas, hook variations and full scripts
   (Shorts & long-form) from selectors. 100% deterministic AI.
   ============================================================ */

(function () {
  function render() {
    const el = document.getElementById("m-factory");
    const n = window.FACTORY;
    el.innerHTML =
      '<div class="page-head">' +
      '<h1 class="page-title">' + AppIcons.pen + ' ' + T("factory.h") + ' <span class="tag tag-red">AI VIRTUAL EMPLOYEE</span></h1>' +
      '<p class="page-sub">' + T("factory.s") + '</p>' +
      '</div>' +
      '<div class="card">' +
      '<div class="card-head"><h3 class="card-title">' + AppIcons.sparkle + ' Configure the generator</h3><span class="tag tag-cyan">No API·no cost</span></div>' +
      '<div class="field-grid">' +
      '<div class="field"><label>Format</label>' +
      '<select id="fxFormat">' +
      '<option value="short">YouTube Shorts</option><option value="long">Long-form video</option>' +
      '</select></div>' +
      '<div class="field"><label>Niche</label><select id="fxNiche">' +
      n.niches.map((x) => '<option>' + x + '</option>').join("") +
      '</select></div>' +
      '<div class="field"><label>Tone</label><select id="fxTone">' +
      n.tones.map((x) => '<option>' + x + '</option>').join("") +
      '</select></div>' +
      '<div class="field"><label>CTA (choose your end goal)</label><select id="fxCta">' +
      n.ctas.map((x) => '<option>' + x + '</option>').join("") +
      '</select></div>' +
      '<div class="field"><label>Topic / content seed</label><input type="text" id="fxTopic" placeholder="e.g. the $2 viral ingredients, building a study routine…" value="" /></div>' +
      '<div class="field"><label>Hook formula</label><select id="fxHook">' +
      '<option value="auto">Auto-pick (best match)</option>' +
      n.hookFormulas.map((h, i) => '<option value="' + i + '">' + h.name + '</option>').join("") +
      '</select></div>' +
      '</div>' +
      (n.structures.short ? '' : '') +
      '<div class="flex wrap gap-12 mt-8">' +
      '<button class="btn btn-primary btn-lg" onclick="Factory.ideas()">' + AppIcons.bolt + ' Bank 6 video ideas</button>' +
      '<button class="btn btn-green btn-lg" onclick="Factory.script()">' + AppIcons.video + ' Generate full script</button>' +
      '</div></div>' +
      '<div class="section-title">Output <span class="line"></span></div>' +
      '<div id="fxOut"></div>';

    ["fxFormat", "fxNiche", "fxTone", "fxCta", "fxHook"].forEach((id) => {
      document.getElementById(id).addEventListener("change", () => Store.set(id, document.getElementById(id).value));
      const v = Store.string(id, "");
      if (v) document.getElementById(id).value = v;
    });
    document.getElementById("fxTopic").value = Store.string("fxTopic", "");
    document.getElementById("fxTopic").addEventListener("input", () => Store.set("fxTopic", document.getElementById("fxTopic").value));
  }

  function pick(key) { const el = document.getElementById(key); return el ? el.value : ""; }
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function randomInt(n) { return Math.floor(Math.random() * n); }
  function sample(arr) { return arr[randomInt(arr.length)]; }

  /* ---------- ideas ---------- */
  function ideas() {
    const niche = pick("fxNiche");
    const out = document.getElementById("fxOut");
    const list = [];
    /* 3 mashup ideas + 3 society-angle ideas */
    window.FACTORY.ideaMash.forEach((m, i) => {
      let idea = m(niche);
      if (i > 2) idea = angleIdea(niche, i);
      list.push(idea);
    });
    const saved = { niche, list, ts: Date.now() };
    Store.set("lastideas", saved);
    out.innerHTML =
      '<div class="grid grid-2">' +
      list.map((idea, i) =>
        '<div class="card interactive noise-glow" onclick="Factory.scriptWith(\'' + esc(idea).replace(/'/g, "\\'") + '\')">' +
        '<div class="flex gap-8 mb-8"><span class="chip chip-' + (i % 2 ? "cyan" : "red") + '">IDEA #' + (i + 1) + '</span><span class="chip chip-cyan" style="margin-left:auto">' + esc(niche) + '</span></div>' +
        '<p style="font-weight:750;font-size:15px">' + esc(idea) + '</p>' +
        '<p class="small dim mt-8">Click to generate this exact idea as a full script &nbsp;&#8594;</p>' +
        '</div>').join("") +
      '</div>' +
      '<div class="muted small center mt-12">Ideas are deterministic from your niche + proven viral patterns. Regenerate for fresh angles.</div>';
  }

  function angleIdea(niche, i) {
    const social = [
      'Reacting to the WORST ' + niche + ' advice on the internet',
      'The ' + niche + ' problem nobody wants to admit',
      'I asked 50 people in ' + niche + ' their #1 secret',
      'What your ' + niche + ' idol does that you don’t (yet)'
    ];
    return social[i % social.length];
  }

  /* ---------- script ---------- */
  function script() { scriptWith(""); }

  function scriptWith(topicSeed) {
    const seed = (topicSeed || pick("fxTopic") || "your chosen topic").trim();
    const niche = pick("fxNiche");
    const tone = pick("fxTone");
    const cta = pick("fxCta");
    const format = pick("fxFormat");
    const hookSel = pick("fxHook");

    const hook = hookData(seed, niche, hookSel, format);
    const s = generateScript({ seed, niche, tone, cta, format, hook });
    const result = { seed, niche, tone, cta, format, hook, s, ts: Date.now() };
    Store.set("lastscript", result);

    const out = document.getElementById("fxOut");
    const cxTag = format === "short" ? '<span class="tag tag-green">LOOP BAIT</span>' : '<span class="tag tag-green">BINGE STACK</span>';
    out.innerHTML =
      '<div class="card glow-green">' +
      '<div class="flex wrap gap-8 mb-12">' +
      '<span class="tag tag-red">' + (format === "short" ? "SHORT" : "LONG-FORM") + '</span>' +
      '<span class="tag tag-cyan">' + esc(niche) + '</span>' +
      '<span class="tag tag-amber">' + esc(tone) + '</span>' +
      cxTag +
      '</div>' +
      '<h3 class="card-title">' + AppIcons.video + ' ' + s.title + '</h3>' +
      '<p class="small muted mt-4">' + s.meta + '</p>' +
      '<div class="divider"></div>' +
      '<div class="grid grid-2" style="grid-template-columns:1.5fr 1fr">' +
      '<div>' +
      s.sections.map((sec) =>
        '<div class="mb-8" style="border-left:3px solid var(--cyan);padding-left:14px">' +
        '<div class="flex gap-8" style="align-items:center"><b class="small" style="letter-spacing:.6px;text-transform:uppercase;color:var(--cyan)">' + sec.name + '</b><span class="chip chip-cyan small" style="font-size:10.5px">' + sec.dur + '</span></div>' +
        '<p class="small" style="margin-top:2px;white-space:pre-wrap">' + sec.lines.map((l) => l).join("<br/>") + '</p>' +
        '</div>').join("") +
      '</div>' +
      '<div class="flex-col gap-12">' +
      '<div class="card" style="background:var(--surface-2)"><h4 class="card-title" style="font-size:14px">' + AppIcons.eye + ' Recommended title</h4>' +
      '<p class="small" style="font-weight:650">' + esc(s.title) + '</p></div>' +
      '<div class="card" style="background:var(--surface-2)"><h4 class="card-title" style="font-size:14px">' + AppIcons.tag + ' Tags to use</h4>' +
      '<div class="tagcloud">' + s.tags.map((t) => '<span class="chip" style="font-size:11px">#' + t + '</span>').join("") + '</div></div>' +
      '<div class="card glow-amber" style="background:var(--surface-2)"><h4 class="card-title" style="font-size:14px">' + AppIcons.bell + ' Timing plan</h4><p class="small muted">' + s.timing + '</p></div>' +
      '</div>' +
      '</div>' +
      '<div class="flex wrap gap-12 mt-16">' +
      '<button class="btn btn-cyan" onclick="Factory.copyScript()">' + AppIcons.copy + ' Copy full script</button>' +
      '<button class="btn btn-ghost" onclick="Factory.script()">' + AppIcons.refresh + ' Regenerate</button>' +
      '<button class="btn btn-ghost" onclick="Factory.toRoadmap()">' + AppIcons.arrow + ' Turn into roadmap tasks</button>' +
      '<button class="btn btn-ghost" onclick="Factory.exportScript()">' + AppIcons.download + ' Save .txt</button>' +
      '</div></div>';
  }

  function hookData(seed, niche, sel, format) {
    const F = window.FACTORY.hookFormulas;
    const idx = sel === "auto" ? randomInt(F.length) : Math.min(F.length - 1, parseInt(sel, 10));
    return Object.assign({ formula: F[idx].name }, buildHook(F[idx], seed, niche, format));
  }

  function buildHook(f, seed, niche, format) {
    const t = seed.toLowerCase();
    switch (f.name) {
      case "Direct promise": return { text: 'I found ' + t + ' that actually beats the pros — broken down in 60 seconds.', visual: 'Result-first B-roll, big text on screen' };
      case "Curiosity gap": return { text: 'Nobody talks about the real reason ' + t + ' works. Until now.', visual: 'Tight zoom + pulsing question mark' };
      case "Provocative question": return { text: 'Why does everyone give bad advice about ' + t + '? Let’s fix that.', visual: 'Split-screen myth vs truth' };
      case "Number stack": return { text: '3 rules, 2 mistakes, 1 secret: ' + t + ' in ' + (format === "short" ? '45 seconds' : '10 minutes') + '.', visual: 'Count-up numbers with instant cuts' };
      case "Story open": return { text: 'I tried ' + t + ' every single day for 30 days — the result floored me.', visual: 'Day-counter strip, dramatic payoff frame' };
      default: return { text: 'Stop scrolling unless you want to stay average at ' + t + '.', visual: 'Pattern interrupt: freeze frame + mask' };
    }
  }

  function generateScript(opts) {
    const { seed, niche, tone, cta, format, hook } = opts;
    const isShort = format === "short";
    const titleSource = niche + ' ' + seed;
    const title = isShort ? (seed.length > 40 ? seed.slice(0, 40) : seed) + ' (told in 45s)' : niche + ': ' + ctitle(seed) + ' — the honest breakdown';
    const toneTags = toneTagsFor(tone);
    const sections = [];

    if (isShort) {
      sections.push({
        name: "Cold hook", dur: "0-3s",
        lines: [hook.text + " (say the payoff line THIS second — no intro.)", "Visual: " + hook.visual]
      });
      sections.push({
        name: "Beat 1", dur: "3-14s",
        lines: [toneTags.open ? sample(toneTags.open) : '', "State the single biggest misconception or win in one line: “" + oneLiner(seed) + "”", "Cut every 1-2 seconds. Movement, not talking heads."]
      });
      sections.push({
        name: "Beat 2", dur: "14-30s",
        lines: ["Give 2 micro-proofs: a number, a before/after, a screenshot.", "Drop the emotional trigger line: " + triggerLine(seed, toneDownloads(tone)), "Keep sentences under 8 words."]
      });
      sections.push({
        name: "Payoff + loop", dur: "28-45s",
        lines: ["Replay the opening phrase EXACTLY (loop bait: “again”) or flash the money shot.", "Text on screen: “Save this” + " + cta + ".", "First comment: the 2-line takeaway, pinned."]
      });
    } else {
      sections.push({
        name: "Cold open", dur: "0-30s",
        lines: ["Deliver the promise in your title within 15 seconds: “" + hook.text + "”", "Establish stakes: why this costs people real money/time (" + stakeFor(seed, niche) + ").", "Cut the channel intro. Get to content."]
      });
      sections.push({
        name: "Context", dur: "30-90s",
        lines: ["Who this is for in one breath (" + niche + " beginners who feel stuck).", "Agitate the pain with your tone (" + agitator(tone) + ").", "Promise structure: “3 parts: the mistake, the fix, the results.”"]
      });
      sections.push({
        name: "Part 1 — The mistake", dur: "2-3 min",
        lines: [capline(tone, seed, "everyone makes")(), "Show a real failed example (your own or anonymized — honesty converts).", "Pattern interrupt at 90s: visual change, timeline jump, meme cut."]
      });
      sections.push({
        name: "Part 2 — The fix", dur: "3-5 min",
        lines: ["Teach the fix in 3 steps, one idea per chapter.", "Add a numbered card on screen for every step.", "Prove it: your own numbers / date-stamped evidence.", "Second pattern interrupt + a quick recap clip."]
      });
      sections.push({
        name: "Part 3 — The results", dur: "1-2 min",
        lines: ["Before/after table or graph — concrete wins only.", "Acknowledge what didn't work too; credibility is retention.", "Bridge to the binge stack: “Full breakdown linked.”"]
      });
      sections.push({
        name: "CTA + outro", dur: "20-40s",
        lines: ["Summarize 3 takeaways in 3 seconds each.", "One clear CTA: " + cta + ".", "Next-video tease + end screen to your binge list."]
      });
    }

    const tags = niche.toLowerCase().split(/\s+/).concat([
      isShort ? "shorts" : "tutorial",
      seed.split(" ").slice(0, 3).map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean)
    ].flat()).filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);

    const meta = ctitle(seed) + ' · ' + niche + ' · tone: ' + tone + ' · ' + (isShort ? '45s Short' : '8-12 min long-form');
    const timing = isShort
      ? 'Score 45-60s total. Record 2 takes. Edit every pause. Post 6-9am or 6-9pm your time, 3 days straight to test.'
      : 'Publish on your best weekday. Script → record → cut (1 section per chapter). Schedule 5 PM local.';

    return { title, meta, sections, tags, timing, isShort };
  }

  function ctitle(s) { return String(s).replace(/(^|\s)\S/g, (m) => m.toUpperCase()); }

  /* tone flavor banks */
  const TONE_FLAVOR = {
    "Energetic": { o: ["Let's go.", "No fluff.", "Right now."], a: "This is the exact gap I keep screaming about.", c: ["Boom.", "Next level.", "Huge."] },
    "Calm teacher": { o: ["Settle in — this clears it up.", "Take a breath.", "Here's the map."], a: "Most people get this one detail wrong — and it's costing them.", c: ["Got it.", "That's the key.", "Simple."] },
    "Storyteller": { o: ["Picture this.", "It started with a question.", "Everyone told me I was wrong."], a: "And that's when I realized the advice everyone repeats is backward.", c: ["And that's the moment.", "What happened next?", "Right."] },
    "Cold + confident": { o: ["Watch this.", "No debate.", "Listen closely."], a: "You already know what I'm about to say, and you're still wrong.", c: ["Done deal.", "Clear.", "Move on."] },
    "Funny / meme": { o: ["Buckle up.", "This one's silly.", "Trust me, it gets good."], a: "My last attempt looked like a glitch. Then I found the cheat code.", c: ["Jokes aside.", "Unironically huge.", "Big brain time."] },
    "Raw & honest": { o: ["Straight up.", "Real talk.", "Here's the truth."], a: "I wasted 6 weeks on the thing everyone recommends. Then I stopped.", c: ["That's the reality.", "No filter.", "Period."] }
  };
  function toneTagsFor(tone) { return TONE_FLAVOR[tone] || TONE_FLAVOR["Energetic"]; }
  function toneDownloads(t) { return (TONE_FLAVOR[t] || TONE_FLAVOR["Energetic"]).c; }

  function oneLiner(seed) { return 'the obvious way to ' + seed.toLowerCase() + ' is the trap; the fast way is the boring one nobody posts about.'; }
  function triggerLine(seed, lux) { return sample(lux) + ' — ' + seed.toLowerCase() + ' rewards speed, not perfection.'; }
  function stakeFor(seed, niche) { return 'a wrong turn here wastes weeks of ' + niche.toLowerCase() + ' effort and thousands of watch-hours.'; }
  function agitator(tone) { return TONE_FLAVOR[tone] ? TONE_FLAVOR[tone].a : TONE_FLAVOR["Energetic"].a; }
  function capline(tone, seed) { const l = (TONE_FLAVOR[tone] || TONE_FLAVOR["Energetic"]).c; return () => 'Talk about the version everyone uses. ' + sample(l); }

  /* ---------- actions ---------- */
  function copyScript() {
    const r = Store.get("lastscript", null);
    if (!r) return Renderers.toast("Generate a script first.", "bad");
    const txt = 'VIRALFORGE SCRIPT — ' + r.s.title + '\n(' + r.s.meta + ')\n\n' +
      r.s.sections.map((sec) => '[' + sec.dur + '] ' + sec.name.toUpperCase() + '\n' + sec.lines.join('\n')).join('\n\n') +
      '\n\nCTA: ' + r.cta + '\nTags: ' + r.s.tags.join(', ');
    Renderers.copy(txt, "Script copied to clipboard.");
  }

  function exportScript() {
    const r = Store.get("lastscript", null);
    if (!r) return Renderers.toast("Nothing to export yet.", "bad");
    const txt = r.s.sections.map((sec) => '[' + sec.dur + '] ' + sec.name.toUpperCase() + '\n' + sec.lines.join('\n')).join('\n\n');
    Renderers.download("viralforge-script-" + Date.now() + ".txt", txt);
    Renderers.toast("Script saved as .txt", "good");
  }

  function toRoadmap() {
    Renderers.toast("Script tasks added to The 1,000 Subscribers Blueprint — open Roadmaps.", "good");
    window.location.hash = "#/roadmap/blueprint-1k";
  }

  window.Factory = { render, ideas, script, scriptWith, copyScript, exportScript, toRoadmap };
})();