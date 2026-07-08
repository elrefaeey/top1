import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useService } from "@/hooks/use-cms";
import { getServiceIcon } from "@/lib/cms/icons";
import { SiteImage } from "@/components/site/SiteImage";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { loadServiceForSeo } from "@/lib/seo/cms-loaders";
import { footerInternalLinks } from "@/lib/seo/internal-links";
import { getServiceSeoBlock } from "@/lib/seo/service-content";
import { buildPageHead, buildServiceHead } from "@/lib/seo";

import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const service = await loadServiceForSeo(params.slug);
    return { service };
  },
  head: ({ loaderData, params }) => {
    const seoBlock = getServiceSeoBlock(params.slug);
    if (loaderData?.service) {
      return buildServiceHead(loaderData.service, params.slug, seoBlock?.faqs);
    }
    return buildPageHead({
      title: `خدمة — ${SITE_NAME}`,
      description: `خدمات ${SITE_NAME}.`,
      path: `/services/${params.slug}`,
    });
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = useParams({ from: "/services/$slug" });
  const { service: loaderService } = Route.useLoaderData();
  const { data: hookService, isLoading } = useService(slug);
  const s = hookService ?? loaderService;
  const seoBlock = getServiceSeoBlock(slug);

  if (isLoading && !s) {
    return (
      <div className="container-page py-24 text-center text-muted-foreground text-sm">
        جاري تحميل الخدمة…
      </div>
    );
  }

  if (!s) {
    return (
      <main className="container-page py-24 text-center">
        <h1 className="text-3xl font-bold">الخدمة غير موجودة</h1>
        <Link to="/services" className="mt-6 inline-flex btn-primary">كل الخدمات</Link>
      </main>
    );
  }

  const Icon = getServiceIcon(s.icon);
  const deliverables = s.deliverables ?? s.features;
  const process = s.process ?? [];
  const breadcrumbs = [
    { name: "الرئيسية", path: "/" },
    { name: "الخدمات", path: "/services" },
    { name: s.title, path: `/services/${slug}` },
  ];

  return (
    <article itemScope itemType="https://schema.org/Service">
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page relative pb-16 pt-6">
          <BreadcrumbNav items={breadcrumbs} className="mb-6" />
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {s.imageUrl && (
              <SiteImage
                src={s.imageUrl}
                alt={`${s.title} — خدمات ${SITE_NAME}`}
                width={1280}
                height={800}
                fetchPriority="high"
                loading="eager"
                wrapperClassName="order-1 lg:order-2 aspect-[16/10] w-full max-w-xl mx-auto rounded-2xl shadow-[var(--shadow-card-hover)]"
              />
            )}
            <div className="order-2 lg:order-1 max-w-xl">
              {s.tagline && (
                <span className="eyebrow inline-flex">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden /> {s.tagline}
                </span>
              )}
              <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-[1.2]" itemProp="name">
                {s.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground" itemProp="description">
                {s.description}
              </p>
              <div className="mt-8 flex gap-3">
                <Link to="/contact" className="btn-primary">
                  ابدأ مشروعك <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
                <Link to="/portfolio" className="btn-ghost">أعمالنا</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {seoBlock && (
        <section className="section">
          <div className="container-page max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">نظرة عامة</h2>
            <div className="mt-6 space-y-4 text-[17px] leading-[1.85] text-foreground/85">
              {seoBlock.intro.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-page grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="service-card-icon" aria-hidden>
              <Icon />
            </span>
            <h2 className="mt-5 text-2xl md:text-3xl font-bold tracking-tight">ما ستحصل عليه</h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2 surface-card px-4 py-3 text-sm">
                <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden /> {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {seoBlock && (
        <section className="section bg-surface border-y border-border">
          <div className="container-page">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">لماذا تختار Top1Markting؟</h2>
            <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
              {seoBlock.whyChooseUs.map((item) => (
                <li key={item} className="flex items-start gap-2 surface-card px-4 py-3 text-sm">
                  <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {process.length > 0 && (
        <section className="section">
          <div className="container-page">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">كيف ننفّذ</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {process.map((p, i) => (
                <div key={p.title} className="surface-card p-6">
                  <div className="text-3xl font-bold text-gradient" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-2 font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {seoBlock && seoBlock.faqs.length > 0 && (
        <section className="section bg-surface border-y border-border">
          <div className="container-page max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">أسئلة شائعة</h2>
            <div className="mt-8 space-y-4">
              {seoBlock.faqs.map((faq) => (
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

      <section className="section">
        <div className="container-page max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">جاهز للبدء؟</h2>
          <p className="mt-3 text-muted-foreground">
            تواصل معنا عبر واتساب أو النموذج — نرد خلال 24 ساعة.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary">تواصل معنا</Link>
            <Link to="/portfolio" className="btn-ghost">شاهد أعمالنا</Link>
          </div>
          <InternalLinksBlock
            title="روابط ذات صلة"
            links={footerInternalLinks()}
            className="mt-12 text-start"
          />
        </div>
      </section>
    </article>
  );
}
