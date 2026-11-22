export type JobFamily = "Full-Stack Development" | "HR & Recruitment";

export type WorkMode = "Remote" | "On-site" | "Hybrid / Flexible" | "Not stated";

export type MarketRegion = "India" | "International";

export type DataQualityFlag =
  | "verify_pay_period"
  | "assumed_usd"
  | "intern_pay_check"
  | "external_source"
  | "commission_based";

export interface MarketCompensationStats {
  currency: "INR" | "USD";
  listingCount: number;
  disclosedPayCount: number;
  startingMin: number | null;
  avgMin: number | null;
  avgMax: number | null;
  ceilingMax: number | null;
  lowSampleWarning: boolean;
}

export interface RoleProfile {
  slug: string;
  jobFamily: JobFamily;
  roleCategory: string;
  totalListings: number;
  remoteCount: number;
  guidance: {
    isGeneralGuidance: boolean;
    responsibilities: string[];
    coreSkills: string[];
    nextRoles: string[];
  };
  observedSkills: string[];
  markets: {
    indiaInr: MarketCompensationStats;
    globalUsd: MarketCompensationStats;
  };
  equitySummary: {
    disclosedCount: number;
    minPercent: number | null;
    maxPercent: number | null;
  };
}

export interface JobListing {
  id: string;
  jobFamily: JobFamily;
  roleCategory: string;
  roleSlug: string;
  title: string;
  seniority: string;
  company: string;
  skills: string[];
  experienceYears: number | null;
  employmentType: string;
  region: MarketRegion;
  country: string;
  location: string;
  workMode: WorkMode;
  compensation: {
    disclosed: boolean;
    currency: string | null;
    payPeriod: string | null;
    rawMin: number | null;
    rawMax: number | null;
    annualMin: number | null;
    annualMax: number | null;
  };
  equity: {
    disclosed: boolean;
    minPercent: number | null;
    maxPercent: number | null;
    notes: string | null;
  };
  sourceUrl: string;
  dateCollected: string;
  dataQualityFlags: DataQualityFlag[];
  notes: string | null;
}

export interface RoadmapMilestone {
  phase: string;
  duration: string;
  focus: string;
  deliverables: string[];
  skills: string[];
}

export interface CareerRoadmap {
  targetRole: string;
  summary: string;
  estimatedTimeline: string;
  milestones: RoadmapMilestone[];
  praxisAlignment: string;
}