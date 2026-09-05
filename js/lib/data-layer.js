/* ============================================================
   ViralForge — lib/data-layer.js
   Cached fetch layer (in-memory) standing in for a query client
   in this vanilla SPA: fetch JSON/text with a TTL + in-flight
   request dedupe. All network events flow through here.
   ============================================================ */

(function () {
  const cache = new Map();

  async function request(type, url, opt) {
    const ttl = (opt && opt.ttl) || 0;
    const now = Date.now();
    const hit = cache.get(url);
    if (hit) {
      if (hit.until > now || (opt && opt.stale)) return hit.promise;
      if (hit.promise) return hit.promise;
    }

    const p = fetch(url, {
      cache: "no-store",
      signal: (opt && opt.signal) || undefined
    })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return type === "json" ? r.json() : r.text();
      })
      .then((value) => {
        cache.set(url, { value, until: now + ttl, promise: Promise.resolve(value) });
        return value;
      })
      .catch((e) => {
        cache.delete(url);
        throw e;
      });

    cache.set(url, { promise: p, until: now + ttl, value: undefined });
    return p;
  }

  window.Data = {
    fetchJson: function (url, opt) { return request("json", url, opt); },
    fetchText: function (url, opt) { return request("text", url, opt); },
    invalidate: function (url) { cache.delete(url); },
    has: function (url) { return cache.has(url); }
  };
})();