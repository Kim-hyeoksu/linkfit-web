import { OnboardingData } from "../../model/types";
import { StepLayout } from "./StepLayout";
import { AnimatedLottie } from "../AnimatedLottie";

interface Props {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export const ProfileStep = ({ data, updateData, onNext }: Props) => {
  const isComplete = data.name.trim().length > 0 && data.gender !== "";

  return (
    <StepLayout>
      <div className="flex flex-col gap-6 mt-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">이름과 성별을</h2>
          <h2 className="text-2xl font-bold text-slate-800">알려주세요</h2>
        </div>

        <div className="flex justify-center -mx-5 -my-4">
          <AnimatedLottie
            url="https://lottie.host/d860a8d7-3cc3-4f31-a6bc-a8193a2eceb0/OQJJYUs9Iy.json"
            className="w-full h-auto"
          />
        </div>

        <div className="flex flex-col gap-8 mt-4">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-600">
              이름(닉네임)
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[16px] text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all"
              placeholder="홍길동"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-600">성별</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateData({ gender: "MALE" })}
                className={`p-4 rounded-xl border text-[16px] font-bold transition-all ${
                  data.gender === "MALE"
                    ? "border-main bg-blue-50 text-main"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                남성
              </button>
              <button
                onClick={() => updateData({ gender: "FEMALE" })}
                className={`p-4 rounded-xl border text-[16px] font-bold transition-all ${
                  data.gender === "FEMALE"
                    ? "border-main bg-blue-50 text-main"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                여성
              </button>
            </div>
          </div>
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
