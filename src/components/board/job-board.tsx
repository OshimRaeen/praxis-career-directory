"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Buildings,
  ChartPieSlice,
  Clock,
  MagnifyingGlass,
  MapPin,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import type {
  DataQualityFlag,
  JobListing,
  MarketRegion,
  RoleProfile,
  WorkMode,
} from "@/types/career";
import {
  filterAndSortListings,
  type BoardSortOption,
} from "@/lib/filters";
import { formatEquityRange, formatSalaryRange } from "@/lib/format";
import { MonetizationRail } from "./monetization-rail";

interface JobBoardProps {
  listings: JobListing[];
  roles: RoleProfile[];
  roleSlug: string;
  onRoleSlugChange: (slug: string) => void;
  onStartRoadmap: (roleCategory: string) => void;
}

const PAGE_SIZE = 12;

const FLAG_LABELS: Record<DataQualityFlag, string> = {
  verify_pay_period: "Verify pay period",
  assumed_usd: "Assumed USD ($)",
  intern_pay_check: "Verify intern pay",
  external_source: "External source",
  commission_based: "Commission-based",
};

export function JobBoard({
  listings,
  roles,
  roleSlug,
  onRoleSlugChange,
  onStartRoadmap,
}: JobBoardProps) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<"All" | MarketRegion>("All");
  const [workMode, setWorkMode] = useState<"All" | WorkMode>("All");
  const [equityOnly, setEquityOnly] = useState(false);
  const [verifiedPayOnly, setVerifiedPayOnly] = useState(false);
  const [sortBy, setSortBy] = useState<BoardSortOption>("default");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      filterAndSortListings(listings, {
        query,
        roleSlug,
        region,
        workMode,
        equityOnly,
        verifiedPayOnly,
        sortBy,
      }),
    [
      listings,
      query,
      roleSlug,
      region,
      workMode,
      equityOnly,
      verifiedPayOnly,
      sortBy,
    ]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const hasActiveFilters =
    query.trim() !== "" ||
    roleSlug !== "all" ||
    region !== "All" ||
    workMode !== "All" ||
    equityOnly ||
    verifiedPayOnly;

  const resetFilters = () => {
    setQuery("");
    onRoleSlugChange("all");
    setRegion("All");
    setWorkMode("All");
    setEquityOnly(false);
    setVerifiedPayOnly(false);
    setSortBy("default");
    setPage(1);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 border-b border-line-hairline pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-clay">
            Live Market Evidence · {listings.length} Listings
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            Global Job Board
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Inspect individual startup roles, disclosed pay bands, equity
            stakes, and direct application links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="tabular-nums-strict rounded-md border border-line-hairline bg-surface-tint px-3 py-1.5 font-mono text-xs font-semibold text-brand-navy">
            {filtered.length} matching
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-md border border-line-hairline px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand-navy hover:text-brand-navy"
            >
              <X size={13} weight="bold" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </section>

      {/* Filter Bar */}
      <section className="space-y-3 rounded-xl border border-line-hairline bg-surface-tint/70 p-4">
        <div className="grid gap-3 md:grid-cols-12">
          {/* Search */}
          <div className="relative md:col-span-5">
            <MagnifyingGlass
              size={15}
              weight="regular"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search title, company, city, or skill..."
              className="w-full rounded-lg border border-line-hairline bg-surface-paper py-2 pr-3 pl-9 text-sm text-brand-navy placeholder:text-ink-subtle focus:border-brand-navy focus:outline-none"
            />
          </div>

          {/* Role Select */}
          <div className="md:col-span-3">
            <select
              aria-label="Filter by role category"
              value={roleSlug}
              onChange={(e) => {
                onRoleSlugChange(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-line-hairline bg-surface-paper px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
            >
              <option value="all">All Role Categories</option>
              {roles.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.roleCategory} ({r.totalListings})
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode Select */}
          <div className="md:col-span-2">
            <select
              aria-label="Filter by work mode"
              value={workMode}
              onChange={(e) => {
                setWorkMode(e.target.value as "All" | WorkMode);
                setPage(1);
              }}
              className="w-full rounded-lg border border-line-hairline bg-surface-paper px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
            >
              <option value="All">Any Work Mode</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid / Flexible">Hybrid / Flexible</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="md:col-span-2">
            <select
              aria-label="Sort listings"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as BoardSortOption);
                setPage(1);
              }}
              className="w-full rounded-lg border border-line-hairline bg-surface-paper px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="pay-desc">Highest Pay</option>
              <option value="exp-asc">Lowest Experience</option>
            </select>
          </div>
        </div>

        {/* Secondary Toggle Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Region Pill Switcher */}
          <div className="inline-flex rounded-lg border border-line-hairline bg-surface-paper p-0.5">
            {(["All", "India", "International"] as const).map((opt) => {
              const active = region === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setRegion(opt);
                    setPage(1);
                  }}
                  className={`relative rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                    active
                      ? "text-white"
                      : "text-ink-muted hover:text-brand-navy"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="board-region-pill"
                      transition={{
                        type: "spring",
                        stiffness: 460,
                        damping: 34,
                      }}
                      className="absolute inset-0 rounded-md bg-brand-navy"
                    />
                  )}
                  <span className="relative z-10">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Boolean Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEquityOnly((prev) => !prev);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                equityOnly
                  ? "border-brand-orange bg-surface-warm text-brand-navy"
                  : "border-line-hairline bg-surface-paper text-ink-muted hover:border-brand-navy"
              }`}
            >
              <ChartPieSlice
                size={14}
                weight={equityOnly ? "duotone" : "regular"}
                className={equityOnly ? "text-brand-orange" : ""}
              />
              <span>Equity Disclosed</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVerifiedPayOnly((prev) => !prev);
                setPage(1);
              }}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                verifiedPayOnly
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-line-hairline bg-surface-paper text-ink-muted hover:border-brand-navy"
              }`}
            >
              Verified Annual Pay Only
            </button>
          </div>
        </div>
      </section>

      {/* Main Two-Column Grid: Listings Feed + Monetization Rail */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Listings Column */}
        <div className="space-y-4 lg:col-span-8">
          {/* Partner Spotlight Demo Slot (visible on page 1 without active search) */}
          {safePage === 1 && !hasActiveFilters && (
            <div className="rounded-xl border border-brand-orange/35 bg-surface-warm p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-brand-orange/12 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-orange">
                  Partner Spotlight · Featured Slot
                </span>
                <span className="font-mono text-[11px] text-ink-muted">
                  Direct Cohort Hiring
                </span>
              </div>
              <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-bold text-brand-navy">
                    Apprentice Full-Stack &amp; HR Cohorts — Praxis Partner
                    Network
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                    Reserved slot for Birthday Messaging partner companies and
                    sponsored roles targeting Praxis graduates.
                  </p>
                </div>
                <a
                  href="mailto:hr@birthdaymessaging.io?subject=Sponsor%20a%20Role%20on%20Praxis"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand-navy px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-orange"
                >
                  <span>Sponsor a Role</span>
                  <ArrowUpRight size={13} weight="bold" />
                </a>
              </div>
            </div>
          )}

          {/* Listings List */}
          {paginated.length === 0 ? (
            <div className="rounded-xl border border-line-hairline bg-surface-paper px-6 py-16 text-center">
              <p className="text-sm font-semibold text-brand-navy">
                No listings match these filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 rounded-md bg-brand-navy px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-orange"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-line-hairline overflow-hidden rounded-xl border border-line-hairline bg-surface-paper">
              {paginated.map((item) => {
                const hasAnnual = item.compensation.annualMin !== null;
                const hasRaw = item.compensation.rawMin !== null;

                return (
                  <article
                    key={item.id}
                    className="group p-5 transition-colors hover:bg-surface-tint/60"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      {/* Left: Title & Metadata */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-clay">
                            {item.roleCategory}
                          </span>
                          <span className="text-line-strong">·</span>
                          <span className="font-mono text-[10px] text-ink-subtle">
                            {item.id}
                          </span>
                          {item.seniority !== "Not stated" && (
                            <span className="rounded bg-surface-tint px-1.5 py-0.5 text-[10px] font-medium text-brand-navy ring-1 ring-line-hairline">
                              {item.seniority}
                            </span>
                          )}
                        </div>

                        <h2 className="mt-1 text-[15px] font-bold text-brand-navy">
                          {item.title}
                        </h2>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                          <span className="inline-flex items-center gap-1 font-medium text-ink-primary">
                            <Buildings size={13} weight="duotone" />
                            {item.company}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={13} weight="regular" />
                            {item.location}
                          </span>
                          <span className="rounded bg-surface-tint px-1.5 py-0.5 text-[11px] text-ink-muted">
                            {item.workMode}
                          </span>
                          {item.experienceYears !== null && (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                              <Clock size={12} weight="regular" />
                              {item.experienceYears === 0
                                ? "0+ yrs"
                                : `${item.experienceYears}+ yrs`}
                            </span>
                          )}
                        </div>

                        {/* Skills & Data Quality Flags */}
                        {(item.skills.length > 0 ||
                          item.dataQualityFlags.length > 0) && (
                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            {item.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded border border-line-hairline bg-surface-paper px-2 py-0.5 font-mono text-[10px] font-medium text-brand-navy"
                              >
                                {skill}
                              </span>
                            ))}
                            {item.dataQualityFlags.map((flag) => (
                              <span
                                key={flag}
                                title={item.notes ?? FLAG_LABELS[flag]}
                                className="inline-flex items-center gap-1 rounded bg-surface-warm px-2 py-0.5 text-[10px] font-medium text-brand-clay ring-1 ring-brand-clay/25"
                              >
                                <WarningCircle size={11} weight="duotone" />
                                {FLAG_LABELS[flag]}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Compensation + Apply Link */}
                      <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-line-hairline pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                        <div className="text-left sm:text-right">
                          {hasAnnual ? (
                            <p className="tabular-nums-strict font-mono text-sm font-bold text-brand-navy">
                              {formatSalaryRange(
                                item.compensation.annualMin,
                                item.compensation.annualMax,
                                item.compensation.currency
                              )}
                              <span className="ml-1 font-sans text-[10px] font-normal text-ink-muted">
                                / yr
                              </span>
                            </p>
                          ) : hasRaw ? (
                            <p className="tabular-nums-strict font-mono text-xs font-semibold text-brand-clay">
                              {formatSalaryRange(
                                item.compensation.rawMin,
                                item.compensation.rawMax,
                                item.compensation.currency
                              )}
                              <span className="ml-1 font-sans text-[10px] font-normal">
                                (unverified)
                              </span>
                            </p>
                          ) : (
                            <p className="text-xs text-ink-subtle">
                              Pay not disclosed
                            </p>
                          )}

                          {item.equity.disclosed && (
                            <p className="tabular-nums-strict mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] font-medium text-brand-cerulean">
                              <ChartPieSlice size={12} weight="duotone" />
                              {formatEquityRange(
                                item.equity.minPercent,
                                item.equity.maxPercent
                              )}{" "}
                              equity
                            </p>
                          )}
                        </div>

                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-line-hairline bg-surface-paper px-3 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white"
                        >
                          <span>View Listing</span>
                          <ArrowUpRight size={13} weight="bold" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Job board pagination"
              className="flex items-center justify-between pt-2"
            >
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1.5 rounded-md border border-line-hairline bg-surface-paper px-3 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:border-brand-navy disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={13} weight="bold" />
                <span>Previous</span>
              </button>

              <span className="tabular-nums-strict font-mono text-xs text-ink-muted">
                Page {safePage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1.5 rounded-md border border-line-hairline bg-surface-paper px-3 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:border-brand-navy disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Next</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </nav>
          )}
        </div>

        {/* Right Sidebar: Praxis Products & Partnerships */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <MonetizationRail onStartRoadmap={onStartRoadmap} />
          </div>
        </div>
      </div>
    </div>
  );
}