// Typed API wrappers for the backend canister
// NOTE: backend.d.ts interface is empty until pnpm bindgen runs.
// These functions are typed stubs that will wire to real actor methods
// once bindings are generated. The hooks/useQueries.ts layer calls these.

import type {
  CityStats,
  CommunityOpportunity,
  OpportunityCategory,
  OpportunityInput,
} from "@/types";
import type {
  ConnectedPresenceLink,
  FeaturedContent,
  MemberInput,
  MemberRecord,
  StatsRecord,
  TrustSummary,
  VolunteerInput,
  VolunteerInterest,
} from "@/types";

// Re-export types so consumers can import from one place
export type {
  MemberRecord,
  MemberInput,
  ConnectedPresenceLink,
  FeaturedContent,
  VolunteerInterest,
  VolunteerInput,
  StatsRecord,
  TrustSummary,
  CityStats,
  CommunityOpportunity,
  OpportunityInput,
  OpportunityCategory,
};

// ─── Opportunity helpers ─────────────────────────────────────────────────────

/** Convert a frontend category key to the Motoko variant object */
export function convertCategoryToVariant(
  category: string,
): Record<string, null> {
  return { [category]: null };
}

/** Normalise a raw backend opportunity record into the frontend type */
export function normaliseOpportunity(
  raw: Record<string, unknown>,
): CommunityOpportunity {
  const rawCategory = raw.category as Record<string, unknown>;
  const categoryKey = (
    rawCategory ? Object.keys(rawCategory)[0] : "other"
  ) as OpportunityCategory;
  const rawStatus = raw.status as Record<string, unknown>;
  const statusKey = (rawStatus ? Object.keys(rawStatus)[0] : "active") as
    | "active"
    | "inactive";
  return {
    id: raw.id as string,
    title: raw.title as string,
    description: raw.description as string,
    category: categoryKey,
    city: raw.city as string,
    province: raw.province as string,
    organizationName: (raw.organizationName as [] | [string]) ?? [],
    memberId: (raw.memberId as [] | [string]) ?? [],
    timeCommitment: (raw.timeCommitment as [] | [string]) ?? [],
    contactLink: (raw.contactLink as [] | [string]) ?? [],
    recurring: Boolean(raw.recurring),
    status: statusKey,
    createdAt: raw.createdAt as bigint,
    flagged: Boolean(raw.flagged),
  };
}

export async function apiGetOpportunities(
  actor: BackendActor,
  city?: string,
  category?: string,
): Promise<CommunityOpportunity[]> {
  try {
    const cityArg: [] | [string] = city ? [city] : [];
    const catArg: [] | [Record<string, null>] = category
      ? [convertCategoryToVariant(category)]
      : [];
    const result = await (
      actor.getOpportunities as (
        city: [] | [string],
        category: [] | [Record<string, null>],
      ) => Promise<Record<string, unknown>[]>
    )(cityArg, catArg);
    return Array.isArray(result) ? result.map(normaliseOpportunity) : [];
  } catch {
    return [];
  }
}

export async function apiGetLatestOpportunities(
  actor: BackendActor,
  limit: bigint,
): Promise<CommunityOpportunity[]> {
  try {
    const result = await (
      actor.getLatestOpportunities as (
        limit: bigint,
      ) => Promise<Record<string, unknown>[]>
    )(limit);
    return Array.isArray(result) ? result.map(normaliseOpportunity) : [];
  } catch {
    return [];
  }
}

export async function apiGetOpportunitiesByMember(
  actor: BackendActor,
  memberId: string,
): Promise<CommunityOpportunity[]> {
  try {
    const result = await (
      actor.getOpportunitiesByMember as (
        memberId: string,
      ) => Promise<Record<string, unknown>[]>
    )(memberId);
    return Array.isArray(result) ? result.map(normaliseOpportunity) : [];
  } catch {
    return [];
  }
}

export async function apiCreateOpportunity(
  actor: BackendActor,
  input: OpportunityInput,
): Promise<{ ok: CommunityOpportunity } | { err: string }> {
  const motokoInput = {
    ...input,
    category: convertCategoryToVariant(input.category),
  };
  const result = await (
    actor.createOpportunity as (
      input: Record<string, unknown>,
    ) => Promise<{ ok: Record<string, unknown> } | { err: string }>
  )(motokoInput);
  if ("err" in result) return result;
  return { ok: normaliseOpportunity(result.ok) };
}

export async function apiUpdateOpportunityStatus(
  actor: BackendActor,
  id: string,
  status: "active" | "inactive",
): Promise<{ ok: CommunityOpportunity } | { err: string }> {
  const statusVariant: Record<string, null> = { [status]: null };
  const result = await (
    actor.updateOpportunityStatus as (
      id: string,
      status: Record<string, null>,
    ) => Promise<{ ok: Record<string, unknown> } | { err: string }>
  )(id, statusVariant);
  if ("err" in result) return result;
  return { ok: normaliseOpportunity(result.ok) };
}

