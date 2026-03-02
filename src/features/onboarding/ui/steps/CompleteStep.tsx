"use client";

import { AnimatedLottie } from "../AnimatedLottie";
import { StepLayout } from "./StepLayout";

interface Props {
  onNext: () => void;
}

export const CompleteStep = ({ onNext }: Props) => {
  return (
    <StepLayout>
      <div className="flex flex-col flex-1 mt-10 items-center text-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
          완벽하게 <br /> 준비되었습니다!
        </h1>
        <p className="mt-4 text-slate-500 font-medium whitespace-pre-line">
          {"입력해주신 정보를 바탕으로\n최적화된 운동 플랜을 제안해 드릴게요."}
        </p>

        <div className="flex-1 max-w-[280px] w-full flex items-center justify-center">
          {/* 완료 로티 애니메이션 */}
          <AnimatedLottie
            url="/images/success.json"
            className="w-[200px] h-[200px]"
          />
        </div>
      </div>

      <div className="mt-auto pt-10">
        <button
          onClick={onNext}
          className="w-full bg-main text-white py-4 rounded-xl font-bold text-[17px] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30"
        >
          링크핏 시작하기
        </button>
      </div>
    </StepLayout>
  );
};
