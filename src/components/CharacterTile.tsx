import Image from "next/image";

interface Props {
  characterName: string;
  characterImage: string | null;
  showTitle: string;
}

export default function CharacterTile({
  characterName,
  characterImage,
  showTitle,
}: Props) {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-gold/40 hover:border-brand-orange/60 hover:shadow-md transition-all duration-200">
      {/* Character image — square */}
      <div className="relative w-full aspect-square bg-brand-cream/60">
        {characterImage ? (
          <Image
            src={characterImage}
            alt={characterName}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-brand-gold/50">?</span>
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="px-3 py-3">
        <p className="font-bold text-brand-navy text-sm leading-tight truncate">
          {showTitle}
        </p>
        <p className="italic text-brand-navy/55 text-sm mt-0.5 truncate">
          {characterName}
        </p>
      </div>
    </div>
  );
}
