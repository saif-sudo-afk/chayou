"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart-store";

export function CartButton() {
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.qty, 0);

  return (
    <Button
      aria-label="Open cart"
      className="relative"
      size="icon"
      variant="secondary"
      onClick={() => setOpen(true)}
    >
      <ShoppingBag className="h-4 w-4" />
      {mounted && totalItems > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-black">
          {totalItems}
        </span>
      ) : null}
    </Button>
  );
}
