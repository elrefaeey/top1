import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { reportClientError } from "../lib/client-error-reporting";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { WhatsAppButton } from "../components/site/WhatsAppButton";
import { DeferredFirebaseAnalytics } from "../components/site/DeferredFirebaseAnalytics";
import { GoogleAnalytics } from "../components/site/GoogleAnalytics";
import { GoogleTagManager } from "../components/site/GoogleTagManager";
import { ToastProvider } from "../components/site/Toast";
import { SITE_NAME } from "@/lib/site-config";
import { rootJsonLdScripts } from "@/lib/seo";
import { LocaleProvider, useT } from "@/providers/LocaleProvider";
import { applyDocumentLocale, LOCALE_BOOTSTRAP_SCRIPT, readStoredLocale } from "@/lib/i18n/locale";

function NotFoundComponent() {
  const m = useT();
  return (
    <div
      className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center"
      role="main"
      aria-labelledby="not-found-title"
    >
      <span className="eyebrow">{m.notFound.eyebrow}</span>
      <h1 id="not-found-title" className="mt-6 text-6xl md:text-7xl font-bold tracking-tight">
        {m.notFound.title}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">{m.notFound.desc}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          {m.notFound.home}
        </Link>
        <Link to="/contact" className="btn-ghost">
          {m.notFound.contact}
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const m = useT();
  useEffect(() => {
    reportClientError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="eyebrow">{m.error.eyebrow}</span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">{m.error.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{m.error.desc}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            {m.error.retry}
          </button>
          <a href="/" className="btn-ghost">
            {m.error.home}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const meta: Array<Record<string, string>> = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: SITE_NAME },
      { name: "theme-color", content: "#1149B0" },
      { name: "geo.region", content: "SA;AE" },
      { name: "geo.placename", content: "Saudi Arabia, United Arab Emirates" },
      {
        name: "DC.coverage",
        content: "Saudi Arabia; United Arab Emirates; Riyadh; Dubai; Abu Dhabi; Al-Qassim",
      },
    ];
    const gsc = import.meta.env.VITE_GSC_VERIFICATION?.trim();
    if (gsc) {
      meta.push({ name: "google-site-verification", content: gsc });
    }
    return {
      meta,
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/tajawal-400-arabic.woff2", crossOrigin: "anonymous" },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/tajawal-700-arabic.woff2", crossOrigin: "anonymous" },
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "shortcut icon", href: "/favicon.ico" },
      ],
      scripts: rootJsonLdScripts(),
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_BOOTSTRAP_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isAdminRoute = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });

  useEffect(() => {
    applyDocumentLocale(readStoredLocale());
  }, [isAdminRoute]);

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <ToastProvider>
          {/* Auth + Firestore stay out of the public shell — see AdminProviders under /admin */}
          {!isAdminRoute ? <DeferredFirebaseAnalytics /> : null}
          {!isAdminRoute ? <GoogleAnalytics /> : null}
          <GoogleTagManager />
          {isAdminRoute ? (
            <Outlet />
          ) : (
            <PublicShell />
          )}
        </ToastProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

function PublicShell() {
  const m = useT();
  return (
    <div className="site-shell flex min-h-screen flex-col overflow-x-clip">
      <a href="#main-content" className="skip-link">
        {m.skipToContent}
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
