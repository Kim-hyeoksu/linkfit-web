import { OnboardingData } from "../../model/types";
import { StepLayout } from "./StepLayout";
import { LottiePlayer } from "@/shared";

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
    },
    {
      id: "MIDDLE",
      title: "중급자",
      desc: "꾸준히 운동을 하고 있어요",
    },
    {
      id: "HIGH",
      title: "고급자",
      desc: "전문적으로 강도 높게 운동해요",
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

        <div className="flex justify-center -mx-5 -my-6">
          <LottiePlayer
            url="https://lottie.host/8c37905c-7fa8-47ea-b5c2-dba2c81ccf93/l0z2HaSBwO.json"
            className="w-full h-auto"
          />
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

      <div className="mt-auto pt-10">
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
