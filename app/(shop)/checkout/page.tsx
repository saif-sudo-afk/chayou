import { CheckoutForm } from "@/components/shop/checkout-form";
import { SectionHeading } from "@/components/shop/section-heading";

export default function CheckoutPage() {
  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description="Complétez vos informations et nous vous contacterons sur WhatsApp pour confirmer."
        eyebrow="Commande"
        title="Confirmer votre panier"
      />
      <CheckoutForm />
    </section>
  );
}
