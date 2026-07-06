import { o as __toESM } from "../_runtime.mjs";
import { r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { r as siteImages } from "./site-images-D0ev85AD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteImage } from "./SiteImage-H4I9drPU.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Layers, C as Megaphone, P as Globe, U as Check, Y as ArrowRight, Z as Sparkles, c as Target, et as CodeXml, f as Search, h as Plus, it as ChartColumn, l as Star, o as TrendingUp, p as Rocket, q as ArrowUpRight, t as Zap, u as ShieldCheck, v as Palette, x as MessageSquareQuote, y as Minus } from "../_libs/lucide-react.mjs";
import { _ as useSiteStats, d as useFaqs, f as usePortfolio, g as useSiteSettings, h as useServices, p as usePricingPlans, r as blogPostSlug, u as useBlogPosts, y as useTestimonials } from "./use-cms-fD0JcbJP.mjs";
import { n as statIcon } from "./stat-icons-Ucn6HYIe.mjs";
import { t as formatPostDate } from "./date-utils-CzJ5L8eC.mjs";
import { n as SectionIntro } from "./SectionIntro-Xkb2KMJX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DhPmX12a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Reveal({ children, className, delay = 0 }) {
	const ref = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				setVisible(true);
				observer.disconnect();
			}
		}, {
			threshold: .12,
			rootMargin: "0px 0px -40px 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("reveal", visible && "revealed", className),
		style: { transitionDelay: `${delay}ms` },
		children
	});
}
var ICONS = {
	Globe,
	Code2: CodeXml,
	Search,
	Palette,
	Layers,
	Rocket,
	Zap
};
function serviceIcon(name) {
	if (!name) return Globe;
	return ICONS[name] ?? Globe;
}
var MARQUEE_ITEMS = [
	"تصميم مواقع",
	"SEO السعودية",
	"إعلانات Google",
	"تسويق سوشيال",
	"UI/UX",
	"تحليلات",
	"Core Web Vitals",
	"تحويل الزوار"
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marquee, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Services, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyUs, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portfolio, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Process, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlogPreview, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {})
	] });
}
function Hero() {
	const { data: settings } = useSiteSettings();
	const heroSrc = settings?.heroImageUrl?.trim() || siteImages.hero.main;
	const heroAlt = settings?.heroImageAlt?.trim() || siteImages.hero.mainAlt;
	const stats = [
		{
			icon: TrendingUp,
			label: "ارتفاع التحويل",
			value: "+47%"
		},
		{
			icon: ChartColumn,
			label: "زيارات",
			value: "284K",
			title: "زيارات organic"
		},
		{
			icon: Zap,
			label: "Lighthouse",
			value: "99"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "hero-v2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hero-v2-bg",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-v2-grid" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-v2-glow hero-v2-glow--1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-v2-glow hero-v2-glow--2" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page hero-v2-inner",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-v2-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hero-v2-visual animate-hero",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-v2-frame",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hero-v2-frame-ring",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
							src: heroSrc,
							alt: heroAlt,
							loading: "eager",
							fetchPriority: "high",
							wrapperClassName: "hero-v2-image aspect-[5/4] w-full",
							className: "hero-v2-image-inner"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-v2-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-v2-badge animate-hero animate-hero-delay-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hero-v2-badge-dot" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-3.5 w-3.5" }),
								"وكالة تسويق رقمي · ",
								SITE_NAME
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "hero-v2-title animate-hero animate-hero-delay-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hero-v2-title-line",
								children: "حوّل زوارك"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hero-v2-title-highlight",
								children: "لعملاء حقيقيين"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hero-v2-desc animate-hero animate-hero-delay-3",
							children: "نصمّم مواقع سريعة، نُحسّن ظهورك في Google، وندير حملاتك — كل ذلك من فريق واحد يفهم السوق السعودي."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-v2-actions animate-hero animate-hero-delay-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/contact",
								className: "hero-v2-btn-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ابدأ مشروعك مجاناً" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 rtl-flip" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/portfolio",
								className: "hero-v2-btn-secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 rtl-flip" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "شاهد أعمالنا" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hero-v2-pills animate-hero animate-hero-delay-5",
							children: [
								"استشارة مجانية",
								"عرض خلال 48 س",
								"بدون عقود طويلة"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hero-v2-pill",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-primary" }), t]
							}, t))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hero-v2-stats-row animate-hero animate-hero-delay-5",
							children: stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `hero-v2-stat hero-v2-stat--${i + 1}`,
								title: "title" in s ? s.title : void 0,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hero-v2-stat-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hero-v2-stat-value",
									children: s.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hero-v2-stat-label",
									children: s.label
								})] })]
							}, s.label))
						})
					]
				})]
			})
		})]
	});
}
function Marquee() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "home-marquee-wrap",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "marquee-track",
			children: [...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "home-marquee-item",
				children: t
			}, `${t}-${i}`))
		})
	});
}
function Services() {
	const { data: services = [] } = useServices();
	if (services.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "services",
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionIntro, {
				eyebrow: "خدماتنا",
				title: "كل ما تحتاجه للنمو الرقمي.",
				desc: "تصميم، تطوير، SEO، وإعلانات — فريق واحد مسؤول عن النتيجة."
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "section-body bento-grid",
				children: services.map((s, i) => {
					const Icon = serviceIcon(s.icon);
					const featured = i === 0 && services.length >= 3;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 70,
						className: featured ? "bento-featured" : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/services/$slug",
							params: { slug: s.slug },
							className: "bento-card group",
							children: [s.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
								src: s.imageUrl,
								alt: s.title,
								wrapperClassName: "aspect-[16/9] w-full",
								className: "transition-transform duration-500 group-hover:scale-105"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bento-card-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bento-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 text-lg font-semibold",
										children: s.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground leading-relaxed flex-1",
										children: s.shortDescription
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary",
										children: ["التفاصيل ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 rtl-flip group-hover:translate-x-0.5 transition-transform" })]
									})
								]
							})]
						})
					}, s.id);
				})
			})]
		})
	});
}
function WhyUs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section bg-surface/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 lg:grid-cols-2 lg:gap-14 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "why-panel relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative page-intro-eyebrow !bg-white/10 !text-white !border-white/20",
							children: ["لماذا ", SITE_NAME]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "relative mt-3 text-xl md:text-2xl font-bold text-white leading-snug",
							children: "شريك تسويق يفهم السوق السعودي"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "relative mt-2.5 text-sm text-white/70 leading-relaxed max-w-md",
							children: "RTL، WhatsApp، google.sa، وسلوك المستخدم المحلي — نبني منتجات digital تناسب جمهورك وتحقق leads حقيقية."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/about",
							className: "relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors",
							children: ["تعرّف علينا ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 rtl-flip" })]
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						{
							icon: Target,
							t: "تركيز على النتائج",
							d: "كل قرار مبني على تحويل وزيارات وعائد — مش vanity metrics."
						},
						{
							icon: ShieldCheck,
							t: "خبراء فقط",
							d: "فريق senior بدون outsourcing — جودة ثابتة من أول يوم."
						},
						{
							icon: Zap,
							t: "سرعة وتسليم واضح",
							d: "سبرنتات أسبوعين، تحديثات مستمرة، بدون مفاجآت."
						},
						{
							icon: TrendingUp,
							t: "SEO من البداية",
							d: "Core Web Vitals، schema، ومحتوى يُرتّب في Google."
						}
					].map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 80,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card p-5 h-full hover:shadow-[var(--shadow-card-hover)] transition-shadow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-[0.9375rem]",
									children: p.t
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm text-muted-foreground leading-relaxed",
									children: p.d
								})
							]
						})
					}, p.t))
				})]
			})
		})
	});
}
function Portfolio() {
	const { data: projects = [] } = usePortfolio();
	const preview = projects.slice(0, 3);
	if (preview.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionIntro, {
				eyebrow: "أعمالنا",
				title: "مشاريع حققت نتائج.",
				desc: "عيّنة من أعمالنا — مواقع، حملات، وSEO.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/portfolio",
					className: "btn-ghost",
					children: ["كل المشاريع ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 rtl-flip" })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "section-body portfolio-home-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: preview.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 100,
					className: "h-full min-w-0 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/portfolio",
						className: "group bento-card portfolio-home-card block h-full w-full min-w-0 max-w-full overflow-hidden",
						children: [p.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
							src: p.imageUrl,
							alt: p.title,
							overlay: true,
							wrapperClassName: "portfolio-home-media aspect-[4/3] w-full max-w-full",
							className: "transition-transform duration-500 group-hover:scale-105"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "portfolio-home-media aspect-[4/3] w-full max-w-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "portfolio-home-card-body p-5 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-[0.9375rem] group-hover:text-primary transition-colors line-clamp-2",
									children: p.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-0.5 truncate",
									children: p.category
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 rtl-flip text-muted-foreground group-hover:text-primary transition-colors shrink-0" })]
						})]
					})
				}, p.id))
			})]
		})
	});
}
function Stats() {
	const { data: items = [] } = useSiteStats();
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section pt-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stats-band",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "stats-band-grid",
					children: items.map((s) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stats-band-item",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "stats-band-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(statIcon(s.icon), { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "stats-band-value",
									children: s.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "stats-band-label",
									children: s.label
								})
							]
						}, s.id);
					})
				})
			})
		})
	});
}
function Process() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionIntro, {
				eyebrow: "كيف نعمل",
				title: "من الفكرة للنتائج — 4 خطوات.",
				desc: "عملية شفافة بدون غموض.",
				centered: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "section-body process-rail",
				children: [
					{
						n: "01",
						t: "استكشاف",
						d: "نفهم نشاطك، جمهورك، ومنافسيك."
					},
					{
						n: "02",
						t: "استراتيجية",
						d: "خطة SEO، محتوى، وتصميم واضحة."
					},
					{
						n: "03",
						t: "تنفيذ",
						d: "بناء، إطلاق، وتحسين مستمر."
					},
					{
						n: "04",
						t: "نمو",
						d: "تحليلات، A/B tests، وتوسع."
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "process-step",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "process-num",
							children: s.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: s.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: s.d
						})
					]
				}, s.n))
			})]
		})
	});
}
function Pricing() {
	const { data: plans = [] } = usePricingPlans();
	if (plans.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section bg-surface/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionIntro, {
				eyebrow: "الأسعار",
				title: "باقات واضحة.",
				desc: "اختر نقطة البداية — نخصص الباقة حسب احتياجك.",
				centered: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "section-body grid gap-5 md:grid-cols-3",
				children: plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `pricing-card-new ${p.highlighted ? "pricing-card-new--highlight" : ""}`,
					children: [
						p.highlighted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-3 start-6 eyebrow !py-1 bg-[var(--gradient-primary)] !text-white !border-transparent text-xs",
							children: "الأكثر طلباً"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-lg",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-baseline gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl font-bold tracking-tight",
								children: p.price
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: p.period
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: p.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 space-y-2.5",
							children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 mt-0.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: p.ctaHref,
							className: `mt-7 w-full ${p.highlighted ? "btn-primary" : "btn-ghost"}`,
							children: p.ctaLabel
						})
					]
				}, p.name))
			})]
		})
	});
}
function Testimonials() {
	const { data: items = [] } = useTestimonials();
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionIntro, {
				eyebrow: "آراء العملاء",
				title: "يثق بنا شركاء النجاح.",
				centered: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "section-body grid gap-5 md:grid-cols-3",
				children: items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "testimonial-card-new",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquareQuote, { className: "h-6 w-6 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "mt-4 text-[15px] leading-relaxed flex-1",
							children: [
								"“",
								t.quote,
								"”"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "mt-6 pt-5 border-t border-border flex items-center gap-3",
							children: [
								t.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
									src: t.avatarUrl,
									alt: t.name,
									wrapperClassName: "h-10 w-10 shrink-0 rounded-full"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-10 w-10 rounded-full bg-primary/10 grid place-items-center font-semibold text-primary",
									children: t.name[0]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold truncate",
										children: t.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground truncate",
										children: [
											t.role,
											", ",
											t.company
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "ms-auto flex text-primary shrink-0",
									children: Array.from({ length: t.rating }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-current" }, i))
								})
							]
						})
					]
				}, t.id))
			})]
		})
	});
}
function BlogPreview() {
	const { data: posts = [] } = useBlogPosts(3);
	if (posts.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section bg-surface/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionIntro, {
				eyebrow: "المدونة",
				title: "نصائح تسويق وSEO.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/blog",
					className: "btn-ghost",
					children: ["كل المقالات ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 rtl-flip" })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "section-body grid gap-5 md:grid-cols-3",
				children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/blog/$slug",
					params: { slug: blogPostSlug(p) },
					className: "group bento-card block",
					children: [p.featuredImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImage, {
						src: p.featuredImage,
						alt: p.featuredImageAlt ?? p.title,
						wrapperClassName: "aspect-[16/10] w-full",
						className: "transition-transform duration-500 group-hover:scale-105"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary font-medium",
									children: p.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.publishedAt ? formatPostDate(p.publishedAt) : "" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2",
							children: p.title
						})]
					})]
				}, p.id))
			})]
		})
	});
}
function FAQ() {
	const { data: faqs = [] } = useFaqs();
	const [open, setOpen] = (0, import_react.useState)(0);
	if (faqs.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionIntro, {
				eyebrow: "أسئلة شائعة",
				title: "إجابات سريعة.",
				centered: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "section-body flex flex-col gap-3",
				children: faqs.map((f, i) => {
					const isOpen = open === i;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "faq-item-new",
						"data-open": isOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpen(isOpen ? null : i),
							className: "w-full flex items-center justify-between gap-4 px-5 py-4 text-start hover:bg-accent/30 transition-colors",
							"aria-expanded": isOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-[0.9375rem]",
								children: f.question
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-full bg-accent text-primary shrink-0",
								children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
							})]
						}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-5 pb-5 text-sm text-muted-foreground leading-relaxed",
							children: f.answer
						})]
					}, f.id);
				})
			})]
		})
	});
}
function CTA() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section pt-0 pb-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "home-cta-block relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative page-intro-eyebrow !bg-white/15 !text-white !border-white/25",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " ابدأ الآن"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "relative mt-3 text-2xl md:text-3xl font-bold max-w-2xl mx-auto leading-snug",
						children: "جاهز تضاعف leads من Google؟"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "relative mt-2.5 text-white/80 max-w-lg mx-auto text-sm",
						children: "أخبرنا عن مشروعك — نرد خلال 24 ساعة ونرسل عرضاً مخصصاً."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-8 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/contact",
							className: "btn-primary",
							children: ["تواصل معنا ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 rtl-flip" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/services",
							className: "btn-ghost",
							children: "استكشف الخدمات"
						})]
					})
				]
			})
		})
	});
}
//#endregion
export { Home as component };
