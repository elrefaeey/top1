import { blogPostSlug, portfolioItemSlug } from "@/lib/cms/admin-utils";
import { absoluteUrl, faqPageSchema, STATIC_PAGE_SEO } from "@/lib/seo";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";
import { SITE_NAME } from "@/lib/site-config";
import type { BlogPost, FaqItem, PortfolioItem, Service } from "@/types/cms";

/**
 * Listing pages only need lightweight ItemList / Blog signals.
 * Full Service / CreativeWork / Article schemas (with images) live on detail pages.
 * Embedding CMS Base64 images here previously bloated /services|/portfolio|/blog HTML to 1–2.5MB.
 */

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
      name: item.title,
      url: absoluteUrl(`/portfolio/${portfolioItemSlug(item)}`),
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
      itemListElement: services.map((service, index) => {
        const slug = preferredServiceSlug(service.slug);
        return {
          "@type": "ListItem",
          position: index + 1,
          name: service.title,
          url: absoluteUrl(`/services/${slug}`),
        };
      }),
    });
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
    inLanguage: "ar-SA",
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
