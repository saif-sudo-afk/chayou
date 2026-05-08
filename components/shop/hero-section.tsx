import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

type HeroSectionProps = Pick<SiteSettings, "hero">;

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="relative isolate min-h-[calc(100vh-7.5rem)] overflow-hidden bg-bg">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${hero.backgroundImageUrl}")` }}
      />
      <div className="absolute inset-0 bg-brand/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/18 via-transparent to-brand/16" />

      <div className="container-shell relative flex min-h-[calc(100vh-7.5rem)] items-center justify-center py-20 text-center">
        <div className="w-full max-w-md space-y-8 sm:max-w-lg">
          <h1
            className="text-balance text-[3rem] font-light leading-[1.05] tracking-[0.01em] text-bg sm:text-[4.25rem]"
            style={{
              textShadow:
                "0 2px 12px rgba(0,0,0,0.85), 0 4px 32px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.9)",
            }}
          >
            {hero.headline}
          </h1>
          <div className="mx-auto flex max-w-[20rem] flex-col gap-4">
            <HeroButton href={hero.primaryButtonLink}>
              {hero.primaryButtonLabel}
            </HeroButton>
          </div>
        </div>
      </div>
    </section>
  );
}

type HeroButtonProps = {
  children: string;
  href: string;
};

function HeroButton({ children, href }: HeroButtonProps) {
  return (
    <Button
      asChild
      className={cn(
        "h-16 rounded-none border-2 border-bg bg-brand px-10 text-[0.85rem] font-semibold tracking-[0.28em] text-bg shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-bg hover:text-brand hover:shadow-xl",
      )}
      variant="secondary"
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
