// Mirrors backend Motoko types from contracts

export type VerificationStatus =
  | { pending: null }
  | { verified: null }
  | { rejected: null };

export type ParticipantType =
  | "community"
  | "business"
  | "trade"
  | "producer"
  | "organization";

export type ListingMembershipStatus =
  | "free"
  | "supporter"
  | "business_member"
  | "producer_member"
  | "sponsor"
  | "partner";

export type MembershipTier =
  | "communitySupporterTier"
  | "builderMember"
  | "localSponsor"
  | "verifiedBusiness"
  | "localProducer"
  | "communityPartner";

export type MembershipStatus = "pending" | "contacted" | "approved";

export type MemberParticipantType =
  | "individual"
  | "business"
  | "producer"
  | "organization";

export interface MembershipIntent {
  id: string;
  principal: [] | [string];
  name: string;
  email: string;
  city: string;
  province: string;
  membershipTier: MembershipTier;
  participantType: MemberParticipantType;
  message: [] | [string];
  status: MembershipStatus;
  displayPublicly: boolean;
  createdAt: bigint;
}

export interface MembershipIntentInput {
  principal: [] | [string];
  name: string;
  email: string;
  city: string;
  province: string;
  membershipTier: MembershipTier;
  participantType: MemberParticipantType;
  message: [] | [string];
  displayPublicly: boolean;
}

export interface MembershipStats {
  total: bigint;
  byTier: Array<[string, bigint]>;
  byStatus: Array<[string, bigint]>;
  estimatedMonthlySupport: bigint;
}

export interface MemberRecord {
  id: string;
  participantType: string;
  businessName: string;
  contactName: string;
  category: string;
  subcategory: [] | [string];
  description: string;
  city: string;
  province: string;
  region: [] | [string];
  postalCode: [] | [string];
  latitude: [] | [number];
  longitude: [] | [number];
  website: [] | [string];
  phone: [] | [string];
  email: [] | [string];
  socialLinks: [] | [string];
  acceptsBitcoin: boolean;
  acceptsICP: boolean;
  acceptsCash: boolean;
  acceptsFiat: boolean;
  paymentInstructions: [] | [string];
  bitcoinAddress: [] | [string];
  icpAddress: [] | [string];
  oisyWalletLink: [] | [string];
  paymentQrImage: [] | [string];
  verificationStatus: VerificationStatus;
  circularEconomyParticipant: boolean;
  featured: boolean;
  ownerPrincipal: [] | [string];
  createdAt: bigint;
  updatedAt: bigint;
  // Community trust fields
  communityUpvotes: bigint;
  communityDownvotes: bigint;
  communityVerified: boolean;
  communityVerificationStatus: string; // 'pending' | 'verified' | 'under_review'
  flaggedForReview: boolean;
  votingFrozen: boolean;
  // Membership
  membershipStatus: ListingMembershipStatus;
  // Connected Presence
  connectedPresence: ConnectedPresenceLink[];
  featuredContent: FeaturedContent[];
}

export type VoteType = { upvote: null } | { downvote: null };

export interface TrustSummary {
  upvotes: bigint;
  downvotes: bigint;
  callerVote: [] | [VoteType];
}

export interface MemberInput {
  participantType: string;
  businessName: string;
  contactName: string;
  category: string;
  subcategory: [] | [string];
  description: string;
  city: string;
  province: string;
  region: [] | [string];
  postalCode: [] | [string];
  latitude: [] | [number];
  longitude: [] | [number];
  website: [] | [string];
  phone: [] | [string];
  email: [] | [string];
  socialLinks: [] | [string];
  acceptsBitcoin: boolean;
  acceptsICP: boolean;
  acceptsCash: boolean;
  acceptsFiat: boolean;
  paymentInstructions: [] | [string];
  bitcoinAddress: [] | [string];
  icpAddress: [] | [string];
  oisyWalletLink: [] | [string];
  paymentQrImage: [] | [string];
  circularEconomyParticipant: boolean;
  connectedPresence?: ConnectedPresenceLink[];
  featuredContent?: FeaturedContent;
}

export interface VolunteerInterest {
  id: string;
  name: string;
  email: string;
  city: string;
  skills: string[];
  interests: string[];
  availability: string;
  createdAt: bigint;
}

export interface VolunteerInput {
  name: string;
  email: string;
  city: string;
  skills: string[];
  interests: string[];
  availability: string;
}

export interface StatsRecord {
  totalMembers: bigint;
  verifiedMembers: bigint;
  pendingMembers: bigint;
  communityMembers: bigint;
  businessMembers: bigint;
  tradeMembers: bigint;
  producerMembers: bigint;
  organizationPartners: bigint;
  bitcoinEnabled: bigint;
  icpEnabled: bigint;
  circularEconomy: bigint;
  byProvince: Array<[string, bigint]>;
}

