"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Target,
  Flame,
  Activity,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  UserGoal,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  UserGoalRequest,
} from "@/entities/user-goal";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { useToast } from "@/shared/ui";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { GoalForm } from "@/features/user-goal/ui/GoalForm";

export const GoalManagementWidget = () => {
  const { showToast } = useToast();
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | undefined>();

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<number | null>(null);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const data = await getGoals();
      setGoals(data || []);
    } catch (e) {
      console.error("Failed to load goals", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateOrUpdate = async (data: UserGoalRequest) => {
    try {
      if (selectedGoal) {
        await updateGoal(selectedGoal.id, data);
        showToast("목표가 수정되었습니다.", "success");
      } else {
        await createGoal(data);
        showToast("새로운 목표가 등록되었습니다.", "success");
      }
      setIsFormOpen(false);
      setSelectedGoal(undefined);
      fetchGoals();
    } catch (e) {
      console.error("Save error", e);
      showToast("목표 저장에 실패했습니다.", "error");
    }
  };

  const handleDelete = async () => {
    if (!goalToDelete) return;
    try {
      await deleteGoal(goalToDelete);
      showToast("목표가 삭제되었습니다.", "success");
      setIsDeleteModalOpen(false);
      setGoalToDelete(null);
      setIsFormOpen(false);
      setSelectedGoal(undefined);
      fetchGoals();
    } catch (e) {
      console.error("Delete err", e);
      showToast("삭제에 실패했습니다.", "error");
    }
  };

  const openEdit = (goal: UserGoal) => {
    setSelectedGoal(goal);
    setIsFormOpen(true);
  };

  const openDelete = (id: number) => {
    setGoalToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 헬퍼: D-day 계산
  const calculateDday = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 자정으로 설정
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-Day";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  // 헬퍼: 라벨 포맷
  const getGoalInfo = (goal: UserGoal) => {
    switch (goal.goalType) {
      case "WEIGHT_LOSS":
        return {
          label: "체중 감량",
          color: "text-blue-500",
          bg: "bg-blue-50",
          primaryLabel: "목표 체중",
          primary: `${goal.primaryValue?.toLocaleString()}kg`,
          secondaryLabel: "목표 체지방률",
          secondary: goal.secondaryValue ? `${goal.secondaryValue}%` : null,
          isMemoOnly: false,
        };
      case "BULK_UP":
        return {
          label: "벌크업",
          color: "text-red-500",
          bg: "bg-red-50",
          primaryLabel: "목표 체중",
          primary: `${goal.primaryValue?.toLocaleString()}kg`,
          secondaryLabel: "목표 골격근량",
          secondary: goal.secondaryValue ? `${goal.secondaryValue}kg` : null,
          isMemoOnly: false,
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
          isMemoOnly: false,
        };
      case "FITNESS_IMPROVEMENT":
        return {
          label: "체력 증진",
          color: "text-indigo-500",
          bg: "bg-indigo-50",
          primaryLabel: "",
          secondaryLabel: "",
          isMemoOnly: true,
        };
      case "REHABILITATION":
        return {
          label: "재활",
          color: "text-amber-500",
          bg: "bg-amber-50",
          primaryLabel: "",
          secondaryLabel: "",
          isMemoOnly: true,
        };
      default:
        return {
          label: "목표",
          color: "text-slate-500",
          bg: "bg-slate-50",
          primaryLabel: "주 수치",
          primary: goal.primaryValue?.toString(),
          secondaryLabel: "부 수치",
          secondary: goal.secondaryValue?.toString(),
          isMemoOnly: false,
        };
    }
  };

  // List State
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedGoals = isExpanded ? goals : goals.slice(0, 2);

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            나의 목표 달성
          </h3>
          <p className="text-[12px] text-gray-500 mt-1">
            원하는 목표를 등록하고 매일 관리해보세요!
          </p>
        </div>
        <button
          onClick={() => {
            if (goals.length >= 5) {
              showToast("목표는 최대 5개까지 생성 가능합니다.", "info");
              return;
            }
            setSelectedGoal(undefined);
            setIsFormOpen(true);
          }}
          className="text-xs bg-[#F2F4F6] text-slate-600 font-bold px-3 py-1.5 rounded-full hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-1"
        >
          <Plus size={14} /> <span>추가</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          로딩 중...
        </div>
      ) : goals.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          아직 등록된 목표가 없어요.
          <br />
          버튼을 눌러 첫 목표를 세워보세요!
        </div>
      ) : (
        <div className="flex flex-col gap-3 z-10 mt-2">
          {displayedGoals.map((goal) => {
            const {
              label,
              color,
              bg,
              primary,
              secondary,
              isMemoOnly,
              primaryLabel,
              secondaryLabel,
            } = getGoalInfo(goal);
            const ddayLabel = calculateDday(goal.endDate);
            const isFinished = ddayLabel.startsWith("D+");

            return (
              <div
                key={goal.id}
                onClick={() => openEdit(goal)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-sm active:scale-[0.98] ${
                  isFinished
                    ? "bg-slate-50 border-slate-100 opacity-70"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={`px-2.5 py-1 rounded-md text-[11px] font-black ${bg} ${color}`}
                  >
                    {label}
                  </div>
                  <div
                    className={`text-[12px] font-black px-2 py-0.5 rounded-full ${isFinished ? "bg-slate-200 text-slate-500" : "bg-red-50 text-red-500"}`}
                  >
                    {ddayLabel}
                  </div>
                </div>

                <h4
                  className={`text-[17px] font-black tracking-tight ${isFinished ? "text-slate-500" : "text-slate-800"}`}
                >
                  {goal.targetText}
                </h4>

                <div className="mt-4 flex items-end justify-between">
                  {!isMemoOnly ? (
                    <div className="flex gap-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-400">
                          {primaryLabel}
                        </span>
                        <span
                          className={`text-[18px] font-black ${isFinished ? "text-slate-500" : "text-[#191F28]"}`}
                        >
                          {primary}
                        </span>
                      </div>
                      {secondary && (
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-400">
                            {secondaryLabel}
                          </span>
                          <span
                            className={`text-[18px] font-black ${isFinished ? "text-slate-500" : "text-[#191F28]"}`}
                          >
                            {secondary}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="text-[11px] font-bold text-slate-300">
                    {goal.startDate} ~ {goal.endDate}
                  </div>
                </div>
              </div>
            );
          })}

          {goals.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full pt-3 flex items-center justify-center gap-1.5 text-[13px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all mt-1"
            >
              {isExpanded ? (
                <>
                  접기 <ChevronUp size={16} />
                </>
              ) : (
                <>
                  {goals.length - 2}개 더 보기 <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Goal Form BottomSheet */}
      <BottomSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedGoal ? "목표 수정하기" : "새로운 목표 설정"}
      >
        <div className="py-2">
          {selectedGoal && (
            <div className="flex justify-end mb-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDelete(selectedGoal.id);
                }}
                className="text-[13px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
              >
                삭제하기
              </button>
            </div>
          )}
          <GoalForm
            initialData={selectedGoal}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      </BottomSheet>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="목표 삭제"
        description="이 목표를 정말 삭제하시겠어요?"
        confirmText="삭제하기"
        isDanger={true}
      />
    </section>
  );
};
