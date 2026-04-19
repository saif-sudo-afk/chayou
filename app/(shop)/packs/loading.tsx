import { SectionHeading } from "@/components/shop/section-heading";
import { ShopLoadingGrid } from "@/components/shop/shop-loading-grid";

export default function PacksLoadingPage() {
  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description="Loading curated CHAYOU packs."
        eyebrow="Packs"
        title="Curated Bundles"
      />
      <ShopLoadingGrid />
    </section>
  );
}
