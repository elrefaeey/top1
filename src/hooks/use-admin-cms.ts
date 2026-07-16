import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminBlogPost,
  deleteAdminFaq,
  deleteAdminPortfolioItem,
  deleteAdminPricingPlan,
  deleteAdminService,
  deleteAdminSiteStat,
  deleteAdminTestimonial,
  getAdminBlogPost,
  getAdminFaq,
  getAdminPage,
  getAdminPortfolioItem,
  getAdminPricingPlan,
  getAdminService,
  getAdminSiteSettings,
  getAdminSiteStat,
  getAdminTestimonial,
  listAdminBlogPosts,
  listAdminFaqs,
  listAdminLeads,
  listAdminPages,
  listAdminPortfolio,
  listAdminPricing,
  listAdminServices,
  listAdminSiteStats,
  listAdminTestimonials,
  saveAdminBlogPost,
  saveAdminFaq,
  saveAdminPage,
  saveAdminPortfolioItem,
  saveAdminPricingPlan,
  saveAdminService,
  saveAdminSiteSettings,
  saveAdminSiteStat,
  saveAdminTestimonial,
} from "@/lib/cms/admin-service";
import { cmsKeys } from "@/hooks/use-cms";
import type {
  BlogPost,
  CmsPage,
  FaqItem,
  PortfolioItem,
  PricingPlan,
  Service,
  SiteSettings,
  SiteStat,
  Testimonial,
} from "@/types/cms";

export const adminKeys = {
  all: ["admin"] as const,
  services: () => [...adminKeys.all, "services"] as const,
  service: (id: string) => [...adminKeys.all, "service", id] as const,
  blog: () => [...adminKeys.all, "blog"] as const,
  blogPost: (id: string) => [...adminKeys.all, "blog", id] as const,
  portfolio: () => [...adminKeys.all, "portfolio"] as const,
  portfolioItem: (id: string) => [...adminKeys.all, "portfolio", id] as const,
  pricing: () => [...adminKeys.all, "pricing"] as const,
  pricingPlan: (id: string) => [...adminKeys.all, "pricing", id] as const,
  testimonials: () => [...adminKeys.all, "testimonials"] as const,
  testimonial: (id: string) => [...adminKeys.all, "testimonial", id] as const,
  faqs: () => [...adminKeys.all, "faqs"] as const,
  faq: (id: string) => [...adminKeys.all, "faq", id] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  stat: (id: string) => [...adminKeys.all, "stat", id] as const,
  pages: () => [...adminKeys.all, "pages"] as const,
  page: (id: string) => [...adminKeys.all, "page", id] as const,
  settings: () => [...adminKeys.all, "settings"] as const,
  leads: () => [...adminKeys.all, "leads"] as const,
};

function invalidatePublic(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: cmsKeys.all });
}

/** لا إعادة محاولة — عرض فوري بدون تعليق الواجهة */
const adminQueryOptions = {
  retry: false,
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  refetchOnWindowFocus: false,
} as const;

// Services
export function useAdminServices() {
  return useQuery({
    queryKey: adminKeys.services(),
    queryFn: listAdminServices,
    placeholderData: [],
    ...adminQueryOptions,
  });
}
export function useAdminService(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.service(id),
    queryFn: () => getAdminService(id),
    enabled: enabled && id !== "new",
    ...adminQueryOptions,
  });
}
export function useSaveService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Service, "id"> }) =>
      saveAdminService(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.services() });
      await invalidatePublic(qc);
    },
  });
}
export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminService,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.services() });
      await invalidatePublic(qc);
    },
  });
}

// Blog
export function useAdminBlogPosts() {
  return useQuery({
    queryKey: adminKeys.blog(),
    queryFn: listAdminBlogPosts,
    placeholderData: [],
    ...adminQueryOptions,
  });
}
export function useAdminBlogPost(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.blogPost(id),
    queryFn: () => getAdminBlogPost(id),
    enabled: enabled && id !== "new",
    ...adminQueryOptions,
  });
}
export function useSaveBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<BlogPost, "id"> }) =>
      saveAdminBlogPost(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.blog() });
      await invalidatePublic(qc);
    },
  });
}
export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminBlogPost,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.blog() });
      await invalidatePublic(qc);
    },
  });
}

