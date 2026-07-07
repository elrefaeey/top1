import { getBlogPosts, getFaqs, getPortfolio, getServices } from "@/lib/cms/content-service";
import { loadPublishedPageSeo } from "@/lib/seo/cms-page-seo";

export async function loadServicesRouteSeo() {
  const [cms, services, faqs] = await Promise.all([
    loadPublishedPageSeo("services"),
    getServices(),
    getFaqs(),
  ]);
  return { cms, services, faqs };
}

export async function loadPortfolioRouteSeo() {
  const [cms, portfolio] = await Promise.all([
    loadPublishedPageSeo("portfolio"),
    getPortfolio(),
  ]);
  return { cms, portfolio };
}

export async function loadBlogRouteSeo() {
  const [cms, posts] = await Promise.all([
    loadPublishedPageSeo("blog"),
    getBlogPosts(),
  ]);
  return { cms, posts };
}

export async function loadContactRouteSeo() {
  const [cms, faqs] = await Promise.all([
    loadPublishedPageSeo("contact"),
    getFaqs(),
  ]);
  return { cms, faqs };
}
