/* ============================================================
   ViralForge — ui/confetti.js
   Confetti celebrations (canvas-confetti) used at milestone
   "win" moments across the app. Guarded + reduced-motion aware.
   ============================================================ */

(function () {
  const COLORS = ["#ff0000", "#00e5ff", "#00ff88", "#ffb547", "#a97bff", "#ff5ce1"];
  const REDUCE = () =>
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.Confetti = {
    burst(opts) {
      if (REDUCE() || !window.VF || !VF.confetti) return;
      try {
        VF.confetti(Object.assign({
          particleCount: 120,
          spread: 75,
          startVelocity: 42,
          ticks: 220,
          origin: { y: 0.35 },
          colors: COLORS
        }, opts || {}));
      } catch (e) { /* no-op */ }
    },
    big() {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => this.burst({
          particleCount: 110,
          spread: 100,
          startVelocity: 50,
          origin: { y: 0.55, x: 0.25 + Math.random() * 0.5 }
        }), i * 180);
      }
    }
  };
})();