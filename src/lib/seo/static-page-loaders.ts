import { getBlogPosts, getFaqs, getPortfolio, getServices } from "@/lib/cms/content-service";
import { loadPublishedPageSeo } from "@/lib/seo/cms-page-seo";
import type { BlogPost, CmsPage, WithId } from "@/types/cms";

/** Listing SEO loaders only need meta fields — drop heavy page sections. */
function slimCmsPage(cms: WithId<CmsPage> | null): WithId<CmsPage> | null {
  if (!cms) return null;
  const { sections: _sections, ...rest } = cms;
  return { ...rest, sections: [] };
}

/** Blog listing UI/schema does not need full HTML bodies in SSR dehydration. */
function slimBlogPostForListing(post: WithId<BlogPost>): WithId<BlogPost> {
  return { ...post, content: "" };
}

export async function loadServicesRouteSeo() {
  const [cms, services, faqs] = await Promise.all([
    loadPublishedPageSeo("services"),
    getServices(),
    getFaqs(),
  ]);
  return { cms: slimCmsPage(cms), services, faqs };
}

export async function loadPortfolioRouteSeo() {
  const [cms, portfolio] = await Promise.all([loadPublishedPageSeo("portfolio"), getPortfolio()]);
  return { cms: slimCmsPage(cms), portfolio };
}

export async function loadBlogRouteSeo() {
  const [cms, posts] = await Promise.all([loadPublishedPageSeo("blog"), getBlogPosts()]);
  return { cms: slimCmsPage(cms), posts: posts.map(slimBlogPostForListing) };
}

export async function loadContactRouteSeo() {
  const [cms, faqs] = await Promise.all([loadPublishedPageSeo("contact"), getFaqs()]);
  return { cms: slimCmsPage(cms), faqs };
}
