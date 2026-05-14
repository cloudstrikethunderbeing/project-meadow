import { createActor } from "@/backend";
import {
  type BackendActor,
  apiAddCommunityVote,
  apiAdminFlagOpportunity,
  apiApproveMember,
  apiCreateMember,
  apiCreateOpportunity,
  apiCreateVolunteer,
  apiDeleteMember,
  apiFeatureMember,
  apiGetCityStats,
  apiGetCommunityVotes,
  apiGetLatestOpportunities,
  apiGetMember,
  apiGetMembers,
  apiGetMyVote,
  apiGetOpportunities,
  apiGetOpportunitiesByMember,
  apiGetStats,
  apiGetVolunteers,
  apiRejectMember,
  apiRemoveCommunityVote,
  apiUpdateMember,
  apiUpdateOpportunityStatus,
} from "@/lib/api";
import type {
  ActivityEvent,
  CityStats,
  CommunityOpportunity,
  MemberInput,
  MembershipIntent,
  MembershipIntentInput,
  MembershipStats,
  MembershipStatus,
  MembershipTier,
  OpportunityInput,
  VolunteerInput,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useBackendActor() {
  return useActor(createActor);
}

export function useMembers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      if (!actor) return [];
      return apiGetMembers(actor as unknown as BackendActor);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMember(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["member", id],
    queryFn: async () => {
      if (!actor) return undefined;
      return apiGetMember(actor as unknown as BackendActor, id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useStats() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return null;
      return apiGetStats(actor as unknown as BackendActor);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVolunteers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      if (!actor) return [];
      return apiGetVolunteers(actor as unknown as BackendActor);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMember() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: MemberInput) => {
      if (!actor) throw new Error("Not connected");
      return apiCreateMember(actor as unknown as BackendActor, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateMember() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: MemberInput }) => {
      if (!actor) throw new Error("Not connected");
      return apiUpdateMember(actor as unknown as BackendActor, id, input);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["member", id] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useDeleteMember() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return apiDeleteMember(actor as unknown as BackendActor, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useApproveMember() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return apiApproveMember(actor as unknown as BackendActor, id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["member", id] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useRejectMember() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return apiRejectMember(actor as unknown as BackendActor, id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["member", id] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useFeatureMember() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return apiFeatureMember(actor as unknown as BackendActor, id, featured);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["member", id] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useCreateVolunteer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: VolunteerInput) => {
      if (!actor) throw new Error("Not connected");
      return apiCreateVolunteer(actor as unknown as BackendActor, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}
export function useCommunityVotes(listingId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["communityVotes", listingId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await apiGetCommunityVotes(
        actor as unknown as BackendActor,
        listingId,
      );
      if ("ok" in result) return result.ok;
      return null;
    },
    enabled: !!actor && !isFetching && !!listingId,
  });
}

export function useMyVote(listingId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myVote", listingId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await apiGetMyVote(
        actor as unknown as BackendActor,
        listingId,
      );
      return result.length > 0 ? result[0] : null;
    },
    enabled: !!actor && !isFetching && !!listingId,
  });
}

export function useAddCommunityVote() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      voteType,
    }: {
      listingId: string;
      voteType: "upvote" | "downvote";
    }) => {
      if (!actor) throw new Error("Not connected");
      return apiAddCommunityVote(
        actor as unknown as BackendActor,
        listingId,
        voteType,
      );
    },
    onSuccess: (_data, { listingId }) => {
      queryClient.invalidateQueries({
        queryKey: ["communityVotes", listingId],
      });
      queryClient.invalidateQueries({ queryKey: ["myVote", listingId] });
      queryClient.invalidateQueries({ queryKey: ["member", listingId] });
    },
  });
}

export function useRemoveCommunityVote() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: string) => {
      if (!actor) throw new Error("Not connected");
      return apiRemoveCommunityVote(
        actor as unknown as BackendActor,
        listingId,
      );
    },
    onSuccess: (_data, listingId) => {
      queryClient.invalidateQueries({
        queryKey: ["communityVotes", listingId],
      });
      queryClient.invalidateQueries({ queryKey: ["myVote", listingId] });
      queryClient.invalidateQueries({ queryKey: ["member", listingId] });
    },
  });
}

