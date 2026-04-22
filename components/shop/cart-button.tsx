"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart-store";
import { cn } from "@/lib/utils";

type CartButtonProps = {
  className?: string;
};

export function CartButton({ className }: CartButtonProps) {
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.qty, 0);

  useEffect(() => {
    if (!mounted || totalItems === 0) {
      return;
    }

    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 450);

    return () => window.clearTimeout(timer);
  }, [mounted, totalItems]);

  return (
    <Button
      aria-label="Open cart"
      className={cn("relative text-brand", pulse && "animate-pulse-cart", className)}
      size="icon"
      variant="ghost"
      onClick={() => setOpen(true)}
    >
      <ShoppingBag className="h-4 w-4" />
      {mounted && totalItems > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-brand">
          {totalItems}
        </span>
      ) : null}
    </Button>
  );
}
