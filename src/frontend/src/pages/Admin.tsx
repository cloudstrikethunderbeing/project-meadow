import { createActor } from "@/backend";
import type { CommunityOpportunity } from "@/backend.d";
import { EmptyState } from "@/components/EmptyState";
import { MemberBadge } from "@/components/MemberBadge";
import { useAuth } from "@/hooks/useAuth";
import {
  useActivityFeed,
  useApproveMember,
  useDeleteMember,
  useFeatureMember,
  useGetMembershipIntents,
  useGetMembershipStats,
  useMembers,
  useRejectMember,
  useStats,
  useUpdateMembershipIntentStatus,
  useVolunteers,
} from "@/hooks/useQueries";
import type { BackendActor } from "@/lib/api";
import {
  type MemberParticipantType,
  type MembershipIntent,
  type MembershipStats,
  type MembershipStatus,
  type MembershipTier,
  PROVINCE_NAMES,
  isVerified,
} from "@/types";
import type {
  ActivityEvent,
  MemberRecord,
  StatsRecord,
  VolunteerInterest,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  faArrowTrendUp,
  faArrowsRotate,
  faBan,
  faBolt,
  faBuilding,
  faChartBar,
  faChevronDown,
  faCircleCheck,
  faCircleXmark,
  faCity,
  faDownload,
  faFilter,
  faFlag,
  faHandHoldingHeart,
  faHandshake,
  faLeaf,
  faLightbulb,
  faLock,
  faMagnifyingGlass,
  faPause,
  faPlay,
  faShield,
  faShieldHalved,
  faStar,
  faStarHalfStroke,
  faThumbsDown,
  faThumbsUp,
  faTrash,
  faTriangleExclamation,
  faUnlock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type AdminTab =
  | "dashboard"
  | "pending"
  | "all"
  | "volunteers"
  | "trust"
  | "membership"
  | "opportunities"
  | "analytics";
type TrustSubTab = "flagged" | "pending_verification" | "high_trust";

// TrustMemberRecord is just MemberRecord — all trust fields are now on the full record
type TrustMemberRecord = MemberRecord;

// ─── Opportunity category labels ──────────────────────────────────────────────
const OPPORTUNITY_CATEGORY_LABELS: Record<string, string> = {
  volunteer: "Volunteer",
  education: "Education",
  foodSupport: "Food Support",
  events: "Events",
  cleanup: "Community Cleanup",
  mentorship: "Mentorship",
  localFarming: "Local Farming",
  delivery: "Delivery Help",
  wellness: "Wellness",
  youthSupport: "Youth Support",
  technology: "Technology",
  creativeArts: "Creative Arts",
  other: "Other",
};

// ─── Inline opportunity hooks (defined here in case CommunityOpportunities page
//     task hasn't added them to useQueries.ts yet) ────────────────────────────
function useAllOpportunities() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CommunityOpportunity[]>({
    queryKey: ["admin", "opportunities", "all"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as unknown as any).getOpportunities(
        [],
        [],
        [],
      );
      return Array.isArray(result) ? result : [];
    },
    enabled: !!actor && !isFetching,
  });
}

function useUpdateOpportunityStatusAdmin() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: "active" | "inactive";
    }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as unknown as any).updateOpportunityStatus(
        id,
        status,
      );
      if ("err" in result) throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}

function useAdminFlagOpportunityMutation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      flagged,
    }: {
      id: bigint;
      flagged: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as unknown as any).adminFlagOpportunity(
        id,
        flagged,
      );
      if ("err" in result) throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}

type AdminTrustQueue = {
  pending: TrustMemberRecord[];
  flagged: TrustMemberRecord[];
  highTrust: TrustMemberRecord[];
};

// ─── Trust helpers ───────────────────────────────────────────────────────────
function daysSince(createdAt: bigint): number {
  const ms = Number(createdAt / 1_000_000n);
  return Math.floor((Date.now() - ms) / 86_400_000);
}

function TrustStatusPill({ status }: { status: string }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/30">
        <FontAwesomeIcon icon={faBolt} className="text-xs" /> Community Verified
      </span>
    );
  }
  if (status === "under_review") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-xs" />{" "}
        Under Review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
      <FontAwesomeIcon icon={faShield} className="text-xs" /> Pending
    </span>
  );
}

