import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/routes/terms";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";
import { getMessages } from "@/lib/i18n/messages";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/ar/terms")({
  head: () => {
    const m = getMessages("ar");
    return buildPageHead({
      title: `الشروط والأحكام | ${SITE_NAME}`,
      description: `الشروط والأحكام المنظمة لاستخدام موقع وخدمات ${SITE_NAME}، بما في ذلك نطاق العمل والدفع والملكية الفكرية وحدود المسؤولية.`,
      path: withLocalePrefix("ar", "/terms"),
      locale: "ar",
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: m.nav.home, path: withLocalePrefix("ar", "/") },
            { name: m.footer.terms, path: withLocalePrefix("ar", "/terms") },
          ]),
        ),
      ],
    });
  },
  component: TermsPage,
});
