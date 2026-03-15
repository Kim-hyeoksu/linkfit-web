"use client";

import React, { useState, useEffect } from "react";
import { DietRequest, DietResponse, MealType } from "@/entities/diet";
import { Save, X, Utensils, Zap, ShieldCheck, Heart } from "lucide-react";
import { formatDateToLocalISO } from "@/shared/utils";

interface DietFormProps {
  initialData?: DietResponse;
  onSubmit: (data: DietRequest) => void;
  onCancel: () => void;
  selectedDate: Date;
}

export const DietForm = ({ initialData, onSubmit, onCancel, selectedDate }: DietFormProps) => {
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        mealType: initialData.mealType,
        mealDate: initialData.mealDate,
        items: initialData.items.length > 0 
          ? initialData.items.map(item => ({
              foodName: item.foodName,
              calories: item.calories,
              carbohydrate: item.carbohydrate,
              protein: item.protein,
              fat: item.fat,
            }))
          : [{ foodName: "", calories: 0, carbohydrate: 0, protein: 0, fat: 0 }],
        memo: initialData.memo || "",
        imagePath: initialData.imagePath || "",
      });
    }
  }, [initialData]);

  const mealOptions: { value: MealType; label: string }[] = [
    { value: "BREAKFAST", label: "아침" },
    { value: "LUNCH", label: "점심" },
    { value: "DINNER", label: "저녁" },
    { value: "SNACK", label: "간식" },
  ];

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: ["calories", "carbohydrate", "protein", "fat"].includes(field)
          ? Number(value)
          : value,
      };
      return { ...prev, items: newItems };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMealTypeChange = (type: MealType) => {
    setFormData((prev) => ({ ...prev, mealType: type }));
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Meal Type Selector */}
      <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
        {mealOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleMealTypeChange(opt.value)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              formData.mealType === opt.value
                ? "bg-white text-main shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Main Inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">식사 메뉴</label>
          <input
            name="foodName"
            value={formData.items[0].foodName}
            onChange={(e) => handleItemChange(0, "foodName", e.target.value)}
            placeholder="예: 닭가슴살 샐러드"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[17px] font-bold text-slate-800 focus:bg-white focus:border-main focus:ring-4 focus:ring-blue-50 transition-all outline-none"
          />
        </div>

        {/* Nutrition Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="inline-flex items-center gap-1.5 text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <Zap size={12} className="text-amber-500" /> 총 칼로리
                </label>
                <div className="relative">
                    <input
                        name="calories"
                        type="number"
                        value={formData.items[0].calories === 0 ? "" : formData.items[0].calories}
                        onChange={(e) => handleItemChange(0, "calories", e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[17px] font-extrabold text-slate-800 focus:bg-white focus:border-main transition-all outline-none"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kcal</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="inline-flex items-center gap-1.5 text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <ShieldCheck size={12} className="text-blue-500" /> 탄수화물
                </label>
                <div className="relative">
                    <input
                        name="carbohydrate"
                        type="number"
                        value={formData.items[0].carbohydrate === 0 ? "" : formData.items[0].carbohydrate}
                        onChange={(e) => handleItemChange(0, "carbohydrate", e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[17px] font-extrabold text-slate-800 focus:bg-white focus:border-main transition-all outline-none"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">g</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="inline-flex items-center gap-1.5 text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <Heart size={12} className="text-rose-500" /> 단백질
                </label>
                <div className="relative">
                    <input
                        name="protein"
                        type="number"
                        value={formData.items[0].protein === 0 ? "" : formData.items[0].protein}
                        onChange={(e) => handleItemChange(0, "protein", e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[17px] font-extrabold text-slate-800 focus:bg-white focus:border-main transition-all outline-none"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">g</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="inline-flex items-center gap-1.5 text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <Utensils size={12} className="text-amber-600" /> 지방
                </label>
                <div className="relative">
                    <input
                        name="fat"
                        type="number"
                        value={formData.items[0].fat === 0 ? "" : formData.items[0].fat}
                        onChange={(e) => handleItemChange(0, "fat", e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[17px] font-extrabold text-slate-800 focus:bg-white focus:border-main transition-all outline-none"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">g</span>
                </div>
            </div>
        </div>

        {/* Memo */}
        <div className="space-y-2">
          <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">메모</label>
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
          disabled={!formData.items[0].foodName}
          className="flex-[2] py-4 rounded-2xl bg-main text-white font-bold text-[16px] shadow-lg shadow-blue-200 hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {initialData ? "수정하기" : "기록 저장하기"}
        </button>
      </div>
    </div>
  );
};
