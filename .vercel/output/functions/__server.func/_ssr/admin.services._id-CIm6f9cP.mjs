import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as slugify, n as arrayToLines, o as linesToArray, s as nowIso } from "./use-cms-fD0JcbJP.mjs";
import { I as useSaveService, O as useDeleteService, _ as useAdminService } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, c as AdminSeoSection, i as AdminField, o as AdminPageHeader, r as AdminFetchingBar, s as AdminPublishSelect, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DgKFY-7o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.services._id-CIm6f9cP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyService = () => ({
	slug: "",
	title: "",
	tagline: "",
	shortDescription: "",
	description: "",
	icon: "Globe",
	features: [],
	deliverables: [],
	order: 1,
	status: "draft",
	metaTitle: "",
	metaDescription: "",
	createdAt: nowIso(),
	updatedAt: nowIso()
});
function AdminServiceEdit() {
	const { id } = useParams({ from: "/admin/services/$id" });
	const isNew = id === "new";
	const navigate = useNavigate();
	const { data, isFetching } = useAdminService(id, !isNew);
	const save = useSaveService();
	const remove = useDeleteService();
	const [form, setForm] = (0, import_react.useState)(emptyService());
	const [featuresText, setFeaturesText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (data) {
			setForm({ ...data });
			setFeaturesText(arrayToLines(data.features));
		}
	}, [data]);
	function patch(p) {
		setForm((f) => ({
			...f,
			...p
		}));
	}
	async function handleSubmit(e) {
		e.preventDefault();
		const docId = isNew ? form.slug || slugify(form.title) : id;
		if (!docId) return;
		const payload = {
			...form,
			slug: form.slug || slugify(form.title),
			features: linesToArray(featuresText),
			updatedAt: nowIso(),
			publishedAt: form.status === "published" ? form.publishedAt ?? nowIso() : form.publishedAt
		};
		await save.mutateAsync({
			id: docId,
			data: payload
		});
		navigate({
			to: isNew ? "/admin/services" : "/admin/services/$id",
			...isNew ? {} : { params: { id: docId } }
		});
	}
	async function handleDelete() {
		if (isNew || !confirm("حذف هذه الخدمة؟")) return;
		await remove.mutateAsync(id);
		navigate({ to: "/admin/services" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: !isNew && isFetching && !data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: isNew ? "خدمة جديدة" : "تعديل خدمة",
				backTo: "/admin/services"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "العنوان",
								id: "title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "title",
									required: true,
									value: form.title,
									onChange: (e) => {
										const title = e.target.value;
										patch({
											title,
											slug: isNew ? slugify(title) : form.slug
										});
									},
									className: adminInputClass()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Slug",
								id: "slug",
								hint: "يُستخدم في الرابط",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "slug",
									dir: "ltr",
									required: true,
									value: form.slug,
									onChange: (e) => patch({ slug: e.target.value }),
									className: adminInputClass("text-start")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "الوصف المختصر",
								id: "shortDescription",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "shortDescription",
									rows: 2,
									value: form.shortDescription,
									onChange: (e) => patch({ shortDescription: e.target.value }),
									className: adminInputClass()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "الوصف الكامل",
								id: "description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "description",
									rows: 5,
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
									rows: 4,
									value: featuresText,
									onChange: (e) => setFeaturesText(e.target.value),
									className: adminInputClass()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
								id: "imageUrl",
								label: "صورة الخدمة",
								folder: "services",
								value: form.imageUrl ?? "",
								onChange: (imageUrl) => patch({ imageUrl })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
									label: "الأيقونة",
									id: "icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "icon",
										dir: "ltr",
										value: form.icon,
										onChange: (e) => patch({ icon: e.target.value }),
										className: adminInputClass("text-start"),
										placeholder: "Globe, Code2, Search…"
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSeoSection, {
						slug: form.slug,
						metaTitle: form.metaTitle,
						metaDescription: form.metaDescription,
						onSlug: (slug) => patch({ slug }),
						onMetaTitle: (metaTitle) => patch({ metaTitle }),
						onMetaDescription: (metaDescription) => patch({ metaDescription })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFormActions, {
						saving: save.isPending,
						onDelete: isNew ? void 0 : handleDelete
					})
				]
			})
		]
	});
}
//#endregion
export { AdminServiceEdit as component };
