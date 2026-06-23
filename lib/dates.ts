export const FR_DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
export const FR_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function parseD(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function fmtLong(s: string): string {
  const d = parseD(s);
  return `${FR_DAYS[d.getDay()]} ${d.getDate()} ${FR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtShort(s: string): string {
  const d = parseD(s);
  return `${d.getDate()} ${FR_MONTHS[d.getMonth()].slice(0, 4)}.`;
}

export function dayDiff(s: string, today: string): number {
  return Math.round((parseD(s).getTime() - parseD(today).getTime()) / 86400000);
}

export function dueClass(s: string, today: string, done: boolean): string {
  if (done) return "";
  const diff = dayDiff(s, today);
  if (diff < 0) return "late";
  if (diff === 0) return "today";
  return "";
}

export function dueLabel(s: string, today: string): string {
  const diff = dayDiff(s, today);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Demain";
  if (diff === -1) return "Hier";
  if (diff < 0) return `Retard ${-diff} j`;
  if (diff <= 7) return `Dans ${diff} j`;
  return fmtShort(s);
}

export const initials = (n: string): string =>
  n === "Vous" ? "V" : n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
