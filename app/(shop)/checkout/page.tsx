import { CheckoutForm } from "@/components/shop/checkout-form";
import { SectionHeading } from "@/components/shop/section-heading";

export default function CheckoutPage() {
  return (
    <section className="container-shell space-y-10 py-14">
      <SectionHeading
        description="Complete your details and we will contact you on WhatsApp to confirm the order."
        eyebrow="Checkout"
        title="Confirm Your Order"
      />
      <CheckoutForm />
    </section>
  );
}
