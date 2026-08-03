import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

const deployTarget = process.env.DEPLOY_TARGET?.trim().toLowerCase();
const nitroPreset =
  deployTarget === "hostinger" || deployTarget === "node"
    ? "node-server"
    : deployTarget === "static"
      ? "static"
      : "vercel";

export default defineConfig(({ command, mode }) => {
  // Load all env keys (VITE_* + FIREBASE_* etc.) into process.env for SSR/API routes.
  // Dynamic import.meta.env[key] is NOT replaced by Vite `define` — server must use process.env.
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith("VITE_")) {
      envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
    }
  }

  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      server: { entry: "server" },
    }),
    react(),
  ];

  if (command === "build") {
    plugins.push(
      nitro({
        preset: nitroPreset,
      }),
    );
  }

  return {
    define: envDefine,
    css: {
      transformer: "lightningcss",
    },
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
  };
});
