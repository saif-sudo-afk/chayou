import { SectionHeading } from "@/components/shop/section-heading";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { getStorefrontProducts } from "@/lib/queries";

export default async function ShopPage() {
  const products = await getStorefrontProducts();

  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description="Browse the full CHAYOU JEWELS edit and filter by category to find your next everyday signature."
        eyebrow="Shop"
        title="The Collection"
      />
      <ShopCatalog products={products} />
    </section>
  );
}
