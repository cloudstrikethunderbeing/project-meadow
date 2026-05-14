import {
  faBuilding,
  faCircleCheck,
  faClock,
  faCoins,
  faCubes,
  faList,
  faMagnifyingGlass,
  faMoneyBill,
  faQrcode,
  faReceipt,
  faShield,
  faTriangleExclamation,
  faUpRightFromSquare,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

const HOW_IT_WORKS: Array<{
  step: number;
  icon: IconDefinition;
  text: string;
}> = [
  {
    step: 1,
    icon: faMagnifyingGlass,
    text: "Find a local business, producer, trade, or organization.",
  },
  {
    step: 2,
    icon: faCircleCheck,
    text: "Check which payment methods they accept.",
  },
  {
    step: 3,
    icon: faQrcode,
    text: "Scan their QR code or open their wallet payment link.",
  },
  {
    step: 4,
    icon: faWallet,
    text: "Complete payment directly in your own wallet.",
  },
  {
    step: 5,
    icon: faReceipt,
    text: "Keep your own records and receipts.",
  },
];

const PAYMENT_METHODS: Array<{
  label: string;
  icon: IconDefinition;
  colorClass: string;
}> = [
  {
    label: "Cash",
    icon: faMoneyBill,
    colorClass: "bg-muted text-muted-foreground border-border",
  },
  {
    label: "E-transfer",
    icon: faBuilding,
    colorClass: "bg-muted text-muted-foreground border-border",
  },
  {
    label: "Bitcoin",
    icon: faCoins,
    colorClass:
      "bg-[oklch(0.65_0.18_45/0.15)] text-orange-400 border-[oklch(0.65_0.18_45/0.35)]",
  },
  {
    label: "ICP",
    icon: faCubes,
    colorClass:
      "bg-[oklch(0.60_0.12_270/0.15)] text-purple-400 border-[oklch(0.60_0.12_270/0.35)]",
  },
  {
    label: "Other methods listed by each member",
    icon: faList,
    colorClass: "bg-muted text-muted-foreground border-border",
  },
];

export function WalletGuide() {
  return (
    <div data-ocid="wallet_guide.page" className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-10 md:py-14 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium mb-5">
              <FontAwesomeIcon icon={faWallet} className="text-xs" />
              External Wallet Education
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Learn Before You Pay
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-2">
              For anyone curious about how external payment options work on the
              network.
            </p>
            <p className="text-sm text-muted-foreground/80 font-medium">
              You don't need a wallet to browse or join.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        {/* Section 1: What Is OISY Wallet? */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-soft"
          data-ocid="wallet_guide.what_is_section"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 glow-accent">
              <FontAwesomeIcon
                icon={faWallet}
                className="text-primary text-xl"
              />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">
                What Is OISY Wallet?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                OISY Wallet is an external wallet used in the Internet Computer
                ecosystem. Members may choose to use it to send, receive, and
                manage supported digital assets such as ICP and Bitcoin.
              </p>
              <a
                href="https://oisy.com"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="wallet_guide.open_oisy_link"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:underline transition-colors"
              >
                Open OISY Wallet
                <FontAwesomeIcon
                  icon={faUpRightFromSquare}
                  className="text-xs"
                />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Why We Use External Wallets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-soft"
          data-ocid="wallet_guide.why_section"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon
                icon={faShield}
                className="text-primary text-xl"
              />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">
                Why We Use External Wallets
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To keep this platform simple and safe, Project Meadow does not
                hold funds, process payments, or act as a payment provider.
                Members control their own wallets and transact directly with
                each other.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 3: How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-soft"
          data-ocid="wallet_guide.how_it_works_section"
        >
          <h2 className="text-lg font-display font-semibold text-foreground mb-5">
            How It Works
          </h2>
          <ol className="space-y-4">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.li
                key={item.step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-4"
                data-ocid={`wallet_guide.step.${item.step}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold">
                  {item.step}
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-muted-foreground text-sm flex-shrink-0"
                  />
                  <p className="text-sm text-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Section 4: Payment Methods Supported */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-soft"
          data-ocid="wallet_guide.payment_methods_section"
        >
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            Payment Methods Supported
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Members may list any of the following as accepted payment methods on
            their profiles. All payments happen directly between members.
          </p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method.label}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${method.colorClass}`}
              >
                <FontAwesomeIcon icon={method.icon} className="text-xs" />
                {method.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Section 5: Member Responsibility Notice */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-[oklch(0.65_0.18_45/0.08)] border border-[oklch(0.65_0.18_45/0.25)] rounded-2xl p-6"
          data-ocid="wallet_guide.responsibility_notice"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[oklch(0.65_0.18_45/0.15)] border border-[oklch(0.65_0.18_45/0.30)] flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-orange-400 text-xl"
              />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">
                Member Responsibility Notice
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Members are responsible for their own payments, records, tax
                reporting, refunds, and compliance. This platform does not
                verify, reverse, custody, or guarantee transactions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 6: Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-card border border-dashed border-border rounded-2xl p-6 opacity-70"
          data-ocid="wallet_guide.coming_soon_section"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon
                icon={faClock}
                className="text-muted-foreground text-xl"
              />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-muted border border-border text-xs text-muted-foreground uppercase tracking-widest mb-3">
                Coming Soon
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Coming soon: optional QR display tools and wallet-link helpers
                for participating members.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-card border border-primary/20 rounded-2xl p-6 text-center shadow-soft"
          data-ocid="wallet_guide.closing_cta"
        >
          <h2 className="text-lg font-display font-semibold text-foreground mb-2">
            Ready to Explore the Network?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            You now know how payments work on the network. Browse local listings
            and connect with businesses, producers, and trades near you.
          </p>
          <Link
            to="/map"
            data-ocid="wallet_guide.browse_directory_cta"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-smooth hover:bg-primary/85 shadow-soft min-h-[44px]"
          >
            Browse Local Listings
          </Link>
        </motion.div>

        {/* External links row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
          <a
            href="https://oisy.com"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="wallet_guide.open_oisy_button"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[oklch(0.60_0.12_270)] text-white font-semibold text-sm transition-smooth hover:opacity-90 shadow-soft min-h-[44px]"
          >
            <FontAwesomeIcon icon={faCubes} className="text-sm" />
            Open OISY Wallet
            <FontAwesomeIcon icon={faUpRightFromSquare} className="text-sm" />
          </a>
          <Link
            to="/map"
            data-ocid="wallet_guide.browse_directory_link"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-semibold text-sm transition-smooth hover:bg-muted/60 min-h-[44px]"
          >
            Browse Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
