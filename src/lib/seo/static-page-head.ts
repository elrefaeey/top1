import { buildStaticPageHead, faqPageSchema, jsonLdScript } from "@/lib/seo";
import {
  blogListingSchemas,
  portfolioListingSchemas,
  servicesListingSchemas,
} from "@/lib/seo/listing-schemas";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { getMessages } from "@/lib/i18n/messages";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locale";
import type { BlogPost, CmsPage, FaqItem, PortfolioItem, Service, WithId } from "@/types/cms";

function listingBreadcrumbs(
  locale: Locale,
  page: "services" | "portfolio" | "blog" | "contact",
) {
  const m = getMessages(locale);
  const labels = {
    services: m.nav.services,
    portfolio: m.nav.portfolio,
    blog: m.nav.blog,
    contact: m.nav.contact,
  } as const;
  const paths = {
    services: "/services",
    portfolio: "/portfolio",
    blog: "/blog",
    contact: "/contact",
  } as const;
  return [
    { name: m.nav.home, path: withLocalePrefix(locale, "/") },
    { name: labels[page], path: withLocalePrefix(locale, paths[page]) },
  ];
}

export function buildServicesListingHead(
  data: {
    cms: WithId<CmsPage> | null;
    services: WithId<Service>[];
    faqs: WithId<FaqItem>[];
  },
  locale: Locale = DEFAULT_LOCALE,
) {
  const scripts = servicesListingSchemas(data.services, data.faqs, locale).map((schema) =>
    jsonLdScript(schema),
  );

  return buildStaticPageHead("services", "/services", {
    cms: data.cms,
    breadcrumbs: listingBreadcrumbs(locale, "services"),
    scripts,
    locale,
  });
}

export function buildPortfolioListingHead(
  data: {
    cms: WithId<CmsPage> | null;
    portfolio: WithId<PortfolioItem>[];
  },
  locale: Locale = DEFAULT_LOCALE,
) {
  const scripts = portfolioListingSchemas(data.portfolio, locale).map((schema) => jsonLdScript(schema));

  return buildStaticPageHead("portfolio", "/portfolio", {
    cms: data.cms,
    breadcrumbs: listingBreadcrumbs(locale, "portfolio"),
    scripts,
    locale,
  });
}

export function buildBlogListingHead(
  data: {
    cms: WithId<CmsPage> | null;
    posts: WithId<BlogPost>[];
  },
  locale: Locale = DEFAULT_LOCALE,
) {
  const scripts = blogListingSchemas(data.posts, locale).map((schema) => jsonLdScript(schema));

  return buildStaticPageHead("blog", "/blog", {
    cms: data.cms,
    breadcrumbs: listingBreadcrumbs(locale, "blog"),
    scripts,
    locale,
  });
}

export function buildContactPageHead(
  data: {
    cms: WithId<CmsPage> | null;
    faqs: WithId<FaqItem>[];
  },
  locale: Locale = DEFAULT_LOCALE,
) {
  const scripts = data.faqs.length > 0 ? [jsonLdScript(faqPageSchema(data.faqs))] : [];

  return buildStaticPageHead("contact", "/contact", {
    cms: data.cms,
    breadcrumbs: listingBreadcrumbs(locale, "contact"),
    scripts,
    locale,
  });
}
