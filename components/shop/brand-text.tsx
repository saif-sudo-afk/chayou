import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandTextProps = {
  className?: string;
  short?: boolean;
};

export function BrandText({ className, short = false }: BrandTextProps) {
  return (
    <span className={cn("brand-wordmark text-current", className)}>
      {short ? "CHAYOU" : BRAND.name}
    </span>
  );
}
