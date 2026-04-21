import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-[0.08em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-gold/80 bg-gold text-brand shadow-[0_18px_45px_rgba(201,168,76,0.28)] hover:-translate-y-0.5 hover:border-gold hover:bg-[#d7b45e]",
        secondary:
          "border border-border bg-surface text-brand shadow-[0_10px_28px_rgba(78,2,0,0.08)] hover:-translate-y-0.5 hover:border-gold hover:bg-gold-light/40",
        ghost: "text-brand hover:bg-gold-light/30 hover:text-brand",
        destructive: "bg-danger text-surface hover:bg-brand",
        outline:
          "border border-gold/70 bg-gold/95 text-brand shadow-[0_18px_45px_rgba(201,168,76,0.22)] hover:-translate-y-0.5 hover:bg-gold-light",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
