import { z } from "zod";
import {
  ORDER_STATUSES,
  PRODUCT_CATEGORIES,
} from "@/lib/constants";
import { isMoroccanPhone } from "@/lib/utils";

const nullablePositiveInt = z.preprocess(
  (value) => {
    if (value === "" || value === undefined || value === null) {
      return null;
    }

    return Number(value);
  },
  z.number().int().positive().nullable(),
);

const nullablePositiveFloat = z.preprocess(
  (value) => {
    if (value === "" || value === undefined || value === null) {
      return null;
    }

    return Number(value);
  },
  z.number().positive().nullable(),
);

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().int().positive(),
  discountedPrice: nullablePositiveInt,
  category: z.enum(PRODUCT_CATEGORIES),
  stock: z.coerce.number().int().min(0),
  images: z.array(z.string().url()).min(1),
  isActive: z.boolean(),
  ringDiameter: nullablePositiveFloat.optional(),
  ringWidth: nullablePositiveFloat.optional(),
});

export const packSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().int().positive(),
  discountedPrice: nullablePositiveInt,
  productIds: z.array(z.number().int().positive()).min(1),
  image: z.string(),
  images: z.array(z.string().url()).min(1, "Au moins une image est requise."),
  isActive: z.boolean(),
});

export const discountSchema = z
  .object({
    scope: z.enum(["sitewide", "product", "pack"]),
    productId: nullablePositiveInt.optional(),
    packId: nullablePositiveInt.optional(),
    percentage: z.coerce.number().int().min(1).max(100),
    expiresAt: z
      .string()
      .nullable()
      .optional()
      .transform((value) => (value === "" ? null : value)),
    isActive: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.scope === "product" && !value.productId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a product for product-specific discounts.",
        path: ["productId"],
      });
    }

    if (value.scope === "pack" && !value.packId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a pack for pack-specific discounts.",
        path: ["packId"],
      });
    }
  });

export const orderItemSchema = z.object({
  type: z.enum(["product", "pack"]),
  productId: z.number().int().positive().optional(),
  packId: z.number().int().positive().optional(),
  name: z.string().min(1),
  qty: z.number().int().min(1),
  price: z.number().int().min(0),
  image: z.string().url().nullable().optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerPhone: z
    .string()
    .refine(isMoroccanPhone, "Use a valid Moroccan WhatsApp number in +212 format."),
  customerCity: z.string().min(2, "Entrez le nom de votre ville.").max(120),
  customerAddress: z.string().min(8).max(300),
  notes: z.string().max(500).nullable().optional(),
  items: z.array(orderItemSchema).min(1),
});

export const orderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export const storeSettingsSchema = z.object({
  freeDeliveryEnabled: z.boolean(),
});

export const siteSettingsSchema = z.object({
  banner: z.object({
    enabled: z.boolean(),
    messages: z.array(z.string().trim().min(1).max(160)).min(1).max(10),
  }),
  hero: z.object({
    backgroundImageUrl: z.string().trim().min(1).max(500),
    headline: z.string().trim().min(1).max(140),
    primaryButtonLabel: z.string().trim().min(1).max(40),
    primaryButtonLink: z.string().trim().min(1).max(255),
    secondaryButtonLabel: z.string().trim().min(1).max(40),
    secondaryButtonLink: z.string().trim().min(1).max(255),
  }),
  newArrivals: z.object({
    mode: z.enum(["latest", "manual"]),
    count: z.coerce.number().int().min(1).max(24),
    productIds: z.array(z.number().int().positive()).max(24),
  }),
  shop: z.object({
    productsPerPage: z.coerce.number().int().min(1).max(48),
    mobileColumns: z.union([z.literal(1), z.literal(2)]),
  }),
});