function VoteCount({
  upvotes,
  downvotes,
}: { upvotes: bigint; downvotes: bigint }) {
  return (
    <span className="flex items-center gap-2 text-xs">
      <span className="text-primary flex items-center gap-1">
        <FontAwesomeIcon icon={faThumbsUp} className="text-xs" />
        {upvotes.toString()}
      </span>
      <span className="text-muted-foreground flex items-center gap-1">
        <FontAwesomeIcon icon={faThumbsDown} className="text-xs" />
        {downvotes.toString()}
      </span>
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: bigint | number;
  accent?: "green" | "orange" | "blue" | "default";
}) {
  const accentClass =
    accent === "orange"
      ? "text-orange-400"
      : accent === "blue"
        ? "text-blue-400"
        : accent === "green"
          ? "text-primary"
          : "text-primary";
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
      <p className={`text-2xl font-display font-bold ${accentClass}`}>
        {value.toString()}
      </p>
      <p className="text-xs text-muted-foreground leading-snug">{label}</p>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ stats }: { stats: StatsRecord | null | undefined }) {
  if (!stats) {
    return (
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        data-ocid="admin.stats_loading_state"
      >
        {Array.from({ length: 11 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <div key={i} className="h-20 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div data-ocid="admin.stats_panel">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Members" value={stats.totalMembers} />
        <StatCard
          label="Verified Members"
          value={stats.verifiedMembers}
          accent="green"
        />
        <StatCard
          label="Pending Review"
          value={stats.pendingMembers}
          accent="orange"
        />
        <StatCard label="Community Members" value={stats.communityMembers} />
        <StatCard label="Business Members" value={stats.businessMembers} />
        <StatCard label="Tradespeople" value={stats.tradeMembers} />
        <StatCard
          label="Food Producers"
          value={stats.producerMembers}
          accent="green"
        />
        <StatCard
          label="Organization Partners"
          value={stats.organizationPartners}
        />
        <StatCard
          label="Bitcoin-Enabled"
          value={stats.bitcoinEnabled}
          accent="orange"
        />
        <StatCard label="ICP-Enabled" value={stats.icpEnabled} accent="blue" />
        <StatCard
          label="Circular Economy"
          value={stats.circularEconomy}
          accent="green"
        />
      </div>

      {stats.byProvince.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">
            Members by Province
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {stats.byProvince.map(([prov, count]) => (
              <div
                key={prov}
                className="flex justify-between items-center px-3 py-2 bg-muted/40 rounded-lg"
              >
                <span className="text-sm text-muted-foreground">
                  {PROVINCE_NAMES[prov] ?? prov}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {count.toString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pending Tab ──────────────────────────────────────────────────────────────
function PendingTab({
  pending,
  loading,
  approvePending,
  rejectPending,
  onApprove,
  onReject,
}: {
  pending: MemberRecord[];
  loading: boolean;
  approvePending: boolean;
  rejectPending: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-3" data-ocid="admin.pending_loading_state">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }
  if (pending.length === 0) {
    return (
      <EmptyState
        icon={<FontAwesomeIcon icon={faCircleCheck} className="text-4xl" />}
        headline="No pending submissions"
        description="All listings have been reviewed."
      />
    );
  }
  return (
    <div className="space-y-3" data-ocid="admin.pending_list">
      {pending.map((member, i) => (
        <div
          key={member.id}
          data-ocid={`admin.pending_item.${i + 1}`}
          className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-display font-semibold text-foreground truncate">
                {member.businessName}
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground capitalize">
                {member.participantType}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {member.category} &middot; {member.city},{" "}
              {PROVINCE_NAMES[member.province] ?? member.province}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {member.description}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1.5">
              Submitted:{" "}
              {new Date(
                Number(member.createdAt / 1_000_000n),
              ).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              data-ocid={`admin.approve_button.${i + 1}`}
              onClick={() => onApprove(member.id)}
              disabled={approvePending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/15 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/25 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faCircleCheck} className="text-xs" />{" "}
              Approve
            </button>
            <button
              type="button"
              data-ocid={`admin.reject_button.${i + 1}`}
              onClick={() => onReject(member.id)}
              disabled={rejectPending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/15 text-destructive border border-destructive/30 text-xs font-medium hover:bg-destructive/25 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faCircleXmark} className="text-xs" />{" "}
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── All Listings Tab ─────────────────────────────────────────────────────────
function AllListingsTab({
  members,
  loading,
  featurePending,
  deletePending,
  freezePending: freezeProfilePending,
  onFeature,
  onDelete,
  onFreezeProfile,
}: {
  members: MemberRecord[];
  loading: boolean;
  featurePending: boolean;
  deletePending: boolean;
  freezePending: boolean;
  onFeature: (id: string, featured: boolean) => void;
  onDelete: (id: string) => void;
  onFreezeProfile: (id: string, name: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = members.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.businessName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.province.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-3" data-ocid="admin.all_loading_state">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-20 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div data-ocid="admin.all_members_list">
      {/* Search bar */}
      <div className="relative mb-4">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
        />
        <input
          id="admin-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category, city…"
          data-ocid="admin.search_input"
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FontAwesomeIcon icon={faUsers} className="text-4xl" />}
          headline={search ? "No matches found" : "No members yet"}
          description={
            search
              ? "Try a different search term."
              : "Submissions will appear here."
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((member, i) => (
            <div
              key={member.id}
              data-ocid={`admin.member_item.${i + 1}`}
              className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-semibold text-foreground truncate">
                    {member.businessName}
                  </p>
                  <MemberBadge
                    variant={
                      isVerified(member.verificationStatus)
                        ? "verified"
                        : "pending"
                    }
                  />
                  {member.featured && <MemberBadge variant="featured" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {member.category} &middot; {member.city},{" "}
                  {PROVINCE_NAMES[member.province] ?? member.province} &middot;{" "}
                  <span className="capitalize">{member.participantType}</span>
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                <button
                  type="button"
                  data-ocid={`admin.feature_button.${i + 1}`}
                  onClick={() => onFeature(member.id, !member.featured)}
                  disabled={featurePending}
                  className="flex items-center gap-1 p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-50"
                  aria-label={member.featured ? "Unfeature" : "Feature"}
                >
                  {member.featured ? (
                    <FontAwesomeIcon
                      icon={faStarHalfStroke}
                      className="text-sm"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faStar} className="text-sm" />
                  )}
                </button>
                <button
                  type="button"
                  data-ocid={`admin.freeze_profile_button.${i + 1}`}
                  onClick={() =>
                    onFreezeProfile(member.id, member.businessName)
                  }
                  disabled={freezeProfilePending}
                  className="flex items-center gap-1 p-2 rounded-lg border border-border text-muted-foreground hover:text-amber-400 hover:border-amber-500/40 transition-colors disabled:opacity-50"
                  aria-label="Freeze profile"
                  title="Freeze Profile (flags for review)"
                >
                  <FontAwesomeIcon icon={faLock} className="text-sm" />
                </button>
                <button
                  type="button"
                  data-ocid={`admin.delete_button.${i + 1}`}
                  onClick={() => {
                    if (window.confirm(`Delete "${member.businessName}"?`))
                      onDelete(member.id);
                  }}
                  disabled={deletePending}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors disabled:opacity-50"
                  aria-label="Delete member"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Volunteer Signups Tab ────────────────────────────────────────────────────
function VolunteersTab({
  volunteers,
  loading,
}: {
  volunteers: VolunteerInterest[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3" data-ocid="admin.volunteers_loading_state">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }
  if (volunteers.length === 0) {
    return (
      <EmptyState
        icon={<FontAwesomeIcon icon={faUsers} className="text-4xl" />}
        headline="No volunteer signups yet"
        description="Volunteer submissions will appear here."
      />
    );
  }
  return (
    <div className="space-y-3" data-ocid="admin.volunteers_list">
      {volunteers.map((vol, i) => (
        <div
          key={vol.id}
          data-ocid={`admin.volunteer_item.${i + 1}`}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display font-semibold text-foreground">
                {vol.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {vol.email} &middot; {vol.city}
              </p>
              {vol.availability && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Availability: {vol.availability}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground/60 flex-shrink-0">
              {new Date(Number(vol.createdAt / 1_000_000n)).toLocaleDateString(
                "en-CA",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              )}
            </p>
          </div>

          {vol.skills.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Skills</p>
              <div className="flex flex-wrap gap-1">
                {vol.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {vol.interests.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Interests</p>
              <div className="flex flex-wrap gap-1">
                {vol.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-0.5 rounded-full bg-muted border border-border text-xs text-muted-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Community Trust Tab ─────────────────────────────────────────────────────
function CommunityTrustTab({
  trustQueue,
  loading,
  onOverrideStatus,
  onFreezeVoting,
  onRemoveListing,
  overridePending,
  freezePending,
  removePending,
}: {
  trustQueue: AdminTrustQueue | null;
  loading: boolean;
  onOverrideStatus: (id: string, status: string) => void;
  onFreezeVoting: (id: string, frozen: boolean) => void;
  onRemoveListing: (id: string, name: string) => void;
  overridePending: boolean;
  freezePending: boolean;
  removePending: boolean;
}) {
  const [subTab, setSubTab] = useState<TrustSubTab>("flagged");
  const [openOverride, setOpenOverride] = useState<string | null>(null);

  const SUB_TABS: { key: TrustSubTab; label: string }[] = [
    { key: "flagged", label: "Flagged for Review" },
    { key: "pending_verification", label: "Pending Verification" },
    { key: "high_trust", label: "High Trust" },
  ];

  const flagged = trustQueue?.flagged ?? [];
  const pendingVerification = trustQueue?.pending ?? [];
  const highTrust = trustQueue?.highTrust ?? [];

  const subCounts: Record<TrustSubTab, number> = {
    flagged: flagged.length,
    pending_verification: pendingVerification.length,
    high_trust: highTrust.length,
  };

  return (
    <div data-ocid="admin.trust_panel">
      {/* Sub-tab segmented control */}
      <div className="flex gap-1 p-1 bg-muted/40 rounded-xl border border-border mb-5 overflow-x-auto scrollbar-none">
        {SUB_TABS.map((st) => (
          <button
            key={st.key}
            type="button"
            data-ocid={`admin.trust.${st.key}_tab`}
            onClick={() => setSubTab(st.key)}
            className={`flex items-center gap-1.5 flex-1 justify-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              subTab === st.key
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {st.label}
            {subCounts[st.key] > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                  st.key === "flagged" && subCounts[st.key] > 0
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-primary/15 text-primary border border-primary/30"
                }`}
              >
                {subCounts[st.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center py-16 gap-3"
          data-ocid="admin.trust_loading_state"
        >
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className="text-primary text-xl animate-spin"
          />
          <span className="text-muted-foreground text-sm">
            Loading community trust data…
          </span>
        </div>
      ) : (
        <>
          {/* Flagged for Review */}
          {subTab === "flagged" && (
            <div data-ocid="admin.trust.flagged_list">
              {flagged.length === 0 ? (
                <EmptyState
                  icon={
                    <FontAwesomeIcon
                      icon={faShieldHalved}
                      className="text-4xl"
                    />
                  }
                  headline="No flagged listings right now — community trust is healthy"
                  description="Listings reported by community members will appear here for review."
                />
              ) : (
                <div className="space-y-3">
                  {flagged.map((m, i) => (
                    <div
                      key={m.id}
                      data-ocid={`admin.trust.flagged_item.${i + 1}`}
                      className="bg-card border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <p className="font-display font-semibold text-foreground truncate">
                            {m.businessName}
                          </p>
                          <TrustStatusPill
                            status={m.communityVerificationStatus}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {m.category} &middot; {m.city},{" "}
                          {PROVINCE_NAMES[m.province] ?? m.province} &middot;{" "}
                          <span className="capitalize">
                            {m.participantType}
                          </span>
                        </p>
                        <VoteCount
                          upvotes={m.communityUpvotes ?? 0n}
                          downvotes={m.communityDownvotes ?? 0n}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        {/* Override dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            data-ocid={`admin.trust.override_button.${i + 1}`}
                            onClick={() =>
                              setOpenOverride(
                                openOverride === m.id ? null : m.id,
                              )
                            }
                            disabled={overridePending}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50"
                          >
                            Override Status{" "}
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className="text-xs ml-1"
                            />
                          </button>
                          {openOverride === m.id && (
                            <div
                              className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px]"
                              data-ocid={`admin.trust.override_dropdown.${i + 1}`}
                            >
                              {(
                                ["verified", "pending", "under_review"] as const
                              ).map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => {
                                    onOverrideStatus(m.id, status);
                                    setOpenOverride(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors capitalize"
                                >
                                  {status === "under_review"
                                    ? "Under Review"
                                    : status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Freeze toggle */}
                        <button
                          type="button"
                          data-ocid={`admin.trust.freeze_toggle.${i + 1}`}
                          onClick={() => onFreezeVoting(m.id, !m.votingFrozen)}
                          disabled={freezePending}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-xs font-medium transition-colors disabled:opacity-50 ${
                            m.votingFrozen
                              ? "bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25"
                              : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                          }`}
                        >
                          {m.votingFrozen ? (
                            <>
                              <FontAwesomeIcon
                                icon={faUnlock}
                                className="text-xs"
                              />{" "}
                              Unfreeze Voting
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                icon={faLock}
                                className="text-xs"
                              />{" "}
                              Freeze Voting
                            </>
                          )}
                        </button>
                        {/* Remove */}
                        <button
                          type="button"
                          data-ocid={`admin.trust.remove_button.${i + 1}`}
                          onClick={() => onRemoveListing(m.id, m.businessName)}
                          disabled={removePending}
                          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors disabled:opacity-50"
                          aria-label="Remove listing"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending Verification */}
          {subTab === "pending_verification" && (
            <div data-ocid="admin.trust.pending_list">
              {pendingVerification.length === 0 ? (
                <EmptyState
                  icon={
                    <FontAwesomeIcon icon={faShield} className="text-4xl" />
                  }
                  headline="No listings pending verification yet"
                  description="Listings that have received at least one community confirmation will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {pendingVerification.map((m, i) => (
                    <div
                      key={m.id}
                      data-ocid={`admin.trust.pending_item.${i + 1}`}
                      className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-foreground truncate mb-1">
                          {m.businessName}
                        </p>
                        <p className="text-xs text-muted-foreground mb-1.5">
                          {m.category} &middot; {m.city},{" "}
                          {PROVINCE_NAMES[m.province] ?? m.province}
                        </p>
                        <div className="flex items-center gap-3">
                          <VoteCount
                            upvotes={m.communityUpvotes ?? 0n}
                            downvotes={m.communityDownvotes ?? 0n}
                          />
                          <span className="text-xs text-muted-foreground/70">
                            {daysSince(m.createdAt)}d since joined
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          data-ocid={`admin.trust.approve_verified_button.${i + 1}`}
                          onClick={() => onOverrideStatus(m.id, "verified")}
                          disabled={overridePending}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/15 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/25 transition-colors disabled:opacity-50"
                        >
                          <FontAwesomeIcon icon={faBolt} className="text-xs" />{" "}
                          Override to Verified
                        </button>
                        <button
                          type="button"
                          data-ocid={`admin.trust.flag_review_button.${i + 1}`}
                          onClick={() => onOverrideStatus(m.id, "under_review")}
                          disabled={overridePending}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-medium hover:bg-amber-500/25 transition-colors disabled:opacity-50"
                        >
                          <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className="text-xs"
                          />{" "}
                          Under Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* High Trust */}
          {subTab === "high_trust" && (
            <div data-ocid="admin.trust.high_trust_list">
              {highTrust.length === 0 ? (
                <EmptyState
                  icon={<FontAwesomeIcon icon={faBolt} className="text-4xl" />}
                  headline="No listings have reached Community Verified status yet"
                  description="Listings that have met all local verification thresholds will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {highTrust.map((m, i) => (
                    <div
                      key={m.id}
                      data-ocid={`admin.trust.high_trust_item.${i + 1}`}
                      className="bg-card border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <p className="font-display font-semibold text-foreground truncate">
                            {m.businessName}
                          </p>
                          <TrustStatusPill status="verified" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5">
                          {m.category} &middot; {m.city},{" "}
                          {PROVINCE_NAMES[m.province] ?? m.province}
                        </p>
                        <VoteCount
                          upvotes={m.communityUpvotes ?? 0n}
                          downvotes={m.communityDownvotes ?? 0n}
                        />
                      </div>
                      <button
                        type="button"
                        data-ocid={`admin.trust.revoke_button.${i + 1}`}
                        onClick={() => onOverrideStatus(m.id, "pending")}
                        disabled={overridePending}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted border border-border text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors disabled:opacity-50 flex-shrink-0"
                      >
                        <FontAwesomeIcon icon={faBan} className="text-xs" />{" "}
                        Revoke Verification
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Profile Links Notice Section ────────────────────────────────────────────
function ProfileLinksNotice() {
  return (
    <div
      className="bg-card border border-border rounded-xl p-5 mt-6"
      data-ocid="admin.profile_links_notice"
    >
      <div className="flex items-start gap-3">
        <FontAwesomeIcon
          icon={faShieldHalved}
          className="text-primary text-lg mt-0.5 shrink-0"
        />
        <div>
          <h3 className="font-display font-semibold text-foreground text-sm mb-1">
            Profile Links (Connected Presence)
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Members can add external links to their profiles. If a member has
            malicious links, freeze their profile using the{" "}
            <FontAwesomeIcon icon={faLock} className="text-xs mx-0.5" /> Freeze
            button on each row above.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Future: per-link removal tool will be added here.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Membership Tier helpers ─────────────────────────────────────────────────
const TIER_LABELS: Record<MembershipTier, string> = {
  communitySupporterTier: "Community Supporter",
  builderMember: "Builder Member",
  localSponsor: "Local Sponsor",
  verifiedBusiness: "Verified Business",
  localProducer: "Local Producer",
  communityPartner: "Community Partner",
};

const _TIER_MONTHLY: Record<MembershipTier, number> = {
  communitySupporterTier: 5,
  builderMember: 10,
  localSponsor: 25,
  verifiedBusiness: 20,
  localProducer: 10,
  communityPartner: 0,
};

const TIER_COLORS: Record<MembershipTier, string> = {
  communitySupporterTier: "bg-primary/10 text-primary border-primary/25",
  builderMember: "bg-blue-500/10 text-blue-400 border-blue-500/25",
  localSponsor: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  verifiedBusiness: "bg-purple-500/10 text-purple-400 border-purple-500/25",
  localProducer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  communityPartner: "bg-muted text-muted-foreground border-border",
};

function TierBadge({ tier }: { tier: MembershipTier }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${TIER_COLORS[tier]}`}
    >
      {TIER_LABELS[tier] ?? tier}
    </span>
  );
}

function StatusPill({ status }: { status: MembershipStatus }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/25">
        <FontAwesomeIcon icon={faCircleCheck} className="text-xs" /> Approved
      </span>
    );
  }
  if (status === "contacted") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/25">
        <FontAwesomeIcon icon={faBuilding} className="text-xs" /> Contacted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25">
      <FontAwesomeIcon icon={faTriangleExclamation} className="text-xs" />{" "}
      Pending
    </span>
  );
}

function exportMembershipCSV(intents: MembershipIntent[]) {
  const header = [
    "Name",
    "Email",
    "City",
    "Province",
    "Tier",
    "Participant Type",
    "Status",
    "Date",
  ].join(",");
  const rows = intents.map((i) =>
    [
      JSON.stringify(i.name),
      JSON.stringify(i.email),
      JSON.stringify(i.city),
      JSON.stringify(i.province),
      JSON.stringify(TIER_LABELS[i.membershipTier] ?? i.membershipTier),
      JSON.stringify(i.participantType),
      JSON.stringify(i.status),
      JSON.stringify(
        new Date(Number(i.createdAt / 1_000_000n)).toLocaleDateString("en-CA"),
      ),
    ].join(","),
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `membership-intents-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Membership Tab ───────────────────────────────────────────────────────────
function MembershipTab({
  intents,
  stats,
  loading,
  updateStatus,
  updatePending,
}: {
  intents: MembershipIntent[];
  stats: MembershipStats | null | undefined;
  loading: boolean;
  updateStatus: (id: string, status: MembershipStatus) => void;
  updatePending: boolean;
}) {
  const [filterTier, setFilterTier] = useState<MembershipTier | "">("");
  const [filterStatus, setFilterStatus] = useState<MembershipStatus | "">("");
  const [filterType, setFilterType] = useState<MemberParticipantType | "">("");
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);
  const [openAction, setOpenAction] = useState<string | null>(null);

  const filtered = intents.filter((i) => {
    if (filterTier && i.membershipTier !== filterTier) return false;
    if (filterStatus && i.status !== filterStatus) return false;
    if (filterType && i.participantType !== filterType) return false;
    return true;
  });

  const estimatedSupport = stats ? Number(stats.estimatedMonthlySupport) : 0;

  const tierBreakdown: Array<[string, bigint]> = stats?.byTier ?? [];

  const businessCount = intents.filter(
    (i) => i.membershipTier === "verifiedBusiness",
  ).length;
  const producerCount = intents.filter(
    (i) => i.membershipTier === "localProducer",
  ).length;
  const sponsorCount = intents.filter(
    (i) => i.membershipTier === "localSponsor",
  ).length;

  const selectClass =
    "px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 min-w-0";

  return (
    <div data-ocid="admin.membership_panel">
      {/* Stats section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 col-span-2 md:col-span-1">
          <p className="text-2xl font-display font-bold text-primary">
            {intents.length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Intents</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-display font-bold text-amber-400">
            {businessCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Business Requests
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-display font-bold text-emerald-400">
            {producerCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Producer Requests
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-display font-bold text-purple-400">
            {sponsorCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sponsor Inquiries
          </p>
        </div>
      </div>

      {/* Monthly support estimate + tier breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon
              icon={faArrowTrendUp}
              className="text-primary text-sm"
            />
            <h3 className="font-display font-semibold text-foreground text-sm">
              Estimated Monthly Support
            </h3>
          </div>
          <p className="text-3xl font-display font-bold text-primary">
            ${estimatedSupport.toLocaleString("en-CA")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on submitted intents × tier monthly rate
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon
              icon={faHandHoldingHeart}
              className="text-primary text-sm"
            />
            <h3 className="font-display font-semibold text-foreground text-sm">
              Intents by Tier
            </h3>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-5 rounded bg-muted/40 animate-pulse"
                />
              ))}
            </div>
          ) : tierBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <div className="space-y-1.5">
              {tierBreakdown.map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {TIER_LABELS[tier as MembershipTier] ?? tier}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {count.toString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters + Export */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
          <FontAwesomeIcon icon={faFilter} className="text-sm" />
          <span className="text-xs">Filter:</span>
        </div>
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value as MembershipTier | "")}
          className={selectClass}
          data-ocid="admin.membership.filter_tier"
          aria-label="Filter by tier"
        >
          <option value="">All Tiers</option>
          {(Object.keys(TIER_LABELS) as MembershipTier[]).map((t) => (
            <option key={t} value={t}>
              {TIER_LABELS[t]}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as MembershipStatus | "")
          }
          className={selectClass}
          data-ocid="admin.membership.filter_status"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="approved">Approved</option>
        </select>
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as MemberParticipantType | "")
          }
          className={selectClass}
          data-ocid="admin.membership.filter_type"
          aria-label="Filter by participant type"
        >
          <option value="">All Types</option>
          <option value="individual">Individual</option>
          <option value="business">Business</option>
          <option value="producer">Producer</option>
          <option value="organization">Organization</option>
        </select>
        <button
          type="button"
          data-ocid="admin.membership.export_button"
          onClick={() => exportMembershipCSV(filtered)}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <FontAwesomeIcon icon={faDownload} className="text-xs" /> Export CSV (
          {filtered.length})
        </button>
      </div>

      {/* Intent list */}
      {loading ? (
        <div className="space-y-3" data-ocid="admin.membership.loading_state">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 rounded-xl bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <FontAwesomeIcon icon={faHandHoldingHeart} className="text-4xl" />
          }
          headline="No membership intents yet"
          description="Membership interest submissions will appear here."
          data-ocid="admin.membership.empty_state"
        />
      ) : (
        <div className="space-y-2" data-ocid="admin.membership.list">
          {filtered.map((intent, i) => {
            const msg = intent.message.length > 0 ? intent.message[0] : null;
            const isExpanded = expandedMsg === intent.id;
            const isOpen = openAction === intent.id;
            return (
              <div
                key={intent.id}
                data-ocid={`admin.membership.item.${i + 1}`}
                className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
              >
                {/* Row 1: name + badges + date */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-display font-semibold text-foreground truncate">
                        {intent.name}
                      </p>
                      <TierBadge tier={intent.membershipTier} />
                      <StatusPill status={intent.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {intent.email} &middot; {intent.city},{" "}
                      {PROVINCE_NAMES[intent.province] ?? intent.province}{" "}
                      &middot;{" "}
                      <span className="capitalize">
                        {intent.participantType}
                      </span>
                    </p>
                    {msg && (
                      <div className="mt-1.5">
                        <p
                          className={`text-xs text-muted-foreground ${isExpanded ? "" : "line-clamp-1"}`}
                        >
                          {msg}
                        </p>
                        {msg.length > 80 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedMsg(isExpanded ? null : intent.id)
                            }
                            className="text-xs text-primary hover:underline mt-0.5"
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Date */}
                  <p className="text-xs text-muted-foreground/60 flex-shrink-0">
                    {new Date(
                      Number(intent.createdAt / 1_000_000n),
                    ).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Row 2: actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <button
                      type="button"
                      data-ocid={`admin.membership.action_button.${i + 1}`}
                      onClick={() => setOpenAction(isOpen ? null : intent.id)}
                      disabled={updatePending}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50"
                    >
                      Update Status{" "}
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-xs ml-1"
                      />
                    </button>
                    {isOpen && (
                      <div
                        className="absolute left-0 top-full mt-1 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[170px]"
                        data-ocid={`admin.membership.status_dropdown.${i + 1}`}
                      >
                        {(
                          [
                            "pending",
                            "contacted",
                            "approved",
                          ] as MembershipStatus[]
                        ).map((s) => (
                          <button
                            key={s}
                            type="button"
                            disabled={intent.status === s}
                            onClick={() => {
                              updateStatus(intent.id, s);
                              setOpenAction(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40 capitalize"
                          >
                            {s === "pending"
                              ? "Reset to Pending"
                              : s === "contacted"
                                ? "Mark as Contacted"
                                : "Mark as Approved"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {intent.status === "pending" && (
                    <button
                      type="button"
                      data-ocid={`admin.membership.contacted_button.${i + 1}`}
                      disabled={updatePending}
                      onClick={() => updateStatus(intent.id, "contacted")}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/25 text-xs font-medium hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faBuilding} className="text-xs" />{" "}
                      Mark Contacted
                    </button>
                  )}
                  {intent.status !== "approved" && (
                    <button
                      type="button"
                      data-ocid={`admin.membership.approve_button.${i + 1}`}
                      disabled={updatePending}
                      onClick={() => updateStatus(intent.id, "approved")}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/25 text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-xs"
                      />{" "}
                      Approve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Community Opportunities Tab ─────────────────────────────────────────────
type OppFilter = "all" | "active" | "inactive" | "flagged";

function OpportunitiesTab() {
  const { data: opportunities = [], isLoading } = useAllOpportunities();
  const updateStatus = useUpdateOpportunityStatusAdmin();
  const flagOpportunity = useAdminFlagOpportunityMutation();
  const [filter, setFilter] = useState<OppFilter>("all");

  const filtered = opportunities.filter((opp) => {
    if (filter === "active") return opp.status === "active";
    if (filter === "inactive") return opp.status === "inactive";
    if (filter === "flagged") return opp.adminFlagged === true;
    return true;
  });

  const totalCount = opportunities.length;
  const activeCount = opportunities.filter((o) => o.status === "active").length;
  const flaggedCount = opportunities.filter((o) => o.adminFlagged).length;

  const OPP_FILTERS: { key: OppFilter; label: string }[] = [
    { key: "all", label: `All (${totalCount})` },
    { key: "active", label: `Active (${activeCount})` },
    {
      key: "inactive",
      label: `Inactive (${totalCount - activeCount})`,
    },
    { key: "flagged", label: `Flagged (${flaggedCount})` },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.opportunities_loading_state">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div data-ocid="admin.opportunities_panel">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-display font-bold text-foreground">
            {totalCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Total</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-display font-bold text-primary">
            {activeCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Active</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p
            className={`text-2xl font-display font-bold ${
              flaggedCount > 0 ? "text-amber-400" : "text-muted-foreground"
            }`}
          >
            {flaggedCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Flagged</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-muted/40 rounded-xl border border-border mb-5 overflow-x-auto scrollbar-none">
        {OPP_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            data-ocid={`admin.opportunities.filter_${f.key}`}
            onClick={() => setFilter(f.key)}
            className={`flex-1 justify-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FontAwesomeIcon icon={faHandshake} className="text-4xl" />}
          headline={
            filter === "all"
              ? "No community opportunities yet"
              : `No ${filter} opportunities`
          }
          description="Community opportunities posted by members will appear here."
          data-ocid="admin.opportunities.empty_state"
        />
      ) : (
        <div className="space-y-3" data-ocid="admin.opportunities_list">
          {[...filtered]
            .sort((a, b) =>
              a.createdAt < b.createdAt
                ? 1
                : a.createdAt > b.createdAt
                  ? -1
                  : 0,
            )
            .map((opp, i) => {
              const isActive = opp.status === "active";
              const isFlagged = opp.adminFlagged === true;
              const categoryLabel =
                OPPORTUNITY_CATEGORY_LABELS[
                  opp.category as unknown as string
                ] ?? String(opp.category);

              return (
                <div
                  key={opp.id.toString()}
                  data-ocid={`admin.opportunities.item.${i + 1}`}
                  className={`bg-card border rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4 ${
                    isFlagged
                      ? "border-amber-500/30"
                      : isActive
                        ? "border-border"
                        : "border-border/50 opacity-75"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-display font-semibold text-foreground truncate">
                        {opp.title}
                      </p>
                      {/* Status badge */}
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/25">
                          <FontAwesomeIcon
                            icon={faPlay}
                            className="text-[10px]"
                          />{" "}
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                          <FontAwesomeIcon
                            icon={faPause}
                            className="text-[10px]"
                          />{" "}
                          Inactive
                        </span>
                      )}
                      {/* Flagged badge */}
                      {isFlagged && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25">
                          <FontAwesomeIcon
                            icon={faFlag}
                            className="text-[10px]"
                          />{" "}
                          Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      <span className="capitalize">{categoryLabel}</span>{" "}
                      &middot; {opp.city},{" "}
                      {PROVINCE_NAMES[opp.province] ?? opp.province}
                    </p>
                    {opp.organizationName && (
                      <p className="text-xs text-muted-foreground">
                        <FontAwesomeIcon
                          icon={faBuilding}
                          className="text-xs mr-1"
                        />
                        {opp.organizationName}
                      </p>
                    )}
                  </div>

                  {/* Admin action buttons */}
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    {isActive && (
                      <button
                        type="button"
                        data-ocid={`admin.opportunities.deactivate_button.${i + 1}`}
                        onClick={() =>
                          updateStatus.mutate({
                            id: opp.id,
                            status: "inactive",
                          })
                        }
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/25 text-xs font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faBan} className="text-xs" />{" "}
                        Deactivate
                      </button>
                    )}
                    {!isActive && (
                      <button
                        type="button"
                        data-ocid={`admin.opportunities.reactivate_button.${i + 1}`}
                        onClick={() =>
                          updateStatus.mutate({ id: opp.id, status: "active" })
                        }
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/25 text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faPlay} className="text-xs" />{" "}
                        Reactivate
                      </button>
                    )}
                    {!isFlagged && (
                      <button
                        type="button"
                        data-ocid={`admin.opportunities.flag_button.${i + 1}`}
                        onClick={() =>
                          flagOpportunity.mutate({ id: opp.id, flagged: true })
                        }
                        disabled={flagOpportunity.isPending}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25 text-xs font-medium hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faFlag} className="text-xs" />{" "}
                        Flag &amp; Deactivate
                      </button>
                    )}
                    {isFlagged && (
                      <button
                        type="button"
                        data-ocid={`admin.opportunities.unflag_button.${i + 1}`}
                        onClick={() =>
                          flagOpportunity.mutate({ id: opp.id, flagged: false })
                        }
                        disabled={flagOpportunity.isPending}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faShield} className="text-xs" />{" "}
                        Unflag
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ─── Analytics Tab ───────────────────────────────────────────────────────────

/** Simple inline-SVG bar chart — no external library */
function SvgBarChart({
  data,
  label,
  color = "hsl(var(--primary))",
}: {
  data: { label: string; value: number }[];
  label: string;
  color?: string;
}) {
  if (data.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-6 text-center">
        No data yet.
      </p>
    );
  }
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barW = 28;
  const barGap = 8;
  const svgH = 100;
  const labelH = 28;
  const totalW = data.length * (barW + barGap);

  return (
    <div className="overflow-x-auto">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <svg
        width={totalW}
        height={svgH + labelH}
        viewBox={`0 0 ${totalW} ${svgH + labelH}`}
        aria-label={label}
        role="img"
      >
        {data.map((d, i) => {
          const barH = Math.max(
            3,
            Math.round((d.value / maxVal) * svgH * 0.85),
          );
          const x = i * (barW + barGap);
          const y = svgH - barH;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={4}
                fill={color}
                opacity={0.85}
              />
              {d.value > 0 && (
                <text
                  x={x + barW / 2}
                  y={y - 3}
                  textAnchor="middle"
                  fontSize={9}
                  fill="currentColor"
                  className="fill-foreground"
                >
                  {d.value}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={svgH + 16}
                textAnchor="middle"
                fontSize={9}
                fill="currentColor"
                className="fill-muted-foreground"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Group ActivityEvent[] into daily buckets for the last N days */
function groupByDay(
  events: ActivityEvent[],
  eventType: string,
  days = 14,
): { label: string; value: number }[] {
  const now = Date.now();
  const result: { label: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - i * 86_400_000;
    const dayEnd = dayStart + 86_400_000;
    const label = new Date(dayStart).toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
    });
    const value = events.filter((e) => {
      const t = Number(e.timestamp / 1_000_000n);
      return e.eventType === eventType && t >= dayStart && t < dayEnd;
    }).length;
    result.push({ label, value });
  }
  return result;
}

function AnalyticsTab({
  stats,
  members,
  activities,
  membershipStats,
  membershipIntents,
  volunteers,
  loading,
}: {
  stats: StatsRecord | null | undefined;
  members: MemberRecord[];
  activities: ActivityEvent[];
  membershipStats: MembershipStats | null | undefined;
  membershipIntents: MembershipIntent[];
  volunteers: VolunteerInterest[];
  loading: boolean;
}) {
  // ── Derived: city aggregation ──────────────────────────────────────────────
  const cityMap = new Map<
    string,
    {
      city: string;
      province: string;
      members: number;
      businesses: number;
      producers: number;
    }
  >();
  for (const m of members) {
    if (!m.city) continue;
    const key = `${m.city}|${m.province}`;
    const existing = cityMap.get(key) ?? {
      city: m.city,
      province: m.province,
      members: 0,
      businesses: 0,
      producers: 0,
    };
    existing.members += 1;
    if (m.participantType === "business") existing.businesses += 1;
    if (m.participantType === "producer") existing.producers += 1;
    cityMap.set(key, existing);
  }
  const topCities = [...cityMap.values()]
    .sort((a, b) =>
      a.members < b.members ? 1 : a.members > b.members ? -1 : 0,
    )
    .slice(0, 10);

  // ── Derived: fastest growing city (last 7 days from activities) ────────────
  const sevenDaysAgo = Date.now() - 7 * 86_400_000;
  const recentJoins = activities.filter(
    (e) =>
      e.eventType === "member_joined" &&
      Number(e.timestamp / 1_000_000n) >= sevenDaysAgo,
  );
  const recentCityMap = new Map<string, number>();
  for (const ev of recentJoins) {
    if (!ev.city) continue;
    recentCityMap.set(ev.city, (recentCityMap.get(ev.city) ?? 0) + 1);
  }
  const fastestCity =
    [...recentCityMap.entries()].sort((a, b) =>
      a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0,
    )[0]?.[0] ?? null;

  // ── Derived: most active category ─────────────────────────────────────────
  const catMap = new Map<string, number>();
  for (const m of members) {
    if (m.communityVerified && m.category) {
      catMap.set(m.category, (catMap.get(m.category) ?? 0) + 1);
    }
  }
  const topCategory =
    [...catMap.entries()].sort((a, b) =>
      a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0,
    )[0]?.[0] ?? null;

  // ── Derived: newest member ────────────────────────────────────────────────
  const approvedMembers = members
    .filter(
      (m) =>
        "verified" in m.verificationStatus || "pending" in m.verificationStatus,
    )
    .sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
    );
  const newestMember = approvedMembers[0] ?? null;

  // ── Derived: supporter count (communitySupporterTier) ─────────────────────
  const supporterSubmissions = membershipIntents.filter(
    (i) => i.membershipTier === "communitySupporterTier",
  ).length;

  // ── Chart data ────────────────────────────────────────────────────────────
  const signupData = groupByDay(activities, "member_joined", 14);
  const verifyData = groupByDay(activities, "listing_verified", 14);
  const volunteerData = groupByDay(activities, "volunteer_joined", 14);

  // ── Membership tier breakdown ────────────────────────────────────────────
  const tierBreakdown = membershipStats?.byTier ?? [];
  const totalIntents = membershipIntents.length;

  const TIER_LABELS_MAP: Record<string, string> = {
    communitySupporterTier: "Community Supporter",
    builderMember: "Builder Member",
    localSponsor: "Local Sponsor",
    verifiedBusiness: "Verified Business",
    localProducer: "Local Producer",
    communityPartner: "Community Partner",
  };

  const TIER_BAR_COLORS: Record<string, string> = {
    communitySupporterTier: "hsl(var(--primary))",
    builderMember: "rgb(96 165 250)",
    localSponsor: "rgb(251 191 36)",
    verifiedBusiness: "rgb(167 139 250)",
    localProducer: "rgb(52 211 153)",
    communityPartner: "hsl(var(--muted-foreground))",
  };

  if (loading) {
    return (
      <div className="space-y-4" data-ocid="admin.analytics_loading_state">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-32 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8" data-ocid="admin.analytics_panel">
      {/* SECTION 1 — Key Metrics Grid */}
      <section data-ocid="admin.analytics.metrics_section">
        <h2 className="font-display font-semibold text-foreground text-base mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faChartBar} className="text-primary text-sm" />
          Key Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <StatCard label="Total Members" value={stats?.totalMembers ?? 0n} />
          <StatCard
            label="Verified Members"
            value={stats?.verifiedMembers ?? 0n}
            accent="green"
          />
          <StatCard
            label="Businesses"
            value={stats?.businessMembers ?? 0n}
            accent="blue"
          />
          <StatCard
            label="Food Producers"
            value={stats?.producerMembers ?? 0n}
            accent="green"
          />
          <StatCard
            label="Volunteers"
            value={BigInt(volunteers?.length ?? 0)}
          />
          <StatCard
            label="Membership Intents"
            value={BigInt(totalIntents)}
            accent="orange"
          />
          <StatCard
            label="Supporter Submissions"
            value={BigInt(supporterSubmissions)}
            accent="green"
          />
          <StatCard
            label="Cities Participating"
            value={BigInt(topCities.length)}
            accent="blue"
          />
        </div>
      </section>

      {/* SECTION 2 — Participation Trends */}
      <section data-ocid="admin.analytics.trends_section">
        <h2 className="font-display font-semibold text-foreground text-base mb-4 flex items-center gap-2">
          <FontAwesomeIcon
            icon={faArrowTrendUp}
            className="text-primary text-sm"
          />
          Participation Trends
          <span className="text-xs font-normal text-muted-foreground ml-1">
            Last 14 days
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm font-medium text-foreground mb-3">
              New Signups
            </p>
            <SvgBarChart
              data={signupData}
              label="Member join events per day"
              color="hsl(var(--primary))"
            />
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm font-medium text-foreground mb-3">
              Verifications
            </p>
            <SvgBarChart
              data={verifyData}
              label="Listing verified events per day"
              color="rgb(52 211 153)"
            />
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm font-medium text-foreground mb-3">
              Volunteer Signups
            </p>
            <SvgBarChart
              data={volunteerData}
              label="Volunteer join events per day"
              color="rgb(251 191 36)"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3 — Most Active Cities */}
      <section data-ocid="admin.analytics.cities_section">
        <h2 className="font-display font-semibold text-foreground text-base mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faCity} className="text-primary text-sm" />
          Most Active Cities
          <span className="text-xs font-normal text-muted-foreground ml-1">
            By total members
          </span>
        </h2>
        {topCities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No city data available yet.
          </p>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm" aria-label="Most active cities">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    City
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">
                    Province
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">
                    Members
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                    Businesses
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                    Producers
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCities.map((c, i) => (
                  <tr
                    key={`${c.city}-${c.province}`}
                    data-ocid={`admin.analytics.city_row.${i + 1}`}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {c.city}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {PROVINCE_NAMES[c.province] ?? c.province}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-primary">
                      {c.members}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                      {c.businesses}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                      {c.producers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SECTION 4 — Activity Insights */}
      <section data-ocid="admin.analytics.insights_section">
        <h2 className="font-display font-semibold text-foreground text-base mb-4 flex items-center gap-2">
          <FontAwesomeIcon
            icon={faLightbulb}
            className="text-primary text-sm"
          />
          Activity Insights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">Newest Member</p>
            {newestMember ? (
              <>
                <p className="font-display font-semibold text-foreground text-sm leading-snug">
                  {newestMember.businessName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {newestMember.city},{" "}
                  {PROVINCE_NAMES[newestMember.province] ??
                    newestMember.province}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No members yet</p>
            )}
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">
              Most Verified Category
            </p>
            {topCategory ? (
              <p className="font-display font-semibold text-foreground text-sm">
                {topCategory}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">
              Fastest Growing City
              <span className="block text-[10px] opacity-70">
                (last 7 days)
              </span>
            </p>
            {fastestCity ? (
              <p className="font-display font-semibold text-foreground text-sm">
                {fastestCity}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Membership Overview */}
      <section data-ocid="admin.analytics.membership_section">
        <h2 className="font-display font-semibold text-foreground text-base mb-4 flex items-center gap-2">
          <FontAwesomeIcon
            icon={faHandHoldingHeart}
            className="text-primary text-sm"
          />
          Membership Overview
        </h2>
        <div className="bg-card border border-border rounded-xl p-5">
          {tierBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No membership intents yet.
            </p>
          ) : (
            <div className="space-y-3">
              {tierBreakdown.map(([tier, count]) => {
                const pct =
                  totalIntents > 0
                    ? Math.round((Number(count) / totalIntents) * 100)
                    : 0;
                const barColor = TIER_BAR_COLORS[tier] ?? "hsl(var(--primary))";
                return (
                  <div
                    key={tier}
                    data-ocid={`admin.analytics.tier_row.${tier}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {TIER_LABELS_MAP[tier] ?? tier}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {count.toString()}{" "}
                        <span className="text-muted-foreground/60">
                          ({pct}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export function Admin() {
  const { isAdmin, isAuthenticated, login } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");

  const { data: members = [], isLoading: loadingMembers } = useMembers();
  const { data: stats, isLoading: loadingStats } = useStats();
  const { data: volunteers = [], isLoading: loadingVolunteers } =
    useVolunteers();

  const approveMember = useApproveMember();
  const rejectMember = useRejectMember();
  const featureMember = useFeatureMember();
  const deleteMember = useDeleteMember();

  // Community trust state
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [trustQueue, setTrustQueue] = useState<AdminTrustQueue | null>(null);
  const [loadingTrust, setLoadingTrust] = useState(false);
  const [overridePending, setOverridePending] = useState(false);
  const [freezePending, setFreezePending] = useState(false);
  const [removePending, setRemovePending] = useState(false);
  const [freezeProfilePending, setFreezeProfilePending] = useState(false);

  // Membership hooks — must be before any early returns
  const { data: membershipIntents = [], isLoading: loadingMembership } =
    useGetMembershipIntents();
  const { data: membershipStats } = useGetMembershipStats();
  const updateMembershipStatus = useUpdateMembershipIntentStatus();

  // Analytics data — activity feed for trend charts
  const { data: activities = [], isLoading: loadingActivities } =
    useActivityFeed(200);

  async function fetchTrustQueue() {
    if (!actor) return;
    setLoadingTrust(true);
    try {
      const a = actor as unknown as BackendActor;
      const res = await (
        a.getAdminTrustQueue as () => Promise<
          { ok: AdminTrustQueue } | { err: string }
        >
      )();
      if ("ok" in res) setTrustQueue(res.ok);
    } finally {
      setLoadingTrust(false);
    }
  }

  async function handleOverrideStatus(memberId: string, newStatus: string) {
    if (!actor) return;
    setOverridePending(true);
    try {
      const a = actor as unknown as BackendActor;
      await (
        a.overrideTrustStatus as (
          id: string,
          s: string,
        ) => Promise<{ ok: string } | { err: string }>
      )(memberId, newStatus);
      await fetchTrustQueue();
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } finally {
      setOverridePending(false);
    }
  }

  async function handleFreezeVoting(memberId: string, frozen: boolean) {
    if (!actor) return;
    setFreezePending(true);
    try {
      const a = actor as unknown as BackendActor;
      await (
        a.freezeVoting as (
          id: string,
          frozen: boolean,
        ) => Promise<{ ok: string } | { err: string }>
      )(memberId, frozen);
      await fetchTrustQueue();
    } finally {
      setFreezePending(false);
    }
  }

  async function handleFreezeProfile(memberId: string, name: string) {
    if (
      !window.confirm(
        `Freeze profile for "${name}"? This will flag the profile for review.`,
      )
    )
      return;
    setFreezeProfilePending(true);
    try {
      const a = actor as unknown as BackendActor;
      await (
        a.overrideTrustStatus as (
          id: string,
          s: string,
        ) => Promise<{ ok: string } | { err: string }>
      )(memberId, "under_review");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } finally {
      setFreezeProfilePending(false);
    }
  }

  async function handleRemoveListing(memberId: string, name: string) {
    if (!window.confirm(`Remove listing "${name}" from the directory?`)) return;
    setRemovePending(true);
    try {
      const a = actor as unknown as BackendActor;
      await (
        a.deleteMember as (
          id: string,
        ) => Promise<{ ok: null } | { err: string }>
      )(memberId);
      await fetchTrustQueue();
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } finally {
      setRemovePending(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center px-4"
        data-ocid="admin.auth_required"
      >
        <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
          <FontAwesomeIcon
            icon={faShieldHalved}
            className="text-primary text-4xl mx-auto mb-4 block"
          />
          <h2 className="text-xl font-display font-bold text-foreground mb-3">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in with an authorized admin account to continue.
          </p>
          <button
            type="button"
            onClick={login}
            data-ocid="admin.login_button"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/85 transition-smooth"
          >
            Login with Internet Identity
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center px-4"
        data-ocid="admin.unauthorized"
      >
        <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="text-destructive text-4xl mx-auto mb-4 block"
          />
          <h2 className="text-xl font-display font-bold text-foreground mb-3">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm">
            Your account is not authorized to access this panel.
          </p>
        </div>
      </div>
    );
  }

  const pending = members.filter((m) => "pending" in m.verificationStatus);
  const flaggedCount = trustQueue?.flagged.length ?? 0;

  const TABS: {
    key: AdminTab;
    label: string;
    count?: number;
    icon: React.ReactNode;
    alertCount?: boolean;
  }[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <FontAwesomeIcon icon={faArrowsRotate} className="text-sm" />,
    },
    {
      key: "pending",
      label: "Pending Submissions",
      count: pending.length,
      icon: <FontAwesomeIcon icon={faCircleCheck} className="text-sm" />,
    },
    {
      key: "all",
      label: "All Listings",
      count: members.length,
      icon: <FontAwesomeIcon icon={faUsers} className="text-sm" />,
    },
    {
      key: "volunteers",
      label: "Volunteer Signups",
      count: volunteers.length,
      icon: <FontAwesomeIcon icon={faLeaf} className="text-sm" />,
    },
    {
      key: "trust",
      label: "Community Trust",
      count: flaggedCount,
      alertCount: true,
      icon: <FontAwesomeIcon icon={faBolt} className="text-sm" />,
    },
    {
      key: "membership",
      label: "Membership",
      icon: <FontAwesomeIcon icon={faHandHoldingHeart} className="text-sm" />,
    },
    {
      key: "opportunities",
      label: "Opportunities",
      icon: <FontAwesomeIcon icon={faHandshake} className="text-sm" />,
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <FontAwesomeIcon icon={faChartBar} className="text-sm" />,
    },
  ];

  return (
    <div data-ocid="admin.page" className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-5">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage listings, approvals, and community data.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faShieldHalved}
              className="text-primary text-xl"
            />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Authorized Admin
            </span>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 flex gap-0 overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              data-ocid={`admin.${t.key}_tab`}
              onClick={() => {
                setTab(t.key);
                if (
                  t.key === "trust" &&
                  !trustQueue &&
                  !loadingTrust &&
                  actor &&
                  !actorFetching
                ) {
                  fetchTrustQueue();
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    t.alertCount && t.count > 0
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : t.key === "pending" && t.count > 0
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {tab === "dashboard" && (
          <DashboardTab stats={loadingStats ? undefined : stats} />
        )}

        {tab === "pending" && (
          <PendingTab
            pending={pending}
            loading={loadingMembers}
            approvePending={approveMember.isPending}
            rejectPending={rejectMember.isPending}
            onApprove={(id) => approveMember.mutate(id)}
            onReject={(id) => rejectMember.mutate(id)}
          />
        )}

        {tab === "all" && (
          <>
            <AllListingsTab
              members={members}
              loading={loadingMembers}
              featurePending={featureMember.isPending}
              deletePending={deleteMember.isPending}
              freezePending={freezeProfilePending}
              onFeature={(id, featured) =>
                featureMember.mutate({ id, featured })
              }
              onDelete={(id) => deleteMember.mutate(id)}
              onFreezeProfile={handleFreezeProfile}
            />
            {!loadingMembers && <ProfileLinksNotice />}
          </>
        )}

        {tab === "volunteers" && (
          <VolunteersTab volunteers={volunteers} loading={loadingVolunteers} />
        )}

        {tab === "trust" && (
          <CommunityTrustTab
            trustQueue={trustQueue}
            loading={loadingTrust}
            onOverrideStatus={handleOverrideStatus}
            onFreezeVoting={handleFreezeVoting}
            onRemoveListing={handleRemoveListing}
            overridePending={overridePending}
            freezePending={freezePending}
            removePending={removePending}
          />
        )}

        {tab === "membership" && (
          <MembershipTab
            intents={membershipIntents}
            stats={membershipStats}
            loading={loadingMembership}
            updateStatus={(id, status) =>
              updateMembershipStatus.mutate({ id, status })
            }
            updatePending={updateMembershipStatus.isPending}
          />
        )}

        {tab === "opportunities" && <OpportunitiesTab />}

        {tab === "analytics" && (
          <AnalyticsTab
            stats={stats}
            members={members}
            activities={activities}
            membershipStats={membershipStats}
            membershipIntents={membershipIntents}
            volunteers={volunteers}
            loading={loadingActivities || loadingStats || loadingMembers}
          />
        )}
      </div>
    </div>
  );
}
