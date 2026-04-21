import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { ORDER_STATUSES, PRODUCT_CATEGORIES } from "@/lib/constants";
import type { OrderItem } from "@/lib/types";

export const productCategoryEnum = pgEnum(
  "product_category",
  PRODUCT_CATEGORIES,
);
export const orderStatusEnum = pgEnum("order_status", ORDER_STATUSES);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  images: text("images")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  category: productCategoryEnum("category").notNull(),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const packs = pgTable("packs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  productIds: integer("product_ids")
    .array()
    .notNull()
    .default(sql`ARRAY[]::integer[]`),
  image: text("image").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerCity: text("customer_city").notNull(),
  customerAddress: text("customer_address").notNull(),
  items: jsonb("items")
    .$type<OrderItem[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  deliveryFeeAmount: integer("delivery_fee_amount").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  packId: integer("pack_id").references(() => packs.id, {
    onDelete: "cascade",
  }),
  percentage: integer("percentage").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const storeSettings = pgTable("store_settings", {
  id: integer("id").primaryKey().default(1),
  freeDeliveryEnabled: boolean("free_delivery_enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
