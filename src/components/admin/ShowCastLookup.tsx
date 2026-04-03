"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface ShowCandidate {
  id: number;
  name: string;
  year: number | null;
  tvmazeType: string;
  thumbnail: string | null;
}

interface CastMember {
  actorId: number;
  actorName: string;
  actorPhoto: string | null;
  characterName: string;
  voiceRole: boolean;
}

type State =
  | { phase: "idle" }
  | { phase: "searching" }
  | { phase: "disambiguation"; candidates: ShowCandidate[] }
  | { phase: "fetching"; show: ShowCandidate }
  | { phase: "results"; show: ShowCandidate; cast: CastMember[] }
  | { phase: "nomatch" }
  | { phase: "error"; message: string };

export default function ShowCastLookup({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [state, setState] = useState<State>({ phase: "idle" });
  const prevInitial = useRef(initialQuery);

  // When parent updates the title, update the query field only if user hasn't
  // started their own search yet.
  useEffect(() => {
    if (initialQuery !== prevInitial.current) {
      prevInitial.current = initialQuery;
      if (state.phase === "idle") setQuery(initialQuery);
    }
  }, [initialQuery, state.phase]);

  async function doSearch(q: string) {
    setState({ phase: "searching" });
    try {
      const res = await fetch(`/api/show-cast?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.match) {
        await fetchCast(data.match);
      } else if (data.candidates?.length > 0) {
        setState({ phase: "disambiguation", candidates: data.candidates });
      } else {
        setState({ phase: "nomatch" });
      }
    } catch {
      setState({ phase: "error", message: "Search failed. Please try again." });
    }
  }

  async function fetchCast(show: ShowCandidate) {
    setState({ phase: "fetching", show });
    try {
      const res = await fetch(`/api/show-cast?id=${show.id}`);
      const data = await res.json();
      setState({ phase: "results", show, cast: data.cast ?? [] });
    } catch {
      setState({ phase: "error", message: "Failed to fetch cast." });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) doSearch(query.trim());
  }

  const busy = state.phase === "searching" || state.phase === "fetching";

  return (
    <div className="bg-gray-900 rounded-xl border border-indigo-800/50 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
        Cast Lookup
      </h2>
      <p className="text-xs text-gray-500">
        Searches TVmaze. Click "Add Actor" on any cast member to create them in the database.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Family Guy"
          disabled={busy}
          className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={!query.trim() || busy}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Lookup Cast
        </button>
      </form>

      {state.phase === "searching" && (
        <p className="text-sm text-gray-400 animate-pulse">Searching TVmaze…</p>
      )}

      {state.phase === "fetching" && (
        <p className="text-sm text-gray-400 animate-pulse">
          Fetching cast for <span className="text-white">{state.show.name}</span>…
        </p>
      )}

      {state.phase === "nomatch" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-yellow-400">No matching show found on TVmaze.</p>
          <button onClick={() => setState({ phase: "idle" })} className="text-xs text-gray-500 hover:text-gray-300">
            Try again
          </button>
        </div>
      )}

      {state.phase === "error" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-400">{state.message}</p>
          <button onClick={() => setState({ phase: "idle" })} className="text-xs text-gray-500 hover:text-gray-300">
            Try again
          </button>
        </div>
      )}

      {state.phase === "disambiguation" && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Multiple matches — select the correct one:</p>
          {state.candidates.map((c) => (
            <button
              key={c.id}
              onClick={() => fetchCast(c)}
              className="w-full flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-600 rounded-lg px-3 py-2.5 text-left transition-colors group"
            >
              <div className="w-10 h-14 rounded overflow-hidden bg-gray-700 shrink-0">
                {c.thumbnail ? (
                  <Image src={c.thumbnail} alt={c.name} width={40} height={56} className="object-cover w-full h-full" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">?</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                  {c.name}{c.year ? ` (${c.year})` : ""}
                </p>
                <p className="text-xs text-gray-400">{c.tvmazeType}</p>
              </div>
              <span className="text-xs text-indigo-500 group-hover:text-indigo-300 shrink-0">Select →</span>
            </button>
          ))}
          <button onClick={() => setState({ phase: "idle" })} className="text-xs text-gray-500 hover:text-gray-300 pt-1">
            Cancel
          </button>
        </div>
      )}

      {state.phase === "results" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">{state.show.name}</span>
              {state.show.year ? ` (${state.show.year})` : ""}
              <span className="text-gray-500 ml-2">— {state.cast.length} cast member{state.cast.length !== 1 ? "s" : ""}</span>
            </p>
            <button onClick={() => setState({ phase: "idle" })} className="text-xs text-gray-500 hover:text-gray-300">
              Search again
            </button>
          </div>

          {state.cast.length === 0 ? (
            <p className="text-sm text-gray-500">No cast data available on TVmaze for this title.</p>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {state.cast.map((m, i) => (
                <div
                  key={`${m.actorId}-${i}`}
                  className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 shrink-0">
                    {m.actorPhoto ? (
                      <Image src={m.actorPhoto} alt={m.actorName} width={32} height={32} className="object-cover w-full h-full" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                        {m.actorName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{m.actorName}</p>
                    <p className="text-xs text-gray-400 truncate">as {m.characterName}</p>
                  </div>
                  {m.voiceRole && (
                    <span className="text-xs text-indigo-400 border border-indigo-800 rounded px-1.5 py-0.5 shrink-0">
                      voice
                    </span>
                  )}
                  <Link
                    href={`/admin/actors/new?name=${encodeURIComponent(m.actorName)}`}
                    className="text-xs bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-700 text-indigo-300 px-2 py-1 rounded transition-colors shrink-0"
                  >
                    + Add Actor
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
