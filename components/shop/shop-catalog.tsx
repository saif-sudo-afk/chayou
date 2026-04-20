"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/product-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { CatalogProduct, ProductCategory } from "@/lib/types";

type ShopCatalogProps = {
  products: CatalogProduct[];
};

const categoryLabels: Record<string, string> = {
  rings: "Bagues",
  bracelets: "Bracelets",
  necklaces: "Colliers",
  earrings: "Boucles",
  sets: "Ensembles",
};

export function ShopCatalog({ products }: ShopCatalogProps) {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string>("all");
  const deferredCategory = useDeferredValue(category);

  useEffect(() => {
    const nextCategory = searchParams.get("category");
    if (nextCategory && PRODUCT_CATEGORIES.includes(nextCategory as ProductCategory)) {
      setCategory(nextCategory);
      return;
    }

    setCategory("all");
  }, [searchParams]);

  const filteredProducts =
    deferredCategory === "all"
      ? products
      : products.filter((product) => product.category === deferredCategory);

  return (
    <div className="space-y-8">
      <Tabs
        onValueChange={(value) => startTransition(() => setCategory(value))}
        value={category}
      >
        <TabsList className="flex h-auto flex-wrap justify-center gap-2 bg-surface">
          <TabsTrigger value="all">Tout</TabsTrigger>
          {PRODUCT_CATEGORIES.map((item) => (
            <TabsTrigger key={item} value={item}>
              {categoryLabels[item] ?? item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