export async function apiAdminFlagOpportunity(
  actor: BackendActor,
  id: string,
  flagged: boolean,
): Promise<{ ok: CommunityOpportunity } | { err: string }> {
  const result = await (
    actor.adminFlagOpportunity as (
      id: string,
      flagged: boolean,
    ) => Promise<{ ok: Record<string, unknown> } | { err: string }>
  )(id, flagged);
  if ("err" in result) return result;
  return { ok: normaliseOpportunity(result.ok) };
}

// The actor type expected by API functions once bindings are generated
export type BackendActor = Record<
  string,
  (...args: unknown[]) => Promise<unknown>
>;

export async function apiGetCityStats(
  actor: BackendActor,
): Promise<CityStats[]> {
  try {
    const result = await (actor.getCityStats as () => Promise<CityStats[]>)();
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}

export async function apiGetMembers(
  actor: BackendActor,
): Promise<MemberRecord[]> {
  const result = await (actor.getMembers as () => Promise<MemberRecord[]>)();
  return result;
}

export async function apiGetMember(
  actor: BackendActor,
  id: string,
): Promise<MemberRecord | undefined> {
  const result = await (
    actor.getMember as (id: string) => Promise<[] | [MemberRecord]>
  )(id);
  return result.length > 0 ? result[0] : undefined;
}

export async function apiCreateMember(
  actor: BackendActor,
  input: MemberInput,
): Promise<{ ok: MemberRecord } | { err: string }> {
  return (
    actor.createMember as (
      input: MemberInput,
    ) => Promise<{ ok: MemberRecord } | { err: string }>
  )(input);
}

export async function apiUpdateMember(
  actor: BackendActor,
  id: string,
  input: MemberInput,
): Promise<{ ok: MemberRecord } | { err: string }> {
  return (
    actor.updateMember as (
      id: string,
      input: MemberInput,
    ) => Promise<{ ok: MemberRecord } | { err: string }>
  )(id, input);
}

export async function apiDeleteMember(
  actor: BackendActor,
  id: string,
): Promise<{ ok: null } | { err: string }> {
  return (
    actor.deleteMember as (
      id: string,
    ) => Promise<{ ok: null } | { err: string }>
  )(id);
}

export async function apiApproveMember(
  actor: BackendActor,
  id: string,
): Promise<{ ok: MemberRecord } | { err: string }> {
  return (
    actor.approveMember as (
      id: string,
    ) => Promise<{ ok: MemberRecord } | { err: string }>
  )(id);
}

export async function apiRejectMember(
  actor: BackendActor,
  id: string,
): Promise<{ ok: MemberRecord } | { err: string }> {
  return (
    actor.rejectMember as (
      id: string,
    ) => Promise<{ ok: MemberRecord } | { err: string }>
  )(id);
}

export async function apiFeatureMember(
  actor: BackendActor,
  id: string,
  featured: boolean,
): Promise<{ ok: MemberRecord } | { err: string }> {
  return (
    actor.featureMember as (
      id: string,
      featured: boolean,
    ) => Promise<{ ok: MemberRecord } | { err: string }>
  )(id, featured);
}

export async function apiCreateVolunteer(
  actor: BackendActor,
  input: VolunteerInput,
): Promise<{ ok: VolunteerInterest } | { err: string }> {
  return (
    actor.createVolunteer as (
      input: VolunteerInput,
    ) => Promise<{ ok: VolunteerInterest } | { err: string }>
  )(input);
}

export async function apiGetVolunteers(
  actor: BackendActor,
): Promise<VolunteerInterest[]> {
  return (actor.getVolunteers as () => Promise<VolunteerInterest[]>)();
}

export async function apiGetStats(actor: BackendActor): Promise<StatsRecord> {
  return (actor.getStats as () => Promise<StatsRecord>)();
}

export async function apiIsAdmin(actor: BackendActor): Promise<boolean> {
  return (actor.isAdmin as () => Promise<boolean>)();
}
export async function apiAddCommunityVote(
  actor: BackendActor,
  listingId: string,
  voteType: "upvote" | "downvote",
): Promise<{ ok: string } | { err: string }> {
  const voteVariant =
    voteType === "upvote" ? { upvote: null } : { downvote: null };
  return (
    actor.addCommunityVote as (
      listingId: string,
      voteType: { upvote: null } | { downvote: null },
    ) => Promise<{ ok: string } | { err: string }>
  )(listingId, voteVariant);
}

export async function apiRemoveCommunityVote(
  actor: BackendActor,
  listingId: string,
): Promise<{ ok: string } | { err: string }> {
  return (
    actor.removeCommunityVote as (
      listingId: string,
    ) => Promise<{ ok: string } | { err: string }>
  )(listingId);
}

export async function apiGetCommunityVotes(
  actor: BackendActor,
  listingId: string,
): Promise<{ ok: TrustSummary } | { err: string }> {
  return (
    actor.getCommunityVotes as (
      listingId: string,
    ) => Promise<{ ok: TrustSummary } | { err: string }>
  )(listingId);
}

export async function apiGetMyVote(
  actor: BackendActor,
  listingId: string,
): Promise<[] | [{ upvote: null } | { downvote: null }]> {
  return (
    actor.getMyVote as (
      listingId: string,
    ) => Promise<[] | [{ upvote: null } | { downvote: null }]>
  )(listingId);
}
