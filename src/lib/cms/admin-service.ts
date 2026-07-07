import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getDb, COLLECTIONS, withFirestoreTimeout } from "@/lib/firebase/firestore";
import { nowIso } from "./admin-utils";
import type {
  BlogPost,
  CmsPage,
  FaqItem,
  Lead,
  PortfolioItem,
  PricingPlan,
  Service,
  SiteSettings,
  SiteStat,
  Testimonial,
  WithId,
} from "@/types/cms";

/** مهلة قراءة/كتابة لوحة التحكم */
const ADMIN_READ_MS = 8000;
const ADMIN_WRITE_MS = 12000;

let adminFirestoreUnavailable = false;
let adminFirestoreLastError: "timeout" | "permission" | "unknown" | null = null;

export function isAdminFirestoreUnavailable() {
  return adminFirestoreUnavailable;
}

export function getAdminFirestoreErrorKind() {
  return adminFirestoreLastError;
}

export function clearAdminFirestoreUnavailable() {
  adminFirestoreUnavailable = false;
  adminFirestoreLastError = null;
}

function classifyFirestoreError(err: unknown): "timeout" | "permission" | "unknown" {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  const code = typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
  if (code.includes("permission") || msg.includes("permission") || msg.includes("insufficient")) {
    return "permission";
  }
  if (msg.includes("timed out") || code.includes("unavailable") || code.includes("deadline")) {
    return "timeout";
  }
  return "unknown";
}

export function formatAdminFirestoreError(err: unknown): string {
  const kind = classifyFirestoreError(err);
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  const code =
    typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
  if (kind === "permission") {
    return "صلاحية غير كافية. تأكد أن حسابك له دور admin/editor في Firestore (users/{uid}) وانشر firestore.rules.";
  }
  if (kind === "timeout") {
    return "انتهت مهلة الاتصال بـ Firestore. تحقق من الإنترنت أو فعّل Firestore في Firebase Console.";
  }
  if (msg.includes("undefined") || code === "invalid-argument" || msg.includes("invalid data")) {
    return "تعذّر الحفظ — بيانات غير صالحة. جرّب استخدام رابط خارجي للصور بدل الرفع المباشر.";
  }
  if (err instanceof Error && err.message) return err.message;
  return "تعذّر حفظ البيانات في Firestore.";
}

function markFirestoreUnavailable(err?: unknown) {
  adminFirestoreUnavailable = true;
  adminFirestoreLastError = err ? classifyFirestoreError(err) : "unknown";
}

function markFirestoreAvailable() {
  clearAdminFirestoreUnavailable();
}

/** Firestore يرفض القيم undefined — نزيلها قبل أي حفظ */
function stripUndefinedDeep<T>(value: T): T {
  if (value === undefined) return value;
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item)) as T;
  }
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (val !== undefined) {
      out[key] = stripUndefinedDeep(val);
    }
  }
  return out as T;
}

function normalizeSiteSettingsForSave(settings: SiteSettings): SiteSettings {
  const payload = stripUndefinedDeep({
    ...settings,
    integrations: settings.integrations ?? {},
    socialLinks: settings.socialLinks ?? {},
    headerNav: settings.headerNav ?? [],
    footerNav: settings.footerNav ?? [],
    robotsTxt: settings.robotsTxt ?? "",
  }) as SiteSettings;

  const bytes = new TextEncoder().encode(JSON.stringify(payload)).length;
  if (bytes > 900_000) {
    throw new Error(
      "حجم الإعدادات كبير جداً (غالباً بسبب صور مضمّنة). استخدم «رابط خارجي» للصور أو فعّل Firebase Storage.",
    );
  }
  return payload;
}

function mapDoc<T>(snap: { id: string; data: () => T | undefined }): WithId<T> {
  return { id: snap.id, ...snap.data()! };
}

async function listCollection<T>(
  collectionName: string,
  orderField: string,
  direction: "asc" | "desc" = "asc",
): Promise<WithId<T>[]> {
  try {
    const snap = await withFirestoreTimeout(getDocs(collection(getDb(), collectionName)), ADMIN_READ_MS);
    markFirestoreAvailable();
    const items = snap.docs.map((d) => mapDoc<T>(d));
    items.sort((a, b) => {
      const av = (a as Record<string, unknown>)[orderField];
      const bv = (b as Record<string, unknown>)[orderField];
      if (av === bv) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : 1;
      return direction === "asc" ? cmp : -cmp;
    });
    return items;
  } catch (err) {
    markFirestoreUnavailable(err);
    return [];
  }
}

export async function getAdminDoc<T>(collectionName: string, id: string): Promise<WithId<T> | null> {
  try {
    const snap = await withFirestoreTimeout(getDoc(doc(getDb(), collectionName, id)), ADMIN_READ_MS);
    if (!snap.exists()) return null;
    markFirestoreAvailable();
    return mapDoc<T>(snap);
  } catch (err) {
    markFirestoreUnavailable(err);
    return null;
  }
}

export async function saveAdminDoc<T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: T,
): Promise<void> {
  try {
    const ref = doc(getDb(), collectionName, id);
    const existing = await withFirestoreTimeout(getDoc(ref), ADMIN_READ_MS).catch(() => null);
    const ts = nowIso();
    await withFirestoreTimeout(
      setDoc(
        ref,
        stripUndefinedDeep({
          ...data,
          updatedAt: ts,
          ...(existing?.exists() ? {} : { createdAt: ts }),
        }),
        { merge: true },
      ),
      ADMIN_WRITE_MS,
    );
    markFirestoreAvailable();
  } catch (err) {
    markFirestoreUnavailable(err);
    throw err;
  }
}

