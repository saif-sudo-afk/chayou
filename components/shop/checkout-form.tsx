"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/hooks/use-cart-store";
import { MOROCCAN_CITIES } from "@/lib/constants";
import { formatMAD } from "@/lib/utils";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Full name is required."),
  customerPhone: z
    .string()
    .regex(/^\+212[67]\d{8}$/, "Use a valid Moroccan WhatsApp number."),
  customerCity: z.string().min(1, "Select a city."),
  customerAddress: z.string().min(8, "Full address is required."),
  notes: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.qty, 0),
    [items],
  );

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "+212",
      customerCity: "",
      customerAddress: "",
      notes: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          items: items.map((item) => ({
            type: item.type,
            productId: item.type === "product" ? item.id : undefined,
            packId: item.type === "pack" ? item.id : undefined,
            name: item.name,
            qty: item.qty,
            price: item.price,
            image: item.image,
          })),
          totalAmount: subtotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to place your order.");
      }

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      clearCart();
      toast.success("Order received. We will confirm it on WhatsApp.");
      router.push(`/confirmation?orderId=${data.orderId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  });

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your cart is empty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted">
            Add products or packs before heading to checkout.
          </p>
          <Button asChild>
            <Link href="/shop">Back to shop</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name</Label>
              <Input id="customerName" {...form.register("customerName")} />
              {form.formState.errors.customerName ? (
                <p className="text-sm text-danger">
                  {form.formState.errors.customerName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">WhatsApp Number</Label>
              <Input
                id="customerPhone"
                placeholder="+212612345678"
                {...form.register("customerPhone")}
              />
              {form.formState.errors.customerPhone ? (
                <p className="text-sm text-danger">
                  {form.formState.errors.customerPhone.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Controller
                control={form.control}
                name="customerCity"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOROCCAN_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.customerCity ? (
                <p className="text-sm text-danger">
                  {form.formState.errors.customerCity.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Full Address</Label>
              <Textarea id="customerAddress" {...form.register("customerAddress")} />
              {form.formState.errors.customerAddress ? (
                <p className="text-sm text-danger">
                  {form.formState.errors.customerAddress.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea
                id="notes"
                placeholder="Delivery notes, landmarks, preferred time..."
                {...form.register("notes")}
              />
            </div>
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? "Submitting..." : "Confirm Order"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div
              className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-border bg-black/20 px-4 py-3"
              key={`${item.type}-${item.id}`}
            >
              <div>
                <p className="font-display text-xl tracking-[0.04em] text-white">
                  {item.name}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  {item.qty} x {formatMAD(item.price)}
                </p>
              </div>
              <span className="font-medium text-gold">
                {formatMAD(item.price * item.qty)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-4 text-lg">
            <span className="text-muted">Total</span>
            <span className="font-semibold text-white">{formatMAD(subtotal)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
