"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  Gem,
  LayoutDashboard,
  Package2,
  ShoppingBag,
} from "lucide-react";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { LogoMark } from "@/components/shop/logo-mark";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Gem },
  { href: "/admin/packs", label: "Packs", icon: Package2 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/discounts", label: "Discounts", icon: BadgeDollarSign },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col gap-6 border-r border-gold/25 bg-text p-6 text-surface">
      <Link href="/admin/dashboard">
        <LogoMark />
      </Link>
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                isActive
                  ? "bg-gold text-brand"
                  : "text-border hover:bg-bg/10 hover:text-gold",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto">
        <AdminSignOutButton />
      </div>
    </aside>
  );
}
