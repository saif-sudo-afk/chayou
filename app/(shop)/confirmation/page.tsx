import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConfirmationOrder } from "@/lib/queries";
import { formatMAD } from "@/lib/utils";

type ConfirmationPageProps = {
  searchParams: {
    orderId?: string;
  };
};

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const orderId = Number(searchParams.orderId);

  if (!orderId) {
    notFound();
  }

  const order = await getConfirmationOrder(orderId);

  if (!order) {
    notFound();
  }

  return (
    <section className="container-shell py-14">
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-gold">
            Commande reçue
          </p>
          <CardTitle>Votre commande a bien été reçue</CardTitle>
          <p className="text-sm text-muted">
            Nous vous contacterons sur WhatsApp {order.customerPhone} pour confirmer.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div
              className="flex items-center justify-between rounded-lg border border-border bg-bg/70 px-4 py-3"
              key={`${item.type}-${item.productId ?? item.packId}`}
            >
              <div>
                <p className="font-display text-xl tracking-[0.04em] text-brand">
                  {item.name}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  {item.qty} x {formatMAD(item.price)}
                </p>
              </div>
              <span className="font-medium text-gold">
                {formatMAD(item.qty * item.price)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-4 text-lg">
            <span className="text-muted">Total</span>
            <span className="font-medium text-text">
              {formatMAD(order.totalAmount)}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            <Button asChild>
              <Link href="/shop">Continuer mes achats</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Retour accueil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
