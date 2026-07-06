import { o as __toESM } from "../_runtime.mjs";
import { r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as commaToArray, c as slugify, s as nowIso, t as arrayToComma } from "./use-cms-fD0JcbJP.mjs";
import { j as useSaveBlogPost, o as useAdminBlogPost, w as useDeleteBlogPost } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, c as AdminSeoSection, i as AdminField, o as AdminPageHeader, r as AdminFetchingBar, s as AdminPublishSelect, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DgKFY-7o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.blog._id-DExNNUGr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = () => ({
	slug: "",
	title: "",
	excerpt: "",
	content: "<p></p>",
	category: "تصميم",
	tags: [],
	author: SITE_NAME,
	readTime: 5,
	views: 0,
	trending: false,
	status: "draft",
	metaTitle: "",
	metaDescription: "",
	createdAt: nowIso(),
	updatedAt: nowIso()
});
function AdminBlogEdit() {
	const { id } = useParams({ from: "/admin/blog/$id" });
	const isNew = id === "new";
	const navigate = useNavigate();
	const { data, isFetching } = useAdminBlogPost(id, !isNew);
	const save = useSaveBlogPost();
	const remove = useDeleteBlogPost();
	const [form, setForm] = (0, import_react.useState)(empty());
	const [tagsText, setTagsText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (data) {
			setForm({ ...data });
			setTagsText(arrayToComma(data.tags));
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
		const slug = form.slug?.trim() || slugify(form.title) || `post-${Date.now()}`;
		const docId = isNew ? slug : id;
		await save.mutateAsync({
			id: docId,
			data: {
				...form,
				slug,
				tags: commaToArray(tagsText),
				updatedAt: nowIso(),
				publishedAt: form.status === "published" ? form.publishedAt ?? nowIso() : form.publishedAt
			}
		});
		navigate({
			to: isNew ? "/admin/blog" : "/admin/blog/$id",
			...isNew ? {} : { params: { id: docId } }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: !isNew && isFetching && !data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: isNew ? "مقال جديد" : "تعديل مقال",
				backTo: "/admin/blog"
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
								label: "المقتطف",
								id: "excerpt",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "excerpt",
									rows: 2,
									value: form.excerpt,
									onChange: (e) => patch({ excerpt: e.target.value }),
									className: adminInputClass()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "المحتوى (HTML)",
								id: "content",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "content",
									rows: 12,
									dir: "ltr",
									value: form.content,
									onChange: (e) => patch({ content: e.target.value }),
									className: adminInputClass("font-mono text-xs text-start")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
									label: "التصنيف",
									id: "category",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "category",
										value: form.category,
										onChange: (e) => patch({ category: e.target.value }),
										className: adminInputClass()
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
									label: "الكاتب",
									id: "author",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "author",
										value: form.author,
										onChange: (e) => patch({ author: e.target.value }),
										className: adminInputClass()
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "الوسوم (مفصولة بفاصلة)",
								id: "tags",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "tags",
									dir: "ltr",
									value: tagsText,
									onChange: (e) => setTagsText(e.target.value),
									className: adminInputClass("text-start")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
								id: "featuredImage",
								label: "صورة المقال",
								folder: "blog",
								value: form.featuredImage ?? "",
								onChange: (featuredImage) => patch({ featuredImage })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.trending,
									onChange: (e) => patch({ trending: e.target.checked })
								}), "مقال رائج"]
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
						onDelete: isNew ? void 0 : async () => {
							if (confirm("حذف؟")) {
								await remove.mutateAsync(id);
								navigate({ to: "/admin/blog" });
							}
						}
					})
				]
			})
		]
	});
}
//#endregion
export { AdminBlogEdit as component };
