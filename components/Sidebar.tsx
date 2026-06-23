"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Ic } from "@/components/icons";

const NAV = [
  { key: "today", label: "Aujourd'hui", icon: Ic.Today, href: "/today" },
  { key: "projects", label: "Projets", icon: Ic.Folder, href: "/projects" },
  { key: "kanban", label: "Tâches", icon: Ic.Columns, href: "/kanban" },
  { key: "milestones", label: "Jalons", icon: Ic.Flag, href: "/milestones" },
];

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="side">
      <div className="side__brand">
        <Image src="/assets/logo-full.png" alt="Atalian" width={140} height={28} priority />
      </div>
      <div className="side__brand" style={{ borderBottom: "none", paddingTop: 14, paddingBottom: 4 }}>
        <span className="pilote-tag">Pilote Data</span>
      </div>
      <nav className="side__nav">
        {NAV.map((n) => {
          const I = n.icon;
          const active = pathname.startsWith(n.href);
          return (
            <Link key={n.key} href={n.href} className={`nav-item ${active ? "is-active" : ""}`}>
              <I />
              {n.label}
            </Link>
          );
        })}
        <div className="side__group-label">Vigilance</div>
        <Link href="/today" className="nav-item">
          <Ic.Alert />
          Blocages
        </Link>
      </nav>
      <div className="side__foot">
        <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
        <div className="who">
          <b>Chef de projet data</b>
          <span>Atalian Global Services</span>
        </div>
      </div>
    </aside>
  );
}
