import { cn } from "@/lib/utils";
import {
  faBolt,
  faHandshake,
  faRecycle,
  faSeedling,
  faStar,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BadgeVariant =
  | "verified"
  | "communityVerified"
  | "pending"
  | "rejected"
  | "bitcoin"
  | "icp"
  | "producer"
  | "trade"
  | "community"
  | "circular"
  | "featured";

interface MemberBadgeProps {
  variant: BadgeVariant;
  className?: string;
}

const BADGE_CONFIG: Record<
  BadgeVariant,
  { label: string; className: string; icon?: IconDefinition }
> = {
  verified: {
    label: "Verified",
    className: "bg-primary/20 text-primary border border-primary/40",
  },
  communityVerified: {
    label: "Community Verified",
    icon: faBolt,
    className:
      "bg-primary/25 text-primary border border-primary/50 shadow-[0_0_8px_oklch(0.72_0.19_152/0.35)]",
  },
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border border-border",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-destructive/20 text-destructive border border-destructive/40",
  },
  bitcoin: {
    label: "Bitcoin",
    className:
      "bg-[oklch(0.65_0.18_45/0.2)] text-[oklch(0.65_0.18_45)] border border-[oklch(0.65_0.18_45/0.4)]",
  },
  icp: {
    label: "ICP",
    className:
      "bg-[oklch(0.60_0.12_270/0.2)] text-[oklch(0.60_0.12_270)] border border-[oklch(0.60_0.12_270/0.4)]",
  },
  producer: {
    label: "Local Producer",
    icon: faSeedling,
    className: "bg-primary/15 text-primary border border-primary/30",
  },
  trade: {
    label: "Tradesperson",
    icon: faWrench,
    className: "bg-secondary/40 text-secondary-foreground border border-border",
  },
  community: {
    label: "Community Partner",
    icon: faHandshake,
    className: "bg-accent/20 text-accent border border-accent/40",
  },
  circular: {
    label: "Circular Economy",
    icon: faRecycle,
    className: "bg-primary/15 text-primary border border-primary/30",
  },
  featured: {
    label: "Featured",
    icon: faStar,
    className:
      "bg-[oklch(0.65_0.18_45/0.15)] text-[oklch(0.65_0.18_45)] border border-[oklch(0.65_0.18_45/0.35)]",
  },
};

export function MemberBadge({ variant, className }: MemberBadgeProps) {
  const config = BADGE_CONFIG[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.icon && (
        <FontAwesomeIcon
          icon={config.icon}
          className="text-[0.65rem]"
          aria-hidden
        />
      )}
      {config.label}
    </span>
  );
}
