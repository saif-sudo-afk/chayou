import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  compact?: boolean;
};

export function LogoMark({ className, compact = false }: LogoMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="gold-ring flex h-10 w-10 items-center justify-center rounded-full bg-surface">
        <span className="font-display text-2xl text-brand">C</span>
      </div>
      <div className={cn("flex flex-col", compact && "hidden sm:flex")}>
        <span className="brand-wordmark text-lg sm:text-xl">
          CHAYOU JEWELS
        </span>
        <span className="text-[11px] uppercase tracking-[0.26em] text-muted">
          Modern, minimal & durable jewelry
        </span>
      </div>
    </div>
  );
}
