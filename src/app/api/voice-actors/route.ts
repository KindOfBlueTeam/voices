import { NextResponse } from "next/server";
import { getAllVoiceActors } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const actors = await getAllVoiceActors();
  return NextResponse.json(actors);
}
