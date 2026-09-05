/* ============================================================
   ViralForge — router.js
   Tiny hash router. Supports literal routes and ":n" param
   patterns (any value in that position).
   ============================================================ */

(function () {
  const routes = {};
  const NavIcons = {
    dashboard: "grid", audit: "pulse", trends: "bolt", ctr: "eye", factory: "pen",
    roadmap: "map", community: "users", exchange: "swap", support: "heart"
  };

  function parse(hash) {
    let h = (hash || "").replace(/^#\/?/, "");
    if (!h) h = "dashboard";
    const parts = h.split("/").filter(Boolean);
    return { view: parts[0], args: parts.slice(1) };
  }

  function resolve(view, args) {
    if (!args.length) return { fn: routes[view], params: [] };
    const literal = routes[view + "/" + args.join("/")];
    if (literal) return { fn: literal, params: args };
    for (const key in routes) {
      const kp = key.split("/");
      if (kp[0] !== view || kp.length !== args.length + 1) continue;
      let ok = true;
      const params = [];
      for (let i = 1; i < kp.length; i++) {
        if (kp[i].charAt(0) === ":") { params.push(args[i - 1]); continue; }
        if (kp[i] !== args[i - 1]) { ok = false; break; }
      }
      if (ok) return { fn: routes[key], params };
    }
    return { fn: routes[view], params: [] };
  }

  function loadIcons() {
    document.querySelectorAll(".nav-item[data-icon]").forEach((el) => {
      const name = el.getAttribute("data-icon");
      const box = el.querySelector(".nav-ico");
      if (box && AppIcons[name]) box.innerHTML = AppIcons[name];
    });
  }

  function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sideOverlay").classList.remove("show");
  }

  function render() {
    const { view, args } = parse(window.location.hash);
    const sections = Array.prototype.slice.call(document.querySelectorAll(".view[data-view]"));
    const navItems = Array.prototype.slice.call(document.querySelectorAll(".nav-item[data-nav]"));

    sections.forEach((s) => s.classList.remove("active"));
    navItems.forEach((n) => n.classList.remove("active"));

    const target = document.getElementById("view-" + view);
    if (!target) {
      window.location.hash = "#/dashboard";
      return;
    }

    target.classList.add("active");
    navItems.forEach((n) => { if (n.getAttribute("data-nav") === view) n.classList.add("active"); });
    if (window.Ux) { try { Ux.setRoute(view); } catch (e) {} }

    const r = resolve(view, args);
    if (r.fn) {
      try { r.fn.apply(null, r.params); } catch (e) { console.error(e); Renderers.toast("Something glitched in that module — reported to console.", "bad"); }
    } else {
      target.innerHTML = '<div class="empty-state"><div class="big">🛰</div><b>Module not found.</b><br/><a href="#/dashboard">Back to dashboard</a></div>';
    }

    closeSidebar();
    if (window.Anim) { try { Anim.enter(target); } catch (e) {} }
    if (window.Smooth) { Smooth.top(); } else { window.scrollTo(0, 0); }
  }

  window.Router = {
    register(path, fn) { routes[path] = fn; },
    render,
    init() {
      loadIcons();
      window.addEventListener("hashchange", render);
      render();

      document.getElementById("btnBurger").addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("open");
        document.getElementById("sideOverlay").classList.toggle("show");
      });
      document.getElementById("sideOverlay").addEventListener("click", closeSidebar);
    }
  };
})();