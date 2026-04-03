import { VoiceActor } from "@prisma/client";

interface Props {
  actor: VoiceActor;
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getAge(birthDate: Date | null): string {
  if (!birthDate) return "—";
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  return String(hasBirthdayPassed ? age : age - 1);
}

export default function BioCard({ actor }: Props) {
  return (
    <div className="bg-brand-navy text-white rounded-2xl p-6 flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold leading-tight mb-4 text-brand-gold">{actor.name}</h1>

        <dl className="space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-brand-gold/60 w-24 shrink-0">Born</dt>
            <dd className="text-brand-cream">{formatDate(actor.birthDate)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-brand-gold/60 w-24 shrink-0">Age</dt>
            <dd className="text-brand-cream">{getAge(actor.birthDate)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-brand-gold/60 w-24 shrink-0">City</dt>
            <dd className="text-brand-cream">{actor.birthCity ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-brand-gold/60 w-24 shrink-0">Married to</dt>
            <dd className="text-brand-cream">{actor.marriedTo ?? "—"}</dd>
          </div>
        </dl>
      </div>

      {actor.bio && (
        <p className="text-brand-cream/70 text-sm leading-relaxed mt-6 border-t border-brand-gold/20 pt-4">
          {actor.bio}
        </p>
      )}
    </div>
  );
}
