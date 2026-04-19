import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { packs } from "@/drizzle/schema";
import { getAdminApiSession, jsonError } from "@/lib/api";
import { getDb } from "@/lib/db";
import { packSchema } from "@/lib/validations";

export async function POST(request: Request) {
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
    const [createdPack] = await db.insert(packs).values(parsed.data).returning();

    revalidatePath("/");
    revalidatePath("/packs");
    revalidatePath("/admin/packs");

    return NextResponse.json(createdPack);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create pack.";
    return jsonError(message, 500);
  }
}
