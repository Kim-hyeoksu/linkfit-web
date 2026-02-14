"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { accessTokenState } from "@/features/auth/model/accessTokenState";
import { useToast } from "@/shared/ui/toast";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAccessToken = useSetAtom(accessTokenState);
  const { showToast } = useToast();

  useEffect(() => {
    const accessToken = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      console.error("Login failed via callback:", error);
      showToast("로그인에 실패했습니다. 다시 시도해 주세요.", "error");
      router.push("/login");
      return;
    }

    if (accessToken) {
      // 1. Session Storage에 저장 (Axios 인터셉터용)
      sessionStorage.setItem("accessToken", accessToken);

      // 2. Refresh Token이 있다면 저장
      if (refreshToken) {
        sessionStorage.setItem("refreshToken", refreshToken);
      }

      // 3. Global State (Jotai) 업데이트
      setAccessToken(accessToken);

      showToast("로그인되었습니다!", "success");

      // 4. 메인 페이지로 이동 (TODO: 원래 페이지로의 리다이렉트 처리 가능)
      router.push("/workout/programs");
    } else {
      // 토큰이 없는 경우
      // showToast("인증 정보가 없습니다.", "error");
      // router.push("/login");
    }
  }, [searchParams, router, setAccessToken, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-main rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}
