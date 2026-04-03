import { saveActor } from "../../actions";
import ImageInput from "@/components/admin/ImageInput";

export default function NewActorPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">New Voice Actor</h1>
        <p className="text-gray-400 text-sm mt-1">
          Fill in the details below. You can add characters after saving.
        </p>
      </div>

      <form action={saveActor} encType="multipart/form-data" className="space-y-6">
        {/* No id field — signals create mode */}
        <Section title="Basic Info">
          <Field label="Name" required>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Mel Blanc"
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
              <input name="birthDate" type="date" className={inputCls} />
            </Field>
            <Field label="Birth City">
              <input
                name="birthCity"
                type="text"
                placeholder="e.g. San Francisco, CA"
                className={inputCls}
              />
            </Field>
            <Field label="Married To">
              <input
                name="marriedTo"
                type="text"
                placeholder="Spouse's name"
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        <Section title="Headshot">
          <ImageInput
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

// ─── Small layout helpers ──────────────────────────────────────────────────

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
