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

export const DietTimeline = ({ diets, onEdit, onDelete }: DietTimelineProps) => {
  const mealTypes: Record<MealType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    BREAKFAST: { label: "아침", icon: <Sun size={16} />, color: "text-amber-500", bg: "bg-amber-50" },
    LUNCH: { label: "점심", icon: <Utensils size={16} />, color: "text-blue-500", bg: "bg-blue-50" },
    DINNER: { label: "저녁", icon: <Moon size={16} />, color: "text-purple-500", bg: "bg-purple-50" },
    SNACK: { label: "간식", icon: <Coffee size={16} />, color: "text-rose-500", bg: "bg-rose-50" },
  };

  // 식단 시간을 기준으로 정렬 (최신순 또는 시간순 선택 가능)
  const sortedDiets = [...diets].sort((a, b) => new Date(a.mealDate).getTime() - new Date(b.mealDate).getTime());

  if (diets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Utensils size={32} className="text-slate-300" />
        </div>
        <p className="text-slate-400 font-bold">기록된 식단이 없어요.</p>
        <p className="text-slate-300 text-xs mt-1">새로운 식단을 추가해 보세요!</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {/* Vertical Line */}
      <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-slate-100 -z-0"></div>

      {sortedDiets.map((diet) => {
        const mealInfo = mealTypes[diet.mealType] || mealTypes.SNACK;
        // mealDate를 기반으로 시간 표시 (현재 API상 별도 시간 필드가 없다면 기본값 처리)
        const time = new Date(diet.mealDate).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // 표시할 음식 이름 (아이템이 여러 개면 첫 번째 + 외 N개)
        const displayFoodName = diet.items.length > 1 
          ? `${diet.items[0].foodName} 외 ${diet.items.length - 1}개`
          : diet.items[0]?.foodName || "식단 정보 없음";

        return (
          <div key={diet.id} className="relative flex gap-4 bg-white p-5 rounded-[28px] shadow-sm border border-slate-50 hover:border-slate-100 transition-all group">
            {/* Meal Type Icon on Life Line - Softer visual */}
            <div className={`relative z-10 shrink-0 w-12 h-12 rounded-2xl ${mealInfo.bg} ${mealInfo.color} flex items-center justify-center border border-slate-50 shadow-sm`}>
              {mealInfo.icon}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[12px] font-bold ${mealInfo.color}`}>
                      {mealInfo.label}
                    </span>
                    <span className="text-[11px] text-slate-300">•</span>
                    <span className="text-[12px] text-slate-400 font-medium">{time}</span>
                  </div>
                  <h4 className="text-[17px] font-extrabold text-slate-800">{displayFoodName}</h4>
                  
                  {/* Detailed items list if multiple */}
                  {diet.items.length > 1 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {diet.items.map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-100">
                          {item.foodName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors"
                  onClick={() => onEdit(diet)}
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {diet.imagePath && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100">
                   <Image 
                    src={diet.imagePath} 
                    alt={displayFoodName} 
                    fill 
                    className="object-cover"
                   />
                </div>
              )}

              {diet.memo && (
                <p className="text-sm text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  {diet.memo}
                </p>
              )}

              {/* Nutrition Summary for individual meal */}
              <div className="flex gap-4 pt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Calories</span>
                  <span className="text-sm font-black text-slate-700">{diet.totalCalories}<span className="text-[10px] ml-0.5">kcal</span></span>
                </div>
                <div className="w-[1px] h-6 bg-slate-100 my-auto"></div>
                <div className="flex gap-4">
                   {[
                    { label: "Carb", value: diet.totalCarbohydrate },
                    { label: "Prot", value: diet.totalProtein },
                    { label: "Fat", value: diet.totalFat }
                   ].map((nut, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        {nut.label}
                      </span>
                      <span className="text-sm font-black text-slate-700">{nut.value}<span className="text-[10px] ml-0.5">g</span></span>
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
