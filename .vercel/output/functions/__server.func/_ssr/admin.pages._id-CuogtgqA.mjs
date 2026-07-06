import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as nowIso } from "./use-cms-fD0JcbJP.mjs";
import { N as useSavePage, d as useAdminPage } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, c as AdminSeoSection, i as AdminField, o as AdminPageHeader, r as AdminFetchingBar, s as AdminPublishSelect, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.pages._id-CuogtgqA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_TITLES = {
	home: "الرئيسية",
	about: "من نحن",
	contact: "تواصل",
	services: "الخدمات",
	portfolio: "أعمالنا",
	blog: "المدونة"
};
var empty = (slug) => ({
	slug,
	title: PAGE_TITLES[slug] ?? "صفحة جديدة",
	status: "published",
	sections: [],
	metaTitle: "",
	metaDescription: "",
	createdAt: nowIso(),
	updatedAt: nowIso()
});
function AdminPageEdit() {
	const { id } = useParams({ from: "/admin/pages/$id" });
	const isNew = id === "new";
	const navigate = useNavigate();
	const { data, isFetching } = useAdminPage(id, !isNew);
	const save = useSavePage();
	const [form, setForm] = (0, import_react.useState)(empty(isNew ? "" : id));
	(0, import_react.useEffect)(() => {
		if (data) setForm({ ...data });
		else if (!isNew && PAGE_TITLES[id]) setForm(empty(id));
	}, [
		data,
		id,
		isNew
	]);
	const patch = (p) => setForm((f) => ({
		...f,
		...p
	}));
	async function handleSubmit(e) {
		e.preventDefault();
		const docId = isNew ? form.slug || "page" : id;
		await save.mutateAsync({
			id: docId,
			data: {
				...form,
				updatedAt: nowIso()
			}
		});
		navigate({
			to: isNew ? "/admin/pages" : "/admin/pages/$id",
			...isNew ? {} : { params: { id: docId } }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: !isNew && isFetching && !data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: `SEO — ${form.title}`,
				backTo: "/admin/pages"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
						className: "space-y-4",
						children: [
							isNew && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
								label: "العنوان",
								id: "title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "title",
									required: true,
									value: form.title,
									onChange: (e) => patch({ title: e.target.value }),
									className: adminInputClass()
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
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
							})] }),
							!isNew && PAGE_TITLES[id] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "تحرير بيانات SEO لهذه الصفحة. المحتوى الأساسي في ملفات الموقع."
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFormActions, { saving: save.isPending })
				]
			})
		]
	});
}
//#endregion
export { AdminPageEdit as component };
