"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface WikiDetails {
  birthDate: string | null;
  birthCity: string | null;
  marriedTo: string | null;
}

interface Candidate {
  title: string;
  description: string;
  thumbnail: string | null;
  confidence: number;
}

type State =
  | { phase: "idle" }
  | { phase: "searching" }
  | { phase: "disambiguation"; candidates: Candidate[] }
  | { phase: "fetching"; title: string }
  | { phase: "done"; title: string }
  | { phase: "nomatch" }
  | { phase: "error"; message: string };

interface Props {
  onResult: (data: WikiDetails) => void;
}

export default function WikipediaLookup({ onResult }: Props) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<State>({ phase: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  async function doLookup(q: string) {
    setState({ phase: "searching" });
    try {
      const res = await fetch(`/api/wikipedia-lookup?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (data.match) {
        await fetchDetails(data.match.title);
      } else if (data.candidates?.length > 0) {
        setState({ phase: "disambiguation", candidates: data.candidates });
      } else {
        setState({ phase: "nomatch" });
      }
    } catch {
      setState({ phase: "error", message: "Search failed. Please try again." });
    }
  }

  async function fetchDetails(title: string) {
    setState({ phase: "fetching", title });
    try {
      const res = await fetch(`/api/wikipedia-details?title=${encodeURIComponent(title)}`);
      const data: WikiDetails = await res.json();
      onResult(data);
      setState({ phase: "done", title });
    } catch {
      setState({ phase: "error", message: "Failed to fetch actor details." });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) doLookup(query.trim());
  }

  function reset() {
    setState({ phase: "idle" });
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-indigo-800/50 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
        Actor Lookup
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Mel Blanc"
          className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
          disabled={state.phase === "searching" || state.phase === "fetching"}
        />
        <button
          type="submit"
          disabled={
            !query.trim() ||
            state.phase === "searching" ||
            state.phase === "fetching"
          }
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Wikipedia Lookup
        </button>
      </form>

      {state.phase === "searching" && (
        <p className="text-sm text-gray-400 animate-pulse">Searching Wikipedia…</p>
      )}

      {state.phase === "fetching" && (
        <p className="text-sm text-gray-400 animate-pulse">
          Fetching details for <span className="text-white">{state.title}</span>…
        </p>
      )}

      {state.phase === "done" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-green-400">
            ✓ Details filled from <span className="text-white">{state.title}</span>
          </p>
          <button
            onClick={reset}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Search again
          </button>
        </div>
      )}

      {state.phase === "nomatch" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-yellow-400">No matching Wikipedia page found.</p>
          <button
            onClick={reset}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {state.phase === "error" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-400">{state.message}</p>
          <button
            onClick={reset}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {state.phase === "disambiguation" && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Multiple matches found — select the correct one:</p>
          {state.candidates.map((c) => (
            <button
              key={c.title}
              onClick={() => fetchDetails(c.title)}
              className="w-full flex items-center gap-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-indigo-600 rounded-lg px-3 py-3 text-left transition-colors group"
            >
              <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-700 shrink-0">
                {c.thumbnail ? (
                  <Image
                    src={c.thumbnail}
                    alt={c.title}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                    ?
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate">
                  {c.title}
                </p>
                {c.description && (
                  <p className="text-xs text-gray-400 truncate">{c.description}</p>
                )}
              </div>
              <span className="text-xs text-indigo-500 group-hover:text-indigo-300 shrink-0">
                Select →
              </span>
            </button>
          ))}
          <button
            onClick={reset}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors pt-1"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
