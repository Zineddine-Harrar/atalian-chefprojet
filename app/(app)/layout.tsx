import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { getTodayDashboard } from "@/lib/server/dashboard";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const d = await getTodayDashboard();

  return (
    <div className="app">
      <Sidebar userName={session.user.name ?? "Vous"} counts={d.counts} />
      <div className="main">
        <div className="brand-bar" />
        <Topbar />
        <main className="scroll">{children}</main>
      </div>
    </div>
  );
}
