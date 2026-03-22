"use client";

import React, { useState, useEffect } from "react";
import { DietRequest, DietResponse, MealType } from "@/entities/diet";
import {
  Save,
  X,
  Utensils,
  Zap,
  ShieldCheck,
  Heart,
  Trash2,
  PlusCircle,
  Sunrise,
  Sun,
  Moon,
  CakeSlice,
  Search,
} from "lucide-react";
import { formatDateToLocalISO } from "@/shared/utils";
import { FoodSearchModal } from "./FoodSearchModal";
import { Food } from "@/entities/food";

interface DietFormProps {
  initialData?: DietResponse;
  onSubmit: (data: DietRequest) => void;
  onCancel: () => void;
  selectedDate: Date;
}

export const DietForm = ({
  initialData,
  onSubmit,
  onCancel,
  selectedDate,
}: DietFormProps) => {
  const [formData, setFormData] = useState<DietRequest>({
    mealType: "BREAKFAST",
    mealDate: formatDateToLocalISO(selectedDate),
    items: [
      {
        foodName: "",
        calories: 0,
        carbohydrate: 0,
        protein: 0,
        fat: 0,
      },
    ],
    memo: "",
    imagePath: "",
  });

  const [searchIndex, setSearchIndex] = useState<number | null>(null);
  useEffect(() => {
    if (initialData) {
      setFormData({
        mealType: initialData.mealType,
        mealDate: initialData.mealDate,
        items:
          initialData.items.length > 0
            ? initialData.items.map((item) => ({
                foodName: item.foodName,
                calories: item.calories,
                carbohydrate: item.carbohydrate,
                protein: item.protein,
                fat: item.fat,
              }))
            : [
                {
                  foodName: "",
                  calories: 0,
                  carbohydrate: 0,
                  protein: 0,
                  fat: 0,
                },
              ],
        memo: initialData.memo || "",
        imagePath: initialData.imagePath || "",
      });
    } else {
      // 신규 작성 모드일 때 초기화 로직 강화
      setFormData({
        mealType: "BREAKFAST",
        mealDate: formatDateToLocalISO(selectedDate),
        items: [
          {
            foodName: "",
            calories: 0,
            carbohydrate: 0,
            protein: 0,
            fat: 0,
          },
        ],
        memo: "",
        imagePath: "",
      });
    }
  }, [initialData, selectedDate]);

  const mealOptions: {
    value: MealType;
    label: string;
    icon: React.ReactNode;
    activeColor: string;
    bgColor: string;
  }[] = [
    {
      value: "BREAKFAST",
      label: "아침",
      icon: <Sunrise size={14} />,
      activeColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      value: "LUNCH",
      label: "점심",
      icon: <Sun size={14} />,
      activeColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      value: "DINNER",
      label: "저녁",
      icon: <Moon size={14} />,
      activeColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      value: "SNACK",
      label: "간식",
      icon: <CakeSlice size={14} />,
      activeColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      const updatedItem = {
        ...newItems[index],
        [field]: ["calories", "carbohydrate", "protein", "fat"].includes(field)
          ? Number(value)
          : value,
      };

      // 탄수화물, 단백질, 지방 변경 시 칼로리 자동 계산
      if (["carbohydrate", "protein", "fat"].includes(field)) {
        updatedItem.calories =
          updatedItem.carbohydrate * 4 +
          updatedItem.protein * 4 +
          updatedItem.fat * 9;
      }

      newItems[index] = updatedItem;
      return { ...prev, items: newItems };
    });
  };

  const handleFoodSelect = (food: Food) => {
    if (searchIndex === null) return;
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[searchIndex] = {
        ...newItems[searchIndex],
        foodName: food.foodName,
        calories: food.calories,
        carbohydrate: food.carbohydrate,
        protein: food.protein,
        fat: food.fat,
      };
      return { ...prev, items: newItems };
    });
    setSearchIndex(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMealTypeChange = (type: MealType) => {
    setFormData((prev) => ({ ...prev, mealType: type }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { foodName: "", calories: 0, carbohydrate: 0, protein: 0, fat: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Meal Type Selector */}
      <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
        {mealOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleMealTypeChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold transition-all ${
              formData.mealType === opt.value
                ? `bg-white shadow-sm ${opt.activeColor}`
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span
              className={formData.mealType === opt.value ? opt.activeColor : ""}
            >
              {opt.icon}
            </span>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Food Items List */}
      <div className="space-y-6">
        {formData.items.map((item, index) => (
          <div
            key={index}
            className="space-y-4 p-5 bg-white rounded-[28px] border border-slate-100 relative group transition-all hover:border-blue-100/50 hover:shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                  식사 메뉴 {index + 1}
                </label>
                {formData.items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    title="항목 삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div
                onClick={() => setSearchIndex(index)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[16px] font-bold text-slate-800 cursor-pointer flex items-center justify-between hover:bg-white hover:border-main transition-all group/input"
              >
                <span
                  className={
                    item.foodName
                      ? "text-slate-800"
                      : "text-slate-400 font-medium"
                  }
                >
                  {item.foodName || "어떤 음식을 드셨나요?"}
                </span>
                <Search
                  size={18}
                  className="text-slate-400 group-hover/input:text-main transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                  칼로리
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={item.calories === 0 ? "0" : item.calories}
                    readOnly
                    placeholder="0"
                    className="w-full bg-slate-100/50 border border-slate-100 rounded-2xl px-4 py-3 text-[15px] font-extrabold text-slate-800 cursor-not-allowed outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                    kcal
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                  탄수화물
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={item.carbohydrate === 0 ? "" : item.carbohydrate}
                    onChange={(e) =>
                      handleItemChange(index, "carbohydrate", e.target.value)
                    }
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[15px] font-extrabold text-slate-800 focus:bg-white focus:border-main transition-all outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                    g
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                  단백질
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={item.protein === 0 ? "" : item.protein}
                    onChange={(e) =>
                      handleItemChange(index, "protein", e.target.value)
                    }
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[15px] font-extrabold text-slate-800 focus:bg-white focus:border-main transition-all outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                    g
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                  지방
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={item.fat === 0 ? "" : item.fat}
                    onChange={(e) =>
                      handleItemChange(index, "fat", e.target.value)
                    }
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[15px] font-extrabold text-slate-800 focus:bg-white focus:border-main transition-all outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                    g
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 flex items-center justify-center gap-2 hover:border-main hover:text-main hover:bg-blue-50/30 transition-all font-bold text-sm"
        >
          <PlusCircle size={18} />
          음식 추가하기
        </button>

        {/* Memo */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">
            메모
          </label>
          <textarea
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            placeholder="오늘 식사에 대한 특별한 내용을 적어보세요."
            rows={3}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 focus:bg-white focus:border-main transition-all outline-none resize-none"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold text-[16px] hover:bg-slate-200 active:scale-[0.98] transition-all"
        >
          취소
        </button>
        <button
          onClick={() => onSubmit(formData)}
          disabled={formData.items.some((item) => !item.foodName)}
          className="flex-[2] py-4 rounded-2xl bg-main text-white font-bold text-[16px] shadow-lg shadow-blue-200 hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {initialData ? "수정하기" : "기록 저장하기"}
        </button>
      </div>

      <FoodSearchModal
        isOpen={searchIndex !== null}
        onClose={() => setSearchIndex(null)}
        onSelectFood={handleFoodSelect}
      />
    </div>
  );
};
