import { useOpportunities } from "@/hooks/useQueries";
import type { CommunityOpportunity, OpportunityCategory } from "@/types";
import { OPPORTUNITY_CATEGORIES, fromOptional } from "@/types";
import {
  faArrowRight,
  faBuildingUser,
  faCircleNodes,
  faClock,
  faExternalLink,
  faFilter,
  faHandsHelping,
  faLocationDot,
  faMagnifyingGlass,
  faRotate,
  faTag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

// Category icon map
const CATEGORY_ICONS: Record<OpportunityCategory, typeof faHandsHelping> = {
  volunteer: faHandsHelping,
  education: faCircleNodes,
  foodSupport: faHandsHelping,
  events: faCircleNodes,
  communityCleanup: faHandsHelping,
  mentorship: faUser,
  localFarming: faHandsHelping,
  deliveryHelp: faHandsHelping,
  wellness: faHandsHelping,
  youthSupport: faUser,
  technology: faCircleNodes,
  creativeArts: faHandsHelping,
  other: faTag,
};

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const ALL_CATEGORIES = Object.entries(OPPORTUNITY_CATEGORIES) as Array<
  [OpportunityCategory, string]
>;

// --- Seed data shown before backend is live ---
const SEED_OPPORTUNITIES: CommunityOpportunity[] = [
  {
    id: "seed-1",
    title: "Community Garden Cleanup",
    description:
      "Seeking local volunteers for monthly community garden maintenance and neighbourhood food support initiatives. All skill levels welcome.",
    category: "foodSupport",
    city: "Vancouver",
    province: "BC",
    organizationName: ["Cedar Community Garden"],
    memberId: [],
    timeCommitment: ["3–4 hrs/month"],
    contactLink: [],
    recurring: true,
    status: "active",
    createdAt: BigInt(Date.now() - 3 * 86_400_000) * BigInt(1_000_000),
    flagged: false,
  },
  {
    id: "seed-2",
    title: "Local Food Bank Delivery Help",
    description:
      "Help deliver fresh produce from local farms to families in need every Saturday morning. Vehicle access preferred but not required.",
    category: "deliveryHelp",
    city: "Toronto",
    province: "ON",
    organizationName: ["Parkdale Food Share"],
    memberId: [],
    timeCommitment: ["2–3 hrs/week"],
    contactLink: ["https://parkdalefoodshare.ca"],
    recurring: true,
    status: "active",
    createdAt: BigInt(Date.now() - 7 * 86_400_000) * BigInt(1_000_000),
    flagged: false,
  },
  {
    id: "seed-3",
    title: "Youth Digital Literacy Workshop",
    description:
      "Teach basic computer skills and online safety to youth ages 12–18 in an after-school setting. No formal teaching experience required.",
    category: "education",
    city: "Calgary",
    province: "AB",
    organizationName: ["Bow Valley Community Hub"],
    memberId: [],
    timeCommitment: ["2 hrs/week"],
    contactLink: [],
    recurring: false,
    status: "active",
    createdAt: BigInt(Date.now() - 2 * 86_400_000) * BigInt(1_000_000),
    flagged: false,
  },
  {
    id: "seed-4",
    title: "Neighbourhood Repair Café",
    description:
      "Volunteer your trades skills to help community members repair household items — electronics, clothing, furniture, bikes, and more.",
    category: "communityCleanup",
    city: "Ottawa",
    province: "ON",
    organizationName: ["Ottawa Repair Collective"],
    memberId: [],
    timeCommitment: ["1 Sunday/month"],
    contactLink: ["https://ottawarepaircafe.org"],
    recurring: true,
    status: "active",
    createdAt: BigInt(Date.now() - 5 * 86_400_000) * BigInt(1_000_000),
    flagged: false,
  },
  {
    id: "seed-5",
    title: "Small Business Mentorship Program",
    description:
      "Connect with new entrepreneurs in your community. Share your business experience, help them navigate their first year, and strengthen local commerce.",
    category: "mentorship",
    city: "Edmonton",
    province: "AB",
    organizationName: ["Edmonton Local Commerce Alliance"],
    memberId: [],
    timeCommitment: ["2 hrs/month"],
    contactLink: [],
    recurring: false,
    status: "active",
    createdAt: BigInt(Date.now() - 10 * 86_400_000) * BigInt(1_000_000),
    flagged: false,
  },
  {
    id: "seed-6",
    title: "Seasonal Farm Work Exchange",
    description:
      "Join a local farm for harvest season in exchange for fresh produce. An opportunity to learn traditional farming and support food sovereignty.",
    category: "localFarming",
    city: "Kelowna",
    province: "BC",
    organizationName: ["Okanagan Growers Collective"],
    memberId: [],
    timeCommitment: ["Flexible — 1 or more days"],
    contactLink: ["https://okanagangrowers.ca"],
    recurring: false,
    status: "active",
    createdAt: BigInt(Date.now() - 1 * 86_400_000) * BigInt(1_000_000),
    flagged: false,
  },
];

function OpportunityCard({ opp }: { opp: CommunityOpportunity }) {
  const catLabel = OPPORTUNITY_CATEGORIES[opp.category] ?? "Other";
  const catIcon = CATEGORY_ICONS[opp.category] ?? faTag;
  const orgName = fromOptional(opp.organizationName);
  const timeCommit = fromOptional(opp.timeCommitment);
  const contactLink = fromOptional(opp.contactLink);

  return (
    <article
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors group"
      data-ocid="opportunities.item"
    >
      {/* Category badge + recurring */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <FontAwesomeIcon icon={catIcon} className="text-[10px]" />
          {catLabel}
        </span>
        {opp.recurring && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
            <FontAwesomeIcon icon={faRotate} className="text-[10px]" />
            Recurring
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-foreground text-base leading-snug">
        {opp.title}
      </h3>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <FontAwesomeIcon
          icon={faLocationDot}
          className="text-primary text-[11px]"
        />
        <span>
          {opp.city}, {opp.province}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {opp.description}
      </p>

      {/* Meta row */}
      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
        {orgName && (
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={faBuildingUser}
              className="text-[11px] text-muted-foreground/70"
            />
            <span>{orgName}</span>
          </div>
        )}
        {timeCommit && (
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={faClock}
              className="text-[11px] text-muted-foreground/70"
            />
            <span>{timeCommit}</span>
          </div>
        )}
      </div>

      {/* Footer: date + link */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground/60">
          {formatRelativeTime(opp.createdAt)}
        </span>
        {contactLink ? (
          <a
            href={contactLink}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="opportunities.contact_link"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Learn More
            <FontAwesomeIcon icon={faExternalLink} className="text-[10px]" />
          </a>
        ) : (
          <span className="text-xs text-muted-foreground/40">
            Contact via profile
          </span>
        )}
      </div>
    </article>
  );
}

export function CommunityOpportunities() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const { data: liveOpps, isLoading } = useOpportunities(
    cityFilter || undefined,
    categoryFilter || undefined,
  );

  // Use live data if available, otherwise seed
  const sourceData: CommunityOpportunity[] =
    liveOpps && liveOpps.length > 0 ? liveOpps : SEED_OPPORTUNITIES;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return sourceData.filter((o) => {
      if (o.status !== "active" || o.flagged) return false;
      if (
        q &&
        !o.title.toLowerCase().includes(q) &&
        !o.description.toLowerCase().includes(q) &&
        !(fromOptional(o.organizationName) ?? "").toLowerCase().includes(q)
      )
        return false;
      if (
        cityFilter &&
        !o.city.toLowerCase().includes(cityFilter.toLowerCase())
      )
        return false;
      if (categoryFilter && o.category !== categoryFilter) return false;
      return true;
    });
  }, [sourceData, search, cityFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon
                icon={faHandsHelping}
                className="text-primary text-xl"
              />
              <span className="text-xs font-medium text-primary uppercase tracking-widest">
                Community Opportunities
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Get Involved Locally
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
              Discover ways to participate, volunteer, and connect with local
              initiatives. From farm work exchanges to neighbourhood cleanup
              crews — your community needs you.
            </p>
            <p className="text-sm text-muted-foreground/70 italic">
              Communities grow through participation. Trusted local coordination
              starts with visibility.
            </p>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="bg-muted/30 border-b border-border sticky top-[80px] z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Text search */}
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
              />
              <input
                type="text"
                placeholder="Search opportunities…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="opportunities.search_input"
                className="w-full pl-8 pr-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
              />
            </div>

            {/* City filter */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
              />
              <input
                type="text"
                placeholder="City…"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                data-ocid="opportunities.city_filter_input"
                className="w-full sm:w-36 pl-8 pr-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
              />
            </div>

            {/* Category filter */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faFilter}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                data-ocid="opportunities.category_select"
                className="w-full sm:w-48 pl-8 pr-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none min-h-[44px]"
              >
                <option value="">All Categories</option>
                {ALL_CATEGORIES.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="opportunities.loading_state"
          >
            {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((sk) => (
              <div
                key={sk}
                className="bg-card border border-border rounded-xl p-5 h-52 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="opportunities.empty_state"
          >
            <FontAwesomeIcon
              icon={faHandsHelping}
              className="text-muted-foreground/30 text-5xl mb-5"
            />
            <h3 className="font-display font-semibold text-foreground text-lg mb-2">
              No opportunities found in this area yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Communities grow as participation grows. Check back soon, or clear
              your filters to see all opportunities.
            </p>
            {(search || cityFilter || categoryFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCityFilter("");
                  setCategoryFilter("");
                }}
                data-ocid="opportunities.clear_filters_button"
                className="mt-5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-5">
              {filtered.length} opportunit
              {filtered.length === 1 ? "y" : "ies"} found
              {categoryFilter
                ? ` in ${OPPORTUNITY_CATEGORIES[categoryFilter as OpportunityCategory] ?? categoryFilter}`
                : ""}
              {cityFilter ? ` near ${cityFilter}` : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Trust disclaimer */}
      <section className="bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 py-5">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            <FontAwesomeIcon
              icon={faCircleNodes}
              className="text-muted-foreground/50 mr-1.5"
            />
            External links are provided by community members. Always exercise
            personal judgment before interacting with third-party websites or
            services.
          </p>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="max-w-xl">
            <h2 className="font-display font-semibold text-foreground text-xl mb-2">
              Are you an organization or community member?
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Log in to post opportunities for your community and connect your
              existing work into the Meadow.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/join"
                data-ocid="opportunities.join_cta_button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-smooth hover:bg-primary/80 min-h-[44px]"
              >
                Join the Network
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </Link>
              <Link
                to="/volunteer"
                data-ocid="opportunities.volunteer_link"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground transition-smooth hover:bg-muted/60 min-h-[44px]"
              >
                Volunteer Interest Form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
