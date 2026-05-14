import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicSupporters } from "@/hooks/useQueries";
import type { MembershipIntent, MembershipTier } from "@/types";
import {
  faBuilding,
  faHeart,
  faLeaf,
  faLocationDot,
  faShield,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Tier metadata ─────────────────────────────────────────────────────────

const TIER_LABELS: Record<MembershipTier, string> = {
  communitySupporterTier: "Community Supporter",
  builderMember: "Builder Member",
  localSponsor: "Local Sponsor",
  verifiedBusiness: "Verified Business",
  localProducer: "Local Producer",
  communityPartner: "Community Partner",
};

const TIER_DESCRIPTIONS: Record<MembershipTier, string> = {
  communitySupporterTier: "Supporting local chapter updates and events",
  builderMember: "Helping build the network and inviting local businesses",
  localSponsor: "Sponsoring producer onboarding and chapter growth",
  verifiedBusiness: "Verified local business participating in the network",
  localProducer: "Local food producer building community food resilience",
  communityPartner: "Community organization volunteering and collaborating",
};

type TierColor = "green" | "blue" | "amber" | "orange" | "teal" | "purple";

const TIER_COLOR: Record<MembershipTier, TierColor> = {
  communitySupporterTier: "green",
  builderMember: "blue",
  localSponsor: "amber",
  verifiedBusiness: "orange",
  localProducer: "teal",
  communityPartner: "purple",
};

const COLOR_CLASSES: Record<
  TierColor,
  { badge: string; icon: string; ring: string }
> = {
  green: {
    badge: "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40",
    icon: "bg-emerald-900/30 text-emerald-400",
    ring: "border-emerald-700/30",
  },
  blue: {
    badge: "bg-blue-900/40 text-blue-300 border border-blue-700/40",
    icon: "bg-blue-900/30 text-blue-400",
    ring: "border-blue-700/30",
  },
  amber: {
    badge: "bg-amber-900/40 text-amber-300 border border-amber-700/40",
    icon: "bg-amber-900/30 text-amber-400",
    ring: "border-amber-700/30",
  },
  orange: {
    badge: "bg-orange-900/40 text-orange-300 border border-orange-700/40",
    icon: "bg-orange-900/30 text-orange-400",
    ring: "border-orange-700/30",
  },
  teal: {
    badge: "bg-teal-900/40 text-teal-300 border border-teal-700/40",
    icon: "bg-teal-900/30 text-teal-400",
    ring: "border-teal-700/30",
  },
  purple: {
    badge: "bg-purple-900/40 text-purple-300 border border-purple-700/40",
    icon: "bg-purple-900/30 text-purple-400",
    ring: "border-purple-700/30",
  },
};

const TIER_ICONS: Record<MembershipTier, IconDefinition> = {
  communitySupporterTier: faHeart,
  builderMember: faUsers,
  localSponsor: faStar,
  verifiedBusiness: faBuilding,
  localProducer: faLeaf,
  communityPartner: faShield,
};

// ─── Filter tab definition ──────────────────────────────────────────────────

type FilterTab =
  | "all"
  | "communityMembers"
  | "sponsors"
  | "partners"
  | "businesses"
  | "producers";

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "communityMembers", label: "Community Members" },
  { id: "sponsors", label: "Sponsors" },
  { id: "partners", label: "Partners" },
  { id: "businesses", label: "Businesses" },
  { id: "producers", label: "Producers" },
];

function matchesTab(tier: MembershipTier, tab: FilterTab): boolean {
  if (tab === "all") return true;
  if (tab === "communityMembers")
    return tier === "communitySupporterTier" || tier === "builderMember";
  if (tab === "sponsors") return tier === "localSponsor";
  if (tab === "partners") return tier === "communityPartner";
  if (tab === "businesses") return tier === "verifiedBusiness";
  if (tab === "producers") return tier === "localProducer";
  return false;
}

// ─── Supporter card ─────────────────────────────────────────────────────────

