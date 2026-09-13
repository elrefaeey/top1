export type FaqEn = { question: string; answer: string };
export type TestimonialEn = {
  name: string;
  role: string;
  company: string;
  quote: string;
  city?: string;
};
export type StatEn = { label: string };
export type AuthorEn = {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
};

export const FAQ_EN: Record<string, FaqEn> = {
  "faq-1783236315270": {
    question: "How long does a website take to build?",
    answer:
      "It depends on scope. Simple sites usually take 3–10 days; online stores and larger projects with custom dashboards can take several weeks.",
  },
  "faq-timeline": {
    question: "How long does website or store design take?",
    answer:
      "A brochure site is usually 2–4 weeks. Stores and larger builds are typically 6–12 weeks depending on scope. We work in short sprints with clear updates at every stage.",
  },
  "faq-1783236350828": {
    question: "Can the site be changed after delivery?",
    answer:
      "Yes. After handoff you can update content, refine the design, or add features. We also offer ongoing support so the site keeps improving.",
  },
  "faq-markets": {
    question: "Do you only serve Saudi Arabia and the UAE?",
    answer:
      "No — we work with clients anywhere. Our focus and campaigns are on KSA and the UAE (Riyadh, Jeddah, Dammam, Qassim, Dubai, Abu Dhabi, Sharjah), and we build sites for any business with full Arabic RTL support.",
  },
  "faq-1783385916673": {
    question: "Will the site work on phones and tablets?",
    answer:
      "Yes. Every site we build is fully responsive and works well on phones, tablets, and desktops.",
  },
  "faq-seo": {
    question: "Does the work include SEO?",
    answer:
      "We build SEO in from day one: page structure, speed, Core Web Vitals, and structured data. A monthly package for rankings and content can be added after launch.",
  },
  "faq-cms": {
    question: "Can I edit the content myself after delivery?",
    answer:
      "Yes. You get an easy dashboard to update text, images, and articles without calling a developer for every small change.",
  },
  "faq-pricing": {
    question: "How does pricing work? Is there a fixed offer?",
    answer:
      "Pricing follows scope (pages, store, integrations, SEO). After a short consult we send a clear proposal with stages and cost before we start — no surprises.",
  },
  "faq-whatsapp": {
    question: "What’s the fastest way to reach you?",
    answer:
      "WhatsApp or the contact form on the site. We usually reply within 24 hours on business days and book a short call to understand what you need.",
  },
  "faq-hosting": {
    question: "Do you provide hosting and domain?",
    answer:
      "We help choose the right hosting, connect the domain, and set the site up for speed and security. Hosting can be on your account or a provider we recommend.",
  },
  "faq-support": {
    question: "What happens after launch? Is there support?",
    answer:
      "After launch we include a period of support for basic changes. Monthly care for updates, security, performance, and SEO is available if you want ongoing help.",
  },
};

export const TESTIMONIAL_EN: Record<string, TestimonialEn> = {
  "t-vee": {
    name: "Doaa Mohamed",
    role: "Store owner",
    company: "VEE",
    city: "Cairo",
    quote:
      "Professional from day one through delivery. The site is fast and modern, matches the brand, and customers order more easily on mobile. Working with Top1 was outstanding.",
  },
  "t-al-general": {
    name: "Mahmoud Reda",
    role: "Owner",
    company: "Al General Car Rental",
    city: "Dubai",
    quote:
      "The site presents the fleet and pricing clearly, and booking is much easier. The team is fast with revisions and understands the Dubai market. I recommend them for any rental company.",
  },
  "t-alforsan": {
    name: "Eng. Mahrous El-Sayyad",
    role: "Owner",
    company: "Al Forsan Glass Facades",
    city: "Mansoura",
    quote:
      "We needed a site that matched our cladding and facade work. They delivered a clean design and a clear project gallery — people now contact us straight from the site. Excellent work.",
  },
  "t-cutting-experts": {
    name: "Mahmoud Naguib",
    role: "Company owner",
    company: "Cutting & Drilling Experts",
    city: "Riyadh",
    quote:
      "The site reflects how professional our cutting and coring work is. Enquiries went up, and the page is clear from the first visit. Easy communication and on-time delivery.",
  },
  "t-malekcure": {
    name: "Reda Mohamed",
    role: "Founder",
    company: "MalekCure",
    city: "Jeddah",
    quote:
      "From the first meeting they understood our industrial services. The site is fast and builds trust. After launch, requests became clearer and easier to track.",
  },
  "t-lunier": {
    name: "Capt. Abdullah Al-Harbi",
    role: "General Manager",
    company: "Lunayair Marina",
    city: "Dubai",
    quote:
      "I wanted a site that felt as premium as yacht management — and that’s what we got. Elegant UI, clear content, and clients understand the services without confusion. Thank you, Top1 team.",
  },
  "t-my-bag": {
    name: "Salma Alaa",
    role: "Brand owner",
    company: "MY BAG",
    quote:
      "The store looks premium and browsing on mobile is very easy. Photos, checkout, and orders all flow smoothly — customers share the link. It made a real difference to sales.",
  },
  "t-vip-padel": {
    name: "Fahad Al-Shammari",
    role: "Club manager",
    company: "VIP PADEL",
    city: "Riyadh",
    quote:
      "Booking is clearer for players and courts show up neatly. We used to lose time on WhatsApp; now most bookings come from the site. Fast work and great post-launch support.",
  },
};

export const STAT_EN: Record<string, StatEn> = {
  "stat-1783385561939": { label: "Projects delivered" },
  "stat-1783385594642": { label: "Clients" },
  "stat-1783385646202": { label: "Client satisfaction" },
  "stat-1783385881769": { label: "Fast support & response" },
};

export const AUTHOR_EN: Record<string, AuthorEn> = {
  "ahmed-refaei": {
    name: "Ahmed El-Refaei",
    role: "Founder & strategy lead",
    bio: "Leads digital growth strategy for Top1Markting in Saudi Arabia and the UAE — from web design through SEO and measurable marketing. Focused on turning visits into enquiries and clients.",
    expertise: ["Digital strategy", "SEO", "Web design", "Conversion"],
  },
  "mohamed-al-khatib": {
    name: "Mohamed Al-Khatib",
    role: "Founder & strategy lead",
    bio: "Co-founded Top1Markting and leads strategic growth across KSA and the UAE — building clear digital offers and converting search and ads into real clients.",
    expertise: ["Digital strategy", "SEO", "Web design", "Conversion"],
  },
};
