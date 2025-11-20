"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { accessTokenState } from "@/features/auth";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const setAccessToken = useSetRecoilState(accessTokenState);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) return;

    // fetch로 OAuth token 교환 요청
    (async () => {
      try {
        const res = await fetch("/api/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`OAuth Token Error: ${res.status}`);
        }

        const data = await res.json();
        setAccessToken(data.accessToken);
        router.replace("/"); // 토큰 교환 후 메인 페이지로 리다이렉트
      } catch (error) {
        console.error("OAuth callback error:", error);
      }
    })();
  }, []);

  return <div>OAuth Callback 처리중...</div>;
}
