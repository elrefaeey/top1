import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Clock,
  Mail,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { PageIntro } from "@/components/site/SectionIntro";
import { SocialLinks } from "@/components/site/SocialLinks";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { ContentError, ContentLoading } from "@/components/site/ContentState";
import { useToast } from "@/components/site/Toast";
import { useFaqs, useSiteSettings, useSubmitLead } from "@/hooks/use-cms";
import { MarketsPhoneCards, MarketsServeStrip } from "@/components/site/MarketsContact";
import {
  SITE_ADDRESS,
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE,
  SITE_CONTACT_PHONE_SA,
} from "@/lib/site-config";
import { whatsAppHref } from "@/lib/whatsapp";

import { buildContactPageHead } from "@/lib/seo/static-page-head";
import { loadContactRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { useLocale } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/contact")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/contact", statusCode: 301 });
  },
});

export function Contact() {
  const { data: settings } = useSiteSettings();
  const submitLead = useSubmitLead();
  const toast = useToast();
  const { m, locale } = useLocale();

  const email = settings?.contactEmail || SITE_CONTACT_EMAIL;
  const phoneUae = settings?.contactPhone || SITE_CONTACT_PHONE;
  const phoneSa = settings?.contactPhoneSa || SITE_CONTACT_PHONE_SA;
  const address = locale === "en" ? m.common.defaultAddress : settings?.address || SITE_ADDRESS;
  const waHref = whatsAppHref(
    settings?.whatsappNumber,
    locale === "en" ? m.common.whatsappMessage : settings?.whatsappMessage,
  );

  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phoneVal = String(fd.get("phone") ?? "").trim();
    const msg = String(fd.get("msg") ?? "").trim();
    const website = String(fd.get("website") ?? "").trim();

    if (!name || !phoneVal || !msg) {
      toast.push(m.contact.needName, "error");
      return;
    }
    if (name.length > 120 || phoneVal.length > 30 || msg.length > 5000) {
      toast.push(m.contact.tooLong, "error");
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
      toast.push(m.contact.success, "success");
    } catch {
      toast.push(m.contact.fail, "error");
    }
  }

  return (
    <>
      {/* ─── Hero ─── */}
      <PageIntro
        eyebrow={m.contact.eyebrow}
        title={
          <>
            {m.contact.titleBefore}
            <span className="text-gradient">{m.contact.titleGradient}</span>
          </>
        }
        desc={m.contact.desc}
      />

      {/* ─── Main content ─── */}
      <section className="section contact-page">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12 items-start">

            {/* ── Form ── */}
            <div className="order-2 lg:order-1 min-w-0">
              {sent ? (
                <div className="rounded-2xl border border-border bg-surface p-10 text-center flex flex-col items-center gap-3">
                  <span className="h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center">
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <h2 className="text-xl font-bold">{m.contact.sentTitle}</h2>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {m.contact.sentDesc}
                  </p>
                  <button
                    type="button"
                    className="btn-ghost mt-2"
                    onClick={() => setSent(false)}
                  >
                    {m.contact.sendAnother}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] p-6 md:p-8 flex flex-col gap-5"
                >
                  {/* honeypot */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="flex items-center gap-3 pb-1 border-b border-border/60">
                    <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                      <Send className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-bold text-base">{m.contact.formTitle}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {m.contact.formHint}
                      </p>
                    </div>
                  </div>

                  {/* Name + Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={m.contact.name} id="name" name="name" required />
                    <Field
                      label={m.contact.phone}
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="msg" className="text-sm font-medium">
                      {m.contact.message} <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="msg"
                      name="msg"
                      rows={5}
                      required
                      className="contact-textarea w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder={m.contact.messagePh}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitLead.isPending}
                    className="btn-primary self-start"
                  >
                    {submitLead.isPending ? m.contact.sending : m.contact.send}
                    {!submitLead.isPending && <ArrowLeft className="h-4 w-4 rtl-flip" />}
                  </button>
                </form>
              )}
            </div>

            {/* ── Aside ── */}
            <aside className="order-1 lg:order-2 flex flex-col gap-4">
              <MarketsServeStrip />

              {/* WhatsApp CTA */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-[#25D366] text-white p-5 shadow-lg hover:shadow-[0_12px_28px_-6px_rgb(37_211_102_/_0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="h-11 w-11 rounded-xl bg-white/20 grid place-items-center shrink-0">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <span className="flex-1 min-w-0">
                  <strong className="block font-bold text-sm">{m.contact.waTitle}</strong>
                  <span className="text-xs opacity-90">{m.contact.waHint}</span>
                </span>
                <ArrowLeft className="h-4 w-4 shrink-0 opacity-80 rtl-flip" />
              </a>

              {/* Contact info */}
              <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
                <h3 className="font-bold text-sm">{m.contact.details}</h3>

                <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <a
                      href={`mailto:${email}`}
                      dir="ltr"
                      className="hover:text-primary transition-colors truncate"
                    >
                      {email}
                    </a>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 mt-0.5">
                      <Phone className="h-3.5 w-3.5" />
                    </span>
                    <MarketsPhoneCards phoneUae={phoneUae} phoneSa={phoneSa} />
                  </li>

                  {address && (
                    <li className="flex items-start gap-3">
                      <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 mt-0.5">
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-relaxed">{address}</span>
                    </li>
                  )}
                </ul>

                <SocialLinks className="justify-start" />
              </div>

              {/* Perks */}
              <ul className="flex flex-wrap gap-2">
                {[
                  { icon: Check, text: m.home.trustReply },
                  { icon: Check, text: m.home.trustConsult },
                  { icon: Check, text: m.home.trustNoCommit },
                ].map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-surface border border-border rounded-full px-3 py-1.5"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </aside>
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
    <div className="flex flex-col gap-1.5 min-w-0">
      <label htmlFor={id} className="text-sm font-medium">
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
        className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow"
      />
    </div>
  );
}

function ContactFaq() {
  const { data: faqs = [], isLoading, isError, refetch } = useFaqs();
  const [open, setOpen] = useState<number | null>(0);
  const items = faqs.slice(0, 4);
  const { m } = useLocale();

  return (
    <section className="section tone-tinted" aria-labelledby="contact-faq-heading">
      <div className="container-page max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="page-intro-eyebrow mx-auto">
            <Clock className="h-3 w-3" aria-hidden /> {m.contact.faqEyebrow}
          </span>
          <h2
            id="contact-faq-heading"
            className="page-intro-title page-intro-title--section mt-3"
          >
            {m.contact.faqTitle}
          </h2>
        </div>

        {isLoading ? <ContentLoading label={m.contact.faqLoading} /> : null}
        {isError ? (
          <ContentError
            message={m.contact.faqFail}
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError && items.length > 0 && (
          <div className="flex flex-col gap-2">
            {items.map((f, i) => {
              const isOpen = open === i;
              const panelId = `contact-faq-panel-${f.id}`;
              return (
                <div
                  key={f.id}
                  className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
                    isOpen
                      ? "border-primary/30 bg-surface shadow-sm"
                      : "border-border bg-surface hover:border-primary/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-start"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="font-medium text-sm leading-snug min-w-0">
                      {f.question}
                    </span>
                    <span
                      className={`h-6 w-6 rounded-full grid place-items-center shrink-0 transition-colors ${
                        isOpen
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                      aria-hidden
                    >
                      {isOpen ? (
                        <Minus className="h-3 w-3" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none break-words"
                      dangerouslySetInnerHTML={{ __html: f.answer }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
