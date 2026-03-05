"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/shared";
import {
  getExerciseHistory,
  ExerciseHistoryResponse,
} from "@/entities/exercise";
import { ExerciseHistoryChart } from "@/widgets/exercise";

export default function ExerciseHistoryDetailPage() {
  const { exerciseId } = useParams();
  const [history, setHistory] = useState<ExerciseHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!exerciseId) return;
      try {
        const data = await getExerciseHistory({
          exerciseId: Number(exerciseId),
          size: 100, // 최대 100개의 최근 세션 기록
          sort: ["sessionDate,desc"],
        });
        setHistory(data.content || []);
      } catch (error) {
        console.error("Failed to fetch exercise history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [exerciseId]);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header title="종목별 기록 통계" showBackButton={true} />

      <main className="px-5 pt-4 flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 ml-1">변화 추이</h3>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
            </div>
          ) : (
            <ExerciseHistoryChart data={history} />
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 ml-1">상세 기록 리스트</h3>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 bg-white rounded-3xl text-center text-gray-500 text-sm border border-gray-100">
              기록된 운동 정보가 없어요.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-3xl bg-white shadow-sm border border-gray-100 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-end border-b border-gray-50 pb-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400 font-medium">
                        {item.sessionDate}
                      </span>
                      <span className="text-[13px] font-bold text-gray-800">
                        {item.programName ? `${item.programName} - ` : ""}
                        {item.planTitle}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs">
                      <div className="flex gap-2 text-gray-600">
                        <span className="font-semibold text-red-500">
                          1RM: {item.calculated1Rm?.toFixed(1) || "-"}kg
                        </span>
                      </div>
                      <div className="flex gap-2 text-gray-500 text-[10px]">
                        <span>볼륨: {item.totalVolume || 0}kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    {item.sets.map((set, setIdx) => (
                      <div
                        key={setIdx}
                        className="flex justify-between items-center text-xs"
                      >
                        <span className="text-gray-500 min-w-[30px]">
                          {set.setOrder}세트
                        </span>
                        <div className="flex gap-3 font-semibold text-gray-700">
                          <span className="w-10 text-right">
                            {set.actualWeight}kg
                          </span>
                          <span className="w-8 text-center">x</span>
                          <span className="w-8 ">{set.actualReps}회</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
