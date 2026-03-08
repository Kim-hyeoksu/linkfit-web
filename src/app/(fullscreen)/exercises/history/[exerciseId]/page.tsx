"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/shared";
import {
  getExerciseHistory,
  updateExercisePreference,
  Exercise,
  ExerciseHistoryResponse,
} from "@/entities/exercise";
import { ExerciseHistoryChart } from "@/widgets/exercise";
import { Settings, History, Info, Save } from "lucide-react";
import { useToast } from "@/shared/ui/toast";
import Image from "next/image";

export default function ExerciseHistoryDetailPage() {
  const { exerciseId } = useParams();
  const { showToast } = useToast();
  const [history, setHistory] = useState<ExerciseHistoryResponse[]>([]);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"history" | "settings">("history");
  const [imageIndex, setImageIndex] = useState(0);

  // 설정용 로컬 상태
  const [settings, setSettings] = useState({
    targetWeight: 0,
    targetReps: 0,
    targetSets: 0,
    targetRestSeconds: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!exerciseId) return;
      setIsLoading(true);
      try {
        const response = await getExerciseHistory({
          exerciseId: Number(exerciseId),
          size: 100,
          sort: ["sessionDate,desc"],
        });

        if (response.history) {
          setHistory(response.history.content || []);
        }

        if (response.exercise) {
          setExercise(response.exercise);
          setSettings({
            targetWeight: response.exercise.targetWeight || 0,
            targetReps: response.exercise.targetReps || 0,
            targetSets: response.exercise.targetSets || 0,
            targetRestSeconds: response.exercise.targetRestSeconds || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [exerciseId]);

  useEffect(() => {
    if (!exercise?.imagePath) return;

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [exercise?.imagePath]);

  const handleUpdateSettings = async () => {
    if (!exerciseId) return;
    setIsSaving(true);
    try {
      await updateExercisePreference(Number(exerciseId), settings);
      showToast("운동 설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("Failed to update settings:", error);
      showToast("설정 저장에 실패했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

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

    const latest = history[0];
    const latestDate = new Date(latest.sessionDate).getTime();

    let comparisonRecord = null;
    let timeLabel = "첫 기록";

    for (let i = 1; i < history.length; i++) {
      const recordDate = new Date(history[i].sessionDate).getTime();
      const diffDays = (latestDate - recordDate) / (1000 * 60 * 60 * 24);

      if (diffDays >= 30) {
        comparisonRecord = history[i];
        timeLabel = "지난달";
        break;
      }
    }

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
      <Header title={exercise?.name || "종목 상세"} showBackButton={true} />

      <main className="px-5 pt-4 flex flex-col gap-6">
        {/* 운동 이미지 애니메이션 */}
        {!isLoading && exercise?.imagePath && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative aspect-[4/3] w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${exercise.imagePath}`}
              alt={exercise.name}
              fill
              className={`object-cover ${
                imageIndex === 0 ? "opacity-100" : "opacity-0"
              }`}
              priority
            />
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${exercise.imagePath.replace(/\.png$/, "2.png")}`}
              alt={exercise.name}
              fill
              className={`object-cover ${
                imageIndex === 1 ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}

        {/* 탭 메뉴 */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "history"
                ? "bg-main text-white shadow-md shadow-blue-100"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <History size={16} /> 기록 확인
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "settings"
                ? "bg-main text-white shadow-md shadow-blue-100"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Settings size={16} /> 운동 설정
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
          </div>
        ) : (
          <>
            {/* 역사/통계 탭 */}
            {activeTab === "history" && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                {motivation && (
                  <div
                    className={`px-4 py-3.5 rounded-2xl flex items-center justify-center font-bold text-[13px] border shadow-sm ${motivation.color}`}
                  >
                    {motivation.text}
                  </div>
                )}

                {history.length > 0 && (
                  <section className="flex flex-col gap-3">
                    <h3 className="font-bold text-gray-800 ml-1">
                      🏆 역대 최고 기록
                    </h3>
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
                  <ExerciseHistoryChart data={history} />
                </section>

                <section className="flex flex-col gap-4">
                  <h3 className="font-bold text-gray-800 ml-1">
                    상세 기록 리스트
                  </h3>
                  {history.length === 0 ? (
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
                                {item.programName
                                  ? `${item.programName} - `
                                  : ""}
                                {item.planTitle}
                              </span>
                            </div>
                            <div className="flex flex-col items-end gap-1 text-xs">
                              <span className="font-semibold text-red-500">
                                1RM: {item.calculated1Rm?.toFixed(1) || "-"}kg
                              </span>
                              <span className="text-gray-500 text-[10px]">
                                볼륨: {item.totalVolume || 0}kg
                              </span>
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
                                  <span className="w-8 ">
                                    {set.actualReps}회
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* 설정 탭 내용 */}
            {activeTab === "settings" && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                    <Info size={18} className="text-main" />
                    <h3 className="font-bold text-gray-800">
                      운동 기본 수치 설정
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    이 종목을 새 플랜에 추가할 때 자동으로 적용될 기본값입니다.
                    나에게 맞는 무게와 횟수를 설정해두면 플랜 작성이 훨씬
                    빨라집니다.
                  </p>

                  <div className="space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">
                        기본 무게 (kg)
                      </label>
                      <input
                        type="number"
                        value={settings.targetWeight}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            targetWeight: Number(e.target.value),
                          })
                        }
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-main focus:bg-white transition-all outline-none font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">
                          기본 횟수 (reps)
                        </label>
                        <input
                          type="number"
                          value={settings.targetReps}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              targetReps: Number(e.target.value),
                            })
                          }
                          className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-main focus:bg-white transition-all outline-none font-bold text-center"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">
                          기본 세트 (sets)
                        </label>
                        <input
                          type="number"
                          value={settings.targetSets}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              targetSets: Number(e.target.value),
                            })
                          }
                          className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-main focus:bg-white transition-all outline-none font-bold text-center"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">
                        기본 휴식 시간 (초)
                      </label>
                      <div className="flex gap-2">
                        {[30, 60, 90, 120].map((sec) => (
                          <button
                            key={sec}
                            onClick={() =>
                              setSettings({
                                ...settings,
                                targetRestSeconds: sec,
                              })
                            }
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                              settings.targetRestSeconds === sec
                                ? "bg-blue-50 border-main text-main shadow-sm"
                                : "bg-white border-slate-200 text-slate-400"
                            }`}
                          >
                            {sec}초
                          </button>
                        ))}
                        <input
                          type="number"
                          value={settings.targetRestSeconds}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              targetRestSeconds: Number(e.target.value),
                            })
                          }
                          className="w-20 h-8 text-center bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateSettings}
                    disabled={isSaving}
                    className="w-full mt-4 h-14 bg-main text-white rounded-2xl font-black text-base shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save size={20} />
                        설정값 저장하기
                      </>
                    )}
                  </button>
                </section>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
