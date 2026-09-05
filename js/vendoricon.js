/* ============================================================
   ViralForge — vendoricon.js
   Icon registry: prefers Lucide (bundled in vendor), falls back
   to the zero-dep inline SVG set. Fill = currentColor.
   ============================================================ */

(function () {
  function svg(paths, extra) {
    return '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden="true"' +
      (extra || '') + '>' + paths + '</svg>';
  }
  const P = {
    grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
    pulse: '<path d="M3 12h4l2.5-6 5 12 2.5-6H21"/>',
    bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
    eye: '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.7"/><path d="M17.5 14.4c2.4.2 3.8 2 4 4.1"/>',
    swap: '<path d="M7 8h13l-3-3M17 16H4l3 3"/>',
    heart: '<path d="M12 20.5S3 14.5 3 8.8C3 6 5 4 7.6 4c1.8 0 3.4 1 4.4 2.5C13 5 14.6 4 16.4 4 19 4 21 6 21 8.8c0 5.7-9 11.7-9 11.7Z"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    check: '<path d="M4 12.5 9.5 18 20 6.5"/>',
    star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.4l6.6-.9 2.9-6Z"/>',
    comment: '<path d="M21 12a8 8 0 0 1-8 8H4l2.4-2.9A8 8 0 1 1 21 12Z"/>',
    clone: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.4-3.4"/>',
    upload: '<path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 20h16"/>',
    trash: '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"/>',
    video: '<rect x="2" y="5" width="14" height="14" rx="2.5"/><path d="m16 10 6-3v10l-6-3"/>',
    gift: '<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M12 9v11M7 9s-1-3 1-4 4 1 4 4M17 9s1-3-1-4-4 1-4 4"/><path d="M3 13h18"/>',
    rocket: '<path d="M12 15c1.5-4 4-7 6.5-9L20 4c-4.5.5-10 3-12.5 6.5"/><path d="M12 15c-1 2.5-6 4.5-6 4.5s-1-4.5 2-7"/><circle cx="9.5" cy="14.5" r="1.4"/><path d="M20 4c0 1.5-.5 6-2.5 8l-1 1"/>',
    download: '<path d="M12 4v12m0 0-5-5m5 5 5-5"/><path d="M4 20h16"/>',
    chart: '<path d="M4 20V4"/><path d="M4 8h16l-3 4 3 4H4"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
    shield: '<path d="M12 2l8 3v6c0 5-3.4 8.8-8 11-4.6-2.2-8-6-8-11V5l8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    quote: '<path d="M7 11h3v6H4v-4c0-3 1.5-5 4-6l1 2c-1.5.7-2 1.7-2 2Zm8 0h3v6h-6v-4c0-3 1.5-5 4-6l1 2c-1.5.7-2 1.7-2 2Z"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    crown: '<path d="m3 8 4 3 5-6 5 6 4-3-2 10H5L3 8Z"/><path d="M5 20h14"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4m0 0H8m4 0h4"/>',
    share: '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="m8.6 10.7 6.8-3.4M8.6 13.3l6.8 3.4"/>',
    coins: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5.5M10 11.2h3.4a1.6 1.6 0 1 0 0-3.2H11a1.6 1.6 0 0 0 0 3.2h2a1.6 1.6 0 0 1 0 3.2h-3"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    mouse: '<rect x="8" y="2" width="8" height="16" rx="4"/><path d="M12 6v3"/>',
    tv: '<rect x="3" y="5" width="18" height="13" rx="2"/><path d="m10 9 5 2.5-5 2.5V9ZM7 21h10"/>',
    tag: '<path d="M21 12 12 3H4v8l9 9 8-8Z"/><circle cx="8" cy="8" r="1.4"/>',
    zap: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 3 16a3 3 0 0 0 3 3h1"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8 3 3 0 0 1 2 3.2 3 3 0 0 1-3 3h-1"/><path d="M12 4v16M10 8h4m-4 4h4m-4 4h4"/>',
    filter: '<path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z"/>',
    wrench: '<path d="M20.2 7.5a5.7 5.7 0 0 0-7.4-1l-6.3 6.3a2 2 0 0 0-.3 2.5l-.5.6-3 3a1.4 1.4 0 0 0 2 2l3-3 .6-.5a2 2 0 0 0 2.5-.3l6.3-6.3a5.7 5.7 0 0 0 3.1-5.3Z"/><path d="M18.5 4.5l.6-1.4 1.4.6-.6 1.4-1.4-.6Z"/>',
    arrow: '<path d="M4 12h16m0 0-6-6m6 6-6 6"/>',
    gauge: '<path d="M12 16a3 3 0 0 0 3-3c0-1-1.5-5-3-6-1.5 1-3 5-3 6a3 3 0 0 0 3 3Z"/><path d="M4.5 8.5a8 8 0 1 0 15 0M12 3v3"/>',
    youtube: '<path d="M3 7l3 10 2.7-7.2L12 7l3 10 3-10" transform="translate(2 1) scale(.78)"/>',
    link: '<path d="M10 14a4 4 0 0 0 6 .4l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-6-.4l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4"/>',
    bell: '<path d="M18 9a6 6 0 1 0-12 0c0 4-1.5 5-1.5 5h15S18 13 18 9Z"/><path d="M10 18a2.2 2.2 0 0 0 4 0"/>',
    world: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.4 3.8 5.4 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3Z"/>'
  };
  const I = {};
  for (const name in P) {
    const lucide = window.VF ? VF.lucideIcon(name) : null;
    I[name] = lucide || svg(P[name]);
  }
  window.AppIcons = I;
})();