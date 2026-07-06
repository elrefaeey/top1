import { o as __toESM } from "../_runtime.mjs";
import { r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Outlet, g as Link, l as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as DollarSign, E as LogOut, G as BookOpen, I as FileText, W as Briefcase, b as MessageSquare, d as Settings, f as Search, it as ChartColumn, j as Image, k as LayoutDashboard, m as RefreshCw, n as X, r as Users, rt as CircleAlert, tt as CircleQuestionMark } from "../_libs/lucide-react.mjs";
import { i as useAuth, r as logout } from "./AuthProvider-DW-AkY09.mjs";
import { a as isAdminFirestoreUnavailable, i as getAdminFirestoreErrorKind, n as clearAdminFirestoreUnavailable, v as useAdminServices } from "./use-admin-cms-igTQWEoU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Bn4Z3DIw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var navItems = [
	{
		to: "/admin",
		label: "لوحة التحكم",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/pages",
		label: "الصفحات",
		icon: FileText
	},
	{
		to: "/admin/services",
		label: "الخدمات",
		icon: Briefcase
	},
	{
		to: "/admin/portfolio",
		label: "أعمالنا",
		icon: Image
	},
	{
		to: "/admin/blog",
		label: "المدونة",
		icon: BookOpen
	},
	{
		to: "/admin/pricing",
		label: "الأسعار",
		icon: DollarSign
	},
	{
		to: "/admin/testimonials",
		label: "آراء العملاء",
		icon: MessageSquare
	},
	{
		to: "/admin/stats",
		label: "الإحصائيات",
		icon: ChartColumn
	},
	{
		to: "/admin/faqs",
		label: "الأسئلة الشائعة",
		icon: CircleQuestionMark
	},
	{
		to: "/admin/leads",
		label: "العملاء المحتملون",
		icon: Users
	},
	{
		to: "/admin/seo",
		label: "SEO",
		icon: Search
	},
	{
		to: "/admin/settings",
		label: "الإعدادات",
		icon: Settings
	}
];
function isNavActive(pathname, to, exact) {
	if (exact) return pathname === to || pathname === `${to}/`;
	if (to === "/admin") return pathname === "/admin" || pathname === "/admin/";
	return pathname === to || pathname.startsWith(`${to}/`);
}
function AdminSidebar() {
	const { user } = useAuth();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full w-64 flex-col border-e border-border bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-5 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					className: "text-lg font-semibold tracking-tight",
					dir: "ltr",
					children: [
						SITE_NAME,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "Admin"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground truncate",
					dir: "ltr",
					children: user?.email
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-0.5 p-3",
				children: navItems.map(({ to, label, icon: Icon, exact }) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						className: cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors", isNavActive(pathname, to, exact) ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }), label]
					}, to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-3 space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground",
					children: "عرض الموقع"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => logout(),
					className: "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 rtl-flip" }), "تسجيل الخروج"]
				})]
			})
		]
	});
}
function AdminFirestoreBanner() {
	const { isFetched, refetch } = useAdminServices();
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	const [retrying, setRetrying] = (0, import_react.useState)(false);
	if (dismissed || !isFetched || !isAdminFirestoreUnavailable()) return null;
	const kind = getAdminFirestoreErrorKind();
	async function handleRetry() {
		setRetrying(true);
		clearAdminFirestoreUnavailable();
		try {
			await refetch();
		} finally {
			setRetrying(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-6 mt-4 md:mx-8 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "تعذّر الاتصال بـ Firestore"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs opacity-90",
						children: kind === "permission" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"حسابك مسجّل لكن Firestore يرفض الطلب. أنشئ مستند",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-[0.7rem] bg-amber-500/10 px-1 rounded",
								dir: "ltr",
								children: "users/UID"
							}),
							" ",
							"مع ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-[0.7rem] bg-amber-500/10 px-1 rounded",
								children: "role: admin"
							}),
							"، ثم",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://console.firebase.google.com",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "underline font-medium hover:text-primary",
								children: "انشر firestore.rules"
							}),
							"."
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"فعّل Firestore في Firebase Console، انشر قواعد الأمان، ثم",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								className: "underline font-medium hover:text-primary",
								children: "استورد المحتوى"
							}),
							" ",
							"من لوحة التحكم."
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: retrying,
						onClick: () => void handleRetry(),
						className: "mt-2 inline-flex items-center gap-1.5 text-xs font-medium underline hover:text-primary disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3 w-3 ${retrying ? "animate-spin" : ""}` }), retrying ? "جاري إعادة المحاولة…" : "إعادة المحاولة"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setDismissed(true),
				className: "shrink-0 rounded p-1 hover:bg-amber-500/20",
				"aria-label": "إغلاق",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
			})
		]
	});
}
function AdminLayout() {
	const { user, loading, isEditor, refreshUser } = useAuth();
	const navigate = useNavigate();
	const isLoginPage = useRouterState({ select: (s) => s.location.pathname }) === "/admin/login";
	const [retrying, setRetrying] = (0, import_react.useState)(false);
	const [bootstrapError, setBootstrapError] = (0, import_react.useState)("");
	const canAutoBootstrap = Boolean(user?.email);
	(0, import_react.useEffect)(() => {
		if (!loading && !user && !isLoginPage) navigate({ to: "/admin/login" });
	}, [
		user,
		loading,
		isLoginPage,
		navigate
	]);
	if (isLoginPage) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "جاري التحميل…"
		})
	});
	if (!user) return null;
	if (!isEditor) {
		async function handleRetryBootstrap() {
			setRetrying(true);
			setBootstrapError("");
			try {
				await refreshUser();
			} catch (err) {
				setBootstrapError(err instanceof Error ? err.message : "تعذّر تفعيل الصلاحية");
			} finally {
				setRetrying(false);
			}
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-screen items-center justify-center bg-background p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card max-w-md p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold",
						children: "لا تملك صلاحية الدخول"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: ["حسابك مسجّل في Firebase Auth لكن بدون دور في Firestore.", canAutoBootstrap ? " اضغط الزر أدناه لتفعيل صلاحية الدخول تلقائياً." : " أنشئ مستند users/{uid} مع الحقل role: admin أو editor."]
					}),
					bootstrapError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-destructive",
						children: bootstrapError
					}),
					user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground break-all",
						dir: "ltr",
						children: ["UID: ", user.uid]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2",
						children: [canAutoBootstrap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: retrying,
							onClick: () => void handleRetryBootstrap(),
							className: "btn-primary disabled:opacity-60",
							children: retrying ? "جاري التفعيل…" : "تفعيل صلاحية الدخول"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => navigate({ to: "/" }),
							className: canAutoBootstrap ? "btn-ghost" : "btn-primary",
							children: "العودة للموقع"
						})]
					})
				]
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 overflow-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFirestoreBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
		})]
	});
}
//#endregion
export { AdminLayout as component };
