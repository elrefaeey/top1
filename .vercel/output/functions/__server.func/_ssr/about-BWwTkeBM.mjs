import { r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { r as siteImages } from "./site-images-D0ev85AD.mjs";
import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteImage } from "./SiteImage-H4I9drPU.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { K as Award, N as Heart, R as Eye, Y as ArrowRight, Z as Sparkles, c as Target, r as Users } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-BWwTkeBM.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	const values = [
		{
			icon: Eye,
			t: "الرؤية",
			d: "عالم يكون فيه كل منتج رقمي مصنوعاً بإتقان، قابل للقياس، ويستحق الاستخدام."
		},
		{
			icon: Target,
			t: "الرسالة",
			d: "مساعدة الفرق الطموحة على إطلاق منتجات جميلة تحقق نمواً قابلاً للقياس."
		},
		{
			icon: Heart,
			t: "القيم",
			d: "الإتقان، الشفافية، الملكية، والميل الدائم للإطلاق."
		}
	];
	const team = [
		{
			n: "عمر حديد",
			r: "المؤسس وقائد التصميم",
			photo: siteImages.team.omar
		},
		{
			n: "ليلى بناني",
			r: "قائدة الهندسة",
			photo: siteImages.team.layla
		},
		{
			n: "يوسف كرم",
			r: "مصمم منتجات أول",
			photo: siteImages.team.youssef
		},
		{
			n: "هناء صالح",
			r: "قائدة النمو وSEO",
			photo: siteImages.team.hana
		}
	];
	const timeline = [
		{
			y: "2019",
			t: "التأسيس",
			d: `${SITE_NAME} تُطلق في دبي بثلاثة أعضاء مؤسسين.`
		},
		{
			y: "2021",
			t: "توسّع لـ 12",
			d: "توسّع الفريق في التصميم والهندسة والنمو."
		},
		{
			y: "2023",
			t: "أول جائزة دولية",
			d: "تكريم في CSS Design Awards كموقع اليوم."
		},
		{
			y: "2026",
			t: "+120 مشروع",
			d: "نخدم فرقاً طموحة في 14 دولة."
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "hero-bg relative overflow-hidden page-intro",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "absolute inset-0 grid-fade pointer-events-none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page relative page-intro-inner",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid items-center gap-5 lg:grid-cols-2 lg:gap-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
						src: siteImages.about.studio,
						alt: siteImages.about.studioAlt,
						wrapperClassName: "order-first lg:order-2 aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl shadow-[var(--shadow-card-hover)]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "order-last lg:order-1 text-center lg:text-start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "page-intro-eyebrow",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }),
									" عن ",
									SITE_NAME
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "page-intro-title",
								children: ["استوديو محترف ب", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "عقلية الحرفي."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "page-intro-desc lg:mx-0",
								children: [
									"أسّسنا ",
									SITE_NAME,
									" في 2019 بإيمان بسيط: العمل الرقمي يجب أن يكون جميلاً، سريعاً، ومبنياً ليتراكم. بعد 7 سنوات و120 مشروعاً، هذا الإيمان ما زال يوجّه كل قرار."
								]
							})
						]
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page grid gap-5 md:grid-cols-3",
				children: values.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 place-items-center rounded-lg bg-[var(--gradient-primary)] text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(v.icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 text-lg font-semibold",
							children: v.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground leading-relaxed",
							children: v.d
						})
					]
				}, v.t))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section bg-surface border-y border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end justify-between flex-wrap gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "page-intro-block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "page-intro-eyebrow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }), " الفريق"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "page-intro-title page-intro-title--section",
							children: "محترفون من البداية للنهاية."
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "section-body grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
					children: team.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
								src: m.photo,
								alt: m.n,
								wrapperClassName: "mx-auto h-24 w-24 rounded-full border-2 border-border"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-semibold",
								children: m.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: m.r
							})
						]
					}, m.n))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page max-w-3xl page-intro-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "page-intro-eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3 w-3" }), " رحلتنا"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "page-intro-title page-intro-title--section",
						children: "محطات مهمة."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "section-body relative border-s border-border ps-6 space-y-8",
						children: timeline.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -start-[34px] grid h-6 w-6 place-items-center rounded-full bg-[var(--gradient-primary)] text-white text-[10px] font-bold",
									children: "●"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-primary font-semibold tracking-wider",
									children: t.y
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 font-semibold",
									children: t.t
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: t.d
								})
							]
						}, t.y))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/contact",
							className: "btn-primary",
							children: ["اعمل معنا ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 rtl-flip" })]
						})
					})
				]
			})
		})
	] });
}
//#endregion
export { About as component };
