import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Pencil } from "../_libs/lucide-react.mjs";
import { L as useSaveSiteSettings, f as useAdminPages, s as useAdminBlogPosts, v as useAdminServices, y as useAdminSiteSettings } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, i as AdminField, l as AdminStatusBadge, o as AdminPageHeader, r as AdminFetchingBar, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.seo-Mv0IvGSE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATIC_PAGES = [
	{
		id: "home",
		title: "الرئيسية",
		editId: "home"
	},
	{
		id: "about",
		title: "من نحن",
		editId: "about"
	},
	{
		id: "contact",
		title: "تواصل",
		editId: "contact"
	},
	{
		id: "services",
		title: "الخدمات",
		editId: "services"
	},
	{
		id: "portfolio",
		title: "أعمالنا",
		editId: "portfolio"
	},
	{
		id: "blog",
		title: "المدونة",
		editId: "blog"
	}
];
function seoScore(title, desc) {
	if (!title && !desc) return {
		label: "ناقص",
		className: "text-destructive"
	};
	if (title && desc && title.length <= 60 && desc.length <= 160) return {
		label: "جيد",
		className: "text-emerald-600"
	};
	return {
		label: "يحتاج تحسين",
		className: "text-amber-600"
	};
}
function AdminSeoPage() {
	const { data: services = [], isFetching: loadingServices } = useAdminServices();
	const { data: blogPosts = [], isFetching: loadingBlog } = useAdminBlogPosts();
	const { data: cmsPages = [], isFetching: loadingPages } = useAdminPages();
	const { data: settings, isFetching: loadingSettings } = useAdminSiteSettings();
	const save = useSaveSiteSettings();
	const [robotsTxt, setRobotsTxt] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (settings?.robotsTxt !== void 0) setRobotsTxt(settings.robotsTxt);
	}, [settings]);
	const isFetching = loadingServices || loadingBlog || loadingPages || loadingSettings;
	async function handleRobotsSubmit(e) {
		e.preventDefault();
		await save.mutateAsync({
			siteName: settings?.siteName ?? "Top1Markting",
			tagline: settings?.tagline ?? "",
			logoUrl: settings?.logoUrl ?? "/logo.jpeg",
			faviconUrl: settings?.faviconUrl ?? "/logo.jpeg",
			contactEmail: settings?.contactEmail ?? "",
			contactPhone: settings?.contactPhone ?? "",
			whatsappNumber: settings?.whatsappNumber ?? "",
			address: settings?.address ?? "",
			socialLinks: settings?.socialLinks ?? {},
			integrations: settings?.integrations ?? {},
			robotsTxt,
			headerNav: settings?.headerNav ?? [],
			footerNav: settings?.footerNav ?? []
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: "SEO",
				description: "نظرة عامة على عناوين ووصف الصفحات والمحتوى."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: isFetching }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold mb-3",
					children: "صفحات الموقع"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card overflow-hidden mb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الصفحة" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Meta Title" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Meta Description" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "w-24",
							children: "الحالة"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-20" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: STATIC_PAGES.map((p) => {
						const cms = cmsPages.find((c) => c.id === p.editId || c.slug === p.editId);
						const score = seoScore(cms?.metaTitle, cms?.metaDescription);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground max-w-[180px] truncate",
								dir: "ltr",
								children: cms?.metaTitle || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground max-w-[220px] truncate",
								children: cms?.metaDescription || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-xs font-medium ${score.className}`,
								children: score.label
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/pages/$id",
								params: { id: p.editId },
								className: "inline-flex items-center gap-1 text-xs text-primary hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" }), " تحرير"]
							}) })
						] }, p.id);
					}) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold mb-3",
					children: "الخدمات"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card overflow-hidden mb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "العنوان" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Meta Title" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الحالة" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-20" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [services.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 4,
						className: "text-sm text-muted-foreground",
						children: "لا توجد خدمات. استورد المحتوى من لوحة التحكم."
					}) }), services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground truncate max-w-[200px]",
							dir: "ltr",
							children: s.metaTitle || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, { status: s.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/services/$id",
							params: { id: s.id },
							className: "text-xs text-primary hover:underline",
							children: "تحرير"
						}) })
					] }, s.id))] })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold mb-3",
					children: "المقالات"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card overflow-hidden mb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "العنوان" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Meta Title" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الحالة" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-20" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [blogPosts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 4,
						className: "text-sm text-muted-foreground",
						children: "لا توجد مقالات."
					}) }), blogPosts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: post.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground truncate max-w-[200px]",
							dir: "ltr",
							children: post.metaTitle || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, { status: post.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/blog/$id",
							params: { id: post.id },
							className: "text-xs text-primary hover:underline",
							children: "تحرير"
						}) })
					] }, post.id))] })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleRobotsSubmit,
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
						label: "robots.txt",
						id: "robots",
						hint: "يُستخدم عند تفعيل SEO الديناميكي.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "robots",
							dir: "ltr",
							rows: 6,
							value: robotsTxt,
							onChange: (e) => setRobotsTxt(e.target.value),
							className: adminInputClass("text-start font-mono text-xs"),
							placeholder: "User-agent: *\nAllow: /"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFormActions, { saving: save.isPending })]
				}) })
			] })
		]
	});
}
//#endregion
export { AdminSeoPage as component };
