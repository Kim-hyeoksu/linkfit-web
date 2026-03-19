import React, { useState, useEffect } from "react";
import { UserGoal, UserGoalRequest, GoalType } from "@/entities/user-goal";

interface GoalFormProps {
  initialData?: UserGoal;
  onSubmit: (data: UserGoalRequest) => void;
  onCancel: () => void;
}

const GOAL_TYPES: { value: GoalType; label: string; desc: string }[] = [
  { value: "WEIGHT_LOSS", label: "체중 감량", desc: "원하는 체중 도달하기" },
  { value: "BULK_UP", label: "벌크업", desc: "근육은 늘리고 덩치 키우기" },
  { value: "FITNESS_IMPROVEMENT", label: "체력 증진", desc: "건강하고 활기찬 일상 만들기" },
  { value: "REHABILITATION", label: "재활", desc: "다친 곳 회복하고 기능 살리기" },
  { value: "STRENGTH", label: "근력 향상", desc: "더 강한 힘을 기르기" },
];

export const GoalForm = ({ initialData, onSubmit, onCancel }: GoalFormProps) => {
  const [goalType, setGoalType] = useState<GoalType>("WEIGHT_LOSS");
  const [targetValue, setTargetValue] = useState<string>("");
  const [targetText, setTargetText] = useState("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (initialData) {
      setGoalType(initialData.goalType);
      setTargetValue(initialData.targetValue.toString());
      setTargetText(initialData.targetText);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
    } else {
      // 1달 후를 기본 종료일로 설정
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setEndDate(nextMonth.toISOString().split("T")[0]);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetValue || !targetText || !startDate || !endDate) {
      return alert("모든 항목을 입력해주세요.");
    }
    onSubmit({
      goalType,
      targetValue: Number(targetValue),
      targetText,
      startDate,
      endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-3">
        <label className="text-[15px] font-black text-slate-800">목표 유형</label>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setGoalType(type.value as GoalType)}
              className={`flex flex-col items-start p-4 rounded-[16px] text-left transition-all border ${
                goalType === type.value
                  ? "bg-blue-50 border-main text-main shadow-sm"
                  : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className={`text-[14px] font-black mb-1 ${goalType === type.value ? "text-main" : "text-slate-700"}`}>
                {type.label}
              </span>
              <span className={`text-[11px] ${goalType === type.value ? "text-blue-500" : "text-slate-400"}`}>
                {type.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[15px] font-black text-slate-800">목표 수치 (숫자)</label>
        <div className="relative">
          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="예: 65"
            className="w-full bg-[#F2F4F6] text-slate-800 font-bold text-[16px] px-5 py-4 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-main/20"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[15px] font-black text-slate-800">나만의 다짐 문구</label>
        <input
          type="text"
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          placeholder="예: 올해 여름 바디프로필 찍자!"
          className="w-full bg-[#F2F4F6] text-slate-800 font-bold text-[16px] px-5 py-4 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-main/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-[15px] font-black text-slate-800">시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#F2F4F6] text-slate-800 font-bold text-[15px] px-4 py-4 rounded-[16px] focus:outline-none"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[15px] font-black text-slate-800">종료일</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-[#F2F4F6] text-slate-800 font-bold text-[15px] px-4 py-4 rounded-[16px] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 bg-[#F2F4F6] text-[#4E5968] font-bold rounded-[20px] active:scale-95 transition-all"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-[2] py-4 bg-main text-white font-bold rounded-[20px] active:scale-95 transition-all shadow-sm"
        >
          {initialData ? "수정하기" : "목표 등록"}
        </button>
      </div>
    </form>
  );
};
