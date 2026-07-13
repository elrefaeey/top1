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

function readIdAttr(attrs: string): string | null {
  const match = attrs.match(/\bid\s*=\s*(?:["']([^"']+)["']|([^\s>]+))/i);
  return (match?.[1] || match?.[2] || "").trim() || null;
}

/** Unique heading id — shared by TOC, injectHeadingIds, and in-article links. */
export function uniqueHeadingId(title: string, used: Set<string>, fallbackIndex: number): string {
  let id = slugifyHeading(title) || `section-${fallbackIndex}`;
  let n = fallbackIndex;
  while (used.has(id)) {
    n += 1;
    id = `${slugifyHeading(title) || "section"}-${n}`;
  }
  used.add(id);
  return id;
}

export function extractTocFromHtml(html: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const re = /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi;
  let match: RegExpExecArray | null;
  const used = new Set<string>();

  while ((match = re.exec(html)) !== null) {
    const title = stripHtml(match[2]);
    if (!title) continue;
    const existing = readIdAttr(match[1]);
    const id = existing || uniqueHeadingId(title, used, entries.length + 1);
    if (existing) used.add(existing);
    entries.push({ id, title });
  }

  return entries;
}

/** All h2/h3 anchors available for in-article linking (after id injection). */
export function listArticleAnchors(html: string): TocEntry[] {
  const withIds = injectHeadingIds(html);
  const entries: TocEntry[] = [];
  const re = /<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = re.exec(withIds)) !== null) {
    const title = stripHtml(match[3]);
    if (!title) continue;
    const id = readIdAttr(match[2]);
    if (!id) continue;
    entries.push({ id, title });
  }

  return entries;
}

export function injectHeadingIds(html: string): string {
  const used = new Set<string>();
  for (const m of html.matchAll(/\bid\s*=\s*(?:["']([^"']+)["']|([^\s>]+))/gi)) {
    const id = (m[1] || m[2] || "").trim();
    if (id) used.add(id);
  }

  let index = 0;
  return html.replace(/<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    if (readIdAttr(attrs)) return full;
    const title = stripHtml(inner);
    index += 1;
    const id = uniqueHeadingId(title, used, index);
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
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
