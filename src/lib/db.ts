import { ShowType } from "@prisma/client";
import { prisma } from "./prisma";

// ─── Public reads ──────────────────────────────────────────────────────────

export async function getAllVoiceActors() {
  return prisma.voiceActor.findMany({
    orderBy: { name: "asc" },
    include: {
      characters: {
        include: { show: true },
        take: 1,
      },
    },
  });
}

export async function getVoiceActorById(id: string) {
  return prisma.voiceActor.findUnique({
    where: { id },
    include: {
      characters: {
        include: { show: true },
        orderBy: { name: "asc" },
      },
    },
  });
}

// ─── Voice Actor CRUD ──────────────────────────────────────────────────────

export interface VoiceActorInput {
  name: string;
  bio?: string | null;
  headshot?: string | null;
  birthDate?: Date | null;
  birthCity?: string | null;
  marriedTo?: string | null;
}

export async function createVoiceActor(data: VoiceActorInput) {
  return prisma.voiceActor.create({ data });
}

export async function updateVoiceActor(id: string, data: Partial<VoiceActorInput>) {
  return prisma.voiceActor.update({ where: { id }, data });
}

export async function deleteVoiceActor(id: string) {
  // Characters are deleted first to avoid FK constraint errors
  await prisma.character.deleteMany({ where: { voiceActorId: id } });
  return prisma.voiceActor.delete({ where: { id } });
}

// ─── Show CRUD ─────────────────────────────────────────────────────────────

export async function getAllShows() {
  return prisma.show.findMany({ orderBy: { title: "asc" } });
}

export interface ShowInput {
  title: string;
  type: ShowType;
  year?: number | null;
}

export async function createShow(data: ShowInput) {
  const existing = await prisma.show.findFirst({
    where: { title: data.title, type: data.type, year: data.year ?? null },
  });
  if (existing) return existing;
  return prisma.show.create({ data });
}

export async function deleteShow(id: string) {
  return prisma.show.delete({ where: { id } });
}

// ─── Character CRUD ────────────────────────────────────────────────────────

export interface CharacterInput {
  name: string;
  image?: string | null;
  voiceActorId: string;
  showId: string;
}

export async function createCharacter(data: CharacterInput) {
  return prisma.character.create({ data });
}

export async function updateCharacter(id: string, data: Partial<CharacterInput>) {
  return prisma.character.update({ where: { id }, data });
}

export async function deleteCharacter(id: string) {
  return prisma.character.delete({ where: { id } });
}
