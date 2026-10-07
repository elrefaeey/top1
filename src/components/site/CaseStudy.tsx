import { ArrowRight, TrendingUp } from "lucide-react";
import type { CaseStudyMetric, PortfolioItem } from "@/types/cms";
import { useLocale } from "@/providers/LocaleProvider";

export function caseMetricsOf(item: Pick<PortfolioItem, "caseMetrics">): CaseStudyMetric[] {
  return (item.caseMetrics ?? []).filter((metric) => metric.label?.trim() && metric.after?.trim());
}

export function CaseMetricCard({ metric, compact = false }: { metric: CaseStudyMetric; compact?: boolean }) {
  const { m } = useLocale();
  const headline = metric.change?.trim() || metric.after;
  const showAfter = Boolean(metric.change?.trim());

  return (
    <div className={compact ? "case-metric case-metric--compact" : "case-metric"}>
      <span className="case-metric-value" dir="ltr">
        {headline}
      </span>
      <span className="case-metric-label">{metric.label}</span>
      {(metric.before || showAfter) && (
        <span className="case-metric-flow">
          {metric.before && (
            <>
              <span>
                {m.portfolioDetail.before} <b dir="ltr">{metric.before}</b>
              </span>
              <ArrowRight className="h-3 w-3 shrink-0 rtl-flip" aria-hidden />
            </>
          )}
          <span>
            {m.portfolioDetail.after} <b dir="ltr">{metric.after}</b>
          </span>
        </span>
      )}
    </div>
  );
}

export function CaseHighlightBadge({ metric }: { metric: CaseStudyMetric }) {
  return (
    <span className="case-badge">
      <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <b dir="ltr">{metric.change?.trim() || metric.after}</b>
      <span className="truncate">{metric.label}</span>
    </span>
  );
}
