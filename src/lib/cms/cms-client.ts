async function fetchCmsApi<T>(resource: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  const res = await fetch(`/api/cms/${resource}${qs}`);
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const cmsClient = {
  getSiteSettings: () => fetchCmsApi("settings"),
  getServices: () => fetchCmsApi("services"),
  getServiceBySlug: (slug: string) => fetchCmsApi("service", { slug }),
  getPortfolio: () => fetchCmsApi("portfolio"),
  getBlogPosts: (max?: number) =>
    fetchCmsApi("blog", max !== undefined ? { max: String(max) } : undefined),
  getBlogPostBySlug: (slug: string) => fetchCmsApi("blog-post", { slug }),
  getTrendingPosts: (max = 3) => fetchCmsApi("trending", { max: String(max) }),
  getTestimonials: () => fetchCmsApi("testimonials"),
  getPricingPlans: () => fetchCmsApi("pricing"),
  getFaqs: () => fetchCmsApi("faqs"),
  getSiteStats: () => fetchCmsApi("stats"),
  getPageBySlug: (slug: string) => fetchCmsApi("page", { slug }),
  getPageById: (id: string) => fetchCmsApi("page-id", { id }),
  submitLead: async (input: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    source?: string;
    website?: string;
  }) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      let message = "تعذّر إرسال الرسالة";
      try {
        const body = (await res.json()) as { error?: string };
        if (body.error) message = body.error;
      } catch {
        // ignore
      }
      throw new Error(message);
    }
  },
};
