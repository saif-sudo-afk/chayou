import { BrandText } from "@/components/shop/brand-text";
import { SectionHeading } from "@/components/shop/section-heading";
import { ShopLoadingGrid } from "@/components/shop/shop-loading-grid";

export default function ShopLoadingPage() {
  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description={
          <>
            Loading the latest <BrandText className="text-sm" short /> collection.
          </>
        }
        eyebrow="Shop"
        title="The Collection"
      />
      <ShopLoadingGrid />
    </section>
  );
}
