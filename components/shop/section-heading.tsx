import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.32em] text-gold">{eyebrow}</p>
      ) : null}
      <div className="space-y-3">
        <h2 className="section-title">{title}</h2>
        <div className="h-px w-10 bg-gold" />
        {description ? <p className="section-copy">{description}</p> : null}
      </div>
    </div>
  );
}
