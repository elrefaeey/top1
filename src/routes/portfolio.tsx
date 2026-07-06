import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteImage } from "@/components/site/SiteImage";
import { PageIntro } from "@/components/site/SectionIntro";
import { usePortfolio } from "@/hooks/use-cms";

import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: `أعمالنا — ${SITE_NAME}` },
      { name: "description", content: "أعمال مختارة — مواقع وتطبيقات وأنظمة هوية لفرق طموحة." },
      { property: "og:title", content: `أعمالنا — ${SITE_NAME}` },
      { property: "og:description", content: `أعمال مختارة من ${SITE_NAME}.` },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

function Portfolio() {
  const { data: items = [] } = usePortfolio();
  const categories = useMemo(() => {
    const cats = [...new Set(items.map((p) => p.category).filter(Boolean))];
    return ["الكل", ...cats] as const;
  }, [items]);
  const [active, setActive] = useState<string>("الكل");
  const shown = active === "الكل" ? items : items.filter((p) => p.category === active);

  return (
    <>
      <PageIntro
        eyebrow="أعمالنا"
        title={<>أعمال <span className="text-gradient">نفتخر بها.</span></>}
        desc="مشاريع حديثة مع علامات وفرق نحب العمل معهم."
      />

      <section className="section pt-0">
        <div className="container-page">
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-16 surface-card">
              لا توجد مشاريع منشورة بعد. ستظهر هنا عند إضافتها من لوحة التحكم.
            </p>
          )}

          {items.length > 0 && (
            <>
              {categories.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                  {categories.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setActive(f)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        active === f
                          ? "bg-[var(--gradient-primary)] text-white border-transparent shadow-[var(--shadow-elevated)]"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/30"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((p) => (
                  <article key={p.id} className="group card-interactive overflow-hidden block">
                    {p.imageUrl ? (
                      <SiteImage
                        src={p.imageUrl}
                        alt={p.title}
                        overlay
                        wrapperClassName="aspect-[4/3] w-full"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full bg-accent grid place-items-center text-muted-foreground text-sm">
                        بدون صورة
                      </div>
                    )}
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{p.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.category}</p>
                      </div>
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          aria-label={`فتح ${p.title}`}
                        >
                          <ArrowUpLeft className="h-4 w-4 rtl-flip" />
                        </a>
                      ) : (
                        <ArrowUpLeft className="h-4 w-4 rtl-flip text-muted-foreground/40" />
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
