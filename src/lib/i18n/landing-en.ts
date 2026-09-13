import type { LandingEnCopy } from "@/lib/i18n/cms-en";

function webDesignCity(city: string, country: "Saudi Arabia" | "UAE", extras?: Partial<LandingEnCopy>): LandingEnCopy {
  const inCity = `in ${city}`;
  return {
    title: `Web design ${inCity}`,
    h1: `Professional website design ${inCity}`,
    tagline: `A digital presence built for businesses ${inCity}`,
    intro: [
      `Looking for a reliable web design company ${inCity}? Top1Markting builds fast, Arabic-ready, SEO-friendly websites for companies across ${country} — with clear offers and conversion paths.`,
      `We design company sites, landing pages, and full multi-section websites. Every project is responsive, quick to load, and structured for search from day one.`,
      `Whether you are launching or redesigning, we deliver a site that looks professional on mobile and makes contact or booking easy for customers ${inCity}.`,
    ],
    features: [
      "Custom design that matches your brand",
      "SEO structure built into every page",
      "Strong Core Web Vitals performance",
      "Easy Arabic content dashboard",
      "Support after launch",
    ],
    process: [
      { title: "Free consult", description: "We map your offer, goals, and budget." },
      { title: "Design & build", description: "We design and develop with modern stacks." },
      { title: "Launch & improve", description: "We go live and refine using real data." },
    ],
    faqs: [
      {
        question: `How much does web design cost ${inCity}?`,
        answer: "Scope drives cost. Message us on WhatsApp or the form and we’ll outline a clear proposal.",
      },
      {
        question: `Do you serve companies ${inCity}?`,
        answer: `Yes — we work remotely with clients ${inCity} and across ${country}, with calls whenever needed.`,
      },
      {
        question: "Is the site mobile-friendly and SEO-ready?",
        answer: "Yes. Responsive layouts, speed, and on-page SEO foundations are part of every build.",
      },
    ],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: `Web design ${city}`, path: extras?.breadcrumbs?.[1]?.path ?? "/" },
    ],
    ...extras,
  };
}

function seoCity(city: string, country: "Saudi Arabia" | "UAE", path: string): LandingEnCopy {
  return {
    title: `SEO services ${city}`,
    h1: `SEO services in ${city}`,
    tagline: "Sustainable organic growth that turns search into clients",
    intro: [
      `Top1Markting provides SEO in ${city} for companies that want stronger Google visibility, more qualified traffic, and clearer reporting.`,
      `Work covers technical SEO, on-page optimization, local SEO, content, and competitor analysis — tied to leads, not vanity metrics.`,
      `Whether you run a service business or an online store in ${country}, we build a plan that fits your market and timeline.`,
    ],
    features: [
      "Technical audit and Core Web Vitals",
      "Keyword research for local intent",
      "On-page and content optimization",
      "Local SEO and Google Business Profile",
      "Transparent monthly reporting",
    ],
    process: [
      { title: "Audit", description: "We review the site, rankings, and competitors." },
      { title: "Strategy", description: "We set keywords, page priorities, and a monthly plan." },
      { title: "Execute & measure", description: "We ship fixes and report traffic and leads." },
    ],
    faqs: [
      {
        question: `How long until SEO results show in ${city}?`,
        answer: "Technical wins can appear in weeks. Competitive organic growth usually takes 3–6 months.",
      },
      {
        question: "Do you guarantee page one?",
        answer: "No honest agency can. We guarantee a professional method, clear reporting, and realistic goals.",
      },
      {
        question: `Is local SEO important in ${city}?`,
        answer: "Yes if you serve customers nearby — Maps, NAP consistency, and local landing pages matter.",
      },
    ],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: `SEO ${city}`, path: path },
    ],
  };
}

