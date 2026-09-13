export type BlogLocaleCopy = {
  title: string;
  excerpt: string;
  category: string;
  tags?: string[];
  featuredImageAlt?: string;
  /** When omitted, the original CMS HTML is kept (already in this language). */
  content?: string;
};

function article(excerpt: string, sections: Array<{ h: string; p: string }>): string {
  const body = sections.map((s) => `<h2>${s.h}</h2><p>${s.p}</p>`).join("");
  return `<p>${excerpt}</p>${body}`;
}

const WEB = "Web design";
const SEO = "SEO";
const DM = "Digital marketing";

export const BLOG_EN: Record<string, BlogLocaleCopy> = {
  "seo-services-dubai": {
    title: "SEO services in Dubai | Professional SEO company",
    excerpt:
      "Top1Markting provides SEO in Dubai: technical SEO, local SEO, keyword research, content, ecommerce SEO, and website performance.",
    category: SEO,
    tags: ["SEO Dubai", "Local SEO", "Technical SEO", "Ecommerce SEO", "Top1Markting"],
  },
  "website-design-dubai": {
    title: "Website design in Dubai | Professional web design",
    excerpt:
      "Custom website design in Dubai: responsive layouts, bilingual sites, dashboards, integrations, and SEO-ready development.",
    category: WEB,
    tags: [
      "Website design Dubai",
      "Web development Dubai",
      "Custom websites",
      "Responsive design",
      "Bilingual websites",
      "Top1Markting",
    ],
  },
  "design-ecommerce-stores-sharjah": {
    title: "Ecommerce store design in Sharjah | Custom store development",
    excerpt:
      "Custom ecommerce stores in Sharjah with an admin dashboard, payments, shipping, and product and order management — built to sell across the UAE.",
    category: WEB,
    tags: ["Ecommerce Sharjah", "Online store", "Custom development", "Payments", "Shipping"],
    content: article(
      "Custom ecommerce stores in Sharjah with an admin dashboard, payments, shipping, and product and order management — built to sell across the UAE.",
      [
        {
          h: "When do you need an online store in Sharjah?",
          p: "If you sell products, take repeat orders, or want customers in Sharjah and across the UAE to buy without calling, a professional store is the right next step. Top1Markting builds stores around your catalogue, not a generic template.",
        },
        {
          h: "What a successful Sharjah store must include",
          p: "Clear product pages, a simple cart, local payment options, shipping rules, and an Arabic-first mobile experience. The admin should let you edit products, stock, offers, and orders without a developer for daily work.",
        },
        {
          h: "Custom store programming vs a ready-made theme",
          p: "Ready-made themes are faster to start and harder to grow. Custom development fits your checkout, offers, and operations — and stays easier to connect to WhatsApp, accounting, or delivery later.",
        },
        {
          h: "Payments, shipping, and the order journey",
          p: "We map how a customer finds a product, pays, and tracks the order. Gateways and shipping companies are connected to match how you actually fulfil in the Emirates.",
        },
        {
          h: "Mobile selling and SEO for the store",
          p: "Most shoppers in Sharjah browse on their phone. We build fast, responsive pages and set category and product SEO so the store can win organic search — not only ads.",
        },
        {
          h: "Arabic and English storefronts",
          p: "A bilingual store reaches residents and visitors. We structure language, RTL layout, and product content so both versions stay clear and consistent.",
        },
        {
          h: "How we deliver a custom store",
          p: "Discovery, catalogue structure, design, build, payment and shipping tests, then launch with training. After go-live we can add offers, extra languages, or new sales channels.",
        },
      ],
    ),
  },
  "web-development-company-sharjah": {
    title: "Web development company in Sharjah | Custom websites and web systems",
    excerpt:
      "Top1Markting is a Sharjah web development company for custom sites, dashboards, stores, and digital systems — responsive, SEO-ready, and built around your operations.",
    category: WEB,
    tags: ["Web development Sharjah", "Custom websites", "Dashboards", "Web systems"],
    content: article(
      "Top1Markting is a Sharjah web development company for custom sites, dashboards, stores, and digital systems — responsive, SEO-ready, and built around your operations.",
      [
        {
          h: "Custom web development for your Sharjah business",
          p: "We build from your workflows: company sites, internal tools, booking platforms, and stores. The stack is chosen for performance and long-term maintenance, not a one-size theme.",
        },
        {
          h: "Custom websites from scratch",
          p: "From information architecture to production code, we deliver a site you own — with a dashboard your team can actually use, and room to add features after launch.",
        },
        {
          h: "Integrations and external systems",
          p: "WhatsApp, payments, CRMs, maps, and APIs can be connected so the website is part of operations, not a disconnected brochure.",
        },
        {
          h: "SEO-ready custom development",
          p: "Clean URLs, fast pages, structured headings, and indexable content are part of the build. Technical SEO is cheaper when it is designed in, not bolted on.",
        },
        {
          h: "How a Sharjah project runs",
          p: "Scope, design, sprints, QA on mobile, launch, and handover. You see working slices — not a surprise at the end.",
        },
        {
          h: "Ready-made vs custom code",
          p: "Templates suit very small sites. Custom code suits companies that need unique flows, security, or integrations. We help you choose honestly before you spend.",
        },
      ],
    ),
  },
  "restaurant-cafe-web-design-sharjah": {
    title: "Restaurant and café website design in Sharjah | Menu, site, and ordering",
    excerpt:
      "Restaurant and café websites in Sharjah with digital menus, QR menus, ordering, reservations, WhatsApp, and Google Maps — built to convert walk-ins and delivery demand.",
    category: WEB,
    tags: ["Restaurant websites", "QR menu", "Café websites", "Sharjah"],
    content: article(
      "Restaurant and café websites in Sharjah with digital menus, QR menus, ordering, reservations, WhatsApp, and Google Maps — built to convert walk-ins and delivery demand.",
      [
        {
          h: "A site that matches how the venue actually sells",
          p: "Fine dining, quick service, and cafés need different journeys. We design around the menu, branches, and whether guests book, order, or just need directions.",
        },
        {
          h: "Digital menu and QR menu",
          p: "A clear digital menu — with a QR code on the table — reduces friction and keeps prices and photos up to date from the dashboard, without reprinting every week.",
        },
        {
          h: "Ordering and table reservations",
          p: "We can add online orders and booking flows connected to WhatsApp or your operations, so requests do not get lost in chat history.",
        },
        {
          h: "Mobile-first, Maps, and WhatsApp",
          p: "Guests find you on Google Maps, open the site on their phone, and message WhatsApp in one tap. That path is the conversion funnel for Sharjah hospitality.",
        },
        {
          h: "Multi-branch restaurants",
          p: "Each branch can have its own hours, menu notes, and map pin while you keep one brand and one admin.",
        },
        {
          h: "SEO and local visibility",
          p: "We structure service and location pages so people searching for restaurants or cafés in Sharjah can actually find you — then we connect the site to your Google profile.",
        },
      ],
    ),
  },
  "seo-sharjah": {
    title: "SEO in Sharjah | Search optimization for websites and stores",
    excerpt:
      "Top1Markting provides SEO in Sharjah for websites and stores: technical and local SEO, keywords, competitors, and content — to grow visibility and qualified leads.",
    category: SEO,
    tags: ["SEO Sharjah", "Local SEO", "Technical SEO", "Ecommerce SEO"],
    content: article(
      "Top1Markting provides SEO in Sharjah for websites and stores: technical and local SEO, keywords, competitors, and content — to grow visibility and qualified leads.",
      [
        {
          h: "What SEO in Sharjah actually means",
          p: "It is not a one-time trick. It is technical health, local visibility, and content that matches how people in Sharjah and the UAE search for your service.",
        },
        {
          h: "A strategy built around your business",
          p: "We start with your offer, competitors, and current site. Then we set keyword targets, page priorities, and a monthly plan you can measure.",
        },
        {
          h: "Technical, on-page, and local SEO",
          p: "Speed, indexation, titles, internal links, Google Business Profile, and consistent NAP data. Local SEO is essential if you serve Sharjah neighbourhoods in person.",
        },
        {
          h: "SEO for stores and custom-coded sites",
          p: "Ecommerce needs category and product logic. Custom stacks (React, Laravel, PHP) need crawlable rendering and clean metadata — we handle both.",
        },
        {
          h: "Measurement and Google tools",
          p: "Search Console, Analytics, and ranking reports tied to leads — not vanity traffic. You see what moved and what we will do next.",
        },
        {
          h: "How to choose an SEO company in Sharjah",
          p: "Ask for a method, sample reporting, and honesty about timelines. No one can guarantee page one. We commit to a professional process and transparent work.",
        },
      ],
    ),
  },
  "web-design-company-sharjah": {
    title: "Website design in Sharjah | Custom web and stores for companies",
    excerpt:
      "Looking for website design in Sharjah? Top1Markting designs and builds fast, responsive, SEO-ready company sites and custom stores around your business.",
    category: WEB,
    tags: ["Website design Sharjah", "Custom websites", "Ecommerce Sharjah", "SEO-ready sites"],
    content: article(
      "Looking for website design in Sharjah? Top1Markting designs and builds fast, responsive, SEO-ready company sites and custom stores around your business.",
      [
        {
          h: "Website design for Sharjah companies",
          p: "Your site should explain the offer, look credible, and make contact easy. We design for Arabic-first users, with optional English, and a dashboard for your team.",
        },
        {
          h: "Custom development from scratch",
          p: "We avoid locked templates when your flows are unique. Custom code gives you speed, security, and features that match sales and operations.",
        },
        {
          h: "Company sites, stores, restaurants, and real estate",
          p: "The same quality bar, different page types: services and case studies for firms, catalogues for stores, menus for hospitality, listings for property.",
        },
        {
          h: "SEO, mobile, and integrations",
          p: "Every site ships responsive, fast, and structured for search. WhatsApp, maps, payments, and CRMs can be connected when they help conversion.",
        },
        {
          h: "How a Sharjah website project runs",
          p: "Brief, design, build, content, QA, launch. You approve the look before we lock the code, and you get training on the admin.",
        },
        {
          h: "Why Top1Markting",
          p: "One team for design, development, and SEO foundation — so you are not coordinating three vendors for one launch.",
        },
      ],
    ),
  },
  "web-design-dubai": {
    title: "Website design in Dubai | Custom development in the UAE",
    excerpt:
      "Top1Markting designs and develops custom websites and ecommerce stores in Dubai — responsive, SEO-ready, and built as a complete digital solution.",
    category: WEB,
    tags: ["Website design Dubai", "Custom websites UAE", "Ecommerce Dubai"],
    content: article(
      "Top1Markting designs and develops custom websites and ecommerce stores in Dubai — responsive, SEO-ready, and built as a complete digital solution.",
      [
        {
          h: "A Dubai-ready professional website",
          p: "Dubai visitors judge speed, clarity, and trust in seconds. We build sites that present the brand well on mobile and make enquiry or checkout obvious.",
        },
        {
          h: "Company sites and custom development",
          p: "Corporate sites, service platforms, and dashboards — coded for the features you need, with an admin that does not require a developer for daily edits.",
        },
        {
          h: "Ecommerce in Dubai",
          p: "Stores with product management, payments, and shipping suited to the UAE. Custom when your catalogue or checkout cannot fit a generic theme.",
        },
        {
          h: "Restaurants, real estate, and service businesses",
          p: "Menus and booking for hospitality, listings for property, and lead-focused layouts for professional services — each with Maps and WhatsApp where they help.",
        },
        {
          h: "SEO and digital marketing together",
          p: "The site is structured for search from day one. When you need ads or ongoing SEO, the same team already knows the pages and tracking.",
        },
        {
          h: "Investment and why work with us",
          p: "Scope drives cost and timeline. We quote against a clear brief and stay available after launch for improvements — not a silent handover.",
        },
      ],
    ),
  },
  "best-digital-marketing-company-qassim": {
    title: "Digital marketing company in Qassim | Online marketing in Buraidah",
    excerpt:
      "Top1Markting is a digital marketing company in Qassim offering SEO, ads, social media, and custom websites and stores in Buraidah and the region.",
    category: DM,
    tags: ["Digital marketing Qassim", "SEO Buraidah", "Social media", "Web design Qassim"],
    content: article(
      "Top1Markting is a digital marketing company in Qassim offering SEO, ads, social media, and custom websites and stores in Buraidah and the region.",
      [
        {
          h: "Digital marketing that fits Qassim businesses",
          p: "Local search, WhatsApp, and social proof matter as much as ads. We plan channels around how customers in Buraidah and Qassim actually choose a vendor.",
        },
        {
          h: "SEO, social, and paid ads",
          p: "SEO for lasting visibility, social for daily presence, and paid campaigns when you need faster leads. Reports show cost per enquiry, not just likes.",
        },
        {
          h: "Websites and stores as the conversion base",
          p: "Ads without a fast site waste budget. We design and develop the pages, stores, and landing experiences the campaigns send traffic to.",
        },
        {
          h: "Restaurants, cafés, and local services",
          p: "Menus, maps, and offer campaigns for hospitality; service pages and Google profiles for clinics, contractors, and retail.",
        },
        {
          h: "Coverage across Qassim",
          p: "Buraidah plus Unayzah, Ar Rass, and nearby cities — with local intent in content and targeting, not a generic national template.",
        },
        {
          h: "How we work and what it costs",
          p: "A discovery call, a written plan, then monthly execution. Pricing follows scope (SEO, ads, social, or a full stack). Call 0537309257 to map the right mix.",
        },
      ],
    ),
  },
  "custom-menu-website-development-restaurants-cafes-qassim": {
    title: "Custom menu and website development for restaurants in Qassim",
    excerpt:
      "Custom QR menus and restaurant websites in Qassim: mobile-friendly menus, orders, reservations, WhatsApp, Google Maps, and SEO — built for cafés and restaurants.",
    category: WEB,
    tags: ["QR menu", "Restaurant websites", "Qassim", "Café websites"],
    content: article(
      "Custom QR menus and restaurant websites in Qassim: mobile-friendly menus, orders, reservations, WhatsApp, Google Maps, and SEO — built for cafés and restaurants.",
      [
        {
          h: "A custom QR menu for Qassim venues",
          p: "Guests scan, browse photos and prices, and you update items from an Arabic dashboard. No waiting for a print shop every time a dish changes.",
        },
        {
          h: "A custom website for the restaurant or café",
          p: "Beyond the menu: story, branches, hours, and a clear path to call, WhatsApp, or book. Designed to look right on the phones your guests actually use.",
        },
        {
          h: "Orders, reservations, and payments",
          p: "Online ordering and table booking can be added as real workflows — with optional online payment — instead of a pile of unread messages.",
        },
        {
          h: "Maps, WhatsApp, and mobile SEO",
          p: "We connect Google Maps, click-to-chat, and search-friendly pages so people looking for food in Buraidah or Unayzah can find and contact you.",
        },
        {
          h: "Multi-branch operations",
          p: "One brand, several locations: each branch can have its own menu notes and map pin, managed from the same admin.",
        },
        {
          h: "Qassim coverage",
          p: "Buraidah, Unayzah, Ar Rass, Al Bukayriyah, Al Mithnab, Al Badayea, and nearby cities — same product quality, local contact.",
        },
      ],
    ),
  },
  "digital-marketing-services-cafes-restaurants-qassim": {
    title: "Digital marketing for cafés and restaurants in Qassim",
    excerpt:
      "Digital marketing for Qassim cafés and restaurants: SEO, ads, social, websites, digital menus, ordering, reservations, and Google Maps.",
    category: DM,
    tags: ["Restaurant marketing", "Café marketing", "Qassim", "SEO", "Social media"],
    content: article(
      "Digital marketing for Qassim cafés and restaurants: SEO, ads, social, websites, digital menus, ordering, reservations, and Google Maps.",
      [
        {
          h: "Marketing that fills tables and orders",
          p: "We combine content, ads, and a conversion-ready site so campaigns lead to reservations and delivery — not empty traffic.",
        },
        {
          h: "Social media and content",
          p: "A posting rhythm that shows the food, offers, and atmosphere, with captions and creatives suited to local audiences in Qassim.",
        },
        {
          h: "Paid ads that you can measure",
          p: "Google and Meta campaigns aimed at people nearby, with tracking back to calls, WhatsApp, and forms.",
        },
        {
          h: "Website, QR menu, orders, and booking",
          p: "The marketing stack only works if the destination is fast: menu, order, book, or get directions in a few taps.",
        },
        {
          h: "SEO and Google Maps",
          p: "Local search and Maps are how many guests choose a restaurant. We improve the profile, photos, categories, and site landing pages.",
        },
        {
          h: "New venues, chains, and seasonal offers",
          p: "Launch campaigns for new cafés, multi-branch coordination, and Ramadan or weekend offer pushes — planned, not improvised.",
        },
      ],
    ),
  },
  "digital-marketing-services-restaurants-cafes-saudi-arabia": {
    title: "Digital marketing for cafés and restaurants in Saudi Arabia",
    excerpt:
      "Nationwide restaurant and café marketing with Top1Markting: social, ads, SEO, Google Maps, websites, digital menus, ordering, and reservations.",
    category: DM,
    tags: [
      "Restaurant marketing Saudi Arabia",
      "Café marketing",
      "Social media",
      "Restaurant ads",
      "SEO for restaurants",
    ],
    content: article(
      "Nationwide restaurant and café marketing with Top1Markting: social, ads, SEO, Google Maps, websites, digital menus, ordering, and reservations.",
      [
        {
          h: "A full digital stack for Saudi hospitality",
          p: "Whether you operate in Riyadh, Qassim, or several cities, guests discover you online first. We connect brand, offers, and conversion paths.",
        },
        {
          h: "Social, content, and paid campaigns",
          p: "Consistent creative plus ads that target the right city and intent. You get reporting on reach, cost, and actual enquiries.",
        },
        {
          h: "Websites, menus, QR, orders, and booking",
          p: "We design the site and menu experience so ads and Maps traffic can order or book without friction.",
        },
        {
          h: "SEO and Google Maps across Saudi Arabia",
          p: "Local pages, profile optimization, and search content that match how people look for restaurants and cafés in each city.",
        },
        {
          h: "WhatsApp, loyalty, and influencers",
          p: "Click-to-chat, simple loyalty mechanics, and influencer bursts when they fit the brand — not as a substitute for a real website and tracking.",
        },
        {
          h: "Seasonal campaigns and city coverage",
          p: "Ramadan, National Day, and weekend offers, plus city-level execution starting from Riyadh and Qassim and expanding with your branches.",
        },
      ],
    ),
  },
  "best-web-design-company-uae": {
    title: "Best website design company in the UAE | Professional sites and stores",
    excerpt:
      "Looking for a website design company in the UAE? Top1Markting builds fast, secure, SEO-ready company websites and online stores for every industry.",
    category: WEB,
    tags: ["Website design UAE", "Web design company", "Ecommerce UAE"],
    content: article(
      "Looking for a website design company in the UAE? Top1Markting builds fast, secure, SEO-ready company websites and online stores for every industry.",
      [
        {
          h: "How to choose a web design company in the UAE",
          p: "Look at real work, who writes the code, how SEO is handled, and whether you get an admin and support after launch — not only a pretty mockup.",
        },
        {
          h: "What we design and build",
          p: "Company sites, stores, dashboards, and bilingual experiences. Speed, security, and mobile UX are part of the brief, not extras.",
        },
        {
          h: "UAE-wide delivery",
          p: "Dubai, Abu Dhabi, Sharjah, and the other emirates — remote production with clear WhatsApp and call contact, plus an understanding of bilingual audiences.",
        },
        {
          h: "Industries we work with",
          p: "Professional services, retail, hospitality, property, and industrial firms. The layout changes; the quality bar does not.",
        },
        {
          h: "Project steps and technology",
          p: "Discovery, design, development, QA, launch. Modern web stacks chosen for performance and maintenance, with SEO structure from the first templates.",
        },
        {
          h: "Cost, mistakes to avoid, and next step",
          p: "Price follows pages and features. Avoid the cheapest template if you need leads. Talk to us with your goals and we will propose a realistic scope.",
        },
      ],
    ),
  },
  "seo-company-qassim-buraidah": {
    title: "SEO company in Qassim | Search optimization in Buraidah",
    excerpt:
      "Looking for an SEO company in Qassim? Top1Markting provides search optimization in Buraidah and Qassim to improve Google rankings, traffic, and leads — with plans per industry.",
    category: SEO,
    tags: [
      "SEO Qassim",
      "SEO Buraidah",
      "Local SEO",
      "Technical SEO",
      "Digital marketing Qassim",
    ],
    featuredImageAlt: "SEO company in Qassim — search optimization",
    content: article(
      "Looking for an SEO company in Qassim? Top1Markting provides search optimization in Buraidah and Qassim to improve Google rankings, traffic, and leads — with plans per industry.",
      [
        {
          h: "SEO that helps you show up in Google locally",
          p: "Qassim search is competitive for services people hire nearby. We target the queries your customers type and the pages that can actually rank.",
        },
        {
          h: "Technical, on-page, and off-page work",
          p: "Speed and Core Web Vitals, titles and content, and a sensible link and citation plan. Local SEO includes Maps and consistent business information.",
        },
        {
          h: "How an engagement runs",
          p: "Audit, keyword map, fixes, content, then monthly measurement. You see the backlog and the results — not a black box.",
        },
        {
          h: "SEO by industry and city",
          p: "Company sites, ecommerce (including Salla and Zid), and WordPress — plus local coverage across Buraidah and other Qassim cities.",
        },
        {
          h: "Mistakes that keep you invisible",
          p: "Slow pages, duplicate titles, thin location pages, and ignoring Search Console. We fix the blockers before promising growth.",
        },
        {
          h: "Pricing and why work with us",
          p: "Scope and competition drive investment. We do not sell fake page-one guarantees. We sell a method, reporting, and a team that also builds the websites SEO depends on.",
        },
      ],
    ),
  },
  "website-design-company-qassim-buraidah": {
    title: "Website design company in Qassim | Professional sites in Buraidah",
    excerpt:
      "Looking for a website design company in Qassim? Top1Markting builds 100% custom websites with an easy, secure dashboard — responsive, SEO-ready, and supported across Buraidah and Qassim.",
    category: WEB,
    tags: ["Website design Qassim", "Web design Buraidah", "Custom websites"],
    featuredImageAlt: "Website design company in Qassim",
    content: article(
      "Looking for a website design company in Qassim? Top1Markting builds 100% custom websites with an easy, secure dashboard — responsive, SEO-ready, and supported across Buraidah and Qassim.",
      [
        {
          h: "Custom-coded websites for Qassim businesses",
          p: "A professional site is how companies in Buraidah get taken seriously online. We build around your services, not a recycled template.",
        },
        {
          h: "What you get",
          p: "Responsive design, a usable Arabic admin, SEO foundations, WhatsApp and forms, and the option to grow into a store or booking later.",
        },
        {
          h: "Custom code vs WordPress",
          p: "WordPress can suit simple publishing. Custom development suits unique flows, performance, and long-term control. We recommend based on the brief, not a slogan.",
        },
        {
          h: "Speed, UX, and SEO",
          p: "Fast pages help Google and visitors. Clear UX turns traffic into calls. SEO is planned with the sitemap so you are not redesigning six months later.",
        },
        {
          h: "How the project runs",
          p: "Discovery, design, build, training, launch. Support continues after go-live so you are not left alone with a dashboard you do not understand.",
        },
        {
          h: "Qassim coverage and next step",
          p: "Buraidah and the region’s cities. Share your goals and we will outline scope, timeline, and investment — including current launch offers when available.",
        },
      ],
    ),
  },
};

