import { NextResponse } from "next/server";
import { getAllVoiceActors } from "@/lib/db";

export async function GET() {
  const actors = await getAllVoiceActors();
  return NextResponse.json(actors);
}
