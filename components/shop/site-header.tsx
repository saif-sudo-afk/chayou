"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AtSign, Menu, X } from "lucide-react";
import { useState } from "react";
import { CartButton } from "@/components/shop/cart-button";
import { LogoMark } from "@/components/shop/logo-mark";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Accueil" },
  { href: "/shop?category=rings", label: "Bagues" },
  { href: "/shop?category=necklaces", label: "Colliers" },
  { href: "/shop?category=bracelets", label: "Bracelets" },
  { href: "/shop?category=earrings", label: "Boucles d'oreilles" },
  { href: "/shop?category=sets", label: "Ensembles" },
  { href: "/packs", label: "Packs" },
  { href: "#contact", label: "Contact" },
];

const desktopItems = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Boutique" },
  { href: "/packs", label: "Packs" },
  { href: "/checkout", label: "Panier" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="relative z-50 overflow-hidden bg-brand py-2 text-[13px] font-light text-bg">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          <span className="px-8">
            Livraison partout au Maroc · Acier inoxydable premium · Waterproof &
            anti-ternissement · DM ou WhatsApp pour commander
          </span>
          <span className="px-8">
            Livraison partout au Maroc · Acier inoxydable premium · Waterproof &
            anti-ternissement · DM ou WhatsApp pour commander
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-bg/88 backdrop-blur-md">
        <div className="container-shell grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3">
          <button
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand transition hover:bg-gold-light/35"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <Menu className="h-6 w-6 stroke-[1.5]" />
          </button>

          <Link className="flex justify-center" href="/">
            <LogoMark compact />
          </Link>

          <div className="flex items-center justify-end gap-3">
            <nav className="hidden items-center gap-7 lg:flex">
              {desktopItems.slice(0, 3).map((item) => (
                <Link
                  className={cn(
                    "nav-link text-xs uppercase tracking-[0.16em] text-brand",
                    pathname === item.href && "text-gold",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <CartButton />
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] transition-opacity duration-300",
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <button
          aria-label="Close menu overlay"
          className="absolute inset-0 bg-text/38 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          type="button"
        />

        <div
          className={cn(
            "relative flex h-full w-[84vw] max-w-[32rem] flex-col border-r border-border bg-bg shadow-editorial transition-transform duration-300 ease-out sm:w-1/2",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="grid h-16 shrink-0 grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border px-5 sm:px-6">
            <button
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-brand transition hover:bg-gold-light/35"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              <X className="h-6 w-6 stroke-[1.4]" />
            </button>
            <Link className="flex justify-center" href="/" onClick={() => setMenuOpen(false)}>
              <LogoMark compact />
            </Link>
            <div className="justify-self-end">
              <CartButton />
            </div>
          </div>

          <nav className="flex min-h-0 flex-1 flex-col justify-between px-5 py-10 sm:px-6 sm:py-12">
            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <Link
                  className={cn(
                    "block font-display text-[28px] font-normal leading-tight text-brand transition-all duration-300 hover:translate-x-1 hover:text-gold sm:text-[32px]",
                    menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                  )}
                  href={item.href}
                  key={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    transitionDelay: menuOpen ? `${index * 45}ms` : "0ms",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-8 text-gold">
              <a
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold transition hover:-translate-y-0.5 hover:bg-gold hover:text-brand"
                href="https://instagram.com/chayou_jewels"
                rel="noreferrer"
                target="_blank"
              >
                <AtSign className="h-5 w-5" />
              </a>
              <span className="text-xs uppercase tracking-[0.22em] text-muted">
                @chayou_jewels
              </span>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
