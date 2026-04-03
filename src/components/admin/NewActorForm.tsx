"use client";

import { useState } from "react";
import { saveActor } from "@/app/admin/actions";
import ImageInput from "@/components/admin/ImageInput";
import WikipediaLookup from "@/components/admin/WikipediaLookup";

const inputCls =
  "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function NewActorForm() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [marriedTo, setMarriedTo] = useState("");
  const [headshotUrl, setHeadshotUrl] = useState("");

  function handleWikiResult(data: {
    name: string | null;
    thumbnailUrl: string | null;
    birthDate: string | null;
    birthCity: string | null;
    marriedTo: string | null;
  }) {
    if (data.name) setName(data.name);
    if (data.thumbnailUrl) setHeadshotUrl(data.thumbnailUrl);
    if (data.birthDate) setBirthDate(data.birthDate);
    if (data.birthCity) setBirthCity(data.birthCity);
    if (data.marriedTo) setMarriedTo(data.marriedTo);
  }

  return (
    <div className="space-y-6">
      <WikipediaLookup onResult={handleWikiResult} />

      <form action={saveActor} encType="multipart/form-data" className="space-y-6">
        <Section title="Basic Info">
          <Field label="Name" required>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Mel Blanc"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Bio">
            <textarea
              name="bio"
              rows={4}
              placeholder="Short biographical description…"
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="Personal Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date of Birth">
              <input
                name="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Birth City">
              <input
                name="birthCity"
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={birthCity}
                onChange={(e) => setBirthCity(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Married To">
              <input
                name="marriedTo"
                type="text"
                placeholder="Spouse's name"
                value={marriedTo}
                onChange={(e) => setMarriedTo(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        <Section title="Headshot">
          <ImageInput
            key={headshotUrl || "empty"}
            currentUrl={headshotUrl || null}
            urlFieldName="headshotUrl"
            fileFieldName="headshotFile"
            label="Headshot image"
          />
        </Section>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Save and Continue →
          </button>
          <a
            href="/admin"
            className="text-gray-400 hover:text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
