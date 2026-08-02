import { nowIso, slugify } from "@/lib/cms/admin-utils";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { isDataImageUrl } from "@/lib/security/image-url";
import {
  createFirestoreDocument,
  listFirestoreDocuments,
  upsertFirestoreDocument,
  type FirestoreDocumentData,
} from "@/lib/server/firebase-admin";
import { SITE_NAME } from "@/lib/site-config";
import type { AiBlogDraftInput, AiLog, GscSnapshot, SeoInsight } from "@/types/seo-automation";
import type { BlogPost } from "@/types/cms";

function rejectBase64Deep(value: unknown, path = "field"): void {
  if (typeof value === "string") {
    if (isDataImageUrl(value) || /data:image\//i.test(value)) {
      throw new Error(`${path}: لا يُسمح بصور Base64 — ارفع الصورة واستخدم رابط https://`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => rejectBase64Deep(item, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      rejectBase64Deep(nested, path ? `${path}.${key}` : key);
    }
  }
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function requireNonEmpty(value: string, label: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${label} مطلوب`);
  return trimmed;
}

/**
 * Builds a BlogPost payload for AI automation.
 * Always forces status: "draft" — never publish from this path.
 */
export function buildAiBlogDraftPayload(
  input: AiBlogDraftInput,
): { id: string; data: Omit<BlogPost, "id"> } {
  if (input.status && input.status !== "draft") {
    throw new Error('مسودات AI يجب أن تكون status: "draft" فقط — النشر يدوي من لوحة التحكم');
  }

  const title = requireNonEmpty(String(input.title ?? ""), "title");
  const content = requireNonEmpty(String(input.content ?? ""), "content");
  const slugRaw = String(input.slug ?? "").trim() || slugify(title);
  const slug = requireNonEmpty(slugRaw, "slug");
  const excerpt = String(input.excerpt ?? "").trim() || content.replace(/<[^>]+>/g, " ").slice(0, 180).trim();
  const category = String(input.category ?? "").trim() || "تصميم";
  const author = String(input.author ?? "").trim() || SITE_NAME;
  const tags = Array.isArray(input.tags)
    ? input.tags.map((t) => String(t).trim()).filter(Boolean)
    : [];
  const metaTitle = String(input.metaTitle ?? "").trim() || title;
  const metaDescription =
    String(input.metaDescription ?? "").trim() || excerpt.slice(0, 160);
  const featuredImage = input.featuredImage?.trim() || undefined;
  const featuredImageAlt = input.featuredImageAlt?.trim() || undefined;
  const ts = nowIso();

  const data: Omit<BlogPost, "id"> = {
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    featuredImageAlt,
    category,
    tags,
    author,
    readTime: estimateReadTime(content),
    views: 0,
    trending: false,
    status: "draft",
    metaTitle,
    metaDescription,
    createdAt: ts,
    updatedAt: ts,
  };

  rejectBase64Deep(data, "blog_posts");
  return { id: slug, data };
}

export async function createAiBlogDraft(input: AiBlogDraftInput): Promise<{
  id: string;
  slug: string;
  status: "draft";
}> {
  const { id, data } = buildAiBlogDraftPayload(input);
  const payload: FirestoreDocumentData = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    featuredImage: data.featuredImage,
    featuredImageAlt: data.featuredImageAlt,
    category: data.category,
    tags: data.tags,
    author: data.author,
    readTime: data.readTime,
    views: data.views,
    trending: data.trending,
    status: "draft",
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  await upsertFirestoreDocument(COLLECTIONS.blogPosts, id, payload);
  await appendAiLog({
    action: "create_blog_draft",
    description: `AI draft created: ${data.title}`,
    relatedCollection: COLLECTIONS.blogPosts,
    relatedId: id,
  });

  return { id, slug: data.slug, status: "draft" };
}

export async function appendAiLog(input: {
  action: string;
  description: string;
  relatedCollection?: string;
  relatedId?: string;
}): Promise<string> {
  return createFirestoreDocument(COLLECTIONS.aiLogs, {
    action: input.action,
    description: input.description,
    relatedCollection: input.relatedCollection,
    relatedId: input.relatedId,
    createdAt: nowIso(),
  });
}

function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export async function listSeoInsights(limit = 50): Promise<SeoInsight[]> {
  const docs = await listFirestoreDocuments(COLLECTIONS.seoInsights, {
    pageSize: limit,
    orderBy: "createdAt",
    orderDirection: "DESCENDING",
  }).catch(async () =>
    // Fallback if index/order field missing on empty/new collection
    listFirestoreDocuments(COLLECTIONS.seoInsights, { pageSize: limit }),
  );

  return docs.map((d) => ({
    id: d.id,
    type: asString(d.type),
    title: asString(d.title),
    description: asString(d.description),
    keyword: asString(d.keyword),
    targetPage: asString(d.targetPage),
    currentPosition: asNumber(d.currentPosition),
    impressions: asNumber(d.impressions),
    clicks: asNumber(d.clicks),
    ctr: asNumber(d.ctr),
    priority: (asString(d.priority, "medium") as SeoInsight["priority"]) || "medium",
    status: (asString(d.status, "pending") as SeoInsight["status"]) || "pending",
    recommendation: asString(d.recommendation),
    createdAt: asString(d.createdAt),
    updatedAt: asString(d.updatedAt),
  }));
}

export async function listGscSnapshots(options?: {
  limit?: number;
  date?: string;
}): Promise<GscSnapshot[]> {
  const docs = await listFirestoreDocuments(COLLECTIONS.gscSnapshots, {
    pageSize: options?.limit ?? 100,
    orderBy: "date",
    orderDirection: "DESCENDING",
  }).catch(async () => listFirestoreDocuments(COLLECTIONS.gscSnapshots, { pageSize: options?.limit ?? 100 }));

  let rows = docs.map((d) => ({
    id: d.id,
    query: asString(d.query),
    page: asString(d.page),
    clicks: asNumber(d.clicks),
    impressions: asNumber(d.impressions),
    ctr: asNumber(d.ctr),
    position: asNumber(d.position),
    date: asString(d.date),
    country: asString(d.country) || undefined,
    device: asString(d.device) || undefined,
    periodStart: asString(d.periodStart) || undefined,
    periodEnd: asString(d.periodEnd) || undefined,
  }));

  if (options?.date) {
    rows = rows.filter((r) => r.date === options.date);
  }
  return rows;
}

export async function listAiLogs(limit = 50): Promise<AiLog[]> {
  const docs = await listFirestoreDocuments(COLLECTIONS.aiLogs, {
    pageSize: limit,
    orderBy: "createdAt",
    orderDirection: "DESCENDING",
  }).catch(async () => listFirestoreDocuments(COLLECTIONS.aiLogs, { pageSize: limit }));

  return docs.map((d) => ({
    id: d.id,
    action: asString(d.action),
    description: asString(d.description),
    relatedCollection: asString(d.relatedCollection) || undefined,
    relatedId: asString(d.relatedId) || undefined,
    createdAt: asString(d.createdAt),
  }));
}
