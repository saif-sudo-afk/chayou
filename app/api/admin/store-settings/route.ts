import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminApiSession, jsonError } from "@/lib/api";
import { updateStoreSettings } from "@/lib/store-settings";
import { storeSettingsSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  const session = await getAdminApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const parsed = storeSettingsSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid store settings payload.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const settings = await updateStoreSettings(parsed.data);

    revalidatePath("/");
    revalidatePath("/checkout");
    revalidatePath("/shop");
    revalidatePath("/packs");
    revalidatePath("/admin/dashboard");

    return NextResponse.json(settings);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update store settings.";
    return jsonError(message, 500);
  }
}
