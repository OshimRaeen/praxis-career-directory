"use client";

import { useState } from "react";
import type { JobListing, RoleProfile } from "@/types/career";
import { SiteHeader, type WorkspaceTab } from "@/components/layout/site-header";
import { CareerAtlas } from "@/components/directory/career-atlas";

interface CareerWorkspaceProps {
  roles: RoleProfile[];
  listings: JobListing[];
}

export function CareerWorkspace({ roles, listings }: CareerWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("directory");
  const [selectedBoardRole, setSelectedBoardRole] = useState<string>("all");
  const [roadmapTargetRole, setRoadmapTargetRole] = useState<string>(
    roles[0]?.roleCategory ?? "Full-Stack Developer"
  );

  const handleStartRoadmap = (roleCategory: string) => {
    setRoadmapTargetRole(roleCategory);
    setActiveTab("roadmap");
  };

  const handleViewRoleListings = (roleSlug: string) => {
    setSelectedBoardRole(roleSlug);
    setActiveTab("board");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalListings={listings.length}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {activeTab === "directory" && (
          <CareerAtlas
            roles={roles}
            listings={listings}
            onStartRoadmap={handleStartRoadmap}
            onViewRoleListings={handleViewRoleListings}
          />
        )}

        {activeTab === "board" && (
          <div className="rounded-xl border border-dashed border-line-strong bg-surface-tint p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-brand-clay">
              Step 4 · Coming Next
            </p>
            <h2 className="mt-2 text-lg font-bold text-brand-navy">
              Live Job Board ({listings.length} listings)
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Pre-filtered role slug: <code>{selectedBoardRole}</code>
            </p>
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="rounded-xl border border-dashed border-line-strong bg-surface-tint p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-brand-clay">
              Step 5 · Coming Next
            </p>
            <h2 className="mt-2 text-lg font-bold text-brand-navy">
              AI Career Roadmap Builder
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Target role selected: <code>{roadmapTargetRole}</code>
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-line-hairline bg-surface-tint py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-ink-muted sm:px-6 lg:px-8">
          <p>
            Praxis Career Atlas · Built for the Birthday Messaging
            Apprenticeship &amp; Mentorship Program
          </p>
          <p className="font-mono text-[11px]">
            Dataset snapshot: Nov 15–18, 2026
          </p>
        </div>
      </footer>
    </div>
  );
}