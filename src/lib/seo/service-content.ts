import { serviceSeoContentKey } from "@/lib/seo/service-slug-aliases";

export type ServiceSeoBlock = {
  intro: string[];
  whyChooseUs: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const SERVICE_SEO_CONTENT: Record<string, ServiceSeoBlock> = {
  "web-design": {
    intro: [
      "في عالم يتنافس فيه آلاف الشركات على انتباه العميل خلال ثوانٍ، أصبح الموقع الإلكتروني واجهتك الرسمية الأولى — وليس مجرد كتالوج رقمي. Top1Markting وكالة رقمية تخدم السعودية، مع التركيز على تحويل الزوار إلى عملاء حقيقيين عبر تجربة بصرية متقنة وأداء تقني عالٍ.",
      "نبدأ كل مشروع بفهم عميق لنشاطك التجاري وجمهورك المستهدف وسلوك البحث على Google. هل يبحث عملاؤك عن «شركة تصميم مواقع»؟ أم عن «تصميم موقع شركة»؟ نبني بنية الصفحات والعناوين والمحتوى لتتوافق مع نية البحث الحقيقية، مما يعزز ظهورك في نتائج محركات البحث منذ اليوم الأول.",
      "نصمّم مواقع تعريفية للشركات، وصفحات هبوط للحملات الإعلانية، ومواقع مؤسسية متعددة الأقسام. كل تصميم متجاوب بالكامل مع الهواتف والأجهزة اللوحية، ومحسّن لسرعة التحميل وفق معايير Core Web Vitals — لأن Google يكافئ المواقع السريعة بترتيب أفضل.",
      "فريقنا يجمع بين التصميم الجمالي والهندسة التقنية: نستخدم أحدث تقنيات الويب لبناء مواقع خفيفة، آمنة، وسهلة الإدارة من لوحة تحكم. سواء كنت شركة ناشئة في بريدة أو مؤسسة في أي مدينة سعودية، نقدم لك موقعاً يعكس احترافيتك ويقود نموك الرقمي في السوق السعودي.",
    ],
    whyChooseUs: [
      "تصميم مخصص 100% — لا قوالب جاهزة مكررة",
      "تحسين SEO مدمج في كل صفحة منذ البداية",
      "أداء Lighthouse 90+ كهدف قياسي",
      "دعم عربي كامل مع فريق يفهم السوق المحلي",
      "تسليم سريع مع مراحل واضحة وشفافة",
    ],
    faqs: [
      {
        question: "كم تستغرق عملية تصميم موقع إلكتروني؟",
        answer:
          "الموقع التعريفي يستغرق عادةً من 3 إلى 6 أسابيع حسب عدد الصفحات والمحتوى. نحدد جدولاً زمنياً واضحاً في مرحلة الاكتشاف.",
      },
      {
        question: "هل الموقع سيكون متجاوباً مع الجوال؟",
        answer: "نعم، كل مواقعنا متجاوبة بالكامل ومحسّنة لتجربة الجوال أولاً (Mobile-First).",
      },
      {
        question: "هل تقدمون استضافة وصيانة بعد الإطلاق؟",
        answer:
          "نعم، نقدم صيانة شهرية تشمل التحديثات والنسخ الاحتياطي والدعم الفني. تواصل معنا للتفاصيل.",
      },
    ],
  },
  "web-apps": {
    intro: [
      "المتجر الإلكتروني لم يعد رفاهية — بل ضرورة لكل شركة تريد البيع على مدار الساعة. Top1Markting متخصصة في تصميم وتطوير متاجر إلكترونية احترافية تدعم الدفع الإلكتروني، إدارة المخزون، والتكامل مع شركات الشحن في السعودية.",
      "نبني متاجر على منصات مرنة أو حلول مخصصة حسب حجم مشروعك وميزانيتك. من المتاجر الصغيرة التي تبدأ بعشرات المنتجات، إلى المنصات الكبيرة التي تخدم آلاف الطلبات يومياً — لدينا الخبرة التقنية لتحقيق ذلك.",
      "كل متجر نطوّره يأتي مع لوحة تحكم سهلة الاستخدام باللغة العربية، تحسين SEO للمنتجات والفئات، وصفحات سريعة التحميل تقلل معدل التخلي عن السلة. نركّز على تجربة الشراء السلسة من أول نقرة حتى تأكيد الطلب.",
      "إضافة إلى المتاجر، نطوّر تطبيقات ويب مخصصة: أنظمة حجز، منصات تعليمية، أدوات SaaS، ولوحات تحكم داخلية. نستخدم React وTypeScript وبنية نظيفة تضمن قابلية التوسع والصيانة على المدى الطويل.",
    ],
    whyChooseUs: [
      "تكامل مع بوابات الدفع المحلية والعالمية",
      "تصميم يركّز على معدل التحويل (CRO)",
      "أمان عالٍ وحماية بيانات العملاء",
      "تدريب فريقك على إدارة المتجر",
      "دعم فني مستمر بعد الإطلاق",
    ],
    faqs: [
      {
        question: "ما الفرق بين المتجر الجاهز والمتجر المخصص؟",
        answer:
          "المتجر الجاهز أسرع وأقل تكلفة للبداية. المتجر المخصص يمنحك مرونة كاملة في التصميم والوظائف — نساعدك في اختيار الأنسب.",
      },
      {
        question: "هل يدعم المتجر الدفع بالفيزا ومدى وSTC Pay؟",
        answer: "نعم، نتكامل مع بوابات الدفع المحلية والعالمية حسب احتياجك في السعودية.",
      },
      {
        question: "كم تكلفة تصميم متجر إلكتروني؟",
        answer: "تختلف حسب عدد المنتجات والميزات. تواصل معنا عبر واتساب أو النموذج لشرح احتياجك.",
      },
    ],
  },
  seo: {
    intro: [
      "الظهور في الصفحة الأولى من Google ليس حظاً — بل نتيجة استراتيجية SEO مدروسة ومستمرة. Top1Markting تقدم خدمات تحسين محركات البحث الشاملة للشركات في السعودية، من التدقيق التقني إلى استراتيجية المحتوى وبناء الروابط.",
      "نبدأ بتدقيق شامل لموقعك: سرعة التحميل، البنية التقنية، الفهرسة، الكلمات المفتاحية الحالية، وتحليل المنافسين. نحدد الفرص السريعة (Quick Wins) والاستراتيجية طويلة المدى لتحقيق نمو عضوي مستدام.",
      "فريق SEO لدينا يعمل على ثلاث محاور: SEO تقني (Core Web Vitals، Schema، Sitemap)، SEO On-Page (عناوين، أوصاف، محتوى)، وSEO Off-Page (روابط خلفية، سمعة العلامة). كل شهر تحصل على تقرير واضح يربط الترتيب بالزيارات والعملاء المحتملين.",
      "نستهدف كلمات مفتاحية عالية القيمة مثل «شركة تصميم مواقع»، «تصميم متجر إلكتروني»، «خدمات SEO» — مع التركيز على نية البحث المحلية في السعودية.",
    ],
    whyChooseUs: [
      "تقارير شهرية شفافة بمؤشرات قابلة للقياس",
      "خبرة في السوق العربي وسلوك البحث المحلي",
      "دمج SEO مع تصميم المواقع منذ البداية",
      "لا وعود وهمية — أهداف واقعية ومراحل واضحة",
      "فريق متخصص في التقنية والمحتوى معاً",
    ],
    faqs: [
      {
        question: "متى أرى نتائج SEO؟",
        answer:
          "التحسينات التقنية تظهر خلال 2-4 أسابيع. النتائج العضوية الكبيرة تحتاج 3-6 أشهر حسب المنافسة.",
      },
      {
        question: "هل تضمنون الصفحة الأولى في Google؟",
        answer:
          "لا يمكن لأي شركة ضمان ترتيب محدد. نضمن منهجية احترافية وتقارير شفافة وأهدافاً واقعية.",
      },
      {
        question: "هل تكتبون محتوى المدونة أيضاً؟",
        answer: "نعم، نقدم كتابة محتوى SEO بالعربية ضمن مشاريع المحتوى والتسويق.",
      },
    ],
  },
  "ui-ux": {
    intro: [
      "التصميم الجيد لا يُرى — يُشعر به. خدمة UI/UX من Top1Markting تحوّل المنتجات المعقدة إلى تجارب بسيطة وممتعة يحبها المستخدمون ويعودون إليها. نجمع بين البحث، التصميم البصري، واختبار قابلية الاستخدام لبناء واجهات تحقق أهداف عملك.",
      "نبدأ بفهم المستخدم الحقيقي: من هو؟ ماذا يريد؟ أين يتعثر؟ من خلال مقابلات، تحليل البيانات، ودراسة المنافسين، نبني Personas وUser Journeys واضحة تُوجّه كل قرار تصميمي.",
      "نصمّم Wireframes تفاعلية، نماذج أولية (Prototypes)، وشاشات عالية الدقة (High-Fidelity) مع نظام تصميم موثّق (Design System) يسهّل على فريق التطوير التنفيذ بدقة.",
      "نلتزم بمعايير إمكانية الوصول WCAG لضمان أن منتجك يخدم الجميع — بما في ذلك ذوي الاحتياجات الخاصة. التصميم الجيد ليس رفاهية، بل استثمار في رضا العملاء ومعدل التحويل.",
    ],
    whyChooseUs: [
      "بحث مستخدم حقيقي قبل أي تصميم",
      "نظام تصميم موثّق جاهز للتطوير",
      "اختبار قابلية الاستخدام مع مستخدمين فعليين",
      "تصميم عربي يحترم RTL والثقافة المحلية",
      "تسليم ملفات Figma منظمة وقابلة للتطوير",
    ],
    faqs: [
      {
        question: "ما الفرق بين UI و UX؟",
        answer:
          "UX هو تجربة المستخدم الكاملة (سهولة الاستخدام، المسار). UI هو الشكل البصري (ألوان، خطوط، أزرار). نقدم الاثنين معاً.",
      },
      {
        question: "هل تصممون تطبيقات الجوال أيضاً؟",
        answer: "نعم، نصمم واجهات iOS وAndroid وويب متجاوب ضمن نفس نظام التصميم.",
      },
      {
        question: "كم تستغرق عملية تصميم UI/UX؟",
        answer: "من 2 إلى 6 أسابيع حسب تعقيد المنتج وعدد الشاشات.",
      },
    ],
  },
  "digital-solutions": {
    intro: [
      "التحول الرقمي ليس مشروعاً تقنياً فقط — بل استراتيجية نمو. Top1Markting تقدم حلولاً رقمية متكاملة تشمل التسويق الرقمي، أتمتة العمليات، تكامل الأنظمة، وبناء المنصات المخصصة التي تربط كل أجزاء عملك.",
      "في التسويق الرقمي، ندير حملات Google Ads وMeta Ads مع تحليل دقيق للعائد على الاستثمار (ROAS). نبني صفحات هبوط محسّنة للتحويل، ونربط الحملات بأدوات التحليل لتتبع كل عميل محتمل من أول نقرة حتى البيع.",
      "في الحلول التقنية، نبني أدوات داخلية تلغي العمل اليدوي: ربط CRM بموقعك، أتمتة الفواتير، لوحات تحكم مخصصة، وتكاملات API مع أنظمة ERP والمحاسبة.",
      "سواء كنت تبحث عن شريك تسويق رقمي أو شريك تقني — Top1Markting تجمع الخبرتين تحت سقف واحد، مما يعني استراتيجية متسقة من الإعلان إلى التحويل.",
    ],
    whyChooseUs: [
      "استراتيجية تسويق مبنية على بيانات حقيقية",
      "تكامل كامل بين الموقع والإعلانات والتحليلات",
      "فريق يفهم السوق العربي وسلوك المستهلك المحلي",
      "شفافية كاملة في التقارير والميزانيات",
      "حلول مخصصة حسب احتياج كل مشروع",
    ],
    faqs: [
      {
        question: "ما الفرق بين التسويق الرقمي وSEO؟",
        answer:
          "SEO نمو عضوي طويل المدى. التسويق الرقمي (إعلانات) نتائج فورية مدفوعة. الأفضل الجمع بينهما.",
      },
      {
        question: "هل تديرون حسابات السوشيال ميديا؟",
        answer: "نعم، نقدم إدارة المحتوى والحملات على فيسبوك وإنستغرام ولينكدإن.",
      },
      {
        question: "كيف تقيسون نجاح الحملات؟",
        answer: "عبر Google Analytics 4، تتبع التحويلات، وتقارير شهرية بمؤشرات ROAS وCPA وLTV.",
      },
    ],
  },
};

const SERVICE_SEO_CONTENT_EN: Record<string, ServiceSeoBlock> = {
  "web-design": {
    intro: [
      "In a market where thousands of companies compete for attention in seconds, your website is the first official face of the brand — not just a digital catalogue. Top1Markting is a digital agency serving Saudi Arabia, focused on turning visitors into real clients through a precise visual experience and strong technical performance.",
      "Every project starts with a deep read of your business, audience, and search behaviour on Google. Do clients look for “web design company” or “company website design”? We structure pages, headings, and content around real search intent so you show up from day one.",
      "We design company sites, campaign landing pages, and multi-section institutional websites. Every layout is fully responsive and tuned for Core Web Vitals — because Google rewards fast sites with better rankings.",
      "Our team pairs visual design with engineering: modern web stacks for sites that are light, secure, and easy to manage. Whether you are a startup in Buraidah or a firm anywhere in Saudi Arabia, you get a site that looks professional and drives digital growth.",
    ],
    whyChooseUs: [
      "100% custom design — no recycled templates",
      "SEO built into every page from the start",
      "Lighthouse 90+ as a standard target",
      "Full Arabic support with a team that knows the local market",
      "Fast delivery with clear, transparent stages",
    ],
    faqs: [
      {
        question: "How long does a website take?",
        answer:
          "A brochure site usually takes 3–6 weeks depending on page count and content. We set a clear timeline in discovery.",
      },
      {
        question: "Will the site be mobile-responsive?",
        answer: "Yes. Every site is fully responsive and built mobile-first.",
      },
      {
        question: "Do you offer hosting and maintenance after launch?",
        answer:
          "Yes. Monthly care covers updates, backups, and support. Get in touch for details.",
      },
    ],
  },
  "web-apps": {
    intro: [
      "An online store is no longer optional — it is how companies sell around the clock. Top1Markting designs and builds professional stores with payments, inventory, and shipping integrations in Saudi Arabia.",
      "We build on flexible platforms or custom stacks depending on size and budget — from small catalogues to platforms handling thousands of orders a day.",
      "Every store ships with an Arabic-friendly dashboard, product and category SEO, and fast pages that reduce cart abandonment. We focus on a smooth path from first tap to order confirmation.",
      "Beyond stores, we build custom web apps: booking systems, learning platforms, SaaS tools, and internal dashboards — React, TypeScript, and clean architecture that stay maintainable.",
    ],
    whyChooseUs: [
      "Local and international payment integrations",
      "Design focused on conversion (CRO)",
      "Strong security and customer-data protection",
      "Training for your team to run the store",
      "Ongoing support after launch",
    ],
    faqs: [
      {
        question: "What’s the difference between a ready-made and a custom store?",
        answer:
          "Ready-made is faster and cheaper to start. Custom gives full control over design and features — we help you pick the right path.",
      },
      {
        question: "Does the store support Visa, mada, and STC Pay?",
        answer: "Yes. We integrate local and global gateways based on what you need in Saudi Arabia.",
      },
      {
        question: "How much does an online store cost?",
        answer: "It depends on catalogue size and features. WhatsApp or the form is the fastest way to scope it.",
      },
    ],
  },
  seo: {
    intro: [
      "Page-one visibility on Google is not luck — it is a planned, ongoing SEO programme. Top1Markting delivers full search optimization for companies in Saudi Arabia, from technical audits to content strategy and links.",
      "We start with a full audit: speed, technical structure, indexation, current keywords, and competitors. Then we set quick wins and a long-term plan for sustainable organic growth.",
      "Work runs on three tracks: technical SEO (Core Web Vitals, Schema, sitemap), on-page (titles, descriptions, content), and off-page (backlinks, brand reputation). Each month you get a clear report that ties rankings to visits and leads.",
      "We target high-value queries such as “web design company”, “ecommerce design”, and “SEO services” — with local intent across Saudi Arabia.",
    ],
    whyChooseUs: [
      "Transparent monthly reports with measurable KPIs",
      "Experience in Arabic search behaviour and the local market",
      "SEO built into website design from day one",
      "No fake guarantees — realistic goals and clear stages",
      "A team that covers both technical SEO and content",
    ],
    faqs: [
      {
        question: "When will I see SEO results?",
        answer:
          "Technical fixes often show in 2–4 weeks. Larger organic gains usually take 3–6 months depending on competition.",
      },
      {
        question: "Do you guarantee page one on Google?",
        answer:
          "No agency can guarantee a specific rank. We guarantee a professional method, transparent reports, and realistic goals.",
      },
      {
        question: "Do you also write blog content?",
        answer: "Yes. Arabic SEO content is part of our content and marketing work.",
      },
    ],
  },
  "ui-ux": {
    intro: [
      "Good design is felt more than seen. Top1Markting’s UI/UX service turns complex products into simple experiences people return to. We combine research, visual design, and usability testing to build interfaces that hit business goals.",
      "We start with the real user: who they are, what they want, where they get stuck. Interviews, data, and competitor review produce personas and journeys that guide every design decision.",
      "We deliver interactive wireframes, prototypes, high-fidelity screens, and a documented design system so engineering can implement accurately.",
      "We follow WCAG accessibility so the product works for everyone. Good design is an investment in satisfaction and conversion — not decoration.",
    ],
    whyChooseUs: [
      "Real user research before any screens",
      "A documented design system ready for development",
      "Usability testing with actual users",
      "Arabic design that respects RTL and local culture",
      "Organised, scalable Figma files",
    ],
    faqs: [
      {
        question: "What’s the difference between UI and UX?",
        answer:
          "UX is the full experience (ease, flow). UI is the visual layer (colour, type, controls). We deliver both together.",
      },
      {
        question: "Do you also design mobile apps?",
        answer: "Yes. iOS, Android, and responsive web within the same design system.",
      },
      {
        question: "How long does UI/UX take?",
        answer: "Usually 2–6 weeks depending on product complexity and screen count.",
      },
    ],
  },
  "digital-solutions": {
    intro: [
      "Digital transformation is a growth strategy, not only a tech project. Top1Markting delivers connected solutions: digital marketing, process automation, system integrations, and custom platforms that link the parts of your business.",
      "In marketing we run Google Ads and Meta Ads with a clear view of ROAS. We build conversion-focused landings and connect campaigns to analytics so every lead is tracked from click to sale.",
      "On the product side we build internal tools that remove manual work: CRM connected to the site, invoice automation, custom dashboards, and API links to ERP and accounting.",
      "Whether you need a marketing partner or a technical partner — Top1Markting covers both, so the strategy stays consistent from ads to conversion.",
    ],
    whyChooseUs: [
      "Marketing strategy built on real data",
      "Full connection between site, ads, and analytics",
      "A team that understands Arabic markets and local behaviour",
      "Full transparency on reports and budgets",
      "Custom solutions for each project",
    ],
    faqs: [
      {
        question: "What’s the difference between digital marketing and SEO?",
        answer:
          "SEO is long-term organic growth. Paid ads deliver faster, paid results. The strongest programmes combine both.",
      },
      {
        question: "Do you manage social accounts?",
        answer: "Yes. Content and campaigns on Facebook, Instagram, and LinkedIn.",
      },
      {
        question: "How do you measure campaign success?",
        answer: "Google Analytics 4, conversion tracking, and monthly reports on ROAS, CPA, and LTV.",
      },
    ],
  },
};

export function getServiceSeoBlock(slug: string, locale: "ar" | "en" = "ar"): ServiceSeoBlock | null {
  const key = serviceSeoContentKey(slug);
  if (locale === "en") return SERVICE_SEO_CONTENT_EN[key] ?? SERVICE_SEO_CONTENT[key] ?? null;
  return SERVICE_SEO_CONTENT[key] ?? null;
}
