"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AtSign, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { BrandWordmark } from "@/components/shop/brand-wordmark";
import { CartButton } from "@/components/shop/cart-button";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=rings", label: "Rings" },
  { href: "/shop?category=necklaces", label: "Necklaces" },
  { href: "/shop?category=bracelets", label: "Bracelets" },
  { href: "/shop?category=earrings", label: "Earrings" },
  { href: "/shop?category=sets", label: "Sets" },
  { href: "/packs", label: "Packs" },
  { href: "#contact", label: "Contact" },
] as const;

type SiteHeaderProps = {
  bannerEnabled: boolean;
  bannerMessages: string[];
};

export function SiteHeader({
  bannerEnabled,
  bannerMessages,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const fallbackMarquee =
    "Livraison partout au Maroc · Acier inoxydable premium · Waterproof & anti-ternissement · DM ou WhatsApp pour commander";
  const configuredCopy =
    bannerMessages.length > 0 ? bannerMessages.join(" · ") : fallbackMarquee;
  const bannerCopy =
    configuredCopy === "Enjoy free shipping on all U.S. orders"
      ? fallbackMarquee
      : configuredCopy;

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg">
        {bannerEnabled ? (
          <div className="overflow-hidden border-b border-bg/10 bg-brand text-bg">
            <div className="flex h-12 items-center overflow-hidden">
              <div className="flex min-w-max animate-marquee whitespace-nowrap text-sm font-light tracking-[0.01em] text-bg/95">
                <span className="px-8">{bannerCopy}</span>
                <span className="px-8">{bannerCopy}</span>
                <span className="px-8">{bannerCopy}</span>
                <span className="px-8">{bannerCopy}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="border-b border-brand/10 bg-bg">
          <div className="container-shell grid h-24 grid-cols-[3rem_1fr_5rem] items-center">
            <button
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center text-brand transition hover:bg-brand/5"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              <Menu className="h-6 w-6 stroke-[1.5]" />
            </button>

            <Link
              aria-label="Go to homepage"
              className="justify-self-center"
              href="/"
            >
              <BrandWordmark compact />
            </Link>

            <div className="flex items-center justify-self-end">
              <Link
                aria-label="Search catalog"
                className="flex h-11 w-11 items-center justify-center text-brand transition hover:bg-brand/5"
                href="/shop"
              >
                <Search className="h-5 w-5 stroke-[1.6]" />
              </Link>
              <CartButton className="text-brand hover:bg-brand/5" />
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[70] transition-opacity duration-300",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          aria-label="Close menu overlay"
          className="absolute inset-0 bg-brand/20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          type="button"
        />

        <div
          className={cn(
            "relative flex h-full w-[82vw] max-w-sm flex-col bg-bg shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-brand/10 px-5 py-5">
            <BrandWordmark align="left" className="scale-[0.88] origin-left" compact />
            <button
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center text-brand transition hover:bg-brand/5"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-between px-5 py-8">
            <div className="space-y-5">
              {menuItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href.split("?")[0]);

                return (
                  <Link
                    className={cn(
                      "block text-[1.35rem] font-light leading-none tracking-[0.04em] text-brand transition hover:translate-x-1 hover:text-brand/70 sm:text-[1.45rem]",
                      isActive && "text-brand/55",
                    )}
                    href={item.href}
                    key={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="space-y-4 border-t border-brand/10 pt-6">
              <a
                className="inline-flex items-center gap-2 text-sm tracking-[0.18em] text-brand/65 transition hover:text-brand"
                href="https://instagram.com/chayou_jewels"
                rel="noreferrer"
                target="_blank"
              >
                <AtSign className="h-4 w-4" />
                @chayou_jewels
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
