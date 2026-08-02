import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionIntro } from "@/components/site/SectionIntro";
import type { FaqItem, WithId } from "@/types/cms";

/** SSR FAQ + CTA — kept out of the lazy below-fold chunk so crawlers see full FAQ HTML. */
export function HomeFaqSection({ faqs }: { faqs: WithId<FaqItem>[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <SectionIntro eyebrow="أسئلة شائعة" title="إجابات سريعة." centered />
        <div className="section-body flex flex-col gap-3">
          {faqs.map((faq) => (
            <details key={faq.id} className="faq-item-new group">
              <summary className="faq-trigger cursor-pointer list-none">
                <span className="min-w-0 font-medium text-[0.9375rem]">{faq.question}</span>
              </summary>
              <div
                className="prose prose-sm max-w-none break-words px-5 pb-5 text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCtaSection() {
  return (
    <section className="section section-compact-top pb-16">
      <div className="container-page">
        <div className="home-cta-block relative">
          <span className="relative page-intro-eyebrow !border-white/25 !bg-white/15 !text-white">
            <Sparkles className="h-3 w-3" /> ابدأ الآن
          </span>
          <h2 className="relative mx-auto mt-3 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">
            جاهز تضاعف عملاءك المحتملين من Google؟
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
