import Link from "next/link";
import { getTodayDashboard } from "@/lib/server/dashboard";
import { dayDiff, dueClass, dueLabel, fmtShort, initials, toISO } from "@/lib/dates";
import { Ic } from "@/components/icons";
import { HealthBadge, ProjTag } from "@/components/shared";
import { TaskCheck } from "@/components/TaskCheck";
import { BLOCKER_TYPE_LABEL, DOMAIN_TINT, TODAY } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const d = await getTodayDashboard();
  const today = d.today;

  const kpis = [
    {
      val: d.kpis.activeProj,
      label: "Projets actifs",
      sub: `${d.kpis.atRisk} à surveiller`,
      ico: <Ic.Folder />,
      bg: "var(--brand-blue-tint)",
      fg: "var(--brand-blue-deep)",
      href: "/projects",
    },
    {
      val: d.kpis.priorities,
      label: "Priorités du jour",
      sub: d.kpis.overdue ? `${d.kpis.overdue} en retard` : "à jour",
      ico: <Ic.Pulse />,
      bg: "var(--brand-green-tint)",
      fg: "var(--brand-green-deep)",
      href: "/kanban",
    },
    {
      val: d.kpis.blockers,
      label: "Blocages ouverts",
      sub: `${d.kpis.criticalBlockers} critique(s)`,
      ico: <Ic.Alert />,
      bg: "var(--brand-orange-tint)",
      fg: "var(--brand-orange-deep)",
      href: null as string | null,
    },
    {
      val: d.kpis.upcomingMs,
      label: "Jalons sous 14 j",
      sub: "à anticiper",
      ico: <Ic.Flag />,
      bg: "var(--brand-yellow-tint)",
      fg: "var(--brand-yellow-deep)",
      href: "/milestones",
    },
  ];

  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="grid grid--kpi">
        {kpis.map((k, i) => {
          const inner = (
            <div className="card kpi" style={{ cursor: k.href ? "pointer" : "default", height: "100%" }}>
              <div className="kpi-top">
                <span className="kpi-ico" style={{ background: k.bg, color: k.fg }}>
                  {k.ico}
                </span>
              </div>
              <div className="kpi-val">{k.val}</div>
              <div className="kpi-label">
                {k.label} · <span style={{ color: "var(--fg-2)" }}>{k.sub}</span>
              </div>
            </div>
          );
          return k.href ? (
            <Link key={i} href={k.href} style={{ display: "block" }}>
              {inner}
            </Link>
          ) : (
            <div key={i}>{inner}</div>
          );
        })}
      </div>

      <div className="grid grid--2">
        <div className="grid" style={{ gap: 22 }}>
          <div className="card card--flush">
            <div style={{ padding: "18px 20px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                <Ic.Pulse /> Priorités du jour <span className="count">{d.priorities.length}</span>
              </h2>
              <Link href="/kanban" className="pill" style={{ cursor: "pointer", border: "none", textDecoration: "none" }}>
                Voir le Kanban
              </Link>
            </div>
            <div className="rowlist">
              {d.priorities.length === 0 && <div className="empty">Rien d&apos;urgent. Bonne journée.</div>}
              {d.priorities.map((t) => {
                const p = d.projById[t.projectId]!;
                const dueISO = toISO(t.dueDate);
                const dc = dueClass(dueISO, today, false);
                return (
                  <div key={t.id} className="row">
                    <TaskCheck id={t.id} done={false} />
                    <div className="row-main">
                      <div className="row-title">{t.title}</div>
                      <div className="row-meta">
                        <ProjTag name={p.name} domainKey={p.domainKey} />
                        <span>·</span>
                        <span className={`prio ${t.priority.toLowerCase()}`}>{t.priority.toLowerCase()}</span>
                        <span>·</span>
                        <span className={`due ${dc}`}>{dueLabel(dueISO, today)}</span>
                      </div>
                    </div>
                    <span className="kc-assignee" title={t.assignee?.fullName ?? ""}>
                      {initials(t.assignee?.fullName ?? "Vous")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card card--flush">
            <div style={{ padding: "18px 20px 10px" }}>
              <span className="eyebrow">Santé du portefeuille</span>
            </div>
            <div className="rowlist">
              {d.projects.map((p) => (
                <div key={p.id} className="row">
                  <div className="row-main">
                    <div className="row-title">{p.name}</div>
                    <div className="row-meta">
                      <span>{p.domainKey}</span>
                      <span>·</span>
                      <span>Échéance {fmtShort(toISO(p.dueDate))}</span>
                    </div>
                  </div>
                  <div className="progress-row" style={{ width: 140 }}>
                    <div className="bar" style={{ flex: 1 }}>
                      <i style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="pct">{p.progress}%</span>
                  </div>
                  <HealthBadge health={p.health} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid" style={{ gap: 22 }}>
          <div className="card">
            <h2 className="section-title">
              <Ic.Clock /> Agenda du jour
            </h2>
            {d.agenda.length === 0 && <div className="empty">Aucun créneau aujourd&apos;hui.</div>}
            {d.agenda.map((a) => {
              const p = a.projectId ? d.projById[a.projectId] : null;
              const dom = p ? DOMAIN_TINT[p.domainKey] : null;
              return (
                <div key={a.id} className="agenda-item">
                  <span className="tk" style={{ background: dom?.accent }} />
                  <span className="t">{a.startTime}</span>
                  <div className="body">
                    <div className="ti">{a.title}</div>
                    <div className="me">
                      {a.durationMin} min{p ? ` · ${p.name}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card">
            <h2 className="section-title">
              <Ic.Alert /> Blocages & dépendances <span className="count">{d.blockers.length}</span>
            </h2>
            {d.blockers.map((b) => {
              const p = d.projById[b.projectId]!;
              return (
                <div key={b.id} className={`blocker ${b.severity.toLowerCase()}`}>
                  <span className="sev" />
                  <div>
                    <div className="b-title">{b.title}</div>
                    <div className="b-meta">
                      <ProjTag name={p.name} domainKey={p.domainKey} dim />
                      <span>·</span>
                      <span>{BLOCKER_TYPE_LABEL[b.type]}</span>
                      <span>·</span>
                      <span>Resp. {b.owner}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
