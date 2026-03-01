"use client";

import { useSearchParams } from "next/navigation";
import { OnboardingFunnel } from "@/features/onboarding/ui/OnboardingFunnel";

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as "signup" | "edit" | null;

  // 임시 데이터. Edit 모드인 경우 서버에서 기존 정보를 가져와서 넣어주면 됩니다.
  const tempInitialData =
    mode === "edit"
      ? {
          name: "김혁수",
          gender: "MALE" as const,
          birth_date: "1995-05-15",
          height: 180,
          weight: 75,
          exercise_level: "MIDDLE" as const,
        }
      : undefined;

  return (
    <OnboardingFunnel
      mode={mode === "edit" ? "edit" : "signup"}
      initialData={tempInitialData}
    />
  );
}
