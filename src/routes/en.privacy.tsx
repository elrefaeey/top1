import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/routes/privacy";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";
import { getMessages } from "@/lib/i18n/messages";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/en/privacy")({
  head: () => {
    const m = getMessages("en");
    return buildPageHead({
      title: `Privacy Policy | ${SITE_NAME}`,
      description: `Learn how ${SITE_NAME} collects, uses, and protects your personal data when you use our website.`,
      path: withLocalePrefix("en", "/privacy"),
      locale: "en",
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: m.nav.home, path: withLocalePrefix("en", "/") },
            { name: m.footer.privacy, path: withLocalePrefix("en", "/privacy") },
          ]),
        ),
      ],
    });
  },
  component: PrivacyPage,
});
