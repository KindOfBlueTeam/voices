-- CreateEnum
CREATE TYPE "ShowType" AS ENUM ('TV_SHOW', 'MOVIE');

-- CreateTable
CREATE TABLE "voice_actors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headshot" TEXT,
    "bio" TEXT,
    "birthDate" TIMESTAMP(3),
    "birthCity" TEXT,
    "marriedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_actors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shows" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ShowType" NOT NULL,
    "year" INTEGER,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "voiceActorId" TEXT NOT NULL,
    "showId" TEXT NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_voiceActorId_fkey" FOREIGN KEY ("voiceActorId") REFERENCES "voice_actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_showId_fkey" FOREIGN KEY ("showId") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
