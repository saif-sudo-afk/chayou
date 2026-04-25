import { Gem, ShieldCheck, Sparkles, Waves } from "lucide-react";

const values = [
  {
    icon: Gem,
    title: "ACIER INOXYDABLE PREMIUM",
    description: "Une brillance durable inspiree par l'or marocain.",
  },
  {
    icon: Waves,
    title: "WATERPROOF & RESISTANT",
    description: "Resiste a l'eau, la transpiration et le quotidien.",
  },
  {
    icon: ShieldCheck,
    title: "HYPOALLERGENIQUE",
    description: "Des materiaux doux pour les peaux sensibles.",
  },
  {
    icon: Sparkles,
    title: "PORT QUOTIDIEN",
    description: "Minimal, lumineux, facile a superposer.",
  },
] as const;

export function ValuesStrip() {
  return (
    <section className="bg-brand py-18 sm:py-20">
      <div className="container-shell space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="font-display text-[2.6rem] font-light italic tracking-[0.02em] text-white sm:text-[3rem]">
            Pourquoi nous choisir
          </h2>
          <div className="mx-auto h-px w-14 bg-gold" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                className="rounded-2xl border border-gold/45 bg-white/10 px-8 py-8 text-center shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                key={value.title}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/55 text-gold">
                  <Icon className="h-7 w-7 stroke-[1.35]" />
                </div>
                <h3 className="mt-6 font-sans text-[1.05rem] font-semibold tracking-[0.09em] text-white">
                  {value.title}
                </h3>
                <p className="mt-5 text-[0.95rem] font-light leading-9 text-white/85">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
