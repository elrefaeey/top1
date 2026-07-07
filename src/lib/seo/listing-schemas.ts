import { blogPostSlug } from "@/lib/cms/admin-utils";
import {
  absoluteImageUrl,
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  faqPageSchema,
  serviceSchema,
  STATIC_PAGE_SEO,
} from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";
import type { BlogPost, FaqItem, PortfolioItem, Service } from "@/types/cms";

export function creativeWorkSchema(item: PortfolioItem) {
  return {
    "@type": "CreativeWork",
    name: item.title,
    description: item.description || item.metaDescription || item.category,
    image: item.imageUrl ? absoluteImageUrl(item.imageUrl) : absoluteImageUrl(DEFAULT_OG_IMAGE),
    url: item.url?.trim() || absoluteUrl("/portfolio"),
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

export function portfolioListingSchemas(items: PortfolioItem[]) {
  if (items.length === 0) return [];

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `معرض أعمال ${SITE_NAME}`,
    url: absoluteUrl("/portfolio"),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: creativeWorkSchema(item),
    })),
  };

  return [itemList];
}

export function servicesListingSchemas(services: Service[], faqs: FaqItem[]) {
  const schemas: unknown[] = [];

  if (services.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `خدمات ${SITE_NAME}`,
      url: absoluteUrl("/services"),
      numberOfItems: services.length,
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: serviceSchema(service, service.slug),
      })),
    });

    for (const service of services) {
      schemas.push(serviceSchema(service, service.slug));
    }
  }

  if (faqs.length > 0) {
    schemas.push(faqPageSchema(faqs));
  }

  return schemas;
}

export function blogListingSchemas(posts: BlogPost[]) {
  if (posts.length === 0) return [];

  const blog = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `مدونة ${SITE_NAME}`,
    description: STATIC_PAGE_SEO.blog.description,
    url: absoluteUrl("/blog"),
    inLanguage: "ar",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.metaDescription,
      url: absoluteUrl(`/blog/${blogPostSlug(post)}`),
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
    url: absoluteUrl("/blog"),
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: absoluteUrl(`/blog/${blogPostSlug(post)}`),
    })),
  };

  return [blog, itemList];
}
