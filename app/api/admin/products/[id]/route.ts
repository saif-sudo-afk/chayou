import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { products } from "@/drizzle/schema";
import { getAdminApiSession, jsonError } from "@/lib/api";
import { getDb } from "@/lib/db";
import { productSchema } from "@/lib/validations";

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
    const parsed = productSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid product payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const db = getDb();
    const [updatedProduct] = await db
      .update(products)
      .set(parsed.data)
      .where(eq(products.id, Number(params.id)))
      .returning();

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return NextResponse.json(updatedProduct);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update product.";
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
    await db.delete(products).where(eq(products.id, Number(params.id)));

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete product.";
    return jsonError(message, 500);
  }
}
