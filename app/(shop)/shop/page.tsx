import { BrandText } from "@/components/shop/brand-text";
import { SectionHeading } from "@/components/shop/section-heading";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { getStorefrontProducts } from "@/lib/queries";

export default async function ShopPage() {
  const products = await getStorefrontProducts();

  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description={
          <>
            Parcourez l&apos;edit <BrandText className="text-sm" /> et filtrez par
            categorie pour trouver votre signature quotidienne.
          </>
        }
        eyebrow="Boutique"
        title="La Collection"
      />
      <ShopCatalog products={products} />
    </section>
  );
}
