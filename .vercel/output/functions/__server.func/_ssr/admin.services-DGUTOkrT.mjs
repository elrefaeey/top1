import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Pencil, s as Trash2 } from "../_libs/lucide-react.mjs";
import { O as useDeleteService, v as useAdminServices } from "./use-admin-cms-igTQWEoU.mjs";
import { d as useAdminChildRoute, l as AdminStatusBadge, n as AdminEmpty, o as AdminPageHeader, r as AdminFetchingBar } from "./AdminUi-CmDBDlY3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.services-DGUTOkrT.js
var import_jsx_runtime = require_jsx_runtime();
function AdminServicesList() {
	const isChild = useAdminChildRoute("/admin/services/$id");
	const { data = [], isFetching } = useAdminServices();
	const deleteService = useDeleteService();
	if (isChild) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	async function handleDelete(id, title) {
		if (!confirm(`حذف الخدمة "${title}"؟`)) return;
		await deleteService.mutateAsync(id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: "الخدمات",
				description: "إدارة خدمات الموقع وترتيبها.",
				actionTo: "/admin/services/$id",
				actionParams: { id: "new" },
				actionLabel: "خدمة جديدة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: isFetching }),
			!isFetching && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
				message: "لا توجد خدمات بعد.",
				actionTo: "/admin/services/$id",
				actionParams: { id: "new" },
				actionLabel: "إضافة خدمة"
			}),
			data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "العنوان" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Slug" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الحالة" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-24",
						children: "ترتيب"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-28" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: s.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						dir: "ltr",
						className: "text-muted-foreground text-xs",
						children: s.slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, { status: s.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s.order }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/services/$id",
							params: { id: s.id },
							className: "grid h-8 w-8 place-items-center rounded-md hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleDelete(s.id, s.title),
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
export { AdminServicesList as component };
