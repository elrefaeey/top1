import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as nowIso } from "./use-cms-fD0JcbJP.mjs";
import { A as useDeleteTestimonial, S as useAdminTestimonial, z as useSaveTestimonial } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, i as AdminField, o as AdminPageHeader, r as AdminFetchingBar, s as AdminPublishSelect, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DgKFY-7o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.testimonials._id-D3Xr1YKJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = () => ({
	name: "",
	role: "",
	company: "",
	quote: "",
	rating: 5,
	order: 1,
	status: "draft",
	createdAt: nowIso(),
	updatedAt: nowIso()
});
function AdminTestimonialEdit() {
	const { id } = useParams({ from: "/admin/testimonials/$id" });
	const isNew = id === "new";
	const navigate = useNavigate();
	const { data, isFetching } = useAdminTestimonial(id, !isNew);
	const save = useSaveTestimonial();
	const remove = useDeleteTestimonial();
	const [form, setForm] = (0, import_react.useState)(empty());
	(0, import_react.useEffect)(() => {
		if (data) setForm({ ...data });
	}, [data]);
	const patch = (p) => setForm((f) => ({
		...f,
		...p
	}));
	async function handleSubmit(e) {
		e.preventDefault();
		const docId = isNew ? form.name.toLowerCase().replace(/\s+/g, "-") || "testimonial" : id;
		await save.mutateAsync({
			id: docId,
			data: {
				...form,
				updatedAt: nowIso()
			}
		});
		navigate({
			to: isNew ? "/admin/testimonials" : "/admin/testimonials/$id",
			...isNew ? {} : { params: { id: docId } }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: !isNew && isFetching && !data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: isNew ? "رأي جديد" : "تعديل رأي",
				backTo: "/admin/testimonials"
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
								label: "المنصب",
								id: "role",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "role",
									value: form.role,
									onChange: (e) => patch({ role: e.target.value }),
									className: adminInputClass()
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "الشركة",
								id: "company",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "company",
									value: form.company,
									onChange: (e) => patch({ company: e.target.value }),
									className: adminInputClass()
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الاقتباس",
							id: "quote",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "quote",
								rows: 4,
								required: true,
								value: form.quote,
								onChange: (e) => patch({ quote: e.target.value }),
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
							id: "avatarUrl",
							label: "صورة العميل",
							folder: "testimonials",
							value: form.avatarUrl ?? "",
							onChange: (avatarUrl) => patch({ avatarUrl })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "التقييم (1-5)",
								id: "rating",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "rating",
									type: "number",
									min: 1,
									max: 5,
									value: form.rating,
									onChange: (e) => patch({ rating: Number(e.target.value) }),
									className: adminInputClass()
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "الترتيب",
								id: "order",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "order",
									type: "number",
									value: form.order,
									onChange: (e) => patch({ order: Number(e.target.value) }),
									className: adminInputClass()
								})
							})]
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
							navigate({ to: "/admin/testimonials" });
						}
					}
				})]
			})
		]
	});
}
//#endregion
export { AdminTestimonialEdit as component };
