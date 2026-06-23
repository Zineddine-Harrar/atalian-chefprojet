"use client";

import { usePathname } from "next/navigation";
import { fmtLong, toISO } from "@/lib/dates";

const TITLES: Record<string, { h: string; s: string }> = {
  "/today": { h: "Aujourd'hui", s: "Votre cockpit du jour" },
  "/projects": { h: "Portefeuille de projets", s: "Vue d'ensemble de vos chantiers data" },
  "/kanban": { h: "Tâches", s: "Glissez les cartes pour faire avancer le travail" },
  "/milestones": { h: "Jalons & échéances", s: "La trajectoire des prochaines semaines" },
  "/settings": { h: "Préférences", s: "Personnalisez votre cockpit" },
};

export function Topbar() {
  const pathname = usePathname();
  const key = Object.keys(TITLES).find((k) => pathname.startsWith(k)) ?? "/today";
  const t = TITLES[key];
  const today = toISO(new Date());

  return (
    <header className="topbar">
      <div>
        <h1>{t.h}</h1>
        <div className="sub">{t.s}</div>
      </div>
      <div className="spacer" />
      <div className="date-chip">{fmtLong(today)}</div>
    </header>
  );
}
