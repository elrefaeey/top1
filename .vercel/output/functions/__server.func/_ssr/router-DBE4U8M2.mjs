import { o as __toESM } from "../_runtime.mjs";
import { i as SITE_TWITTER, n as SITE_LOGO_URL, r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, o as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { L as useRouter, _ as require_react_dom, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Menu, T as Mail, X as ArrowLeft, Z as Sparkles, n as X, w as MapPin } from "../_libs/lucide-react.mjs";
import { n as isSupported, r as logEvent, t as getAnalytics } from "../_libs/@firebase/analytics+[...].mjs";
import "../_libs/firebase.mjs";
import { n as getFirebaseApp, t as SITE_URL } from "./config-Dmr7eOvS.mjs";
import { t as AuthProvider } from "./AuthProvider-DW-AkY09.mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { g as useSiteSettings, h as useServices } from "./use-cms-fD0JcbJP.mjs";
import { i as whatsAppHref, n as WhatsAppIcon, r as telHref, t as SocialLinks } from "./WhatsAppIcon-z1xD23GI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DBE4U8M2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
var styles_default = "/assets/styles-BV1N3MaM.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function SiteLogo({ className, imageClassName, showName = true }) {
	const { data: settings } = useSiteSettings();
	const brandName = settings?.siteName || "Top1Markting";
	const logoUrl = settings?.logoUrl || "/logo.jpeg";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex items-center gap-2.5 min-w-0", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: logoUrl,
			alt: "",
			"aria-hidden": true,
			className: cn("h-9 w-auto max-w-[7.5rem] shrink-0 object-contain object-center", imageClassName),
			width: 120,
			height: 36,
			decoding: "async"
		}), showName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			dir: "ltr",
			className: "font-display text-base sm:text-lg font-bold tracking-tight text-foreground truncate",
			children: brandName
		})]
	});
}
var DEFAULT_NAV = [
	{
		label: "الرئيسية",
		href: "/",
		order: 0
	},
	{
		label: "الخدمات",
		href: "/services",
		order: 1
	},
	{
		label: "أعمالنا",
		href: "/portfolio",
		order: 2
	},
	{
		label: "من نحن",
		href: "/about",
		order: 3
	},
	{
		label: "المدونة",
		href: "/blog",
		order: 4
	},
	{
		label: "تواصل",
		href: "/contact",
		order: 5
	}
];
function SiteHeader() {
	const { data: settings } = useSiteSettings();
	const navLinks = (settings?.headerNav?.length ? settings.headerNav : DEFAULT_NAV).slice().sort((a, b) => a.order - b.order);
	const [open, setOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [pathname]);
	function isActive(href) {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "site-header relative z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page flex h-[3.75rem] lg:h-[4.25rem] items-center justify-between gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "group flex items-center min-w-0 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLogo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden lg:flex items-center gap-1",
						children: navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.href,
							className: cn("nav-link", isActive(l.href) && "nav-link-active"),
							children: l.label
						}, l.href))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "hidden sm:inline-flex btn-primary !py-2.5 !px-5 !text-[0.9375rem]",
							children: "اطلب عرض سعر"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": open ? "إغلاق القائمة" : "فتح القائمة",
							"aria-expanded": open,
							className: "lg:hidden grid h-10 w-10 place-items-center rounded-full border border-border bg-surface",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("fixed inset-0 z-40 bg-foreground/15 backdrop-blur-sm transition-opacity duration-300 lg:hidden", open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"),
			onClick: () => setOpen(false),
			"aria-hidden": !open
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("fixed top-[3.75rem] lg:top-[4.25rem] inset-x-0 z-40 lg:hidden transition-all duration-300", open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mx-4 rounded-2xl border border-border bg-surface p-2 shadow-[var(--shadow-card-hover)]",
				children: [navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.href,
					onClick: () => setOpen(false),
					className: cn("flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors", isActive(l.href) ? "bg-accent text-primary font-semibold" : "text-foreground hover:bg-muted"),
					children: l.label
				}, l.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contact",
					onClick: () => setOpen(false),
					className: "btn-primary mt-2 w-full justify-center !text-sm",
					children: "اطلب عرض سعر"
				})]
			})
		})
	] });
}
var QUICK_LINKS = [
	{
		label: "الرئيسية",
		href: "/"
	},
	{
		label: "الخدمات",
		href: "/services"
	},
	{
		label: "أعمالنا",
		href: "/portfolio"
	},
	{
		label: "المدونة",
		href: "/blog"
	},
	{
		label: "من نحن",
		href: "/about"
	},
	{
		label: "تواصل",
		href: "/contact"
	}
];
function SiteFooter() {
	const { data: settings } = useSiteSettings();
	const { data: services = [] } = useServices();
	const siteName = settings?.siteName || "Top1Markting";
	const tagline = settings?.tagline || "تسويق رقمي · تصميم مواقع · SEO · نمو قابل للقياس";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "site-footer mt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "footer-cta-band",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page footer-cta-inner",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "footer-cta-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "footer-cta-badge",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " ابدأ اليوم"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "footer-cta-title",
							children: "جاهز ترفع مبيعاتك أونلاين؟"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "footer-cta-desc",
							children: "احصل على استشارة مجانية وعرض سعر خلال 48 ساعة — بدون التزام."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/contact",
					className: "btn-primary footer-cta-btn shrink-0",
					children: ["تواصل معنا", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 rtl-flip" })]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "footer-main",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "footer-main-glow",
				"aria-hidden": true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page relative z-[1]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "footer-grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "footer-brand-col",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "footer-brand-logo-link",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLogo, {
										className: "footer-brand-logo",
										imageClassName: "footer-brand-logo-img",
										showName: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "footer-tagline",
									children: tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "footer-contact-list",
									children: [
										settings?.address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: settings.address })] }),
										settings?.contactEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `mailto:${settings.contactEmail}`,
											dir: "ltr",
											className: "hover:text-white transition-colors",
											children: settings.contactEmail
										})] }),
										(settings?.contactPhone, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: telHref(settings?.contactPhone),
											className: "footer-call-btn",
											"aria-label": "اتصل بنا",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "footer-call-btn-label",
												children: "اتصل بنا"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "footer-call-btn-plus",
												dir: "ltr",
												children: "+966"
											})]
										}) }))
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLinks, {
									variant: "footer",
									className: "footer-social mt-4"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "footer-links-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "footer-links-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "footer-col-title",
										children: "روابط سريعة"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "footer-link-list",
										children: QUICK_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: l.href,
											className: "footer-link",
											children: l.label
										}) }, l.href))
									})]
								}),
								services.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "footer-links-col footer-services-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "footer-col-title",
										children: "خدماتنا"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "footer-link-list",
										children: services.slice(0, 6).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/services/$slug",
											params: { slug: s.slug },
											className: "footer-link",
											children: s.title
										}) }, s.id))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "footer-links-col footer-perks-col",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "footer-col-title",
											children: "لماذا نحن؟"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "footer-perks",
											children: [
												"فريق خبراء فقط",
												"تسليم سريع وشفاف",
												"SEO من اليوم الأول",
												"دعم بعد الإطلاق"
											].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t }, t))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/contact",
											className: "footer-mini-cta mt-4",
											children: ["اطلب عرض سعر", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5 rtl-flip" })]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "footer-mobile-nav footer-mobile-only",
							"aria-label": "روابط الموقع",
							children: QUICK_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: l.href,
								className: "footer-mobile-link",
								children: l.label
							}, l.href))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/contact",
							className: "footer-mobile-cta footer-mobile-only",
							children: ["تواصل معنا", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 rtl-flip" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "footer-bottom",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "footer-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/login",
								className: "footer-copy-mark",
								"aria-label": "©",
								children: "©"
							}),
							" ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" ",
							siteName,
							". جميع الحقوق محفوظة."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "footer-made",
						children: "صُنع بعناية · محسّن للأداء والتحويل"
					})]
				})]
			})]
		})]
	});
}
var analytics = null;
async function initAnalytics() {
	if (typeof window === "undefined") return null;
	if (analytics) return analytics;
	if (!await isSupported()) return null;
	analytics = getAnalytics(getFirebaseApp());
	return analytics;
}
function trackEvent(name, params) {
	if (!analytics) return;
	logEvent(analytics, name, params);
}
function trackPageView(path) {
	trackEvent("page_view", { page_path: path });
}
function trackWhatsAppClick(source) {
	trackEvent("whatsapp_click", { source });
}
var DEFAULT_MESSAGE = `مرحباً ${SITE_NAME}، أود مناقشة مشروع.`;
function WhatsAppButton() {
	const { data: settings } = useSiteSettings();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const href = whatsAppHref(settings?.whatsappNumber, DEFAULT_MESSAGE);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	if (!mounted) return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "whatsapp-float",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href,
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": "تواصل عبر واتساب",
			onClick: () => trackWhatsAppClick("floating_button"),
			className: "whatsapp-float-btn",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "whatsapp-float-icon" })
		})
	}), document.body);
}
function FirebaseAnalytics() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		initAnalytics();
	}, []);
	(0, import_react.useEffect)(() => {
		trackPageView(pathname);
	}, [pathname]);
	return null;
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "eyebrow",
				children: "٤٠٤ · غير موجود"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 text-6xl md:text-7xl font-bold tracking-tight",
				children: "الصفحة غير موجودة."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-md text-muted-foreground",
				children: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "btn-primary",
					children: "العودة للرئيسية"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contact",
					className: "btn-ghost",
					children: "تواصل معنا"
				})]
			})
		]
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[70vh] items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "eyebrow",
					children: "حدث خطأ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-2xl font-semibold tracking-tight",
					children: "تعذّر تحميل الصفحة"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "جرّب تحديث الصفحة — إذا استمرت المشكلة، ارجع للرئيسية."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "btn-primary",
						children: "إعادة المحاولة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "btn-ghost",
						children: "الرئيسية"
					})]
				})
			]
		})
	});
}
var Route$32 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: `${SITE_NAME} — تصميم مواقع وتطبيقات وSEO احترافي` },
			{
				name: "description",
				content: `${SITE_NAME} استوديو رقمي متخصص في تصميم المواقع، تطبيقات الويب، UI/UX وSEO لتحويل الزوار إلى عملاء.`
			},
			{
				name: "author",
				content: SITE_NAME
			},
			{
				name: "theme-color",
				content: "#4F46E5"
			},
			{
				property: "og:site_name",
				content: SITE_NAME
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: SITE_TWITTER
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "icon",
				href: SITE_LOGO_URL,
				type: "image/jpeg"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name: SITE_NAME,
				url: "/",
				logo: SITE_LOGO_URL,
				sameAs: []
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$32.useRouteContext();
	const isAdminRoute = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FirebaseAnalytics, {}), isAdminRoute ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "site-shell flex min-h-screen flex-col overflow-x-clip",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppButton, {})
			]
		})] })
	});
}
var BASE_URL = SITE_URL;
var Route$31 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
		{
			path: "/",
			changefreq: "weekly",
			priority: "1.0"
		},
		{
			path: "/about",
			changefreq: "monthly",
			priority: "0.8"
		},
		{
			path: "/services",
			changefreq: "monthly",
			priority: "0.9"
		},
		{
			path: "/services/web-design",
			changefreq: "monthly",
			priority: "0.7"
		},
		{
			path: "/services/web-apps",
			changefreq: "monthly",
			priority: "0.7"
		},
		{
			path: "/services/seo",
			changefreq: "monthly",
			priority: "0.7"
		},
		{
			path: "/services/ui-ux",
			changefreq: "monthly",
			priority: "0.7"
		},
		{
			path: "/services/digital-solutions",
			changefreq: "monthly",
			priority: "0.7"
		},
		{
			path: "/portfolio",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/blog",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/contact",
			changefreq: "monthly",
			priority: "0.7"
		}
	].map((e) => `  <url>
    <loc>${BASE_URL}${e.path}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$29 = () => import("./services-BqArNSrd.mjs");
var Route$30 = createFileRoute("/services")({
	head: () => ({
		meta: [
			{ title: `الخدمات — ${SITE_NAME}` },
			{
				name: "description",
				content: "تصميم مواقع، تطبيقات ويب، SEO، UI/UX وحلول رقمية — فريق محترف لعلامات طموحة."
			},
			{
				property: "og:title",
				content: `الخدمات — ${SITE_NAME}`
			},
			{
				property: "og:description",
				content: "تصميم مواقع، تطبيقات وSEO وحلول رقمية لفرق طموحة."
			},
			{
				property: "og:url",
				content: "/services"
			}
		],
		links: [{
			rel: "canonical",
			href: "/services"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./portfolio-DGhacQqA.mjs");
var Route$29 = createFileRoute("/portfolio")({
	head: () => ({
		meta: [
			{ title: `أعمالنا — ${SITE_NAME}` },
			{
				name: "description",
				content: "أعمال مختارة — مواقع وتطبيقات وأنظمة هوية لفرق طموحة."
			},
			{
				property: "og:title",
				content: `أعمالنا — ${SITE_NAME}`
			},
			{
				property: "og:description",
				content: `أعمال مختارة من ${SITE_NAME}.`
			},
			{
				property: "og:url",
				content: "/portfolio"
			}
		],
		links: [{
			rel: "canonical",
			href: "/portfolio"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./contact-CDZp92Wa.mjs");
var Route$28 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: `تواصل — ${SITE_NAME}` },
			{
				name: "description",
				content: "أخبرنا عن مشروعك. نرد خلال 24 ساعة ونرسل عرضاً مخصصاً خلال 48 ساعة."
			},
			{
				property: "og:title",
				content: `تواصل — ${SITE_NAME}`
			},
			{
				property: "og:description",
				content: `أخبرنا عن مشروعك — ${SITE_NAME}.`
			},
			{
				property: "og:url",
				content: "/contact"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contact"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./blog-IMpfIcca.mjs");
var Route$27 = createFileRoute("/blog")({
	head: () => ({
		meta: [
			{ title: `المدونة — ${SITE_NAME}` },
			{
				name: "description",
				content: `مقالات عن التصميم والتطوير وSEO ونمو المنتجات من ${SITE_NAME}.`
			},
			{
				property: "og:title",
				content: `المدونة — ${SITE_NAME}`
			},
			{
				property: "og:description",
				content: "مقالات عن التصميم والتطوير وSEO ونمو المنتجات."
			},
			{
				property: "og:url",
				content: "/blog"
			}
		],
		links: [{
			rel: "canonical",
			href: "/blog"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./admin-Bn4Z3DIw.mjs");
var Route$26 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./about-BWwTkeBM.mjs");
var Route$25 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: `من نحن — ${SITE_NAME}` },
			{
				name: "description",
				content: `${SITE_NAME} استوديو منتجات رقمية يبني تجارب رقمية لفرق طموحة. تعرّف على الفريق والرسالة والقيم.`
			},
			{
				property: "og:title",
				content: `من نحن — ${SITE_NAME}`
			},
			{
				property: "og:description",
				content: `تعرّف على فريق ${SITE_NAME} — رسالتنا ورؤيتنا وقيمنا.`
			},
			{
				property: "og:url",
				content: "/about"
			}
		],
		links: [{
			rel: "canonical",
			href: "/about"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./routes-DhPmX12a.mjs");
var Route$24 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: `${SITE_NAME} — تسويق رقمي · تصميم مواقع · SEO` },
			{
				name: "description",
				content: `${SITE_NAME} — وكالة تسويق رقمي متخصصة في تصميم المواقع، SEO، والإعلانات لتحويل الزوار إلى عملاء.`
			},
			{
				property: "og:title",
				content: `${SITE_NAME} — تسويق رقمي · تصميم مواقع · SEO`
			},
			{
				property: "og:description",
				content: "نسوّق نشاطك ونبني حضورك الرقمي — مواقع سريعة، SEO، وتحويل حقيقي."
			},
			{
				property: "og:url",
				content: "/"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "LocalBusiness",
				name: SITE_NAME,
				url: "/"
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./admin.index-Cw6NBkxw.mjs");
var Route$23 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./services._slug-D5Jsw6aM.mjs");
var Route$22 = createFileRoute("/services/$slug")({
	head: ({ params }) => ({
		meta: [
			{ title: `خدمة — ${SITE_NAME}` },
			{
				name: "description",
				content: `خدمات ${SITE_NAME}.`
			},
			{
				property: "og:url",
				content: `/services/${params.slug}`
			},
			{
				property: "og:type",
				content: "article"
			}
		],
		links: [{
			rel: "canonical",
			href: `/services/${params.slug}`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./blog._slug-whQ5Nwsu.mjs");
var Route$21 = createFileRoute("/blog/$slug")({
	head: ({ params }) => ({
		meta: [
			{ title: `مقال — ${SITE_NAME}` },
			{
				name: "description",
				content: `مقال من ${SITE_NAME}`
			},
			{
				property: "og:url",
				content: `/blog/${params.slug}`
			},
			{
				property: "og:type",
				content: "article"
			}
		],
		links: [{
			rel: "canonical",
			href: `/blog/${params.slug}`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var MAX_BYTES = 12 * 1024 * 1024;
/** بدون Storage: حفظ inline في Firestore (بعد الضغط) */
var MAX_INLINE_BYTES = 38e4;
function env(name) {
	return (process.env[name] ?? process.env[`VITE_${name}`] ?? "").trim();
}
function bytesToDataUrl(bytes, contentType) {
	const b64 = Buffer.from(bytes).toString("base64");
	return `data:${contentType || "image/jpeg"};base64,${b64}`;
}
function inlineDataUrlFallback(bytes, contentType) {
	if (bytes.byteLength > MAX_INLINE_BYTES) return null;
	return bytesToDataUrl(bytes, contentType);
}
async function verifyFirebaseIdToken(idToken) {
	const apiKey = env("FIREBASE_API_KEY") || env("VITE_FIREBASE_API_KEY");
	if (!apiKey) throw new Error("Firebase API key missing on server");
	const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ idToken })
	});
	if (!res.ok) throw new Error("رمز الدخول غير صالح — سجّل الدخول مرة أخرى");
	if (!(await res.json()).users?.length) throw new Error("رمز الدخول غير صالح");
}
function storageDownloadUrl(bucket, objectName, downloadToken) {
	return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectName)}?alt=media&token=${downloadToken}`;
}
async function uploadToFirebaseStorageServer(objectPath, bytes, contentType, idToken) {
	const bucket = env("FIREBASE_STORAGE_BUCKET") || env("VITE_FIREBASE_STORAGE_BUCKET");
	if (!bucket) throw new Error("VITE_FIREBASE_STORAGE_BUCKET غير مُعد");
	const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(objectPath)}`;
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Firebase ${idToken}`,
			"Content-Type": contentType || "image/jpeg"
		},
		body: bytes
	});
	const text = await res.text();
	if (!res.ok) {
		if (res.status === 404) throw new Error("Firebase Storage غير مفعّل — من Console: Build → Storage → Get started");
		if (res.status === 403) throw new Error("لا توجد صلاحية رفع — انشر storage.rules في Firebase Storage → Rules");
		throw new Error(`فشل Firebase Storage (${res.status})`);
	}
	const json = JSON.parse(text);
	if (!json.name || !json.downloadTokens) throw new Error("استجابة Storage غير متوقعة");
	return storageDownloadUrl(bucket, json.name, json.downloadTokens);
}
async function uploadToImgBBServer(bytes, contentType) {
	const key = env("IMGBB_API_KEY");
	if (!key) throw new Error("IMGBB_API_KEY غير مُعد على السيرver");
	const blob = new Blob([bytes], { type: contentType || "image/jpeg" });
	const body = new FormData();
	body.append("image", blob, "upload.jpg");
	const json = await (await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, {
		method: "POST",
		body
	})).json();
	if (!json.success) throw new Error(json.error?.message ?? "فشل رفع ImgBB");
	return json.data?.url ?? json.data?.display_url ?? "";
}
function safeUploadFileName(name) {
	return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}
