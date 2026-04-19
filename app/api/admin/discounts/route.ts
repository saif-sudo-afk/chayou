import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { discounts } from "@/drizzle/schema";
import { getAdminApiSession, jsonError } from "@/lib/api";
import { getDb } from "@/lib/db";
import { discountSchema } from "@/lib/validations";

export async function POST(request: Request) {
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
    const [createdDiscount] = await db
      .insert(discounts)
      .values({
        productId: parsed.data.scope === "product" ? parsed.data.productId ?? null : null,
        packId: parsed.data.scope === "pack" ? parsed.data.packId ?? null : null,
        percentage: parsed.data.percentage,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        isActive: parsed.data.isActive,
      })
      .returning();

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/packs");
    revalidatePath("/admin/discounts");

    return NextResponse.json(createdDiscount);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create discount.";
    return jsonError(message, 500);
  }
}
