import { DiscountForm } from "@/components/admin/discount-form";
import { PageHeader } from "@/components/admin/page-header";
import { getDiscountTargets } from "@/lib/queries";

export default async function NewDiscountPage() {
  const targets = await getDiscountTargets();

  return (
    <div className="space-y-8">
      <PageHeader
        description="Create a new rule and let it auto-apply across the storefront."
        title="Create Discount"
      />
      <DiscountForm targets={targets} />
    </div>
  );
}
