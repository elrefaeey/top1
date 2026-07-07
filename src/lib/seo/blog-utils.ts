import type { BlogPost, WithId } from "@/types/cms";
import { blogPostSlug } from "@/lib/cms/admin-utils";

const AR_WORDS_PER_MINUTE = 180;

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadTimeMinutes(html: string, fallback = 5): number {
  const text = stripHtml(html);
  if (!text) return fallback;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / AR_WORDS_PER_MINUTE));
}

export function resolveReadTime(post: BlogPost): number {
  if (post.readTime > 0) return post.readTime;
  return estimateReadTimeMinutes(post.content);
}

export type TocEntry = { id: string; title: string };

export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function extractTocFromHtml(html: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  let match: RegExpExecArray | null;
  const used = new Set<string>();

  while ((match = re.exec(html)) !== null) {
    const title = stripHtml(match[1]);
    if (!title) continue;
    let id = slugifyHeading(title);
    if (!id) id = `section-${entries.length + 1}`;
    while (used.has(id)) id = `${id}-${entries.length + 1}`;
    used.add(id);
    entries.push({ id, title });
  }

  return entries;
}

export function injectHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    if (/\bid\s*=/.test(attrs)) return full;
    const title = stripHtml(inner);
    const id = slugifyHeading(title) || `section-${++index}`;
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
}

export function getRelatedPosts(
  current: WithId<BlogPost>,
  all: WithId<BlogPost>[],
  limit = 3,
): WithId<BlogPost>[] {
  const currentSlug = blogPostSlug(current);
  const scored = all
    .filter((p) => blogPostSlug(p) !== currentSlug)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 3;
      const sharedTags = p.tags.filter((t) => current.tags.includes(t));
      score += sharedTags.length * 2;
      return { post: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length >= limit) return scored.slice(0, limit).map((x) => x.post);

  const fallback = all
    .filter((p) => blogPostSlug(p) !== currentSlug)
    .filter((p) => !scored.some((s) => blogPostSlug(s.post) === blogPostSlug(p)))
    .slice(0, limit - scored.length);

  return [...scored.map((x) => x.post), ...fallback].slice(0, limit);
}
