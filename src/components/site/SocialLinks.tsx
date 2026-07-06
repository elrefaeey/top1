import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-cms";
import { cn } from "@/lib/utils";

const ICONS = [
  { key: "facebook" as const, label: "Facebook", Icon: Facebook },
  { key: "instagram" as const, label: "Instagram", Icon: Instagram },
  { key: "twitter" as const, label: "Twitter", Icon: Twitter },
  { key: "linkedin" as const, label: "LinkedIn", Icon: Linkedin },
];

export function SocialLinks({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "footer";
}) {
  const { data: settings } = useSiteSettings();
  const links = settings?.socialLinks ?? {};
  const visible = ICONS.filter(({ key }) => links[key]?.trim());

  if (visible.length === 0) return null;

  const btnClass =
    variant === "footer"
      ? "grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 transition-colors"
      : "grid h-9 w-9 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {visible.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={links[key]!}
          target="_blank"
          rel="noopener noreferrer me"
          aria-label={label}
          className={btnClass}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
