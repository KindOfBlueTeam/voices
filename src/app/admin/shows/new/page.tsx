import Link from "next/link";
import { saveShow } from "../../actions";

const inputCls =
  "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500";

export default function NewShowPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/shows" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← All shows
        </Link>
        <h1 className="text-2xl font-bold mt-2">New Show / Movie</h1>
      </div>

      <form action={saveShow} className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            placeholder="e.g. Batman: The Animated Series"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Type</label>
            <select name="type" className={inputCls}>
              <option value="TV_SHOW">TV Show</option>
              <option value="MOVIE">Movie</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Year</label>
            <input
              name="year"
              type="number"
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
          <Link
            href="/admin/shows"
            className="text-gray-400 hover:text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
