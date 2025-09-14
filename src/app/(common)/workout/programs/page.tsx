// ProgramsPage.tsx
"use client";

import { useEffect, useState } from "react";
import { getPrograms } from "@/entities/program/api/getPrograms";
import { Program } from "@/entities/program/model/types";
import ProgramList from "@/widgets/program-list/ui/ProgramList";
import { AddProgramForm } from "@/features/program/add-program/ui/AddProgramForm";
import Image from "next/image";

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
    <div className=" flex flex-col gap-2 bg-[#F7F8F9]">
      {/* <AddProgramForm onAdded={fetchPrograms} /> */}
      <ProgramList
        programs={programs}
        loading={loading}
        title={"운동 프로그램"}
      />
      <ProgramList programs={programs} loading={loading} title={"나의 운동"} />
      <div className="bg-white flex justify-center p-5">
        <button className="flex justify-center items-cetner gap-1 border border-[#d9d9d9] rounded-lg w-full p-2">
          <Image
            alt="add-program"
            src="/images/common/icon/add_circle_outline_24px.svg"
            width={20}
            height={20}
          />
          루틴 추가하기
        </button>
      </div>
    </div>
  );
}
