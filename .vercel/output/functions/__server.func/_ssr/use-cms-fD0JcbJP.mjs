import { n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import "../_libs/firebase.mjs";
import { r as isFirebaseConfigured } from "./config-Dmr7eOvS.mjs";
import { _ as where, b as doc, f as getDoc, g as setDoc, h as query, m as limit, p as getDocs, y as collection } from "../_libs/@firebase/firestore+[...].mjs";
import { i as withFirestoreTimeout, n as db, t as COLLECTIONS } from "./firestore-CMfHQadS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-cms-fD0JcbJP.js
function slugify(text) {
	return text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
/** Slug used in public blog URLs — falls back to document id when slug is missing. */
function blogPostSlug(post) {
	return post.slug?.trim() || post.id;
}
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function linesToArray(value) {
	return value.split("\n").map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(items) {
	return items.join("\n");
}
function commaToArray(value) {
	return value.split(",").map((s) => s.trim()).filter(Boolean);
}
function arrayToComma(items) {
	return items.join(", ");
}
var READ_MS = 5e3;
function mapDoc(snap) {
	return {
		id: snap.id,
		...snap.data()
	};
}
function sortByField(items, field, direction = "asc") {
	const dir = direction === "asc" ? 1 : -1;
	return [...items].sort((a, b) => {
		const av = a[field];
		const bv = b[field];
		if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
		if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
		return 0;
	});
}
async function getPublished(collectionName, orderField = "order", max) {
	let items = (await withFirestoreTimeout(getDocs(query(collection(db, collectionName), where("status", "==", "published"))), READ_MS)).docs.map((d) => mapDoc(d));
	items = sortByField(items, orderField, "asc");
	if (max) items = items.slice(0, max);
	return items;
}
async function safeList(fetcher) {
	if (!isFirebaseConfigured()) return [];
	try {
		return await fetcher();
	} catch {
		return [];
	}
}
async function getSiteSettings() {
	if (!isFirebaseConfigured()) return null;
	try {
		const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.siteSettings, "global")), READ_MS);
		return snap.exists() ? snap.data() : null;
	} catch {
		return null;
	}
}
async function getServices() {
	return safeList(() => getPublished(COLLECTIONS.services));
}
async function getServiceBySlug(slug) {
	if (!isFirebaseConfigured()) return null;
	try {
		const snap = await withFirestoreTimeout(getDocs(query(collection(db, COLLECTIONS.services), where("slug", "==", slug), where("status", "==", "published"), limit(1))), READ_MS);
		if (!snap.empty) return mapDoc(snap.docs[0]);
	} catch {}
	return null;
}
async function getPortfolio() {
	return safeList(() => getPublished(COLLECTIONS.portfolio));
}
function normalizeBlogPost(docId, post) {
	const slug = post.slug?.trim() || docId;
	return {
		...post,
		id: docId,
		slug
	};
}
function normalizeBlogSlugParam(slug) {
	try {
		return decodeURIComponent(slug).trim();
	} catch {
		return slug.trim();
	}
}
async function getBlogPosts(max) {
	return safeList(async () => {
		let items = (await withFirestoreTimeout(getDocs(query(collection(db, COLLECTIONS.blogPosts), where("status", "==", "published"))), READ_MS)).docs.map((d) => normalizeBlogPost(d.id, mapDoc(d)));
		items = sortByField(items, "publishedAt", "desc");
		if (max) items = items.slice(0, max);
		return items;
	});
}
async function getBlogPostBySlug(slug) {
	const normalized = normalizeBlogSlugParam(slug);
	if (!normalized || !isFirebaseConfigured()) return null;
	try {
		const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.blogPosts, normalized)), READ_MS);
		if (snap.exists()) {
			const post = normalizeBlogPost(snap.id, mapDoc(snap));
			if (post.status === "published") return post;
		}
	} catch {}
	try {
		return (await getBlogPosts()).find((p) => p.slug === normalized || p.id === normalized || p.slug && encodeURIComponent(p.slug) === slug) ?? null;
	} catch {
		return null;
	}
}
async function getTestimonials() {
	return safeList(() => getPublished(COLLECTIONS.testimonials));
}
async function getPricingPlans() {
	return safeList(() => getPublished(COLLECTIONS.pricingPlans));
}
async function getFaqs() {
	return safeList(() => getPublished(COLLECTIONS.faqs));
}
async function getSiteStats() {
	const { FALLBACK_SITE_STATS } = await import("./fallback-data-DU46fIhE.mjs").then((n) => n.s);
	const items = await safeList(() => getPublished(COLLECTIONS.siteStats));
	if (items.length > 0) return items;
	return FALLBACK_SITE_STATS.map((s) => ({ ...s }));
}
async function createLead(input) {
	const ref = doc(collection(db, COLLECTIONS.leads));
	const ts = nowIso();
	await withFirestoreTimeout(setDoc(ref, {
		...input,
		source: input.source ?? "contact_form",
		status: "new",
		createdAt: ts,
		updatedAt: ts
	}), READ_MS);
}
var cmsKeys = {
	all: ["cms"],
	settings: () => [...cmsKeys.all, "settings"],
	services: () => [...cmsKeys.all, "services"],
	service: (slug) => [
		...cmsKeys.all,
		"service",
		slug
	],
	portfolio: () => [...cmsKeys.all, "portfolio"],
	blog: () => [...cmsKeys.all, "blog"],
	blogPost: (slug) => [
		...cmsKeys.all,
		"blog",
		slug
	],
	trending: () => [...cmsKeys.all, "trending"],
	testimonials: () => [...cmsKeys.all, "testimonials"],
	pricing: () => [...cmsKeys.all, "pricing"],
	faqs: () => [...cmsKeys.all, "faqs"],
	stats: () => [...cmsKeys.all, "stats"],
	page: (slug) => [
		...cmsKeys.all,
		"page",
		slug
	]
};
var cmsQuery = {
	retry: false,
	staleTime: 6e4,
	refetchOnWindowFocus: false
};
function useSiteSettings() {
	return useQuery({
		queryKey: cmsKeys.settings(),
		queryFn: getSiteSettings,
		...cmsQuery
	});
}
function useServices() {
	return useQuery({
		queryKey: cmsKeys.services(),
		queryFn: getServices,
		placeholderData: [],
		...cmsQuery
	});
}
function useService(slug) {
	return useQuery({
		queryKey: cmsKeys.service(slug),
		queryFn: () => getServiceBySlug(slug),
		enabled: !!slug,
		...cmsQuery
	});
}
function usePortfolio() {
	return useQuery({
		queryKey: cmsKeys.portfolio(),
		queryFn: getPortfolio,
		placeholderData: [],
		...cmsQuery
	});
}
function useBlogPosts(max) {
	return useQuery({
		queryKey: [...cmsKeys.blog(), max],
		queryFn: () => getBlogPosts(max),
		placeholderData: [],
		...cmsQuery
	});
}
function useBlogPost(slug) {
	return useQuery({
		queryKey: cmsKeys.blogPost(slug),
		queryFn: () => getBlogPostBySlug(slug),
		enabled: !!slug,
		...cmsQuery
	});
}
function useTestimonials() {
	return useQuery({
		queryKey: cmsKeys.testimonials(),
		queryFn: getTestimonials,
		placeholderData: [],
		...cmsQuery
	});
}
function usePricingPlans() {
	return useQuery({
		queryKey: cmsKeys.pricing(),
		queryFn: getPricingPlans,
		placeholderData: [],
		...cmsQuery
	});
}
function useFaqs() {
	return useQuery({
		queryKey: cmsKeys.faqs(),
		queryFn: getFaqs,
		placeholderData: [],
		...cmsQuery
	});
}
function useSiteStats() {
	return useQuery({
		queryKey: cmsKeys.stats(),
		queryFn: getSiteStats,
		placeholderData: [],
		...cmsQuery
	});
}
function useSubmitLead() {
	return useMutation({ mutationFn: createLead });
}
//#endregion
export { useSiteStats as _, commaToArray as a, slugify as c, useFaqs as d, usePortfolio as f, useSiteSettings as g, useServices as h, cmsKeys as i, useBlogPost as l, useService as m, arrayToLines as n, linesToArray as o, usePricingPlans as p, blogPostSlug as r, nowIso as s, arrayToComma as t, useBlogPosts as u, useSubmitLead as v, useTestimonials as y };
