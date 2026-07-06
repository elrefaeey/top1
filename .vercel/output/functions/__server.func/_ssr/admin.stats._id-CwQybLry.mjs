import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as nowIso } from "./use-cms-fD0JcbJP.mjs";
import { R as useSaveSiteStat, b as useAdminSiteStat, k as useDeleteSiteStat, r as formatAdminFirestoreError } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, i as AdminField, o as AdminPageHeader, r as AdminFetchingBar, s as AdminPublishSelect, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
import { t as STAT_ICON_OPTIONS } from "./stat-icons-Ucn6HYIe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.stats._id-CwQybLry.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = () => ({
	value: "",
	label: "",
	icon: "BarChart3",
	order: 1,
	status: "draft",
	createdAt: nowIso(),
	updatedAt: nowIso()
});
function AdminStatEdit() {
	const { id } = useParams({ from: "/admin/stats/$id" });
	const isNew = id === "new";
	const navigate = useNavigate();
	const { data, isFetching } = useAdminSiteStat(id, !isNew);
	const save = useSaveSiteStat();
	const remove = useDeleteSiteStat();
	const [form, setForm] = (0, import_react.useState)(empty());
	const [saveError, setSaveError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (data) setForm({ ...data });
	}, [data]);
	const patch = (p) => setForm((f) => ({
		...f,
		...p
	}));
	async function handleSubmit(e) {
		e.preventDefault();
		setSaveError("");
		const docId = isNew ? `stat-${Date.now()}` : id;
		try {
			await save.mutateAsync({
				id: docId,
				data: {
					...form,
					updatedAt: nowIso()
				}
			});
			navigate({
				to: isNew ? "/admin/stats" : "/admin/stats/$id",
				...isNew ? {} : { params: { id: docId } }
			});
		} catch (err) {
			setSaveError(formatAdminFirestoreError(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: !isNew && isFetching && !data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: isNew ? "إحصائية جديدة" : "تعديل إحصائية",
				backTo: "/admin/stats"
			}),
			saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
				children: saveError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الرقم / القيمة",
							id: "value",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "value",
								required: true,
								dir: "ltr",
								value: form.value,
								onChange: (e) => patch({ value: e.target.value }),
								className: adminInputClass("text-start"),
								placeholder: "120+ أو 98% أو 4.2×"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الوصف",
							id: "label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "label",
								required: true,
								value: form.label,
								onChange: (e) => patch({ label: e.target.value }),
								className: adminInputClass(),
								placeholder: "مشروع منجز"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الأيقونة",
							id: "icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "icon",
								value: form.icon,
								onChange: (e) => patch({ icon: e.target.value }),
								className: adminInputClass(),
								children: STAT_ICON_OPTIONS.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: name,
									children: name
								}, name))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الترتيب",
							id: "order",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "order",
								type: "number",
								value: form.order,
								onChange: (e) => patch({ order: Number(e.target.value) }),
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPublishSelect, {
							value: form.status,
							onChange: (status) => patch({ status })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFormActions, {
					saving: save.isPending,
					onDelete: isNew ? void 0 : async () => {
						if (confirm("حذف؟")) {
							await remove.mutateAsync(id);
							navigate({ to: "/admin/stats" });
						}
					}
				})]
			})
		]
	});
}
//#endregion
export { AdminStatEdit as component };
