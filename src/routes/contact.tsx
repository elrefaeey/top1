import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock, Mail, MapPin, Minus, Phone, Plus, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PageIntro } from "@/components/site/SectionIntro";
import { SocialLinks } from "@/components/site/SocialLinks";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { useFaqs, useSiteSettings, useSubmitLead } from "@/hooks/use-cms";
import { SITE_ADDRESS, SITE_CONTACT_EMAIL, SITE_CONTACT_PHONE } from "@/lib/site-config";
import { telHref } from "@/lib/phone";
import { whatsAppHref } from "@/lib/whatsapp";

import { sanitizeCmsHtml } from "@/lib/security/sanitize-html";
import { buildContactPageHead } from "@/lib/seo/static-page-head";
import { loadContactRouteSeo } from "@/lib/seo/static-page-loaders";

export const Route = createFileRoute("/contact")({
  loader: () => loadContactRouteSeo(),
  head: ({ loaderData }) => buildContactPageHead(loaderData),
  component: Contact,
});

const PERKS = ["رد خلال 24 ساعة", "استشارة مجانية", "لا التزام"];

function Contact() {
  const { data: settings } = useSiteSettings();
  const submitLead = useSubmitLead();

  const email = settings?.contactEmail || SITE_CONTACT_EMAIL;
  const phone = settings?.contactPhone || SITE_CONTACT_PHONE;
  const address = settings?.address || SITE_ADDRESS;
  const waHref = whatsAppHref(settings?.whatsappNumber, settings?.whatsappMessage);

  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phoneVal = String(fd.get("phone") ?? "").trim();
    const msg = String(fd.get("msg") ?? "").trim();
    const website = String(fd.get("website") ?? "").trim();

    if (!name || !phoneVal || !msg) {
      alert("يرجى تعبئة الاسم ورقم الجوال والاستفسار.");
      return;
    }
    if (name.length > 120 || phoneVal.length > 30 || msg.length > 5000) {
      alert("تحقق من طول الحقول وحاول مرة أخرى.");
      return;
    }

    try {
      await submitLead.mutateAsync({
        name,
        phone: phoneVal,
        message: msg,
        source: "contact_form",
        website,
      });
      setSent(true);
      e.currentTarget.reset();
    } catch {
      alert("تعذّر إرسال الرسالة. جرّب واتساب أو حاول مرة أخرى.");
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="تواصل"
        title={<>لنبني <span className="text-gradient">شيئاً رائعاً.</span></>}
        desc="تواصل عبر واتساب أو اترك رسالتك — نرد خلال 24 ساعة."
      />

      <section className="contact-page section">
        <div className="container-page contact-layout">
          <aside className="contact-aside">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-wa-card"
            >
              <span className="contact-wa-icon">
                <WhatsAppIcon className="h-6 w-6" />
              </span>
              <span className="contact-wa-copy">
                <strong>تواصل واتساب</strong>
                <span>أسرع طريقة — رد سريع</span>
              </span>
              <ArrowLeft className="h-4 w-4 shrink-0 opacity-70 rtl-flip" />
            </a>

            <div className="contact-info-card surface-card">
              <h3 className="contact-info-title">بيانات التواصل</h3>
              <ul className="contact-info-list">
                <li>
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${email}`} dir="ltr" className="hover:text-primary transition-colors">
                    {email}
                  </a>
                </li>
                <li className="contact-call-row">
                  <a href={telHref(phone)} className="contact-call-btn">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>اتصل بنا</span>
                  </a>
                </li>
                <li>
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span>{address}</span>
                </li>
              </ul>
              <SocialLinks className="contact-social mt-4" />
            </div>

            <ul className="contact-perks">
              {PERKS.map((t) => (
                <li key={t}>
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </aside>

          <div className="contact-form-col">
            {sent ? (
              <div className="contact-success surface-card">
                <span className="contact-success-icon">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-semibold">تم إرسال رسالتك</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  شكراً — سنتواصل معك خلال 24 ساعة.
                </p>
                <button type="button" className="btn-ghost mt-4" onClick={() => setSent(false)}>
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="contact-form surface-card">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <div className="contact-form-head">
                  <h2 className="contact-form-title">اترك رسالتك</h2>
                  <p className="contact-form-desc">الاسم ورقم الجوال والاستفسار — الحقول مطلوبة</p>
                </div>

                <div className="contact-fields-grid">
                  <Field label="اسمك" id="name" name="name" required />
                  <Field label="رقم الجوال" id="phone" name="phone" type="tel" placeholder="05xxxxxxxx" dir="ltr" required />
                </div>

                <div className="contact-field-full">
                  <label htmlFor="msg" className="contact-label">
                    استفسارك <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="msg"
                    name="msg"
                    rows={5}
                    required
                    className="contact-textarea"
                    placeholder="اكتب استفسارك أو تفاصيل مشروعك…"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLead.isPending}
                  className="btn-primary contact-submit"
                >
                  {submitLead.isPending ? "جاري الإرسال…" : "إرسال الرسالة"}
                  {!submitLead.isPending && <ArrowLeft className="h-4 w-4 rtl-flip" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <ContactFaq />
    </>
  );
}

type FieldProps = {
  label: string;
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  dir?: string;
};

function Field({ label, id, name, type = "text", required, placeholder, dir }: FieldProps) {
  return (
    <div className="contact-field">
      <label htmlFor={id} className="contact-label">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        dir={dir}
        className="contact-input"
      />
    </div>
  );
}

function ContactFaq() {
  const { data: faqs = [] } = useFaqs();
  const [open, setOpen] = useState<number | null>(0);
  const items = faqs.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="contact-faq section">
      <div className="container-page contact-faq-inner">
        <div className="contact-faq-head">
          <span className="page-intro-eyebrow">
            <Clock className="h-3 w-3" /> أسئلة شائعة
          </span>
          <h2 className="page-intro-title page-intro-title--section contact-faq-title">
            إجابات سريعة قبل التواصل
          </h2>
        </div>
        <div className="contact-faq-list">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.id} className="faq-item-new" data-open={isOpen}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start hover:bg-accent/30 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-[0.9375rem]">{f.question}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-primary shrink-0">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(f.answer) }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
