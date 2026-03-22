import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Target } from "lucide-react";
import { UserGoal, getGoals } from "@/entities/user-goal";
import { GoalActionSheet } from "@/features/user-goal";
import { motion } from "framer-motion";

export const GoalSummaryWidget = () => {
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const DRAG_THRESHOLD = 50;

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data || []);
    } catch (e) {
      console.error("Failed to load goals for summary", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openDetailSheet = (goal: UserGoal) => {
    setSelectedGoal(goal);
    setIsBottomSheetOpen(true);
  };

  const openCreateSheet = () => {
    setSelectedGoal(null);
    setIsBottomSheetOpen(true);
  };

  const handleActionSuccess = () => {
    fetchGoals();
    setIsBottomSheetOpen(false);
    setCurrentIndex(0);
  };

  const calculateDday = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-Day";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now <= start) return 0;
    if (now >= end) return 100;

    const total = end - start;
    const current = now - start;
    return Math.round((current / total) * 100);
  };

  const getGoalInfo = (goal: UserGoal) => {
    switch (goal.goalType) {
      case "WEIGHT_LOSS":
        return {
          label: "체중 감량",
          color: "text-blue-500",
          bg: "bg-blue-50",
          primaryLabel: "목표 체중",
          primary: `${goal.primaryValue?.toLocaleString()}kg`,
          secondaryLabel: "체지방률",
          secondary: goal.secondaryValue ? `${goal.secondaryValue}%` : null,
          showValues: true,
        };
      case "BULK_UP":
        return {
          label: "벌크업",
          color: "text-red-500",
          bg: "bg-red-50",
          primaryLabel: "목표 체중",
          primary: `${goal.primaryValue?.toLocaleString()}kg`,
          secondaryLabel: "골격근량",
          secondary: goal.secondaryValue ? `${goal.secondaryValue}kg` : null,
          showValues: true,
        };
      case "STRENGTH":
        return {
          label: "근력 향상",
          color: "text-green-500",
          bg: "bg-green-50",
          primaryLabel: "목표 중량",
          primary: `${goal.primaryValue?.toLocaleString()}kg`,
          secondaryLabel: "목표 횟수",
          secondary: goal.secondaryValue ? `${goal.secondaryValue} Reps` : null,
          showValues: true,
        };
      case "FITNESS_IMPROVEMENT":
        return {
          label: "체력 증진",
          color: "text-indigo-500",
          bg: "bg-indigo-50",
          primaryLabel: "",
          secondaryLabel: "",
          showValues: false,
        };
      case "REHABILITATION":
        return {
          label: "재활",
          color: "text-amber-500",
          bg: "bg-amber-50",
          primaryLabel: "",
          secondaryLabel: "",
          showValues: false,
        };
      default:
        return {
          label: "목표",
          color: "text-slate-500",
          bg: "bg-slate-50",
          primaryLabel: "",
          primary: "",
          secondaryLabel: "",
          secondary: null,
          showValues: false,
        };
    }
  };

  // 실제 렌더링할 카드 리스트 (목표가 5개 미만이면 추가 슬라이드 생성)
  const showAddCard = goals.length < 5;
  const totalSlides = goals.length + (showAddCard ? 1 : 0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-50 flex items-center justify-center h-[140px]">
        <div className="animate-spin rounded-full h-7 w-7 border-[3px] border-slate-100 border-t-main"></div>
      </div>
    );
  }

  // 목표가 전혀 없고, 추가 카드도 안 보여줄 상황은 없지만 방어코드
  if (goals.length === 0 && !showAddCard) {
    return (
      <div
        onClick={openCreateSheet}
        className="bg-white rounded-2xl p-7 shadow-sm border border-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
      >
        <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-main transition-colors">
          <Target size={24} />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-bold text-[16px]">
            아직 설정된 목표가 없어요
          </p>
          <p className="text-slate-400 text-[13px] mt-0.5">
            클릭해서 첫 목표를 세워보세요!
          </p>
        </div>
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const onDragEnd = (e: any, info: any) => {
    const { offset } = info;
    if (offset.x < -DRAG_THRESHOLD) {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    } else if (offset.x > DRAG_THRESHOLD) {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  return (
    <div className="relative group/container select-none flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[19px] font-black text-slate-800 tracking-tight">
          나의 목표
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-white relative overflow-hidden h-[180px]">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={onDragEnd}
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex h-full cursor-grab active:cursor-grabbing"
        >
          {goals.map((goal, idx) => {
            const ddayLabel = calculateDday(goal.endDate);
            const progress = calculateProgress(goal.startDate, goal.endDate);
            const isFinished = ddayLabel.startsWith("D+");
            const {
              label,
              color,
              bg,
              primary,
              secondary,
              showValues,
              primaryLabel,
              secondaryLabel,
            } = getGoalInfo(goal);

            return (
              <div
                key={goal.id || idx}
                onClick={() => openDetailSheet(goal)}
                className={`w-full h-full flex-shrink-0 py-5 px-7 flex flex-col gap-4 cursor-pointer transition-all ${isFinished ? "opacity-70" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2.5 py-1 rounded-md text-[11px] font-black ${bg} ${color}`}
                    >
                      {label}
                    </div>
                  </div>
                  <div
                    className={`text-[12px] font-black px-2 py-0.5 rounded-full ${isFinished ? "bg-slate-200 text-slate-500" : "bg-red-50 text-red-500"}`}
                  >
                    {ddayLabel}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3
                    className={`text-[19px] font-black tracking-tight leading-tight truncate ${isFinished ? "text-slate-500" : "text-slate-800"}`}
                  >
                    {goal.targetText}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  {showValues ? (
                    <div className="flex gap-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-400">
                          {primaryLabel}
                        </span>
                        <span
                          className={`text-[18px] font-black tracking-tight ${isFinished ? "text-slate-500" : "text-[#191F28]"}`}
                        >
                          {primary}
                        </span>
                      </div>
                      {secondary && (
                        <div className="flex flex-col border-l border-slate-100 pl-5">
                          <span className="text-[11px] font-bold text-slate-400">
                            {secondaryLabel}
                          </span>
                          <span
                            className={`text-[18px] font-black tracking-tight ${isFinished ? "text-slate-500" : "text-[#191F28]"}`}
                          >
                            {secondary}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div />
                  )}

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[11px] font-bold text-main">
                      {progress}% 진행 중
                    </span>
                    <div className="w-24 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isFinished ? "bg-slate-300" : "bg-main shadow-sm shadow-blue-100"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Goal Slide */}
          {showAddCard && (
            <div
              onClick={openCreateSheet}
              className="w-full h-full flex-shrink-0 p-7 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-main group-hover:text-main transition-all">
                <Plus size={32} />
              </div>
              <div className="text-center">
                <p className="text-slate-900 font-bold text-[17px]">
                  새로운 목표 추가하기
                </p>
                <p className="text-slate-400 text-[13px] mt-1">
                  최대 5개까지 설정할 수 있어요
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Minimal Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-0 -translate-y-1/2 p-1 transition-all z-10 text-slate-400 hover:text-main active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-0 -translate-y-1/2 p-1 transition-all z-10 text-slate-400 hover:text-main active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-1.5 ">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-4 bg-main" : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>
      )}

      {/* 공통 GoalActionSheet 사용 */}
      <GoalActionSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        selectedGoal={selectedGoal}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
};
