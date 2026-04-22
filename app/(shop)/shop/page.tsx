import { BrandText } from "@/components/shop/brand-text";
import { SectionHeading } from "@/components/shop/section-heading";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { getPaginatedStorefrontProducts } from "@/lib/queries";
import { getSiteSettings } from "@/lib/site-settings";
import type { ProductCategory } from "@/lib/types";

type ShopPageProps = {
  searchParams?: {
    category?: string | string[];
    page?: string | string[];
  };
};

function readSingleParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function parseCategory(value?: string | string[]) {
  const category = readSingleParam(value);

  if (!category) {
    return "all" as const;
  }

  return PRODUCT_CATEGORIES.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : ("all" as const);
}

function parsePage(value?: string | string[]) {
  const page = Number(readSingleParam(value));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const siteSettings = await getSiteSettings();
  const category = parseCategory(searchParams?.category);
  const requestedPage = parsePage(searchParams?.page);
  const catalog = await getPaginatedStorefrontProducts({
    category: category === "all" ? undefined : category,
    page: requestedPage,
    perPage: siteSettings.shop.productsPerPage,
  });

  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description={
          <>
            Browse the latest <BrandText className="text-sm" short /> pieces, keep
            the category filters you already use, and page through the catalog in
            smaller mobile sets.
          </>
        }
        eyebrow="Shop"
        title="The Collection"
      />
      <ShopCatalog
        currentCategory={category}
        currentPage={catalog.currentPage}
        mobileColumns={siteSettings.shop.mobileColumns}
        products={catalog.products}
        totalPages={catalog.totalPages}
      />
    </section>
  );
}
