import { CheckoutForm } from "@/components/shop/checkout-form";
import { SectionHeading } from "@/components/shop/section-heading";
import { getStoreSettings } from "@/lib/store-settings";

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description="Completez vos informations et nous vous contacterons sur WhatsApp pour confirmer."
        eyebrow="Commande"
        title="Confirmer votre panier"
      />
      <CheckoutForm freeDeliveryEnabled={settings.freeDeliveryEnabled} />
    </section>
  );
}
