import { notFound } from "next/navigation";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminOrder } from "@/lib/queries";
import {
  buildCustomerStatusMessage,
  buildWhatsAppUrl,
  formatDateTime,
  formatMAD,
} from "@/lib/utils";

type OrderDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const order = await getAdminOrder(Number(params.id));

  if (!order) {
    notFound();
  }

  const contactUrl = buildWhatsAppUrl(
    order.customerPhone,
    buildCustomerStatusMessage({
      id: order.id,
      name: order.customerName,
      status: order.status,
    }),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        description="Review customer details, manage fulfillment, and send updates on WhatsApp."
        title={`Order #${order.id}`}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Name</p>
                <p className="mt-2 text-text">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Phone</p>
                <a
                  className="mt-2 inline-flex text-gold"
                  href={contactUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {order.customerPhone}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">City</p>
                <p className="mt-2 text-text">{order.customerCity}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Created</p>
                <p className="mt-2 text-text">{formatDateTime(order.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Address</p>
              <p className="mt-2 text-text">{order.customerAddress}</p>
            </div>
            {order.notes ? (
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Notes</p>
                <p className="mt-2 text-text">{order.notes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Order Status</CardTitle>
              <StatusBadge status={order.status} />
            </div>
            <OrderStatusForm orderId={order.id} status={order.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <a href={contactUrl} rel="noreferrer" target="_blank">
                Contact on WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div
              className="flex items-center justify-between rounded-lg border border-border bg-bg px-4 py-3"
              key={`${item.type}-${item.productId ?? item.packId}`}
            >
              <div>
                <p className="font-medium text-text">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  {item.qty} x {formatMAD(item.price)}
                </p>
              </div>
              <span className="font-medium text-gold">
                {formatMAD(item.qty * item.price)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Delivery Fee</span>
            <span
              className={
                order.deliveryFeeAmount > 0
                  ? "font-medium text-text"
                  : "font-medium text-success"
              }
            >
              {order.deliveryFeeAmount > 0
                ? formatMAD(order.deliveryFeeAmount)
                : "Free delivery"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4 text-lg">
            <span className="text-muted">Order Total</span>
            <span className="font-semibold text-brand">{formatMAD(order.totalAmount)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