export const PROVINCES = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
] as const;

export const PROVINCE_NAMES: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland & Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Québec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

export const CATEGORIES = [
  "Food Producers",
  "Trades",
  "Services",
  "Goods",
  "Community",
] as const;

export const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
  "Food Producers": [
    "Farms",
    "Greenhouses",
    "Produce Boxes",
    "Dairy",
    "Meat",
    "Eggs",
    "Local Groceries",
    "Food Recovery",
  ],
  Trades: [
    "Carpentry",
    "Plumbing",
    "HVAC",
    "Electrical",
    "Construction",
    "Landscaping",
    "Welding",
  ],
  Services: [
    "Accounting",
    "Delivery",
    "Marketing",
    "Web Design",
    "Consulting",
    "Repair",
  ],
  Goods: ["Tools", "Handmade Goods", "Supplies", "Equipment"],
  Community: [
    "Non-Profits",
    "Cooperatives",
    "Unions",
    "Affordability Groups",
    "Education Organizations",
  ],
};

export type FilterState = {
  search: string;
  province: string;
  city: string;
  category: string;
  verifiedOnly: boolean;
  acceptsBitcoin: boolean;
  acceptsICP: boolean;
  circularEconomy: boolean;
};

export interface ActivityEvent {
  id: string;
  eventType: string;
  title: string;
  description: string;
  city: string;
  province: string;
  relatedListingId: string | null;
  relatedChapterId: string | null;
  timestamp: bigint;
}

export interface StoryCard {
  id: string;
  headline: string;
  city: string;
  province: string;
  summary: string;
  imageUrl: string;
  readMoreUrl: string;
}

export interface CityStats {
  city: string;
  province: string;
  memberCount: number;
  businessCount: number;
  producerCount: number;
  volunteerCount: number;
  totalListings: number;
}

// ─── Connected Presence ────────────────────────────────────────────────────
export type LinkType =
  | "website"
  | "blog"
  | "store"
  | "booking"
  | "donation"
  | "events"
  | "newsletter"
  | "youtube"
  | "instagram"
  | "twitter"
  | "facebook"
  | "etsy"
  | "shopify"
  | "gumroad"
  | "patreon"
  | "substack"
  | "calendly"
  | "telegram"
  | "discord"
  | "signal"
  | "linktree"
  | "pdf"
  | "other";

export interface ConnectedPresenceLink {
  linkType: LinkType;
  url: string;
  displayLabel: [] | [string]; // Motoko optional
}

export interface FeaturedContent {
  title: string;
  description: string;
  imageUrl: [] | [string]; // Motoko optional
  externalLink: string;
  featuredType: [] | [string]; // Motoko optional
}

// ─── Community Opportunities ────────────────────────────────────────────────

export type OpportunityCategory =
  | "volunteer"
  | "education"
  | "foodSupport"
  | "events"
  | "communityCleanup"
  | "mentorship"
  | "localFarming"
  | "deliveryHelp"
  | "wellness"
  | "youthSupport"
  | "technology"
  | "creativeArts"
  | "other";

export type OpportunityStatus = "active" | "inactive";

export interface CommunityOpportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  city: string;
  province: string;
  organizationName: [] | [string];
  memberId: [] | [string];
  timeCommitment: [] | [string];
  contactLink: [] | [string];
  recurring: boolean;
  status: OpportunityStatus;
  createdAt: bigint;
  flagged: boolean;
}

export interface OpportunityInput {
  title: string;
  description: string;
  category: OpportunityCategory;
  city: string;
  province: string;
  organizationName: [] | [string];
  memberId: [] | [string];
  timeCommitment: [] | [string];
  contactLink: [] | [string];
  recurring: boolean;
}

export const OPPORTUNITY_CATEGORIES: Record<OpportunityCategory, string> = {
  volunteer: "Volunteer",
  education: "Education",
  foodSupport: "Food Support",
  events: "Events",
  communityCleanup: "Community Cleanup",
  mentorship: "Mentorship",
  localFarming: "Local Farming",
  deliveryHelp: "Delivery Help",
  wellness: "Wellness",
  youthSupport: "Youth Support",
  technology: "Technology",
  creativeArts: "Creative Arts",
  other: "Other",
};

// Helper utilities
export function fromOptional<T>(opt: [] | [T]): T | undefined {
  return opt.length > 0 ? opt[0] : undefined;
}

export function toOptional<T>(val: T | undefined | null): [] | [T] {
  return val != null ? [val] : [];
}

export function getVerificationLabel(status: VerificationStatus): string {
  if ("pending" in status) return "Pending";
  if ("verified" in status) return "Verified";
  if ("rejected" in status) return "Rejected";
  return "Unknown";
}

export function isVerified(status: VerificationStatus): boolean {
  return "verified" in status;
}
