import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/routes/privacy";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";
import { getMessages } from "@/lib/i18n/messages";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/ar/privacy")({
  head: () => {
    const m = getMessages("ar");
    return buildPageHead({
      title: `سياسة الخصوصية | ${SITE_NAME}`,
      description: `تعرّف على كيفية جمع واستخدام وحماية بياناتك الشخصية عند استخدام موقع ${SITE_NAME}.`,
      path: withLocalePrefix("ar", "/privacy"),
      locale: "ar",
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: m.nav.home, path: withLocalePrefix("ar", "/") },
            { name: m.footer.privacy, path: withLocalePrefix("ar", "/privacy") },
          ]),
        ),
      ],
    });
  },
  component: PrivacyPage,
});
