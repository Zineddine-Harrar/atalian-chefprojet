import { prisma } from "@/lib/db";
import { Ic } from "@/components/icons";
import { HealthBadge, PipelineStepper } from "@/components/shared";
import { DOMAIN_TINT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, stages] = await Promise.all([
    prisma.project.findMany({
      include: {
        domain: true,
        sources: true,
        _count: { select: { tasks: { where: { status: { not: "DONE" } } }, blockers: { where: { resolvedAt: null } } } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.pipelineStage.findMany(),
  ]);

  return (
    <div className="grid grid--proj">
      {projects.map((p) => {
        const dom = DOMAIN_TINT[p.domainKey];
        const nb = p._count.blockers;
        const tc = p._count.tasks;
        return (
          <div key={p.id} className="proj">
            <div className="stripe" style={{ background: dom?.accent }} />
            <div className="proj-body">
              <div className="proj-head">
                <div>
                  <div className="proj-name">{p.name}</div>
                  <div className="proj-dom">
                    {p.domain.label} · {p.sponsor}
                  </div>
                </div>
                <HealthBadge health={p.health} />
              </div>
              <p className="proj-sum">{p.summary}</p>
              <PipelineStepper stageKey={p.stageKey} stages={stages} />
              <div className="progress-row">
                <div className="bar" style={{ flex: 1 }}>
                  <i style={{ width: `${p.progress}%` }} />
                </div>
                <span className="pct">{p.progress}%</span>
              </div>
              <div className="proj-foot">
                <span className="qual">
                  <Ic.Db size={15} /> Qualité <b>{p.dataQuality}%</b>
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  {nb > 0 && (
                    <span className="pill" style={{ color: "var(--status-danger)" }}>
                      <Ic.Alert size={13} /> {nb}
                    </span>
                  )}
                  <span className="pill">
                    <Ic.Columns size={13} /> {tc} tâches
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
