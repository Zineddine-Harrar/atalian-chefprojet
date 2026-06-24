import { HEALTH_LABEL, HEALTH_CLASS, DOMAIN_TINT } from "@/lib/constants";

export function ProjTag({
  name,
  domainKey,
  dim,
}: {
  name: string;
  domainKey: string;
  dim?: boolean;
}) {
  const dom = DOMAIN_TINT[domainKey];
  return (
    <span className="proj-tag" style={dim ? { color: "var(--fg-3)" } : undefined}>
      <span className="swatch" style={{ background: dom?.accent }} />
      {name}
    </span>
  );
}

export function HealthBadge({ health }: { health: string }) {
  return (
    <span className={`badge badge--health ${HEALTH_CLASS[health]}`}>
      <span className="dot" style={{ background: "currentColor" }} />
      {HEALTH_LABEL[health]}
    </span>
  );
}

export function PipelineStepper({
  stageKey,
  stages,
}: {
  stageKey: string;
  stages: { key: string; label: string; orderIndex: number }[];
}) {
  const sorted = [...stages].sort((a, b) => a.orderIndex - b.orderIndex);
  const idx = sorted.findIndex((s) => s.key === stageKey);
  return (
    <div className="pipeline">
      {sorted.map((s, i) => (
        <div key={s.key} className={`step ${i < idx ? "done" : ""} ${i === idx ? "current" : ""}`}>
          <span className="node" />
          <span className="lbl">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
