import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getVoiceActorById, getAllShows } from "@/lib/db";
import { saveActor, saveCharacter, removeCharacter } from "../../actions";
import ImageInput from "@/components/admin/ImageInput";
import ShowSelector from "@/components/admin/ShowSelector";
import ConfirmButton from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
  searchParams: { saved?: string };
}

export default async function EditActorPage({ params, searchParams }: Props) {
  const [actor, shows] = await Promise.all([
    getVoiceActorById(params.id),
    getAllShows(),
  ]);
  if (!actor) notFound();

  const saved = searchParams.saved === "1";

  const birthDateValue = actor.birthDate
    ? actor.birthDate.toISOString().split("T")[0]
    : "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← All actors
          </Link>
          <h1 className="text-2xl font-bold mt-2">{actor.name}</h1>
          <Link
            href={`/voice-actors/${actor.id}`}
            target="_blank"
            className="text-xs text-indigo-400 hover:underline mt-0.5 inline-block"
          >
            View public page ↗
          </Link>
        </div>
        {saved && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 text-sm px-4 py-2 rounded-lg">
            ✓ Saved
          </div>
        )}
      </div>

      {/* ── Actor form ─────────────────────────────────────────────────────── */}
      <form action={saveActor} encType="multipart/form-data" className="space-y-6">
        <input type="hidden" name="id" value={actor.id} />

        <Section title="Basic Info">
          <Field label="Name" required>
            <input
              name="name"
              type="text"
              required
              defaultValue={actor.name}
              className={inputCls}
            />
          </Field>
          <Field label="Bio">
            <textarea
              name="bio"
              rows={4}
              defaultValue={actor.bio ?? ""}
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
                defaultValue={birthDateValue}
                className={inputCls}
              />
            </Field>
            <Field label="Birth City">
              <input
                name="birthCity"
                type="text"
                defaultValue={actor.birthCity ?? ""}
                className={inputCls}
              />
            </Field>
            <Field label="Married To">
              <input
                name="marriedTo"
                type="text"
                defaultValue={actor.marriedTo ?? ""}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        <Section title="Headshot">
          <ImageInput
            currentUrl={actor.headshot}
            urlFieldName="headshotUrl"
            fileFieldName="headshotFile"
            label="Headshot image"
          />
        </Section>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Save Actor
          </button>
        </div>
      </form>

      {/* ── Characters ──────────────────────────────────────────────────────── */}
      <Section title={`Characters (${actor.characters.length})`}>
        {/* Existing characters */}
        {actor.characters.length > 0 && (
          <div className="space-y-2 mb-6">
            {actor.characters.map((char) => (
              <div
                key={char.id}
                className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700"
              >
                {/* Character image */}
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-700 shrink-0">
                  {char.image ? (
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      ?
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{char.name}</p>
                  <p className="text-xs text-gray-400">
                    {char.show.title}
                    {char.show.year ? ` (${char.show.year})` : ""}
                    {" — "}
                    {char.show.type === "TV_SHOW" ? "TV Show" : "Movie"}
                  </p>
                </div>

                {/* Delete */}
                <form action={removeCharacter}>
                  <input type="hidden" name="charId" value={char.id} />
                  <input type="hidden" name="actorId" value={actor.id} />
                  <ConfirmButton
                    message={`Remove ${char.name}?`}
                    className="text-xs text-red-500 hover:text-red-400 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  >
                    Remove
                  </ConfirmButton>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* Add character form */}
        <details className="group" open={actor.characters.length === 0}>
          <summary className="cursor-pointer text-sm text-indigo-400 hover:text-indigo-300 font-medium list-none flex items-center gap-1.5">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            Add a character
          </summary>

          <form
            action={saveCharacter}
            encType="multipart/form-data"
            className="mt-4 space-y-4 border border-gray-700 rounded-xl p-5"
          >
            <input type="hidden" name="actorId" value={actor.id} />

            <Field label="Character Name" required>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g. Bugs Bunny"
                className={inputCls}
              />
            </Field>

            <ShowSelector shows={shows} />

            <ImageInput
              urlFieldName="imageUrl"
              fileFieldName="imageFile"
              label="Character image"
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Add Character
            </button>
          </form>
        </details>
      </Section>
    </div>
  );
}

// ─── Layout helpers ────────────────────────────────────────────────────────

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

const inputCls =
  "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500";
