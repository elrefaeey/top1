import { r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteImage } from "./SiteImage-H4I9drPU.mjs";
import { g as Link, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Linkedin, L as Facebook, O as Link2, Y as ArrowRight, i as Twitter } from "../_libs/lucide-react.mjs";
import { l as useBlogPost, r as blogPostSlug, u as useBlogPosts } from "./use-cms-fD0JcbJP.mjs";
import { t as formatPostDate } from "./date-utils-CzJ5L8eC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-whQ5Nwsu.js
var import_jsx_runtime = require_jsx_runtime();
function Post() {
	const { slug } = useParams({ from: "/blog/$slug" });
	const { data: post, isLoading } = useBlogPost(slug);
	const { data: allPosts = [] } = useBlogPosts();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-24 text-center text-muted-foreground text-sm",
		children: "جاري تحميل المقال…"
	});
	if (!post) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold",
			children: "المقال غير موجود"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/blog",
			className: "mt-6 inline-flex btn-primary",
			children: "كل المقالات"
		})]
	});
	const related = allPosts.filter((p) => blogPostSlug(p) !== slug).slice(0, 2);
	const dateLabel = post.publishedAt ? formatPostDate(post.publishedAt) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "hero-bg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page pt-16 pb-12 max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/blog",
						className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 rtl-flip" }), " كل المقالات"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 text-xs text-muted-foreground flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary font-medium",
								children: post.category
							}),
							"·",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dateLabel }),
							"·",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["بقلم ", post.author] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-[1.2]",
						children: post.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-lg text-muted-foreground",
						children: post.excerpt
					})
				]
			})
		}),
		post.featuredImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page py-12 max-w-4xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
				src: post.featuredImage,
				alt: post.featuredImageAlt ?? post.title,
				wrapperClassName: "aspect-[16/8] w-full rounded-[var(--radius-2xl)] border border-border shadow-[var(--shadow-card)]"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page pb-24 max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prose-section space-y-4 text-[17px] leading-[1.85] text-foreground/85 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_ul]:list-disc [&_ul]:pe-6 [&_ul]:space-y-2",
					dangerouslySetInnerHTML: { __html: post.content }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 grid place-items-center font-semibold text-primary",
							children: post.author.split(" ").map((x) => x[0]).join("")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: post.author
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: ["فريق الاستوديو · ", SITE_NAME]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: [
							Twitter,
							Linkedin,
							Facebook,
							Link2
						].map((Icon, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "grid h-9 w-9 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}, i))
					})]
				}),
				related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-bold",
						children: "مقالات ذات صلة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-4 md:grid-cols-2",
						children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/blog/$slug",
							params: { slug: blogPostSlug(r) },
							className: "surface-card overflow-hidden hover:-translate-y-1 transition-all block",
							children: [r.featuredImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
								src: r.featuredImage,
								alt: r.featuredImageAlt ?? r.title,
								wrapperClassName: "aspect-[16/9] w-full"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-primary font-medium",
									children: r.category
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "mt-2 font-semibold",
									children: r.title
								})]
							})]
						}, r.id))
					})]
				})
			]
		})
	] });
}
//#endregion
export { Post as component };
