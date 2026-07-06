import { o as __toESM } from "../_runtime.mjs";
import { n as SITE_LOGO_URL, r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { r as siteImages } from "./site-images-D0ev85AD.mjs";
import { a as require_react, i as useQueryClient, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as DollarSign, G as BookOpen, I as FileText, V as Database, W as Briefcase, f as Search, j as Image, nt as CircleCheck, r as Users, rt as CircleAlert, tt as CircleQuestionMark } from "../_libs/lucide-react.mjs";
import "../_libs/firebase.mjs";
import { i as useAuth } from "./AuthProvider-DW-AkY09.mjs";
import { b as doc, g as setDoc, v as writeBatch } from "../_libs/@firebase/firestore+[...].mjs";
import { n as db, t as COLLECTIONS } from "./firestore-CMfHQadS.mjs";
import { i as cmsKeys } from "./use-cms-fD0JcbJP.mjs";
import { C as useAdminTestimonials, h as useAdminPricing, l as useAdminFaqs, p as useAdminPortfolio, s as useAdminBlogPosts, t as adminKeys, u as useAdminLeads, v as useAdminServices } from "./use-admin-cms-igTQWEoU.mjs";
import { a as FALLBACK_SITE_STATS, i as FALLBACK_SERVICES, n as FALLBACK_FAQS, o as FALLBACK_TESTIMONIALS, r as FALLBACK_PRICING, t as FALLBACK_BLOG_POSTS } from "./fallback-data-DU46fIhE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-Cw6NBkxw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SITE_SETTINGS = {
	siteName: SITE_NAME,
	tagline: "تصميم مواقع وتطبيقات وSEO احترافي",
	logoUrl: SITE_LOGO_URL,
	faviconUrl: SITE_LOGO_URL,
	heroImageUrl: siteImages.hero.main,
	heroImageAlt: siteImages.hero.mainAlt,
	contactEmail: "hello@top1markting.com",
	contactPhone: "0549881368",
	whatsappNumber: "966549881368",
	address: "الرياض، المملكة العربية السعودية",
	socialLinks: {
		facebook: "https://www.facebook.com/Top1Markting",
		instagram: "https://www.instagram.com/top1markting/",
		twitter: "https://twitter.com/Top1Markting",
		linkedin: "https://www.linkedin.com/company/top1markting"
	},
	integrations: { googleAnalyticsId: "G-09WBWML921" },
	robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://top1markting.com/sitemap.xml",
	headerNav: [
		{
			label: "Services",
			href: "/services",
			order: 1
		},
		{
			label: "Portfolio",
			href: "/portfolio",
			order: 2
		},
		{
			label: "Blog",
			href: "/blog",
			order: 3
		},
		{
			label: "About",
			href: "/about",
			order: 4
		}
	],
	footerNav: [
		{
			label: "Contact",
			href: "/contact",
			order: 1
		},
		{
			label: "Privacy",
			href: "/privacy",
			order: 2
		},
		{
			label: "Terms",
			href: "/terms",
			order: 3
		}
	]
};
async function seedFirestoreContent() {
	const batch = writeBatch(db);
	for (const service of FALLBACK_SERVICES) {
		const { id, ...data } = service;
		batch.set(doc(db, COLLECTIONS.services, id), data);
	}
	for (const post of FALLBACK_BLOG_POSTS) {
		const { id, ...data } = post;
		batch.set(doc(db, COLLECTIONS.blogPosts, id), data);
	}
	for (const item of FALLBACK_TESTIMONIALS) {
		const { id, ...data } = item;
		batch.set(doc(db, COLLECTIONS.testimonials, id), data);
	}
	for (const plan of FALLBACK_PRICING) {
		const { id, ...data } = plan;
		batch.set(doc(db, COLLECTIONS.pricingPlans, id), data);
	}
	for (const faq of FALLBACK_FAQS) {
		const { id, ...data } = faq;
		batch.set(doc(db, COLLECTIONS.faqs, id), data);
	}
	for (const stat of FALLBACK_SITE_STATS) {
		const { id, ...data } = stat;
		batch.set(doc(db, COLLECTIONS.siteStats, id), data);
	}
	await batch.commit();
	await setDoc(doc(db, COLLECTIONS.siteSettings, "global"), SITE_SETTINGS);
	return {
		services: FALLBACK_SERVICES.length,
		blogPosts: FALLBACK_BLOG_POSTS.length,
		testimonials: FALLBACK_TESTIMONIALS.length,
		pricingPlans: FALLBACK_PRICING.length,
		faqs: FALLBACK_FAQS.length,
		siteStats: FALLBACK_SITE_STATS.length,
		settings: true
	};
}
var quickLinks = [
	{
		to: "/admin/services",
		label: "الخدمات",
		icon: Briefcase,
		desc: "إدارة الخدمات"
	},
	{
		to: "/admin/blog",
		label: "المدونة",
		icon: BookOpen,
		desc: "المقالات وSEO"
	},
	{
		to: "/admin/portfolio",
		label: "أعمالنا",
		icon: Image,
		desc: "عرض المشاريع"
	},
	{
		to: "/admin/pricing",
		label: "الأسعار",
		icon: DollarSign,
		desc: "باقات التسعير"
	},
	{
		to: "/admin/faqs",
		label: "الأسئلة الشائعة",
		icon: CircleQuestionMark,
		desc: "أسئلة وأجوبة"
	},
	{
		to: "/admin/pages",
		label: "الصفحات",
		icon: FileText,
		desc: "SEO الصفحات"
	},
	{
		to: "/admin/leads",
		label: "العملاء المحتملون",
		icon: Users,
		desc: "رسائل التواصل"
	},
	{
		to: "/admin/seo",
		label: "SEO",
		icon: Search,
		desc: "نظرة عامة SEO"
	}
];
function AdminDashboard() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { data: blogPosts = [] } = useAdminBlogPosts();
	const { data: services = [] } = useAdminServices();
	const { data: portfolio = [] } = useAdminPortfolio();
	const { data: pricing = [] } = useAdminPricing();
	const { data: testimonials = [] } = useAdminTestimonials();
	const { data: faqs = [] } = useAdminFaqs();
	const { data: leads = [] } = useAdminLeads();
	const [seeding, setSeeding] = (0, import_react.useState)(false);
	const [seedMessage, setSeedMessage] = (0, import_react.useState)(null);
	async function handleSeed() {
		setSeeding(true);
		setSeedMessage(null);
		try {
			const result = await seedFirestoreContent();
			await queryClient.invalidateQueries({ queryKey: cmsKeys.all });
			await queryClient.invalidateQueries({ queryKey: adminKeys.all });
			setSeedMessage({
				type: "success",
				text: `تم استيراد ${result.services} خدمة، ${result.blogPosts} مقال، ${result.testimonials} رأي عميل، ${result.pricingPlans} باقة أسعار، ${result.faqs} سؤال شائع، ${result.siteStats} إحصائية.`
			});
		} catch (err) {
			setSeedMessage({
				type: "error",
				text: err instanceof Error ? err.message : "فشل الاستيراد. تحقق من قواعد Firestore والصلاحيات."
			});
		} finally {
			setSeeding(false);
		}
	}
	const stats = [
		{
			label: "الخدمات",
			value: services.length,
			icon: Briefcase
		},
		{
			label: "المقالات",
			value: blogPosts.length,
			icon: BookOpen
		},
		{
			label: "المشاريع",
			value: portfolio.length,
			icon: Image
		},
		{
			label: "العملاء المحتملون",
			value: leads.length,
			icon: Users
		},
		{
			label: "باقات الأسعار",
			value: pricing.length,
			icon: DollarSign
		},
		{
			label: "آراء العملاء",
			value: testimonials.length,
			icon: Users
		},
		{
			label: "الأسئلة الشائعة",
			value: faqs.length,
			icon: CircleQuestionMark
		},
		{
			label: "الصفحات",
			value: 6,
			icon: FileText
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "لوحة التحكم"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 text-2xl font-bold tracking-tight",
						children: ["أهلاً بعودتك", user?.displayName ? `، ${user.displayName}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "أدِر محتوى موقعك وSEO والإعدادات من هنا."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8",
				children: stats.map(({ label, value, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-2xl font-bold",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 surface-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-medium flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4 text-primary" }), "استيراد محتوى Firestore"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "استيراد الخدمات والمقالات والأسعار وآراء العملاء والأسئلة الشائعة."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSeed,
						disabled: seeding,
						className: "btn-primary disabled:opacity-60",
						children: seeding ? "جاري الاستيراد…" : "استيراد المحتوى"
					})]
				}), seedMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mt-4 flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${seedMessage.type === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`,
					children: [seedMessage.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mt-0.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }), seedMessage.text]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold mb-4",
				children: "إجراءات سريعة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: quickLinks.map(({ to, label, icon: Icon, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					className: "surface-card p-5 hover:border-primary/30 transition-colors group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium group-hover:text-primary transition-colors",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: desc
						})
					]
				}, to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 surface-card p-5 border-dashed",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-medium",
					children: "الخطوات التالية"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "أنشئ مستخدم في Firebase Authentication" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"أضف مستند ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-xs bg-accent px-1 rounded",
								children: "users/{uid}"
							}),
							" مع ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-xs bg-accent px-1 rounded",
								children: "role: admin"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["انشر قواعد الأمان من ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-xs bg-accent px-1 rounded",
							children: "firestore.rules"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "اضغط \"استيراد المحتوى\" أو أضف المحتوى يدوياً من لوحة التحكم" })
					]
				})]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
