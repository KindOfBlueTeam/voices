"use client";

import { useState } from "react";
import { Show } from "@prisma/client";

interface Props {
  shows: Show[];
  defaultValue?: string;
}

export default function ShowSelector({ shows, defaultValue = "" }: Props) {
  const [selected, setSelected] = useState(defaultValue);
  const isNew = selected === "__new__";

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Show / Movie <span className="text-red-400">*</span>
        </label>
        <select
          name="showId"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          required
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select a show or movie…</option>
          {shows.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
              {s.year ? ` (${s.year})` : ""}
              {s.type === "TV_SHOW" ? " — TV" : " — Movie"}
            </option>
          ))}
          <option value="__new__">+ Create new show / movie…</option>
        </select>
      </div>

      {isNew && (
        <div className="border border-indigo-600 rounded-lg p-4 space-y-3 bg-gray-750">
          <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide">
            New show / movie
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              name="newShowTitle"
              type="text"
              required={isNew}
              placeholder="e.g. Batman: The Animated Series"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Type
              </label>
              <select
                name="newShowType"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="TV_SHOW">TV Show</option>
                <option value="MOVIE">Movie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Year
              </label>
              <input
                name="newShowYear"
                type="number"
                placeholder="e.g. 1992"
                min={1900}
                max={2100}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
