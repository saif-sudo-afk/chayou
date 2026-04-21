import { storeSettings } from "@/drizzle/schema";
import { getDb } from "@/lib/db";

export const DEFAULT_STORE_SETTINGS = {
  deliveryFeeEnabled: false,
} as const;

export async function getStoreSettings() {
  try {
    const db = getDb();
    const [settings] = await db
      .select({
        deliveryFeeEnabled: storeSettings.deliveryFeeEnabled,
      })
      .from(storeSettings)
      .limit(1);

    return {
      deliveryFeeEnabled:
        settings?.deliveryFeeEnabled ?? DEFAULT_STORE_SETTINGS.deliveryFeeEnabled,
    };
  } catch {
    return { ...DEFAULT_STORE_SETTINGS };
  }
}

export async function updateStoreSettings(input: {
  deliveryFeeEnabled: boolean;
}) {
  const db = getDb();
  const [settings] = await db
    .insert(storeSettings)
    .values({
      id: 1,
      deliveryFeeEnabled: input.deliveryFeeEnabled,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: storeSettings.id,
      set: {
        deliveryFeeEnabled: input.deliveryFeeEnabled,
        updatedAt: new Date(),
      },
    })
    .returning({
      deliveryFeeEnabled: storeSettings.deliveryFeeEnabled,
    });

  return {
    deliveryFeeEnabled: settings.deliveryFeeEnabled,
  };
}
