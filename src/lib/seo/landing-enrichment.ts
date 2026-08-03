import { siteImages } from "@/lib/site-images";
import type { LandingPageContent } from "@/lib/seo/landing-pages";

type LandingEnrichment = Pick<
  LandingPageContent,
  "ogImage" | "heroImage" | "heroImageAlt" | "localAngle" | "audience"
>;

const WEB = siteImages.landings["web-design"];
const SEO = siteImages.landings.seo;
const ECOM = siteImages.landings.ecommerce;
const DM = siteImages.landings["digital-marketing"];

/**
 * Visual SEO + unique local/audience depth for commercial landings.
 * Kept separate so copy updates stay reviewable and doorway pages stay distinct.
 */
const BY_SLUG: Record<string, LandingEnrichment> = {
  "web-design-saudi-arabia": {
    ogImage: "/og/web-design.jpg",
    heroImage: WEB.src,
    heroImageAlt: WEB.alt,
    localAngle: {
      title: "لماذا السوق السعودي يحتاج موقعاً مختلفاً؟",
      body: "المستخدم السعودي يتصفح غالباً من الجوال، يفضّل تواصلاً سريعاً عبر واتساب، ويتوقع تجربة عربية واضحة. نصمم المواقع حول هذه السلوكيات — لا كترجمة لقوالب أجنبية — مع بنية SEO تدعم الظهور في Google السعودية.",
    },
    audience: {
      title: "لمن نصمّم المواقع في السعودية؟",
      items: [
        "شركات خدمات تريد استفسارات واتساب ومكالمات",
        "علامات تجارية تحتاج موقعاً مؤسسياً يعكس الثقة",
        "متاجر تريد لاحقاً التحويل إلى تجارة إلكترونية",
        "حملات إعلانية تحتاج صفحات هبوط سريعة التحويل",
      ],
    },
  },
  "web-design-riyadh": {
    ogImage: "/og/web-design.jpg",
    heroImage: WEB.src,
    heroImageAlt: `تصميم مواقع لشركات الرياض — ${WEB.alt}`,
    localAngle: {
      title: "تصميم مواقع يلائم منافسة الرياض",
      body: "في العاصمة المنافسة أعلى وقرار الشراء أسرع. لذلك نركّز على وضوح العرض، سرعة الجوال، وصفحات خدمة قابلة للترتيب على كلمات مثل تصميم مواقع الرياض — مع جاهزية للربط بحملات Google وMeta.",
    },
    audience: {
      title: "قطاعات نخدمها في الرياض",
      items: [
        "العيادات والمراكز الطبية الخاصة",
        "شركات المقاولات والعقار والخدمات المهنية",
        "المتاجر والعلامات الاستهلاكية",
        "الشركات الناشئة التي تجهّز جولة تمويل أو إطلاق منتج",
      ],
    },
  },
  "web-design-qassim": {
    ogImage: "/og/web-design.jpg",
    heroImage: WEB.src,
    heroImageAlt: `تصميم مواقع لمنطقة القصيم — ${WEB.alt}`,
    localAngle: {
      title: "شريك رقمي يفهم سوق القصيم",
      body: "شركات القصيم تحتاج حضوراً رقمياً واضحاً يجلب عملاء من بريدة وعنيزة والرس ومن البحث المحلي. نبني مواقع بسيطة التحويل مع إشارات محلية قوية وسهولة تواصل تناسب طبيعة الأعمال في المنطقة.",
    },
    audience: {
      title: "أعمال القصيم التي نخدمها",
      items: [
        "العيادات والصيدليات ومراكز الخدمات",
        "المتاجر والمعارض المحلية",
        "شركات النقل والخدمات اللوجستية",
        "المؤسسات التعليمية والتدريبية",
      ],
    },
  },
  "web-design-buraidah": {
    ogImage: "/og/web-design.jpg",
    heroImage: WEB.src,
    heroImageAlt: `تصميم مواقع في بريدة — ${WEB.alt}`,
    localAngle: {
      title: "من بريدة إلى عملائك",
      body: "مقر Top1Markting في بريدة يمنح مشاريع المدينة تنسيقاً أقرب وفهماً لاحتياجات السوق المحلي. نبني مواقع تساعد شركات بريدة على الظهور في Google وتحويل الزيارات إلى استفسارات حقيقية.",
    },
    audience: {
      title: "مناسب لشركات بريدة التي تريد",
      items: [
        "موقعاً عربياً سريعاً على الجوال",
        "ظهوراً محلياً لكلمات مدينة بريدة",
        "نماذج تواصل وواتساب واضحة",
        "أساساً تقنياً جاهزاً لـ SEO لاحقاً",
      ],
    },
  },
  "seo-services": {
    ogImage: "/og/seo.jpg",
    heroImage: SEO.src,
    heroImageAlt: SEO.alt,
    localAngle: {
      title: "SEO مصمّم لنية البحث السعودية",
      body: "البحث بالعربية له نية تجارية واضحة: شركة، سعر، مدينة، خدمة. نبني استراتيجية كلمات وهيكل صفحات وبيانات منظمة تناسب Google.sa — مع تركيز على الرياض والقصيم وبريدة والأسواق ذات العائد.",
    },
    audience: {
      title: "متى تحتاج خدمة SEO؟",
      items: [
        "موقعك موجود لكن لا يظهر في الصفحة الأولى",
        "تعتمد على الإعلانات فقط وتريد قناة أرخص مستدامة",
        "فتحت فروعاً أو مدناً جديدة وتحتاج بحثاً محلياً",
        "تطلق متجراً وتريد ترتيب فئات ومنتجات",
      ],
    },
  },
  "seo-riyadh": {
    ogImage: "/og/seo.jpg",
    heroImage: SEO.src,
    heroImageAlt: `خدمات SEO في الرياض — ${SEO.alt}`,
    localAngle: {
      title: "تحسين محركات البحث لمنافسة العاصمة",
      body: "الرياض تجمع أعلى كثافة منافسين في نتائج Google. نركز على كلمات تجارية محلية، صفحات خدمة قوية، وتحسين تقني يرفع الظهور لشركات العاصمة دون حشو أو صفحات ضعيفة.",
    },
    audience: {
      title: "شركات الرياض التي تستفيد من SEO",
      items: [
        "الخدمات المهنية والطبية",
        "العقار والمقاولات",
        "التجارة الإلكترونية والتوصيل",
        "العلامات التي تستهدف عملاء داخل الرياض وحولها",
      ],
    },
  },
  "seo-qassim": {
    ogImage: "/og/seo.jpg",
    heroImage: SEO.src,
    heroImageAlt: `خدمات SEO في القصيم — ${SEO.alt}`,
    localAngle: {
      title: "SEO محلي لمنطقة القصيم",
      body: "البحث المحلي في القصيم غالباً يكون عالي النية وقريب من قرار الشراء. نحسّن صفحات المدينة والخدمة، ونبني إشارات محلية تساعد عملاء بريدة وعنيزة والرس على إيجادك قبل المنافس.",
    },
    audience: {
      title: "فرص نمو SEO في القصيم",
      items: [
        "عيادات ومراكز خدمة تبحث عن حجوزات",
        "متاجر تريد زيارات من مدن القصيم",
        "شركات خدمات منزلية ومهنية",
        "أعمال تريد الظهور على اسم المدينة + الخدمة",
      ],
    },
  },
  "seo-buraidah": {
    ogImage: "/og/seo.jpg",
    heroImage: SEO.src,
    heroImageAlt: `خدمات SEO في بريدة — ${SEO.alt}`,
    localAngle: {
      title: "تحسين ظهورك في بريدة",
      body: "كوننا في بريدة يساعدنا على فهم الكلمات والعروض التي يبحث عنها عملاؤك فعلياً. نربط تحسين الموقع بمحتوى محلي وروابط داخلية إلى صفحات الخدمة والمدن لزيادة فرص الترتيب.",
    },
    audience: {
      title: "نتائج نسعى لها مع عملاء بريدة",
      items: [
        "زيادة الاستفسارات من البحث العضوي",
        "ترتيب أفضل لصفحات الخدمات",
        "ظهور أوضح على كلمات بريدة والقصيم",
        "تقارير شهرية مفهومة للإدارة",
      ],
    },
  },
  "ecommerce-development": {
    ogImage: "/og/ecommerce.jpg",
    heroImage: ECOM.src,
    heroImageAlt: ECOM.alt,
    localAngle: {
      title: "متاجر تفهم الشراء في السعودية",
      body: "نجاح المتجر هنا يعتمد على الجوال أولاً، وضوح السعر والشحن، وبوابات دفع مألوفة، ثم SEO للمنتجات. نبني مسار شراء قصير ونجهّز المتجر للنمو العضوي والإعلانات معاً.",
    },
    audience: {
      title: "أنواع المتاجر التي نبنيها",
      items: [
        "متاجر أزياء وإكسسوارات",
        "متاجر إلكترونيات ومنزل",
        "علامات تبيع عبر واتساب وتريد متجراً رسمياً",
        "شركات جاهزة للتوسع خارج مدينة واحدة",
      ],
    },
  },
  "digital-marketing": {
    ogImage: "/og/digital-marketing.jpg",
    heroImage: DM.src,
    heroImageAlt: DM.alt,
    localAngle: {
      title: "إعلانات مربوطة بتحويل حقيقي",
      body: "في السعودية تكلفة النقرة مرتفعة في قطاعات كثيرة — لذلك نربط الحملة بصفحة هبوط وتتبع تحويل (نموذج/واتساب/اتصال) قبل توسيع الميزانية. الهدف عملاء محتملون بجودة، لا نقرات فقط.",
    },
    audience: {
      title: "حالات استخدام التسويق الرقمي",
      items: [
        "إطلاق خدمة أو فرع في الرياض أو القصيم",
        "توليد عملاء لشركات خدمات",
        "دعم مبيعات متجر إلكتروني",
        "اختبار عرض جديد قبل الاستثمار في SEO طويل الأمد",
      ],
    },
  },
};

export function enrichLandingPage(page: LandingPageContent): LandingPageContent {
  const extra = BY_SLUG[page.slug];
  if (!extra) return page;
  return { ...page, ...extra };
}

export function enrichLandingPages(pages: LandingPageContent[]): LandingPageContent[] {
  return pages.map(enrichLandingPage);
}
