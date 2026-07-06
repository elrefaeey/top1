import { createFileRoute } from "@tanstack/react-router";
import { handleImageUploadRequest } from "@/lib/server/image-upload";

export const Route = createFileRoute("/api/upload-image")({
  server: {
    handlers: {
      POST: ({ request }) => handleImageUploadRequest(request),
    },
  },
});
