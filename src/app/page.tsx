import { getAllVoiceActors } from "@/lib/db";
import VoiceActorCard from "@/components/VoiceActorCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const actors = await getAllVoiceActors();

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Voice Actors</h1>
        <p className="text-gray-500 mt-2">
          {actors.length} artist{actors.length !== 1 ? "s" : ""} — click any card to explore their characters
        </p>
      </div>

      {actors.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-xl">No voice actors yet.</p>
          <p className="text-sm mt-2">Run <code className="bg-gray-100 px-2 py-0.5 rounded">npm run db:seed</code> to load sample data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {actors.map((actor) => (
            <VoiceActorCard key={actor.id} actor={actor} />
          ))}
        </div>
      )}
    </div>
  );
}