export function useGetCityStats() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CityStats[]>({
    queryKey: ["cityStats"],
    queryFn: async () => {
      if (!actor) return [];
      return apiGetCityStats(actor as unknown as BackendActor);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActivityFeed(limit = 20) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ActivityEvent[]>({
    queryKey: ["activityFeed", limit],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as unknown as any).getActivityFeed(
          BigInt(limit),
        );
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLocalActivity(city: string, limit = 10) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ActivityEvent[]>({
    queryKey: ["localActivity", city, limit],
    queryFn: async () => {
      if (!actor || !city) return [];
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as unknown as any).getLocalActivity(
          city,
          BigInt(limit),
        );
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!city,
  });
}
// ─── Community Opportunities ─────────────────────────────────────────────────

export function useOpportunities(city?: string, category?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CommunityOpportunity[]>({
    queryKey: ["opportunities", city ?? "", category ?? ""],
    queryFn: async () => {
      if (!actor) return [];
      return apiGetOpportunities(
        actor as unknown as BackendActor,
        city,
        category,
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestOpportunities(limit: number) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CommunityOpportunity[]>({
    queryKey: ["latestOpportunities", limit],
    queryFn: async () => {
      if (!actor) return [];
      return apiGetLatestOpportunities(
        actor as unknown as BackendActor,
        BigInt(limit),
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOpportunitiesByMember(memberId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CommunityOpportunity[]>({
    queryKey: ["opportunitiesByMember", memberId],
    queryFn: async () => {
      if (!actor || !memberId) return [];
      return apiGetOpportunitiesByMember(
        actor as unknown as BackendActor,
        memberId,
      );
    },
    enabled: !!actor && !isFetching && !!memberId,
  });
}

export function useCreateOpportunity() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: OpportunityInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await apiCreateOpportunity(
        actor as unknown as BackendActor,
        input,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["latestOpportunities"] });
    },
  });
}

export function useUpdateOpportunityStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: string; status: "active" | "inactive" }) => {
      if (!actor) throw new Error("Not connected");
      const result = await apiUpdateOpportunityStatus(
        actor as unknown as BackendActor,
        id,
        status,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["latestOpportunities"] });
    },
  });
}

export function useAdminFlagOpportunity() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, flagged }: { id: string; flagged: boolean }) => {
      if (!actor) throw new Error("Not connected");
      const result = await apiAdminFlagOpportunity(
        actor as unknown as BackendActor,
        id,
        flagged,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}

export function useCreateMembershipIntent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: MembershipIntentInput) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as unknown as any).createMembershipIntent(
        input,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok as MembershipIntent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipIntents"] });
      queryClient.invalidateQueries({ queryKey: ["membershipStats"] });
    },
  });
}

export function useGetMembershipIntents() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<MembershipIntent[]>({
    queryKey: ["membershipIntents"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as unknown as any).getMembershipIntents();
      return Array.isArray(result) ? result : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMembershipIntentsByTier(tier: MembershipTier) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<MembershipIntent[]>({
    queryKey: ["membershipIntentsByTier", tier],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as unknown as any).getMembershipIntentsByTier(
        tier,
      );
      return Array.isArray(result) ? result : [];
    },
    enabled: !!actor && !isFetching && !!tier,
  });
}

export function useGetMembershipIntentsByStatus(status: MembershipStatus) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<MembershipIntent[]>({
    queryKey: ["membershipIntentsByStatus", status],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (
        actor as unknown as any
      ).getMembershipIntentsByStatus(status);
      return Array.isArray(result) ? result : [];
    },
    enabled: !!actor && !isFetching && !!status,
  });
}

export function useUpdateMembershipIntentStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: string; status: MembershipStatus }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (
        actor as unknown as any
      ).updateMembershipIntentStatus(id, status);
      if ("err" in result) throw new Error(result.err);
      return result.ok as MembershipIntent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipIntents"] });
      queryClient.invalidateQueries({ queryKey: ["membershipStats"] });
    },
  });
}

export function useGetPublicSupporters() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<MembershipIntent[]>({
    queryKey: ["publicSupporters"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as unknown as any).getPublicSupporters();
      return Array.isArray(result) ? result : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMembershipStats() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<MembershipStats | null>({
    queryKey: ["membershipStats"],
    queryFn: async () => {
      if (!actor) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (
        actor as unknown as any
      ).getMembershipStats() as Promise<MembershipStats>;
    },
    enabled: !!actor && !isFetching,
  });
}
