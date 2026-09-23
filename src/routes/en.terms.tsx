import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/routes/terms";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";
import { getMessages } from "@/lib/i18n/messages";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/en/terms")({
  head: () => {
    const m = getMessages("en");
    return buildPageHead({
      title: `Terms & Conditions | ${SITE_NAME}`,
      description: `Terms governing use of the ${SITE_NAME} website and services, including scope of work, payment, IP, and liability.`,
      path: withLocalePrefix("en", "/terms"),
      locale: "en",
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: m.nav.home, path: withLocalePrefix("en", "/") },
            { name: m.footer.terms, path: withLocalePrefix("en", "/terms") },
          ]),
        ),
      ],
    });
  },
  component: TermsPage,
});
