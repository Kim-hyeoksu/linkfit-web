"use client";

import { useEffect, useState } from "react";
import { getPrograms, ProgramCard, Program } from "@/entities/program";
import { Header } from "@/shared";
import { Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function MyProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("나의 프로그램 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-main rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8F9]">
      <Header title="나의 운동" rightButtonIconUrl={"/workout/history"}>
        <Calendar
          size={24}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        />
      </Header>
      <div className="p-5 bg-white gap-3 flex flex-col flex-1">
        <div className="gap-3 flex flex-col">
          {programs.map((program) => (
            <ProgramCard key={program.id} {...program} />
          ))}
        </div>
        <Link
          href={"/workout/programs/add"}
          className="flex justify-center items-center gap-2 border border-[#d9d9d9] rounded-xl w-full p-3 text-[#666] font-medium hover:bg-gray-50 active:scale-95 transition-all"
        >
          <PlusCircle size={20} />
          <span>루틴 추가하기</span>
        </Link>
      </div>
    </div>
  );
}
