"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared";
import { getExercises, Exercise } from "@/entities/exercise";
import { ChevronRight, BarChart2 } from "lucide-react";

export default function ExercisesHistoryListPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("전체");

  const bodyParts = [
    "전체",
    ...Array.from(new Set(exercises.map((ex) => ex.bodyPart))),
  ];

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBodyPart =
      selectedBodyPart === "전체" || ex.bodyPart === selectedBodyPart;
    return matchesSearch && matchesBodyPart;
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header title="종목 관리 및 기록" showBackButton={true} />

      <main className="px-5 pt-4 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-1">
          <h2 className="text-lg font-bold text-gray-800">운동 종목 관리</h2>
          <p className="text-xs text-gray-500">
            기록 통계를 확인하거나 나만의 기본 수치를 설정해보세요.
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="운동 이름을 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:border-main focus:ring-1 focus:ring-main outline-none transition-all text-sm font-medium"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {bodyParts.map((part) => (
              <button
                key={part}
                onClick={() => setSelectedBodyPart(part)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedBodyPart === part
                    ? "bg-main border-main text-white shadow-md shadow-blue-100"
                    : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <BarChart2 size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => router.push(`/exercises/history/${exercise.id}`)}
                className="w-full text-left bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:border-blue-200 hover:shadow-md group"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md w-fit">
                    {exercise.bodyPart}
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {exercise.name}
                  </span>
                </div>
                <div className="text-gray-400 group-hover:text-main transition-colors">
                  <ChevronRight size={20} />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
