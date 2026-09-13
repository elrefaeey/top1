export type ServiceEnCopy = {
  title: string;
  tagline?: string;
  shortDescription: string;
  description: string;
  features: string[];
  deliverables: string[];
  process?: Array<{ title: string; description: string }>;
};

export type PortfolioEnCopy = {
  title: string;
  category: string;
  description: string;
  client?: string;
  tags: string[];
  challenge?: string;
  solution?: string;
  servicesProvided?: string[];
  resultsSummary?: string;
};

const WEB_DESIGN: ServiceEnCopy = {
  title: "Website design & development",
  tagline: "Fast, conversion-focused sites.",
  shortDescription:
    "Professional websites that are fast, responsive, and built to SEO standards from day one.",
  description:
    "We design and develop professional websites for individuals and companies — with a clear visual identity, easy usability, and strong performance. We build company sites, online stores, landing pages, and custom dashboards using modern stacks, with full device support and search-engine optimization for a better user experience.",
  features: [
    "Professional design that reflects your brand",
    "Responsive layouts for every device",
    "Fast loading and high performance",
    "On-page SEO setup",
    "An easy content management dashboard",
    "Site security and protection",
    "Social media integrations",
    "Payment gateway integrations when needed",
    "Hosting and domain connection",
    "Post-launch technical support",
  ],
  deliverables: [
    "A professional website ready to launch",
    "A responsive design that works on every device",
    "A modern, easy-to-use interface",
    "Fast loading and optimized performance",
    "Foundational SEO setup",
    "SSL certificate to secure the site",
    "Domain and hosting connection",
    "An easy content management dashboard",
    "WhatsApp and social media integrations",
    "Contact forms and lead capture",
    "Option to add a blog or store later",
    "Security following current best practices",
    "Post-launch support",
    "Room to extend features later",
    "A user experience built to convert visitors into clients",
  ],
  process: [
    { title: "Discover", description: "Workshops, audience research, and competitor analysis." },
    { title: "Design", description: "Wireframes, high-fidelity screens, and a documented system." },
    { title: "Build", description: "Production-ready code with performance baked in." },
    { title: "Improve", description: "Post-launch optimization based on real data." },
  ],
};

const ECOMMERCE: ServiceEnCopy = {
  title: "E-commerce website design",
  tagline: "Stores built to sell.",
  shortDescription:
    "We design professional online stores that help you present products and grow sales.",
  description:
    "We design and develop online stores with a modern look and a professional shopping experience — easy browsing, fast performance, product and order management, plus payment and shipping integrations so your business is ready to sell online.",
  features: [
    "Professional design that reflects your brand",
    "Easy product and category management",
    "A polished shopping cart",
    "Order and customer management",
    "Payment gateway integrations",
    "Shipping company integrations",
    "Responsive design for every device",
    "Search engine optimization (SEO)",
    "Fast performance and strong security",
    "Post-launch technical support",
  ],
  deliverables: [
    "A professional store ready to sell online",
    "A modern design that reflects your brand",
    "A dashboard to manage products and orders",
    "Unlimited products and categories",
    "A professional cart and checkout flow",
    "Payment gateway integrations",
    "Shipping integrations and order tracking",
    "Customer accounts with order history",
    "A store that works on every device",
    "Fast loading and optimized performance",
    "Store SEO setup",
    "Protection for data and transactions",
    "Sales reports and analytics",
    "Offers, discounts, and coupon support",
    "Post-launch support and room to grow",
  ],
  process: [
    { title: "Plan", description: "Catalog, checkout, and operations mapped before build." },
    { title: "Design", description: "Product pages, cart, and conversion-focused flows." },
    { title: "Build", description: "Payments, shipping, and admin in working sprints." },
    { title: "Launch", description: "Go-live, monitoring, and iteration." },
  ],
};

