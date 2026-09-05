/* ============================================================
   ViralForge — ads.js
   Monetization wiring for the dashed ad zones.
   - If CONFIG.adsense.client + slot ids are set → injects real
     Google AdSense <ins> units and loads the adsbygoogle script.
   - If CONFIG.adsense.custom is set → slots become sponsor link cards.
   - Otherwise the dashed placeholders stay untouched.
   Idempotent, guarded, never throws — the app always works either way.
   ============================================================ */

(function () {
  const cfg = () => (window.CONFIG && CONFIG.adsense) || {};
  const CLIENT_RE = /^ca-pub-\d{10,20}$/;

  function loadScript() {
    if (document.getElementById("adsByGoogle")) return;
    const c = String(cfg().client || "");
    if (!CLIENT_RE.test(c)) return;
    const s = document.createElement("script");
    s.id = "adsByGoogle";
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(c);
    document.head.appendChild(s);
  }

  function renderSponsor(box, href) {
    if (!box) return;
    box.innerHTML =
      '<a class="ad-slot ad-link" href="' + href + '" target="_blank" rel="noopener">' +
      '<b>Sponsored</b><br /><span>' + (CONFIG.name || "ViralForge") + ' — click here to support this tool</span></a>';
  }

  function renderUnit(box, slotId, client) {
    if (!box) return;
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", client);
    ins.setAttribute("data-ad-slot", slotId);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    box.innerHTML = "";
    box.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  function fill(box, slotKey) {
    if (!box) return;
    const a = cfg();
    const custom = a.custom;
    if (custom) { renderSponsor(box, custom); loadScript(); return; }
    const client = String(a.client || "");
    const slotId = a.slots && a.slots[slotKey];
    if (!CLIENT_RE.test(client) || !slotId) return;
    renderUnit(box, slotId, client);
    loadScript();
  }

  window.Ads = {
    init() {
      if (!window.CONFIG || !CONFIG.adsense || document.getElementById("adsByGoogle")) return;
      const sidebar = document.querySelector("#adSidebar .ad-slot");
      const footer = document.querySelector(".footer .ad-slot");
      if (!sidebar && !footer) return;
      fill(sidebar, "sidebar");
      fill(footer, "footer");
    }
  };
})();