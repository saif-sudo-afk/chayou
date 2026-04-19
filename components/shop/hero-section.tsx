import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-crimson-radial opacity-80" />
      <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-shell relative flex min-h-[calc(100vh-6rem)] items-center py-20">
        <div className="max-w-4xl animate-fade-up space-y-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.38em] text-gold">
              Moroccan Jewelry House
            </p>
            <h1 className="font-display text-6xl leading-none text-shimmer animate-shimmer sm:text-7xl lg:text-[7rem]">
              CHAYOU JEWELS
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Modern silhouettes, durable finishes, and a dark luxury mood built
              for everyday statement pieces across Morocco.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/shop">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <div className="rounded-full border border-border bg-panel/70 px-5 py-3 text-sm text-muted">
              Ships across Morocco only
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
