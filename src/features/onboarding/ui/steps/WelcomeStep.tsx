"use client";

import { AnimatedLottie } from "../AnimatedLottie";
import { StepLayout } from "./StepLayout";

interface Props {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: Props) => {
  return (
    <StepLayout>
      <div className="flex flex-col flex-1 mt-10 items-center text-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
          환영합니다! <br /> <span className="text-main">LINKFIT</span> 입니다.
        </h1>
        <p className="mt-4 text-slate-500 font-medium whitespace-pre-line">
          {"맞춤형 운동 관리를 위해\n몇 가지 기본 정보를 입력해 주세요."}
        </p>

        <div className="flex-1 max-w-[280px] w-full flex items-center justify-center">
          {/* 환영 로티 애니메이션 */}
          <AnimatedLottie
            url="/images/welcome.json"
            className="w-[200px] h-[200px]"
          />
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={onNext}
          className="w-full bg-main text-white py-4 rounded-xl font-bold text-[17px] active:scale-[0.98] transition-all"
        >
          시작하기
        </button>
      </div>
    </StepLayout>
  );
};
