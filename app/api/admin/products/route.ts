import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { products } from "@/drizzle/schema";
import { getAdminApiSession, jsonError } from "@/lib/api";
import { getDb } from "@/lib/db";
import { productSchema } from "@/lib/validations";

export async function POST(request: Request) {
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
    const [createdProduct] = await db
      .insert(products)
      .values(parsed.data)
      .returning();

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return NextResponse.json(createdProduct);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product.";
    return jsonError(message, 500);
  }
}
