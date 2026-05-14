import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MemberBadge } from "@/components/MemberBadge";
import { useMembers } from "@/hooks/useQueries";
import type { FilterState, MemberRecord } from "@/types";
import {
  CATEGORIES,
  CATEGORY_SUBCATEGORIES,
  PROVINCE_NAMES,
  fromOptional,
  isVerified,
} from "@/types";
import {
  faCreditCard,
  faMoneyBill,
  faRecycle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Bitcoin,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Layers,
  MapPin,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Constants ──────────────────────────────────────────────────────────────

const PROVINCE_KEYS = Object.keys(PROVINCE_NAMES);

const CATEGORY_COLORS: Record<
  string,
  { dot: string; badge: string; bg: string; label: string }
> = {
  "Food Producers": {
    dot: "bg-primary",
    badge: "bg-primary/20 text-primary border-primary/40",
    bg: "from-primary/10",
    label: "text-primary",
  },
  Trades: {
    dot: "bg-[oklch(0.65_0.18_45)]",
    badge:
      "bg-[oklch(0.65_0.18_45/0.15)] text-[oklch(0.65_0.18_45)] border-[oklch(0.65_0.18_45/0.4)]",
    bg: "from-[oklch(0.65_0.18_45/0.08)]",
    label: "text-[oklch(0.65_0.18_45)]",
  },
  Services: {
    dot: "bg-[oklch(0.60_0.15_250)]",
    badge:
      "bg-[oklch(0.60_0.15_250/0.15)] text-[oklch(0.60_0.15_250)] border-[oklch(0.60_0.15_250/0.4)]",
    bg: "from-[oklch(0.60_0.15_250/0.08)]",
    label: "text-[oklch(0.60_0.15_250)]",
  },
  Goods: {
    dot: "bg-[oklch(0.60_0.14_310)]",
    badge:
      "bg-[oklch(0.60_0.14_310/0.15)] text-[oklch(0.60_0.14_310)] border-[oklch(0.60_0.14_310/0.4)]",
    bg: "from-[oklch(0.60_0.14_310/0.08)]",
    label: "text-[oklch(0.60_0.14_310)]",
  },
  Community: {
    dot: "bg-[oklch(0.60_0.14_185)]",
    badge:
      "bg-[oklch(0.60_0.14_185/0.15)] text-[oklch(0.60_0.14_185)] border-[oklch(0.60_0.14_185/0.4)]",
    bg: "from-[oklch(0.60_0.14_185/0.08)]",
    label: "text-[oklch(0.60_0.14_185)]",
  },
};

const SAMPLE_MEMBERS: MemberRecord[] = [
  {
    id: "s1",
    participantType: "producer",
    businessName: "Maple Creek Farm",
    contactName: "Sarah Tanner",
    category: "Food Producers",
    subcategory: ["Farms"],
    description:
      "Family-run organic farm growing vegetables, herbs, and seasonal produce boxes. Available for direct pickup and local delivery in the Guelph area.",
    city: "Guelph",
    province: "ON",
    region: [],
    postalCode: [],
    latitude: [43.5488],
    longitude: [-80.2482],
    website: ["https://example.com"],
    phone: [],
    email: [],
    socialLinks: [],
    connectedPresence: [],
    featuredContent: [],
    acceptsBitcoin: true,
    acceptsICP: false,
    acceptsCash: true,
    acceptsFiat: true,
    paymentInstructions: [],
    bitcoinAddress: [],
    icpAddress: [],
    oisyWalletLink: [],
    paymentQrImage: [],
    verificationStatus: { verified: null },
    circularEconomyParticipant: true,
    featured: true,
    ownerPrincipal: [],
    createdAt: 0n,
    updatedAt: 0n,
    communityUpvotes: 0n,
    communityDownvotes: 0n,
    communityVerified: false,
    communityVerificationStatus: "pending",
    flaggedForReview: false,
    votingFrozen: false,
    membershipStatus: "free",
  },
  {
    id: "s2",
    participantType: "trade",
    businessName: "Riverside Electric Co.",
    contactName: "James Kowalski",
    category: "Trades",
    subcategory: ["Electrical"],
    description:
      "Licensed electrician serving residential and commercial clients in the GTA. 15+ years experience, fast response times.",
    city: "Toronto",
    province: "ON",
    region: [],
    postalCode: [],
    latitude: [43.7001],
    longitude: [-79.4163],
    website: [],
    phone: [],
    email: [],
    socialLinks: [],
    connectedPresence: [],
    featuredContent: [],
    acceptsBitcoin: false,
    acceptsICP: true,
    acceptsCash: true,
    acceptsFiat: true,
    paymentInstructions: [],
    bitcoinAddress: [],
    icpAddress: [],
    oisyWalletLink: [],
    paymentQrImage: [],
    verificationStatus: { verified: null },
    circularEconomyParticipant: false,
    featured: false,
    ownerPrincipal: [],
    createdAt: 0n,
    updatedAt: 0n,
    communityUpvotes: 0n,
    communityDownvotes: 0n,
    communityVerified: false,
    communityVerificationStatus: "pending",
    flaggedForReview: false,
    votingFrozen: false,
    membershipStatus: "free",
  },
  {
    id: "s3",
    participantType: "organization",
    businessName: "Vancouver Food Recovery Coop",
    contactName: "Priya Mehta",
    category: "Community",
    subcategory: ["Cooperatives"],
    description:
      "Redistributing surplus food to reduce waste and support community members in need across Metro Vancouver.",
    city: "Vancouver",
    province: "BC",
    region: [],
    postalCode: [],
    latitude: [49.2827],
    longitude: [-123.1207],
    website: ["https://example.com"],
    phone: [],
    email: [],
    socialLinks: [],
    connectedPresence: [],
    featuredContent: [],
    acceptsBitcoin: false,
    acceptsICP: false,
    acceptsCash: true,
    acceptsFiat: true,
    paymentInstructions: [],
    bitcoinAddress: [],
    icpAddress: [],
    oisyWalletLink: [],
    paymentQrImage: [],
    verificationStatus: { pending: null },
    circularEconomyParticipant: true,
    featured: false,
    ownerPrincipal: [],
    createdAt: 0n,
    updatedAt: 0n,
    communityUpvotes: 0n,
    communityDownvotes: 0n,
    communityVerified: false,
    communityVerificationStatus: "pending",
    flaggedForReview: false,
    votingFrozen: false,
    membershipStatus: "free",
  },
  {
    id: "s4",
    participantType: "business",
    businessName: "Prairie Wind Bakery",
    contactName: "Lena Schmidt",
    category: "Food Producers",
    subcategory: ["Local Groceries"],
    description:
      "Artisan sourdough and heritage grain breads baked fresh daily. Uses locally-sourced grains from Saskatchewan farms.",
    city: "Saskatoon",
    province: "SK",
    region: [],
    postalCode: [],
    latitude: [52.1332],
    longitude: [-106.67],
    website: [],
    phone: [],
    email: [],
    socialLinks: [],
    connectedPresence: [],
    featuredContent: [],
    acceptsBitcoin: true,
    acceptsICP: true,
    acceptsCash: true,
    acceptsFiat: true,
    paymentInstructions: [],
    bitcoinAddress: [],
    icpAddress: [],
    oisyWalletLink: [],
    paymentQrImage: [],
    verificationStatus: { verified: null },
    circularEconomyParticipant: true,
    featured: true,
    ownerPrincipal: [],
    createdAt: 0n,
    updatedAt: 0n,
    communityUpvotes: 0n,
    communityDownvotes: 0n,
    communityVerified: false,
    communityVerificationStatus: "pending",
    flaggedForReview: false,
    votingFrozen: false,
    membershipStatus: "free",
  },
  {
    id: "s5",
    participantType: "trade",
    businessName: "Northern Plumbing Services",
    contactName: "Andre Bouchard",
    category: "Trades",
    subcategory: ["Plumbing"],
    description:
      "Experienced plumber offering residential repairs, new installs, and emergency services throughout Calgary and area.",
    city: "Calgary",
    province: "AB",
    region: [],
    postalCode: [],
    latitude: [51.0447],
    longitude: [-114.0719],
    website: [],
    phone: [],
    email: [],
    socialLinks: [],
    connectedPresence: [],
    featuredContent: [],
    acceptsBitcoin: false,
    acceptsICP: false,
    acceptsCash: true,
    acceptsFiat: true,
    paymentInstructions: [],
    bitcoinAddress: [],
    icpAddress: [],
    oisyWalletLink: [],
    paymentQrImage: [],
    verificationStatus: { pending: null },
    circularEconomyParticipant: false,
    featured: false,
    ownerPrincipal: [],
    createdAt: 0n,
    updatedAt: 0n,
    communityUpvotes: 0n,
    communityDownvotes: 0n,
    communityVerified: false,
    communityVerificationStatus: "pending",
    flaggedForReview: false,
    votingFrozen: false,
    membershipStatus: "free",
  },
  {
    id: "s6",
    participantType: "community",
    businessName: "Halifax Affordability Alliance",
    contactName: "Monica Fraser",
    category: "Community",
    subcategory: ["Affordability Groups"],
    description:
      "Connecting Halifax residents with affordable services, community resources, and mutual aid networks.",
    city: "Halifax",
    province: "NS",
    region: [],
    postalCode: [],
    latitude: [44.6488],
    longitude: [-63.5752],
    website: ["https://example.com"],
    phone: [],
    email: [],
    socialLinks: [],
    connectedPresence: [],
    featuredContent: [],
    acceptsBitcoin: false,
    acceptsICP: false,
    acceptsCash: true,
    acceptsFiat: true,
    paymentInstructions: [],
    bitcoinAddress: [],
    icpAddress: [],
    oisyWalletLink: [],
    paymentQrImage: [],
    verificationStatus: { verified: null },
    circularEconomyParticipant: false,
    featured: false,
    ownerPrincipal: [],
    createdAt: 0n,
    updatedAt: 0n,
    communityUpvotes: 0n,
    communityDownvotes: 0n,
    communityVerified: false,
    communityVerificationStatus: "pending",
    flaggedForReview: false,
    votingFrozen: false,
    membershipStatus: "free",
  },
  {
    id: "s7",
    participantType: "business",
    businessName: "Montréal Tech Repair",
    contactName: "Claire Dubois",
    category: "Services",
    subcategory: ["Repair"],
    description:
      "Affordable phone, laptop, and appliance repair services. Committed to reducing e-waste through repair over replacement.",
    city: "Montréal",
    province: "QC",
    region: [],
    postalCode: [],
    latitude: [45.5017],
    longitude: [-73.5673],
    website: ["https://example.com"],
    phone: [],
    email: [],
    socialLinks: [],
    connectedPresence: [],
    featuredContent: [],
    acceptsBitcoin: true,
    acceptsICP: false,
    acceptsCash: true,
    acceptsFiat: true,
    paymentInstructions: [],
    bitcoinAddress: [],
    icpAddress: [],
    oisyWalletLink: [],
    paymentQrImage: [],
    verificationStatus: { verified: null },
    circularEconomyParticipant: true,
    featured: false,
    ownerPrincipal: [],
    createdAt: 0n,
    updatedAt: 0n,
    communityUpvotes: 0n,
    communityDownvotes: 0n,
    communityVerified: false,
    communityVerificationStatus: "pending",
    flaggedForReview: false,
    votingFrozen: false,
    membershipStatus: "free",
  },
  {
    id: "s8",
    participantType: "business",
    businessName: "Okanagan Tools Collective",
    contactName: "Tom Rivers",
    category: "Goods",
    subcategory: ["Tools"],
    description:
      "Tool lending library and collective ownership program for the Okanagan Valley. Reduce, share, build together.",
    city: "Kelowna",
    province: "BC",
    region: [],
    postalCode: [],
    latitude: [49.888],
    longitude: [-119.496],
    website: [],
    phone: [],
    email: [],
    socialLinks: [],
    connectedPresence: [],
    featuredContent: [],
    acceptsBitcoin: false,
    acceptsICP: true,
    acceptsCash: true,
    acceptsFiat: true,
    paymentInstructions: [],
    bitcoinAddress: [],
    icpAddress: [],
    oisyWalletLink: [],
    paymentQrImage: [],
    verificationStatus: { verified: null },
    circularEconomyParticipant: true,
    featured: false,
    ownerPrincipal: [],
    createdAt: 0n,
    updatedAt: 0n,
    communityUpvotes: 0n,
    communityDownvotes: 0n,
    communityVerified: false,
    communityVerificationStatus: "pending",
    flaggedForReview: false,
    votingFrozen: false,
    membershipStatus: "free",
  },
  {
    id: "s9",
    participantType: "producer",
    businessName: "Ottawa Valley Honey",
    contactName: "Brigitte Fontaine",
    category: "Food Producers",
    subcategory: ["Farms"],
    description:
      "Regenerative beekeeping and local raw honey production in the Ottawa Valley. Supporting pollinators and local food systems.",
    city: "Ottawa",
    province: "ON",
    region: [],
    postalCode: [],
    latitude: [45.4215],
    longitude: [-75.6972],
    website: ["https://example.com"],
    phone: [],
    email: [],
    socialLinks: [],
    connectedPresence: [],
    featuredContent: [],
    acceptsBitcoin: false,
    acceptsICP: false,
    acceptsCash: true,
    acceptsFiat: true,
    paymentInstructions: [],
    bitcoinAddress: [],
    icpAddress: [],
    oisyWalletLink: [],
    paymentQrImage: [],
    verificationStatus: { verified: null },
    circularEconomyParticipant: true,
    featured: false,
    ownerPrincipal: [],
    createdAt: 0n,
    updatedAt: 0n,
    communityUpvotes: 5n,
    communityDownvotes: 0n,
    communityVerified: true,
    communityVerificationStatus: "verified",
    flaggedForReview: false,
    votingFrozen: false,
    membershipStatus: "free",
  },
];

function applyLocalFilters(
  members: MemberRecord[],
  filters: FilterState,
): MemberRecord[] {
  return members.filter((m) => {
    if (filters.province && m.province !== filters.province) return false;
    if (
      filters.city &&
      !m.city.toLowerCase().includes(filters.city.toLowerCase())
    )
      return false;
    if (filters.category && m.category !== filters.category) return false;
    if (filters.verifiedOnly && !isVerified(m.verificationStatus)) return false;
    if (filters.acceptsBitcoin && !m.acceptsBitcoin) return false;
    if (filters.acceptsICP && !m.acceptsICP) return false;
    if (filters.circularEconomy && !m.circularEconomyParticipant) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        m.businessName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.province.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

// ─── Preview Panel ───────────────────────────────────────────────────────────

function PreviewPanel({
  member,
  onClose,
}: {
  member: MemberRecord;
  onClose: () => void;
}) {
  const colors = CATEGORY_COLORS[member.category];
  const website = fromOptional(member.website);

  return (
    <div
      data-ocid="map.preview_panel"
      className="absolute inset-y-0 right-0 w-full sm:w-96 z-20 bg-card border-l border-border shadow-lifted flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-4 h-4 rounded-full flex-shrink-0 ${colors?.dot ?? "bg-muted-foreground"}`}
          />
          <div className="min-w-0">
            <h3 className="font-display font-bold text-foreground text-base truncate">
              {member.businessName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {member.city},{" "}
              {PROVINCE_NAMES[member.province] ?? member.province}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          data-ocid="map.preview_close_button"
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors flex-shrink-0"
          aria-label="Close preview"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Category badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            colors?.badge ?? "bg-muted text-muted-foreground border-border"
          }`}
        >
          {member.category}
        </span>

        {/* Status badges */}
        <div className="flex flex-wrap gap-1.5">
          {isVerified(member.verificationStatus) && (
            <MemberBadge variant="verified" />
          )}
          {member.featured && <MemberBadge variant="featured" />}
          {member.circularEconomyParticipant && (
            <MemberBadge variant="circular" />
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {member.description}
          </p>
        </div>

        {/* Payment methods */}
        <div className="rounded-lg bg-muted/40 border border-border p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Accepted Payments
          </p>
          <div className="flex flex-wrap gap-1.5">
            {member.acceptsCash && (
              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faMoneyBill} className="text-xs" /> Cash
              </span>
            )}
            {member.acceptsFiat && (
              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faCreditCard} className="text-xs" />{" "}
                Card/E-transfer
              </span>
            )}
            {member.acceptsBitcoin && (
              <span className="text-xs px-2 py-0.5 rounded bg-[oklch(0.65_0.18_45/0.15)] text-[oklch(0.65_0.18_45)] border border-[oklch(0.65_0.18_45/0.4)]">
                ₿ Bitcoin
              </span>
            )}
            {member.acceptsICP && (
              <span className="text-xs px-2 py-0.5 rounded bg-[oklch(0.60_0.12_270/0.15)] text-[oklch(0.60_0.12_270)] border border-[oklch(0.60_0.12_270/0.4)]">
                ∞ ICP
              </span>
            )}
          </div>
        </div>

        {/* Website */}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink size={13} />
            Visit Website
          </a>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground/70 italic border-t border-border pt-3">
          Members are responsible for their own payments, records, taxes, and
          compliance.
        </p>
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-border">
        <Link
          to="/member/$id"
          params={{ id: member.id }}
          data-ocid="map.view_full_profile_link"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
}

// ─── Member Card ────────────────────────────────────────────────────────────

function MemberCard({
  member,
  index,
  isSelected,
  onClick,
}: {
  member: MemberRecord;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const colors = CATEGORY_COLORS[member.category];

  return (
    <button
      type="button"
      data-ocid={`map.member_card.${index}`}
      onClick={onClick}
      className={`text-left w-full bg-card border rounded-xl overflow-hidden transition-smooth hover:shadow-lifted group ${
        isSelected
          ? "border-primary shadow-soft ring-1 ring-primary/30"
          : "border-border hover:border-primary/40"
      }`}
    >
      {/* Category accent strip */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${colors?.bg ?? "from-muted"} to-transparent`}
      />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Color dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${colors?.dot ?? "bg-muted-foreground"}`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display font-semibold text-foreground text-sm leading-snug truncate">
                {member.businessName}
              </p>
              {isVerified(member.verificationStatus) && (
                <CheckCircle2
                  size={14}
                  className="text-primary flex-shrink-0 mt-0.5"
                  aria-label="Verified"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {member.city},{" "}
              {PROVINCE_NAMES[member.province] ?? member.province}
            </p>
          </div>
        </div>

        {/* Category chip */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
              colors?.badge ?? "bg-muted text-muted-foreground border-border"
            }`}
          >
            {member.category}
          </span>
          {member.acceptsBitcoin && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[oklch(0.65_0.18_45/0.15)] text-[oklch(0.65_0.18_45)] border border-[oklch(0.65_0.18_45/0.3)]">
              ₿
            </span>
          )}
          {member.acceptsICP && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[oklch(0.60_0.12_270/0.15)] text-[oklch(0.60_0.12_270)] border border-[oklch(0.60_0.12_270/0.3)]">
              ∞
            </span>
          )}
          {member.circularEconomyParticipant && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 inline-flex items-center">
              <FontAwesomeIcon icon={faRecycle} className="text-xs" />
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {member.description}
        </p>

        {/* View Profile CTA */}
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
          <span>View Profile</span>
          <ChevronDown size={11} className="-rotate-90" />
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const EMPTY_FILTERS: FilterState = {
  search: "",
  province: "",
  city: "",
  category: "",
  verifiedOnly: false,
  acceptsBitcoin: false,
  acceptsICP: false,
  circularEconomy: false,
};

export function MapDirectory() {
  const { data: liveMembers, isLoading } = useMembers();
  const allMembers =
    liveMembers && liveMembers.length > 0 ? liveMembers : SAMPLE_MEMBERS;

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [selected, setSelected] = useState<MemberRecord | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchInput, setSearchInput] = useState("");

  // Debounce search
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchInput]);

  const filtered = useMemo(
    () => applyLocalFilters(allMembers, filters),
    [allMembers, filters],
  );

  function setFilter<K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
  }

  const hasActiveFilters =
    filters.province ||
    filters.city ||
    filters.category ||
    filters.verifiedOnly ||
    filters.acceptsBitcoin ||
    filters.acceptsICP ||
    filters.circularEconomy ||
    filters.search;

  // ─── Sidebar content (shared between desktop + mobile drawer) ────────────
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-primary" />
          <h2 className="font-display font-bold text-foreground text-sm">
            Find Local Members
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowMobileSidebar(false)}
          className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Close filters"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search name, description, city…"
            value={searchInput}
            data-ocid="map.search_input"
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-card border border-input rounded-lg text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Province */}
        <div>
          <label
            htmlFor="map-province"
            className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
          >
            Province / Territory
          </label>
          <select
            id="map-province"
            value={filters.province}
            data-ocid="map.province_select"
            onChange={(e) => setFilter("province", e.target.value)}
            className="w-full py-2.5 px-3 text-sm bg-card border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors appearance-none cursor-pointer"
          >
            <option value="">All provinces & territories</option>
            {PROVINCE_KEYS.map((code) => (
              <option key={code} value={code}>
                {PROVINCE_NAMES[code]}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="map-city"
            className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
          >
            City
          </label>
          <input
            id="map-city"
            type="text"
            placeholder="Any city or town"
            value={filters.city}
            data-ocid="map.city_input"
            onChange={(e) => setFilter("city", e.target.value)}
            className="w-full py-2.5 px-3 text-sm bg-card border border-input rounded-lg text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
        </div>

        {/* Category with subcategory chips */}
        <div>
          <p className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Category
          </p>
          <div className="space-y-1">
            {/* All option */}
            <button
              type="button"
              data-ocid="map.category_all"
              onClick={() => {
                setFilter("category", "");
                setExpandedCategory(null);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !filters.category
                  ? "bg-primary/15 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted/60"
              }`}
            >
              All categories
            </button>

            {CATEGORIES.map((cat) => {
              const colors = CATEGORY_COLORS[cat];
              const isSelected = filters.category === cat;
              const isExpanded = expandedCategory === cat;
              const subcats = CATEGORY_SUBCATEGORIES[cat] ?? [];

              return (
                <div key={cat}>
                  <button
                    type="button"
                    data-ocid={`map.category_${cat.toLowerCase().replace(/ /g, "_")}`}
                    onClick={() => {
                      setFilter("category", isSelected ? "" : cat);
                      setExpandedCategory(
                        isExpanded || isSelected ? null : cat,
                      );
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? `bg-muted/60 font-semibold ${colors?.label}`
                        : "text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${colors?.dot ?? "bg-muted-foreground"}`}
                      />
                      <span>{cat}</span>
                    </div>
                    <ChevronDown
                      size={13}
                      className={`transition-transform text-muted-foreground ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Subcategory chips */}
                  {(isSelected || isExpanded) && (
                    <div className="mt-1 ml-3 pl-2 border-l border-border flex flex-wrap gap-1.5 pb-1">
                      {subcats.map((sub) => (
                        <span
                          key={sub}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div>
          <p className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Filters
          </p>
          <div className="space-y-2">
            {(
              [
                {
                  key: "verifiedOnly" as const,
                  label: "Verified members only",
                  ocid: "map.verified_toggle",
                },
                {
                  key: "acceptsBitcoin" as const,
                  label: "Accepts Bitcoin",
                  ocid: "map.bitcoin_toggle",
                },
                {
                  key: "acceptsICP" as const,
                  label: "Accepts ICP",
                  ocid: "map.icp_toggle",
                },
                {
                  key: "circularEconomy" as const,
                  label: "Circular economy participant",
                  ocid: "map.circular_toggle",
                },
              ] as const
            ).map(({ key, label, ocid }) => (
              <label
                key={key}
                className="flex items-center gap-2.5 cursor-pointer group py-1"
              >
                <input
                  type="checkbox"
                  data-ocid={ocid}
                  checked={filters[key]}
                  onChange={(e) => setFilter(key, e.target.checked)}
                  className="w-4 h-4 rounded border-input accent-primary flex-shrink-0"
                />
                <span className="text-sm text-foreground group-hover:text-foreground/80 transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset */}
        {hasActiveFilters ? (
          <button
            type="button"
            data-ocid="map.reset_filters_button"
            onClick={resetFilters}
            className="w-full py-2 text-xs font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted/60 hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCcw size={12} />
            Reset All Filters
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <div
      data-ocid="map.page"
      className="flex h-[calc(100vh-4rem)] overflow-hidden relative"
    >
      {/* ─── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-80 flex-shrink-0 bg-card border-r border-border flex-col">
        {sidebarContent}
      </aside>

      {/* ─── Mobile Sidebar Drawer ──────────────────────────────────────── */}
      {showMobileSidebar && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden"
            onClick={() => setShowMobileSidebar(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowMobileSidebar(false);
            }}
            role="button"
            tabIndex={-1}
            aria-label="Close filters"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border flex flex-col md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile top bar */}
        <div className="md:hidden px-3 py-2.5 border-b border-border bg-card flex items-center gap-3">
          <button
            type="button"
            data-ocid="map.open_filters_button"
            onClick={() => setShowMobileSidebar(true)}
            className="flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted/60 transition-colors"
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
          <div className="flex-1 relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search…"
              value={searchInput}
              data-ocid="map.mobile_search_input"
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-card border border-input rounded-lg text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Page description + primary CTA */}
        <div className="px-4 py-3 border-b border-border bg-card flex items-center justify-between gap-3 flex-shrink-0">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground leading-snug truncate">
              Find local businesses, food producers, tradespeople, and community
              organizations across Canada.
            </p>
          </div>
          <button
            type="button"
            data-ocid="map.search_primary_cta"
            onClick={() => {
              const el = document.querySelector<HTMLInputElement>(
                '[data-ocid="map.search_input"], [data-ocid="map.mobile_search_input"]',
              );
              el?.focus();
            }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold transition-smooth hover:bg-primary/85 min-h-[36px]"
          >
            <Search size={12} /> Search Local Listings
          </button>
        </div>

        {/* Results header */}
        <div className="px-4 py-2.5 border-b border-border bg-muted/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-muted-foreground" />
            {isLoading ? (
              <span className="text-xs text-muted-foreground">Loading…</span>
            ) : (
              <span className="text-xs text-muted-foreground">
                <span className="text-foreground font-semibold">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "member" : "members"} found
                {allMembers.length !== filtered.length
                  ? ` of ${allMembers.length} total`
                  : ""}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Simulated map · geo features coming soon
          </span>
        </div>

        {/* Grid area */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div
              data-ocid="map.loading_state"
              className="flex items-center justify-center h-full"
            >
              <div className="text-center">
                <LoadingSpinner className="mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Loading members…
                </p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div data-ocid="map.empty_state">
              <EmptyState
                icon={<MapPin size={40} />}
                headline="No members match your filters"
                description="Try adjusting your search terms or clearing some filters to discover local members."
                action={
                  <button
                    type="button"
                    data-ocid="map.empty_reset_button"
                    onClick={resetFilters}
                    className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                }
              />
            </div>
          ) : (
            <div
              className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-min"
              data-ocid="map.results_list"
            >
              {filtered.map((member, i) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={i + 1}
                  isSelected={selected?.id === member.id}
                  onClick={() =>
                    setSelected(selected?.id === member.id ? null : member)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Preview Panel ──────────────────────────────────────────────── */}
      {selected && (
        <PreviewPanel member={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
