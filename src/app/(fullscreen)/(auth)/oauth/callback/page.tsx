"use client";

import { useEffect } from "react";

export default function OAuthCallbackPage() {
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
        console.log("OAuth Token Received:", data);
      } catch (error) {
        console.error("OAuth callback error:", error);
      }
    })();
  }, []);

  return <div>OAuth Callback 처리중...</div>;
}
