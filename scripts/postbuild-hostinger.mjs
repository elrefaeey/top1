import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const publicDir = join(root, ".output", "public");
const distDir = join(root, "dist");

if (!existsSync(publicDir)) {
  console.error("[hostinger] Missing .output/public — run: npm run build:hostinger");
  process.exit(1);
}

mkdirSync(distDir, { recursive: true });
cpSync(publicDir, distDir, { recursive: true });

const htaccess = join(root, "public", ".htaccess");
if (existsSync(htaccess)) {
  copyFileSync(htaccess, join(distDir, ".htaccess"));
}

console.log("[hostinger] Copied .output/public → dist/ (static assets mirror)");
console.log("[hostinger] Deploy the full .output/ folder + run Node server (see DEPLOYMENT.md)");
