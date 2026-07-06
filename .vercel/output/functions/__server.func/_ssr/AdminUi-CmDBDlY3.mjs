import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as useMatch, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Y as ArrowRight, h as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminUi-CmDBDlY3.js
var import_jsx_runtime = require_jsx_runtime();
function AdminPageHeader({ title, description, backTo, backLabel = "رجوع", actionTo, actionParams, actionLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-start justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			backTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: backTo,
				className: "mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 rtl-flip" }),
					" ",
					backLabel
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: description
			})
		] }), actionTo && actionLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: actionTo,
			params: actionParams,
			className: "btn-primary !py-2.5 !px-4 !text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
				" ",
				actionLabel
			]
		})]
	});
}
/** إذا كان مسار $id نشطاً يعرض النموذج فقط */
function useAdminChildRoute(from) {
	return useMatch({
		from,
		shouldThrow: false
	});
}
function AdminStatusBadge({ status }) {
	const map = {
		published: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
		draft: "bg-amber-500/10 text-amber-700 border-amber-500/20",
		scheduled: "bg-blue-500/10 text-blue-700 border-blue-500/20",
		new: "bg-primary/10 text-primary border-primary/20",
		contacted: "bg-amber-500/10 text-amber-700 border-amber-500/20",
		closed: "bg-muted text-muted-foreground border-border"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium", map[status] ?? map.draft),
		children: {
			published: "منشور",
			draft: "مسودة",
			scheduled: "مجدول",
			new: "جديد",
			contacted: "تم التواصل",
			closed: "مغلق"
		}[status] ?? status
	});
}
function AdminField({ label, id, children, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			htmlFor: id,
			className: "text-sm font-medium",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1.5",
			children
		}),
		hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: hint
		})
	] });
}
function adminInputClass(extra = "") {
	return cn("w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30", extra);
}
function AdminCard({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("surface-card p-5 md:p-6", className),
		children
	});
}
/** شريط تحميل خفيف — لا يحجب الصفحة */
function AdminFetchingBar({ show }) {
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4 h-0.5 overflow-hidden rounded-full bg-primary/15",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-1/3 animate-pulse rounded-full bg-primary" })
	});
}
function AdminEmpty({ message, actionTo, actionParams, actionLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-10 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm",
			children: message
		}), actionTo && actionLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: actionTo,
			params: actionParams,
			className: "btn-primary mt-4 inline-flex !text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
				" ",
				actionLabel
			]
		})]
	});
}
function AdminFormActions({ saving, onDelete, deleteLabel = "حذف" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-3 pt-4 border-t border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "submit",
			disabled: saving,
			className: "btn-primary disabled:opacity-60",
			children: saving ? "جاري الحفظ…" : "حفظ"
		}), onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onDelete,
			className: "btn-ghost !text-destructive hover:!border-destructive/30",
			children: deleteLabel
		})]
	});
}
function AdminSeoSection({ metaTitle, metaDescription, slug, onMetaTitle, onMetaDescription, onSlug, showSlug = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "SEO"
			}),
			showSlug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
				label: "Slug",
				id: "slug",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "slug",
					dir: "ltr",
					value: slug,
					onChange: (e) => onSlug(e.target.value),
					className: adminInputClass("text-start")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
				label: "Meta Title",
				id: "metaTitle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "metaTitle",
					value: metaTitle,
					onChange: (e) => onMetaTitle(e.target.value),
					className: adminInputClass()
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
				label: "Meta Description",
				id: "metaDescription",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "metaDescription",
					rows: 3,
					value: metaDescription,
					onChange: (e) => onMetaDescription(e.target.value),
					className: adminInputClass()
				})
			})
		]
	});
}
function AdminPublishSelect({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
		label: "الحالة",
		id: "status",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			id: "status",
			value,
			onChange: (e) => onChange(e.target.value),
			className: adminInputClass(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "published",
					children: "منشور"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "draft",
					children: "مسودة"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "scheduled",
					children: "مجدول"
				})
			]
		})
	});
}
//#endregion
export { AdminFormActions as a, AdminSeoSection as c, useAdminChildRoute as d, AdminField as i, AdminStatusBadge as l, AdminEmpty as n, AdminPageHeader as o, AdminFetchingBar as r, AdminPublishSelect as s, AdminCard as t, adminInputClass as u };