/** English overlays for all public SEO / city money pages. */
export const ALL_LANDING_EN: Record<string, LandingEnCopy> = {
  "web-design-saudi-arabia": {
    title: "Web design in Saudi Arabia",
    h1: "Professional website design in Saudi Arabia",
    tagline: "Sites that convert visitors into clients — built for the Saudi market",
    intro: [
      "Looking for a trusted web design company in Saudi Arabia? Top1Markting is a digital agency based in Buraidah, Qassim, serving companies nationwide with fast, SEO-ready Arabic websites.",
      "We design company sites, campaign landings, and full institutional websites. Every project is mobile-responsive, quick to load, and optimized for search from day one.",
      "Whether you are in Riyadh, Qassim, Buraidah, or any Saudi city — same quality, with local understanding of Arabic UX and RTL.",
    ],
    features: [
      "Custom design that reflects your brand",
      "SEO built into every page",
      "High load speed (Core Web Vitals)",
      "Easy Arabic dashboard",
      "Ongoing support after launch",
    ],
    process: [
      { title: "Free consult", description: "We understand your business, goals, and budget." },
      { title: "Design & development", description: "We design and build with modern technologies." },
      { title: "Launch & improve", description: "We launch and optimize based on data." },
    ],
    faqs: [
      {
        question: "How much does a website cost in Saudi Arabia?",
        answer: "We scope to your needs. Contact us on WhatsApp or the form and we’ll clarify together.",
      },
      {
        question: "Do you serve Qassim and other Saudi regions?",
        answer: "Yes — we are based in Buraidah (Qassim) and work remotely with clients across Saudi Arabia.",
      },
      {
        question: "Do you have city pages for Riyadh and Qassim?",
        answer: "Yes — dedicated pages for Riyadh, Jeddah, Dammam, Khobar, Qassim, Buraidah, plus Dubai, Abu Dhabi, and Sharjah.",
      },
    ],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Saudi Arabia", path: "/web-design-saudi-arabia" },
    ],
  },
  "web-design-riyadh": webDesignCity("Riyadh", "Saudi Arabia", {
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Saudi Arabia", path: "/web-design-saudi-arabia" },
      { name: "Web design Riyadh", path: "/web-design-riyadh" },
    ],
  }),
  "web-design-qassim": webDesignCity("Qassim", "Saudi Arabia", {
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Saudi Arabia", path: "/web-design-saudi-arabia" },
      { name: "Web design Qassim", path: "/web-design-qassim" },
    ],
  }),
  "web-design-buraidah": webDesignCity("Buraidah", "Saudi Arabia", {
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Saudi Arabia", path: "/web-design-saudi-arabia" },
      { name: "Web design Buraidah", path: "/web-design-buraidah" },
    ],
  }),
  "web-design-jeddah": webDesignCity("Jeddah", "Saudi Arabia", {
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Saudi Arabia", path: "/web-design-saudi-arabia" },
      { name: "Web design Jeddah", path: "/web-design-jeddah" },
    ],
  }),
  "web-design-dammam": webDesignCity("Dammam", "Saudi Arabia", {
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Saudi Arabia", path: "/web-design-saudi-arabia" },
      { name: "Web design Dammam", path: "/web-design-dammam" },
    ],
  }),
  "web-design-khobar": webDesignCity("Khobar", "Saudi Arabia", {
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Saudi Arabia", path: "/web-design-saudi-arabia" },
      { name: "Web design Khobar", path: "/web-design-khobar" },
    ],
  }),
  "web-design-dubai": webDesignCity("Dubai", "UAE", {
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Dubai", path: "/web-design-dubai" },
    ],
  }),
  "web-design-abu-dhabi": webDesignCity("Abu Dhabi", "UAE", {
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Abu Dhabi", path: "/web-design-abu-dhabi" },
    ],
  }),
  "web-design-sharjah": webDesignCity("Sharjah", "UAE", {
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Web design Sharjah", path: "/web-design-sharjah" },
    ],
  }),
  "seo-services": seoCity("Saudi Arabia", "Saudi Arabia", "/seo-services"),
  "seo-riyadh": seoCity("Riyadh", "Saudi Arabia", "/seo-riyadh"),
  "seo-qassim": seoCity("Qassim", "Saudi Arabia", "/seo-qassim"),
  "seo-buraidah": seoCity("Buraidah", "Saudi Arabia", "/seo-buraidah"),
  "seo-dubai": seoCity("Dubai", "UAE", "/seo-dubai"),
  "seo-abu-dhabi": seoCity("Abu Dhabi", "UAE", "/seo-abu-dhabi"),
  "ecommerce-development": {
    title: "E-commerce development",
    h1: "E-commerce website design & development in Saudi Arabia",
    tagline: "A store that sells 24/7 — faster, with higher conversion",
    intro: [
      "E-commerce in Saudi Arabia is no longer optional — customers expect an easy mobile checkout, local payments, and a clear Arabic experience. Top1Markting builds professional stores for companies that want to sell online with confidence.",
      "We design a smooth purchase path: fast browsing, a clear cart, payment gateways that fit the Saudi market, and product and inventory management. We also set the store up for SEO so you earn organic Google visits — not only paid ads.",
      "Whether you are in Riyadh, Qassim, or Buraidah, we launch a store that can scale, with reports that show what sells and where customers drop off.",
    ],
    features: [
      "A responsive Arabic store built for mobile",
      "Local payment gateway integrations",
      "Products, inventory, and order management",
      "SEO for category and product pages",
      "Conversion tracking and sales analytics",
      "Ready to connect later to Google and Meta campaigns",
    ],
    process: [
      { title: "Store planning", description: "We map categories, payment and shipping, and the ideal purchase path." },
      { title: "Design and build", description: "A fast storefront and a clear admin, tested on mobile." },
      { title: "Launch and growth", description: "We launch with basic training and a plan to improve conversion and product SEO." },
    ],
    faqs: [
      {
        question: "What’s the difference between a brochure site and an online store?",
        answer: "A brochure site presents services and generates enquiries. A store sells directly with a cart, payments, and order tracking.",
      },
      {
        question: "Is the store optimized for search engines?",
        answer: "Yes — titles, descriptions, URL structure, and speed are set up, and product growth can continue through our SEO services.",
      },
      {
        question: "Do you serve stores in Riyadh and Qassim?",
        answer: "Yes. We serve clients across Saudi Arabia, and our Buraidah base makes coordination easier for Qassim projects.",
      },
    ],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Ecommerce", path: "/ecommerce-development" },
    ],
  },
  "digital-marketing": {
    title: "Digital marketing",
    h1: "Digital marketing services in Saudi Arabia",
    tagline: "Paid campaigns tied to results and sales",
    intro: [
      "Paid digital advertising is the fastest way to test your offer and attract clients in Saudi Arabia — if campaigns have proper tracking and a strong landing page. Top1Markting focuses on cost per lead and return, not clicks alone.",
      "We run and improve Google Ads and Meta Ads, build conversion-focused landings, and connect conversions (form, WhatsApp, call) so you know which campaigns win.",
      "We serve companies in Riyadh, Qassim, Buraidah, and across the Kingdom — and can combine paid media with SEO for fast + lasting coverage.",
    ],
    features: [
      "Google and Meta ads with weekly management",
      "Conversion-optimized landing pages",
      "GA4 and clear conversion tracking",
      "Lower cost per lead (CPL) over time",
      "Reports management can understand",
      "Coordination with SEO and ecommerce when needed",
    ],
    process: [
      { title: "Channel strategy", description: "Audience, message, budget, and the right channel for the goal." },
      { title: "Launch", description: "Campaigns, landings, and tracking before spending the full budget." },
      { title: "Optimize", description: "Weekly tests on ads and pages to cut cost and raise lead quality." },
    ],
    faqs: [
      {
        question: "What’s the minimum ad budget?",
        answer: "We work with a range of budgets. After understanding your sector and city we suggest a sensible test budget, then scale what works.",
      },
      {
        question: "Does digital marketing replace SEO?",
        answer: "Not fully. Ads give faster results; SEO builds long-term assets. Combining both is usually strongest.",
      },
      {
        question: "Do you run campaigns for Riyadh and Qassim companies?",
        answer: "Yes — geographic targeting by market (Riyadh, Qassim, Buraidah, or Saudi-wide) with messages that fit each area when needed.",
      },
    ],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Digital marketing", path: "/digital-marketing" },
    ],
  },
};
