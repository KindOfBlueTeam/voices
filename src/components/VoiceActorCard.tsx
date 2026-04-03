"use client";

import Image from "next/image";
import Link from "next/link";
import { VoiceActor } from "@prisma/client";

interface Props {
  actor: VoiceActor & {
    characters: { show: { title: string } }[];
  };
}

export default function VoiceActorCard({ actor }: Props) {
  return (
    <Link href={`/voice-actors/${actor.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-brand-gold/40 hover:border-brand-orange/60">
        {/* Headshot */}
        <div className="relative w-full aspect-square bg-brand-cream">
          {actor.headshot ? (
            <Image
              src={actor.headshot}
              alt={actor.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-gold/30">
              <span className="text-5xl text-brand-navy/40">
                {actor.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="p-4">
          <h2 className="font-bold text-brand-navy text-lg leading-tight">
            {actor.name}
          </h2>
          {actor.characters.length > 0 && (
            <p className="text-sm text-brand-navy/55 mt-1 truncate">
              {actor.characters[0].show.title}
              {actor.characters.length > 1 &&
                ` + ${actor.characters.length - 1} more`}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