function assertFileSize(bytes) {
	if (bytes.byteLength > MAX_BYTES) throw new Error("الحد الأقصى 12 ميجابايت");
}
async function handleImageUploadRequest(request) {
	try {
		const authHeader = request.headers.get("Authorization");
		if (!authHeader?.startsWith("Bearer ")) return Response.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
		const idToken = authHeader.slice(7);
		await verifyFirebaseIdToken(idToken);
		const form = await request.formData();
		const file = form.get("file");
		const folder = String(form.get("folder") ?? "misc").replace(/[^a-zA-Z0-9_-]/g, "");
		if (!(file instanceof File)) return Response.json({ error: "لم تُرسل صورة" }, { status: 400 });
		const bytes = await file.arrayBuffer();
		assertFileSize(bytes);
		const objectPath = `media/${folder}/${Date.now()}-${safeUploadFileName(file.name)}`;
		const contentType = file.type || "image/jpeg";
		try {
			const url = await uploadToFirebaseStorageServer(objectPath, bytes, contentType, idToken);
			return Response.json({
				url,
				provider: "firebase"
			});
		} catch (firebaseErr) {
			if (env("IMGBB_API_KEY")) try {
				const url = await uploadToImgBBServer(bytes, contentType);
				return Response.json({
					url,
					provider: "imgbb"
				});
			} catch {}
			const inlineUrl = inlineDataUrlFallback(bytes, contentType);
			if (inlineUrl) return Response.json({
				url: inlineUrl,
				provider: "inline",
				note: "تم الحفظ مؤقتاً بدون Storage — للصور الدائمة فعّل Firebase Storage لاحقاً"
			});
			const fbMsg = firebaseErr instanceof Error ? firebaseErr.message : "Firebase Storage غير متاح";
			return Response.json({ error: `${fbMsg}. الصورة كبيرة جداً للحفظ بدون Storage — استخدم JPG مضغوط أو فعّل Storage من Firebase Console.` }, { status: 502 });
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : "فشل الرفع";
		return Response.json({ error: message }, { status: 500 });
	}
}
var Route$20 = createFileRoute("/api/upload-image")({ server: { handlers: { POST: ({ request }) => handleImageUploadRequest(request) } } });
var $$splitComponentImporter$19 = () => import("./admin.testimonials-DKwzNDWl.mjs");
var Route$19 = createFileRoute("/admin/testimonials")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./admin.stats-CFA0Kv11.mjs");
var Route$18 = createFileRoute("/admin/stats")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin.settings-ymbBNuAr.mjs");
var Route$17 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./admin.services-DGUTOkrT.mjs");
var Route$16 = createFileRoute("/admin/services")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./admin.seo-Mv0IvGSE.mjs");
var Route$15 = createFileRoute("/admin/seo")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin.pricing-C2Kcl6Sc.mjs");
var Route$14 = createFileRoute("/admin/pricing")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./admin.portfolio--OBd_T1H.mjs");
var Route$13 = createFileRoute("/admin/portfolio")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./admin.pages-0hDemUV1.mjs");
var Route$12 = createFileRoute("/admin/pages")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin.login-CHZKAh7H.mjs");
var Route$11 = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.leads-Bt6mKHiK.mjs");
var Route$10 = createFileRoute("/admin/leads")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin.faqs-B3LUUdNu.mjs");
var Route$9 = createFileRoute("/admin/faqs")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.blog-CE2iZCb8.mjs");
var Route$8 = createFileRoute("/admin/blog")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.testimonials._id-D3Xr1YKJ.mjs");
var Route$7 = createFileRoute("/admin/testimonials/$id")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.stats._id-CwQybLry.mjs");
var Route$6 = createFileRoute("/admin/stats/$id")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.services._id-CIm6f9cP.mjs");
var Route$5 = createFileRoute("/admin/services/$id")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.pricing._id-sd7REUCN.mjs");
var Route$4 = createFileRoute("/admin/pricing/$id")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.portfolio._id-CYJ_j9QR.mjs");
var Route$3 = createFileRoute("/admin/portfolio/$id")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.pages._id-CuogtgqA.mjs");
var Route$2 = createFileRoute("/admin/pages/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.faqs._id-B2YA1kZo.mjs");
var Route$1 = createFileRoute("/admin/faqs/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.blog._id-DExNNUGr.mjs");
var Route = createFileRoute("/admin/blog/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SitemapDotxmlRoute = Route$31.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$32
});
var ServicesRoute = Route$30.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => Route$32
});
var PortfolioRoute = Route$29.update({
	id: "/portfolio",
	path: "/portfolio",
	getParentRoute: () => Route$32
});
var ContactRoute = Route$28.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$32
});
var BlogRoute = Route$27.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$32
});
var AdminRoute = Route$26.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$32
});
var AboutRoute = Route$25.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$32
});
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$32
});
var AdminIndexRoute = Route$23.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var ServicesSlugRoute = Route$22.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => ServicesRoute
});
var BlogSlugRoute = Route$21.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => BlogRoute
});
var ApiUploadImageRoute = Route$20.update({
	id: "/api/upload-image",
	path: "/api/upload-image",
	getParentRoute: () => Route$32
});
var AdminTestimonialsRoute = Route$19.update({
	id: "/testimonials",
	path: "/testimonials",
	getParentRoute: () => AdminRoute
});
var AdminStatsRoute = Route$18.update({
	id: "/stats",
	path: "/stats",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$17.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminServicesRoute = Route$16.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => AdminRoute
});
var AdminSeoRoute = Route$15.update({
	id: "/seo",
	path: "/seo",
	getParentRoute: () => AdminRoute
});
var AdminPricingRoute = Route$14.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => AdminRoute
});
var AdminPortfolioRoute = Route$13.update({
	id: "/portfolio",
	path: "/portfolio",
	getParentRoute: () => AdminRoute
});
var AdminPagesRoute = Route$12.update({
	id: "/pages",
	path: "/pages",
	getParentRoute: () => AdminRoute
});
var AdminLoginRoute = Route$11.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
});
var AdminLeadsRoute = Route$10.update({
	id: "/leads",
	path: "/leads",
	getParentRoute: () => AdminRoute
});
var AdminFaqsRoute = Route$9.update({
	id: "/faqs",
	path: "/faqs",
	getParentRoute: () => AdminRoute
});
var AdminBlogRoute = Route$8.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => AdminRoute
});
var AdminTestimonialsIdRoute = Route$7.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminTestimonialsRoute
});
var AdminStatsIdRoute = Route$6.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminStatsRoute
});
var AdminServicesIdRoute = Route$5.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminServicesRoute
});
var AdminPricingIdRoute = Route$4.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminPricingRoute
});
var AdminPortfolioIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminPortfolioRoute
});
var AdminPagesIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminPagesRoute
});
var AdminFaqsIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminFaqsRoute
});
var AdminBlogRouteChildren = { AdminBlogIdRoute: Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminBlogRoute
}) };
var AdminBlogRouteWithChildren = AdminBlogRoute._addFileChildren(AdminBlogRouteChildren);
var AdminFaqsRouteChildren = { AdminFaqsIdRoute };
var AdminFaqsRouteWithChildren = AdminFaqsRoute._addFileChildren(AdminFaqsRouteChildren);
var AdminPagesRouteChildren = { AdminPagesIdRoute };
var AdminPagesRouteWithChildren = AdminPagesRoute._addFileChildren(AdminPagesRouteChildren);
var AdminPortfolioRouteChildren = { AdminPortfolioIdRoute };
var AdminPortfolioRouteWithChildren = AdminPortfolioRoute._addFileChildren(AdminPortfolioRouteChildren);
var AdminPricingRouteChildren = { AdminPricingIdRoute };
var AdminPricingRouteWithChildren = AdminPricingRoute._addFileChildren(AdminPricingRouteChildren);
var AdminServicesRouteChildren = { AdminServicesIdRoute };
var AdminServicesRouteWithChildren = AdminServicesRoute._addFileChildren(AdminServicesRouteChildren);
var AdminStatsRouteChildren = { AdminStatsIdRoute };
var AdminStatsRouteWithChildren = AdminStatsRoute._addFileChildren(AdminStatsRouteChildren);
var AdminTestimonialsRouteChildren = { AdminTestimonialsIdRoute };
var AdminRouteChildren = {
	AdminBlogRoute: AdminBlogRouteWithChildren,
	AdminFaqsRoute: AdminFaqsRouteWithChildren,
	AdminLeadsRoute,
	AdminLoginRoute,
	AdminPagesRoute: AdminPagesRouteWithChildren,
	AdminPortfolioRoute: AdminPortfolioRouteWithChildren,
	AdminPricingRoute: AdminPricingRouteWithChildren,
	AdminSeoRoute,
	AdminServicesRoute: AdminServicesRouteWithChildren,
	AdminSettingsRoute,
	AdminStatsRoute: AdminStatsRouteWithChildren,
	AdminTestimonialsRoute: AdminTestimonialsRoute._addFileChildren(AdminTestimonialsRouteChildren),
	AdminIndexRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var BlogRouteChildren = { BlogSlugRoute };
var BlogRouteWithChildren = BlogRoute._addFileChildren(BlogRouteChildren);
var ServicesRouteChildren = { ServicesSlugRoute };
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AdminRoute: AdminRouteWithChildren,
	BlogRoute: BlogRouteWithChildren,
	ContactRoute,
	PortfolioRoute,
	ServicesRoute: ServicesRoute._addFileChildren(ServicesRouteChildren),
	SitemapDotxmlRoute,
	ApiUploadImageRoute
};
var routeTree = Route$32._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			retry: false,
			staleTime: 3e4,
			refetchOnWindowFocus: false
		} } }) },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
