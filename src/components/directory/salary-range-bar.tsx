"use client";

import { motion } from "motion/react";
import type { MarketCompensationStats } from "@/types/career";
import { formatCurrencyAmount, formatSalaryRange } from "@/lib/format";

const APPROX_INR_PER_USD = 85;

interface SalaryRangeBarProps {
  primaryStats: MarketCompensationStats;
  fallbackStats: MarketCompensationStats;
}

function formatConvertedEquiv(
  min: number,
  max: number,
  fromCurrency: "INR" | "USD"
): string {
  if (fromCurrency === "INR") {
    const usdMin = Math.round(min / APPROX_INR_PER_USD);
    const usdMax = Math.round(max / APPROX_INR_PER_USD);
    return `≈ ${formatSalaryRange(usdMin, usdMax, "USD")} equiv.`;
  }
  const inrMin = Math.round(min * APPROX_INR_PER_USD);
  const inrMax = Math.round(max * APPROX_INR_PER_USD);
  return `≈ ${formatSalaryRange(inrMin, inrMax, "INR")} equiv.`;
}

export function SalaryRangeBar({
  primaryStats,
  fallbackStats,
}: SalaryRangeBarProps) {
  const hasPrimary =
    primaryStats.disclosedPayCount > 0 &&
    primaryStats.startingMin !== null &&
    primaryStats.avgMin !== null &&
    primaryStats.avgMax !== null &&
    primaryStats.ceilingMax !== null;

  // Honest fallback when the selected market has 0 listings for this role
  if (!hasPrimary) {
    const hasFallback =
      fallbackStats.disclosedPayCount > 0 &&
      fallbackStats.avgMin !== null &&
      fallbackStats.avgMax !== null;

    if (!hasFallback) {
      return (
        <div className="rounded-md border border-dashed border-line-strong bg-surface-tint px-3 py-2 text-xs text-ink-subtle">
          No disclosed annual salary in current listings
        </div>
      );
    }

    const sourceLabel =
      fallbackStats.currency === "INR" ? "India market only" : "Global USD only";

    return (
      <div className="rounded-md border border-line-hairline bg-surface-tint/80 px-3 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-clay">
            {sourceLabel}
          </span>
          <span className="tabular-nums-strict font-mono text-[11px] text-ink-muted">
            {formatConvertedEquiv(
              fallbackStats.avgMin!,
              fallbackStats.avgMax!,
              fallbackStats.currency
            )}
          </span>
        </div>
        <p className="tabular-nums-strict mt-1 font-mono text-xs font-semibold text-brand-navy">
          {formatSalaryRange(
            fallbackStats.avgMin,
            fallbackStats.avgMax,
            fallbackStats.currency
          )}
          <span className="ml-1.5 font-sans text-[11px] font-normal text-ink-muted">
            local avg (not converted rate)
          </span>
        </p>
      </div>
    );
  }

  const min = primaryStats.startingMin!;
  const max = primaryStats.ceilingMax!;
  const avgMin = primaryStats.avgMin!;
  const avgMax = primaryStats.avgMax!;
  const spread = max - min;

  // Calculate where the typical avg band sits inside this role's own min -> max range
  const avgLeftPct =
    spread > 0 ? Math.max(0, Math.min(92, ((avgMin - min) / spread) * 100)) : 0;
  const avgRightPct =
    spread > 0
      ? Math.max(avgLeftPct + 8, Math.min(100, ((avgMax - min) / spread) * 100))
      : 100;
  const avgWidthPct = Math.max(8, avgRightPct - avgLeftPct);

  return (
    <div className="space-y-2">
      {/* Headline Typical Pay */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="tabular-nums-strict font-mono text-sm font-bold text-brand-navy">
          {formatSalaryRange(avgMin, avgMax, primaryStats.currency)}
          <span className="ml-1.5 font-sans text-[11px] font-medium text-ink-muted">
            typical / yr
          </span>
        </div>
        <span className="rounded bg-surface-tint px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-muted ring-1 ring-line-hairline">
          {primaryStats.disclosedPayCount} paid{" "}
          {primaryStats.disclosedPayCount === 1 ? "listing" : "listings"}
        </span>
      </div>

      {/* Self-Scaled Visual Track (Role's Lowest -> Highest) */}
      <div className="relative flex h-3 items-center">
        {/* Full observed spread rail */}
        <div className="h-1.5 w-full rounded-full bg-brand-navy/12" />

        {/* Typical average band highlight */}
        <motion.div
          initial={false}
          animate={{
            left: `${avgLeftPct}%`,
            width: `${avgWidthPct}%`,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="absolute h-2.5 rounded-full bg-brand-orange shadow-[0_1px_2px_rgba(231,90,15,0.3)]"
        />
      </div>

      {/* Clear Left / Right Endpoint Labels */}
      <div className="tabular-nums-strict flex items-center justify-between font-mono text-[11px] text-ink-muted">
        <span>
          Lowest: {formatCurrencyAmount(min, primaryStats.currency)}
        </span>
        {spread === 0 ? (
          <span className="font-sans text-[10px] text-brand-clay">
            Single benchmark
          </span>
        ) : (
          <span>
            Highest: {formatCurrencyAmount(max, primaryStats.currency)}
          </span>
        )}
      </div>
    </div>
  );
}