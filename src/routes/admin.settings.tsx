import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/types/cms";
import {
  AdminCard,
  AdminField,
  AdminFormActions,
  AdminFetchingBar,
  AdminPageHeader,
  adminInputClass,
} from "@/components/admin/AdminUi";
import { useAdminSiteSettings, useSaveSiteSettings } from "@/hooks/use-admin-cms";
import { formatAdminFirestoreError } from "@/lib/cms/admin-service";
import { SITE_NAME, SITE_LOGO_URL, SITE_CONTACT_EMAIL, SITE_CONTACT_PHONE, SITE_WHATSAPP_NUMBER, SITE_WHATSAPP_MESSAGE, SITE_ADDRESS } from "@/lib/site-config";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

const defaults: SiteSettings = {
  siteName: SITE_NAME,
  tagline: "",
  logoUrl: SITE_LOGO_URL,
  faviconUrl: SITE_LOGO_URL,
  contactEmail: SITE_CONTACT_EMAIL,
  contactPhone: SITE_CONTACT_PHONE,
  whatsappNumber: SITE_WHATSAPP_NUMBER,
  whatsappMessage: SITE_WHATSAPP_MESSAGE,
  address: SITE_ADDRESS,
  socialLinks: {},
  integrations: {},
  robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\nSitemap: https://www.top1markting.com/sitemap.xml",
  headerNav: [],
  footerNav: [],
};

function AdminSettingsPage() {
  const { data, isFetching } = useAdminSiteSettings();
  const save = useSaveSiteSettings();
  const [form, setForm] = useState<SiteSettings>(defaults);
  const [saveError, setSaveError] = useState("");
  const [saveOk, setSaveOk] = useState(false);

  useEffect(() => {
    if (data) setForm({ ...defaults, ...data });
  }, [data]);

  const patch = (p: Partial<SiteSettings>) => {
    setSaveOk(false);
    setForm((f) => ({ ...f, ...p }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    setSaveOk(false);
    try {
      await save.mutateAsync({
        ...form,
        logoUrl: SITE_LOGO_URL,
        faviconUrl: SITE_LOGO_URL,
      });
      setSaveOk(true);
    } catch (err) {
      setSaveError(formatAdminFirestoreError(err));
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <AdminFetchingBar show={isFetching && !data} />
      <AdminPageHeader
        title="إعدادات الموقع"
        description="الاسم، التواصل، وروابط التواصل الاجتماعي."
      />
      {saveError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      )}
      {saveOk && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800">
          تم حفظ الإعدادات بنجاح.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="space-y-4">
          <AdminField label="اسم الموقع" id="siteName">
            <input
              id="siteName"
              value={form.siteName}
              onChange={(e) => patch({ siteName: e.target.value })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label="الشعار (Tagline)" id="tagline">
            <input
              id="tagline"
              value={form.tagline}
              onChange={(e) => patch({ tagline: e.target.value })}
              className={adminInputClass()}
            />
          </AdminField>
          <ImageUploadField
            id="heroImageUrl"
            label="صورة الصفحة الرئيسية (Hero) — غير مستخدمة حالياً في الواجهة"
            folder="hero"
            value={form.heroImageUrl ?? ""}
            onChange={(heroImageUrl) => patch({ heroImageUrl })}
          />
          <AdminField label="وصف الصورة (Alt)" id="heroImageAlt">
            <input
              id="heroImageAlt"
              value={form.heroImageAlt ?? ""}
              onChange={(e) => patch({ heroImageAlt: e.target.value })}
              placeholder="وصف بديل للصورة"
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label="البريد" id="contactEmail">
            <input
              id="contactEmail"
              dir="ltr"
              type="email"
              value={form.contactEmail}
              onChange={(e) => patch({ contactEmail: e.target.value })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <AdminField label="الهاتف" id="contactPhone">
            <input
              id="contactPhone"
              dir="ltr"
              value={form.contactPhone}
              onChange={(e) => patch({ contactPhone: e.target.value })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <AdminField label="WhatsApp (بدون +)" id="whatsapp">
            <input
              id="whatsapp"
              dir="ltr"
              value={form.whatsappNumber}
              onChange={(e) => patch({ whatsappNumber: e.target.value })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <AdminField label="رسالة واتساب الافتراضية" id="whatsappMessage">
            <textarea
              id="whatsappMessage"
              rows={3}
              value={form.whatsappMessage ?? SITE_WHATSAPP_MESSAGE}
              onChange={(e) => patch({ whatsappMessage: e.target.value })}
              className={adminInputClass()}
              placeholder={SITE_WHATSAPP_MESSAGE}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              تظهر تلقائياً في محادثة واتساب عند الضغط على زر الواتساب في الموقع.
            </p>
          </AdminField>
          <AdminField label="العنوان" id="address">
            <input
              id="address"
              value={form.address}
              onChange={(e) => patch({ address: e.target.value })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label="Google Analytics ID" id="ga">
            <input
              id="ga"
              dir="ltr"
              value={form.integrations.googleAnalyticsId ?? ""}
              onChange={(e) =>
                patch({ integrations: { ...form.integrations, googleAnalyticsId: e.target.value } })
              }
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Facebook" id="facebook">
              <input
                id="facebook"
                dir="ltr"
                value={form.socialLinks.facebook ?? ""}
                onChange={(e) =>
                  patch({ socialLinks: { ...form.socialLinks, facebook: e.target.value } })
                }
                className={adminInputClass("text-start")}
              />
            </AdminField>
            <AdminField label="Instagram" id="instagram">
              <input
                id="instagram"
                dir="ltr"
                value={form.socialLinks.instagram ?? ""}
                onChange={(e) =>
                  patch({ socialLinks: { ...form.socialLinks, instagram: e.target.value } })
                }
                className={adminInputClass("text-start")}
              />
            </AdminField>
            <AdminField label="Twitter / X" id="twitter">
              <input
                id="twitter"
                dir="ltr"
                value={form.socialLinks.twitter ?? ""}
                onChange={(e) =>
                  patch({ socialLinks: { ...form.socialLinks, twitter: e.target.value } })
                }
                className={adminInputClass("text-start")}
              />
            </AdminField>
            <AdminField label="LinkedIn" id="linkedin">
              <input
                id="linkedin"
                dir="ltr"
                value={form.socialLinks.linkedin ?? ""}
                onChange={(e) =>
                  patch({ socialLinks: { ...form.socialLinks, linkedin: e.target.value } })
                }
                className={adminInputClass("text-start")}
              />
            </AdminField>
          </div>
        </AdminCard>
        <AdminFormActions saving={save.isPending} />
      </form>
    </div>
  );
}
