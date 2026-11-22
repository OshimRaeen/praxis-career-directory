"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckSquare,
  Clock,
  Compass,
  Path,
  SpinnerGap,
} from "@phosphor-icons/react";
import type { CareerRoadmap, RoleProfile } from "@/types/career";

interface RoadmapBuilderProps {
  roles: RoleProfile[];
  initialTargetRole: string;
}

const EXPERIENCE_LEVELS = [
  "Beginner",
  "Student / Fresher",
  "Career Switcher",
  "Junior (1–2 yrs)",
] as const;

type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export function RoadmapBuilder({
  roles,
  initialTargetRole,
}: RoadmapBuilderProps) {
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("Student / Fresher");
  const [currentBackground, setCurrentBackground] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [market, setMarket] = useState<"India" | "International">("India");

  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [engine, setEngine] = useState<"ai" | "structured-template" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTargetRole(initialTargetRole);
  }, [initialTargetRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const backgroundText =
      currentBackground.trim() ||
      `${experienceLevel} preparing for ${targetRole} roles`;

    setLoading(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentBackground: backgroundText,
          targetRole,
          experienceLevel,
          weeklyHours,
          market,
        }),
      });

      const data = (await res.json()) as {
        roadmap?: CareerRoadmap;
        engine?: "ai" | "structured-template";
        error?: string;
      };

      if (!res.ok || !data.roadmap) {
        setError(data.error ?? "Could not generate roadmap. Please try again.");
        return;
      }

      setRoadmap(data.roadmap);
      setEngine(data.engine ?? "structured-template");
    } catch {
      setError("Network error while generating your roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-line-hairline pb-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-clay">
          Interactive Career Planner
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          AI Career Roadmap Builder
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
          Tell us where you are starting from and the role you want to reach.
          We’ll map out a milestone-by-milestone plan grounded in live Praxis
          directory skills.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Input Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-line-hairline bg-surface-tint/70 p-5 lg:col-span-4 lg:self-start"
        >
          {/* Target Role */}
          <div>
            <label
              htmlFor="target-role"
              className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-navy"
            >
              Target Role
            </label>
            <select
              id="target-role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line-hairline bg-surface-paper px-3 py-2.5 text-sm font-medium text-brand-navy focus:border-brand-navy focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r.slug} value={r.roleCategory}>
                  {r.roleCategory} ({r.jobFamily})
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-navy">
              Current Stage
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {EXPERIENCE_LEVELS.map((level) => {
                const active = experienceLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperienceLevel(level)}
                    className={`rounded-md border px-2.5 py-2 text-left text-xs font-semibold transition-colors ${
                      active
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-line-hairline bg-surface-paper text-ink-muted hover:border-brand-navy hover:text-brand-navy"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Background */}
          <div>
            <label
              htmlFor="current-background"
              className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-navy"
            >
              Current Skills &amp; Context
            </label>
            <textarea
              id="current-background"
              rows={3}
              value={currentBackground}
              onChange={(e) => setCurrentBackground(e.target.value)}
              placeholder="e.g. 2nd-year CS student, know HTML/CSS and basic JavaScript, never built a backend API yet..."
              className="mt-1.5 w-full resize-none rounded-lg border border-line-hairline bg-surface-paper p-3 text-sm text-brand-navy placeholder:text-ink-subtle focus:border-brand-navy focus:outline-none"
            />
          </div>

          {/* Weekly Hours */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="weekly-hours"
                className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-navy"
              >
                Weekly Commitment
              </label>
              <span className="tabular-nums-strict font-mono text-xs font-bold text-brand-orange">
                {weeklyHours} hrs / wk
              </span>
            </div>
            <input
              id="weekly-hours"
              type="range"
              min={5}
              max={40}
              step={5}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="mt-2 w-full accent-brand-orange"
            />
            <div className="flex justify-between font-mono text-[10px] text-ink-subtle">
              <span>5 hrs</span>
              <span>20 hrs</span>
              <span>40 hrs</span>
            </div>
          </div>

          {/* Target Market */}
          <div>
            <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-navy">
              Target Market
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(["India", "International"] as const).map((opt) => {
                const active = market === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMarket(opt)}
                    className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-line-hairline bg-surface-paper text-ink-muted hover:border-brand-navy"
                    }`}
                  >
                    {opt === "India" ? "India · INR" : "Global · USD"}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="rounded-md border border-brand-orange/30 bg-surface-warm px-3 py-2 text-xs text-brand-orange">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <SpinnerGap size={16} weight="bold" className="animate-spin" />
                <span>Building Roadmap...</span>
              </>
            ) : (
              <>
                <Path size={16} weight="bold" />
                <span>Generate Roadmap</span>
              </>
            )}
          </button>
        </form>

        {/* Right: Roadmap Output */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!roadmap ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface-tint/50 px-6 py-12 text-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-hairline bg-surface-paper text-brand-navy">
                  <Compass size={22} weight="duotone" />
                </div>
                <h2 className="mt-4 text-base font-bold text-brand-navy">
                  Ready to map your path to {targetRole}
                </h2>
                <p className="mt-1.5 max-w-md text-xs leading-relaxed text-ink-muted">
                  Choose your current stage, add a short note on what you
                  already know, and click{" "}
                  <strong className="text-brand-navy">Generate Roadmap</strong>{" "}
                  for a phase-by-phase action plan.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`${roadmap.targetRole}-${roadmap.estimatedTimeline}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="space-y-6"
              >
                {/* Summary Banner */}
                <div className="rounded-xl border border-line-hairline bg-surface-paper p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-clay">
                      Personal Roadmap · {roadmap.targetRole}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded bg-surface-tint px-2.5 py-1 font-mono text-[11px] font-semibold text-brand-navy ring-1 ring-line-hairline">
                        <Clock size={12} weight="duotone" />
                        {roadmap.estimatedTimeline}
                      </span>
                      {engine === "structured-template" && (
                        <span className="rounded bg-surface-warm px-2 py-1 font-mono text-[10px] text-brand-clay ring-1 ring-brand-clay/25">
                          Directory Baseline
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-primary">
                    {roadmap.summary}
                  </p>
                </div>

                {/* Milestone Timeline */}
                <ol className="space-y-4">
                  {roadmap.milestones.map((step, index) => (
                    <li
                      key={step.phase}
                      className="rounded-xl border border-line-hairline bg-surface-paper p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-hairline pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="tabular-nums-strict flex h-6 w-6 items-center justify-center rounded bg-brand-navy font-mono text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <h3 className="text-sm font-bold text-brand-navy">
                            {step.phase}
                          </h3>
                        </div>
                        <span className="font-mono text-[11px] font-medium text-brand-orange">
                          {step.duration}
                        </span>
                      </div>

                      <p className="mt-3 text-xs font-medium text-ink-muted">
                        {step.focus}
                      </p>

                      <ul className="mt-3.5 space-y-2">
                        {step.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs leading-relaxed text-ink-primary"
                          >
                            <CheckSquare
                              size={15}
                              weight="duotone"
                              className="mt-0.5 shrink-0 text-brand-cerulean"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {step.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded border border-line-hairline bg-surface-tint px-2 py-0.5 font-mono text-[10px] font-medium text-brand-navy"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Praxis Alignment CTA */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-brand-navy bg-brand-navy p-5 text-white sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-cerulean">
                      Praxis Apprenticeship Alignment
                    </p>
                    <p className="text-xs leading-relaxed text-white/85">
                      {roadmap.praxisAlignment}
                    </p>
                  </div>
                  <a
                    href="https://praxis.birthdaymessaging.io"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-orange-hover"
                  >
                    <span>Apply to Praxis</span>
                    <ArrowUpRight size={14} weight="bold" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}