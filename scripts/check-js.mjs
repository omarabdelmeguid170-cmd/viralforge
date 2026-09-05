/* ============================================================
   ViralForge — scripts/check-js.mjs
   Syntax-checks every first-party JS/MJS file with node --check.
   Run: npm run check
   ============================================================ */

import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = resolve(".");
const files = [];
let fail = false;

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|mjs)$/.test(e.name)) files.push(p);
  }
}
walk(join(root, "js"));
walk(join(root, "scripts"));

for (const f of files) {
  try {
    execFileSync(process.execPath, ["--check", f], { stdio: "pipe" });
  } catch (err) {
    fail = true;
    console.error("SYNTAX FAIL :: " + f);
    const out = (err.stdout ? err.stdout.toString() : "") + (err.stderr ? err.stderr.toString() : "");
    if (out) console.error(out.split("\n").slice(0, 6).join("\n"));
  }
}

if (fail) { console.error("\nnode --check reported errors."); process.exit(1); }
console.log("✓ " + files.length + " files passed node --check");