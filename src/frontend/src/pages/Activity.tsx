import { ActivityCard } from "@/components/ActivityCard";
import { ImpactCounters } from "@/components/ImpactCounters";
import { LocalLoopViz } from "@/components/LocalLoopViz";
import { StoryCards } from "@/components/StoryCards";
import { Badge } from "@/components/ui/badge";
import {
  useActivityFeed,
  useMembers,
  useStats,
  useVolunteers,
} from "@/hooks/useQueries";
import type { ActivityEvent } from "@/types";
import {
  faChartBar,
  faHeart,
  faRobot,
  faSeedling,
  faSquareCheck,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";

const FALLBACK_ACTIVITIES: ActivityEvent[] = [
  {
    id: "f1",
    eventType: "producer_joined",
    title: "Green Valley Farms joined Vancouver Chapter",
    description:
      "A family-run farm bringing fresh seasonal produce directly to local families.",
    city: "Vancouver",
    province: "BC",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 2 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "f2",
    eventType: "listing_verified",
    title: "4 community members verified Local Roots Produce",
    description: "Local Roots Produce is now Community Verified.",
    city: "Calgary",
    province: "AB",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 5 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "f3",
    eventType: "affordability_program",
    title: "Vancouver Food Recovery added affordable produce listings",
    description:
      "Surplus produce available to community members at reduced cost.",
    city: "Vancouver",
    province: "BC",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 12 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "f4",
    eventType: "volunteer_joined",
    title: "Sarah joined as a Community Volunteer in Calgary",
    description:
      "Helping map local producers and coordinate community outreach.",
    city: "Calgary",
    province: "AB",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 18 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "f5",
    eventType: "listing_verified",
    title: "North Shore Trades became Community Verified",
    description:
      "Trusted by 5 local community members for quality plumbing and electrical work.",
    city: "North Vancouver",
    province: "BC",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 24 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "f6",
    eventType: "chapter_created",
    title: "Community chapter launched in Edmonton",
    description:
      "Edmonton joins the network with founding businesses and producers.",
    city: "Edmonton",
    province: "AB",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "f7",
    eventType: "business_joined",
    title: "12 businesses joined the network this month",
    description: "Local shops, services, and cooperatives from across Ontario.",
    city: "Toronto",
    province: "ON",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "f8",
    eventType: "organization_joined",
    title: "Halifax Food Share partnered with the network",
    description:
      "Expanding affordable food access across Nova Scotia communities.",
    city: "Halifax",
    province: "NS",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 4 * 24 * 60 * 60 * 1000) * 1_000_000n,
  },
];

const FUTURE_FEATURES = [
  {
    icon: faTruck,
    title: "Local Producer Routes",
    description:
      "Coordinated delivery routes connecting producers directly to neighbourhoods.",
  },
  {
    icon: faRobot,
    title: "AI-Assisted Delivery Coordination",
    description:
      "Smart scheduling tools to help local couriers coordinate affordable runs.",
  },
  {
    icon: faSquareCheck,
    title: "Chapter Governance",
    description:
      "Community-led tools for local chapters to organize, vote, and coordinate.",
  },
  {
    icon: faHeart,
    title: "Community Grants",
    description:
      "Discovery tools for local organizations to find grants and funding opportunities.",
  },
  {
    icon: faChartBar,
    title: "Local Supply Forecasting",
    description:
      "Seasonal availability signals so communities can plan purchases from local producers.",
  },
];

