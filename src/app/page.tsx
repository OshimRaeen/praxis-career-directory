import rolesData from "@/data/roles.json";
import listingsData from "@/data/listings.json";
import type { JobListing, RoleProfile } from "@/types/career";
import { CareerWorkspace } from "@/components/career-workspace";

export default function HomePage() {
  const roles = rolesData as RoleProfile[];
  const listings = listingsData as JobListing[];

  return <CareerWorkspace roles={roles} listings={listings} />;
}