"use client";

import React from "react";
import Image from "next/image";
import { DietResponse, MealType } from "@/entities/diet";
import { MoreVertical, Utensils, Coffee, Moon, Sun } from "lucide-react";

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
  const mealTypes: Record<
    MealType,
    { label: string; icon: React.ReactNode; color: string; bg: string }
  > = {
    BREAKFAST: {
      label: "아침",
      icon: <Sun size={16} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    LUNCH: {
      label: "점심",
      icon: <Utensils size={16} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    DINNER: {
      label: "저녁",
      icon: <Moon size={16} />,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    SNACK: {
      label: "간식",
      icon: <Coffee size={16} />,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
  };

  // 식단 시간을 기준으로 정렬 (최신순 또는 시간순 선택 가능)
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

  return (
    <div className="relative space-y-5">
      {/* Vertical Line */}
      <div className="absolute left-[22px] top-8 bottom-8 w-[3px] bg-[#F2F4F6] -z-0 rounded-full"></div>

      {sortedDiets.map((diet) => {
        const mealInfo = mealTypes[diet.mealType] || mealTypes.SNACK;
        // mealDate를 기반으로 시간 표시
        const time = new Date(diet.mealDate).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // 표시할 음식 이름
        const displayFoodName =
          diet.items.length > 1
            ? `${diet.items[0].foodName} 외 ${diet.items.length - 1}개`
            : diet.items[0]?.foodName || "식단 정보 없음";

        return (
          <div
            key={diet.id}
            className="relative flex gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100/50 hover:shadow-md transition-all group"
          >
            {/* Meal Type Icon on Life Line */}
            <div
              className={`relative z-10 shrink-0 w-12 h-12 rounded-[20px] ${mealInfo.bg} ${mealInfo.color} flex items-center justify-center shadow-sm`}
            >
              {mealInfo.icon}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[13px] font-black tracking-tight ${mealInfo.color}`}
                    >
                      {mealInfo.label}
                    </span>
                    <span className="text-[12px] text-[#D1D6DB]">•</span>
                    <span className="text-[13px] text-[#8B95A1] font-bold tracking-tight">
                      {time}
                    </span>
                  </div>
                  <h4 className="text-[18px] font-black text-[#191F28] tracking-tight mb-1">
                    {displayFoodName}
                  </h4>

                  {/* Detailed items list if multiple */}
                  {diet.items.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {diet.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-[#F2F4F6] text-[#4E5968] font-bold px-2.5 py-1 rounded-full"
                        >
                          {item.foodName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="p-1.5 text-[#8B95A1] hover:text-[#191F28] bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-95 transition-all rounded-full"
                  onClick={() => onEdit(diet)}
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {diet.imagePath && (
                <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-slate-100">
                  <Image
                    src={diet.imagePath}
                    alt={displayFoodName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {diet.memo && (
                <p className="text-[14px] text-[#4E5968] font-bold bg-[#F2F4F6] p-4 rounded-[20px] leading-relaxed">
                  {diet.memo}
                </p>
              )}

              {/* Nutrition Summary for individual meal - YAZIO style micro stats */}
              <div className="flex items-center gap-5 pt-2">
                <div className="flex items-baseline gap-1 bg-slate-50 px-3 py-1.5 rounded-full">
                  <span className="text-[12px] text-[#8B95A1] font-black uppercase tracking-tight">
                    KCAL
                  </span>
                  <span className="text-[15px] font-black text-[#191F28] leading-none">
                    {diet.totalCalories}
                  </span>
                </div>
                <div className="flex gap-4">
                  {[
                    { label: "탄수화물", value: diet.totalCarbohydrate },
                    { label: "단백질", value: diet.totalProtein },
                    { label: "지방", value: diet.totalFat },
                  ].map((nut, i) => (
                    <div key={i} className="flex items-baseline gap-1">
                      <span className="text-[11px] text-[#8B95A1] font-bold uppercase tracking-tight">
                        {nut.label}
                      </span>
                      <span className="text-[13px] font-black text-[#333D4B]">
                        {nut.value}
                        <span className="text-[10px] ml-0.5 text-[#8B95A1] font-bold">
                          g
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
