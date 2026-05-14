import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MemberRecord {
    id: string;
    region?: string;
    paymentQrImage?: string;
    latitude?: number;
    votingFrozen: boolean;
    featured: boolean;
    communityVerified: boolean;
    contactName: string;
    paymentInstructions?: string;
    province: string;
    acceptsBitcoin: boolean;
    subcategory?: string;
    communityVerificationStatus: string;
    city: string;
    ownerPrincipal?: string;
    postalCode?: string;
    socialLinks?: string;
    createdAt: Timestamp;
    acceptsCash: boolean;
    acceptsFiat: boolean;
    participantType: string;
    circularEconomyParticipant: boolean;
    businessName: string;
    description: string;
    featuredContent?: FeaturedContent;
    email?: string;
    website?: string;
    membershipStatus: ListingMembershipStatus;
    updatedAt: Timestamp;
    connectedPresence: Array<ConnectedPresenceLink>;
    longitude?: number;
    bitcoinAddress?: string;
    category: string;
    flaggedForReview: boolean;
    communityDownvotes: bigint;
    phone?: string;
    oisyWalletLink?: string;
    acceptsICP: boolean;
    icpAddress?: string;
    verificationStatus: VerificationStatus;
    communityUpvotes: bigint;
}
export type Timestamp = bigint;
export type Result_2 = {
    __kind__: "ok";
    ok: TrustSummary;
} | {
    __kind__: "err";
    err: string;
};
export interface ConnectedPresenceLink {
    url: string;
    displayLabel?: string;
    linkType: LinkType;
}
export interface CommunityOpportunity {
    id: bigint;
    status: OpportunityStatus;
    memberId?: string;
    organizationName?: string;
    title: string;
    contactLink?: string;
    province: string;
    city: string;
    createdAt: bigint;
    recurring: boolean;
    trustScore?: bigint;
    description: string;
    chapterId?: string;
    updatedAt: bigint;
    timeCommitment?: string;
    category: OpportunityCategory;
    adminFlagged?: boolean;
}
export interface VolunteerInput {
    interests: Array<string>;
    city: string;
    name: string;
    email: string;
    availability: string;
    skills: Array<string>;
}
export interface OpportunityInput {
    status: OpportunityStatus;
    memberId?: string;
    organizationName?: string;
    title: string;
    contactLink?: string;
    province: string;
    city: string;
    recurring: boolean;
    trustScore?: bigint;
    description: string;
    chapterId?: string;
    timeCommitment?: string;
    category: OpportunityCategory;
}
export type Result__1 = {
    __kind__: "ok";
    ok: MembershipIntent;
} | {
    __kind__: "err";
    err: string;
};
export interface CityStats {
    province: string;
    producerCount: bigint;
    volunteerCount: bigint;
    businessCount: bigint;
    city: string;
    memberCount: bigint;
    totalListings: bigint;
}
export interface AdminTrustQueue {
    highTrust: Array<MemberRecord>;
    pending: Array<MemberRecord>;
    flagged: Array<MemberRecord>;
}
export interface StatsRecord {
    communityMembers: bigint;
    verifiedMembers: bigint;
    byProvince: Array<[string, bigint]>;
    circularEconomy: bigint;
    organizationPartners: bigint;
    bitcoinEnabled: bigint;
    producerMembers: bigint;
    pendingMembers: bigint;
    totalMembers: bigint;
    icpEnabled: bigint;
    businessMembers: bigint;
    tradeMembers: bigint;
}
export type Result_1 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export type Result_4 = {
    __kind__: "ok";
    ok: CommunityOpportunity;
} | {
    __kind__: "err";
    err: string;
};
export interface ActivityEvent {
    id: string;
    title: string;
    province: string;
    city: string;
    description: string;
    timestamp: bigint;
    relatedListingId?: string;
    relatedChapterId?: string;
    eventType: string;
}
export interface TrustSummary {
    upvotes: bigint;
    callerVote?: VoteType;
    downvotes: bigint;
}
export interface SearchFilters {
    province?: string;
    acceptsBitcoin?: boolean;
    city?: string;
    circularEconomyParticipant?: boolean;
    category?: string;
    acceptsICP?: boolean;
    verificationStatus?: VerificationStatus;
}
export interface MembershipIntentInput {
    principal?: Principal;
    province: string;
    city: string;
    name: string;
    participantType: MemberParticipantType;
    email: string;
    displayPublicly: boolean;
    message?: string;
    membershipTier: MembershipTier;
}
export interface MemberInput {
    region?: string;
    paymentQrImage?: string;
    latitude?: number;
    contactName: string;
    paymentInstructions?: string;
    province: string;
    acceptsBitcoin: boolean;
    subcategory?: string;
    city: string;
    postalCode?: string;
    socialLinks?: string;
    acceptsCash: boolean;
    acceptsFiat: boolean;
    participantType: string;
    circularEconomyParticipant: boolean;
    businessName: string;
    description: string;
    featuredContent?: FeaturedContent;
    email?: string;
    website?: string;
    connectedPresence?: Array<ConnectedPresenceLink>;
    longitude?: number;
    bitcoinAddress?: string;
    category: string;
    phone?: string;
    oisyWalletLink?: string;
    acceptsICP: boolean;
    icpAddress?: string;
}
export interface FeaturedContent {
    title: string;
    externalLink: string;
    featuredType?: string;
    description: string;
    imageUrl?: string;
}
export interface VolunteerInterest {
    id: string;
    interests: Array<string>;
    city: string;
    name: string;
    createdAt: Timestamp;
    email: string;
    availability: string;
    skills: Array<string>;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type Result_3 = {
    __kind__: "ok";
    ok: AdminTrustQueue;
} | {
    __kind__: "err";
    err: string;
};
export interface MembershipStats {
    byTier: Array<[string, bigint]>;
    total: bigint;
    estimatedMonthlySupport: bigint;
    byStatus: Array<[string, bigint]>;
}
export interface MembershipIntent {
    id: string;
    status: MembershipStatus;
    principal?: Principal;
    province: string;
    city: string;
    name: string;
    createdAt: Timestamp;
    participantType: MemberParticipantType;
    email: string;
    displayPublicly: boolean;
    message?: string;
    membershipTier: MembershipTier;
}
export enum LinkType {
    pdf = "pdf",
    patreon = "patreon",
    linktree = "linktree",
    twitter = "twitter",
    other = "other",
    blog = "blog",
    etsy = "etsy",
    instagram = "instagram",
    substack = "substack",
    website = "website",
    shopify = "shopify",
    booking = "booking",
    calendly = "calendly",
    donation = "donation",
    store = "store",
    facebook = "facebook",
    gumroad = "gumroad",
    events = "events",
    discord = "discord",
    youtube = "youtube",
    signal = "signal",
    newsletter = "newsletter",
    telegram = "telegram"
}
export enum ListingMembershipStatus {
    supporter = "supporter",
    businessMember = "businessMember",
    free = "free",
    sponsor = "sponsor",
    producerMember = "producerMember",
    partner = "partner"
}
export enum MemberParticipantType {
    business = "business",
    organization = "organization",
    individual = "individual",
    producer = "producer"
}
export enum MembershipStatus {
    pending = "pending",
    approved = "approved",
    contacted = "contacted"
}
export enum MembershipTier {
    localProducer = "localProducer",
    builderMember = "builderMember",
    localSponsor = "localSponsor",
    verifiedBusiness = "verifiedBusiness",
    communitySupporterTier = "communitySupporterTier",
    communityPartner = "communityPartner"
}
export enum OpportunityCategory {
    creativeArts = "creativeArts",
    localFarming = "localFarming",
    other = "other",
    education = "education",
    technology = "technology",
    foodSupport = "foodSupport",
    events = "events",
    wellness = "wellness",
    cleanup = "cleanup",
    delivery = "delivery",
    youthSupport = "youthSupport",
    mentorship = "mentorship",
    volunteer = "volunteer"
}
export enum OpportunityStatus {
    active = "active",
    inactive = "inactive"
}
export enum VerificationStatus {
    verified = "verified",
    pending = "pending",
    rejected = "rejected"
}
export enum VoteType {
    upvote = "upvote",
    downvote = "downvote"
}
export interface backendInterface {
    addCommunityVote(listingId: string, voteType: VoteType): Promise<Result_1>;
    adminFlagOpportunity(id: bigint, flagged: boolean): Promise<Result>;
    approveMember(id: string): Promise<Result>;
    createMember(memberData: MemberInput): Promise<Result_1>;
    createMembershipIntent(input: MembershipIntentInput): Promise<Result__1>;
    createOpportunity(input: OpportunityInput): Promise<Result_4>;
    createVolunteer(volunteerData: VolunteerInput): Promise<Result_1>;
    deleteMember(id: string): Promise<Result>;
    featureMember(id: string, featured: boolean): Promise<Result>;
    freezeVoting(memberId: string, frozen: boolean): Promise<Result_1>;
    getActivityFeed(limit: bigint): Promise<Array<ActivityEvent>>;
    getAdminTrustQueue(): Promise<Result_3>;
    getCityStats(): Promise<Array<CityStats>>;
    getCommunityVotes(listingId: string): Promise<Result_2>;
    getLatestOpportunities(limit: bigint): Promise<Array<CommunityOpportunity>>;
    getLocalActivity(city: string, limit: bigint): Promise<Array<ActivityEvent>>;
    getMember(id: string): Promise<MemberRecord | null>;
    getMembers(searchQuery: string | null, filters: SearchFilters | null): Promise<Array<MemberRecord>>;
    getMembershipIntents(): Promise<Array<MembershipIntent>>;
    getMembershipIntentsByStatus(status: MembershipStatus): Promise<Array<MembershipIntent>>;
    getMembershipIntentsByTier(tier: MembershipTier): Promise<Array<MembershipIntent>>;
    getMembershipStats(): Promise<MembershipStats>;
    getMyVote(listingId: string): Promise<VoteType | null>;
    getOpportunities(city: string | null, category: OpportunityCategory | null, status: OpportunityStatus | null): Promise<Array<CommunityOpportunity>>;
    getOpportunitiesByMember(memberId: string): Promise<Array<CommunityOpportunity>>;
    getOpportunityById(id: bigint): Promise<CommunityOpportunity | null>;
    getPublicSupporters(): Promise<Array<MembershipIntent>>;
    getStats(): Promise<StatsRecord>;
    getVolunteers(): Promise<Array<VolunteerInterest>>;
    isAdmin(p: Principal): Promise<boolean>;
    overrideTrustStatus(memberId: string, newStatus: string): Promise<Result_1>;
    rejectMember(id: string): Promise<Result>;
    removeCommunityVote(listingId: string): Promise<Result_1>;
    updateMember(id: string, memberData: MemberInput): Promise<Result>;
    updateMembershipIntentStatus(id: string, newStatus: MembershipStatus): Promise<Result__1>;
    updateOpportunityStatus(id: bigint, status: OpportunityStatus): Promise<Result>;
}
