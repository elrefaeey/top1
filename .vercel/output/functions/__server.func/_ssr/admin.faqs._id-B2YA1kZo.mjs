import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as nowIso } from "./use-cms-fD0JcbJP.mjs";
import { M as useSaveFaq, T as useDeleteFaq, c as useAdminFaq } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, i as AdminField, o as AdminPageHeader, r as AdminFetchingBar, s as AdminPublishSelect, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.faqs._id-B2YA1kZo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = () => ({
	question: "",
	answer: "",
	order: 1,
	status: "draft",
	createdAt: nowIso(),
	updatedAt: nowIso()
});
function AdminFaqEdit() {
	const { id } = useParams({ from: "/admin/faqs/$id" });
	const isNew = id === "new";
	const navigate = useNavigate();
	const { data, isFetching } = useAdminFaq(id, !isNew);
	const save = useSaveFaq();
	const remove = useDeleteFaq();
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
		const docId = isNew ? `faq-${Date.now()}` : id;
		await save.mutateAsync({
			id: docId,
			data: {
				...form,
				updatedAt: nowIso()
			}
		});
		navigate({
			to: isNew ? "/admin/faqs" : "/admin/faqs/$id",
			...isNew ? {} : { params: { id: docId } }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: !isNew && isFetching && !data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: isNew ? "سؤال جديد" : "تعديل سؤال",
				backTo: "/admin/faqs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "السؤال",
							id: "question",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "question",
								required: true,
								value: form.question,
								onChange: (e) => patch({ question: e.target.value }),
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الإجابة",
							id: "answer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "answer",
								rows: 5,
								required: true,
								value: form.answer,
								onChange: (e) => patch({ answer: e.target.value }),
								className: adminInputClass()
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
							navigate({ to: "/admin/faqs" });
						}
					}
				})]
			})
		]
	});
}
//#endregion
export { AdminFaqEdit as component };
