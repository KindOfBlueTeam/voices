import Link from "next/link";
import Image from "next/image";
import { getAllVoiceActors } from "@/lib/db";
import { removeActor } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const actors = await getAllVoiceActors();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Voice Actors</h1>
          <p className="text-gray-400 text-sm mt-1">{actors.length} in database</p>
        </div>
        <Link
          href="/admin/actors/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Voice Actor
        </Link>
      </div>

      {actors.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No voice actors yet.</p>
          <Link href="/admin/actors/new" className="text-indigo-400 hover:underline mt-2 inline-block">
            Add the first one →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="flex items-center gap-4 bg-gray-900 rounded-xl px-4 py-3 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              {/* Headshot thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                {actor.headshot ? (
                  <Image
                    src={actor.headshot}
                    alt={actor.name}
                    fill
                    className="object-cover object-top"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg font-bold">
                    {actor.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Name + character count */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{actor.name}</p>
                <p className="text-sm text-gray-400">
                  {actor.characters.length === 0
                    ? "No characters yet"
                    : `${actor.characters.length} character${actor.characters.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/actors/${actor.id}`}
                  className="text-sm text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Edit
                </Link>
                <form action={removeActor}>
                  <input type="hidden" name="id" value={actor.id} />
                  <button
                    type="submit"
                    className="text-sm text-red-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                    onClick={(e) => {
                      if (!confirm(`Delete ${actor.name} and all their characters?`)) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
