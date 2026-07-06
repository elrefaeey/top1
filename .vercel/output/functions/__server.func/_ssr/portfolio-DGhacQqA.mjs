import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteImage } from "./SiteImage-H4I9drPU.mjs";
import { J as ArrowUpLeft } from "../_libs/lucide-react.mjs";
import { f as usePortfolio } from "./use-cms-fD0JcbJP.mjs";
import { t as PageIntro } from "./SectionIntro-Xkb2KMJX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portfolio-DGhacQqA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Portfolio() {
	const { data: items = [] } = usePortfolio();
	const categories = (0, import_react.useMemo)(() => {
		return ["الكل", ...[...new Set(items.map((p) => p.category).filter(Boolean))]];
	}, [items]);
	const [active, setActive] = (0, import_react.useState)("الكل");
	const shown = active === "الكل" ? items : items.filter((p) => p.category === active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		eyebrow: "أعمالنا",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["أعمال ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-gradient",
			children: "نفتخر بها."
		})] }),
		desc: "مشاريع حديثة مع علامات وفرق نحب العمل معهم."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section pt-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-muted-foreground py-16 surface-card",
				children: "لا توجد مشاريع منشورة بعد. ستظهر هنا عند إضافتها من لوحة التحكم."
			}), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [categories.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center justify-center gap-2 mb-10",
				children: categories.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActive(f),
					className: `px-4 py-2 rounded-full text-sm font-medium border transition-all ${active === f ? "bg-[var(--gradient-primary)] text-white border-transparent shadow-[var(--shadow-elevated)]" : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/30"}`,
					children: f
				}, f))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3",
				children: shown.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group card-interactive overflow-hidden block",
					children: [p.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
						src: p.imageUrl,
						alt: p.title,
						overlay: true,
						wrapperClassName: "aspect-[4/3] w-full",
						className: "transition-transform duration-500 group-hover:scale-105"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[4/3] w-full bg-accent grid place-items-center text-muted-foreground text-sm",
						children: "بدون صورة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: p.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: p.category
						})] }), p.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: p.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-muted-foreground hover:text-primary",
							"aria-label": `فتح ${p.title}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpLeft, { className: "h-4 w-4 rtl-flip" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpLeft, { className: "h-4 w-4 rtl-flip text-muted-foreground/40" })]
					})]
				}, p.id))
			})] })]
		})
	})] });
}
//#endregion
export { Portfolio as component };
