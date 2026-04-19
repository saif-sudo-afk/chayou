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
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Review your selection before confirming on WhatsApp.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-border bg-card/60 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-gold">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <p className="font-display text-2xl tracking-[0.08em]">Your cart is empty</p>
              <p className="text-sm text-muted">
                Add pieces from the shop or a curated pack to continue.
              </p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/shop">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="mt-6 flex-1 pr-3">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    className="surface-card flex gap-4 rounded-[1.75rem] border border-border p-4"
                    key={`${item.type}-${item.id}`}
                  >
                    <div className="relative h-24 w-20 overflow-hidden rounded-[1.25rem] bg-white/5">
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
                        <p className="font-display text-xl tracking-[0.04em] text-white">
                          {item.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          {item.type}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="inline-flex items-center rounded-full border border-border bg-black/20 p-1">
                          <button
                            className="rounded-full p-2 text-muted transition hover:bg-white/5 hover:text-white"
                            onClick={() =>
                              updateQuantity(item.type, item.id, Math.max(1, item.qty - 1))
                            }
                            type="button"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-8 text-center text-sm">{item.qty}</span>
                          <button
                            className="rounded-full p-2 text-muted transition hover:bg-white/5 hover:text-white"
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
                            className="rounded-full p-2 text-muted transition hover:bg-brand/20 hover:text-white"
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
                <span>Subtotal</span>
                <span className="font-medium text-white">{formatMAD(subtotal)}</span>
              </div>
              <Button asChild className="w-full" onClick={() => setOpen(false)}>
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
