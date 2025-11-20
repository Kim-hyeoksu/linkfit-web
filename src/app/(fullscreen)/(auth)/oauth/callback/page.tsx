"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { accessTokenState } from "@/features/auth";
import { getOauthToken } from "@/features/auth";
export default function OAuthCallbackPage() {
  const router = useRouter();
  const setAccessToken = useSetRecoilState(accessTokenState);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) return;

    const fetchToken = async () => {
      try {
        const data = await getOauthToken(code); // API 호출
        setAccessToken(data.accessToken); // Recoil 상태에 accessToken 저장
        // 토큰 요청 후 다른 페이지로 리다이렉트
        router.push("/");
      } catch (error) {
        console.error("Failed to fetch access token:", error);
        // 에러 페이지로 리다이렉트할 수 있음
      }
    };

    fetchToken();
  }, [router, setAccessToken]);

  return <div>OAuth Callback 처리중...</div>;
}
