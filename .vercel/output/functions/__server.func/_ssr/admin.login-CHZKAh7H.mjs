import { o as __toESM } from "../_runtime.mjs";
import { r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useAuth, n as loginWithEmail } from "./AuthProvider-DW-AkY09.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-CHZKAh7H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getAuthErrorMessage(error) {
	const code = error?.code;
	switch (code) {
		case "auth/invalid-credential":
		case "auth/wrong-password":
		case "auth/user-not-found":
		case "auth/invalid-email": return "البريد أو كلمة المرور غير صحيحة. تأكد أن المستخدم موجود في Firebase → Authentication (ليس Firestore فقط).";
		case "auth/too-many-requests": return "محاولات كثيرة. انتظر دقيقة ثم حاول مجدداً.";
		case "auth/network-request-failed": return "تعذّر الاتصال بـ Firebase. تحقق من الإنترنت أو أن Auth مفعّل في Console.";
		case "auth/unauthorized-domain": return "النطاق غير مصرّح. أضف localhost في Firebase → Authentication → Authorized domains.";
		case "auth/user-disabled": return "هذا الحساب معطّل في Firebase.";
		case "auth/operation-not-allowed": return "تسجيل الدخول بالبريد غير مفعّل. فعّل Email/Password في Firebase Console.";
		default: return code ? `فشل الدخول (${code}). راجع إعدادات Firebase Authentication.` : "فشل الدخول. حاول مجدداً.";
	}
}
function AdminLogin() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const { user, loading: authLoading } = useAuth();
	(0, import_react.useEffect)(() => {
		if (!authLoading && user) navigate({ to: "/admin" });
	}, [
		user,
		authLoading,
		navigate
	]);
	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await loginWithEmail(email.trim(), password);
			navigate({ to: "/admin" });
		} catch (err) {
			setError(getAuthErrorMessage(err));
		} finally {
			setLoading(false);
		}
	}
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "جاري التحميل…"
		})
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "جاري الدخول للوحة التحكم…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold tracking-tight",
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
					className: "mt-2 text-sm text-muted-foreground",
					children: "سجّل الدخول لإدارة موقعك"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "surface-card p-6 space-y-4",
				children: [
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive leading-relaxed",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "email",
						className: "text-sm font-medium",
						children: "البريد الإلكتروني"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "email",
						type: "email",
						required: true,
						autoComplete: "email",
						dir: "ltr",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-start",
						placeholder: "admin@top1markting.com"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "password",
						className: "text-sm font-medium",
						children: "كلمة المرور"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "password",
						type: "password",
						required: true,
						autoComplete: "current-password",
						dir: "ltr",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						className: "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-start",
						placeholder: "••••••••"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "btn-primary w-full justify-center disabled:opacity-60",
						children: loading ? "جاري التحقق…" : "تسجيل الدخول"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted-foreground pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-primary",
							children: "← العودة للموقع"
						})
					})
				]
			})]
		})
	});
}
//#endregion
export { AdminLogin as component };
