import { notFound } from "next/navigation";
import Link from "next/link";
import { getShowById } from "@/lib/db";
import { saveShow, removeShow } from "../../actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import ShowCastLookup from "@/components/admin/ShowCastLookup";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
  searchParams: { saved?: string };
}

const inputCls =
  "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500";

export default async function EditShowPage({ params, searchParams }: Props) {
  const show = await getShowById(params.id);
  if (!show) notFound();

  const saved = searchParams.saved === "1";

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/admin/shows" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← All shows
          </Link>
          <h1 className="text-2xl font-bold mt-2">{show.title}</h1>
        </div>
        {saved && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 text-sm px-4 py-2 rounded-lg">
            ✓ Saved
          </div>
        )}
      </div>

      <form action={saveShow} className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
        <input type="hidden" name="id" value={show.id} />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            defaultValue={show.title}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Type</label>
            <select name="type" defaultValue={show.type} className={inputCls}>
              <option value="TV_SHOW">TV Show</option>
              <option value="MOVIE">Movie</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Year</label>
            <input
              name="year"
              type="number"
              defaultValue={show.year ?? ""}
              placeholder="e.g. 1992"
              min={1900}
              max={2100}
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Save Show
          </button>
        </div>
      </form>

      <ShowCastLookup initialQuery={show.title} />

      <div className="mt-6 bg-gray-900 rounded-xl border border-red-900/50 p-6">
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">Danger Zone</h2>
        <form action={removeShow} className="flex items-center gap-4">
          <input type="hidden" name="id" value={show.id} />
          <p className="text-sm text-gray-400 flex-1">
            Deleting a show will fail if any characters are still assigned to it. Reassign or remove them first.
          </p>
          <ConfirmButton
            message={`Delete "${show.title}"?`}
            className="bg-red-900/50 hover:bg-red-900 border border-red-700 text-red-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            Delete Show
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}