const SEO: ServiceEnCopy = {
  title: "Search engine optimization (SEO)",
  tagline: "Organic growth, engineered.",
  shortDescription:
    "We help your site rank higher in search results and attract more clients organically.",
  description:
    "We provide SEO services that increase visibility and improve site performance — speed, page structure, keywords, titles and meta descriptions, and user experience — so you gain more visits and sustainable business growth.",
  features: [
    "Full site audit",
    "Keyword research",
    "Site speed improvements",
    "Page structure and internal linking",
    "Title and meta description optimization",
    "Image SEO",
    "User-experience improvements",
    "Performance tracking and periodic reports",
    "Stronger visibility in search results",
    "More visits and qualified leads",
  ],
  deliverables: [
    "A full audit of your site and improvement opportunities",
    "An SEO plan tailored to your business",
    "Keyword research and targeting",
    "On-page optimization to search-engine standards",
    "Speed and Core Web Vitals improvements",
    "Titles, meta descriptions, and content structure",
    "Image, internal, and external link setup",
    "Structured data (Schema Markup)",
    "Local SEO for city and country search",
    "Google Search Console and Analytics setup",
    "Periodic ranking and performance reports",
    "More targeted organic traffic",
    "Better conversion from visitors to clients",
    "A sustainable SEO strategy for long-term growth",
    "Ongoing consulting to keep improving the site",
  ],
  process: [
    { title: "Audit", description: "Technical review, blockers, and quick wins." },
    { title: "Strategy", description: "Keyword clusters and a content roadmap." },
    { title: "Execute", description: "On-page, technical, and content improvements." },
    { title: "Measure", description: "Monthly reports tied to traffic and leads." },
  ],
};

const UI_UX: ServiceEnCopy = {
  title: "UI/UX design",
  tagline: "Interfaces people enjoy using.",
  shortDescription:
    "We design modern interfaces and simple experiences that attract clients and deliver results.",
  description:
    "We design user interfaces (UI) and user experiences (UX) with a focus on visual identity, ease of use, and a better journey. We create modern, responsive screens and wireframes & prototypes so the project is validated before development starts.",
  features: [
    "Modern, distinctive interfaces",
    "Easier navigation and user experience",
    "Responsive design for every device",
    "Wireframes and prototypes",
    "Design aligned with your brand identity",
    "Professional color and type choices",
    "A focus on conversion rate",
    "Handoff-ready files for developers",
    "Current UI/UX patterns",
    "Revisions until the result is right",
  ],
  deliverables: [
    "Professional screens that reflect your brand",
    "A smooth experience that raises customer satisfaction",
    "Wireframes for every screen before visual design",
    "An interactive prototype to preview the flow",
    "Responsive design for all devices and breakpoints",
    "Colors and type aligned with the visual identity",
    "Layouts focused on conversion and project goals",
    "Clear content hierarchy and easy access to information",
    "Development-ready design files",
    "Reusable UI components (design system)",
    "Work aligned with current UI/UX standards",
    "Reviews and revisions through to the final design",
    "Professional file delivery (Figma)",
    "Support and consulting during development",
  ],
  process: [
    { title: "Research", description: "Interviews, jobs-to-be-done, and competitor review." },
    { title: "Design", description: "Wireframes, prototypes, and high-fidelity screens." },
    { title: "Validate", description: "Usability testing with real users." },
    { title: "Handoff", description: "A documented system ready for engineering." },
  ],
};

const WEB_APPS: ServiceEnCopy = {
  title: "Web applications",
  tagline: "Scalable apps. Clean architecture.",
  shortDescription: "Scalable web apps with modern stacks and clean architecture.",
  description:
    "From internal tools to customer-facing platforms — we build applications that scale with your business and stay easy to maintain.",
  features: ["React / Next.js", "Secure APIs", "Roles and users", "Edge-ready architecture"],
  deliverables: [
    "React / Next.js / TypeScript",
    "Secure APIs",
    "Auth and permissions",
    "Edge-ready architecture",
    "Tests and CI/CD",
  ],
  process: [
    { title: "Plan", description: "Architecture, data model, and scope." },
    { title: "Design", description: "User flows, prototypes, and a design system." },
    { title: "Build", description: "Two-week sprints with weekly demos." },
    { title: "Launch", description: "Deploy, monitor, iterate." },
  ],
};

const DIGITAL_SOLUTIONS: ServiceEnCopy = {
  title: "Digital solutions",
  tagline: "Custom platforms, end to end.",
  shortDescription: "Custom platforms, automation, and integrations for your business.",
  description:
    "We build custom platforms, automation, and integrations that connect your operations and remove friction.",
  features: ["Internal tools", "API integrations", "Automation", "CRM and ERP connections"],
  deliverables: [
    "Internal tools",
    "API integrations",
    "Workflow automation",
    "CRM and ERP connections",
    "Custom dashboards",
  ],
  process: [
    { title: "Discover", description: "Map workflows and pain points." },
    { title: "Design", description: "Solution architecture and UX." },
    { title: "Build", description: "Integrations and automation in working slices." },
    { title: "Operate", description: "Handoff, training, and iteration." },
  ],
};

