import { Gem, ShieldCheck, Sparkles, Waves } from "lucide-react";

const values = [
  {
    icon: Gem,
    title: "Acier inoxydable premium",
    description: "Une brillance durable inspirée par l'or marocain.",
  },
  {
    icon: Waves,
    title: "Waterproof & résistant",
    description: "Résiste à l'eau, la transpiration et le quotidien.",
  },
  {
    icon: ShieldCheck,
    title: "Hypoallergénique",
    description: "Des matériaux doux pour les peaux sensibles.",
  },
  {
    icon: Sparkles,
    title: "Port quotidien",
    description: "Minimal, lumineux, facile à superposer.",
  },
];

export function ValuesStrip() {
  return (
    <section className="bg-brand py-16">
      <div className="container-shell space-y-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-light italic text-bg">
            Pourquoi nous choisir
          </h2>
          <div className="mx-auto mt-4 h-px w-10 bg-gold" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                className="rounded-lg border border-gold/30 bg-bg/10 p-5 text-center"
                key={value.title}
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold">
                  <Icon className="h-5 w-5 stroke-[1.4]" />
                </div>
                <h3 className="mt-4 font-sans text-sm font-medium uppercase tracking-[0.08em] text-bg">
                  {value.title}
                </h3>
                <p className="mt-2 text-xs font-light leading-6 text-border">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
