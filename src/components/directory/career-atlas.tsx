"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChartPieSlice,
  GlobeHemisphereWest,
  Info,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import type { JobFamily, JobListing, RoleProfile } from "@/types/career";
import { formatEquityRange } from "@/lib/format";
import { SalaryRangeBar } from "./salary-range-bar";
import { RoleDrawer } from "./role-drawer";

interface CareerAtlasProps {
  roles: RoleProfile[];
  listings: JobListing[];
  onStartRoadmap: (roleCategory: string) => void;
  onViewRoleListings: (roleSlug: string) => void;
}

type FamilyFilter = "All" | JobFamily;
type MarketView = "indiaInr" | "globalUsd";

const COMING_SOON_TRACKS = ["DevOps", "Accounting", "Business"];

export function CareerAtlas({
  roles,
  listings,
  onStartRoadmap,
  onViewRoleListings,
}: CareerAtlasProps) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<FamilyFilter>("All");
  const [market, setMarket] = useState<MarketView>("indiaInr");
  const [selectedRole, setSelectedRole] = useState<RoleProfile | null>(null);

  const fallbackMarket: MarketView =
    market === "indiaInr" ? "globalUsd" : "indiaInr";

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roles.filter((role) => {
      if (family !== "All" && role.jobFamily !== family) return false;
      if (!q) return true;
      const haystack = [
        role.roleCategory,
        role.jobFamily,
        ...role.observedSkills,
        ...role.guidance.coreSkills,
        ...role.guidance.nextRoles,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [roles, family, query]);

  const totalPaidInMarket = useMemo(
    () =>
      roles.reduce((acc, r) => acc + r.markets[market].disclosedPayCount, 0),
    [roles, market]
  );

  return (
    <div className="space-y-8">
      {/* Editorial Hero Header */}
      <section className="border-b border-line-hairline pb-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-clay">
              Praxis Outcome Directory
            </p>
            <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              Explore where your apprenticeship & Mentorship can take you.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
              Compare starting salaries, average pay bands, startup equity
              ranges, and required stacks across{" "}
              <span className="font-semibold text-brand-navy">
                {roles.length} career tracks
              </span>{" "}
              backed by{" "}
              <span className="font-semibold text-brand-navy">
                {listings.length} live market listings
              </span>{" "}
              collected from Wellfound.
            </p>
          </div>

          {/* Quick Market Snapshot */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-lg border border-line-hairline bg-surface-tint px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Roles Mapped
              </p>
              <p className="tabular-nums-strict mt-1 font-mono text-xl font-bold text-brand-navy">
                {roles.length}
              </p>
            </div>
            <div className="rounded-lg border border-line-hairline bg-surface-tint px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Verified Paid
              </p>
              <p className="tabular-nums-strict mt-1 font-mono text-xl font-bold text-brand-navy">
                {totalPaidInMarket}
              </p>
            </div>
            <div className="rounded-lg border border-line-hairline bg-surface-tint px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Listings
              </p>
              <p className="tabular-nums-strict mt-1 font-mono text-xl font-bold text-brand-orange">
                {listings.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Controls Bar */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-sm">
          <MagnifyingGlass
            size={16}
            weight="regular"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, skill, or stack (e.g. React, HR)..."
            className="w-full rounded-lg border border-line-hairline bg-surface-paper py-2.5 pr-4 pl-10 text-sm text-brand-navy placeholder:text-ink-subtle focus:border-brand-navy focus:outline-none"
          />
        </div>

        {/* Market Switcher (India INR vs Global USD) */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <GlobeHemisphereWest size={15} weight="duotone" />
            <span>Compensation Market:</span>
          </span>
          <div className="inline-flex rounded-lg border border-line-hairline bg-surface-tint p-1">
            {(
              [
                { id: "indiaInr", label: "India · INR" },
                { id: "globalUsd", label: "Global · USD" },
              ] as const
            ).map((opt) => {
              const active = market === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMarket(opt.id)}
                  className={`relative rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                    active
                      ? "text-white"
                      : "text-ink-muted hover:text-brand-navy"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="market-toggle-pill"
                      transition={{
                        type: "spring",
                        stiffness: 460,
                        damping: 34,
                      }}
                      className="absolute inset-0 rounded-md bg-brand-navy"
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Family Filter Strip + Phase 2 Tracks */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            ["All", "Full-Stack Development", "HR & Recruitment"] as const
          ).map((item) => {
            const active = family === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFamily(item)}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "border-brand-navy bg-brand-navy text-white"
                    : "border-line-hairline bg-surface-paper text-ink-muted hover:border-brand-navy hover:text-brand-navy"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-ink-subtle">
          <span>Expanding next:</span>
          {COMING_SOON_TRACKS.map((track) => (
            <span
              key={track}
              className="rounded border border-dashed border-line-strong px-2 py-0.5 font-mono text-[10px] text-ink-muted"
            >
              {track}
            </span>
          ))}
        </div>
      </section>

      {/* Editorial Ledger Table */}
      <section className="overflow-hidden rounded-xl border border-line-hairline bg-surface-paper">
        {/* Column Headers (Desktop) */}
        <div className="hidden grid-cols-12 gap-4 border-b border-line-hairline bg-surface-tint px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted lg:grid">
          <div className="col-span-4">Career Track &amp; Skills</div>
          <div className="col-span-5 flex items-center justify-between gap-2">
            <span>Annual Pay ({market === "indiaInr" ? "INR" : "USD"})</span>
            <span className="inline-flex items-center gap-2.5 font-sans text-[10px] font-normal normal-case tracking-normal text-ink-subtle">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-brand-orange" />
                Typical avg
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-3 rounded-full bg-brand-navy/20" />
                Min–Max spread
              </span>
            </span>
          </div>
          <div className="col-span-2">Equity &amp; Sample</div>
          <div className="col-span-1 text-right">Inspect</div>
        </div>

        {filteredRoles.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-semibold text-brand-navy">
              No career tracks match &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Try searching for Frontend, Backend, Full-Stack, HR, or Recruiter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line-hairline">
            {filteredRoles.map((role) => {
              const stats = role.markets[market];
              const displaySkills =
                role.observedSkills.length > 0
                  ? role.observedSkills.slice(0, 4)
                  : role.guidance.coreSkills.slice(0, 3);

              return (
                <div
                  key={role.slug}
                  onClick={() => setSelectedRole(role)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedRole(role);
                    }
                  }}
                  className="group grid cursor-pointer grid-cols-1 items-center gap-5 px-5 py-5 transition-colors hover:bg-surface-tint/75 sm:px-6 lg:grid-cols-12 lg:gap-4"
                >
                  {/* Column 1: Role + Skills */}
                  <div className="lg:col-span-4">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-clay">
                      {role.jobFamily}
                    </p>
                    <h2 className="mt-0.5 text-base font-bold text-brand-navy transition-colors group-hover:text-brand-orange">
                      {role.roleCategory}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {displaySkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded border border-line-hairline bg-surface-paper px-2 py-0.5 text-[11px] text-ink-muted"
                        >
                          {skill.replace(/\.$/, "")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Self-Scaled Salary Range Bar */}
                  <div className="lg:col-span-5">
                    <SalaryRangeBar
                      primaryStats={stats}
                      fallbackStats={role.markets[fallbackMarket]}
                    />
                  </div>

                  {/* Column 3: Equity & Sample Size */}
                  <div className="flex flex-wrap items-center justify-between gap-2 lg:col-span-2 lg:flex-col lg:items-start lg:gap-1.5">
                    <div className="inline-flex items-center gap-1.5 text-xs text-brand-navy">
                      <ChartPieSlice
                        size={14}
                        weight="duotone"
                        className="text-brand-cerulean"
                      />
                      <span className="tabular-nums-strict font-mono text-[11px]">
                        {role.equitySummary.disclosedCount > 0
                          ? formatEquityRange(
                              role.equitySummary.minPercent,
                              role.equitySummary.maxPercent
                            )
                          : "No equity data"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
                      <span>{role.totalListings} listings</span>
                      {stats.disclosedPayCount > 0 &&
                        stats.lowSampleWarning && (
                          <span
                            title="Fewer than 10 paid listings in this market — treat as indicative."
                            className="inline-flex items-center gap-0.5 text-brand-clay"
                          >
                            <Info size={13} weight="duotone" />
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Column 4: Inspect Arrow */}
                  <div className="hidden justify-end lg:col-span-1 lg:flex">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line-hairline bg-surface-paper text-ink-muted transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
                      <ArrowRight size={15} weight="bold" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Methodology Footnote */}
      <p className="text-xs leading-relaxed text-ink-muted">
        <strong className="font-semibold text-brand-navy">
          Data transparency:
        </strong>{" "}
        Compensation bars reflect employer-disclosed annual pay from public
        Wellfound listings collected Nov 15–18, 2026. India (INR) and Global
        (USD) markets are kept separate so local pay benchmarks stay accurate;
        when a role only has listings in the other market, an approximate
        reference conversion is shown alongside the local average. Roles marked
        with{" "}
        <Info size={13} weight="duotone" className="inline text-brand-clay" />{" "}
        have fewer than 10 paid listings in that market.
      </p>

      {/* Slide-over Role Drawer */}
      <RoleDrawer
        role={selectedRole}
        listings={listings}
        onClose={() => setSelectedRole(null)}
        onStartRoadmap={onStartRoadmap}
        onViewRoleListings={onViewRoleListings}
      />
    </div>
  );
}