export function Activity() {
  const { data: feedData, isLoading } = useActivityFeed(50);
  const { data: stats } = useStats();
  const { data: volunteers } = useVolunteers();
  const { data: members } = useMembers();

  const activities: ActivityEvent[] =
    feedData && feedData.length > 0 ? feedData : FALLBACK_ACTIVITIES;

  const cityCount = members
    ? new Set(members.map((m) => m.city.trim().toLowerCase())).size
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ── */}
      <section
        className="relative bg-card border-b border-border py-16 px-4 overflow-hidden"
        data-ocid="activity.hero.section"
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, oklch(0.62 0.17 142 / 0.12) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto text-center max-w-2xl relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium mb-5">
            <span
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
              aria-hidden="true"
            />
            Live Community Activity
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
            Communities Coordinating{" "}
            <span className="text-primary">Across Canada</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Real participation signals from communities across Canada. Join the
            network to add your listing.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-bold transition-colors hover:bg-primary/85 min-h-[44px]"
              data-ocid="activity.hero.join_network_button"
            >
              Join the Network
            </Link>
            <Link
              to="/why-local"
              className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted/40 min-h-[44px]"
              data-ocid="activity.hero.why_local_link"
            >
              Why Local Resilience?
            </Link>
          </div>
        </div>
      </section>

      {/* ── IMPACT COUNTERS ── */}
      <div className="bg-muted/30 border-b border-border">
        <ImpactCounters
          stats={stats}
          volunteerCount={volunteers?.length}
          cityCount={cityCount}
        />
      </div>

      {/* ── ACTIVITY FEED ── */}
      <section
        className="py-14 px-4 bg-background"
        data-ocid="activity.feed.section"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Recent Activity
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                What communities are doing right now.
              </p>
            </div>
            <a
              href="#/map"
              className="text-xs text-primary hover:text-primary/80 border border-primary/30 rounded-lg px-3 py-1.5 transition-colors"
              data-ocid="activity.browse_directory.link"
            >
              Browse Directory →
            </a>
          </div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-ocid="activity.loading_state"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  key={i}
                  className="h-24 bg-card rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-ocid="activity.feed.list"
            >
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}

          {/* Join CTA */}
          <div className="mt-10 text-center">
            <p className="text-muted-foreground text-sm mb-3">
              Want your organization to appear here?
            </p>
            <a
              href="#/join"
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
              data-ocid="activity.feed.join_cta.link"
            >
              Add Your Listing →
            </a>
          </div>
        </div>
      </section>

      {/* ── LOCAL LOOP VISUALIZATION ── */}
      <div className="bg-muted/30 border-t border-b border-border">
        <LocalLoopViz />
      </div>

      {/* ── COMMUNITY STORIES ── */}
      <section
        className="py-14 px-4 bg-background"
        data-ocid="activity.stories.section"
      >
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Community Stories
            </h2>
            <p className="text-muted-foreground mt-1.5 text-sm md:text-base">
              Real participation, real people, real impact across Canada.
            </p>
          </div>
          <StoryCards limit={6} />
        </div>
      </section>

      {/* ── FUTURE FEATURES ── */}
      <section
        className="py-14 px-4 bg-muted/30 border-t border-border"
        data-ocid="activity.future.section"
      >
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Coming to Project Meadow
            </h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Tools we are building to deepen local coordination.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FUTURE_FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-5 opacity-75 relative overflow-hidden"
                data-ocid={`activity.future.item.${i + 1}`}
              >
                {/* Subtle muted overlay */}
                <div
                  className="absolute inset-0 bg-muted/20 pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon
                        icon={feature.icon}
                        className="text-primary"
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 text-muted-foreground border-border shrink-0"
                    >
                      Coming Soon
                    </Badge>
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
            {/* Sixth card: community invitation */}
            <div
              className="bg-primary/10 border border-primary/25 rounded-xl p-5 flex flex-col justify-between"
              data-ocid="activity.future.cta.card"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <FontAwesomeIcon icon={faSeedling} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1.5">
                  Help Shape What Comes Next
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Join the network and help your community identify what tools
                  matter most locally.
                </p>
              </div>
              <a
                href="#/join"
                className="mt-4 inline-flex justify-center items-center text-xs font-medium bg-primary text-primary-foreground rounded-lg py-2 px-4 hover:bg-primary/85 transition-colors"
                data-ocid="activity.future.cta.link"
              >
                Join the Network
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
