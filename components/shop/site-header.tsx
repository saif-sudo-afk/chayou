"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AtSign,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
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
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMessageIndex(0);
  }, [bannerMessages]);

  useEffect(() => {
    if (!bannerEnabled || bannerMessages.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % bannerMessages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [bannerEnabled, bannerMessages]);

  const currentMessage =
    bannerMessages[messageIndex] ?? "Enjoy free shipping on all U.S. orders";

  const cycleMessage = (direction: "next" | "previous") => {
    if (bannerMessages.length < 2) {
      return;
    }

    setMessageIndex((current) => {
      if (direction === "previous") {
        return current === 0 ? bannerMessages.length - 1 : current - 1;
      }

      return (current + 1) % bannerMessages.length;
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white">
        {bannerEnabled ? (
          <div className="bg-black text-white">
            <div className="container-shell grid h-11 grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
              <button
                aria-label="Show previous announcement"
                className="flex h-9 w-9 items-center justify-center text-white/90 transition hover:text-white"
                onClick={() => cycleMessage("previous")}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-center text-xs tracking-[0.22em] text-white/95 sm:text-sm sm:tracking-[0.28em]">
                {currentMessage}
              </p>
              <button
                aria-label="Show next announcement"
                className="flex h-9 w-9 items-center justify-center justify-self-end text-white/90 transition hover:text-white"
                onClick={() => cycleMessage("next")}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        <div className="border-b border-black/10">
          <div className="container-shell grid h-24 grid-cols-[3rem_1fr_5rem] items-center">
            <button
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center text-neutral-950 transition hover:bg-black/5"
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
                className="flex h-11 w-11 items-center justify-center text-neutral-950 transition hover:bg-black/5"
                href="/shop"
              >
                <Search className="h-5 w-5 stroke-[1.6]" />
              </Link>
              <CartButton className="text-neutral-950 hover:bg-black/5" />
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
          className="absolute inset-0 bg-black/28 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          type="button"
        />

        <div
          className={cn(
            "relative flex h-full w-[82vw] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-5">
            <BrandWordmark align="left" className="scale-[0.88] origin-left" compact />
            <button
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center text-neutral-950 transition hover:bg-black/5"
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
                      "block text-[1.65rem] font-light leading-none text-neutral-950 transition hover:translate-x-1 hover:text-neutral-600",
                      isActive && "text-neutral-500",
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

            <div className="space-y-4 border-t border-black/10 pt-6">
              <a
                className="inline-flex items-center gap-2 text-sm tracking-[0.18em] text-neutral-600 transition hover:text-neutral-950"
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
