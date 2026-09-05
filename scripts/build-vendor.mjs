/* ============================================================
   ViralForge — scripts/build-vendor.mjs
   Bundles dependencies from node_modules into a single browser
   IIFE (vendor/vendor.bundle.js) exposing window.VF.
   Run: npm run vendor
   ============================================================ */

import { build } from "esbuild";
import { resolve } from "node:path";

await build({
  entryPoints: [resolve("scripts/vendor-entry.js")],
  outfile: resolve("vendor/vendor.bundle.js"),
  bundle: true,
  format: "iife",
  globalName: "VF",
  platform: "browser",
  target: ["es2020"],
  minify: true,
  legalComments: "eof",
  footer: {
    js: "; if (typeof window !== \"undefined\") window.VF = (typeof VF !== \"undefined\") ? VF : window.VF; else globalThis.VF = (typeof VF !== \"undefined\") ? VF : globalThis.VF;"
  },
  logLevel: "info"
});

console.log("✓ vendor/vendor.bundle.js built (exposes window.VF)");