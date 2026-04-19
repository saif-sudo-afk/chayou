import { config } from "dotenv";
import { discounts, orders, packs, products } from "@/drizzle/schema";
import { getDb } from "@/lib/db";

config({ path: ".env.local" });
config();

async function seed() {
  const db = getDb();

  await db.delete(discounts);
  await db.delete(orders);
  await db.delete(packs);
  await db.delete(products);

  const insertedProducts = await db
    .insert(products)
    .values([
      {
        name: "Atlas Ring",
        description:
          "A polished gold-tone ring with a clean silhouette designed for everyday styling.",
        price: 420,
        images: [
          "https://picsum.photos/seed/chayou-ring/900/1200",
          "https://picsum.photos/seed/chayou-ring-2/900/1200",
        ],
        category: "rings",
        stock: 9,
        isActive: true,
      },
      {
        name: "Casablanca Bracelet",
        description:
          "Minimal bracelet with a durable finish and refined dark luxury proportions.",
        price: 520,
        images: [
          "https://picsum.photos/seed/chayou-bracelet/900/1200",
          "https://picsum.photos/seed/chayou-bracelet-2/900/1200",
        ],
        category: "bracelets",
        stock: 7,
        isActive: true,
      },
      {
        name: "Noor Necklace",
        description:
          "A layered necklace with subtle shine, crafted to elevate casual and evening looks.",
        price: 690,
        images: [
          "https://picsum.photos/seed/chayou-necklace/900/1200",
          "https://picsum.photos/seed/chayou-necklace-2/900/1200",
        ],
        category: "necklaces",
        stock: 5,
        isActive: true,
      },
    ])
    .returning();

  const [ring, bracelet, necklace] = insertedProducts;

  const [insertedPack] = await db
    .insert(packs)
    .values({
      name: "CHAYOU Evening Set",
      description:
        "A curated trio featuring the Atlas Ring, Casablanca Bracelet, and Noor Necklace.",
      price: 1490,
      productIds: [ring.id, bracelet.id, necklace.id],
      image: "https://picsum.photos/seed/chayou-pack/1200/900",
      isActive: true,
    })
    .returning();

  await db.insert(orders).values({
    customerName: "Sara El Idrissi",
    customerPhone: "+212612345678",
    customerCity: "Casablanca",
    customerAddress: "45 Rue des Bijoux, Maarif",
    items: [
      {
        type: "product",
        productId: ring.id,
        name: ring.name,
        qty: 1,
        price: ring.price,
        image: ring.images[0],
      },
      {
        type: "product",
        productId: bracelet.id,
        name: bracelet.name,
        qty: 1,
        price: bracelet.price,
        image: bracelet.images[0],
      },
    ],
    totalAmount: ring.price + bracelet.price,
    status: "pending",
    notes: "Call before delivery.",
  });

  console.log(
    `Seeded ${insertedProducts.length} products, pack #${insertedPack.id}, and 1 pending order.`,
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
