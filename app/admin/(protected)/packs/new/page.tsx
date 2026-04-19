import { PackForm } from "@/components/admin/pack-form";
import { PageHeader } from "@/components/admin/page-header";
import { getProductOptions } from "@/lib/queries";

export default async function NewPackPage() {
  const productOptions = await getProductOptions();

  return (
    <div className="space-y-8">
      <PageHeader
        description="Assemble multiple products into a premium CHAYOU set."
        title="Create Pack"
      />
      <PackForm productOptions={productOptions} />
    </div>
  );
}
