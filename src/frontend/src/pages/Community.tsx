import { ActivityCard } from "@/components/ActivityCard";
import {
  useActivityFeed,
  useLocalActivity,
  useStats,
} from "@/hooks/useQueries";
import type { ActivityEvent } from "@/types";
import {
  faBolt,
  faBook,
  faCheck,
  faCity,
  faHandshake,
  faRobot,
  faRocket,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import {
  CircleDollarSign,
  Globe2,
  HandHeart,
  Layers,
  MapPin,
  ShieldCheck,
  Sprout,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const CITIES = [
  "All Cities",
  "Vancouver",
  "Calgary",
  "Toronto",
  "Montreal",
  "Halifax",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
];

const HARDCODED_ACTIVITIES: ActivityEvent[] = [
  {
    id: "h1",
    eventType: "producer_joined",
    title: "Green Valley Farms joined the Vancouver Chapter",
    description:
      "Local greenhouse supplying fresh produce to families across the Lower Mainland.",
    city: "Vancouver",
    province: "BC",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 2 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "h2",
    eventType: "listing_verified",
    title: "Local Roots Produce became Community Verified",
    description:
      "4 community members confirmed this listing is a trusted local producer.",
    city: "Calgary",
    province: "AB",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 6 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "h3",
    eventType: "affordability_program",
    title: "Vancouver Food Recovery added affordable produce listings",
    description:
      "Surplus local produce now available at reduced cost to community members.",
    city: "Vancouver",
    province: "BC",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 12 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "h4",
    eventType: "volunteer_joined",
    title: "Sarah joined as a Community Volunteer in Calgary",
    description:
      "Helping connect local producers with community members in her neighbourhood.",
    city: "Calgary",
    province: "AB",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 18 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "h5",
    eventType: "listing_verified",
    title: "North Shore Trades became Community Verified",
    description:
      "Community members recognized this tradesperson as a trusted local service provider.",
    city: "Vancouver",
    province: "BC",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 24 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    id: "h6",
    eventType: "chapter_created",
    title: "Community chapter launched in Edmonton",
    description:
      "Local businesses, producers, and volunteers now coordinating across Edmonton.",
    city: "Edmonton",
    province: "AB",
    relatedListingId: null,
    relatedChapterId: null,
    timestamp: BigInt(Date.now() - 36 * 60 * 60 * 1000) * 1_000_000n,
  },
];

const VALUES = [
  {
    icon: CircleDollarSign,
    title: "Affordability",
    text: "Helping Canadians find local alternatives that keep more money in their communities.",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    icon: Sprout,
    title: "Local Resilience",
    text: "Strengthening community supply chains and reducing dependence on distant providers.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Coordination",
    text: "Connecting buyers and sellers directly, with no intermediary fees or gatekeepers.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: HandHeart,
    title: "Participation",
    text: "Everyone can contribute — from listing a business to volunteering or spreading the word.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    text: "No fund custody — we never hold or transfer money",
  },
  {
    icon: Layers,
    text: "No payment processing — members transact peer-to-peer",
  },
  {
    icon: CircleDollarSign,
    text: "No exchange mechanics — this is a directory, not a market",
  },
  {
    icon: Users,
    text: "Member responsibility — each member manages their own compliance",
  },
  {
    icon: Globe2,
    text: "Community ownership of data — built on decentralized infrastructure",
  },
  {
    icon: MapPin,
    text: "Decentralized infrastructure — powered by the Internet Computer Protocol",
  },
];

const PHASE2 = [
  {
    faIcon: faCity,
    title: "Community Chapters",
    text: "City and regional dashboards for hyper-local coordination and discovery.",
  },
  {
    faIcon: faBook,
    title: "Education Programs",
    text: "Workshops, onboarding events, and community training for local economic participation.",
  },
  {
    faIcon: faRobot,
    title: "AI Coordination Tools",
    text: "Supply matching, delivery coordination, and local demand forecasting.",
  },
];

const MOCK_STATS = [
  { label: "Network Members", value: "250+" },
  { label: "Provinces Active", value: "8" },
  { label: "Categories", value: "25" },
];

export function Community() {
  const { data: stats } = useStats();

  // City filter — persisted in URL as ?city=
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("city") ?? "All Cities";
    }
    return "All Cities";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (selectedCity && selectedCity !== "All Cities") {
      params.set("city", selectedCity);
    } else {
      params.delete("city");
    }
    const newSearch = params.toString();
    const newUrl = newSearch
      ? `${window.location.pathname}?${newSearch}${window.location.hash}`
      : `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedCity]);

  const isAllCities = selectedCity === "All Cities";
  const feedQuery = useActivityFeed(20);
  const localQuery = useLocalActivity(isAllCities ? "" : selectedCity, 20);

  const activeQuery = isAllCities ? feedQuery : localQuery;
  const isLoading = activeQuery.isLoading;
  const backendActivities: ActivityEvent[] = activeQuery.data ?? [];
  const activities =
    backendActivities.length > 0
      ? backendActivities
      : isAllCities
        ? HARDCODED_ACTIVITIES
        : HARDCODED_ACTIVITIES.filter((a) => a.city === selectedCity);

  const statsDisplay = stats
    ? [
        {
          label: "Network Members",
          value: Number(stats.totalMembers).toString(),
        },
        {
          label: "Verified Members",
          value: Number(stats.verifiedMembers).toString(),
        },
        {
          label: "Producers",
          value: Number(stats.producerMembers).toString(),
        },
        {
          label: "Bitcoin Enabled",
          value: Number(stats.bitcoinEnabled).toString(),
        },
      ]
    : MOCK_STATS;

  return (
    <div data-ocid="community.page">
      {/* Hero */}
      <section className="bg-card border-b border-border py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium mb-6">
              <FontAwesomeIcon icon={faHandshake} /> Community First
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our Community
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              A growing network of local businesses, producers, trades, and
              organizations building economic resilience across Canada.
            </p>
            <Link
              to="/activity"
              data-ocid="community.explore_activity_button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-smooth hover:bg-primary/85 shadow-soft min-h-[44px]"
            >
              Explore Local Activity <Zap size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-background border-b border-border py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            className="grid md:grid-cols-2 gap-10 items-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-medium mb-3">
                Our Mission
              </p>
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                Strengthening Local Economies Together
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Discover local businesses, producers, trades, and organizations
                participating in community-driven economic resilience.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Project Meadow is a community coordination platform, local
                business directory, and resilience network. We use modern
                decentralized infrastructure to help Canadians support local
                businesses, food systems, services, and organizations through
                community-driven participation.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "A community coordination platform connecting neighbours",
                "A local business directory — searchable and filterable",
                "A resilience network spanning farms, trades, and services",
                "A circular economy discovery tool for sustainable commerce",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-card border border-border rounded-xl px-4 py-3"
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 border-b border-border py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">
              What We Value
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four pillars that guide every decision we make.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${val.bg} flex items-center justify-center mb-4`}
                  >
                    <Icon size={20} className={val.color} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {val.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {val.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section
        className="bg-background border-b border-border py-16"
        data-ocid="community.stats_section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Growing Network
            </h2>
            <p className="text-sm text-muted-foreground">
              A movement strengthening communities across Canada.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {statsDisplay.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5 text-center"
              >
                <p className="text-3xl font-display font-bold text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Principles */}
      <section className="bg-muted/30 border-b border-border py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                What We Stand For
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our platform operates on clear principles of transparency,
                community ownership, and member responsibility.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRINCIPLES.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.text}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-4 bg-card border border-border rounded-xl px-5 py-4"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-primary" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed pt-1.5">
                      {p.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="bg-background border-b border-border py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">
              Want To Help Strengthen Your Local Community?
            </h2>
            <p className="text-muted-foreground mb-7 text-sm leading-relaxed">
              Volunteer your skills, invite local businesses, or become a
              community ambassador for your city or region.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <Link
                to="/volunteer"
                data-ocid="community.volunteer_button"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/85 transition-smooth min-h-[44px] flex items-center justify-center"
              >
                Volunteer
              </Link>
              <Link
                to="/join"
                data-ocid="community.invite_businesses_button"
                className="px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted/60 transition-smooth min-h-[44px] flex items-center justify-center"
              >
                Invite Businesses
              </Link>
              <Link
                to="/volunteer"
                data-ocid="community.ambassador_button"
                className="px-6 py-3 rounded-lg border border-primary/40 text-primary font-medium text-sm hover:bg-primary/10 transition-smooth min-h-[44px] flex items-center justify-center"
              >
                Become a Community Ambassador
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Contributions — placeholder */}
      <section className="bg-muted/30 border-b border-border py-16">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
              Community
            </p>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">
              Support Local Economic Resilience
            </h2>
            <p className="text-muted-foreground mb-7 text-sm leading-relaxed">
              Help support local onboarding, education events, food resilience
              initiatives, and community coordination across Canada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <Link
                to="/membership"
                data-ocid="community.help_build_button"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/85 transition-smooth min-h-[44px] flex items-center justify-center"
              >
                Help Build the Network
              </Link>
              <Link
                to="/map"
                data-ocid="community.explore_directory_button"
                className="px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted/60 transition-smooth min-h-[44px] flex items-center justify-center"
              >
                Explore the Directory
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Community contribution features coming soon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Recent Community Activity */}
      <section
        className="bg-background border-b border-border py-20"
        data-ocid="community.activity_section"
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-medium mb-4">
              <FontAwesomeIcon icon={faBolt} /> Live Participation
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">
              Recent Community Activity
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              See how local businesses, producers, organizations, and community
              members are participating across Canada.
            </p>
          </motion.div>

          {/* City filter */}
          <motion.div
            className="flex flex-wrap gap-2 justify-center mb-8"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            data-ocid="community.activity_city_filter"
          >
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                data-ocid={`community.city_filter.${city.toLowerCase().replace(/\s+/g, "_")}`}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-smooth min-h-[36px] ${
                  selectedCity === city
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {city}
              </button>
            ))}
          </motion.div>

          {/* Activity list */}
          <div className="space-y-3" data-ocid="community.activity_list">
            {isLoading ? (
              // Loading skeletons
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                data-ocid="community.activity_loading_state"
                className="space-y-3"
              >
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="activity-card border-l-2 border-l-border animate-pulse"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-muted shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-muted rounded w-3/4" />
                        <div className="h-2.5 bg-muted rounded w-1/2" />
                        <div className="h-2.5 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : activities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                data-ocid="community.activity_empty_state"
                className="text-center py-12"
              >
                <FontAwesomeIcon
                  icon={faSeedling}
                  className="text-3xl text-primary mb-3"
                />
                <p className="text-foreground font-medium mb-1">
                  No recent activity in {selectedCity} yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Be the first to join and help build local resilience here.
                </p>
                <Link
                  to="/join"
                  data-ocid="community.activity_join_link"
                  className="inline-flex items-center mt-4 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/85 transition-smooth"
                >
                  Join the Network
                </Link>
              </motion.div>
            ) : (
              activities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ActivityCard activity={activity} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Phase 2 preview */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium mb-4">
              <FontAwesomeIcon icon={faRocket} /> Coming Soon
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">
              What's Next for the Network
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              We're building more tools to strengthen community coordination
              across Canada.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PHASE2.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                    Soon
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <FontAwesomeIcon
                    icon={item.faIcon}
                    className="text-muted-foreground text-lg"
                  />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
