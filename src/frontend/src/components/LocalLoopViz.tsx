import {
  faCartShopping,
  faHouseChimney,
  faRecycle,
  faSeedling,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LOOP_STEPS: {
  icon: IconDefinition;
  label: string;
  description: string;
}[] = [
  {
    icon: faSeedling,
    label: "Food Producers",
    description: "Farms, greenhouses, and growers produce fresh local food",
  },
  {
    icon: faCartShopping,
    label: "Local Consumers",
    description: "Families and individuals buy directly from local sources",
  },
  {
    icon: faWrench,
    label: "Trades & Services",
    description: "Skilled tradespeople support homes, farms, and businesses",
  },
  {
    icon: faHouseChimney,
    label: "Community Organizations",
    description: "Non-profits and co-ops coordinate and support participation",
  },
  {
    icon: faRecycle,
    label: "Local Economic Resilience",
    description: "Value stays in the community and strengthens it over time",
  },
];

export function LocalLoopViz() {
  return (
    <section
      className="py-12 px-4"
      data-ocid="local_loop.section"
      aria-label="How local economic loops work"
    >
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            How Local Economic Loops Work
          </h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-lg mx-auto">
            When communities support local producers, businesses, and services
            directly, value circulates locally instead of constantly leaving the
            community.
          </p>
        </div>

        <div className="flex flex-col items-center gap-0">
          {LOOP_STEPS.map((step, i) => (
            <div key={step.label} className="w-full">
              <div
                className="flow-step bg-card rounded-xl p-5 border border-border shadow-soft glow-subtle w-full"
                data-ocid={`local_loop.step.${i + 1}`}
              >
                <div className="flow-icon">
                  <FontAwesomeIcon icon={step.icon} fixedWidth />
                </div>
                <p className="font-display font-semibold text-foreground text-sm md:text-base">
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {i < LOOP_STEPS.length - 1 && (
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
        </div>
      </div>
    </section>
  );
}
