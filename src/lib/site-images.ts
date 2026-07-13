import { SITE_NAME } from "@/lib/site-config";

/** Curated stock imagery — replace with CMS uploads in production. */

function unsplash(photoId: string, width = 1200) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

export const siteImages = {
  hero: {
    mainAlt: `فريق ${SITE_NAME} يتعاون على بناء منتج رقمي`,
    accent: unsplash("photo-1460925895917-afe12b2b6d0e", 700),
    accentAlt: "لوحة تحليلات أداء على شاشة",
    workspace: unsplash("photo-1497366216548-37526070297c", 900),
    workspaceAlt: "مساحة عمل حديثة في استوديو رقمي",
  },
  about: {
    studio: unsplash("photo-1497366754035-f200968a6e72", 1200),
    studioAlt: `استوديو تصميم رقمي — ${SITE_NAME}`,
    team: unsplash("photo-1600880292203-757bb62b4baf", 1200),
    teamAlt: `اجتماع فريق ${SITE_NAME}`,
  },
  contact: {
    side: unsplash("photo-1423666639045-f560002c9368", 1000),
    sideAlt: `تواصل مع فريق ${SITE_NAME}`,
  },
  cta: {
    bg: unsplash("photo-1557804506-669a67965ba0", 1600),
    bgAlt: "فريق يخطط لمشروع رقمي",
  },
  services: {
    "web-design": unsplash("photo-1547658719-da2b511691dd", 900),
    "web-apps": unsplash("photo-1555066931-4365d14bab8c", 900),
    seo: unsplash("photo-1432888622747-4ebee778346a", 900),
    "ui-ux": unsplash("photo-1561070791-2526d30994b5", 900),
    "digital-solutions": unsplash("photo-1551288049-bebda4e38f71", 900),
    default: unsplash("photo-1517694712202-14dd9538aa97", 900),
  },
  portfolio: {
    nimbus: unsplash("photo-1551288049-bebda4e38f71", 900),
    helix: unsplash("photo-1559526324-4b87b5e93e44", 900),
    aperture: unsplash("photo-1472851293808-489c7c947581", 900),
    quanta: unsplash("photo-1556745750-76c05c6fe164", 900),
    lumen: unsplash("photo-1542744173-8e7e53415bb0", 900),
    northwind: unsplash("photo-1586528116311-ad8dd3c8310d", 900),
  },
  blog: {
    "lighthouse-99-by-default": unsplash("photo-1467232004584-a241de8bcf5d", 900),
    "saas-seo-playbook-2026": unsplash("photo-1432888622747-4ebee778346a", 900),
    "premium-microinteractions": unsplash("photo-1561070791-2526d30994b5", 900),
    "design-system-foundations": unsplash("photo-1558655146-d09347e92766", 900),
    "shipping-fast-without-debt": unsplash("photo-1517694712202-14dd9538aa97", 900),
    "from-figma-to-production": unsplash("photo-1558655146-364adaf76fcc", 900),
    default: unsplash("photo-1498050108023-c5249f4df085", 900),
  },
  team: {
    omar: unsplash("photo-1507003211169-0a1dd7228f2d", 400),
    layla: unsplash("photo-1573496359142-b8d87734a5a2", 400),
    youssef: unsplash("photo-1472099645785-5658abf4ff4e", 400),
    hana: unsplash("photo-1580489944761-15a19d654956", 400),
  },
  testimonials: {
    "maya-khalil": unsplash("photo-1438761681033-6461ffad8d80", 200),
    "daniel-park": unsplash("photo-1500648767791-00dcc994a43e", 200),
    "sara-el-masry": unsplash("photo-1544005313-94ddf0286df2", 200),
  },
  process: {
    discover: unsplash("photo-1552664730-d307ca884978", 800),
    design: unsplash("photo-1561070791-2526d30994b5", 800),
    build: unsplash("photo-1517694712202-14dd9538aa97", 800),
    grow: unsplash("photo-1551288049-bebda4e38f71", 800),
  },
} as const;

export function serviceImage(slug: string) {
  return siteImages.services[slug as keyof typeof siteImages.services] ?? siteImages.services.default;
}

export function portfolioImage(key: string) {
  return siteImages.portfolio[key as keyof typeof siteImages.portfolio] ?? siteImages.portfolio.nimbus;
}

export function blogImage(slug: string) {
  return siteImages.blog[slug as keyof typeof siteImages.blog] ?? siteImages.blog.default;
}

export function testimonialAvatar(id: string) {
  return siteImages.testimonials[id as keyof typeof siteImages.testimonials];
}

export const PORTFOLIO_PROJECTS = [
  { key: "nimbus", title: "Nimbus — إعادة هوية SaaS", tag: "تصميم مواقع · هوية", cat: "تصميم مواقع" },
  { key: "helix", title: "Helix — لوحة تحكم فنتك", tag: "تطبيق ويب · واجهة/تجربة", cat: "تطبيق ويب" },
  { key: "aperture", title: "Aperture — تجارة إلكترونية", tag: "Shopify · SEO", cat: "SEO" },
  { key: "quanta", title: "Quanta — سوق إلكتروني", tag: "Marketplace · UI/UX", cat: "UI/UX" },
  { key: "lumen", title: "Lumen — منصة wellness", tag: "Wellness · تصميم مواقع", cat: "تصميم مواقع" },
  { key: "northwind", title: "Northwind — لوجستيات", tag: "Logistics · تطبيق ويب", cat: "تطبيق ويب" },
] as const;
