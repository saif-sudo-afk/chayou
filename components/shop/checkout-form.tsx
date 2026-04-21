"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle } from "lucide-react";
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
  customerName: z.string().min(2, "Le nom complet est requis."),
  customerPhone: z
    .string()
    .regex(/^\+212[67]\d{8}$/, "Utilisez un numéro WhatsApp marocain valide."),
  customerCity: z.string().min(1, "Sélectionnez une ville."),
  customerAddress: z.string().min(8, "L'adresse complète est requise."),
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
      toast.error("Votre panier est vide.");
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
        throw new Error(data.message ?? "Impossible d'envoyer votre commande.");
      }

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      clearCart();
      toast.success("Commande reçue. Nous vous confirmerons sur WhatsApp.");
      router.push(`/confirmation?orderId=${data.orderId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Le paiement a échoué.");
    } finally {
      setSubmitting(false);
    }
  });

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Votre panier est vide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted">
            Ajoutez une pièce ou un pack avant de confirmer votre commande.
          </p>
          <Button asChild>
            <Link href="/shop">Retour à la boutique</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle>Détails de livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="customerName">Nom complet</Label>
              <Input id="customerName" {...form.register("customerName")} />
              {form.formState.errors.customerName ? (
                <p className="text-sm text-danger">
                  {form.formState.errors.customerName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label className="inline-flex items-center gap-2" htmlFor="customerPhone">
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Numéro WhatsApp
              </Label>
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
              <Label>Ville</Label>
              <Controller
                control={form.control}
                name="customerCity"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir votre ville" />
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
              <Label htmlFor="customerAddress">Adresse complète</Label>
              <Textarea id="customerAddress" {...form.register("customerAddress")} />
              {form.formState.errors.customerAddress ? (
                <p className="text-sm text-danger">
                  {form.formState.errors.customerAddress.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes de commande</Label>
              <Textarea
                id="notes"
                placeholder="Notes de livraison, repère, horaire préféré..."
                {...form.register("notes")}
              />
            </div>
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? "Envoi..." : "Confirmer la commande"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résumé de commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg/70 px-4 py-3"
              key={`${item.type}-${item.id}`}
            >
              <div>
                <p className="font-display text-xl tracking-[0.04em] text-brand">
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
            <span className="font-medium text-text">{formatMAD(subtotal)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
