import { MemberBadge } from "@/components/MemberBadge";
import { useAuth } from "@/hooks/useAuth";
import {
  useAddCommunityVote,
  useCommunityVotes,
  useMember,
  useMyVote,
  useRemoveCommunityVote,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import type { ConnectedPresenceLink, FeaturedContent, LinkType } from "@/types";
import {
  PROVINCE_NAMES,
  fromOptional,
  getVerificationLabel,
  isVerified,
} from "@/types";
import {
  faBolt,
  faCalendar,
  faCalendarCheck,
  faClock,
  faComments,
  faEnvelope as faEnvelopeFA,
  faExternalLinkAlt,
  faFilePdf,
  faGlobe,
  faHandHoldingHeart,
  faHashtag,
  faHeart,
  faLink,
  faMagnifyingGlass,
  faMap,
  faNewspaper,
  faPaperPlane,
  faPause,
  faRss,
  faShieldHalved,
  faShoppingCart,
  faStore,
  faTag,
  faThumbsDown,
  faThumbsUp,
  faUsers,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Banknote,
  Bitcoin,
  Check,
  ChevronDown,
  Copy,
  CreditCard,
  ExternalLink,
  Globe,
  Infinity as InfinityIcon,
  Link2,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Share2,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

// ─── Participant type label map ───────────────────────────────────────────────
const PARTICIPANT_LABELS: Record<string, string> = {
  community: "Community Member",
  business: "Business",
  trade: "Tradesperson",
  producer: "Local Producer",
  organization: "Organization / Partner",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div
      className="container mx-auto px-4 py-10 max-w-3xl space-y-4"
      data-ocid="member.loading_state"
      aria-label="Loading member profile"
    >
      {/* Header card skeleton */}
      <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-muted/60 flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-6 bg-muted/60 rounded-lg w-3/4" />
            <div className="h-4 bg-muted/40 rounded w-1/3" />
            <div className="flex gap-2 mt-3">
              <div className="h-5 w-16 bg-muted/40 rounded-full" />
              <div className="h-5 w-20 bg-muted/40 rounded-full" />
              <div className="h-5 w-14 bg-muted/40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      {/* Content skeletons */}
      {[1, 2].map((n) => (
        <div
          key={n}
          className="bg-card border border-border rounded-xl p-5 animate-pulse space-y-3"
        >
          <div className="h-4 bg-muted/60 rounded w-1/4" />
          <div className="h-4 bg-muted/40 rounded w-full" />
          <div className="h-4 bg-muted/40 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div
      className="container mx-auto px-4 py-20 max-w-lg text-center"
      data-ocid="member.error_state"
    >
      <div className="text-6xl mb-6 opacity-40">
        <FontAwesomeIcon icon={faMap} className="text-muted-foreground" />
      </div>
      <h2 className="text-xl font-display font-bold text-foreground mb-2">
        Member not found
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        This listing may have been removed, or the link may be incorrect.
      </p>
      <Link
        to="/map"
        data-ocid="member.error_state.back_link"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-smooth"
      >
        <ArrowLeft size={14} /> Browse Directory
      </Link>
    </div>
  );
}

// ─── Payment badge ────────────────────────────────────────────────────────────
interface PayBadgeProps {
  label: string;
  icon: React.ReactNode;
  colorClass: string;
}
function PayBadge({ label, icon, colorClass }: PayBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
        colorClass,
      )}
    >
      {icon}
      {label}
    </span>
  );
}

// ─── Share button ─────────────────────────────────────────────────────────────
function ShareButton() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      data-ocid="member.share_button"
      aria-label="Copy profile URL"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-smooth",
        copied
          ? "bg-primary/20 text-primary border-primary/40"
          : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
      )}
    >
      {copied ? <Check size={12} /> : <Share2 size={12} />}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}

// ─── Link type icon + label map ──────────────────────────────────────────────
const LINK_TYPE_META: Record<
  LinkType,
  {
    icon: import("@fortawesome/free-solid-svg-icons").IconDefinition;
    label: string;
  }