/** English overlays keyed by CMS / fallback slugs. */
export const SERVICE_EN: Record<string, ServiceEnCopy> = {
  "web-design-development": WEB_DESIGN,
  "web-design": WEB_DESIGN,
  "web-design-saudi": WEB_DESIGN,
  "ecommerce-development": ECOMMERCE,
  "seo-optimization": SEO,
  seo: SEO,
  "seo-saudi": SEO,
  "ui-ux-design": UI_UX,
  "ui-ux": UI_UX,
  "web-apps": WEB_APPS,
  "digital-solutions": DIGITAL_SOLUTIONS,
};

export const PORTFOLIO_EN: Record<string, PortfolioEnCopy> = {
  "luniermarina-yacht-management": {
    title: "Lunayair Marina\nYacht and boat management",
    category: "Web design",
    description:
      "Design and development of a professional website for Lunayair Marina, a yacht and boat management company — presenting services clearly and building a digital presence that matches the brand in the yachting sector.",
    client: "Capt. Abdullah Al-Harbi",
    tags: [
      "Lunayair Marina",
      "Yacht management",
      "Boat management",
      "Yachts",
      "Boats",
      "Jeddah",
      "Saudi Arabia",
      "Web design",
      "Web development",
      "Websites",
    ],
    challenge:
      "A yacht-management company needed a site that felt as premium as the sector, and that clearly explained management, crew, and marina services for yacht owners in Saudi Arabia and the Gulf.",
    solution:
      "We designed Lunayair Marina with structured content: about, management and agency services, marina operations, crew hiring, plus a blog, FAQs, and consultation requests.",
    servicesProvided: [
      "Web design",
      "Web development",
      "UI/UX design",
      "Search engine optimization (SEO)",
    ],
    resultsSummary:
      "A live professional site on lunayairmarina.com that presents yacht-management services from Jeddah, the Red Sea, and the Gulf with clarity.",
  },
  "al-general-car-rental": {
    title: "Al General\nLuxury car rental in Dubai",
    category: "Web design",
    description:
      "Al General Car Rental is a professional website for a Dubai car-rental company. Customers can browse the fleet by category, review each car’s details, and book through the site or WhatsApp. The site is modern and responsive, with a focus on speed, usability, and presenting the company’s services clearly.",
    client: "Mahmoud Reda",
    tags: [
      "Car rental",
      "Dubai",
      "Company websites",
      "Service websites",
      "Web design",
      "Car booking",
      "UI",
      "UX",
      "Responsive design",
      "Web development",
    ],
    challenge:
      "A Dubai car-rental company needed a site that showed the fleet and services (airport delivery and 24/7 support) and made booking and WhatsApp contact easier than relying on calls alone.",
    solution:
      "We designed Al General in Arabic, showcasing available cars, service benefits, Dubai coverage, and FAQs, with direct booking and WhatsApp buttons.",
    servicesProvided: ["Web design", "Web development", "UI/UX design"],
    resultsSummary:
      "A live site for AL GENERAL in Dubai that presents the fleet and sends the customer to book or WhatsApp from the first screen.",
  },
  boatpro: {
    title: "BoatPro – marine technology platform",
    category: "Web design",
    description:
      "Design of BoatPro, a marine technology platform that connects guests with boat and yacht owners, marinas, and marine service providers — with a digital experience for booking, operations, and marine services.",
    client: "Capt. Abdullah Al-Harbi",
    tags: [
      "BoatPro",
      "Yacht",
      "Marine",
      "Maritime",
      "Yacht booking",
      "Boat rental",
      "Web development",
      "Saudi Arabia",
      "React",
      "Firebase",
    ],
    challenge:
      "The challenge was a single digital platform for guests, boat and yacht owners, marinas, and marine service providers — instead of scattered search, calls, and manual coordination.",
    solution:
      "We built a unified platform where guests discover and book boats, yachts, and marine experiences; owners manage listings, bookings, and collections; and marinas and providers reach owners and guests directly.",
    servicesProvided: [
      "Web design",
      "Web development",
      "UI/UX design",
      "Responsive design",
      "SEO",
      "Arabic/English website",
    ],
    resultsSummary:
      "BoatPro launched as a digital platform for booking, operations, and marine services, with dedicated pages for guests, owners, marinas, and providers.",
  },
  "my-bag": {
    title: "MY BAG\nBags and accessories store",
    category: "Web design",
    description:
      "MY BAG is an online store for women’s bags and contemporary accessories, with designs that combine elegance, quality, and fair prices. The site offers a fast shopping experience through a modern interface — products, prices, discounts, and latest offers — plus a responsive layout that works on phones, tablets, and desktops.",
    client: "Salma Alaa",
    tags: [
      "Online store",
      "Women’s bags",
      "Bags",
      "Accessories",
      "Fashion",
      "Web design",
      "E-commerce",
      "Responsive design",
      "UI",
      "UX",
    ],
    challenge:
      "A bags and accessories brand needed a store that looked premium, presented products and discounts clearly, and was easy to browse on mobile.",
    solution:
      "We built MY BAG with a refined minimal design: a clear hero, a product grid with discount badges, and a responsive shopping experience focused on photography and quality.",
    servicesProvided: ["Web design", "E-commerce", "UI/UX design"],
    resultsSummary:
      "A live store that presents bags, accessories, and offers, with a clear shopping experience on every device.",
  },
  vee: {
    title: "VEE\nContemporary modest fashion store",
    category: "Web design",
    description:
      "VEE is an online store for modest women’s fashion, combining contemporary elegance with timeless designs. Shoppers can browse the latest collections with details, prices, and offers through a modern interface that works on every device. The project focuses on speed, responsive design, and a professional experience that reflects the brand.",
    client: "Doaa Mohamed",
    tags: [
      "Online store",
      "Women’s fashion",
      "Modest clothing",
      "Web design",
      "UI",
      "UX",
      "Responsive design",
      "E-commerce",
      "Clothing store",
      "Contemporary fashion",
    ],
    challenge:
      "A modest women’s fashion brand needed an online store that matched its style, showed collections, prices, and offers clearly, and was easy to shop on mobile.",
    solution:
      "We designed VEE with a modern interface for the latest collections, product details, and prices, plus a responsive shopping journey from browse to order.",
    servicesProvided: ["Web design", "E-commerce", "UI/UX design"],
    resultsSummary:
      "A live store that presents VEE collections and lets customers browse and buy on mobile and desktop.",
  },
  "vip-padel": {
    title: "VIP PADEL\nPadel court booking",
    category: "Web design",
    description:
      "VIP PADEL is a professional site for booking padel courts — a fast way to reserve slots and browse courts and offers. It has a modern, responsive design and a simple interface so players can pick the right time, with a focus on speed and a polished booking experience.",
    client: "Fahad Al-Shammari",
    tags: [
      "Padel",
      "Court booking",
      "Sports websites",
      "Web design",
      "Online booking",
      "UX",
      "UI",
      "Responsive design",
      "Web development",
      "Sports courts",
    ],
    challenge:
      "Padel court bookings relied on WhatsApp and manual messages, and players needed a clearer view of courts and time slots.",
    solution:
      "We designed VIP PADEL to browse courts and offers and pick slots from a simple responsive interface, instead of relying entirely on chat.",
    servicesProvided: ["Web design", "Web development", "Web apps"],
    resultsSummary:
      "A clearer booking platform for players: courts and slots are visible, and requesting a booking is easier than manual messaging.",
  },
  "malekcure-concrete-cutting-website": {
    title: "MalekCure\nConcrete cutting and coring in Saudi Arabia",
    category: "Web design",
    description:
      "We designed and developed MalekCure, a company specialized in concrete cutting and coring across Saudi Arabia, using modern web technologies with a focus on performance, SEO, and user experience. The site includes services, projects, a blog, and branch pages, with a fast responsive design that supports local search visibility.",
    client: "Reda Mohamed",
    tags: [
      "MalekCure",
      "Web design",
      "Web development",
      "Concrete cutting company",
      "Concrete cutting and coring",
      "SEO",
      "React",
      "Next.js",
      "Web design Saudi Arabia",
      "Professional websites",
      "Search engine optimization",
      "Company websites",
    ],
    challenge:
      "A concrete cutting and coring company in Saudi Arabia needed a digital presence that explained industrial services clearly, ranked in local search for Jeddah, Makkah, and Taif, and made phone and WhatsApp contact fast.",
    solution:
      "We built MalekCure with services, projects, branches, and a blog — responsive design, local SEO, and clear 24/7 contact paths.",
    servicesProvided: [
      "Web design",
      "Web development",
      "Search engine optimization (SEO)",
    ],
    resultsSummary:
      "A live site on malekcure.com that presents services and branches for customers searching for concrete cutting and coring in Saudi Arabia.",
  },
  "cuttinganddrillingexperts-concrete-cutting-website": {
    title: "Cutting & Drilling Experts\nConcrete cutting and coring in Saudi Arabia",
    category: "Web design",
    description:
      "We designed and developed Cutting & Drilling Experts, specialized in concrete cutting and coring across Saudi Arabia. The site is professional and responsive, with services, projects, and coverage areas organized so customers can reach the right service.\n\nWe also focused on performance, load speed, and UX, plus SEO best practices and dedicated pages for services, cities, and regions — supporting local search and customers looking for concrete cutting and coring.",
    client: "Mahmoud Naguib",
    tags: [
      "Concrete cutting",
      "Coring",
      "Saudi Arabia",
      "Web design",
      "Local SEO",
      "Company website",
    ],
    challenge:
      "A concrete cutting and coring company covering several Saudi cities needed a site that organized services and regions, and made quote requests easier than scattered search.",
    solution:
      "We built Cutting & Drilling Experts with services, projects, and geographic coverage (Jeddah, Makkah, Riyadh, Dammam, and more), with a focus on performance, local SEO, and 24/7 contact.",
    servicesProvided: [
      "Web design",
      "Web development",
      "Search engine optimization (SEO)",
    ],
    resultsSummary:
      "A live site on cuttinganddrillingexperts.com that explains services and cities and sends the customer to a quote or a call.",
  },
  alforsancladding: {
    title: "Al Forsan\nGlass facades and cladding",
    category: "Web design",
    description:
      "We designed and developed Al Forsan for glass facades and cladding in Egypt, specialized in designing and installing glass and cladding facades for shops, companies, malls, villas, and commercial buildings. The site uses modern web technologies with a focus on speed, SEO, and user experience, and includes services, projects, and previous work — a fast responsive design that supports search visibility across Egyptian governorates.",
    client: "Eng. Mahrous El-Sayyad",
    tags: [
      "Cladding",
      "Glass facades",
      "Egypt",
      "Mansoura",
      "Web design",
      "Company website",
      "SEO",
    ],
    challenge:
      "A glass-facade and cladding company in Mansoura needed a site that presented services and projects clearly, introduced the engineering expertise, and made contact from other governorates easier.",
    solution:
      "We designed Al Forsan with service pages (cladding, curtain wall, and spider), a project gallery, founder and team profiles, and the Mansoura location with call and WhatsApp buttons.",
    servicesProvided: [
      "Web design",
      "Web development",
      "Search engine optimization (SEO)",
    ],
    resultsSummary:
      "A live site on alforsancladding.com that introduces Al Forsan in Mansoura and converts visitors to a call or WhatsApp.",
  },
};

