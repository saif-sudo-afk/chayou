"use client";

import { startTransition, useDeferredValue, useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { CatalogProduct } from "@/lib/types";

type ShopCatalogProps = {
  products: CatalogProduct[];
};

export function ShopCatalog({ products }: ShopCatalogProps) {
  const [category, setCategory] = useState<string>("all");
  const deferredCategory = useDeferredValue(category);

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
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {PRODUCT_CATEGORIES.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item}
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