export const BLOG_AR: Record<string, BlogLocaleCopy> = {
  "seo-services-dubai": {
    title: "خدمات تحسين محركات البحث في دبي | شركة SEO احترافية",
    excerpt:
      "نقدّم في Top1Markting خدمات SEO في دبي: تحسين تقني، SEO محلي، كلمات مفتاحية، محتوى، SEO للمتاجر، وتحسين أداء الموقع.",
    category: "SEO",
    tags: ["SEO دبي", "SEO محلي", "SEO تقني", "SEO للمتاجر", "Top1Markting"],
    featuredImageAlt: "خدمات تحسين محركات البحث في دبي",
    content: article(
      "نقدّم في Top1Markting خدمات SEO في دبي: تحسين تقني، SEO محلي، كلمات مفتاحية، محتوى، SEO للمتاجر، وتحسين أداء الموقع.",
      [
        {
          h: "لماذا تحتاج الشركات في دبي إلى SEO؟",
          p: "العملاء يبحثون في جوجل قبل التواصل. الظهور في النتائج الصحيحة يجلب زيارات أوضح من الإعلان قصير الأمد، ويبني حضوراً رقمياً يستمر بعد انتهاء الحملة.",
        },
        {
          h: "ماذا تشمل خدماتنا في دبي؟",
          p: "بحث كلمات مفتاحية، تحسين الصفحات، SEO تقني، SEO محلي، محتوى، تحليل منافسين، تدقيق الموقع، وبناء أساس يدعم نمواً عضوياً مستداماً للمتاجر والمواقع التعريفية.",
        },
        {
          h: "استراتيجية تناسب سوق دبي",
          p: "نبدأ من نشاطك وجمهورك ومنافسيك في دبي، ثم نحدد الصفحات ذات الأولوية وخطة شهرية قابلة للقياس — بدون وعود وهمية بالصفحة الأولى.",
        },
        {
          h: "SEO تقني، داخل الصفحات، ومحلي",
          p: "السرعة والفهرسة وهيكل الروابط، مع العناوين والمحتوى، بالإضافة إلى ملف النشاط التجاري على جوجل والخرائط إذا كنت تخدم أحياء دبي حضورياً.",
        },
        {
          h: "محتوى عربي وإنجليزي ومتاجر إلكترونية",
          p: "نبحث الكلمات باللغتين ونبني محتوى يطابق نية البحث. للمتاجر نحسّن الفئات والمنتجات والبنية التقنية حتى يستطيع جوجل فهم الكتالوج.",
        },
        {
          h: "القياس والتكلفة واختيار الشريك",
          p: "نربط Search Console والتحليلات بالزيارات والعملاء المحتملين. المدة والتكلفة تتبع المنافسة وحالة الموقع. اسأل عن المنهجية والتقارير، لا عن ضمان ترتيب.",
        },
      ],
    ),
  },
  "website-design-dubai": {
    title: "تصميم مواقع في دبي | تصميم وبرمجة احترافية",
    excerpt:
      "تصميم مواقع احترافية في دبي مع تطوير مخصص، تصميم متجاوب، مواقع ثنائية اللغة، لوحات تحكم، ربط أنظمة، وتجهيز SEO.",
    category: "تصميم مواقع",
    tags: [
      "تصميم مواقع دبي",
      "تطوير مواقع دبي",
      "مواقع مخصصة",
      "تصميم متجاوب",
      "مواقع ثنائية اللغة",
      "Top1Markting",
    ],
    featuredImageAlt: "تصميم مواقع إلكترونية في دبي",
    content: article(
      "تصميم مواقع احترافية في دبي مع تطوير مخصص، تصميم متجاوب، مواقع ثنائية اللغة، لوحات تحكم، ربط أنظمة، وتجهيز SEO.",
      [
        {
          h: "لماذا يحتاج نشاطك في دبي إلى موقع احترافي؟",
          p: "الموقع وجهتك الرسمية: يشرح خدماتك، يبني ثقة، ويسهّل طلب استشارة أو شراء. في سوق دبي التنافسي البطء أو التصميم الضعيف يكلّفك عملاء من أول شاشة.",
        },
        {
          h: "أي نوع موقع يناسب نشاطك؟",
          p: "موقع شركة، صفحة هبوط للحملات، متجر، أو منصة بحجز ولوحة تحكم. نحدد النوع من هدفك التشغيلي لا من قالب جاهز.",
        },
        {
          h: "تصميم UI/UX وتطوير مخصص",
          p: "واجهات واضحة بالعربية والإنجليزية عند الحاجة، وتجربة جوال أولاً، مع برمجة خاصة للوحات التحكم والربط مع واتساب والدفع والأنظمة الخارجية.",
        },
        {
          h: "موقع ثنائي اللغة وجاهز لـ SEO",
          p: "هيكل لغات سليم، اتجاه RTL، وعناوين ومحتوى قابل للفهرسة منذ الإطلاق — حتى لا تعيد البناء بعد أشهر من التسويق.",
        },
        {
          h: "التقنيات والقطاعات",
          p: "نستخدم تقنيات ويب حديثة حسب المشروع. نخدم الشركات، المتاجر، المطاعم، العقارات، والخدمات المهنية في دبي ومناطقها.",
        },
        {
          h: "التكلفة والمدة ولماذا Top1Markting",
          p: "المدة والتكلفة حسب الصفحات والميزات. نوضح النطاق قبل التنفيذ، ونبقى بعد الإطلاق للتطوير. فريق واحد للتصميم والبرمجة وأساس SEO.",
        },
      ],
    ),
  },
};
