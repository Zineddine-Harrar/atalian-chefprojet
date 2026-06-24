"use client";

import { useTransition } from "react";
import { toggleTaskDone } from "@/lib/server/actions";
import { Ic } from "@/components/icons";

export function TaskCheck({ id, done }: { id: string; done: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div
      className="check"
      style={{ opacity: pending ? 0.5 : 1 }}
      onClick={(e) => {
        e.stopPropagation();
        start(() => toggleTaskDone(id));
      }}
    >
      {done ? <Ic.Check /> : <Ic.Check />}
    </div>
  );
}
