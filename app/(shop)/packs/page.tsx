import { PackCard } from "@/components/shop/pack-card";
import { SectionHeading } from "@/components/shop/section-heading";
import { getStorefrontPacks } from "@/lib/queries";

export default async function PacksPage() {
  const packs = await getStorefrontPacks();

  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description="Des combinaisons pré-stylées qui mélangent valeur, douceur et brillance chaude."
        eyebrow="Packs"
        title="Packs Chayou"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {packs.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
        ))}
      </div>
    </section>
  );
}
