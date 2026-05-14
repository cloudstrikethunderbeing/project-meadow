import { useAuth } from "@/hooks/useAuth";
import { useCreateMember } from "@/hooks/useQueries";
import type { MemberInput } from "@/types";
import {
  CATEGORIES,
  CATEGORY_SUBCATEGORIES,
  PROVINCES,
  PROVINCE_NAMES,
} from "@/types";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Leaf,
  MapPin,
  Users,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type JoinType =
  | "community"
  | "business"
  | "trade"
  | "producer"
  | "organization"
  | "";

const TYPE_CONFIG = [
  {
    id: "community" as const,
    icon: Users,
    title: "Support Local Communities",
    description:
      "Discover and support local businesses, producers, and organizations.",
    cta: "Join Community",
    color: "green",
  },
  {
    id: "business" as const,
    icon: Briefcase,
    title: "List Your Business",
    description: "Reach local customers and participate in community commerce.",
    cta: "List Business",
    color: "blue",
  },
  {
    id: "trade" as const,
    icon: Wrench,
    title: "Offer Your Services",
    description: "Connect directly with local homeowners and businesses.",
    cta: "Join as Tradesperson",
    color: "orange",
  },
  {
    id: "producer" as const,
    icon: Leaf,
    title: "Sell Local Food",
    description:
      "Connect farms, greenhouses, and producers directly with communities.",
    cta: "Join as Producer",
    color: "green",
  },
  {
    id: "organization" as const,
    icon: Building2,
    title: "Partner With The Network",
    description:
      "Collaborate as a non-profit, cooperative, union, or community initiative.",
    cta: "Become a Partner",
    color: "purple",
  },
];

const TYPE_LABELS: Record<string, string> = {
  community: "Community Member",
  business: "Business",
  trade: "Tradesperson",
  producer: "Food Producer",
  organization: "Organization",
};

const INTERESTS = [
  "Local food",
  "Trades",
  "Affordability",
  "Volunteering",
  "Bitcoin",
  "Decentralized infrastructure",
];

const ORG_TYPES = [
  "Non-profit",
  "Union",
  "Cooperative",
  "Education",
  "Affordability",
  "Sustainability",
  "Community initiative",
];

const EXPERIENCE_LEVELS = [
  "Under 1 year",
  "1–3 years",
  "3–10 years",
  "10+ years",
];

const DELIVERY_OPTIONS = ["Delivery", "Pickup", "Farmers Market", "CSA Box"];

const STEPS = ["Login", "Create Profile", "Submit"];

type FormState = {
  // Shared
  contactName: string;
  city: string;
  province: string;
  // Community
  selectedInterests: string[];
  // Business
  businessName: string;
  category: string;
  description: string;
  website: string;
  acceptsBitcoin: boolean;
  acceptsICP: boolean;
  // Trade
  tradeService: string;
  experience: string;
  phone: string;
  email: string;
  acceptsCash: boolean;
  acceptsFiat: boolean;
  // Producer
  producerName: string;
  selectedProducts: string[];
  selectedDelivery: string[];
  // Organization
  orgName: string;
  orgType: string;
  mission: string;
  orgWebsite: string;
  // Payment addresses (optional, all types)
  bitcoinAddress: string;
  icpAddress: string;
  oisyWalletLink: string;
  paymentQrImage: string;
  paymentInstructions: string;
};

const initialForm: FormState = {
  contactName: "",
  city: "",
  province: "",
  selectedInterests: [],
  businessName: "",
  category: CATEGORIES[0] as string,
  description: "",
  website: "",
  acceptsBitcoin: false,
  acceptsICP: false,
  tradeService: "",
  experience: "",
  phone: "",
  email: "",
  acceptsCash: true,
  acceptsFiat: true,
  producerName: "",
  selectedProducts: [],
  selectedDelivery: [],
  orgName: "",
  orgType: "",
  mission: "",
  orgWebsite: "",
  bitcoinAddress: "",
  icpAddress: "",
  oisyWalletLink: "",
  paymentQrImage: "",
  paymentInstructions: "",
};

