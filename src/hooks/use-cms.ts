import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLead,
  getBlogPosts,
  getBlogPostBySlug,
  getFaqs,
  getPageById,
  getPageBySlug,
  getPortfolio,
  getPricingPlans,
  getServiceBySlug,
  getServices,
  getSiteSettings,
  getSiteStats,
  getTestimonials,
  getTrendingPosts,
} from "@/lib/cms/content-service";

export const cmsKeys = {
  all: ["cms"] as const,
  settings: () => [...cmsKeys.all, "settings"] as const,
  services: () => [...cmsKeys.all, "services"] as const,
  service: (slug: string) => [...cmsKeys.all, "service", slug] as const,
  portfolio: () => [...cmsKeys.all, "portfolio"] as const,
  blog: () => [...cmsKeys.all, "blog"] as const,
  blogPost: (slug: string) => [...cmsKeys.all, "blog", slug] as const,
  trending: () => [...cmsKeys.all, "trending"] as const,
  testimonials: () => [...cmsKeys.all, "testimonials"] as const,
  pricing: () => [...cmsKeys.all, "pricing"] as const,
  faqs: () => [...cmsKeys.all, "faqs"] as const,
  stats: () => [...cmsKeys.all, "stats"] as const,
  page: (slug: string) => [...cmsKeys.all, "page", slug] as const,
};

const cmsQuery = {
  retry: false,
  staleTime: 60_000,
  refetchOnWindowFocus: false,
} as const;

export function useSiteSettings() {
  return useQuery({ queryKey: cmsKeys.settings(), queryFn: getSiteSettings, ...cmsQuery });
}

export function usePage(slug: string) {
  return useQuery({
    queryKey: cmsKeys.page(slug),
    queryFn: () => getPageBySlug(slug),
    enabled: !!slug,
    ...cmsQuery,
  });
}

export function usePageById(id: string) {
  return useQuery({
    queryKey: cmsKeys.page(id),
    queryFn: () => getPageById(id),
    enabled: !!id,
    ...cmsQuery,
  });
}

export function useServices() {
  return useQuery({
    queryKey: cmsKeys.services(),
    queryFn: getServices,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useService(slug: string) {
  return useQuery({
    queryKey: cmsKeys.service(slug),
    queryFn: () => getServiceBySlug(slug),
    enabled: !!slug,
    ...cmsQuery,
  });
}

export function usePortfolio() {
  return useQuery({
    queryKey: cmsKeys.portfolio(),
    queryFn: getPortfolio,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useBlogPosts(max?: number) {
  return useQuery({
    queryKey: [...cmsKeys.blog(), max],
    queryFn: () => getBlogPosts(max),
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: cmsKeys.blogPost(slug),
    queryFn: () => getBlogPostBySlug(slug),
    enabled: !!slug,
    ...cmsQuery,
  });
}

export function useTrendingPosts() {
  return useQuery({
    queryKey: cmsKeys.trending(),
    queryFn: () => getTrendingPosts(),
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: cmsKeys.testimonials(),
    queryFn: getTestimonials,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function usePricingPlans() {
  return useQuery({
    queryKey: cmsKeys.pricing(),
    queryFn: getPricingPlans,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: cmsKeys.faqs(),
    queryFn: getFaqs,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useSiteStats() {
  return useQuery({
    queryKey: cmsKeys.stats(),
    queryFn: getSiteStats,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useSubmitLead() {
  return useMutation({ mutationFn: createLead });
}
