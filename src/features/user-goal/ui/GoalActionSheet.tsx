"use client";

import React, { useState } from "react";
import {
  UserGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  UserGoalRequest,
} from "@/entities/user-goal";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { GoalForm } from "./GoalForm";
import { useToast } from "@/shared/ui";

interface GoalActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGoal?: UserGoal | null;
  onSuccess: () => void;
}

/**
 * 목표 등록, 수정, 삭제를 담당하는 공통 기능 컴포넌트 (Feature)
 */
export const GoalActionSheet = ({
  isOpen,
  onClose,
  selectedGoal,
  onSuccess,
}: GoalActionSheetProps) => {
  const { showToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSubmit = async (data: UserGoalRequest) => {
    try {
      if (selectedGoal) {
        await updateGoal(selectedGoal.id, data);
        showToast("목표가 수정되었습니다.", "success");
      } else {
        await createGoal(data);
        showToast("새로운 목표가 등록되었습니다.", "success");
      }
      onSuccess();
      onClose();
    } catch (e) {
      console.error("Failed to save goal", e);
      showToast("목표 저장에 실패했습니다.", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedGoal) return;
    try {
      await deleteGoal(selectedGoal.id);
      showToast("목표가 삭제되었습니다.", "success");
      setIsDeleteModalOpen(false);
      onSuccess();
      onClose();
    } catch (e) {
      console.error("Failed to delete goal", e);
      showToast("삭제에 실패했습니다.", "error");
    }
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={selectedGoal ? "목표 상세 정보" : "새로운 목표 설정"}
      >
        <div className="py-2">
          {selectedGoal && (
            <div className="flex justify-end mb-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                }}
                className="text-[13px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
              >
                삭제하기
              </button>
            </div>
          )}
          <GoalForm
            initialData={selectedGoal || undefined}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </BottomSheet>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="목표 삭제"
        description="이 목표를 정말 삭제하시겠어요?"
        confirmText="삭제하기"
        isDanger={true}
      />
    </>
  );
};
