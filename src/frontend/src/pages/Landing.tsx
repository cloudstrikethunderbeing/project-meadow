import { createActor } from "@/backend";
import { ImpactCounters } from "@/components/ImpactCounters";
import { LocalLoopViz } from "@/components/LocalLoopViz";
import { StoryCards } from "@/components/StoryCards";
import {
  useGetCityStats,
  useMembers,
  useStats,
  useVolunteers,
} from "@/hooks/useQueries";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  faBookOpen,
  faFlask,
  faFolderOpen,
  faHandPaper,
  faHandshake,
  faHeart,
  faHouseChimney,
  faMapMarkerAlt,
  faPeopleGroup,
  faSeedling,
  faStore,
  faWheatAlt,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Building2,
  HandHeart,
  Layers,
  MapPin,
  QrCode,
  Search,
  Users,
  Wheat,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";

const PARTICIPATION_CARDS = [
  {
    icon: Users,
    title: "Support Local Communities",
    text: "Discover and support local businesses, producers, and organizations.",
    cta: "Join Community",
    to: "/join?type=community",
    ocid: "landing.join_community_button",
    accent: "border-primary/30 hover:border-primary/60",
    iconColor: "text-primary",
    iconBg: "bg-primary/15",
    glowClass: "hover:glow-accent",
  },
  {
    icon: Building2,
    title: "List Your Business",
    text: "Reach local customers and participate in community commerce.",
    cta: "List Business",
    to: "/join?type=business",
    ocid: "landing.list_business_button",
    accent: "border-primary/30 hover:border-primary/60",
    iconColor: "text-primary",
    iconBg: "bg-primary/15",
    glowClass: "hover:glow-accent",
  },
  {
    icon: Wrench,
    title: "Offer Your Services",
    text: "Connect directly with local homeowners and businesses.",
    cta: "Join as Tradesperson",
    to: "/join?type=trade",
    ocid: "landing.join_trade_button",
    accent: "border-secondary/30 hover:border-secondary/60",
    iconColor: "text-secondary-foreground",
    iconBg: "bg-secondary/30",
    glowClass: "",
  },
  {
    icon: Wheat,
    title: "Sell Local Food",
    text: "Connect farms, greenhouses, and producers directly with communities.",
    cta: "Join as Producer",
    to: "/join?type=producer",
    ocid: "landing.join_producer_button",
    accent: "border-primary/30 hover:border-primary/60",
    iconColor: "text-primary",
    iconBg: "bg-primary/15",
    glowClass: "hover:glow-accent",
  },
  {
    icon: HandHeart,
    title: "Partner With The Network",
    text: "Collaborate as a non-profit, cooperative, union, or community initiative.",
    cta: "Become a Partner",
    to: "/join?type=organization",
    ocid: "landing.become_partner_button",
    accent: "border-accent/30 hover:border-accent/60",
    iconColor: "text-accent",
    iconBg: "bg-accent/15",
    glowClass: "hover:glow-accent",
  },
];

const TRUST_CHIPS = [
  "Local producers",
  "Trades & services",
  "Community organizations",
  "Optional Bitcoin & ICP support",
  "No custody",
];

const MISSION_PILLARS = [
  {
    icon: faStore,
    title: "Discover Trusted Local Businesses",
    text: "Find vetted local businesses, shops, and services building resilience in your community.",
  },
  {
    icon: faWheatAlt,
    title: "Strengthen Food Systems",
    text: "Connect with farms, greenhouses, and producers supplying fresh food directly.",
  },
  {
    icon: faWrench,
    title: "Support Local Trades & Services",
    text: "Reach tradespeople and service providers keeping communities self-sufficient.",
  },
  {
    icon: faFolderOpen,
    title: "Improve Local Coordination",
    text: "Help communities organize, communicate, and collaborate more effectively.",
  },
  {
    icon: faHandPaper,
    title: "Encourage Community Participation",
    text: "Enable everyone — residents, businesses, volunteers — to take an active role.",
  },
  {
    icon: faFlask,
    title: "Modern Infrastructure Tools",
    text: "Explore decentralized coordination tools responsibly, in service of community goals.",
  },
];

