import {
  and,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { discounts, orders, packs, products } from "@/drizzle/schema";
import { getDb } from "@/lib/db";
import type {
  CatalogPack,
  CatalogProduct,
  DiscountRow,
  OrderStatus,
  PackRow,
  ProductRow,
} from "@/lib/types";
import { isDiscountActive, resolveDiscountPricing } from "@/lib/utils";

function withProductPricing(
  product: ProductRow,
  allDiscounts: DiscountRow[],
): CatalogProduct {
  const applicableDiscounts = allDiscounts.filter(
    (discount) =>
      discount.productId === product.id ||
      (discount.productId === null && discount.packId === null),
  );

  return {
    ...product,
    ...resolveDiscountPricing(
      product.price,
      product.discountedPrice,
      applicableDiscounts,
    ),
    primaryImage: product.images[0] ?? null,
  };
}

function withPackPricing(
  pack: PackRow,
  includedProducts: ProductRow[],
  allDiscounts: DiscountRow[],
): CatalogPack {
  const applicableDiscounts = allDiscounts.filter(
    (discount) =>
      discount.packId === pack.id ||
      (discount.productId === null && discount.packId === null),
  );

  return {
    ...pack,
    ...resolveDiscountPricing(pack.price, pack.discountedPrice, applicableDiscounts),
    includedProducts,
  };
}

export async function getActiveDiscounts() {
  const db = getDb();
  const discountRows = await db
    .select()
    .from(discounts)
    .orderBy(desc(discounts.createdAt));

  return discountRows.filter(isDiscountActive);
}

export async function getStorefrontProducts(limit?: number) {
  const db = getDb();
  const [productRows, discountRows] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
      .limit(limit ?? 100),
    getActiveDiscounts(),
  ]);

  return productRows.map((product) => withProductPricing(product, discountRows));
}

export async function getStorefrontPacks() {
  const db = getDb();
  const [packRows, productRows, discountRows] = await Promise.all([
    db
      .select()
      .from(packs)
      .where(eq(packs.isActive, true))
      .orderBy(desc(packs.createdAt)),
    db.select().from(products),
    getActiveDiscounts(),
  ]);

  const productMap = new Map(productRows.map((product) => [product.id, product]));

  return packRows.map((pack) =>
    withPackPricing(
      pack,
      pack.productIds
        .map((productId) => productMap.get(productId))
        .filter(Boolean) as ProductRow[],
      discountRows,
    ),
  );
}

export async function getHomePageData() {
  const [featuredProducts, activePacks] = await Promise.all([
    getStorefrontProducts(8),
    getStorefrontPacks(),
  ]);

  return {
    featuredProducts,
    activePacks,
  };
}

export async function getAdminDashboardData() {
  const db = getDb();
  const [statsRow] = await db
    .select({
      totalOrders: sql<number>`count(*)`,
      pendingOrders:
        sql<number>`coalesce(sum(case when ${orders.status} = 'pending' then 1 else 0 end), 0)`,
      totalRevenue:
        sql<number>`coalesce(sum(case when ${orders.status} <> 'cancelled' then ${orders.totalAmount} else 0 end), 0)`,
    })
    .from(orders);

  const [activeProductsRow] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(products)
    .where(eq(products.isActive, true));

  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(10);

  return {
    stats: {
      totalOrders: Number(statsRow?.totalOrders ?? 0),
      pendingOrders: Number(statsRow?.pendingOrders ?? 0),
      totalRevenue: Number(statsRow?.totalRevenue ?? 0),
      activeProducts: Number(activeProductsRow?.count ?? 0),
    },
    recentOrders,
  };
}

export async function getAdminProducts() {
  const db = getDb();
  const discountRows = await getActiveDiscounts();
  const productRows = await db.select().from(products).orderBy(desc(products.createdAt));

  return productRows.map((product) => withProductPricing(product, discountRows));
}

export async function getAdminProduct(id: number) {
  const db = getDb();
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);

  return product ?? null;
}

export async function getAdminPacks() {
  const db = getDb();
  const [packRows, productRows, discountRows] = await Promise.all([
    db.select().from(packs).orderBy(desc(packs.createdAt)),
    db.select().from(products),
    getActiveDiscounts(),
  ]);

  const productMap = new Map(productRows.map((product) => [product.id, product]));

  return packRows.map((pack) =>
    withPackPricing(
      pack,
      pack.productIds
        .map((productId) => productMap.get(productId))
        .filter(Boolean) as ProductRow[],
      discountRows,
    ),
  );
}

export async function getAdminPack(id: number) {
  const db = getDb();
  const [pack] = await db.select().from(packs).where(eq(packs.id, id)).limit(1);

  return pack ?? null;
}

export async function getAdminDiscounts() {
  const db = getDb();
  return db.select().from(discounts).orderBy(desc(discounts.createdAt));
}

export async function getAdminDiscount(id: number) {
  const db = getDb();
  const [discount] = await db
    .select()
    .from(discounts)
    .where(eq(discounts.id, id))
    .limit(1);

  return discount ?? null;
}

export async function getAdminOrder(id: number) {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

  return order ?? null;
}

export async function getConfirmationOrder(id: number) {
  return getAdminOrder(id);
}

export async function getAdminOrders(filters?: {
  status?: OrderStatus | "all";
  search?: string;
  from?: string;
  to?: string;
}) {
  const db = getDb();
  const clauses = [];

  if (filters?.status && filters.status !== "all") {
    clauses.push(eq(orders.status, filters.status));
  }

  if (filters?.search) {
    clauses.push(
      or(
        ilike(orders.customerName, `%${filters.search}%`),
        ilike(orders.customerPhone, `%${filters.search}%`),
      )!,
    );
  }

  if (filters?.from) {
    clauses.push(gte(orders.createdAt, new Date(filters.from)));
  }

  if (filters?.to) {
    const endDate = new Date(filters.to);
    endDate.setHours(23, 59, 59, 999);
    clauses.push(lte(orders.createdAt, endDate));
  }

  const whereClause = clauses.length > 0 ? and(...clauses) : undefined;

  return db
    .select()
    .from(orders)
    .where(whereClause)
    .orderBy(desc(orders.createdAt));
}

export async function getProductOptions() {
  const db = getDb();
  return db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      images: products.images,
      isActive: products.isActive,
    })
    .from(products)
    .orderBy(desc(products.createdAt));
}

export async function getDiscountTargets() {
  const db = getDb();
  const [productRows, packRows] = await Promise.all([
    db.select({ id: products.id, name: products.name }).from(products),
    db.select({ id: packs.id, name: packs.name }).from(packs),
  ]);

  return {
    products: productRows,
    packs: packRows,
  };
}

export async function getProductsByIds(ids: number[]) {
  if (ids.length === 0) {
    return [];
  }

  const db = getDb();
  return db.select().from(products).where(inArray(products.id, ids));
}
