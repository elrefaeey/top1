import { o as __toESM } from "../_runtime.mjs";
import { r as siteImages } from "./site-images-D0ev85AD.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteImage } from "./SiteImage-H4I9drPU.mjs";
import { b as useMatch, f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { J as ArrowUpLeft, f as Search, o as TrendingUp } from "../_libs/lucide-react.mjs";
import { r as blogPostSlug, u as useBlogPosts } from "./use-cms-fD0JcbJP.mjs";
import { t as formatPostDate } from "./date-utils-CzJ5L8eC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog-IMpfIcca.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Blog() {
	const isPost = useMatch({
		from: "/blog/$slug",
		shouldThrow: false
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("الكل");
	const { data: posts = [], isLoading } = useBlogPosts();
	const categories = (0, import_react.useMemo)(() => {
		return ["الكل", ...[...new Set(posts.map((p) => p.category).filter(Boolean))]];
	}, [posts]);
	const filtered = (0, import_react.useMemo)(() => posts.filter((p) => (cat === "الكل" || p.category === cat) && p.title.toLowerCase().includes(q.toLowerCase())), [
		posts,
		cat,
		q
	]);
	const trending = filtered.filter((p) => p.trending);
	if (isPost) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "hero-bg relative overflow-hidden page-intro",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page relative page-intro-inner",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-center gap-5 lg:grid-cols-2 lg:gap-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
					src: siteImages.blog.default,
					alt: "كتابة وتصميم محتوى رقمي",
					wrapperClassName: "order-first lg:order-2 aspect-[16/10] w-full rounded-2xl shadow-[var(--shadow-card)]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "order-last lg:order-1 text-center lg:text-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "page-intro-eyebrow",
							children: "المدونة"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "page-intro-title",
							children: ["مقالات من ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient",
								children: "الاستوديو."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "page-intro-desc lg:mx-0",
							children: "أدلة عملية في التصميم والتطوير وSEO ونمو المنتجات."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 relative w-full max-w-xl mx-auto lg:mx-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "ابحث في المقالات…",
								className: "w-full h-12 ps-11 pe-4 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
							})]
						})
					]
				})]
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section pt-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2 mb-10",
					children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCat(c),
						className: `px-4 py-2 rounded-full text-sm font-medium border transition-all ${cat === c ? "bg-[var(--gradient-primary)] text-white border-transparent" : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/30"}`,
						children: c
					}, c))
				}),
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-12 text-muted-foreground text-sm",
					children: "جاري تحميل المقالات…"
				}),
				!isLoading && posts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center py-16 text-muted-foreground surface-card",
					children: "لا توجد مقالات منشورة بعد. ستظهر هنا عند إضافتها من لوحة التحكم."
				}),
				!isLoading && trending.length > 0 && cat === "الكل" && q === "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-semibold mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" }), " الأكثر رواجاً"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-5 md:grid-cols-2",
						children: trending.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/blog/$slug",
							params: { slug: blogPostSlug(p) },
							className: "card-interactive overflow-hidden group block",
							children: [p.featuredImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
								src: p.featuredImage,
								alt: p.featuredImageAlt ?? p.title,
								wrapperClassName: "aspect-[16/9] w-full",
								className: "transition-transform duration-500 group-hover:scale-105"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary font-medium",
											children: p.category
										}),
										"·",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.publishedAt ? formatPostDate(p.publishedAt) : "" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 text-lg font-semibold group-hover:text-primary",
									children: p.title
								})]
							})]
						}, p.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold mb-4",
					children: "أحدث المقالات"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 md:grid-cols-3",
					children: [filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/blog/$slug",
						params: { slug: blogPostSlug(p) },
						className: "card-interactive overflow-hidden group block",
						children: [p.featuredImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
							src: p.featuredImage,
							alt: p.featuredImageAlt ?? p.title,
							wrapperClassName: "aspect-[16/10] w-full",
							className: "transition-transform duration-500 group-hover:scale-105"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary font-medium",
											children: p.category
										}),
										"·",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.publishedAt ? formatPostDate(p.publishedAt) : "" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 font-semibold leading-snug group-hover:text-primary",
									children: p.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary",
									children: ["اقرأ المقال ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpLeft, { className: "h-3 w-3 rtl-flip" })]
								})
							]
						})]
					}, p.id)), !isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-full text-center py-20 text-muted-foreground",
						children: "لا توجد مقالات مطابقة."
					})]
				})
			]
		})
	})] });
}
//#endregion
export { Blog as component };
