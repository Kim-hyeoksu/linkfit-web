import { OnboardingData } from "../../model/types";
import { StepLayout } from "./StepLayout";
import { Dumbbell, Target, Zap } from "lucide-react";

interface Props {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export const ExerciseLevelStep = ({ data, updateData, onNext }: Props) => {
  const isComplete = data.exercise_level !== "";

  const levels = [
    {
      id: "LOW",
      title: "초보자",
      desc: "운동을 이제 막 시작했어요",
      icon: <Target className="text-blue-500" size={28} />,
    },
    {
      id: "MIDDLE",
      title: "중급자",
      desc: "꾸준히 운동을 하고 있어요",
      icon: <Dumbbell className="text-indigo-500" size={28} />,
    },
    {
      id: "HIGH",
      title: "고급자",
      desc: "전문적으로 강도 높게 운동해요",
      icon: <Zap className="text-amber-500" size={28} />,
    },
  ] as const;

  return (
    <StepLayout>
      <div className="flex flex-col gap-6 mt-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            현재 운동 수준은
          </h2>
          <h2 className="text-2xl font-bold text-slate-800">
            어느 정도이신가요?
          </h2>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => updateData({ exercise_level: level.id })}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                data.exercise_level === level.id
                  ? "border-main bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  data.exercise_level === level.id ? "bg-white" : "bg-slate-100"
                }`}
              >
                {level.icon}
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-bold text-[17px] ${data.exercise_level === level.id ? "text-main" : "text-slate-800"}`}
                >
                  {level.title}
                </span>
                <span className="text-[13px] text-slate-500 font-medium">
                  {level.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`w-full py-4 rounded-xl font-bold text-[17px] transition-all ${
            isComplete
              ? "bg-main text-white active:scale-[0.98]"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          다음으로
        </button>
      </div>
    </StepLayout>
  );
};
