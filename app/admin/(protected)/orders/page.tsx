import { OrdersManagement } from "@/components/admin/orders-management";
import { PageHeader } from "@/components/admin/page-header";
import { ORDER_STATUSES } from "@/lib/constants";
import { getAdminOrders } from "@/lib/queries";
import type { OrderStatus } from "@/lib/types";

type OrdersPageProps = {
  searchParams: {
    status?: string;
    search?: string;
    from?: string;
    to?: string;
  };
};

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const parsedStatus =
    searchParams.status === "all" ||
    (searchParams.status
      ? ORDER_STATUSES.includes(searchParams.status as OrderStatus)
      : false)
      ? (searchParams.status as OrderStatus | "all")
      : undefined;

  const orders = await getAdminOrders({
    status: parsedStatus,
    search: searchParams.search,
    from: searchParams.from,
    to: searchParams.to,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        description="Filter, review, and follow up with customer orders."
        title="Orders"
      />
      <OrdersManagement filters={searchParams} orders={orders} />
    </div>
  );
}
