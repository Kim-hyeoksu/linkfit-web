"use client";

import { GoalForm } from "@/features/user-goal/ui/GoalForm";
import { StepLayout } from "./StepLayout";
import { UserGoalRequest, createGoal } from "@/entities/user-goal";
import { useToast } from "@/shared/ui/toast";

interface Props {
  onNext: () => void;
}

export const GoalStep = ({ onNext }: Props) => {
  const { showToast } = useToast();

  const handleSubmit = async (data: UserGoalRequest) => {
    try {
      await createGoal(data);
      showToast("목표가 설정되었습니다!", "success");
      onNext();
    } catch (e) {
      console.error("Goal save error", e);
      showToast("목표 저장에 실패했습니다. 다시 시도해 주세요.", "error");
    }
  };

  return (
    <StepLayout>
      <div className="flex flex-col gap-6 mt-6 pb-12">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
            마지막으로, <br />
            <span className="text-main">운동 목표</span>를 설정해볼까요?
          </h2>
          <p className="text-[14px] font-medium text-slate-400 mt-2">
            구체적인 목표는 동기부여에 큰 도움이 돼요.
          </p>
        </div>

        <div className="mt-4 bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
          <GoalForm onSubmit={handleSubmit} onCancel={onNext} />
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 text-slate-400 font-bold text-[15px] hover:text-slate-600 transition-colors mt-2"
        >
          나중에 설정할게요
        </button>
      </div>
    </StepLayout>
  );
};
