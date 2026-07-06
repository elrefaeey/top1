import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { u as useAdminLeads } from "./use-admin-cms-igTQWEoU.mjs";
import { l as AdminStatusBadge, n as AdminEmpty, o as AdminPageHeader, r as AdminFetchingBar } from "./AdminUi-CmDBDlY3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.leads-Bt6mKHiK.js
var import_jsx_runtime = require_jsx_runtime();
function formatDate(iso) {
	if (!iso) return "—";
	try {
		return new Intl.DateTimeFormat("ar-EG", {
			dateStyle: "medium",
			timeStyle: "short"
		}).format(new Date(iso));
	} catch {
		return iso;
	}
}
function AdminLeadsList() {
	const { data = [], isFetching } = useAdminLeads();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: "العملاء المحتملون",
				description: "رسائل نموذج التواصل الواردة من الموقع."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: isFetching }),
			!isFetching && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, { message: "لا توجد رسائل بعد. ستظهر هنا عند إرسال نموذج التواصل." }),
			data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الاسم" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "البريد" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الرسالة" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "المصدر" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الحالة" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "التاريخ" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.map((lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: lead.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						dir: "ltr",
						className: "text-xs text-muted-foreground",
						children: lead.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm max-w-[240px] truncate",
						children: lead.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs text-muted-foreground",
						children: lead.source
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStatusBadge, { status: lead.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs text-muted-foreground whitespace-nowrap",
						children: formatDate(lead.createdAt)
					})
				] }, lead.id)) })] })
			})
		]
	});
}
//#endregion
export { AdminLeadsList as component };
