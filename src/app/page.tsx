import { getAllVoiceActors } from "@/lib/db";
import VoiceActorCard from "@/components/VoiceActorCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const actors = await getAllVoiceActors();

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-brand-navy">Voice Actors</h1>
        <p className="text-brand-navy/60 mt-2">
          {actors.length} artist{actors.length !== 1 ? "s" : ""} — click any card to explore their characters
        </p>
      </div>

      {actors.length === 0 ? (
        <div className="text-center py-24 text-brand-navy/40">
          <p className="text-xl">No voice actors yet.</p>
          <p className="text-sm mt-2">Run <code className="bg-brand-cream px-2 py-0.5 rounded border border-brand-gold/50">npm run db:seed</code> to load sample data.</p>
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
