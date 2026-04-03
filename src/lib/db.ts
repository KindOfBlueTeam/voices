import { prisma } from "./prisma";

export async function getAllVoiceActors() {
  return prisma.voiceActor.findMany({
    orderBy: { name: "asc" },
    include: {
      characters: {
        include: { show: true },
        take: 1, // just enough to show a preview character on the list page
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
