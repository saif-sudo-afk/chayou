import { siteSettings as siteSettingsTable } from "@/drizzle/schema";
import { getDb } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/validations";
import { z } from "zod";

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

const SITE_SETTINGS_KEYS = {
  bannerEnabled: "banner_enabled",
  bannerMessages: "banner_messages",
  heroBackgroundImageUrl: "hero_background_image_url",
  heroHeadline: "hero_headline",
  heroPrimaryButtonLabel: "hero_primary_button_label",
  heroPrimaryButtonLink: "hero_primary_button_link",
  heroSecondaryButtonLabel: "hero_secondary_button_label",
  heroSecondaryButtonLink: "hero_secondary_button_link",
  newArrivalsMode: "new_arrivals_mode",
  newArrivalsCount: "new_arrivals_count",
  newArrivalsProductIds: "new_arrivals_product_ids",
  shopProductsPerPage: "shop_products_per_page",
  shopMobileColumns: "shop_mobile_columns",
} as const;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  banner: {
    enabled: true,
    messages: ["Enjoy free shipping on all U.S. orders"],
  },
  hero: {
    backgroundImageUrl: "/background.jpeg",
    headline: "Stack It. Style It. Live In It.",
    primaryButtonLabel: "NEW ARRIVALS",
    primaryButtonLink: "#new-arrivals",
    secondaryButtonLabel: "SHOP ALL",
    secondaryButtonLink: "/shop",
  },
  newArrivals: {
    mode: "latest",
    count: 8,
    productIds: [],
  },
  shop: {
    productsPerPage: 6,
    mobileColumns: 2,
  },
};

function createDefaultSiteSettings(): SiteSettings {
  return {
    banner: {
      enabled: DEFAULT_SITE_SETTINGS.banner.enabled,
      messages: [...DEFAULT_SITE_SETTINGS.banner.messages],
    },
    hero: {
      ...DEFAULT_SITE_SETTINGS.hero,
    },
    newArrivals: {
      ...DEFAULT_SITE_SETTINGS.newArrivals,
      productIds: [...DEFAULT_SITE_SETTINGS.newArrivals.productIds],
    },
    shop: {
      ...DEFAULT_SITE_SETTINGS.shop,
    },
  };
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  const values = value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return values.length > 0 ? values : null;
}

function readIntegerArray(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  const values = value.filter(
    (entry): entry is number =>
      typeof entry === "number" && Number.isInteger(entry) && entry > 0,
  );

  return values.length > 0 ? values : [];
}

function mergeSiteSettings(
  rows: Array<{ key: string; value: unknown }>,
): SiteSettings {
  const settings = createDefaultSiteSettings();

  for (const row of rows) {
    switch (row.key) {
      case SITE_SETTINGS_KEYS.bannerEnabled: {
        const value = readBoolean(row.value);
        if (value !== null) {
          settings.banner.enabled = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.bannerMessages: {
        const value = readStringArray(row.value);
        if (value) {
          settings.banner.messages = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.heroBackgroundImageUrl: {
        const value = readString(row.value);
        if (value) {
          settings.hero.backgroundImageUrl = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.heroHeadline: {
        const value = readString(row.value);
        if (value) {
          settings.hero.headline = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.heroPrimaryButtonLabel: {
        const value = readString(row.value);
        if (value) {
          settings.hero.primaryButtonLabel = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.heroPrimaryButtonLink: {
        const value = readString(row.value);
        if (value) {
          settings.hero.primaryButtonLink = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.heroSecondaryButtonLabel: {
        const value = readString(row.value);
        if (value) {
          settings.hero.secondaryButtonLabel = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.heroSecondaryButtonLink: {
        const value = readString(row.value);
        if (value) {
          settings.hero.secondaryButtonLink = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.newArrivalsMode: {
        if (row.value === "latest" || row.value === "manual") {
          settings.newArrivals.mode = row.value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.newArrivalsCount: {
        const value = readNumber(row.value);
        if (value !== null && Number.isInteger(value) && value > 0) {
          settings.newArrivals.count = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.newArrivalsProductIds: {
        const value = readIntegerArray(row.value);
        if (value !== null) {
          settings.newArrivals.productIds = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.shopProductsPerPage: {
        const value = readNumber(row.value);
        if (value !== null && Number.isInteger(value) && value > 0) {
          settings.shop.productsPerPage = value;
        }
        break;
      }
      case SITE_SETTINGS_KEYS.shopMobileColumns: {
        const value = readNumber(row.value);
        if (value === 1 || value === 2) {
          settings.shop.mobileColumns = value;
        }
        break;
      }
      default:
        break;
    }
  }

  const parsed = siteSettingsSchema.safeParse(settings);
  return parsed.success ? parsed.data : createDefaultSiteSettings();
}

function serializeSiteSettings(settings: SiteSettings) {
  return [
    {
      key: SITE_SETTINGS_KEYS.bannerEnabled,
      value: settings.banner.enabled,
    },
    {
      key: SITE_SETTINGS_KEYS.bannerMessages,
      value: settings.banner.messages,
    },
    {
      key: SITE_SETTINGS_KEYS.heroBackgroundImageUrl,
      value: settings.hero.backgroundImageUrl,
    },
    {
      key: SITE_SETTINGS_KEYS.heroHeadline,
      value: settings.hero.headline,
    },
    {
      key: SITE_SETTINGS_KEYS.heroPrimaryButtonLabel,
      value: settings.hero.primaryButtonLabel,
    },
    {
      key: SITE_SETTINGS_KEYS.heroPrimaryButtonLink,
      value: settings.hero.primaryButtonLink,
    },
    {
      key: SITE_SETTINGS_KEYS.heroSecondaryButtonLabel,
      value: settings.hero.secondaryButtonLabel,
    },
    {
      key: SITE_SETTINGS_KEYS.heroSecondaryButtonLink,
      value: settings.hero.secondaryButtonLink,
    },
    {
      key: SITE_SETTINGS_KEYS.newArrivalsMode,
      value: settings.newArrivals.mode,
    },
    {
      key: SITE_SETTINGS_KEYS.newArrivalsCount,
      value: settings.newArrivals.count,
    },
    {
      key: SITE_SETTINGS_KEYS.newArrivalsProductIds,
      value: settings.newArrivals.productIds,
    },
    {
      key: SITE_SETTINGS_KEYS.shopProductsPerPage,
      value: settings.shop.productsPerPage,
    },
    {
      key: SITE_SETTINGS_KEYS.shopMobileColumns,
      value: settings.shop.mobileColumns,
    },
  ] as const;
}

export async function getSiteSettings() {
  try {
    const db = getDb();
    const rows = await db
      .select({
        key: siteSettingsTable.key,
        value: siteSettingsTable.value,
      })
      .from(siteSettingsTable);

    return mergeSiteSettings(rows);
  } catch {
    return createDefaultSiteSettings();
  }
}

export async function updateSiteSettings(input: SiteSettings) {
  const parsed = siteSettingsSchema.parse(input);
  const db = getDb();
  const now = new Date();

  await Promise.all(
    serializeSiteSettings(parsed).map((entry) =>
      db
        .insert(siteSettingsTable)
        .values({
          key: entry.key,
          value: entry.value,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: siteSettingsTable.key,
          set: {
            value: entry.value,
            updatedAt: now,
          },
        }),
    ),
  );

  return parsed;
}
