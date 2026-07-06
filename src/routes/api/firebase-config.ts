import { createFileRoute } from "@tanstack/react-router";
import {
  isValidFirebaseConfig,
  readEnv,
  readFirebaseConfigFromEnv,
} from "@/lib/firebase/env";

export const Route = createFileRoute("/api/firebase-config")({
  server: {
    handlers: {
      GET: () => {
        const config = readFirebaseConfigFromEnv();
        if (!isValidFirebaseConfig(config)) {
          return Response.json(
            { error: "Firebase env vars are not set on the server" },
            { status: 503 },
          );
        }
        const bootstrapAdminEmail = readEnv("VITE_BOOTSTRAP_ADMIN_EMAIL");
        return Response.json(
          {
            ...config,
            ...(bootstrapAdminEmail ? { bootstrapAdminEmail } : {}),
          },
          {
            headers: { "cache-control": "public, max-age=300" },
          },
        );
      },
    },
  },
});
