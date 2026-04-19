import { AtSign, MessageCircle } from "lucide-react";
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
    <footer className="border-t border-border/80 bg-black/20">
      <div className="container-shell flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="font-display text-2xl tracking-[0.18em] text-white">
            {BRAND.name}
          </p>
          <p className="text-sm text-muted">{BRAND.shippingText}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-2 text-sm text-white transition hover:border-gold/40 hover:text-gold"
            href={BRAND.instagram}
            rel="noreferrer"
            target="_blank"
          >
            <AtSign className="h-4 w-4" />
            {BRAND.instagramHandle}
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-black transition hover:bg-gold/90"
            href={whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
