import { DiscountsManagement } from "@/components/admin/discounts-management";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminDiscounts, getDiscountTargets } from "@/lib/queries";

export default async function AdminDiscountsPage() {
  const [discounts, targets] = await Promise.all([
    getAdminDiscounts(),
    getDiscountTargets(),
  ]);

  const productMap = new Map(targets.products.map((product) => [product.id, product.name]));
  const packMap = new Map(targets.packs.map((pack) => [pack.id, pack.name]));

  const rows = discounts.map((discount) => ({
    ...discount,
    targetName: discount.productId
      ? productMap.get(discount.productId) ?? "Unknown product"
      : discount.packId
        ? packMap.get(discount.packId) ?? "Unknown pack"
        : "All products",
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        description="Create sitewide, product-specific, or pack-specific discounts."
        title="Discounts"
      />
      <DiscountsManagement discounts={rows} />
    </div>
  );
}
