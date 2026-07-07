import { buildStaticPageHead, faqPageSchema, jsonLdScript } from "@/lib/seo";
import {
  blogListingSchemas,
  portfolioListingSchemas,
  servicesListingSchemas,
} from "@/lib/seo/listing-schemas";
import type { BlogPost, CmsPage, FaqItem, PortfolioItem, Service, WithId } from "@/types/cms";

const SERVICES_BREADCRUMBS = [
  { name: "الرئيسية", path: "/" },
  { name: "الخدمات", path: "/services" },
] as const;

const PORTFOLIO_BREADCRUMBS = [
  { name: "الرئيسية", path: "/" },
  { name: "أعمالنا", path: "/portfolio" },
] as const;

const BLOG_BREADCRUMBS = [
  { name: "الرئيسية", path: "/" },
  { name: "المدونة", path: "/blog" },
] as const;

const CONTACT_BREADCRUMBS = [
  { name: "الرئيسية", path: "/" },
  { name: "تواصل معنا", path: "/contact" },
] as const;

export function buildServicesListingHead(data: {
  cms: WithId<CmsPage> | null;
  services: WithId<Service>[];
  faqs: WithId<FaqItem>[];
}) {
  const scripts = servicesListingSchemas(data.services, data.faqs).map((schema) =>
    jsonLdScript(schema),
  );

  return buildStaticPageHead("services", "/services", {
    cms: data.cms,
    breadcrumbs: [...SERVICES_BREADCRUMBS],
    scripts,
  });
}

export function buildPortfolioListingHead(data: {
  cms: WithId<CmsPage> | null;
  portfolio: WithId<PortfolioItem>[];
}) {
  const scripts = portfolioListingSchemas(data.portfolio).map((schema) => jsonLdScript(schema));

  return buildStaticPageHead("portfolio", "/portfolio", {
    cms: data.cms,
    breadcrumbs: [...PORTFOLIO_BREADCRUMBS],
    scripts,
  });
}

export function buildBlogListingHead(data: {
  cms: WithId<CmsPage> | null;
  posts: WithId<BlogPost>[];
}) {
  const scripts = blogListingSchemas(data.posts).map((schema) => jsonLdScript(schema));

  return buildStaticPageHead("blog", "/blog", {
    cms: data.cms,
    breadcrumbs: [...BLOG_BREADCRUMBS],
    scripts,
  });
}

export function buildContactPageHead(data: {
  cms: WithId<CmsPage> | null;
  faqs: WithId<FaqItem>[];
}) {
  const scripts =
    data.faqs.length > 0 ? [jsonLdScript(faqPageSchema(data.faqs))] : [];

  return buildStaticPageHead("contact", "/contact", {
    cms: data.cms,
    breadcrumbs: [...CONTACT_BREADCRUMBS],
    scripts,
  });
}
