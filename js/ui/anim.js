/* ============================================================
   ViralForge â€” ui/anim.js
   Motion layer on top of the vendored libs:
   - Smooth: Lenis smooth-scroll (global), with reduced-motion guard.
   - Anim: GSAP entrance animations for freshly-rendered views.
   - Auto: layout transitions via @formkit/auto-animate.
   Every call is guarded so the app degrades gracefully.
   ============================================================ */

(function () {
  const REDUCE = () =>
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Smooth (Lenis) ---------------- */
  window.Smooth = {
    lenis: null,
    init() {
      if (REDUCE()) return;
      if (!window.VF || !VF.Lenis) return;
      try {
        this.lenis = new VF.Lenis({ autoRaf: true });
      } catch (e) {
        this.lenis = null;
      }
    },
    top() {
      if (this.lenis) {
        try { this.lenis.scrollTo(0, { immediate: true }); } catch (e) {}
        return;
      }
      try { window.scrollTo(0, 0); } catch (e) {}
    }
  };

/* ---------------- Anim (GSAP) ---------------- */
  window.Anim = {
    /* Failsafe: GSAP's rAF ticker freezes when the tab is throttled/backgrounded.
       Native setTimeout still fires, so the view is never left invisible. */
    enter(root) {
      if (!root || REDUCE() || !window.VF || !VF.gsap) return;
      try {
        const g = VF.gsap;
        g.globalTimeline.clear();
        const cards = root.querySelectorAll(".card, .badge-pill, .milestone, .stat");
        const bars = root.querySelectorAll(".bar > span");
        if (cards.length) {
          g.set(cards, { autoAlpha: 0, y: 14 });
          g.to(cards, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.05, overwrite: true });
        }
        if (bars.length) {
          g.fromTo(bars,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.7, ease: "power3.out", stagger: 0.035, overwrite: true });
        }
        driftRings(root, g);
/* Failsafe: GSAP's rAF ticker freezes when the tab is throttled/backgrounded.
           Native setTimeout still fires, so the view is never left invisible. */
        setTimeout(function () {
          let i;
          for (i = 0; i < cards.length; i++) stripStyle(cards[i], "opacity", "visibility", "transform");
          for (i = 0; i < bars.length; i++) stripStyle(bars[i], "transform", "scaleX");
        }, 2200);
      } catch (e) { /* jsdom / odd DOM shapes */ }
    }
  };

  function stripStyle(el) {
    const s = el && el.style;
    if (!s) return;
    for (let i = 1; i < arguments.length; i++) {
      try { s.removeProperty(arguments[i]); } catch (e) {}
    }
  }

  function driftRings(root, g) {
    root.querySelectorAll(".ring svg circle[stroke-dasharray]").forEach((c) => {
      const total = parseFloat(c.getAttribute("stroke-dasharray"));
      const target = parseFloat(c.getAttribute("stroke-dashoffset"));
      if (!(total > 0) || isNaN(target)) return;
      g.fromTo(c, { strokeDashoffset: total }, { strokeDashoffset: target, duration: 1, ease: "power2.inOut", overwrite: true });
    });
  }

  /* ---------------- Auto (layout transitions) ---------------- */
  const attached = new WeakMap();
  window.Auto = {
    attach(node) {
      if (!node || attached.get(node)) return;
      if (!window.VF || !VF.autoAnimate) return;
      try {
        attached.set(node, VF.autoAnimate(node, { duration: 190 }));
      } catch (e) { /* no-op */ }
    }
  };
})();
