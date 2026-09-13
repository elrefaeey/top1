import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { cmsClient } from "@/lib/cms/cms-client";
import { localizeBlogPost, localizeFaq, localizeAuthorProfile, localizePortfolio, localizeService, localizeStat, localizeTestimonial } from "@/lib/i18n/localize-cms";
import { useLocaleOptional } from "@/providers/LocaleProvider";
import type {
  Author,
  BlogPost,
  CmsPage,
  FaqItem,
  PortfolioItem,
  Service,
  SiteSettings,
  SiteStat,
  Testimonial,
  WithId,
} from "@/types/cms";

export const cmsKeys = {
  all: ["cms"] as const,
  settings: () => [...cmsKeys.all, "settings"] as const,
  homeBundle: () => [...cmsKeys.all, "home-bundle"] as const,
  services: () => [...cmsKeys.all, "services"] as const,
  service: (slug: string) => [...cmsKeys.all, "service", slug] as const,
  portfolio: () => [...cmsKeys.all, "portfolio"] as const,
  portfolioItem: (slug: string) => [...cmsKeys.all, "portfolio", slug] as const,
  blog: () => [...cmsKeys.all, "blog"] as const,
  blogPost: (slug: string) => [...cmsKeys.all, "blog", slug] as const,
  trending: () => [...cmsKeys.all, "trending"] as const,
  testimonials: () => [...cmsKeys.all, "testimonials"] as const,
  authors: () => [...cmsKeys.all, "authors"] as const,
  author: (slug: string) => [...cmsKeys.all, "author", slug] as const,
  faqs: () => [...cmsKeys.all, "faqs"] as const,
  stats: () => [...cmsKeys.all, "stats"] as const,
  page: (slug: string) => [...cmsKeys.all, "page", slug] as const,
};

const cmsQuery = {
  retry: 1,
  staleTime: 120_000,
  gcTime: 10 * 60_000,
  refetchOnWindowFocus: false,
} as const;

export function useHomeBundle() {
  const qc = useQueryClient();
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.homeBundle(),
    queryFn: async () => {
      const data = await cmsClient.getHomeBundle();
      const result = {
        settings: data.settings as SiteSettings | null,
        services: (data.services ?? []) as WithId<Service>[],
        portfolio: (data.portfolio ?? []) as WithId<PortfolioItem>[],
        stats: (data.stats ?? []) as WithId<SiteStat>[],
        testimonials: (data.testimonials ?? []) as WithId<Testimonial>[],
        faqs: (data.faqs ?? []) as WithId<FaqItem>[],
        blog: (data.blog ?? []) as WithId<BlogPost>[],
        authors: (data.authors ?? []) as WithId<Author>[],
      };
      // Seed related queries so header/footer/other sections avoid duplicate fetches.
      if (result.settings) qc.setQueryData(cmsKeys.settings(), result.settings);
      qc.setQueryData(cmsKeys.services(), result.services);
      qc.setQueryData(cmsKeys.portfolio(), result.portfolio);
      qc.setQueryData(cmsKeys.stats(), result.stats);
      qc.setQueryData(cmsKeys.testimonials(), result.testimonials);
      qc.setQueryData(cmsKeys.faqs(), result.faqs);
      qc.setQueryData(cmsKeys.blog(), result.blog);
      qc.setQueryData(cmsKeys.authors(), result.authors);
      return result;
    },
    ...cmsQuery,
  });
  const data = useMemo(() => {
    if (!query.data) return query.data;
    return {
      ...query.data,
      services: query.data.services.map((item) => localizeService(item, locale)),
      portfolio: query.data.portfolio.map((item) => localizePortfolio(item, locale)),
      blog: query.data.blog.map((item) => localizeBlogPost(item, locale)),
      faqs: query.data.faqs.map((item) => localizeFaq(item, locale)),
      testimonials: query.data.testimonials.map((item) => localizeTestimonial(item, locale)),
      stats: query.data.stats.map((item) => localizeStat(item, locale)),
      authors: query.data.authors.map((item) => localizeAuthorProfile(item, locale)),
    };
  }, [query.data, locale]);
  return { ...query, data };
}

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
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.services(),
    queryFn: () => cmsClient.getServices() as Promise<WithId<Service>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ?? []).map((item) => localizeService(item, locale)),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useService(slug: string) {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.service(slug),
    queryFn: () => cmsClient.getServiceBySlug(slug) as Promise<WithId<Service> | null>,
    enabled: !!slug,
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ? localizeService(query.data, locale) : query.data),
    [query.data, locale],
  );
  return { ...query, data };
}

export function usePortfolio() {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.portfolio(),
    queryFn: () => cmsClient.getPortfolio() as Promise<WithId<PortfolioItem>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ?? []).map((item) => localizePortfolio(item, locale)),
    [query.data, locale],
  );
  return { ...query, data };
}

export function usePortfolioItem(slug: string) {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.portfolioItem(slug),
    queryFn: () => cmsClient.getPortfolioItemBySlug(slug) as Promise<WithId<PortfolioItem> | null>,
    enabled: !!slug,
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ? localizePortfolio(query.data, locale) : query.data),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useBlogPosts(max?: number) {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: [...cmsKeys.blog(), max],
    queryFn: () => cmsClient.getBlogPosts(max) as Promise<WithId<BlogPost>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ?? []).map((item) => localizeBlogPost(item, locale)),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useBlogPost(slug: string) {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.blogPost(slug),
    queryFn: () => cmsClient.getBlogPostBySlug(slug) as Promise<WithId<BlogPost> | null>,
    enabled: !!slug,
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ? localizeBlogPost(query.data, locale) : query.data),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useTrendingPosts() {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.trending(),
    queryFn: () => cmsClient.getTrendingPosts() as Promise<WithId<BlogPost>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ?? []).map((item) => localizeBlogPost(item, locale)),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useTestimonials() {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.testimonials(),
    queryFn: () => cmsClient.getTestimonials() as Promise<WithId<Testimonial>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ?? []).map((item) => localizeTestimonial(item, locale)),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useAuthors() {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.authors(),
    queryFn: () => cmsClient.getAuthors() as Promise<WithId<Author>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ?? []).map((item) => localizeAuthorProfile(item, locale)),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useAuthor(slug: string) {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.author(slug),
    queryFn: () => cmsClient.getAuthorBySlug(slug) as Promise<WithId<Author> | null>,
    enabled: !!slug,
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ? localizeAuthorProfile(query.data, locale) : query.data),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useFaqs() {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.faqs(),
    queryFn: () => cmsClient.getFaqs() as Promise<WithId<FaqItem>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ?? []).map((item) => localizeFaq(item, locale)),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useSiteStats() {
  const locale = useLocaleOptional();
  const query = useQuery({
    queryKey: cmsKeys.stats(),
    queryFn: () => cmsClient.getSiteStats() as Promise<WithId<SiteStat>[]>,
    placeholderData: [],
    ...cmsQuery,
  });
  const data = useMemo(
    () => (query.data ?? []).map((item) => localizeStat(item, locale)),
    [query.data, locale],
  );
  return { ...query, data };
}

export function useSubmitLead() {
  return useMutation({
    mutationFn: (input: {
      name: string;
      email?: string;
      phone?: string;
      message: string;
      source?: string;
      website?: string;
    }) => cmsClient.submitLead(input),
  });
}
