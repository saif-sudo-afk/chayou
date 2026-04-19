import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { orders } from "@/drizzle/schema";
import { getAdminApiSession, jsonError } from "@/lib/api";
import { getDb } from "@/lib/db";
import { orderStatusSchema } from "@/lib/validations";

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const parsed = orderStatusSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid status payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const db = getDb();
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: parsed.data.status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, Number(params.id)))
      .returning();

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${params.id}`);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update order.";
    return jsonError(message, 500);
  }
}
