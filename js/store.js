/* ============================================================
   ViralForge — store.js
   Client-side persistence. All data lives in the user's browser
   (localStorage). Zero servers = zero paywalls.
   ============================================================ */

(function () {
  const PREFIX = "vf_";

  function raw(key) {
    try { return localStorage.getItem(PREFIX + key); } catch (e) { return null; }
  }
  function put(key, val) {
    try { localStorage.setItem(PREFIX + key, val); } catch (e) { /* storage full / private mode */ }
  }

  const Store = {
    get(key, fallback) {
      const v = raw(key);
      if (v === null || v === undefined) return fallback;
      try { return JSON.parse(v); } catch (e) { return fallback; }
    },
    set(key, val) { put(key, JSON.stringify(val)); },
    remove(key) { try { localStorage.removeItem(PREFIX + key); } catch (e) {} },

    /* ---- typed accessors ---- */
    string(key, fb) { const v = raw(key); return v === null ? fb : v; },
    num(key, fb) { const v = parseFloat(raw(key)); return isNaN(v) ? fb : v; },
    bool(key, fb) { const v = raw(key); return v === null ? fb : v === "1" || v === "true"; },

    push(key, item) {
      const arr = Store.get(key, []);
      arr.push(item);
      Store.set(key, arr);
      return arr;
    },
    unshift(key, item) {
      const arr = Store.get(key, []);
      arr.unshift(item);
      Store.set(key, arr);
      return arr;
    },
    updateMap(key, item) {
      const list = Store.get(key, []);
      const idx = list.findIndex((x) => x.id === item.id);
      if (idx === -1) list.push(item);
      else list[idx] = item;
      Store.set(key, list);
      return list;
    },

    /* ---- scoped agenda / checklist toggles ---- */
    toggleChecked(scope, id) {
      const map = Store.get(scope, {});
      map[id] = !map[id];
      Store.set(scope, map);
      return map[id];
    },
    isChecked(scope, id) { return !!(Store.get(scope, {})[id]); },
    checkedCount(scope, prefix) {
      const map = Store.get(scope, {});
      const ids = Object.keys(map).filter((k) => map[k] && k.indexOf(prefix) === 0);
      return ids.length;
    },

    /* ---- seeds: merge stored with defaultValue arrays by id ---- */
    seededList(key, seeds, fallback) {
      const stored = Store.get(key, null);
      if (!Array.isArray(stored)) {
        Store.set(key, seeds || fallback || []);
        return seeds || fallback || [];
      }
      return stored;
    }
  };

  window.Store = Store;
})();