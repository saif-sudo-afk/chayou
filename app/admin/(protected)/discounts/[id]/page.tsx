import { notFound } from "next/navigation";
import { DiscountForm } from "@/components/admin/discount-form";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminDiscount, getDiscountTargets } from "@/lib/queries";

type DiscountDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function DiscountDetailPage({
  params,
}: DiscountDetailPageProps) {
  const [discount, targets] = await Promise.all([
    getAdminDiscount(Number(params.id)),
    getDiscountTargets(),
  ]);

  if (!discount) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Adjust the scope, percentage, expiry, or active state."
        title={`Discount #${discount.id}`}
      />
      <DiscountForm initialValues={discount} targets={targets} />
    </div>
  );
}
