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
  /** AI SEO Growth — server-written; editors may read (see firestore.rules) */
  seoInsights: "seo_insights",
  gscSnapshots: "gsc_snapshots",
  aiLogs: "ai_logs",
  /** GSC OAuth refresh tokens — admin-only; server writes via Admin REST */
  gscCredentials: "gsc_credentials",
} as const;
