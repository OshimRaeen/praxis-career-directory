"use client";

import { useState } from "react";
import type { JobListing, RoleProfile } from "@/types/career";
import { SiteHeader, type WorkspaceTab } from "@/components/layout/site-header";
import { CareerAtlas } from "@/components/directory/career-atlas";
import { JobBoard } from "@/components/board/job-board";
import { RoadmapBuilder } from "@/components/roadmap/roadmap-builder";

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
          <JobBoard
            listings={listings}
            roles={roles}
            roleSlug={selectedBoardRole}
            onRoleSlugChange={setSelectedBoardRole}
            onStartRoadmap={handleStartRoadmap}
          />
        )}

        {activeTab === "roadmap" && (
          <RoadmapBuilder
            roles={roles}
            initialTargetRole={roadmapTargetRole}
          />
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