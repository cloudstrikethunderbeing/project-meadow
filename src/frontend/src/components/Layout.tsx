import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  faBars,
  faBolt,
  faHandHoldingHeart,
  faHandshake,
  faHeart,
  faMap,
  faMapMarkerAlt,
  faSeedling,
  faUsers,
  faWallet,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

interface NavLink {
  label: string;
  to: string;
  icon?: IconDefinition;
}

interface NavGroup {
  label: string;
  links: NavLink[];
}

const NAV_LINKS: NavLink[] = [
  { label: "Explore Map", to: "/map" },
  { label: "Chapters", to: "/chapters" },
  { label: "Activity", to: "/activity" },
  { label: "Community", to: "/community" },
  { label: "Why Local", to: "/why-local" },
  { label: "Membership", to: "/membership" },
  { label: "Support", to: "/community-support" },
  { label: "Opportunities", to: "/community-opportunities" },
];

const MOBILE_NAV_GROUPS: NavGroup[] = [
  {
    label: "Discover",
    links: [
      { label: "Explore Map", to: "/map", icon: faMap },
      { label: "Chapters", to: "/chapters", icon: faMapMarkerAlt },
      { label: "Activity", to: "/activity", icon: faBolt },
      { label: "Community", to: "/community", icon: faUsers },
    ],
  },
  {
    label: "Learn",
    links: [
      { label: "Why Local", to: "/why-local", icon: faSeedling },
      { label: "Wallet Guide", to: "/wallet-guide", icon: faWallet },
    ],
  },
  {
    label: "Participate",
    links: [
      { label: "Membership", to: "/membership", icon: faHeart },
      { label: "Support", to: "/community-support", icon: faHandHoldingHeart },
      {
        label: "Opportunities",
        to: "/community-opportunities",
        icon: faHandshake,
      },
    ],
  },
];

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, login, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group shrink-0"
            data-ocid="header.nav_link"
          >
            <img
              src="/assets/logo.png"
              alt="Project Meadow"
              className="h-16 md:h-20 w-auto rounded-full object-contain"
            />
            <span className="font-display font-semibold text-foreground text-sm hidden xl:block leading-tight">
              Project Meadow
            </span>
          </Link>

          {/* Desktop nav — lg and above */}
          <nav
            className="hidden lg:flex items-center gap-0.5 flex-1 justify-center"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "_")}.link`}
                className={cn(
                  "px-2 py-1.5 rounded-md text-xs font-medium transition-smooth whitespace-nowrap",
                  currentPath === link.to
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.admin.link"
                className={cn(
                  "px-2 py-1.5 rounded-md text-xs font-medium transition-smooth whitespace-nowrap",
                  currentPath === "/admin"
                    ? "bg-destructive/15 text-destructive font-semibold"
                    : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/60",
                )}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions — lg and above */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={login}
                data-ocid="header.login_button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium transition-smooth hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none min-h-[36px]"
              >
                Log In
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/join"
                  data-ocid="header.join_button"
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium transition-smooth hover:bg-primary/80 min-h-[36px] flex items-center whitespace-nowrap"
                >
                  Join Network
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  data-ocid="header.logout_button"
                  className="px-2 py-1.5 rounded-lg text-xs text-muted-foreground transition-smooth hover:text-foreground hover:bg-muted/60 min-h-[36px] whitespace-nowrap"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Hamburger — below lg */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            data-ocid="header.mobile_menu_button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          >
            <FontAwesomeIcon
              icon={menuOpen ? faXmark : faBars}
              className="w-5 h-5"
            />
          </button>
        </div>

        {/* Mobile / Tablet Drawer — slides in below header */}
        <div
          className={cn(
            "lg:hidden fixed inset-x-0 top-20 z-40 bg-card border-b border-border overflow-y-auto max-h-[calc(100dvh-5rem)] transition-all duration-200",
            menuOpen
              ? "opacity-100 pointer-events-auto translate-y-0"
              : "opacity-0 pointer-events-none -translate-y-2",
          )}
          aria-hidden={!menuOpen}
        >
          <div className="px-4 py-4">
            {/* Admin link at top if applicable */}
            {isAdmin && (
              <div className="mb-3 pb-3 border-b border-border">
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  data-ocid="mobile_nav.admin.link"
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-smooth min-h-[48px]",
                    currentPath === "/admin"
                      ? "border-l-2 border-destructive bg-destructive/10 text-destructive pl-2"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <span className="w-5 text-center text-destructive/70 text-xs">
                    ⚙
                  </span>
                  Admin Panel
                </Link>
              </div>
            )}

            {/* Grouped nav links */}
            {MOBILE_NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-4">
                <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      data-ocid={`mobile_nav.${link.label.toLowerCase().replace(/ /g, "_")}.link`}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-smooth min-h-[48px]",
                        currentPath === link.to
                          ? "border-l-2 border-primary bg-primary/10 text-primary pl-2"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                      )}
                    >
                      {link.icon && (
                        <FontAwesomeIcon
                          icon={link.icon}
                          className={cn(
                            "w-4 h-4 shrink-0",
                            currentPath === link.to
                              ? "text-primary"
                              : "text-muted-foreground/60",
                          )}
                        />
                      )}
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Auth actions */}
            <div className="border-t border-border pt-4 mt-2 flex flex-col gap-2">
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    login();
                    setMenuOpen(false);
                  }}
                  data-ocid="mobile_nav.login_button"
                  className="w-full px-3 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:bg-primary/80 min-h-[48px]"
                >
                  Log In with Internet Identity
                </button>
              ) : (
                <>
                  <Link
                    to="/join"
                    onClick={() => setMenuOpen(false)}
                    data-ocid="mobile_nav.join_button"
                    className="w-full px-3 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:bg-primary/80 min-h-[48px] flex items-center justify-center"
                  >
                    Join Network
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    data-ocid="mobile_nav.logout_button"
                    className="w-full px-3 py-3 rounded-lg text-sm text-muted-foreground border border-border hover:text-foreground hover:bg-muted/60 transition-smooth min-h-[48px] text-left"
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Backdrop for drawer */}
        {menuOpen && (
          <div
            role="button"
            tabIndex={-1}
            className="lg:hidden fixed inset-0 top-20 z-30 bg-background/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/assets/logo.png"
                  alt="Project Meadow"
                  className="h-16 md:h-20 w-auto rounded-full object-contain"
                />
                <span className="font-display font-semibold text-foreground text-sm">
                  Project Meadow
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Strengthening Local Economies Together — a community
                coordination platform for local producers, trades, and
                organizations.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                Project Meadow is being developed as a community coordination
                and public-benefit participation platform focused on local
                economic resilience, affordability, and community support across
                Canada.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-display font-semibold text-foreground mb-3">
                Explore
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Browse the Map", to: "/map" },
                  { label: "Active Communities", to: "/chapters" },
                  { label: "Activity", to: "/activity" },
                  { label: "Community", to: "/community" },
                  { label: "Why Local", to: "/why-local" },
                  { label: "Volunteer", to: "/volunteer" },
                  {
                    label: "Community Opportunities",
                    to: "/community-opportunities",
                  },
                  { label: "Join the Network", to: "/join" },
                  { label: "Membership", to: "/membership" },
                  { label: "Community Support", to: "/community-support" },
                  { label: "Community Supporters", to: "/supporters" },
                  { label: "Wallet Guide", to: "/wallet-guide" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-border/50">
                <Link
                  to="/membership"
                  data-ocid="footer.membership_cta_link"
                  className="block text-xs font-semibold text-primary hover:text-primary/80 transition-colors mb-1"
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-primary mr-1"
                  />{" "}
                  Help Build the Network
                </Link>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Memberships help support education, onboarding, outreach, and
                  local coordination.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div>
              <h4 className="text-sm font-display font-semibold text-foreground mb-3">
                Important Notice
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This platform is a local directory and community coordination
                tool. It does not custody funds, process payments, provide
                financial advice, or operate as an exchange. Members are
                responsible for their own transactions, records, taxes, and
                compliance. Any community contributions are entirely voluntary
                and community-directed.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-xs text-muted-foreground text-center sm:text-right max-w-xs">
              Powered by the Internet Computer Protocol
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
