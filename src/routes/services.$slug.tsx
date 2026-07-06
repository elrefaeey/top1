import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useService } from "@/hooks/use-cms";
import { getServiceIcon } from "@/lib/cms/icons";
import { SiteImage } from "@/components/site/SiteImage";

import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `خدمة — ${SITE_NAME}` },
      { name: "description", content: `خدمات ${SITE_NAME}.` },
      { property: "og:url", content: `/services/${params.slug}` },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/services/${params.slug}` }],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = useParams({ from: "/services/$slug" });
  const { data: s, isLoading } = useService(slug);

  if (isLoading) {
    return (
      <div className="container-page py-24 text-center text-muted-foreground text-sm">
        جاري تحميل الخدمة…
      </div>
    );
  }

  if (!s) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl font-bold">الخدمة غير موجودة</h1>
        <Link to="/services" className="mt-6 inline-flex btn-primary">كل الخدمات</Link>
      </div>
    );
  }

  const Icon = getServiceIcon(s.icon);
  const deliverables = s.deliverables ?? s.features;
  const process = s.process ?? [];

  return (
    <>
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page relative pb-16 pt-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {s.imageUrl && (
              <SiteImage
                src={s.imageUrl}
                alt={s.title}
                wrapperClassName="order-1 lg:order-2 aspect-[16/10] w-full max-w-xl mx-auto rounded-2xl shadow-[var(--shadow-card-hover)]"
              />
            )}
            <div className="order-2 lg:order-1 max-w-xl">
              <Link to="/services" className="text-sm text-muted-foreground hover:text-primary">← كل الخدمات</Link>
              {s.tagline && (
                <span className="mt-6 eyebrow inline-flex"><Sparkles className="h-3.5 w-3.5" /> {s.tagline}</span>
              )}
              <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-[1.2]">
                {s.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground">{s.description}</p>
              <div className="mt-8 flex gap-3">
                <Link to="/contact" className="btn-primary">ابدأ مشروعك <ArrowLeft className="h-4 w-4 rtl-flip" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--gradient-primary)] text-white">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-2xl md:text-3xl font-bold tracking-tight">ما ستحصل عليه</h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2 surface-card px-4 py-3 text-sm">
                <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {process.length > 0 && (
        <section className="section bg-surface border-y border-border">
          <div className="container-page">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">كيف ننفّذ</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {process.map((p, i) => (
                <div key={p.title} className="surface-card p-6">
                  <div className="text-3xl font-bold text-gradient">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="mt-2 font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