const CONTRIBUTION_USES = [
  { icon: faSeedling, label: "Sponsor local producer onboarding" },
  { icon: faBookOpen, label: "Support community workshops" },
  { icon: faHouseChimney, label: "Fund affordability initiatives" },
  { icon: faHandshake, label: "Support local chapter events" },
  { icon: faHeart, label: "Help nonprofits participate" },
];

const PHASE2_ITEMS = [
  {
    icon: Bot,
    label: "AI Coordination Tools",
    desc: "Supply matching & demand forecasting",
  },
  {
    icon: QrCode,
    label: "QR Payment Display",
    desc: "Bitcoin, ICP & OISY wallet support",
  },
  {
    icon: Layers,
    label: "Community Chapters",
    desc: "City & regional dashboards",
  },
  {
    icon: BookOpen,
    label: "Education Programs",
    desc: "Workshops & community training",
  },
  {
    icon: HandHeart,
    label: "Community Contributions",
    desc: "Local sponsorships & initiatives",
  },
];

interface CommunityOpportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  province: string;
  status: string;
  createdAt: bigint;
}

function useLatestOpportunities(limit: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CommunityOpportunity[]>({
    queryKey: ["latestOpportunities", limit],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as unknown as any).getLatestOpportunities(
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

function OpportunitiesPreview() {
  const { data: opportunities = [] } = useLatestOpportunities(6);

  if (opportunities.length === 0) {
    return (
      <div
        className="text-center py-4"
        data-ocid="landing.opportunities_empty_state"
      >
        <p className="text-sm text-muted-foreground italic">
          Local coordination opportunities will appear here as organizations
          post them.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible scrollbar-none"
      data-ocid="landing.opportunities_list"
    >
      {opportunities.map((opp, i) => (
        <Link
          key={opp.id}
          to="/community-opportunities"
          data-ocid={`landing.opportunity_card.${i + 1}`}
          className="flex-shrink-0 w-64 md:w-auto bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-smooth block group"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold truncate max-w-[120px]">
              {opp.category}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {opp.city}, {opp.province}
            </span>
          </div>
          <h4 className="font-display font-semibold text-foreground text-sm mb-1 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {opp.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {opp.description}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function Landing() {
  const { data: stats } = useStats();
  const { data: volunteers } = useVolunteers();
  const { data: members } = useMembers();
  const { data: cityStats = [] } = useGetCityStats();

  const topCities = [...cityStats]
    .sort((a, b) =>
      a.totalListings < b.totalListings
        ? 1
        : a.totalListings > b.totalListings
          ? -1
          : 0,
    )
    .slice(0, 4);

  const cityCount = members
    ? new Set(members.map((m) => m.city.trim().toLowerCase()).filter(Boolean))
        .size
    : 0;

  return (
    <div data-ocid="landing.page">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-community.dim_1400x700.jpg')",
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5 pointer-events-none" />

        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-6 shadow-sm">
              <MapPin size={12} />
              Strengthening Local Economies Together
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Find Local Goods,{" "}
              <span className="text-primary">Services &amp; Producers</span>{" "}
              Near You
            </h1>
            <p className="text-lg font-medium text-foreground/90 leading-relaxed mb-10 max-w-2xl mx-auto drop-shadow-sm">
              Connecting communities, businesses, food producers, trades, and
              organizations building local economic resilience across Canada.
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 mb-8">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="hero-search"
                  type="text"
                  placeholder="Search farms, food, trades, services…"
                  data-ocid="landing.search_input"
                  className="w-full pl-9 pr-4 py-3 rounded-lg bg-card/80 backdrop-blur-sm border border-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
                />
              </div>
              <input
                id="hero-location"
                type="text"
                placeholder="City, province, or region"
                data-ocid="landing.location_input"
                className="sm:w-48 px-4 py-3 rounded-lg bg-card/80 backdrop-blur-sm border border-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
              />
            </div>

            {/* PRIMARY CTA — ONE per page */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                to="/map"
                data-ocid="landing.explore_map_button"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-base transition-smooth hover:bg-primary/85 shadow-soft min-h-[48px]"
              >
                <MapPin size={18} /> Explore Local Network
              </Link>
              <Link
                to="/join"
                data-ocid="landing.join_network_button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-card/60 backdrop-blur-sm text-foreground font-semibold text-sm transition-smooth hover:bg-card min-h-[44px]"
              >
                Join the Network <ArrowRight size={16} />
              </Link>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {TRUST_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-border/60 text-xs text-foreground/80"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How Local Economic Loops Work — directly below hero */}
      <section
        className="bg-card border-t border-b border-border"
        data-ocid="landing.local_loop_section"
      >
        <div className="container mx-auto px-4 pt-14 pb-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              How Local Economic Loops Work
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-2">
              When communities buy, trade, and support local businesses and
              services directly, more value stays inside the community instead
              of constantly leaving it.
            </p>
            <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto">
              The goal is not isolation. The goal is stronger local
              coordination, affordability, and resilience.
            </p>
          </motion.div>
        </div>
        <LocalLoopViz />
        <div className="container mx-auto px-4 pb-10 text-center">
          <Link
            to="/why-local"
            data-ocid="landing.why_local_link"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/40 text-primary font-medium text-sm transition-smooth hover:bg-primary/10 min-h-[44px]"
          >
            Why Local Resilience Matters <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Impact Counters */}
      <section className="bg-muted/20 border-t border-border">
        <ImpactCounters
          stats={stats}
          volunteerCount={volunteers?.length ?? 0}
          cityCount={cityCount}
        />
      </section>

      {/* Community Stories */}
      <section className="bg-background py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Stories From the Network
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              Real communities and organizations participating across Canada.
            </p>
          </motion.div>
          <StoryCards limit={3} />
        </div>
      </section>

      {/* Participation cards */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              How Would You Like to Participate?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose your path and join the growing network of local resilience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {PARTICIPATION_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={card.to}
                  data-ocid={card.ocid}
                  className={`flex flex-col h-full bg-card border ${card.accent} rounded-xl p-5 transition-smooth hover:shadow-lifted group min-h-[200px]`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center mb-4`}
                  >
                    <card.icon size={20} className={card.iconColor} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-base mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {card.text}
                  </p>
                  <span
                    className={`mt-4 text-xs font-medium ${card.iconColor} flex items-center gap-1 group-hover:gap-2 transition-smooth`}
                  >
                    {card.cta} <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Network Exists */}
      <section
        className="bg-muted/30 border-t border-b border-border py-20"
        data-ocid="landing.mission_section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-5">
              Why This Network Exists
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              Communities across Canada are facing rising affordability
              pressures, fragmented local commerce, and increasing uncertainty
              around the future of work and technology.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              Project Meadow was created to help communities:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
            {MISSION_PILLARS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-smooth"
              >
                <div className="text-2xl mb-3 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10">
                  <FontAwesomeIcon icon={item.icon} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-center text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            This platform exists to help communities support each other more
            effectively.
          </motion.p>
        </div>
      </section>

      {/* Active Communities */}
      <section
        className="bg-muted/30 border-t border-border py-16"
        data-ocid="landing.active_communities_section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Active Communities
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Active Communities
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Local participation is growing across Canada.
            </p>
          </motion.div>

          {topCities.length === 0 ? (
            <div
              className="max-w-xs mx-auto"
              data-ocid="landing.communities_empty_state"
            >
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <p className="text-sm text-muted-foreground">
                  Growing across Canada — join from your city
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
              {topCities.map((city, i) => (
                <motion.div
                  key={`${city.city}-${city.province}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`landing.community_card.${i + 1}`}
                  className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-smooth"
                >
                  <p className="font-display font-semibold text-foreground text-sm leading-tight">
                    {city.city}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                    {city.province}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {city.memberCount}
                    </span>{" "}
                    members
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link
              to="/chapters"
              data-ocid="landing.see_all_communities_link"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              See all communities <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      {/* Community Opportunities */}
      <section
        className="bg-background border-t border-border py-14"
        data-ocid="landing.opportunities_section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-7"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <FontAwesomeIcon icon={faPeopleGroup} />
              Community Opportunities
            </div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
              Ways to Participate &amp; Support Local Communities
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Project Meadow helps communities organize local support,
              participation, and economic connection.
            </p>
          </motion.div>
          <OpportunitiesPreview />
          <div className="text-center mt-6">
            <Link
              to="/community-opportunities"
              data-ocid="landing.explore_opportunities_button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/40 text-primary font-medium text-sm transition-smooth hover:bg-primary/10 min-h-[44px]"
            >
              Explore Opportunities <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      {/* Help Build the Network CTA */}
      <section
        className="bg-card border-t border-b border-border py-14"
        data-ocid="landing.membership_cta_section"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
              <FontAwesomeIcon icon={faHeart} className="text-green-400" />{" "}
              Support the Network
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              Help Build the Network
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-7 max-w-lg mx-auto">
              Memberships help support education, onboarding, outreach, and
              local coordination — keeping the infrastructure strong for
              everyone.
            </p>
            <Link
              to="/membership"
              data-ocid="landing.join_membership_button"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-smooth hover:bg-primary/85 shadow-soft min-h-[44px] w-full sm:w-auto"
            >
              Join Membership Waitlist <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background border-b border-border py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Want To Help Strengthen Your Local Community?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Volunteer your skills, invite local businesses, or become a
              community ambassador helping grow the network.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <Link
                to="/volunteer"
                data-ocid="landing.volunteer_button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-smooth hover:bg-primary/85 min-h-[44px]"
              >
                Volunteer Your Skills
              </Link>
              <Link
                to="/join"
                data-ocid="landing.invite_businesses_button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-sm transition-smooth hover:bg-muted/60 min-h-[44px]"
              >
                Invite Local Businesses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Optional Community Contributions */}
      <section
        className="bg-muted/30 border-b border-border py-20"
        data-ocid="landing.contributions_section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mx-auto text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
              Optional &amp; Voluntary
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Optional Community Contributions
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Participating businesses and members may optionally choose to
              contribute{" "}
              <span className="text-foreground font-medium">1–2%</span> toward
              community initiatives, onboarding programs, education events, food
              resilience projects, volunteer coordination, and local chapter
              support.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These contributions help strengthen the network and support local
              communities without requiring centralized ownership or extraction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-4xl mx-auto mb-10">
            {CONTRIBUTION_USES.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                data-ocid={`landing.contribution_use.${i + 1}`}
                className="bg-card border border-border rounded-xl p-4 text-center shadow-soft hover:border-primary/30 hover:glow-subtle transition-smooth"
              >
                <div className="text-lg mb-2 w-8 h-8 mx-auto flex items-center justify-center rounded-lg bg-primary/10">
                  <FontAwesomeIcon icon={item.icon} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground leading-snug font-medium">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/community-support"
              data-ocid="landing.community_support_link"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-smooth hover:bg-primary/85 shadow-soft min-h-[44px]"
            >
              Learn How Contributions Work <ArrowRight size={14} />
            </Link>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Always optional. Never a fee, tax, or commission.
            </p>
          </div>
        </div>
      </section>

      {/* Phase 2 placeholders */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-muted border border-border text-xs text-muted-foreground uppercase tracking-widest">
              Coming Soon
            </span>
            <p className="text-muted-foreground text-sm mt-3">
              Upcoming features to strengthen coordination across communities.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {PHASE2_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 text-center opacity-60 cursor-default"
              >
                <item.icon
                  size={22}
                  className="mx-auto mb-2 text-muted-foreground"
                />
                <p className="text-xs text-foreground font-medium mb-1">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
