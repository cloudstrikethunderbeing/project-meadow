import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMembershipIntent } from "@/hooks/useQueries";
import type {
  MemberParticipantType,
  MembershipIntentInput,
  MembershipTier,
} from "@/types";
import { PROVINCES, PROVINCE_NAMES } from "@/types";
import {
  faBuilding,
  faCheck,
  faCircleCheck,
  faHeart,
  faLeaf,
  faShield,
  faStar,
  faTriangleExclamation,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { useRef, useState } from "react";

type TierAccent = "green" | "orange" | "purple";

const TIERS: Array<{
  id: MembershipTier;
  name: string;
  price: string;
  annualPrice?: string;
  badge: string;
  accent: TierAccent;
  icon: IconDefinition;
  benefits: string[];
  cta: string;
  highlight?: boolean;
}> = [
  {
    id: "communitySupporterTier",
    name: "Community Supporter",
    price: "$5/month",
    badge: "Supporter",
    accent: "green",
    icon: faHeart,
    benefits: [
      "Supporter badge on your profile",
      "Local chapter updates & news",
      "Early event access",
      "Help fund community onboarding",
    ],
    cta: "Join Waitlist",
  },
  {
    id: "builderMember",
    name: "Builder Member",
    price: "$10/month",
    badge: "Builder",
    accent: "green",
    icon: faUsers,
    benefits: [
      "Builder badge on your profile",
      "Invite local businesses to join",
      "Participate in feedback sessions",
      "Support education events",
    ],
    cta: "Join Waitlist",
    highlight: true,
  },
  {
    id: "localSponsor",
    name: "Local Sponsor",
    price: "$25/month",
    badge: "Sponsor",
    accent: "green",
    icon: faStar,
    benefits: [
      "Sponsor badge on your profile",
      "Name listed on community supporters page",
      "Support producer onboarding programs",
      "Help fund local chapter growth",
    ],
    cta: "Join Waitlist",
  },
  {
    id: "verifiedBusiness",
    name: "Verified Business Member",
    price: "$20/month",
    annualPrice: "$200/year",
    badge: "Verified Business",
    accent: "orange",
    icon: faBuilding,
    benefits: [
      "Business listing with verification request",
      "Community trust tools & badge",
      "Payment method display & local search placement",
      "Event visibility across the platform",
    ],
    cta: "Request Membership",
  },
  {
    id: "localProducer",
    name: "Local Producer Member",
    price: "$10/month",
    annualPrice: "$100/year",
    badge: "Local Producer",
    accent: "orange",
    icon: faLeaf,
    benefits: [
      "Producer listing with food category visibility",
      "Pickup & delivery info display",
      "Optional wallet & payment instructions",
      "Community verified badge eligibility",
    ],
    cta: "Request Membership",
  },
  {
    id: "communityPartner",
    name: "Community Partner",
    price: "Free or invite-based",
    badge: "Community Partner",
    accent: "purple",
    icon: faShield,
    benefits: [
      "Partner listing on the directory",
      "Event collaboration opportunities",
      "Chapter visibility & co-promotion",
      "Volunteer coordination support",
    ],
    cta: "Contact Us",
  },
];

const ACCENT_STYLES: Record<
  TierAccent,
  { bg: string; border: string; text: string; badge: string; iconBg: string }
> = {
  green: {
    bg: "bg-primary/5",
    border: "border-primary/30",
    text: "text-primary",
    badge:
      "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15",
    iconBg: "bg-primary/10 border-primary/20",
  },
  orange: {
    bg: "bg-[oklch(0.65_0.18_45/0.05)]",
    border: "border-[oklch(0.65_0.18_45/0.3)]",
    text: "text-[oklch(0.65_0.18_45)]",
    badge:
      "bg-[oklch(0.65_0.18_45/0.1)] text-[oklch(0.65_0.18_45)] border border-[oklch(0.65_0.18_45/0.2)]",
    iconBg: "bg-[oklch(0.65_0.18_45/0.1)] border-[oklch(0.65_0.18_45/0.2)]",
  },
  purple: {
    bg: "bg-[oklch(0.6_0.12_270/0.05)]",
    border: "border-[oklch(0.6_0.12_270/0.3)]",
    text: "text-[oklch(0.6_0.12_270)]",
    badge:
      "bg-[oklch(0.6_0.12_270/0.1)] text-[oklch(0.6_0.12_270)] border border-[oklch(0.6_0.12_270/0.2)]",
    iconBg: "bg-[oklch(0.6_0.12_270/0.1)] border-[oklch(0.6_0.12_270/0.2)]",
  },
};

type FormErrors = {
  name?: string;
  email?: string;
  city?: string;
  province?: string;
  participantType?: string;
  selectedTier?: string;
};

type FormState = {
  name: string;
  email: string;
  city: string;
  province: string;
  participantType: MemberParticipantType | "";
  message: string;
  displayPublicly: boolean;
  selectedTier: MembershipTier | null;
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.email.trim()) errors.email = "Email address is required.";
  else if (!validateEmail(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.province) errors.province = "Please select a province.";
  if (!form.participantType)
    errors.participantType = "Please select your participant type.";
  if (!form.selectedTier)
    errors.selectedTier = "Please select a membership tier.";
  return errors;
}

export function Membership() {
  const createIntent = useCreateMembershipIntent();
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    city: "",
    province: "",
    participantType: "",
    message: "",
    displayPublicly: false,
    selectedTier: null,
  });

  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;

  function touch(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function selectTier(tier: MembershipTier) {
    setForm((f) => ({ ...f, selectedTier: tier }));
    setTouched((t) => ({ ...t, selectedTier: true }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      city: true,
      province: true,
      participantType: true,
      selectedTier: true,
    });
    if (hasErrors || !form.selectedTier || !form.participantType) return;
    const input: MembershipIntentInput = {
      principal: [],
      name: form.name.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      province: form.province,
      membershipTier: form.selectedTier,
      participantType: form.participantType,
      message: form.message.trim() ? [form.message.trim()] : [],
      displayPublicly: form.displayPublicly,
    };
    try {
      await createIntent.mutateAsync(input);
      setSubmitted(true);
    } catch {
      // error handled via createIntent.error
    }
  }

  const selectedTierData = TIERS.find((t) => t.id === form.selectedTier);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-card border-b border-border py-14 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 text-xs">
              Optional Membership Support
            </Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
              Support Local Economic Resilience
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-3">
              Help us build and maintain community coordination infrastructure
              across Canada.
            </p>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-8">
              Choose the level of support that works for you. No payments are
              processed here — we're collecting interest to understand community
              needs.
            </p>
            {/* PRIMARY CTA — scrolls to tiers */}
            <button
              type="button"
              data-ocid="membership.hero_cta_button"
              onClick={() => {
                document
                  .getElementById("membership-tiers")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-base transition-smooth hover:bg-primary/85 shadow-soft min-h-[48px]"
            >
              Help Build the Network
            </button>
          </motion.div>
        </div>
      </section>

      {/* What it supports */}
      <section className="py-10 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-base font-display font-semibold text-foreground mb-5 text-center tracking-wide uppercase text-xs text-muted-foreground">
            Membership support helps fund
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              "Platform operations",
              "Local onboarding",
              "Education events",
              "Producer outreach",
              "Volunteer coordination",
              "Local chapter growth",
              "Community resilience programs",
              "Affordability initiatives",
              "Workshop facilitation",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-muted-foreground py-1.5"
              >
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-primary text-xs shrink-0"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier cards */}
      <section
        id="membership-tiers"
        className="py-14 px-4 bg-background"
        data-ocid="membership.tiers_section"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Choose Your Membership
            </h2>
            <p className="text-muted-foreground text-sm">
              Select the tier that fits how you'd like to participate. Click a
              tier to pre-fill the interest form below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TIERS.map((tier, i) => {
              const styles = ACCENT_STYLES[tier.accent];
              const isSelected = form.selectedTier === tier.id;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`membership.tier.${i + 1}`}
                >
                  <Card
                    className={`h-full flex flex-col transition-smooth ${
                      isSelected
                        ? `ring-2 ${styles.border.replace("border-", "ring-")} shadow-lifted`
                        : tier.highlight
                          ? `${styles.border} shadow-soft`
                          : "border-border"
                    } hover:shadow-lifted hover:-translate-y-0.5`}
                  >
                    <CardHeader className="pb-3">
                      {tier.highlight && (
                        <div className="mb-2">
                          <Badge className={`text-xs w-fit ${styles.badge}`}>
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${styles.iconBg}`}
                        >
                          <FontAwesomeIcon
                            icon={tier.icon}
                            className={`text-xl ${styles.text}`}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${styles.badge}`}
                        >
                          {tier.badge}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-foreground text-base leading-tight">
                        {tier.name}
                      </h3>
                      <div
                        className={`font-semibold text-sm ${styles.text} mt-0.5`}
                      >
                        {tier.price}
                        {tier.annualPrice && (
                          <span className="text-muted-foreground font-normal ml-2 text-xs">
                            or {tier.annualPrice}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4 pt-0">
                      <ul className="space-y-2 flex-1">
                        {tier.benefits.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2 text-xs text-muted-foreground"
                          >
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className={`text-xs ${styles.text} shrink-0 mt-0.5`}
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <Button
                        type="button"
                        className={`w-full mt-2 ${
                          isSelected
                            ? ""
                            : "variant" in tier
                              ? ""
                              : tier.highlight
                                ? ""
                                : ""
                        }`}
                        variant={
                          isSelected
                            ? "default"
                            : tier.highlight
                              ? "default"
                              : "outline"
                        }
                        onClick={() => selectTier(tier.id)}
                        data-ocid={`membership.tier_cta.${i + 1}`}
                      >
                        {isSelected ? (
                          <>
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-sm mr-1.5"
                            />
                            Selected — Fill Form Below
                          </>
                        ) : (
                          `Express Interest — ${tier.cta}`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Intent form */}
      <section
        id="membership-form"
        className="py-14 px-4 bg-muted/20"
        data-ocid="membership.form_section"
      >
        <div ref={formRef} className="container mx-auto max-w-xl">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
              data-ocid="membership.success_state"
            >
              <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-primary text-3xl"
                />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                Thanks for your interest!
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                We'll be in touch soon. Membership support helps fund education,
                onboarding, outreach, and community coordination.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary">
                <FontAwesomeIcon icon={faShield} className="text-xs" />
                No payment was collected
              </div>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Express Your Interest
                </h2>
                <p className="text-muted-foreground text-sm">
                  {selectedTierData ? (
                    <>
                      You've selected:{" "}
                      <span className="text-foreground font-medium">
                        {selectedTierData.name}
                      </span>
                    </>
                  ) : (
                    "Select a tier above, then fill in your details below."
                  )}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
                data-ocid="membership.form"
              >
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="membership-name">Full Name</Label>
                    <Input
                      id="membership-name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      onBlur={() => touch("name")}
                      placeholder="Jane Smith"
                      className={
                        touched.name && errors.name ? "border-destructive" : ""
                      }
                      data-ocid="membership.name_input"
                    />
                    {touched.name && errors.name && (
                      <p
                        className="flex items-center gap-1 text-xs text-destructive"
                        data-ocid="membership.name_field_error"
                      >
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          className="text-xs"
                        />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="membership-email">Email Address</Label>
                    <Input
                      id="membership-email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      onBlur={() => touch("email")}
                      placeholder="jane@example.com"
                      className={
                        touched.email && errors.email
                          ? "border-destructive"
                          : ""
                      }
                      data-ocid="membership.email_input"
                    />
                    {touched.email && errors.email && (
                      <p
                        className="flex items-center gap-1 text-xs text-destructive"
                        data-ocid="membership.email_field_error"
                      >
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          className="text-xs"
                        />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* City + Province */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="membership-city">City</Label>
                    <Input
                      id="membership-city"
                      value={form.city}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, city: e.target.value }))
                      }
                      onBlur={() => touch("city")}
                      placeholder="Vancouver"
                      className={
                        touched.city && errors.city ? "border-destructive" : ""
                      }
                      data-ocid="membership.city_input"
                    />
                    {touched.city && errors.city && (
                      <p
                        className="flex items-center gap-1 text-xs text-destructive"
                        data-ocid="membership.city_field_error"
                      >
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          className="text-xs"
                        />
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="membership-province">
                      Province / Territory
                    </Label>
                    <Select
                      value={form.province}
                      onValueChange={(v) => {
                        setForm((f) => ({ ...f, province: v }));
                        touch("province");
                      }}
                    >
                      <SelectTrigger
                        id="membership-province"
                        className={
                          touched.province && errors.province
                            ? "border-destructive"
                            : ""
                        }
                        data-ocid="membership.province_select"
                      >
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVINCES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {PROVINCE_NAMES[p] ?? p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.province && errors.province && (
                      <p
                        className="flex items-center gap-1 text-xs text-destructive"
                        data-ocid="membership.province_field_error"
                      >
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          className="text-xs"
                        />
                        {errors.province}
                      </p>
                    )}
                  </div>
                </div>

                {/* Participant type */}
                <div className="space-y-1.5">
                  <Label htmlFor="membership-type">I am a</Label>
                  <Select
                    value={form.participantType}
                    onValueChange={(v) => {
                      setForm((f) => ({
                        ...f,
                        participantType: v as MemberParticipantType,
                      }));
                      touch("participantType");
                    }}
                  >
                    <SelectTrigger
                      id="membership-type"
                      className={
                        touched.participantType && errors.participantType
                          ? "border-destructive"
                          : ""
                      }
                      data-ocid="membership.participant_type_select"
                    >
                      <SelectValue placeholder="Select your type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">
                        Individual / Community Member
                      </SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                      <SelectItem value="producer">
                        Local Producer / Farmer
                      </SelectItem>
                      <SelectItem value="organization">
                        Organization / Non-Profit
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {touched.participantType && errors.participantType && (
                    <p
                      className="flex items-center gap-1 text-xs text-destructive"
                      data-ocid="membership.participant_type_field_error"
                    >
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="text-xs"
                      />
                      {errors.participantType}
                    </p>
                  )}
                </div>

                {/* Tier select */}
                <div className="space-y-1.5">
                  <Label htmlFor="membership-tier">Membership Tier</Label>
                  <Select
                    value={form.selectedTier ?? ""}
                    onValueChange={(v) => {
                      setForm((f) => ({
                        ...f,
                        selectedTier: v as MembershipTier,
                      }));
                      touch("selectedTier");
                    }}
                  >
                    <SelectTrigger
                      id="membership-tier"
                      className={
                        touched.selectedTier && errors.selectedTier
                          ? "border-destructive"
                          : ""
                      }
                      data-ocid="membership.tier_select"
                    >
                      <SelectValue placeholder="Select a tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} — {t.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touched.selectedTier && errors.selectedTier && (
                    <p
                      className="flex items-center gap-1 text-xs text-destructive"
                      data-ocid="membership.tier_field_error"
                    >
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="text-xs"
                      />
                      {errors.selectedTier}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="membership-message">
                    Message{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="membership-message"
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Tell us about your community and why you'd like to support the network..."
                    data-ocid="membership.message_textarea"
                  />
                </div>

                {/* Display publicly */}
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-card border border-border">
                  <input
                    id="membership-public"
                    type="checkbox"
                    className="mt-0.5 accent-primary w-4 h-4 shrink-0 cursor-pointer"
                    checked={form.displayPublicly}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        displayPublicly: e.target.checked,
                      }))
                    }
                    data-ocid="membership.display_publicly_checkbox"
                  />
                  <Label
                    htmlFor="membership-public"
                    className="text-sm font-normal cursor-pointer leading-relaxed"
                  >
                    Display my name publicly as a supporter on the{" "}
                    <a
                      href="/supporters"
                      className="text-primary hover:underline"
                    >
                      Community Supporters page
                    </a>
                    .
                  </Label>
                </div>

                {/* Submission error */}
                {createIntent.isError && (
                  <p
                    className="flex items-center gap-1.5 text-sm text-destructive"
                    data-ocid="membership.error_state"
                  >
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className="text-sm"
                    />
                    Something went wrong. Please try again.
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createIntent.isPending}
                  data-ocid="membership.submit_button"
                >
                  {createIntent.isPending
                    ? "Submitting..."
                    : "Request Membership"}
                </Button>

                <p className="text-xs text-muted-foreground text-center pt-1">
                  No payment is processed here. We'll contact you to discuss
                  next steps.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Transparency */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-6">
            <h2 className="text-lg font-display font-semibold text-foreground mb-3">
              Transparency
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Membership support helps fund platform operations, local
              onboarding, education programs, community events, producer
              outreach, and volunteer coordination.
            </p>
          </div>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faShield} className="text-xs" />
              Transparency dashboard coming soon
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Non-investment disclaimer */}
          <div
            className="rounded-xl bg-muted/30 border border-border p-5"
            data-ocid="membership.disclaimer"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon
                  icon={faShield}
                  className="text-primary text-sm"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Community contribution — not an investment
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Memberships are voluntary community support contributions —
                  not investments, not platform fees, and not recurring billing.
                  There is no payment processing in this platform. This is
                  strictly a community interest form to validate participation
                  and prepare for sustainable coordination funding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
