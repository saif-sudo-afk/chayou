"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartButton } from "@/components/shop/cart-button";
import { LogoMark } from "@/components/shop/logo-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/packs", label: "Packs" },
  { href: "/checkout", label: "Checkout" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/85 backdrop-blur-xl">
      <div className="container-shell flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/">
          <LogoMark compact />
        </Link>
        <div className="flex items-center justify-between gap-4">
          <nav className="hidden items-center gap-1 rounded-full border border-border bg-panel/70 p-2 md:flex">
            {navItems.map((item) => (
              <Link
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition hover:text-gold",
                  pathname === item.href ? "bg-gold text-black" : "text-muted",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild className="hidden sm:inline-flex" variant="outline">
              <a href="https://instagram.com/chayou_jewels" rel="noreferrer" target="_blank">
                Instagram
              </a>
            </Button>
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}
