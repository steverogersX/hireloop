import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  candidateProfiles,
  educations,
  experiences,
  resumes,
  users,
  type CandidateProfile,
} from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { profileStrength } from "@/utils/match";
import type {
  CreateEducationInput,
  CreateExperienceInput,
  CreateResumeInput,
  UpdateEducationInput,
  UpdateExperienceInput,
  UpdateProfileInput,
  UpdateVisibilityInput,
} from "./profile.schema";

export async function ensureProfile(userId: string): Promise<CandidateProfile> {
  const existing = await db.query.candidateProfiles.findFirst({
    where: eq(candidateProfiles.userId, userId),
  });
  if (existing) return existing;

  const [profile] = await db.insert(candidateProfiles).values({ userId }).returning();
  return profile!;
}

export async function getProfile(userId: string) {
  const [user, profile, experienceList, educationList, resumeList] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { passwordHash: false },
    }),
    ensureProfile(userId),
    db.query.experiences.findMany({
      where: eq(experiences.userId, userId),
      orderBy: [desc(experiences.current), desc(experiences.startDate)],
    }),
    db.query.educations.findMany({
      where: eq(educations.userId, userId),
      orderBy: desc(educations.endYear),
    }),
    db.query.resumes.findMany({
      where: eq(resumes.userId, userId),
      orderBy: [desc(resumes.isDefault), desc(resumes.updatedAt)],
    }),
  ]);

  if (!user) throw ApiError.notFound("User not found");

  const strength = profileStrength({
    profile,
    experienceCount: experienceList.length,
    educationCount: educationList.length,
    resumeCount: resumeList.length,
  });

  return {
    user,
    profile,
    experiences: experienceList,
    educations: educationList,
    resumes: resumeList,
    strength,
  };
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  await ensureProfile(userId);

  const { name, headline, location, ...profileFields } = input;

  if (name || headline || location) {
    await db
      .update(users)
      .set({ ...(name && { name }), ...(headline && { headline }), ...(location && { location }) })
      .where(eq(users.id, userId));
  }

  if (Object.keys(profileFields).length > 0) {
    await db
      .update(candidateProfiles)
      .set(profileFields)
      .where(eq(candidateProfiles.userId, userId));
  }

  return getProfile(userId);
}

export async function updateVisibility(userId: string, input: UpdateVisibilityInput) {
  await ensureProfile(userId);
  const [updated] = await db
    .update(candidateProfiles)
    .set(input)
    .where(eq(candidateProfiles.userId, userId))
    .returning();
  return updated!;
}

export async function addExperience(userId: string, input: CreateExperienceInput) {
  const [row] = await db
    .insert(experiences)
    .values({ ...input, userId, endDate: input.current ? null : input.endDate })
    .returning();
  return row!;
}

export async function updateExperience(
  userId: string,
  id: string,
  input: UpdateExperienceInput,
) {
  const [row] = await db
    .update(experiences)
    .set(input)
    .where(and(eq(experiences.id, id), eq(experiences.userId, userId)))
    .returning();
  if (!row) throw ApiError.notFound("Experience not found");
  return row;
}

export async function deleteExperience(userId: string, id: string) {
  const [row] = await db
    .delete(experiences)
    .where(and(eq(experiences.id, id), eq(experiences.userId, userId)))
    .returning();
  if (!row) throw ApiError.notFound("Experience not found");
}

export async function addEducation(userId: string, input: CreateEducationInput) {
  const [row] = await db.insert(educations).values({ ...input, userId }).returning();
  return row!;
}

export async function updateEducation(userId: string, id: string, input: UpdateEducationInput) {
  const [row] = await db
    .update(educations)
    .set(input)
    .where(and(eq(educations.id, id), eq(educations.userId, userId)))
    .returning();
  if (!row) throw ApiError.notFound("Education not found");
  return row;
}

export async function deleteEducation(userId: string, id: string) {
  const [row] = await db
    .delete(educations)
    .where(and(eq(educations.id, id), eq(educations.userId, userId)))
    .returning();
  if (!row) throw ApiError.notFound("Education not found");
}

export async function listResumes(userId: string) {
  return db.query.resumes.findMany({
    where: eq(resumes.userId, userId),
    orderBy: [desc(resumes.isDefault), asc(resumes.name)],
  });
}

export async function addResume(userId: string, input: CreateResumeInput) {
  return db.transaction(async (tx) => {
    const count = await tx.query.resumes.findMany({
      where: eq(resumes.userId, userId),
      columns: { id: true },
    });

    const isDefault = input.isDefault || count.length === 0;
    if (isDefault) {
      await tx
        .update(resumes)
        .set({ isDefault: false })
        .where(eq(resumes.userId, userId));
    }

    const [row] = await tx
      .insert(resumes)
      .values({ ...input, userId, isDefault })
      .returning();
    return row!;
  });
}

export async function setDefaultResume(userId: string, id: string) {
  return db.transaction(async (tx) => {
    const existing = await tx.query.resumes.findFirst({
      where: and(eq(resumes.id, id), eq(resumes.userId, userId)),
    });
    if (!existing) throw ApiError.notFound("Resume not found");

    await tx.update(resumes).set({ isDefault: false }).where(eq(resumes.userId, userId));
    const [row] = await tx
      .update(resumes)
      .set({ isDefault: true })
      .where(eq(resumes.id, id))
      .returning();
    return row!;
  });
}

export async function deleteResume(userId: string, id: string) {
  const existing = await db.query.resumes.findFirst({
    where: and(eq(resumes.id, id), eq(resumes.userId, userId)),
  });
  if (!existing) throw ApiError.notFound("Resume not found");
  if (existing.isDefault) throw ApiError.badRequest("Set another resume as default first");

  await db.delete(resumes).where(eq(resumes.id, id));
}
