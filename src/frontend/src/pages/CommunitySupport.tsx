import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  faBookOpen,
  faCalendarDays,
  faCircleCheck,
  faGraduationCap,
  faHandHoldingHeart,
  faHandshake,
  faHeart,
  faHouseChimney,
  faLeaf,
  faRecycle,
  faSeedling,
  faStar,
  faStore,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";

const CONTRIBUTION_DESTINATIONS = [
  {
    icon: faSeedling,
    title: "Local Producer Onboarding",
    description:
      "Help farms, growers, and food producers join the network and connect with local buyers.",
  },
  {
    icon: faBookOpen,
    title: "Community Workshops",
    description:
      "Support education events on local resilience, sustainable practices, and community coordination.",
  },
  {
    icon: faHouseChimney,
    title: "Affordability Initiatives",
    description:
      "Fund local programs that make food, goods, and services more accessible to community members.",
  },
  {
    icon: faHandshake,
    title: "Local Chapter Events",
    description:
      "Support city-level gatherings, meetups, and coordination activities in your community.",
  },
  {
    icon: faLeaf,
    title: "Nonprofit Participation",
    description:
      "Help non-profits and co-operatives participate fully in the network without barriers.",
  },
];

const REINVESTMENT_STEPS = [
  {
    icon: faUsers,
    label: "Community Participation",
    description: "People and businesses engage with the local network",
  },
  {
    icon: faHeart,
    label: "Optional Contributions",
    description: "Voluntary 1–2% toward community initiatives",
  },
  {
    icon: faGraduationCap,
    label: "Education + Onboarding + Local Programs",
    description: "Workshops, producer onboarding, affordability initiatives",
  },
  {
    icon: faStar,
    label: "Stronger Communities",
    description: "Better coordination, more trust, greater resilience",
  },
  {
    icon: faRecycle,
    label: "More Local Participation",
    description: "Strengthened communities attract more local engagement",
  },
];

const FUTURE_METRICS = [
  { label: "Businesses Onboarded", icon: faStore },
  { label: "Producers Supported", icon: faSeedling },
  { label: "Workshops Funded", icon: faBookOpen },
  { label: "Local Events Organized", icon: faCalendarDays },
  { label: "Volunteers Activated", icon: faHandHoldingHeart },
  { label: "Chapter Initiatives Funded", icon: faHouseChimney },
];