function colorClasses(color: string) {
  switch (color) {
    case "green":
      return {
        icon: "text-primary",
        iconBg: "bg-primary/10 border-primary/20",
        card: "hover:border-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary-raw),0.08)]",
        cta: "bg-primary/10 text-primary border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground",
      };
    case "orange":
      return {
        icon: "text-amber-400",
        iconBg: "bg-amber-400/10 border-amber-400/20",
        card: "hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.08)]",
        cta: "bg-amber-400/10 text-amber-400 border border-amber-400/30 group-hover:bg-amber-500 group-hover:text-background",
      };
    case "blue":
      return {
        icon: "text-blue-400",
        iconBg: "bg-blue-400/10 border-blue-400/20",
        card: "hover:border-blue-400/40 hover:shadow-[0_0_20px_rgba(96,165,250,0.08)]",
        cta: "bg-blue-400/10 text-blue-400 border border-blue-400/30 group-hover:bg-blue-500 group-hover:text-background",
      };
    case "purple":
      return {
        icon: "text-violet-400",
        iconBg: "bg-violet-400/10 border-violet-400/20",
        card: "hover:border-violet-400/40 hover:shadow-[0_0_20px_rgba(167,139,250,0.08)]",
        cta: "bg-violet-400/10 text-violet-400 border border-violet-400/30 group-hover:bg-violet-500 group-hover:text-background",
      };
    default:
      return {
        icon: "text-primary",
        iconBg: "bg-primary/10 border-primary/20",
        card: "hover:border-primary/40",
        cta: "bg-primary/10 text-primary border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground",
      };
  }
}

const SUCCESS_CONFIG: Record<
  string,
  {
    message: string;
    ctaLinks: { label: string; to: string; primary?: boolean }[];
  }
> = {
  community: {
    message: "You're now part of the community network.",
    ctaLinks: [
      { label: "Explore Map", to: "/map", primary: true },
      { label: "Volunteer", to: "/volunteer" },
      { label: "Invite Businesses", to: "/join" },
    ],
  },
  business: {
    message: "Your business has been submitted for review.",
    ctaLinks: [{ label: "View Directory", to: "/map", primary: true }],
  },
  trade: {
    message: "You're now pending verification.",
    ctaLinks: [{ label: "View Directory", to: "/map", primary: true }],
  },
  producer: {
    message: "You're helping strengthen local food resilience.",
    ctaLinks: [{ label: "View Directory", to: "/map", primary: true }],
  },
  organization: {
    message: "Your partnership request has been submitted.",
    ctaLinks: [{ label: "View Directory", to: "/map", primary: true }],
  },
};

