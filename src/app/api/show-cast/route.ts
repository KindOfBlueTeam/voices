import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface ShowCandidate {
  id: number;
  name: string;
  year: number | null;
  tvmazeType: string;
  thumbnail: string | null;
}

export interface CastMember {
  actorId: number;
  actorName: string;
  actorPhoto: string | null;
  characterName: string;
  voiceRole: boolean;
}

interface TVMazeShow {
  id: number;
  name: string;
  type: string;
  premiered: string | null;
  image: { medium: string; original: string } | null;
}

interface TVMazeCastEntry {
  person: { id: number; name: string; image: { medium: string } | null };
  character: { name: string };
  voice: boolean;
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const showId = searchParams.get("id");

  // Cast fetch for a known show ID
  if (showId) {
    const res = await fetch(`https://api.tvmaze.com/shows/${showId}/cast`);
    if (!res.ok) return NextResponse.json({ cast: [] });
    const data: TVMazeCastEntry[] = await res.json();
    const cast: CastMember[] = data.map((m) => ({
      actorId: m.person.id,
      actorName: m.person.name,
      actorPhoto: m.person.image?.medium ?? null,
      characterName: m.character.name,
      voiceRole: m.voice,
    }));
    return NextResponse.json({ cast });
  }

  // Show search
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Missing q or id" }, { status: 400 });

  const res = await fetch(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`
  );
  if (!res.ok) return NextResponse.json({ match: null, candidates: [] });

  const data: { score: number; show: TVMazeShow }[] = await res.json();
  if (data.length === 0) return NextResponse.json({ match: null, candidates: [] });

  const candidates: ShowCandidate[] = data.slice(0, 3).map(({ show }) => ({
    id: show.id,
    name: show.name,
    year: show.premiered ? parseInt(show.premiered.slice(0, 4)) : null,
    tvmazeType: show.type,
    thumbnail: show.image?.medium ?? null,
  }));

  // Auto-select on exact normalized title match
  if (normalize(data[0].show.name) === normalize(q)) {
    return NextResponse.json({ match: candidates[0], candidates: [] });
  }

  return NextResponse.json({ match: null, candidates });
}
