import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import "../_libs/firebase.mjs";
import { b as doc, f as getDoc, g as setDoc, p as getDocs, u as deleteDoc, y as collection } from "../_libs/@firebase/firestore+[...].mjs";
import { i as withFirestoreTimeout, n as db, t as COLLECTIONS } from "./firestore-CMfHQadS.mjs";
import { i as cmsKeys, s as nowIso } from "./use-cms-fD0JcbJP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-admin-cms-igTQWEoU.js
/** مهلة قراءة/كتابة لوحة التحكم */
var ADMIN_READ_MS = 8e3;
var ADMIN_WRITE_MS = 12e3;
var adminFirestoreUnavailable = false;
var adminFirestoreLastError = null;
function isAdminFirestoreUnavailable() {
	return adminFirestoreUnavailable;
}
function getAdminFirestoreErrorKind() {
	return adminFirestoreLastError;
}
function clearAdminFirestoreUnavailable() {
	adminFirestoreUnavailable = false;
	adminFirestoreLastError = null;
}
function classifyFirestoreError(err) {
	const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
	const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
	if (code.includes("permission") || msg.includes("permission") || msg.includes("insufficient")) return "permission";
	if (msg.includes("timed out") || code.includes("unavailable") || code.includes("deadline")) return "timeout";
	return "unknown";
}
function formatAdminFirestoreError(err) {
	const kind = classifyFirestoreError(err);
	if (kind === "permission") return "صلاحية غير كافية. تأكد أن حسابك له دور admin/editor في Firestore (users/{uid}) وانشر firestore.rules.";
	if (kind === "timeout") return "انتهت مهلة الاتصال بـ Firestore. تحقق من الإنترنت أو فعّل Firestore في Firebase Console.";
	if (msg.includes("undefined") || code === "invalid-argument" || msg.includes("invalid data")) return "تعذّر الحفظ — بيانات غير صالحة. جرّب استخدام رابط خارجي للصور بدل الرفع المباشر.";
	if (err instanceof Error && err.message) return err.message;
	return "تعذّر حفظ البيانات في Firestore.";
}
function markFirestoreUnavailable(err) {
	adminFirestoreUnavailable = true;
	adminFirestoreLastError = err ? classifyFirestoreError(err) : "unknown";
}
function markFirestoreAvailable() {
	clearAdminFirestoreUnavailable();
}
/** Firestore يرفض القيم undefined — نزيلها قبل أي حفظ */
function stripUndefinedDeep(value) {
	if (value === void 0) return value;
	if (value === null || typeof value !== "object") return value;
	if (Array.isArray(value)) return value.map((item) => stripUndefinedDeep(item));
	const out = {};
	for (const [key, val] of Object.entries(value)) if (val !== void 0) out[key] = stripUndefinedDeep(val);
	return out;
}
function normalizeSiteSettingsForSave(settings) {
	const payload = stripUndefinedDeep({
		...settings,
		integrations: settings.integrations ?? {},
		socialLinks: settings.socialLinks ?? {},
		headerNav: settings.headerNav ?? [],
		footerNav: settings.footerNav ?? [],
		robotsTxt: settings.robotsTxt ?? ""
	});
	if (new TextEncoder().encode(JSON.stringify(payload)).length > 9e5) throw new Error("حجم الإعدادات كبير جداً (غالباً بسبب صور مضمّنة). استخدم «رابط خارجي» للصور أو فعّل Firebase Storage.");
	return payload;
}
function mapDoc(snap) {
	return {
		id: snap.id,
		...snap.data()
	};
}
async function listCollection(collectionName, orderField, direction = "asc") {
	try {
		const snap = await withFirestoreTimeout(getDocs(collection(db, collectionName)), ADMIN_READ_MS);
		markFirestoreAvailable();
		const items = snap.docs.map((d) => mapDoc(d));
		items.sort((a, b) => {
			const av = a[orderField];
			const bv = b[orderField];
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
async function getAdminDoc(collectionName, id) {
	try {
		const snap = await withFirestoreTimeout(getDoc(doc(db, collectionName, id)), ADMIN_READ_MS);
		if (!snap.exists()) return null;
		markFirestoreAvailable();
		return mapDoc(snap);
	} catch (err) {
		markFirestoreUnavailable(err);
		return null;
	}
}
async function saveAdminDoc(collectionName, id, data) {
	try {
		const ref = doc(db, collectionName, id);
		const existing = await withFirestoreTimeout(getDoc(ref), ADMIN_READ_MS).catch(() => null);
		const ts = nowIso();
		await withFirestoreTimeout(setDoc(ref, stripUndefinedDeep({
			...data,
			updatedAt: ts,
			...existing?.exists() ? {} : { createdAt: ts }
		}), { merge: true }), ADMIN_WRITE_MS);
		markFirestoreAvailable();
	} catch (err) {
		markFirestoreUnavailable(err);
		throw err;
	}
}
async function deleteAdminDoc(collectionName, id) {
	try {
		await withFirestoreTimeout(deleteDoc(doc(db, collectionName, id)), ADMIN_WRITE_MS);
		markFirestoreAvailable();
	} catch (err) {
		markFirestoreUnavailable(err);
		throw err;
	}
}
var listAdminServices = () => listCollection(COLLECTIONS.services, "order");
var getAdminService = (id) => getAdminDoc(COLLECTIONS.services, id);
var saveAdminService = (id, data) => saveAdminDoc(COLLECTIONS.services, id, data);
var deleteAdminService = (id) => deleteAdminDoc(COLLECTIONS.services, id);
var listAdminBlogPosts = () => listCollection(COLLECTIONS.blogPosts, "publishedAt", "desc");
var getAdminBlogPost = (id) => getAdminDoc(COLLECTIONS.blogPosts, id);
var saveAdminBlogPost = (id, data) => saveAdminDoc(COLLECTIONS.blogPosts, id, data);
var deleteAdminBlogPost = (id) => deleteAdminDoc(COLLECTIONS.blogPosts, id);
var listAdminPortfolio = () => listCollection(COLLECTIONS.portfolio, "order");
var getAdminPortfolioItem = (id) => getAdminDoc(COLLECTIONS.portfolio, id);
var saveAdminPortfolioItem = (id, data) => saveAdminDoc(COLLECTIONS.portfolio, id, data);
var deleteAdminPortfolioItem = (id) => deleteAdminDoc(COLLECTIONS.portfolio, id);
var listAdminPricing = () => listCollection(COLLECTIONS.pricingPlans, "order");
var getAdminPricingPlan = (id) => getAdminDoc(COLLECTIONS.pricingPlans, id);
var saveAdminPricingPlan = (id, data) => saveAdminDoc(COLLECTIONS.pricingPlans, id, data);
var deleteAdminPricingPlan = (id) => deleteAdminDoc(COLLECTIONS.pricingPlans, id);
var listAdminTestimonials = () => listCollection(COLLECTIONS.testimonials, "order");
var getAdminTestimonial = (id) => getAdminDoc(COLLECTIONS.testimonials, id);
var saveAdminTestimonial = (id, data) => saveAdminDoc(COLLECTIONS.testimonials, id, data);
var deleteAdminTestimonial = (id) => deleteAdminDoc(COLLECTIONS.testimonials, id);
var listAdminFaqs = () => listCollection(COLLECTIONS.faqs, "order");
var getAdminFaq = (id) => getAdminDoc(COLLECTIONS.faqs, id);
var saveAdminFaq = (id, data) => saveAdminDoc(COLLECTIONS.faqs, id, data);
var deleteAdminFaq = (id) => deleteAdminDoc(COLLECTIONS.faqs, id);
var listAdminSiteStats = () => listCollection(COLLECTIONS.siteStats, "order");
var getAdminSiteStat = (id) => getAdminDoc(COLLECTIONS.siteStats, id);
var saveAdminSiteStat = (id, data) => saveAdminDoc(COLLECTIONS.siteStats, id, data);
var deleteAdminSiteStat = (id) => deleteAdminDoc(COLLECTIONS.siteStats, id);
var listAdminPages = () => listCollection(COLLECTIONS.pages, "title");
var getAdminPage = (id) => getAdminDoc(COLLECTIONS.pages, id);
var saveAdminPage = (id, data) => saveAdminDoc(COLLECTIONS.pages, id, data);
var listAdminLeads = () => listCollection(COLLECTIONS.leads, "createdAt", "desc");
async function getAdminSiteSettings() {
	try {
		const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.siteSettings, "global")), ADMIN_READ_MS);
		markFirestoreAvailable();
		return snap.exists() ? snap.data() : null;
	} catch (err) {
		markFirestoreUnavailable(err);
		return null;
	}
}
async function saveAdminSiteSettings(settings) {
	const payload = normalizeSiteSettingsForSave(settings);
	try {
		await withFirestoreTimeout(setDoc(doc(db, COLLECTIONS.siteSettings, "global"), payload, { merge: true }), ADMIN_WRITE_MS);
		markFirestoreAvailable();
	} catch (err) {
		markFirestoreUnavailable(err);
		throw err;
	}
}
var adminKeys = {
	all: ["admin"],
	services: () => [...adminKeys.all, "services"],
	service: (id) => [
		...adminKeys.all,
		"service",
		id
	],
	blog: () => [...adminKeys.all, "blog"],
	blogPost: (id) => [
		...adminKeys.all,
		"blog",
		id
	],
	portfolio: () => [...adminKeys.all, "portfolio"],
	portfolioItem: (id) => [
		...adminKeys.all,
		"portfolio",
		id
	],
	pricing: () => [...adminKeys.all, "pricing"],
	pricingPlan: (id) => [
		...adminKeys.all,
		"pricing",
		id
	],
	testimonials: () => [...adminKeys.all, "testimonials"],
	testimonial: (id) => [
		...adminKeys.all,
		"testimonial",
		id
	],
	faqs: () => [...adminKeys.all, "faqs"],
	faq: (id) => [
		...adminKeys.all,
		"faq",
		id
	],
	stats: () => [...adminKeys.all, "stats"],
	stat: (id) => [
		...adminKeys.all,
		"stat",
		id
	],
	pages: () => [...adminKeys.all, "pages"],
	page: (id) => [
		...adminKeys.all,
		"page",
		id
	],
	settings: () => [...adminKeys.all, "settings"],
	leads: () => [...adminKeys.all, "leads"]
};
function invalidatePublic(queryClient) {
	return queryClient.invalidateQueries({ queryKey: cmsKeys.all });
}
/** لا إعادة محاولة — عرض فوري بدون تعليق الواجهة */
var adminQueryOptions = {
	retry: false,
	staleTime: 6e4,
	gcTime: 5 * 6e4,
	refetchOnWindowFocus: false
};
function useAdminServices() {
	return useQuery({
		queryKey: adminKeys.services(),
		queryFn: listAdminServices,
		placeholderData: [],
		...adminQueryOptions
	});
}
function useAdminService(id, enabled = true) {
	return useQuery({
		queryKey: adminKeys.service(id),
		queryFn: () => getAdminService(id),
		enabled: enabled && id !== "new",
		...adminQueryOptions
	});
}
function useSaveService() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => saveAdminService(id, data),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.services() });
			await invalidatePublic(qc);
		}
	});
}
function useDeleteService() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteAdminService,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.services() });
			await invalidatePublic(qc);
		}
	});
}
function useAdminBlogPosts() {
	return useQuery({
		queryKey: adminKeys.blog(),
		queryFn: listAdminBlogPosts,
		placeholderData: [],
		...adminQueryOptions
	});
}
function useAdminBlogPost(id, enabled = true) {
	return useQuery({
		queryKey: adminKeys.blogPost(id),
		queryFn: () => getAdminBlogPost(id),
		enabled: enabled && id !== "new",
		...adminQueryOptions
	});
}
function useSaveBlogPost() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => saveAdminBlogPost(id, data),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.blog() });
			await invalidatePublic(qc);
		}
	});
}
function useDeleteBlogPost() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteAdminBlogPost,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.blog() });
			await invalidatePublic(qc);
		}
	});
}
function useAdminPortfolio() {
	return useQuery({
		queryKey: adminKeys.portfolio(),
		queryFn: listAdminPortfolio,
		placeholderData: [],
		...adminQueryOptions
	});
}
function useAdminPortfolioItem(id, enabled = true) {
	return useQuery({
		queryKey: adminKeys.portfolioItem(id),
		queryFn: () => getAdminPortfolioItem(id),
		enabled: enabled && id !== "new",
		...adminQueryOptions
	});
}
function useSavePortfolioItem() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => saveAdminPortfolioItem(id, data),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.portfolio() });
			await invalidatePublic(qc);
		}
	});
}
function useDeletePortfolioItem() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteAdminPortfolioItem,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.portfolio() });
			await invalidatePublic(qc);
		}
	});
}
function useAdminPricing() {
	return useQuery({
		queryKey: adminKeys.pricing(),
		queryFn: listAdminPricing,
		placeholderData: [],
		...adminQueryOptions
	});
}
function useAdminPricingPlan(id, enabled = true) {
	return useQuery({
		queryKey: adminKeys.pricingPlan(id),
		queryFn: () => getAdminPricingPlan(id),
		enabled: enabled && id !== "new",
		...adminQueryOptions
	});
}
function useSavePricingPlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => saveAdminPricingPlan(id, data),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.pricing() });
			await invalidatePublic(qc);
		}
	});
}
function useDeletePricingPlan() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteAdminPricingPlan,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.pricing() });
			await invalidatePublic(qc);
		}
	});
}
function useAdminTestimonials() {
	return useQuery({
		queryKey: adminKeys.testimonials(),
		queryFn: listAdminTestimonials,
		placeholderData: [],
		...adminQueryOptions
	});
}
function useAdminTestimonial(id, enabled = true) {
	return useQuery({
		queryKey: adminKeys.testimonial(id),
		queryFn: () => getAdminTestimonial(id),
		enabled: enabled && id !== "new",
		...adminQueryOptions
	});
}
function useSaveTestimonial() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => saveAdminTestimonial(id, data),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.testimonials() });
			await invalidatePublic(qc);
		}
	});
}
function useDeleteTestimonial() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteAdminTestimonial,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.testimonials() });
			await invalidatePublic(qc);
		}
	});
}
function useAdminFaqs() {
	return useQuery({
		queryKey: adminKeys.faqs(),
		queryFn: listAdminFaqs,
		placeholderData: [],
		...adminQueryOptions
	});
}
function useAdminFaq(id, enabled = true) {
	return useQuery({
		queryKey: adminKeys.faq(id),
		queryFn: () => getAdminFaq(id),
		enabled: enabled && id !== "new",
		...adminQueryOptions
	});
}
function useSaveFaq() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => saveAdminFaq(id, data),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.faqs() });
			await invalidatePublic(qc);
		}
	});
}
function useDeleteFaq() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteAdminFaq,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.faqs() });
			await invalidatePublic(qc);
		}
	});
}
function useAdminSiteStats() {
	return useQuery({
		queryKey: adminKeys.stats(),
		queryFn: listAdminSiteStats,
		placeholderData: [],
		...adminQueryOptions
	});
}
function useAdminSiteStat(id, enabled = true) {
	return useQuery({
		queryKey: adminKeys.stat(id),
		queryFn: () => getAdminSiteStat(id),
		enabled: enabled && id !== "new",
		...adminQueryOptions
	});
}
function useSaveSiteStat() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => saveAdminSiteStat(id, data),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.stats() });
			await invalidatePublic(qc);
		}
	});
}
function useDeleteSiteStat() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteAdminSiteStat,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.stats() });
			await invalidatePublic(qc);
		}
	});
}
function useAdminPages() {
	return useQuery({
		queryKey: adminKeys.pages(),
		queryFn: listAdminPages,
		placeholderData: [],
		...adminQueryOptions
	});
}
function useAdminPage(id, enabled = true) {
	return useQuery({
		queryKey: adminKeys.page(id),
		queryFn: () => getAdminPage(id),
		enabled: enabled && id !== "new",
		...adminQueryOptions
	});
}
function useSavePage() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => saveAdminPage(id, data),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.pages() });
			await invalidatePublic(qc);
		}
	});
}
function useAdminSiteSettings() {
	return useQuery({
		queryKey: adminKeys.settings(),
		queryFn: getAdminSiteSettings,
		...adminQueryOptions
	});
}
function useSaveSiteSettings() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: saveAdminSiteSettings,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: adminKeys.settings() });
			await invalidatePublic(qc);
		}
	});
}
function useAdminLeads() {
	return useQuery({
		queryKey: adminKeys.leads(),
		queryFn: listAdminLeads,
		placeholderData: [],
		...adminQueryOptions
	});
}
//#endregion
export { useDeleteTestimonial as A, useAdminTestimonials as C, useDeletePricingPlan as D, useDeletePortfolioItem as E, useSavePricingPlan as F, useSaveService as I, useSaveSiteSettings as L, useSaveFaq as M, useSavePage as N, useDeleteService as O, useSavePortfolioItem as P, useSaveSiteStat as R, useAdminTestimonial as S, useDeleteFaq as T, useAdminService as _, isAdminFirestoreUnavailable as a, useAdminSiteStat as b, useAdminFaq as c, useAdminPage as d, useAdminPages as f, useAdminPricingPlan as g, useAdminPricing as h, getAdminFirestoreErrorKind as i, useSaveBlogPost as j, useDeleteSiteStat as k, useAdminFaqs as l, useAdminPortfolioItem as m, clearAdminFirestoreUnavailable as n, useAdminBlogPost as o, useAdminPortfolio as p, formatAdminFirestoreError as r, useAdminBlogPosts as s, adminKeys as t, useAdminLeads as u, useAdminServices as v, useDeleteBlogPost as w, useAdminSiteStats as x, useAdminSiteSettings as y, useSaveTestimonial as z };
