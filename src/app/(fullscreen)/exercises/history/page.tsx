"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared";
import { getExercises, Exercise } from "@/entities/exercise";
import { ChevronRight, Settings, BarChart2 } from "lucide-react";

export default function ExercisesHistoryListPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => router.push(`/exercises/history/${exercise.id}`)}
                className="w-full text-left bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md w-fit">
                    {exercise.bodyPart}
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {exercise.name}
                  </span>
                </div>
                <div className="text-gray-400">
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
