import Link from "next/link";
import { BrandText } from "@/components/shop/brand-text";
import { CollectionsSection } from "@/components/shop/collections-section";
import { HeroSection } from "@/components/shop/hero-section";
import { PackCard } from "@/components/shop/pack-card";
import { ProductCard } from "@/components/shop/product-card";
import { SectionHeading } from "@/components/shop/section-heading";
import { ValuesStrip } from "@/components/shop/values-strip";
import { Button } from "@/components/ui/button";
import { getHomePageData } from "@/lib/queries";

export default async function HomePage() {
  const { featuredProducts, activePacks } = await getHomePageData();

  return (
    <div className="pb-20">
      <HeroSection />
      <CollectionsSection />

      <section className="container-shell space-y-10 py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            description="Une selection de pieces lumineuses, minimalistes et faciles a porter."
            eyebrow="Selection"
            title={
              <>
                Nouveautes <BrandText className="text-4xl sm:text-5xl" short />
              </>
            }
          />
          <Button asChild variant="outline">
            <Link href="/shop">Voir la boutique</Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <ValuesStrip />

      <section className="container-shell space-y-10 py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            description="Des ensembles prets a offrir, composes pour briller avec douceur."
            eyebrow="Packs"
            title="Ensembles Soleil"
          />
          <Button asChild variant="outline">
            <Link href="/packs">Voir les packs</Link>
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {activePacks.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>
    </div>
  );
}
