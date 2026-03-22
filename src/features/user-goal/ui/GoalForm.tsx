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
  {
    value: "FITNESS_IMPROVEMENT",
    label: "체력 증진",
    desc: "건강하고 활기찬 일상 만들기",
  },
  {
    value: "REHABILITATION",
    label: "재활",
    desc: "다친 곳 회복하고 기능 살리기",
  },
  { value: "STRENGTH", label: "근력 향상", desc: "더 강한 힘을 기르기" },
];

export const GoalForm = ({
  initialData,
  onSubmit,
  onCancel,
}: GoalFormProps) => {
  const [goalType, setGoalType] = useState<GoalType>("WEIGHT_LOSS");
  const [primaryValue, setPrimaryValue] = useState<string>("");
  const [secondaryValue, setSecondaryValue] = useState<string>("");
  const [targetText, setTargetText] = useState("");
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (initialData) {
      setGoalType(initialData.goalType);
      setPrimaryValue(initialData.primaryValue?.toString() || "");
      setSecondaryValue(initialData.secondaryValue?.toString() || "");
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

  const config = (() => {
    switch (goalType) {
      case "WEIGHT_LOSS":
        return {
          primaryLabel: "목표 체중 (kg)",
          secondaryLabel: "목표 체지방률 (%)",
          textLabel: "자유 메모",
          textPlaceholder: "예: 올해 여름 바디프로필 찍자!",
          showValues: true,
        };
      case "BULK_UP":
        return {
          primaryLabel: "목표 체중 (kg)",
          secondaryLabel: "목표 골격근량 (kg)",
          textLabel: "자유 메모",
          textPlaceholder: "예: 근육 5kg 증량 도전!",
          showValues: true,
        };
      case "STRENGTH":
        return {
          primaryLabel: "목표 중량 (kg)",
          secondaryLabel: "목표 횟수 (Reps)",
          textLabel: "운동 종목명",
          textPlaceholder: "예: 스쿼트, 데드리프트, 삼대운동",
          showValues: true,
        };
      case "FITNESS_IMPROVEMENT":
      case "REHABILITATION":
        return {
          primaryLabel: "",
          secondaryLabel: "",
          textLabel: "구체적인 목표 설명",
          textPlaceholder: "예: 매일 아침 30분 조깅하기 / 허리 통증 완화",
          showValues: false,
        };
      default:
        return {
          primaryLabel: "주 목표 수치",
          secondaryLabel: "부 목표 수치",
          textLabel: "나만의 다짐 문구",
          textPlaceholder: "목표를 입력해주세요",
          showValues: true,
        };
    }
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetText || !startDate || !endDate) {
      return alert("필수 항목을 입력해주세요.");
    }
    if (config.showValues && !primaryValue) {
      return alert(`${config.primaryLabel}를 입력해주세요.`);
    }

    onSubmit({
      goalType,
      primaryValue: config.showValues ? Number(primaryValue) : 0,
      secondaryValue: config.showValues ? Number(secondaryValue) || 0 : 0,
      targetText,
      startDate,
      endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-3">
        <label className="text-[15px] font-black text-slate-800">
          목표 유형
        </label>
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
              <span
                className={`text-[14px] font-black mb-1 ${goalType === type.value ? "text-main" : "text-slate-700"}`}
              >
                {type.label}
              </span>
              <span
                className={`text-[11px] ${goalType === type.value ? "text-blue-500" : "text-slate-400"}`}
              >
                {type.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {config.showValues && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-[15px] font-black text-slate-800">
              {config.primaryLabel}
            </label>
            <input
              type="number"
              value={primaryValue}
              onChange={(e) => setPrimaryValue(e.target.value)}
              placeholder="0"
              className="w-full bg-[#F2F4F6] text-slate-800 font-bold text-[16px] px-5 py-4 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-main/20"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[15px] font-black text-slate-800">
              {config.secondaryLabel}
            </label>
            <input
              type="number"
              value={secondaryValue}
              onChange={(e) => setSecondaryValue(e.target.value)}
              placeholder="0"
              className="w-full bg-[#F2F4F6] text-slate-800 font-bold text-[16px] px-5 py-4 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-main/20"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className="text-[15px] font-black text-slate-800">
          {config.textLabel}
        </label>
        <input
          type="text"
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          placeholder={config.textPlaceholder}
          className="w-full bg-[#F2F4F6] text-slate-800 font-bold text-[16px] px-5 py-4 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-main/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-[15px] font-black text-slate-800">
            시작일
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#F2F4F6] text-slate-800 font-bold text-[15px] px-4 py-4 rounded-[16px] focus:outline-none"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[15px] font-black text-slate-800">
            종료일
          </label>
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
