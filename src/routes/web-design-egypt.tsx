import { createFileRoute, redirect } from "@tanstack/react-router";

/** إعادة توجيه دائمة — المحتوى الجغرافي أصبح للسعودية والخليج */
export const Route = createFileRoute("/web-design-egypt")({
  beforeLoad: () => {
    throw redirect({ to: "/web-design-saudi-arabia" });
  },
});
