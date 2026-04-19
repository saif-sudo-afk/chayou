import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { packs } from "@/drizzle/schema";
import { getAdminApiSession, jsonError } from "@/lib/api";
import { getDb } from "@/lib/db";
import { packSchema } from "@/lib/validations";

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
    const parsed = packSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid pack payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const db = getDb();
    const [updatedPack] = await db
      .update(packs)
      .set(parsed.data)
      .where(eq(packs.id, Number(params.id)))
      .returning();

    revalidatePath("/");
    revalidatePath("/packs");
    revalidatePath("/admin/packs");

    return NextResponse.json(updatedPack);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update pack.";
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
    await db.delete(packs).where(eq(packs.id, Number(params.id)));

    revalidatePath("/");
    revalidatePath("/packs");
    revalidatePath("/admin/packs");

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete pack.";
    return jsonError(message, 500);
  }
}
