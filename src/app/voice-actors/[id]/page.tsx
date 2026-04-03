import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getVoiceActorById } from "@/lib/db";
import BioCard from "@/components/BioCard";
import CharacterTile from "@/components/CharacterTile";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const actor = await getVoiceActorById(params.id);
  if (!actor) return { title: "Not Found" };
  return { title: `${actor.name} — Voices` };
}

export default async function VoiceActorPage({ params }: Props) {
  const actor = await getVoiceActorById(params.id);
  if (!actor) notFound();

  // Collect unique shows this actor worked on
  const showMap = new Map<string, string>();
  for (const char of actor.characters) {
    showMap.set(char.show.id, char.show.title);
  }
  const shows = Array.from(showMap.values());

  return (
    <div>
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        ← All voice actors
      </Link>

      {/* Top section: headshot + bio, side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12" style={{ maxWidth: "720px" }}>
        {/* Headshot */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-md">
          {actor.headshot ? (
            <Image
              src={actor.headshot}
              alt={actor.name}
              fill
              className="object-cover object-top"
              sizes="360px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-8xl text-gray-400">{actor.name.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Bio card — same height as headshot via aspect-square + h-full */}
        <div className="aspect-square">
          <BioCard actor={actor} />
        </div>
      </div>

      {/* Shows section */}
      {shows.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Worked on</h2>
          <div className="flex flex-wrap gap-2">
            {shows.map((title) => (
              <span
                key={title}
                className="bg-gray-900 text-white text-sm px-3 py-1 rounded-full"
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Character tiles */}
      {actor.characters.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Characters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {actor.characters.map((char) => (
              <CharacterTile
                key={char.id}
                characterName={char.name}
                characterImage={char.image}
                showTitle={char.show.title}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