function SupporterCard({
  supporter,
  index,
}: {
  supporter: MembershipIntent;
  index: number;
}) {
  const tier = supporter.membershipTier as MembershipTier;
  const tierIcon = TIER_ICONS[tier] ?? faHeart;
  const label = TIER_LABELS[tier] ?? tier;
  const description = TIER_DESCRIPTIONS[tier] ?? "";
  const color = TIER_COLOR[tier] ?? "green";
  const colors = COLOR_CLASSES[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      data-ocid={`supporters.item.${index + 1}`}
    >
      <Card
        className={`border hover:border-primary/30 transition-smooth h-full ${colors.ring}`}
      >
        <CardContent className="p-4 flex flex-col gap-3 h-full">
          {/* Top row: avatar + name/city */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colors.icon}`}
            >
              <FontAwesomeIcon icon={tierIcon} className="text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground text-sm truncate">
                {supporter.name}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                {supporter.city}, {supporter.province}
              </p>
            </div>
          </div>
          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
          {/* Tier badge */}
          <div className="mt-auto pt-1">
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}
            >
              <FontAwesomeIcon icon={tierIcon} className="text-xs" />
              {label}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Skeleton card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card className="border-border">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-5 w-1/3 rounded-full mt-1" />
      </CardContent>
    </Card>
  );
}

// ─── Stats bar ───────────────────────────────────────────────────────────────

function StatsBar({ supporters }: { supporters: MembershipIntent[] }) {
  const total = supporters.length;
  const supporters_ = supporters.filter(
    (s) =>
      s.membershipTier === "communitySupporterTier" ||
      s.membershipTier === "builderMember",
  ).length;
  const sponsors = supporters.filter(
    (s) => s.membershipTier === "localSponsor",
  ).length;
  const partners = supporters.filter(
    (s) => s.membershipTier === "communityPartner",
  ).length;
  const businesses = supporters.filter(
    (s) => s.membershipTier === "verifiedBusiness",
  ).length;
  const producers = supporters.filter(
    (s) => s.membershipTier === "localProducer",
  ).length;

  const stats = [
    { label: "Total", value: total },
    { label: "Supporters", value: supporters_ },
    { label: "Sponsors", value: sponsors },
    { label: "Partners", value: partners },
    { label: "Businesses", value: businesses },
    { label: "Producers", value: producers },
  ];

  return (
    <div className="bg-muted/30 border border-border rounded-xl px-4 py-3 flex flex-wrap gap-x-6 gap-y-2 justify-center">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className="text-base font-bold text-foreground">{s.value}</p>
          <p className="text-xs text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export function Supporters() {
  const { data: supporters, isLoading } = useGetPublicSupporters();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  const allSupporters = supporters ?? [];

  const cities = useMemo(() => {
    const set = new Set(allSupporters.map((s) => s.city).filter(Boolean));
    return Array.from(set).sort();
  }, [allSupporters]);

  const filtered = useMemo(() => {
    return allSupporters.filter((s) => {
      const tierMatch = matchesTab(
        s.membershipTier as MembershipTier,
        activeTab,
      );
      const cityMatch = cityFilter === "all" || s.city === cityFilter;
      return tierMatch && cityMatch;
    });
  }, [allSupporters, activeTab, cityFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="bg-card border-b border-border py-14 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Badge variant="secondary" className="mb-4">
              Community Supporters
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              See Who's Supporting Local
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5">
              These community members, businesses, and organizations are helping
              build local economic resilience across Canada.
            </p>
            {/* PRIMARY CTA */}
            <Link
              to="/membership"
              data-ocid="supporters.become_supporter_button"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-smooth hover:bg-primary/85 shadow-soft min-h-[44px] mb-5"
            >
              <FontAwesomeIcon icon={faHeart} className="text-sm" />
              Become a Supporter
            </Link>
            <div className="block">
              <p className="text-xs text-muted-foreground/70 border border-border/50 rounded-lg px-4 py-2 inline-block">
                Only members who opted in are shown here. Your name is private
                by default.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-10 space-y-8">
        {/* ── Stats bar ── */}
        {!isLoading && allSupporters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            data-ocid="supporters.stats_bar"
          >
            <StatsBar supporters={allSupporters} />
          </motion.div>
        )}

        {/* ── Filter tabs + city dropdown ── */}
        <div className="space-y-3">
          {/* Tabs — horizontal scroll on mobile */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
            data-ocid="supporters.filter_tabs"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                data-ocid={`supporters.tab.${tab.id}`}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* City dropdown */}
          {cities.length > 0 && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-muted-foreground text-sm shrink-0"
              />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                data-ocid="supporters.city_select"
                className="text-xs bg-muted/30 border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                <option value="all">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ── Loading state ── */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="supporters.loading_state"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : allSupporters.length === 0 ? (
          /* ── Empty state ── */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-4"
            data-ocid="supporters.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-primary text-2xl"
              />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              No public supporters yet — be the first!
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Join the network and opt in to be listed here. Help build local
              economic resilience across Canada.
            </p>
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-smooth hover:bg-primary/80"
              data-ocid="supporters.empty_state_cta"
            >
              <FontAwesomeIcon icon={faHeart} className="text-sm" />
              Join the Network
            </Link>
          </motion.div>
        ) : filtered.length === 0 ? (
          /* ── Filtered empty state ── */
          <div
            className="text-center py-16 text-muted-foreground text-sm"
            data-ocid="supporters.filtered_empty"
          >
            No supporters match these filters. Try a different tab or city.
          </div>
        ) : (
          /* ── Cards grid ── */
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="supporters.list"
          >
            {filtered.map((s, i) => (
              <SupporterCard key={s.id} supporter={s} index={i} />
            ))}
          </motion.div>
        )}

        {/* ── Bottom CTA ── */}
        {!isLoading && (
          <section className="border-t border-border pt-10 text-center bg-muted/20 rounded-xl px-6 py-8">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-primary text-xl mx-auto mb-3 block"
            />
            <h3 className="text-base font-display font-semibold text-foreground mb-2">
              Want to be listed here?
            </h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              Join membership and check the public display option to appear on
              this page.
            </p>
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-smooth hover:bg-primary/80"
              data-ocid="supporters.bottom_cta"
            >
              Help Build the Network
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
