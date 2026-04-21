import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import heroImage from "@/background.jpeg";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden bg-brand">
      <Image
        alt="CHAYOU JEWELS editorial campaign"
        className="object-cover object-[58%_18%] brightness-[0.84] contrast-[0.96] saturate-[0.88] sepia-[0.08] md:object-[56%_16%]"
        fill
        placeholder="blur"
        priority
        sizes="100vw"
        src={heroImage}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(243,236,220,0.16)_0%,rgba(78,2,0,0.12)_38%,rgba(78,2,0,0.48)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(201,168,76,0.18),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(243,236,220,0.12),transparent_26%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand/50 to-transparent" />

      <div className="container-shell relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center py-20 text-center">
        <div className="max-w-2xl space-y-5 rounded-[2rem] bg-brand/10 px-6 py-8 backdrop-blur-[1.5px] sm:px-10">
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
