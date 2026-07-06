import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Pencil, s as Trash2 } from "../_libs/lucide-react.mjs";
import { E as useDeletePortfolioItem, p as useAdminPortfolio } from "./use-admin-cms-igTQWEoU.mjs";
import { d as useAdminChildRoute, l as AdminStatusBadge, n as AdminEmpty, o as AdminPageHeader, r as AdminFetchingBar } from "./AdminUi-CmDBDlY3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.portfolio--OBd_T1H.js
var import_jsx_runtime = require_jsx_runtime();
function AdminPortfolioList() {
	const isChild = useAdminChildRoute("/admin/portfolio/$id");
	const { data = [], isFetching } = useAdminPortfolio();
	const del = useDeletePortfolioItem();
	if (isChild) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: "أعمالنا",
				description: "إدارة مشاريع Portfolio.",
				actionTo: "/admin/portfolio/$id",
				actionParams: { id: "new" },
				actionLabel: "مشروع جديد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: isFetching }),
			!isFetching && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
				message: "لا توجد مشاريع.",
				actionTo: "/admin/portfolio/$id",
				actionParams: { id: "new" },
				actionLabel: "إضافة مشروع"
			}),
			data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "العنوان" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "التصنيف" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الحالة" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-28" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: p.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm text-muted-foreground",
						children: p.category
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, { status: p.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/portfolio/$id",
							params: { id: p.id },
							className: "grid h-8 w-8 place-items-center rounded-md hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => confirm("حذف؟") && del.mutate(p.id),
							className: "grid h-8 w-8 place-items-center rounded-md hover:bg-destructive/10 text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})]
					}) })
				] }, p.id)) })] })
			})
		]
	});
}
//#endregion
export { AdminPortfolioList as component };
