import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/types";
import { getStatusLabel } from "@/lib/utils";

type StatusBadgeProps = {
  status: OrderStatus;
};

type StatusVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "muted"
  | "crimson";

const variantMap: Record<OrderStatus, StatusVariant> = {
  pending: "warning",
  confirmed: "default",
  shipped: "crimson",
  delivered: "success",
  cancelled: "danger",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={variantMap[status]}>{getStatusLabel(status)}</Badge>;
}
