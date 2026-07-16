import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Briefcase,
  BookOpen,
  Image,
  Inbox,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  useAdminBlogPosts,
  useAdminFaqs,
  useAdminLeads,
  useAdminPortfolio,
  useAdminServices,
  useAdminTestimonials,
} from "@/hooks/use-admin-cms";
import { seedFirestoreContent } from "@/lib/cms/seed-service";
import { useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/hooks/use-admin-cms";
import { cmsKeys } from "@/hooks/use-cms";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const quickLinks = [
  { to: "/admin/leads", label: "الرسائل", icon: Inbox, desc: "استفسارات الزوار" },
  { to: "/admin/services", label: "الخدمات", icon: Briefcase, desc: "إدارة الخدمات" },
  { to: "/admin/blog", label: "المدونة", icon: BookOpen, desc: "المقالات وSEO" },
  { to: "/admin/portfolio", label: "أعمالنا", icon: Image, desc: "عرض المشاريع" },
  { to: "/admin/faqs", label: "الأسئلة الشائعة", icon: HelpCircle, desc: "أسئلة وأجوبة" },
  { to: "/admin/pages", label: "الصفحات", icon: FileText, desc: "SEO الصفحات" },
  { to: "/admin/seo", label: "SEO", icon: Search, desc: "نظرة عامة SEO" },
];

function AdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: blogPosts = [] } = useAdminBlogPosts();
  const { data: services = [] } = useAdminServices();
  const { data: portfolio = [] } = useAdminPortfolio();
  const { data: testimonials = [] } = useAdminTestimonials();
  const { data: faqs = [] } = useAdminFaqs();
  const { data: leads = [] } = useAdminLeads();
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSeed() {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const result = await seedFirestoreContent();
      await queryClient.invalidateQueries({ queryKey: cmsKeys.all });
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
      setSeedMessage({
        type: "success",
        text: `تم استيراد ${result.services} خدمة، ${result.blogPosts} مقال، ${result.testimonials} رأي عميل، ${result.faqs} سؤال شائع، ${result.siteStats} إحصائية.`,
      });
    } catch (err) {
      setSeedMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "فشل الاستيراد. تحقق من قواعد Firestore والصلاحيات.",
      });
    } finally {
      setSeeding(false);
    }
  }

  const stats = [
    { label: "الرسائل", value: leads.length, icon: Inbox },
    { label: "الخدمات", value: services.length, icon: Briefcase },
    { label: "المقالات", value: blogPosts.length, icon: BookOpen },
    { label: "المشاريع", value: portfolio.length, icon: Image },
    { label: "آراء العملاء", value: testimonials.length, icon: Inbox },
    { label: "الأسئلة الشائعة", value: faqs.length, icon: HelpCircle },
    { label: "الصفحات", value: 6, icon: FileText },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <span className="eyebrow">لوحة التحكم</span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          أهلاً بعودتك{user?.displayName ? `، ${user.displayName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          أدِر محتوى موقعك وSEO والإعدادات من هنا.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="mb-8 surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              استيراد محتوى Firestore
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              استيراد الخدمات والمقالات وآراء العملاء والأسئلة الشائعة.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="btn-primary disabled:opacity-60"
          >
            {seeding ? "جاري الاستيراد…" : "استيراد المحتوى"}
          </button>
        </div>
        {seedMessage && (
          <div
            className={`mt-4 flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
              seedMessage.type === "success"
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {seedMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            {seedMessage.text}
          </div>
        )}
      </div>

      <h2 className="text-sm font-semibold mb-4">إجراءات سريعة</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ to, label, icon: Icon, desc }) => (
          <Link
            key={to}
            to={to}
            className="surface-card p-5 hover:border-primary/30 transition-colors group"
          >
            <Icon className="h-5 w-5 text-primary mb-3" />
            <div className="font-medium group-hover:text-primary transition-colors">{label}</div>
            <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
