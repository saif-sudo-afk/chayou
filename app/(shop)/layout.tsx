export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { SiteFooter } from "@/components/shop/site-footer";
import { SiteHeader } from "@/components/shop/site-header";
import { getStoreSettings } from "@/lib/store-settings";

export default async function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getStoreSettings();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <CartDrawer freeDeliveryEnabled={settings.freeDeliveryEnabled} />
    </div>
  );
}
