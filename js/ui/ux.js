/* ============================================================
   ViralForge — ui/ux.js
   Lightweight global UI state (zustand/vanilla). Tracks the
   active route plus a few live module signals that the rest of
   the app can read or subscribe to.
   ============================================================ */

(function () {
  const create = window.VF && window.VF.createStore;
  if (create) {
    window.Ux = create((set) => ({
      route: "dashboard",
      roadmapPct: 0,
      auditGrade: null,
      lastAction: 0,
      setRoute: (r) => set({ route: r }),
      setRoadmap: (p) => set({ roadmapPct: p }),
      setAudit: (g) => set({ auditGrade: g }),
      pulse: () => set((s) => ({ lastAction: s.lastAction + 1 }))
    }));
  } else {
    const s = {
      route: "dashboard", roadmapPct: 0, auditGrade: null, lastAction: 0,
      getState: () => s,
      setState: (o) => Object.assign(s, typeof o === "function" ? o(s) : o),
      setRoute: (r) => { s.route = r; },
      setRoadmap: (p) => { s.roadmapPct = p; },
      setAudit: (g) => { s.auditGrade = g; },
      pulse: () => { s.lastAction++; },
      subscribe: () => function () {}
    };
    window.Ux = s;
  }
})();