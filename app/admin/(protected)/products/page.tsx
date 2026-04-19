import { PageHeader } from "@/components/admin/page-header";
import { ProductsManagement } from "@/components/admin/products-management";
import { getAdminProducts } from "@/lib/queries";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-8">
      <PageHeader
        description="Manage product pricing, availability, imagery, and stock."
        title="Products"
      />
      <ProductsManagement products={products} />
    </div>
  );
}
