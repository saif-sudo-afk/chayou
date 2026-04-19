import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Create a new jewelry piece and publish it to the storefront."
        title="Add Product"
      />
      <ProductForm />
    </div>
  );
}
