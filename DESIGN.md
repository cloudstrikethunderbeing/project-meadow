# Design Brief — Canadian Resilience Network

## Tone & Purpose
Community-first, hopeful, trustworthy platform for local economic coordination. Not crypto-focused. Emphasizes resilience, affordability, local participation.

## Differentiation
Warm cream text on dark backgrounds with green community accents (orange for Bitcoin, blue/purple for ICP). Soft elevated cards with subtle glows evoke optimism and trust without feeling corporate.

## Palette (OKLCH)
| Token | Light | Dark | Purpose |
|-------|-------|------|----------|
| background | 0.98 0.01 70 | 0.12 0 0 | Page surface |
| foreground | 0.94 0.02 70 | 0.94 0.02 70 | Text, warm cream |
| primary | 0.62 0.17 142 | 0.62 0.17 142 | Community green, CTAs |
| accent | 0.55 0.15 142 | 0.55 0.15 142 | Highlights, secondary focus |
| card | 1.0 0 0 | 0.18 0 0 | Elevated card surface |
| chart-1 | 0.65 0.18 45 | 0.65 0.18 45 | Bitcoin orange |
| chart-2 | 0.60 0.12 270 | 0.60 0.12 270 | ICP purple |
| destructive | 0.58 0.15 20 | 0.65 0.18 20 | Errors, warnings |

## Typography
- Display: Space Grotesk (modern, friendly, geometric)
- Body: Plus Jakarta Sans (warm, approachable, readable)
- Mono: JetBrains Mono (clean, technical)
- Scale: h1 48px, h2 36px, h3 24px, body 16px, small 14px

## Structural Zones
| Zone | Treatment | Notes |
|------|-----------|-------|
| Header | card-bg with soft shadow | Subtle elevation, navigation |
| Hero/Content | background surface | Breathing room, generous padding |
| Cards/Sections | card-bg lifted with glow | Soft shadow-lifted, accent glow optional |
| Forms | input borders with focus ring | Focus state uses primary green |
| Footer | border-t with muted bg | Disclaimer, nav, subtle presence |

## Motion & Interaction
- Default transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Hover: subtle scale (+2%) + opacity shift
- Focus: ring with primary green, 2px offset
- Loading states: pulse on card elements

## Component Patterns
- Onboarding cards: 5-column grid (desktop), stacked (mobile), equal height, green accent on hover
- Search bar: large, prominent, input-card style, focus ring visible
- Member badges: community green for verified, orange for Bitcoin, purple for ICP
- CTAs: primary green button, secondary muted outline, large touch targets (≥44px)
- Member profiles: card-bg with avatar, category badge, location, payment badges

## Constraints
- No pure white; use warm cream (0.94 L, 0.02 C, 70 H)
- No harsh shadows; soft shadows only (0-24px blur)
- No generic rounded; radius 12px (0.75rem) intentional and consistent
- No crypto language; focus on community, resilience, coordination
- Mobile-first: 320px minimum viewport, responsive typography
- Accessible touch targets: minimum 44px

## Phase 2 Additive Tokens
| Feature | Token | Usage |
|---------|-------|-------|
| Activity Feed | glow-activity | Card soft glow + shadow |
| Impact Metrics | impact-metric | Glow on counter cards |
| Local Loop | flow-connector | Connector lines (30% opacity green) |
| Story Cards | story-card | Carousel/grid card styling |
| Event Icons | event-icon-* | Business (💼), Producer (🌱), Volunteer (👥), Verified (⚡) |

## Motion (Phase 2)
- pulse-soft: 2s infinite, 0.2 opacity range (impact counters)
- fade-in: 0.4s ease-out (activity cards, story cards)
- slide-up: 0.3s ease-out (content reveal)
- hover-lift: scale 1.05 + shadow-lifted on cards

## Signature Detail
Warm cream text on deep dark background with soft green glows creates intimate, hopeful feel — like candlelight in a gathering space. Not cold, not corporate, not speculative. Phase 2 extends with activity signals (community coordination momentum) and educational flow diagrams (local economic resilience explained visually).
