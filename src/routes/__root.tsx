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
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { WhatsAppButton } from "../components/site/WhatsAppButton";
import { FirebaseAnalytics } from "../components/site/FirebaseAnalytics";
import { AuthProvider } from "../providers/AuthProvider";
import { FirebaseProvider } from "../providers/FirebaseProvider";
import { SITE_NAME, SITE_LOGO_URL, SITE_TWITTER } from "@/lib/site-config";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <span className="eyebrow">٤٠٤ · غير موجود</span>
      <h1 className="mt-6 text-6xl md:text-7xl font-bold tracking-tight">الصفحة غير موجودة.</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">العودة للرئيسية</Link>
        <Link to="/contact" className="btn-ghost">تواصل معنا</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="eyebrow">حدث خطأ</span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">تعذّر تحميل الصفحة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          جرّب تحديث الصفحة — إذا استمرت المشكلة، ارجع للرئيسية.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-primary"
          >
            إعادة المحاولة
          </button>
          <a href="/" className="btn-ghost">الرئيسية</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} — تصميم مواقع وتطبيقات وSEO احترافي` },
      { name: "description", content: `${SITE_NAME} استوديو رقمي متخصص في تصميم المواقع، تطبيقات الويب، UI/UX وSEO لتحويل الزوار إلى عملاء.` },
      { name: "author", content: SITE_NAME },
      { name: "theme-color", content: "#4F46E5" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: SITE_TWITTER },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700;800&display=swap" },
      { rel: "icon", href: SITE_LOGO_URL, type: "image/jpeg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: "/",
          logo: SITE_LOGO_URL,
          sameAs: [],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
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

  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
      <AuthProvider>
        <FirebaseAnalytics />
        {isAdminRoute ? (
          <Outlet />
        ) : (
          <div className="site-shell flex min-h-screen flex-col overflow-x-clip">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
            <WhatsAppButton />
          </div>
        )}
      </AuthProvider>
      </FirebaseProvider>
    </QueryClientProvider>
  );
}
