import { storeSettings } from "@/drizzle/schema";
import { getDb } from "@/lib/db";

export const DEFAULT_STORE_SETTINGS = {
  freeDeliveryEnabled: true,
} as const;

export async function getStoreSettings() {
  try {
    const db = getDb();
    const [settings] = await db
      .select({
        freeDeliveryEnabled: storeSettings.freeDeliveryEnabled,
      })
      .from(storeSettings)
      .limit(1);

    return {
      freeDeliveryEnabled:
        settings?.freeDeliveryEnabled ?? DEFAULT_STORE_SETTINGS.freeDeliveryEnabled,
    };
  } catch {
    return { ...DEFAULT_STORE_SETTINGS };
  }
}

export async function updateStoreSettings(input: {
  freeDeliveryEnabled: boolean;
}) {
  const db = getDb();
  const [settings] = await db
    .insert(storeSettings)
    .values({
      id: 1,
      freeDeliveryEnabled: input.freeDeliveryEnabled,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: storeSettings.id,
      set: {
        freeDeliveryEnabled: input.freeDeliveryEnabled,
        updatedAt: new Date(),
      },
    })
    .returning({
      freeDeliveryEnabled: storeSettings.freeDeliveryEnabled,
    });

  return {
    freeDeliveryEnabled: settings.freeDeliveryEnabled,
  };
}
