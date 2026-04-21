import type {
  discounts,
  orders,
  packs,
  products,
  storeSettings,
} from "@/drizzle/schema";
import type { ORDER_STATUSES, PRODUCT_CATEGORIES } from "@/lib/constants";

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
  type: "product" | "pack";
  productId?: number;
  packId?: number;
  name: string;
  qty: number;
  price: number;
  image?: string | null;
};

export type ProductRow = typeof products.$inferSelect;
export type ProductInsert = typeof products.$inferInsert;
export type PackRow = typeof packs.$inferSelect;
export type PackInsert = typeof packs.$inferInsert;
export type DiscountRow = typeof discounts.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type StoreSettingsRow = typeof storeSettings.$inferSelect;

export type CatalogPricing = {
  originalPrice: number;
  effectivePrice: number;
  activeDiscountPercentage: number | null;
  savings: number;
};

export type CatalogProduct = ProductRow &
  CatalogPricing & {
    primaryImage: string | null;
  };

export type CatalogPack = PackRow &
  CatalogPricing & {
    includedProducts: ProductRow[];
  };

export type CartItem = {
  id: number;
  type: "product" | "pack";
  name: string;
  image: string | null;
  price: number;
  originalPrice: number;
  qty: number;
};