export type LandingEnCopy = {
  title: string;
  h1: string;
  tagline: string;
  intro: string[];
  features: string[];
  process: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  breadcrumbs: Array<{ name: string; path: string }>;
};

/** National service landings that replace a CMS service URL (e.g. ecommerce redirect). */
export const LANDING_EN: Record<string, LandingEnCopy> = {
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
      {
        title: "Store planning",
        description: "We map categories, payment and shipping, and the ideal purchase path.",
      },
      {
        title: "Design and build",
        description: "A fast storefront and a clear admin, tested on mobile.",
      },
      {
        title: "Launch and growth",
        description: "We launch with basic training and a plan to improve conversion and product SEO.",
      },
    ],
    faqs: [
      {
        question: "What’s the difference between a brochure site and an online store?",
        answer:
          "A brochure site presents your services and generates enquiries. A store sells directly with a cart, payments, and order tracking.",
      },
      {
        question: "Is the store optimized for search engines?",
        answer:
          "Yes — titles, descriptions, URL structure, and speed are set up, and product growth can continue through our SEO services.",
      },
      {
        question: "Do you serve stores in Riyadh and Qassim?",
        answer:
          "Yes. We serve clients across Saudi Arabia, and our Buraidah base makes coordination easier for Qassim projects.",
      },
    ],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Ecommerce", path: "/ecommerce-development" },
    ],
  },
};

/** Exact-phrase fallbacks for categories, tags, and leftover CMS labels. */
export const CMS_PHRASE_EN: Record<string, string> = {
  "تصميم مواقع": "Web design",
  "تطوير مواقع": "Web development",
  "تصميم UI / UX": "UI/UX design",
  "تصميم UI/UX": "UI/UX design",
  "تحسين محركات البحث (SEO)": "Search engine optimization (SEO)",
  "تحسين محركات البحث": "Search engine optimization",
  "متاجر إلكترونية": "E-commerce",
  "تطبيقات ويب": "Web apps",
  "مواقع إلكترونية": "Websites",
  "إدارة اليخوت": "Yacht management",
  "إدارة القوارب": "Boat management",
  اليخوت: "Yachts",
  القوارب: "Boats",
  جدة: "Jeddah",
  السعودية: "Saudi Arabia",
  دبي: "Dubai",
  "لونير مارينا": "Lunayair Marina",
};
