"use client";

import { useEffect, useState } from "react";
import { getMyPrograms, ProgramCard, Program } from "@/entities/program";
import { Header } from "@/shared";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";

export default function MyProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (page === 0) setLoading(true);
        else setIsLoadingMore(true);

        const data = await getMyPrograms({ page, size: 10 });

        if (page === 0) {
          setPrograms(data.content);
        } else {
          setPrograms((prev) => [...prev, ...data.content]);
        }
        setIsLast(data.last);
      } catch (error) {
        console.error("나의 프로그램 로딩 실패:", error);
      } finally {
        if (page === 0) setLoading(false);
        else setIsLoadingMore(false);
      }
    };

    fetchData();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-main rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8F9] pb-20">
      <Header title="나의 운동" rightButtonIconUrl={"/workout/calendar"}>
        <Calendar
          size={24}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        />
      </Header>
      <div className="p-5 bg-white gap-3 flex flex-col flex-1">
        <div className="gap-3 flex flex-col">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              {...program}
              isRecent={program.isRecent}
            />
          ))}
        </div>

        {!isLast && (
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={isLoadingMore}
            className="mt-2 flex justify-center items-center gap-2 border border-blue-200 bg-blue-50 text-main rounded-xl w-full p-3 font-bold hover:bg-blue-100 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoadingMore ? "불러오는 중..." : "더보기"}
          </button>
        )}
      </div>

      <Link
        href="/workout/programs/add"
        className="fixed bottom-[88px] right-5 h-14 w-14 rounded-full bg-main text-white shadow-xl shadow-blue-500/30 flex items-center justify-center transition-all active:scale-95 pointer-events-auto z-50 hover:bg-main/90"
      >
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
