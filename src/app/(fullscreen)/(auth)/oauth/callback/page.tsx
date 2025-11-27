"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOauthToken } from "@/features/auth";
export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) return;

    const fetchToken = async () => {
      try {
        const data = await getOauthToken(code); // API 호출
        sessionStorage.setItem("accessToken", data.accessToken);
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "OAuthSuccess",
            accessToken: "FAKE_ACCESS_TOKEN_123",
          })
        );
        // 토큰 요청 후 다른 페이지로 리다이렉트
        router.replace("/diet");
        // router.replace("/workout/programs");
      } catch (error) {
        console.error("Failed to fetch access token:", error);
        // 에러 페이지로 리다이렉트할 수 있음
      }
    };

    fetchToken();
  }, [router]);

  return <div>OAuth Callback 처리중...</div>;
}
