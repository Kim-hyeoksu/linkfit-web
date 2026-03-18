"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DietResponse, MealType } from "@/entities/diet";
import { Utensils, Coffee, Moon, Sun, Edit2, Trash2 } from "lucide-react";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";

interface DietTimelineProps {
  diets: DietResponse[];
  onEdit: (diet: DietResponse) => void;
  onDelete: (dietId: number) => void;
}

export const DietTimeline = ({
  diets,
  onEdit,
  onDelete,
}: DietTimelineProps) => {
  const [selectedDiet, setSelectedDiet] = useState<DietResponse | null>(null);
  const [dietToDelete, setDietToDelete] = useState<DietResponse | null>(null);

  const mealTypes: Record<
    MealType,
    { label: string; icon: React.ReactNode; color: string; bg: string }
  > = {
    BREAKFAST: {
      label: "아침",
      icon: <Sun size={20} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    LUNCH: {
      label: "점심",
      icon: <Utensils size={20} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    DINNER: {
      label: "저녁",
      icon: <Moon size={20} />,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    SNACK: {
      label: "간식",
      icon: <Coffee size={20} />,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
  };

  const sortedDiets = [...diets].sort(
    (a, b) => new Date(a.mealDate).getTime() - new Date(b.mealDate).getTime(),
  );

  if (diets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Utensils size={32} className="text-slate-300" />
        </div>
        <p className="text-slate-400 font-bold">기록된 식단이 없어요.</p>
        <p className="text-slate-300 text-xs mt-1">
          새로운 식단을 추가해 보세요!
        </p>
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    if (dietToDelete) {
      onDelete(dietToDelete.id);
      setDietToDelete(null);
      setSelectedDiet(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {sortedDiets.map((diet) => {
          const mealInfo = mealTypes[diet.mealType] || mealTypes.SNACK;
          const time = new Date(diet.mealDate).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          const displayFoodName =
            diet.items.length > 1
              ? `${diet.items[0].foodName} 외 ${diet.items.length - 1}개`
              : diet.items[0]?.foodName || "식단 정보 없음";

          return (
            <div
              key={diet.id}
              onClick={() => setSelectedDiet(diet)}
              className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F2F4F6] cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all"
            >
              {/* Card Header (Summary) */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`shrink-0 w-12 h-12 rounded-[18px] ${mealInfo.bg} ${mealInfo.color} flex items-center justify-center`}
                  >
                    {mealInfo.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[12px] font-bold ${mealInfo.color}`}
                      >
                        {mealInfo.label}
                      </span>
                      <span className="text-[12px] text-[#A0AAB5] font-semibold">
                        {time}
                      </span>
                    </div>
                    <h4 className="text-[16px] font-black text-[#191F28] leading-tight flex items-center gap-1.5">
                      <span className="truncate max-w-[140px] xs:max-w-[180px]">
                        {displayFoodName}
                      </span>
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-0.5 justify-end">
                    <span className="text-[20px] font-black text-[#191F28] tracking-tight">
                      {diet.totalCalories}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#8B95A1] uppercase mt-0.5">
                    kcal
                  </div>
                </div>
              </div>

              {/* Card Macros (Mini version) */}
              <div className="flex gap-2">
                {[
                  {
                    label: "탄수화물",
                    value: diet.totalCarbohydrate,
                    color: "text-[#3182F6]",
                    bg: "bg-blue-50/50",
                  },
                  {
                    label: "단백질",
                    value: diet.totalProtein,
                    color: "text-[#F04438]",
                    bg: "bg-red-50/50",
                  },
                  {
                    label: "지방",
                    value: diet.totalFat,
                    color: "text-[#F79009]",
                    bg: "bg-orange-50/50",
                  },
                ].map((nut, i) => (
                  <div
                    key={i}
                    className={`flex-1 flex justify-between items-center px-3 py-2 rounded-[12px] border border-[#F2F4F6] ${nut.bg}`}
                  >
                    <span className="text-[12px] text-[#8B95A1] font-semibold">
                      {nut.label}
                    </span>
                    <span
                      className={`text-[13px] font-black tracking-tight ${nut.color}`}
                    >
                      {nut.value}
                      <span className="text-[10px] font-normal ml-0.5 text-[#8B95A1]">
                        g
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet for Detail */}
      <BottomSheet
        isOpen={!!selectedDiet}
        onClose={() => setSelectedDiet(null)}
        title={
          selectedDiet
            ? `${mealTypes[selectedDiet.mealType]?.label || "식단"} 상세`
            : "식단 상세"
        }
      >
        {selectedDiet && (
          <div className="space-y-6 pb-6 pt-2">
            {/* Expanded items */}
            <div className="space-y-3">
              <h3 className="text-[16px] font-black text-[#191F28]">
                기록한 음식
              </h3>
              <div className="bg-[#F2F4F6] rounded-[20px] p-4 flex flex-col gap-3">
                {selectedDiet.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 p-3.5 bg-white rounded-[16px] shadow-sm border border-slate-100"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3182F6]" />
                        <span className="text-[15px] font-black text-[#191F28]">
                          {item.foodName}
                        </span>
                      </div>
                      {item.calories !== undefined && (
                        <span className="text-[14px] font-black text-[#191F28]">
                          {item.calories}{" "}
                          <span className="text-[11px] text-[#8B95A1] font-bold">
                            kcal
                          </span>
                        </span>
                      )}
                    </div>
                    {/* Item Macros */}
                    <div className="flex gap-3 pl-3.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-[#8B95A1] font-semibold">
                          탄
                        </span>
                        <span className="text-[12px] font-bold text-[#3182F6]">
                          {item.carbohydrate}g
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-[#8B95A1] font-semibold">
                          단
                        </span>
                        <span className="text-[12px] font-bold text-[#F04438]">
                          {item.protein}g
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-[#8B95A1] font-semibold">
                          지
                        </span>
                        <span className="text-[12px] font-bold text-[#F79009]">
                          {item.fat}g
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Big Grid */}
            <div className="space-y-3">
              <h3 className="text-[16px] font-black text-[#191F28]">
                영양 성분
              </h3>
              <div className="bg-[#F2F4F6] px-5 py-4 rounded-t-[20px] rounded-b-[12px] flex items-center justify-between">
                <span className="text-[14px] text-[#8B95A1] font-bold">
                  총 섭취 칼로리
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[24px] font-black text-[#191F28] leading-none">
                    {selectedDiet.totalCalories}
                  </span>
                  <span className="text-[13px] font-bold text-[#8B95A1]">
                    kcal
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "탄수화물",
                    value: selectedDiet.totalCarbohydrate,
                    color: "text-[#3182F6]",
                    bg: "bg-blue-50/50",
                  },
                  {
                    label: "단백질",
                    value: selectedDiet.totalProtein,
                    color: "text-[#F04438]",
                    bg: "bg-red-50/50",
                  },
                  {
                    label: "지방",
                    value: selectedDiet.totalFat,
                    color: "text-[#F79009]",
                    bg: "bg-orange-50/50",
                  },
                ].map((nut, i) => (
                  <div
                    key={i}
                    className={`border border-[#F2F4F6] p-3 rounded-t-[12px] rounded-b-[20px] flex flex-col items-center justify-center gap-1.5 ${nut.bg}`}
                  >
                    <span className="text-[12px] text-[#8B95A1] font-semibold">
                      {nut.label}
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span
                        className={`text-[16px] font-black tracking-tight ${nut.color}`}
                      >
                        {nut.value}
                      </span>
                      <span className="text-[11px] text-[#8B95A1] font-bold">
                        g
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            {selectedDiet.imagePath && (
              <div className="space-y-3">
                <h3 className="text-[16px] font-black text-[#191F28]">사진</h3>
                <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-slate-100">
                  <Image
                    src={selectedDiet.imagePath}
                    alt="식단 사진"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Memo */}
            {selectedDiet.memo && (
              <div className="space-y-3">
                <h3 className="text-[16px] font-black text-[#191F28]">메모</h3>
                <div className="bg-[#F9FAFB] p-5 rounded-[24px] border border-[#F2F4F6]">
                  <p className="text-[15px] text-[#4E5968] font-medium leading-relaxed whitespace-pre-wrap">
                    {selectedDiet.memo}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                className="flex-[1] flex items-center justify-center gap-2 py-4 bg-[#F2F4F6] text-[#4E5968] font-bold rounded-[20px] hover:bg-[#E5E8EB] active:scale-95 transition-all"
                onClick={() => setDietToDelete(selectedDiet)}
              >
                <Trash2 size={18} />
                <span>삭제</span>
              </button>
              <button
                className="flex-[2] flex items-center justify-center gap-2 py-4 bg-[#3182F6] text-white font-bold rounded-[20px] hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
                onClick={() => {
                  setSelectedDiet(null);
                  onEdit(selectedDiet);
                }}
              >
                <Edit2 size={18} />
                <span>수정하기</span>
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      <ConfirmModal
        isOpen={!!dietToDelete}
        onClose={() => setDietToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="식단을 삭제하시겠어요?"
        description="식단 기록이 영구적으로 삭제돼요."
        confirmText="삭제하기"
        cancelText="취소"
        isDanger={true}
      />
    </>
  );
};
