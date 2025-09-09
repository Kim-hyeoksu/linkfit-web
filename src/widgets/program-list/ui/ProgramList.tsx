"use client";

import { useEffect, useState } from "react";
import { getPrograms } from "@/entities/program/api/getPrograms";
import { Program } from "@/entities/program/model/types";
import ProgramCard from "@/entities/program/ui/ProgramCard";

export default function ProgramList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrograms().then((data) => {
      setPrograms(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>로딩중...</div>;

  return (
    <div className="grid gap-4">
      {programs.map((program) => (
        <ProgramCard key={program.id} {...program} />
      ))}
    </div>
  );
}
