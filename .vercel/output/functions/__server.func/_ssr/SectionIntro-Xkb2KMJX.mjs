import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SectionIntro-Xkb2KMJX.js
var import_jsx_runtime = require_jsx_runtime();
/** عنوان صفحة داخلية — hero-bg مضغوط */
function PageIntro({ eyebrow, title, desc, centered = true, as: Tag = "h1", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("page-intro hero-bg", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("container-page page-intro-inner", centered && "page-intro-center page-intro-block"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "page-intro-eyebrow",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					className: "page-intro-title",
					children: title
				}),
				desc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "page-intro-desc",
					children: desc
				})
			]
		})
	});
}
/** عنوان قسم في الصفحة الرئيسية — نفس المقاسات */
function SectionIntro({ eyebrow, title, desc, centered, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("section-intro-row", action && "section-intro-row--action"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("page-intro-block", centered && "page-intro-center"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "page-intro-eyebrow",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "page-intro-title page-intro-title--section",
					children: title
				}),
				desc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "page-intro-desc",
					children: desc
				})
			]
		}), action]
	});
}
//#endregion
export { SectionIntro as n, PageIntro as t };
