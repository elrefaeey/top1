import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteImage-H4I9drPU.js
var import_jsx_runtime = require_jsx_runtime();
function SiteImage({ className, wrapperClassName, overlay, alt, loading = "lazy", decoding = "async", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden bg-muted max-w-full", wrapperClassName),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			alt,
			loading,
			decoding,
			className: cn("h-full w-full max-w-full object-cover", className),
			...props
		}), overlay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent"
		})]
	});
}
//#endregion
export { SiteImage as t };
