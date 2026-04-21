import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { orders } from "@/drizzle/schema";
import { getDb } from "@/lib/db";
import { buildCanonicalOrder } from "@/lib/order-builder";
import { jsonError } from "@/lib/api";
import { orderSchema } from "@/lib/validations";
import {
  buildAdminOrderMessage,
  buildWhatsAppUrl,
  normalizeMoroccanPhone,
} from "@/lib/utils";

const ADMIN_WHATSAPP_NUMBER = "0760673116";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid order payload.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const db = getDb();
    const { items, deliveryFeeAmount, totalAmount } = await buildCanonicalOrder(
      parsed.data.items,
      {
        includeDeliveryFee: parsed.data.includeDeliveryFee,
      },
    );
    const customerPhone = normalizeMoroccanPhone(parsed.data.customerPhone);

    const [createdOrder] = await db
      .insert(orders)
      .values({
        customerName: parsed.data.customerName,
        customerPhone,
        customerCity: parsed.data.customerCity,
        customerAddress: parsed.data.customerAddress,
        items,
        totalAmount,
        notes: parsed.data.notes ?? null,
      })
      .returning({
        id: orders.id,
        totalAmount: orders.totalAmount,
      });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/packs");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");

    const adminPhone = ADMIN_WHATSAPP_NUMBER;
    const whatsappUrl = adminPhone
      ? buildWhatsAppUrl(
          adminPhone,
          buildAdminOrderMessage({
            name: parsed.data.customerName,
            city: parsed.data.customerCity,
            address: parsed.data.customerAddress,
            phone: customerPhone,
            items,
            deliveryFeeAmount,
            totalAmount,
          }),
        )
      : null;

    return NextResponse.json({
      orderId: createdOrder.id,
      totalAmount: createdOrder.totalAmount,
      whatsappUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order.";
    return jsonError(message, 500);
  }
}
