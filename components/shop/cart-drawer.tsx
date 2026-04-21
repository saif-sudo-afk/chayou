"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/hooks/use-cart-store";
import {
  calculateOrderTotal,
  formatMAD,
  getDeliveryFeeAmount,
} from "@/lib/utils";

const itemTypeLabels: Record<string, string> = {
  product: "Produit",
  pack: "Pack",
};

type CartDrawerProps = {
  deliveryFeeEnabled: boolean;
};

export function CartDrawer({ deliveryFeeEnabled }: CartDrawerProps) {
  const { clearCart, isOpen, items, removeItem, setOpen, updateQuantity } =
    useCartStore();
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const deliveryFee = getDeliveryFeeAmount(deliveryFeeEnabled);
  const total = calculateOrderTotal(subtotal, deliveryFeeEnabled);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex h-full flex-col" side="right">
        <SheetHeader className="space-y-4 pr-10">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <SheetTitle>Votre Panier</SheetTitle>
              <SheetDescription>
                Verifiez vos bijoux avant la confirmation WhatsApp.
              </SheetDescription>
            </div>
            {items.length > 0 ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="h-10 gap-2" size="sm" variant="secondary">
                    <Trash2 className="h-4 w-4" />
                    Vider
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Vider le panier ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprime tous les articles ajoutes au panier.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-danger text-surface hover:bg-brand"
                      onClick={clearCart}
                    >
                      Vider le panier
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>

          {items.length > 0 ? (
            <div className="rounded-[1.5rem] border border-border bg-bg/70 p-4">
              <p className="font-medium text-brand">Livraison</p>
              <p className="mt-1 text-sm text-muted">
                {deliveryFeeEnabled
                  ? "Les commandes ajoutent automatiquement 25 MAD de frais de livraison."
                  : "Livraison gratuite actuellement active."}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                  deliveryFeeEnabled
                    ? "bg-gold-light/55 text-brand"
                    : "bg-success/12 text-success"
                }`}
              >
                {deliveryFeeEnabled
                  ? `Livraison: ${formatMAD(deliveryFee)}`
                  : "Livraison gratuite"}
              </span>
            </div>
          ) : null}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-bg/70 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-light text-brand">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <p className="font-display text-3xl text-brand">Panier vide</p>
              <p className="text-sm text-muted">
                Ajoutez une piece ou un pack pour continuer.
              </p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/shop">Voir la collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="mt-6 flex-1 pr-3">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    className="flex gap-4 rounded-[1.6rem] border border-border bg-bg/65 p-4"
                    key={`${item.type}-${item.id}`}
                  >
                    <div className="relative h-24 w-20 overflow-hidden rounded-[1rem] bg-surface">
                      {item.image ? (
                        <Image
                          alt={item.name}
                          className="object-cover"
                          fill
                          sizes="96px"
                          src={item.image}
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-display text-2xl text-brand">{item.name}</p>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted">
                            {itemTypeLabels[item.type] ?? item.type}
                          </p>
                        </div>
                        <span className="rounded-full bg-gold-light/40 px-3 py-1 text-sm font-medium text-gold">
                          {formatMAD(item.price * item.qty)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-border bg-surface p-1">
                          <button
                            className="rounded-full p-2 text-muted transition hover:bg-gold-light/40 hover:text-brand"
                            onClick={() =>
                              updateQuantity(item.type, item.id, Math.max(1, item.qty - 1))
                            }
                            type="button"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-8 text-center text-sm">{item.qty}</span>
                          <button
                            className="rounded-full p-2 text-muted transition hover:bg-gold-light/40 hover:text-brand"
                            onClick={() => updateQuantity(item.type, item.id, item.qty + 1)}
                            type="button"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <Button
                          className="h-10 gap-2 border-danger/25 text-danger hover:bg-danger hover:text-surface"
                          onClick={() => removeItem(item.type, item.id)}
                          size="sm"
                          type="button"
                          variant="secondary"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="border-t border-border pt-6">
              <div className="rounded-[1.5rem] bg-bg/70 p-4">
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Sous-total</span>
                  <span className="font-medium text-text">{formatMAD(subtotal)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className={deliveryFeeEnabled ? "text-muted" : "text-success"}>
                    Livraison
                  </span>
                  <span
                    className={
                      deliveryFeeEnabled ? "font-medium text-text" : "font-medium text-success"
                    }
                  >
                    {deliveryFeeEnabled ? formatMAD(deliveryFee) : "Gratuite"}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-lg">
                  <span className="text-brand">Total</span>
                  <span className="font-medium text-text">{formatMAD(total)}</span>
                </div>
              </div>
              <Button asChild className="w-full" onClick={() => setOpen(false)}>
                <Link href="/checkout">Passer commande</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
