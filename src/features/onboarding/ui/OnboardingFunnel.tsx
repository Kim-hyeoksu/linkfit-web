"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { OnboardingData } from "../model/types";
import { ProgressBar } from "./ProgressBar";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProfileStep } from "./steps/ProfileStep";
import { BodyStep } from "./steps/BodyStep";
import { ExerciseLevelStep } from "./steps/ExerciseLevelStep";
import { CompleteStep } from "./steps/CompleteStep";
import { Header } from "@/shared/ui";
import { useRouter } from "next/navigation";
import {
  updateMyInfo,
  UpdateUserRequest,
} from "@/entities/user/api/updateMyInfo";
import { useToast } from "@/shared/ui/toast";

interface Props {
  initialData?: Partial<OnboardingData>;
  mode?: "signup" | "edit";
}

export const OnboardingFunnel = ({ initialData, mode = "signup" }: Props) => {
  const router = useRouter();
  const { showToast } = useToast();

  // 전체 스텝: Welcome(0) -> Profile(1) -> Body(2) -> ExerciseLevel(3) -> Complete(4)
  // Edit 모드일 땐 Welcome(0)이랑 Complete(4) 스킵하고 바로 Profile(1)부터 시작해도 좋습니다.
  const [step, setStep] = useState(mode === "edit" ? 1 : 0);
  const totalSteps = mode === "edit" ? 3 : 5; // 보여지는 진행률 계산용

  const [data, setData] = useState<OnboardingData>({
    name: initialData?.name || "",
    gender: initialData?.gender || "",
    birth_date: initialData?.birth_date || "",
    height: initialData?.height || "",
    weight: initialData?.weight || "",
    exercise_level: initialData?.exercise_level || "",
  });

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = async () => {
    // 3단계(ExerciseLevelStep)에서 다음으로 넘어갈 때 API 연동
    if (step === 3) {
      const requestData: UpdateUserRequest = {
        name: data.name,
        gender: data.gender as "MALE" | "FEMALE",
        birthDate: data.birth_date,
        height: Number(data.height),
        weight: Number(data.weight),
        exerciseLevel: data.exercise_level as "LOW" | "MIDDLE" | "HIGH",
      };

      const result = await updateMyInfo(requestData);
      if (result) {
        // 성공 시 4단계로 전환
        setStep(4);
      } else {
        // 실패 시 Toast 띄우기
        showToast("정보 저장에 실패했습니다. 다시 시도해 주세요.", "error");
      }
      return;
    }

    // 마지막 완료 단계 (어떤 모드든 4단계까지 도달하도록 수정)
    if (step === 4) {
      submitData();
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    // 수정 모드에서 첫 단계(ProfileStep)일 때 뒤로가기 누르면 마이페이지로
    if (mode === "edit" && step === 1) {
      router.push("/mypage");
      return;
    }

    if (step > 0) setStep((prev) => prev - 1);
  };

  const submitData = () => {
    // 이미 step 3에서 데이터를 저장했으므로 화면 전환만 수행
    if (mode === "edit") {
      router.push("/mypage"); // 수정 모드면 마이페이지로
    } else {
      router.replace("/workout/programs"); // 가입 직후면 메인 피드로
    }
  };

  // 진행률 (Welcome과 Complete는 제외하고 중간 1,2,3 단계에서만 프로그레스바 증가)
  const currentProgress = mode === "edit" ? step : step;

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden relative">
      {/* 헤더 부분 */}
      <Header
        title={mode === "edit" ? "내 정보 수정" : "기본 정보 입력"}
        showBackButton={step > 0 && step < 4} // 첫 화면과 완료 화면에선 뒤로가기 숨김
        onBackClick={prevStep}
        className="bg-transparent border-none shadow-none"
      />

      {/* 진행 상태 바 (Welcome과 Complete 스텝에서는 숨김) */}
      {step > 0 && step < 4 && (
        <div className="absolute top-[64px] left-0 right-0 z-10 px-5">
          <ProgressBar currentStep={currentProgress} totalSteps={3} />
        </div>
      )}

      {/* 페이징 컨테이너 */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 0 && <WelcomeStep key="welcome" onNext={nextStep} />}
          {step === 1 && (
            <ProfileStep
              key="profile"
              data={data}
              updateData={updateData}
              onNext={nextStep}
            />
          )}
          {step === 2 && (
            <BodyStep
              key="body"
              data={data}
              updateData={updateData}
              onNext={nextStep}
            />
          )}
          {step === 3 && (
            <ExerciseLevelStep
              key="exercise"
              data={data}
              updateData={updateData}
              onNext={nextStep}
            />
          )}
          {step === 4 && (
            <CompleteStep key="complete" onNext={nextStep} mode={mode} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