export async function deleteAdminDoc(collectionName: string, id: string): Promise<void> {
  try {
    await withFirestoreTimeout(deleteDoc(doc(getDb(), collectionName, id)), ADMIN_WRITE_MS);
    markFirestoreAvailable();
  } catch (err) {
    markFirestoreUnavailable(err);
    throw err;
  }
}

// ── Services ──
export const listAdminServices = () => listCollection<Service>(COLLECTIONS.services, "order");
export const getAdminService = (id: string) => getAdminDoc<Service>(COLLECTIONS.services, id);
export const saveAdminService = (id: string, data: Omit<Service, "id">) =>
  saveAdminDoc(COLLECTIONS.services, id, data);
export const deleteAdminService = (id: string) => deleteAdminDoc(COLLECTIONS.services, id);

// ── Blog ──
export const listAdminBlogPosts = () =>
  listCollection<BlogPost>(COLLECTIONS.blogPosts, "publishedAt", "desc");
export const getAdminBlogPost = (id: string) => getAdminDoc<BlogPost>(COLLECTIONS.blogPosts, id);
export const saveAdminBlogPost = (id: string, data: Omit<BlogPost, "id">) =>
  saveAdminDoc(COLLECTIONS.blogPosts, id, data);
export const deleteAdminBlogPost = (id: string) => deleteAdminDoc(COLLECTIONS.blogPosts, id);

// ── Portfolio ──
export const listAdminPortfolio = () => listCollection<PortfolioItem>(COLLECTIONS.portfolio, "order");
export const getAdminPortfolioItem = (id: string) => getAdminDoc<PortfolioItem>(COLLECTIONS.portfolio, id);
export const saveAdminPortfolioItem = (id: string, data: Omit<PortfolioItem, "id">) =>
  saveAdminDoc(COLLECTIONS.portfolio, id, data);
export const deleteAdminPortfolioItem = (id: string) => deleteAdminDoc(COLLECTIONS.portfolio, id);

// ── Pricing ──
export const listAdminPricing = () => listCollection<PricingPlan>(COLLECTIONS.pricingPlans, "order");
export const getAdminPricingPlan = (id: string) => getAdminDoc<PricingPlan>(COLLECTIONS.pricingPlans, id);
export const saveAdminPricingPlan = (id: string, data: Omit<PricingPlan, "id">) =>
  saveAdminDoc(COLLECTIONS.pricingPlans, id, data);
export const deleteAdminPricingPlan = (id: string) => deleteAdminDoc(COLLECTIONS.pricingPlans, id);

// ── Testimonials ──
export const listAdminTestimonials = () => listCollection<Testimonial>(COLLECTIONS.testimonials, "order");
export const getAdminTestimonial = (id: string) => getAdminDoc<Testimonial>(COLLECTIONS.testimonials, id);
export const saveAdminTestimonial = (id: string, data: Omit<Testimonial, "id">) =>
  saveAdminDoc(COLLECTIONS.testimonials, id, data);
export const deleteAdminTestimonial = (id: string) => deleteAdminDoc(COLLECTIONS.testimonials, id);

// ── FAQs ──
export const listAdminFaqs = () => listCollection<FaqItem>(COLLECTIONS.faqs, "order");
export const getAdminFaq = (id: string) => getAdminDoc<FaqItem>(COLLECTIONS.faqs, id);
export const saveAdminFaq = (id: string, data: Omit<FaqItem, "id">) =>
  saveAdminDoc(COLLECTIONS.faqs, id, data);
export const deleteAdminFaq = (id: string) => deleteAdminDoc(COLLECTIONS.faqs, id);

// ── Site stats ──
export const listAdminSiteStats = () => listCollection<SiteStat>(COLLECTIONS.siteStats, "order");
export const getAdminSiteStat = (id: string) => getAdminDoc<SiteStat>(COLLECTIONS.siteStats, id);
export const saveAdminSiteStat = (id: string, data: Omit<SiteStat, "id">) =>
  saveAdminDoc(COLLECTIONS.siteStats, id, data);
export const deleteAdminSiteStat = (id: string) => deleteAdminDoc(COLLECTIONS.siteStats, id);

// ── Pages ──
export const listAdminPages = () => listCollection<CmsPage>(COLLECTIONS.pages, "title");
export const getAdminPage = (id: string) => getAdminDoc<CmsPage>(COLLECTIONS.pages, id);
export const saveAdminPage = (id: string, data: Omit<CmsPage, "id">) =>
  saveAdminDoc(COLLECTIONS.pages, id, data);
export const deleteAdminPage = (id: string) => deleteAdminDoc(COLLECTIONS.pages, id);

// ── Leads ──
export const listAdminLeads = () => listCollection<Lead>(COLLECTIONS.leads, "createdAt", "desc");

// ── Settings ──
export async function getAdminSiteSettings(): Promise<SiteSettings | null> {
  try {
    const snap = await withFirestoreTimeout(
      getDoc(doc(getDb(), COLLECTIONS.siteSettings, "global")),
      ADMIN_READ_MS,
    );
    markFirestoreAvailable();
    return snap.exists() ? (snap.data() as SiteSettings) : null;
  } catch (err) {
    markFirestoreUnavailable(err);
    return null;
  }
}

export async function saveAdminSiteSettings(settings: SiteSettings): Promise<void> {
  const payload = normalizeSiteSettingsForSave(settings);
  try {
    await withFirestoreTimeout(
      setDoc(doc(getDb(), COLLECTIONS.siteSettings, "global"), payload, { merge: true }),
      ADMIN_WRITE_MS,
    );
    markFirestoreAvailable();
  } catch (err) {
    markFirestoreUnavailable(err);
    throw err;
  }
}
