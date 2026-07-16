/** Firestore collection names — no Firebase SDK import (safe for shared/server modules). */
export const COLLECTIONS = {
  users: "users",
  siteSettings: "site_settings",
  pages: "pages",
  services: "services",
  portfolio: "portfolio",
  blogPosts: "blog_posts",
  blogCategories: "blog_categories",
  blogTags: "blog_tags",
  testimonials: "testimonials",
  pricingPlans: "pricing_plans",
  faqs: "faqs",
  siteStats: "site_stats",
  leads: "leads",
  media: "media",
} as const;
