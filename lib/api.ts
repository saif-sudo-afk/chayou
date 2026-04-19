import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function getAdminApiSession() {
  return getServerSession(authOptions);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}
