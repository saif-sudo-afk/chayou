import { AtSign, Globe2, Music2, Phone } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

export function SiteFooter() {
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
  const whatsappHref = adminPhone
    ? buildWhatsAppUrl(
        adminPhone,
        "Hello! I would like to ask about CHAYOU JEWELS.",
      )
    : "#";

  return (
    <footer id="contact" className="bg-text text-border">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <p className="font-display text-3xl font-normal tracking-[0.16em] text-gold">
            {BRAND.name}
          </p>
          <p className="max-w-sm text-sm font-light leading-7 text-border">
            Modern, minimal & durable jewelry. Parchment tones, hammered gold,
            and everyday Moroccan sun.
          </p>
        </div>

        <div className="space-y-5 md:text-right">
          <div className="space-y-2 text-sm font-light text-border">
            <p>Email: contact@chayoujewels.ma</p>
            <a className="inline-flex items-center gap-2 text-gold" href={whatsappHref} rel="noreferrer" target="_blank">
              <Phone className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
          <div className="flex items-center gap-4 md:justify-end">
            <a className="text-gold" href={BRAND.instagram} rel="noreferrer" target="_blank">
              <AtSign className="h-5 w-5" />
            </a>
            <a className="text-gold" href={BRAND.instagram} rel="noreferrer" target="_blank">
              <Music2 className="h-5 w-5" />
            </a>
            <a className="text-gold" href={BRAND.instagram} rel="noreferrer" target="_blank">
              <Globe2 className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/20 py-4 text-center text-[11px] font-light text-muted">
        © 2025 Chayou Jewels · Maroc
      </div>
    </footer>
  );
}
