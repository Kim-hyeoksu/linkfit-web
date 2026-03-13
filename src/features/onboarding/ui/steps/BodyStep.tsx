import { OnboardingData } from "../../model/types";
import { StepLayout } from "./StepLayout";
import { LottiePlayer } from "@/shared";
interface Props {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export const BodyStep = ({ data, updateData, onNext }: Props) => {
  const isComplete =
    data.height !== "" &&
    Number(data.height) > 0 &&
    data.weight !== "" &&
    Number(data.weight) > 0;

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

        <div className="flex justify-center -mx-5 -my-4">
          <LottiePlayer
            url="https://lottie.host/72e987ff-f167-4f42-a161-e4baf34381b9/TRMEFd5k8O.lottie"
            className="w-full h-auto"
          />
        </div>

        <div className="flex flex-col gap-6 mt-4">
          {/* 키 & 몸무게 (필수) */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-600">
                키 (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={data.height}
                onChange={(e) =>
                  updateData({ height: Number(e.target.value) || "" })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[16px] text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all text-center font-semibold"
                placeholder="170"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-600">
                몸무게 (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={data.weight}
                onChange={(e) =>
                  updateData({ weight: Number(e.target.value) || "" })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[16px] text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all text-center font-semibold"
                placeholder="65"
              />
            </div>
          </div>

          {/* 인바디 상세 (선택) */}
          <div className="mt-2 pt-6 border-t border-slate-100 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                상세 체성분
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-semibold">
                선택
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500 leading-tight">
                  골격근량 (kg)
                </label>
                <input
                  type="number"
                  value={data.skeletalMuscleMass}
                  onChange={(e) =>
                    updateData({
                      skeletalMuscleMass: Number(e.target.value) || "",
                    })
                  }
                  placeholder="0.0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all text-center"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500 leading-tight">
                  체지방률 (%)
                </label>
                <input
                  type="number"
                  value={data.bodyFatPercentage}
                  onChange={(e) =>
                    updateData({
                      bodyFatPercentage: Number(e.target.value) || "",
                    })
                  }
                  placeholder="0.0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-main focus:bg-white transition-all text-center"
                />
              </div>
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
