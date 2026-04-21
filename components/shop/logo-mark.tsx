import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  banner?: boolean;
  className?: string;
  compact?: boolean;
};

export function LogoMark({
  banner = false,
  className,
  compact = false,
}: LogoMarkProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        alt={BRAND.name}
        className={cn(
          "block h-auto object-contain",
          banner
            ? "max-w-[6.25rem] sm:max-w-[7.5rem] lg:max-w-[8.75rem]"
            : compact
              ? "max-w-[3.5rem] sm:max-w-[4rem]"
              : "max-w-[6.5rem] sm:max-w-[7.5rem]",
        )}
        height={375}
        src="/chayou_logo.svg"
        width={375}
      />
    </div>
  );
}
