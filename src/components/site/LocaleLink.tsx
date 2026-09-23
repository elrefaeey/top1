import { Link as RouterLink, useRouter, useRouterState } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { useLocale } from "@/providers/LocaleProvider";

type RouterLinkProps = ComponentProps<typeof RouterLink>;

/**
 * Drop-in Link that prefixes `/ar` or `/en` for the active locale.
 */
export function LocaleLink({
  to,
  params,
  children,
  ...rest
}: Omit<RouterLinkProps, "to" | "params"> & {
  to: string;
  params?: Record<string, string>;
  children?: ReactNode;
}) {
  const { locale } = useLocale();
  let path = to;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`$${key}`, value);
    }
  }
  const href = withLocalePrefix(locale, path);
  return (
    <RouterLink to={href as RouterLinkProps["to"]} {...rest}>
      {children}
    </RouterLink>
  );
}

/** Resolve a public href for the active locale (for plain <a> or buttons). */
export function useLocaleHref(path: string): string {
  const { locale } = useLocale();
  return withLocalePrefix(locale, path);
}