export function CommunitySupport() {
  return (
    <main
      className="min-h-screen bg-background"
      data-ocid="community_support.page"
    >
      {/* Hero */}
      <section className="py-20 px-4 bg-card border-b border-border">
        <div className="container mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-4 text-primary border-primary/40 bg-primary/10"
          >
            Optional & Voluntary
          </Badge>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-5 leading-tight">
            How Community Contributions Work
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            When communities invest in themselves, everyone benefits. Voluntary
            contributions reinvest in the local network — no fees, no
            obligations.
          </p>
          {/* PRIMARY CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/membership"
              data-ocid="community_support.help_build_button"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-base transition-smooth hover:bg-primary/85 shadow-soft min-h-[48px] w-full sm:w-auto"
            >
              Help Build the Network
            </Link>
            <Link
              to="/map"
              data-ocid="community_support.explore_directory_button"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm transition-smooth hover:bg-muted/50 min-h-[44px] w-full sm:w-auto"
            >
              Explore the Directory
            </Link>
          </div>
        </div>
      </section>

      {/* What Are Community Contributions */}
      <section
        className="py-16 px-4 bg-background"
        data-ocid="community_support.what_section"
      >
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              What Are Community Contributions?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              An optional, community-first model for local reinvestment.
            </p>
          </div>

          <Card className="bg-card border-primary/20 glow-subtle shadow-soft">
            <CardContent className="p-8 space-y-5">
              <p className="text-foreground text-base md:text-lg leading-relaxed">
                Participating businesses and members may optionally choose to
                contribute{" "}
                <span className="text-primary font-semibold">1–2%</span> toward
                community initiatives — including onboarding programs, education
                events, food resilience projects, volunteer coordination, and
                local chapter support.
              </p>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                These voluntary contributions help strengthen the network and
                support local communities without requiring centralized
                ownership or extraction.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {[
                  { icon: faCircleCheck, text: "Optional" },
                  { icon: faHandHoldingHeart, text: "Voluntary" },
                  { icon: faHeart, text: "Community-directed" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-3"
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-primary text-lg"
                    />
                    <span className="font-body text-foreground font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Not</span> a
                  transaction fee, platform cut, commission, or tax. This is
                  purely optional community support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Where Contributions Go */}
      <section
        className="py-16 px-4 bg-muted/20"
        data-ocid="community_support.destinations_section"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              Where Contributions Go
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every voluntary contribution stays within the local community and
              supports real people and programs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONTRIBUTION_DESTINATIONS.map((dest, i) => (
              <Card
                key={dest.title}
                className="bg-card border-border shadow-soft transition-smooth hover:shadow-lifted hover:border-primary/30"
                data-ocid={`community_support.destination.${i + 1}`}
              >
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <FontAwesomeIcon
                      icon={dest.icon}
                      className="text-primary"
                    />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {dest.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {dest.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Reinvestment Loop */}
      <section
        className="py-16 px-4 bg-background"
        data-ocid="community_support.reinvestment_section"
      >
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              The Reinvestment Loop
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Voluntary contributions create a self-reinforcing cycle that
              strengthens local communities over time.
            </p>
          </div>

          <div className="flex flex-col items-center gap-0">
            {REINVESTMENT_STEPS.map((step, i) => (
              <div key={step.label} className="w-full">
                <div
                  className="flow-step bg-card rounded-xl p-5 border border-border shadow-soft w-full"
                  data-ocid={`community_support.loop_step.${i + 1}`}
                >
                  <div className="flow-icon">
                    <FontAwesomeIcon
                      icon={step.icon}
                      className="text-primary"
                    />
                  </div>
                  <p className="font-display font-semibold text-foreground text-sm md:text-base">
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {i < REINVESTMENT_STEPS.length - 1 && (
                  <div className="flex justify-center py-1" aria-hidden>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-0.5 h-4 flow-connector border-l-2 border-dashed" />
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 8L0 0h12L6 8z"
                          fill="oklch(0.62 0.17 142 / 0.5)"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Loop back arrow */}
            <div className="mt-4 w-full flex justify-center" aria-hidden>
              <div className="flex items-center gap-2 text-primary/60 text-xs font-body">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="oklch(0.62 0.17 142 / 0.6)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 2v6h-6" />
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M3 22v-6h6" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                </svg>
                <span className="text-muted-foreground">
                  The cycle continues and grows stronger
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Membership Community */}
      <section
        className="py-16 px-4 bg-card border-t border-border"
        data-ocid="community_support.membership_cta_section"
      >
        <div className="container mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
            <FontAwesomeIcon icon={faHeart} className="text-green-400" />{" "}
            Membership Support
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            Join Our Membership Community
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-7 max-w-lg mx-auto">
            Ready to support the network? Membership contributions help fund the
            programs described above — onboarding, education, affordability
            initiatives, and local chapter support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/membership"
              data-ocid="community_support.see_membership_button"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-base transition-smooth hover:bg-primary/85 shadow-soft min-h-[48px] w-full sm:w-auto"
            >
              Help Build the Network
            </Link>
            <Link
              to="/join"
              data-ocid="community_support.join_free_button"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-border text-foreground font-medium text-sm transition-smooth hover:bg-muted/50 min-h-[44px] w-full sm:w-auto"
            >
              Join the Network Free
            </Link>
          </div>
        </div>
      </section>

      {/* Future Transparency Dashboard */}
      <section
        className="py-16 px-4 bg-muted/20"
        data-ocid="community_support.transparency_section"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <Badge
              variant="outline"
              className="mb-4 text-muted-foreground border-border"
            >
              Coming in a future phase
            </Badge>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              Future Community Transparency Dashboard
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Future transparency dashboards coming in later phases. Community
              members will be able to see exactly where contributions are
              directed and what they've supported.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FUTURE_METRICS.map((metric, i) => (
              <Card
                key={metric.label}
                className="bg-card border-border border-dashed opacity-70"
                data-ocid={`community_support.metric.${i + 1}`}
              >
                <CardContent className="p-5 text-center">
                  <div className="w-9 h-9 mx-auto mb-2 rounded-lg bg-muted flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={metric.icon}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="text-3xl font-display font-bold text-muted-foreground mb-1">
                    —
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {metric.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Placeholder only — no data is tracked yet. Transparency reporting
            will be implemented transparently with community input.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-4 bg-card border-t border-border"
        data-ocid="community_support.cta_section"
      >
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            Ready to Participate?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            You don't need to contribute financially to make a difference. Start
            by listing your business, exploring local producers, or volunteering
            your time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold glow-subtle"
              data-ocid="community_support.help_build_cta_button"
            >
              <Link to="/membership">Help Build the Network</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-muted/40 font-display"
              data-ocid="community_support.map_button"
            >
              <Link to="/map">Explore the Directory</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
