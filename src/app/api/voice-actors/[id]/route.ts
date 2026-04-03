import { NextResponse } from "next/server";
import { getVoiceActorById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const actor = await getVoiceActorById(params.id);
  if (!actor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(actor);
}
