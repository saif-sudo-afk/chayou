"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types";

type OrderStatusFormProps = {
  orderId: number;
  status: OrderStatus;
};

export function OrderStatusForm({ orderId, status }: OrderStatusFormProps) {
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(status);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to update status.");
      }

      toast.success("Order status updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Select onValueChange={(nextValue) => setValue(nextValue as OrderStatus)} value={value}>
        <SelectTrigger className="sm:max-w-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button disabled={saving} type="button" onClick={handleUpdate}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving..." : "Update Status"}
      </Button>
    </div>
  );
}
