import { cn } from "@/lib/utils";

type SectionIntroProps = {
  eyebrow: string;
  title: React.ReactNode;
  desc?: string;
  centered?: boolean;
  as?: "h1" | "h2";
  action?: React.ReactNode;
  className?: string;
};

/** عنوان صفحة داخلية — hero-bg مضغوط */
export function PageIntro({
  eyebrow,
  title,
  desc,
  centered = true,
  as: Tag = "h1",
  className,
}: Omit<SectionIntroProps, "action">) {
  return (
    <section className={cn("page-intro hero-bg", className)}>
      <div className={cn("container-page page-intro-inner", centered && "page-intro-center page-intro-block")}>
        <span className="page-intro-eyebrow">{eyebrow}</span>
        <Tag className="page-intro-title">{title}</Tag>
        {desc && <p className="page-intro-desc">{desc}</p>}
      </div>
    </section>
  );
}

/** عنوان قسم في الصفحة الرئيسية — نفس المقاسات */
export function SectionIntro({
  eyebrow,
  title,
  desc,
  centered,
  action,
}: SectionIntroProps) {
  return (
    <div className={cn("section-intro-row", action && "section-intro-row--action")}>
      <div className={cn("page-intro-block", centered && "page-intro-center")}>
        <span className="page-intro-eyebrow">{eyebrow}</span>
        <h2 className="page-intro-title page-intro-title--section">{title}</h2>
        {desc && <p className="page-intro-desc">{desc}</p>}
      </div>
      {action}
    </div>
  );
}
