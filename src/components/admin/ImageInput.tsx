"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  currentUrl?: string | null;
  urlFieldName: string;
  fileFieldName: string;
  label?: string;
}

export default function ImageInput({
  currentUrl,
  urlFieldName,
  fileFieldName,
  label = "Image",
}: Props) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {/* Preview */}
      {preview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-600 bg-gray-800">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover object-top"
            unoptimized={preview.startsWith("blob:")}
          />
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            mode === "url"
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "border-gray-600 text-gray-400 hover:border-gray-400"
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            mode === "upload"
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "border-gray-600 text-gray-400 hover:border-gray-400"
          }`}
        >
          Upload file
        </button>
      </div>

      {mode === "url" ? (
        <input
          name={urlFieldName}
          type="url"
          defaultValue={currentUrl ?? ""}
          onChange={(e) => setPreview(e.target.value || null)}
          placeholder="https://…"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
        />
      ) : (
        <input
          name={fileFieldName}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
        />
      )}
    </div>
  );
}
