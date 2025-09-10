// ProgramsPage.tsx
"use client";

import { useEffect, useState } from "react";
import { getPrograms } from "@/entities/program/api/getPrograms";
import { Program } from "@/entities/program/model/types";
import ProgramList from "@/widgets/program-list/ui/ProgramList";
import { AddProgramForm } from "@/features/program/add-program/ui/AddProgramForm";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = async () => {
    setLoading(true);
    const data = await getPrograms();
    setPrograms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">운동 프로그램</h1>
      <AddProgramForm onAdded={fetchPrograms} />
      <ProgramList programs={programs} loading={loading} />
    </div>
  );
}
