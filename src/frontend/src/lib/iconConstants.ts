/**
 * Icon size and color constants for consistent icon usage across the platform.
 *
 * Size rules:
 *   nav icons     → text-sm
 *   card icons    → text-xl
 *   hero/feature  → text-3xl or text-4xl
 *   badge/inline  → text-xs or text-sm
 *
 * Color rules:
 *   community (green)        → local/community topics
 *   payment (orange)         → Bitcoin/payment support
 *   infrastructure (purple)  → ICP/wallet/infrastructure
 *   neutral (cream/white)    → general/neutral
 */

export const ICON_SIZES = {
  nav: "text-sm" as const,
  card: "text-xl" as const,
  hero: "text-3xl" as const,
  badge: "text-xs" as const,
} satisfies Record<string, string>;

export const ICON_COLORS = {
  community: "text-green-400" as const,
  payment: "text-orange-400" as const,
  infrastructure: "text-purple-400" as const,
  neutral: "text-white" as const,
} satisfies Record<string, string>;
