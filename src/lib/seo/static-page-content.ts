import type { BlogPost, FaqItem, PortfolioItem, Service } from "@/types/cms";

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function joinParts(parts: Array<string | undefined | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function aggregateServicesCopy(services: Service[], faqs: FaqItem[] = []): string {
  const serviceText = services
    .map((s) =>
      joinParts([
        s.title,
        s.tagline,
        s.shortDescription,
        s.description,
        s.features?.join(" "),
        s.deliverables?.join(" "),
        s.process?.map((step) => `${step.title} ${step.description}`).join(" "),
      ]),
    )
    .join(" ");

  const faqText = faqs.map((f) => `${f.question} ${f.answer}`).join(" ");
  return joinParts([serviceText, faqText]);
}

export function aggregatePortfolioCopy(items: PortfolioItem[]): string {
  return items
    .map((item) =>
      joinParts([item.title, item.category, item.description, item.tags?.join(" "), item.client]),
    )
    .join(" ");
}

export function aggregateBlogCopy(posts: BlogPost[]): string {
  return posts
    .map((post) => joinParts([post.title, post.excerpt, post.category, post.tags?.join(" ")]))
    .join(" ");
}

export function featuredBlogCategories(posts: BlogPost[]): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    if (!post.category) continue;
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([category]) => category);
}
