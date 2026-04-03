import Link from "next/link";
import { getAllShowsWithCount } from "@/lib/db";
import { removeShow } from "../actions";
import ConfirmButton from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function ShowsAdminPage() {
  const shows = await getAllShowsWithCount();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Shows &amp; Movies</h1>
          <p className="text-gray-400 text-sm mt-1">{shows.length} in database</p>
        </div>
        <Link
          href="/admin/shows/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Show / Movie
        </Link>
      </div>

      {shows.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No shows yet.</p>
          <Link href="/admin/shows/new" className="text-indigo-400 hover:underline mt-2 inline-block">
            Add the first one →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {shows.map((show) => (
            <div
              key={show.id}
              className="flex items-center gap-4 bg-gray-900 rounded-xl px-4 py-3 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              {/* Type badge */}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                show.type === "TV_SHOW"
                  ? "bg-blue-900/50 text-blue-300 border border-blue-800"
                  : "bg-purple-900/50 text-purple-300 border border-purple-800"
              }`}>
                {show.type === "TV_SHOW" ? "TV" : "Movie"}
              </span>

              {/* Title + year */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">
                  {show.title}
                  {show.year ? <span className="text-gray-400 font-normal ml-1">({show.year})</span> : null}
                </p>
                <p className="text-sm text-gray-400">
                  {show._count.characters === 0
                    ? "No characters"
                    : `${show._count.characters} character${show._count.characters !== 1 ? "s" : ""}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/shows/${show.id}`}
                  className="text-sm text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Edit
                </Link>
                <form action={removeShow}>
                  <input type="hidden" name="id" value={show.id} />
                  <ConfirmButton
                    message={
                      show._count.characters > 0
                        ? `"${show.title}" has ${show._count.characters} character(s). Deleting it will fail — reassign characters first.`
                        : `Delete "${show.title}"?`
                    }
                    className="text-sm text-red-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
