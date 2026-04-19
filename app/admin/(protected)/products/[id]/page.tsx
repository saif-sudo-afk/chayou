import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminProduct } from "@/lib/queries";

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const product = await getAdminProduct(Number(params.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Update product details, media, and storefront visibility."
        title={product.name}
      />
      <ProductForm initialValues={product} />
    </div>
  );
}
