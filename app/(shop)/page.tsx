import Link from "next/link";
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
    <div className="space-y-24 pb-24">
      <HeroSection />
      <ValuesStrip />

      <section className="container-shell space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            description="A selection of the latest CHAYOU pieces with clean silhouettes and durable finishes."
            eyebrow="Featured"
            title="Latest Jewelry Drops"
          />
          <Button asChild variant="outline">
            <Link href="/shop">View Full Shop</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            description="Curated combinations designed for gifting and styling in one move."
            eyebrow="Curated Packs"
            title="Luxury Sets"
          />
          <Button asChild variant="outline">
            <Link href="/packs">Browse Packs</Link>
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
