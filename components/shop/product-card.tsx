"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductGallery } from "@/components/shop/product-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/hooks/use-cart-store";
import type { CatalogProduct } from "@/lib/types";
import { cn, formatMAD } from "@/lib/utils";

type ProductCardProps = {
  product: CatalogProduct;
};

const categoryLabels: Record<string, string> = {
  rings: "Bagues",
  bracelets: "Bracelets",
  necklaces: "Colliers",
  earrings: "Boucles",
  sets: "Ensembles",
  "small-menu": "Petit Prix",
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

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
      <div className="relative aspect-square overflow-hidden bg-bg">
        <ProductGallery alt={product.name} images={product.images} />
      </div>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="muted">{categoryLabels[product.category] ?? product.category}</Badge>
            {product.activeDiscountPercentage ? (
              <Badge>{product.activeDiscountPercentage}%</Badge>
            ) : null}
          </div>
          <h3 className="font-sans text-sm font-normal uppercase tracking-[0.08em] text-text">
            {product.name}
          </h3>
        </div>
        <p className="line-clamp-2 text-xs leading-6 text-muted">
          {product.description}
        </p>
        {(product.category === "rings" || product.category === "bracelets" || product.category === "necklaces") && (product.ringDiameter || product.ringWidth) ? (
          <p className="text-xs text-muted">
            {[
              product.ringDiameter
                ? `${product.category === "necklaces" ? "Long." : "Ø"} ${product.ringDiameter} mm`
                : null,
              product.ringWidth ? `Larg. ${product.ringWidth} mm` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            {product.effectivePrice < product.originalPrice ? (
              <p className="text-xs text-muted line-through">
                {formatMAD(product.originalPrice)}
              </p>
            ) : null}
            <p className="text-[15px] font-medium text-gold">
              {formatMAD(product.effectivePrice)}
            </p>
          </div>
          <Button
            className="w-full"
            disabled={product.stock === 0}
            onClick={() =>
              addItem({
                id: product.id,
                type: "product",
                name: product.name,
                image: product.primaryImage,
                price: product.effectivePrice,
                originalPrice: product.originalPrice,
              })
            }
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {product.stock > 0 ? "Ajouter au panier" : "Épuisé"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