function ProgressBar({ step }: { step: number }) {
  return (
    <nav
      className="flex items-center justify-center gap-0 mb-10"
      aria-label="Onboarding progress"
    >
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step
                  ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(var(--primary-raw),0.4)]"
                  : i === step
                    ? "bg-primary/15 border-2 border-primary text-primary"
                    : "bg-muted border border-border text-muted-foreground"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Check size={14} strokeWidth={2.5} /> : i + 1}
            </div>
            <span
              className={`text-xs hidden sm:block transition-colors ${
                i === step
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 h-px mx-2 mb-5 transition-all duration-300 ${
                i < step ? "bg-primary/60" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </nav>
  );
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-foreground mb-1.5"
    >
      {children}
      {optional && (
        <span className="text-muted-foreground font-normal ml-1">
          (optional)
        </span>
      )}
    </label>
  );
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  ocid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  ocid?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-ocid={ocid}
      className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
    />
  );
}

function ProvinceSelect({
  id,
  value,
  onChange,
  ocid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  ocid?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-ocid={ocid}
      className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
    >
      <option value="">Select province / territory</option>
      {PROVINCES.map((p) => (
        <option key={p} value={p}>
          {PROVINCE_NAMES[p]} ({p})
        </option>
      ))}
    </select>
  );
}

function ChipToggle({
  label,
  selected,
  onToggle,
  ocid,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
  ocid?: string;
}) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onToggle}
      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 min-h-[36px] ${
        selected
          ? "bg-primary/15 border-primary/50 text-primary shadow-[0_0_8px_rgba(var(--primary-raw),0.15)]"
          : "bg-muted/50 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      {selected && <Check size={10} className="inline mr-1" />}
      {label}
    </button>
  );
}

function CheckItem({
  id,
  label,
  checked,
  onChange,
  ocid,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  ocid?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2.5 cursor-pointer group min-h-[44px]"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        data-ocid={ocid}
        className="w-4 h-4 accent-primary rounded"
      />
      <span className="text-sm text-foreground group-hover:text-foreground/90">
        {label}
      </span>
    </label>
  );
}

// ─── Shared Payment Address Fields ─────────────────────────────────────────

function PaymentAddressFields({
  form,
  setField,
}: {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-4 pt-3 border-t border-border mt-1">
      <div>
        <p className="text-sm font-medium text-foreground">
          Payment Details{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Displayed on your public profile. Payments happen directly between you
          and your customers, not through this platform.
        </p>
      </div>
      <div>
        <FieldLabel htmlFor="join-btc-addr" optional>
          Bitcoin Address
        </FieldLabel>
        <TextInput
          id="join-btc-addr"
          value={form.bitcoinAddress}
          onChange={(v) => setField("bitcoinAddress", v)}
          placeholder="bc1q... or 3..."
          ocid="join.bitcoin_address_input"
        />
      </div>
      <div>
        <FieldLabel htmlFor="join-icp-addr" optional>
          ICP Address / Principal
        </FieldLabel>
        <TextInput
          id="join-icp-addr"
          value={form.icpAddress}
          onChange={(v) => setField("icpAddress", v)}
          placeholder="xxxxx-xxxxx-..."
          ocid="join.icp_address_input"
        />
      </div>
      <div>
        <FieldLabel htmlFor="join-oisy-link" optional>
          OISY Wallet Link
        </FieldLabel>
        <TextInput
          id="join-oisy-link"
          type="url"
          value={form.oisyWalletLink}
          onChange={(v) => setField("oisyWalletLink", v)}
          placeholder="https://oisy.com/..."
          ocid="join.oisy_wallet_link_input"
        />
      </div>
      <div>
        <FieldLabel htmlFor="join-qr-url" optional>
          QR Code Image URL
        </FieldLabel>
        <TextInput
          id="join-qr-url"
          type="url"
          value={form.paymentQrImage}
          onChange={(v) => setField("paymentQrImage", v)}
          placeholder="https://... (direct link to your QR image)"
          ocid="join.payment_qr_image_input"
        />
      </div>
      <div>
        <FieldLabel htmlFor="join-pay-inst" optional>
          Payment Instructions
        </FieldLabel>
        <textarea
          id="join-pay-inst"
          rows={2}
          value={form.paymentInstructions}
          onChange={(e) => setField("paymentInstructions", e.target.value)}
          placeholder="e.g. Send to the address above with a note"
          data-ocid="join.payment_instructions_textarea"
          className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}

// ─── Role-specific forms ────────────────────────────────────────────────────

function CommunityForm({
  form,
  setField,
  toggleChip,
}: {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  toggleChip: (
    field: "selectedInterests" | "selectedProducts" | "selectedDelivery",
    val: string,
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="join-contact">Your Name</FieldLabel>
        <TextInput
          id="join-contact"
          value={form.contactName}
          onChange={(v) => setField("contactName", v)}
          placeholder="Jane Smith"
          ocid="join.contact_name_input"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="join-com-city">City</FieldLabel>
          <TextInput
            id="join-com-city"
            value={form.city}
            onChange={(v) => setField("city", v)}
            placeholder="Toronto"
            ocid="join.city_input"
          />
        </div>
        <div>
          <FieldLabel htmlFor="join-com-province">Province</FieldLabel>
          <ProvinceSelect
            id="join-com-province"
            value={form.province}
            onChange={(v) => setField("province", v)}
            ocid="join.province_select"
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Interests</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <ChipToggle
              key={interest}
              label={interest}
              selected={form.selectedInterests.includes(interest)}
              onToggle={() => toggleChip("selectedInterests", interest)}
              ocid={`join.interest_${interest.toLowerCase().replace(/ /g, "_")}_toggle`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessForm({
  form,
  setField,
}: {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="join-biz-name">Business Name</FieldLabel>
        <TextInput
          id="join-biz-name"
          value={form.businessName}
          onChange={(v) => setField("businessName", v)}
          placeholder="Maple Ridge Market"
          ocid="join.business_name_input"
        />
      </div>
      <div>
        <FieldLabel htmlFor="join-biz-category">Category</FieldLabel>
        <select
          id="join-biz-category"
          value={form.category}
          onChange={(e) => setField("category", e.target.value)}
          data-ocid="join.category_select"
          className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel htmlFor="join-biz-desc">Description</FieldLabel>
        <textarea
          id="join-biz-desc"
          rows={3}
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Tell the community about your business..."
          data-ocid="join.description_textarea"
          className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="join-biz-city">City</FieldLabel>
          <TextInput
            id="join-biz-city"
            value={form.city}
            onChange={(v) => setField("city", v)}
            placeholder="Vancouver"
            ocid="join.city_input"
          />
        </div>
        <div>
          <FieldLabel htmlFor="join-biz-province">Province</FieldLabel>
          <ProvinceSelect
            id="join-biz-province"
            value={form.province}
            onChange={(v) => setField("province", v)}
            ocid="join.province_select"
          />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="join-biz-website" optional>
          Website
        </FieldLabel>
        <TextInput
          id="join-biz-website"
          type="url"
          value={form.website}
          onChange={(v) => setField("website", v)}
          placeholder="https://yourbusiness.ca"
          ocid="join.website_input"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          Accepted Payment Methods
        </p>
        <div className="space-y-1">
          <CheckItem
            id="join-biz-btc"
            label="Accepts Bitcoin"
            checked={form.acceptsBitcoin}
            onChange={(v) => setField("acceptsBitcoin", v)}
            ocid="join.acceptsBitcoin_checkbox"
          />
          <CheckItem
            id="join-biz-icp"
            label="Accepts ICP"
            checked={form.acceptsICP}
            onChange={(v) => setField("acceptsICP", v)}
            ocid="join.acceptsICP_checkbox"
          />
        </div>
      </div>
      <PaymentAddressFields form={form} setField={setField} />
    </div>
  );
}

function TradeForm({
  form,
  setField,
}: {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const tradeOptions = CATEGORY_SUBCATEGORIES.Trades ?? [];
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="join-trade-service">Trade / Service</FieldLabel>
        <select
          id="join-trade-service"
          value={form.tradeService}
          onChange={(e) => setField("tradeService", e.target.value)}
          data-ocid="join.trade_service_select"
          className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
        >
          <option value="">Select your trade</option>
          {tradeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="join-trade-city">City</FieldLabel>
          <TextInput
            id="join-trade-city"
            value={form.city}
            onChange={(v) => setField("city", v)}
            placeholder="Calgary"
            ocid="join.city_input"
          />
        </div>
        <div>
          <FieldLabel htmlFor="join-trade-province">Province</FieldLabel>
          <ProvinceSelect
            id="join-trade-province"
            value={form.province}
            onChange={(v) => setField("province", v)}
            ocid="join.province_select"
          />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="join-trade-exp">Experience Level</FieldLabel>
        <select
          id="join-trade-exp"
          value={form.experience}
          onChange={(e) => setField("experience", e.target.value)}
          data-ocid="join.experience_select"
          className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
        >
          <option value="">Select experience</option>
          {EXPERIENCE_LEVELS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="join-trade-phone" optional>
            Phone
          </FieldLabel>
          <TextInput
            id="join-trade-phone"
            type="tel"
            value={form.phone}
            onChange={(v) => setField("phone", v)}
            placeholder="(416) 555-0123"
            ocid="join.phone_input"
          />
        </div>
        <div>
          <FieldLabel htmlFor="join-trade-email" optional>
            Email
          </FieldLabel>
          <TextInput
            id="join-trade-email"
            type="email"
            value={form.email}
            onChange={(v) => setField("email", v)}
            placeholder="your@email.ca"
            ocid="join.email_input"
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          Payment Preferences
        </p>
        <div className="grid grid-cols-2 gap-1">
          <CheckItem
            id="join-trade-cash"
            label="Cash"
            checked={form.acceptsCash}
            onChange={(v) => setField("acceptsCash", v)}
            ocid="join.acceptsCash_checkbox"
          />
          <CheckItem
            id="join-trade-fiat"
            label="Fiat / E-Transfer"
            checked={form.acceptsFiat}
            onChange={(v) => setField("acceptsFiat", v)}
            ocid="join.acceptsFiat_checkbox"
          />
          <CheckItem
            id="join-trade-btc"
            label="Bitcoin"
            checked={form.acceptsBitcoin}
            onChange={(v) => setField("acceptsBitcoin", v)}
            ocid="join.acceptsBitcoin_checkbox"
          />
          <CheckItem
            id="join-trade-icp"
            label="ICP"
            checked={form.acceptsICP}
            onChange={(v) => setField("acceptsICP", v)}
            ocid="join.acceptsICP_checkbox"
          />
        </div>
      </div>
      <PaymentAddressFields form={form} setField={setField} />
    </div>
  );
}

function ProducerForm({
  form,
  setField,
  toggleChip,
}: {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  toggleChip: (
    field: "selectedInterests" | "selectedProducts" | "selectedDelivery",
    val: string,
  ) => void;
}) {
  const foodSubcats = CATEGORY_SUBCATEGORIES["Food Producers"] ?? [];
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="join-prod-name">Producer / Farm Name</FieldLabel>
        <TextInput
          id="join-prod-name"
          value={form.producerName}
          onChange={(v) => setField("producerName", v)}
          placeholder="Sunrise Organic Farm"
          ocid="join.producer_name_input"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          Products Offered
        </p>
        <div className="flex flex-wrap gap-2">
          {foodSubcats.map((prod) => (
            <ChipToggle
              key={prod}
              label={prod}
              selected={form.selectedProducts.includes(prod)}
              onToggle={() => toggleChip("selectedProducts", prod)}
              ocid={`join.product_${prod.toLowerCase().replace(/ /g, "_")}_toggle`}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          Delivery / Pickup Options
        </p>
        <div className="grid grid-cols-2 gap-1">
          {DELIVERY_OPTIONS.map((opt) => (
            <CheckItem
              key={opt}
              id={`join-delivery-${opt.toLowerCase().replace(/ /g, "-")}`}
              label={opt}
              checked={form.selectedDelivery.includes(opt)}
              onChange={() => toggleChip("selectedDelivery", opt)}
              ocid={`join.delivery_${opt.toLowerCase().replace(/ /g, "_")}_checkbox`}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="join-prod-city">City</FieldLabel>
          <TextInput
            id="join-prod-city"
            value={form.city}
            onChange={(v) => setField("city", v)}
            placeholder="Guelph"
            ocid="join.city_input"
          />
        </div>
        <div>
          <FieldLabel htmlFor="join-prod-province">Province</FieldLabel>
          <ProvinceSelect
            id="join-prod-province"
            value={form.province}
            onChange={(v) => setField("province", v)}
            ocid="join.province_select"
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          Payment Preferences
        </p>
        <div className="grid grid-cols-2 gap-1">
          <CheckItem
            id="join-prod-cash"
            label="Cash"
            checked={form.acceptsCash}
            onChange={(v) => setField("acceptsCash", v)}
            ocid="join.acceptsCash_checkbox"
          />
          <CheckItem
            id="join-prod-fiat"
            label="Fiat / E-Transfer"
            checked={form.acceptsFiat}
            onChange={(v) => setField("acceptsFiat", v)}
            ocid="join.acceptsFiat_checkbox"
          />
          <CheckItem
            id="join-prod-btc"
            label="Bitcoin"
            checked={form.acceptsBitcoin}
            onChange={(v) => setField("acceptsBitcoin", v)}
            ocid="join.acceptsBitcoin_checkbox"
          />
          <CheckItem
            id="join-prod-icp"
            label="ICP"
            checked={form.acceptsICP}
            onChange={(v) => setField("acceptsICP", v)}
            ocid="join.acceptsICP_checkbox"
          />
        </div>
      </div>
      <PaymentAddressFields form={form} setField={setField} />
    </div>
  );
}

function OrgForm({
  form,
  setField,
}: {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="join-org-name">Organization Name</FieldLabel>
        <TextInput
          id="join-org-name"
          value={form.orgName}
          onChange={(v) => setField("orgName", v)}
          placeholder="Community Food Coalition"
          ocid="join.org_name_input"
        />
      </div>
      <div>
        <FieldLabel htmlFor="join-org-type">Organization Type</FieldLabel>
        <select
          id="join-org-type"
          value={form.orgType}
          onChange={(e) => setField("orgType", e.target.value)}
          data-ocid="join.org_type_select"
          className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
        >
          <option value="">Select type</option>
          {ORG_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel htmlFor="join-org-mission">Mission Statement</FieldLabel>
        <textarea
          id="join-org-mission"
          rows={3}
          value={form.mission}
          onChange={(e) => setField("mission", e.target.value)}
          placeholder="Describe your organization's mission and community impact..."
          data-ocid="join.mission_textarea"
          className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <FieldLabel htmlFor="join-org-website" optional>
          Website
        </FieldLabel>
        <TextInput
          id="join-org-website"
          type="url"
          value={form.orgWebsite}
          onChange={(v) => setField("orgWebsite", v)}
          placeholder="https://yourorg.ca"
          ocid="join.website_input"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="join-org-city">City</FieldLabel>
          <TextInput
            id="join-org-city"
            value={form.city}
            onChange={(v) => setField("city", v)}
            placeholder="Ottawa"
            ocid="join.city_input"
          />
        </div>
        <div>
          <FieldLabel htmlFor="join-org-province">Province</FieldLabel>
          <ProvinceSelect
            id="join-org-province"
            value={form.province}
            onChange={(v) => setField("province", v)}
            ocid="join.province_select"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function Join() {
  const { isAuthenticated, login, loginStatus } = useAuth();
  const search = useSearch({ strict: false }) as { type?: string };
  const queryType = search.type;
  const [joinType, setJoinType] = useState<JoinType>(
    (queryType as JoinType) ?? "",
  );
  const [step, setStep] = useState<number>(
    joinType ? (isAuthenticated ? 1 : 0) : -1,
  ); // -1 = type selector
  const [success, setSuccess] = useState(false);
  const [form, setFormState] = useState<FormState>(initialForm);
  const createMember = useCreateMember();

  function setField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setFormState((prev) => ({ ...prev, [k]: v }));
  }

  function toggleChip(
    field: "selectedInterests" | "selectedProducts" | "selectedDelivery",
    val: string,
  ) {
    setFormState((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(val)
        ? (prev[field] as string[]).filter((x) => x !== val)
        : [...(prev[field] as string[]), val],
    }));
  }

  function selectType(type: JoinType) {
    setJoinType(type);
    setStep(isAuthenticated ? 1 : 0);
  }

  function isFormValid(): boolean {
    if (!form.city.trim() || !form.province) return false;
    switch (joinType) {
      case "community":
        return !!form.contactName.trim();
      case "business":
        return !!form.businessName.trim() && !!form.description.trim();
      case "trade":
        return !!form.tradeService;
      case "producer":
        return !!form.producerName.trim();
      case "organization":
        return !!form.orgName.trim() && !!form.orgType && !!form.mission.trim();
      default:
        return false;
    }
  }

  async function handleSubmit() {
    try {
      let input: MemberInput;
      if (joinType === "community") {
        input = {
          participantType: "community",
          businessName: form.contactName || "Community Member",
          contactName: form.contactName,
          category: "Community",
          subcategory: [],
          description: `Interests: ${form.selectedInterests.join(", ") || "local resilience"}`,
          city: form.city,
          province: form.province,
          region: [],
          postalCode: [],
          latitude: [],
          longitude: [],
          website: [],
          phone: [],
          email: [],
          socialLinks: [],
          acceptsBitcoin: form.selectedInterests.includes("Bitcoin"),
          acceptsICP: form.selectedInterests.includes(
            "Decentralized infrastructure",
          ),
          acceptsCash: true,
          acceptsFiat: true,
          paymentInstructions: form.paymentInstructions
            ? [form.paymentInstructions]
            : [],
          bitcoinAddress: form.bitcoinAddress ? [form.bitcoinAddress] : [],
          icpAddress: form.icpAddress ? [form.icpAddress] : [],
          oisyWalletLink: form.oisyWalletLink ? [form.oisyWalletLink] : [],
          paymentQrImage: form.paymentQrImage ? [form.paymentQrImage] : [],
          circularEconomyParticipant: false,
        };
      } else if (joinType === "trade") {
        input = {
          participantType: "trade",
          businessName: form.tradeService,
          contactName: form.contactName,
          category: "Trades",
          subcategory: form.tradeService ? [form.tradeService] : [],
          description: `Experience: ${form.experience || "Not specified"}`,
          city: form.city,
          province: form.province,
          region: [],
          postalCode: [],
          latitude: [],
          longitude: [],
          website: [],
          phone: form.phone ? [form.phone] : [],
          email: form.email ? [form.email] : [],
          socialLinks: [],
          acceptsBitcoin: form.acceptsBitcoin,
          acceptsICP: form.acceptsICP,
          acceptsCash: form.acceptsCash,
          acceptsFiat: form.acceptsFiat,
          paymentInstructions: form.paymentInstructions
            ? [form.paymentInstructions]
            : [],
          bitcoinAddress: form.bitcoinAddress ? [form.bitcoinAddress] : [],
          icpAddress: form.icpAddress ? [form.icpAddress] : [],
          oisyWalletLink: form.oisyWalletLink ? [form.oisyWalletLink] : [],
          paymentQrImage: form.paymentQrImage ? [form.paymentQrImage] : [],
          circularEconomyParticipant: false,
        };
      } else if (joinType === "producer") {
        input = {
          participantType: "producer",
          businessName: form.producerName,
          contactName: form.contactName,
          category: "Food Producers",
          subcategory:
            form.selectedProducts.length > 0
              ? [form.selectedProducts.join(", ")]
              : [],
          description: `Products: ${form.selectedProducts.join(", ") || "Local produce"}. Delivery: ${form.selectedDelivery.join(", ") || "By arrangement"}.`,
          city: form.city,
          province: form.province,
          region: [],
          postalCode: [],
          latitude: [],
          longitude: [],
          website: [],
          phone: [],
          email: [],
          socialLinks: [],
          acceptsBitcoin: form.acceptsBitcoin,
          acceptsICP: form.acceptsICP,
          acceptsCash: form.acceptsCash,
          acceptsFiat: form.acceptsFiat,
          paymentInstructions: form.paymentInstructions
            ? [form.paymentInstructions]
            : [],
          bitcoinAddress: form.bitcoinAddress ? [form.bitcoinAddress] : [],
          icpAddress: form.icpAddress ? [form.icpAddress] : [],
          oisyWalletLink: form.oisyWalletLink ? [form.oisyWalletLink] : [],
          paymentQrImage: form.paymentQrImage ? [form.paymentQrImage] : [],
          circularEconomyParticipant: true,
        };
      } else if (joinType === "organization") {
        input = {
          participantType: "organization",
          businessName: form.orgName,
          contactName: form.contactName,
          category: "Community",
          subcategory: form.orgType ? [form.orgType] : [],
          description: form.mission,
          city: form.city,
          province: form.province,
          region: [],
          postalCode: [],
          latitude: [],
          longitude: [],
          website: form.orgWebsite ? [form.orgWebsite] : [],
          phone: [],
          email: [],
          socialLinks: [],
          acceptsBitcoin: false,
          acceptsICP: false,
          acceptsCash: false,
          acceptsFiat: false,
          paymentInstructions: form.paymentInstructions
            ? [form.paymentInstructions]
            : [],
          bitcoinAddress: form.bitcoinAddress ? [form.bitcoinAddress] : [],
          icpAddress: form.icpAddress ? [form.icpAddress] : [],
          oisyWalletLink: form.oisyWalletLink ? [form.oisyWalletLink] : [],
          paymentQrImage: form.paymentQrImage ? [form.paymentQrImage] : [],
          circularEconomyParticipant: false,
        };
      } else {
        // business
        input = {
          participantType: "business",
          businessName: form.businessName,
          contactName: form.contactName,
          category: form.category,
          subcategory: [],
          description: form.description,
          city: form.city,
          province: form.province,
          region: [],
          postalCode: [],
          latitude: [],
          longitude: [],
          website: form.website ? [form.website] : [],
          phone: [],
          email: [],
          socialLinks: [],
          acceptsBitcoin: form.acceptsBitcoin,
          acceptsICP: form.acceptsICP,
          acceptsCash: true,
          acceptsFiat: true,
          paymentInstructions: form.paymentInstructions
            ? [form.paymentInstructions]
            : [],
          bitcoinAddress: form.bitcoinAddress ? [form.bitcoinAddress] : [],
          icpAddress: form.icpAddress ? [form.icpAddress] : [],
          oisyWalletLink: form.oisyWalletLink ? [form.oisyWalletLink] : [],
          paymentQrImage: form.paymentQrImage ? [form.paymentQrImage] : [],
          circularEconomyParticipant: false,
        };
      }
      await createMember.mutateAsync(input);
      setSuccess(true);
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  }

  // ─── Review summary rows ────────────────────────────────────────────────
  function getSummaryRows(): { label: string; value: string }[] {
    const base = [
      { label: "Type", value: TYPE_LABELS[joinType] ?? joinType },
      {
        label: "Location",
        value: [form.city, PROVINCE_NAMES[form.province]]
          .filter(Boolean)
          .join(", "),
      },
    ];
    switch (joinType) {
      case "community":
        return [
          ...base.slice(0, 1),
          { label: "Name", value: form.contactName },
          base[1],
          {
            label: "Interests",
            value: form.selectedInterests.join(", ") || "—",
          },
        ];
      case "business":
        return [
          ...base.slice(0, 1),
          { label: "Business", value: form.businessName },
          { label: "Category", value: form.category },
          base[1],
          { label: "Website", value: form.website || "—" },
        ];
      case "trade":
        return [
          ...base.slice(0, 1),
          { label: "Trade", value: form.tradeService },
          { label: "Experience", value: form.experience || "—" },
          base[1],
        ];
      case "producer":
        return [
          ...base.slice(0, 1),
          { label: "Producer", value: form.producerName },
          { label: "Products", value: form.selectedProducts.join(", ") || "—" },
          { label: "Delivery", value: form.selectedDelivery.join(", ") || "—" },
          base[1],
        ];
      case "organization":
        return [
          ...base.slice(0, 1),
          { label: "Organization", value: form.orgName },
          { label: "Org Type", value: form.orgType },
          base[1],
        ];
      default:
        return base;
    }
  }

  // ─── Success screen ─────────────────────────────────────────────────────
  if (success) {
    const config = SUCCESS_CONFIG[joinType] ?? SUCCESS_CONFIG.community;
    return (
      <motion.div
        data-ocid="join.success_state"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-background flex items-center justify-center px-4 py-12"
      >
        <div className="max-w-md w-full space-y-4">
          <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(var(--primary-raw),0.2)]">
              <Check size={28} className="text-primary" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">
              Welcome to the Network!
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {config.message}
            </p>
            <div className="flex flex-col gap-3">
              {config.ctaLinks.map((link) => (
                <Link
                  key={link.to + link.label}
                  to={link.to}
                  data-ocid={`join.${link.label.toLowerCase().replace(/ /g, "_")}_button`}
                  className={`px-6 py-3 rounded-lg text-sm font-medium text-center transition-smooth min-h-[44px] flex items-center justify-center ${
                    link.primary
                      ? "bg-primary text-primary-foreground hover:bg-primary/85"
                      : "border border-border text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Membership CTA card */}
          <div
            className="bg-card border border-primary/20 rounded-2xl p-6 text-center"
            data-ocid="join.membership_cta_card"
          >
            <div className="text-2xl mb-2 text-primary">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2 text-base">
              Support the Network
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Want to help grow this community? Membership support helps fund
              onboarding, education, and local coordination.
            </p>
            <Link
              to="/membership"
              data-ocid="join.learn_membership_button"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg border border-primary/40 text-primary font-medium text-sm transition-smooth hover:bg-primary/10 min-h-[44px]"
            >
              Learn About Membership
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── Type selector (step -1) ─────────────────────────────────────────────
  if (step === -1) {
    return (
      <div
        data-ocid="join.page"
        className="min-h-screen bg-background py-16 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
              <MapPin size={12} />
              Join the Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Choose How You Participate
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              Join thousands of Canadians building stronger, more resilient
              local economies. Choose the path that best describes you.
            </p>
            <p className="text-sm text-muted-foreground/70">
              You do not need a wallet to join.{" "}
              <Link
                to="/wallet-guide"
                data-ocid="join.wallet_guide_link"
                className="text-primary hover:underline transition-colors"
              >
                Learn about wallets
              </Link>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TYPE_CONFIG.map((type, i) => {
              const Icon = type.icon;
              const cls = colorClasses(type.color);
              return (
                <motion.button
                  key={type.id}
                  type="button"
                  data-ocid={`join.type_${type.id}_button`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => selectType(type.id)}
                  className={`group text-left p-6 rounded-2xl border border-border bg-card transition-all duration-200 cursor-pointer ${cls.card}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${cls.iconBg}`}
                  >
                    <Icon size={22} className={cls.icon} />
                  </div>
                  <h3 className="text-base font-display font-semibold text-foreground mb-2">
                    {type.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {type.description}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${cls.cta}`}
                  >
                    {type.cta}
                    <ArrowRight size={12} />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Steps 0–2 ───────────────────────────────────────────────────────────
  return (
    <div
      data-ocid="join.page"
      className="min-h-screen bg-background py-12 px-4"
    >
      <div className="max-w-lg mx-auto">
        {/* Back to type selector */}
        <button
          type="button"
          onClick={() => setStep(-1)}
          data-ocid="join.back_to_type_button"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Change participation type
        </button>

        {/* Type badge */}
        <div className="flex items-center gap-2 mb-6">
          {(() => {
            const cfg = TYPE_CONFIG.find((t) => t.id === joinType);
            const Icon = cfg?.icon ?? Users;
            return (
              <>
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {TYPE_LABELS[joinType]}
                </span>
              </>
            );
          })()}
        </div>

        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            {/* ── Step 0: Login ── */}
            {step === 0 && (
              <div className="text-center py-4" data-ocid="join.login_step">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <Users size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-display font-bold text-foreground mb-2">
                  Sign In to Continue
                </h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                  Use Internet Identity for secure, privacy-first access — no
                  passwords, no email required.
                </p>
                <button
                  type="button"
                  data-ocid="join.login_button"
                  disabled={loginStatus === "logging-in"}
                  onClick={async () => {
                    await login();
                    setStep(1);
                  }}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/85 transition-smooth disabled:opacity-60 min-h-[44px]"
                >
                  {loginStatus === "logging-in"
                    ? "Connecting…"
                    : "Login with Internet Identity"}
                </button>
                <p className="text-xs text-muted-foreground mt-4">
                  Internet Identity keeps your data private and secure.
                </p>
              </div>
            )}

            {/* ── Step 1: Role-specific form ── */}
            {step === 1 && (
              <div data-ocid="join.profile_step">
                <h2 className="text-xl font-display font-bold text-foreground mb-6">
                  Create Your Profile
                </h2>
                {joinType === "community" && (
                  <CommunityForm
                    form={form}
                    setField={setField}
                    toggleChip={toggleChip}
                  />
                )}
                {joinType === "business" && (
                  <BusinessForm form={form} setField={setField} />
                )}
                {joinType === "trade" && (
                  <TradeForm form={form} setField={setField} />
                )}
                {joinType === "producer" && (
                  <ProducerForm
                    form={form}
                    setField={setField}
                    toggleChip={toggleChip}
                  />
                )}
                {joinType === "organization" && (
                  <OrgForm form={form} setField={setField} />
                )}
                <button
                  type="button"
                  data-ocid="join.next_button"
                  onClick={() => setStep(2)}
                  disabled={!isFormValid()}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/85 transition-smooth disabled:opacity-40 min-h-[44px] mt-6 flex items-center justify-center gap-2"
                >
                  Review Submission
                  <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* ── Step 2: Review + submit ── */}
            {step === 2 && (
              <div data-ocid="join.review_step">
                <h2 className="text-xl font-display font-bold text-foreground mb-6">
                  Review Your Submission
                </h2>
                <div className="space-y-0 mb-6 rounded-xl border border-border overflow-hidden">
                  {getSummaryRows().map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex justify-between gap-4 px-4 py-3 text-sm ${
                        i % 2 === 0 ? "bg-muted/30" : "bg-card"
                      }`}
                    >
                      <span className="text-muted-foreground shrink-0">
                        {row.label}
                      </span>
                      <span className="text-foreground font-medium text-right break-words min-w-0">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  Members are responsible for their own payments, records,
                  taxes, and compliance.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    data-ocid="join.back_button"
                    className="flex-1 py-3 rounded-lg border border-border text-foreground text-sm hover:bg-muted/60 transition-smooth min-h-[44px] flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    data-ocid="join.submit_button"
                    disabled={createMember.isPending}
                    className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/85 transition-smooth disabled:opacity-50 min-h-[44px]"
                  >
                    {createMember.isPending ? "Submitting…" : "Submit"}
                  </button>
                </div>
                {createMember.isError && (
                  <p
                    className="text-xs text-destructive mt-3 text-center"
                    data-ocid="join.error_state"
                  >
                    Submission failed. Please try again.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
