import { notFound } from "next/navigation";
import { PackForm } from "@/components/admin/pack-form";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminPack, getProductOptions } from "@/lib/queries";

type PackDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function PackDetailPage({ params }: PackDetailPageProps) {
  const [pack, productOptions] = await Promise.all([
    getAdminPack(Number(params.id)),
    getProductOptions(),
  ]);

  if (!pack) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Edit this curated pack and its included products."
        title={pack.name}
      />
      <PackForm initialValues={pack} productOptions={productOptions} />
    </div>
  );
}
