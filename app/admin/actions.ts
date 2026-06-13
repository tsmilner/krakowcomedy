"use server";

import { EventLanguage, EventType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginWithPassword, logoutAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseKrakowDatetimeLocal, slugify } from "@/lib/utils";

function asOptional(value: FormDataEntryValue | null) {
  if (!value) return null;
  const string = String(value).trim();
  return string.length ? string : null;
}

function getRequiredString(data: FormData, key: string) {
  const value = data.get(key);
  if (!value) throw new Error(`${key} is required`);
  const string = String(value).trim();
  if (!string) throw new Error(`${key} is required`);
  return string;
}

export async function loginAction(data: FormData) {
  const password = getRequiredString(data, "password");
  const ok = await loginWithPassword(password);
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin/events");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function createVenueAction(data: FormData) {
  const name = getRequiredString(data, "name");
  await prisma.venue.create({
    data: {
      name,
      slug: slugify(name),
      address: getRequiredString(data, "address"),
      latitude: Number(getRequiredString(data, "latitude")),
      longitude: Number(getRequiredString(data, "longitude")),
      area: asOptional(data.get("area")),
      description: getRequiredString(data, "description"),
      websiteUrl: asOptional(data.get("websiteUrl")),
      facebookUrl: asOptional(data.get("facebookUrl")),
      instagramUrl: asOptional(data.get("instagramUrl")),
    },
  });
  revalidatePath("/venues");
  revalidatePath("/map");
  redirect("/admin/venues");
}

export async function updateVenueAction(id: number, data: FormData) {
  const name = getRequiredString(data, "name");
  await prisma.venue.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      address: getRequiredString(data, "address"),
      latitude: Number(getRequiredString(data, "latitude")),
      longitude: Number(getRequiredString(data, "longitude")),
      area: asOptional(data.get("area")),
      description: getRequiredString(data, "description"),
      websiteUrl: asOptional(data.get("websiteUrl")),
      facebookUrl: asOptional(data.get("facebookUrl")),
      instagramUrl: asOptional(data.get("instagramUrl")),
    },
  });
  revalidatePath("/venues");
  revalidatePath("/map");
  redirect("/admin/venues");
}

export async function createOrganiserAction(data: FormData) {
  const name = getRequiredString(data, "name");
  await prisma.organiser.create({
    data: {
      name,
      slug: slugify(name),
      description: getRequiredString(data, "description"),
      websiteUrl: asOptional(data.get("websiteUrl")),
      facebookUrl: asOptional(data.get("facebookUrl")),
      instagramUrl: asOptional(data.get("instagramUrl")),
    },
  });
  revalidatePath("/organisers");
  redirect("/admin/organisers");
}

export async function updateOrganiserAction(id: number, data: FormData) {
  const name = getRequiredString(data, "name");
  await prisma.organiser.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      description: getRequiredString(data, "description"),
      websiteUrl: asOptional(data.get("websiteUrl")),
      facebookUrl: asOptional(data.get("facebookUrl")),
      instagramUrl: asOptional(data.get("instagramUrl")),
    },
  });
  revalidatePath("/organisers");
  redirect("/admin/organisers");
}

export async function createEventAction(data: FormData) {
  const title = getRequiredString(data, "title");
  await prisma.event.create({
    data: {
      title,
      slug: slugify(title),
      description: getRequiredString(data, "description"),
      startDateTime: parseKrakowDatetimeLocal(getRequiredString(data, "startDateTime")),
      endDateTime: asOptional(data.get("endDateTime"))
        ? parseKrakowDatetimeLocal(String(data.get("endDateTime")))
        : null,
      eventType: getRequiredString(data, "eventType") as EventType,
      language: getRequiredString(data, "language") as EventLanguage,
      ticketUrl: asOptional(data.get("ticketUrl")),
      facebookEventUrl: asOptional(data.get("facebookEventUrl")),
      instagramUrl: asOptional(data.get("instagramUrl")),
      websiteUrl: asOptional(data.get("websiteUrl")),
      sourceNotes: asOptional(data.get("sourceNotes")),
      externalSourceName: asOptional(data.get("externalSourceName")),
      isFeatured: data.get("isFeatured") === "on",
      isRecurring: data.get("isRecurring") === "on",
      venueId: Number(getRequiredString(data, "venueId")),
      organiserId: Number(getRequiredString(data, "organiserId")),
    },
  });
  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath("/venues");
  revalidatePath("/map");
  revalidatePath("/organisers");
  redirect("/admin/events");
}

export async function updateEventAction(id: number, data: FormData) {
  const title = getRequiredString(data, "title");
  await prisma.event.update({
    where: { id },
    data: {
      title,
      slug: slugify(title),
      description: getRequiredString(data, "description"),
      startDateTime: parseKrakowDatetimeLocal(getRequiredString(data, "startDateTime")),
      endDateTime: asOptional(data.get("endDateTime"))
        ? parseKrakowDatetimeLocal(String(data.get("endDateTime")))
        : null,
      eventType: getRequiredString(data, "eventType") as EventType,
      language: getRequiredString(data, "language") as EventLanguage,
      ticketUrl: asOptional(data.get("ticketUrl")),
      facebookEventUrl: asOptional(data.get("facebookEventUrl")),
      instagramUrl: asOptional(data.get("instagramUrl")),
      websiteUrl: asOptional(data.get("websiteUrl")),
      sourceNotes: asOptional(data.get("sourceNotes")),
      externalSourceName: asOptional(data.get("externalSourceName")),
      isFeatured: data.get("isFeatured") === "on",
      isRecurring: data.get("isRecurring") === "on",
      venueId: Number(getRequiredString(data, "venueId")),
      organiserId: Number(getRequiredString(data, "organiserId")),
    },
  });
  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath("/venues");
  revalidatePath("/map");
  revalidatePath("/organisers");
  redirect("/admin/events");
}
