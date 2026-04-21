export const PRODUCT_CATEGORIES = [
  "rings",
  "bracelets",
  "necklaces",
  "earrings",
  "sets",
] as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const DELIVERY_FEE_MAD = 25;

export const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fes",
  "Tangier",
  "Agadir",
  "Meknes",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "Safi",
  "El Jadida",
  "Nador",
  "Beni Mellal",
  "Taza",
  "Khouribga",
  "Essaouira",
  "Mohammedia",
  "Laayoune",
  "Dakhla",
] as const;

export const BRAND = {
  name: "CHAYOU JEWELS",
  tagline: "Modern, minimal & durable jewelry",
  instagram: "https://instagram.com/chayou_jewels",
  instagramHandle: "@chayou_jewels",
  shippingText: "Ships across Morocco only",
};

export const ORDER_STATUS_LABELS: Record<(typeof ORDER_STATUSES)[number], string> =
  {
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
