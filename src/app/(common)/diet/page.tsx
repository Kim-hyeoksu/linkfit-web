"use client";

import React, { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
import {
  DietResponse,
  DietSummary,
  DietRequest,
  getDiets,
  postDiet,
  updateDiet,
  deleteDiet,
} from "@/entities/diet";
import { DietDashboard } from "@/widgets/diet/ui/DietDashboard";
import { DietTimeline } from "@/widgets/diet/ui/DietTimeline";
import { DietForm } from "@/features/diet-management/ui/DietForm";
import { Header, BottomSheet, ConfirmModal, useToast } from "@/shared/ui";
import { formatDateToLocalISO } from "@/shared/utils";

export default function DietPage() {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diets, setDiets] = useState<DietResponse[]>([]);
  const [summary, setSummary] = useState<DietSummary>({
    totalCalories: 0,
    totalCarbohydrate: 0,
    totalProtein: 0,
    totalFat: 0,
    targetCalories: 2500, // 기본값 설정
    targetCarbohydrate: 300,
    targetProtein: 150,
    targetFat: 70,
  });
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiet, setEditingDiet] = useState<DietResponse | undefined>(
    undefined,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDietId, setDeletingDietId] = useState<number | null>(null);

  const fetchDiets = async () => {
    setIsLoading(true);
    const dateStr = formatDateToLocalISO(selectedDate);
    try {
      const data = await getDiets(dateStr, dateStr);
      setDiets(data.diets || []);
      setSummary((prev) => ({
        ...prev,
        totalCalories: data.totalCalories,
        totalCarbohydrate: data.totalCarbohydrate,
        totalProtein: data.totalProtein,
        totalFat: data.totalFat,
      }));
    } catch (error) {
      console.error("Failed to fetch diets:", error);
      showToast("식단 정보를 가져오는데 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiets();
  }, [selectedDate]);

  const handleCreateOrUpdate = async (data: DietRequest) => {
    try {
      if (editingDiet) {
        await updateDiet(editingDiet.id, data);
        showToast("식단이 수정되었습니다.", "success");
      } else {
        await postDiet(data);
        showToast("식단이 기록되었습니다.", "success");
      }
      setIsFormOpen(false);
      setEditingDiet(undefined);
      fetchDiets();
    } catch (error) {
      console.error("Failed to save diet:", error);
      showToast("저장에 실패했습니다.", "error");
    }
  };

  const handleDelete = async () => {
    if (deletingDietId === null) return;
    try {
      await deleteDiet(deletingDietId);
      showToast("식단이 삭제되었습니다.", "success");
      setIsDeleteModalOpen(false);
      fetchDiets();
    } catch (error) {
      console.error("Failed to delete diet:", error);
      showToast("삭제에 실패했습니다.", "error");
    } finally {
      setDeletingDietId(null);
    }
  };

  const openEditForm = (diet: DietResponse) => {
    setEditingDiet(diet);
    setIsFormOpen(true);
  };

  const openDeleteModal = (dietId: number) => {
    setDeletingDietId(dietId);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] pb-24">
      <Header
        title="식단 관리"
        showBackButton={false}
        rightButtonIconUrl={"/diet/calendar"}
      >
        <Calendar
          size={24}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        />
      </Header>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 max-w-2xl mx-auto w-full">
        {/* Dashboard Widget */}
        <DietDashboard
          summary={summary}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Timeline Widget */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <div>
              <h3 className="text-xl font-black text-slate-800">식단 기록</h3>
              <p className="text-slate-400 text-xs font-bold mt-0.5">
                매일매일 꼼꼼하게 기록해요
              </p>
            </div>
          </div>

          <DietTimeline
            diets={diets}
            onEdit={openEditForm}
            onDelete={openDeleteModal}
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-[88px] right-5 z-50">
        <button
          onClick={() => {
            setEditingDiet(undefined);
            setIsFormOpen(true);
          }}
          className="w-14 h-14 bg-main text-white rounded-full shadow-xl shadow-blue-200 flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
      </div>

      {/* Diet Form BottomSheet */}
      <BottomSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDiet(undefined);
        }}
        title={editingDiet ? "식단 수정하기" : "오늘 무엇을 드셨나요?"}
      >
        <DietForm
          initialData={editingDiet}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingDiet(undefined);
          }}
          selectedDate={selectedDate}
        />
      </BottomSheet>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="식단 기록 삭제"
        description="정말로 이 식단 기록을 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다."
        confirmText="삭제하기"
        isDanger={true}
      />
    </div>
  );
}
