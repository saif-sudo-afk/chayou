import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminApiSession, jsonError } from "@/lib/api";

export async function POST(request: Request) {
  const session = await getAdminApiSession();

  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return jsonError(
      "BLOB_READ_WRITE_TOKEN is missing. Configure Vercel Blob before uploading images.",
      500,
    );
  }

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File);

  if (files.length === 0) {
    return jsonError("Select at least one image to upload.");
  }

  const uploads = await Promise.all(
    files.map((file) =>
      put(`products/${Date.now()}-${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      }),
    ),
  );

  return NextResponse.json({
    urls: uploads.map((upload) => upload.url),
  });
}
