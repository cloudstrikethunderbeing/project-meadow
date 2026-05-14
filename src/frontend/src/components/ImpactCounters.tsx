import type { StatsRecord } from "@/types";
import {
  faBolt,
  faHandshake,
  faLocationDot,
  faPeopleGroup,
  faSeedling,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  stats: StatsRecord | null | undefined;
  volunteerCount?: number;
  cityCount?: number;
  communityVerifiedCount?: number;
}

interface MetricItem {
  value: string;
  label: string;
  icon: IconDefinition;
}

function fmt(n: bigint | number | undefined): string {
  if (n === undefined || n === null) return "—";
  const num = typeof n === "bigint" ? Number(n) : n;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

export function ImpactCounters({
  stats,
  volunteerCount,
  cityCount,
  communityVerifiedCount,
}: Props) {
  const businesses =
    (stats?.businessMembers ?? 0n) + (stats?.communityMembers ?? 0n);
  const producers = stats?.producerMembers ?? 0n;
  const organizations = stats?.organizationPartners ?? 0n;
  const volunteers = volunteerCount ?? 0;
  const cities = cityCount ?? 0;
  const verified =
    communityVerifiedCount ?? Number(stats?.verifiedMembers ?? 0n);

  const metrics: MetricItem[] = [
    { value: fmt(businesses), label: "Businesses & Services", icon: faStore },
    { value: fmt(producers), label: "Food Producers", icon: faSeedling },
    { value: fmt(volunteers), label: "Volunteers", icon: faHandshake },
    { value: fmt(organizations), label: "Organizations", icon: faPeopleGroup },
    {
      value: cities > 0 ? fmt(cities) : "20+",
      label: "Cities Represented",
      icon: faLocationDot,
    },
    { value: fmt(verified), label: "Community Verified", icon: faBolt },
  ];

  return (
    <section className="py-12 px-4" data-ocid="impact.section">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Growing Community Participation
          </h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Real people and organizations strengthening local economies across
            Canada
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="impact-card impact-metric"
              data-ocid={`impact.${m.label.toLowerCase().replace(/ /g, "_")}.card`}
            >
              <span className="text-2xl mb-2 block text-primary">
                <FontAwesomeIcon icon={m.icon} fixedWidth />
              </span>
              <div className="impact-number">{m.value}</div>
              <div className="impact-label">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
