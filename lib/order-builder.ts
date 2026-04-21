import { and, eq, inArray } from "drizzle-orm";
import { packs, products } from "@/drizzle/schema";
import { getDb } from "@/lib/db";
import { getActiveDiscounts } from "@/lib/queries";
import type { OrderItem } from "@/lib/types";
import {
  calculateOrderTotal,
  getDeliveryFeeAmount,
  resolveDiscountPricing,
  sumOrderItems,
} from "@/lib/utils";

type BuildCanonicalOrderOptions = {
  includeDeliveryFee?: boolean;
};

export async function buildCanonicalOrder(
  items: OrderItem[],
  options: BuildCanonicalOrderOptions = {},
) {
  const db = getDb();
  const productIds = items
    .filter((item) => item.type === "product" && item.productId)
    .map((item) => item.productId!) ;
  const packIds = items
    .filter((item) => item.type === "pack" && item.packId)
    .map((item) => item.packId!);

  const [productRows, packRows, discountRows] = await Promise.all([
    productIds.length > 0
      ? db
          .select()
          .from(products)
          .where(and(inArray(products.id, productIds), eq(products.isActive, true)))
      : Promise.resolve([]),
    packIds.length > 0
      ? db
          .select()
          .from(packs)
          .where(and(inArray(packs.id, packIds), eq(packs.isActive, true)))
      : Promise.resolve([]),
    getActiveDiscounts(),
  ]);

  const productMap = new Map(productRows.map((product) => [product.id, product]));
  const packMap = new Map(packRows.map((pack) => [pack.id, pack]));

  const canonicalItems = items.map((item) => {
    if (item.type === "product" && item.productId) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} is unavailable.`);
      }

      const pricing = resolveDiscountPricing(
        product.price,
        product.discountedPrice,
        discountRows.filter(
          (discount) =>
            discount.productId === product.id ||
            (discount.productId === null && discount.packId === null),
        ),
      );

      return {
        type: "product" as const,
        productId: product.id,
        name: product.name,
        qty: item.qty,
        price: pricing.effectivePrice,
        image: product.images[0] ?? null,
      };
    }

    if (item.type === "pack" && item.packId) {
      const pack = packMap.get(item.packId);

      if (!pack) {
        throw new Error(`Pack ${item.packId} is unavailable.`);
      }

      const pricing = resolveDiscountPricing(
        pack.price,
        pack.discountedPrice,
        discountRows.filter(
          (discount) =>
            discount.packId === pack.id ||
            (discount.productId === null && discount.packId === null),
        ),
      );

      return {
        type: "pack" as const,
        packId: pack.id,
        name: pack.name,
        qty: item.qty,
        price: pricing.effectivePrice,
        image: pack.image,
      };
    }

    throw new Error("Invalid order item payload.");
  });

  const subtotalAmount = sumOrderItems(canonicalItems);
  const includeDeliveryFee = options.includeDeliveryFee ?? false;

  return {
    items: canonicalItems,
    subtotalAmount,
    deliveryFeeAmount: getDeliveryFeeAmount(includeDeliveryFee),
    totalAmount: calculateOrderTotal(subtotalAmount, includeDeliveryFee),
  };
}
