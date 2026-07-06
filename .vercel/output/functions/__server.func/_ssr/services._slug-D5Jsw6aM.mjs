import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteImage } from "./SiteImage-H4I9drPU.mjs";
import { g as Link, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as Check, X as ArrowLeft, Z as Sparkles } from "../_libs/lucide-react.mjs";
import { m as useService } from "./use-cms-fD0JcbJP.mjs";
import { t as getServiceIcon } from "./icons-C3jPTdr6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services._slug-D5Jsw6aM.js
var import_jsx_runtime = require_jsx_runtime();
function ServiceDetail() {
	const { slug } = useParams({ from: "/services/$slug" });
	const { data: s, isLoading } = useService(slug);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-24 text-center text-muted-foreground text-sm",
		children: "جاري تحميل الخدمة…"
	});
	if (!s) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold",
			children: "الخدمة غير موجودة"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/services",
			className: "mt-6 inline-flex btn-primary",
			children: "كل الخدمات"
		})]
	});
	const Icon = getServiceIcon(s.icon);
	const deliverables = s.deliverables ?? s.features;
	const process = s.process ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "hero-bg relative overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page relative pb-16 pt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid items-center gap-10 lg:grid-cols-2",
					children: [s.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
						src: s.imageUrl,
						alt: s.title,
						wrapperClassName: "order-1 lg:order-2 aspect-[16/10] w-full max-w-xl mx-auto rounded-2xl shadow-[var(--shadow-card-hover)]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "order-2 lg:order-1 max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/services",
								className: "text-sm text-muted-foreground hover:text-primary",
								children: "← كل الخدمات"
							}),
							s.tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-6 eyebrow inline-flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }),
									" ",
									s.tagline
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-[1.2]",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-lg text-muted-foreground",
								children: s.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 flex gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/contact",
									className: "btn-primary",
									children: ["ابدأ مشروعك ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 rtl-flip" })]
								})
							})
						]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page grid gap-10 md:grid-cols-[1fr_1.4fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-12 w-12 place-items-center rounded-xl bg-[var(--gradient-primary)] text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-5 text-2xl md:text-3xl font-bold tracking-tight",
					children: "ما ستحصل عليه"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid sm:grid-cols-2 gap-3",
					children: deliverables.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2 surface-card px-4 py-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 mt-0.5 text-primary shrink-0" }),
							" ",
							d
						]
					}, d))
				})]
			})
		}),
		process.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section bg-surface border-y border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl md:text-3xl font-bold tracking-tight",
					children: "كيف ننفّذ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-5 md:grid-cols-4",
					children: process.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-bold text-gradient",
								children: String(i + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 font-semibold",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: p.description
							})
						]
					}, p.title))
				})]
			})
		})
	] });
}
//#endregion
export { ServiceDetail as component };
