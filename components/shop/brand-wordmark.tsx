import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  align?: "center" | "left";
  className?: string;
  compact?: boolean;
  tone?: "dark" | "light";
};

const mainLineStyle = {
  fontFamily: '"TAN - PEARL", var(--font-cormorant), "Cormorant Garamond", serif',
} as const;

const subLineStyle = {
  fontFamily: 'var(--font-great-vibes), cursive',
} as const;

export function BrandWordmark({
  align = "center",
  className,
  compact = false,
  tone = "dark",
}: BrandWordmarkProps) {
  const isLight = tone === "light";

  return (
    <div
      className={cn(
        "inline-flex flex-col leading-none",
        align === "center" ? "items-center text-center" : "items-start text-left",
        isLight ? "text-bg" : "text-brand",
        className,
      )}
    >
      <span
        className={cn(
          "tracking-[0.05em]",
          compact ? "text-[2.2rem]" : "text-[3.1rem] sm:text-[3.5rem]",
        )}
        style={mainLineStyle}
      >
        Chayou
      </span>
      <span
        className={cn(
          "tracking-[0.03em]",
          compact ? "text-[1.05rem]" : "text-[1.4rem] sm:text-[1.6rem]",
          isLight ? "text-bg/80" : "text-brand/75",
        )}
        style={subLineStyle}
      >
        Jewels
      </span>
    </div>
  );
}
