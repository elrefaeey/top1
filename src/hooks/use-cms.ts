import { useMutation, useQuery } from "@tanstack/react-query";
import { cmsClient } from "@/lib/cms/cms-client";
import { createLead } from "@/lib/cms/content-service";
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
  WithId,
} from "@/types/cms";

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
  retry: 1,
  staleTime: 60_000,
  refetchOnWindowFocus: false,
} as const;

export function useSiteSettings() {
  return useQuery({
    queryKey: cmsKeys.settings(),
    queryFn: () => cmsClient.getSiteSettings() as Promise<SiteSettings | null>,
    ...cmsQuery,
  });
}

export function usePage(slug: string) {
  return useQuery({
    queryKey: cmsKeys.page(slug),
    queryFn: () => cmsClient.getPageBySlug(slug) as Promise<WithId<CmsPage> | null>,
    enabled: !!slug,
    ...cmsQuery,
  });
}

export function usePageById(id: string) {
  return useQuery({
    queryKey: cmsKeys.page(id),
    queryFn: () => cmsClient.getPageById(id) as Promise<WithId<CmsPage> | null>,
    enabled: !!id,
    ...cmsQuery,
  });
}

export function useServices() {
  return useQuery({
    queryKey: cmsKeys.services(),
    queryFn: () => cmsClient.getServices() as Promise<WithId<Service>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useService(slug: string) {
  return useQuery({
    queryKey: cmsKeys.service(slug),
    queryFn: () => cmsClient.getServiceBySlug(slug) as Promise<WithId<Service> | null>,
    enabled: !!slug,
    ...cmsQuery,
  });
}

export function usePortfolio() {
  return useQuery({
    queryKey: cmsKeys.portfolio(),
    queryFn: () => cmsClient.getPortfolio() as Promise<WithId<PortfolioItem>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useBlogPosts(max?: number) {
  return useQuery({
    queryKey: [...cmsKeys.blog(), max],
    queryFn: () => cmsClient.getBlogPosts(max) as Promise<WithId<BlogPost>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: cmsKeys.blogPost(slug),
    queryFn: () => cmsClient.getBlogPostBySlug(slug) as Promise<WithId<BlogPost> | null>,
    enabled: !!slug,
    ...cmsQuery,
  });
}

export function useTrendingPosts() {
  return useQuery({
    queryKey: cmsKeys.trending(),
    queryFn: () => cmsClient.getTrendingPosts() as Promise<WithId<BlogPost>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: cmsKeys.testimonials(),
    queryFn: () => cmsClient.getTestimonials() as Promise<WithId<Testimonial>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function usePricingPlans() {
  return useQuery({
    queryKey: cmsKeys.pricing(),
    queryFn: () => cmsClient.getPricingPlans() as Promise<WithId<PricingPlan>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: cmsKeys.faqs(),
    queryFn: () => cmsClient.getFaqs() as Promise<WithId<FaqItem>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useSiteStats() {
  return useQuery({
    queryKey: cmsKeys.stats(),
    queryFn: () => cmsClient.getSiteStats() as Promise<WithId<SiteStat>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
}

export function useSubmitLead() {
  return useMutation({ mutationFn: createLead });
}
