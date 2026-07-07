import { spawnSync } from "node:child_process";

process.env.DEPLOY_TARGET = "hostinger";

const build = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});
if (build.status !== 0) process.exit(build.status ?? 1);

const post = spawnSync("node", ["scripts/postbuild-hostinger.mjs"], {
  stdio: "inherit",
  shell: true,
});
process.exit(post.status ?? 1);
