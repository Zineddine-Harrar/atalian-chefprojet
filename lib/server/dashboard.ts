import { prisma } from "@/lib/db";
import { TODAY } from "@/lib/constants";
import { dayDiff, toISO } from "@/lib/dates";

export async function getTodayDashboard() {
  const [projects, tasks, milestones, blockers, agenda, stages] = await Promise.all([
    prisma.project.findMany({ include: { sources: true }, orderBy: { name: "asc" } }),
    prisma.task.findMany({ include: { assignee: true } }),
    prisma.milestone.findMany(),
    prisma.blocker.findMany({ where: { resolvedAt: null } }),
    prisma.agendaItem.findMany({ where: { date: new Date(TODAY + "T00:00:00Z") }, orderBy: { startTime: "asc" } }),
    prisma.pipelineStage.findMany(),
  ]);

  const projById = Object.fromEntries(projects.map((p) => [p.id, p]));

  const isDone = (status: string) => status === "DONE";

  const priorities = tasks
    .filter((t) => !isDone(t.status))
    .filter((t) => {
      const d = dayDiff(toISO(t.dueDate), TODAY);
      return d <= 0 || t.priority === "HAUTE";
    })
    .sort((a, b) => dayDiff(toISO(a.dueDate), TODAY) - dayDiff(toISO(b.dueDate), TODAY));

  const overdue = tasks.filter((t) => !isDone(t.status) && dayDiff(toISO(t.dueDate), TODAY) < 0).length;
  const activeProj = projects.length;
  const atRisk = projects.filter((p) => p.health !== "ON_TRACK").length;
  const upcomingMs = milestones.filter((m) => {
    const d = dayDiff(toISO(m.date), TODAY);
    return d >= 0 && d <= 14;
  }).length;
  const criticalBlockers = blockers.filter((b) => b.severity === "CRITIQUE").length;

  const kanbanOpen = tasks.filter((t) => !isDone(t.status)).length;

  return {
    today: TODAY,
    projects,
    tasks,
    milestones,
    blockers,
    agenda,
    stages,
    projById,
    priorities,
    counts: {
      today: priorities.length,
      projects: activeProj,
      kanban: kanbanOpen,
      milestones: upcomingMs,
      blockers: blockers.length,
    },
    kpis: {
      activeProj,
      atRisk,
      priorities: priorities.length,
      overdue,
      blockers: blockers.length,
      criticalBlockers,
      upcomingMs,
    },
  };
}
