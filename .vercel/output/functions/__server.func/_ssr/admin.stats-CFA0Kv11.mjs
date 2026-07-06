import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Pencil, s as Trash2 } from "../_libs/lucide-react.mjs";
import { k as useDeleteSiteStat, x as useAdminSiteStats } from "./use-admin-cms-igTQWEoU.mjs";
import { d as useAdminChildRoute, l as AdminStatusBadge, n as AdminEmpty, o as AdminPageHeader, r as AdminFetchingBar } from "./AdminUi-CmDBDlY3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.stats-CFA0Kv11.js
var import_jsx_runtime = require_jsx_runtime();
function AdminStatsList() {
	const isChild = useAdminChildRoute("/admin/stats/$id");
	const { data = [], isFetching } = useAdminSiteStats();
	const del = useDeleteSiteStat();
	if (isChild) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: "الإحصائيات",
				description: "أرقام قسم الإحصائيات في الصفحة الرئيسية.",
				actionTo: "/admin/stats/$id",
				actionParams: { id: "new" },
				actionLabel: "إحصائية جديدة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: isFetching }),
			!isFetching && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
				message: "لا توجد إحصائيات.",
				actionTo: "/admin/stats/$id",
				actionParams: { id: "new" },
				actionLabel: "إحصائية جديدة"
			}),
			data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الرقم" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الوصف" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الترتيب" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الحالة" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-28" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-bold text-primary",
						children: s.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: s.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s.order }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, { status: s.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/stats/$id",
							params: { id: s.id },
							className: "grid h-8 w-8 place-items-center rounded-md hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => confirm("حذف؟") && del.mutate(s.id),
							className: "grid h-8 w-8 place-items-center rounded-md hover:bg-destructive/10 text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})]
					}) })
				] }, s.id)) })] })
			})
		]
	});
}
//#endregion
export { AdminStatsList as component };
