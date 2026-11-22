import type { JobListing, MarketRegion, WorkMode } from "@/types/career";

export type BoardSortOption = "default" | "pay-desc" | "exp-asc";

export interface BoardFilterState {
  query: string;
  roleSlug: string;
  region: "All" | MarketRegion;
  workMode: "All" | WorkMode;
  equityOnly: boolean;
  verifiedPayOnly: boolean;
  sortBy: BoardSortOption;
}

const APPROX_USD_RATE: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  CAD: 0.72,
  INR: 1 / 85,
  MYR: 0.22,
  EGP: 0.02,
  QAR: 0.27,
};

function normalizedAnnualUsdForSort(listing: JobListing): number {
  const { annualMax, annualMin, currency } = listing.compensation;
  const value = annualMax ?? annualMin;
  if (value === null || !currency) return -1;
  const rate = APPROX_USD_RATE[currency] ?? 0;
  return value * rate;
}

export function filterAndSortListings(
  listings: JobListing[],
  filters: BoardFilterState
): JobListing[] {
  const q = filters.query.trim().toLowerCase();

  const filtered = listings.filter((item) => {
    if (filters.roleSlug !== "all" && item.roleSlug !== filters.roleSlug) {
      return false;
    }
    if (filters.region !== "All" && item.region !== filters.region) {
      return false;
    }
    if (filters.workMode !== "All" && item.workMode !== filters.workMode) {
      return false;
    }
    if (filters.equityOnly && !item.equity.disclosed) {
      return false;
    }
    if (filters.verifiedPayOnly && item.compensation.annualMin === null) {
      return false;
    }

    if (!q) return true;

    const haystack = [
      item.title,
      item.company,
      item.roleCategory,
      item.location,
      item.country,
      item.seniority,
      ...item.skills,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });

  if (filters.sortBy === "pay-desc") {
    return [...filtered].sort(
      (a, b) => normalizedAnnualUsdForSort(b) - normalizedAnnualUsdForSort(a)
    );
  }

  if (filters.sortBy === "exp-asc") {
    return [...filtered].sort((a, b) => {
      const expA = a.experienceYears ?? Number.POSITIVE_INFINITY;
      const expB = b.experienceYears ?? Number.POSITIVE_INFINITY;
      return expA - expB;
    });
  }

  return filtered;
}