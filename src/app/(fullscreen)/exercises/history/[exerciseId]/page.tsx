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

  const max1RmRecord =
    history.length > 0
      ? history.reduce((prev, current) =>
          (prev.calculated1Rm || 0) > (current.calculated1Rm || 0)
            ? prev
            : current,
        )
      : null;

  const maxVolumeRecord =
    history.length > 0
      ? history.reduce((prev, current) =>
          (prev.totalVolume || 0) > (current.totalVolume || 0) ? prev : current,
        )
      : null;

  const getMotivationMessage = () => {
    if (history.length < 2) return null;

    // history는 최신순(desc) 정렬된 상태
    const latest = history[0];
    const latestDate = new Date(latest.sessionDate).getTime();

    let comparisonRecord = null;
    let timeLabel = "첫 기록";

    // 약 한 달(30일 이상) 전 기록 찾기
    for (let i = 1; i < history.length; i++) {
      const recordDate = new Date(history[i].sessionDate).getTime();
      const diffDays = (latestDate - recordDate) / (1000 * 60 * 60 * 24);

      if (diffDays >= 30) {
        comparisonRecord = history[i];
        timeLabel = "지난달";
        break;
      }
    }

    // 30일 이전 기록이 없다면 가장 오래된(처음) 기록과 비교
    if (!comparisonRecord) {
      comparisonRecord = history[history.length - 1];
    }

    const currentVolume = latest.totalVolume || 0;
    const pastVolume = comparisonRecord.totalVolume || 0;

    if (currentVolume > 0 && pastVolume > 0) {
      const diffPercent = (
        ((currentVolume - pastVolume) / pastVolume) *
        100
      ).toFixed(0);
      const diffNumber = Number(diffPercent);

      if (diffNumber > 0) {
        return {
          text: `🔥 ${timeLabel} 대비 총 볼륨이 ${diffPercent}% 증가했어요!`,
          color: "text-gray-800 bg-blue-50 border-blue-100",
        };
      } else if (diffNumber < 0) {
        return {
          text: `💪 꾸준함이 무기! 다음엔 볼륨이 더 늘어날 거예요.`,
          color: "text-gray-800 bg-slate-50 border-slate-100",
        };
      } else {
        return {
          text: `👍 ${timeLabel}과 동일한 볼륨을 훌륭하게 소화 중입니다.`,
          color: "text-gray-800 bg-white border-blue-100",
        };
      }
    }
    return null;
  };

  const motivation = getMotivationMessage();

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header title="종목별 기록 통계" showBackButton={true} />

      <main className="px-5 pt-4 flex flex-col gap-6">
        {!isLoading && motivation && (
          <div
            className={`px-4 py-3.5 rounded-2xl flex items-center justify-center font-bold text-[13px] border shadow-sm ${motivation.color}`}
          >
            {motivation.text}
          </div>
        )}

        {!isLoading && history.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-800 ml-1">🏆 역대 최고 기록</h3>
            <div className="flex gap-3">
              <div className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-1">
                <span className="text-[11px] text-slate-500 font-bold">
                  최대 1RM
                </span>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-black text-red-500">
                    {max1RmRecord?.calculated1Rm?.toFixed(1) || "-"}
                  </span>
                  <span className="text-sm text-slate-400 font-bold mb-0.5">
                    kg
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-medium bg-slate-50 w-fit px-2 py-0.5 rounded-md">
                  {max1RmRecord?.sessionDate}
                </span>
              </div>

              <div className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-1">
                <span className="text-[11px] text-slate-500 font-bold">
                  최대 볼륨
                </span>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-black text-blue-500">
                    {maxVolumeRecord?.totalVolume || "-"}
                  </span>
                  <span className="text-sm text-slate-400 font-bold mb-0.5">
                    kg
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-medium bg-slate-50 w-fit px-2 py-0.5 rounded-md">
                  {maxVolumeRecord?.sessionDate}
                </span>
              </div>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 ml-1">📈 변화 추이</h3>
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
