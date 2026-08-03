import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, Sparkles } from "lucide-react";
import { SectionIntro } from "@/components/site/SectionIntro";
import { ContentError, Skeleton } from "@/components/site/ContentState";
import { useHomeBundle } from "@/hooks/use-cms";
import { preferListingData } from "@/lib/seo/listing-data";
import type { FaqItem, WithId } from "@/types/cms";

/** Eager FAQ block — kept out of the lazy home chunk so SSR HTML includes Q&A. */
export function HomeFaqSection({ initialFaqs = [] }: { initialFaqs?: WithId<FaqItem>[] }) {
  const { data: home, isLoading, isError, refetch } = useHomeBundle();
  const faqs = preferListingData(initialFaqs, home?.faqs);
  const [open, setOpen] = useState<number | null>(0);
  const showFaqs = !isError && faqs.length > 0;
  const showSkeleton = !showFaqs && isLoading && initialFaqs.length === 0;

  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <SectionIntro eyebrow="أسئلة شائعة" title="إجابات سريعة." centered />
        {showSkeleton ? (
          <div className="section-body flex flex-col gap-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : null}
        {isError && faqs.length === 0 ? (
          <ContentError message="تعذّر تحميل الأسئلة الشائعة." onRetry={() => void refetch()} />
        ) : null}
        {showFaqs ? (
          <div className="section-body flex flex-col gap-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              const panelId = `home-faq-panel-${f.id}`;
              return (
                <div key={f.id} className="faq-item-new" data-open={isOpen}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="min-w-0 font-medium text-[0.9375rem]">{f.question}</span>
                    <span className="faq-trigger-icon" aria-hidden>
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </button>
                  {isOpen ? (
                    <div
                      id={panelId}
                      className="prose prose-sm max-w-none break-words px-5 pb-5 text-sm leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: f.answer }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Eager CTA so it stays after FAQ without pulling the lazy home chunk. */
export function HomeCtaSection() {
  return (
    <section className="section section-compact-top pb-16">
      <div className="container-page">
        <div className="home-cta-block relative">
          <span className="relative page-intro-eyebrow !border-white/25 !bg-white/15 !text-white">
            <Sparkles className="h-3 w-3" /> ابدأ الآن
          </span>
          <h2 className="relative mx-auto mt-3 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">
            جاهز تضاعف leads من Google؟
          </h2>
          <p className="relative mx-auto mt-2.5 max-w-lg text-sm text-white/80">
            تواصل معنا عبر واتساب أو اترك رسالة — نرد خلال 24 ساعة.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary">
              تواصل معنا <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
            <Link to="/services" className="btn-ghost">
              استكشف الخدمات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
