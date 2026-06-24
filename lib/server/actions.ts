"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

const idSchema = z.object({ id: z.string().min(1) });

export async function toggleTaskDone(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("unauthorized");
  const parsed = idSchema.parse({ id });
  const t = await prisma.task.findUnique({ where: { id: parsed.id } });
  if (!t) throw new Error("not found");
  const next = t.status === "DONE" ? "TODO" : "DONE";
  await prisma.task.update({ where: { id: parsed.id }, data: { status: next } });
  revalidatePath("/today");
  revalidatePath("/kanban");
  revalidatePath("/projects");
}

const setStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["BACKLOG", "TODO", "DOING", "REVIEW", "DONE"]),
});

export async function setTaskStatus(input: z.infer<typeof setStatusSchema>) {
  const session = await auth();
  if (!session?.user) throw new Error("unauthorized");
  const parsed = setStatusSchema.parse(input);
  await prisma.task.update({ where: { id: parsed.id }, data: { status: parsed.status } });
  revalidatePath("/today");
  revalidatePath("/kanban");
  revalidatePath("/projects");
}
