import type { BreadcrumbItem } from "@/lib/seo";

export type LandingPageContent = {
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  intro: string[];
  features: string[];
  process: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  relatedServiceSlug: string;
  breadcrumbs: BreadcrumbItem[];
};

export const SEO_LANDING_PAGES: LandingPageContent[] = [
  {
    slug: "web-design-saudi-arabia",
    path: "/web-design-saudi-arabia",
    title: "تصميم مواقع في السعودية",
    metaTitle: "تصميم مواقع إلكترونية في السعودية | شركة تصميم مواقع | Top1Markting",
    metaDescription:
      "Top1Markting وكالة رقمية تخدم السعودية — تصميم مواقع إلكترونية احترافية، سريعة، ومحسّنة لـ SEO. الرياض، جدة، والدمام.",
    h1: "تصميم مواقع إلكترونية احترافية في السعودية",
    tagline: "مواقع تحوّل الزوار إلى عملاء — مصممة لسوق الخليج",
    intro: [
      "هل تبحث عن شركة تصميم مواقع موثوقة في السعودية؟ Top1Markting وكالة رقمية تخدم الرياض وجدة والدمام — نبني مواقع إلكترونية تعكس احترافية شركتك وتظهر في نتائج Google السعودية.",
      "نصمم مواقع تعريفية للشركات، صفحات هبوط للحملات، ومواقع مؤسسية متكاملة. كل موقع متجاوب مع الجوال، سريع التحميل، ومحسّن لمحركات البحث من اليوم الأول.",
    ],
    features: [
      "تصميم مخصص يعكس هوية علامتك",
      "تحسين SEO مدمج في كل صفحة",
      "سرعة تحميل عالية (Core Web Vitals)",
      "لوحة تحكم سهلة بالعربية",
      "دعم فني مستمر بعد الإطلاق",
    ],
    process: [
      { title: "استشارة مجانية", description: "نفهم نشاطك وأهدافك وميزانيتك." },
      { title: "تصميم وتطوير", description: "نصمم ونبني موقعك بأحدث التقنيات." },
      { title: "إطلاق وتحسين", description: "نطلق الموقع ونحسّنه بناءً على البيانات." },
    ],
    faqs: [
      {
        question: "كم تكلفة تصميم موقع في السعودية؟",
        answer: "نحدد النطاق حسب احتياجك. تواصل معنا عبر واتساب أو النموذج ونوضح التفاصيل معاً.",
      },
      {
        question: "هل تخدمون الرياض وجدة والدمام؟",
        answer: "نعم — نعمل عن بُعد مع فرق في السعودية والإمارات، مع اجتماعات وورش عمل عند الحاجة.",
      },
    ],
    relatedServiceSlug: "web-design",
    breadcrumbs: [
      { name: "الرئيسية", path: "/" },
      { name: "تصميم مواقع السعودية", path: "/web-design-saudi-arabia" },
    ],
  },
  {
    slug: "seo-services",
    path: "/seo-services",
    title: "خدمات SEO",
    metaTitle: "خدمات SEO وتحسين محركات البحث | Top1Markting",
    metaDescription:
      "خدمات SEO احترافية لرفع ترتيب موقعك في Google. تدقيق تقني، استراتيجية محتوى، وبناء روابط. نتائج قابلة للقياس.",
    h1: "خدمات تحسين محركات البحث (SEO)",
    tagline: "نمو عضوي مستدام — من Google إلى عملائك",
    intro: [
      "الظهور في الصفحة الأولى من Google يعني عملاء أكثر بتكلفة أقل. Top1Markting تقدم خدمات SEO شاملة: تدقيق تقني، تحسين On-Page، استراتيجية محتوى، وبناء روابط خلفية.",
      "نستهدف الكلمات المفتاحية الأكثر قيمة لنشاطك في السعودية والإمارات، مع تقارير شهرية شفافة تربط الترتيب بالزيارات والعملاء.",
    ],
    features: [
      "تدقيق SEO تقني شامل",
      "استراتيجية كلمات مفتاحية",
      "كتابة محتوى SEO بالعربية",
      "Schema Markup وبيانات منظمة",
      "تقارير شهرية بمؤشرات واضحة",
    ],
    process: [
      { title: "تدقيق", description: "فحص شامل للموقع والمنافسين." },
      { title: "استراتيجية", description: "خطة كلمات مفتاحية ومحتوى." },
      { title: "تنفيذ وقياس", description: "تحسينات مستمرة وتقارير شهرية." },
    ],
    faqs: [
      {
        question: "متى أرى نتائج SEO؟",
        answer: "التحسينات التقنية خلال أسابيع. النمو العضوي الكبير يحتاج 3-6 أشهر.",
      },
    ],
    relatedServiceSlug: "seo",
    breadcrumbs: [
      { name: "الرئيسية", path: "/" },
      { name: "خدمات SEO", path: "/seo-services" },
    ],
  },
  {
    slug: "ecommerce-development",
    path: "/ecommerce-development",
    title: "تطوير متاجر إلكترونية",
    metaTitle: "تصميم متجر إلكتروني احترافي | تطوير تجارة إلكترونية | Top1Markting",
    metaDescription:
      "تصميم وتطوير متاجر إلكترونية احترافية مع دفع إلكتروني وإدارة مخزون. متاجر سريعة ومحسّنة للتحويل.",
    h1: "تصميم وتطوير متاجر إلكترونية",
    tagline: "متجرك يبيع 24/7 — بلا حدود جغرافية",
    intro: [
      "التجارة الإلكترونية تنمو بسرعة في السعودية والإمارات. Top1Markting تبني متاجر إلكترونية احترافية مع دفع إلكتروني، إدارة مخزون، وتكامل شحن — كل ما تحتاجه للبيع أونلاين في الخليج.",
      "نركّز على تجربة شراء سلسة، سرعة التحميل، وتحسين SEO للمنتجات لجذب زوار من Google مجاناً.",
    ],
    features: [
      "تصميم متجر جذاب وسهل الاستخدام",
      "تكامل بوابات الدفع المحلية",
      "إدارة منتجات ومخزون",
      "تحسين SEO للمنتجات",
      "تقارير مبيعات وتحليلات",
    ],
    process: [
      { title: "تخطيط", description: "هيكل المتجر والمنتجات وطرق الدفع." },
      { title: "تصميم وبناء", description: "واجهة المتجر ولوحة التحكم." },
      { title: "إطلاق", description: "اختبار، تدريب، وإطلاق المتجر." },
    ],
    faqs: [
      {
        question: "ما الفرق بين الموقع التعريفي والمتجر؟",
        answer: "الموقع التعريفي يعرض خدماتك. المتجر يتيح البيع المباشر مع سلة ودفع.",
      },
    ],
    relatedServiceSlug: "web-apps",
    breadcrumbs: [
      { name: "الرئيسية", path: "/" },
      { name: "متاجر إلكترونية", path: "/ecommerce-development" },
    ],
  },
  {
    slug: "digital-marketing",
    path: "/digital-marketing",
    title: "تسويق رقمي",
    metaTitle: "شركة تسويق رقمي | إعلانات Google وسوشيال ميديا | Top1Markting",
    metaDescription:
      "خدمات تسويق رقمي احترافية: Google Ads، Meta Ads، إدارة سوشيال ميديا، وصفحات هبوط محسّنة للتحويل.",
    h1: "خدمات التسويق الرقمي",
    tagline: "حملات مدفوعة بنتائج قابلة للقياس",
    intro: [
      "الإعلان الرقمي أسرع طريقة لجذب عملاء — إذا أُدار بشكل صحيح. Top1Markting تدير حملات Google Ads وMeta Ads مع تحليل ROAS وتتبع كل تحويل.",
      "نبني صفحات هبوط محسّنة، نستهدف الجمهور المناسب، ونحسّن الحملات أسبوعياً لخفض تكلفة العميل وزيادة العائد.",
    ],
    features: [
      "إعلانات Google وMeta Ads",
      "إدارة حسابات السوشيال ميديا",
      "صفحات هبوط محسّنة للتحويل",
      "تتبع وتحليلات GA4",
      "تقارير أداء أسبوعية",
    ],
    process: [
      { title: "استراتيجية", description: "تحديد الجمهور والقنوات والميزانية." },
      { title: "تنفيذ", description: "إطلاق الحملات وصفحات الهبوط." },
      { title: "تحسين", description: "A/B testing وتحسين مستمر." },
    ],
    faqs: [
      {
        question: "ما الحد الأدنى لميزانية الإعلانات؟",
        answer: "نعمل مع ميزانيات متنوعة. ننصح بميزانية إعلانية شهرية مناسبة لقطاعك لنتائج ملموسة.",
      },
    ],
    relatedServiceSlug: "digital-solutions",
    breadcrumbs: [
      { name: "الرئيسية", path: "/" },
      { name: "تسويق رقمي", path: "/digital-marketing" },
    ],
  },
];

export function getLandingPageByPath(path: string): LandingPageContent | undefined {
  return SEO_LANDING_PAGES.find((p) => p.path === path);
}
