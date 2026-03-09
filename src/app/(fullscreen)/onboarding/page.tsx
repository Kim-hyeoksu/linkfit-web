"use client";

import { useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { OnboardingFunnel } from "@/features/onboarding/ui/OnboardingFunnel";
import { userState } from "@/entities/user/model/userState";

import { Suspense } from "react";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const user = useAtomValue(userState);
  const mode = searchParams.get("mode") as "signup" | "edit" | null;

  // Edit 모드인 경우 서버에서 가져온 사용자 정보를 맵핑합니다.
  const initialData =
    mode === "edit" && user
      ? {
          name: user.name,
          gender: user.gender,
          birth_date: user.birthDate,
          exercise_level: user.exerciseLevel,
          profileImage: user.profileImage,
        }
      : undefined;

  // 수정 모드일 때 유저 정보가 아직 로딩되지 않았다면 로딩 스피너 등을 보여줄 수 있습니다.
  if (mode === "edit" && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <OnboardingFunnel
      mode={mode === "edit" ? "edit" : "signup"}
      initialData={initialData}
    />
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingContent />
    </Suspense>
  );
}
