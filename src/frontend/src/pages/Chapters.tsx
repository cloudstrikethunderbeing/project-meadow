import { useGetCityStats } from "@/hooks/useQueries";
import type { CityStats } from "@/types";
import {
  faArrowRight,
  faHandsHelping,
  faLeaf,
  faMapMarkerAlt,
  faSpinner,
  faStore,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

function CityCard({ city, index }: { city: CityStats; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      data-ocid={`chapters.city_card.${index + 1}`}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-lifted transition-smooth"
    >
      {/* City header */}
      <div className="mb-4">
        <h3 className="font-display font-bold text-foreground text-lg leading-tight">
          {city.city}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{city.province}</p>
      </div>

      {/* Stats rows */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <FontAwesomeIcon icon={faStore} className="text-primary w-3.5" />
            Businesses
          </span>
          <span className="text-xs font-semibold text-foreground">
            {city.businessCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <FontAwesomeIcon icon={faLeaf} className="text-primary w-3.5" />
            Producers
          </span>
          <span className="text-xs font-semibold text-foreground">
            {city.producerCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <FontAwesomeIcon
              icon={faHandsHelping}
              className="text-blue-400 w-3.5"
            />
            Volunteers
          </span>
          <span className="text-xs font-semibold text-foreground">
            {city.volunteerCount}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border/50 pt-2.5 mt-2.5">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <FontAwesomeIcon
              icon={faUsers}
              className="text-foreground/60 w-3.5"
            />
            Members
          </span>
          <span className="text-xs font-bold text-foreground">
            {city.memberCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function Chapters() {
  const { data: cities = [], isLoading } = useGetCityStats();

  const sorted = [...cities].sort((a, b) =>
    a.totalListings < b.totalListings
      ? 1
      : a.totalListings > b.totalListings
        ? -1
        : 0,
  );

  return (
    <div data-ocid="chapters.page" className="min-h-screen bg-background">
      {/* Page header */}
      <section className="bg-card border-b border-border py-14">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Active Communities
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Active Communities
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Discover where Project Meadow is growing across Canada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* City grid */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4"
              data-ocid="chapters.loading_state"
            >
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-primary text-2xl animate-spin"
              />
              <p className="text-sm text-muted-foreground">
                Loading communities…
              </p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20" data-ocid="chapters.empty_state">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-primary text-xl"
                />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                Communities are forming across Canada.
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Be the first in your city. Join the network and help build local
                momentum.
              </p>
              <Link
                to="/join"
                data-ocid="chapters.join_button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-smooth hover:bg-primary/85 min-h-[44px]"
              >
                Join Your Community{" "}
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {sorted.map((city, i) => (
                <CityCard
                  key={`${city.city}-${city.province}`}
                  city={city}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Growing Local Network */}
      <section className="bg-muted/30 border-t border-border py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
              Growing Local Network
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
              Project Meadow communities form organically as local participation
              grows.
            </p>
            <Link
              to="/join"
              data-ocid="chapters.join_community_button"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-smooth hover:bg-primary/85 shadow-soft min-h-[44px]"
            >
              Join Your Community{" "}
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
