import { n as serviceImage } from "./site-images-D0ev85AD.mjs";
import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteImage } from "./SiteImage-H4I9drPU.mjs";
import { b as useMatch, f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as Check, X as ArrowLeft } from "../_libs/lucide-react.mjs";
import { h as useServices } from "./use-cms-fD0JcbJP.mjs";
import { t as PageIntro } from "./SectionIntro-Xkb2KMJX.mjs";
import { t as getServiceIcon } from "./icons-C3jPTdr6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-BqArNSrd.js
var import_jsx_runtime = require_jsx_runtime();
function Services() {
	const isDetail = useMatch({
		from: "/services/$slug",
		shouldThrow: false
	});
	const { data: services = [], isLoading } = useServices();
	if (isDetail) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		eyebrow: "الخدمات",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["كل ما تحتاجه ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-gradient",
			children: "للإطلاق والنمو."
		})] }),
		desc: "فريق محترف واحد. مسؤولية كاملة. من أول sketch لآخر dashboard تحليلات."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section pt-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page space-y-5",
			children: [
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-12 text-muted-foreground text-sm",
					children: "جاري تحميل الخدمات…"
				}),
				!isLoading && services.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center py-16 text-muted-foreground surface-card",
					children: "لا توجد خدمات منشورة بعد. ستظهر هنا عند إضافتها من لوحة التحكم."
				}),
				services.map((s, idx) => {
					const Icon = getServiceIcon(s.icon);
					const flip = idx % 2 === 1;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "service-card surface-card overflow-hidden grid gap-0 lg:grid-cols-2 lg:items-stretch transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `service-card-body ${flip ? "lg:order-2" : "lg:order-1"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "service-card-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground font-medium",
									children: ["خدمة ", String(idx + 1).padStart(2, "0")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1.5 text-xl md:text-2xl font-bold tracking-tight leading-snug",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2",
									children: s.shortDescription
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "service-features mt-4 grid gap-3",
									children: s.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "service-feature",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0",
											children: f
										})]
									}, f))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/services/$slug",
									params: { slug: s.slug },
									className: "mt-4 inline-flex btn-ghost w-fit text-sm py-2",
									children: ["اعرف المزيد ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5 rtl-flip" })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `service-card-media-wrap ${flip ? "lg:order-1" : "lg:order-2"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
								src: s.imageUrl || serviceImage(s.slug),
								alt: s.title,
								wrapperClassName: "service-card-media h-full w-full",
								className: "object-cover object-center"
							})
						})]
					}, s.slug);
				})
			]
		})
	})] });
}
//#endregion
export { Services as component };
