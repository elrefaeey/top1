import { createFileRoute } from "@tanstack/react-router";
import { handleCmsApiGet } from "@/lib/server/cms-api";

export const Route = createFileRoute("/api/cms/$resource")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const url = new URL(request.url);
          const data = await handleCmsApiGet(params.resource, url.searchParams);
          if (data === null) {
            return Response.json({ error: "Unknown CMS resource" }, { status: 404 });
          }
          return Response.json(data, {
            headers: { "cache-control": "public, max-age=60" },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "CMS request failed";
          console.error(`[api/cms/${params.resource}]`, err);
          return Response.json({ error: message }, { status: 503 });
        }
      },
    },
  },
});
