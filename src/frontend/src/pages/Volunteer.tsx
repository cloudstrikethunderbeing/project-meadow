import { useCreateVolunteer } from "@/hooks/useQueries";
import type { VolunteerInput } from "@/types";
import { PROVINCES, PROVINCE_NAMES } from "@/types";
import {
  faCheck,
  faLocationDot,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SKILLS_OPTIONS = [
  "Community organizing",
  "Outreach",
  "Education",
  "Social media",
  "Design",
  "Tech / Web",
  "Event coordination",
  "Translation",
  "Other",
];

const INTERESTS_OPTIONS = [
  "Local food",
  "Trades & services",
  "Community events",
  "Education",
  "Social media",
  "Ambassador program",
  "Other",
];

const AVAILABILITY_OPTIONS = [
  { value: "flexible", label: "Flexible hours" },
  { value: "part-time", label: "Part-time commitment" },
  { value: "full-time", label: "Full-time volunteer" },
  { value: "specific", label: "Specific hours only" },
];

function ChipToggle({
  label,
  active,
  onClick,
  ocid,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  ocid: string;
}) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth min-h-[36px] ${
        active
          ? "bg-primary/20 border-primary/50 text-primary"
          : "bg-muted border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

export function Volunteer() {
  const createVolunteer = useCreateVolunteer();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    province: "",
    selectedSkills: [] as string[],
    selectedInterests: [] as string[],
    availability: "",
  });

  function toggle(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      errs.email = "Please enter a valid email";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.availability) errs.availability = "Please select availability";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const input: VolunteerInput = {
      name: form.name,
      email: form.email,
      city: form.city + (form.province ? `, ${form.province}` : ""),
      skills: form.selectedSkills,
      interests: form.selectedInterests,
      availability: form.availability,
    };
    try {
      await createVolunteer.mutateAsync(input);
      setSuccess(true);
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  }

  if (success) {
    return (
      <div
        data-ocid="volunteer.success_state"
        className="min-h-[60vh] bg-background flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lifted">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-5">
            <FontAwesomeIcon icon={faCheck} className="text-primary text-3xl" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">
            Thank you for volunteering!
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Your interest has been received. A community coordinator will reach
            out with next steps. In the meantime, explore the network or invite
            a local business to join.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/map"
              data-ocid="volunteer.explore_map_link"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/85 transition-smooth min-h-[44px] flex items-center justify-center"
            >
              Explore Map
            </Link>
            <Link
              to="/join"
              data-ocid="volunteer.join_as_member_link"
              className="w-full py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted/60 transition-smooth min-h-[44px] flex items-center justify-center"
            >
              Join as Member
            </Link>
            <Link
              to="/community"
              data-ocid="volunteer.back_to_community_link"
              className="w-full py-3 rounded-lg border border-border text-muted-foreground font-medium text-sm hover:bg-muted/60 transition-smooth min-h-[44px] flex items-center justify-center"
            >
              Back to Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-ocid="volunteer.page" className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-primary text-xl"
                />
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Volunteer With Us
            </h1>
            <p className="text-muted-foreground text-lg">
              Help strengthen local economies across Canada.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {["Sign In", "Share Details", "Join"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center border ${
                    i === 1
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    i === 1
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
                {i < 2 && <div className="w-6 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 space-y-6"
            noValidate
          >
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="vol-name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Your Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="vol-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  onBlur={() => {
                    if (!form.name.trim())
                      setErrors((p) => ({ ...p, name: "Name is required" }));
                    else setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  data-ocid="volunteer.name_input"
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.name && (
                  <p
                    data-ocid="volunteer.name_field_error"
                    className="text-xs text-destructive mt-1"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="vol-email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  id="vol-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  onBlur={() => {
                    if (!form.email.trim())
                      setErrors((p) => ({ ...p, email: "Email is required" }));
                    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
                      setErrors((p) => ({ ...p, email: "Invalid email" }));
                    else setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  data-ocid="volunteer.email_input"
                  placeholder="jane@example.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.email && (
                  <p
                    data-ocid="volunteer.email_field_error"
                    className="text-xs text-destructive mt-1"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* City + Province */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="vol-city"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  City <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
                  />
                  <input
                    id="vol-city"
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, city: e.target.value }))
                    }
                    onBlur={() => {
                      if (!form.city.trim())
                        setErrors((p) => ({ ...p, city: "City is required" }));
                      else setErrors((p) => ({ ...p, city: undefined }));
                    }}
                    data-ocid="volunteer.city_input"
                    placeholder="Toronto"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  />
                </div>
                {errors.city && (
                  <p
                    data-ocid="volunteer.city_field_error"
                    className="text-xs text-destructive mt-1"
                  >
                    {errors.city}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="vol-province"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Province
                </label>
                <select
                  id="vol-province"
                  value={form.province}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, province: e.target.value }))
                  }
                  data-ocid="volunteer.province_select"
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select province</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {PROVINCE_NAMES[p]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS_OPTIONS.map((skill) => (
                  <ChipToggle
                    key={skill}
                    label={skill}
                    active={form.selectedSkills.includes(skill)}
                    ocid={`volunteer.skill_${skill.toLowerCase().replace(/[/ ]+/g, "_")}_toggle`}
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        selectedSkills: toggle(p.selectedSkills, skill),
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_OPTIONS.map((interest) => (
                  <ChipToggle
                    key={interest}
                    label={interest}
                    active={form.selectedInterests.includes(interest)}
                    ocid={`volunteer.interest_${interest.toLowerCase().replace(/[& ]+/g, "_")}_toggle`}
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        selectedInterests: toggle(
                          p.selectedInterests,
                          interest,
                        ),
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label
                htmlFor="vol-availability"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Availability <span className="text-destructive">*</span>
              </label>
              <select
                id="vol-availability"
                value={form.availability}
                onChange={(e) =>
                  setForm((p) => ({ ...p, availability: e.target.value }))
                }
                required
                data-ocid="volunteer.availability_select"
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select availability</option>
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.availability && (
                <p
                  data-ocid="volunteer.availability_field_error"
                  className="text-xs text-destructive mt-1"
                >
                  {errors.availability}
                </p>
              )}
            </div>

            <button
              type="submit"
              data-ocid="volunteer.submit_button"
              disabled={createVolunteer.isPending}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/85 transition-smooth disabled:opacity-50 min-h-[44px]"
            >
              {createVolunteer.isPending
                ? "Submitting…"
                : "Submit Volunteer Interest"}
            </button>

            {createVolunteer.isError && (
              <p
                className="text-xs text-destructive text-center"
                data-ocid="volunteer.error_state"
              >
                Submission failed. Please try again.
              </p>
            )}

            <p className="text-xs text-muted-foreground text-center">
              No account required. We'll reach out to confirm your interest.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
