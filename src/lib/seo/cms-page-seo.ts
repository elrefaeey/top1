import { getPageById, getPageBySlug } from "@/lib/cms/content-service";
import type { CmsPage, WithId } from "@/types/cms";

/** Load published CMS page SEO overrides for static routes (home, about, …). */
export async function loadPublishedPageSeo(slug: string): Promise<WithId<CmsPage> | null> {
  try {
    const bySlug = await getPageBySlug(slug);
    if (bySlug) return bySlug;
    return await getPageById(slug);
  } catch {
    return null;
  }
}
