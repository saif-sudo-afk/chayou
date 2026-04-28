import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  align?: "center" | "left";
  className?: string;
  compact?: boolean;
  tone?: "dark" | "light";
};

const mainLineStyle = {
  fontFamily: '"TAN - PEARL", "Cormorant Garamond", serif',
} as const;

const subLineStyle = {
   fontFamily: "Satoshi",
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
          "tracking-[0.045em]",
          compact ? "text-[2.15rem]" : "text-[2.9rem] sm:text-[3.2rem]",
        )}
        style={mainLineStyle}
      >
        Chayou
      </span>
      <span
        className={cn(
          "mt-2 uppercase tracking-[0.48em]",
          compact ? "text-[0.52rem]" : "text-[0.62rem] sm:text-[0.68rem]",
          isLight ? "text-bg/85" : "text-brand/80",
        )}
        style={subLineStyle}
      >
        Jewels
      </span>
    </div>
  );
}
