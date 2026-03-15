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

  return (
    <div className="flex flex-col gap-6">
      {/* Date Selector */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-slate-800">
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
          </h3>
          <button className="text-slate-400 text-sm font-medium hover:text-main">
            오늘
          </button>
        </div>

        <div className="flex justify-between items-center">
          {weekDays.map((date, idx) => {
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <button
                key={idx}
                onClick={() => onDateChange(date)}
                className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl transition-all ${
                  isSelected
                    ? "bg-main text-white shadow-lg shadow-blue-100 scale-105"
                    : "hover:bg-slate-50 text-slate-500"
                }`}
              >
                <span
                  className={`text-[11px] font-bold uppercase ${isSelected ? "text-blue-100" : "text-slate-400"}`}
                >
                  {dayNames[idx]}
                </span>
                <span className="text-[15px] font-black">{date.getDate()}</span>
                {isToday && !isSelected && (
                  <div className="w-1 h-1 rounded-full bg-main"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Consumption Summary Card - Toss Style Refactor */}
      <div className="relative overflow-hidden bg-white rounded-[28px] p-5 text-slate-900 shadow-sm border border-slate-100">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-slate-400 text-[12px] font-bold mb-1 tracking-tight">
                영양 성분 한눈에 보기
              </h4>
              <p className="text-lg font-black text-slate-800">
                오늘 얼마나 먹었을까요?
              </p>
            </div>
            <div className="bg-slate-50 px-2 py-2 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                목표{" "}
                <span className="text-main">
                  {targetCalories.toLocaleString()}
                </span>{" "}
                kcal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-10 mb-10">
            {/* Circular Progress - Clean & Premium */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#f8fafc"
                  strokeWidth="10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#3182f6"
                  strokeWidth="10"
                  strokeDasharray="364.4"
                  strokeDashoffset={364.4 - (364.4 * calPercentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">
                  {calPercentage}%
                </span>
                <span className="text-[11px] text-slate-400 font-bold">
                  달성중
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-[34px] font-black text-slate-900">
                  {totalCalories.toLocaleString()}
                </span>
                <span className="text-slate-400 text-sm font-bold">kcal</span>
              </div>
              <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
                오늘 목표의{" "}
                <span className="text-main font-bold">{calPercentage}%</span>를
                <br />
                채워가고 있어요.
              </p>
            </div>
          </div>

          {/* Nutrients Progress Bars - Minimal & Clean */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-50">
            {[
              {
                label: "탄수화물",
                current: totalCarbohydrate,
                target: targetCarbohydrate,
                color: "bg-blue-500",
              },
              {
                label: "단백질",
                current: totalProtein,
                target: targetProtein,
                color: "bg-green-500",
              },
              {
                label: "지방",
                current: totalFat,
                target: targetFat,
                color: "bg-orange-500",
              },
            ].map((nut, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    {nut.label}
                  </span>
                  <span className="text-sm font-black text-slate-800">
                    {nut.current}
                    <span className="text-[10px] ml-0.5 text-slate-400">g</span>
                  </span>
                </div>
                <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                  <div
                    className={`h-full ${nut.color} rounded-full transition-all duration-700`}
                    style={{
                      width: `${Math.min((nut.current / nut.target) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
