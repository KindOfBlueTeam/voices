import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface WikiDetails {
  name: string | null;
  thumbnailUrl: string | null;
  birthDate: string | null;
  birthCity: string | null;
  marriedTo: string | null;
}

async function resolveLabel(qid: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=labels&languages=en&format=json&origin=*`
    );
    const data = await res.json();
    return data?.entities?.[qid]?.labels?.en?.value ?? null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title")?.trim();
  if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

  // Get Wikibase item ID from Wikipedia summary
  const summaryRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  );
  if (!summaryRes.ok) {
    return NextResponse.json({ error: "Wikipedia page not found" }, { status: 404 });
  }
  const summary = await summaryRes.json();
  const qid: string | undefined = summary.wikibase_item;
  const name: string = summary.title ?? null;
  const thumbnailUrl: string | null = summary.thumbnail?.source ?? null;

  if (!qid) {
    return NextResponse.json({ name, thumbnailUrl, birthDate: null, birthCity: null, marriedTo: null });
  }

  // Fetch Wikidata entity
  const entityRes = await fetch(
    `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`
  );
  if (!entityRes.ok) {
    return NextResponse.json({ birthDate: null, birthCity: null, marriedTo: null });
  }
  const entityData = await entityRes.json();
  const claims = entityData?.entities?.[qid]?.claims ?? {};

  const result: WikiDetails = { name, thumbnailUrl, birthDate: null, birthCity: null, marriedTo: null };

  // P569 — date of birth
  const dobClaim = claims["P569"]?.[0]?.mainsnak?.datavalue?.value;
  if (dobClaim?.time) {
    // Format: +YYYY-MM-DDT00:00:00Z
    const m = dobClaim.time.match(/^\+(\d{4}-\d{2}-\d{2})/);
    if (m) result.birthDate = m[1];
  }

  // P19 — place of birth (QID → label)
  const pobQid = claims["P19"]?.[0]?.mainsnak?.datavalue?.value?.id;
  if (pobQid) {
    result.birthCity = await resolveLabel(pobQid);
  }

  // P26 — spouse(s) (QID → label, take first)
  const spouseQid = claims["P26"]?.[0]?.mainsnak?.datavalue?.value?.id;
  if (spouseQid) {
    result.marriedTo = await resolveLabel(spouseQid);
  }

  return NextResponse.json(result);
}
