import { AtSign, Phone } from "lucide-react";
import { BrandWordmark } from "@/components/shop/brand-wordmark";
import { BRAND } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.67a8.16 8.16 0 0 0 4.77 1.52V6.72a4.85 4.85 0 0 1-1-.03z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

const ADMIN_WHATSAPP_NUMBER = "0760673116";

export function SiteFooter() {
  const whatsappHref = buildWhatsAppUrl(
    ADMIN_WHATSAPP_NUMBER,
    "Hello! I would like to ask about CHAYOU JEWELS.",
  );

  return (
    <footer id="contact" className="bg-text text-border">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <BrandWordmark align="left" className="w-fit" tone="light" />
          <p className="max-w-sm text-sm font-light leading-7 text-border/90">
            Des bijoux modernes et minimalistes, pensés pour durer, inspirés par la lumière marocaine.
          </p>
        </div>

        <div className="space-y-5 md:text-right">
          <div className="space-y-2 text-sm font-light text-border">
            <p>Email: chayoujewels@gmail.com</p>
            <a
              className="inline-flex items-center gap-2 text-gold transition hover:text-surface"
              href={whatsappHref}
              rel="noreferrer"
              target="_blank"
            >
              <Phone className="h-4 w-4" />
              {ADMIN_WHATSAPP_NUMBER}
            </a>
          </div>
          <div className="flex items-center gap-4 md:justify-end">
            <a
              aria-label="Instagram @chayou_jewels"
              className="text-gold transition hover:-translate-y-0.5 hover:text-surface"
              href={BRAND.instagram}
              rel="noopener noreferrer"
              target="_blank"
            >
              <AtSign className="h-5 w-5" />
            </a>
            <a
              aria-label="TikTok @chayou.jewels"
              className="text-gold transition hover:-translate-y-0.5 hover:text-surface"
              href="https://www.tiktok.com/@chayou.jewels"
              rel="noopener noreferrer"
              target="_blank"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
            <a
              aria-label="Facebook Chayou Jewels"
              className="text-gold transition hover:-translate-y-0.5 hover:text-surface"
              href="https://www.facebook.com/share/1GqD2kA9My/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/20 py-4 text-center text-[11px] font-light text-muted">
        <span className="brand-wordmark text-[11px] text-border">CHAYOU JEWELS</span>
        <span className="px-2">·</span>
        maroc
      </div>
    </footer>
  );
}
