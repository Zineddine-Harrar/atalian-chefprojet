export const TODAY = process.env.NEXT_PUBLIC_TODAY ?? "2026-06-18";

export const DOMAIN_TINT: Record<string, { accent: string; tint: string }> = {
  cleaning: { accent: "var(--brand-blue)", tint: "var(--brand-blue-tint)" },
  energy: { accent: "var(--brand-green)", tint: "var(--brand-green-tint)" },
  security: { accent: "var(--brand-orange)", tint: "var(--brand-orange-tint)" },
  catering: { accent: "var(--brand-yellow)", tint: "var(--brand-yellow-tint)" },
  group: { accent: "var(--brand-slate)", tint: "var(--brand-slate-tint)" },
};

export const HEALTH_LABEL: Record<string, string> = {
  ON_TRACK: "Dans les temps",
  AT_RISK: "À surveiller",
  BLOCKED: "Bloqué",
};

export const HEALTH_CLASS: Record<string, string> = {
  ON_TRACK: "on-track",
  AT_RISK: "at-risk",
  BLOCKED: "blocked",
};

export const TYPE_STYLE: Record<string, { label: string; bg: string; fg: string }> = {
  INGESTION: { label: "Ingestion", bg: "var(--brand-blue-tint)", fg: "var(--brand-blue-deep)" },
  TRANSFO: { label: "Transfo", bg: "var(--brand-green-tint)", fg: "var(--brand-green-deep)" },
  DATAVIZ: { label: "Dataviz", bg: "var(--brand-yellow-tint)", fg: "var(--brand-yellow-deep)" },
  GOUVERNANCE: { label: "Gouvernance", bg: "var(--brand-slate-tint)", fg: "var(--brand-slate)" },
  REUNION: { label: "Réunion", bg: "var(--brand-orange-tint)", fg: "var(--brand-orange-deep)" },
  RECETTE: { label: "Recette", bg: "var(--brand-slate-tint)", fg: "var(--brand-slate)" },
};

export const BLOCKER_TYPE_LABEL: Record<string, string> = {
  ACCES: "Accès / gouvernance",
  DEPENDANCE: "Dépendance",
  EQUIPE: "Disponibilité équipe",
  QUALITE: "Qualité data",
};

export const PRIORITY_LABEL: Record<string, string> = {
  BASSE: "basse",
  MOYENNE: "moyenne",
  HAUTE: "haute",
};
