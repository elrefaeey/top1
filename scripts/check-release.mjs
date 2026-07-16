/**
 * Release gate — verifies redirects, robots, Firebase config placeholders.
 * Does not print secret values. Exit 0 = code ready for launch ops.
 *
 * Usage: node scripts/check-release.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const errors = [];
const warnings = [];

function read(rel) {
  return readFileSync(resolve(root, rel), "utf8");
}

// 1) Permanent redirects shared module vs vercel.json
const redirectsMod = read("src/lib/seo/permanent-redirects.ts");
const vercel = JSON.parse(read("vercel.json"));
const fromTs = [...redirectsMod.matchAll(/"(\/[^"]+)"\s*:\s*"(\/[^"]+)"/g)].map((m) => [
  m[1],
  m[2],
]);
const fromVercel = (vercel.redirects || []).map((r) => [r.source, r.destination]);

for (const [src, dest] of fromTs) {
  const hit = fromVercel.find((r) => r[0] === src);
  if (!hit) errors.push(`vercel.json missing redirect: ${src} → ${dest}`);
  else if (hit[1] !== dest)
    errors.push(`vercel.json mismatch for ${src}: got ${hit[1]}, expected ${dest}`);
}
for (const [src] of fromVercel) {
  if (!fromTs.find((r) => r[0] === src)) {
    warnings.push(`vercel.json has extra redirect not in permanent-redirects.ts: ${src}`);
  }
}

// 2) robots route must disallow /api and /admin
const robots = read("src/routes/robots[.]txt.ts");
for (const needle of ["Disallow: /admin", "Disallow: /api", "Allow: /", "Sitemap:"]) {
  if (!robots.includes(needle)) errors.push(`robots route missing: ${needle}`);
}

// 3) Firebase files
if (!existsSync(resolve(root, "firebase.json"))) {
  errors.push("firebase.json missing");
} else {
  const fj = JSON.parse(read("firebase.json"));
  if (!fj.firestore?.rules) errors.push("firebase.json: firestore.rules not mapped");
  if (!fj.storage?.rules) errors.push("firebase.json: storage.rules not mapped");
}
if (!existsSync(resolve(root, ".firebaserc"))) {
  errors.push(".firebaserc missing");
} else {
  const rc = JSON.parse(read(".firebaserc"));
  const id = rc.projects?.default;
  if (!id || id === "YOUR_FIREBASE_PROJECT_ID") {
    warnings.push(
      ".firebaserc still uses YOUR_FIREBASE_PROJECT_ID — replace before firebase deploy",
    );
  }
}

// 4) public/robots.txt must not exist (dynamic route only)
if (existsSync(resolve(root, "public/robots.txt"))) {
  errors.push("public/robots.txt must be deleted (use dynamic /robots.txt route)");
}

// 5) CSP present in vercel.json
const csp = (vercel.headers || [])
  .flatMap((h) => h.headers || [])
  .find((h) => h.key === "Content-Security-Policy");
if (!csp?.value) errors.push("vercel.json missing Content-Security-Policy");
else {
  if (!csp.value.includes("script-src-attr 'none'"))
    warnings.push("vercel CSP missing script-src-attr 'none'");
  if (!csp.value.includes("frame-ancestors 'none'"))
    warnings.push("vercel CSP missing frame-ancestors 'none'");
}

console.log("=== Release check ===");
if (errors.length === 0) console.log("ERRORS: none");
else {
  console.log("ERRORS:");
  for (const e of errors) console.log("  -", e);
}
if (warnings.length === 0) console.log("WARNINGS: none");
else {
  console.log("WARNINGS:");
  for (const w of warnings) console.log("  -", w);
}

console.log("\nRedirects (will apply after deploy via server.ts + vercel.json):");
for (const [s, d] of fromTs) console.log(`  ${s}  →  ${d}  (301)`);

process.exit(errors.length ? 1 : 0);
