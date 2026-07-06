import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as arrayToLines, o as linesToArray, s as nowIso } from "./use-cms-fD0JcbJP.mjs";
import { D as useDeletePricingPlan, F as useSavePricingPlan, g as useAdminPricingPlan } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, i as AdminField, o as AdminPageHeader, r as AdminFetchingBar, s as AdminPublishSelect, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.pricing._id-sd7REUCN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = () => ({
	name: "",
	price: "",
	period: "/ مشروع",
	description: "",
	features: [],
	highlighted: false,
	ctaLabel: "ابدأ",
	ctaHref: "/contact",
	order: 1,
	status: "draft",
	createdAt: nowIso(),
	updatedAt: nowIso()
});
function AdminPricingEdit() {
	const { id } = useParams({ from: "/admin/pricing/$id" });
	const isNew = id === "new";
	const navigate = useNavigate();
	const { data, isFetching } = useAdminPricingPlan(id, !isNew);
	const save = useSavePricingPlan();
	const remove = useDeletePricingPlan();
	const [form, setForm] = (0, import_react.useState)(empty());
	const [featuresText, setFeaturesText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (data) {
			setForm({ ...data });
			setFeaturesText(arrayToLines(data.features));
		}
	}, [data]);
	const patch = (p) => setForm((f) => ({
		...f,
		...p
	}));
	async function handleSubmit(e) {
		e.preventDefault();
		const docId = isNew ? form.name.toLowerCase().replace(/\s+/g, "-") || "plan" : id;
		await save.mutateAsync({
			id: docId,
			data: {
				...form,
				features: linesToArray(featuresText),
				updatedAt: nowIso()
			}
		});
		navigate({
			to: isNew ? "/admin/pricing" : "/admin/pricing/$id",
			...isNew ? {} : { params: { id: docId } }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: !isNew && isFetching && !data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: isNew ? "باقة جديدة" : "تعديل باقة",
				backTo: "/admin/pricing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الاسم",
							id: "name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "name",
								required: true,
								value: form.name,
								onChange: (e) => patch({ name: e.target.value }),
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "السعر",
								id: "price",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "price",
									value: form.price,
									onChange: (e) => patch({ price: e.target.value }),
									className: adminInputClass()
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "الفترة",
								id: "period",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "period",
									value: form.period,
									onChange: (e) => patch({ period: e.target.value }),
									className: adminInputClass()
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الوصف",
							id: "description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "description",
								rows: 2,
								value: form.description,
								onChange: (e) => patch({ description: e.target.value }),
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الميزات (سطر لكل ميزة)",
							id: "features",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "features",
								rows: 5,
								value: featuresText,
								onChange: (e) => setFeaturesText(e.target.value),
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "نص الزر",
								id: "ctaLabel",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "ctaLabel",
									value: form.ctaLabel,
									onChange: (e) => patch({ ctaLabel: e.target.value }),
									className: adminInputClass()
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "رابط الزر",
								id: "ctaHref",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "ctaHref",
									dir: "ltr",
									value: form.ctaHref,
									onChange: (e) => patch({ ctaHref: e.target.value }),
									className: adminInputClass("text-start")
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.highlighted,
								onChange: (e) => patch({ highlighted: e.target.checked })
							}), " الأكثر شيوعاً"]
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
							navigate({ to: "/admin/pricing" });
						}
					}
				})]
			})
		]
	});
}
//#endregion
export { AdminPricingEdit as component };
