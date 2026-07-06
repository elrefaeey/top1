import { r as __exportAll } from "../_runtime.mjs";
import "../_libs/firebase.mjs";
import { n as getFirebaseApp } from "./config-Dmr7eOvS.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { S as initializeFirestore, x as getFirestore } from "../_libs/@firebase/firestore+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firestore-CMfHQadS.js
var firestore_CMfHQadS_exports = /* @__PURE__ */ __exportAll({
	i: () => withFirestoreTimeout,
	n: () => db,
	r: () => firestore_exports,
	t: () => COLLECTIONS
});
var firestore_exports = /* @__PURE__ */ __exportAll$1({
	COLLECTIONS: () => COLLECTIONS,
	db: () => db,
	getDb: () => getDb,
	withFirestoreTimeout: () => withFirestoreTimeout
});
var dbInstance = null;
function getDb() {
	if (dbInstance) return dbInstance;
	const app = getFirebaseApp();
	try {
		dbInstance = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
	} catch {
		dbInstance = getFirestore(app);
	}
	return dbInstance;
}
function createLazyDb() {
	return new Proxy({}, { get(_target, prop) {
		const instance = getDb();
		const value = Reflect.get(instance, prop, instance);
		return typeof value === "function" ? value.bind(instance) : value;
	} });
}
/** Lazy Firestore — avoids init during SSR module load */
var db = createLazyDb();
var COLLECTIONS = {
	users: "users",
	siteSettings: "site_settings",
	pages: "pages",
	services: "services",
	portfolio: "portfolio",
	blogPosts: "blog_posts",
	blogCategories: "blog_categories",
	blogTags: "blog_tags",
	testimonials: "testimonials",
	pricingPlans: "pricing_plans",
	faqs: "faqs",
	siteStats: "site_stats",
	leads: "leads",
	media: "media"
};
function withFirestoreTimeout(promise, ms = 8e3) {
	return Promise.race([promise, new Promise((_, reject) => {
		setTimeout(() => reject(/* @__PURE__ */ new Error("Firestore request timed out")), ms);
	})]);
}
//#endregion
export { withFirestoreTimeout as i, db as n, firestore_CMfHQadS_exports as r, COLLECTIONS as t };
