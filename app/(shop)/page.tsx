import Link from "next/link";
import { HeroSection } from "@/components/shop/hero-section";
import { ProductCard } from "@/components/shop/product-card";
import { ValuesStrip } from "@/components/shop/values-strip";
import { Button } from "@/components/ui/button";
import { getHomePageNewArrivals } from "@/lib/queries";
import { getSiteSettings } from "@/lib/site-settings";

export default async function HomePage() {
  const siteSettings = await getSiteSettings();
  const newArrivals = await getHomePageNewArrivals(siteSettings);

  return (
    <div className="bg-bg pb-20">
      <HeroSection hero={siteSettings.hero} />

      <section id="new-arrivals" className="container-shell space-y-8 py-16 sm:py-20">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-light tracking-[0.08em] text-brand sm:text-4xl">
            New Arrivals
          </h2>
          <div className="mx-auto h-px w-14 bg-brand/20" />
        </div>

        {newArrivals.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-brand/15 bg-surface/60 px-6 py-16 text-center text-sm tracking-[0.08em] text-muted">
            No products are available yet.
          </div>
        )}

        <div className="flex justify-center">
          <Button asChild variant="ghost">
            <Link
              className="text-xs uppercase tracking-[0.34em] text-brand hover:text-brand/70"
              href="/shop"
            >
              View All
            </Link>
          </Button>
        </div>
      </section>

      <ValuesStrip />
    </div>
  );
}
