import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default: "border-gold/30 bg-gold/10 text-gold",
        crimson: "border-brand/40 bg-brand/20 text-white",
        muted: "border-border bg-panel text-muted",
        success: "border-success/30 bg-success/20 text-white",
        warning: "border-warning/30 bg-warning/20 text-white",
        danger: "border-danger/30 bg-danger/20 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
