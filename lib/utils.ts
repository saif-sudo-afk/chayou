import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DiscountRow, OrderItem, OrderStatus } from "@/lib/types";
import { DELIVERY_FEE_MAD, ORDER_STATUS_LABELS } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMAD(amount: number) {
  return `${amount.toLocaleString("fr-FR")} MAD`;
}

export function formatDate(
  value: Date | string,
  locale: Intl.LocalesArgument = "fr-FR",
) {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(
  value: Date | string,
  locale: Intl.LocalesArgument = "fr-FR",
) {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function normalizeMoroccanPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("212")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+212${digits.slice(1)}`;
  }

  if (digits.startsWith("6") || digits.startsWith("7")) {
    return `+212${digits}`;
  }

  return value.trim();
}

export function isMoroccanPhone(value: string) {
  return /^\+212[67]\d{8}$/.test(normalizeMoroccanPhone(value));
}

export function toWhatsAppDigits(value: string) {
  return normalizeMoroccanPhone(value).replace(/\D/g, "");
}

export function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${toWhatsAppDigits(phone)}?text=${encodeURIComponent(
    message,
  )}`;
}

export function applyPercentageDiscount(price: number, percentage: number) {
  return Math.max(0, Math.round(price - (price * percentage) / 100));
}

export function isDiscountActive(
  discount: Pick<DiscountRow, "isActive" | "expiresAt">,
) {
  if (!discount.isActive) {
    return false;
  }

  if (!discount.expiresAt) {
    return true;
  }

  return new Date(discount.expiresAt).getTime() > Date.now();
}

export function resolveDiscountPricing(
  price: number,
  manualDiscountedPrice: number | null,
  matchingDiscounts: DiscountRow[],
) {
  const discountPriceCandidates = matchingDiscounts
    .filter(isDiscountActive)
    .map((discount) => applyPercentageDiscount(price, discount.percentage));

  if (typeof manualDiscountedPrice === "number") {
    discountPriceCandidates.push(manualDiscountedPrice);
  }

  const effectivePrice =
    discountPriceCandidates.length > 0
      ? Math.min(price, ...discountPriceCandidates)
      : price;

  const activeDiscount =
    effectivePrice < price
      ? Math.round(((price - effectivePrice) / price) * 100)
      : null;

  return {
    originalPrice: price,
    effectivePrice,
    activeDiscountPercentage: activeDiscount,
    savings: Math.max(0, price - effectivePrice),
  };
}

export function getStatusLabel(status: OrderStatus) {
  return ORDER_STATUS_LABELS[status];
}

export function sumOrderItems(items: OrderItem[]) {
  return items.reduce((total, item) => total + item.price * item.qty, 0);
}

export function getDeliveryFeeAmount(includeDeliveryFee: boolean) {
  return includeDeliveryFee ? DELIVERY_FEE_MAD : 0;
}

export function calculateOrderTotal(
  subtotalAmount: number,
  includeDeliveryFee: boolean,
) {
  return subtotalAmount + getDeliveryFeeAmount(includeDeliveryFee);
}

export function buildAdminOrderMessage(params: {
  name: string;
  city: string;
  address: string;
  phone: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFeeAmount?: number;
}) {
  const itemsLine = params.items
    .map((item) => `${item.qty}x ${item.name} (${item.price} MAD)`)
    .join(", ");
  const deliveryLine =
    params.deliveryFeeAmount && params.deliveryFeeAmount > 0
      ? `${params.deliveryFeeAmount} MAD`
      : "Free delivery";

  return [
    `🛍️ New order from ${params.name}`,
    `📍 ${params.city} - ${params.address}`,
    `📱 ${params.phone}`,
    `Items: ${itemsLine}`,
    `Delivery: ${deliveryLine}`,
    `Total: ${params.totalAmount} MAD`,
    "—",
    "Please confirm your order!",
  ].join("\n");
}

export function buildCustomerStatusMessage(params: {
  id: number;
  name: string;
  status: OrderStatus;
  customMessage?: string;
}) {
  return `Hello ${params.name}! Your CHAYOU JEWELS order #${params.id} has been ${params.status}.${params.customMessage ? ` ${params.customMessage}` : ""}`;
}
