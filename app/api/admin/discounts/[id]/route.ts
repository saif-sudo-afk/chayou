import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { discounts } from "@/drizzle/schema";
import { getAdminApiSession, jsonError } from "@/lib/api";
import { getDb } from "@/lib/db";
import { discountSchema } from "@/lib/validations";

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
    const parsed = discountSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid discount payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const db = getDb();
    const [updatedDiscount] = await db
      .update(discounts)
      .set({
        productId: parsed.data.scope === "product" ? parsed.data.productId ?? null : null,
        packId: parsed.data.scope === "pack" ? parsed.data.packId ?? null : null,
        percentage: parsed.data.percentage,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        isActive: parsed.data.isActive,
      })
      .where(eq(discounts.id, Number(params.id)))
      .returning();

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/packs");
    revalidatePath("/admin/discounts");

    return NextResponse.json(updatedDiscount);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update discount.";
    return jsonError(message, 500);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getAdminApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const db = getDb();
    await db.delete(discounts).where(eq(discounts.id, Number(params.id)));

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/packs");
    revalidatePath("/admin/discounts");

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete discount.";
    return jsonError(message, 500);
  }
}