> = {
  website: { icon: faGlobe, label: "Website" },
  blog: { icon: faRss, label: "Blog" },
  store: { icon: faShoppingCart, label: "Online Store" },
  booking: { icon: faCalendarCheck, label: "Booking Page" },
  donation: { icon: faHandHoldingHeart, label: "Donation Page" },
  events: { icon: faCalendar, label: "Events Page" },
  newsletter: { icon: faEnvelopeFA, label: "Newsletter" },
  youtube: { icon: faVideo, label: "YouTube" },
  instagram: { icon: faVideo, label: "Instagram" },
  twitter: { icon: faHashtag, label: "X / Twitter" },
  facebook: { icon: faUsers, label: "Facebook" },
  etsy: { icon: faStore, label: "Etsy" },
  shopify: { icon: faStore, label: "Shopify" },
  gumroad: { icon: faTag, label: "Gumroad" },
  patreon: { icon: faHeart, label: "Patreon" },
  substack: { icon: faNewspaper, label: "Substack" },
  calendly: { icon: faClock, label: "Calendly" },
  telegram: { icon: faPaperPlane, label: "Telegram" },
  discord: { icon: faComments, label: "Discord" },
  signal: { icon: faShieldHalved, label: "Signal" },
  linktree: { icon: faLink, label: "Linktree" },
  pdf: { icon: faFilePdf, label: "PDF / Resource" },
  other: { icon: faExternalLinkAlt, label: "External Link" },
};

// ─── Featured Content Card ────────────────────────────────────────────────────
function FeaturedSection({ featured }: { featured: FeaturedContent }) {
  const imageUrl = fromOptional(featured.imageUrl);
  const featuredType = fromOptional(featured.featuredType);
  const href = featured.externalLink.startsWith("http")
    ? featured.externalLink
    : `https://${featured.externalLink}`;

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 mt-4"
      data-ocid="member.featured_section"
    >
      <p className="font-display font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-3">
        Featured
      </p>
      <div className="flex gap-4 items-start">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={featured.title}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-border"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-foreground leading-snug">
              {featured.title}
            </h3>
            {featuredType && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/25">
                {featuredType}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {featured.description}
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="member.featured_view_link"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/20 transition-smooth"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
            View
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Connected Presence Section ───────────────────────────────────────────────
function ConnectedPresenceSection({
  links,
}: { links: ConnectedPresenceLink[] }) {
  if (links.length === 0) return null;

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 mt-4"
      data-ocid="member.connected_presence_section"
    >
      {/* Header */}
      <p className="font-display font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-0.5">
        Connected Presence
      </p>
      <p className="text-xs text-muted-foreground italic mb-4">
        Bring your existing work into the Meadow.
      </p>

      {/* Link cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {links.map((link, linkIdx) => {
          const meta =
            LINK_TYPE_META[link.linkType as LinkType] ?? LINK_TYPE_META.other;
          const displayLabel = fromOptional(link.displayLabel) ?? meta.label;
          const href = link.url.startsWith("http")
            ? link.url
            : `https://${link.url}`;
          return (
            <a
              key={link.url + link.linkType}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`member.presence_link.${linkIdx + 1}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/40 border border-border hover:border-primary/40 hover:bg-primary/5 transition-smooth group min-h-[44px]"
            >
              <FontAwesomeIcon
                icon={meta.icon}
                className="text-primary flex-shrink-0 text-sm w-4"
              />
              <span className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {displayLabel}
              </span>
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                className="text-muted-foreground text-xs ml-auto flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"
              />
            </a>
          );
        })}
      </div>

      {/* Trust + safety note */}
      <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
        External links are provided by community members. Always exercise
        personal judgment before interacting with third-party websites or
        services.
      </p>
    </div>
  );
}

// ─── Payment Section ──────────────────────────────────────────────────────────────────
interface PaymentSectionProps {
  hasPayments: boolean;
  acceptsCash: boolean;
  acceptsFiat: boolean;
  acceptsBitcoin: boolean;
  acceptsICP: boolean;
  bitcoinAddress: string | undefined;
  icpAddress: string | undefined;
  oisyWalletLink: string | undefined;
  paymentQrImage: string | undefined;
  paymentInstructions: string | undefined;
}

function CopyAddress({
  label,
  value,
  ocid,
}: {
  label: string;
  value: string;
  ocid: string;
}) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="mt-3 rounded-lg bg-muted/40 border border-border px-3 py-2.5">
      <p className="text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs text-foreground font-mono break-all flex-1">
          {value}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          data-ocid={ocid}
          aria-label={`Copy ${label}`}
          className={cn(
            "flex-shrink-0 p-1.5 rounded-md border transition-smooth text-xs",
            copied
              ? "bg-primary/20 text-primary border-primary/40"
              : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
          )}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
}

