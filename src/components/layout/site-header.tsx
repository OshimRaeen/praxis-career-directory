"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Briefcase,
  Compass,
  Path,
} from "@phosphor-icons/react";
import { PraxisMark } from "@/components/icons/praxis-mark";

export type WorkspaceTab = "directory" | "board" | "roadmap";

interface SiteHeaderProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  totalListings: number;
}

const NAV_ITEMS: {
  id: WorkspaceTab;
  label: string;
  icon: typeof Compass;
}[] = [
  { id: "directory", label: "Career Atlas", icon: Compass },
  { id: "board", label: "Job Board", icon: Briefcase },
  { id: "roadmap", label: "AI Roadmap", icon: Path },
];

export function SiteHeader({
  activeTab,
  onTabChange,
  totalListings,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface-paper/95 backdrop-blur-md">
      {/* Top Praxis utility strip */}
      <div className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <p className="truncate text-white/90">
            Real compensation benchmarks &amp; career outcomes for Praxis
            apprentices and mentees.
          </p>
          <a
            href="https://praxis.birthdaymessaging.io"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1 font-medium text-brand-cerulean underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            <span>Main Platform</span>
            <ArrowUpRight size={13} weight="bold" />
          </a>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="border-b border-line-hairline">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => onTabChange("directory")}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <PraxisMark className="h-8 w-8 transition-transform duration-200 group-hover:scale-[1.03]" />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] font-bold tracking-tight text-brand-navy">
                  Praxis
                </span>
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-brand-clay">
                  Career Atlas
                </span>
              </div>
              <p className="hidden text-[11px] text-ink-muted sm:block">
                Global Job Directory &amp; Outcomes
              </p>
            </div>
          </button>

          {/* Primary mode switcher */}
          <nav
            aria-label="Workspace views"
            className="flex items-center gap-1 rounded-lg border border-line-hairline bg-surface-tint p-1"
          >
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTabChange(id)}
                  className={`relative flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors sm:text-[13px] ${
                    isActive
                      ? "text-brand-navy"
                      : "text-ink-muted hover:text-brand-navy"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="workspace-tab-pill"
                      transition={{
                        type: "spring",
                        stiffness: 460,
                        damping: 36,
                      }}
                      className="absolute inset-0 rounded-md bg-surface-paper shadow-[0_1px_2px_rgba(16,42,67,0.08)] ring-1 ring-line-hairline"
                    />
                  )}
                  <Icon
                    size={15}
                    weight={isActive ? "duotone" : "regular"}
                    className={`relative z-10 ${
                      isActive ? "text-brand-orange" : "text-ink-muted"
                    }`}
                  />
                  <span className="relative z-10">{label}</span>
                  {id === "board" && (
                    <span className="relative z-10 hidden rounded bg-surface-tint px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-muted sm:inline">
                      {totalListings}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Primary Praxis CTA */}
          <a
            href="https://praxis.birthdaymessaging.io"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-md bg-brand-orange px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-orange-hover md:inline-flex"
          >
            <span>Choose Your Path</span>
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>
      </div>
    </header>
  );
}