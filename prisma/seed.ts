import { PrismaClient, ShowType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Shows ────────────────────────────────────────────────────────────────
  const looneytunes = await prisma.show.upsert({
    where: { id: "looney-tunes" },
    update: {},
    create: {
      id: "looney-tunes",
      title: "Looney Tunes",
      type: ShowType.TV_SHOW,
      year: 1930,
    },
  });

  const futurama = await prisma.show.upsert({
    where: { id: "futurama" },
    update: {},
    create: {
      id: "futurama",
      title: "Futurama",
      type: ShowType.TV_SHOW,
      year: 1999,
    },
  });

  const rugrats = await prisma.show.upsert({
    where: { id: "rugrats" },
    update: {},
    create: {
      id: "rugrats",
      title: "Rugrats",
      type: ShowType.TV_SHOW,
      year: 1991,
    },
  });

  const fairlyoddparents = await prisma.show.upsert({
    where: { id: "fairly-odd-parents" },
    update: {},
    create: {
      id: "fairly-odd-parents",
      title: "The Fairly OddParents",
      type: ShowType.TV_SHOW,
      year: 2001,
    },
  });

  const mlp = await prisma.show.upsert({
    where: { id: "mlp" },
    update: {},
    create: {
      id: "mlp",
      title: "My Little Pony: Friendship Is Magic",
      type: ShowType.TV_SHOW,
      year: 2010,
    },
  });

  const batman = await prisma.show.upsert({
    where: { id: "batman-tas" },
    update: {},
    create: {
      id: "batman-tas",
      title: "Batman: The Animated Series",
      type: ShowType.TV_SHOW,
      year: 1992,
    },
  });

  const ren_stimpy = await prisma.show.upsert({
    where: { id: "ren-stimpy" },
    update: {},
    create: {
      id: "ren-stimpy",
      title: "The Ren & Stimpy Show",
      type: ShowType.TV_SHOW,
      year: 1991,
    },
  });

  // ─── Voice Actors ─────────────────────────────────────────────────────────
  const melBlanc = await prisma.voiceActor.upsert({
    where: { id: "mel-blanc" },
    update: {},
    create: {
      id: "mel-blanc",
      name: "Mel Blanc",
      headshot:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mel_Blanc_1976.JPG/440px-Mel_Blanc_1976.JPG",
      bio: "Known as 'The Man of a Thousand Voices,' Mel Blanc is widely regarded as the most prolific voice actor in history. He gave life to nearly all of the classic Looney Tunes characters, including Bugs Bunny, Daffy Duck, Porky Pig, Tweety Bird, Sylvester the Cat, Yosemite Sam, and many more.",
      birthDate: new Date("1908-05-30"),
      birthCity: "San Francisco, CA",
      marriedTo: "Estelle Rosenbaum",
    },
  });

  const billyWest = await prisma.voiceActor.upsert({
    where: { id: "billy-west" },
    update: {},
    create: {
      id: "billy-west",
      name: "Billy West",
      headshot:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Billy_West_2019.jpg/440px-Billy_West_2019.jpg",
      bio: "Billy West is one of Hollywood's most versatile voice actors, best known for voicing multiple principal characters on Futurama, including Philip J. Fry and Professor Hubert J. Farnsworth. He also voiced Stimpy on The Ren & Stimpy Show and has appeared in countless commercials and animated series.",
      birthDate: new Date("1952-04-16"),
      birthCity: "Detroit, MI",
      marriedTo: null,
    },
  });

  const taraStrong = await prisma.voiceActor.upsert({
    where: { id: "tara-strong" },
    update: {},
    create: {
      id: "tara-strong",
      name: "Tara Strong",
      headshot:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tara_Strong_2018.jpg/440px-Tara_Strong_2018.jpg",
      bio: "Tara Strong is a Canadian-American actress who has provided voices for numerous animated television series, films, and video games. She is best known for voicing Twilight Sparkle in My Little Pony: Friendship Is Magic, Timmy Turner in The Fairly OddParents, and Dil Pickles in Rugrats.",
      birthDate: new Date("1973-02-12"),
      birthCity: "Toronto, Ontario, Canada",
      marriedTo: "Craig Strong",
    },
  });

  // ─── Characters ───────────────────────────────────────────────────────────
  // Mel Blanc characters
  await prisma.character.upsert({
    where: { id: "bugs-bunny" },
    update: {},
    create: {
      id: "bugs-bunny",
      name: "Bugs Bunny",
      image:
        "https://upload.wikimedia.org/wikipedia/en/3/3c/Bugs_Bunny_%281958%29.png",
      voiceActorId: melBlanc.id,
      showId: looneytunes.id,
    },
  });

  await prisma.character.upsert({
    where: { id: "daffy-duck" },
    update: {},
    create: {
      id: "daffy-duck",
      name: "Daffy Duck",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Daffy_Duck.svg/640px-Daffy_Duck.svg.png",
      voiceActorId: melBlanc.id,
      showId: looneytunes.id,
    },
  });

  await prisma.character.upsert({
    where: { id: "porky-pig" },
    update: {},
    create: {
      id: "porky-pig",
      name: "Porky Pig",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Porky_Pig.svg/640px-Porky_Pig.svg.png",
      voiceActorId: melBlanc.id,
      showId: looneytunes.id,
    },
  });

  await prisma.character.upsert({
    where: { id: "tweety" },
    update: {},
    create: {
      id: "tweety",
      name: "Tweety",
      image:
        "https://upload.wikimedia.org/wikipedia/en/1/13/Tweety.svg",
      voiceActorId: melBlanc.id,
      showId: looneytunes.id,
    },
  });

  // Billy West characters
  await prisma.character.upsert({
    where: { id: "fry" },
    update: {},
    create: {
      id: "fry",
      name: "Philip J. Fry",
      image:
        "https://upload.wikimedia.org/wikipedia/en/0/08/Philip_Fry.png",
      voiceActorId: billyWest.id,
      showId: futurama.id,
    },
  });

  await prisma.character.upsert({
    where: { id: "farnsworth" },
    update: {},
    create: {
      id: "farnsworth",
      name: "Prof. Farnsworth",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Hubert_Farnsworth.png/200px-Hubert_Farnsworth.png",
      voiceActorId: billyWest.id,
      showId: futurama.id,
    },
  });

  await prisma.character.upsert({
    where: { id: "stimpy" },
    update: {},
    create: {
      id: "stimpy",
      name: "Stimpy",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Stimpy.png/200px-Stimpy.png",
      voiceActorId: billyWest.id,
      showId: ren_stimpy.id,
    },
  });

  // Tara Strong characters
  await prisma.character.upsert({
    where: { id: "twilight-sparkle" },
    update: {},
    create: {
      id: "twilight-sparkle",
      name: "Twilight Sparkle",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Twilight_Sparkle_character_image.png/220px-Twilight_Sparkle_character_image.png",
      voiceActorId: taraStrong.id,
      showId: mlp.id,
    },
  });

  await prisma.character.upsert({
    where: { id: "timmy-turner" },
    update: {},
    create: {
      id: "timmy-turner",
      name: "Timmy Turner",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Timmy_Turner.png/220px-Timmy_Turner.png",
      voiceActorId: taraStrong.id,
      showId: fairlyoddparents.id,
    },
  });

  await prisma.character.upsert({
    where: { id: "dil-pickles" },
    update: {},
    create: {
      id: "dil-pickles",
      name: "Dil Pickles",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Dil_Pickles.png/220px-Dil_Pickles.png",
      voiceActorId: taraStrong.id,
      showId: rugrats.id,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
