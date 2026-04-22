export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { SiteFooter } from "@/components/shop/site-footer";
import { SiteHeader } from "@/components/shop/site-header";
import { getSiteSettings } from "@/lib/site-settings";
import { getStoreSettings } from "@/lib/store-settings";

export default async function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [storeSettings, siteSettings] = await Promise.all([
    getStoreSettings(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen">
      <SiteHeader
        bannerEnabled={siteSettings.banner.enabled}
        bannerMessages={siteSettings.banner.messages}
      />
      <main>{children}</main>
      <SiteFooter />
      <CartDrawer freeDeliveryEnabled={storeSettings.freeDeliveryEnabled} />
    </div>
  );
}
