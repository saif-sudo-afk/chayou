"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatMAD } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, items, setOpen, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex h-full flex-col" side="right">
        <SheetHeader>
          <SheetTitle>Votre Panier</SheetTitle>
          <SheetDescription>
            Vérifiez vos bijoux avant la confirmation WhatsApp.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-bg/70 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-light text-brand">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <p className="font-display text-3xl text-brand">Panier vide</p>
              <p className="text-sm text-muted">
                Ajoutez une pièce ou un pack pour continuer.
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
                    className="flex gap-4 rounded-lg border border-border bg-bg/65 p-4"
                    key={`${item.type}-${item.id}`}
                  >
                    <div className="relative h-24 w-20 overflow-hidden rounded-md bg-surface">
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
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-display text-2xl text-brand">
                          {item.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          {item.type}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
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
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gold">
                            {formatMAD(item.price * item.qty)}
                          </span>
                          <button
                            className="rounded-full p-2 text-muted transition hover:bg-brand hover:text-surface"
                            onClick={() => removeItem(item.type, item.id)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="border-t border-border pt-6">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Sous-total</span>
                <span className="font-medium text-text">{formatMAD(subtotal)}</span>
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
