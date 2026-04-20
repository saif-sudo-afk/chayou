import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroImage =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden bg-brand bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-bg/15 via-brand/10 to-brand/45" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand/45 to-transparent" />

      <div className="container-shell relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center py-20 text-center">
        <div className="max-w-2xl space-y-5">
          <p className="animate-fade-up text-[11px] font-light uppercase tracking-[0.26em] text-gold">
            COLLECTION 2025
          </p>
          <h1
            className="animate-fade-up font-display text-[52px] font-light italic leading-[0.95] text-surface sm:text-7xl"
            style={{ animationDelay: "0.1s" }}
          >
            Bijoux Soleil
          </h1>
          <p
            className="animate-fade-up text-sm font-light tracking-[0.08em] text-gold-light sm:text-base"
            style={{ animationDelay: "0.2s" }}
          >
            Bijoux modernes, minimalistes et durables
          </p>
          <div className="animate-fade-up pt-3" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" variant="outline">
              <Link href="/shop">Découvrir la collection</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 animate-float text-gold">
        <ChevronDown className="h-7 w-7 stroke-[1.4]" />
      </div>
    </section>
  );
}
