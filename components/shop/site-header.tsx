"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AtSign, Menu, X } from "lucide-react";
import { useState } from "react";
import { CartButton } from "@/components/shop/cart-button";
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
        <div className="container-shell grid h-16 grid-cols-3 items-center">
          <button
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center text-brand"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <Menu className="h-6 w-6 stroke-[1.5]" />
          </button>

          <Link className="brand-wordmark justify-self-center text-[22px] sm:text-[26px]" href="/">
            CHAYOU JEWELS
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
          "fixed inset-0 z-[60] bg-bg transition-transform duration-300 ease-out",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="container-shell grid h-16 grid-cols-3 items-center border-b border-border">
          <button
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-brand"
            onClick={() => setMenuOpen(false)}
            type="button"
          >
            <X className="h-6 w-6 stroke-[1.4]" />
          </button>
          <Link
            className="brand-wordmark justify-self-center text-[20px]"
            href="/"
            onClick={() => setMenuOpen(false)}
          >
            CHAYOU JEWELS
          </Link>
          <div className="justify-self-end">
            <CartButton />
          </div>
        </div>

        <nav className="container-shell flex min-h-[calc(100vh-4rem)] flex-col justify-between py-12">
          <div className="space-y-5">
            {menuItems.map((item, index) => (
              <Link
                className="block font-display text-[32px] font-normal leading-tight text-brand transition hover:text-gold"
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-t border-border pt-8 text-gold">
            <a
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold"
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
    </>
  );
}