// Portfolio
export function useAdminPortfolio() {
  return useQuery({
    queryKey: adminKeys.portfolio(),
    queryFn: listAdminPortfolio,
    placeholderData: [],
    ...adminQueryOptions,
  });
}
export function useAdminPortfolioItem(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.portfolioItem(id),
    queryFn: () => getAdminPortfolioItem(id),
    enabled: enabled && id !== "new",
    ...adminQueryOptions,
  });
}
export function useSavePortfolioItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<PortfolioItem, "id"> }) =>
      saveAdminPortfolioItem(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.portfolio() });
      await invalidatePublic(qc);
    },
  });
}
export function useDeletePortfolioItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminPortfolioItem,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.portfolio() });
      await invalidatePublic(qc);
    },
  });
}

// Pricing
export function useAdminPricing() {
  return useQuery({
    queryKey: adminKeys.pricing(),
    queryFn: listAdminPricing,
    placeholderData: [],
    ...adminQueryOptions,
  });
}
export function useAdminPricingPlan(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.pricingPlan(id),
    queryFn: () => getAdminPricingPlan(id),
    enabled: enabled && id !== "new",
    ...adminQueryOptions,
  });
}
export function useSavePricingPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<PricingPlan, "id"> }) =>
      saveAdminPricingPlan(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.pricing() });
      await invalidatePublic(qc);
    },
  });
}
export function useDeletePricingPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminPricingPlan,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.pricing() });
      await invalidatePublic(qc);
    },
  });
}

// Testimonials
export function useAdminTestimonials() {
  return useQuery({
    queryKey: adminKeys.testimonials(),
    queryFn: listAdminTestimonials,
    placeholderData: [],
    ...adminQueryOptions,
  });
}
export function useAdminTestimonial(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.testimonial(id),
    queryFn: () => getAdminTestimonial(id),
    enabled: enabled && id !== "new",
    ...adminQueryOptions,
  });
}
export function useSaveTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Testimonial, "id"> }) =>
      saveAdminTestimonial(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.testimonials() });
      await invalidatePublic(qc);
    },
  });
}
export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminTestimonial,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.testimonials() });
      await invalidatePublic(qc);
    },
  });
}

// FAQs
export function useAdminFaqs() {
  return useQuery({
    queryKey: adminKeys.faqs(),
    queryFn: listAdminFaqs,
    placeholderData: [],
    ...adminQueryOptions,
  });
}
export function useAdminFaq(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.faq(id),
    queryFn: () => getAdminFaq(id),
    enabled: enabled && id !== "new",
    ...adminQueryOptions,
  });
}
export function useSaveFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<FaqItem, "id"> }) => saveAdminFaq(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.faqs() });
      await invalidatePublic(qc);
    },
  });
}
export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminFaq,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.faqs() });
      await invalidatePublic(qc);
    },
  });
}

// Site stats
export function useAdminSiteStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: listAdminSiteStats,
    placeholderData: [],
    ...adminQueryOptions,
  });
}
export function useAdminSiteStat(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.stat(id),
    queryFn: () => getAdminSiteStat(id),
    enabled: enabled && id !== "new",
    ...adminQueryOptions,
  });
}
export function useSaveSiteStat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<SiteStat, "id"> }) =>
      saveAdminSiteStat(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.stats() });
      await invalidatePublic(qc);
    },
  });
}
export function useDeleteSiteStat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminSiteStat,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.stats() });
      await invalidatePublic(qc);
    },
  });
}

// Pages
export function useAdminPages() {
  return useQuery({
    queryKey: adminKeys.pages(),
    queryFn: listAdminPages,
    placeholderData: [],
    ...adminQueryOptions,
  });
}
export function useAdminPage(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.page(id),
    queryFn: () => getAdminPage(id),
    enabled: enabled && id !== "new",
    ...adminQueryOptions,
  });
}
export function useSavePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<CmsPage, "id"> }) =>
      saveAdminPage(id, data),
    onSuccess: async (_result, { id }) => {
      await qc.invalidateQueries({ queryKey: adminKeys.pages() });
      await qc.invalidateQueries({ queryKey: adminKeys.page(id) });
      await invalidatePublic(qc);
    },
  });
}

// Settings
export function useAdminSiteSettings() {
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: getAdminSiteSettings,
    ...adminQueryOptions,
  });
}
export function useSaveSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminSiteSettings,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminKeys.settings() });
      await invalidatePublic(qc);
    },
  });
}

// Leads
export function useAdminLeads() {
  return useQuery({
    queryKey: adminKeys.leads(),
    queryFn: listAdminLeads,
    placeholderData: [],
    ...adminQueryOptions,
  });
}
