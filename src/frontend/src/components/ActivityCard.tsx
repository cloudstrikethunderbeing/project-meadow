import type { ActivityEvent } from "@/types";
import {
  faBolt,
  faCalendarDays,
  faHandshake,
  faLeaf,
  faLocationDot,
  faMapPin,
  faPeopleGroup,
  faSeedling,
  faStar,
  faStore,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EVENT_ICONS: Record<string, IconDefinition> = {
  business_joined: faStore,
  producer_joined: faSeedling,
  trades_joined: faWrench,
  organization_joined: faPeopleGroup,
  volunteer_joined: faHandshake,
  listing_verified: faBolt,
  chapter_created: faLocationDot,
  event_created: faCalendarDays,
  affordability_program: faLeaf,
  producer_featured: faStar,
};

const EVENT_ACCENT: Record<string, string> = {
  listing_verified: "border-l-primary",
  chapter_created: "border-l-primary",
  producer_joined: "border-l-primary",
  volunteer_joined: "border-l-primary",
};

function timeAgo(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

interface Props {
  activity: ActivityEvent;
}

export function ActivityCard({ activity }: Props) {
  const icon = EVENT_ICONS[activity.eventType] ?? faMapPin;
  const accent = EVENT_ACCENT[activity.eventType] ?? "border-l-border";

  return (
    <article
      className={`activity-card border-l-2 ${accent} glow-activity`}
      data-ocid={`activity.item.${activity.id}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-base leading-none mt-0.5 shrink-0 text-primary"
          aria-hidden
        >
          <FontAwesomeIcon icon={icon} fixedWidth />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">
            {activity.title}
          </p>
          {activity.description && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
              {activity.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-primary font-medium">
              {activity.city}, {activity.province}
            </span>
            <span className="text-xs text-muted-foreground">
              · {timeAgo(activity.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
