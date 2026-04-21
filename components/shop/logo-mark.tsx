import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  compact?: boolean;
  showTagline?: boolean;
  theme?: "light" | "dark";
};

export function LogoMark({
  className,
  compact = false,
  showTagline = false,
  theme = "light",
}: LogoMarkProps) {
  const darkTheme = theme === "dark";

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <Image
        alt={BRAND.name}
        className={cn(
          "h-auto w-auto object-contain",
          compact ? "max-h-10 max-w-[8.5rem] sm:max-h-12 sm:max-w-[10rem]" : "max-h-16 max-w-[12rem] sm:max-h-20 sm:max-w-[14rem]",
        )}
        height={375}
        src="/chayou_logo.svg"
        width={375}
      />
      {showTagline ? (
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.22em] sm:text-[11px]",
            darkTheme ? "text-border/80" : "text-muted",
          )}
        >
          {BRAND.tagline}
        </span>
      ) : null}
    </div>
  );
}