function PaymentSection({
  hasPayments,
  acceptsCash,
  acceptsFiat,
  acceptsBitcoin,
  acceptsICP,
  bitcoinAddress,
  icpAddress,
  oisyWalletLink,
  paymentQrImage,
  paymentInstructions,
}: PaymentSectionProps) {
  const [showQr, setShowQr] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Auto-QR: show when no custom image is uploaded but an address exists
  const hasAutoQr =
    !paymentQrImage && !!(bitcoinAddress || icpAddress || oisyWalletLink);

  return (
    <div
      className="bg-card border border-border rounded-xl p-5"
      data-ocid="member.payment_section"
    >
      <h2 className="font-display font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-1">
        Accepted Payment Methods
      </h2>
      <p className="text-xs text-muted-foreground mb-3">
        This member may accept payments directly. Transactions happen outside
        this platform.
      </p>

      {/* Payment method badges */}
      {hasPayments ? (
        <div className="flex flex-wrap gap-2">
          {acceptsCash && (
            <PayBadge
              label="Cash"
              icon={<Banknote size={12} />}
              colorClass="bg-muted text-muted-foreground border-border"
            />
          )}
          {acceptsFiat && (
            <PayBadge
              label="E-transfer / Bank"
              icon={<CreditCard size={12} />}
              colorClass="bg-[oklch(0.55_0.14_240/0.15)] text-[oklch(0.60_0.14_240)] border-[oklch(0.60_0.14_240/0.35)]"
            />
          )}
          {acceptsBitcoin && (
            <PayBadge
              label="Bitcoin"
              icon={<Bitcoin size={12} />}
              colorClass="bg-[oklch(0.65_0.18_45/0.15)] text-[oklch(0.65_0.18_45)] border-[oklch(0.65_0.18_45/0.35)]"
            />
          )}
          {acceptsICP && (
            <PayBadge
              label="ICP"
              icon={<InfinityIcon size={12} />}
              colorClass="bg-[oklch(0.60_0.12_270/0.15)] text-[oklch(0.60_0.12_270)] border-[oklch(0.60_0.12_270/0.35)]"
            />
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Payment methods not specified.
        </p>
      )}

      {/* Bitcoin address */}
      {bitcoinAddress && (
        <CopyAddress
          label="Bitcoin Address"
          value={bitcoinAddress}
          ocid="member.copy_bitcoin_address"
        />
      )}

      {/* ICP address */}
      {icpAddress && (
        <CopyAddress
          label="ICP Address / Principal"
          value={icpAddress}
          ocid="member.copy_icp_address"
        />
      )}

      {/* Action buttons row */}
      <div className="mt-3 flex flex-wrap gap-2">
        {oisyWalletLink && (
          <a
            href={
              oisyWalletLink.startsWith("http")
                ? oisyWalletLink
                : `https://${oisyWalletLink}`
            }
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="member.open_wallet_link"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[oklch(0.60_0.12_270/0.15)] text-[oklch(0.60_0.12_270)] border border-[oklch(0.60_0.12_270/0.30)] hover:bg-[oklch(0.60_0.12_270/0.25)] transition-smooth min-h-[36px]"
          >
            <ExternalLink size={11} />
            Open Wallet Link
          </a>
        )}
        {paymentQrImage && (
          <button
            type="button"
            onClick={() => setShowQr((v) => !v)}
            data-ocid="member.view_qr_button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground transition-smooth min-h-[36px]"
          >
            <QrCode size={11} />
            {showQr ? "Hide QR Code" : "View QR Code"}
          </button>
        )}
        {paymentInstructions && (
          <button
            type="button"
            onClick={() => setShowInstructions((v) => !v)}
            data-ocid="member.view_instructions_button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground transition-smooth min-h-[36px]"
          >
            <ChevronDown
              size={11}
              className={cn(
                "transition-transform",
                showInstructions && "rotate-180",
              )}
            />
            View Instructions
          </button>
        )}
      </div>

      {/* Custom uploaded QR image (toggle-controlled) */}
      {showQr && paymentQrImage && (
        <div className="mt-3 flex justify-center">
          <img
            src={paymentQrImage}
            alt="Payment QR Code"
            className="max-w-[180px] max-h-[180px] rounded-lg border border-border"
          />
        </div>
      )}

      {/* Auto-generated QR codes — shown inline when no custom image uploaded */}
      {hasAutoQr && (
        <div className="mt-4 space-y-3" data-ocid="member.auto_qr_section">
          <div className="flex flex-wrap gap-4 justify-center">
            {bitcoinAddress && (
              <div className="bg-muted/40 border border-border rounded-lg p-3 flex flex-col items-center gap-2 max-w-[200px] mx-auto">
                <p className="text-xs font-medium text-muted-foreground">
                  Bitcoin Address QR
                </p>
                <div className="text-foreground">
                  <QRCodeCanvas
                    value={bitcoinAddress}
                    size={160}
                    bgColor="transparent"
                    fgColor="currentColor"
                    level="M"
                  />
                </div>
              </div>
            )}
            {icpAddress && (
              <div className="bg-muted/40 border border-border rounded-lg p-3 flex flex-col items-center gap-2 max-w-[200px] mx-auto">
                <p className="text-xs font-medium text-muted-foreground">
                  ICP Address QR
                </p>
                <div className="text-foreground">
                  <QRCodeCanvas
                    value={icpAddress}
                    size={160}
                    bgColor="transparent"
                    fgColor="currentColor"
                    level="M"
                  />
                </div>
              </div>
            )}
            {oisyWalletLink && !bitcoinAddress && !icpAddress && (
              <div className="bg-muted/40 border border-border rounded-lg p-3 flex flex-col items-center gap-2 max-w-[200px] mx-auto">
                <p className="text-xs font-medium text-muted-foreground">
                  OISY Wallet QR
                </p>
                <div className="text-foreground">
                  <QRCodeCanvas
                    value={
                      oisyWalletLink.startsWith("http")
                        ? oisyWalletLink
                        : `https://${oisyWalletLink}`
                    }
                    size={160}
                    bgColor="transparent"
                    fgColor="currentColor"
                    level="M"
                  />
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            QR codes are generated locally for convenience only.
          </p>
        </div>
      )}

      {/* Instructions expand */}
      {showInstructions && paymentInstructions && (
        <div className="mt-3 bg-muted/40 rounded-lg px-3 py-2.5">
          <p className="text-xs text-foreground/90 leading-relaxed">
            {paymentInstructions}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Members are responsible for their own payments, records, taxes, and
          compliance. Payments are coordinated directly.
        </p>
        <Link
          to="/wallet-guide"
          data-ocid="member.wallet_guide_link"
          className="text-xs text-primary hover:underline transition-colors inline-flex items-center gap-1"
        >
          Wallet Guide →
        </Link>
      </div>
    </div>
  );
}

// ─── Community Trust Section ──────────────────────────────────────────────────
interface CommunityTrustProps {
  listingId: string;
  communityVerified: boolean;
  communityVerificationStatus: string;
  communityUpvotes: bigint;
  communityDownvotes: bigint;
  votingFrozen: boolean;
  ownerPrincipal: string | undefined;
}

function CommunityTrustSection({
  listingId,
  communityVerified,
  communityVerificationStatus,
  communityUpvotes,
  communityDownvotes,
  votingFrozen,
  ownerPrincipal,
}: CommunityTrustProps) {
  const { identity, isAuthenticated, login } = useAuth();
  const isLoggedIn = isAuthenticated;
  const callerPrincipal = identity?.getPrincipal().toText();
  const isOwner = !!(
    callerPrincipal &&
    ownerPrincipal &&
    callerPrincipal === ownerPrincipal
  );

  // Live trust data from backend (falls back to member record values)
  const { data: trustSummary } = useCommunityVotes(listingId);
  const { data: myVote } = useMyVote(listingId);
  const addVoteMutation = useAddCommunityVote();
  const removeVoteMutation = useRemoveCommunityVote();

  const upvotes = trustSummary
    ? Number(trustSummary.upvotes)
    : Number(communityUpvotes);
  const downvotes = trustSummary
    ? Number(trustSummary.downvotes)
    : Number(communityDownvotes);
  const isMutating = addVoteMutation.isPending || removeVoteMutation.isPending;

  // Determine current vote: "upvote" | "downvote" | null
  let currentVote: "upvote" | "downvote" | null = null;
  if (myVote) {
    currentVote = "upvote" in myVote ? "upvote" : "downvote";
  }

  function handleVote(voteType: "upvote" | "downvote") {
    if (isMutating) return;
    if (currentVote === voteType) {
      // clicking active vote removes it
      removeVoteMutation.mutate(listingId);
    } else {
      // cast or change vote
      addVoteMutation.mutate({ listingId, voteType });
    }
  }

  // Status badge rendering
  function renderStatusBadge() {
    if (communityVerified) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/25 text-primary border border-primary/50 shadow-[0_0_8px_oklch(0.72_0.19_152/0.35)]">
          <FontAwesomeIcon icon={faBolt} className="text-xs" /> Community
          Verified
        </span>
      );
    }
    if (communityVerificationStatus === "under_review") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[oklch(0.65_0.18_45/0.2)] text-[oklch(0.65_0.18_45)] border border-[oklch(0.65_0.18_45/0.4)]">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" /> Under
          Review
        </span>
      );
    }
    if (upvotes > 0) {
      return (
        <span className="text-xs text-muted-foreground italic">
          Building community trust…
        </span>
      );
    }
    return (
      <span className="text-xs text-muted-foreground italic">
        Be the first to confirm this listing
      </span>
    );
  }

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 mt-4"
      data-ocid="member.community_trust_section"
    >
      {/* Header */}
      <div className="mb-3">
        <h2 className="font-display font-semibold text-foreground text-sm">
          Community Trust
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Help local communities identify trusted businesses, producers, and
          organizations.
        </p>
      </div>

      {/* Trust counts + status badge */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/25"
          data-ocid="member.trust_upvote_count"
        >
          <FontAwesomeIcon icon={faThumbsUp} className="text-sm" />{" "}
          <span>{upvotes}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {upvotes === 1 ? "confirmation" : "confirmations"}
          </span>
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground border border-border"
          data-ocid="member.trust_downvote_count"
        >
          <FontAwesomeIcon icon={faThumbsDown} className="text-sm" />{" "}
          <span>{downvotes}</span>
          <span className="text-xs font-normal">
            {downvotes === 1 ? "concern" : "concerns"}
          </span>
        </span>
        {renderStatusBadge()}
      </div>

      {/* Under review message */}
      {communityVerificationStatus === "under_review" && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-[oklch(0.65_0.18_45/0.1)] border border-[oklch(0.65_0.18_45/0.3)]">
          <p className="text-xs text-[oklch(0.65_0.18_45)]">
            Admin is reviewing this listing.
          </p>
        </div>
      )}

      {/* Voting area */}
      {isOwner ? null : votingFrozen ? (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/40 border border-border"
          data-ocid="member.voting_frozen_notice"
        >
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <FontAwesomeIcon icon={faPause} className="text-xs" /> Voting is
            currently paused for this listing.
          </span>
        </div>
      ) : isLoggedIn ? (
        <div
          className="flex flex-wrap gap-3"
          data-ocid="member.trust_vote_buttons"
        >
          <button
            type="button"
            onClick={() => handleVote("upvote")}
            disabled={isMutating}
            data-ocid="member.confirm_listing_button"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-smooth min-h-[44px] disabled:opacity-60",
              currentVote === "upvote"
                ? "bg-primary/30 text-primary border-primary/60 shadow-[0_0_6px_oklch(0.72_0.19_152/0.4)]"
                : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:border-primary/50",
            )}
          >
            <FontAwesomeIcon icon={faThumbsUp} />{" "}
            {currentVote === "upvote" ? "Confirmed" : "Confirm This Listing"}
          </button>
          <button
            type="button"
            onClick={() => handleVote("downvote")}
            disabled={isMutating}
            data-ocid="member.report_concern_button"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-smooth min-h-[44px] disabled:opacity-60",
              currentVote === "downvote"
                ? "bg-[oklch(0.65_0.18_45/0.3)] text-[oklch(0.65_0.18_45)] border-[oklch(0.65_0.18_45/0.6)]"
                : "bg-muted text-muted-foreground border-border hover:bg-[oklch(0.65_0.18_45/0.1)] hover:text-[oklch(0.65_0.18_45)] hover:border-[oklch(0.65_0.18_45/0.35)]",
            )}
          >
            <FontAwesomeIcon icon={faThumbsDown} />{" "}
            {currentVote === "downvote" ? "Concern Reported" : "Report Concern"}
          </button>
        </div>
      ) : (
        <div data-ocid="member.trust_login_prompt">
          <button
            type="button"
            onClick={() => login()}
            data-ocid="member.trust_login_button"
            className="text-sm text-primary hover:underline transition-colors inline-flex items-center gap-1"
          >
            Log in to help verify this listing →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MemberProfile() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: member, isLoading } = useMember(id);

  if (isLoading) return <ProfileSkeleton />;
  if (!member) return <NotFound />;

  const website = fromOptional(member.website);
  const connectedPresence = member.connectedPresence ?? [];
  const featuredContent = member.featuredContent?.[0] ?? null;
  const phone = fromOptional(member.phone);
  const email = fromOptional(member.email);
  const subcategory = fromOptional(member.subcategory);
  const socialLinks = fromOptional(member.socialLinks);
  const paymentInstructions = fromOptional(member.paymentInstructions);
  const bitcoinAddress = fromOptional(member.bitcoinAddress);
  const icpAddress = fromOptional(member.icpAddress);
  const oisyWalletLink = fromOptional(member.oisyWalletLink);
  const paymentQrImage = fromOptional(member.paymentQrImage);
  const typeLabel =
    PARTICIPANT_LABELS[member.participantType] ?? member.participantType;
  const hasContact = !!(website || phone || email);
  const hasPayments =
    member.acceptsCash ||
    member.acceptsFiat ||
    member.acceptsBitcoin ||
    member.acceptsICP;

  return (
    <div data-ocid="member.page" className="min-h-screen bg-background">
      {/* Top nav bar */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link
            to="/map"
            data-ocid="member.back_link"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Directory</span>
          </Link>
          <ShareButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* ── Profile Header Card ────────────────────────────────────────── */}
        <div
          className="bg-card border border-border rounded-2xl p-6 mb-5 shadow-soft"
          data-ocid="member.profile_card"
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-soft">
              <span className="text-primary font-display font-bold text-2xl leading-none">
                {member.businessName.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              {/* Name + featured badge */}
              <div className="flex flex-wrap items-start gap-2">
                <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
                  {member.businessName}
                </h1>
                {member.featured && <MemberBadge variant="featured" />}
              </div>

              {/* Participant type */}
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {typeLabel}
              </p>

              {/* Location */}
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin size={11} className="flex-shrink-0" />
                {member.city},{" "}
                {PROVINCE_NAMES[member.province] ?? member.province}
              </p>

              {/* Badges row */}
              <div
                className="flex flex-wrap gap-1.5 mt-3"
                data-ocid="member.badges"
              >
                {isVerified(member.verificationStatus) && (
                  <MemberBadge variant="verified" />
                )}
                {member.communityVerified && (
                  <MemberBadge variant="communityVerified" />
                )}
                {member.participantType === "producer" && (
                  <MemberBadge variant="producer" />
                )}
                {member.participantType === "trade" && (
                  <MemberBadge variant="trade" />
                )}
                {member.participantType === "organization" && (
                  <MemberBadge variant="community" />
                )}
                {member.circularEconomyParticipant && (
                  <MemberBadge variant="circular" />
                )}
                {member.acceptsBitcoin && <MemberBadge variant="bitcoin" />}
                {member.acceptsICP && <MemberBadge variant="icp" />}
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs text-muted-foreground border border-border">
                  {member.category}
                </span>
                {subcategory && (
                  <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs text-muted-foreground border border-border">
                    {subcategory}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* About / Description */}
          <div
            className="bg-card border border-border rounded-xl p-5 md:col-span-2"
            data-ocid="member.about_section"
          >
            <h2 className="font-display font-semibold text-foreground mb-3 text-xs uppercase tracking-widest text-muted-foreground">
              About
            </h2>
            <p className="text-foreground leading-relaxed text-sm">
              {member.description}
            </p>
          </div>

          {/* Contact */}
          <div
            className="bg-card border border-border rounded-xl p-5"
            data-ocid="member.contact_section"
          >
            <h2 className="font-display font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Contact
            </h2>
            <div className="space-y-2.5">
              {member.contactName && (
                <p className="text-sm font-medium text-foreground">
                  {member.contactName}
                </p>
              )}
              {website && (
                <a
                  href={
                    website.startsWith("http") ? website : `https://${website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="member.website_link"
                  className="flex items-center gap-2 text-sm text-primary hover:underline min-w-0"
                >
                  <Globe size={14} className="flex-shrink-0" />
                  <span className="truncate">
                    {website.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  data-ocid="member.phone_link"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Phone size={14} className="flex-shrink-0" />
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  data-ocid="member.email_link"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Mail size={14} className="flex-shrink-0" />
                  {email}
                </a>
              )}
              {socialLinks && (
                <a
                  href={
                    socialLinks.startsWith("http")
                      ? socialLinks
                      : `https://${socialLinks}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="member.social_link"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-w-0"
                >
                  <Link2 size={14} className="flex-shrink-0" />
                  <span className="truncate">
                    {socialLinks.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              )}
              {!hasContact && !socialLinks && (
                <p className="text-sm text-muted-foreground">
                  Contact information not provided.
                </p>
              )}
            </div>
            {/* Email CTA button */}
            {email && (
              <a
                href={`mailto:${email}`}
                data-ocid="member.contact_cta"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-smooth"
              >
                <Mail size={14} />
                Contact {member.businessName.split(" ")[0]}
              </a>
            )}
          </div>

          {/* Payment Methods */}
          <PaymentSection
            hasPayments={hasPayments}
            acceptsCash={member.acceptsCash}
            acceptsFiat={member.acceptsFiat}
            acceptsBitcoin={member.acceptsBitcoin}
            acceptsICP={member.acceptsICP}
            bitcoinAddress={bitcoinAddress}
            icpAddress={icpAddress}
            oisyWalletLink={oisyWalletLink}
            paymentQrImage={paymentQrImage}
            paymentInstructions={paymentInstructions}
          />
        </div>

        {/* ── Featured Content ─────────────────────────────────────────── */}
        {featuredContent && <FeaturedSection featured={featuredContent} />}

        {/* ── Connected Presence ───────────────────────────────────────── */}
        {connectedPresence.length > 0 && (
          <ConnectedPresenceSection links={connectedPresence} />
        )}

        {/* ── Community Trust ───────────────────────────────────────────── */}
        <CommunityTrustSection
          listingId={member.id}
          communityVerified={member.communityVerified}
          communityVerificationStatus={member.communityVerificationStatus}
          communityUpvotes={member.communityUpvotes}
          communityDownvotes={member.communityDownvotes}
          votingFrozen={member.votingFrozen}
          ownerPrincipal={fromOptional(member.ownerPrincipal)}
        />

        {/* ── Support the Network ───────────────────────────────────────── */}
        <div
          className="mt-4 bg-card border border-primary/15 rounded-xl p-5"
          data-ocid="member.membership_cta"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">
                Help Build the Network
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Memberships help support the infrastructure that makes this
                directory possible.
              </p>
            </div>
            <Link
              to="/membership"
              data-ocid="member.membership_cta_button"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-primary/40 text-primary font-medium text-sm transition-smooth hover:bg-primary/10 min-h-[44px] flex-shrink-0 w-full sm:w-auto"
            >
              Help Build the Network
            </Link>
          </div>
        </div>

        {/* ── Verification / Meta footer ────────────────────────────────── */}
        <div className="mt-4 bg-muted/20 border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Verification:{" "}
            <span
              className={cn(
                "font-medium",
                isVerified(member.verificationStatus)
                  ? "text-primary"
                  : "text-foreground",
              )}
            >
              {getVerificationLabel(member.verificationStatus)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60">
            This platform is a directory and coordination tool only. No payments
            are processed here.
          </p>
        </div>
      </div>
    </div>
  );
}
