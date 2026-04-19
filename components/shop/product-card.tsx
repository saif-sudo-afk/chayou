"use client";

import { ShoppingBag } from "lucide-react";
import { ProductGallery } from "@/components/shop/product-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/hooks/use-cart-store";
import type { CatalogProduct } from "@/lib/types";
import { formatMAD } from "@/lib/utils";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="overflow-hidden rounded-[2rem]">
      <div className="relative h-80 overflow-hidden bg-black/20">
        <ProductGallery alt={product.name} images={product.images} />
      </div>
      <CardContent className="space-y-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="muted">{product.category}</Badge>
            <h3 className="font-display text-3xl tracking-[0.04em] text-white">
              {product.name}
            </h3>
          </div>
          {product.activeDiscountPercentage ? (
            <Badge>{product.activeDiscountPercentage}% Off</Badge>
          ) : null}
        </div>
        <p className="line-clamp-2 text-sm leading-7 text-muted">
          {product.description}
        </p>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            {product.effectivePrice < product.originalPrice ? (
              <p className="text-sm text-muted line-through">
                {formatMAD(product.originalPrice)}
              </p>
            ) : null}
            <p className="text-xl font-semibold text-gold">
              {formatMAD(product.effectivePrice)}
            </p>
          </div>
          <Button
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
            {product.stock > 0 ? "Add to Cart" : "Sold Out"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
