import { a as SITE_WHATSAPP_NUMBER, t as SITE_CONTACT_PHONE } from "./site-config-v-wtd2LN.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Instagram, D as Linkedin, L as Facebook, i as Twitter } from "../_libs/lucide-react.mjs";
import { g as useSiteSettings } from "./use-cms-fD0JcbJP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WhatsAppIcon-z1xD23GI.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = [
	{
		key: "facebook",
		label: "Facebook",
		Icon: Facebook
	},
	{
		key: "instagram",
		label: "Instagram",
		Icon: Instagram
	},
	{
		key: "twitter",
		label: "Twitter",
		Icon: Twitter
	},
	{
		key: "linkedin",
		label: "LinkedIn",
		Icon: Linkedin
	}
];
function SocialLinks({ className, variant = "default" }) {
	const { data: settings } = useSiteSettings();
	const links = settings?.socialLinks ?? {};
	const visible = ICONS.filter(({ key }) => links[key]?.trim());
	if (visible.length === 0) return null;
	const btnClass = variant === "footer" ? "grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 transition-colors" : "grid h-9 w-9 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center gap-2.5", className),
		children: visible.map(({ key, label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: links[key],
			target: "_blank",
			rel: "noopener noreferrer me",
			"aria-label": label,
			className: btnClass,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
		}, key))
	});
}
/** أرقام سعودية → 966XXXXXXXXX (بدون +) */
function normalizeSaudiPhone(raw, fallback = SITE_CONTACT_PHONE) {
	const digits = (raw || fallback).replace(/\D/g, "");
	if (!digits) return "966549881368";
	if (digits.startsWith("966")) return digits;
	if (digits.startsWith("05")) return `966${digits.slice(1)}`;
	if (digits.startsWith("5") && digits.length === 9) return `966${digits}`;
	return digits;
}
/** رابط اتصال دولي بكود السعودية */
function telHref(raw) {
	return `tel:+${normalizeSaudiPhone(raw)}`;
}
function normalizeWhatsAppNumber(raw) {
	const digits = (raw || "966549881368").replace(/\D/g, "");
	if (!digits) return SITE_WHATSAPP_NUMBER;
	if (digits.startsWith("966")) return digits;
	if (digits.startsWith("05")) return `966${digits.slice(1)}`;
	if (digits.startsWith("5") && digits.length === 9) return `966${digits}`;
	return digits;
}
function whatsAppHref(number, message) {
	const base = `https://wa.me/${normalizeWhatsAppNumber(number)}`;
	if (!message) return base;
	return `${base}?text=${encodeURIComponent(message)}`;
}
function WhatsAppIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		"aria-hidden": true,
		className,
		fill: "currentColor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })
	});
}
//#endregion
export { whatsAppHref as i, WhatsAppIcon as n, telHref as r, SocialLinks as t };
