"use client";

import React from "react";
import { DietSummary } from "@/entities/diet";

interface DietDashboardProps {
  summary: DietSummary;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DietDashboard = ({
  summary,
  selectedDate,
  onDateChange,
}: DietDashboardProps) => {
  // 주간 날짜 계산
  const getWeekDays = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(selectedDate);
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const {
    totalCalories = 0,
    totalCarbohydrate = 0,
    totalProtein = 0,
    totalFat = 0,
    targetCalories = 2500,
    targetCarbohydrate = 300,
    targetProtein = 150,
    targetFat = 70,
  } = summary;

  const calPercentage = Math.min(
    Math.round((totalCalories / targetCalories) * 100),
    100,
  );

  const remainingCalories = Math.max(targetCalories - totalCalories, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Date Selector */}
      <div className="bg-white rounded-[32px] px-5 py-3.5 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[18px] font-black text-[#191F28] tracking-tight">
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
          </h3>
          <button
            onClick={() => onDateChange(new Date())}
            className="bg-[#F2F4F6] text-[#4E5968] px-3 py-1.5 rounded-xl text-[12px] font-bold hover:bg-[#E5E8EB] active:scale-95 transition-all"
          >
            오늘
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((date, idx) => {
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <button
                key={idx}
                onClick={() => onDateChange(date)}
                className={`flex flex-col items-center gap-1 py-2 rounded-[18px] transition-all w-full ${
                  isSelected
                    ? "bg-main text-white shadow-lg shadow-blue-200/40 scale-[1.02]"
                    : "hover:bg-[#F2F4F6] text-[#8B95A1] active:scale-95"
                }`}
              >
                <span
                  className={`text-[11px] font-bold uppercase ${isSelected ? "text-blue-100" : "text-[#8B95A1]"}`}
                >
                  {dayNames[idx]}
                </span>
                <span
                  className={`text-[16px] ${isSelected ? "font-black" : "font-extrabold text-[#333D4B]"}`}
                >
                  {date.getDate()}
                </span>
                <div className="h-1 flex items-center justify-center">
                  {isToday && (
                    <div
                      className={`w-1 h-1 rounded-full transition-colors ${
                        isSelected ? "bg-white" : "bg-[#3182F6]"
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* YAZIO / Toss Style Consumption Summary Card */}
      <div className="bg-white rounded-[32px] p-7 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-[14px] font-bold text-[#8B95A1] mb-1">
              오늘의 칼로리
            </h4>
            <div className="text-[22px] font-black text-[#191F28] tracking-tight flex items-baseline gap-1">
              {remainingCalories.toLocaleString()}
              <span className="text-[15px] font-bold text-[#8B95A1]">
                kcal 남음
              </span>
            </div>
          </div>
          <div className="bg-[#F2F4F6] px-3.5 py-2 rounded-xl flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-[#8B95A1] leading-none">
              목표
            </span>
            <span className="text-[14px] font-black text-[#3182F6] leading-none">
              {targetCalories?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center mb-8">
          {/* Circular Progress Container - Full Toss/Yazio prominent circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="86"
                fill="none"
                stroke="#F2F4F6"
                strokeWidth="14"
              />
              <circle
                cx="96"
                cy="96"
                r="86"
                fill="none"
                stroke={calPercentage > 100 ? "#F04452" : "#3182F6"}
                strokeWidth="14"
                strokeDasharray="540.3"
                strokeDashoffset={
                  540.3 - (540.3 * Math.min(calPercentage, 100)) / 100
                }
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
              <span className="text-[14px] text-[#8B95A1] font-bold mb-0.5">
                섭취했어요
              </span>
              <span className="text-[36px] font-black text-[#191F28] leading-none tracking-tight">
                {totalCalories.toLocaleString()}
              </span>
            </div>
            {/* Small icon or flare inside circle could go here */}
          </div>
        </div>

        {/* Nutrients Progress Bars (YAZIO style prominent chunkier bars) */}
        <div className="flex flex-col gap-6 pt-6 border-t border-[#F2F4F6]">
          {[
            {
              label: "탄수화물",
              current: totalCarbohydrate,
              target: targetCarbohydrate,
              color: "bg-[#3182F6]", // Toss Blue
              bg: "bg-blue-50",
            },
            {
              label: "단백질",
              current: totalProtein,
              target: targetProtein,
              color: "bg-[#04C09E]", // Toss Toss Green
              bg: "bg-green-50",
            },
            {
              label: "지방",
              current: totalFat,
              target: targetFat,
              color: "bg-[#FFB020]", // Toss Yellow/Orange
              bg: "bg-orange-50",
            },
          ].map((nut, i) => {
            const percentage =
              Math.min((nut.current / nut.target) * 100, 100) || 0;
            return (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="flex justify-between items-end px-1">
                  <span className="text-[13px] font-extrabold text-[#4E5968]">
                    {nut.label}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[15px] font-black text-[#191F28]">
                      {nut.current}
                    </span>
                    <span className="text-[12px] font-bold text-[#8B95A1]">
                      / {nut.target}g
                    </span>
                  </div>
                </div>
                <div className={`h-3.5 ${nut.bg} rounded-full overflow-hidden`}>
                  <div
                    className={`h-full ${nut.color} rounded-full transition-all duration-700`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
