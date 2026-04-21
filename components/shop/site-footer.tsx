import { AtSign, Globe2, Music2, Phone } from "lucide-react";
import { LogoMark } from "@/components/shop/logo-mark";
import { BRAND } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

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
          <LogoMark className="w-fit" />
          <p className="max-w-sm text-sm font-light leading-7 text-border/90">
            Modern, minimal, and durable jewelry with warm editorial tones for
            everyday Moroccan light.
          </p>
        </div>

        <div className="space-y-5 md:text-right">
          <div className="space-y-2 text-sm font-light text-border">
            <p>Email: chyoujewels@gmail.com</p>
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
              className="text-gold transition hover:-translate-y-0.5 hover:text-surface"
              href={BRAND.instagram}
              rel="noreferrer"
              target="_blank"
            >
              <AtSign className="h-5 w-5" />
            </a>
            <a
              className="text-gold transition hover:-translate-y-0.5 hover:text-surface"
              href={BRAND.instagram}
              rel="noreferrer"
              target="_blank"
            >
              <Music2 className="h-5 w-5" />
            </a>
            <a
              className="text-gold transition hover:-translate-y-0.5 hover:text-surface"
              href={BRAND.instagram}
              rel="noreferrer"
              target="_blank"
            >
              <Globe2 className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/20 py-4 text-center text-[11px] font-light text-muted">
        <span className="brand-wordmark text-[11px] text-border">CHAYOU JEWELS</span>
        <span className="px-2">·</span>
        Maroc
      </div>
    </footer>
  );
}
