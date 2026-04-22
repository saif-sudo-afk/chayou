import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

type HeroSectionProps = Pick<SiteSettings, "hero">;

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="relative isolate min-h-[calc(100vh-7.5rem)] overflow-hidden bg-stone-200">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${hero.backgroundImageUrl}")` }}
      />
      <div className="absolute inset-0 bg-black/12" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-black/18" />

      <div className="container-shell relative flex min-h-[calc(100vh-7.5rem)] items-center justify-center py-20 text-center">
        <div className="w-full max-w-md space-y-8 sm:max-w-lg">
          <h1 className="text-balance text-[3rem] font-light leading-[1.05] tracking-[0.01em] text-white sm:text-[4.25rem]">
            {hero.headline}
          </h1>
          <div className="mx-auto flex max-w-[20rem] flex-col gap-4">
            <HeroButton href={hero.primaryButtonLink}>
              {hero.primaryButtonLabel}
            </HeroButton>
            <HeroButton href={hero.secondaryButtonLink}>
              {hero.secondaryButtonLabel}
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
        "h-16 rounded-none border border-white/60 bg-white/72 px-8 text-[0.78rem] font-normal tracking-[0.42em] text-neutral-950 shadow-none backdrop-blur-sm hover:bg-white hover:text-neutral-950",
      )}
      variant="secondary"
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
