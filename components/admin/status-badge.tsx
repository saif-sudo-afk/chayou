import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/types";
import { getStatusLabel } from "@/lib/utils";

type StatusBadgeProps = {
  status: OrderStatus;
};

const variantMap: Record<OrderStatus, "default" | "success" | "warning" | "danger" | "muted"> =
  {
    pending: "warning",
    confirmed: "default",
    shipped: "muted",
    delivered: "success",
    cancelled: "danger",
  };

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={variantMap[status]}>{getStatusLabel(status)}</Badge>;
}
