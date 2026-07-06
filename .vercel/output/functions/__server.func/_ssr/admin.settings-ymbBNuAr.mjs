import { o as __toESM } from "../_runtime.mjs";
import { n as SITE_LOGO_URL, r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { r as siteImages } from "./site-images-D0ev85AD.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { L as useSaveSiteSettings, r as formatAdminFirestoreError, y as useAdminSiteSettings } from "./use-admin-cms-igTQWEoU.mjs";
import { a as AdminFormActions, i as AdminField, o as AdminPageHeader, r as AdminFetchingBar, t as AdminCard, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DgKFY-7o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-ymbBNuAr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var defaults = {
	siteName: SITE_NAME,
	tagline: "",
	logoUrl: SITE_LOGO_URL,
	faviconUrl: SITE_LOGO_URL,
	contactEmail: "",
	contactPhone: "",
	whatsappNumber: "",
	address: "",
	socialLinks: {},
	integrations: {},
	robotsTxt: "",
	headerNav: [],
	footerNav: []
};
function AdminSettingsPage() {
	const { data, isFetching } = useAdminSiteSettings();
	const save = useSaveSiteSettings();
	const [form, setForm] = (0, import_react.useState)(defaults);
	const [saveError, setSaveError] = (0, import_react.useState)("");
	const [saveOk, setSaveOk] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (data) setForm({
			...defaults,
			...data
		});
	}, [data]);
	const patch = (p) => {
		setSaveOk(false);
		setForm((f) => ({
			...f,
			...p
		}));
	};
	async function handleSubmit(e) {
		e.preventDefault();
		setSaveError("");
		setSaveOk(false);
		try {
			await save.mutateAsync(form);
			setSaveOk(true);
		} catch (err) {
			setSaveError(formatAdminFirestoreError(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFetchingBar, { show: isFetching && !data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: "إعدادات الموقع",
				description: "الاسم، التواصل، وروابط التواصل الاجتماعي."
			}),
			saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
				children: saveError
			}),
			saveOk && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800",
				children: "تم حفظ الإعدادات بنجاح."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminCard, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "اسم الموقع",
							id: "siteName",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "siteName",
								value: form.siteName,
								onChange: (e) => patch({ siteName: e.target.value }),
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الشعار (Tagline)",
							id: "tagline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "tagline",
								value: form.tagline,
								onChange: (e) => patch({ tagline: e.target.value }),
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
							id: "logoUrl",
							label: "لوجو الموقع",
							folder: "site",
							value: form.logoUrl ?? "/logo.jpeg",
							onChange: (logoUrl) => patch({
								logoUrl,
								faviconUrl: logoUrl
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
							id: "heroImageUrl",
							label: "صورة الصفحة الرئيسية (Hero)",
							folder: "hero",
							value: form.heroImageUrl ?? siteImages.hero.main,
							onChange: (heroImageUrl) => patch({ heroImageUrl })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "وصف الصورة (Alt)",
							id: "heroImageAlt",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "heroImageAlt",
								value: form.heroImageAlt ?? "",
								onChange: (e) => patch({ heroImageAlt: e.target.value }),
								placeholder: siteImages.hero.mainAlt,
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "البريد",
							id: "contactEmail",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "contactEmail",
								dir: "ltr",
								type: "email",
								value: form.contactEmail,
								onChange: (e) => patch({ contactEmail: e.target.value }),
								className: adminInputClass("text-start")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "الهاتف",
							id: "contactPhone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "contactPhone",
								dir: "ltr",
								value: form.contactPhone,
								onChange: (e) => patch({ contactPhone: e.target.value }),
								className: adminInputClass("text-start")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "WhatsApp (بدون +)",
							id: "whatsapp",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "whatsapp",
								dir: "ltr",
								value: form.whatsappNumber,
								onChange: (e) => patch({ whatsappNumber: e.target.value }),
								className: adminInputClass("text-start")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "العنوان",
							id: "address",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "address",
								value: form.address,
								onChange: (e) => patch({ address: e.target.value }),
								className: adminInputClass()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
							label: "Google Analytics ID",
							id: "ga",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "ga",
								dir: "ltr",
								value: form.integrations.googleAnalyticsId ?? "",
								onChange: (e) => patch({ integrations: {
									...form.integrations,
									googleAnalyticsId: e.target.value
								} }),
								className: adminInputClass("text-start")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
									label: "Facebook",
									id: "facebook",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "facebook",
										dir: "ltr",
										value: form.socialLinks.facebook ?? "",
										onChange: (e) => patch({ socialLinks: {
											...form.socialLinks,
											facebook: e.target.value
										} }),
										className: adminInputClass("text-start")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
									label: "Instagram",
									id: "instagram",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "instagram",
										dir: "ltr",
										value: form.socialLinks.instagram ?? "",
										onChange: (e) => patch({ socialLinks: {
											...form.socialLinks,
											instagram: e.target.value
										} }),
										className: adminInputClass("text-start")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
									label: "Twitter / X",
									id: "twitter",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "twitter",
										dir: "ltr",
										value: form.socialLinks.twitter ?? "",
										onChange: (e) => patch({ socialLinks: {
											...form.socialLinks,
											twitter: e.target.value
										} }),
										className: adminInputClass("text-start")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
									label: "LinkedIn",
									id: "linkedin",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "linkedin",
										dir: "ltr",
										value: form.socialLinks.linkedin ?? "",
										onChange: (e) => patch({ socialLinks: {
											...form.socialLinks,
											linkedin: e.target.value
										} }),
										className: adminInputClass("text-start")
									})
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFormActions, { saving: save.isPending })]
			})
		]
	});
}
//#endregion
export { AdminSettingsPage as component };
