"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { CatalogProduct, ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type ShopCatalogProps = {
  currentCategory: ProductCategory | "all";
  currentPage: number;
  mobileColumns: 1 | 2;
  products: CatalogProduct[];
  totalPages: number;
};

const categoryLabels: Record<string, string> = {
  rings: "Rings",
  bracelets: "Bracelets",
  necklaces: "Necklaces",
  earrings: "Earrings",
  sets: "Sets",
};

export function ShopCatalog({
  currentCategory,
  currentPage,
  mobileColumns,
  products,
  totalPages,
}: ShopCatalogProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startNavigation] = useTransition();

  const visiblePages = useMemo(() => {
    const pages = new Set<number>([1, totalPages]);

    for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
      if (page > 1 && page < totalPages) {
        pages.add(page);
      }
    }

    return Array.from(pages).sort((left, right) => left - right);
  }, [currentPage, totalPages]);

  const buildHref = (updates: {
    category?: ProductCategory | "all";
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.category) {
      if (updates.category === "all") {
        params.delete("category");
      } else {
        params.set("category", updates.category);
      }
    }

    if (!updates.page || updates.page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(updates.page));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const navigate = (updates: {
    category?: ProductCategory | "all";
    page?: number;
  }) => {
    startNavigation(() => {
      router.push(buildHref(updates), { scroll: false });
    });
  };

  return (
    <div className={cn("space-y-8", isPending && "opacity-75")}>
      <Tabs
        onValueChange={(value) =>
          navigate({
            category: value as ProductCategory | "all",
            page: 1,
          })
        }
        value={currentCategory}
      >
        <TabsList className="flex h-auto flex-wrap justify-center gap-2 rounded-none border-brand/10 bg-bg/70 p-1">
          <TabsTrigger value="all">All</TabsTrigger>
          {PRODUCT_CATEGORIES.map((item) => (
            <TabsTrigger key={item} value={item}>
              {categoryLabels[item] ?? item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {products.length > 0 ? (
        <div
          className={cn(
            "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
            mobileColumns === 1 ? "grid-cols-1" : "grid-cols-2",
          )}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-brand/15 bg-surface/70 px-6 py-16 text-center text-sm tracking-[0.08em] text-muted">
          No products match this category yet.
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              disabled={currentPage === 1 || isPending}
              onClick={() => navigate({ page: currentPage - 1 })}
              size="sm"
              type="button"
              variant="secondary"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            {visiblePages.map((page, index) => {
              const previousPage = visiblePages[index - 1];
              const shouldShowGap = previousPage && page - previousPage > 1;

              return (
                <div className="flex items-center gap-2" key={page}>
                  {shouldShowGap ? (
                    <span className="px-1 text-sm text-muted">...</span>
                  ) : null}
                  <Button
                    className={cn(
                      "min-w-10",
                      page === currentPage &&
                        "border-brand bg-brand text-bg hover:bg-brand",
                    )}
                    disabled={isPending}
                    onClick={() => navigate({ page })}
                    size="sm"
                    type="button"
                    variant="secondary"
                  >
                    {page}
                  </Button>
                </div>
              );
            })}

            <Button
              disabled={currentPage === totalPages || isPending}
              onClick={() => navigate({ page: currentPage + 1 })}
              size="sm"
              type="button"
              variant="secondary"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
