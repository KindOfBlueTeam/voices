import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

interface Candidate {
  title: string;
  description: string;
  thumbnail: string | null;
  confidence: number;
}

function score(title: string, query: string, description: string): number {
  const q = query.toLowerCase();
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  let s = 0;
  if (t === q) s += 0.5;
  else if (t.includes(q) || q.includes(t)) s += 0.3;
  if (d.includes("voice actor")) s += 0.4;
  else if (d.includes("actor") || d.includes("actress")) s += 0.2;
  if (description) s += 0.1;
  return Math.min(s, 1);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ error: "Missing q" }, { status: 400 });

  // Search Wikipedia
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  const results: SearchResult[] = searchData?.query?.search ?? [];

  if (results.length === 0) {
    return NextResponse.json({ match: null, candidates: [] });
  }

  // Fetch summaries for top results (up to 3)
  const summaries = await Promise.all(
    results.slice(0, 3).map(async (r) => {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(r.title)}`
        );
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    })
  );

  const candidates: Candidate[] = summaries
    .filter(Boolean)
    .map((s) => ({
      title: s.title,
      description: s.description ?? "",
      thumbnail: s.thumbnail?.source ?? null,
      confidence: score(s.title, query, s.description ?? ""),
    }));

  if (candidates.length === 0) {
    return NextResponse.json({ match: null, candidates: [] });
  }

  const best = candidates.reduce((a, b) => (a.confidence >= b.confidence ? a : b));

  if (best.confidence >= 0.8) {
    return NextResponse.json({ match: best, candidates: [] });
  }

  return NextResponse.json({ match: null, candidates });
}
