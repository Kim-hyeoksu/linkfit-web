"use client";

import Image from "next/image";
import { LottiePlayer } from "@/shared";
import { StepLayout } from "./StepLayout";

interface Props {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: Props) => {
  return (
    <StepLayout>
      <div className="flex flex-col flex-1 mt-10 items-center text-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight flex flex-col items-center">
          <span>환영합니다!</span>
          <div className="flex items-center">
            <Image
              src="/images/common/linkfit_logo.jpg"
              alt="LINKFIT Logo"
              width={120}
              height={32}
              className="h-20 w-auto object-contain rounded-lg ml-[-20px] mb-[8px]"
            />
            <span>입니다.</span>
          </div>
        </h1>
        <p className="mt-4 text-slate-500 font-medium whitespace-pre-line">
          {"맞춤형 운동 관리를 위해\n몇 가지 기본 정보를 입력해 주세요."}
        </p>

        <div className="flex-1 max-w-[320px] w-full flex items-center justify-center">
          {/* 환영 로티 애니메이션 */}
          <LottiePlayer
            url="https://lottie.host/88b69f3e-67df-44e0-a9b7-4df4fffe9579/OPMJ7IwApK.lottie"
            className="w-[280px] h-[280px]"
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
