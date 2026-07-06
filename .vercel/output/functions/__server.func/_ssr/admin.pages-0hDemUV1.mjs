import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Pencil, z as ExternalLink } from "../_libs/lucide-react.mjs";
import { f as useAdminPages } from "./use-admin-cms-igTQWEoU.mjs";
import { d as useAdminChildRoute, l as AdminStatusBadge, o as AdminPageHeader, r as AdminFetchingBar } from "./AdminUi-CmDBDlY3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.pages-0hDemUV1.js
var import_jsx_runtime = require_jsx_runtime();
var STATIC_PAGES = [
	{
		id: "home",
		title: "الرئيسية",
		path: "/",
		slug: "home"
	},
	{
		id: "about",
		title: "من نحن",
		path: "/about",
		slug: "about"
	},
	{
		id: "contact",
		title: "تواصل",
		path: "/contact",
		slug: "contact"
	},
	{
		id: "services",
		title: "الخدمات",
		path: "/services",
		slug: "services"
	},
	{
		id: "portfolio",
		title: "أعمالنا",
		path: "/portfolio",
		slug: "portfolio"
	},
	{
		id: "blog",
		title: "المدونة",
		path: "/blog",
		slug: "blog"
	}
];
function AdminPagesList() {
	const isChild = useAdminChildRoute("/admin/pages/$id");
	const { data: cmsPages = [], isFetching } = useAdminPages();
	if (isChild) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: "الصفحات",
				description: "صفحات الموقع وإعدادات SEO لكل صفحة.",
				actionTo: "/admin/pages/$id",
				actionParams: { id: "new" },
				actionLabel: "صفحة CMS جديدة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold mb-3",
				children: "صفحات الموقع"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-hidden mb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الصفحة" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "المسار" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-28",
						children: "عرض"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-28",
						children: "SEO"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: STATIC_PAGES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: p.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						dir: "ltr",
						className: "text-muted-foreground text-xs",
						children: p.path
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: p.path,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-1 text-xs text-primary hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), " فتح"]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/pages/$id",
						params: { id: p.slug },
						className: "inline-flex items-center gap-1 text-xs text-primary hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" }), " تحرير"]
					}) })
				] }, p.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold mb-3",
				children: "صفحات CMS (Firestore)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: isFetching }),
			!isFetching && cmsPages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground surface-card p-5",
				children: "لا توجد صفحات CMS إضافية. أنشئ صفحة لمحتوى ديناميكي."
			}),
			cmsPages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "العنوان" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Slug" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الحالة" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-20" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: cmsPages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: p.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						dir: "ltr",
						className: "text-xs text-muted-foreground",
						children: p.slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, { status: p.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/pages/$id",
						params: { id: p.id },
						className: "text-primary text-xs hover:underline",
						children: "تحرير"
					}) })
				] }, p.id)) })] })
			})
		]
	});
}
//#endregion
export { AdminPagesList as component };
