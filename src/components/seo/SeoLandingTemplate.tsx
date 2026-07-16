import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import type { LandingPageContent } from "@/lib/seo/landing-pages";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";

type SeoLandingTemplateProps = {
  page: LandingPageContent;
};

export function SeoLandingTemplate({ page }: SeoLandingTemplateProps) {
  return (
    <>
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page relative pb-16 pt-6">
          <BreadcrumbNav items={page.breadcrumbs} className="mb-6" />
          <div className="max-w-3xl">
            <span className="eyebrow inline-flex">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> {page.tagline}
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-[1.2]">
              {page.h1}
            </h1>
            {page.intro.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="mt-4 text-lg text-muted-foreground leading-relaxed"
              >
                {p}
              </p>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">
                احصل على استشارة مجانية <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden />
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

      <section className="section">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">لماذا Top1Markting؟</h2>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-3xl">
            {page.features.map((f) => (
              <li key={f} className="flex items-start gap-2 surface-card px-4 py-3 text-sm">
                <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden /> {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-surface border-y border-border">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">كيف نعمل</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {page.process.map((step, i) => (
              <div key={step.title} className="surface-card p-6">
                <div className="text-3xl font-bold text-gradient" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.faqs.length > 0 && (
        <section className="section">
          <div className="container-page max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">أسئلة شائعة</h2>
            <div className="mt-8 space-y-4">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="surface-card p-5 group">
                  <summary className="font-semibold cursor-pointer list-none flex items-center justify-between gap-2">
                    {faq.question}
                    <span
                      className="text-primary text-lg group-open:rotate-45 transition-transform"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-surface border-t border-border">
        <div className="container-page text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">جاهز للبدء؟</h2>
          <p className="mt-3 text-muted-foreground">
            تواصل معنا عبر واتساب أو اترك رسالة — نرد خلال 24 ساعة.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary">
              تواصل معنا
            </Link>
            <Link to="/portfolio" className="btn-ghost">
              شاهد أعمالنا
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
