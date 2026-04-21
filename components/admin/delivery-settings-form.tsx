"use client";

import { Save, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DELIVERY_FEE_MAD } from "@/lib/constants";

type DeliverySettingsFormProps = {
  freeDeliveryEnabled: boolean;
};

export function DeliverySettingsForm({
  freeDeliveryEnabled,
}: DeliverySettingsFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(freeDeliveryEnabled);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/admin/store-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          freeDeliveryEnabled: value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to update delivery settings.");
      }

      toast.success("Delivery settings updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
          <Truck className="h-4 w-4" />
          Free Delivery
        </div>
        <p className="text-sm text-muted">
          Customers do not see this toggle. When it is on, new orders keep the
          product subtotal. When it is off, {DELIVERY_FEE_MAD} MAD is added once
          per order.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-full border border-border bg-bg/70 px-4 py-2">
          <Switch checked={value} onCheckedChange={setValue} />
          <span className="text-sm font-medium text-brand">
            {value ? "Free delivery active" : `Add ${DELIVERY_FEE_MAD} MAD delivery fee`}
          </span>
        </div>
        <Button disabled={saving} type="button" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
