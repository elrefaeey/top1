import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import type { LandingPageContent } from "@/lib/seo/landing-pages";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";

type SeoLandingTemplateProps = {
  page: LandingPageContent;
};

export function SeoLandingTemplate({ page }: SeoLandingTemplateProps) {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page relative pt-8 pb-14">
          <BreadcrumbNav items={page.breadcrumbs} className="mb-8" />

          <div className="max-w-3xl">
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 rounded-full px-3 py-1 mb-5">
              <Sparkles className="h-3 w-3" aria-hidden />
              {page.tagline}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.2]">
              {page.h1}
            </h1>

            <div className="mt-5 space-y-3">
              {page.intro.map((p) => (
                <p key={p.slice(0, 40)} className="text-lg text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">
                احصل على استشارة مجانية
                <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
              <Link
                to="/services/$slug"
                params={{ slug: page.relatedServiceSlug }}
                className="btn-ghost"
              >
                تفاصيل الخدمة
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="section tone-tinted">
        <div className="container-page">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              لماذا Top1Markting؟
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              مميزات تجعلنا الخيار الأول لعملائنا في السعودية والإمارات
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {page.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary shrink-0" aria-hidden />
                <span className="text-sm leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="section">
        <div className="container-page">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">كيف نعمل</h2>
            <p className="mt-2 text-sm text-muted-foreground">خطوات واضحة من البداية للإطلاق</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 relative">
            {/* connector line */}
            <div
              aria-hidden
              className="hidden md:block absolute top-11 start-[18%] end-[18%] h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            {page.process.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border bg-surface p-6 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-center md:justify-start mb-4">
                  <span className="h-11 w-11 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-black shadow-md">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-bold text-base">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      {page.faqs.length > 0 && (
        <section className="section tone-tinted">
          <div className="container-page max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">أسئلة شائعة</h2>
              <p className="mt-2 text-sm text-muted-foreground">إجابات سريعة على أكثر الأسئلة شيوعاً</p>
            </div>
            <FaqList faqs={page.faqs} />
          </div>
        </section>
      )}

      {/* ─── Related links ─── */}
      {page.relatedLinks && page.relatedLinks.length > 0 && (
        <section className="section">
          <div className="container-page">
            <InternalLinksBlock title="صفحات ذات صلة" links={page.relatedLinks} />
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="section pb-20">
        <div className="container-page">
          <div className="home-cta-block relative text-center">
            <span className="relative page-intro-eyebrow !border-white/25 !bg-white/15 !text-white mx-auto">
              <Sparkles className="h-3 w-3" /> ابدأ الآن
            </span>
            <h2 className="relative mx-auto mt-4 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">
              جاهز للبدء؟
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/80">
              تواصل معنا عبر واتساب أو اترك رسالة — نرد خلال 24 ساعة، بدون التزام.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-primary">
                تواصل معنا <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
              <Link to="/portfolio" className="btn-ghost">
                شاهد أعمالنا
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── FAQ accordion ── */
function FaqList({ faqs }: { faqs: LandingPageContent["faqs"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-2">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={faq.question}
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
            >
              <span className="font-semibold text-sm leading-snug min-w-0">{faq.question}</span>
              <span
                className={`h-6 w-6 rounded-full grid place-items-center shrink-0 transition-all ${
                  isOpen
                    ? "bg-primary text-primary-foreground rotate-180"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-hidden
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
