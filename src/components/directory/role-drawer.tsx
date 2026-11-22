"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  ChartPieSlice,
  Info,
  MapPin,
  Path,
  X,
} from "@phosphor-icons/react";
import type { JobListing, RoleProfile } from "@/types/career";
import {
  formatCurrencyAmount,
  formatEquityRange,
  formatSalaryRange,
} from "@/lib/format";

interface RoleDrawerProps {
  role: RoleProfile | null;
  listings: JobListing[];
  onClose: () => void;
  onStartRoadmap: (roleCategory: string) => void;
  onViewRoleListings: (roleSlug: string) => void;
}

export function RoleDrawer({
  role,
  listings,
  onClose,
  onStartRoadmap,
  onViewRoleListings,
}: RoleDrawerProps) {
  useEffect(() => {
    if (!role) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [role, onClose]);

  const roleListings = role
    ? listings.filter((item) => item.roleSlug === role.slug)
    : [];

  return (
    <AnimatePresence>
      {role && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-navy/35 backdrop-blur-[2px]"
          />

          {/* Slide-over panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={role.roleCategory}
            initial={{ opacity: 0.6, clipPath: "inset(0 0 0 100%)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0 0%)" }}
            exit={{ opacity: 0.4, clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-surface-paper shadow-2xl ring-1 ring-line-hairline"
          >
            {/* Sticky Header */}
            <div className="flex items-start justify-between gap-4 border-b border-line-hairline px-6 py-5">
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-brand-clay">
                  {role.jobFamily}
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy">
                  {role.roleCategory}
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  {role.totalListings} observed listings · {role.remoteCount}{" "}
                  remote-friendly
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close role details"
                className="rounded-md border border-line-hairline p-2 text-ink-muted transition-colors hover:border-brand-navy hover:text-brand-navy"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
              {/* Dual Market Compensation Cards */}
              <section>
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Observed Annual Compensation
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "India · INR", stats: role.markets.indiaInr },
                    { label: "Global · USD", stats: role.markets.globalUsd },
                  ].map(({ label, stats }) => (
                    <div
                      key={label}
                      className="rounded-lg border border-line-hairline bg-surface-tint p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-brand-navy">
                          {label}
                        </span>
                        <span className="font-mono text-[11px] text-ink-muted">
                          {stats.disclosedPayCount} paid / {stats.listingCount}{" "}
                          total
                        </span>
                      </div>

                      {stats.disclosedPayCount > 0 ? (
                        <>
                          <p className="tabular-nums-strict mt-2 font-mono text-lg font-bold text-brand-navy">
                            {formatSalaryRange(
                              stats.avgMin,
                              stats.avgMax,
                              stats.currency
                            )}
                          </p>
                          <div className="tabular-nums-strict mt-2 flex items-center justify-between border-t border-line-hairline pt-2 font-mono text-[11px] text-ink-muted">
                            <span>
                              Start:{" "}
                              {formatCurrencyAmount(
                                stats.startingMin,
                                stats.currency
                              )}
                            </span>
                            <span>
                              Max:{" "}
                              {formatCurrencyAmount(
                                stats.ceilingMax,
                                stats.currency
                              )}
                            </span>
                          </div>
                          {stats.lowSampleWarning && (
                            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-brand-clay">
                              <Info size={13} weight="duotone" />
                              Small sample ({stats.disclosedPayCount}) — treat as
                              indicative.
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="mt-3 text-xs text-ink-subtle">
                          No annual pay disclosed in this market sample yet.
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Equity strip */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line-hairline bg-surface-warm px-4 py-3 text-xs">
                  <div className="flex items-center gap-2 font-medium text-brand-navy">
                    <ChartPieSlice
                      size={16}
                      weight="duotone"
                      className="text-brand-orange"
                    />
                    <span>Startup Equity / Stake Options</span>
                  </div>
                  <div className="tabular-nums-strict font-mono text-brand-navy">
                    {role.equitySummary.disclosedCount > 0 ? (
                      <>
                        {formatEquityRange(
                          role.equitySummary.minPercent,
                          role.equitySummary.maxPercent
                        )}
                        <span className="ml-2 font-sans text-[11px] text-ink-muted">
                          ({role.equitySummary.disclosedCount} listings)
                        </span>
                      </>
                    ) : (
                      <span className="font-sans text-ink-muted">
                        Not disclosed in current sample
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* Career Guidance */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    Role Scope &amp; Core Skills
                  </h3>
                  <span className="rounded bg-surface-tint px-2 py-0.5 text-[11px] text-ink-muted ring-1 ring-line-hairline">
                    General career guidance
                  </span>
                </div>

                <ul className="space-y-1.5 text-sm text-ink-primary">
                  {role.guidance.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                      <span className="capitalize">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {role.guidance.coreSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-line-hairline bg-surface-paper px-2.5 py-1 text-xs font-medium text-brand-navy"
                    >
                      {skill.replace(/\.$/, "")}
                    </span>
                  ))}
                </div>

                {role.observedSkills.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[11px] font-medium text-ink-muted">
                        Tech explicitly named in live job titles:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {role.observedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-brand-navy px-2.5 py-1 font-mono text-[11px] font-medium text-white"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Career Progression */}
              <section>
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Typical Next Steps
                </h3>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {role.guidance.nextRoles.map((nextRole) => (
                    <span
                      key={nextRole}
                      className="inline-flex items-center gap-1.5 rounded-md border border-line-hairline bg-surface-tint px-3 py-1.5 text-xs font-semibold text-brand-navy"
                    >
                      <ArrowRight
                        size={13}
                        weight="bold"
                        className="text-brand-orange"
                      />
                      {nextRole}
                    </span>
                  ))}
                </div>
              </section>

              {/* Sample Live Listings */}
              <section>
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    Sample Live Listings ({roleListings.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewRoleListings(role.slug);
                    }}
                    className="text-xs font-semibold text-brand-cerulean hover:text-brand-navy hover:underline"
                  >
                    Open all in Job Board
                  </button>
                </div>

                <div className="mt-3 divide-y divide-line-hairline rounded-lg border border-line-hairline">
                  {roleListings.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 px-4 py-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-brand-navy">
                          {item.title}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-ink-muted">
                          <span>{item.company}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} weight="regular" />
                            {item.location}
                          </span>
                          <span>·</span>
                          <span>{item.workMode}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="tabular-nums-strict font-mono font-medium text-brand-navy">
                          {item.compensation.annualMin !== null
                            ? formatSalaryRange(
                                item.compensation.annualMin,
                                item.compensation.annualMax,
                                item.compensation.currency
                              )
                            : "Verify"}
                        </span>
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${item.title} at ${item.company}`}
                          className="rounded border border-line-hairline p-1.5 text-brand-cerulean transition-colors hover:border-brand-navy hover:text-brand-navy"
                        >
                          <ArrowUpRight size={14} weight="bold" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-hairline bg-surface-tint px-6 py-4">
              <p className="text-xs text-ink-muted">
                Want a step-by-step plan to reach this role?
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartRoadmap(role.roleCategory);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-orange-hover"
              >
                <Path size={15} weight="bold" />
                <span>Build AI Roadmap</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}