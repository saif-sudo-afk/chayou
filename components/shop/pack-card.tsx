"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/hooks/use-cart-store";
import type { CatalogPack } from "@/lib/types";
import { cn, formatMAD } from "@/lib/utils";

type PackCardProps = {
  pack: CatalogPack;
};

export function PackCard({ pack }: PackCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const totalValue = pack.includedProducts.reduce(
    (total, product) => total + product.price,
    0,
  );

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <Card
      className={cn(
        "reveal-card overflow-hidden rounded-lg transition-colors duration-300 hover:border-gold",
        visible && "is-visible",
      )}
      ref={ref}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg">
        <Image
          alt={pack.name}
          className="object-cover transition duration-500 hover:scale-[1.02]"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          src={pack.image}
        />
      </div>
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge variant="crimson">Pack</Badge>
            <h3 className="mt-3 font-display text-3xl font-normal text-brand">
              {pack.name}
            </h3>
          </div>
          {pack.activeDiscountPercentage ? (
            <Badge>{pack.activeDiscountPercentage}%</Badge>
          ) : null}
        </div>
        <p className="text-sm leading-7 text-muted">{pack.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          {pack.includedProducts.map((product) => (
            <div
              className="relative h-12 w-12 overflow-hidden rounded-full border border-border"
              key={`${pack.id}-${product.id}`}
              title={product.name}
            >
              {product.images[0] ? (
                <Image
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="48px"
                  src={product.images[0]}
                />
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted">Valeur {formatMAD(totalValue)}</p>
            {pack.effectivePrice < pack.originalPrice ? (
              <p className="text-sm text-muted line-through">
                {formatMAD(pack.originalPrice)}
              </p>
            ) : null}
            <p className="text-[15px] font-medium text-gold">
              {formatMAD(pack.effectivePrice)}
            </p>
          </div>
          <Button
            onClick={() =>
              addItem({
                id: pack.id,
                type: "pack",
                name: pack.name,
                image: pack.image,
                price: pack.effectivePrice,
                originalPrice: pack.originalPrice,
              })
            }
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
