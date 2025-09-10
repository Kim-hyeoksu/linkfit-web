// ProgramList.tsx
"use client";

import { Program } from "@/entities/program/model/types";
import ProgramCard from "@/entities/program/ui/ProgramCard";

interface ProgramListProps {
  programs: Program[];
  loading: boolean;
}

export default function ProgramList({ programs, loading }: ProgramListProps) {
  if (loading) return <div>로딩중...</div>;

  return (
    <div className="grid gap-4">
      {programs.map((program) => (
        <ProgramCard key={program.id} {...program} />
      ))}
    </div>
  );
}
