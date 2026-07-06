import { o as __toESM } from "../_runtime.mjs";
import { r as SITE_NAME } from "./site-config-v-wtd2LN.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { H as Clock, T as Mail, U as Check, X as ArrowLeft, Z as Sparkles, g as Phone, h as Plus, w as MapPin, y as Minus } from "../_libs/lucide-react.mjs";
import { d as useFaqs, g as useSiteSettings, v as useSubmitLead } from "./use-cms-fD0JcbJP.mjs";
import { i as whatsAppHref, n as WhatsAppIcon, r as telHref, t as SocialLinks } from "./WhatsAppIcon-z1xD23GI.mjs";
import { t as PageIntro } from "./SectionIntro-Xkb2KMJX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-CDZp92Wa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PERKS = [
	"رد خلال 24 ساعة",
	"عرض سعر خلال 48 س",
	"استشارة مجانية"
];
function Contact() {
	const { data: settings } = useSiteSettings();
	const submitLead = useSubmitLead();
	const email = settings?.contactEmail || "hello@top1markting.com";
	const phone = settings?.contactPhone || "0549881368";
	const address = settings?.address || "الرياض · المملكة العربية السعودية";
	const waHref = whatsAppHref(settings?.whatsappNumber, `مرحباً ${SITE_NAME}، أود مناقشة مشروع.`);
	const [sent, setSent] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const name = String(fd.get("name") ?? "").trim();
		const emailVal = String(fd.get("email") ?? "").trim();
		const phoneVal = String(fd.get("phone") ?? "").trim();
		const company = String(fd.get("company") ?? "").trim();
		const budget = String(fd.get("budget") ?? "").trim();
		const projectType = String(fd.get("type") ?? "").trim();
		const msg = String(fd.get("msg") ?? "").trim();
		const message = [...[
			projectType && `نوع المشروع: ${projectType}`,
			company && `الشركة: ${company}`,
			budget && `الميزانية: ${budget}`
		].filter(Boolean), msg].join("\n\n");
		try {
			await submitLead.mutateAsync({
				name,
				email: emailVal,
				phone: phoneVal || void 0,
				message,
				source: "contact_form"
			});
			setSent(true);
			e.currentTarget.reset();
		} catch {
			alert("تعذّر إرسال الرسالة. جرّب واتساب أو حاول مرة أخرى.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			eyebrow: "تواصل",
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["لنبني ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-gradient",
				children: "شيئاً رائعاً."
			})] }),
			desc: "أخبرنا عن مشروعك — نرد خلال 24 ساعة ونرسل عرضاً مخصصاً خلال 48 ساعة."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "contact-page section pt-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page contact-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "contact-aside",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: waHref,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "contact-wa-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "contact-wa-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "contact-wa-copy",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "تواصل واتساب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "أسرع طريقة — رد سريع" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 shrink-0 opacity-70 rtl-flip" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "contact-info-card surface-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "contact-info-title",
									children: "بيانات التواصل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "contact-info-list",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `mailto:${email}`,
											dir: "ltr",
											className: "hover:text-primary transition-colors",
											children: email
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "contact-call-row",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: telHref(phone),
												className: "contact-call-btn",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 shrink-0" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اتصل بنا" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "contact-call-plus",
														dir: "ltr",
														children: "+966"
													})
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: address })] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLinks, { className: "contact-social mt-4" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "contact-perks",
							children: PERKS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary shrink-0" }), t] }, t))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "contact-form-col",
					children: sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "contact-success surface-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "contact-success-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: "تم إرسال رسالتك"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: "شكراً — سنتواصل معك خلال 24 ساعة."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-ghost mt-4",
								onClick: () => setSent(false),
								children: "إرسال رسالة أخرى"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "contact-form surface-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "contact-form-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "contact-form-title",
									children: "أرسل تفاصيل مشروعك"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "contact-form-desc",
									children: "الحقول بـ * مطلوبة"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "contact-fields-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "اسمك",
										id: "name",
										name: "name",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "البريد الإلكتروني",
										id: "email",
										name: "email",
										type: "email",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "رقم الجوال",
										id: "phone",
										name: "phone",
										type: "tel",
										placeholder: "05xxxxxxxx",
										dir: "ltr"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "الشركة",
										id: "company",
										name: "company"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "الميزانية التقريبية",
										id: "budget",
										name: "budget",
										placeholder: "مثال: 5,000 – 15,000 ر.س"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "نوع المشروع",
										id: "type",
										name: "type",
										placeholder: "موقع، SEO، إعلانات…"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "contact-field-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									htmlFor: "msg",
									className: "contact-label",
									children: ["أخبرنا عن مشروعك ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "msg",
									name: "msg",
									rows: 5,
									required: true,
									className: "contact-textarea",
									placeholder: "الأهداف، الجدول الزمني، أي تفاصيل مهمة…"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: submitLead.isPending,
								className: "btn-primary contact-submit",
								children: [submitLead.isPending ? "جاري الإرسال…" : "إرسال الرسالة", !submitLead.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 rtl-flip" })]
							})
						]
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactFaq, {})
	] });
}
function Field({ label, id, name, type = "text", required, placeholder, dir }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "contact-field",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			htmlFor: id,
			className: "contact-label",
			children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary",
				children: " *"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			name,
			type,
			required,
			placeholder,
			dir,
			className: "contact-input"
		})]
	});
}
function ContactFaq() {
	const { data: faqs = [] } = useFaqs();
	const [open, setOpen] = (0, import_react.useState)(0);
	const items = faqs.slice(0, 4);
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "contact-faq section pt-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page contact-faq-inner",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "contact-faq-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "page-intro-eyebrow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " أسئلة شائعة"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "page-intro-title page-intro-title--section contact-faq-title",
					children: "إجابات سريعة قبل التواصل"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "contact-faq-list",
				children: items.map((f, i) => {
					const isOpen = open === i;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "faq-item-new",
						"data-open": isOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
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
							className: "px-5 pb-5 text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none",
							dangerouslySetInnerHTML: { __html: f.answer }
						})]
					}, f.id);
				})
			})]
		})
	});
}
//#endregion
export { Contact as component };
