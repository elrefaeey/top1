import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as commaToArray, c as slugify, s as nowIso, t as arrayToComma } from "./use-cms-fD0JcbJP.mjs";
import { E as useDeletePortfolioItem, P as useSavePortfolioItem, m as useAdminPortfolioItem } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, c as AdminSeoSection, i as AdminField, o as AdminPageHeader, r as AdminFetchingBar, s as AdminPublishSelect, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DgKFY-7o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.portfolio._id-CYJ_j9QR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = () => ({
	slug: "",
	title: "",
	category: "تصميم مواقع",
	description: "",
	imageUrl: "",
	tags: [],
	order: 1,
	status: "draft",
	metaTitle: "",
	metaDescription: "",
	createdAt: nowIso(),
	updatedAt: nowIso()
});
function AdminPortfolioEdit() {
	const { id } = useParams({ from: "/admin/portfolio/$id" });
	const isNew = id === "new";
	const navigate = useNavigate();
	const { data, isFetching } = useAdminPortfolioItem(id, !isNew);
	const save = useSavePortfolioItem();
	const remove = useDeletePortfolioItem();
	const [form, setForm] = (0, import_react.useState)(empty());
	const [tagsText, setTagsText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (data) {
			setForm({ ...data });
			setTagsText(arrayToComma(data.tags));
		}
	}, [data]);
	const patch = (p) => setForm((f) => ({
		...f,
		...p
	}));
	async function handleSubmit(e) {
		e.preventDefault();
		const docId = isNew ? form.slug || slugify(form.title) : id;
		await save.mutateAsync({
			id: docId,
			data: {
				...form,
				slug: form.slug || slugify(form.title),
				tags: commaToArray(tagsText),
				updatedAt: nowIso()
			}
		});
		navigate({
			to: isNew ? "/admin/portfolio" : "/admin/portfolio/$id",
			...isNew ? {} : { params: { id: docId } }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: !isNew && isFetching && !data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: isNew ? "مشروع جديد" : "تعديل مشروع",
				backTo: "/admin/portfolio"
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
									onChange: (e) => patch({
										title: e.target.value,
										slug: isNew ? slugify(e.target.value) : form.slug
									}),
									className: adminInputClass()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "Slug",
								id: "slug",
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
								label: "التصنيف",
								id: "category",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "category",
									value: form.category,
									onChange: (e) => patch({ category: e.target.value }),
									className: adminInputClass()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "الوصف",
								id: "description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "description",
									rows: 4,
									value: form.description,
									onChange: (e) => patch({ description: e.target.value }),
									className: adminInputClass()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
								id: "imageUrl",
								folder: "portfolio",
								value: form.imageUrl,
								onChange: (imageUrl) => patch({ imageUrl }),
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "الوسوم",
								id: "tags",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "tags",
									dir: "ltr",
									value: tagsText,
									onChange: (e) => setTagsText(e.target.value),
									className: adminInputClass("text-start")
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSeoSection, {
						slug: form.slug,
						metaTitle: form.metaTitle,
						metaDescription: form.metaDescription,
						onSlug: (slug) => patch({ slug }),
						onMetaTitle: (v) => patch({ metaTitle: v }),
						onMetaDescription: (v) => patch({ metaDescription: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFormActions, {
						saving: save.isPending,
						onDelete: isNew ? void 0 : async () => {
							if (confirm("حذف؟")) {
								await remove.mutateAsync(id);
								navigate({ to: "/admin/portfolio" });
							}
						}
					})
				]
			})
		]
	});
}
//#endregion
export { AdminPortfolioEdit as component };
