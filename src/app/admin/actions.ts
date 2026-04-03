"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ShowType } from "@prisma/client";
import {
  createVoiceActor,
  updateVoiceActor,
  deleteVoiceActor,
  createShow,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "@/lib/db";
import { saveUpload, fileExtension } from "@/lib/upload";

// ─── Voice Actors ─────────────────────────────────────────────────────────

export async function saveActor(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string).trim();
  const bio = (formData.get("bio") as string).trim() || null;
  const birthDateRaw = formData.get("birthDate") as string;
  const birthCity = (formData.get("birthCity") as string).trim() || null;
  const marriedTo = (formData.get("marriedTo") as string).trim() || null;
  const headshotUrl = (formData.get("headshotUrl") as string | null)?.trim() || null;
  const headshotFile = formData.get("headshotFile") as File | null;

  const birthDate =
    birthDateRaw ? new Date(birthDateRaw) : null;

  let headshot: string | null = headshotUrl;

  if (id) {
    // Update — file upload replaces existing headshot
    if (headshotFile && headshotFile.size > 0) {
      const ext = fileExtension(headshotFile);
      headshot = await saveUpload(headshotFile, "voice-actors", id, `headshot${ext}`);
    }
    await updateVoiceActor(id, { name, bio, headshot, birthDate, birthCity, marriedTo });
    revalidatePath("/");
    revalidatePath(`/voice-actors/${id}`);
    revalidatePath(`/admin/actors/${id}`);
    redirect(`/admin/actors/${id}?saved=1`);
  } else {
    // Create — we need the ID before saving a file, so create first
    const actor = await createVoiceActor({ name, bio, headshot, birthDate, birthCity, marriedTo });
    if (headshotFile && headshotFile.size > 0) {
      const ext = fileExtension(headshotFile);
      headshot = await saveUpload(headshotFile, "voice-actors", actor.id, `headshot${ext}`);
      await updateVoiceActor(actor.id, { headshot });
    }
    revalidatePath("/");
    revalidatePath("/admin");
    redirect(`/admin/actors/${actor.id}?saved=1`);
  }
}

export async function removeActor(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteVoiceActor(id);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// ─── Characters ───────────────────────────────────────────────────────────

export async function saveCharacter(formData: FormData) {
  const actorId = formData.get("actorId") as string;
  const charId = formData.get("charId") as string | null;
  const name = (formData.get("name") as string).trim();
  const imageUrl = (formData.get("imageUrl") as string | null)?.trim() || null;
  const imageFile = formData.get("imageFile") as File | null;

  // Resolve show — either existing or newly created
  let showId = formData.get("showId") as string;
  if (showId === "__new__") {
    const title = (formData.get("newShowTitle") as string).trim();
    const typeRaw = formData.get("newShowType") as string;
    const yearRaw = formData.get("newShowYear") as string;
    const show = await createShow({
      title,
      type: typeRaw === "MOVIE" ? ShowType.MOVIE : ShowType.TV_SHOW,
      year: yearRaw ? parseInt(yearRaw, 10) : null,
    });
    showId = show.id;
  }

  let image: string | null = imageUrl;

  if (charId) {
    // Update existing character
    if (imageFile && imageFile.size > 0) {
      const ext = fileExtension(imageFile);
      image = await saveUpload(imageFile, "voice-actors", actorId, "characters", `${charId}${ext}`);
    }
    await updateCharacter(charId, { name, image, showId });
  } else {
    // Create new character, then upload image if provided
    const char = await createCharacter({ name, image, voiceActorId: actorId, showId });
    if (imageFile && imageFile.size > 0) {
      const ext = fileExtension(imageFile);
      image = await saveUpload(imageFile, "voice-actors", actorId, "characters", `${char.id}${ext}`);
      await updateCharacter(char.id, { image });
    }
  }

  revalidatePath("/");
  revalidatePath(`/voice-actors/${actorId}`);
  revalidatePath(`/admin/actors/${actorId}`);
  redirect(`/admin/actors/${actorId}?saved=1`);
}

export async function removeCharacter(formData: FormData) {
  const charId = formData.get("charId") as string;
  const actorId = formData.get("actorId") as string;
  await deleteCharacter(charId);
  revalidatePath("/");
  revalidatePath(`/voice-actors/${actorId}`);
  revalidatePath(`/admin/actors/${actorId}`);
  redirect(`/admin/actors/${actorId}`);
}
