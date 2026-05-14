import type { StoryCard } from "@/types";

const STORIES: StoryCard[] = [
  {
    id: "1",
    headline: "Local Greenhouse Feeding 200 Families",
    city: "Vancouver",
    province: "BC",
    summary:
      "A community greenhouse network distributes fresh produce weekly to hundreds of local families through a direct producer subscription model.",
    imageUrl: "https://picsum.photos/seed/greenhouse1/400/220",
    readMoreUrl: "#",
  },
  {
    id: "2",
    headline: "Trades Network Supporting Affordable Repairs",
    city: "Toronto",
    province: "ON",
    summary:
      "Skilled tradespeople coordinate through the network to offer sliding-scale repairs for seniors and low-income households in their communities.",
    imageUrl: "https://picsum.photos/seed/trades2/400/220",
    readMoreUrl: "#",
  },
  {
    id: "3",
    headline: "Food Recovery Group Reducing Waste",
    city: "Montreal",
    province: "QC",
    summary:
      "A local food recovery organization redirects surplus produce from farms and markets to community fridges and shelters across the city.",
    imageUrl: "https://picsum.photos/seed/foodrecovery3/400/220",
    readMoreUrl: "#",
  },
  {
    id: "4",
    headline: "Community Volunteers Mapping Local Producers",
    city: "Calgary",
    province: "AB",
    summary:
      "Volunteers spent three weekends visiting farms and markets to bring dozens of new producers onto the directory, expanding local food access.",
    imageUrl: "https://picsum.photos/seed/volunteers4/400/220",
    readMoreUrl: "#",
  },
  {
    id: "5",
    headline: "Affordable Produce Direct From Farms",
    city: "Halifax",
    province: "NS",
    summary:
      "Farms and market gardeners list their produce directly, eliminating middlemen and offering families lower prices on fresh, local food.",
    imageUrl: "https://picsum.photos/seed/produce5/400/220",
    readMoreUrl: "#",
  },
  {
    id: "6",
    headline: "Cooperative Housing Connecting Local Services",
    city: "Edmonton",
    province: "AB",
    summary:
      "A housing cooperative uses the directory to coordinate local trades and services for member residents, keeping spending within the community.",
    imageUrl: "https://picsum.photos/seed/coop6/400/220",
    readMoreUrl: "#",
  },
];

interface Props {
  limit?: number;
}

export function StoryCards({ limit = 6 }: Props) {
  const stories = STORIES.slice(0, limit);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      data-ocid="story_cards.list"
    >
      {stories.map((story, i) => (
        <article
          key={story.id}
          className="story-card glow-subtle"
          data-ocid={`story_cards.item.${i + 1}`}
        >
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={story.imageUrl}
              alt={story.headline}
              className="w-full h-full object-cover transition-hover hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary">
                {story.city}, {story.province}
              </span>
            </div>
            <h3 className="font-display font-semibold text-foreground text-sm md:text-base leading-snug mb-2">
              {story.headline}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {story.summary}
            </p>
            <button
              type="button"
              disabled
              className="mt-3 text-xs text-muted-foreground border border-border rounded px-3 py-1.5 opacity-50 cursor-not-allowed"
              aria-label={`Read story: ${story.headline} (coming soon)`}
            >
              Read Story
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
