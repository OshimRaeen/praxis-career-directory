"use client";

import {
  ArrowUpRight,
  Handshake,
  Path,
  SealCheck,
} from "@phosphor-icons/react";

interface MonetizationRailProps {
  onStartRoadmap: (roleCategory: string) => void;
}

export function MonetizationRail({ onStartRoadmap }: MonetizationRailProps) {
  return (
    <aside className="space-y-4">
      {/* 1. Birthday Messaging / Praxis Own Product */}
      <div className="rounded-xl border border-brand-navy bg-brand-navy p-5 text-white">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-cerulean">
            Praxis Program
          </span>
          <SealCheck size={18} weight="duotone" className="text-brand-orange" />
        </div>

        <h3 className="mt-2.5 text-base font-bold leading-snug">
          Build real production skills before you apply.
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-white/75">
          Join the 12-month Praxis Apprenticeship or 1-on-1 Mentorship track to
          ship portfolio work reviewed by practicing engineers and HR leads.
        </p>

        <div className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-3.5">
          <div>
            <span className="tabular-nums-strict font-mono text-lg font-bold text-white">
              $97
            </span>
            <span className="text-xs text-white/70"> / month</span>
          </div>
          <span className="font-mono text-[10px] text-brand-cerulean">
            2 months free on annual
          </span>
        </div>

        <a
          href="https://praxis.birthdaymessaging.io"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-orange-hover"
        >
          <span>Explore Apprenticeship</span>
          <ArrowUpRight size={14} weight="bold" />
        </a>
      </div>

      {/* 2. Career Consultancy & Custom Roadmap */}
      <div className="rounded-xl border border-line-hairline bg-surface-warm p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-clay">
          Career Advisory
        </p>
        <h3 className="mt-2 text-sm font-bold text-brand-navy">
          Not sure which role fits your background?
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
          Generate a tailored step-by-step roadmap from your current level to
          your target role, or book a mentor review.
        </p>
        <button
          type="button"
          onClick={() => onStartRoadmap("Full-Stack Developer")}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-brand-navy bg-surface-paper px-3.5 py-2 text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
        >
          <Path size={14} weight="bold" />
          <span>Generate Custom Roadmap</span>
        </button>
      </div>

      {/* 3. Sponsorships & Employer Partnerships */}
      <div className="rounded-xl border border-dashed border-line-strong bg-surface-tint p-5">
        <div className="flex items-center gap-2 text-brand-navy">
          <Handshake
            size={18}
            weight="duotone"
            className="text-brand-cerulean"
          />
          <h3 className="text-sm font-bold">Hire Praxis Apprentices</h3>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          Feature your open engineering or HR roles in our Partner Spotlight and
          connect directly with vetted cohorts.
        </p>
        <a
          href="mailto:hr@birthdaymessaging.io?subject=Praxis%20Job%20Board%20Partnership"
          className="mt-3.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-cerulean transition-colors hover:text-brand-navy hover:underline"
        >
          <span>Partner with Birthday Messaging</span>
          <ArrowUpRight size={13} weight="bold" />
        </a>
      </div>
    </aside>
  );
}