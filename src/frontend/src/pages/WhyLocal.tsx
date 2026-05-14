import { LocalLoopViz } from "@/components/LocalLoopViz";
import {
  faHandshake,
  faHeart,
  faHouseChimney,
  faLeaf,
  faMapMarkedAlt,
  faSeedling,
  faStore,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SECTIONS = [
  {
    icon: faStore,
    title: "Supporting Local Businesses",
    paragraphs: [
      "When you buy from a local business, a larger share of that spending stays in your community. Local owners hire locally, source locally, and reinvest locally — creating a multiplier effect that strengthens the whole regional economy.",
      "Discovering local alternatives is often the hardest part. A community directory makes it easier for people to find the butcher, the hardware store, or the repair shop that already exists in their neighbourhood.",
      "Supporting local businesses also drives healthy competition, keeps prices in check, and ensures communities are not entirely dependent on a handful of large retailers or distant suppliers.",
    ],
  },
  {
    icon: faSeedling,
    title: "Strengthening Food Systems",
    paragraphs: [
      "Access to local food producers reduces dependency on long, fragile supply chains. When communities can source food from nearby farms and growers, they are better positioned to handle disruptions — whether from weather, transport delays, or market shocks.",
      "Local food is often fresher, more seasonal, and available at prices that benefit both the producer and the buyer when the relationship is direct. Farmers markets, community-supported agriculture, and local cooperatives are proven models.",
      "Connecting food producers to local consumers and organizations through a simple directory is one of the most practical things a community can do to improve affordability and access to nutritious food.",
    ],
  },
  {
    icon: faHandshake,
    title: "Community Coordination",
    paragraphs: [
      "Strong communities coordinate. When local producers, services, volunteers, and organizations can easily find and work with each other, everyone benefits. A shared platform makes that coordination simpler and more accessible.",
      "Coordination tools help identify gaps — which neighbourhoods lack affordable food access, which trades are underserved, where volunteers are needed most. That visibility enables communities to direct support where it matters.",
      "Whether it is organizing a bulk-buy program, connecting a food bank with a local farm, or helping a volunteer find a nearby organization to support, small coordination wins add up to meaningful community resilience.",
    ],
  },
  {
    icon: faHeart,
    title: "Affordability & Accessibility",
    paragraphs: [
      "Direct relationships between producers and consumers often mean better prices for both. Removing unnecessary intermediaries, reducing transport costs, and fostering local competition all contribute to more affordable goods and services.",
      "Community programs like cooperative buying, shared tool libraries, and food recovery initiatives can make a real difference in household costs — especially for families on tight budgets.",
      "Visibility matters too. When community members can easily discover affordable local options — produce, repairs, services — they can make choices that stretch their budgets further without sacrificing quality.",
    ],
  },
  {
    icon: faHouseChimney,
    title: "Local Trust & Relationships",
    paragraphs: [
      "Knowing your baker, your plumber, or your produce grower personally creates accountability and care that no algorithm can replicate. Community trust is built through real relationships and local knowledge.",
      "Community verification — where local members confirm that a business exists, is legitimate, and operates with integrity — is a powerful tool. It surfaces the businesses that locals already recommend and trust.",
      "These relationships also provide a safety net. When neighbours know and support each other, communities are better equipped to navigate difficult times together — whether economic, social, or environmental.",
    ],
  },
  {
    icon: faTools,
    title: "Modern Infrastructure Tools",
    paragraphs: [
      "Community coordination used to require physical proximity. Today, simple digital tools can help communities discover local producers, verify trusted businesses, organize volunteers, and coordinate events across an entire city.",
      "The best community platforms are lightweight, easy to navigate, and focused on connecting people to local resources — not creating complexity. A searchable directory, a trust system, and an activity feed are often all a community needs to get started.",
      "Technology should serve the community, not replace it. The goal is to reduce friction so that more people can participate, more businesses can be discovered, and more value can stay in the hands of local communities.",
    ],
  },
];

export function WhyLocal() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-card border-b border-border py-16 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.62 0.17 142 / 0.12) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto text-center max-w-2xl relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <FontAwesomeIcon icon={faLeaf} />
            <span>Community Education</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
            Why Local Economic Resilience Matters
          </h1>
          <p className="text-muted-foreground mt-4 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Communities become stronger when people can more easily discover and
            support trusted local businesses, producers, services, and
            organizations.
          </p>
        </div>
      </section>

      {/* Six content sections */}
      <section className="py-14 px-4" data-ocid="why_local.reasons.section">
        <div className="container mx-auto max-w-3xl">
          <div className="flex flex-col gap-10">
            {SECTIONS.map((s, i) => (
              <article
                key={s.title}
                className="bg-card border border-border rounded-2xl p-7 md:p-8 transition-smooth hover:border-primary/30 hover:shadow-lifted"
                data-ocid={`why_local.reason.${i + 1}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
                    aria-label={s.title}
                  >
                    <FontAwesomeIcon
                      icon={s.icon}
                      className="text-primary text-lg"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-foreground text-lg mb-3 text-primary">
                      {s.title}
                    </h2>
                    <div className="flex flex-col gap-3">
                      {s.paragraphs.map((p) => (
                        <p
                          key={p.slice(0, 40)}
                          className="text-sm text-muted-foreground leading-relaxed"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Loop visualization */}
      <div className="bg-muted/30 border-t border-b border-border">
        <LocalLoopViz />
      </div>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-lg">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            Ready to Participate?
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Join Project Meadow and help strengthen your local economy — or
            explore the listings already in your area.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#/map"
              className="px-7 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-smooth hover:bg-primary/80 min-h-[44px] flex items-center gap-2"
              data-ocid="why_local.find_listings.link"
            >
              <FontAwesomeIcon icon={faMapMarkedAlt} />
              Find Local Listings
            </a>
            <a
              href="#/join"
              className="px-7 py-3 rounded-lg border border-primary/40 text-primary font-semibold text-sm transition-smooth hover:bg-primary/10 min-h-[44px] flex items-center gap-2"
              data-ocid="why_local.join_network.link"
            >
              <FontAwesomeIcon icon={faSeedling} />
              Join the Network
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
