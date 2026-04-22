import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminApiSession, jsonError } from "@/lib/api";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";
import { siteSettingsSchema } from "@/lib/validations";

export async function GET() {
  const session = await getAdminApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load site settings.";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const parsed = siteSettingsSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid site settings payload.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const settings = await updateSiteSettings(parsed.data);

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/packs");
    revalidatePath("/admin/dashboard");

    return NextResponse.json(settings);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update site settings.";
    return jsonError(message, 500);
  }
}
