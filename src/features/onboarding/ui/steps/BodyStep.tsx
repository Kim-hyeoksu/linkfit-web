import { OnboardingData } from "../../model/types";
import { StepLayout } from "./StepLayout";

interface Props {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export const BodyStep = ({ data, updateData, onNext }: Props) => {
  const isComplete =
    data.birth_date !== "" &&
    data.height !== "" &&
    data.height > 0 &&
    data.weight !== "" &&
    data.weight > 0;

  return (
    <StepLayout>
      <div className="flex flex-col gap-6 mt-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            정확한 맞춤 추천을 위해
          </h2>
          <h2 className="text-2xl font-bold text-slate-800">
            신체 정보를 입력해 주세요
          </h2>
        </div>

        <div className="flex flex-col gap-8 mt-4">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-600">생년월일</label>
            <input
              type="date"
              value={data.birth_date}
              onChange={(e) => updateData({ birth_date: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[16px] text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-600">
                키 (cm)
              </label>
              <input
                type="number"
                value={data.height}
                onChange={(e) =>
                  updateData({ height: Number(e.target.value) || "" })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[16px] text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all text-center"
                placeholder="170"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-600">
                몸무게 (kg)
              </label>
              <input
                type="number"
                value={data.weight}
                onChange={(e) =>
                  updateData({ weight: Number(e.target.value) || "" })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[16px] text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all text-center"
                placeholder="65"
              />
            </div>
          </div>
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
