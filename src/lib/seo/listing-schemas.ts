import { blogPostSlug, flattenTitle, portfolioItemSlug } from "@/lib/cms/admin-utils";
import {
  absoluteImageUrl,
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  faqPageSchema,
  serviceSchema,
  STATIC_PAGE_SEO,
} from "@/lib/seo";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locale";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";
import { SITE_NAME } from "@/lib/site-config";
import type { BlogPost, FaqItem, PortfolioItem, Service } from "@/types/cms";

function locUrl(locale: Locale, path: string) {
  return absoluteUrl(withLocalePrefix(locale, path));
}

export function creativeWorkSchema(item: PortfolioItem, locale: Locale = DEFAULT_LOCALE) {
  const path = `/portfolio/${portfolioItemSlug(item)}`;
  return {
    "@type": "CreativeWork",
    name: flattenTitle(item.title),
    description: item.description || item.metaDescription || item.category,
    image: item.imageUrl ? absoluteImageUrl(item.imageUrl) : absoluteImageUrl(DEFAULT_OG_IMAGE),
    url: locUrl(locale, path),
    genre: item.category,
    keywords: item.tags?.length ? item.tags.join(", ") : undefined,
    ...(item.client
      ? {
          creator: {
            "@type": "Organization",
            name: item.client,
          },
        }
      : {}),
  };
}

export function portfolioListingSchemas(
  items: PortfolioItem[],
  locale: Locale = DEFAULT_LOCALE,
) {
  if (items.length === 0) return [];

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `معرض أعمال ${SITE_NAME}`,
    url: locUrl(locale, "/portfolio"),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: creativeWorkSchema(item, locale),
    })),
  };

  return [itemList];
}

export function servicesListingSchemas(
  services: Service[],
  faqs: FaqItem[],
  locale: Locale = DEFAULT_LOCALE,
) {
  const schemas: unknown[] = [];

  if (services.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `خدمات ${SITE_NAME}`,
      url: locUrl(locale, "/services"),
      numberOfItems: services.length,
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: serviceSchema(service, preferredServiceSlug(service.slug), locale),
      })),
    });

    for (const service of services) {
      schemas.push(serviceSchema(service, preferredServiceSlug(service.slug), locale));
    }
  }

  if (faqs.length > 0) {
    schemas.push(faqPageSchema(faqs));
  }

  return schemas;
}

export function blogListingSchemas(posts: BlogPost[], locale: Locale = DEFAULT_LOCALE) {
  if (posts.length === 0) return [];

  const blog = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `مدونة ${SITE_NAME}`,
    description: STATIC_PAGE_SEO.blog.description,
    url: locUrl(locale, "/blog"),
    inLanguage: locale === "en" ? "en" : "ar",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: locUrl(locale, "/"),
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.metaDescription,
      url: locUrl(locale, `/blog/${blogPostSlug(post)}`),
      datePublished: post.publishedAt ?? post.createdAt,
      dateModified: post.updatedAt,
      image: post.featuredImage
        ? absoluteImageUrl(post.featuredImage)
        : absoluteImageUrl(DEFAULT_OG_IMAGE),
      author: {
        "@type": "Person",
        name: post.author,
      },
    })),
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "مقالات المدونة",
    url: locUrl(locale, "/blog"),
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: locUrl(locale, `/blog/${blogPostSlug(post)}`),
    })),
  };

  return [blog, itemList];
}
