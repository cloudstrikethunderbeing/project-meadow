import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const SIZE_CLASSES = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <output
      aria-label={label ?? "Loading"}
      className={cn("flex flex-col items-center gap-3", className)}
    >
      <div
        className={cn(
          "rounded-full border-primary/30 border-t-primary animate-spin",
          SIZE_CLASSES[size],
        )}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </output>
  );
}
