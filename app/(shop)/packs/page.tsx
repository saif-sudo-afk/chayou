import { PackCard } from "@/components/shop/pack-card";
import { SectionHeading } from "@/components/shop/section-heading";
import { getStorefrontPacks } from "@/lib/queries";

export default async function PacksPage() {
  const packs = await getStorefrontPacks();

  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description="Pre-styled combinations that balance value, versatility, and CHAYOU's dark luxury aesthetic."
        eyebrow="Packs"
        title="Curated Bundles"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {packs.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
        ))}
      </div>
    </section>
  );
}
